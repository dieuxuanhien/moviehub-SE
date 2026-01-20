/**
 * Update ALL Movie Posters from OMDB
 * 
 * This script updates posters for ALL movies using OMDB API,
 * replacing any broken or outdated URLs.
 * 
 * Usage: node prisma/update-all-posters.js
 */

require('dotenv').config();

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const OMDB_API_KEY = process.env.OMDB_API_KEY;

async function fetchPosterFromOMDB(title) {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'demo') {
    return null;
  }
  
  try {
    // Clean title for search
    const searchTitle = title
      .replace(/[:\-–]/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' - ')[0] // Remove Vietnamese subtitle
      .trim();
    
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(searchTitle)}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      return data.Poster;
    }
  } catch (error) {
    // Silently fail
  }
  return null;
}

async function main() {
  console.log('📸 Updating ALL movie posters from OMDB...\n');

  if (!OMDB_API_KEY || OMDB_API_KEY === 'demo') {
    console.log('❌ No OMDB API key provided!');
    console.log('   Get a free key at: https://www.omdbapi.com/apikey.aspx');
    return;
  }

  console.log('✅ OMDB API key detected\n');

  // Get ALL movies
  const movies = await prisma.movie.findMany({
    select: { id: true, title: true, originalTitle: true, posterUrl: true },
    orderBy: { title: 'asc' }
  });

  console.log(`📊 Found ${movies.length} movies total\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    
    // Try to fetch new poster
    const newPosterUrl = await fetchPosterFromOMDB(movie.originalTitle);
    
    if (newPosterUrl) {
      // Only update if different from current
      if (newPosterUrl !== movie.posterUrl) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: { posterUrl: newPosterUrl }
        });
        updated++;
        console.log(`✅ [${i + 1}/${movies.length}] Updated: ${movie.title}`);
      } else {
        skipped++;
        if ((i + 1) % 50 === 0) {
          console.log(`⏭️  [${i + 1}/${movies.length}] Progress...`);
        }
      }
    } else {
      failed++;
      console.log(`❌ [${i + 1}/${movies.length}] Not found: ${movie.title}`);
    }
    
    // Rate limit: respect OMDB limits
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n📊 Results:`);
  console.log(`✅ Updated: ${updated} posters`);
  console.log(`⏭️  Skipped (same): ${skipped} posters`);
  console.log(`❌ Not found: ${failed} movies`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
