#!/usr/bin/env node
/**
 * Launch-day email: the site's own "ascended" message (functions/src/index.ts, EMAIL_TEMPLATES
 * ascendedSubject/ascendedBody), ONE EMAIL PER ADDRESS, dated with the DEPLOYED press.
 * An address with one name gets the site's text as-is; an address with several names gets ONE
 * email listing them all (PLURAL below, same style; Edson's decision Sep 30).
 * Fired by the DEPLOYED button (show.py → notify.py → this file).
 *
 *   node send.cjs lint                 render en/br/pt, check the text still matches index.ts, refuse forbidden words
 *   node send.cjs test                 send en single, en multi, pt single, pt multi, br multi to edsonpavoni@gmail.com ONLY
 *   node send.cjs dry-run              read the real list, count, estimate time, send nothing
 *   node send.cjs arm [--from HH:MM] [--until HH:MM] [--date YYYY-MM-DD]
 *                                      checks + writes ARMED (default: today 14:30–23:59 local)
 *   node send.cjs disarm               removes ARMED
 *   node send.cjs status               ARMED? sent so far? done?
 *   node send.cjs send [--who X] [--press-ms EPOCH_MS]
 *                                      what the button runs. Real send ONLY if ARMED and inside the
 *                                      window; otherwise a dry-run. Once ever: a ledger of sent
 *                                      addresses (resumable) + a done marker + a run lock.
 *
 * List: Firestore `names` (same source as the Sep 14 "Once again" send). Names are grouped by
 * address after the exclusions; identical names on one address are listed once; names are listed
 * in sign-up order (createdAt). Template per address like sendConfirmationEmail:
 * EMAIL_TEMPLATES[language] || en (br → br, pt → pt, missing/other → en). Mixed-language address:
 * the most common language saved on its names (missing counts as en); a tie → pt, then br, then en.
 * Excluded: status=deleted, addresses in the `unsubscribed` collection, addresses failing the
 * site's isValidEmail, and addresses Resend is known to reject (trailing dot, "..", example.com).
 * NOT done: no Firestore writes. Names stay "pending" (flipping them to "confirmed" would fire
 * sendConfirmationEmail again for every name = a double send).
 * Sending: Resend POST /emails/batch, 100 per call, x-batch-validation: permissive,
 * Idempotency-Key per chunk, paced under the account rate limit (10 req/s, shared with the site).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EVENT = 'in-space';
const HERE = __dirname;
// SIMULATION (rehearsal of the whole armed path without touching the real list or state):
// LAUNCH_MAIL_SIM=N → N fake names to Resend's test inbox delivered+N@resend.dev, own state-sim/ dir and ARMED.
const SIM = Number(process.env.LAUNCH_MAIL_SIM || 0);
const STATE = path.join(HERE, SIM ? 'state-sim' : 'state');
const LOGS = path.join(STATE, 'logs');
const ARMED = SIM ? path.join(STATE, 'ARMED') : path.join(HERE, 'ARMED');
const LEDGER = path.join(STATE, `sent-${EVENT}-addresses.txt`); // one email address per line
const FAILED = path.join(STATE, `failed-${EVENT}.txt`);
const DONE = path.join(STATE, `${EVENT}.done.json`);
const LOCK = path.join(STATE, `${EVENT}.lock`);
const PRESS = path.join(STATE, `${EVENT}.press.json`);          // the press time used in the text (kept for resumes)
const SNAPSHOT = path.join(STATE, 'recipients-snapshot.json');
const INDEX_TS = path.join(HERE, '..', '..', 'functions', 'src', 'index.ts');
const SA_KEY = path.join(HERE, '..', '..', 'functions', 'service-account-key.json');
const ENV_FILES = [path.join(HERE, '..', '.env'), path.join(HERE, '..', '..', 'functions', '.env')];

const FROM = 'Orbital Temple <noreply@orbitaltemple.art>';     // as sendConfirmationEmail
const TEST_TO = 'edsonpavoni@gmail.com';
const TEST_NAME = 'Edson Pavoni';
const REPORT_TO = SIM ? 'delivered@resend.dev' : 'edsonpavoni@gmail.com';
const LIST_UNSUBSCRIBE_HEADER = true;   // invisible header pointing at the site's unsubscribe page (the body is exactly the site's)
const BATCH = 100;            // Resend batch maximum
const RATE = 5;               // requests per second (account limit is 10/s, shared with the site's own emails)
const INFLIGHT = 3;           // concurrent batch calls
const NET_WINDOW_MS = 30 * 60 * 1000;   // keep retrying network failures for up to 30 min
const FIRESTORE_TIMEOUT_MS = 45 * 1000;

// Time zone for the "today, <date>, at <time>" line. The Cloud Function runs in UTC; here each
// language gets the reader's likely clock. [Edson to confirm]
const TZ = { en: 'America/New_York', br: 'America/Sao_Paulo', pt: 'America/Sao_Paulo' };

const FORBIDDEN = [/uarx/i, /ossie/i, /\bin orbit\b/i, /\binto orbit\b/i, /deployed into/i, /transmitting/i,
  /\bem órbita\b/i, /transmitindo/i];

fs.mkdirSync(LOGS, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toLocaleString('sv-SE');
const log = (...a) => console.log(`[${stamp()}]`, ...a);
const pad = (n) => String(n).padStart(2, '0');
const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const hhmm = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : dflt; };

// ─── Key ────────────────────────────────────────────────────────────────────
function apiKey() {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
  for (const f of ENV_FILES) {
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, 'utf-8').match(/^RESEND_API_KEY\s*=\s*["']?([^"'\s]+)/m);
    if (m) return m[1];
  }
  throw new Error('RESEND_API_KEY not found (email-outreach/.env or functions/.env)');
}

// ─── Content: copied verbatim from functions/src/index.ts (lint checks it still matches) ──
const EMAIL_TEMPLATES = {
  en: {
    ascendedSubject: (name) => `${name} ascension to the orbital temple in space`,
    ascendedBody: (name, date, time) => `today, ${date}, at ${time} the name ${name} ascended, and there it remains.`,
  },
  br: {
    ascendedSubject: (name) => `${name} ascendeu ao templo orbital no espaço`,
    ascendedBody: (name, date, time) => `hoje, ${date}, às ${time}, o nome ${name} ascendeu, e lá ele permanece.`,
  },
  pt: {
    ascendedSubject: (name) => `${name} ascendeu ao templo orbital no espaço`,
    ascendedBody: (name, date, time) => `hoje, ${date}, às ${time}, o nome ${name} ascendeu, e lá permanece.`,
  },
};
// Several names on one address (NOT in index.ts; the site never sends this). Same voice as above.
const PLURAL = {
  en: {
    subject: (n) => `${n} names ascended to the orbital temple in space`,
    body: (names, date, time) => `today, ${date}, at ${time} these names ascended, and there they remain:\n\n${names.join('\n')}`,
  },
  br: {
    subject: (n) => `${n} nomes ascenderam ao templo orbital no espaço`,
    body: (names, date, time) => `hoje, ${date}, às ${time}, estes nomes ascenderam, e lá eles permanecem:\n\n${names.join('\n')}`,
  },
  pt: {
    subject: (n) => `${n} nomes ascenderam ao templo orbital no espaço`,
    body: (names, date, time) => `hoje, ${date}, às ${time}, estes nomes ascenderam, e lá permanecem:\n\n${names.join('\n')}`,
  },
};
const getEmailTemplate = (language) => EMAIL_TEMPLATES[language] || EMAIL_TEMPLATES.en;
const templateKey = (language) => (EMAIL_TEMPLATES[language] ? language : 'en');
// Date/time exactly as sendConfirmationEmail formats confirmedAt, plus the time zone above.
function formatWhen(pressMs, language) {
  const localeMap = { en: 'en-US', br: 'pt-BR', pt: 'pt-PT' };
  const locale = localeMap[language] || 'en-US';
  const date = new Date(pressMs);
  const timeZone = TZ[templateKey(language)];
  return {
    date: date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone }),
    time: date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: language !== 'br' && language !== 'pt', timeZone }),
  };
}
function unsubUrl(email, language) {   // the Sep "Once again" shape
  return `https://orbitaltemple.art/${language === 'br' || language === 'pt' ? 'pt' : 'en'}/unsubscribe?e=${Buffer.from(email).toString('base64')}`;
}
// rec = { email, language, names: [..] } (one recipient address; names already deduped, one line each)
function message(rec, pressMs) {
  const language = templateKey(rec.language || 'en');
  const { date, time } = formatWhen(pressMs, language);
  const names = rec.names.map((n) => String(n || '').replace(/\s+/g, ' ').trim());
  let subject, text;
  if (names.length === 1) {
    const t = getEmailTemplate(language);
    subject = t.ascendedSubject(names[0]); text = t.ascendedBody(names[0], date, time);
  } else {
    const t = PLURAL[language];
    subject = t.subject(names.length); text = t.body(names, date, time);
  }
  const m = {
    from: FROM,
    to: [rec.email.trim().toLowerCase()],
    subject: subject.replace(/\s+/g, ' ').trim(),   // a newline in a name would break the header
    text,
    tags: [{ name: 'campaign', value: EVENT }],
  };
  if (LIST_UNSUBSCRIBE_HEADER) m.headers = { 'List-Unsubscribe': `<${unsubUrl(m.to[0], language)}>` };
  return m;
}
function lint() {
  const bad = [];
  let src = '';
  try { src = fs.readFileSync(INDEX_TS, 'utf-8'); } catch { bad.push(`cannot read ${INDEX_TS}`); }
  for (const [lang, t] of Object.entries(EMAIL_TEMPLATES)) {
    for (const fn of Object.values(t)) {
      const body = fn.toString().split('=> ')[1];
      if (src && !src.includes(body)) bad.push(`${lang}: template text no longer matches index.ts: ${body}`);
    }
    for (const names of [['X'], ['X', 'Y', 'Z']]) {
      const m = message({ names, email: 'x@y.org', language: lang }, Date.now());
      for (const re of FORBIDDEN) for (const part of [m.subject, m.text]) if (re.test(part)) bad.push(`${lang}: forbidden ${re} in "${part}"`);
    }
  }
  return bad;
}

// ─── Recipients ─────────────────────────────────────────────────────────────
const siteValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || '').trim());   // functions/src isValidEmail
const STRICT_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
const BLOCKED_DOMAINS = /@(example\.(com|org|net)|test\.com)$/i;

function withTimeout(p, ms, what) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what} timed out after ${ms / 1000}s`)), ms))]);
}
async function fetchFirestore() {
  const admin = require('firebase-admin');
  if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(require(SA_KEY)) });
  const db = admin.firestore();
  const t0 = Date.now();
  const [names, unsub] = await withTimeout(Promise.all([db.collection('names').get(), db.collection('unsubscribed').get()]), FIRESTORE_TIMEOUT_MS, 'Firestore');
  const snap = {
    fetched_at: new Date().toISOString(), fetch_ms: Date.now() - t0,
    unsubscribed: unsub.docs.map((d) => String(d.data().email || '').trim().toLowerCase()).filter(Boolean),
    names: names.docs.map((d) => { const x = d.data(); return { id: d.id, name: x.name, email: x.email, language: x.language, status: x.status, created: x.createdAt?.toMillis?.() ?? null }; }),
  };
  fs.writeFileSync(SNAPSHOT, JSON.stringify(snap));
  return snap;
}
async function loadList({ allowSnapshot }) {
  if (SIM) {
    const langs = [undefined, 'en', 'pt', 'br'];
    return { source: `SIMULATION (${SIM} fake names)`, fetch_ms: 0, unsubscribed: [],
      names: Array.from({ length: SIM }, (_, i) => ({ id: `sim${String(i).padStart(6, '0')}`, name: `Sim Name ${i}`, email: `delivered+sim${i % Math.max(1, SIM - 7)}@resend.dev`, language: langs[i % 4], status: 'pending', created: i })) };
  }
  try { const s = await fetchFirestore(); s.source = 'firestore (live)'; return s; }
  catch (e) {
    log(`Firestore failed: ${e.message}`);
    if (allowSnapshot && fs.existsSync(SNAPSHOT)) {
      const s = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf-8')); s.source = `snapshot from ${s.fetched_at}`; return s;
    }
    throw e;
  }
}
function readLedger() {
  return new Set(fs.existsSync(LEDGER) ? fs.readFileSync(LEDGER, 'utf-8').split('\n').map((s) => s.trim()).filter(Boolean) : []);
}
function pickLanguage(list) {   // most common saved language on the address's names (missing → en); tie → pt, br, en
  const c = { pt: 0, br: 0, en: 0 };
  for (const n of list) c[templateKey(n.language || 'en')]++;
  return ['pt', 'br', 'en'].reduce((best, k) => (c[k] > c[best] ? k : best), 'pt');
}
function buildQueue(snap) {
  const unsub = new Set(snap.unsubscribed);
  const sent = readLedger();
  const x = { deleted: 0, unsubscribed: 0, invalid_site_rule: 0, invalid_resend_would_reject: 0, already_sent_addresses: 0 };
  const invalid = new Set();
  const byAddr = new Map();
  let namesIn = 0;
  for (const n of snap.names) {
    const e = String(n.email || '').trim().toLowerCase();
    if (n.status === 'deleted') { x.deleted++; continue; }
    if (!siteValid(e)) { x.invalid_site_rule++; invalid.add(e); continue; }
    if (unsub.has(e)) { x.unsubscribed++; continue; }
    if (!STRICT_RE.test(e) || BLOCKED_DOMAINS.test(e)) { x.invalid_resend_would_reject++; invalid.add(e); continue; }
    namesIn++;
    if (!byAddr.has(e)) byAddr.set(e, []);
    byAddr.get(e).push(n);
  }
  const queue = [];
  let dupes = 0, mixed = 0, names = 0;
  for (const [email, list] of byAddr) {
    if (sent.has(email)) { x.already_sent_addresses++; continue; }
    list.sort((a, b) => (a.created ?? Infinity) - (b.created ?? Infinity) || (a.id < b.id ? -1 : 1));   // sign-up order
    const seen = new Set(), uniq = [];
    for (const n of list) {
      const nm = String(n.name || '').replace(/\s+/g, ' ').trim();
      if (!nm) continue;
      if (seen.has(nm)) { dupes++; continue; }
      seen.add(nm); uniq.push(nm);
    }
    if (!uniq.length) continue;
    if (new Set(list.map((n) => templateKey(n.language || 'en'))).size > 1) mixed++;
    names += uniq.length;
    queue.push({ email, language: pickLanguage(list), names: uniq });
  }
  queue.sort((a, b) => (a.email < b.email ? -1 : 1));   // deterministic chunks → stable idempotency keys on resume
  return { queue, excluded: x, invalid: [...invalid], names_in: namesIn, names_listed: names, duplicate_names_dropped: dupes, mixed_language_addresses: mixed };
}

// ─── Resend ─────────────────────────────────────────────────────────────────
class Quota extends Error {}
async function postBatch(key, emails, idem) {
  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idem, 'x-batch-validation': 'permissive' },
    body: JSON.stringify(emails),
    signal: AbortSignal.timeout(60000),
  });
  let body = null;
  try { body = await res.json(); } catch { body = null; }
  const headers = {};
  res.headers.forEach((v, k) => { if (/quota|ratelimit|retry-after/i.test(k)) headers[k] = v; });
  return { status: res.status, body, headers };
}

// Sends one chunk. Returns {sent:[addresses], failed:[[address,address,msg]...]}. Throws Quota; network errors retry until NET_WINDOW.
async function sendChunk(key, chunk, pressMs, net) {
  let backoff = 2000;
  const payload = chunk.map((rec) => message(rec, pressMs));
  // Key = hash of the exact payload: a retry of the same batch is deduped by Resend; a changed body gets a new key (no 409).
  const idem = `${EVENT}/${crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 48)}`;
  for (;;) {
    let r;
    try { r = await postBatch(key, payload, idem); }
    catch (err) {
      if (Date.now() - net.okAt > NET_WINDOW_MS) throw new Error(`network down for ${NET_WINDOW_MS / 60000} min: ${err.message}`);
      log(`network error (${err.message}); retry in ${backoff / 1000}s`);
      await sleep(backoff); backoff = Math.min(60000, backoff * 2); continue;
    }
    net.okAt = Date.now();
    const name = (r.body && (r.body.name || r.body.error?.name)) || '';
    const msg = (r.body && (r.body.message || r.body.error?.message)) || '';
    if (r.status === 200) {
      const errs = new Map((r.body.errors || []).map((x) => [x.index, x.message]));
      return { sent: chunk.filter((_, i) => !errs.has(i)).map((c) => c.email), failed: [...errs].map(([i, m]) => [chunk[i].email, chunk[i].names.length, m]), headers: r.headers };
    }
    if (r.status === 429 && /quota/i.test(`${name} ${msg}`)) throw new Quota(`${name}: ${msg}`);
    if (r.status === 429) { const wait = (Number(r.headers['retry-after']) || 1) * 1000; log(`rate limited; wait ${wait / 1000}s`); await sleep(wait); continue; }
    if (r.status === 409 && /concurrent/i.test(`${name} ${msg}`)) { await sleep(2000); continue; }
    if (r.status >= 500) {
      if (Date.now() - net.okAt > NET_WINDOW_MS) throw new Error(`Resend ${r.status} for ${NET_WINDOW_MS / 60000} min`);
      log(`Resend ${r.status} ${name}; retry in ${backoff / 1000}s`); await sleep(backoff); backoff = Math.min(60000, backoff * 2); continue;
    }
    // Any other whole-batch rejection (401/403 key or domain, 400/422 payload, 409 idempotency) is
    // systemic: stop without a done marker so a fix + re-run still sends.
    throw new Error(`Resend rejected a whole batch: HTTP ${r.status} ${name}: ${msg}`);
  }
}

async function sendAll(key, queue, pressMs) {
  const chunks = [];
  for (let i = 0; i < queue.length; i += BATCH) chunks.push(queue.slice(i, i + BATCH));
  const ledgerFd = fs.openSync(LEDGER, 'a');
  const t0 = Date.now();
  let next = 0, slot = Date.now(), sent = 0, failed = 0, stop = null, lastHeaders = {};
  const net = { okAt: Date.now() };
  async function worker() {
    while (!stop && next < chunks.length) {
      const idx = next++;
      const wait = slot - Date.now(); slot = Math.max(slot, Date.now()) + 1000 / RATE;
      if (wait > 0) await sleep(wait);
      const chunk = chunks[idx];
      try {
        const r = await sendChunk(key, chunk, pressMs, net);
        if (r.sent.length) { fs.writeSync(ledgerFd, r.sent.join('\n') + '\n'); fs.fsyncSync(ledgerFd); }
        if (r.failed.length) fs.appendFileSync(FAILED, r.failed.map((f) => f.join('\t')).join('\n') + '\n');
        sent += r.sent.length; failed += r.failed.length; lastHeaders = r.headers || lastHeaders;
        for (const [e, , m] of r.failed) log(`✗ ${e}: ${m}`);
        log(`batch ${idx + 1}/${chunks.length} · +${r.sent.length} · total sent ${sent} · ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      } catch (e) { stop = e; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(INFLIGHT, chunks.length) }, worker));
  fs.closeSync(ledgerFd);
  return { sent, failed, stop, seconds: (Date.now() - t0) / 1000, chunks: chunks.length, headers: lastHeaders };
}

// ─── Arm / lock ─────────────────────────────────────────────────────────────
function armState() {
  if (!fs.existsSync(ARMED)) return { armed: false, why: 'no ARMED file' };
  let a;
  try { a = JSON.parse(fs.readFileSync(ARMED, 'utf-8')); } catch { return { armed: false, why: 'ARMED file unreadable' }; }
  const now = hhmm();
  if (a.date !== today()) return { armed: false, why: `ARMED is for ${a.date}, today is ${today()}`, a };
  if (now < a.not_before || now > a.not_after) return { armed: false, why: `outside the window ${a.not_before}–${a.not_after} (now ${now})`, a };
  return { armed: true, a };
}
function takeLock() {
  try { fs.writeFileSync(LOCK, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }), { flag: 'wx' }); return true; }
  catch {
    let pid = 0; try { pid = JSON.parse(fs.readFileSync(LOCK, 'utf-8')).pid; } catch { /* unreadable → stale */ }
    try { if (pid) { process.kill(pid, 0); return false; } } catch { /* dead → stale */ }
    log(`stale lock (pid ${pid}) — taking over and resuming`);
    fs.writeFileSync(LOCK, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }));
    return true;
  }
}
const releaseLock = () => { try { if (JSON.parse(fs.readFileSync(LOCK, 'utf-8')).pid === process.pid) fs.unlinkSync(LOCK); } catch { /* none */ } };

