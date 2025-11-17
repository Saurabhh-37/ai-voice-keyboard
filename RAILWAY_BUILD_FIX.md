# Railway Build Fix

## Problem
The build was failing because `prisma generate` runs during `postinstall` (which executes during `npm ci`), but `DATABASE_URL` environment variable is not available at that point in Railway's build process.

## Solution
Removed `prisma generate` from `postinstall` script. Prisma will now generate during the `build` phase when `DATABASE_URL` is definitely available.

## Railway Build Command
Make sure your Railway build command is set to:
```bash
npm run build
```

This will:
1. Run `prisma generate` (with DATABASE_URL available)
2. Run `next build`

## Alternative: Custom Build Command
If you want to run migrations automatically on each deploy, set Railway build command to:
```bash
npx prisma generate && npx prisma migrate deploy && npm run build
```

This will:
1. Generate Prisma Client
2. Run database migrations
3. Build the Next.js app

## Verify Setup
1. Go to Railway Dashboard → Your App Service
2. Click **Settings** → **Build**
3. Verify the build command is set correctly
4. Redeploy your app

