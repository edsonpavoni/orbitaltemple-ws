# show.py patch: the launch-day email on DEPLOYED (NOT APPLIED)

**One line, in `do_deploy`, on the first-press path only.** SEARCH is not hooked. File:
`artworks/first-witness-series/code/firmware-v1.0/tools/show.py` (branch `show-deploy-sync`).
Apply only **after** the current protected run ends. It needs a restart of `show.py serve` to load.

```diff
@@ def do_deploy(who, background=True):
     cmd = f"deploy {press} {arrive}"
     event_log(f"DEPLOY pressed by {who}: {cmd} → {','.join(st['pieces'])}")
     actions_log(f"{' '.join(st['pieces'])} · DEPLOYED pressed ({who}) → `{cmd}` · D5b · show.py")
     run(blast, st["pieces"], cmd, background=background)
+    threading.Thread(target=subprocess.Popen, args=([sys.executable, "/Users/edsonpavoni/projects/orbitaltemple-ws/email-outreach/launch-mail/notify.py", "in-space", "--who", who, "--press-ms", str(press)],), kwargs=dict(stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)).start()   # launch-day email: once ever, real only if ARMED
     return True
```

## Why it is shaped like this

- **Never blocks, never raises into show.py.** `Popen` runs in its own thread, so even an exception
  (missing file, fork failure) stays in that thread. `notify.py` then starts `node send.cjs`
  detached in its own session and exits in milliseconds. Measured: the hook returns in 0.1 ms.
- **Non-daemon thread on purpose.** The Terminal fallback (`tools/show.py deploy`) exits right after
  its 5-second blast. A daemon thread could be killed before `Popen` runs; a non-daemon one can't.
- **First press only.** The early `return False` branch (the re-press within 60 s) never reaches the
  line. A later re-press ("PRESS NOT ACKNOWLEDGED — press DEPLOYED again") does reach it, and is a
  no-op: the sender holds a lock while running and a done marker after. It sends **at most once ever**.
- **`press` is passed**, so the "today, <date>, at <time>" in every email is the moment Gabi pressed,
  not the moment each batch left.
- **Only `ARMED` sends.** Unarmed, or outside the ARMED time window, a press is a dry-run that only
  writes a log. So rehearsal presses before the window are safe, and so are presses on any day
  that isn't the armed date.
- Everything `show.py` needs (`threading`, `subprocess`, `sys`) is already imported.

## ⚠️ Once ARMED, ANY show.py instance's DEPLOYED press inside the window sends

That includes a test page run with `--pieces ow04 --state …`, and the Terminal `tools/show.py deploy`.
On Thursday, don't press DEPLOYED for a rehearsal after ARMing. If you must rehearse, disarm first:
`python3 /Users/edsonpavoni/projects/orbitaltemple-ws/email-outreach/launch-mail/notify.py disarm`

## Check after applying (before Thursday, unarmed)

```
python3 /Users/edsonpavoni/projects/orbitaltemple-ws/email-outreach/launch-mail/notify.py status
```
Then press DEPLOYED on a test page. A new `state/logs/in-space-*.log` must appear, saying
`DRY-RUN (not armed)` with the counts.
