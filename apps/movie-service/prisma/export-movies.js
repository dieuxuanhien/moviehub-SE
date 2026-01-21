/**
 * Export Movie Data Script
 * ========================
 * Exports all movies from the database into a JSON seed file
 * that can be used to recreate the data.
 * 
 * Usage: 
 *   cd apps/movie-service
 *   $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5436/movie_hub_movie"
 *   node prisma/export-movies.js
 * 
 * Output: prisma/seed-data-export.json
 */

const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportMovies() {
  console.log('📦 Exporting movie data from database...\n');

  try {
    // Export genres
    console.log('📁 Fetching genres...');
    const genres = await prisma.genre.findMany({
      orderBy: { name: 'asc' }
    });
    console.log(`   ✅ ${genres.length} genres`);

    // Export movies with all relations
    console.log('🎬 Fetching movies with relations...');
    const movies = await prisma.movie.findMany({
      include: {
        movieGenres: {
          include: {
            genre: true
          }
        }
      },
      orderBy: { title: 'asc' }
    });
    console.log(`   ✅ ${movies.length} movies`);

    // Export movie releases
    console.log('📅 Fetching movie releases...');
    const movieReleases = await prisma.movieRelease.findMany({
      orderBy: { movieId: 'asc' }
    });
    console.log(`   ✅ ${movieReleases.length} movie releases`);

    // Export reviews
    console.log('⭐ Fetching reviews...');
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`   ✅ ${reviews.length} reviews`);

    // Transform movies to a clean format
    const moviesData = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      originalTitle: movie.originalTitle,
      overview: movie.overview,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      trailerUrl: movie.trailerUrl,
      runtime: movie.runtime,
      releaseDate: movie.releaseDate?.toISOString().split('T')[0],
      ageRating: movie.ageRating,
      originalLanguage: movie.originalLanguage,
      spokenLanguages: movie.spokenLanguages,
      productionCountry: movie.productionCountry,
      languageType: movie.languageType,
      director: movie.director,
      cast: movie.cast,
      genres: movie.movieGenres.map(mg => mg.genre.name)
    }));

    // Create export object
    const exportData = {
      exportedAt: new Date().toISOString(),
      stats: {
        genres: genres.length,
        movies: movies.length,
        movieReleases: movieReleases.length,
        reviews: reviews.length
      },
      genres: genres.map(g => ({
        id: g.id,
        name: g.name,
        slug: g.slug
      })),
      movies: moviesData,
      movieReleases: movieReleases.map(mr => ({
        id: mr.id,
        movieId: mr.movieId,
        releaseType: mr.releaseType,
        startDate: mr.startDate?.toISOString().split('T')[0],
        endDate: mr.endDate?.toISOString().split('T')[0]
      })),
      reviews: reviews.map(r => ({
        id: r.id,
        movieId: r.movieId,
        userId: r.userId,
        rating: r.rating,
        content: r.content
      }))
    };

    // Write to file
    const outputPath = path.join(__dirname, 'seed-data-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf8');

    console.log('\n✅ Export complete!');
    console.log(`📄 File: ${outputPath}`);
    console.log(`📊 Stats:`);
    console.log(`   - Genres: ${genres.length}`);
    console.log(`   - Movies: ${movies.length}`);
    console.log(`   - Releases: ${movieReleases.length}`);
    console.log(`   - Reviews: ${reviews.length}`);

    return exportData;

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

exportMovies();
