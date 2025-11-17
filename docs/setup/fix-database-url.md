# Fix: DATABASE_URL Not Found

## Quick Fix

Add `DATABASE_URL` to your `.env.local` file.

### Step 1: Get Your Database URL from Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your **PostgreSQL database service**
3. Go to **"Variables"** tab
4. Copy the `DATABASE_URL` value

It should look like:
```
postgresql://postgres:password@host:port/railway?sslmode=require
```

### Step 2: Add to .env.local

Open `.env.local` in your project root and add:

```env
DATABASE_URL="postgresql://postgres:your_password@your_host:port/railway?sslmode=require"
```

**Important**: 
- Replace with your actual Railway database URL
- Keep the quotes around the URL
- Make sure there are no spaces around the `=`

### Step 3: Restart Your Dev Server

After adding `DATABASE_URL`:
1. Stop your dev server (Ctrl+C)
2. Restart: `npm run dev`

### Step 4: Verify It Works

Try running:
```bash
npx prisma generate
```

If it works without errors, you're good!

---

## Your .env.local Should Have:

```env
# Database
DATABASE_URL="postgresql://postgres:password@host:port/railway?sslmode=require"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin SDK
FIREBASE_ADMIN_SDK={"type":"service_account",...}

# OpenAI
OPENAI_API_KEY=sk-...
```

---

## Still Not Working?

1. **Check file location**: `.env.local` must be in the project root (same folder as `package.json`)
2. **Check format**: No spaces around `=`, URL in quotes
3. **Restart terminal**: Close and reopen your terminal/VS Code
4. **Check Railway**: Verify database is running and URL is correct

