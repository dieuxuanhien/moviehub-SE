const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const totalMovies = await prisma.movie.count();
  const moviesWithRelease = await prisma.movie.count({
    where: { movieReleases: { some: {} } }
  });
  const releases = await prisma.movieRelease.findMany({
    take: 10,
    orderBy: { startDate: 'desc' },
    include: { movie: { select: { title: true } } }
  });
  
  console.log('=== Release Statistics ===');
  console.log('Total Movies:', totalMovies);
  console.log('Movies with Releases:', moviesWithRelease);
  console.log('\nLast 10 Releases:');
  releases.forEach(r => {
    console.log(`- ${r.movie.title}: ${r.startDate.toISOString().split('T')[0]} to ${r.endDate ? r.endDate.toISOString().split('T')[0] : 'Open-ended'}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
