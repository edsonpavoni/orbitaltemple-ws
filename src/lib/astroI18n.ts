import fs from 'fs';
import path from 'path';

// Helper to load translations for Astro SSR
export function loadTranslations(lang: string, namespace: string) {
  const filePath = path.join(process.cwd(), 'public', 'locales', lang, `${namespace}.json`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // Fallback to English if translation file doesn't exist
    const fallbackPath = path.join(process.cwd(), 'public', 'locales', 'en', `${namespace}.json`);
    const fallbackContent = fs.readFileSync(fallbackPath, 'utf-8');
    return JSON.parse(fallbackContent);
  }
}

// Helper to get nested translation value
export function getTranslation(translations: any, key: string): string {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

// Create a translation function
export function createT(translations: any) {
  return (key: string) => getTranslation(translations, key);
}
