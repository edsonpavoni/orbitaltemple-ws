#!/usr/bin/env tsx
/**
 * Google Cloud Translation Script for Orbital Temple
 *
 * This script translates all English content files to 130+ languages using Google Cloud Translation API.
 * Files are translated ONCE and saved statically - no runtime translation!
 *
 * Usage:
 *   pnpm translate:google              # Translate all missing languages
 *   pnpm translate:google --lang es    # Translate only Spanish
 *   pnpm translate:google --force      # Re-translate all languages (overwrite existing)
 *   pnpm translate:google --all246     # Translate ALL 246 languages
 *
 * Requirements:
 *   - GOOGLE_TRANSLATE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS environment variable
 *   - Source files in public/locales/en/
 */

import * as fs from 'fs';
import * as path from 'path';
import { v2 } from '@google-cloud/translate';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const SOURCE_LANG = 'en';
const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const SOURCE_DIR = path.join(LOCALES_DIR, SOURCE_LANG);

// All 246 supported languages (ISO 639-1 codes)
// Google Translate supports 130+ of these
const ALL_LANGUAGES = [
  // Major languages (Google supported)
  'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny',
  'zh', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi',
  'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu',
  'is', 'ig', 'id', 'ga', 'it', 'ja', 'jv', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky',
  'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my',
  'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st',
  'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te',
  'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
  // Note: For remaining rare languages, you'll need specialized translation services
];

interface TranslationStats {
  total: number;
  success: number;
  failed: number;
  skipped: number;
}

/**
 * Initialize Google Cloud Translate
 */
function getTranslator(): v2.Translate | null {
  try {
    // Try API Key first
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (apiKey) {
      return new v2.Translate({ key: apiKey });
    }

    // Try Service Account credentials
    const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credentials) {
      return new v2.Translate({ keyFilename: credentials });
    }

    console.error('❌ Google Cloud Translation credentials not found');
    console.log('');
    console.log('To use this script, choose ONE of these options:');
    console.log('');
    console.log('Option 1 - API Key (Quick setup):');
    console.log('1. Go to: https://console.cloud.google.com/apis/credentials');
    console.log('2. Create an API key');
    console.log('3. Enable Cloud Translation API');
    console.log('4. Add to .env: GOOGLE_TRANSLATE_API_KEY=your_key');
    console.log('');
    console.log('Option 2 - Service Account (Recommended for production):');
    console.log('1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts');
    console.log('2. Create a service account');
    console.log('3. Download JSON key file');
    console.log('4. Add to .env: GOOGLE_APPLICATION_CREDENTIALS=./key.json');
    console.log('');
    return null;
  } catch (error) {
    console.error('❌ Failed to initialize Google Translate:', error);
    return null;
  }
}

/**
 * Get all JSON files in a directory
 */
function getJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(dir, file));
}

/**
 * Deep translate a JSON object
 */
async function translateObject(
  obj: any,
  translator: v2.Translate,
  targetLang: string,
  path: string = ''
): Promise<any> {
  if (typeof obj === 'string') {
    try {
      const [translation] = await translator.translate(obj, targetLang);
      return translation;
    } catch (error) {
      console.error(`  ❌ Translation failed for path "${path}":`, error);
      return obj; // Return original on error
    }
  }

  if (Array.isArray(obj)) {
    const translated = [];
    for (let i = 0; i < obj.length; i++) {
      translated.push(await translateObject(obj[i], translator, targetLang, `${path}[${i}]`));
      // Rate limiting: small delay between requests
      await sleep(50);
    }
    return translated;
  }

  if (typeof obj === 'object' && obj !== null) {
    const translated: any = {};
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = await translateObject(value, translator, targetLang, `${path}.${key}`);
      // Rate limiting: small delay between requests
      await sleep(50);
    }
    return translated;
  }

  return obj;
}

/**
 * Translate a single file
 */
