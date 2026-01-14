# 📦 Git Batch Push - 300 Files at a Time

## Problem
2309 files ko ek saath push karne se error aa sakta hai. Solution: 300-300 files ke batches mein push karo.

## Solution - 2 Methods

### Method 1: PowerShell Script (Recommended for Windows)

```powershell
.\git-push-batches.ps1
```

### Method 2: Node.js Script

```bash
node git-push-batches.js
```

## What It Does

1. ✅ Checks all untracked/modified files
2. ✅ Divides them into batches of 300 files
3. ✅ For each batch:
   - Adds files to git
   - Commits with message "Batch X/Y: Added 300 files"
   - Pushes to remote
   - Waits 2 seconds
4. ✅ Continues until all files are pushed

## Example Output

```
🚀 Starting Git Push in Batches...

📁 Total files to commit: 2309

📦 Will create 8 batches of 300 files each

📦 Batch 1/8 (300 files)
──────────────────────────────────────────────────
  ➕ Adding files...
  💾 Committing: "Batch 1/8: Added 300 files"
  ⬆️  Pushing to remote...
  ✅ Batch 1 completed!
  ⏳ Waiting 2 seconds...

📦 Batch 2/8 (300 files)
──────────────────────────────────────────────────
  ➕ Adding files...
  💾 Committing: "Batch 2/8: Added 300 files"
  ⬆️  Pushing to remote...
  ✅ Batch 2 completed!
  ⏳ Waiting 2 seconds...

... (continues for all batches)

==================================================
🎉 All batches pushed successfully!
==================================================
```

## Batch Breakdown

For 2309 files:
- Batch 1: 300 files
- Batch 2: 300 files
- Batch 3: 300 files
- Batch 4: 300 files
- Batch 5: 300 files
- Batch 6: 300 files
- Batch 7: 300 files
- Batch 8: 309 files (remaining)

**Total**: 8 batches

## Time Estimate

- Each batch: ~10-30 seconds (depends on file size and internet speed)
- Delay between batches: 2 seconds
- **Total time**: ~3-5 minutes for 2309 files

## Safety Features

✅ **Error Handling**: Stops if any batch fails
✅ **Resume Support**: Can run again to continue from where it stopped
✅ **Progress Display**: Shows current batch and progress
✅ **File Skipping**: Skips problematic files automatically

## If Script Fails

1. Check error message
2. Fix the issue (if any)
3. Run script again - it will continue from uncommitted files

## Manual Alternative

If scripts don't work, you can do it manually:

```bash
# Check status
git status

# Add first 300 files manually
git add file1 file2 ... file300
git commit -m "Batch 1: Added 300 files"
git push

# Repeat for next batch
git add file301 file302 ... file600
git commit -m "Batch 2: Added 300 files"
git push

# ... continue
```

## Customization

### Change Batch Size

In PowerShell script:
```powershell
$BATCH_SIZE = 300  # Change to 200, 500, etc.
```

In Node.js script:
```javascript
const BATCH_SIZE = 300;  // Change to 200, 500, etc.
```

### Change Delay

In PowerShell script:
```powershell
Start-Sleep -Seconds 2  # Change to 5, 10, etc.
```

In Node.js script:
```javascript
execSync('timeout /t 2 /nobreak');  // Change 2 to 5, 10, etc.
```

## Prerequisites

### For PowerShell Script:
- Git installed
- PowerShell (comes with Windows)

### For Node.js Script:
- Git installed
- Node.js installed

## Troubleshooting

### "git push" fails
- Check internet connection
- Check git credentials
- Check remote repository access

### "Permission denied"
- Run PowerShell as Administrator
- Or use: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

### Files not found
- Make sure you're in the correct directory
- Run `git status` to verify files exist

## Best Practices

1. ✅ Run script from project root directory
2. ✅ Ensure git remote is configured
3. ✅ Test with small batch first (change BATCH_SIZE to 10)
4. ✅ Keep terminal open during process
5. ✅ Don't interrupt the process

## Quick Start

```powershell
# 1. Open PowerShell in project directory
cd D:\Learning\MyOwnProject\test\portfolio

# 2. Run the script
.\git-push-batches.ps1

# 3. Wait for completion
# ☕ Grab a coffee, it will take 3-5 minutes
```

## Success!

When you see:
```
🎉 All batches pushed successfully!
```

All 2309 files are now on GitHub! 🚀✨
