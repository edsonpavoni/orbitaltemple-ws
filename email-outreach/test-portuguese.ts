/**
 * Send ONE Portuguese test email to edsonpavoni@gmail.com
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

async function main() {
  console.log('🇧🇷 Sending Portuguese test email...\n');

  // Sample Portuguese test
  const testName = "João Silva";
  const testDays = 365;

  const subject = `[TEST PT] ${testName} vai para o espaço em menos de 2 meses`;
  const body = PORTUGUESE_TEMPLATE(testName, testDays);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Edson Pavoni <noreply@orbitaltemple.art>',
      to: ['edsonpavoni@gmail.com'],
      subject: subject,
      text: body
    });

    if (error) {
      console.error('❌ Failed:', error);
      process.exit(1);
    }

    console.log('✅ Portuguese test email sent!');
    console.log(`   Subject: ${subject}`);
    console.log(`   Name: ${testName}`);
    console.log(`   Days ago: ${testDays}`);
    console.log('\n📬 Check your inbox at edsonpavoni@gmail.com\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
