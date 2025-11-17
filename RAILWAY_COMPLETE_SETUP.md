# Complete Railway Setup Guide - From Scratch

This guide will walk you through setting up your AI Voice Keyboard app on Railway from the beginning.

## Prerequisites

- ✅ Railway account (sign up at [railway.app](https://railway.app))
- ✅ GitHub repository with your code
- ✅ Firebase project credentials

---

## Step 1: Create New Railway Project

1. Go to [Railway Dashboard](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account if not already connected
5. Select your repository: `Saurabhh-37/ai-voice-keyboard`
6. Railway will create a new project and start detecting your app

---

## Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"** button
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create a PostgreSQL database
4. Wait for it to provision (takes ~30 seconds)
5. **Important**: Note the service name (e.g., "Postgres")

---

## Step 3: Configure PostgreSQL Connection

1. Click on your **PostgreSQL service**
2. Go to **"Variables"** tab
3. Find `DATABASE_URL` or `POSTGRES_URL`
4. **Copy this value** - you'll need it in the next step
5. It looks like: `postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway`

---

## Step 4: Configure Your Next.js Service

1. Click on your **Next.js service** (the one connected to GitHub)
2. Go to **"Settings"** tab
3. **Service Name**: Make it clear (e.g., "ai-voice-keyboard-web")
4. Go to **"Variables"** tab

---

## Step 5: Add Environment Variables to Next.js Service

In your **Next.js service** → **Variables** tab, add these variables:

### 5.1: Database Connection

**Option A: Use Service Reference (Recommended)**
1. Click **"New Variable"**
2. Look for **"Reference"** or **"Service Reference"** option
3. Select your **PostgreSQL service**
4. Railway will automatically create `DATABASE_URL`

**Option B: Manual Entry**
1. Click **"New Variable"**
2. **Name**: `DATABASE_URL`
3. **Value**: Paste the connection string from Step 3
4. Click **"Add"**

### 5.2: Firebase Client Configuration

Add these variables (get them from Firebase Console → Project Settings → General):

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**How to get these:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click gear icon → **"Project settings"**
4. Scroll to **"Your apps"** section
5. If no web app exists, click **"Add app"** → **Web** (</> icon)
6. Copy the config values

### 5.3: Firebase Admin SDK

1. In Firebase Console → **Project settings** → **Service accounts** tab
2. Click **"Generate new private key"**
3. Download the JSON file
4. Open the JSON file and copy its entire contents
5. In Railway → **New Variable**:
   - **Name**: `FIREBASE_ADMIN_SDK`
   - **Value**: Paste the entire JSON as a single-line string (Railway handles formatting)
   - Click **"Add"**

### 5.4: Node Environment

1. **New Variable**:
   - **Name**: `NODE_ENV`
   - **Value**: `production`
   - Click **"Add"**

---

## Step 6: Verify All Variables

Your Next.js service should have these variables:

✅ `DATABASE_URL` (from PostgreSQL service)  
✅ `NEXT_PUBLIC_FIREBASE_API_KEY`  
✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  
✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  
✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`  
✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`  
✅ `NEXT_PUBLIC_FIREBASE_APP_ID`  
✅ `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`  
✅ `FIREBASE_ADMIN_SDK` (JSON string)  
✅ `NODE_ENV` = `production`

---

## Step 7: Wait for Initial Deployment

1. Railway will automatically detect your GitHub repo
2. It will start building your app
3. Go to **"Deployments"** tab to watch the build
4. Wait for it to complete (may take 2-5 minutes)

**Expected build steps:**
- ✅ Installing dependencies
- ✅ Generating Prisma Client
- ✅ Building Next.js app
- ✅ Deployment successful

---

## Step 8: Run Database Migrations

After the build completes successfully:

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI** (if not installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Link your project**:
   ```bash
   railway link
   ```
   Select your Railway project when prompted.

4. **Run migrations**:
   ```bash
   railway run npm run migrate
   ```

5. **Verify success** - You should see:
   ```
   ✅ Applying migration `20240101000000_init`
   ✅ All migrations have been successfully applied.
   ```

### Option B: Using Railway Dashboard Shell

1. Go to your **Next.js service**
2. Look for **"Shell"** or **"Terminal"** option
3. Run: `npm run migrate`

---

## Step 9: Verify Database Tables

1. Go to your **PostgreSQL service**
2. Click **"Data"** tab
3. You should see these tables:
   - ✅ `User`
   - ✅ `transcriptions`
   - ✅ `dictionary_words`
   - ✅ `user_settings`
   - ✅ `_prisma_migrations`

---

## Step 10: Test Your Application

1. **Get your app URL**:
   - Go to your **Next.js service**
   - Click **"Settings"** tab
   - Find **"Domains"** section
   - Copy your Railway-provided URL (e.g., `https://ai-voice-keyboard.up.railway.app`)

2. **Visit your app** in a browser

3. **Test these features**:
   - ✅ Sign up with a new account
   - ✅ Log in
   - ✅ Create a transcript (use placeholder text for now)
   - ✅ View transcripts in Library
   - ✅ Add dictionary words
   - ✅ Update settings

---

## Troubleshooting

### Build Fails

**Check:**
- All environment variables are set correctly
- `DATABASE_URL` is in Next.js service (not just PostgreSQL)
- Firebase credentials are correct
- Check Railway build logs for specific errors

### Migrations Fail

**Check:**
- `DATABASE_URL` is set in Next.js service
- You're running migrations from the correct service
- Database service is running

### App Won't Start

**Check:**
- All `NEXT_PUBLIC_FIREBASE_*` variables are set
- `FIREBASE_ADMIN_SDK` is valid JSON
- Check Railway service logs

### Can't Connect to Database

**Check:**
- `DATABASE_URL` is correct
- PostgreSQL service is running
- Connection string format is correct

---

## Quick Reference: Variable Checklist

Copy this checklist and mark as you add each variable:

```
Next.js Service Variables:
[ ] DATABASE_URL (from PostgreSQL service)
[ ] NEXT_PUBLIC_FIREBASE_API_KEY
[ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
[ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
[ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
[ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
[ ] NEXT_PUBLIC_FIREBASE_APP_ID
[ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
[ ] FIREBASE_ADMIN_SDK (JSON string)
[ ] NODE_ENV = production
```

---

## Next Steps After Setup

1. ✅ Set up custom domain (optional)
2. ✅ Configure monitoring and alerts
3. ✅ Set up automatic deployments from main branch
4. ✅ Test all features thoroughly

---

## Support Resources

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- Firebase Docs: https://firebase.google.com/docs

---

## Summary

1. ✅ Create Railway project from GitHub
2. ✅ Add PostgreSQL database
3. ✅ Add DATABASE_URL to Next.js service
4. ✅ Add all Firebase variables
5. ✅ Wait for build to complete
6. ✅ Run database migrations
7. ✅ Verify tables created
8. ✅ Test your application

Your app should now be fully deployed and functional! 🎉

