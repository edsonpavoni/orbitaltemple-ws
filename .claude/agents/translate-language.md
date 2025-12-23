# Translation Automation Agent for Orbital Temple Website

## Overview

This document provides a complete, step-by-step workflow for translating the Orbital Temple website to any new language. The process includes automated translation via Google Cloud Translation API, code updates, comprehensive testing, and production verification.

## Current Translation Status

- **Currently Translated**: English (en), Hindi (hi)
- **Translation Files per Language**: 21 JSON files
- **Total Supported Languages**: 31 languages (30 from Google Translate + English)
- **Translation Method**: Static translation files (no runtime translation)

## Complete Translation Workflow

### Phase 1: Pre-requisites Check

Before starting translation, verify all requirements are met:

#### 1.1 Verify Google Cloud Translation API Configuration

**Check 1: API Key or Service Account**

```bash
# Option 1: Check for API Key in .env
cat .env | grep GOOGLE_TRANSLATE_API_KEY

# Option 2: Check for Service Account credentials
cat .env | grep GOOGLE_APPLICATION_CREDENTIALS
```

**If NOT configured:**

1. Get API Key:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create an API key
   - Enable Cloud Translation API
   - Add to .env: `GOOGLE_TRANSLATE_API_KEY=your_key`

2. OR use Service Account (recommended for production):
   - Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Create a service account with "Cloud Translation API User" role
   - Download JSON key file
   - Add to .env: `GOOGLE_APPLICATION_CREDENTIALS=./path-to-key.json`

#### 1.2 Verify Language Code is Valid

**Supported Language Codes:**

Google Translate supports 130+ languages. Common codes include:
- ar (Arabic), bg (Bulgarian), cs (Czech), da (Danish), de (German)
- el (Greek), es (Spanish), et (Estonian), fi (Finnish), fr (French)
- hu (Hungarian), id (Indonesian), it (Italian), ja (Japanese), ko (Korean)
- lt (Lithuanian), lv (Latvian), nb (Norwegian), nl (Dutch), pl (Polish)
- pt (Portuguese), ro (Romanian), ru (Russian), sk (Slovak), sl (Slovenian)
- sv (Swedish), tr (Turkish), uk (Ukrainian), zh (Chinese)

**Verify language code:**
```bash
# Check if the language code is in the SUPPORTED_LANGUAGES list
grep -A 50 "SUPPORTED_LANGUAGES" /Users/edsonpavoni/orbitaltemple-ws-clean/src/lib/i18n.ts | grep "code: '<LANG_CODE>'"
```

#### 1.3 Verify English Source Files Exist

**Required source files in `/public/locales/en/`:**

```bash
# List all English source files (should be 21 files)
ls -1 /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/en/
```

**Expected files:**
1. artist.json
2. artwork.json
3. brief-history.json
4. common.json
5. countdown.json
6. donate.json
7. education.json
8. home.json
9. how-it-works.json
10. info.json
11. manifesto.json
12. milestones.json
13. notify-me.json
14. partners.json
15. press.json
16. send-a-name.json
17. space-launch.json
18. support.json
19. sustainability.json
20. team.json
21. technical.json

**Verification:**
```bash
# Count files (should output 21)
ls -1 /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/en/*.json | wc -l
```

---

### Phase 2: Translation Execution

#### 2.1 Run Translation Script

**Command:**
```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean
pnpm translate:google --lang <LANG_CODE> --force
```

**Example:**
```bash
# Translate to Portuguese
pnpm translate:google --lang pt --force

# Translate to French
pnpm translate:google --lang fr --force

# Translate to German
pnpm translate:google --lang de --force
```

**What the script does:**
1. Reads all 21 JSON files from `/public/locales/en/`
2. Translates each file using Google Cloud Translation API
3. Preserves JSON structure and nested keys
4. Creates target language directory: `/public/locales/<LANG_CODE>/`
5. Saves 21 translated JSON files
6. Reports success/failure for each file

#### 2.2 Monitor Translation Progress

**Expected console output:**

