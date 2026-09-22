# Archived pages — not built, not published

Astro only builds what is under `src/pages/`, so anything here is out of the
site entirely. Kept because it is worth something later, not because it works.

---

## `witness-tracker.astro` — 🟢 A WORKING TOOL, NOT A DEAD PAGE

**Archived 2026-09-22.** Edson: *"the witness tracker we might use. Hold it somewhere for later."* and then, importantly:

> **"I use this to make the OW video. And I think we can use it a bit for the user interface at some point."**

**So this is a production asset.** Footage from it is in the Orbital Witnesses video. It is archived only to keep it off the public site — it is not abandoned code and should not be treated as such by anyone tidying up later.

624 lines of three.js: a white Earth sphere with latitude grid and equator, an observer at Brooklyn, and a satellite propagated live with `satellite.js`. It was **untracked** until 2026-09-22 — it existed on one disk and nowhere else.

### Running it

Astro does not build `archive/`, so:

```bash
cp archive/pages/witness-tracker.astro src/pages/     # temporarily
pnpm dev                                              # localhost:4321/witness-tracker
# record, then remove it from src/pages/ again
```

⚠️ **If the recording workflow used the LIVE url** (`orbitaltemple.art/witness-tracker`), that stopped working on 2026-09-22 — **say so and it goes straight back.** The point was to remove a dead page, not a working one.

### 🔴 It can be better than it was

Its orbit is a hardcoded stand-in:

```js
// TLE: FLOCK 4BE-27 (~530km SSO, 97.4° — proxy for Orbital Temple)
```

That proxy exists because **there was no service to ask** when it was written. There is now:

```js
// follow exactly what the twelve sculptures follow, mission TLE included
const {tle} = await (await fetch("https://orbitaltemple.art/v1/orbit/tle")).json();
// or ask for the answer outright:
// /v1/orbit/position?lat=40.6799&lon=-74.0028  -> az, el, range, ground track
```

**For the next video, the footage would show the real orbit** — and on launch night, the actual temple rather than a proxy. Docs: <https://orbitaltemple.art/api/>

### Two futures

| | |
|---|---|
| 🎬 **Video** | What it already does. One fetch makes the orbit real. |
| 🖥️ **Interface** | Edson's own note. It is also the nearest thing that exists to `LAUNCH-16-DAYS` deliverable **#6, "projection / visual piece built — the thing he regretted not polishing."** A 3D Earth carrying the temple's live orbit, projected, is a real candidate for Oct 1 — though **not** a thing to start from scratch nine days out. |

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
