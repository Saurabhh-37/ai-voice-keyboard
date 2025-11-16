# Railway Deployment & Database Setup Guide

This guide will help you set up your AI Voice Keyboard app on Railway with PostgreSQL database integration.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- Firebase project with authentication enabled
- GitHub repository with your code

## Step 1: Deploy PostgreSQL Database on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway will automatically create a PostgreSQL database
5. Click on the database service
6. Go to the **"Variables"** tab
7. Copy the `DATABASE_URL` value (you'll need this later)

## Step 2: Deploy Your Next.js App on Railway

1. In your Railway project, click **"New"** → **"GitHub Repo"**
2. Select your `ai-voice-keyboard` repository
3. Railway will automatically detect it's a Next.js app
4. Click on your app service

## Step 3: Set Up Environment Variables

In your Railway app service, go to the **"Variables"** tab and add:

### Required Variables

```env
# Database (from PostgreSQL service)
DATABASE_URL=postgresql://user:password@host:port/database

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side auth)
FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

### Getting Firebase Admin SDK

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ → **Project settings**
4. Go to **"Service accounts"** tab
5. Click **"Generate new private key"**
6. Download the JSON file
7. Copy the entire JSON content and paste it as the `FIREBASE_ADMIN_SDK` value in Railway (as a single-line JSON string)

**Important**: The `FIREBASE_ADMIN_SDK` must be a valid JSON string. Railway will handle the escaping.

## Step 4: Run Database Migrations

After deploying, you need to run Prisma migrations to create the database tables:

### Option 1: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to Railway:
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

### Option 2: Using Railway Dashboard

1. Go to your app service in Railway
2. Click **"Deployments"** → **"New Deployment"**
3. In the build command, add:
   ```bash
   npx prisma generate && npx prisma migrate deploy && npm run build
   ```

### Option 3: Add to package.json scripts

Add this to your `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

## Step 5: Verify Deployment

1. Check your Railway app URL (Railway provides a default domain)
2. Visit your app and test:
   - Sign up / Login
   - Create a transcript
   - Add dictionary words
   - Update settings

## Step 6: Custom Domain (Optional)

1. In Railway, go to your app service
2. Click **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Add your domain and follow the DNS setup instructions

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correctly set
- Check that the PostgreSQL service is running
- Ensure migrations have been run

### Firebase Auth Issues

- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check `FIREBASE_ADMIN_SDK` is valid JSON
- Ensure Email/Password auth is enabled in Firebase Console

### Build Failures

- Check Railway build logs
- Ensure all environment variables are set
- Verify Prisma migrations run successfully

### API Errors

- Check Railway logs for server errors
- Verify Firebase Admin SDK is properly configured
- Ensure database tables exist (run migrations)

## Environment Variables Reference

| Variable | Description | Required |
|-----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `FIREBASE_ADMIN_SDK` | Firebase Admin SDK JSON (for server auth) | ✅ |

## Next Steps

After deployment:

1. Test all features end-to-end
2. Set up monitoring (Railway provides logs)
3. Configure custom domain
4. Set up CI/CD if needed
5. Add error tracking (e.g., Sentry)

## Support

- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

