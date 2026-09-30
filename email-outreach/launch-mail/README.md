# launch-mail: the DEPLOYED-button email

When Gabi presses **DEPLOYED** on the show page, every name sender gets the site's own "ascended"
message. It goes out **one email per address** (14,101 addresses covering 19,262 names on Sep 30),
dated with the press, through Resend's batch API. An address with one name gets the site's text
as-is; an address with several names gets one email listing them all. It sends **once ever**, and
only if **ARMED**.

`notify.py` is the hook that show.py calls; it never blocks and never raises. `send.cjs` does the
work: it reads Firestore, applies the exclusions, sends in batches, and keeps the ledger. The patch
for show.py is in `SHOW_PY_PATCH.md` and is **not applied**.

## Thursday morning: the one command (ARM)

```
python3 /Users/edsonpavoni/projects/orbitaltemple-ws/email-outreach/launch-mail/notify.py arm
```

This checks that Resend and the domain are reachable, reads the live list, prints the counts and
writes `ARMED` for **today, 14:30–23:59** (New York, the Mac's clock). A DEPLOYED press before 14:30
is only a dry-run.

To use a different window, pass it explicitly: `… notify.py arm --from 14:00 --until 23:59`.

If the launch slips to Friday, run the same command on Friday. The `ARMED` file only works on the
date it was made.

## Other commands (all from anywhere)

| | |
|---|---|
| `python3 …/notify.py status` | Shows whether it is armed, how many addresses have been sent, and whether the send is done |
| `python3 …/notify.py disarm` | Removes ARMED, so a press becomes a dry-run |
| `python3 …/notify.py dry-run` | Shows the real counts and estimate. Sends nothing |
| `python3 …/notify.py test` | Sends en single, en multi, pt single, pt multi, br multi to edsonpavoni@gmail.com only |
| `python3 …/notify.py in-space` | Sends by hand, exactly as the button does, if show.py fails. Also resumes an interrupted send |
| `node send.cjs lint` | Prints the texts and checks they still match `functions/src/index.ts` |

## Safety

- **Once only.**
  - `state/sent-in-space-addresses.txt` lists every address sent, fsynced after each batch.
  - `state/in-space.done.json` marks the send finished.
  - `state/in-space.lock` stops two runs at once. A stale lock from a dead process is taken over and the run resumes.
  - Batches carry an Idempotency-Key, so a retried batch is not re-sent.
- **Resumable.** A re-run skips every id already in the ledger. The date and time in the text stay those of the first press (`state/in-space.press.json`).
- **Failures.**
  - Quota exhaustion (429 `*quota*`): the send stops cleanly and emails a report to Edson.
  - Rate limits: the send waits and retries.
  - Network loss: the send retries for up to 30 minutes, then stops. Resume it with `notify.py in-space`.
- **Logs** go to `state/logs/`, with one file per press and `notify.log` for the hook itself.
- **Nothing in Firestore changes.** The names stay `pending`. Flipping them to `confirmed` would fire `sendConfirmationEmail` again for every name.

## Rehearsal without the real list

`LAUNCH_MAIL_SIM=250 node send.cjs arm --from 00:00` and then `LAUNCH_MAIL_SIM=250 node send.cjs send`
run the whole armed path against fake names at `delivered+…@resend.dev`. They use their own
`state-sim/` folder and their own ARMED file. Delete `state-sim/` afterwards.

`state/`, `state-sim/` and `ARMED` hold emails and are git-ignored.
