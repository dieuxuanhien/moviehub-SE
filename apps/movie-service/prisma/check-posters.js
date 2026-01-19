const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const movies = await prisma.movie.findMany({
    where: { posterUrl: { contains: 'placeholder' } },
    select: { title: true },
    orderBy: { title: 'asc' },
    take: 100
  });
  
  console.log('Movies still with placeholder URLs:');
  movies.forEach(m => console.log(`"${m.title}"`));
  console.log(`\nTotal: ${movies.length}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
