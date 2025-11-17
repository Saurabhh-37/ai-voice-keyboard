# Railway DATABASE_URL Configuration Fix

## The Problem

Railway build is failing because `DATABASE_URL` is not available during the build process. This happens when the PostgreSQL service isn't properly linked to your Next.js service.

## Solution 1: Link PostgreSQL Service to Next.js Service (Recommended)

Railway automatically provides `DATABASE_URL` when services are linked. Here's how to link them:

### Steps:

1. **Go to Railway Dashboard**
   - Visit [https://railway.app](https://railway.app)
   - Select your project

2. **Link the Services**
   - Click on your **Next.js service** (not the PostgreSQL service)
   - Go to the **"Variables"** tab
   - Look for `DATABASE_URL` - it should be there automatically if services are linked
   - If it's NOT there, continue to step 3

3. **Add Database Connection**
   - In your Next.js service, click **"New Variable"**
   - Railway should show a dropdown with your PostgreSQL service
   - Select it, and Railway will automatically add `DATABASE_URL`
   - OR manually add:
     - **Variable Name**: `DATABASE_URL`
     - **Value**: Copy the connection string from your PostgreSQL service's "Connect" tab

4. **Get Connection String from PostgreSQL Service**
   - Click on your **PostgreSQL service**
   - Go to **"Connect"** or **"Variables"** tab
   - Copy the `DATABASE_URL` value
   - It looks like: `postgresql://postgres:password@host:port/railway`

5. **Add to Next.js Service**
   - Go back to your **Next.js service**
   - **Variables** tab → **New Variable**
   - Name: `DATABASE_URL`
   - Value: Paste the connection string from step 4
   - Click **Add**

6. **Redeploy**
   - Railway should automatically redeploy
   - Or trigger a new deployment manually

## Solution 2: Use Railway Service Reference (Automatic)

Railway can automatically inject `DATABASE_URL` if you reference the PostgreSQL service:

1. In your Next.js service **Variables** tab
2. Click **"New Variable"**
3. Instead of typing a value, look for a **"Reference"** option
4. Select your PostgreSQL service
5. Railway will automatically create the `DATABASE_URL` variable

## Solution 3: Temporary Workaround (If DATABASE_URL Still Not Available)

If `DATABASE_URL` is still not available during build, we can modify the build script to handle this gracefully. However, this should NOT be necessary if services are properly linked.

## Verify DATABASE_URL is Set

After linking, verify:

1. Go to Next.js service → **Variables** tab
2. You should see `DATABASE_URL` listed
3. The value should start with `postgresql://`

## Test the Build

After setting `DATABASE_URL`:

1. Railway will automatically redeploy
2. Check the build logs
3. You should see:
   ```
   ✅ Prisma schema loaded
   ✅ Generated Prisma Client
   ✅ Applying migrations
   ✅ Build successful
   ```

## Common Issues

### Issue: "DATABASE_URL not found in Variables"

**Solution**: Make sure you're looking at the **Next.js service** variables, not the PostgreSQL service. The PostgreSQL service has its own internal `DATABASE_URL`, but your Next.js service needs its own copy.

### Issue: "Services not linked"

**Solution**: 
- In Railway, services in the same project are automatically "linked" in terms of networking
- But environment variables need to be explicitly added
- Use the "Reference" feature or manually copy the connection string

### Issue: "Connection string format wrong"

**Solution**: 
- Railway provides the connection string in the correct format
- Copy it exactly as shown
- Don't modify it

## Next Steps

Once `DATABASE_URL` is properly set:

1. ✅ Build will succeed
2. ✅ Migrations will run automatically
3. ✅ Prisma Client will be generated
4. ✅ App will deploy successfully

