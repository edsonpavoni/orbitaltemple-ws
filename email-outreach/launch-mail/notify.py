#!/usr/bin/env python3
"""notify.py — launch-day email hook (stdlib only). show.py calls it on the FIRST DEPLOYED press.

    python3 notify.py in-space [--who X] [--press-ms MS]   start the send in the background, return at once
    python3 notify.py test                                  en + pt + br to edsonpavoni@gmail.com only (background)
    python3 notify.py arm | disarm | status | dry-run       foreground, prints the result

Everything real happens in send.cjs (node). This file only finds node, detaches it into its own
session with output to state/logs/, and returns in milliseconds. It never raises: any failure is
written to state/logs/notify.log. A send is real only if ARMED exists and the time is inside its
window; otherwise send.cjs does a dry-run. Sending happens at most once (ledger + done marker).
"""
import glob, os, subprocess, sys, time

HERE = os.path.dirname(os.path.realpath(__file__))
LOGS = os.path.join(HERE, "state", "logs")
SENDER = os.path.join(HERE, "send.cjs")


def node():
    for p in os.environ.get("PATH", "").split(os.pathsep):
        c = os.path.join(p, "node")
        if os.access(c, os.X_OK): return c
    for c in sorted(glob.glob(os.path.expanduser("~/.nvm/versions/node/*/bin/node")), reverse=True) + \
             ["/opt/homebrew/bin/node", "/usr/local/bin/node"]:
        if os.access(c, os.X_OK): return c
    raise FileNotFoundError("node not found")


def note(text):
    try:
        os.makedirs(LOGS, exist_ok=True)
        with open(os.path.join(LOGS, "notify.log"), "a") as f:
            f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} {text}\n")
    except OSError:
        pass


def background(args, tag):
    """Start send.cjs detached; return immediately."""
    try:
        os.makedirs(LOGS, exist_ok=True)
        logf = os.path.join(LOGS, f"{tag}-{time.strftime('%Y%m%d-%H%M%S')}.log")
        out = open(logf, "a")
        p = subprocess.Popen([node(), SENDER] + args, cwd=HERE, stdin=subprocess.DEVNULL, stdout=out,
                             stderr=subprocess.STDOUT, start_new_session=True, close_fds=True)
        out.close()
        note(f"started {tag} pid={p.pid} args={args} → {logf}")
        return logf
    except Exception as e:   # never let a failure reach show.py
        note(f"FAILED to start {tag}: {e!r}")
        return None


def main(argv):
    if not argv:
        print(__doc__); return 1
    cmd, rest = argv[0], argv[1:]
    if cmd == "in-space":
        logf = background(["send"] + rest, "in-space")
        print(f"launch mail started in the background → {logf}" if logf else "launch mail FAILED to start (see state/logs/notify.log)")
        return 0
    if cmd == "test":
        logf = background(["test"] + rest, "test")
        print(f"test started in the background → {logf}")
        return 0
    if cmd in ("arm", "disarm", "status", "dry-run", "lint"):
        return subprocess.call([node(), SENDER, cmd] + rest, cwd=HERE)
    print(__doc__); return 1


if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv[1:]))
    except Exception as e:
        note(f"notify.py error: {e!r}")
        sys.exit(0)
