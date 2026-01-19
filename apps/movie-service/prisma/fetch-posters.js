/**
 * Fetch Poster URLs for Movies
 * Uses OMDB API (free with API key) to get poster URLs
 * 
 * Usage: node prisma/fetch-posters.js
 * 
 * Note: For full results, get a free API key from https://www.omdbapi.com/
 */

// Load environment variables from .env file
require('dotenv').config();

const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();


// Free OMDB API key (limited to 1000 requests/day)
// Get your own at https://www.omdbapi.com/apikey.aspx
const OMDB_API_KEY = process.env.OMDB_API_KEY || 'demo'; // 'demo' has very limited usage

// Hardcoded poster URLs for popular movies (fallback)
const POSTER_MAPPING = {
  // Action
  'Avengers: Endgame': 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg',
  'Avengers: Infinity War': 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg',
  'The Dark Knight': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
  'Inception': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
  'Interstellar': 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
  'The Matrix': 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
  'Fight Club': 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
  'Forrest Gump': 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
  'The Shawshank Redemption': 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
  
  // Sci-Fi
  'Dune': 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
  'Dune: Part Two': 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
  'Blade Runner 2049': 'https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_.jpg',
  'Avatar': 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
  'Avatar: The Way of Water': 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg',
  'Terminator': 'https://m.media-amazon.com/images/M/MV5BYTViNzMxZjEtZGEwNy00MDNiLWIzNGQtZDY2MjQ1OWViZjFmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
  'Arrival': 'https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_.jpg',
  
  // Horror
  'Get Out': 'https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg',
  'Us': 'https://m.media-amazon.com/images/M/MV5BZTliNWJhM2YtNDc1MC00YTk1LWE2MGYtZmE4M2Y5ODdlNzQzXkEyXkFqcGdeQXVyMzY0MTE3NzU@._V1_.jpg',
  'Hereditary': 'https://m.media-amazon.com/images/M/MV5BOTU5MDg3OGItZWQ1Ny00ZGVmLTg2YTUtMzBkYzQ1YWIwZjlhXkEyXkFqcGdeQXVyNTAzMTY4MDA@._V1_.jpg',
  'Midsommar': 'https://m.media-amazon.com/images/M/MV5BMzQxNzQzOTQwM15BMl5BanBnXkFtZTgwMDQ2NTcwODM@._V1_.jpg',
  'The Conjuring': 'https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_.jpg',
  'A Quiet Place': 'https://m.media-amazon.com/images/M/MV5BMjI0MDMzNTQ0M15BMl5BanBnXkFtZTgwMTM5NzM3NDM@._V1_.jpg',
  'It': 'https://m.media-amazon.com/images/M/MV5BZDVkZmI0YzAtNzdjYi00ZjhhLWE1ODEtMWMzMWMzNDA0NmQ4XkEyXkFqcGdeQXVyNzYzODM3Mzg@._V1_.jpg',
  'The Shining': 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
  'The Exorcist': 'https://m.media-amazon.com/images/M/MV5BYWFlZGY2NDktY2ZjOS00ZWNkLTg0ZDAtZDY4MTM1ODU4ZjljXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
  'Smile': 'https://m.media-amazon.com/images/M/MV5BZjE2ZWIwMWEtNGFlMy00ZjYzLWEzOWEtYzQ0MDAwZDRhNDJhXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  
  // Animation
  'Inside Out': 'https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_.jpg',
  'Inside Out 2': 'https://m.media-amazon.com/images/M/MV5BMDA5YTc2ODUtOGM5Ny00MTViLWFlMjItYTQwMTliMjM5OGMwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
  'Coco': 'https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIxMzk5NjA@._V1_.jpg',
  'Soul': 'https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTY5LTg1YzUtZTlhZmM1Y2EwNmFmXkEyXkFqcGdeQXVyNjA3OTI0MDc@._V1_.jpg',
  'Toy Story': 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_.jpg',
  'Finding Nemo': 'https://m.media-amazon.com/images/M/MV5BZTAzNWZlNmUtZDEzYi00ZjA5LWIwYjEtZGM1NjEyNWNlNGFlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
  'Spider-Man: Into the Spider-Verse': 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_.jpg',
  'Spider-Man: Across the Spider-Verse': 'https://m.media-amazon.com/images/M/MV5BMzI0NmVkMjEtYmY4MS00ZDMxLTlkZmEtMzU4MDQxYTMzMjU2XkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
  
  // Korean
  'Parasite': 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
  'Train to Busan': 'https://m.media-amazon.com/images/M/MV5BMTkwOTQ4OTg0OV5BMl5BanBnXkFtZTgwMzQyOTM0OTE@._V1_.jpg',
  'Oldboy': 'https://m.media-amazon.com/images/M/MV5BMTI3NTQyMzU5M15BMl5BanBnXkFtZTcwMTM2MjgyMQ@@._V1_.jpg',
  'Squid Game': 'https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg',
  
  // Marvel
  'Black Panther': 'https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg',
  'Spider-Man: No Way Home': 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg',
  'Guardians of the Galaxy': 'https://m.media-amazon.com/images/M/MV5BMTAwMjU5OTgxNjZeQTJeQWpwZ15BbWU4MDUxNDYxODEx._V1_.jpg',
  'Thor: Ragnarok': 'https://m.media-amazon.com/images/M/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_.jpg',
  'Doctor Strange': 'https://m.media-amazon.com/images/M/MV5BNjgwNzAzNjk1Nl5BMl5BanBnXkFtZTgwMzQ2NjI1OTE@._V1_.jpg',
  'Shang-Chi': 'https://m.media-amazon.com/images/M/MV5BNTliYjlkNDQtMjFlNS00NjgzLWFmMWEtYmM2Mzc2Zjg3ZjEyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
  
  // DC
  'The Batman': 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg',
  'Joker': 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg',
  'Wonder Woman': 'https://m.media-amazon.com/images/M/MV5BMTYzODQzYjQtNTczNC00MzZhLTg1ZWYtZDUxYmQ3ZTY4NzA1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
  'Aquaman': 'https://m.media-amazon.com/images/M/MV5BOTk5ODg0OTU5M15BMl5BanBnXkFtZTgwMDQ3MDY3NjM@._V1_.jpg',
  'The Flash': 'https://m.media-amazon.com/images/M/MV5BZWE2ZWE5MDQtMTJlZi00MTVjLTkzNGYtOTU1ZjgxZTMzNDI3XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  
  // Christopher Nolan
  'Oppenheimer': 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
  'Tenet': 'https://m.media-amazon.com/images/M/MV5BYzg0NGM2NjAtNmIxOC00MDJmLWI5ZjgtYjBlNDkyMDUyMTk2XkEyXkFqcGdeQXVyMTA4NjE0NjEy._V1_.jpg',
  'Dunkirk': 'https://m.media-amazon.com/images/M/MV5BN2YyZjQ0NTEtNzU5MS00NGZkLTg0MTEtYzJmMWY3MWRhZjM2XkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_.jpg',
  
  // Romance
  'The Notebook': 'https://m.media-amazon.com/images/M/MV5BMTk3OTM5Njg5M15BMl5BanBnXkFtZTYwMzA0ODI3._V1_.jpg',
  'Titanic': 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg',
  'La La Land': 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg',
  'Pride and Prejudice': 'https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_.jpg',
  'Crazy Rich Asians': 'https://m.media-amazon.com/images/M/MV5BMTYxNDMyOTAxN15BMl5BanBnXkFtZTgwMDg1ODYzNTM@._V1_.jpg',
  
  // More popular movies
  'Deadpool': 'https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
  'Deadpool & Wolverine': 'https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGkzLTgxMmQtYTBjNjlkMWZjMjZlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  'John Wick': 'https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg',
  'Top Gun: Maverick': 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg',
  'Everything Everywhere All at Once': 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg',
  'Barbie': 'https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
};

