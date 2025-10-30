# Firebase Functions for Orbital Temple Name Ascension

Backend API for managing name submissions and sending confirmation emails.

## Functions

### submitName
- **Type**: HTTPS Callable
- **Method**: POST
- **Description**: Accepts name submissions and stores them in Firestore
- **Body**: `{ name: string, email: string }`
- **Response**: `{ success: boolean, id: string, message: string }`

### getNames
- **Type**: HTTPS Callable
- **Method**: GET
- **Description**: Retrieves all name submissions (for admin interface)
- **Response**: `{ success: boolean, names: Array }`

### updateNameStatus
- **Type**: HTTPS Callable
- **Method**: POST
- **Description**: Updates the status of a name submission
- **Body**: `{ nameId: string, status: 'pending' | 'sent' | 'confirmed' }`
- **Response**: `{ success: boolean, message: string }`

### sendConfirmationEmail
- **Type**: Firestore Trigger
- **Description**: Automatically sends confirmation email when status changes to "confirmed"
- **Trigger**: `names/{nameId}` document update

## Local Development

### Install Dependencies
```bash
npm install
```

### Build TypeScript
```bash
npm run build
```

### Watch Mode
```bash
npm run build:watch
```

### Local Emulator
```bash
npm run serve
```

This starts the Firebase emulator suite. Functions will be available at:
- `http://localhost:5001/YOUR_PROJECT/us-central1/FUNCTION_NAME`

## Environment Variables

Required environment variable:
- `RESEND_API_KEY`: API key from Resend

Set via Firebase CLI:
```bash
firebase functions:config:set resend.api_key="YOUR_KEY"
```

For local development, create `.runtimeconfig.json`:
```json
{
  "resend": {
    "api_key": "re_YOUR_KEY"
  }
}
```

## Deployment

```bash
npm run deploy
```

Or deploy all Firebase resources:
```bash
cd ..
firebase deploy
```

## Testing

### Test submitName
```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/submitName \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Name","email":"test@example.com"}'
```

### Test getNames
```bash
curl https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/getNames
```

### Test updateNameStatus
```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/updateNameStatus \
  -H "Content-Type: application/json" \
  -d '{"nameId":"DOCUMENT_ID","status":"confirmed"}'
```

## Logs

View function logs:
```bash
firebase functions:log
```

Or view in Firebase Console → Functions → Logs

## Email Template Customization

Edit the email text in `src/index.ts` at line ~101:

```typescript
text: `Today, ${formattedDate}, at ${formattedTime} the name ${afterData.name} ascend, and there it remains.`,
```

For HTML emails, add an `html` field:

```typescript
html: `<p>Today, ${formattedDate}, at ${formattedTime} the name <strong>${afterData.name}</strong> ascend, and there it remains.</p>`,
```

## Security

- CORS is enabled for all origins (`*`)
- For production, consider restricting origins
- Add authentication for admin endpoints
- Implement rate limiting for public endpoints
