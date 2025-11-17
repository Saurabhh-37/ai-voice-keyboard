# Railway Database Migration Guide

Since you've set up all environment variables in Railway, here are the steps to run your database migrations.

## 🚀 Quick Start: Automatic Migration (Recommended)

Your `package.json` is already configured to run migrations automatically during build:

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

**This means Railway will automatically run migrations when you deploy!**

### Steps:

1. **Commit and push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add database migrations"
   git push origin main
   ```

2. **Railway will automatically**:
   - Detect the push
   - Run `prisma generate` (generates Prisma Client)
   - Run `prisma migrate deploy` (applies migrations)
   - Build your Next.js app
   - Deploy

3. **Check Railway logs** to verify migrations ran successfully

## 🔧 Manual Migration (Alternative)

If you want to run migrations manually before deploying, or if automatic migration didn't work:

### Option 1: Using Railway CLI

1. **Install Railway CLI** (if not installed):
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
   Select your Railway project when prompted.

4. **Run migrations**:
   ```bash
   railway run npx prisma migrate deploy
   ```

5. **Verify success**:
   ```bash
   railway run npx prisma migrate status
   ```

### Option 2: Using Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **Next.js service** (not the database)
3. Go to **"Deployments"** tab
4. Click **"Deploy"** → **"Custom Command"**
5. Enter: `npx prisma migrate deploy`
6. Click **"Deploy"**
7. Watch the logs to see the migration progress

## ✅ Verify Migration Success

### Check Railway Logs

1. Go to Railway Dashboard
2. Select your service
3. Click **"Deployments"** tab
4. Click on the latest deployment
5. Look for these success messages:
   ```
   ✅ Prisma schema loaded from prisma/schema.prisma
   ✅ Applying migration `20240101000000_init`
   ✅ All migrations have been successfully applied.
   ```

### Check Database Tables

You can verify tables were created using Prisma Studio:

```bash
railway run npx prisma studio
```

This will open a web interface where you can see:
- `User` table
- `transcriptions` table
- `dictionary_words` table
- `user_settings` table

Or check directly in Railway:
1. Go to your **PostgreSQL service** in Railway
2. Click **"Data"** tab
3. You should see all the tables listed

## 🧪 Test Your Application

After migrations are successful:

1. **Visit your Railway app URL**
2. **Sign up** - Creates a user in the database
3. **Create a transcript** - Saves to `transcriptions` table
4. **Add dictionary word** - Saves to `dictionary_words` table
5. **Update settings** - Saves to `user_settings` table

## 🔍 Troubleshooting

### Issue: "Migration failed" or "Database connection error"

**Check**:
- ✅ `DATABASE_URL` is set in Railway (should be automatic from PostgreSQL service)
- ✅ PostgreSQL service is running
- ✅ Connection string format is correct

**Solution**: Verify the `DATABASE_URL` variable in Railway service settings.

### Issue: "No migrations found"

**Check**:
- ✅ `prisma/migrations` folder exists
- ✅ Migration SQL file exists in `prisma/migrations/20240101000000_init/migration.sql`

**Solution**: The migration file has been created. Railway should detect it during build.

### Issue: "Migration already applied"

**This is normal!** It means the migration was successful. Prisma tracks applied migrations in the `_prisma_migrations` table.

### Issue: Build fails with Prisma errors

**Check Railway build logs** for specific errors:
- Missing `DATABASE_URL` → Add it to Railway variables
- Prisma Client not generated → Check `postinstall` script runs
- Migration conflicts → Check migration status

## 📋 Migration Status Commands

```bash
# Check if migrations are applied
railway run npx prisma migrate status

# View database in Prisma Studio
railway run npx prisma studio

# Generate Prisma Client (if needed)
railway run npx prisma generate
```

## 🎯 What Happens Next

Once migrations are successful:

1. ✅ Database schema is ready
2. ✅ Users can sign up (creates User record)
3. ✅ Transcripts are saved to database
4. ✅ Dictionary words are persisted
5. ✅ Settings are stored per user

## 📝 Important Notes

1. **First Time**: Railway will create the migration history table (`_prisma_migrations`) automatically

2. **Future Changes**: If you modify `prisma/schema.prisma`:
   - Create migration: `npx prisma migrate dev --name your_change`
   - Commit and push
   - Railway will auto-apply on next deployment

3. **Migration History**: Prisma tracks all applied migrations. You can see them in the `_prisma_migrations` table.

4. **Rollback**: Prisma doesn't support automatic rollbacks. To undo changes, create a new migration that reverses them.

## 🚀 Ready to Deploy!

Your migration file is ready. You can now:

1. **Push to GitHub** (if using automatic deployment)
2. **Or run manually** using Railway CLI or Dashboard
3. **Verify** in Railway logs
4. **Test** your application

The migration will create all necessary tables with proper indexes and foreign keys!

