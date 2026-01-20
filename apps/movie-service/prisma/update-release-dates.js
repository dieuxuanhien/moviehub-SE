/**
 * Update All Movies to Now Showing / Upcoming
 * 
 * This script updates all movie release dates to be within 60 days:
 * - 50% become "Now Showing" (released 1-60 days ago)
 * - 50% become "Upcoming" (releasing 1-60 days from now)
 * 
 * Usage: node prisma/update-release-dates.js
 */

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('📅 Updating all movie release dates...\n');

  const movies = await prisma.movie.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' }
  });

  console.log(`📊 Found ${movies.length} movies\n`);

  const today = new Date();
  const halfPoint = Math.floor(movies.length / 2);
  
  let nowShowingCount = 0;
  let upcomingCount = 0;

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    let newDate;

    if (i < halfPoint) {
      // First half: Now Showing (released 1-60 days ago)
      const daysAgo = Math.floor((i / halfPoint) * 60) + 1; // Spread across 1-60 days
      newDate = new Date(today);
      newDate.setDate(newDate.getDate() - daysAgo);
      nowShowingCount++;
    } else {
      // Second half: Upcoming (releasing 1-60 days from now)
      const daysFromNow = Math.floor(((i - halfPoint) / (movies.length - halfPoint)) * 60) + 1;
      newDate = new Date(today);
      newDate.setDate(newDate.getDate() + daysFromNow);
      upcomingCount++;
    }

    await prisma.movie.update({
      where: { id: movie.id },
      data: { releaseDate: newDate }
    });

    const status = i < halfPoint ? '🎬 NOW' : '🔜 SOON';
    const dateStr = newDate.toISOString().split('T')[0];
    
    if (i % 50 === 0 || i === movies.length - 1) {
      console.log(`[${i + 1}/${movies.length}] ${status} ${movie.title} → ${dateStr}`);
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`🎬 Now Showing: ${nowShowingCount} movies`);
  console.log(`🔜 Upcoming: ${upcomingCount} movies`);
  console.log(`\n📊 Total: ${movies.length} movies ready for homepage!`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