```
🌐 Orbital Temple - Google Cloud Translation
=============================================

📁 Found 21 source files:
   - artist.json
   - artwork.json
   - brief-history.json
   - common.json
   - countdown.json
   - donate.json
   - education.json
   - home.json
   - how-it-works.json
   - info.json
   - manifesto.json
   - milestones.json
   - notify-me.json
   - partners.json
   - press.json
   - send-a-name.json
   - space-launch.json
   - support.json
   - sustainability.json
   - team.json
   - technical.json

🎯 Target languages: 1
   Translating to: pt

[1/1] 🌐 PT
────────────────────────────────────────
  🔄 Translating artist.json...
  ✅ artist.json translated successfully
  🔄 Translating artwork.json...
  ✅ artwork.json translated successfully
  ...
  🔄 Translating technical.json...
  ✅ technical.json translated successfully


📊 Translation Summary
======================
Total tasks:    21
✅ Successful:  21
❌ Failed:      0
⏭️  Skipped:     0

📁 Translations saved in: /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales

✨ All translations completed successfully!
   Files are saved and ready to use - no runtime translation needed!
```

#### 2.3 Verify Translation Files Were Created

**Check 1: Directory created**
```bash
# Verify the language directory exists
ls -d /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>
```

**Check 2: All 21 files created**
```bash
# Count files in the new language directory (should be 21)
ls -1 /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/*.json | wc -l
```

**Check 3: File sizes are reasonable**
```bash
# List files with sizes
ls -lh /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/
```

Expected file sizes (approximate):
- artist.json: ~10-15KB
- artwork.json: ~4-6KB
- brief-history.json: ~20-25KB
- common.json: ~2KB
- countdown.json: ~600 bytes
- donate.json: ~3-4KB
- education.json: ~12-15KB
- home.json: ~600 bytes
- how-it-works.json: ~1-2KB
- info.json: ~1-2KB
- manifesto.json: ~10-12KB
- milestones.json: ~1KB
- notify-me.json: ~1KB
- partners.json: ~5-7KB
- press.json: ~20-25KB
- send-a-name.json: ~1-2KB
- space-launch.json: ~4-5KB
- support.json: ~20-25KB
- sustainability.json: ~10-12KB
- team.json: ~4-5KB
- technical.json: ~1-2KB

#### 2.4 Check for Translation Errors or Warnings

**Review script output for:**
- ❌ Failed translations
- API errors (rate limiting, authentication)
- Empty or malformed JSON files
- Missing nested keys

**If errors occur:**
```bash
# Check individual file validity
cat /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/common.json | jq .

# Re-run translation for failed files
pnpm translate:google --lang <LANG_CODE> --force
```

---

### Phase 3: Code Updates

#### 3.1 Update LanguageSwitcher Component

**File:** `/Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx`

**Current state:**
```typescript
const TRANSLATED_LANGS = ['en', 'hi'];
```

**Update to include new language:**
```typescript
const TRANSLATED_LANGS = ['en', 'hi', '<LANG_CODE>'];
```

**Examples:**

For Portuguese (pt):
```typescript
const TRANSLATED_LANGS = ['en', 'hi', 'pt'];
```

For French (fr):
```typescript
const TRANSLATED_LANGS = ['en', 'hi', 'fr'];
```

For multiple languages:
```typescript
const TRANSLATED_LANGS = ['en', 'hi', 'pt', 'fr', 'de', 'es'];
```

**Using Edit tool:**
```bash
# Read the file first
Read /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx

# Edit the TRANSLATED_LANGS array
Edit /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx
old_string: "  const TRANSLATED_LANGS = ['en', 'hi'];"
new_string: "  const TRANSLATED_LANGS = ['en', 'hi', 'pt'];"
```

#### 3.2 Verify i18n Configuration (No Changes Needed)

The `/src/lib/i18n.ts` file already includes all 31 supported languages in the `SUPPORTED_LANGUAGES` array. No changes are required here.

**Verify language is in the list:**
```bash
# Check if language code exists in i18n.ts
grep "code: '<LANG_CODE>'" /Users/edsonpavoni/orbitaltemple-ws-clean/src/lib/i18n.ts
```

---

### Phase 4: Testing

#### 4.1 Start Development Server

```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean
pnpm dev
```

Server should start at: http://localhost:4321

#### 4.2 Test Language Switcher

**Steps:**
1. Open http://localhost:4321 in browser
2. Click the language/globe icon in the top navigation
3. Verify the new language appears in the "Fully Translated" section
4. Click on the new language
5. Verify the language drawer closes
6. Verify the page content changes to the new language

