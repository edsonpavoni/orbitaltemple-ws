/**
 * Orbital Temple update email — "Once Again" (Sep 14, 2026)
 *
 * The text is read from ../public/locales/{en,pt}/updates.json, the same files
 * the website renders, so the email and the page cannot drift apart.
 *
 * Usage (from email-outreach/):
 *   npx tsx send-once-again.ts test you@example.com   → sends EN and PT to one address only
 *   npx tsx send-once-again.ts dry-run                 → counts recipients, sends nothing
 *   npx tsx send-once-again.ts batch --confirm         → sends to the whole list
 *
 * Tracking: sent-once-again.txt (NOT January's sent-emails.txt, which would skip everyone).
 * Language: pt / br / pt-br → Portuguese; everything else → English
 * (as of Sep 14: 20 Spanish and 1 Chinese subscribers receive English).
 */

import { Resend } from 'resend';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config();

const UPDATE_KEY = 'once-again';
const FROM = 'Edson Pavoni <noreply@orbitaltemple.art>';
const BCC_EMAIL = 'edsonpavoni@gmail.com';
const BCC_EVERY = 500;
const SENT_TRACKING_FILE = path.join(__dirname, 'sent-once-again.txt');
const RATE_DELAY_MS = 550;

type Lang = 'en' | 'pt';

const SUBJECTS: Record<Lang, string> = {
  en: 'Orbital Temple Update: Once Again',
  pt: 'Atualização Templo Orbital: Mais uma vez',
};

const CHROME: Record<Lang, { header: string; readOther: string; unsubscribe: string; supportHeading: string; supportText: string; followHeading: string }> = {
  en: {
    header: 'This is an Orbital Temple Art Satellite update.',
    readOther: 'Read it here in another language',
    unsubscribe: 'unsubscribe',
    supportHeading: '',
    supportText: '',
    followHeading: '',
  },
  pt: {
    header: 'Esta é uma atualização da obra Templo Orbital.',
    readOther: 'Leia em outro idioma',
    unsubscribe: 'cancele sua inscrição',
    supportHeading: '',
    supportText: '',
    followHeading: '',
  },
};

function loadPost(lang: Lang) {
  const file = path.join(__dirname, '..', 'public', 'locales', lang, 'updates.json');
  const d = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const post = d.updates?.[UPDATE_KEY];
  if (!post || !Array.isArray(post.content?.paragraphs)) {
    throw new Error(`Update "${UPDATE_KEY}" missing or malformed in ${file}`);
  }
  CHROME[lang].supportHeading = d.support.heading;
  CHROME[lang].supportText = d.support.text;
  CHROME[lang].followHeading = d.follow.heading;
  return post as { title: string; content: { greeting: string; paragraphs: string[]; signature: string; name: string } };
}

const POSTS: Record<Lang, ReturnType<typeof loadPost>> = { en: loadPost('en'), pt: loadPost('pt') };

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function urls(email: string, lang: Lang) {
  const encoded = Buffer.from(email).toString('base64');
  return {
    unsubscribe: `https://orbitaltemple.art/${lang}/unsubscribe?e=${encoded}`,
    updates: `https://orbitaltemple.art/${lang}/updates`,
    support: `https://orbitaltemple.art/${lang}/support/`,
    instagram: 'https://instagram.com/edsonpavoni/',
  };
}

function html(email: string, lang: Lang) {
  const p = POSTS[lang];
  const c = CHROME[lang];
  const u = urls(email, lang);
  const paras = p.content.paragraphs
    .map((t) => `  <p>${t.split('\n').map(esc).join('<br>')}</p>`)
    .join('\n\n');
  return `
<div style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 17px; line-height: 1.7; color: #333; max-width: 600px;">
  <p style="font-size: 13px; color: #888; margin-bottom: 24px;">
    ${esc(c.header)} <a href="${u.updates}" style="color: #666;">${esc(c.readOther)}</a> · <a href="${u.unsubscribe}" style="color: #666;">${esc(c.unsubscribe)}</a>
  </p>

  <p>${esc(p.content.greeting)}</p>

${paras}

  <p>${esc(p.content.signature)}<br>
  ${esc(p.content.name)}</p>

${lang === 'pt' ? '' : `  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;">
    <strong>${esc(c.supportHeading)}:</strong> ${esc(c.supportText)} <a href="${u.support}" style="color: #0066cc;">orbitaltemple.art/${lang}/support</a>
  </p>
`}
  <p${lang === 'pt' ? ' style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;"' : ''}>
    <strong>${esc(c.followHeading)}:</strong> <a href="${u.instagram}" style="color: #0066cc;">instagram.com/edsonpavoni/</a>
  </p>
</div>
`;
}

function text(email: string, lang: Lang) {
  const p = POSTS[lang];
  const c = CHROME[lang];
  const u = urls(email, lang);
  return `${c.header}
${c.readOther}: ${u.updates}
${c.unsubscribe}: ${u.unsubscribe}

---

${p.content.greeting}

${p.content.paragraphs.join('\n\n')}

${p.content.signature}
${p.content.name}

${lang === 'pt' ? '' : `-
${c.supportHeading}: ${c.supportText} ${u.support}

`}-
${c.followHeading}: ${u.instagram}
`;
}

const isPT = (language: string) => ['pt', 'br', 'pt-br', 'pt-pt', 'portuguese'].includes(language.toLowerCase());
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function sendOne(to: string, lang: Lang, bcc = false) {
  const opts: any = { from: FROM, to: [to], subject: SUBJECTS[lang], html: html(to, lang), text: text(to, lang) };
  if (bcc) opts.bcc = [BCC_EMAIL];
  return resend.emails.send(opts);
}

let resend: Resend;

