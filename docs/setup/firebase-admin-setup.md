# Firebase Admin SDK Setup for Local Development

## Why You Need This

The API routes need Firebase Admin SDK to verify authentication tokens on the server side. Without it, you'll get "Unauthorized" errors.

## Step 1: Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon (⚙️) → **Project settings**
4. Go to **Service accounts** tab
5. Click **"Generate new private key"**
6. Download the JSON file (e.g., `voice-keyboard-272ad-firebase-adminsdk-xxxxx.json`)

## Step 2: Add to .env.local

Open the downloaded JSON file and copy its entire contents.

In your `.env.local` file, add:

```env
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"voice-keyboard-272ad","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Important**: 
- Paste the entire JSON as a single line
- Keep all the quotes and escape characters
- The private key should include `\n` characters for line breaks

## Step 3: Restart Dev Server

After adding `FIREBASE_ADMIN_SDK` to `.env.local`:

```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Test

1. Sign up/login to your app
2. Try creating a transcript
3. The "Unauthorized" error should be gone

## Your .env.local Should Look Like:

```env
DATABASE_URL="postgresql://postgres:JnKqqwAfiLQIZmHVGDmSVvkIAqxyDlMY@trolley.proxy.rlwy.net:29213/railway"

FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"voice-keyboard-272ad",...}
```

## Troubleshooting

### Still Getting "Unauthorized"

1. **Check .env.local exists** in the project root
2. **Verify FIREBASE_ADMIN_SDK** is set correctly
3. **Restart dev server** after adding the variable
4. **Check console logs** for Firebase Admin initialization errors

### "Error parsing Firebase Admin SDK"

- Make sure the JSON is valid
- Ensure it's all on one line
- Check that quotes are properly escaped

### "Firebase Admin not initialized"

- Verify `FIREBASE_ADMIN_SDK` is in `.env.local` (not `.env`)
- Make sure you restarted the dev server
- Check the JSON format is correct

## Security Note

⚠️ **Never commit `.env.local` to Git** - it's already in `.gitignore`

The Firebase Admin SDK JSON contains sensitive credentials. Keep it secure!