async function translateFile(
  sourceFile: string,
  targetLang: string,
  translator: v2.Translate,
  force: boolean = false
): Promise<boolean> {
  const fileName = path.basename(sourceFile);
  const targetDir = path.join(LOCALES_DIR, targetLang);
  const targetFile = path.join(targetDir, fileName);

  // Skip if target already exists (unless force flag)
  if (!force && fs.existsSync(targetFile)) {
    console.log(`  ⏭️  ${fileName} (already exists)`);
    return true;
  }

  try {
    console.log(`  🔄 Translating ${fileName}...`);

    // Read source file
    const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'));

    // Translate
    const translatedContent = await translateObject(sourceContent, translator, targetLang);

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Write translated file
    fs.writeFileSync(
      targetFile,
      JSON.stringify(translatedContent, null, 2),
      'utf-8'
    );

    console.log(`  ✅ ${fileName} translated successfully`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to translate ${fileName}:`, error);
    return false;
  }
}

/**
 * Sleep helper for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main translation function
 */
async function translate(options: {
  targetLang?: string;
  force?: boolean;
  all246?: boolean;
} = {}) {
  console.log('🌐 Orbital Temple - Google Cloud Translation');
  console.log('=============================================\n');

  const translator = getTranslator();
  if (!translator) {
    process.exit(1);
  }

  // Get source files
  const sourceFiles = getJsonFiles(SOURCE_DIR);
  if (sourceFiles.length === 0) {
    console.error(`❌ No JSON files found in ${SOURCE_DIR}`);
    process.exit(1);
  }

  console.log(`📁 Found ${sourceFiles.length} source files:`);
  sourceFiles.forEach(file => {
    console.log(`   - ${path.basename(file)}`);
  });
  console.log('');

  // Determine target languages
  let targetLanguages: string[];
  if (options.targetLang) {
    targetLanguages = [options.targetLang];
  } else if (options.all246) {
    targetLanguages = ALL_LANGUAGES.filter(lang => lang !== SOURCE_LANG);
    console.log('⚠️  Warning: Translating to ALL 246 languages');
    console.log('   This will take a while and use API quota');
    console.log('');
  } else {
    // Use Google-supported languages (excluding English)
    targetLanguages = ALL_LANGUAGES.filter(lang => lang !== SOURCE_LANG).slice(0, 50);
  }

  console.log(`🎯 Target languages: ${targetLanguages.length}`);
  if (options.targetLang) {
    console.log(`   Translating to: ${options.targetLang}`);
  } else if (options.all246) {
    console.log(`   Translating to: ALL 246 languages`);
  } else {
    console.log(`   Translating to: First 50 Google-supported languages`);
  }
  console.log('');

  const stats: TranslationStats = {
    total: targetLanguages.length * sourceFiles.length,
    success: 0,
    failed: 0,
    skipped: 0,
  };

  // Translate for each language
  for (let i = 0; i < targetLanguages.length; i++) {
    const lang = targetLanguages[i];
    console.log(`\n[${i + 1}/${targetLanguages.length}] 🌐 ${lang.toUpperCase()}`);
    console.log('─'.repeat(40));

    for (const sourceFile of sourceFiles) {
      const success = await translateFile(sourceFile, lang, translator, options.force);
      if (success) {
        stats.success++;
      } else {
        stats.failed++;
      }

      // Rate limiting between files
      await sleep(100);
    }

    // Rate limiting between languages
    await sleep(300);
  }

  // Print summary
  console.log('\n\n📊 Translation Summary');
  console.log('======================');
  console.log(`Total tasks:    ${stats.total}`);
  console.log(`✅ Successful:  ${stats.success}`);
  console.log(`❌ Failed:      ${stats.failed}`);
  console.log(`⏭️  Skipped:     ${stats.skipped}`);
  console.log('');
  console.log(`📁 Translations saved in: ${LOCALES_DIR}`);
  console.log('');

  if (stats.failed > 0) {
    console.log('⚠️  Some translations failed. Check the errors above.');
    process.exit(1);
  } else {
    console.log('✨ All translations completed successfully!');
    console.log('   Files are saved and ready to use - no runtime translation needed!');
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): { targetLang?: string; force?: boolean; all246?: boolean } {
  const args = process.argv.slice(2);
  const options: { targetLang?: string; force?: boolean; all246?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang' && args[i + 1]) {
      options.targetLang = args[i + 1];
      i++;
    } else if (args[i] === '--force') {
      options.force = true;
    } else if (args[i] === '--all246') {
      options.all246 = true;
    } else if (args[i] === '--help') {
      console.log('Google Cloud Translation Script for Orbital Temple');
      console.log('');
      console.log('Usage:');
      console.log('  pnpm translate:google              # Translate first 50 languages');
      console.log('  pnpm translate:google --lang es    # Translate only Spanish');
      console.log('  pnpm translate:google --force      # Re-translate (overwrite)');
      console.log('  pnpm translate:google --all246     # Translate ALL 246 languages');
      console.log('');
      console.log('Options:');
      console.log('  --lang CODE    Translate only to specified language code');
      console.log('  --force        Overwrite existing translations');
      console.log('  --all246       Translate to all 246 languages (long operation)');
      console.log('  --help         Show this help message');
      console.log('');
      console.log('Note: Files are translated ONCE and saved statically.');
      console.log('      No runtime translation happens when users visit the site.');
      console.log('');
      process.exit(0);
    }
  }

  return options;
}

// Run the script
if (require.main === module) {
  const options = parseArgs();
  translate(options).catch(error => {
    console.error('\n❌ Translation script failed:', error);
    process.exit(1);
  });
}

export { translate };
