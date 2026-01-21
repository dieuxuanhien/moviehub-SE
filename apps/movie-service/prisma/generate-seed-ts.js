/**
 * Generate Seed TypeScript File
 * ==============================
 * Reads seed-data-export.json and generates a TypeScript seed file
 * with the same structure as seed-batch1.ts but with real data.
 * 
 * Usage:
 *   cd apps/movie-service
 *   node prisma/generate-seed-ts.js
 * 
 * Output: prisma/seed-real-data.ts
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'seed-data-export.json');
const outputPath = path.join(__dirname, 'seed-real-data.ts');

function escapeString(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function formatCast(cast) {
  if (!Array.isArray(cast) || cast.length === 0) {
    return '[]';
  }
  const items = cast.slice(0, 5).map(c => {
    if (typeof c === 'object') {
      return `{ name: '${escapeString(c.name || '')}', character: '${escapeString(c.character || '')}' }`;
    }
    return `{ name: '${escapeString(c)}', character: '' }`;
  });
  return `[\n        ${items.join(',\n        ')},\n      ]`;
}

function mapAgeRating(rating) {
  const validRatings = ['P', 'K', 'T13', 'T16', 'T18', 'C'];
  if (validRatings.includes(rating)) {
    return `AgeRating.${rating}`;
  }
  return 'AgeRating.P';
}

function generateSeedFile() {
  console.log('📦 Generating TypeScript seed file...\n');

  if (!fs.existsSync(inputPath)) {
    console.error('❌ File not found: seed-data-export.json');
    console.log('   Run export-movies.js first to create the export file.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`📅 Export date: ${data.exportedAt}`);
  console.log(`📊 Movies: ${data.movies.length}`);
  console.log(`📊 Genres: ${data.genres.length}\n`);

  // Get unique genre names
  const genreNames = [...new Set(data.movies.flatMap(m => m.genres || []))];

  // Generate TypeScript content
  let content = `/**
 * GENERATED SEED FILE - Real Data
 * ================================
 * Generated on: ${new Date().toISOString()}
 * Contains ${data.movies.length} movies with real poster/trailer URLs
 * 
 * Usage: npx tsx prisma/seed-real-data.ts
 */

import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

const genreNames = [
${genreNames.map(g => `  '${escapeString(g)}',`).join('\n')}
];

interface MovieSeed {
  id: string;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  runtime: number;
  releaseDate: string;
  ageRating: typeof AgeRating[keyof typeof AgeRating];
  director: string;
  cast: Array<{ name: string; character: string }>;
  genres: string[];
}

const movies: MovieSeed[] = [
`;

  // Add each movie
  for (const movie of data.movies) {
    content += `  {
    id: '${movie.id}',
    title: '${escapeString(movie.title)}',
    originalTitle: '${escapeString(movie.originalTitle || movie.title)}',
    overview: '${escapeString(movie.overview || '')}',
    posterUrl: '${escapeString(movie.posterUrl || '')}',
    backdropUrl: '${escapeString(movie.backdropUrl || '')}',
    trailerUrl: '${escapeString(movie.trailerUrl || '')}',
    runtime: ${movie.runtime || 120},
    releaseDate: '${movie.releaseDate || '2024-01-01'}',
    ageRating: ${mapAgeRating(movie.ageRating)},
    director: '${escapeString(movie.director || '')}',
    cast: ${formatCast(movie.cast)},
    genres: [${(movie.genres || []).map(g => `'${escapeString(g)}'`).join(', ')}],
  },
`;
  }

  content += `];