async function fetchFromOMDB(title) {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'demo') {
    return null;
  }
  
  try {
    // Clean title for search
    const searchTitle = title
      .replace(/[:\-–]/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' - ')[0] // Remove Vietnamese subtitle
      .trim();
    
    const url = `http://www.omdbapi.com/?t=${encodeURIComponent(searchTitle)}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
      return data.Poster;
    }
  } catch (error) {
    // Silently fail
  }
  return null;
}

async function main() {
  console.log('📸 Fetching poster URLs for movies...\n');

  if (!OMDB_API_KEY || OMDB_API_KEY === 'demo') {
    console.log('⚠️ No OMDB API key provided!');
    console.log('   Get a free key at: https://www.omdbapi.com/apikey.aspx');
    console.log('   Then run: $env:OMDB_API_KEY="your_key"; node prisma/fetch-posters.js\n');
    console.log('📦 Using hardcoded poster mapping only...\n');
  } else {
    console.log(`✅ OMDB API key detected, will fetch from API\n`);
  }

  // Get movies with placeholder posters
  const movies = await prisma.movie.findMany({
    where: {
      posterUrl: { contains: 'placeholder' }
    },
    select: { id: true, title: true, originalTitle: true, posterUrl: true }
  });

  console.log(`📊 Found ${movies.length} movies with placeholder posters\n`);

  let updated = 0;
  let fromMapping = 0;
  let fromAPI = 0;
  let failed = 0;

  for (const movie of movies) {
    let newPosterUrl = null;
    
    // Try hardcoded mapping first
    if (POSTER_MAPPING[movie.title]) {
      newPosterUrl = POSTER_MAPPING[movie.title];
      fromMapping++;
    } else if (POSTER_MAPPING[movie.originalTitle]) {
      newPosterUrl = POSTER_MAPPING[movie.originalTitle];
      fromMapping++;
    } else {
      // Try partial match
      for (const [key, url] of Object.entries(POSTER_MAPPING)) {
        if (movie.title.includes(key) || movie.originalTitle.includes(key) ||
            key.includes(movie.originalTitle)) {
          newPosterUrl = url;
          fromMapping++;
          break;
        }
      }
    }

    // If not in mapping, try OMDB API
    if (!newPosterUrl) {
      newPosterUrl = await fetchFromOMDB(movie.originalTitle);
      if (newPosterUrl) fromAPI++;
      
      // Add delay to respect API rate limits
      await new Promise(r => setTimeout(r, 100));
    }

    if (newPosterUrl) {
      await prisma.movie.update({
        where: { id: movie.id },
        data: { posterUrl: newPosterUrl }
      });
      updated++;
      const source = fromAPI === updated - fromMapping ? 'API' : 'MAP';
      console.log(`✅ [${updated}/${movies.length}] [${source}] ${movie.title}`);
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`✅ Updated: ${updated} movies`);
  console.log(`   📦 From mapping: ${fromMapping}`);
  console.log(`   🌐 From OMDB API: ${fromAPI}`);
  console.log(`❌ No poster found: ${failed} movies`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
