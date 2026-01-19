const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const movies = await prisma.movie.findMany({
    where: {
      posterUrl: {
        contains: 'placeholder'
      }
    },
    select: {
      id: true,
      title: true,
      originalTitle: true
    }
  });

  console.log(JSON.stringify(movies, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
