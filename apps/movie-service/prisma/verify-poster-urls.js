/**
 * Verify existing poster URLs and fix broken ones
 * Checks all non-placeholder URLs to ensure they return 200 OK
 */

const { PrismaClient } = require('../generated/prisma');
const https = require('https');

const prisma = new PrismaClient();

// Validate URL returns 200 OK
// Wikipedia blocks HEAD requests, so we use GET with User-Agent
async function validateUrl(url) {
  return new Promise((resolve) => {
    try {
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
        // Consume response data to free up memory
        res.resume();
        resolve(res.statusCode >= 200 && res.statusCode < 400);
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
  console.log('🔍 Verifying existing poster URLs...\n');

  // Get all movies with real poster URLs
  const movies = await prisma.movie.findMany({
    where: {
      posterUrl: {
        not: { contains: 'placeholder' }
      }
    },
    select: { id: true, title: true, posterUrl: true },
    orderBy: { title: 'asc' },
  });

  console.log(`Found ${movies.length} movies with poster URLs to verify\n`);

  let valid = 0;
  let invalid = 0;
  const brokenUrls = [];

  for (const movie of movies) {
    const isValid = await validateUrl(movie.posterUrl);
    
    if (isValid) {
      console.log(`✅ ${movie.title}`);
      valid++;
    } else {
      console.log(`❌ ${movie.title} → ${movie.posterUrl}`);
      invalid++;
      brokenUrls.push({ title: movie.title, url: movie.posterUrl });
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 50));
  }

  console.log(`\n🎉 Verification Complete!`);
  console.log(`✅ Valid: ${valid}`);
  console.log(`❌ Invalid: ${invalid}`);
  
  if (brokenUrls.length > 0) {
    console.log(`\n⚠️  Broken URLs:`);
    brokenUrls.forEach(b => console.log(`  - ${b.title}: ${b.url}`));
  }
}

main()
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());
