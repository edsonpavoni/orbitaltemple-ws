/**
 * Send batch email update for Orbital Temple — Fire and Ashes
 *
 * Usage: cd email-outreach && npx tsx send-batch-update.ts [limit]
 * Example: npx tsx send-batch-update.ts 100
 */

import { Resend } from 'resend';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'functions', 'service-account-key.json');
try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (e) {
  console.error('❌ Could not load service account key from:', serviceAccountPath);
  console.error('   Make sure functions/service-account-key.json exists');
  process.exit(1);
}

const db = admin.firestore();
const resend = new Resend(process.env.RESEND_API_KEY);

const BCC_EMAIL = 'edsonpavoni@gmail.com';
const BCC_EVERY = 500; // Send BCC every N emails
const SENT_TRACKING_FILE = path.join(__dirname, 'sent-emails.txt');

// Load already-sent emails from tracking file
function loadSentEmails(): Set<string> {
  const sent = new Set<string>();
  if (fs.existsSync(SENT_TRACKING_FILE)) {
    const content = fs.readFileSync(SENT_TRACKING_FILE, 'utf-8');
    content.split('\n').forEach(email => {
      if (email.trim()) sent.add(email.trim().toLowerCase());
    });
    console.log(`📋 Loaded ${sent.size} already-sent emails from tracking file`);
  }
  return sent;
}

// Record a sent email to tracking file
function recordSentEmail(email: string): void {
  fs.appendFileSync(SENT_TRACKING_FILE, email.toLowerCase() + '\n');
}

const SUBJECTS = {
  en: 'Orbital Temple Update: Fire and Ashes',
  pt: 'Atualização Templo Orbital: Fogo e Cinzas',
};

function generateEmailHtml(recipientEmail: string, lang: 'en' | 'pt') {
  const encodedEmail = Buffer.from(recipientEmail).toString('base64');
  const unsubscribeUrl = `https://orbitaltemple.art/${lang}/unsubscribe?e=${encodedEmail}`;
  const updatesUrl = `https://orbitaltemple.art/${lang}/updates`;

  if (lang === 'pt') {
    return `
<div style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 17px; line-height: 1.7; color: #333; max-width: 600px;">
  <p style="font-size: 13px; color: #888; margin-bottom: 24px;">
    Esta é uma atualização da obra Templo Orbital. <a href="${updatesUrl}" style="color: #666;">Leia em outro idioma</a> ou <a href="${unsubscribeUrl}" style="color: #666;">cancele sua inscrição</a>.
  </p>

  <p>Olá do artista,<br>
  Quando você empurra os limites, às vezes os limites empurram de volta.</p>

  <p>Em 16 de janeiro de 2026, o Templo Orbital foi lançado ao espaço. Estava a bordo do PSLV-C62. Um lendário foguete indiano com mais de 60 lançamentos bem-sucedidos.</p>

  <p>Mas desta vez, a história foi diferente.</p>

  <p>O foguete decolou belíssimo e alcançou o espaço. Mas no estágio final, perdeu o controle. Falhou em liberar os satélites. Nosso templo ficou no espaço por apenas 10 minutos. Depois caiu de volta. Queimou em cinzas ao entrar na atmosfera.</p>

  <p>E agora? Eu sou brasileiro. Nós não desistimos nunca.</p>

  <p>Já temos um satélite reserva pronto para um novo lançamento. Estamos conversando com agências espaciais e empresas privadas. Estamos encontrando um novo foguete para nosso projeto.</p>

  <p>O espaço é difícil. Mas já somos 19.078 de nós que enviaram nomes. De todo o mundo, pessoas que responderam a este convite. Estamos olhando para o céu de um jeito diferente.</p>

  <p>Você será o primeiro a saber quando uma nova data for confirmada. Seu nome ainda está conosco. Esperando seu momento.</p>

  <p>Obrigado por caminhar este caminho comigo.</p>

  <p>Com amor,<br>
  Edson Pavoni</p>

  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;">
    <strong>Apoie a missão:</strong> Enviar nomes para o Templo Orbital será sempre gratuito. Como um projeto de arte independente, contamos com seu apoio. Se você quiser ajudar, você pode fazer uma doação aqui: <a href="https://orbitaltemple.art/br/support/" style="color: #0066cc;">orbitaltemple.art/br/support</a>
  </p>

  <p>
    <strong>Acompanhe a jornada do Templo Orbital:</strong> <a href="https://instagram.com/edsonpavoni/" style="color: #0066cc;">instagram.com/edsonpavoni/</a>
  </p>
</div>
`;
  }

  return `
<div style="font-family: Georgia, 'Times New Roman', Times, serif; font-size: 17px; line-height: 1.7; color: #333; max-width: 600px;">
  <p style="font-size: 13px; color: #888; margin-bottom: 24px;">
    This is an Orbital Temple Art Satellite update. <a href="${updatesUrl}" style="color: #666;">Read it here in another language</a> or <a href="${unsubscribeUrl}" style="color: #666;">unsubscribe</a>.
  </p>

  <p>Hello from the artist,<br>
  When you keep pushing the limits, sometimes the limits push back.</p>

  <p>On January 16, 2026, the Orbital Temple was launched into space. It was aboard the PSLV-C62. A legendary Indian rocket with more than 60 successful launches.</p>

  <p>But this time, the story was different.</p>

  <p>The rocket lifted off beautifully and reached space. But in the final stage, it lost control. It failed to deploy the satellites. Our temple was in space for only 10 minutes. Then it fell back. It burned into ashes as it entered our atmosphere.</p>

  <p>So, what now? I am Brazilian. We don't give up. Now, we do it again.</p>

  <p>We already have a backup satellite ready. We are talking to space agencies and private companies. We are finding a new rocket for our project.</p>

  <p>Space is hard. But there are already 19,078 of us who sent names. From all over the world, people have replied to this invitation. We are looking at the sky differently.</p>

  <p>You will be the first to know when a new date is confirmed. Your name is still with us. It is waiting for its time.</p>

  <p>Thank you for walking this path with me.</p>

  <p>With love,<br>
  Edson Pavoni</p>

  <p style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd;">
    <strong>Support the mission:</strong> Sending names to the Orbital Temple will always be free. As an independent art project, we rely on your support. If you would like to help, you can make a tax-deductible donation here: <a href="https://orbitaltemple.art/en/support/" style="color: #0066cc;">orbitaltemple.art/en/support</a>
  </p>

  <p>
    <strong>Follow the journey:</strong> <a href="https://instagram.com/edsonpavoni/" style="color: #0066cc;">instagram.com/edsonpavoni/</a>
  </p>
</div>
`;
}

