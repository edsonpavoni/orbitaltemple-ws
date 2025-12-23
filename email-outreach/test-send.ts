/**
 * TEST SCRIPT - Send launch emails for edsonpavoni@gmail.com names only
 * This sends all your submitted names to YOU, so you can preview the emails
 *
 * Usage: tsx test-send.ts
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRecord {
  email: string;
  name: string;
  daysAgo: number;
  language: string;
  submissionDate: string;
}

// Email templates (same as main script)
const ENGLISH_SUBJECT = (name: string) => `${name} is going to space in less than 2 months`;
const PORTUGUESE_SUBJECT = (name: string) => `${name} vai para o espaço em menos de 2 meses`;

const ENGLISH_TEMPLATE = (name: string, daysAgo: number) => `
${daysAgo} days ago, you decided to participate in the Orbital Temple project by sending the name "${name}" to ascend into space.

I'm writing to tell you: our launch window is official.

After 3 years of work and 3 cancelled launches by SpaceX—not their fault—we partnered with the Indian Space Research Organisation (ISRO) to bring our artwork to orbit.

Last week, ISRO officially locked the launch window:

December 25, 2025 – January 23, 2026

This means that after 3 years of development, we are less than 2 months away from seeing the Orbital Temple in space.

This is a very special moment for me as an artist, for the more than 30 people involved in this project, and I hope it is for you too.

The new website is live:
https://orbitaltemple.art

You can send more names to the temple or share it with your friends and family.

A lot of people have been asking how to support this artwork. If you'd like to contribute to the project, you can visit:
https://orbitaltemple.art/support/

Thank you for being part of this journey to space.

Edson Pavoni

P.S. Follow along at https://instagram.com/edsonpavoni for launch updates.
`;

const PORTUGUESE_TEMPLATE = (name: string, daysAgo: number) => `
Há ${daysAgo} dias, você decidiu participar do projeto Orbital Temple enviando o nome "${name}" para ascender ao espaço.

Estou escrevendo para dizer: nossa janela de lançamento é oficial.

Depois de 3 anos de trabalho e 3 lançamentos cancelados pela SpaceX—não por culpa deles—fizemos parceria com a Organização Indiana de Pesquisa Espacial (ISRO) para levar nossa obra de arte à órbita.

Na semana passada, a ISRO oficialmente confirmou a janela de lançamento:

25 de dezembro de 2025 – 23 de janeiro de 2026

Isso significa que, após 3 anos de desenvolvimento, estamos a menos de 2 meses de ver o Orbital Temple no espaço.

Este é um momento muito especial para mim como artista, para as mais de 30 pessoas envolvidas neste projeto, e espero que seja para você também.

O novo site está no ar:
https://orbitaltemple.art

Você pode enviar mais nomes para o templo ou compartilhar com seus amigos e família.

Muitas pessoas têm perguntado como apoiar esta obra de arte. Se você quiser contribuir com o projeto, pode visitar:
https://orbitaltemple.art/support/

Obrigado por fazer parte desta jornada ao espaço.

Edson Pavoni

P.S. Acompanhe em https://instagram.com/edsonpavoni para atualizações do lançamento.
`;

/**
 * Parse CSV and filter for test email
 */
function getTestRecords(filePath: string, testEmail: string): EmailRecord[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const records: EmailRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(',');
    if (values.length < 5) continue;

    const email = values[0].trim();

    // Only include records for test email
    if (email === testEmail) {
      records.push({
        email: email,
        name: values[1].trim(),
        daysAgo: parseInt(values[2]),
        language: values[3].trim(),
        submissionDate: values[4].trim()
      });
    }
  }

  return records;
}

/**
 * Send test email
 */
async function sendTestEmail(record: EmailRecord, testEmail: string): Promise<boolean> {
  try {
    const isPortuguese = record.language === 'pt';

    const subject = isPortuguese
      ? PORTUGUESE_SUBJECT(record.name)
      : ENGLISH_SUBJECT(record.name);

    const body = isPortuguese
      ? PORTUGUESE_TEMPLATE(record.name, record.daysAgo)
      : ENGLISH_TEMPLATE(record.name, record.daysAgo);

    const { data, error } = await resend.emails.send({
      from: 'Edson Pavoni <noreply@orbitaltemple.art>',
      to: [testEmail], // Send to test email instead of original
      subject: `[TEST] ${subject}`,
      text: body
    });

    if (error) {
      console.error(`❌ Failed:`, error);
      return false;
    }

    console.log(`✅ Sent test email for name: "${record.name}" (${record.daysAgo} days ago, ${record.language})`);
    return true;
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

/**
 * Sleep function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main test function
 */
async function main() {
  console.log('🧪 TEST MODE - Orbital Temple Launch Emails\n');

  const TEST_EMAIL = 'edsonpavoni@gmail.com';

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not set!');
    process.exit(1);
  }

  // Load CSV
  const csvPath = path.join(__dirname, 'output', 'all-names.csv');
  console.log(`📁 Loading test records for: ${TEST_EMAIL}\n`);

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found!');
    process.exit(1);
  }

  const records = getTestRecords(csvPath, TEST_EMAIL);

  console.log(`✅ Found ${records.length} names submitted by ${TEST_EMAIL}\n`);

  if (records.length === 0) {
    console.log('⚠️  No test records found. Add some names with this email first.');
    process.exit(0);
  }

  // Show what we'll send
  console.log('📋 Test emails that will be sent:\n');
  records.forEach((r, i) => {
    console.log(`   ${i + 1}. "${r.name}" - ${r.daysAgo} days ago (${r.language})`);
  });

  console.log(`\n📧 All ${records.length} emails will be sent to: ${TEST_EMAIL}\n`);
  console.log('⏳ Starting in 3 seconds... (Ctrl+C to cancel)\n');
  await sleep(3000);

  console.log('🚀 Sending test emails...\n');

  let successCount = 0;
  let failCount = 0;

  for (const record of records) {
    const success = await sendTestEmail(record, TEST_EMAIL);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Wait 500ms between sends (rate limiting)
    await sleep(500);
  }

  console.log('\n✨ Test complete!\n');
  console.log(`📊 Results:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}\n`);

  console.log('📬 Check your inbox at edsonpavoni@gmail.com');
  console.log('   You should receive ${successCount} test emails');
  console.log('   Subject lines start with [TEST]\n');

  console.log('💡 Next steps:');
  console.log('   1. Review the emails in your inbox');
  console.log('   2. Check formatting, links, and content');
  console.log('   3. If everything looks good, run the REAL script:');
  console.log('      npx tsx send-launch-emails.ts\n');
}

// Run
main()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