function estimate(n, latencyS) {
  const batches = Math.ceil(n / BATCH);
  const perBatch = Math.max(1 / RATE, latencyS / INFLIGHT);
  return { batches, seconds: Math.round(batches * perBatch) };
}
function report(snap, q) {
  const by = { en: 0, br: 0, pt: 0 };
  for (const r of q.queue) by[r.language]++;
  const multi = q.queue.filter((r) => r.names.length > 1).length;
  const top = q.queue.map((r) => r.names.length).sort((a, b) => b - a).slice(0, 5);
  const fast = estimate(q.queue.length, 1.0), slow = estimate(q.queue.length, 3.0);
  log(`list: ${snap.source} · ${snap.names.length} name docs · fetch ${snap.fetch_ms ?? '?'} ms`);
  log(`excluded: ${JSON.stringify(q.excluded)}`);
  log(`to send: ${q.queue.length} emails = ${q.queue.length} addresses (ONE per address) · ${q.names_listed} names listed (${q.names_in} name docs; ${q.duplicate_names_dropped} identical names on the same address listed once)`);
  log(`single-name emails ${q.queue.length - multi} · multi-name emails ${multi} · most names in one email: ${top.join(', ')} · mixed-language addresses ${q.mixed_language_addresses}`);
  log(`templates: en ${by.en} · br ${by.br} · pt ${by.pt}`);
  log(`${fast.batches} batches of ≤${BATCH} · ${RATE} req/s, ${INFLIGHT} in flight · estimated ${fast.seconds}–${slow.seconds}s of sending (1–3 s per batch call) + list fetch`);
  if (q.invalid.length) log(`invalid addresses skipped: ${q.invalid.length}`);
  return { ...by, addresses: q.queue.length, names: q.names_listed, batches: fast.batches };
}
async function reportMail(key, subject, body) {
  try { await postBatch(key, [{ from: FROM, to: [REPORT_TO], subject, text: body }], `report/${crypto.randomUUID()}`); } catch { /* best effort */ }
}

