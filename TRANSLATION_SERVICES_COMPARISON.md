# Translation Services Comparison 2025

Complete comparison of translation services for Orbital Temple's 246-language support.

---

## 📊 Quick Comparison Table

| Service | Languages | Free Tier | Paid Price | Quality | Best For |
|---------|-----------|-----------|------------|---------|----------|
| **DeepL** | 30 | 500K chars/month | $20/1M chars | ⭐⭐⭐⭐⭐ Best | European languages, critical content |
| **Google Cloud** | 249 | 500K chars/month | $20/1M chars | ⭐⭐⭐⭐ Excellent | Most languages, reliability |
| **Microsoft Azure** | 249 | 2M chars/month | $10/1M chars | ⭐⭐⭐ Good | Enterprise, MS ecosystem |
| **AWS Translate** | 75+ | 2M chars/12mo | $15/1M chars | ⭐⭐⭐⭐ Excellent | AWS ecosystem, cost |

---

## 🥇 Service #1: DeepL (Highest Quality)

### **Overview**
- **Languages:** 30 (but highest quality)
- **Free Tier:** 500,000 characters/month
- **Paid Price:** €20 (~$22) per 1 million characters
- **Quality Rating:** ⭐⭐⭐⭐⭐ (Best in class)

### **Supported Languages (30)**
Arabic, Bulgarian, Chinese (simplified), Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Hungarian, Indonesian, Italian, Japanese, Korean, Latvian, Lithuanian, Norwegian, Polish, Portuguese, Romanian, Russian, Slovak, Slovenian, Spanish, Swedish, Turkish, Ukrainian

### **Pros**
✅ **Best translation quality** - Industry consensus
✅ **Most natural-sounding** - Especially for European languages
✅ **Free tier is generous** - 500K chars/month
✅ **No credit card for free tier** - Actually, you DO need one for verification (see below)
✅ **Simple API** - Easy to integrate
✅ **Formality control** - Can choose formal/informal tone
✅ **Context awareness** - Better at understanding nuance

### **Cons**
❌ Only 30 languages (vs 130-249 for competitors)
❌ Requires credit card even for free tier (verification only)
❌ Slightly more expensive than Microsoft

### **How to Get API Key**

**Step 1: Sign Up**
1. Go to: https://www.deepl.com/pro-api
2. Click "Sign up for free"
3. Choose "DeepL API Free"

**Step 2: Verify Identity**
1. Enter your email and password
2. **Important:** You'll need to enter credit card details
   - This is for identity verification only
   - You will NOT be charged on the free tier
   - Card is only charged if you exceed 500K chars/month

**Step 3: Get Your API Key**
1. After signing up, go to: https://www.deepl.com/account/keys
2. Or login and navigate to "API Keys & Limits" tab
3. Copy your API authentication key

**Step 4: Important for Free Tier**
⚠️ If using the free tier, use this endpoint:
```
https://api-free.deepl.com
```
Not the regular `https://api.deepl.com`

### **Cost for Your Project**
- Your content: ~10,000 chars × 30 languages = 300,000 characters
- **Cost: FREE** ✅ (under 500K limit)

### **Recommendation**
⭐ **Use for your top 30 languages** - These cover ~80% of internet users and you get the best quality for free!

---

## 🥈 Service #2: Google Cloud Translation (Most Languages)

### **Overview**
- **Languages:** 249 (most comprehensive)
- **Free Tier:** 500,000 characters/month
- **Paid Price:** $20 per 1 million characters
- **Quality Rating:** ⭐⭐⭐⭐ (Excellent)

### **Supported Languages**
249 languages including rare ones - basically covers all world languages

### **Pros**
✅ **Most languages** - 249 vs competitors' 30-75
✅ **Reliable infrastructure** - Google's global network
✅ **Good quality** - 4/5 stars across the board
✅ **Generous free tier** - 500K chars/month ongoing
✅ **Document translation** - Can translate whole files
✅ **Glossary support** - Custom terminology
✅ **AutoML** - Train custom models

