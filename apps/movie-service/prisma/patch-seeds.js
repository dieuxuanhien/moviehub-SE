const fs = require('fs');
const path = require('path');

const seedFiles = [
  'seed.ts',
  'seed-batch1.ts',
  'seed-batch2.ts',
  'seed-batch3.ts',
  'seed-batch4.ts',
  'seed-batch5.ts',
  'seed-batch6.ts',
  'seed-200.ts',
  'seed-extra.ts',
  'seed-romance-horror.ts'
];

const prismaDir = __dirname;

seedFiles.forEach(file => {
  const filePath = path.join(prismaDir, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add import if not exists
  if (!content.includes('seed-helper')) {
    content = `import { getSeedPosterUrl, getSeedReleaseData } from './seed-helper';\n` + content;
  }

  // 2. Patch posterUrl
  // Regular expression to match various placeholder formats, stopping at the end of the template literal
  content = content.replace(
    /posterUrl:\s*[`"']https:\/\/via\.placeholder\.com\/.*?[`"']/g,
    (match) => {
      const urlMatch = match.match(/posterUrl:\s*(.*)/);
      if (urlMatch) {
         return `posterUrl: getSeedPosterUrl(movieData.title, ${urlMatch[1]})`;
      }
      return match;
    }
  );

  // 3. Patch release logic
  // This is trickier because it varies.
  // In batch files:
  /*
      await prisma.movieRelease.create({
        data: {
          id: releaseId,
          movieId: movie.id,
          startDate: new Date('2025-12-01'),
          endDate: new Date('2026-03-01'),
          note: 'Lịch chiếu Tết 2026',
        },
      });
  */
  // We want to replace it with a loop or use getSeedReleaseData
  
  const releaseRegex = /await prisma\.movieRelease\.create\(\{\s*data: \{[\s\S]*?movieId: movie\.id,[\s\S]*?\},\s*\}\);/g;
  
  content = content.replace(releaseRegex, (match) => {
     return `const releases = getSeedReleaseData(movieData.title, successCount, new Date(movieData.releaseDate));
      for (const rel of releases) {
        await prisma.movieRelease.create({
          data: {
            movieId: movie.id,
            startDate: new Date(rel.startDate),
            endDate: rel.endDate ? new Date(rel.endDate) : null,
            note: rel.note,
          },
        });
      }`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`✅ Patched ${file}`);
});
