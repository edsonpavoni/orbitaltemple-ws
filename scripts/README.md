# Translation Workflow

This directory contains scripts for managing translations for the Orbital Temple in 246 languages.

## Prerequisites

1. **Get a DeepL API Key**
   - Sign up at [DeepL API](https://www.deepl.com/pro-api)
   - Choose Free (500,000 characters/month) or Pro plan
   - Copy your API key

2. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env and add your DeepL API key
   DEEPL_API_KEY=your_key_here
   ```

## Usage

### Translate all languages

Translate all source files to all supported languages:

```bash
pnpm translate
```

This will:
- Read all JSON files from `public/locales/en/`
- Translate them to all DeepL-supported languages
- Skip files that already exist (unless using `--force`)
- Save translated files to `public/locales/{lang}/`

### Translate a specific language

```bash
pnpm translate:lang es     # Spanish
pnpm translate:lang fr     # French
pnpm translate:lang ja     # Japanese
```

### Force re-translate (overwrite existing)

```bash
pnpm translate:force
```

## Translation Files

### Source Files (English)
All translation content is stored in `public/locales/en/`:

- **common.json** - Shared UI elements (menu, buttons, footer)
- **home.json** - Home page content
- **send-a-name.json** - Send-a-name journey flow
- **manifesto.json** - The manifesto text

### Translation Structure

```
public/locales/
├── en/              # Source language (English)
│   ├── common.json
│   ├── home.json
│   ├── send-a-name.json
│   └── manifesto.json
├── es/              # Spanish
│   ├── common.json
│   └── ...
├── fr/              # French
├── ar/              # Arabic (RTL)
└── ... (244 more languages)
```

## Supported Languages

### DeepL Supported (30 languages)

The translation script currently supports these 30 languages via DeepL API:

Arabic (ar), Bulgarian (bg), Czech (cs), Danish (da), German (de), Greek (el), English (en), Spanish (es), Estonian (et), Finnish (fi), French (fr), Hungarian (hu), Indonesian (id), Italian (it), Japanese (ja), Korean (ko), Lithuanian (lt), Latvian (lv), Norwegian (nb), Dutch (nl), Polish (pl), Portuguese (pt), Romanian (ro), Russian (ru), Slovak (sk), Slovenian (sl), Swedish (sv), Turkish (tr), Ukrainian (uk), Chinese (zh)

### Expanding to 246 Languages

For languages not supported by DeepL, you'll need to:

1. Use Google Cloud Translation API (130+ languages)
2. Use specialized translation services for rare languages
3. Accept community contributions for manual translations

To add more translation services, extend the `translate.ts` script.

## Adding New Content

When you add new content to the English files:

1. Edit the source files in `public/locales/en/`
2. Run the translation script:
   ```bash
   pnpm translate
   ```
3. The script will automatically translate new content while preserving existing translations

## Cost Estimation

### DeepL Free API
- 500,000 characters/month
- Perfect for initial translation and updates

### DeepL Pro API
- $5.49 per 1 million characters
- Recommended for production with frequent updates

### Example costs:
- Initial translation (30 languages × 4 files × ~2000 chars) = ~240,000 characters
- Cost: **Free with DeepL Free tier**
- All 246 languages with Google Translate: ~$25-50 one-time cost

## Troubleshooting

### "DEEPL_API_KEY not found"
Make sure you've created a `.env` file and added your API key.

### Rate limiting errors
The script includes automatic delays between requests. If you still hit rate limits:
- Increase the `sleep()` delays in `translate.ts`
- Use a DeepL Pro account (higher rate limits)

### Translation quality issues
- For critical content, consider human review
- Use the `--force` flag to re-translate after fixing source text
- Community contributions can help refine translations

## Development

To modify the translation script:

```bash
# Edit the script
code scripts/translate.ts

# Test with a single language
pnpm translate:lang es

# Test with force flag
pnpm translate:force --lang es
```

## Best Practices

1. **Always translate from English** - Don't chain translations (EN → ES → PT)
2. **Keep source files clean** - Good English = Good translations
3. **Use proper formatting** - Preserve `\n` for line breaks
4. **Test after translation** - Check a few languages manually
5. **Version control** - Commit translations separately from code changes

## Next Steps

1. Add Google Translate API for additional languages
2. Set up CI/CD to auto-translate on content changes
3. Create translation review workflow
4. Add community contribution system
5. Implement translation memory for consistency
