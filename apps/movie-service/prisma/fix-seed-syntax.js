/**
 * Fix syntax errors in seed batch files.
 * The posterUrl line is missing closing parenthesis and trailerUrl needs getSeedTrailerUrl.
 */

const fs = require('fs');
const path = require('path');

const seedFiles = [
  'seed-batch3.ts',
  'seed-batch4.ts', 
  'seed-batch5.ts',
  'seed-batch6.ts',
  'seed-extra.ts',
  'seed-romance-horror.ts'
];

const prismaDir = __dirname;

seedFiles.forEach(file => {
  const filePath = path.join(prismaDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix posterUrl line - add missing closing parenthesis
  // Pattern: posterUrl: getSeedPosterUrl(... ${...}`,
  // Should be: posterUrl: getSeedPosterUrl(... ${...})}`),
  content = content.replace(
    /posterUrl: getSeedPosterUrl\((movieData|movie)\.title, `https:\/\/via\.placeholder\.com\/500x750\?text=\$\{encodeURIComponent\((movieData|movie)\.title\.slice\(0, 20\)\}`,/g,
    'posterUrl: getSeedPosterUrl($1.title, `https://via.placeholder.com/500x750?text=${encodeURIComponent($2.title.slice(0, 20))}`),');

  // Fix trailerUrl line - use getSeedTrailerUrl
  content = content.replace(
    /trailerUrl: 'https:\/\/www\.youtube\.com\/watch\?v=dQw4w9WgXcQ',/g,
    "trailerUrl: getSeedTrailerUrl(movie.title, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),"
  );

  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed: ${file}`);
});

console.log('\n🎉 All seed files fixed!');
