import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as satellite from "satellite.js";
import {requireAdmin, validateTleLine} from "./adminAuth";

// =============================================================================
//  Orbital Temple · Schedule API
// =============================================================================
//
//  GET /api/schedule?lat=40.7128&lon=-74.006&hours=24
//
//  Returns a 24-hour motion schedule for the Orbital Temple satellite (or the
//  current stand-in) as seen from an observer on the ground. Every Witness
//  sculpture and every companion app fetches this once a day and plays it
//  locally against NTP time. No polling, no network chatter during playback.
//
//  Single source of truth for every client.
// =============================================================================

// Current stand-in for Orbital Temple. When Orbital Temple itself launches
// (Transporter-17, June 2026), swap this constant for the real NORAD catalog
// number. Clients will pick up the change on their next daily fetch.
export const DEFAULT_NORAD = 68377; // SUPERVIEW NEO-2 OBJECT A (same SSO)
const DEFAULT_SAT_NAME = "ORBITAL_TEMPLE_STANDIN";

// Observer default: Edson's home in São Paulo — República, near Galeria
// Metrópole / Av. São Luís. 23°32'45"S, 46°38'30"W. Clients may override via
// ?lat=&lon=.
export const DEFAULT_LAT = -23.5458;
export const DEFAULT_LON = -46.6417;

// 24 hours at 1-minute resolution = 1440 samples ≈ 30 KB JSON.
// Clients cubic-spline between minutes for smooth motion.
const DEFAULT_HOURS = 24;
const SAMPLE_INTERVAL_SEC = 60;

// Hard-coded fallback TLE. Used if Celestrak is unreachable so the function
// never fails entirely.
const FALLBACK_TLE: [string, string] = [
  "1 68377U 26000A   26103.50000000  .00002180  00000-0  10270-3 0  9991",
  "2 68377  97.4400  20.0000 0001500  90.0000 270.0000 15.19000000 00009",
];

// ---------------------------------------------------------------------------
//  MISSION TLE
//
//  Orbital Temple / OSSIE has no NORAD catalogue number until it is in orbit
//  and tracked, so the Celestrak path below STRUCTURALLY CANNOT serve the
//  launch. The mission TLE is the override: an admin pastes the predicted or
//  provisional element set, every client picks it up on its next fetch, and a
//  launch-day revision is a paste rather than a deploy.
//
//  It is the same element set that ships compiled into the sculptures
//  (firmware src/DefaultTle.h). `tle_source` tells clients which path served
//  them, and the sculptures' `report` compares the id of the TLE they hold
//  against the id of the schedule they cached.
// ---------------------------------------------------------------------------
const MISSION_TLE_DOC = "config/missionTle";

interface MissionTleDoc {
  line1: string;
  line2: string;
  name?: string;
  enabled?: boolean;
  updated_at?: string;
  note?: string;
}

async function readMissionTle(): Promise<MissionTleDoc | null> {
  try {
    const snap = await admin.firestore().doc(MISSION_TLE_DOC).get();
    if (!snap.exists) return null;
    const d = snap.data() as MissionTleDoc;
    if (!d || d.enabled === false) return null;
    // Re-validate on read. A hand-edited Firestore document must never reach
    // the propagator, and a bad element set here would reach all twelve.
    if (validateTleLine(d.line1, 1) || validateTleLine(d.line2, 2)) {
      functions.logger.error("Mission TLE in Firestore is invalid; ignoring it");
      return null;
    }
    return d;
  } catch (err) {
    functions.logger.error("Mission TLE read failed", {err: String(err)});
    return null;
  }
}

/** Epoch of a TLE line 1 as an ISO string. Cols 19-20 year, 21-32 day-of-year. */
export function tleEpochISO(line1: string): string | null {
  if (!line1 || line1.length < 32) return null;
  const yy = parseInt(line1.substring(18, 20), 10);
  const doy = parseFloat(line1.substring(20, 32));
  if (!isFinite(yy) || !isFinite(doy)) return null;
  const year = yy < 57 ? 2000 + yy : 1900 + yy;
  const ms = Date.UTC(year, 0, 1) + (doy - 1) * 86400000;
  return new Date(ms).toISOString();
}

