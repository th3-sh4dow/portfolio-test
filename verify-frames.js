const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying frame sequence...\n');

const heroIntroPath = path.join(__dirname, 'public', 'hero-intro');
const files = fs.readdirSync(heroIntroPath)
  .filter(file => file.endsWith('.jpeg'))
  .sort((a, b) => {
    const numA = parseInt(a.split('_')[0]);
    const numB = parseInt(b.split('_')[0]);
    return numA - numB;
  });

console.log(`✅ Total frames found: ${files.length}`);
console.log(`📁 Location: public/hero-intro/\n`);

// Check for gaps
const frameNumbers = files.map(f => parseInt(f.split('_')[0]));
const missing = [];
for (let i = 1; i <= Math.max(...frameNumbers); i++) {
  if (!frameNumbers.includes(i)) {
    missing.push(i);
  }
}

if (missing.length > 0) {
  console.log(`⚠️  Missing frames: ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? '...' : ''}`);
} else {
  console.log('✅ No missing frames - sequence is complete!');
}

// Show frame distribution
const suffixes = {};
files.forEach(f => {
  const suffix = f.split('_')[1].replace('.jpeg', '');
  suffixes[suffix] = (suffixes[suffix] || 0) + 1;
});

console.log('\n📊 Frame suffix distribution:');
Object.entries(suffixes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([suffix, count]) => {
    const percentage = ((count / files.length) * 100).toFixed(1);
    console.log(`   _${suffix}: ${count} frames (${percentage}%)`);
  });

console.log('\n🎬 First 5 frames:');
files.slice(0, 5).forEach(f => console.log(`   ${f}`));

console.log('\n🎬 Last 5 frames:');
files.slice(-5).forEach(f => console.log(`   ${f}`));

console.log('\n✨ Your scroll animation is ready to go!');
console.log('   Run: pnpm dev\n');
