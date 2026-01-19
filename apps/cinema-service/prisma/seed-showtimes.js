/**
 * Seed Showtimes for All Movies
 * Creates showtimes linking movies from movie-service to cinemas in cinema-service
 * 
 * Usage: node seed-showtimes.js
 */

const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Generate UUID for movie_release_id
function generateReleaseId(movieId, cinemaId) {
  const str = `${movieId}-${cinemaId}-release`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

async function main() {
  console.log('🎬 Starting Showtime Seed...\n');

  // Get all cinemas and their halls
  const cinemas = await prisma.cinemas.findMany({
    include: { halls: true }
  });

  if (cinemas.length === 0) {
    console.log('❌ No cinemas found! Run seed_cinema.js first.');
    return;
  }

  console.log(`📍 Found ${cinemas.length} cinemas`);

  // Get movie IDs from movie-service API
  let movies = [];
  try {
    // Try API first
    const response = await fetch('http://localhost:4000/api/movies?limit=100');
    if (response.ok) {
      const data = await response.json();
      movies = data.data || data.movies || data;
      if (Array.isArray(movies) && movies.length > 0) {
        console.log(`🎬 Found ${movies.length} movies from API`);
      } else {
        throw new Error('No movies in response');
      }
    } else {
      throw new Error('API returned error');
    }
  } catch (error) {
    console.log('⚠️ Could not fetch movies from API:', error.message);
    console.log('📦 Skipping showtime seeding - run after movies are seeded');
    return;
  }

  // Clear existing showtimes
  await prisma.seatReservations.deleteMany();
  await prisma.showtimes.deleteMany();
  console.log('✅ Cleared existing showtimes');

  const formats = ['TWO_D', 'THREE_D', 'IMAX', 'FOUR_DX'];
  const languages = ['vi', 'en'];
  const statuses = ['SCHEDULED', 'SELLING'];
  
  // Generate showtimes for the next 7 days
  const now = new Date();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }

  // Time slots for showtimes (24hr format)
  const timeSlots = [10, 12, 14, 16, 18, 20, 22];

  let createdCount = 0;
  const showtimesData = [];

  // Limit to first 50 movies for reasonable seed size
  const moviesToSeed = movies.slice(0, 50);

  for (const movie of moviesToSeed) {
    // Each movie gets showtimes at 1-2 cinemas
    const selectedCinemas = cinemas.slice(0, Math.min(2, cinemas.length));
    
    for (const cinema of selectedCinemas) {
      if (cinema.halls.length === 0) continue;

      // Pick a random hall
      const hall = cinema.halls[Math.floor(Math.random() * cinema.halls.length)];
      const releaseId = generateReleaseId(movie.id, cinema.id);

      // Generate 2-3 showtimes per day for 3 days
      for (let d = 0; d < 3; d++) {
        const date = dates[d];
        const numShowtimes = Math.floor(Math.random() * 2) + 2;
        
        // Pick random time slots
        const shuffledSlots = [...timeSlots].sort(() => Math.random() - 0.5);
        const selectedSlots = shuffledSlots.slice(0, numShowtimes);

        for (const hour of selectedSlots) {
          const startTime = new Date(date);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(startTime);
          endTime.setMinutes(endTime.getMinutes() + (movie.runtime || 120));

          // Determine format based on hall type
          let format = 'TWO_D';
          if (hall.type === 'IMAX') format = 'IMAX';
          else if (hall.type === 'FOUR_DX') format = 'FOUR_DX';
          else if (Math.random() > 0.7) format = 'THREE_D';

          // Determine day type
          const dayOfWeek = startTime.getDay();
          const dayType = (dayOfWeek === 0 || dayOfWeek === 6) ? 'WEEKEND' : 'WEEKDAY';

          showtimesData.push({
            movie_id: movie.id,
            cinema_id: cinema.id,
            hall_id: hall.id,
            start_time: startTime,
            end_time: endTime,
            format,
            language: languages[Math.floor(Math.random() * languages.length)],
            subtitles: ['vi', 'en'],
            available_seats: hall.capacity,
            total_seats: hall.capacity,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            day_type: dayType,
            movie_release_id: releaseId,
          });
        }
      }
    }
  }

  // Batch insert showtimes
  if (showtimesData.length > 0) {
    // Insert in batches of 100
    const batchSize = 100;
    for (let i = 0; i < showtimesData.length; i += batchSize) {
      const batch = showtimesData.slice(i, i + batchSize);
      await prisma.showtimes.createMany({ data: batch });
      createdCount += batch.length;
      console.log(`📅 Created ${createdCount}/${showtimesData.length} showtimes...`);
    }
  }

  console.log(`\n🎉 Showtime Seed Complete!`);
  console.log(`✅ Created ${createdCount} showtimes for ${moviesToSeed.length} movies`);
  console.log(`📍 Across ${cinemas.length} cinemas`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Showtime seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
