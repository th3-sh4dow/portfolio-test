# Push commits in batches by temporarily moving HEAD
# This pushes commits in smaller groups to avoid Git overload

Write-Host "Starting Batch Commit Push..." -ForegroundColor Cyan

# Get current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

# Get the number of commits ahead
$ahead = git rev-list --count origin/master..HEAD
Write-Host "Total commits to push: $ahead" -ForegroundColor Yellow

if ($ahead -eq 0) {
    Write-Host "No commits to push!" -ForegroundColor Green
    exit 0
}

# Get all commit hashes from oldest to newest
$commits = git rev-list --reverse origin/master..HEAD
$commitArray = $commits -split "`n" | Where-Object { $_.Trim() }

$BATCH_SIZE = 15  # Push 15 commits at a time
$totalBatches = [Math]::Ceiling($commitArray.Count / $BATCH_SIZE)

Write-Host "Will push $($commitArray.Count) commits in $totalBatches batches of $BATCH_SIZE commits each" -ForegroundColor Cyan

# Store original HEAD
$originalHead = git rev-parse HEAD

try {
    for ($i = 0; $i -lt $totalBatches; $i++) {
        $start = $i * $BATCH_SIZE
        $end = [Math]::Min($start + $BATCH_SIZE - 1, $commitArray.Count - 1)
        $batchNum = $i + 1
        $commitsInBatch = $end - $start + 1
        
        Write-Host ""
        Write-Host "Batch $batchNum/$totalBatches - Pushing $commitsInBatch commits" -ForegroundColor Cyan
        
        # Move HEAD to the end of this batch
        $targetCommit = $commitArray[$end]
        git reset --hard $targetCommit
        
        try {
            Write-Host "  Pushing commits up to: $($targetCommit.Substring(0,8))" -ForegroundColor White
            git push origin $currentBranch
            
            Write-Host "  Batch $batchNum pushed successfully!" -ForegroundColor Green
            
            # Wait between batches
            if ($i -lt ($totalBatches - 1)) {
                Write-Host "  Waiting 3 seconds..." -ForegroundColor Gray
                Start-Sleep -Seconds 3
            }
            
        } catch {
            Write-Host "  ERROR in batch ${batchNum}: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            
            # Retry once
            try {
                git push origin $currentBranch
                Write-Host "  Retry successful!" -ForegroundColor Green
            } catch {
                Write-Host "  Retry failed. Restoring original state." -ForegroundColor Red
                git reset --hard $originalHead
                exit 1
            }
        }
    }
    
    # Ensure we're back at the original HEAD
    git reset --hard $originalHead
    
    Write-Host ""
    Write-Host "All commits pushed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "CRITICAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Restoring original state..." -ForegroundColor Yellow
    git reset --hard $originalHead
    exit 1
}