/**
 * Add Movie Releases for All Movies
 * 
 * This script creates MovieRelease entries so movies appear on homepage:
 * - 50% as "Now Showing" (startDate in past, endDate in future)
 * - 50% as "Upcoming" (startDate in future)
 * 
 * Usage: node prisma/add-movie-releases.js
 */

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('🎬 Adding MovieRelease entries for all movies...\n');

  // Delete existing releases
  await prisma.movieRelease.deleteMany();
  console.log('✅ Cleared existing movie releases\n');

  const movies = await prisma.movie.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  });

  console.log(`📊 Found ${movies.length} movies\n`);

  const today = new Date();
  const halfPoint = Math.floor(movies.length / 2);
  
  let nowShowingCount = 0;
  let upcomingCount = 0;
  const releases = [];

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    let startDate, endDate, note;

    if (i < halfPoint) {
      // First half: Now Showing (started recently, ends in future)
      const daysAgo = Math.floor((i / halfPoint) * 30) + 1; // Started 1-30 days ago
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - daysAgo);
      
      endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 30); // Ends in 30 days
      
      note = 'Now Showing';
      nowShowingCount++;
    } else {
      // Second half: Upcoming (starts in future)
      const daysFromNow = Math.floor(((i - halfPoint) / (movies.length - halfPoint)) * 60) + 1;
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + daysFromNow);
      
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30); // Runs for 30 days
      
      note = 'Upcoming';
      upcomingCount++;
    }

    releases.push({
      movieId: movie.id,
      startDate,
      endDate,
      note
    });
  }

  // Batch insert releases
  const batchSize = 100;
  for (let i = 0; i < releases.length; i += batchSize) {
    const batch = releases.slice(i, i + batchSize);
    await prisma.movieRelease.createMany({ data: batch });
    console.log(`📅 Created ${Math.min(i + batchSize, releases.length)}/${releases.length} releases...`);
  }

  console.log(`\n✅ Done!`);
  console.log(`🎬 Now Showing: ${nowShowingCount} movies`);
  console.log(`🔜 Upcoming: ${upcomingCount} movies`);
  console.log(`\n📊 Total: ${movies.length} movies with releases!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
