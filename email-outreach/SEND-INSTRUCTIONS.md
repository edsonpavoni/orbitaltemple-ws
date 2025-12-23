# How to Send 12K Launch Emails TODAY

## ✅ What's Ready:

- **12,241 emails** exported from Firebase
- **Language detection** built-in (995 Portuguese, 11,246 English)
- **Resend Pro** upgraded ($20/month - 50K emails/month)
- **Sending script** created with rate limiting

---

## 🚀 Send Emails in 3 Steps:

### Step 1: Install Resend Package (30 seconds)

```bash
cd /Users/edsonpavoni/orbitaltemple-ws-clean/email-outreach
npm init -y
npm install resend
```

### Step 2: Set Resend API Key (30 seconds)

Create `.env` file:

```bash
echo "RESEND_API_KEY=REDACTED_RESEND_KEY" > .env
```

### Step 3: Send the Emails! (About 2 hours for 12K emails)

```bash
RESEND_API_KEY=REDACTED_RESEND_KEY npx tsx send-launch-emails.ts
```

**That's it!** The script will:
- ✅ Read `all-names.csv` with language field
- ✅ Send English template to English subscribers
- ✅ Send Portuguese template to Portuguese subscribers
- ✅ Rate limit to 2 emails/second (Resend limit)
- ✅ Show progress every 100 emails
- ✅ Create a log file when done

---

## ⏱️ Expected Timeline:

- **Rate:** 2 emails/second (Resend limit)
- **Total:** 12,241 emails
- **Time:** ~102 minutes (~1 hour 42 minutes)

The script shows progress updates:
- Every 100 emails: counter
- Every 500 emails: detailed stats with ETA

---

## 🎯 What the Email Says:

### English Version:
**Subject:** `[NAME] is going to space in less than 2 months`

**Content:**
- Personal greeting with days since submission
- Launch window announcement (Dec 25, 2025 - Jan 23, 2026)
- Story of 3-year journey
- New website link: orbitaltemple.art
- Support page link: orbitaltemple.art/support
- Instagram follow link

### Portuguese Version:
**Assunto:** `[NAME] vai para o espaço em menos de 2 meses`

**Conteúdo:** (Same structure, fully translated)

---

## 🛡️ Safety Features:

1. **5-second warning** before starting
2. **Rate limiting** (respects Resend's 2 req/sec limit)
3. **Progress tracking** (see where you are)
4. **Error handling** (continues if one email fails)
5. **Log file** saved after completion

---

## 📊 Monitoring:

While sending, you'll see:
```
✅ Sent 100/12241 emails...
✅ Sent 200/12241 emails...
...
📊 Progress: 500/12241 (4%)
   Rate: 2.00 emails/sec
   ETA: 98 minutes
```

---

## ⚠️ Important Notes:

### Domain Setup
**Current:** Emails send from `noreply@orbitaltemple.art`

**Before sending, verify:**
1. Go to: https://resend.com/domains
2. Check if `orbitaltemple.art` is verified
3. If not verified, you need to add DNS records

**Alternative:** Send from Resend's domain (but less professional):
- Change `from:` to `'Edson Pavoni <onboarding@resend.dev>'` in the script

### If Script Fails:
The script is designed to continue even if individual emails fail. If it crashes:
1. Check which email number it stopped at (in console)
2. Edit CSV to skip already-sent emails
3. Run again

### Resend Dashboard:
Monitor sends in real-time:
https://resend.com/emails

---

## 🎉 After Sending:

Check:
- **Open rates** (expect 20-30%)
- **Click rates** (expect 2-5%)
- **Bounces** (expect <1%)
- **Support page visits** at orbitaltemple.art/support

---

## 📝 What's Created:

After completion:
- `output/send-log-[timestamp].txt` - Complete send statistics
- Console output showing success/fail counts
- Resend dashboard with all email data

---

**Ready to send?** Run the 3 steps above and let's launch this campaign! 🚀
