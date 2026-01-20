const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const trailerMappings = {
  // User-provided verified URLs
  'Ringu - Vòng Tròn Định Mệnh': 'https://www.youtube.com/watch?v=AJ2jLZq25J4',
  'Annabelle': 'https://www.youtube.com/watch?v=paFgQNPGlsg',
  'The Nun - Ác Quỷ Ma Sơ': 'https://www.youtube.com/watch?v=QF-oyCwaArU',
  'A Tale of Two Sisters - Câu Chuyện Hai Chị Em': 'https://www.youtube.com/watch?v=w2czQJll67Q',
  'M3GAN - Búp Bê Sát Nhân': 'https://www.youtube.com/watch?v=IYLHdEzsk1s',
  'Insidious - Quỷ Quyệt': 'https://www.youtube.com/watch?v=ZuQuOnYnr3Q',
  'Sinister - Điềm Báo Tử Thần': 'https://www.youtube.com/watch?v=iSaFxAjMgks',
  'Halloween (2018)': 'https://www.youtube.com/watch?v=ek1ePFp-nBI',
  'Jujutsu Kaisen 0': 'https://www.youtube.com/watch?v=UPRqnFnnrr8',
  'Demon Slayer: Mugen Train': 'https://www.youtube.com/watch?v=ATJYac_dORw',
};

async function updateTrailers() {
  console.log('🎬 Updating movie trailer URLs...\n');

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const [title, url] of Object.entries(trailerMappings)) {
    try {
      const movie = await prisma.movie.findFirst({
        where: { title: title }
      });

      if (!movie) {
        console.log(`Skip: ${title} (not found)`);
        skippedCount++;
        continue;
      }

      await prisma.movie.update({
        where: { id: movie.id },
        data: { trailerUrl: url }
      });

      successCount++;
      console.log(`✅ [${successCount}/${Object.keys(trailerMappings).length}] ${title}`);
    } catch (error) {
      failedCount++;
      console.error(`❌ Failed: ${title}`, error.message);
    }
  }

  console.log(`\n🎉 Complete! Updated ${successCount} trailers, ${skippedCount} skipped, ${failedCount} failed.`);
}

updateTrailers()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
