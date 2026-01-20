const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const real = await prisma.movie.count({
    where: { posterUrl: { not: { contains: 'placeholder' } } }
  });
  const placeholder = await prisma.movie.count({
    where: { posterUrl: { contains: 'placeholder' } }
  });
  
  console.log('=== Poster URL Statistics ===');
  console.log('Real URLs:', real);
  console.log('Placeholder URLs:', placeholder);
  console.log('Total:', real + placeholder);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
