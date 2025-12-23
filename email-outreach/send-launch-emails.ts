/**
 * Send Orbital Temple launch emails via Resend API
 * Uses bilingual templates based on language field in CSV
 *
 * Usage: tsx send-launch-emails.ts
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRecord {
  email: string;
  name: string;
  daysAgo: number;
  language: string;
  submissionDate: string;
}

// Email templates
const ENGLISH_SUBJECT = (name: string) => `${name} is going to space in less than 2 months`;
const PORTUGUESE_SUBJECT = (name: string) => `${name} irá para o espaço em menos de 2 meses`;

const ENGLISH_TEMPLATE = (name: string, daysAgo: number) => `Hello from the artist,

${daysAgo} days ago,
you decided to participate in the Orbital Temple artwork
by sending the name "${name}" to ascend into space.

Today, I can finally share this exciting news.
The Orbital Temple is going to space in the next two months.

To remind you, the Orbital Temple is an artwork and a satellite,
aiming to be a radically inclusive temple
in a place where no wall can reach.
It carries the names people decide to send to it;
today that number is 12,247 names and growing every day.

You may have come in contact with this artwork during
the Mercosul Biennale in Brazil,
the Tashkent Biennale in Uzbekistan,
or the Miami Art Week in the US.

After three years of work,
three cancelled launches by SpaceX,
we partnered with the Indian Space Research Organisation (ISRO)
who will bring our artwork to Earth's orbit.

Last week,
ISRO officially locked the launch window:
December 25, 2025 – January 23, 2026.

We are now just weeks away
from seeing the Orbital Temple
achieve its mission in space.

This is a very special moment for me as an artist,
for the more than 30 people involved in this project,
and I hope it is for you too.

The new website is live at https://orbitaltemple.art.
You can send more names to the temple or share it with your friends and family.

Some people have asked how to support this artwork.
If you'd like to contribute to the project, you can visit: https://orbitaltemple.art/support/.


Thank you for being part of this journey.

with love,
Edson Pavoni


P.S. Follow along at https://www.instagram.com/edsonpavoni/ for launch updates.
`;

const PORTUGUESE_TEMPLATE = (name: string, daysAgo: number) => `Olá do artista,

${daysAgo} dias atrás,
você decidiu participar da obra de arte Templo Orbital,
enviando o nome "${name}" para ascender ao espaço.

Hoje, enfim, posso compartilhar com você
o Templo Orbital irá para o espaço nos próximos dois meses.

Para você se lembrar,
o Templo Orbital é uma obra de arte e um satélite,
um templo radicalmente inclusivo
em um lugar onde nenhum muro pode alcançar
carregando os nomes que pessoas como você decidiram enviar para ele.
Neste momento são 12,247 nomes.

você provavelmente ficou sabendo dele durante
a Bienal do Mercosul no Brasil,
a Bienal de Tashkent no Uzbequistão,
ou a Semana de Arte de Miami nos EUA.

Depois de quase três anos de trabalho
três lançamentos cancelados pela SpaceX,
temos um novo parceiro,
a Organização Indiana de Pesquisa Espacial (ISRO).
Eles irão levar a nossa obra de arte para a órbita da Terra.

Na semana passada, a ISRO divulgou oficialmente a janela de lançamento:
25 de dezembro de 2025 a 23 de janeiro de 2026.

Estamos a apenas algumas semanas de ver o Templo Orbital
cumprir sua missão no espaço.

Este é um momento muito especial para mim como artista,
para as mais de 30 pessoas envolvidas neste projeto,
e espero que seja para você também.


O novo site está no ar em https://orbitaltemple.art
Você pode enviar mais nomes para o templo ou compartilhar com seus amigos e familiares.

Algumas pessoas perguntaram como apoiar esta obra de arte.
Se você quiser contribuir com o projeto, visite: https://orbitaltemple.art/support/.

Obrigado por fazer parte desta jornada.

Com carinho,
Edson Pavoni

P.S.: Me siga em https://www.instagram.com/edsonpavoni/ para acompanhar as noticias do lançamento.
`;

/**
 * Parse CSV file
 */
function parseCSV(filePath: string): EmailRecord[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');

  const records: EmailRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = lines[i].split(',');
    if (values.length < 5) continue; // Skip malformed lines

    records.push({
      email: values[0].trim(),
      name: values[1].trim(),
      daysAgo: parseInt(values[2]),
      language: values[3].trim(),
      submissionDate: values[4].trim()
    });
  }

  return records;
}

