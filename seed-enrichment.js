/**
 * RECOMMENDATION ENRICHMENT SCRIPT - seed-enrichment.js
 * ======================================================
 * Enriches EXISTING production data for AI recommendations.
 * 
 * ⚠️  DOES NOT DELETE ANY DATA!
 * ✅  Only generates/updates embeddings and recommendation-related data
 * 
 * What this script does:
 * 1. Generates embeddings for movies that don't have them
 * 2. Updates MovieEmbeddings table for AI recommendations
 * 3. Does NOT touch: movies, cinemas, bookings, showtimes, users
 * 
 * Usage: node seed-enrichment.js
 * Run from: moviehub-SE root directory
 */

const { execSync } = require('child_process');
const path = require('path');
const { PrismaClient } = require('./apps/movie-service/generated/prisma');

// Database URL
const MOVIE_DB = 'postgresql://postgres:postgres@localhost:5436/movie_hub_movie?schema=public';

const rootDir = __dirname;

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║    🧠 RECOMMENDATION ENRICHMENT (No Data Cleanup)            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(`📅 ${new Date().toISOString()}\n`);

  const prisma = new PrismaClient({
    datasources: { db: { url: MOVIE_DB } }
  });

  try {
    // Check current state
    const totalMovies = await prisma.movie.count();
    const moviesWithEmbeddings = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT movie_id) as count FROM "MovieEmbeddings"
    `;
    const embeddingCount = Number(moviesWithEmbeddings[0]?.count || 0);

    console.log('📊 Current Database State:');
    console.log(`   - Total Movies: ${totalMovies}`);
    console.log(`   - Movies with Embeddings: ${embeddingCount}`);
    console.log(`   - Movies needing Embeddings: ${totalMovies - embeddingCount}\n`);

    if (totalMovies === 0) {
      console.log('⚠️  No movies found. Run seed-all.js first to seed base data.');
      return;
    }

    // =============================================================
    // STEP 1: Generate Embeddings for movies without them
    // =============================================================
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║ STEP 1: Generate Movie Embeddings                            ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    if (embeddingCount >= totalMovies) {
      console.log('✅ All movies already have embeddings. Skipping generation.\n');
    } else {
      console.log('🧠 Generating embeddings via API...');
      console.log('   This may take a few minutes depending on movie count.\n');

      // Call the embedding generation endpoint
      try {
        const response = await fetch('http://localhost:4000/api/v1/recommendations/generate-embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✅ Embeddings generated successfully!');
          console.log(`   Processed: ${result.data?.processed || 'unknown'} movies\n`);
        } else {
          console.log('⚠️  API call failed, trying direct method...\n');
          
          // Fallback: Run via npx tsx
          execSync(`npx tsx src/scripts/generate-embeddings.ts`, {
            cwd: path.join(rootDir, 'apps/movie-service'),
            env: { ...process.env, DATABASE_URL: MOVIE_DB },
            stdio: 'inherit'
          });
        }
      } catch (error) {
        console.log('⚠️  API not available, trying direct script...');
        
        // Check if script exists
        const fs = require('fs');
        const scriptPath = path.join(rootDir, 'apps/movie-service/src/scripts/generate-embeddings.ts');
        
        if (fs.existsSync(scriptPath)) {
          execSync(`npx tsx src/scripts/generate-embeddings.ts`, {
            cwd: path.join(rootDir, 'apps/movie-service'),
            env: { ...process.env, DATABASE_URL: MOVIE_DB },
            stdio: 'inherit'
          });
        } else {
          console.log('\n📝 To generate embeddings, run:');
          console.log('   POST http://localhost:4000/api/v1/recommendations/generate-embeddings');
          console.log('   OR: npx nx run movie-service:generate-embeddings\n');
        }
      }
    }

    // =============================================================
    // STEP 2: Verify Recommendation Data
    // =============================================================
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║ STEP 2: Verify Recommendation Data                           ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');

    // Re-check embedding count
    const updatedEmbeddings = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT movie_id) as count FROM "MovieEmbeddings"
    `;
    const finalEmbeddingCount = Number(updatedEmbeddings[0]?.count || 0);

    // Check genres
    const genreCount = await prisma.genre.count();
    const movieGenreLinks = await prisma.movieGenre.count();

    console.log('📊 Final State:');
    console.log(`   - Total Movies: ${totalMovies}`);
    console.log(`   - Movies with Embeddings: ${finalEmbeddingCount}`);
    console.log(`   - Genres: ${genreCount}`);
    console.log(`   - Movie-Genre Links: ${movieGenreLinks}\n`);

    // =============================================================
    // SUMMARY
    // =============================================================
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║ 🎉 ENRICHMENT COMPLETE!                                       ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log(`
✅ Data Preserved:
   - Movies, Cinemas, Bookings: UNTOUCHED
   - Showtimes, Users, Payments: UNTOUCHED

✅ Recommendation Data:
   - Embeddings: ${finalEmbeddingCount}/${totalMovies} movies
   - Ready for AI recommendations

🚀 Test recommendations:
   GET http://localhost:4000/api/v1/recommendations/{movieId}
   GET http://localhost:4000/api/v1/recommendations/for-you
`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
