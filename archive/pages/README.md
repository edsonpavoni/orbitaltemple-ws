# Archived pages — not built, not published

Astro only builds what is under `src/pages/`, so anything here is out of the
site entirely. Kept because it is worth something later, not because it works.

---

## `witness-tracker.astro` — 🟡 KEEP. Possibly the Oct 1 projection.

**Archived 2026-09-22** at Edson's request: *"the witness tracker we might use. Hold it somewhere for later."*

624 lines of three.js: a white Earth sphere with latitude grid and equator, an
observer at Brooklyn, and a satellite propagated live with `satellite.js`.
Nothing on the site ever linked to it.

🔴 **Why this might matter more than it looks.** `plans/LAUNCH-16-DAYS-2026-09-15.md`
carries deliverable **#6, "Projection / visual piece built — the thing he
regretted not polishing."** This is a working 3D Earth with a live orbit on it.
It is closer to that deliverable than anything else that exists.

**And it is now much cheaper to finish than when it was written.** Its orbit
comes from a hardcoded proxy TLE:

```js
// TLE: FLOCK 4BE-27 (~530km SSO, 97.4° — proxy for Orbital Temple)
```

That proxy exists because there was no service to ask. **There is now.** Point it
at the real API and it follows whatever the sculptures follow, including the
mission TLE on launch night:

```js
const r = await fetch("https://orbitaltemple.art/v1/orbit/position?lat=40.6799&lon=-74.0028");
// { look:{az,el,range_km}, ground_track:{lat,lon,alt_km}, ... }
// or /v1/orbit/tle to propagate locally with satellite.js, as it already does
```

**To bring it back:** move it to `src/pages/`, swap the proxy TLE for
`/v1/orbit/tle`, rebuild, deploy. Docs: <https://orbitaltemple.art/api/>

---

## Deleted outright, recorded here so nobody re-creates them

| | |
|---|---|
| **`witnesses.astro`** *(deleted 2026-09-22)* | A control panel for three sculptures that reported Speed in RPM and offered "Trigger Satellite Pass". Wrote commands into Firestore no sculpture ever read. Its three Cloud Functions were deleted with it. |
| **`sculpture-control.html`** *(deleted 2026-09-22)* | The same idea one generation earlier, on the **Realtime Database** (`/sculpture/status`, `/sculpture/commands`, `/sculpture/esp32/ip`). Also dead — the flight firmware talks UDP on the LAN via `tools/tele.py`, and has never read either database. |

⚠️ **The Realtime Database still holds the old `/sculpture/*` nodes**, and Firestore
still holds the `witnesses` collection. Both are orphaned data. Deleting data is
irreversible, so it is left alone pending a decision.

**The real control surface is `tools/tele.py` in the firmware repo**, over UDP on
the local network. Nothing web-facing controls the sculptures, by design — they
are on a venue LAN, not the internet.