async function main() {
  console.log('🌱 Seeding Movie Database with REAL DATA (${data.movies.length} movies)...');
  
  const NOW = new Date();

  // Clean existing related data first (for fresh seed)
  console.log('🧹 Cleaning existing data...');
  await prisma.movieGenre.deleteMany();
  await prisma.movieRelease.deleteMany();
  await prisma.review.deleteMany();

  // Create genres
  console.log('📁 Creating genres...');
  for (const name of genreNames) {
    const existing = await prisma.genre.findFirst({ where: { name } });
    if (!existing) {
      await prisma.genre.create({ data: { name } });
    }
  }

  const allGenres = await prisma.genre.findMany();
  const genreMap = new Map(allGenres.map(g => [g.name, g.id]));

  // Create movies with MovieReleases
  console.log('🎬 Creating movies with MovieReleases...');
  let created = 0;
  let updated = 0;
  let nowShowing = 0;
  let upcoming = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    try {
      // Temporal Logic: 50% now showing, 50% upcoming
      const isUpcoming = i % 2 === 0; // Alternating pattern for even distribution
      
      let releaseStart: Date;
      let releaseEnd: Date | null = null;

      if (isUpcoming) {
        // UPCOMING: Release starts Jan 28 - Feb 28 (after current booking window)
        const daysInFuture = Math.floor(Math.random() * 30) + 7; // 7-37 days from now
        releaseStart = new Date(NOW.getTime() + daysInFuture * 24 * 60 * 60 * 1000);
        upcoming++;
      } else {
        // NOW SHOWING: All start Jan 21 (today) and run for 30-60 days
        // This ensures ALL now showing movies are within the showtime window
        const daysAgo = Math.floor(Math.random() * 7); // Started 0-7 days ago
        releaseStart = new Date(NOW.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        const runDays = Math.floor(Math.random() * 30) + 30; // Runs 30-60 days
        releaseEnd = new Date(releaseStart.getTime() + runDays * 24 * 60 * 60 * 1000);
        nowShowing++;
      }

      const existing = await prisma.movie.findUnique({ where: { id: movie.id } });
      
      const movieData = {
        title: movie.title,
        originalTitle: movie.originalTitle,
        overview: movie.overview,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        trailerUrl: movie.trailerUrl,
        runtime: movie.runtime,
        releaseDate: releaseStart,
        ageRating: movie.ageRating,
        director: movie.director,
        cast: movie.cast,
        originalLanguage: 'en',
        spokenLanguages: ['vi', 'en'],
        productionCountry: 'USA',
        languageType: 'SUBTITLE' as const,
      };

      if (existing) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: movieData,
        });
        updated++;
      } else {
        await prisma.movie.create({
          data: {
            id: movie.id,
            ...movieData,
          },
        });
        created++;
      }

      // Create MovieRelease (CRITICAL for showtimes!)
      await prisma.movieRelease.create({
        data: {
          movieId: movie.id,
          startDate: releaseStart,
          endDate: releaseEnd,
          note: isUpcoming ? 'COMING_SOON' : 'NOW_SHOWING',
        },
      });

      // Create genre relations
      for (const genreName of movie.genres) {
        const genreId = genreMap.get(genreName);
        if (genreId) {
          await prisma.movieGenre.upsert({
            where: { movieId_genreId: { movieId: movie.id, genreId } },
            create: { movieId: movie.id, genreId },
            update: {},
          });
        }
      }

      if ((created + updated) % 50 === 0) {
        console.log(\`   📦 Progress: \${created + updated}/\${movies.length}\`);
      }
    } catch (error) {
      console.error(\`   ⚠️ Failed: \${movie.title}\`);
    }
  }

  console.log(\`\\n🎉 Complete!\`);
  console.log(\`   Created: \${created}, Updated: \${updated}\`);
  console.log(\`   🎬 Now Showing: \${nowShowing}\`);
  console.log(\`   🔜 Upcoming: \${upcoming}\`);
  console.log(\`   📅 MovieReleases: \${nowShowing + upcoming}\`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
`;

  fs.writeFileSync(outputPath, content, 'utf8');

  console.log('✅ Generated: prisma/seed-real-data.ts');
  console.log(`📊 Contains ${data.movies.length} movies with real URLs`);
  console.log('\n📝 To run the seed:');
  console.log('   cd apps/movie-service');
  console.log('   npx tsx prisma/seed-real-data.ts');
}

generateSeedFile();
