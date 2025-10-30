#!/usr/bin/env tsx
/**
 * Translation Script for Orbital Temple
 *
 * This script translates all English content files to 246 languages using DeepL API.
 *
 * Usage:
 *   pnpm translate              # Translate all missing languages
 *   pnpm translate --lang es    # Translate only Spanish
 *   pnpm translate --force      # Re-translate all languages (overwrite existing)
 *
 * Requirements:
 *   - DEEPL_API_KEY environment variable (in .env file)
 *   - Source files in public/locales/en/
 */

import * as fs from 'fs';
import * as path from 'path';
import * as deepl from 'deepl-node';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const SOURCE_LANG = 'en';
const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const SOURCE_DIR = path.join(LOCALES_DIR, SOURCE_LANG);

// DeepL language codes mapping (DeepL uses different codes for some languages)
const DEEPL_LANG_MAP: Record<string, string> = {
  'en': 'en-us',
  'pt': 'pt-pt',
  'zh': 'zh',
  // Add more mappings as needed
};

// Languages supported by DeepL (subset of our 246 languages)
// For non-DeepL languages, you'll need to use Google Translate or other services
const DEEPL_SUPPORTED_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hu',
  'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru',
  'sk', 'sl', 'sv', 'tr', 'uk', 'zh'
];

interface TranslationStats {
  total: number;
  success: number;
  failed: number;
  skipped: number;
}

/**
 * Initialize DeepL translator
 */
function getTranslator(): deepl.Translator | null {
  const apiKey = process.env.DEEPL_API_KEY;

  if (!apiKey) {
    console.error('❌ DEEPL_API_KEY not found in environment variables');
    console.log('');
    console.log('To use this script:');
    console.log('1. Get a DeepL API key from: https://www.deepl.com/pro-api');
    console.log('2. Sign up for the FREE tier (requires credit card verification)');
    console.log('3. Get your API key from: https://www.deepl.com/account/keys');
    console.log('4. Add to .env: DEEPL_API_KEY=your_api_key_here');
    console.log('');
    return null;
  }

  // The DeepL library auto-detects free vs pro tier from the key format
  // Free tier keys end with :fx, Pro keys don't
  // If using free tier, the library will automatically use api-free.deepl.com
  return new deepl.Translator(apiKey);
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
  translator: deepl.Translator,
  targetLang: string,
  path: string = ''
): Promise<any> {
  if (typeof obj === 'string') {
    try {
      const deeplLang = DEEPL_LANG_MAP[targetLang] || targetLang;
      const result = await translator.translateText(obj, null, deeplLang as deepl.TargetLanguageCode);
      return result.text;
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
      await sleep(100);
    }
    return translated;
  }

  if (typeof obj === 'object' && obj !== null) {
    const translated: any = {};
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = await translateObject(value, translator, targetLang, `${path}.${key}`);
      // Rate limiting: small delay between requests
      await sleep(100);
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
  translator: deepl.Translator,
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
} = {}) {
  console.log('🌍 Orbital Temple Translation Script');
  console.log('=====================================\n');

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
  } else {
    // Use only DeepL-supported languages for now
    targetLanguages = DEEPL_SUPPORTED_LANGUAGES.filter(lang => lang !== SOURCE_LANG);
  }

  console.log(`🎯 Target languages: ${targetLanguages.length}`);
  if (options.targetLang) {
    console.log(`   Translating to: ${options.targetLang}`);
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
      await sleep(200);
    }

    // Rate limiting between languages
    await sleep(500);
  }

  // Print summary
  console.log('\n\n📊 Translation Summary');
  console.log('======================');
  console.log(`Total tasks:    ${stats.total}`);
  console.log(`✅ Successful:  ${stats.success}`);
  console.log(`❌ Failed:      ${stats.failed}`);
  console.log(`⏭️  Skipped:     ${stats.skipped}`);
  console.log('');

  if (stats.failed > 0) {
    console.log('⚠️  Some translations failed. Check the errors above.');
    process.exit(1);
  } else {
    console.log('✨ All translations completed successfully!');
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): { targetLang?: string; force?: boolean } {
  const args = process.argv.slice(2);
  const options: { targetLang?: string; force?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang' && args[i + 1]) {
      options.targetLang = args[i + 1];
      i++;
    } else if (args[i] === '--force') {
      options.force = true;
    } else if (args[i] === '--help') {
      console.log('Orbital Temple Translation Script');
      console.log('');
      console.log('Usage:');
      console.log('  pnpm translate              # Translate all missing languages');
      console.log('  pnpm translate --lang es    # Translate only Spanish');
      console.log('  pnpm translate --force      # Re-translate all (overwrite)');
      console.log('');
      console.log('Options:');
      console.log('  --lang CODE    Translate only to specified language code');
      console.log('  --force        Overwrite existing translations');
      console.log('  --help         Show this help message');
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
