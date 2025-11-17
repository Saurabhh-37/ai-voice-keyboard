# How to Run Database Migrations on Railway

## Option 1: Using Railway CLI (Recommended)

### Step 1: Install Railway CLI
```bash
npm i -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```
This will open your browser to authenticate.

### Step 3: Link Your Project
```bash
railway link
```
Select your Railway project when prompted.

### Step 4: Run Migrations
```bash
railway run npm run migrate
```

This will:
- Connect to your Railway service
- Run `prisma migrate deploy`
- Apply all pending migrations
- Show you the results

### Verify Success
You should see:
```
✅ Applying migration `20240101000000_init`
✅ All migrations have been successfully applied.
```

## Option 2: Run Migrations on App Startup (Alternative)

If you want migrations to run automatically when the app starts, we can modify the startup script. However, this is **not recommended** for production as it can cause issues with multiple instances.

### Modify package.json:
```json
{
  "scripts": {
    "start": "npm run migrate && next start"
  }
}
```

⚠️ **Warning**: This approach can cause race conditions if multiple instances start simultaneously.

## Option 3: Use Railway Service Shell

1. Go to Railway Dashboard
2. Select your Next.js service
3. Look for "Shell" or "Terminal" option
4. Run: `npm run migrate`

## Option 4: Create a Migration Endpoint (For Testing)

You could create an API endpoint that runs migrations, but this is **not recommended** for security reasons.

## Recommended Approach

**Use Option 1 (Railway CLI)** - It's the safest and most reliable method.

After running migrations, verify tables were created:
- Go to PostgreSQL service → Data tab
- You should see: `User`, `transcriptions`, `dictionary_words`, `user_settings`

