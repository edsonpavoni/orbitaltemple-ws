/**
 * Send test email for Orbital Temple Update — Fire and Ashes
 *
 * Usage: cd email-outreach && npx tsx send-test-update.ts [en|pt]
 */

import { Resend } from 'resend';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECTS = {
  en: 'Orbital Temple Update: Fire and Ashes',
  pt: 'Atualização Templo Orbital: Fogo e Cinzas',
};

function generateEmailHtml(recipientEmail: string, lang: 'en' | 'pt' = 'en') {
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

function generateEmailText(recipientEmail: string, lang: 'en' | 'pt' = 'en') {
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

async function sendTestEmail(lang: 'en' | 'pt' = 'en') {
  const testRecipient = 'edsonpavoni@gmail.com';
  const subject = SUBJECTS[lang];

  console.log(`📧 Sending test email (${lang.toUpperCase()})...\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env');
    process.exit(1);
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Edson Pavoni <noreply@orbitaltemple.art>',
      to: [testRecipient],
      subject: subject,
      html: generateEmailHtml(testRecipient, lang),
      text: generateEmailText(testRecipient, lang),
    });

    if (error) {
      console.error('❌ Failed to send:', error);
      process.exit(1);
    }

    console.log('✅ Test email sent successfully!');
    console.log('📬 To:', testRecipient);
    console.log('📋 Subject:', subject);
    console.log('🆔 Email ID:', data?.id);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

// Get language from command line argument
const lang = (process.argv[2] === 'pt' ? 'pt' : 'en') as 'en' | 'pt';
sendTestEmail(lang);