**Expected behavior:**
- Language switcher shows updated count (e.g., "3 fully translated • 31 languages ready")
- New language appears in the first optgroup ("Fully Translated")
- Selecting the language triggers immediate content update
- No English fallback text should be visible

#### 4.3 Test Homepage (/)

**Navigate to:** http://localhost:4321

**Verify translations:**
- Hero section heading and text
- Call-to-action buttons
- Navigation menu (click hamburger icon)
- Footer credits and copyright

**Check for:**
- No English text visible
- Proper character encoding (no garbled text)
- Reasonable text lengths (no overflow)
- RTL languages (Arabic) display correctly (if applicable)

#### 4.4 Test Preview Page (/preview)

**Navigate to:** http://localhost:4321/preview

**Verify translations:**
- Manifesto content (loaded via ManifestoContent component)
- Footer credits (loaded via FooterCredits component)
- All paragraphs and headings

**Check for:**
- Complete manifesto translation
- Proper formatting and line breaks
- Footer text in target language

#### 4.5 Test Navigation Menu Translations

**Steps:**
1. Click the hamburger menu icon
2. Verify all menu items are translated:
   - The Artwork
   - Send A Name
   - From the Artist
   - Yet Another Temple?
   - How It Works
   - Space Launch
   - A Brief History
   - Education
   - Sustainability
   - Press
   - Team
   - Partners
   - Support
   - Technical Info

#### 4.6 Test Key Content Pages

Test at least 5 additional pages to ensure comprehensive translation:

**1. Artwork Page (/artwork)**
```
http://localhost:4321/artwork
```
Verify: Artwork descriptions, image captions, all text content

**2. Artist Page (/artist)**
```
http://localhost:4321/artist
```
Verify: Artist bio, quotes, personal statements

**3. Education Page (/education)**
```
http://localhost:4321/education
```
Verify: Educational content, learning objectives, descriptions

**4. Press Page (/press)**
```
http://localhost:4321/press
```
Verify: Press releases, media content, quotes

**5. Support Page (/support)**
```
http://localhost:4321/support
```
Verify: Support information, donation options, calls to action

**6. How It Works Page (/how-it-works)**
```
http://localhost:4321/how-it-works
```
Verify: Technical explanations, process descriptions

**7. Partners Page (/partners)**
```
http://localhost:4321/partners
```
Verify: Partner descriptions and information

#### 4.7 Test Language Switching

**Steps:**
1. Start on homepage in new language
2. Navigate to 2-3 different pages
3. Switch back to English
4. Verify all content returns to English
5. Switch to the new language again
6. Verify language persists across page navigation

**Check for:**
- Language preference saved in localStorage
- No FOUC (Flash of Unstyled Content) or text flashing
- Consistent language across all components
- Working "client:only='react'" hydration

#### 4.8 Verify No English Text Remains

**Manual inspection checklist:**
- [ ] Hero/header sections
- [ ] Navigation menu
- [ ] Page content (paragraphs, headings)
- [ ] Buttons and CTAs
- [ ] Forms and input labels
- [ ] Footer
- [ ] Meta descriptions (if translated)
- [ ] Error messages

**Browser DevTools check:**
```javascript
// In browser console, search for English words
document.body.innerText.match(/temple|orbit|space|launch/gi)
```

---

### Phase 5: Production Build Verification

#### 5.1 Run Production Build

```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean
pnpm build
```

**Expected output:**
```
building client (vite)
building server (vite)
✓ built in XXXXms

@astrojs/react: Generated client entrypoints.

  ✓ Completed in XXXms.

...

05:35:52 [build] 21 page(s) built in XXX.XXs
05:35:52 [build] Complete!
```

#### 5.2 Check Build Output for Translation-Related Warnings

**Look for:**
- Missing translation files
- JSON parsing errors
- i18n namespace issues
- Component hydration warnings

**Expected:** No errors or warnings related to translations

#### 5.3 Verify Build Output Files

```bash
# Check if new language files are in dist/
ls -la /Users/edsonpavoni/orbitaltemple-ws-clean/dist/locales/<LANG_CODE>/

# Should show all 21 JSON files
```

#### 5.4 Test Production Build Locally

```bash
pnpm preview
```

**Test the same pages as in Phase 4:**
1. Homepage (/)
2. Preview (/preview)
3. Navigation menu
4. 5+ content pages
5. Language switching

