/**
 * Orbital Temple — the launch-date email ("E1", Sep 30, 2026): Thursday Oct 1, 2:18 PM NY, Transporter-18.
 *
 * Text: hardcoded from the Dropbox review file
 *   0000 AI/projects/orbital-temple-launch/launch-event/EMAIL-19K-LAUNCH-2026-09-29.md (EN + PT, final Sep 30).
 * List, language rule and chrome: as send-once-again.ts (Firestore `names`, one email per address,
 * pt / br / pt-br → Portuguese, everything else → English; header + unsubscribe link + support/follow footer).
 *
 * Usage (from email-outreach/):
 *   npx tsx send-launch-date.ts test you@example.com   → sends EN and PT to that one address only
 *   npx tsx send-launch-date.ts dry-run                 → counts recipients, sends nothing
 *   npx tsx send-launch-date.ts batch --confirm         → sends to the whole list
 *
 * Sending: Resend POST /emails/batch, ≤100 emails per call, one call at a time, ≥250 ms apart (≤4 req/s;
 * the account limit is 10 req/s shared with the site). Each email in a batch is its own message, so each
 * carries its own unsubscribe link. x-batch-validation: permissive (a bad address fails alone, not the batch).
 * Idempotency-Key = hash of the batch payload, queue sorted by address → a resume re-sends nothing twice.
 * Tracking: sent-launch-date.txt (own file), appended + fsynced after each accepted batch. Re-run to resume.
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

dotenv.config();

const FROM = 'Edson Pavoni <noreply@orbitaltemple.art>';
const BCC_EMAIL = 'edsonpavoni@gmail.com';
const BCC_EVERY = 500;
const SENT_TRACKING_FILE = path.join(__dirname, 'sent-launch-date.txt');
const BATCH = 100;
const MIN_GAP_MS = 250;
const NET_WINDOW_MS = 30 * 60 * 1000;

type Lang = 'en' | 'pt';

// ─── The letter (verbatim from the md; **bold**, *italic*) ──────────────────
const LETTER: Record<Lang, { subject: string; preview: string; greeting: string; paragraphs: string[]; thanks: string; name: string; site: string }> = {
  en: {
    subject: 'Thursday, 2:18 PM: your name leaves Earth',
    preview: "The Orbital Temple launches on SpaceX's Transporter-18. Watch it with us.",
    greeting: 'Hello,',
    paragraphs: [
      'You sent a name to the Orbital Temple. On Thursday it leaves Earth.',
      'SpaceX is targeting **Thursday, October 1, 2026 at 2:18 PM New York time** for the launch of Transporter-18, from Vandenberg, California. The Orbital Temple is on board, with more than 19,000 names, yours among them.',
      'That is 11:18 AM in Los Angeles, 3:18 PM in São Paulo, 7:18 PM in London, 8:18 PM in Berlin, 11:48 PM in New Delhi, and 3:18 AM Friday in Tokyo.',
      '**Watch it live:** SpaceX streams the launch at spacex.com/launches/transporter18. Everything is also on orbitaltemple.art/en/space-launch.',
      'This is the second time. In January the first temple reached space on a rocket that failed. Eight months later a new one is built and ready. Space is hard and dates can move: SpaceX\'s backup day is Friday, October 2, at the same time. If it moves, we will tell you.',
      '**You will hear from us on the day,** when the rocket releases its satellites and the temple is in space. Days to weeks after that, the temple is set free into its own orbit, and your name begins to circle the Earth.',
      '**If you are in New York,** come watch it with us. *Birth of a Temple* is a free ritual at Dustin Yellin Studio, 153 Pioneer St, Red Hook, Brooklyn. Doors at 1 PM, the launch at 2:18. The celebration starts at 7:30 PM. RSVP: https://partiful.com/e/LHgmbQlh0hspkJwcaMuc',
    ],
    thanks: 'Thank you for sending a name. A temple is only a temple because people bring something to it.',
    name: 'Edson Pavoni',
    site: 'orbitaltemple.art',
  },
  pt: {
    subject: 'Quinta-feira, 15h18: o seu nome sai da Terra',
    preview: 'O Templo Orbital sobe na Transporter-18 da SpaceX. Assista com a gente.',
    greeting: 'Olá,',
    paragraphs: [
      'Você enviou um nome para o Templo Orbital. Na quinta-feira ele sai da Terra.',
      'A SpaceX marcou para **quinta-feira, 1º de outubro de 2026, às 15h18 (horário de Brasília)** o lançamento da missão Transporter-18, da base de Vandenberg, na Califórnia. O Templo Orbital vai a bordo, com mais de 19 mil nomes, o seu entre eles.',
      '**Assista ao vivo:** a SpaceX transmite o lançamento em spacex.com/launches/transporter18. Tudo também está em orbitaltemple.art/pt/space-launch.',
      'É a segunda vez. Em janeiro, o primeiro templo chegou ao espaço num foguete que falhou. Oito meses depois, um novo está pronto. O espaço é difícil e as datas podem mudar: a data reserva da SpaceX é sexta-feira, 2 de outubro, no mesmo horário. Se mudar, a gente avisa.',
      '**No dia, você vai receber uma mensagem nossa,** quando o foguete soltar os satélites e o templo estiver no espaço. De dias a semanas depois, o templo é solto em sua própria órbita, e o seu nome começa a dar voltas na Terra.',
      '**Se você está em Nova York,** venha assistir com a gente. *Birth of a Temple* é um ritual gratuito no Dustin Yellin Studio, 153 Pioneer St, Red Hook, Brooklyn. Portas às 13h (NY), o lançamento às 14h18 (NY). A celebração começa às 19h30 (NY). RSVP: https://partiful.com/e/LHgmbQlh0hspkJwcaMuc',
    ],
    thanks: 'Obrigado por ter enviado um nome. Um templo só é templo porque as pessoas levam algo até ele.',
    name: 'Edson Pavoni',
    site: 'orbitaltemple.art',
  },
};

const CHROME: Record<Lang, { header: string; unsubscribe: string; supportHeading: string; supportText: string; followHeading: string }> = {
  en: { header: 'This is an Orbital Temple Art Satellite update.', unsubscribe: 'unsubscribe', supportHeading: '', supportText: '', followHeading: '' },
  pt: { header: 'Esta é uma atualização da obra Templo Orbital.', unsubscribe: 'cancele sua inscrição', supportHeading: '', supportText: '', followHeading: '' },
};
for (const lang of ['en', 'pt'] as Lang[]) {   // footer wording as the Once-again letter (the site's updates.json)
  const d = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'locales', lang, 'updates.json'), 'utf-8'));
  CHROME[lang].supportHeading = d.support.heading;
  CHROME[lang].supportText = d.support.text;
  CHROME[lang].followHeading = d.follow.heading;
}

// ─── Rendering ──────────────────────────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LINK_RE = /(https:\/\/partiful\.com\/e\/[A-Za-z0-9]+|spacex\.com\/launches\/transporter18|orbitaltemple\.art\/(?:en|pt)\/space-launch)/g;
const href = (t: string) => (t.startsWith('https://') ? t : t.startsWith('spacex.com') ? `https://www.${t}` : `https://${t}`);
const A = (url: string, label: string) => `<a href="${url}" style="color: #0066cc;">${esc(label)}</a>`;
function inline(md: string) {   // escape, then **bold**, *italic*, links
  return esc(md)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(LINK_RE, (m) => A(href(m), m));
}
const plain = (md: string) => md.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');

function urls(email: string, lang: Lang) {
  return {
    unsubscribe: `https://orbitaltemple.art/${lang}/unsubscribe?e=${Buffer.from(email).toString('base64')}`,
    home: `https://orbitaltemple.art/${lang}`,
    support: `https://orbitaltemple.art/${lang}/support/`,
    instagram: 'https://instagram.com/edsonpavoni/',
  };
}

function html(email: string, lang: Lang) {
  const L = LETTER[lang], c = CHROME[lang], u = urls(email, lang);
  const pre = `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(L.preview)}${'&zwnj;&nbsp;'.repeat(90)}</div>`;
  return `${pre}
<div style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 17px; line-height: 1.7; color: #333; max-width: 600px;">
  <p style="font-size: 13px; color: #888; margin-bottom: 24px;">
    ${esc(c.header)} <a href="${u.unsubscribe}" style="color: #666;">${esc(c.unsubscribe)}</a>
  </p>

  <p>${esc(L.greeting)}</p>

${L.paragraphs.map((p) => `  <p>${inline(p)}</p>`).join('\n\n')}

  <p>${esc(L.thanks)}</p>

  <p>${esc(L.name)}<br>
  ${A(u.home, L.site)}</p>

${lang === 'pt' ? '' : `  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;">
    <strong>${esc(c.supportHeading)}:</strong> ${esc(c.supportText)} ${A(u.support, `orbitaltemple.art/${lang}/support`)}
  </p>
`}
  <p${lang === 'pt' ? ' style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;"' : ''}>
    <strong>${esc(c.followHeading)}:</strong> ${A(u.instagram, 'instagram.com/edsonpavoni/')}
  </p>
</div>
`;
}

function text(email: string, lang: Lang) {
  const L = LETTER[lang], c = CHROME[lang], u = urls(email, lang);
  return `${c.header}
${c.unsubscribe}: ${u.unsubscribe}

---

${L.greeting}

${L.paragraphs.map(plain).join('\n\n')}

${L.thanks}

${L.name}
${L.site}

${lang === 'pt' ? '' : `-
${c.supportHeading}: ${c.supportText} ${u.support}

`}-
${c.followHeading}: ${u.instagram}
`;
}

function message(to: string, lang: Lang, bcc = false) {
  const m: any = {
    from: FROM, to: [to], subject: LETTER[lang].subject, html: html(to, lang), text: text(to, lang),
    headers: { 'List-Unsubscribe': `<${urls(to, lang).unsubscribe}>` },
    tags: [{ name: 'campaign', value: 'launch-date' }],
  };
  if (bcc) m.bcc = [BCC_EMAIL];
  return m;
}

// ─── Resend batch ───────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
class Stop extends Error { constructor(msg: string, public code: number) { super(msg); } }

async function postBatch(key: string, emails: any[], idem: string) {
  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idem, 'x-batch-validation': 'permissive' },
    body: JSON.stringify(emails),
    signal: AbortSignal.timeout(60000),
  });
  let body: any = null;
  try { body = await res.json(); } catch { body = null; }
  return { status: res.status, body, retryAfter: Number(res.headers.get('retry-after')) || 1 };
}

// Returns { ok: [emails accepted], bad: [[email, msg]] }. Throws Stop on quota / systemic rejection / long outage.
async function sendChunk(key: string, chunk: [string, Lang][], bccIdx: Set<number>, net: { okAt: number }) {
  const payload = chunk.map(([e, l], i) => message(e, l, bccIdx.has(i)));
  const idem = `launch-date/${crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 48)}`;
  let backoff = 2000;
  for (;;) {
    let r;
    try { r = await postBatch(key, payload, idem); }
    catch (err: any) {
      if (Date.now() - net.okAt > NET_WINDOW_MS) throw new Stop(`network down for 30 min: ${err.message}`, 3);
      console.error(`network error (${err.message}); retry in ${backoff / 1000}s`);
      await delay(backoff); backoff = Math.min(60000, backoff * 2); continue;
    }
    net.okAt = Date.now();
    const what = `${r.body?.name || ''} ${r.body?.message || ''}`.trim();
    if (r.status === 200) {
      const errs = new Map<number, string>((r.body?.errors || []).map((x: any) => [x.index, x.message]));
      return { ok: chunk.filter((_, i) => !errs.has(i)).map(([e]) => e), bad: [...errs].map(([i, m]) => [chunk[i][0], m]) };
    }
    if (r.status === 429 && /quota/i.test(what)) throw new Stop(`QUOTA: ${what}`, 2);
    if (r.status === 429) { await delay(r.retryAfter * 1000); continue; }
    if (r.status === 409 && /concurrent/i.test(what)) { await delay(2000); continue; }
    if (r.status >= 500) {
      if (Date.now() - net.okAt > NET_WINDOW_MS) throw new Stop(`Resend ${r.status} for 30 min`, 3);
      console.error(`Resend ${r.status}; retry in ${backoff / 1000}s`); await delay(backoff); backoff = Math.min(60000, backoff * 2); continue;
    }
    throw new Stop(`Resend rejected a whole batch: HTTP ${r.status} ${what}`, 4);
  }
}

// ─── List ───────────────────────────────────────────────────────────────────
const isPT = (language: string) => ['pt', 'br', 'pt-br', 'pt-pt', 'portuguese'].includes(language.toLowerCase());
const siteValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const STRICT_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
const BLOCKED_DOMAINS = /@(example\.(com|org|net)|test\.com)$/i;

async function main() {
  const [mode, arg] = process.argv.slice(2);
  const key = (process.env.RESEND_API_KEY || '').trim();
  if (!key) { console.error('❌ RESEND_API_KEY not found in .env'); process.exit(1); }

  if (mode === 'test') {
    if (!arg || !arg.includes('@')) { console.error('Usage: npx tsx send-launch-date.ts test you@example.com'); process.exit(1); }
    const r = await postBatch(key, [message(arg, 'en'), message(arg, 'pt')], `launch-date-test/${crypto.randomUUID()}`);
    const errs = r.body?.errors || [];
    console.log(r.status === 200 && !errs.length
      ? `✅ EN + PT test sent to ${arg} in one batch call (ids ${r.body.data.map((d: any) => d.id).join(', ')})`
      : `❌ HTTP ${r.status}: ${JSON.stringify(r.body)}`);
    process.exit(r.status === 200 && !errs.length ? 0 : 1);
  }

  if (mode !== 'dry-run' && !(mode === 'batch' && arg === '--confirm')) {
    console.error('Usage: test <email> | dry-run | batch --confirm');
    process.exit(1);
  }

  const sa = require(path.join(__dirname, '..', 'functions', 'service-account-key.json'));
  admin.initializeApp({ credential: admin.credential.cert(sa) });
  const db = admin.firestore();
  const [names, unsubSnap] = await Promise.all([db.collection('names').get(), db.collection('unsubscribed').get()]);

  const byEmail = new Map<string, string>();   // first live name doc's language, as Once-again
  const deletedOnly = new Set<string>();
  for (const d of names.docs) {
    const x = d.data();
    const e = String(x.email || '').trim().toLowerCase();
    if (!e) continue;
    if (x.status === 'deleted') { if (!byEmail.has(e)) deletedOnly.add(e); continue; }
    deletedOnly.delete(e);
    if (!byEmail.has(e)) byEmail.set(e, x.language || 'en');
  }
  const unsub = new Set(unsubSnap.docs.map((d) => String(d.data().email || '').trim().toLowerCase()));
  const alreadySent = new Set(
    fs.existsSync(SENT_TRACKING_FILE)
      ? fs.readFileSync(SENT_TRACKING_FILE, 'utf-8').split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : []
  );

  const x = { unsubscribed: 0, invalid: 0, already_sent: 0 };
  const queue: [string, Lang][] = [];
  for (const [e, l] of byEmail) {
    if (unsub.has(e)) { x.unsubscribed++; continue; }
    if (!siteValid(e) || !STRICT_RE.test(e) || BLOCKED_DOMAINS.test(e)) { x.invalid++; continue; }
    if (alreadySent.has(e)) { x.already_sent++; continue; }
    queue.push([e, isPT(l) ? 'pt' : 'en']);
  }
  queue.sort((a, b) => (a[0] < b[0] ? -1 : 1));   // stable chunks → stable idempotency keys on resume
  const ptN = queue.filter(([, l]) => l === 'pt').length;
  const batches = Math.ceil(queue.length / BATCH);

  console.log(`\nORBITAL TEMPLE — E1 launch date · "${LETTER.en.subject}" / "${LETTER.pt.subject}"`);
  console.log(`name docs ${names.size} · unique addresses with a live name ${byEmail.size} · excluded: only-deleted names ${deletedOnly.size}, unsubscribed ${x.unsubscribed}, invalid ${x.invalid}, already sent ${x.already_sent}`);
  console.log(`to send now: ${queue.length} (EN ${queue.length - ptN}, PT ${ptN}) · ${batches} batch calls of ≤${BATCH} · ~${Math.ceil((batches * 1.2) / 60)}–${Math.ceil((batches * 3) / 60)} min\n`);
  if (mode === 'dry-run') process.exit(0);

  const fd = fs.openSync(SENT_TRACKING_FILE, 'a');
  const net = { okAt: Date.now() };
  let sent = 0, failed = 0, last = 0;
  const t0 = Date.now();
  for (let b = 0; b < batches; b++) {
    const chunk = queue.slice(b * BATCH, (b + 1) * BATCH);
    const bccIdx = new Set<number>();   // ~1 in 500, chosen by address (not position) so a resumed batch hashes the same
    chunk.forEach(([e], i) => { if (parseInt(crypto.createHash('sha256').update(e).digest('hex').slice(0, 8), 16) % BCC_EVERY === 0) bccIdx.add(i); });
    const wait = last + MIN_GAP_MS - Date.now();
    if (wait > 0) await delay(wait);
    last = Date.now();
    try {
      const r = await sendChunk(key, chunk, bccIdx, net);
      if (r.ok.length) { fs.writeSync(fd, r.ok.join('\n') + '\n'); fs.fsyncSync(fd); }
      sent += r.ok.length; failed += r.bad.length;
      for (const [e, m] of r.bad) console.error(`❌ ${e}: ${m}`);
      console.log(`✅ batch ${b + 1}/${batches} · +${r.ok.length} · total ${sent} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    } catch (e: any) {
      fs.closeSync(fd);
      console.error(`\n⛔ STOPPED at batch ${b + 1}/${batches}: ${e.message}\nsent ${sent} this run · failed ${failed}. Re-run the same command to resume: already-sent addresses are skipped.`);
      process.exit(e instanceof Stop ? e.code : 3);
    }
  }
  fs.closeSync(fd);
  console.log(`\nDONE · sent ${sent} · failed ${failed} · of ${queue.length} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  process.exit(0);
}

main();
