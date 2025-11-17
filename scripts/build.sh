#!/bin/sh
# Build script that handles missing DATABASE_URL during Prisma generate

# Set a dummy DATABASE_URL if not set (only needed for prisma generate)
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://user:password@localhost:5432/placeholder"
fi

# Generate Prisma Client
npx prisma generate

# Build Next.js app
npm run build

