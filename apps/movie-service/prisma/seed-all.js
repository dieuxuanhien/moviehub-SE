/**
 * Seed All Movie Data
 * Run this script to seed all movie batches in sequence
 * 
 * Usage (from apps/movie-service):
 *   node prisma/seed-all.js
 */

const { execSync } = require('child_process');
const path = require('path');

// Use localhost for local development
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5436/movie_hub_movie?schema=public';

const seedFiles = [
  'seed-batch1.ts',
  'seed-batch2.ts',
  'seed-batch3.ts',
  'seed-batch4.ts',
  'seed-batch5.ts',
  'seed-batch6.ts',
  'seed-extra.ts',
  'seed-romance-horror.ts',
  'seed-upcoming.ts'
];

const prismaDir = path.join(__dirname);

console.log('🌱 Starting Movie Hub Seed Process...\n');
console.log('📦 DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
console.log('');

let successCount = 0;
let failedCount = 0;

for (const file of seedFiles) {
  const filePath = path.join(prismaDir, file);
  console.log(`\n🎬 Running ${file}...`);
  console.log('='.repeat(50));
  
  try {
    // Use tsx for better TypeScript/ESM support
    execSync(`npx tsx "${filePath}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL
      }
    });
    successCount++;
    console.log(`✅ ${file} completed!`);
  } catch (error) {
    failedCount++;
    console.error(`❌ ${file} failed!`);
    // Continue with other files even if one fails
  }
}

console.log('\n' + '='.repeat(50));
console.log('🎉 Seed Complete!');
console.log(`✅ Success: ${successCount}/${seedFiles.length}`);
console.log(`❌ Failed: ${failedCount}/${seedFiles.length}`);