async function main() {
  const [mode, arg] = process.argv.slice(2);
  if (!process.env.RESEND_API_KEY) { console.error('❌ RESEND_API_KEY not found in .env'); process.exit(1); }
  resend = new Resend(process.env.RESEND_API_KEY);

  if (mode === 'test') {
    if (!arg || !arg.includes('@')) { console.error('Usage: npx tsx send-once-again.ts test you@example.com'); process.exit(1); }
    for (const lang of ['en', 'pt'] as Lang[]) {
      const { data, error } = await sendOne(arg, lang);
      console.log(error ? `❌ ${lang}: ${error.message}` : `✅ ${lang} test sent to ${arg} (id ${data?.id})`);
      await delay(RATE_DELAY_MS);
    }
    process.exit(0);
  }

  const extra = process.argv[4];
  if (mode !== 'dry-run' && !(mode === 'batch' && arg === '--confirm') && !(mode === 'list' && arg && extra === '--confirm')) {
    console.error('Usage: test <email> | dry-run | batch --confirm | list <file> --confirm');
    process.exit(1);
  }

  const sa = require(path.join(__dirname, '..', 'functions', 'service-account-key.json'));
  admin.initializeApp({ credential: admin.credential.cert(sa) });
  const db = admin.firestore();

  const names = await db.collection('names').get();
  const byEmail = new Map<string, string>();
  for (const d of names.docs) {
    const x = d.data();
    const e = x.email?.toLowerCase();
    if (e && !byEmail.has(e)) byEmail.set(e, x.language || 'en');
  }
  const unsubSnap = await db.collection('unsubscribed').get();
  const unsub = new Set(unsubSnap.docs.map((d) => String(d.data().email || '').toLowerCase()));
  const alreadySent = new Set(
    fs.existsSync(SENT_TRACKING_FILE)
      ? fs.readFileSync(SENT_TRACKING_FILE, 'utf-8').split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : []
  );

  if (mode === 'list') {
    // list <file> --confirm : lines "email,lang" (lang en|pt). Skips unsubscribed and already sent.
    const lines = fs.readFileSync(arg, 'utf-8').split('\n').map((l) => l.trim()).filter(Boolean);
    let ls = 0, lf = 0, lk = 0;
    for (const line of lines) {
      const [email, l] = line.split(',').map((x) => x.trim());
      const e = email.toLowerCase();
      if (unsub.has(e) || alreadySent.has(e)) { lk++; console.log(`↷ skip ${email} (unsubscribed or already sent)`); continue; }
      const lang: Lang = l === 'pt' ? 'pt' : 'en';
      const { data, error } = await sendOne(email, lang, false);
      if (error) { lf++; console.error(`❌ ${email} (${lang}): ${error.message}`); }
      else { ls++; fs.appendFileSync(SENT_TRACKING_FILE, email + '\n'); alreadySent.add(e); console.log(`✅ ${email} (${lang}) id ${data?.id}`); }
      await delay(RATE_DELAY_MS);
    }
    console.log(`\nLIST DONE · sent ${ls} · failed ${lf} · skipped ${lk} · of ${lines.length}`);
    process.exit(0);
  }

  const queue = [...byEmail.entries()].filter(([e]) => !unsub.has(e) && !alreadySent.has(e));
  const ptN = queue.filter(([, l]) => isPT(l)).length;

  console.log(`\nORBITAL TEMPLE — ${SUBJECTS.en}`);
  console.log(`name docs ${names.size} · unique emails ${byEmail.size} · unsubscribed ${unsub.size} · already sent this update ${alreadySent.size}`);
  console.log(`to send now: ${queue.length} (PT ${ptN}, EN ${queue.length - ptN}) · ~${Math.ceil((queue.length * RATE_DELAY_MS) / 60000)} min\n`);

  if (mode === 'dry-run') process.exit(0);

  let sent = 0, failed = 0;
  for (let i = 0; i < queue.length; i++) {
    const [email, language] = queue[i];
    const lang: Lang = isPT(language) ? 'pt' : 'en';
    const bcc = (sent + 1) % BCC_EVERY === 0;
    try {
      let { error } = await sendOne(email, lang, bcc);
      for (let r = 0; error && /too many requests|rate limit|unable to fetch|could not be resolved|fetch failed|ECONN|ETIMEDOUT|ENOTFOUND|socket/i.test(error.message) && r < 8; r++) {
        await delay(Math.min(60000, 5000 * 2 ** r));
        ({ error } = await sendOne(email, lang, bcc));
      }
      if (error && /quota/i.test(error.message)) {
        console.error(`\n⛔ STOPPED at [${i + 1}/${queue.length}]: ${error.message}\nsent ${sent} this run · failed ${failed}. Re-run later: already-sent addresses are skipped.`);
        process.exit(2);
      }
      if (error && /unable to fetch|could not be resolved|fetch failed/i.test(error.message)) {
        console.error(`\n⛔ STOPPED at [${i + 1}/${queue.length}]: network still down after retries (${error.message}). sent ${sent} this run. Re-run: already-sent addresses are skipped.`);
        process.exit(3);
      }
      if (error) { failed++; console.error(`❌ [${i + 1}/${queue.length}] ${email}: ${error.message}`); }
      else { sent++; fs.appendFileSync(SENT_TRACKING_FILE, email + '\n'); if (sent % 100 === 0) console.log(`✅ ${sent} sent`); }
    } catch (err) { failed++; console.error(`❌ [${i + 1}/${queue.length}] ${email}: ${err}`); if (/fetch|ECONN|ETIMEDOUT|ENOTFOUND|socket/i.test(String(err))) await delay(30000); }
    await delay(RATE_DELAY_MS);
  }
  console.log(`\nDONE · sent ${sent} · failed ${failed} · of ${queue.length}`);
  process.exit(0);
}

main();
