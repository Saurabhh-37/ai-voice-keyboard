# Running Database Migrations on Railway

## Method 1: Using Railway CLI (Recommended)

### Step 1: Login to Railway
```bash
railway login
```
This will open your browser to authenticate.

### Step 2: Link to Your Project
```bash
railway link
```
Select your project and service when prompted.

### Step 3: Run Migrations
```bash
railway run npx prisma migrate deploy
```

This will:
- Connect to your Railway PostgreSQL database
- Run all pending migrations
- Create all the tables (User, transcriptions, dictionary_words, user_settings)

### Step 4: Verify Success
You should see output like:
```
✅ Applied migration `20240101000000_init`
```

## Method 2: Using Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Click on your **app service** (not the database)
4. Go to **"Deployments"** tab
5. Click **"..."** (three dots) → **"Run Command"**
6. Enter: `npx prisma migrate deploy`
7. Click **"Run"**

## Method 3: Automatic Migration on Deploy

Update your Railway build command to run migrations automatically:

1. Go to Railway Dashboard → Your App Service
2. Click **"Settings"** → **"Build"**
3. Update **Build Command** to:
   ```bash
   npx prisma migrate deploy && npm run build
   ```
4. Save and redeploy

This way, migrations run automatically on every deploy.

## Verify Tables Were Created

After running migrations, verify the tables exist:

### Option A: Using Prisma Studio
```bash
railway run npx prisma studio
```
This opens a web interface to view your database.

### Option B: Test via Your App
1. Sign up/login to your app
2. Try creating a transcript
3. Try adding a dictionary word
4. If these work, migrations were successful!

## Troubleshooting

### Error: "Migration already applied"
✅ This is fine! It means migrations have already run.

### Error: "Connection refused" or "Cannot connect"
- Check that `DATABASE_URL` is set in Railway environment variables
- Verify your PostgreSQL service is running
- Make sure you're linked to the correct project

### Error: "Migration failed"
- Check Railway logs for detailed error messages
- Verify your DATABASE_URL format is correct
- Ensure you have proper permissions

## Next Steps

After successful migration:
1. ✅ Your database tables are created
2. ✅ Your app can now save/read data
3. ✅ Test all features (signup, transcripts, dictionary, settings)