// ─── Modes ──────────────────────────────────────────────────────────────────
async function main() {
  const mode = process.argv[2];
  const bad = lint();
  if (mode === 'lint') {
    for (const language of ['en', 'br', 'pt']) for (const names of [[TEST_NAME], [TEST_NAME, 'Maria Aparecida da Silva', 'João Pavoni']]) {
      const m = message({ names, email: TEST_TO, language }, Date.now());
      console.log(`\n── ${language} ${names.length > 1 ? 'multi' : 'single'} ── Subject: ${m.subject}\n${m.text}`);
    }
    console.log(bad.length ? `\n✗ LINT:\n  ${bad.join('\n  ')}` : '\n✓ lint clean (matches index.ts; no UARX/OSSIE/in orbit/transmitting)');
    process.exit(bad.length ? 1 : 0);
  }
  if (bad.length) {
    // At press time only forbidden words stop the send; a drift from index.ts is logged and the copy in this file goes out.
    const fatal = mode !== 'send' ? bad : bad.filter((b) => b.includes('forbidden'));
    if (fatal.length) { log(`REFUSING (lint):\n  ${fatal.join('\n  ')}`); process.exit(1); }
    log(`WARNING (lint, sending anyway with the text in send.cjs):\n  ${bad.join('\n  ')}`);
  }

  if (mode === 'test') {
    const key = apiKey();
    const pressMs = Number(arg('--press-ms', Date.now()));
    const t0 = Date.now();
    const MULTI = [TEST_NAME, 'Maria Aparecida da Silva', 'João Pavoni'];
    const cases = [['en', [TEST_NAME]], ['en', MULTI], ['pt', [TEST_NAME]], ['pt', MULTI], ['br', MULTI]];
    const r = await postBatch(key, cases.map(([language, names]) => message({ names, email: TEST_TO, language }, pressMs)), `test/${crypto.randomUUID()}`);
    log(`TEST → ${TEST_TO} only (en single, en multi, pt single, pt multi, br multi) · HTTP ${r.status} · ${Date.now() - t0} ms for one ${cases.length}-email batch call`);
    log(`response: ${JSON.stringify(r.body)}`);
    log(`headers: ${JSON.stringify(r.headers)}`);
    process.exit(r.status === 200 && !(r.body.errors || []).length ? 0 : 1);
  }

  if (mode === 'dry-run' || mode === 'arm') {
    const key = apiKey();
    const t0 = Date.now();
    const ping = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) })
      .then(async (r) => ({ ok: r.ok, status: r.status, ms: Date.now() - t0, body: await r.json().catch(() => null) }))
      .catch((e) => ({ ok: false, status: e.message }));
    const dom = ping.body?.data?.find((d) => d.name === 'orbitaltemple.art');
    log(`Resend reachable: ${ping.ok ? `yes (${ping.ms} ms)` : `NO (${ping.status})`} · domain orbitaltemple.art: ${dom ? dom.status : 'not found'}`);
    const snap = await loadList({ allowSnapshot: false });
    log('Firestore reachable: yes · snapshot refreshed → state/recipients-snapshot.json');
    const q = buildQueue(snap);
    const r = report(snap, q);
    if (fs.existsSync(DONE)) log(`NOTE: already DONE — ${fs.readFileSync(DONE, 'utf-8')}`);
    if (mode === 'arm') {
      if (!ping.ok || dom?.status !== 'verified') { log('NOT ARMED: Resend check failed'); process.exit(1); }
      const a = { date: arg('--date', today()), not_before: arg('--from', '14:30'), not_after: arg('--until', '23:59'), armed_at: new Date().toISOString(), emails: q.queue.length, ...r };
      fs.writeFileSync(ARMED, JSON.stringify(a, null, 1));
      log(`ARMED for ${a.date} ${a.not_before}–${a.not_after}. The first DEPLOYED press in that window sends ${q.queue.length} emails. Outside it, a press is only a dry-run. Disarm: node send.cjs disarm`);
    }
    process.exit(0);
  }

  if (mode === 'disarm') { if (fs.existsSync(ARMED)) fs.unlinkSync(ARMED); log('disarmed (ARMED removed)'); process.exit(0); }

  if (mode === 'status') {
    const a = armState();
    log(`armed now: ${a.armed ? 'YES' : `no (${a.why})`}${a.a ? ` · ARMED file: ${JSON.stringify(a.a)}` : ''}`);
    log(`ledger: ${readLedger().size} addresses sent · done: ${fs.existsSync(DONE) ? fs.readFileSync(DONE, 'utf-8') : 'no'} · lock: ${fs.existsSync(LOCK) ? fs.readFileSync(LOCK, 'utf-8') : 'none'}`);
    process.exit(0);
  }

  if (mode === 'send') {
    const who = arg('--who', 'unknown');
    const a = armState();
    log(`DEPLOYED press (${who}) → "${EVENT}" email · armed: ${a.armed ? 'YES' : `no — ${a.why}`}`);
    if (fs.existsSync(DONE)) { log(`already sent once, nothing to do: ${fs.readFileSync(DONE, 'utf-8')}`); process.exit(0); }
    if (!a.armed) {
      log('DRY-RUN (not armed): nothing is sent');
      const snap = await loadList({ allowSnapshot: true });
      report(snap, buildQueue(snap));
      process.exit(0);
    }
    if (!takeLock()) { log('another send is running (lock held by a live process): nothing to do'); process.exit(0); }
    // The time in the text is the FIRST press; a resume re-uses it.
    let pressMs;
    if (fs.existsSync(PRESS)) pressMs = JSON.parse(fs.readFileSync(PRESS, 'utf-8')).press_ms;
    else { pressMs = Number(arg('--press-ms', Date.now())) || Date.now(); fs.writeFileSync(PRESS, JSON.stringify({ press_ms: pressMs, who, at: new Date(pressMs).toString() })); }
    log(`press time in the text: ${new Date(pressMs).toString()}`);
    const key = apiKey();
    let snap;
    for (const t0 = Date.now(); ;) {
      try { snap = await loadList({ allowSnapshot: true }); break; }
      catch (e) { if (Date.now() - t0 > NET_WINDOW_MS) { log('GIVING UP: no list (no Firestore, no snapshot)'); releaseLock(); process.exit(3); } await sleep(10000); }
    }
    const q = buildQueue(snap);
    const r0 = report(snap, q);
    const res = await sendAll(key, q.queue, pressMs);
    const summary = { event: EVENT, who, press: new Date(pressMs).toString(), finished_at: new Date().toISOString(), sent_this_run: res.sent, failed_this_run: res.failed,
      ledger_total: readLedger().size, seconds: res.seconds, batches: res.chunks, templates: { en: r0.en, br: r0.br, pt: r0.pt }, excluded: q.excluded, list: snap.source, resend_headers: res.headers };
    if (res.stop) {
      const quota = res.stop instanceof Quota;
      log(`${quota ? '⛔ QUOTA' : '⛔ STOPPED'}: ${res.stop.message}. Sent ${res.sent} this run; the ledger keeps them. Resume: python3 notify.py in-space (or press DEPLOYED again).`);
      releaseLock();
      await reportMail(key, `[launch mail] STOPPED${quota ? ' (QUOTA)' : ''}: ${res.sent} sent`, `${JSON.stringify(summary, null, 1)}\n\n${res.stop.message}`);
      process.exit(quota ? 2 : 3);
    }
    if (res.failed > Math.max(50, 0.02 * q.queue.length)) {   // per-address rejections beyond a few % → don't seal it
      log(`⛔ ${res.failed} addresses rejected (>2%): NOT marking done. Check state/failed-${EVENT}.txt, then resume.`);
      releaseLock();
      await reportMail(key, `[launch mail] ${res.sent} sent, ${res.failed} rejected — not sealed`, JSON.stringify(summary, null, 1));
      process.exit(5);
    }
    fs.writeFileSync(DONE, JSON.stringify(summary, null, 1));
    releaseLock();
    log(`DONE · sent ${res.sent} · failed ${res.failed} · ${res.seconds.toFixed(1)}s · ${res.chunks} batches`);
    await reportMail(key, `[launch mail] sent ${res.sent} in ${res.seconds.toFixed(0)}s`, JSON.stringify(summary, null, 1));
    process.exit(0);
  }

  console.error('usage: node send.cjs lint | test | dry-run | arm [--from HH:MM --until HH:MM --date YYYY-MM-DD] | disarm | status | send [--who X] [--press-ms MS]');
  process.exit(1);
}

main().catch((e) => { log(`FATAL: ${e.stack || e}`); releaseLock(); process.exit(4); });
