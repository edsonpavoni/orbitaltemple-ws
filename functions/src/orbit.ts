import * as functions from "firebase-functions/v1";
import * as satellite from "satellite.js";

import {
  DEFAULT_LAT,
  DEFAULT_LON,
  DEFAULT_NORAD,
  fetchTLE,
  generateSchedule,
  startOfNextUTCDay,
  tleEpochISO,
} from "./schedule";

// =============================================================================
//  Orbital Temple · Orbit API  (v1)
// =============================================================================
//
//  Edson, 2026-09-22: "we should have an integrated service on OT API.
//  Everything related to the OT should be organized in one place. If the OWs
//  need to use it, it should also be available for the 12 artists."
//
//  THE PRINCIPLE: the sculptures are not a special case. They are the FIRST
//  CLIENT of the artist API. Twelve ESP32s with 320 KB of RAM consuming it is
//  the strongest possible evidence a working artist can build against it.
//  Anything the sculptures need and the artists cannot have is an accident of
//  history, not a design.
//
//  One function, path-routed:
//
//    GET /position?lat&lon        where is it RIGHT NOW (az/el/range, ground
//                                 track, range rate, doppler)
//    GET /passes?lat&lon&hours    when is it overhead, and how high
//    GET /tle                     the element set in use, its epoch and source
//    GET /schedule?lat&lon&hours  the 24 h sample list (same body as
//                                 /api/schedule, which the sculptures use)
//
//  ⚠️ /api/schedule IS NOT TOUCHED. Twelve sculptures fetch it daily and the
//  show is on Oct 1. This module only ADDS.
//
//  Every route resolves its element set through the SAME fetchTLE() the
//  sculptures get, so the mission TLE (admin-injected, outranking Celestrak)
//  applies everywhere at once. An artist and a sculpture can never be looking
//  at different orbits.
//
//  Public read: this is the open sky and a satellite carrying 2,700 names.
//  Writes stay behind the admin key, in missionTle.
// =============================================================================

const C_KM_S = 299792.458;
const DEFAULT_DOWNLINK_HZ = 401.5e6;   // the artist brief's 401.5 MHz downlink
const MAX_PASS_HOURS = 72;

interface Look {
  azDeg: number;
  elDeg: number;
  rangeKm: number;
  subLatDeg: number;
  subLonDeg: number;
  altKm: number;
}

function lookAt(satrec: satellite.SatRec, lat: number, lon: number, when: Date): Look | null {
  const pv = satellite.propagate(satrec, when);
  if (!pv || typeof pv.position === "boolean" || !pv.position) return null;
  const gmst = satellite.gstime(when);
  const ecf = satellite.eciToEcf(pv.position, gmst);
  const observer = {
    latitude: satellite.degreesToRadians(lat),
    longitude: satellite.degreesToRadians(lon),
    height: 0.0,
  };
  const look = satellite.ecfToLookAngles(observer, ecf);
  const geo = satellite.eciToGeodetic(pv.position, gmst);
  return {
    azDeg: satellite.radiansToDegrees(look.azimuth),
    elDeg: satellite.radiansToDegrees(look.elevation),
    rangeKm: look.rangeSat,
    subLatDeg: satellite.degreesLat(geo.latitude),
    subLonDeg: satellite.degreesLong(geo.longitude),
    altKm: geo.height,
  };
}

/**
 * Range rate by finite difference rather than by transforming the velocity
 * vector into the rotating frame. satellite.js's doppler helper has changed
 * shape between versions; one extra propagation has not. 1 s apart is far
 * below any dynamics that matter here.
 */
function rangeRateKmS(satrec: satellite.SatRec, lat: number, lon: number, when: Date): number | null {
  const a = lookAt(satrec, lat, lon, when);
  const b = lookAt(satrec, lat, lon, new Date(when.getTime() + 1000));
  if (!a || !b) return null;
  return b.rangeKm - a.rangeKm;
}

function corsJson(res: functions.Response, maxAgeSec: number) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Cache-Control", `public, max-age=${maxAgeSec}, s-maxage=${maxAgeSec}`);
}

function readObserver(req: functions.https.Request) {
  const lat = parseFloat(String(req.query.lat ?? DEFAULT_LAT));
  const lon = parseFloat(String(req.query.lon ?? DEFAULT_LON));
  if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return null;
  }
  return {lat, lon};
}