### **Cons**
❌ Slightly lower quality than DeepL (but still excellent)
❌ More complex setup than DeepL
❌ Requires Google Cloud account

### **How to Get API Key**

**Step 1: Create Google Cloud Account**
1. Go to: https://console.cloud.google.com
2. Sign in with Google account
3. Accept terms and conditions

**Step 2: Create a Project**
1. Click "Create Project"
2. Name it "orbital-temple" or similar
3. Wait for project creation

**Step 3: Enable Translation API**
1. Go to: https://console.cloud.google.com/apis/library/translate.googleapis.com
2. Click "Enable"

**Step 4: Create API Key**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "API Key"
3. Copy your API key
4. **Recommended:** Click "Restrict Key" and limit to "Cloud Translation API"

**Alternative: Service Account (More Secure)**
1. Create Credentials → Service Account
2. Download JSON key file
3. Use file path in your .env

### **Cost for Your Project**
- Your content: ~10,000 chars × 249 languages = 2,490,000 characters
- First 500K: **FREE**
- Remaining 1,990,000: 1.99M × $20/1M = **$39.80**
- **Total: ~$40 for all 249 languages**

### **Recommendation**
⭐ **Use for languages 31-246** - Fill in the gaps after DeepL

---

## 🥉 Service #3: Microsoft Azure Translator (Best Value)

### **Overview**
- **Languages:** 249 (same as Google)
- **Free Tier:** 2 million characters/month (most generous!)
- **Paid Price:** $10 per 1 million characters (cheapest!)
- **Quality Rating:** ⭐⭐⭐ (Good)

### **Pros**
✅ **Cheapest** - $10/1M (half of Google/DeepL)
✅ **Most generous free tier** - 2M chars/month
✅ **Most languages** - 249 (tied with Google)
✅ **Office integration** - Works with MS Office, Teams
✅ **Good for enterprise** - If already using Azure

### **Cons**
❌ **Lower quality** - Consensus is 3/5 stars
❌ **Weaker on idioms** - Can create awkward translations
❌ **Less natural** - Compared to DeepL and Google
❌ Some users report "invented" words in edge cases

### **How to Get API Key**

**Step 1: Create Azure Account**
1. Go to: https://azure.microsoft.com/en-us/free/
2. Sign up (requires credit card but has free tier)

**Step 2: Create Translator Resource**
1. Go to: https://portal.azure.com
2. Click "Create a resource"
3. Search for "Translator"
4. Click "Create"

**Step 3: Configure Resource**
1. Choose subscription
2. Create new resource group or use existing
3. Select region (choose closest to users)
4. Choose pricing tier: "Free F0" for testing, "S1" for production
5. Click "Review + Create"

**Step 4: Get API Key**
1. Go to your Translator resource
2. Click "Keys and Endpoint"
3. Copy Key 1 and Endpoint URL

### **Cost for Your Project**
- Your content: ~2,490,000 characters for 249 languages
- **First 2M: FREE** ✅
- Remaining 490,000: 0.49M × $10/1M = **$4.90**
- **Total: ~$5 for all 249 languages** 🎉

### **Recommendation**
⭐ **Best if budget is tight** - Cheapest option, but lower quality

---

## 🔧 Service #4: AWS Translate

### **Overview**
- **Languages:** 75+
- **Free Tier:** 2 million characters/month for first 12 months only
- **Paid Price:** $15 per 1 million characters
- **Quality Rating:** ⭐⭐⭐⭐ (Excellent)

### **Pros**
✅ Good quality (4/5 stars)
✅ Fast processing
✅ Good AWS ecosystem integration
✅ Reasonable pricing
✅ Generous free tier (first year)

### **Cons**
❌ Fewer languages (75 vs 249)
❌ Free tier only for first 12 months
❌ Requires AWS account setup (can be complex)
❌ Not ideal if you need 246 languages

