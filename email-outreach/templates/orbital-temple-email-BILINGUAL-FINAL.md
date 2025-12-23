# Orbital Temple Community Email - BILINGUAL FINAL
**To:** 12,000 subscribers
**Platform:** Resend Pro ($20/month)
**Languages:** English + Portuguese
**Send Date:** Friday, December 13, 2025

---

## EMAIL VERSION 1: ENGLISH

**Subject:** [NAME] is going to space in less than 2 months

[DAYS_AGO] days ago, you decided to participate in the Orbital Temple project by sending the name "[NAME]" to ascend into space.

I'm writing to tell you: **our launch window is official.**

After 3 years of work and 3 cancelled launches by SpaceX—not their fault—we partnered with the Indian Space Research Organisation (ISRO) to bring our artwork to orbit.

Last week, ISRO officially locked the launch window:

**December 25, 2025 – January 23, 2026**

This means that after 3 years of development, we are **less than 2 months away** from seeing the Orbital Temple in space.

This is a very special moment for me as an artist, for the more than 30 people involved in this project, and I hope it is for you too.

**The new website is live:**
https://orbitaltemple.art

You can send more names to the temple or share it with your friends and family.

A lot of people have been asking how to support this artwork. If you'd like to contribute to the project, you can visit:
https://orbitaltemple.art/support/

Thank you for being part of this journey to space.

Edson Pavoni

P.S. Follow along at [Instagram/social media links] for launch updates.

---

## EMAIL VERSION 2: PORTUGUESE (PORTUGUÊS)

**Assunto (Subject):** [NAME] vai para o espaço em menos de 2 meses

Há [DAYS_AGO] dias, você decidiu participar do projeto Orbital Temple enviando o nome "[NAME]" para ascender ao espaço.

Estou escrevendo para dizer: **nossa janela de lançamento é oficial.**

Depois de 3 anos de trabalho e 3 lançamentos cancelados pela SpaceX—não por culpa deles—fizemos parceria com a Organização Indiana de Pesquisa Espacial (ISRO) para levar nossa obra de arte à órbita.

Na semana passada, a ISRO oficialmente confirmou a janela de lançamento:

**25 de dezembro de 2025 – 23 de janeiro de 2026**

Isso significa que, após 3 anos de desenvolvimento, estamos a **menos de 2 meses** de ver o Orbital Temple no espaço.

Este é um momento muito especial para mim como artista, para as mais de 30 pessoas envolvidas neste projeto, e espero que seja para você também.

**O novo site está no ar:**
https://orbitaltemple.art

Você pode enviar mais nomes para o templo ou compartilhar com seus amigos e família.

Muitas pessoas têm perguntado como apoiar esta obra de arte. Se você quiser contribuir com o projeto, pode visitar:
https://orbitaltemple.art/support/

Obrigado por fazer parte desta jornada ao espaço.

Edson Pavoni

P.S. Acompanhe em [Instagram/social media links] para atualizações do lançamento.

---

## TECHNICAL REQUIREMENTS

### Firebase Database Structure Needed:

```javascript
{
  email: "user@example.com",
  name: "Maria Silva",           // Name submitted to go to space
  createdAt: "2024-01-15",       // Date of submission
  language: "pt"                 // NEW FIELD - needs to be added
}
```

### Calculations Needed:

```javascript
// Calculate days ago from submission
const submissionDate = new Date(record.createdAt);
const today = new Date('2025-12-13');
const daysAgo = Math.floor((today - submissionDate) / (1000 * 60 * 60 * 24));
```

### Language Logic:

**Current situation:** No language field in database (yet)

**Solution for this send:**
- Default everyone to English initially
- OR: Use email domain heuristics (.br = Portuguese)
- OR: Send Portuguese to Brazilian email domains, English to everyone else

**For future:** Start capturing language preference on website

---

## IMPLEMENTATION STEPS

### PHASE 1: Update Website to Capture Language (Do This First!)

**File to update:** Website form where people submit names

**Add language detection:**
1. Detect browser language
2. Store in Firebase `language` field
3. Or add language selector on form