function generateEmailText(recipientEmail: string, lang: 'en' | 'pt') {
  const encodedEmail = Buffer.from(recipientEmail).toString('base64');
  const unsubscribeUrl = `https://orbitaltemple.art/${lang}/unsubscribe?e=${encodedEmail}`;
  const updatesUrl = `https://orbitaltemple.art/${lang}/updates`;

  if (lang === 'pt') {
    return `Esta é uma atualização da obra Templo Orbital.
Leia em outro idioma: ${updatesUrl}
Cancele sua inscrição: ${unsubscribeUrl}

---

Olá do artista,
Quando você empurra os limites, às vezes os limites empurram de volta.

Em 16 de janeiro de 2026, o Templo Orbital foi lançado ao espaço. Estava a bordo do PSLV-C62. Um lendário foguete indiano com mais de 60 lançamentos bem-sucedidos.

Mas desta vez, a história foi diferente.

O foguete decolou belíssimo e alcançou o espaço. Mas no estágio final, perdeu o controle. Falhou em liberar os satélites. Nosso templo ficou no espaço por apenas 10 minutos. Depois caiu de volta. Queimou em cinzas ao entrar na atmosfera.

E agora? Eu sou brasileiro. Nós não desistimos nunca.

Já temos um satélite reserva pronto para um novo lançamento. Estamos conversando com agências espaciais e empresas privadas. Estamos encontrando um novo foguete para nosso projeto.

O espaço é difícil. Mas já somos 19.078 de nós que enviaram nomes. De todo o mundo, pessoas que responderam a este convite. Estamos olhando para o céu de um jeito diferente.

Você será o primeiro a saber quando uma nova data for confirmada. Seu nome ainda está conosco. Esperando seu momento.

Obrigado por caminhar este caminho comigo.

Com amor,
Edson Pavoni

-
Apoie a missão: Enviar nomes para o Templo Orbital será sempre gratuito. Como um projeto de arte independente, contamos com seu apoio. Se você quiser ajudar, você pode fazer uma doação aqui: https://orbitaltemple.art/br/support/

-
Acompanhe a jornada do Templo Orbital: https://instagram.com/edsonpavoni/
`;
  }

  return `This is an Orbital Temple Art Satellite update.
Read it here in another language: ${updatesUrl}
To unsubscribe: ${unsubscribeUrl}

---

Hello from the artist,
When you keep pushing the limits, sometimes the limits push back.

On January 16, 2026, the Orbital Temple was launched into space. It was aboard the PSLV-C62. A legendary Indian rocket with more than 60 successful launches.

But this time, the story was different.

The rocket lifted off beautifully and reached space. But in the final stage, it lost control. It failed to deploy the satellites. Our temple was in space for only 10 minutes. Then it fell back. It burned into ashes as it entered our atmosphere.

So, what now? I am Brazilian. We don't give up. Now, we do it again.

We already have a backup satellite ready. We are talking to space agencies and private companies. We are finding a new rocket for our project.

Space is hard. But there are already 19,078 of us who sent names. From all over the world, people have replied to this invitation. We are looking at the sky differently.

You will be the first to know when a new date is confirmed. Your name is still with us. It is waiting for its time.

Thank you for walking this path with me.

With love,
Edson Pavoni

-
Support the mission: Sending names to the Orbital Temple will always be free. As an independent art project, we rely on your support. If you would like to help, you can make a tax-deductible donation here: https://orbitaltemple.art/en/support/

-
Follow the journey: https://instagram.com/edsonpavoni/
`;
}