### **How to Get API Key**

**Step 1: Create AWS Account**
1. Go to: https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow signup process

**Step 2: Create IAM User**
1. Go to: https://console.aws.amazon.com/iam/
2. Click "Users" → "Add user"
3. Give permissions for "TranslateFullAccess"

**Step 3: Get Access Keys**
1. Select your user
2. Go to "Security credentials"
3. Click "Create access key"
4. Download CSV with Key ID and Secret

### **Cost for Your Project**
- Only 75 languages (not enough for your 246-language goal)
- Not recommended for this project

### **Recommendation**
⚠️ **Skip for Orbital Temple** - Not enough languages

---

## 💰 Total Cost Comparison for Orbital Temple

### Your Content Size
- 4 JSON files × ~2,500 characters = ~10,000 chars per language

### Strategy 1: DeepL Only (30 languages)
| Item | Cost |
|------|------|
| 30 languages × 10K chars | **FREE** ✅ |
| Coverage | 30 languages (~80% of users) |
| **Total** | **$0** |

### Strategy 2: DeepL + Google (246 languages)
| Item | Cost |
|------|------|
| DeepL: 30 languages | **FREE** ✅ |
| Google: 216 languages (2.16M chars) | **$32** |
| Coverage | 246 languages (100% of users) |
| **Total** | **~$32** |

### Strategy 3: DeepL + Microsoft (246 languages)
| Item | Cost |
|------|------|
| DeepL: 30 languages | **FREE** ✅ |
| Microsoft: 216 languages (2.16M chars) | **$11.60** |
| Coverage | 246 languages (100% of users) |
| **Total** | **~$12** |

### Strategy 4: Microsoft Only (246 languages)
| Item | Cost |
|------|------|
| Microsoft: 246 languages (2.46M chars) | **$4.60** |
| Coverage | 246 languages (but lower quality) |
| **Total** | **~$5** |

---

## 🎯 Our Recommendation for Orbital Temple

### **Recommended Strategy: Hybrid (DeepL + Google)**

**Phase 1: Launch with Top 30 Languages (FREE)**
```bash
# Use DeepL for best quality
pnpm translate

Coverage: English, Spanish, French, German, Portuguese, Russian,
         Japanese, Chinese, Arabic, Hindi, Italian, Turkish,
         Korean, Dutch, Polish, Indonesian, and 14 more
Users covered: ~80% of internet users
Cost: $0
```

**Phase 2: Add Remaining 216 Languages (~$32)**
```bash
# Use Google for comprehensive coverage
pnpm translate:google:all

Coverage: All remaining languages
Users covered: 100% of the world
Cost: ~$32 one-time
```

**Total Investment: ~$32**
**Languages: 246**
**Quality: Best (DeepL) for major languages, Excellent (Google) for others**

---

## 🏆 Quality Rankings by Use Case

### For European Languages
1. **DeepL** ⭐⭐⭐⭐⭐ (Best)
2. Google ⭐⭐⭐⭐
3. AWS ⭐⭐⭐⭐
4. Microsoft ⭐⭐⭐

### For Asian Languages
1. **Google** ⭐⭐⭐⭐⭐ (Best)
2. DeepL ⭐⭐⭐⭐ (limited languages)
3. AWS ⭐⭐⭐⭐
4. Microsoft ⭐⭐⭐

### For Rare Languages
1. **Google** ⭐⭐⭐⭐⭐ (249 languages)
2. **Microsoft** ⭐⭐⭐⭐ (249 languages)
3. AWS ⭐⭐ (only 75 languages)
4. DeepL ⚠️ (only 30 languages)

### For Technical/Business Content
1. **DeepL** ⭐⭐⭐⭐⭐
2. Google ⭐⭐⭐⭐
3. AWS ⭐⭐⭐⭐
4. Microsoft ⭐⭐⭐

