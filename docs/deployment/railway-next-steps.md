# Railway Deployment - Next Steps

Since you've already:
- ✅ Pushed code to GitHub
- ✅ Created PostgreSQL database in Railway

Follow these steps to complete deployment:

---

## Step 1: Connect GitHub Repo to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"+ New"** button
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub (if first time)
5. Select your `ai-voice-keyboard` repository
6. Railway will automatically detect it's a Next.js app and start deploying

**Note**: Railway will create a new service for your Next.js app.

---

## Step 2: Get Your Database URL

1. In Railway, click on your **PostgreSQL database service**
2. Go to the **"Variables"** tab
3. Find `DATABASE_URL`
4. **Copy the entire value** - you'll need it in the next step

It should look like:
```
postgresql://postgres:password@host:port/railway?sslmode=require
```

---

## Step 3: Set Environment Variables

1. In Railway, click on your **Next.js service** (the one you just created)
2. Go to the **"Variables"** tab
3. Click **"+ New Variable"** for each variable below

### Add These Variables:

#### Database
```
DATABASE_URL = [paste the value from Step 2]
```

#### Firebase Client (Public Variables)
Get these from [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps → Web app:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
```

#### Firebase Admin SDK
Get this from Firebase Console → Project Settings → Service Accounts → Generate new private key:

1. Download the JSON file
2. Open it in a text editor
3. Copy the entire JSON
4. Remove ALL line breaks (make it one line)
5. Paste into Railway:

```
FIREBASE_ADMIN_SDK = {"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}
```

**Important**: Must be a single line with no line breaks!

#### OpenAI API Key
```
OPENAI_API_KEY = sk-your-openai-api-key-here
```

Get from: https://platform.openai.com/api-keys

---

## Step 4: Wait for Build to Complete

1. Go to your Next.js service → **"Deployments"** tab
2. Watch the build progress
3. Wait for status to show **"Success"** (green checkmark)

**If build fails:**
- Check the build logs for errors
- Verify all environment variables are set correctly
- Common issues:
  - Missing `DATABASE_URL`
  - `FIREBASE_ADMIN_SDK` has line breaks (must be single line)
  - Invalid JSON in `FIREBASE_ADMIN_SDK`

---

## Step 5: Run Database Migrations

After the build succeeds, you need to run Prisma migrations:

### Option A: Using Railway CLI (Recommended)

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```
   (Select your Railway project when prompted)

4. Run migrations:
   ```bash
   railway run npm run migrate
   ```

### Option B: Using Railway Web UI

1. Go to your Next.js service
2. Click **"Connect"** → **"Shell"**
3. Run:
   ```bash
   npm run migrate
   ```

### Option C: One-time via Build (Quick Fix)

If you want migrations to run automatically, temporarily update `package.json`:

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

Then redeploy. After first deployment, change it back to:
```json
"build": "prisma generate && next build"
```

---

## Step 6: Get Your App URL

1. Go to your Next.js service → **"Settings"** tab
2. Scroll to **"Networking"** section
3. Find **"Public Domain"**
4. Click **"Generate Domain"** if not already generated
5. Copy the URL (e.g., `your-app.railway.app`)

---

## Step 7: Test Your Deployment

Visit your Railway URL and test:

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Home page accessible (after login)
- [ ] Recording button works
- [ ] Transcription works (if OpenAI API key is valid)
- [ ] Transcripts save to database
- [ ] Library page shows transcripts
- [ ] Copy to clipboard works
- [ ] Dictionary CRUD works
- [ ] Settings page works

---

## Step 8: Check Logs (If Issues)

If something doesn't work:

1. Go to your Next.js service → **"Logs"** tab
2. Look for errors:
   - ❌ "FIREBASE_ADMIN_SDK not set" → Check variable is set
   - ❌ "Unauthorized" → Check Firebase Admin SDK format
   - ❌ "Database connection failed" → Check DATABASE_URL
   - ❌ "OpenAI API error" → Check OPENAI_API_KEY

---

## Quick Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify `FIREBASE_ADMIN_SDK` is single-line JSON
- Check build logs for specific errors

### App Crashes on Startup
- Check application logs
- Verify `DATABASE_URL` is correct
- Ensure migrations ran successfully

### "Unauthorized" Errors
- Check `FIREBASE_ADMIN_SDK` format (must be single line)
- Verify JSON is valid (no syntax errors)
- Check server logs for initialization errors

### Database Errors
- Verify `DATABASE_URL` is from PostgreSQL service
- Check PostgreSQL service is running
- Ensure migrations ran: `railway run npm run migrate`

---

## Success Checklist

- [ ] Next.js service deployed successfully
- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] App accessible at Railway URL
- [ ] All features working
- [ ] No errors in logs

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Record demo video
3. ✅ Submit assignment via: https://forms.gle/gUe7RBujLBfdXCoo8

---

## Need Help?

If you encounter issues:
1. Check Railway logs (Service → Logs tab)
2. Verify environment variables are correct
3. Test locally with same environment variables
4. Check Railway status: https://status.railway.app

Good luck! 🚀

