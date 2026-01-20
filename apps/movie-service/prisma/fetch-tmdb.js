/**
 * Fetch Trailers and Backdrops from TMDB
 * 
 * TMDB provides: poster, backdrop, and trailer URLs
 * Get your free API key at: https://www.themoviedb.org/settings/api
 * 
 * Usage: node prisma/fetch-tmdb.js
 */

require('dotenv').config();

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// TMDB API configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Image sizes
const POSTER_SIZE = 'w500';
const BACKDROP_SIZE = 'w1280';

async function searchMovie(title) {
  try {
    // Clean title for search
    const searchTitle = title
      .replace(/[:\-–]/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' - ')[0] // Remove Vietnamese subtitle
      .trim();
    
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchTitle)}&language=en-US&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0]; // Return first match
    }
  } catch (error) {
    // Silently fail
  }
  return null;
}

async function getMovieVideos(tmdbId) {
  try {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Find trailer (prefer official trailers)
      const trailer = data.results.find(v => 
        v.type === 'Trailer' && v.site === 'YouTube'
      ) || data.results.find(v => 
        v.site === 'YouTube'
      );
      
      if (trailer) {
        return `https://www.youtube.com/watch?v=${trailer.key}`;
      }
    }
  } catch (error) {
    // Silently fail
  }
  return null;
}

async function main() {
  console.log('🎬 Fetching trailers and backdrops from TMDB...\n');

  if (!TMDB_API_KEY) {
    console.log('❌ No TMDB API key provided!');
    console.log('');
    console.log('📝 How to get a TMDB API key:');
    console.log('   1. Go to: https://www.themoviedb.org/signup');
    console.log('   2. Create a free account');
    console.log('   3. Go to: https://www.themoviedb.org/settings/api');
    console.log('   4. Request an API key (select "Developer" option)');
    console.log('   5. Add to .env: TMDB_API_KEY=your_key_here');
    console.log('');
    console.log('⚠️ Note: TMDB approval is usually instant for personal use');
    return;
  }

  console.log('✅ TMDB API key detected\n');

  // Get movies that need updates (placeholder trailers or backdrops)
  const movies = await prisma.movie.findMany({
    where: {
      OR: [
        { trailerUrl: { contains: 'dQw4w9WgXcQ' } }, // Rickroll placeholder
        { backdropUrl: { contains: 'placeholder' } }
      ]
    },
    select: { id: true, title: true, originalTitle: true, trailerUrl: true, backdropUrl: true }
  });

  console.log(`📊 Found ${movies.length} movies needing trailers/backdrops\n`);

  let trailersUpdated = 0;
  let backdropsUpdated = 0;
  let failed = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const tmdbMovie = await searchMovie(movie.originalTitle);
    
    if (tmdbMovie) {
      const updates = {};
      
      // Get backdrop
      if (tmdbMovie.backdrop_path && movie.backdropUrl.includes('placeholder')) {
        updates.backdropUrl = `${TMDB_IMAGE_BASE}/${BACKDROP_SIZE}${tmdbMovie.backdrop_path}`;
        backdropsUpdated++;
      }
      
      // Get poster if still placeholder
      if (tmdbMovie.poster_path && movie.posterUrl?.includes('placeholder')) {
        updates.posterUrl = `${TMDB_IMAGE_BASE}/${POSTER_SIZE}${tmdbMovie.poster_path}`;
      }
      
      // Get trailer
      if (movie.trailerUrl.includes('dQw4w9WgXcQ')) {
        const trailerUrl = await getMovieVideos(tmdbMovie.id);
        if (trailerUrl) {
          updates.trailerUrl = trailerUrl;
          trailersUpdated++;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: updates
        });
        console.log(`✅ [${i + 1}/${movies.length}] ${movie.title} - T:${updates.trailerUrl ? '✓' : '-'} B:${updates.backdropUrl ? '✓' : '-'}`);
      } else {
        console.log(`⏭️  [${i + 1}/${movies.length}] ${movie.title} - no updates`);
      }
    } else {
      failed++;
      console.log(`❌ [${i + 1}/${movies.length}] ${movie.title} - not found`);
    }
    
    // Rate limit: 40 requests per 10 seconds
    await new Promise(r => setTimeout(r, 250));
  }

  console.log(`\n📊 Results:`);
  console.log(`🎬 Trailers updated: ${trailersUpdated}`);
  console.log(`🖼️  Backdrops updated: ${backdropsUpdated}`);
  console.log(`❌ Not found: ${failed}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
