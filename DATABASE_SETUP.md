# Database Setup Instructions

This guide will help you set up the PostgreSQL database for the AI Voice Keyboard application.

## Prerequisites

- PostgreSQL database (local or Railway)
- Node.js and npm installed
- Prisma CLI installed (`npm install -g prisma` or use `npx prisma`)

## Step 1: Set Up Environment Variables

Create a `.env` file in the root directory (or set environment variables in Railway):

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

For Railway, the `DATABASE_URL` is automatically provided when you create a PostgreSQL service.

## Step 2: Create Initial Migration

Run this command to create the initial migration based on your Prisma schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create a migration file in `prisma/migrations/`
- Apply the migration to your database
- Generate the Prisma Client

## Step 3: Generate Prisma Client

If you haven't already, generate the Prisma Client:

```bash
npx prisma generate
```

This creates the TypeScript types and client code in `node_modules/.prisma/client`.

## Step 4: Verify Database Schema

You can view your database in Prisma Studio:

```bash
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can view and edit your database.

## Step 5: Deploy to Railway (Production)

When deploying to Railway:

1. Railway automatically provides the `DATABASE_URL` environment variable
2. The `postinstall` script in `package.json` will run `prisma generate` automatically
3. The `build` script will run `prisma migrate deploy` to apply migrations

### Manual Migration on Railway

If you need to run migrations manually on Railway:

```bash
# Using Railway CLI
railway run npx prisma migrate deploy

# Or via Railway dashboard
# Go to your service → Deployments → Custom Command
# Run: npx prisma migrate deploy
```

## Database Schema Overview

The database includes the following tables:

### Users
- `id` (String, Primary Key) - Firebase UID
- `email` (String, Unique)
- `name` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Transcriptions
- `id` (String, Primary Key) - CUID
- `text` (Text)
- `userId` (String, Foreign Key → Users.id)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Dictionary Words
- `id` (String, Primary Key) - CUID
- `phrase` (String)
- `correction` (String)
- `userId` (String, Foreign Key → Users.id)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- Unique constraint on `(userId, phrase)`

### User Settings
- `id` (String, Primary Key) - CUID
- `userId` (String, Unique, Foreign Key → Users.id)
- `autoPunctuation` (Boolean, Default: false)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Troubleshooting

### Migration Errors

If you encounter migration errors:

1. **Reset database (development only)**:
   ```bash
   npx prisma migrate reset
   ```
   ⚠️ **Warning**: This will delete all data!

2. **Check migration status**:
   ```bash
   npx prisma migrate status
   ```

3. **Create a new migration**:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

### Connection Issues

- Verify `DATABASE_URL` is correct
- Check that PostgreSQL is running
- Ensure network/firewall allows connections
- For Railway, ensure SSL is enabled if required

### Prisma Client Not Generated

If you see errors about Prisma Client not being generated:

```bash
npx prisma generate
```

## Next Steps

After setting up the database:

1. Test the API endpoints
2. Create a test user via Firebase Auth
3. Test creating transcripts
4. Test dictionary functionality
5. Verify settings are saved correctly

## Useful Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Check migration status
npx prisma migrate status

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only - deletes all data!)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Format Prisma schema
npx prisma format

# Validate Prisma schema
npx prisma validate
```

