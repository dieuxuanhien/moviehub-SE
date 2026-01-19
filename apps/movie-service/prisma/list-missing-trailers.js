const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

/**
 * This script lists all movies that need trailers.
 * Since automated YouTube scraping is unreliable, the best approach is:
 * 1. Run this script to get the list of movies
 * 2. Manually search YouTube for each movie's trailer
 * 3. Copy the video URLs to update-trailers.js
 * 4. Run update-trailers.js to apply them
 */

async function listMoviesNeedingTrailers() {
  console.log('🎬 Movies needing trailer URLs:\n');
  console.log('Open each movie on YouTube and copy the trailer URL.\n');
  console.log('Search format: "[Movie Name] official trailer"\n');
  console.log('='.repeat(60) + '\n');

  const movies = await prisma.movie.findMany({
    where: {
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    select: { title: true, originalTitle: true },
    orderBy: { title: 'asc' }
  });

  console.log(`Total: ${movies.length} movies\n`);

  // Group by first letter for easier browsing
  const groups = {};
  movies.forEach(m => {
    const letter = m.originalTitle[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(m);
  });

  Object.keys(groups).sort().forEach(letter => {
    console.log(`\n--- ${letter} ---`);
    groups[letter].forEach(m => {
      console.log(`  "${m.title}": 'https://www.youtube.com/watch?v=VIDEO_ID',`);
      if (m.title !== m.originalTitle) {
        console.log(`     (Search: ${m.originalTitle} trailer)`);
      }
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log('\nCopy the URLs above to update-trailers.js');
  console.log('Then run: node prisma/update-trailers.js');
}

listMoviesNeedingTrailers()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
