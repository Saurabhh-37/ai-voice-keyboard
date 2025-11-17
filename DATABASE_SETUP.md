# Database Setup Guide

## Step 1: Create .env.local File

Create a `.env.local` file in the root directory with your DATABASE_URL:


**Important**: Make sure `.env.local` is in your `.gitignore` (it should be already).

## Step 2: Run Database Migration

Run this command to create the database tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create a migration file in `prisma/migrations/`
- Apply the migration to your Railway database
- Generate the Prisma Client

## Step 3: Verify Database Tables

You can verify the tables were created using Prisma Studio:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view your database.

## Step 4: Test Your Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the features:
   - Sign up/login (creates user in database)
   - Create a transcript (saves to database)
   - View transcripts in Library
   - Add dictionary words
   - Update settings

## Database Schema

The database includes:

- **User** - User accounts (linked to Firebase UID)
- **transcriptions** - User transcriptions
- **dictionary_words** - Custom dictionary words
- **user_settings** - User preferences

## Troubleshooting

### Migration Errors

If you get connection errors:
- Verify `DATABASE_URL` is correct in `.env.local`
- Check that Railway database is running
- Ensure the connection string includes SSL if required

### Prisma Client Not Generated

If you see errors about Prisma Client:
```bash
npx prisma generate
```

## Next Steps

After migration is complete, your app will:
- ✅ Save transcripts to database
- ✅ Store dictionary words
- ✅ Persist user settings
- ✅ All data is user-scoped and secure

