# Removal ledger

Things deleted from this repo, and why — so nobody rebuilds them by accident.
Everything here is recoverable from git history; the commit is named in each row.

---

## 2026-09-22 — the sculpture-control generation

Three separate attempts to control the Witnesses from the web. **None of them
ever worked**, because the flight firmware has never read a database. It is
commanded over **UDP on the local network** via `tools/tele.py` in the firmware
repo, by design — the sculptures sit on a venue LAN, not the internet.

| Removed | What it was | Commit |
|---|---|---|
| `src/pages/witnesses.astro` + `[lang]/` | Control panel for **three** sculptures (there are twelve), reporting Speed in RPM (the firmware does not report that) with a "Trigger Satellite Pass" button (no such concept — the cycle is continuous and NTP-anchored). Witness-001 was frozen at `SEARCHING, 200.0 RPM, last seen 6:39:31 AM`; the other two never reported at all. | `b0e7ab7` |
| `witnessStatus` · `witnessCommand` · `witnessReport` | The Cloud Functions behind it. Wrote commands into a Firestore document nothing read. Only the **archived legacy firmware** ever called them. Deleted from the project, not just the source. | `b0e7ab7` |
| `public/sculpture-control.html` | The same idea one generation earlier, on the **Realtime Database** (`/sculpture/status`, `/sculpture/commands`, `/sculpture/esp32/ip`). | `830a937` |
| `src/pages/witness-tracker.astro` | A 624-line three.js 3D Earth with a live orbit. **Not a control panel** — a visualiser, used to make footage for the Orbital Witnesses video. Deleted once that footage was captured. | `110c7ea`, deleted after |
| `/sculpture-control` and `/satellite` rewrites | The first pointed at the deleted page. The second pointed at a `satellite.html` that **never existed** — it had been 404ing while `/satellite/` served the real page by directory index. Dead config that looked meaningful. | `830a937` |

### If a 3D orbit visual is ever wanted again

`witness-tracker.astro` is in history (`git show 830a937:archive/pages/witness-tracker.astro`).
**Do not restore it as-is.** Its orbit was a hardcoded proxy TLE
(`FLOCK 4BE-27`) because there was no service to ask when it was written.
There is now — one call to `/v1/orbit/tle` or `/v1/orbit/position` follows
exactly what the twelve sculptures follow, mission TLE included.
Docs: <https://orbitaltemple.art/api/>

### ⚠️ Orphaned DATA, deliberately still there

Deleting data is irreversible, so it waits for an explicit decision:

- **Firestore** `witnesses` collection — `sculptures`, `command`, `log` documents.
- **Realtime Database** `/sculpture/*` nodes.

Both are read by nothing and written by nothing. They cost nothing to keep.
