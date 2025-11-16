# Railway Database Migration Guide

## Quick Setup Steps

Since you've already added the environment variables to Railway, you now need to create and run the database migrations.

## Option 1: Create Migration Locally (Recommended)

1. **Set up local DATABASE_URL** (temporarily, for migration creation):
   ```bash
   # In your .env.local file, add your Railway DATABASE_URL
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Create the initial migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Commit and push to GitHub**:
   ```bash
   git add prisma/migrations
   git commit -m "Add initial database migration"
   git push
   ```

4. **Railway will automatically run migrations** during build (because of the `postinstall` script in package.json)

## Option 2: Run Migration Directly on Railway

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link to your project**:
   ```bash
   railway link
   ```

4. **Create and run migration**:
   ```bash
   railway run npx prisma migrate deploy
   ```

## Option 3: Use Railway Dashboard

1. Go to your Railway app service
2. Click on **"Deployments"** tab
3. Click **"New Deployment"**
4. In the build command, ensure it includes:
   ```bash
   npx prisma generate && npx prisma migrate deploy && npm run build
   ```

## Verify Migration Success

After running migrations, verify the tables were created:

1. **Using Railway CLI**:
   ```bash
   railway run npx prisma studio
   ```
   This opens Prisma Studio where you can see all tables.

2. **Or test via your app**:
   - Sign up/login
   - Try creating a transcript
   - Try adding a dictionary word
   - If these work, migrations were successful!

## Troubleshooting

### Migration fails with "relation does not exist"
- Make sure migrations have been run
- Check DATABASE_URL is correct in Railway

### "Migration already applied"
- This is fine, it means migrations are already up to date

### Connection errors
- Verify DATABASE_URL in Railway environment variables
- Check PostgreSQL service is running in Railway
- Ensure the database URL format is correct

