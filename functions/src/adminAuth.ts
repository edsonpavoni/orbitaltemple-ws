import * as functions from "firebase-functions/v1";
import * as crypto from "crypto";

/**
 * Shared admin gate for every write-capable endpoint.
 *
 * Extracted from index.ts on 2026-09-22 so the mission-TLE endpoint in
 * schedule.ts can use the SAME check rather than growing a second copy.
 * Two implementations of an auth check is two places for a bug to hide.
 *
 * The key lives in functions/.env (ADMIN_API_KEY), never in client source.
 * Callers send it as the x-admin-key header.
 *
 * Returns true if the caller is authorised. If not, it has already sent 401
 * and the handler must return immediately.
 */
export function requireAdmin(
  req: functions.https.Request,
  res: functions.Response
): boolean {
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    // Fail closed. A missing key must never mean "allow everyone".
    functions.logger.error("ADMIN_API_KEY is not configured; denying request");
    res.status(503).json({error: "Server not configured for admin access"});
    return false;
  }

  const provided = (req.get("x-admin-key") || "").trim();

  // Constant-time compare so response timing can't be used to guess the key.
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    functions.logger.warn("Rejected unauthorised admin request", {
      path: req.path,
      ip: req.headers["x-forwarded-for"] || "unknown",
    });
    res.status(401).json({error: "Unauthorized"});
    return false;
  }
  return true;
}

/**
 * TLE line validation, identical in rule to the firmware's
 * MissionTle::validate() (src/MissionTle.cpp) so a set the boards would
 * reject can never be accepted here. Mod-10 checksum over the first 68
 * columns: digits count as themselves, '-' counts as 1, everything else 0.
 */
export function validateTleLine(line: string, which: 1 | 2): string | null {
  if (typeof line !== "string") return "not a string";
  if (line.length !== 69) return `length ${line.length}, expected 69`;
  if (line[0] !== String(which)) {
    return `starts with '${line[0]}', expected '${which}'`;
  }
  let sum = 0;
  for (let i = 0; i < 68; i++) {
    const c = line[i];
    if (c >= "0" && c <= "9") sum += c.charCodeAt(0) - 48;
    else if (c === "-") sum += 1;
  }
  const want = line[68];
  if (want < "0" || want > "9") return "checksum column is not a digit";
  if (sum % 10 !== Number(want)) {
    return `checksum ${sum % 10}, line says ${want}`;
  }
  return null;
}
