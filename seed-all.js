/**
 * COMBINED MASTER SEED SCRIPT - seed-all.js
 * ==========================================
 * Seeds ALL data for MovieHub in the correct dependency order:
 * 
 * EXECUTION ORDER (Dependencies matter!):
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ PHASE 1: MOVIE SERVICE                                         │
 * │   1.1 Movies (genres, reviews, cast, directors)                │
 * │   1.2 Update release dates (50% now showing / 50% upcoming)    │
 * │   1.3 Add MovieRelease entries (for homepage display)          │
 * │   1.4 Update poster URLs from patch file                       │
 * └─────────────────────────────────────────────────────────────────┘
 *                                ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ PHASE 2: CINEMA SERVICE                                        │
 * │   2.1 Cinemas and Halls (with seats, ticket pricing)           │
 * │   2.2 Showtimes (REQUIRES movies from Phase 1)                 │
 * └─────────────────────────────────────────────────────────────────┘
 *                                ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ PHASE 3: BOOKING SERVICE                                       │
 * │   3.1 Concessions & Promotions                                 │
 * │   3.2 Scenario-based Bookings (REQUIRES showtimes from Phase 2)│
 * └─────────────────────────────────────────────────────────────────┘
 * 
 * Usage: node seed-all.js
 * Run from: moviehub-SE root directory
 */

const { execSync } = require('child_process');
const path = require('path');

// Database URLs
const MOVIE_DB = 'postgresql://postgres:postgres@localhost:5436/movie_hub_movie?schema=public';
const CINEMA_DB = 'postgresql://postgres:postgres@localhost:5437/movie_hub_cinema?schema=public';
const BOOKING_DB = 'postgresql://postgres:postgres@localhost:5438/movie_hub_booking?schema=public';

const rootDir = __dirname;

// DEFAULT: Preserve existing data (safe for production)
// Use --clean flag to delete existing data (for development reset)
const shouldClean = process.argv.includes('--clean');
const noCleanFlag = shouldClean ? '' : '--no-clean';

function runCommand(cmd, options) {
  try {
    execSync(cmd, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${cmd}`);
    return false;
  }
}

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║        🎬 MOVIEHUB COMBINED MASTER SEED                       ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log(`📅 ${new Date().toISOString()}`);
if (shouldClean) {
  console.log('🧹 --clean mode: Existing data will be REPLACED\n');
} else {
  console.log('✅ Safe mode (default): Existing data will be PRESERVED\n');
}

// ============================================================
// PHASE 1: MOVIE SERVICE
// ============================================================
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║ PHASE 1: MOVIE SERVICE                                        ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Run the seed with real URLs and MovieReleases (336 movies embedded in file)
console.log('📦 Step 1.1: Seeding movies with REAL data + MovieReleases...\n');

const movieSeedSuccess = runCommand(`npx tsx prisma/seed-real-data.ts ${noCleanFlag}`, {
  cwd: path.join(rootDir, 'apps/movie-service'),
  env: { ...process.env, DATABASE_URL: MOVIE_DB }
});

if (movieSeedSuccess) {
  console.log('\n  ✅ Movies seeded with real URLs and MovieReleases!\n');
} else {
  console.log('\n  ⚠️ Movie seeding had issues, continuing...\n');
}

// Step 2: Update poster URLs from patch file (optional, fills in any missing)
console.log('📦 Step 1.2: Updating any missing poster URLs...');
runCommand('node prisma/update-missing-posters.js', {
  cwd: path.join(rootDir, 'apps/movie-service'),
  env: { ...process.env, DATABASE_URL: MOVIE_DB }
});

// Step 3: Merge additional movies from synthetic_seed_data (optional)
console.log('\n📦 Step 1.3: Merging additional movies from synthetic data...');
runCommand(`node seed.js ${noCleanFlag}`, {
  cwd: path.join(rootDir, 'synthetic_seed_data/seed_movie'),
  env: { ...process.env, DATABASE_URL: MOVIE_DB }
});

console.log('\n✅ PHASE 1 COMPLETE: Movies with MovieReleases ready\n');

// ============================================================
// PHASE 2: CINEMA SERVICE (Full Synthetic Seed)
// ============================================================
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║ PHASE 2: CINEMA SERVICE                                       ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('📦 Step 2.1: Seeding cinemas, halls, seats, pricing, showtimes...');
console.log('   (Using synthetic_seed_data for complete test data)\n');

runCommand(`node seed.js ${noCleanFlag}`, {
  cwd: path.join(rootDir, 'synthetic_seed_data/seed_cinema'),
  env: { 
    ...process.env, 
    DATABASE_URL: CINEMA_DB,
    MOVIE_DATABASE_URL: MOVIE_DB  // For querying movie releases
  }
});

console.log('\n✅ PHASE 2 COMPLETE: Cinemas & Showtimes ready\n');

// ============================================================
// PHASE 3: BOOKING SERVICE
// ============================================================
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║ PHASE 3: BOOKING SERVICE                                      ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('📦 Step 3.1: Seeding scenario-based bookings...');
runCommand(`node seed.js ${noCleanFlag}`, {
  cwd: path.join(rootDir, 'synthetic_seed_data/seed_booking'),
  env: { 
    ...process.env, 
    DATABASE_URL: BOOKING_DB,
    CINEMA_DATABASE_URL: CINEMA_DB  // For querying showtimes
  }
});

console.log('\n✅ PHASE 3 COMPLETE: Bookings ready\n');

// ============================================================
// SUMMARY
// ============================================================
console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║ 🎉 SEED COMPLETE!                                             ║');
console.log('╚═══════════════════════════════════════════════════════════════╝');
console.log(`
📊 Summary:
  ✅ Movies: 336 with REAL poster/trailer URLs
  ✅ Genres, Reviews, Cast: included
  ✅ Release dates: 50% Now Showing / 50% Upcoming
  ✅ Cinemas, Halls, Seats: seeded
  ✅ Showtimes: created
  ✅ Bookings, Tickets, Payments: scenario-based

🚀 Your database is ready!
  - Frontend: http://localhost:5200
  - API: http://localhost:4000/api/v1

⚠️  Don't forget to restart Docker services if running in containers:
    docker compose restart

📝 For AI recommendations, generate embeddings:
    npx nx run movie-service:generate-embeddings
`);