**Verify:**
- All translations work in production build
- No console errors
- Fast page loads
- Language switcher functions correctly

---

### Phase 6: Troubleshooting Common Issues

#### Issue 1: Translation Script Fails

**Symptoms:**
- Script exits with error
- API authentication failure
- Rate limiting errors

**Solutions:**

**A. API Credentials Issue**
```bash
# Verify .env file exists and has the key
cat .env | grep GOOGLE

# If missing, add the API key:
echo "GOOGLE_TRANSLATE_API_KEY=your_key_here" >> .env
```

**B. Rate Limiting**
- Wait 1-2 minutes and retry
- Script has built-in delays (50ms between items, 300ms between languages)
- If persistent, check API quota in Google Cloud Console

**C. Network/Connection Issues**
- Check internet connection
- Verify Google Cloud Translation API is enabled
- Test API manually: https://console.cloud.google.com/apis/api/translate.googleapis.com

#### Issue 2: Text Still Appears in English

**Symptoms:**
- After translation, some text remains in English
- Partial translation

**Solutions:**

**A. Component Not Using i18n**
```bash
# Check if the component uses useTranslation
grep -r "useTranslation" /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/

# Components should have:
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('namespace');
```

**B. Missing client:only="react"**
- All i18n components must have `client:only="react"` in Astro pages
- Example: `<LanguageSwitcher client:only="react" />`

**C. Translation Key Missing**
```bash
# Verify the translation key exists in the JSON file
cat /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/common.json | jq .nav
```

#### Issue 3: Missing Translation Files

**Symptoms:**
- 404 errors in browser console
- "Translation not found" warnings
- Less than 21 files in language directory

**Solutions:**

**A. Re-run Translation**
```bash
# Force re-translate all files
pnpm translate:google --lang <LANG_CODE> --force
```

**B. Check File Permissions**
```bash
# Verify files are readable
ls -la /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/
```

**C. Verify JSON Validity**
```bash
# Check each JSON file for syntax errors
for file in /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/*.json; do
  echo "Checking $file"
  jq . "$file" > /dev/null || echo "INVALID: $file"
done
```

#### Issue 4: Build Errors

**Symptoms:**
- `pnpm build` fails
- TypeScript errors
- JSON parsing errors

**Solutions:**

**A. JSON Syntax Errors**
```bash
# Validate all translation files
cd /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>
for file in *.json; do jq . "$file" > /dev/null && echo "✓ $file" || echo "✗ $file"; done
```

**B. Missing Comma or Bracket**
- Open the failing JSON file
- Check for:
  - Missing closing braces `}`
  - Missing or extra commas `,`
  - Unescaped quotes in strings
  - Invalid escape sequences

**C. TypeScript Errors**
```bash
# Check TypeScript types
pnpm check
```

#### Issue 5: Language Not Showing in Switcher

**Symptoms:**
- New language doesn't appear in dropdown
- Still shows in "Ready for Translation" section

**Solutions:**

**A. TRANSLATED_LANGS Not Updated**
```bash
# Verify LanguageSwitcher.tsx has the new language code
grep "TRANSLATED_LANGS" /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx
```

**B. Browser Cache**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Restart dev server (`pnpm dev`)

#### Issue 6: Characters Display Incorrectly (Garbled Text)

**Symptoms:**
- Special characters show as � or boxes
- Non-Latin scripts (Arabic, Chinese, Hindi) appear broken

**Solutions:**

**A. UTF-8 Encoding**
```bash
# Verify file encoding is UTF-8
file -I /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/<LANG_CODE>/common.json
# Should show: charset=utf-8
```

**B. HTML Meta Tag**
- Ensure all pages have `<meta charset="UTF-8">` in `<head>`

**C. Font Support**
- Some characters may require specific fonts
- Check if system fonts support the target language's script

---

## Complete Agent Prompt Template

Use this prompt to automate the entire translation process:

---

**AGENT PROMPT: Website Translation to [LANGUAGE_NAME] ([LANG_CODE])**

You are a translation automation agent for the Orbital Temple website. Your task is to translate the entire website to **[LANGUAGE_NAME]** (language code: **[LANG_CODE]**) and verify the translation is working correctly.

**Execute the following steps in order:**

### Step 1: Pre-flight Checks

