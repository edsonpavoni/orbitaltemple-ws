# Orbital Temple Email Campaign Export Tool

This folder contains scripts to export Firebase names data for the Resend email campaign announcing the launch window.

## What This Does

1. **Reads** all names from Firestore "names" collection
2. **Calculates** days since each person submitted their name
3. **Detects** language (English or Portuguese) based on email domain
4. **Exports** to 3 CSV files:
   - `all-names.csv` - All records combined
   - `names-english.csv` - English language subscribers
   - `names-portuguese.csv` - Portuguese language subscribers

## Prerequisites

- Node.js installed
- Firebase Admin SDK access (automatically configured from parent project)
- `tsx` installed (comes from parent project's devDependencies)

## How to Run

### Step 1: Run the Export Script

```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean/email-outreach
tsx export-names-for-resend.ts
```

### Step 2: Check the Output

The script creates an `output/` folder with 3 CSV files:

```
output/
  ├── all-names.csv          (all records)
  ├── names-english.csv      (English subscribers)
  └── names-portuguese.csv   (Portuguese subscribers)
```

Each CSV has these columns:
- `email` - Email address
- `name` - Name submitted to go to space
- `daysAgo` - Days since submission (calculated)
- `language` - "en" or "pt"
- `submissionDate` - Date of submission (YYYY-MM-DD)

## Language Detection Logic

The script uses email domain heuristics to detect language:

### Portuguese Detection
Emails containing these patterns are marked as Portuguese (`pt`):
- `.br` (Brazil TLD)
- `uol.com` (Brazilian ISP)
- `globo.com`
- `terra.com.br`
- `bol.com.br`
- `ig.com.br`
- `r7.com`
- `zipmail.com.br`

### English (Default)
All other emails are marked as English (`en`)

## Next Steps After Export

### 1. Review the CSV Files

Open the CSV files in Excel/Numbers/Google Sheets to verify:
- Email addresses look valid
- Names are correct
- Days calculation makes sense
- Language detection is accurate

### 2. Upgrade Resend to Pro ($20/month)

Visit: https://resend.com/settings/billing
- Upgrade from Free to Pro ($20/month)
- This allows 50,000 emails/month (enough for 12K)

### 3. Import to Resend

**Create Two Audiences:**

**Audience 1: "Orbital Temple - English"**
1. Go to https://resend.com/audiences
2. Click "Create Audience"
3. Name: "Orbital Temple - English"
4. Click "Import Contacts"
5. Upload `names-english.csv`
6. Map columns:
   - Email → email
   - Name → name
   - Days Ago → daysAgo

**Audience 2: "Orbital Temple - Portuguese"**
1. Repeat above steps
2. Name: "Orbital Temple - Portuguese"
3. Upload `names-portuguese.csv`
4. Same column mapping

### 4. Create Email Templates in Resend

**Template 1: orbital-temple-launch-en**

Subject: `{{name}} is going to space in less than 2 months`

Body:
```
{{daysAgo}} days ago, you decided to participate in the Orbital Temple project by sending the name "{{name}}" to ascend into space.

I'm writing to tell you: our launch window is official.

After 3 years of work and 3 cancelled launches by SpaceX—not their fault—we partnered with the Indian Space Research Organisation (ISRO) to bring our artwork to orbit.

Last week, ISRO officially locked the launch window:

December 25, 2025 – January 23, 2026

This means that after 3 years of development, we are less than 2 months away from seeing the Orbital Temple in space.

This is a very special moment for me as an artist, for the more than 30 people involved in this project, and I hope it is for you too.

The new website is live:
https://orbitaltemple.art

You can send more names to the temple or share it with your friends and family.

A lot of people have been asking how to support this artwork. If you'd like to contribute to the project, you can visit:
https://orbitaltemple.art/support/

Thank you for being part of this journey to space.

Edson Pavoni

P.S. Follow along at [Instagram links] for launch updates.
```

**Template 2: orbital-temple-launch-pt**

Assunto: `{{name}} vai para o espaço em menos de 2 meses`

Body: (See Portuguese version in orbital-temple-email-BILINGUAL-FINAL.md)

### 5. Send the Campaigns

**Friday, December 13, 2025 - Morning**

1. **Send English Campaign:**
   - Audience: "Orbital Temple - English"
   - Template: "orbital-temple-launch-en"
   - Time: 9:00 AM EST

2. **Send Portuguese Campaign:**
   - Audience: "Orbital Temple - Portuguese"
   - Template: "orbital-temple-launch-pt"
   - Time: 9:00 AM EST (same time, different list)

### 6. Monitor Results

After sending:
- Check open rates
- Check click rates (orbitaltemple.art links)
- Monitor support page visits
- Watch for any bounce/spam issues

### 7. Cancel or Keep Pro

**Option A:** Cancel Pro tier after sending
- Downgrade back to Free tier
- Saves money if you don't need 50K/month regularly

**Option B:** Keep Pro tier
- Keep if you want analytics/tracking
- Keep if you plan to send more emails soon
- Only $20/month

## Troubleshooting

### Script Fails to Run

**Error: "Cannot find module 'firebase-admin'"**
```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean/functions
npm install
```

**Error: "tsx: command not found"**
```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean
npm install
```

### Firebase Permission Issues

Make sure you're using the same Firebase project credentials as the functions.
The script uses `admin.initializeApp()` which automatically loads credentials.

### CSV Import Issues in Resend

- Make sure CSV is UTF-8 encoded
- Check for special characters in names
- Verify email addresses are valid

## Files in This Folder

```
email-outreach/
  ├── README.md                          (this file)
  ├── export-names-for-resend.ts         (export script)
  ├── output/                            (generated after running script)
  │   ├── all-names.csv
  │   ├── names-english.csv
  │   └── names-portuguese.csv
  └── templates/                         (email templates - to be created)
      ├── email-template-en.md
      └── email-template-pt.md
```

## Cost Summary

**Total Cost:** $20 (one-time)
- Resend Pro: $20/month (can cancel after sending)
- Export script: Free
- CSV files: Free

## Timeline

- **Tonight (Dec 9):** Run export script, review CSV files
- **Tomorrow (Dec 10):** Upgrade Resend, import audiences
- **Wednesday (Dec 11):** Create email templates, test sends
- **Thursday (Dec 12):** Final review
- **Friday (Dec 13):** SEND TO 12K PEOPLE! 🚀

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify Firebase connection is working
3. Make sure you have the latest code from git

---

**Last Updated:** December 9, 2025
