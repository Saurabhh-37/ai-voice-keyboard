# Database Migration Steps for Railway

## Step 1: Create Initial Migration Locally

Since you don't have a local DATABASE_URL set, we'll create the migration files that can be deployed to Railway.

### Option A: Create Migration Without Database Connection

You can create the migration files manually or use a temporary local database. For Railway, we'll create the migration structure:

1. **Create the migration directory structure** (already exists)

2. **The migration will be created when Railway runs `prisma migrate deploy`**

However, it's better to create the migration locally first. Let's do that:

## Step 2: Create Initial Migration

Run this command to create the initial migration:

```bash
# If you have a local DATABASE_URL, use:
npx prisma migrate dev --name init

# If you don't have a local database, we'll create it on Railway instead
```

## Step 3: Deploy Migration to Railway

### Method 1: Automatic (Recommended - Already Configured)

Your `package.json` already has the build script configured:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

This means Railway will automatically:
1. Generate Prisma Client (`prisma generate`)
2. Run migrations (`prisma migrate deploy`)
3. Build your Next.js app

**Just push your code to GitHub and Railway will handle it!**

### Method 2: Manual Migration via Railway CLI

If you want to run migrations manually:

1. **Install Railway CLI** (if not already installed):
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Link your project**:
   ```bash
   railway link
   ```

4. **Run migrations**:
   ```bash
   railway run npx prisma migrate deploy
   ```

### Method 3: Via Railway Dashboard

1. Go to your Railway project
2. Select your Next.js service
3. Go to **"Deployments"** tab
4. Click **"Deploy"** → **"Custom Command"**
5. Enter: `npx prisma migrate deploy`
6. Click **"Deploy"**

## Step 4: Verify Migration Success

After the migration runs, verify it worked:

### Check Railway Logs

1. Go to Railway Dashboard
2. Select your service
3. Click **"Deployments"** tab
4. Click on the latest deployment
5. Check the logs for:
   - ✅ `Prisma schema loaded from prisma/schema.prisma`
   - ✅ `Applying migration ...`
   - ✅ `All migrations have been successfully applied.`

### Check Database Schema

You can verify the tables were created:

1. **Using Railway CLI**:
   ```bash
   railway run npx prisma studio
   ```
   Then visit the URL it provides (usually `http://localhost:5555`)

2. **Or check Railway PostgreSQL service**:
   - Go to your PostgreSQL service in Railway
   - Click **"Data"** tab
   - You should see tables: `User`, `transcriptions`, `dictionary_words`, `user_settings`

## Step 5: Test the Application

After migrations are complete:

1. **Visit your Railway app URL**
2. **Test sign up/login** - This will create a user in the database
3. **Test creating a transcript** - This will create a transcription record
4. **Test dictionary** - Add a dictionary word
5. **Test settings** - Toggle auto-punctuation

## Troubleshooting

### Issue: "Migration failed" or "Database connection error"

**Solution**:
- Verify `DATABASE_URL` is set correctly in Railway
- Check that the PostgreSQL service is running
- Ensure the connection string format is correct

### Issue: "No migrations found"

**Solution**:
- Make sure you've created the initial migration
- Check that `prisma/migrations` folder exists
- If migrations folder is empty, create the initial migration first

### Issue: "Migration already applied"

**Solution**:
- This is normal if you've run migrations before
- Railway tracks applied migrations in the `_prisma_migrations` table
- You can check status with: `railway run npx prisma migrate status`

### Issue: Build fails with Prisma errors

**Solution**:
- Check that `DATABASE_URL` is set in Railway
- Verify Prisma Client is generated (check `postinstall` script runs)
- Check Railway build logs for specific errors

## Next Steps After Migration

Once migrations are successful:

1. ✅ Your database schema is ready
2. ✅ Users can sign up and their data will be saved
3. ✅ Transcripts will be persisted
4. ✅ Dictionary words will be saved
5. ✅ Settings will be stored

## Quick Reference Commands

```bash
# Check migration status
railway run npx prisma migrate status

# Create new migration (if schema changes)
railway run npx prisma migrate dev --name migration_name

# Deploy migrations (production)
railway run npx prisma migrate deploy

# Generate Prisma Client
railway run npx prisma generate

# Open Prisma Studio (view database)
railway run npx prisma studio
```

## Important Notes

1. **First Deployment**: Railway will automatically run migrations during the build process (configured in `package.json`)

2. **Schema Changes**: If you change the Prisma schema later:
   - Create a new migration: `npx prisma migrate dev --name your_change`
   - Commit and push to GitHub
   - Railway will automatically apply it on next deployment

3. **Migration History**: Prisma tracks applied migrations in the `_prisma_migrations` table in your database

4. **Rollback**: Prisma doesn't support automatic rollbacks. If you need to undo a migration, you'll need to create a new migration that reverses the changes.