// Check if email is unsubscribed
async function isUnsubscribed(email: string): Promise<boolean> {
  const snapshot = await db
    .collection('unsubscribed')
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();
  return !snapshot.empty;
}

// Get unique emails from names collection
async function getUniqueEmails(limit?: number): Promise<Array<{ email: string; language: string }>> {
  console.log('📊 Fetching subscribers from Firestore...');

  const snapshot = await db.collection('names').get();

  // Deduplicate by email, keeping the language preference
  const emailMap = new Map<string, string>();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const email = data.email?.toLowerCase();
    const language = data.language || 'en';

    if (email && !emailMap.has(email)) {
      emailMap.set(email, language);
    }
  }

  let results = Array.from(emailMap.entries()).map(([email, language]) => ({
    email,
    language,
  }));

  if (limit) {
    results = results.slice(0, limit);
  }

  console.log(`📊 Found ${results.length} unique emails`);
  return results;
}

// Determine if should use Portuguese
function shouldUsePT(language: string): boolean {
  const ptLanguages = ['pt', 'br', 'pt-br', 'pt-pt', 'portuguese'];
  return ptLanguages.includes(language.toLowerCase());
}

// Delay helper
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendBatchEmails(limit?: number) {
  console.log('\n🚀 ORBITAL TEMPLE — FIRE AND ASHES UPDATE');
  console.log('==========================================\n');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env');
    process.exit(1);
  }

  // Load already-sent emails
  const alreadySent = loadSentEmails();

  // Get subscribers
  const subscribers = await getUniqueEmails(limit);

  if (subscribers.length === 0) {
    console.log('❌ No subscribers found');
    process.exit(1);
  }

  console.log(`\n📧 Starting to send ${subscribers.length} emails...`);
  console.log(`📬 BCC to ${BCC_EMAIL} every ${BCC_EVERY} emails\n`);

  let sent = 0;
  let skipped = 0;
  let skippedAlreadySent = 0;
  let failed = 0;
  let ptCount = 0;
  let enCount = 0;

  for (let i = 0; i < subscribers.length; i++) {
    const { email, language } = subscribers[i];
    const num = i + 1;

    // Check if already sent in a previous run
    if (alreadySent.has(email.toLowerCase())) {
      console.log(`⏭️  [${num}/${subscribers.length}] Skipped (already sent): ${email}`);
      skippedAlreadySent++;
      continue;
    }

    // Check if unsubscribed
    const unsubscribed = await isUnsubscribed(email);
    if (unsubscribed) {
      console.log(`⏭️  [${num}/${subscribers.length}] Skipped (unsubscribed): ${email}`);
      skipped++;
      continue;
    }

    // Determine language
    const lang: 'en' | 'pt' = shouldUsePT(language) ? 'pt' : 'en';
    const subject = SUBJECTS[lang];

    // Should we BCC?
    const shouldBcc = (sent + 1) % BCC_EVERY === 0;

    try {
      const emailOptions: any = {
        from: 'Edson Pavoni <noreply@orbitaltemple.art>',
        to: [email],
        subject: subject,
        html: generateEmailHtml(email, lang),
        text: generateEmailText(email, lang),
      };

      if (shouldBcc) {
        emailOptions.bcc = [BCC_EMAIL];
      }

      const { data, error } = await resend.emails.send(emailOptions);

      if (error) {
        console.error(`❌ [${num}/${subscribers.length}] Failed: ${email} - ${error.message}`);
        failed++;
      } else {
        sent++;
        recordSentEmail(email);
        if (lang === 'pt') ptCount++;
        else enCount++;

        const bccNote = shouldBcc ? ' (+ BCC)' : '';
        console.log(`✅ [${num}/${subscribers.length}] Sent (${lang.toUpperCase()}): ${email}${bccNote}`);
      }

      // Rate limiting: wait 550ms between emails (Resend allows 2 req/sec)
      await delay(550);
    } catch (err) {
      console.error(`❌ [${num}/${subscribers.length}] Error: ${email} - ${err}`);
      failed++;
    }
  }

  console.log('\n==========================================');
  console.log('📊 SUMMARY');
  console.log('==========================================');
  console.log(`✅ Sent: ${sent} (PT: ${ptCount}, EN: ${enCount})`);
  console.log(`⏭️  Skipped (already sent): ${skippedAlreadySent}`);
  console.log(`⏭️  Skipped (unsubscribed): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📧 Total processed: ${subscribers.length}`);
  console.log('==========================================\n');

  process.exit(0);
}

// Get limit from command line argument
const limitArg = process.argv[2];
const limit = limitArg ? parseInt(limitArg, 10) : undefined;

if (limitArg && isNaN(limit!)) {
  console.error('❌ Invalid limit. Usage: npx tsx send-batch-update.ts [limit]');
  process.exit(1);
}

sendBatchEmails(limit);