**Code example:**
```javascript
// Detect browser language
const userLanguage = navigator.language || navigator.userLanguage;
const language = userLanguage.startsWith('pt') ? 'pt' : 'en';

// Save to Firebase with language field
await addDoc(collection(db, "names"), {
  email: email,
  name: name,
  createdAt: new Date().toISOString(),
  language: language  // NEW FIELD
});
```

---

### PHASE 2: Export Firebase Data with Calculations

**Script needed:** Export Firebase "names" to CSV with calculated fields

**Output CSV structure:**
```csv
email,name,daysAgo,language
user1@example.com,Maria Silva,352,pt
user2@gmail.com,John Doe,245,en
user3@gmail.com.br,João Santos,180,pt
```

**Script location:** Create at `/Users/edsonpavoni/Library/CloudStorage/Dropbox/2025 Witness/code/scripts/export-names-for-email.js`

---

### PHASE 3: Split into Two Lists

**List 1: English subscribers**
- Import to Resend audience: "Orbital Temple - English"
- Use English email template

**List 2: Portuguese subscribers**
- Import to Resend audience: "Orbital Temple - Portuguese"
- Use Portuguese email template

---

### PHASE 4: Set Up Resend Templates

**Template 1: orbital-temple-launch-en**
- Language: English
- Merge fields: `{{name}}`, `{{daysAgo}}`

**Template 2: orbital-temple-launch-pt**
- Language: Portuguese
- Merge fields: `{{name}}`, `{{daysAgo}}`

---

## LANGUAGE DETECTION STRATEGY (For This Send)

Since you don't have language in database yet, here are options:

### Option A: Email Domain Heuristics
```javascript
if (email.endsWith('.br') || email.includes('uol.com') || email.includes('globo.com')) {
  language = 'pt';
} else {
  language = 'en';
}
```

### Option B: Default Everyone to English
- Send English to all 12K
- Add note: "Versão em português disponível em / Portuguese version available at [link]"

### Option C: Send Both Languages (Smart Default)
- Primary content in English
- Add Portuguese version below
- Longer email but covers everyone

### Option D: Ask Current Database to Update Preference
- Send quick email: "Choose your language / Escolha seu idioma"
- Link to simple form
- Wait 2-3 days for responses
- Then send main announcement

**My Recommendation: Option A (Email Domain Heuristics)**
- Detects Brazilian emails (.br domains)
- Sends Portuguese to those
- English to everyone else
- Best balance of accuracy and simplicity

---

## TIMELINE ADJUSTMENT

**Tonight (Dec 9):**
- ✅ Email drafts completed (both languages)
- ⬜ Create Firebase export script

**Tomorrow (Dec 10):**
- ⬜ Update website to capture language preference (for future)
- ⬜ Export Firebase database with calculations
- ⬜ Split into English/Portuguese lists
- ⬜ Upgrade Resend to Pro ($20)

**Wednesday (Dec 11):**
- ⬜ Import lists to Resend
- ⬜ Create email templates (EN + PT)
- ⬜ Test send to yourself (both versions)

**Thursday (Dec 12):**
- ⬜ Final review and approve
- ⬜ Schedule sends

**Friday (Dec 13):**
- ⬜ Send English version (morning)
- ⬜ Send Portuguese version (morning)
- ⬜ Monitor deliverability

---

## MERGE FIELDS SUMMARY

**Required fields in CSV:**
- `email` - Recipient email address
- `name` - Name they submitted to go to space
- `daysAgo` - Calculated days since submission
- `language` - en or pt (for splitting lists)

**In email template:**
- `{{name}}` - Replaced with submitted name
- `{{daysAgo}}` - Replaced with calculated days

**Example:**
- CSV: `maria@example.com.br,Maria Silva,352,pt`
- Email: "Há **352** dias, você decidiu participar do projeto Orbital Temple enviando o nome "**Maria Silva**" para ascender ao espaço."

---

## NEXT ACTION NEEDED

Would you like me to create the Firebase export script that:
1. Connects to your Firebase database
2. Reads all records from "names" collection
3. Calculates days since submission
4. Detects language (via email domain heuristics)
5. Exports to CSV for Resend import

I'll need:
- Firebase project credentials/config
- Current database structure (what fields exist?)
- Confirmation on language detection method (email domain heuristics ok?)

---

**Status:** Email drafts complete (English + Portuguese), ready to create export script.