1. Verify Google Cloud Translation API is configured:
   ```bash
   cat /Users/edsonpavoni/orbitaltemple-ws-clean/.env | grep GOOGLE_TRANSLATE_API_KEY
   ```
   - If not found, STOP and report: "Google Cloud Translation API key not configured"

2. Verify language code is supported:
   ```bash
   grep "code: '[LANG_CODE]'" /Users/edsonpavoni/orbitaltemple-ws-clean/src/lib/i18n.ts
   ```
   - If not found, STOP and report: "Language code [LANG_CODE] is not supported"

3. Verify source files exist:
   ```bash
   ls -1 /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/en/*.json | wc -l
   ```
   - Expected: 21 files
   - If not 21, STOP and report: "Missing English source files"

### Step 2: Run Translation

1. Execute translation script:
   ```bash
   cd /Users/edsonpavoni/orbitaltemple-ws-clean
   pnpm translate:google --lang [LANG_CODE] --force
   ```

2. Monitor output for errors
   - If any failures occur, note which files failed

3. Verify all 21 files were created:
   ```bash
   ls -1 /Users/edsonpavoni/orbitaltemple-ws-clean/public/locales/[LANG_CODE]/*.json | wc -l
   ```
   - Expected: 21 files

4. Report translation results:
   - "✅ Successfully translated 21 files to [LANGUAGE_NAME]"
   - OR "❌ Translation failed: [error details]"

### Step 3: Update LanguageSwitcher Component

1. Read the current file:
   ```bash
   Read /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx
   ```

2. Update TRANSLATED_LANGS array:
   ```bash
   Edit /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx
   old_string: "  const TRANSLATED_LANGS = ['en', 'hi'];"
   new_string: "  const TRANSLATED_LANGS = ['en', 'hi', '[LANG_CODE]'];"
   ```

3. Verify the edit:
   ```bash
   grep "TRANSLATED_LANGS" /Users/edsonpavoni/orbitaltemple-ws-clean/src/components/LanguageSwitcher.tsx
   ```

4. Report: "✅ Updated LanguageSwitcher to include [LANGUAGE_NAME]"

### Step 4: Build and Test

1. Run production build:
   ```bash
   cd /Users/edsonpavoni/orbitaltemple-ws-clean
   pnpm build
   ```

2. Check for build errors
   - If errors occur, report them

3. Verify built files:
   ```bash
   ls -1 /Users/edsonpavoni/orbitaltemple-ws-clean/dist/locales/[LANG_CODE]/*.json | wc -l
   ```
   - Expected: 21 files

4. Report: "✅ Production build successful. All translation files included."

### Step 5: Testing Instructions for Human Verification

Provide the following testing checklist:

**Manual Testing Required:**

Start the development server and test:
```bash
pnpm dev
```

Then verify:

1. **Language Switcher:**
   - [ ] Open http://localhost:4321
   - [ ] Click language icon
   - [ ] [LANGUAGE_NAME] appears in "Fully Translated" section
   - [ ] Selecting [LANGUAGE_NAME] updates page content

2. **Homepage (/):**
   - [ ] All text displays in [LANGUAGE_NAME]
   - [ ] No English text visible
   - [ ] Navigation menu translated

3. **Preview Page (/preview):**
   - [ ] Manifesto content translated
   - [ ] Footer credits translated

4. **Additional Pages (test at least 5):**
   - [ ] /artwork
   - [ ] /artist
   - [ ] /education
   - [ ] /press
   - [ ] /support
   - [ ] /how-it-works
   - [ ] /partners

5. **Language Switching:**
   - [ ] Switch from [LANGUAGE_NAME] to English
   - [ ] Switch back to [LANGUAGE_NAME]
   - [ ] Language preference persists

### Step 6: Final Report

Provide a summary report:

