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

  // Fix the broken slice(0), 20))
  content = content.replace(/slice\(0\), 20\)\)/g, 'slice(0, 20)');

  fs.writeFileSync(filePath, content);
  console.log(`✅ Repaired ${file}`);
});
