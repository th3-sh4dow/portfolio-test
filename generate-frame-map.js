const fs = require('fs');
const path = require('path');

// Read all files from the hero-intro directory
const heroIntroPath = path.join(__dirname, 'public', 'hero-intro');
const files = fs.readdirSync(heroIntroPath)
  .filter(file => file.endsWith('.jpeg'))
  .sort((a, b) => {
    const numA = parseInt(a.split('_')[0]);
    const numB = parseInt(b.split('_')[0]);
    return numA - numB;
  });

console.log(`Found ${files.length} frames`);
console.log('First 5 frames:', files.slice(0, 5));
console.log('Last 5 frames:', files.slice(-5));

// Generate the frame map as a JSON file
const frameMap = files.map((filename, index) => ({
  index,
  filename
}));

fs.writeFileSync(
  path.join(__dirname, 'public', 'frame-map.json'),
  JSON.stringify(frameMap, null, 2)
);

console.log('✅ Frame map generated at public/frame-map.json');
