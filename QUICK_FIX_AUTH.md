# Quick Fix for "Unauthorized" Error

## Most Common Cause: Dev Server Not Restarted

After adding `FIREBASE_ADMIN_SDK` to `.env.local`, you **MUST** restart the dev server:

```bash
# 1. Stop the server (Ctrl+C)
# 2. Restart:
npm run dev
```

## Verify Setup

### 1. Check .env.local Format

Your `.env.local` should look like:

```env
DATABASE_URL="postgresql://postgres:JnKqqwAfiLQIZmHVGDmSVvkIAqxyDlMY@trolley.proxy.rlwy.net:29213/railway"

FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"voice-keyboard-272ad","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Important**: 
- No line breaks in the JSON
- All on one line
- Keep all quotes and escape characters

### 2. Check Server Logs on Startup

When you run `npm run dev`, look for:

✅ **Success**: 
```
✅ Firebase Admin initialized successfully
```

❌ **Error**: 
```
❌ Error parsing Firebase Admin SDK
```
or
```
⚠️ FIREBASE_ADMIN_SDK not set
```

### 3. Verify You're Logged In

1. Make sure you've signed up/logged in
2. Check browser console for: `✅ Got auth token, length: XXX`
3. If you see `⚠️ No current user found`, you're not logged in

### 4. Test the Auth Endpoint

Visit: `http://localhost:3000/api/test-auth`

This will show you exactly what's wrong.

## Still Not Working?

1. **Share server startup logs** - What do you see when `npm run dev` starts?
2. **Share browser console** - What messages do you see?
3. **Check** `/api/test-auth` response

The issue is almost always that the dev server wasn't restarted after adding FIREBASE_ADMIN_SDK.


