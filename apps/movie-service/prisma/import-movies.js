/**
 * Import Movie Data Script
 * =========================
 * Imports movies from seed-data-export.json into the database.
 * This uses the real URLs and data exported from the production database.
 * 
 * Usage:
 *   cd apps/movie-service
 *   $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5436/movie_hub_movie"
 *   node prisma/import-movies.js
 * 
 * Input: prisma/seed-data-export.json
 */

const { PrismaClient, AgeRating, LanguageOption } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importMovies() {
  console.log('📦 Importing movie data from export file...\n');

  const inputPath = path.join(__dirname, 'seed-data-export.json');
  
  if (!fs.existsSync(inputPath)) {
    console.error('❌ File not found: seed-data-export.json');
    console.log('   Run export-movies.js first to create the export file.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`📅 Export date: ${data.exportedAt}`);
  console.log(`📊 Stats: ${data.stats.movies} movies, ${data.stats.genres} genres\n`);

  try {
    // Step 1: Import genres
    console.log('📁 Importing genres...');
    let genresCreated = 0;
    for (const genre of data.genres) {
      await prisma.genre.upsert({
        where: { id: genre.id },
        create: genre,
        update: genre
      });
      genresCreated++;
    }
    console.log(`   ✅ ${genresCreated} genres imported`);

    // Build genre lookup map
    const genreByName = {};
    for (const g of data.genres) {
      genreByName[g.name] = g.id;
    }

    // Step 2: Import movies
    console.log('🎬 Importing movies...');
    let moviesCreated = 0;
    let moviesSkipped = 0;

    for (const movie of data.movies) {
      try {
        // Check if movie exists
        const existing = await prisma.movie.findUnique({ where: { id: movie.id } });
        
        if (existing) {
          // Update existing movie
          await prisma.movie.update({
            where: { id: movie.id },
            data: {
              title: movie.title,
              originalTitle: movie.originalTitle,
              overview: movie.overview,
              posterUrl: movie.posterUrl,
              backdropUrl: movie.backdropUrl,
              trailerUrl: movie.trailerUrl,
              runtime: movie.runtime,
              releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
              ageRating: movie.ageRating,
              originalLanguage: movie.originalLanguage,
              spokenLanguages: movie.spokenLanguages,
              productionCountry: movie.productionCountry,
              languageType: movie.languageType,
              director: movie.director,
              cast: movie.cast
            }
          });
        } else {
          // Create new movie
          await prisma.movie.create({
            data: {
              id: movie.id,
              title: movie.title,
              originalTitle: movie.originalTitle,
              overview: movie.overview,
              posterUrl: movie.posterUrl,
              backdropUrl: movie.backdropUrl,
              trailerUrl: movie.trailerUrl,
              runtime: movie.runtime,
              releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
              ageRating: movie.ageRating || 'P',
              originalLanguage: movie.originalLanguage || 'en',
              spokenLanguages: movie.spokenLanguages || ['vi', 'en'],
              productionCountry: movie.productionCountry || 'USA',
              languageType: movie.languageType || 'SUBTITLE',
              director: movie.director,
              cast: movie.cast || []
            }
          });
        }

        // Create movie-genre relations
        for (const genreName of (movie.genres || [])) {
          const genreId = genreByName[genreName];
          if (genreId) {
            await prisma.movieGenre.upsert({
              where: {
                movieId_genreId: { movieId: movie.id, genreId }
              },
              create: { movieId: movie.id, genreId },
              update: {}
            });
          }
        }

        moviesCreated++;
        if (moviesCreated % 50 === 0) {
          console.log(`   📦 Progress: ${moviesCreated}/${data.movies.length}`);
        }
      } catch (error) {
        console.error(`   ⚠️ Failed: ${movie.title} - ${error.message}`);
        moviesSkipped++;
      }
    }
    console.log(`   ✅ ${moviesCreated} movies imported, ${moviesSkipped} skipped`);

    // Step 3: Import movie releases
    console.log('📅 Importing movie releases...');
    let releasesCreated = 0;
    for (const release of data.movieReleases) {
      try {
        await prisma.movieRelease.upsert({
          where: { id: release.id },
          create: {
            id: release.id,
            movieId: release.movieId,
            releaseType: release.releaseType || 'NOW_SHOWING',
            startDate: release.startDate ? new Date(release.startDate) : new Date(),
            endDate: release.endDate ? new Date(release.endDate) : null
          },
          update: {
            releaseType: release.releaseType || 'NOW_SHOWING',
            startDate: release.startDate ? new Date(release.startDate) : new Date(),
            endDate: release.endDate ? new Date(release.endDate) : null
          }
        });
        releasesCreated++;
      } catch (error) {
        // Skip if movie doesn't exist
      }
    }
    console.log(`   ✅ ${releasesCreated} movie releases imported`);

    // Step 4: Import reviews (optional)
    console.log('⭐ Importing reviews...');
    let reviewsCreated = 0;
    for (const review of data.reviews) {
      try {
        await prisma.review.upsert({
          where: { id: review.id },
          create: {
            id: review.id,
            movieId: review.movieId,
            userId: review.userId,
            rating: review.rating,
            content: review.content
          },
          update: {
            rating: review.rating,
            content: review.content
          }
        });
        reviewsCreated++;
      } catch (error) {
        // Skip duplicates
      }
    }
    console.log(`   ✅ ${reviewsCreated} reviews imported`);

    console.log('\n🎉 Import complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Genres: ${genresCreated}`);
    console.log(`   - Movies: ${moviesCreated}`);
    console.log(`   - Releases: ${releasesCreated}`);
    console.log(`   - Reviews: ${reviewsCreated}`);

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importMovies();
