# Translation Workflow

This directory contains the Google Translate–based script for managing translations for the Orbital Temple.

## Prerequisites

1. **Google Cloud Translation API credentials**
   - Create a service account in Google Cloud Console
   - Download the JSON key file
   - Reference it via `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Then edit .env with your credentials
   ```

## Usage

```bash
pnpm translate:google            # translate all supported languages
pnpm translate:google:lang es    # single language
pnpm translate:google:all        # all 246 target locales
```

Source files live in `public/locales/en/`. Translated files are written to `public/locales/{lang}/`.
