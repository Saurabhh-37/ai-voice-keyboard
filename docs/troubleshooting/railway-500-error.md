# Troubleshooting Railway 500 Error on /api/transcribe

If you're getting a 500 Internal Server Error from `/api/transcribe` on Railway, follow these steps:

## Quick Checklist

1. ✅ **OPENAI_API_KEY** is set in Railway environment variables
2. ✅ **DATABASE_URL** is set in Railway environment variables
3. ✅ **FIREBASE_ADMIN_SDK** is set in Railway environment variables
4. ✅ Database is running and accessible
5. ✅ OpenAI API key is valid and has credits

---

## Step 1: Check Railway Logs

The most important step is to check the Railway deployment logs:

1. Go to your Railway project dashboard
2. Click on your **Next.js service** (the web app service)
3. Go to **"Deployments"** tab
4. Click on the latest deployment
5. Check the **"Logs"** tab

Look for error messages like:
- `"OPENAI_API_KEY is not configured"`
- `"Database connection error"`
- `"Error in /api/transcribe"`
- `"Firebase Admin initialization error"`

---

## Step 2: Verify Environment Variables

In Railway, go to your **Next.js service** → **"Variables"** tab and verify these are set:

### Required Variables:

```env
# Database
DATABASE_URL=postgresql://postgres:password@host:port/railway?sslmode=require

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_SDK={"type":"service_account",...}

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Common Issues:

#### Issue 1: Missing OPENAI_API_KEY
**Symptom**: Error message "OPENAI_API_KEY is not configured"

**Solution**:
1. Go to Railway → Your service → Variables
2. Add `OPENAI_API_KEY` with your OpenAI API key
3. Redeploy the service (Railway will auto-redeploy)

#### Issue 2: Invalid OPENAI_API_KEY
**Symptom**: OpenAI API returns 401 or invalid key error

**Solution**:
1. Verify your OpenAI API key at https://platform.openai.com/api-keys
2. Make sure the key starts with `sk-`
3. Check your OpenAI account has credits/billing set up
4. Update the key in Railway and redeploy

#### Issue 3: Database Connection Error
**Symptom**: Database query errors in logs

**Solution**:
1. Verify `DATABASE_URL` is correct in Railway variables
2. Check your PostgreSQL service is running in Railway
3. Get the `DATABASE_URL` from your PostgreSQL service → Variables tab
4. Copy it to your Next.js service → Variables tab
5. Redeploy

#### Issue 4: Firebase Admin SDK Not Set
**Symptom**: Authentication errors or "FIREBASE_ADMIN_SDK not set"

**Solution**:
1. Get your Firebase Admin SDK JSON from Firebase Console
2. Paste it as a **single line** in Railway variables as `FIREBASE_ADMIN_SDK`
3. Make sure it's valid JSON (no line breaks)
4. Redeploy

---

## Step 3: Check Database Status

1. Go to Railway → Your **PostgreSQL service**
2. Check if it's **running** (green status)
3. If it's stopped, click **"Start"**
4. Go to **"Variables"** tab and copy the `DATABASE_URL`
5. Make sure this URL is set in your Next.js service variables

---

## Step 4: Test OpenAI API Key

You can test if your OpenAI API key works:

1. Go to https://platform.openai.com/api-keys
2. Verify your key exists and is active
3. Check your billing/credits at https://platform.openai.com/account/billing
4. Make sure you have credits available

---

## Step 5: Check Railway Deployment Logs

After making changes, check the deployment logs:

1. Railway → Your service → **"Deployments"**
2. Click the latest deployment
3. Check **"Build Logs"** for build errors
4. Check **"Deploy Logs"** for runtime errors

Look for:
- ✅ `"Firebase Admin initialized successfully"` - Good
- ✅ `"Prisma Client generated"` - Good
- ❌ `"Error: OPENAI_API_KEY is not configured"` - Missing env var
- ❌ `"Error: Database connection failed"` - DB issue
- ❌ `"Error: Invalid API key"` - OpenAI key issue

---

## Step 6: Verify Environment Variables Format

### FIREBASE_ADMIN_SDK Format

Must be a **single-line JSON string**:

```env
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"voice-keyboard-272ad","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Important**:
- No line breaks
- All on one line
- Keep all quotes and escape characters
- The `\n` in private_key should be literal `\n` characters

### DATABASE_URL Format

Should look like:
```env
DATABASE_URL=postgresql://postgres:password@host:port/database?sslmode=require
```

---

## Step 7: Redeploy After Changes

After updating environment variables:

1. Railway will **automatically redeploy** when you save variables
2. Or manually trigger a redeploy: Service → **"Deployments"** → **"Redeploy"**
3. Wait for deployment to complete
4. Check logs for any errors

---

## Common Error Messages

### "OPENAI_API_KEY is not configured"
- **Fix**: Add `OPENAI_API_KEY` to Railway variables

### "OpenAI API quota exceeded"
- **Fix**: Add credits to your OpenAI account

### "Database connection error"
- **Fix**: Check `DATABASE_URL` is correct and database is running

### "Unauthorized" (401)
- **Fix**: Check `FIREBASE_ADMIN_SDK` is set correctly

### "Failed to transcribe audio"
- **Fix**: Check Railway logs for the actual error (see Step 1)

---

## Still Not Working?

1. **Share Railway logs** - Copy the error from deployment logs
2. **Verify all env vars** - Double-check all required variables are set
3. **Test locally** - Make sure it works in local dev first
4. **Check Railway status** - Make sure Railway services are operational

The error logs in Railway will tell you exactly what's wrong!