```
================================================================================
[LANGUAGE_NAME] ([LANG_CODE]) TRANSLATION COMPLETE
================================================================================

✅ Translation Status:
   - 21 of 21 files translated successfully
   - Translation files created in: /public/locales/[LANG_CODE]/
   - Build files created in: /dist/locales/[LANG_CODE]/

✅ Code Updates:
   - LanguageSwitcher.tsx updated with [LANG_CODE]
   - Production build successful

✅ Files Translated:
   1. artist.json (14KB)
   2. artwork.json (5KB)
   3. brief-history.json (25KB)
   4. common.json (2KB)
   5. countdown.json (600B)
   6. donate.json (4KB)
   7. education.json (13KB)
   8. home.json (600B)
   9. how-it-works.json (2KB)
   10. info.json (1KB)
   11. manifesto.json (12KB)
   12. milestones.json (1KB)
   13. notify-me.json (1KB)
   14. partners.json (6KB)
   15. press.json (21KB)
   16. send-a-name.json (1KB)
   17. space-launch.json (5KB)
   18. support.json (22KB)
   19. sustainability.json (12KB)
   20. team.json (4KB)
   21. technical.json (2KB)

⚠️  Manual Testing Required:
   Please complete the testing checklist above to verify all translations
   display correctly across the website.

📊 Translation Summary:
   - Source: English (en)
   - Target: [LANGUAGE_NAME] ([LANG_CODE])
   - Method: Google Cloud Translation API
   - Total Characters: ~XXX,XXX
   - Status: READY FOR REVIEW

================================================================================
```

**If any errors occurred, report them clearly with troubleshooting steps.**

---

## Example Usage

### Example 1: Translate to Portuguese

**Input:**
```
Task: Translate the website to Portuguese
```

**Agent executes:**

1. ✅ Validates API key configured
2. ✅ Validates "pt" is supported (code: 'pt', name: 'Portuguese', nativeName: 'Português')
3. ✅ Validates 21 English source files exist
4. ✅ Runs `pnpm translate:google --lang pt --force`
5. ✅ Monitors progress: 21/21 files translated successfully
6. ✅ Updates LanguageSwitcher.tsx: `TRANSLATED_LANGS = ['en', 'hi', 'pt']`
7. ✅ Runs `pnpm build` - Success, no errors
8. ✅ Verifies dist/ contains 21 Portuguese files

**Agent reports:**
```
Portuguese translation complete.
✅ 21 files translated successfully
✅ LanguageSwitcher updated
✅ Production build successful
⚠️  Manual testing recommended for 8 key pages
```

---

### Example 2: Translate to French and German

**Input:**
```
Task: Translate the website to French and German
```

**Agent executes:**

**French (fr):**
1. ✅ Pre-flight checks pass
2. ✅ Translates 21 files to French
3. ✅ Updates LanguageSwitcher: `['en', 'hi', 'fr']`
4. ✅ Build successful

**German (de):**
1. ✅ Pre-flight checks pass
2. ✅ Translates 21 files to German
3. ✅ Updates LanguageSwitcher: `['en', 'hi', 'fr', 'de']`
4. ✅ Build successful

**Agent reports:**
```
French and German translations complete.

French:
✅ 21 files translated successfully
✅ Files saved in: /public/locales/fr/

German:
✅ 21 files translated successfully
✅ Files saved in: /public/locales/de/

✅ LanguageSwitcher updated with both languages
✅ Production build includes both translations
⚠️  Manual testing recommended
```

---

### Example 3: Handle API Error

**Input:**
```
Task: Translate the website to Spanish
```

**Agent executes:**

1. ✅ Pre-flight checks pass
2. ❌ Translation fails: "Error: Google Cloud Translation API key not found"

**Agent reports:**
```
❌ Spanish translation failed

Error: Google Cloud Translation API credentials not configured

Troubleshooting steps:
1. Create .env file in project root
2. Add: GOOGLE_TRANSLATE_API_KEY=your_key_here
3. Get API key from: https://console.cloud.google.com/apis/credentials
4. Enable Cloud Translation API
5. Retry translation

Status: BLOCKED - Requires API configuration
```

---

## Translation File Validation Script

Use this script to validate translation completeness:

```bash
#!/bin/bash
# validate-translation.sh

LANG_CODE=$1
BASE_DIR="/Users/edsonpavoni/orbitaltemple-ws-clean/public/locales"
EN_DIR="$BASE_DIR/en"
LANG_DIR="$BASE_DIR/$LANG_CODE"

echo "Validating $LANG_CODE translation..."
echo ""

# Check if language directory exists
if [ ! -d "$LANG_DIR" ]; then
  echo "❌ Language directory not found: $LANG_DIR"
  exit 1
fi

# Count files
EN_COUNT=$(ls -1 "$EN_DIR"/*.json | wc -l | tr -d ' ')
LANG_COUNT=$(ls -1 "$LANG_DIR"/*.json | wc -l | tr -d ' ')

echo "File count:"
echo "  English: $EN_COUNT files"
echo "  $LANG_CODE: $LANG_COUNT files"
echo ""

if [ "$EN_COUNT" != "$LANG_COUNT" ]; then
  echo "❌ File count mismatch!"
  exit 1
fi

# Validate JSON syntax
echo "Validating JSON syntax..."
for file in "$LANG_DIR"/*.json; do
  filename=$(basename "$file")
  if jq . "$file" > /dev/null 2>&1; then
    echo "  ✅ $filename"
  else
    echo "  ❌ $filename - INVALID JSON"
    exit 1
  fi
done

echo ""
echo "✅ All validations passed for $LANG_CODE"
```