export async function fetchTLE(norad: number): Promise<{lines: [string, string]; source: string; name: string}> {
  // Precedence: mission TLE > Celestrak > hardcoded fallback.
  const mission = await readMissionTle();
  if (mission) {
    return {
      lines: [mission.line1, mission.line2],
      source: "mission",
      name: mission.name || "ORBITAL_TEMPLE",
    };
  }

  const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${norad}&FORMAT=tle`;
  try {
    const res = await fetch(url, {signal: AbortSignal.timeout(8000)});
    if (!res.ok) throw new Error(`celestrak ${res.status}`);
    const text = await res.text();
    const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      return {
        lines: [lines[1], lines[2]],
        source: "celestrak",
        name: lines[0],
      };
    }
    throw new Error("invalid TLE response");
  } catch (err) {
    functions.logger.warn("TLE fetch failed, using fallback", {err: String(err)});
    return {lines: FALLBACK_TLE, source: "fallback", name: DEFAULT_SAT_NAME};
  }
}

export function startOfNextUTCDay(now: Date): Date {
  const d = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1,
    0, 0, 0, 0,
  ));
  return d;
}

export function generateSchedule(
  tle: [string, string],
  observerLatDeg: number,
  observerLonDeg: number,
  startUtc: Date,
  hours: number,
  intervalSec: number,
): Array<{t: number; az: number; el: number}> {
  const satrec = satellite.twoline2satrec(tle[0], tle[1]);
  const observer = {
    latitude: satellite.degreesToRadians(observerLatDeg),
    longitude: satellite.degreesToRadians(observerLonDeg),
    height: 0.0,
  };

  const totalSeconds = hours * 3600;
  const out: Array<{t: number; az: number; el: number}> = [];

  for (let t = 0; t < totalSeconds; t += intervalSec) {
    const when = new Date(startUtc.getTime() + t * 1000);
    const pv = satellite.propagate(satrec, when);
    if (!pv.position || typeof pv.position === "boolean") {
      out.push({t, az: 0, el: 0});
      continue;
    }
    const gmst = satellite.gstime(when);
    const ecf = satellite.eciToEcf(pv.position, gmst);
    const look = satellite.ecfToLookAngles(observer, ecf);
    const azDeg = (look.azimuth * 180 / Math.PI + 360) % 360;
    const elDeg = look.elevation * 180 / Math.PI;
    out.push({
      t,
      az: Math.round(azDeg * 100) / 100,
      el: Math.round(elDeg * 100) / 100,
    });
  }
  return out;
}

// -----------------------------------------------------------------------------
//  HTTP handler
// -----------------------------------------------------------------------------
export const schedule = functions
  .region("us-central1")
  .runWith({memory: "256MB", timeoutSeconds: 30})
  .https.onRequest(async (req, res) => {
    // CORS — Witnesses and browsers both hit this cross-origin.
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const lat = parseFloat(String(req.query.lat ?? DEFAULT_LAT));
    const lon = parseFloat(String(req.query.lon ?? DEFAULT_LON));
    const hours = Math.min(48, Math.max(1, parseInt(String(req.query.hours ?? DEFAULT_HOURS))));
    const norad = parseInt(String(req.query.norad ?? DEFAULT_NORAD));

    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      res.status(400).json({error: "invalid lat/lon"});
      return;
    }

    const tleInfo = await fetchTLE(norad);
    const now = new Date();
    const validFrom = startOfNextUTCDay(new Date(now.getTime() - 24 * 3600 * 1000));
    // validFrom = most recent 00:00 UTC (either today or yesterday's rollover).
    // Explanation: startOfNextUTCDay(now - 24h) gives today's 00:00 UTC.
    const validUntil = new Date(validFrom.getTime() + hours * 3600 * 1000);

    const samples = generateSchedule(
      tleInfo.lines, lat, lon, validFrom, hours, SAMPLE_INTERVAL_SEC,
    );

    const body = {
      schema: "witness-schedule/1",
      generated_at_utc: now.toISOString(),
      valid_from_utc: validFrom.toISOString(),
      valid_until_utc: validUntil.toISOString(),
      observer: {lat, lon},
      satellite: {
        name: tleInfo.name,
        norad,
        tle: tleInfo.lines,
        tle_source: tleInfo.source,
        // Epoch of the element set actually used, so "is this current?" is a
        // field to read rather than a column to count. The burn-test gate is
        // `tle_source` is celestrak or mission, never fallback, AND this
        // epoch is within a few days of now.
        tle_epoch_utc: tleEpochISO(tleInfo.lines[0]),
      },
      samples_interval_sec: SAMPLE_INTERVAL_SEC,
      samples_count: samples.length,
      samples,
    };

    // Cache for an hour on CDN — clients only fetch once a day anyway, but
    // this protects against accidental hammering.
    res.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).json(body);
  });

// ---------------------------------------------------------------------------
//  GET/POST/DELETE  /api/missionTle    (admin only, x-admin-key)
//
//  The paste-not-deploy path for launch day. POST body:
//      {"line1": "1 ...", "line2": "2 ...", "name": "OSSIE", "note": "from Fede"}
//
//  Both lines are checksum-validated with the SAME rule the sculptures use,
//  so a set the boards would refuse can never be stored here.
//
//  ⚠️  CDN CACHE: /api/schedule is served with s-maxage=3600, so a freshly
//  pasted TLE can take up to an hour to reach a client that asks for the
//  plain URL. The sculptures' `forcefetch` appends a cache-busting parameter
//  for exactly this reason -- after pasting, run `forcefetch` on the fleet
//  rather than waiting.
// ---------------------------------------------------------------------------
export const missionTle = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, x-admin-key");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (!requireAdmin(req, res)) return;

  const ref = admin.firestore().doc(MISSION_TLE_DOC);

  if (req.method === "GET") {
    const snap = await ref.get();
    if (!snap.exists) {
      res.status(200).json({enabled: false, message: "no mission TLE set"});
      return;
    }
    const d = snap.data() as MissionTleDoc;
    res.status(200).json({...d, tle_epoch_utc: tleEpochISO(d.line1)});
    return;
  }

  if (req.method === "DELETE") {
    await ref.set({enabled: false, updated_at: new Date().toISOString()},
      {merge: true});
    functions.logger.info("Mission TLE disabled; falling back to Celestrak");
    res.status(200).json({ok: true, enabled: false});
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  const {line1, line2, name, note} = (req.body || {}) as MissionTleDoc;
  const e1 = validateTleLine(line1, 1);
  const e2 = validateTleLine(line2, 2);
  if (e1 || e2) {
    res.status(400).json({error: "invalid TLE", line1: e1, line2: e2});
    return;
  }
  // Same object on both lines? Columns 3-7 are the catalogue number. Pasting
  // line 2 of a different satellite is the likeliest paste error and it is
  // silent afterwards.
  if (line1.substring(2, 7) !== line2.substring(2, 7)) {
    res.status(400).json({
      error: "line 1 and line 2 are different satellites",
      line1_satnum: line1.substring(2, 7),
      line2_satnum: line2.substring(2, 7),
    });
    return;
  }

  const doc: MissionTleDoc = {
    line1,
    line2,
    name: name || "ORBITAL_TEMPLE",
    note: note || "",
    enabled: true,
    updated_at: new Date().toISOString(),
  };
  await ref.set(doc);
  functions.logger.info("Mission TLE updated", {
    name: doc.name, epoch: tleEpochISO(line1),
  });
  res.status(200).json({ok: true, ...doc, tle_epoch_utc: tleEpochISO(line1)});
});
