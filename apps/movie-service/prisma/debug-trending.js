// Debug script to check why rated movies aren't showing in trending
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function debugTrendingMovies() {
  try {
    // 1. Count movies with ratings
    const moviesWithRatings = await prisma.$queryRaw`
      SELECT m.id, m.title, 
        (SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id) as avg_rating,
        (SELECT COUNT(*) FROM reviews r WHERE r.movie_id = m.id) as review_count
      FROM movies m
      WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.movie_id = m.id)
      ORDER BY avg_rating DESC
      LIMIT 10
    `;
    console.log('\n📊 Top 10 Movies with Ratings:');
    console.table(moviesWithRatings);

    // 2. Count movies with releases
    const moviesWithReleases = await prisma.$queryRaw`
      SELECT m.id, m.title, mr.start_date, mr.end_date
      FROM movies m
      INNER JOIN movie_releases mr ON m.id = mr.movie_id
      WHERE (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL))
        OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days'))
      LIMIT 10
    `;
    console.log('\n🎬 Top 10 Movies with Valid Releases:');
    console.table(moviesWithReleases);

    // 3. Movies with ratings BUT NO releases (the missing ones!)
    const missingReleases = await prisma.$queryRaw`
      SELECT m.id, m.title,
        (SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id) as avg_rating
      FROM movies m
      WHERE EXISTS (SELECT 1 FROM reviews r WHERE r.movie_id = m.id)
      AND NOT EXISTS (
        SELECT 1 FROM movie_releases mr 
        WHERE mr.movie_id = m.id 
        AND (
          (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL))
          OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days'))
        )
      )
      ORDER BY avg_rating DESC
      LIMIT 10
    `;
    console.log('\n⚠️ Movies WITH Ratings but WITHOUT Valid Releases:');
    console.table(missingReleases);

    // 4. Actual trending query result
    const trending = await prisma.$queryRaw`
      SELECT 
        m.id,
        m.title,
        COALESCE((SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id), 3.0) as "avgRating",
        m.release_date as "releaseDate"
      FROM movies m
      WHERE EXISTS (
        SELECT 1 FROM movie_releases mr 
        WHERE mr.movie_id = m.id 
        AND (
          (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL))
          OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days'))
        )
      )
      ORDER BY (
        0.5 * (COALESCE((SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id), 3.0) / 5.0) +
        0.5 * GREATEST(0, 1 - (EXTRACT(EPOCH FROM (CURRENT_DATE - m.release_date)) / (365 * 24 * 60 * 60)))
      ) DESC
      LIMIT 10
    `;
    console.log('\n🔥 Actual Trending Query Result:');
    console.table(trending);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTrendingMovies();
