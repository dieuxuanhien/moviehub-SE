const { PrismaClient } = require('../generated/prisma');
const https = require('https');
const prisma = new PrismaClient();

// YouTube Search via Invidious (public YouTube frontend API - no API key needed)
function searchYouTube(query) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query + ' official trailer');
    // Using Invidious API - a public YouTube frontend
    const url = `https://inv.nadeko.net/api/v1/search?q=${searchQuery}&type=video`;
    
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            // Find the first result that looks like a trailer
            const trailer = results.find(v => 
              v.title && (
                v.title.toLowerCase().includes('trailer') ||
                v.title.toLowerCase().includes('teaser')
              )
            ) || results[0];
            
            if (trailer && trailer.videoId) {
              resolve({
                videoId: trailer.videoId,
                title: trailer.title,
                url: `https://www.youtube.com/watch?v=${trailer.videoId}`
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          // Try backup instance
          resolve(null);
        }
      });
    });
    
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

// Backup: Use another Invidious instance
function searchYouTubeBackup(query) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query + ' official trailer');
    const url = `https://invidious.nerdvpn.de/api/v1/search?q=${searchQuery}&type=video`;
    
    const req = https.get(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            const trailer = results.find(v => 
              v.title && v.title.toLowerCase().includes('trailer')
            ) || results[0];
            
            if (trailer && trailer.videoId) {
              resolve({
                videoId: trailer.videoId,
                title: trailer.title,
                url: `https://www.youtube.com/watch?v=${trailer.videoId}`
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
    
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function fetchTrailers() {
  console.log('🎬 Fetching movie trailers from YouTube (via Invidious)...\n');

  const movies = await prisma.movie.findMany({
    where: {
      trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Placeholder
    },
    select: { id: true, title: true, originalTitle: true },
    take: 50 // Process in batches to avoid rate limiting
  });

  console.log(`Found ${movies.length} movies with placeholder trailers.\n`);

  let successCount = 0;
  let failedCount = 0;
  const trailerMapping = {};

  for (const movie of movies) {
    try {
      // Search using original title (usually English)
      let result = await searchYouTube(movie.originalTitle);
      
      // Fallback to backup instance
      if (!result) {
        result = await searchYouTubeBackup(movie.originalTitle);
      }
      
      // Fallback to Vietnamese title
      if (!result && movie.title !== movie.originalTitle) {
        result = await searchYouTube(movie.title);
      }

      if (result) {
        trailerMapping[movie.title] = result.url;
        successCount++;
        console.log(`✅ ${movie.title}`);
        console.log(`   → ${result.title}`);
        console.log(`   → ${result.url}`);
        
        // Update in DB
        await prisma.movie.update({
          where: { id: movie.id },
          data: { trailerUrl: result.url }
        });
      } else {
        console.log(`❌ ${movie.title}: No trailer found`);
        failedCount++;
      }

      // Rate limiting
      await new Promise(r => setTimeout(r, 500));
      
    } catch (error) {
      console.error(`❌ ${movie.title}: ${error.message}`);
      failedCount++;
    }
  }

  console.log(`\n🎉 Complete! Found ${successCount} trailers, ${failedCount} failed.`);
}

fetchTrailers()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
