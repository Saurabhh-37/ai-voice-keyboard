# Troubleshooting "Unauthorized" Error

If you're getting "Unauthorized" errors even after adding `FIREBASE_ADMIN_SDK`, follow these steps:

## Step 1: Verify .env.local File

1. **Check file exists**: Make sure `.env.local` is in the project root (same folder as `package.json`)

2. **Check format**: Your `.env.local` should have:
   ```env
   DATABASE_URL="postgresql://postgres:..."
   FIREBASE_ADMIN_SDK={"type":"service_account",...}
   ```

3. **Verify JSON format**: The `FIREBASE_ADMIN_SDK` should be valid JSON on a single line

## Step 2: Restart Dev Server

**Critical**: After adding/updating `.env.local`, you MUST restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Next.js only loads `.env.local` on startup, so changes won't take effect until you restart.

## Step 3: Check Server Logs

When you start the dev server, look for these messages in the terminal:

✅ **Success**: `✅ Firebase Admin initialized successfully`

❌ **Error**: `❌ Error parsing Firebase Admin SDK` or `⚠️ FIREBASE_ADMIN_SDK not set`

## Step 4: Verify You're Logged In

The API requires you to be authenticated. Make sure:

1. You've signed up/logged in
2. You're on a protected route (like `/home`)
3. Check browser console for: `✅ Got auth token`

## Step 5: Test Authentication

Visit this test endpoint in your browser (while logged in):
```
http://localhost:3000/api/test-auth
```

This will show you:
- If the token is being sent
- If Firebase Admin is initialized
- What error is occurring

## Step 6: Check Browser Console

Open browser DevTools → Console and look for:
- `✅ Got auth token, length: XXX` - Token is being retrieved
- `⚠️ No current user found` - You're not logged in
- `❌ Error getting auth token` - Firebase client issue

## Step 7: Check Server Console

In your terminal where `npm run dev` is running, look for:
- `✅ Firebase Admin initialized successfully` - Admin SDK is working
- `✅ Token verified successfully` - Token verification is working
- `❌ Error verifying Firebase token` - Token verification failed

## Common Issues

### Issue 1: Dev Server Not Restarted
**Solution**: Stop and restart `npm run dev`

### Issue 2: Not Logged In
**Solution**: Sign up/login first, then try API calls

### Issue 3: Invalid JSON Format
**Solution**: Make sure `FIREBASE_ADMIN_SDK` is valid JSON on one line

### Issue 4: Wrong Project ID
**Solution**: Verify the `project_id` in FIREBASE_ADMIN_SDK matches your Firebase project

## Quick Test

1. **Restart dev server**: `npm run dev`
2. **Check server logs** for Firebase Admin initialization
3. **Login to your app**
4. **Open browser console** and check for token messages
5. **Visit** `/api/test-auth` to see detailed auth status

## Still Not Working?

Share these details:
1. Server console output (Firebase Admin initialization messages)
2. Browser console output (token retrieval messages)
3. Response from `/api/test-auth` endpoint


