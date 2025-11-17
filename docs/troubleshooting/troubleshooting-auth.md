# Troubleshooting Authentication Issues

If you're getting "Unauthorized" errors even after adding `FIREBASE_ADMIN_SDK`, follow these steps:

## Quick Fix: Restart Dev Server

**Most Common Cause**: Dev server not restarted after adding `FIREBASE_ADMIN_SDK`.

After adding/updating `.env.local`, you **MUST** restart your dev server:

```bash
# 1. Stop the server (Ctrl+C)
# 2. Restart:
npm run dev
```

Next.js only loads `.env.local` on startup, so changes won't take effect until you restart.

---

## Step 1: Verify .env.local File

1. **Check file exists**: Make sure `.env.local` is in the project root (same folder as `package.json`)

2. **Check format**: Your `.env.local` should have:
   ```env
   DATABASE_URL="postgresql://postgres:..."
   FIREBASE_ADMIN_SDK={"type":"service_account",...}
   ```

3. **Verify JSON format**: The `FIREBASE_ADMIN_SDK` should be valid JSON on a single line
   - No line breaks in the JSON
   - All on one line
   - Keep all quotes and escape characters

---

## Step 2: Check Server Logs

When you start the dev server, look for these messages in the terminal:

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

---

## Step 3: Verify You're Logged In

The API requires you to be authenticated. Make sure:

1. You've signed up/logged in
2. You're on a protected route (like `/home`)
3. Check browser console for: `✅ Got auth token`

If you see `⚠️ No current user found`, you're not logged in.

---

## Step 4: Test Authentication

Visit this test endpoint in your browser (while logged in):
```
http://localhost:3000/api/test-auth
```

This will show you:
- If the token is being sent
- If Firebase Admin is initialized
- What error is occurring

---

## Step 5: Check Browser Console

Open browser DevTools → Console and look for:
- `✅ Got auth token, length: XXX` - Token is being retrieved
- `⚠️ No current user found` - You're not logged in
- `❌ Error getting auth token` - Firebase client issue

---

## Step 6: Check Server Console

In your terminal where `npm run dev` is running, look for:
- `✅ Firebase Admin initialized successfully` - Admin SDK is working
- `❌ Error parsing Firebase Admin SDK` - JSON format issue
- `⚠️ FIREBASE_ADMIN_SDK not set` - Environment variable missing

---

## Common Issues

### Issue 1: JSON Format Error
**Symptom**: `Error parsing Firebase Admin SDK`

**Solution**: 
- Ensure `FIREBASE_ADMIN_SDK` is a single-line JSON string
- No line breaks or newlines
- All quotes properly escaped

### Issue 2: Environment Variable Not Loaded
**Symptom**: `FIREBASE_ADMIN_SDK not set`

**Solution**:
- Check `.env.local` file exists in project root
- Restart dev server after adding/updating
- Verify variable name is exactly `FIREBASE_ADMIN_SDK`

### Issue 3: Token Not Being Sent
**Symptom**: `Unauthorized` errors in API calls

**Solution**:
- Verify you're logged in (check browser console)
- Check `Authorization` header is being sent
- Verify Firebase client is initialized

---

## Still Not Working?

1. **Share server startup logs** - What do you see when `npm run dev` starts?
2. **Share browser console** - What messages do you see?
3. **Check** `/api/test-auth` response
4. **Verify** `.env.local` format matches the example above

The issue is almost always that the dev server wasn't restarted after adding `FIREBASE_ADMIN_SDK`.

