#!/usr/bin/env node
// Build script that handles missing DATABASE_URL during Prisma generate
const { execSync } = require('child_process');

// Set a dummy DATABASE_URL if not set (only needed for prisma generate)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/placeholder';
  console.log('⚠️  DATABASE_URL not set, using placeholder for Prisma generate');
}

try {
  // Generate Prisma Client
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build Next.js app (using build:next to avoid circular dependency)
  console.log('Building Next.js app...');
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

