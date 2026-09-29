#!/usr/bin/env python3
"""test_hook.py — fire notify.py EXACTLY the way the patched show.py does, then exit at once.

    python3 test_hook.py            the real hook line ("in-space"): unarmed → a dry-run over the real list
    python3 test_hook.py test       same line shape, "test" instead: en + pt + br to edsonpavoni@gmail.com only

Check the result in state/logs/ (newest file). The harness must print its exit time in a few ms.
"""
import subprocess, sys, threading, time

t0 = time.time()
who, press = "test_hook.py", int(time.time() * 1000)
if sys.argv[1:] == ["test"]:
    threading.Thread(target=subprocess.Popen, args=([sys.executable, "/Users/edsonpavoni/projects/orbitaltemple-ws/email-outreach/launch-mail/notify.py", "test", "--press-ms", str(press)],), kwargs=dict(stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)).start()
else:
    # ↓ the exact line from SHOW_PY_PATCH.md
    threading.Thread(target=subprocess.Popen, args=([sys.executable, "/Users/edsonpavoni/projects/orbitaltemple-ws/email-outreach/launch-mail/notify.py", "in-space", "--who", who, "--press-ms", str(press)],), kwargs=dict(stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)).start()   # launch-day email: once ever, real only if ARMED
print(f"hook returned in {(time.time() - t0) * 1000:.1f} ms; harness exiting now")
