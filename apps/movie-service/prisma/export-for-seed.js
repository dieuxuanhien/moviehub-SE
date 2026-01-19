const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('📤 Exporting movie posters and releases from DB...');

  const movies = await prisma.movie.findMany({
    include: {
      movieReleases: true
    }
  });

  const posterMapping = {};
  const releaseMapping = {};
  const trailerMapping = {};

  movies.forEach(m => {
    // Only store non-placeholder URLs
    if (m.posterUrl && !m.posterUrl.includes('via.placeholder.com')) {
      posterMapping[m.title] = m.posterUrl;
    }

    // Only store non-placeholder trailers
    if (m.trailerUrl && !m.trailerUrl.includes('dQw4w9WgXcQ')) {
      trailerMapping[m.title] = m.trailerUrl;
    }

    // Store releases if they exist
    if (m.movieReleases && m.movieReleases.length > 0) {
      releaseMapping[m.title] = m.movieReleases.map(r => ({
        startDate: r.startDate,
        endDate: r.endDate,
        note: r.note
      }));
    }
  });

  const data = {
    posters: posterMapping,
    releases: releaseMapping,
    trailers: trailerMapping
  };

  fs.writeFileSync(
    path.join(__dirname, 'seed-data-patch.json'),
    JSON.stringify(data, null, 2)
  );

  console.log(`✅ Exported ${Object.keys(posterMapping).length} posters and ${Object.keys(releaseMapping).length} release sets.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
