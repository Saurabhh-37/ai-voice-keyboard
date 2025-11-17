# Railway Deployment Guide

Complete step-by-step guide to deploy your AI Voice Keyboard app to Railway.

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Railway account (sign up at https://railway.app)
- ✅ Firebase project set up
- ✅ OpenAI API key
- ✅ PostgreSQL database on Railway (already set up)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure `.gitignore` is correct

Make sure these are in your `.gitignore`:
```
.env.local
.env*.local
node_modules
.next
.vercel
*.log
voice-keyboard-*-firebase-adminsdk-*.json
```

### 1.2 Commit and Push to GitHub

```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

---

## Step 2: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `ai-voice-keyboard` repository
6. Railway will create a new project

---

## Step 3: Add PostgreSQL Database

If you don't have a database yet:

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database
4. Click on the database service
5. Go to **"Variables"** tab
6. Copy the `DATABASE_URL` value

**Note**: If you already have a database, skip this step and use your existing `DATABASE_URL`.

---

## Step 4: Deploy Next.js App

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"** (if not already added)
3. Select your `ai-voice-keyboard` repository
4. Railway will automatically detect it's a Next.js app

---

## Step 5: Configure Environment Variables

In your Railway project, go to your **Next.js service** → **"Variables"** tab and add:

### Required Environment Variables:

```env
# Database
DATABASE_URL=postgresql://postgres:password@host:port/railway?sslmode=require

# Firebase Client (Public - starts with NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side - single line JSON)
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Node.js Version (optional, but recommended)
NODE_VERSION=20
```

### How to Get Each Value:

#### 1. DATABASE_URL
- From Railway PostgreSQL service → Variables tab
- Copy the `DATABASE_URL` value

#### 2. Firebase Client Config (NEXT_PUBLIC_*)
- Go to [Firebase Console](https://console.firebase.google.com)
- Project Settings → Your apps → Web app
- Copy the config values

#### 3. FIREBASE_ADMIN_SDK
- Firebase Console → Project Settings → Service Accounts
- Click "Generate new private key"
- Copy the entire JSON as a **single line** (remove all line breaks)
- Paste into Railway variables

#### 4. OPENAI_API_KEY
- From [OpenAI Platform](https://platform.openai.com/api-keys)
- Copy your API key

---

## Step 6: Configure Build Settings

Railway should auto-detect Next.js, but verify:

1. Go to your Next.js service → **"Settings"** tab
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Root Directory**: `/` (default)

### Optional: Add `nixpacks.toml` for better control

Create `nixpacks.toml` in your project root:

```toml
[phases.setup]
nixPkgs = ["nodejs-20_x", "npm-10_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## Step 7: Run Database Migrations

After deployment, you need to run Prisma migrations:

### Option A: Via Railway CLI (Recommended)

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

4. Run migrations:
   ```bash
   railway run npx prisma migrate deploy
   ```

### Option B: Via Railway Web UI

1. Go to your Next.js service
2. Click **"Deployments"** tab
3. Click **"..."** on latest deployment → **"View Logs"**
4. Or use **"Connect"** → **"Shell"** to run:
   ```bash
   npx prisma migrate deploy
   ```

### Option C: Add to Build Script (Automatic)

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start"
  }
}
```

**Note**: This runs migrations on every build. Use Option A or B for first-time setup.

---

## Step 8: Verify Deployment

1. **Check Build Logs**:
   - Go to your service → **"Deployments"** tab
   - Click on the latest deployment
   - Verify build completed successfully

2. **Check Application Logs**:
   - Go to **"Logs"** tab
   - Look for:
     - ✅ "Firebase Admin initialized successfully"
     - ✅ "Prisma Client generated"
     - ✅ "Ready on port 3000"

3. **Test Your App**:
   - Click **"Settings"** tab
   - Find your **"Public Domain"** (e.g., `your-app.railway.app`)
   - Visit the URL in your browser
   - Test:
     - Landing page loads
     - Sign up/login works
     - Recording works
     - Transcripts save

---

## Step 9: Set Up Custom Domain (Optional)

1. Go to **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Add your domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails

**Error**: `Prisma Client not generated`
- **Fix**: Ensure `prisma generate` runs in build script
- Check `package.json` build command

**Error**: `DATABASE_URL not found`
- **Fix**: Add `DATABASE_URL` to Railway variables
- Ensure it's from the PostgreSQL service

**Error**: `FIREBASE_ADMIN_SDK parsing error`
- **Fix**: Ensure JSON is on a single line
- Remove all line breaks and extra spaces
- Verify JSON is valid

### Runtime Errors

**Error**: "Unauthorized" in API routes
- **Fix**: Check `FIREBASE_ADMIN_SDK` is set correctly
- Verify JSON format (single line)
- Check server logs for initialization errors

**Error**: "OpenAI API quota exceeded"
- **Fix**: Add credits to OpenAI account
- Check `OPENAI_API_KEY` is correct

**Error**: Database connection failed
- **Fix**: Verify `DATABASE_URL` is correct
- Check PostgreSQL service is running
- Ensure SSL mode is set (`?sslmode=require`)

### Migration Issues

**Error**: Migration fails
- **Fix**: Run `npx prisma migrate deploy` manually
- Check database is accessible
- Verify `DATABASE_URL` is correct

---

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `DATABASE_URL` (from Railway PostgreSQL)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_ADMIN_SDK` (single-line JSON)
- [ ] `OPENAI_API_KEY`

---

## Post-Deployment Checklist

After deployment:

- [ ] App loads at Railway URL
- [ ] Landing page displays correctly
- [ ] Sign up works
- [ ] Login works
- [ ] Recording button works
- [ ] Transcription works (test with OpenAI API)
- [ ] Transcripts save to database
- [ ] Library page shows transcripts
- [ ] Dictionary CRUD works
- [ ] Copy to clipboard works
- [ ] Settings page works

---

## Quick Reference

### Railway CLI Commands

```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run command in Railway environment
railway run <command>

# Run migrations
railway run npx prisma migrate deploy

# Open shell
railway shell
```

### Useful Railway URLs

- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Status: https://status.railway.app

---

## Next Steps

1. ✅ Deploy to Railway
2. ✅ Run database migrations
3. ✅ Test all features
4. ✅ Record demo video
5. ✅ Submit assignment

---

## Support

If you encounter issues:

1. Check Railway logs (Service → Logs tab)
2. Check build logs (Service → Deployments → Latest)
3. Verify all environment variables are set
4. Test locally with same environment variables
5. Check Railway status: https://status.railway.app

Good luck with your deployment! 🚀

