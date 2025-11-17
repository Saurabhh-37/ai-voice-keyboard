# Railway Build Solution

## Problem
Railway build was failing because `prisma generate` requires `DATABASE_URL` environment variable, but it might not be available during the build phase.

## Solution Applied
1. **Removed `prisma.config.ts`** - This file was causing Prisma to strictly require DATABASE_URL even for generation
2. **Created smart build script** - `scripts/build.js` automatically sets a placeholder DATABASE_URL if not available during build
3. **Updated build command** - Now uses the smart build script that handles missing DATABASE_URL gracefully

## How Prisma Generate Works
- `prisma generate` doesn't actually connect to the database
- It only needs the DATABASE_URL format to validate the schema
- Without `prisma.config.ts`, Prisma is more lenient during generation

## Railway Configuration

### Option 1: Standard Build (Recommended)
Set Railway build command to:
```bash
npm run build
```

**Important**: Make sure `DATABASE_URL` is set in Railway environment variables (even if it's just a placeholder during build).

### Option 2: Build with Automatic Migrations
Set Railway build command to:
```bash
npm run build:deploy
```

This will:
1. Generate Prisma Client
2. Run database migrations
3. Build Next.js app

## Setting DATABASE_URL in Railway

1. Go to Railway Dashboard → Your App Service
2. Click **Variables** tab
3. Add or verify `DATABASE_URL` is set:
   - Get the value from your PostgreSQL service
   - Or use a placeholder: `postgresql://user:password@localhost:5432/placeholder` (for build only)

## Verify Setup

1. **Check Environment Variables**:
   - Railway Dashboard → Your App → Variables
   - Ensure `DATABASE_URL` is set

2. **Check Build Command**:
   - Railway Dashboard → Your App → Settings → Build
   - Should be: `npm run build` or `npm run build:deploy`

3. **Redeploy**:
   - Push your changes to trigger a new build
   - Or manually trigger a redeploy in Railway

## Troubleshooting

### Still getting "Missing DATABASE_URL" error?
- Verify `DATABASE_URL` is set in Railway Variables (not just in the database service)
- Make sure it's set for the **app service**, not just the database service
- Try setting a dummy value: `postgresql://user:password@localhost:5432/placeholder`

### Build succeeds but app fails at runtime?
- Make sure `DATABASE_URL` points to your actual Railway PostgreSQL database
- Run migrations: `railway run npx prisma migrate deploy`

