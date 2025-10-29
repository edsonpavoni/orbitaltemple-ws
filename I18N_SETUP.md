# Internationalization (i18n) Setup Guide

Complete guide for implementing 246-language support in Orbital Temple.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Using Translations in Components](#using-translations-in-components)
5. [Language Switcher](#language-switcher)
6. [Translation Workflow](#translation-workflow)
7. [RTL Support](#rtl-support)
8. [Best Practices](#best-practices)

---

## Overview

The Orbital Temple uses **react-i18next** for internationalization, supporting **246 languages** with:

- ✅ Lazy loading (only active language is loaded)
- ✅ No page reload on language change
- ✅ localStorage persistence
- ✅ RTL language support (Arabic, Hebrew, etc.)
- ✅ Automatic translation via DeepL API
- ✅ TypeScript support

---

## Quick Start

### 1. Initialize i18n in Your App

In your root layout or main component:

```tsx
// src/layouts/BaseLayout.astro or main entry point
import '../lib/i18n'; // Initialize i18next
```

### 2. Use Translations in React Components

```tsx
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
  const { t } = useTranslation('common'); // 'common' is the namespace

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### 3. Add the Language Switcher

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

<LanguageSwitcher />
```

---

## Architecture

### Directory Structure

```
public/locales/
├── en/                      # English (source)
│   ├── common.json          # Shared UI elements
│   ├── home.json            # Home page
│   ├── send-a-name.json     # Send a name flow
│   └── manifesto.json       # Manifesto text
├── es/                      # Spanish
├── fr/                      # French
└── ... (244 more languages)

src/lib/
└── i18n.ts                  # i18next configuration

src/components/
└── LanguageSwitcher.tsx     # Language dropdown component

scripts/
├── translate.ts             # Auto-translation script
└── README.md                # Translation workflow docs
```

### Translation File Structure

**common.json** - Shared elements:
```json
{
  "menu": {
    "home": "Home",
    "sendName": "Send a Name"
  },
  "ritual": {
    "label": "ritual"
  }
}
```

**home.json** - Home page:
```json
{
  "hero": {
    "title": "Orbital Temple",
    "subtitle": "is an artwork and a satellite..."
  }
}
```

---

## Using Translations in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');

  return <h1>{t('menu.home')}</h1>;
}
```

### With Different Namespace

```tsx
const { t } = useTranslation('send-a-name');

<h1>{t('breathing.title')}</h1>
<p>{t('breathing.subtitle')}</p>
```

### With Variable Interpolation

```tsx
const { t } = useTranslation('send-a-name');
const name = "John";

<p>{t('success.title', { name })}</p>
// Result: "The name John is now queued for ascension..."
```

### Multiple Namespaces

```tsx
const { t: tCommon } = useTranslation('common');
const { t: tHome } = useTranslation('home');

<header>{tCommon('menu.home')}</header>
<h1>{tHome('hero.title')}</h1>
```

### Changing Language Programmatically

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();

  const switchToSpanish = () => {
    i18n.changeLanguage('es');
  };

  return <button onClick={switchToSpanish}>Español</button>;
}
```

### Get Current Language

```tsx
const { i18n } = useTranslation();
const currentLang = i18n.language; // 'en', 'es', etc.
```

---

## Example: Converting Existing Component

### Before (hardcoded):

```tsx
export default function SendNameForm() {
  return (
    <div>
      <h1>think of a name</h1>
      <p>a being you want to honor, cherish, celebrate.</p>
      <button>let it ascend</button>
    </div>
  );
}
```

### After (with i18n):

```tsx
import { useTranslation } from 'react-i18next';

export default function SendNameForm() {
  const { t } = useTranslation('send-a-name');

  return (
    <div>
      <h1>{t('breathing.title')}</h1>
      <p>{t('breathing.subtitle')}</p>
      <button>{t('nameInput.button')}</button>
    </div>
  );
}
```

---

## Language Switcher

The `LanguageSwitcher` component provides:

- 🔍 Search functionality (for 246 languages!)
- 🌐 Native language names
- ✅ Current language indicator
- 💾 Auto-saves preference to localStorage

### Basic Usage

```tsx
import LanguageSwitcher from './components/LanguageSwitcher';

<LanguageSwitcher />
```

### Integration Example

```tsx
// In your header/navigation
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/send-a-name">Send a Name</a>
  </nav>

  <LanguageSwitcher />
</header>
```

---

## Translation Workflow

### 1. Add/Edit English Content

Edit source files in `public/locales/en/`:

```json
// public/locales/en/common.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 2. Run Translation Script

```bash
# Translate to all languages
pnpm translate

# Translate to specific language
pnpm translate:lang es

# Force re-translate (overwrite existing)
pnpm translate:force
```

### 3. Test Translations

Use the language switcher to test different languages.

For detailed translation workflow, see [scripts/README.md](./scripts/README.md).

---

## RTL Support

Right-to-left (RTL) languages are automatically detected and handled.

### Supported RTL Languages

- Arabic (ar)
- Hebrew (he)
- Persian/Farsi (fa)
- Urdu (ur)

### Automatic RTL Handling

The i18n system automatically:
1. Sets `<html dir="rtl">` attribute
2. Applies RTL text direction
3. Mirrors layout (via CSS)

### CSS for RTL

Use logical properties for RTL-compatible styling:

```css
/* ❌ Don't use directional properties */
margin-left: 1rem;
padding-right: 2rem;
text-align: left;

/* ✅ Use logical properties */
margin-inline-start: 1rem;
padding-inline-end: 2rem;
text-align: start;
```

Our starfield and components already use logical properties!

---

## Best Practices

### 1. Always Use Translation Keys

```tsx
// ❌ Bad
<h1>Orbital Temple</h1>

// ✅ Good
<h1>{t('hero.title')}</h1>
```

### 2. Organize by Namespace

- `common` - UI elements used across multiple pages
- `home` - Home page specific
- `send-a-name` - Feature-specific
- `manifesto` - Long-form content

### 3. Use Descriptive Keys

```json
// ❌ Bad
{
  "text1": "Hello",
  "btn": "Click me"
}

// ✅ Good
{
  "greeting": "Hello",
  "submitButton": "Click me"
}
```

### 4. Keep Translations Atomic

```json
// ❌ Bad (hard to maintain)
{
  "message": "Hello, John! Welcome to Orbital Temple."
}

// ✅ Good (flexible)
{
  "greeting": "Hello, {{name}}!",
  "welcome": "Welcome to Orbital Temple."
}
```

### 5. Handle Line Breaks

```json
{
  "multiline": "Line 1\nLine 2\nLine 3"
}
```

In React:
```tsx
<p style={{ whiteSpace: 'pre-line' }}>
  {t('multiline')}
</p>
```

### 6. Performance Tips

```tsx
// ✅ Load only needed namespaces
const { t } = useTranslation('home');

// ✅ Lazy load translations
// (Already configured in src/lib/i18n.ts)

// ✅ Use Suspense for async loading
import { Suspense } from 'react';

<Suspense fallback="Loading...">
  <TranslatedComponent />
</Suspense>
```

---

## Testing Translations

### 1. Test Language Switching

```tsx
// In your test or dev tools
i18n.changeLanguage('es'); // Spanish
i18n.changeLanguage('ar'); // Arabic (RTL)
i18n.changeLanguage('ja'); // Japanese
```

### 2. Test RTL Layout

```bash
# Open dev tools, switch to Arabic
# Check that layout mirrors correctly
```

### 3. Test Missing Translations

Missing translations will fallback to English and log a warning in dev mode.

---

## Troubleshooting

### Translation Not Showing

1. Check namespace matches file name:
   ```tsx
   useTranslation('send-a-name') // Must match send-a-name.json
   ```

2. Check key path exists:
   ```json
   // In send-a-name.json
   {
     "breathing": {
       "title": "..." // Access with t('breathing.title')
     }
   }
   ```

3. Check i18n is initialized:
   ```tsx
   // In root layout
   import '../lib/i18n';
   ```

### Language Not Loading

1. Check translation file exists:
   ```
   public/locales/es/common.json
   ```

2. Check language code in SUPPORTED_LANGUAGES:
   ```tsx
   // src/lib/i18n.ts
   export const SUPPORTED_LANGUAGES = [
     { code: 'es', name: 'Spanish', nativeName: 'Español' },
     // ...
   ];
   ```

### RTL Not Working

1. Check language is marked as RTL:
   ```tsx
   // src/lib/i18n.ts
   { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true }
   ```

2. Check HTML dir attribute:
   ```html
   <html dir="rtl">
   ```

---

## Next Steps

1. **Update your components** to use translations
2. **Test the language switcher** in development
3. **Get a DeepL API key** and run translations
4. **Review translated content** for quality
5. **Deploy** with full i18n support!

For questions or issues, refer to:
- [react-i18next docs](https://react.i18next.com/)
- [i18next docs](https://www.i18next.com/)
- [Translation workflow](./scripts/README.md)

---

**Made with 🌍 for billions of people in 246 languages**
