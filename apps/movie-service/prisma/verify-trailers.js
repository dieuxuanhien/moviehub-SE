const { PrismaClient } = require('../generated/prisma');
const https = require('https');
const prisma = new PrismaClient();

// Check if a YouTube URL is valid using oEmbed API
function checkYouTubeUrl(url) {
  return new Promise((resolve) => {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    
    https.get(oembedUrl, (res) => {
      if (res.statusCode === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve({ valid: true, title: json.title });
          } catch {
            resolve({ valid: false, error: 'Parse error' });
          }
        });
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        resolve({ valid: false, error: 'Embedding disabled or private' });
      } else if (res.statusCode === 404) {
        resolve({ valid: false, error: 'Video not found' });
      } else {
        resolve({ valid: false, error: `HTTP ${res.statusCode}` });
      }
    }).on('error', (err) => {
      resolve({ valid: false, error: err.message });
    });
  });
}

async function verifyTrailers() {
  console.log('🎬 Verifying movie trailer URLs...\n');

  const movies = await prisma.movie.findMany({
    select: { id: true, title: true, trailerUrl: true }
  });

  const placeholderUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  let validCount = 0;
  let invalidCount = 0;
  let placeholderCount = 0;
  const invalidMovies = [];

  for (const movie of movies) {
    if (movie.trailerUrl === placeholderUrl) {
      placeholderCount++;
      continue;
    }

    const result = await checkYouTubeUrl(movie.trailerUrl);
    
    if (result.valid) {
      validCount++;
      console.log(`✅ ${movie.title}: ${result.title}`);
    } else {
      invalidCount++;
      invalidMovies.push({ title: movie.title, url: movie.trailerUrl, error: result.error });
      console.log(`❌ ${movie.title}: ${result.error}`);
    }
  }

  console.log('\n=== Trailer URL Statistics ===');
  console.log(`Valid Trailers: ${validCount}`);
  console.log(`Invalid Trailers: ${invalidCount}`);
  console.log(`Placeholder (Rickroll): ${placeholderCount}`);
  console.log(`Total: ${movies.length}`);

  if (invalidMovies.length > 0) {
    console.log('\n=== Invalid Trailer URLs ===');
    invalidMovies.forEach(m => console.log(`- ${m.title}: ${m.error} (${m.url})`));
  }
}

verifyTrailers()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
