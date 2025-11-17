// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in Railway service variables.');
  console.error('Get it from your PostgreSQL service → Variables tab');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set');

