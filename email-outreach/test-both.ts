/**
 * Send TWO test emails (English + Portuguese) to edsonpavoni@gmail.com
 * Tests the final launch email templates
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Final templates from send-launch-emails.ts
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

async function sendTestEmail(language: 'en' | 'pt', name: string, daysAgo: number) {
  const isPortuguese = language === 'pt';

  const subject = isPortuguese
    ? PORTUGUESE_SUBJECT(name)
    : ENGLISH_SUBJECT(name);

  const body = isPortuguese
    ? PORTUGUESE_TEMPLATE(name, daysAgo)
    : ENGLISH_TEMPLATE(name, daysAgo);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Edson Pavoni <noreply@orbitaltemple.art>',
      to: ['edsonpavoni@gmail.com'],
      subject: `[TEST ${language.toUpperCase()}] ${subject}`,
      text: body
    });

    if (error) {
      console.error(`❌ Failed to send ${language.toUpperCase()} test:`, error);
      return false;
    }

    console.log(`✅ ${language.toUpperCase()} test sent! Subject: "${subject}"`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending ${language.toUpperCase()} test:`, error);
    return false;
  }
}

async function main() {
  console.log('🧪 Sending final test emails (English + Portuguese)...\n');

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not set!');
    process.exit(1);
  }

  // Send English test
  console.log('📧 Sending English test email...');
  const enSuccess = await sendTestEmail('en', 'Maria Santos', 365);

  // Wait 1 second between sends
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Send Portuguese test
  console.log('\n📧 Sending Portuguese test email...');
  const ptSuccess = await sendTestEmail('pt', 'João Silva', 730);

  console.log('\n✨ Test complete!\n');
  console.log('📬 Check your inbox at edsonpavoni@gmail.com');
  console.log('   You should receive 2 test emails:');
  console.log('   - [TEST EN] Maria Santos is going to space in less than 2 months');
  console.log('   - [TEST PT] João Silva vai para o espaço em menos de 2 meses\n');

  if (enSuccess && ptSuccess) {
    console.log('💡 Next step: Review the emails and run the full campaign:');
    console.log('   RESEND_API_KEY=REDACTED_RESEND_KEY npx tsx send-launch-emails.ts\n');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