export const orbit = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    corsJson(res, 0);
    res.status(204).send("");
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  // Works behind a hosting rewrite (/v1/orbit/passes) and on the bare
  // Functions URL (…/orbit/passes) alike.
  const route = (req.path || "/").replace(/^\/+|\/+$/g, "").split("/").pop() || "";
  const norad = parseInt(String(req.query.norad ?? DEFAULT_NORAD));

  try {
    // ---- /tle : what orbit is everything on, and how fresh is it? ---------
    if (route === "tle") {
      const t = await fetchTLE(norad);
      corsJson(res, 300);
      res.status(200).json({
        schema: "orbital-temple/orbit.tle/1",
        name: t.name,
        norad,
        tle: t.lines,
        tle_source: t.source,           // "mission" | "celestrak" | "fallback"
        tle_epoch_utc: tleEpochISO(t.lines[0]),
        generated_at_utc: new Date().toISOString(),
      });
      return;
    }

    const obs = readObserver(req);
    if (!obs) {
      res.status(400).json({error: "invalid lat/lon"});
      return;
    }

    // ---- /position : where is it right now? ------------------------------
    if (route === "position") {
      const t = await fetchTLE(norad);
      const satrec = satellite.twoline2satrec(t.lines[0], t.lines[1]);
      const now = new Date();
      const look = lookAt(satrec, obs.lat, obs.lon, now);
      if (!look) {
        res.status(500).json({error: "propagation failed for this epoch"});
        return;
      }
      const rr = rangeRateKmS(satrec, obs.lat, obs.lon, now);
      const freq = parseFloat(String(req.query.freq_hz ?? DEFAULT_DOWNLINK_HZ));
      corsJson(res, 1);
      res.status(200).json({
        schema: "orbital-temple/orbit.position/1",
        utc: now.toISOString(),
        observer: {lat: obs.lat, lon: obs.lon},
        satellite: {name: t.name, norad, tle_source: t.source,
          tle_epoch_utc: tleEpochISO(t.lines[0])},
        look: {
          az: round(look.azDeg, 3),
          el: round(look.elDeg, 3),
          range_km: round(look.rangeKm, 3),
          above_horizon: look.elDeg > 0,
        },
        ground_track: {
          lat: round(look.subLatDeg, 5),
          lon: round(look.subLonDeg, 5),
          alt_km: round(look.altKm, 3),
        },
        // Negative range rate = approaching. The downlink shift an artist's
        // receiver would have to chase.
        range_rate_km_s: rr === null ? null : round(rr, 5),
        doppler_hz: rr === null ? null : round(-(rr / C_KM_S) * freq, 2),
        doppler_for_freq_hz: freq,
      });
      return;
    }

    // ---- /passes : when is it overhead? ----------------------------------
    if (route === "passes") {
      const hours = Math.min(MAX_PASS_HOURS,
        Math.max(1, parseInt(String(req.query.hours ?? 24))));
      const minEl = Math.max(0, parseFloat(String(req.query.min_el ?? 10)));
      const stepSec = 10;
      const t = await fetchTLE(norad);
      const satrec = satellite.twoline2satrec(t.lines[0], t.lines[1]);
      const start = Date.now();

      const passes: Array<Record<string, unknown>> = [];
      let cur: {rise: number; riseAz: number; maxEl: number; maxAt: number} | null = null;

      for (let s = 0; s <= hours * 3600; s += stepSec) {
        const when = new Date(start + s * 1000);
        const look = lookAt(satrec, obs.lat, obs.lon, when);
        if (!look) continue;
        if (look.elDeg >= minEl) {
          if (!cur) {
            cur = {rise: when.getTime(), riseAz: look.azDeg, maxEl: look.elDeg,
              maxAt: when.getTime()};
          } else if (look.elDeg > cur.maxEl) {
            cur.maxEl = look.elDeg;
            cur.maxAt = when.getTime();
          }
        } else if (cur) {
          passes.push({
            rise_utc: new Date(cur.rise).toISOString(),
            rise_az: round(cur.riseAz, 1),
            max_utc: new Date(cur.maxAt).toISOString(),
            max_el: round(cur.maxEl, 2),
            set_utc: when.toISOString(),
            set_az: round(look.azDeg, 1),
            duration_sec: Math.round((when.getTime() - cur.rise) / 1000),
          });
          cur = null;
        }
      }
      corsJson(res, 300);
      res.status(200).json({
        schema: "orbital-temple/orbit.passes/1",
        generated_at_utc: new Date().toISOString(),
        observer: {lat: obs.lat, lon: obs.lon},
        satellite: {name: t.name, norad, tle_source: t.source,
          tle_epoch_utc: tleEpochISO(t.lines[0])},
        window_hours: hours,
        min_elevation_deg: minEl,
        step_sec: stepSec,
        passes_count: passes.length,
        passes,
      });
      return;
    }

    // ---- /schedule : the same body the sculptures fetch -------------------
    if (route === "schedule") {
      const hours = Math.min(48, Math.max(1, parseInt(String(req.query.hours ?? 24))));
      const t = await fetchTLE(norad);
      const now = new Date();
      const validFrom = startOfNextUTCDay(new Date(now.getTime() - 24 * 3600 * 1000));
      const samples = generateSchedule(t.lines, obs.lat, obs.lon, validFrom, hours, 60);
      corsJson(res, 3600);
      res.status(200).json({
        schema: "witness-schedule/1",
        generated_at_utc: now.toISOString(),
        valid_from_utc: validFrom.toISOString(),
        valid_until_utc: new Date(validFrom.getTime() + hours * 3600 * 1000).toISOString(),
        observer: {lat: obs.lat, lon: obs.lon},
        satellite: {
          name: t.name, norad, tle: t.lines, tle_source: t.source,
          tle_epoch_utc: tleEpochISO(t.lines[0]),
        },
        samples_interval_sec: 60,
        samples_count: samples.length,
        samples,
      });
      return;
    }

    corsJson(res, 300);
    res.status(404).json({
      error: "unknown route",
      schema: "orbital-temple/orbit/1",
      routes: {
        "/position": "az, el, range, ground track, range rate and doppler right now",
        "/passes": "upcoming passes over an observer (hours, min_el)",
        "/tle": "the element set in use, its source and epoch",
        "/schedule": "24 h of 1-minute az/el samples (what the sculptures play)",
      },
      params: "lat, lon (default Sao Paulo), hours, min_el, norad, freq_hz",
      note: "Same element set as the sculptures: an admin-set mission TLE " +
            "outranks Celestrak, so every client sees one orbit.",
    });
  } catch (err) {
    functions.logger.error("orbit API error", {route, err: String(err)});
    res.status(500).json({error: "internal error", route});
  }
});

function round(v: number, places: number): number {
  const m = Math.pow(10, places);
  return Math.round(v * m) / m;
}
