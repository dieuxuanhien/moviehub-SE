/**
 * MASTER SEED SCRIPT
 * Seeds all data for MovieHub: movies, genres, reviews, cinemas, halls, and showtimes
 * 
 * Usage: node seed-master.js
 * Run from: moviehub-SE root directory
 */

const { execSync } = require('child_process');
const path = require('path');

// Database URLs for local development
const MOVIE_DB = 'postgresql://postgres:postgres@localhost:5436/movie_hub_movie?schema=public';
const CINEMA_DB = 'postgresql://postgres:postgres@localhost:5437/movie_hub_cinema?schema=public';

const rootDir = __dirname;

console.log('🎬 MOVIEHUB MASTER SEED');
console.log('='.repeat(60));
console.log(`📅 ${new Date().toISOString()}`);
console.log('');

// Step 1: Seed Movie Service (all 315+ movies)
console.log('\n📦 STEP 1: Seeding Movie Service...');
console.log('-'.repeat(60));

const movieSeedFiles = [
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

let movieSuccess = 0;
let movieFailed = 0;

for (const file of movieSeedFiles) {
  const filePath = path.join(rootDir, 'apps/movie-service/prisma', file);
  console.log(`\n🎬 Running ${file}...`);
  
  try {
    execSync(`npx tsx "${filePath}"`, {
      cwd: path.join(rootDir, 'apps/movie-service'),
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: MOVIE_DB }
    });
    movieSuccess++;
    console.log(`✅ ${file} completed!`);
  } catch (error) {
    movieFailed++;
    console.error(`❌ ${file} failed!`);
  }
}

console.log(`\n📊 Movie Service: ${movieSuccess} succeeded, ${movieFailed} failed`);

// Step 2: Seed Cinema Service (cinemas, halls, seats, pricing)
console.log('\n\n📦 STEP 2: Seeding Cinema Service...');
console.log('-'.repeat(60));

try {
  console.log('\n🏢 Seeding cinemas and halls...');
  execSync('node prisma/seed_cinema.js', {
    cwd: path.join(rootDir, 'apps/cinema-service'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: CINEMA_DB }
  });
  console.log('✅ Cinemas seeded!');
} catch (error) {
  console.error('❌ Cinema seed failed!', error.message);
}

// Step 3: Seed Showtimes (connects movies to cinemas)
console.log('\n\n📦 STEP 3: Seeding Showtimes...');
console.log('-'.repeat(60));

try {
  console.log('\n📅 Creating showtimes for movies...');
  execSync('node prisma/seed-showtimes.js', {
    cwd: path.join(rootDir, 'apps/cinema-service'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: CINEMA_DB }
  });
  console.log('✅ Showtimes seeded!');
} catch (error) {
  console.error('❌ Showtime seed failed!', error.message);
}

// Step 4: Update release dates (50% now showing, 50% upcoming)
console.log('\n\n📦 STEP 4: Updating release dates (50/50 split)...');
console.log('-'.repeat(60));

try {
  console.log('\n📅 Making all movies appear in Now Showing / Upcoming...');
  execSync('node prisma/update-release-dates.js', {
    cwd: path.join(rootDir, 'apps/movie-service'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: MOVIE_DB }
  });
  console.log('✅ Release dates updated!');
} catch (error) {
  console.error('❌ Release date update failed!', error.message);
}

// Step 5: Add MovieRelease entries (required for homepage filtering)
console.log('\n\n📦 STEP 5: Adding MovieRelease entries...');
console.log('-'.repeat(60));

try {
  console.log('\n📅 Creating MovieRelease records for homepage display...');
  execSync('node prisma/add-movie-releases.js', {
    cwd: path.join(rootDir, 'apps/movie-service'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: MOVIE_DB }
  });
  console.log('✅ MovieRelease entries added!');
} catch (error) {
  console.error('❌ MovieRelease entries failed!', error.message);
}

// Step 6: Update poster URLs from seed-data-patch.json
console.log('\n\n📦 STEP 6: Updating poster URLs...');
console.log('-'.repeat(60));

try {
  console.log('\n📸 Updating movie posters from patch file...');
  execSync('node prisma/update-missing-posters.js', {
    cwd: path.join(rootDir, 'apps/movie-service'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: MOVIE_DB }
  });
  console.log('✅ Poster URLs updated!');
} catch (error) {
  console.error('❌ Poster update failed!', error.message);
}

// Summary
console.log('\n');
console.log('='.repeat(60));
console.log('🎉 MASTER SEED COMPLETE!');
console.log('='.repeat(60));
console.log(`
📊 Summary:
  ✅ Movie batches: ${movieSuccess}/${movieSeedFiles.length}
  ✅ Cinemas & Halls: seeded
  ✅ Showtimes: seeded
  ✅ Release dates: 50% Now Showing / 50% Upcoming
  ✅ MovieRelease entries: created for homepage display
  ✅ Poster URLs: updated from patch file

🚀 Your database is ready! Visit http://localhost:4200

📝 Note: For AI recommendations, run embeddings separately:
   npx nx run movie-service:generate-embeddings
`);
