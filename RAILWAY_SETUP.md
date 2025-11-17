# Railway Deployment Setup Guide

This guide will help you set up your AI Voice Keyboard application on Railway with PostgreSQL database integration.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your code
- Firebase project with Admin SDK credentials

## Step 1: Create PostgreSQL Database on Railway

1. Log in to Railway dashboard
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Railway will create a PostgreSQL database and provide a connection string
5. Copy the **DATABASE_URL** from the database service (it will look like: `postgresql://user:password@host:port/database`)

## Step 2: Deploy Your Next.js Application

1. In your Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account and select the `ai-voice-keyboard` repository
4. Railway will automatically detect it's a Next.js app

## Step 3: Configure Environment Variables

In your Railway service settings, add the following environment variables:

### Required Variables

```bash
# Database Connection (from Step 1)
DATABASE_URL=postgresql://user:password@host:port/database

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase Admin SDK (for server-side auth)
# This should be a JSON string of your Firebase Admin service account
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# Node Environment
NODE_ENV=production
```

### Getting Firebase Admin SDK

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **"Generate new private key"**
3. Download the JSON file
4. Copy the entire JSON content and paste it as the value for `FIREBASE_ADMIN_SDK` in Railway (as a single-line JSON string)

**Important:** Make sure to escape quotes properly if pasting directly, or use Railway's environment variable editor which handles this automatically.

## Step 4: Run Database Migrations

After deploying, you need to run Prisma migrations to set up your database schema:

### Option A: Using Railway CLI (Recommended)

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   railway link
   ```

4. Run migrations:
   ```bash
   railway run npx prisma migrate deploy
   ```

### Option B: Using Railway Dashboard

1. Go to your service in Railway dashboard
2. Click on **"Deployments"** tab
3. Click **"Deploy"** → **"Custom Command"**
4. Run: `npx prisma migrate deploy`
5. Or add it to your `package.json` scripts and Railway will run it automatically

### Option C: Add to Build Script

Add this to your `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

## Step 5: Generate Prisma Client

Railway will automatically run `prisma generate` if you have a `postinstall` script, but you can also add it manually:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

## Step 6: Verify Deployment

1. Check Railway logs to ensure the app started successfully
2. Visit your Railway-provided URL (e.g., `https://your-app.railway.app`)
3. Test authentication (sign up/login)
4. Test creating a transcript
5. Test dictionary functionality

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct in Railway environment variables
- Check that the database service is running in Railway
- Ensure the connection string includes SSL parameters if required:
  ```
  DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
  ```

### Firebase Admin SDK Issues

- Ensure `FIREBASE_ADMIN_SDK` is a valid JSON string
- Check that the service account has the correct permissions
- Verify the JSON is properly escaped (no line breaks in the environment variable)

### Migration Issues

- Run `npx prisma migrate dev` locally first to ensure migrations are created
- Check Railway logs for migration errors
- Ensure `DATABASE_URL` is set before running migrations

### Build Issues

- Check that all environment variables are set
- Verify `NODE_ENV=production` is set
- Check Railway build logs for specific errors

## Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string from Railway | Yes |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client configuration | Yes |
| `FIREBASE_ADMIN_SDK` | Firebase Admin service account JSON | Yes |
| `NODE_ENV` | Set to `production` | Yes |

## Next Steps

After successful deployment:

1. Set up a custom domain (optional) in Railway settings
2. Configure CORS if needed for API access
3. Set up monitoring and alerts
4. Configure automatic deployments from main branch

## Support

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- Firebase Docs: https://firebase.google.com/docs

