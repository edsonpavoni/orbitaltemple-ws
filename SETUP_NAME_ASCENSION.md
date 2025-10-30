# Name Ascension System Setup Guide

This guide will help you set up the complete name ascension system for the Orbital Temple project.

## Overview

The system consists of:
- **Firestore Database**: Stores name submissions with status tracking (pending/sent/confirmed)
- **Firebase Functions**: Backend API for submitting names and updating status
- **Resend Email Service**: Sends confirmation emails when names are confirmed
- **Admin Interface**: Web page to manage name status

## Prerequisites

1. Node.js (v20 or higher)
2. Firebase CLI
3. A Firebase project (free plan is sufficient)
4. A Resend account (free plan: 3000 emails/month)

## Step 1: Set Up Firebase

### 1.1 Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 1.2 Login to Firebase

```bash
firebase login
```

### 1.3 Initialize Firebase Project

If you haven't already connected this directory to a Firebase project:

```bash
firebase projects:list
```

Note your project ID from the list.

### 1.4 Enable Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to "Build" → "Firestore Database"
4. Click "Create database"
5. Choose "Start in production mode" (we have custom rules)
6. Select a location close to your users

### 1.5 Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Step 2: Set Up Resend Email Service

### 2.1 Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (3000 emails/month)
3. Verify your email

### 2.2 Get API Key

1. Go to [API Keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the API key (starts with `re_`)

### 2.3 Verify Your Domain (Optional but Recommended)

For production use, verify your own domain:
1. Go to [Domains](https://resend.com/domains)
2. Add your domain
3. Follow DNS setup instructions

For testing, you can use the default `onboarding@resend.dev` sender.

## Step 3: Set Up Firebase Functions

### 3.1 Install Dependencies

```bash
cd functions
npm install
```

### 3.2 Configure Environment Variables

Set your Resend API key:

```bash
firebase functions:config:set resend.api_key="YOUR_RESEND_API_KEY"
```

To verify:

```bash
firebase functions:config:get
```

### 3.3 Update Email Sender (Optional)

If you verified a domain in Resend, update the email sender in `functions/src/index.ts`:

```typescript
from: "Orbital Temple <noreply@yourdomain.com>",  // Change this
```

### 3.4 Build Functions

```bash
npm run build
```

### 3.5 Deploy Functions

```bash
cd ..
firebase deploy --only functions
```

After deployment, you'll see URLs for your functions. Copy these URLs.

## Step 4: Configure Frontend

### 4.1 Update SendNameFormNew Component

Edit `src/components/SendNameFormNew.tsx` and replace the placeholder URL:

```typescript
const FUNCTIONS_URL = 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net';
```

With your actual Firebase Functions URL (without the function name at the end).

Example:
```typescript
const FUNCTIONS_URL = 'https://us-central1-orbital-temple-xyz.cloudfunctions.net';
```

### 4.2 Update Admin Page

Edit `src/pages/admin.astro` and replace the placeholder URL:

```typescript
const FUNCTIONS_URL = 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net';
```

## Step 5: Build and Deploy

### 5.1 Build the Site

```bash
npm run build
```

### 5.2 Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

## Step 6: Test the System

### 6.1 Submit a Test Name

1. Visit your site at `https://YOUR_PROJECT_ID.web.app`
2. Navigate to `/send-a-name`
3. Submit a test name with your email

### 6.2 Check Firestore

1. Go to Firebase Console → Firestore Database
2. You should see a new document in the `names` collection
3. Status should be "pending"

### 6.3 Access Admin Interface

Visit `https://YOUR_PROJECT_ID.web.app/admin`

You should see:
- Statistics showing pending names
- A table with your submitted name
- Buttons to update status

### 6.4 Test Email Flow

1. In the admin interface, click "Mark Sent" on your test name
2. Then click "Mark Confirmed"
3. Check your email - you should receive a confirmation message

## Architecture Details

### Database Schema

**Collection: `names`**

```typescript
{
  name: string,           // The name to be sent to space
  email: string,          // Email for confirmation
  status: "pending" | "sent" | "confirmed",
  createdAt: Timestamp,   // When submitted
  sentAt?: Timestamp,     // When marked as sent to satellite
  confirmedAt?: Timestamp // When satellite confirmed receipt
}
```

### Status Flow

1. **pending**: Name submitted, waiting to be sent to satellite
2. **sent**: Name has been transmitted to the satellite
3. **confirmed**: Satellite confirmed receipt → email sent automatically

### API Endpoints

- **POST /submitName**: Submit a new name
- **GET /getNames**: Get all names (for admin)
- **POST /updateNameStatus**: Update name status (triggers email on "confirmed")

### Email Trigger

The `sendConfirmationEmail` Cloud Function automatically triggers when:
- A name's status changes from anything → "confirmed"
- Sends an email via Resend with the ascension details

## Cost Breakdown (Free Tier Limits)

- **Firestore**: 50k reads + 20k writes per day (plenty for this use case)
- **Cloud Functions**: 2M invocations per month (more than enough)
- **Firebase Hosting**: 10GB storage + 360MB/day transfer (sufficient)
- **Resend**: 3000 emails per month (100 per day)

**Total cost: $0** for typical usage

## Troubleshooting

### Functions not deploying?

Make sure you're on the Blaze (pay-as-you-go) plan:
```bash
firebase projects:list
```

Even though you won't be charged with this usage, Cloud Functions require the Blaze plan.

### CORS errors?

The functions include CORS headers. If you still see errors:
1. Check the browser console for the exact error
2. Verify the FUNCTIONS_URL is correct in both files
3. Make sure functions are deployed successfully

### Email not sending?

1. Check Firebase Console → Functions → Logs
2. Verify Resend API key is set: `firebase functions:config:get`
3. Check Resend dashboard for delivery status

### Can't access admin page?

Currently, the admin page is public. For production, you should:
1. Add Firebase Authentication
2. Update Firestore rules to require authentication for admin operations
3. Add login to the admin page

## Security Considerations

### Current Setup (Simple)

- Name submission is public (anyone can submit)
- Admin operations are public (anyone can update status)
- Reading names is public (anyone can view)

### Recommended for Production

1. **Add Firebase Authentication**:
   - Protect admin endpoints
   - Add login to admin page

2. **Update Firestore Rules**:
   ```
   allow update: if request.auth != null;  // Already in place
   ```

3. **Rate Limiting**:
   - Add rate limiting to submission endpoint
   - Firebase Functions have built-in quotas

4. **Email Validation**:
   - Consider email verification before queuing names

## Next Steps

1. Test the complete flow with real data
2. Customize the email template in `functions/src/index.ts`
3. Add authentication to the admin interface
4. Set up monitoring and alerts in Firebase Console
5. Configure your custom domain for Resend emails

## Support

- Firebase Docs: https://firebase.google.com/docs
- Resend Docs: https://resend.com/docs
- Firebase Console: https://console.firebase.google.com/

---

**Questions or issues?** Check the Firebase Console logs and Resend dashboard for detailed error messages.
