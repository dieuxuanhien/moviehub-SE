import { PrismaClient } from '../generated/prisma/index';
import https from 'https';

const prisma = new PrismaClient();

async function validateUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!url || url.includes('placeholder')) {
        resolve(false);
        return;
      }

      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };
      
      const req = https.request(options, (res) => {
        res.resume();
        resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 400);
      });
      
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function main() {
  console.log('🔍 Starting poster URL verification...\n');

  const movies = await prisma.movie.findMany({
    select: { id: true, title: true, posterUrl: true },
    orderBy: { title: 'asc' },
  });

  console.log(`Found ${movies.length} movies in database\n`);

  let valid = 0;
  let invalid = 0;
  let placeholders = 0;
  const invalidList: any[] = [];

  for (const movie of movies) {
    if (movie.posterUrl?.includes('placeholder')) {
      placeholders++;
      continue;
    }

    const isValid = await validateUrl(movie.posterUrl);
    if (isValid) {
      valid++;
      console.log(`✅ ${movie.title}: Valid`);
    } else {
      invalid++;
      console.log(`❌ ${movie.title}: Invalid URL - ${movie.posterUrl}`);
      invalidList.push({ title: movie.title, url: movie.posterUrl });
    }
    
    // Tiny delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\n📊 Verification Results:`);
  console.log(`✅ Valid URLs: ${valid}`);
  console.log(`❌ Invalid URLs: ${invalid}`);
  console.log(`🖼️  Placeholders: ${placeholders}`);
  console.log(`📈 Coverage: ${((valid / movies.length) * 100).toFixed(1)}%`);

  if (invalidList.length > 0) {
    console.log('\n⚠️  Invalid URLs found:');
    invalidList.forEach(m => console.log(`- ${m.title}: ${m.url}`));
  }
}

main()
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());
