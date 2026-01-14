const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting Git Push in Batches...\n');

// Get all untracked/modified files
const statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
const files = statusOutput
  .split('\n')
  .filter(line => line.trim())
  .map(line => line.substring(3).trim());

console.log(`📁 Total files to commit: ${files.length}\n`);

if (files.length === 0) {
  console.log('✅ No files to commit!');
  process.exit(0);
}

const BATCH_SIZE = 300;
const totalBatches = Math.ceil(files.length / BATCH_SIZE);

console.log(`📦 Will create ${totalBatches} batches of ${BATCH_SIZE} files each\n`);

for (let i = 0; i < totalBatches; i++) {
  const start = i * BATCH_SIZE;
  const end = Math.min(start + BATCH_SIZE, files.length);
  const batch = files.slice(start, end);
  const batchNum = i + 1;

  console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} files)`);
  console.log('─'.repeat(50));

  try {
    // Add files in this batch
    console.log('  ➕ Adding files...');
    batch.forEach(file => {
      try {
        execSync(`git add "${file}"`, { stdio: 'ignore' });
      } catch (err) {
        console.log(`  ⚠️  Skipped: ${file}`);
      }
    });

    // Commit
    const commitMessage = `Batch ${batchNum}/${totalBatches}: Added ${batch.length} files`;
    console.log(`  💾 Committing: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'ignore' });

    // Push
    console.log('  ⬆️  Pushing to remote...');
    execSync('git push', { stdio: 'inherit' });

    console.log(`  ✅ Batch ${batchNum} completed!`);

    // Small delay between batches
    if (i < totalBatches - 1) {
      console.log('  ⏳ Waiting 2 seconds...');
      execSync('timeout /t 2 /nobreak', { stdio: 'ignore' });
    }

  } catch (error) {
    console.error(`\n❌ Error in batch ${batchNum}:`);
    console.error(error.message);
    console.log('\n⚠️  Stopping process. You can run the script again to continue.');
    process.exit(1);
  }
}

console.log('\n' + '='.repeat(50));
console.log('🎉 All batches pushed successfully!');
console.log('='.repeat(50));