**Usage:**
```bash
chmod +x validate-translation.sh
./validate-translation.sh pt
./validate-translation.sh fr
```

---

## Translation Quality Checklist

After automated translation, consider these quality improvements:

### Human Review Priorities

1. **Critical Pages** (highest priority):
   - Homepage (/)
   - Send A Name (/send-a-name)
   - Artwork (/artwork)
   - Manifesto (/preview)

2. **Brand Terms** (review for consistency):
   - "Orbital Temple" - Keep in English or translate?
   - "Yet Another Temple?" - Cultural context preserved?
   - Technical terms - Accurate translations?

3. **Calls to Action** (verify cultural appropriateness):
   - Button text
   - Form labels
   - Navigation items

4. **Legal/Formal Text** (may need professional review):
   - Press releases
   - Partnership information
   - Support/donation information

### Cultural Adaptation Checklist

- [ ] Date formats appropriate for language
- [ ] Currency symbols (if applicable)
- [ ] Formal vs. informal tone matches brand voice
- [ ] Idioms and metaphors make sense in target culture
- [ ] RTL languages (Arabic) display correctly
- [ ] Character encoding displays correctly

---

## Future Improvements

### Automation Opportunities

1. **CI/CD Integration:**
   - Automatic translation on content updates
   - Git hooks to trigger translations

2. **Translation Memory:**
   - Cache common phrases
   - Consistency across updates

3. **A/B Testing:**
   - Test translation quality with native speakers
   - Gather feedback on terminology

4. **Professional Review Workflow:**
   - Flag machine-translated content
   - Allow human reviewers to improve translations
   - Version control for translation improvements

---

## Support and Resources

### Documentation
- Google Cloud Translation API: https://cloud.google.com/translate/docs
- i18next: https://www.i18next.com/
- React i18next: https://react.i18next.com/

### Project Files
- Translation script: `/scripts/translate-google.ts`
- i18n config: `/src/lib/i18n.ts`
- Language switcher: `/src/components/LanguageSwitcher.tsx`
- Source translations: `/public/locales/en/`
- Environment config: `.env`

### Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Review translation script logs
3. Validate JSON files with `jq`
4. Test in browser DevTools console
5. Check Google Cloud Console for API quota/errors

---

## Appendix: All Supported Languages

The website supports 31 languages via Google Cloud Translation API:

| Code | Language | Native Name |
|------|----------|-------------|
| ar | Arabic | العربية |
| bg | Bulgarian | Български |
| cs | Czech | Čeština |
| da | Danish | Dansk |
| de | German | Deutsch |
| el | Greek | Ελληνικά |
| en | English (US) | English (us) |
| es | Spanish | Español |
| et | Estonian | Eesti |
| fi | Finnish | Suomi |
| fr | French | Français |
| hu | Hungarian | Magyar |
| hi | Hindi | हिन्दी |
| id | Indonesian | Bahasa Indonesia |
| it | Italian | Italiano |
| ja | Japanese | 日本語 |
| ko | Korean | 한국어 |
| lt | Lithuanian | Lietuvių |
| lv | Latvian | Latviešu |
| nb | Norwegian | Norsk |
| nl | Dutch | Nederlands |
| pl | Polish | Polski |
| pt | Portuguese | Português |
| ro | Romanian | Română |
| ru | Russian | Русский |
| sk | Slovak | Slovenčina |
| sl | Slovenian | Slovenščina |
| sv | Swedish | Svenska |
| tr | Turkish | Türkçe |
| uk | Ukrainian | Українська |
| zh | Chinese | 中文 |

---

**Last Updated:** 2025-11-04

**Document Version:** 1.0

**Maintained by:** Orbital Temple Development Team
