import * as functions from "firebase-functions/v1";
import * as satellite from "satellite.js";

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
const DEFAULT_NORAD = 68377; // SUPERVIEW NEO-2 OBJECT A (same SSO)
const DEFAULT_SAT_NAME = "ORBITAL_TEMPLE_STANDIN";

// Observer default: Edson's home in São Paulo — República, near Galeria
// Metrópole / Av. São Luís. 23°32'45"S, 46°38'30"W. Clients may override via
// ?lat=&lon=.
const DEFAULT_LAT = -23.5458;
const DEFAULT_LON = -46.6417;

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

async function fetchTLE(norad: number): Promise<{lines: [string, string]; source: string; name: string}> {
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

function startOfNextUTCDay(now: Date): Date {
  const d = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1,
    0, 0, 0, 0,
  ));
  return d;
}

function generateSchedule(
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