### For Poetic/Creative Content (Your Manifesto)
1. **DeepL** ⭐⭐⭐⭐⭐ (preserves nuance)
2. Google ⭐⭐⭐⭐
3. AWS ⭐⭐⭐
4. Microsoft ⭐⭐ (can be awkward)

---

## 📝 Step-by-Step Setup Guide

### Option 1: DeepL (Recommended to Start)

```bash
# 1. Sign up at DeepL
# Visit: https://www.deepl.com/pro-api
# Click "Sign up for free"
# Enter credit card (for verification, won't be charged)

# 2. Get your API key
# Visit: https://www.deepl.com/account/keys
# Copy your authentication key

# 3. Add to your .env
echo "DEEPL_API_KEY=your_key_here" >> .env

# 4. Translate
pnpm translate

# Done! 30 languages, $0 cost
```

### Option 2: Google Cloud Translation

```bash
# 1. Create Google Cloud account
# Visit: https://console.cloud.google.com
# Create new project

# 2. Enable Translation API
# Visit: https://console.cloud.google.com/apis/library/translate.googleapis.com
# Click "Enable"

# 3. Create API key
# Visit: https://console.cloud.google.com/apis/credentials
# Create Credentials → API Key

# 4. Add to your .env
echo "GOOGLE_TRANSLATE_API_KEY=your_key_here" >> .env

# 5. Translate
pnpm translate:google:all

# Done! 249 languages, ~$40 cost
```

### Option 3: Microsoft Azure (Cheapest)

```bash
# 1. Create Azure account
# Visit: https://azure.microsoft.com/free/

# 2. Create Translator resource
# Visit: https://portal.azure.com
# Create resource → Translator

# 3. Get API key
# Go to resource → Keys and Endpoint
# Copy Key 1

# 4. We need to update the script for Azure
# (Currently only supports DeepL and Google)
```

---

## ⚠️ Important Notes

### About DeepL's "Free" Tier
- Requires credit card for verification
- You WON'T be charged unless you exceed 500K chars/month
- If you're worried, set up billing alerts in your DeepL account
- Free tier is ongoing (not just trial)

### About Google Cloud's Free Tier
- 500K chars/month is ongoing (not just first 12 months)
- Google Cloud has $300 free credit for new accounts (first 90 days)
- With free credit, even the $40 cost becomes FREE initially

### About API Rate Limits
- DeepL Free: 5 requests/second
- Google: 300K chars/minute
- Microsoft: 2M chars/hour
- Our scripts include rate limiting, so you won't hit these

---

## 🎯 Final Recommendation

**For Orbital Temple, use this strategy:**

1. **Start with DeepL** (Today, 5 minutes, $0)
   - Get 30 languages free
   - Covers 80% of users
   - Best quality for your manifesto

2. **Add Google later** (When you're ready, 30 minutes, ~$32)
   - Get remaining 216 languages
   - 100% world coverage
   - Good quality

**Total: $32 for all 246 languages with best quality mix** ✨

---

## 📚 Quick Links

| Service | Sign Up | API Docs | Pricing |
|---------|---------|----------|---------|
| **DeepL** | [Sign up](https://www.deepl.com/pro-api) | [Docs](https://developers.deepl.com/docs) | [Pricing](https://www.deepl.com/pro-api) |
| **Google** | [Sign up](https://console.cloud.google.com) | [Docs](https://cloud.google.com/translate/docs) | [Pricing](https://cloud.google.com/translate/pricing) |
| **Microsoft** | [Sign up](https://azure.microsoft.com/free/) | [Docs](https://learn.microsoft.com/azure/cognitive-services/translator/) | [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator/) |
| **AWS** | [Sign up](https://aws.amazon.com) | [Docs](https://docs.aws.amazon.com/translate/) | [Pricing](https://aws.amazon.com/translate/pricing/) |

---

**Last Updated:** January 2025
**For:** Orbital Temple 246-language support