/**
 * Send single email via Resend
 */
async function sendEmail(record: EmailRecord, bccEmail?: string): Promise<boolean> {
  try {
    const isPortuguese = record.language === 'pt';

    const subject = isPortuguese
      ? PORTUGUESE_SUBJECT(record.name)
      : ENGLISH_SUBJECT(record.name);

    const body = isPortuguese
      ? PORTUGUESE_TEMPLATE(record.name, record.daysAgo)
      : ENGLISH_TEMPLATE(record.name, record.daysAgo);

    const emailPayload: any = {
      from: 'Edson Pavoni <noreply@orbitaltemple.art>',
      to: [record.email],
      subject: subject,
      text: body
    };

    // Add BCC if provided
    if (bccEmail) {
      emailPayload.bcc = [bccEmail];
    }

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error(`❌ Failed to send to ${record.email}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error sending to ${record.email}:`, error);
    return false;
  }
}

/**
 * Sleep function for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main sending function
 */
async function main() {
  console.log('🚀 Orbital Temple Launch Email Campaign\n');

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY environment variable not set!');
    console.log('Set it in functions/.env file');
    process.exit(1);
  }

  // Load CSV
  const csvPath = path.join(__dirname, 'output', 'all-names.csv');
  console.log(`📁 Loading CSV from: ${csvPath}`);

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found!');
    console.log('Run the export script first: tsx export-names-for-resend.ts');
    process.exit(1);
  }

  const records = parseCSV(csvPath);
  console.log(`✅ Loaded ${records.length} email records\n`);

  // Count by language
  const englishCount = records.filter(r => r.language === 'en').length;
  const portugueseCount = records.filter(r => r.language === 'pt').length;

  console.log(`📊 Email breakdown:`);
  console.log(`   English: ${englishCount}`);
  console.log(`   Portuguese: ${portugueseCount}\n`);

  // Confirm before sending
  console.log('⚠️  WARNING: This will send emails to 12K+ people!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  await sleep(5000);

  console.log('📧 Starting email send...\n');

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  // Send emails with rate limiting
  for (let i = 0; i < records.length; i++) {
    const record = records[i];

    // BCC edsonpavoni@gmail.com on first 5 sends for verification
    const bccEmail = i < 5 ? 'edsonpavoni@gmail.com' : undefined;

    // Send email
    const success = await sendEmail(record, bccEmail);

    if (success) {
      successCount++;
      if (i < 5) {
        console.log(`✅ [BCC TO YOU] Sent ${i + 1}/5: ${record.email} - "${record.name}" (${record.language})`);
      } else if (successCount % 100 === 0) {
        console.log(`✅ Sent ${successCount}/${records.length} emails...`);
      }
    } else {
      failCount++;
    }

    // Rate limiting: 2 requests per second (Resend limit)
    // Wait 500ms between each send (= 2 per second)
    if (i < records.length - 1) {
      await sleep(500);
    }

    // Progress indicator every 500 emails
    if ((i + 1) % 500 === 0) {
      const elapsed = Date.now() - startTime;
      const rate = (i + 1) / (elapsed / 1000);
      const remaining = records.length - (i + 1);
      const eta = remaining / rate;

      console.log(`\n📊 Progress: ${i + 1}/${records.length} (${Math.round((i+1)/records.length*100)}%)`);
      console.log(`   Rate: ${rate.toFixed(2)} emails/sec`);
      console.log(`   ETA: ${Math.round(eta / 60)} minutes\n`);
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;

  console.log('\n✨ Campaign complete!\n');
  console.log(`📊 Final Statistics:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⏱️  Time: ${Math.round(totalTime / 60)} minutes`);
  console.log(`   📧 Rate: ${(successCount / totalTime).toFixed(2)} emails/sec\n`);

  // Save log
  const logPath = path.join(__dirname, 'output', `send-log-${new Date().toISOString()}.txt`);
  const logContent = `
Orbital Temple Launch Email Campaign
Date: ${new Date().toISOString()}
Total: ${records.length}
Success: ${successCount}
Failed: ${failCount}
Time: ${Math.round(totalTime / 60)} minutes
  `.trim();

  fs.writeFileSync(logPath, logContent);
  console.log(`📝 Log saved to: ${logPath}\n`);
}

// Run the script
main()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
