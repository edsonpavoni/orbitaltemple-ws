/**
 * Send 2 test emails with REAL data: 1 English + 1 Portuguese
 * Both sent to edsonpavoni@gmail.com for testing
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRecord {
  email: string;
  name: string;
  daysAgo: number;
  language: string;
  submissionDate: string;
}

// Email templates - FINAL VERSION
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
 * Parse CSV and get test records
 */
function getTestRecords(filePath: string): { en: EmailRecord | null, pt: EmailRecord | null } {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let enRecord: EmailRecord | null = null;
  let ptRecord: EmailRecord | null = null;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(',');
    if (values.length < 5) continue;

    const record: EmailRecord = {
      email: values[0].trim(),
      name: values[1].trim(),
      daysAgo: parseInt(values[2]),
      language: values[3].trim(),
      submissionDate: values[4].trim()
    };

    // Get first English record from edsonpavoni@gmail.com
    if (!enRecord && record.language === 'en' && record.email === 'edsonpavoni@gmail.com') {
      enRecord = record;
    }

    // Get first Portuguese record from any email
    if (!ptRecord && record.language === 'pt') {
      ptRecord = record;
    }

    // Stop when we have both
    if (enRecord && ptRecord) break;
  }

  return { en: enRecord, pt: ptRecord };
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
      to: [testEmail],
      subject: `[TEST ${record.language.toUpperCase()}] ${subject}`,
      text: body
    });

    if (error) {
      console.error(`❌ Failed:`, error);
      return false;
    }

    console.log(`✅ ${record.language.toUpperCase()} sent: "${record.name}" (${record.daysAgo} days ago)`);
    return true;
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

/**
 * Main test function
 */
async function main() {
  console.log('🧪 TEST: 1 English + 1 Portuguese (real data)\n');

  const TEST_EMAIL = 'edsonpavoni@gmail.com';

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not set!');
    process.exit(1);
  }

  // Load CSV
  const csvPath = path.join(__dirname, 'output', 'all-names.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found!');
    process.exit(1);
  }

  const records = getTestRecords(csvPath);

  if (!records.en || !records.pt) {
    console.error('❌ Could not find both English and Portuguese records!');
    process.exit(1);
  }

  console.log('📋 Test records:\n');
  console.log(`   EN: "${records.en.name}" - ${records.en.daysAgo} days ago (${records.en.submissionDate})`);
  console.log(`   PT: "${records.pt.name}" - ${records.pt.daysAgo} days ago (${records.pt.submissionDate})\n`);

  console.log(`📧 Sending both to: ${TEST_EMAIL}\n`);

  // Send English test
  const enSuccess = await sendTestEmail(records.en, TEST_EMAIL);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Send Portuguese test
  const ptSuccess = await sendTestEmail(records.pt, TEST_EMAIL);

  console.log('\n✨ Test complete!\n');
  console.log(`📊 Results: ${(enSuccess ? 1 : 0) + (ptSuccess ? 1 : 0)}/2 sent\n`);
  console.log('📬 Check your inbox at edsonpavoni@gmail.com');
  console.log('   Verify the variables (name, days ago) work in both languages!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
