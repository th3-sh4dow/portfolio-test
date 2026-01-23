# Push 325 commits in exactly 10-12 batches
# Each batch will have around 27-32 commits

Write-Host "Starting Push in 10-12 Batches..." -ForegroundColor Cyan

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

# Calculate batch size for 10-12 batches
$TARGET_BATCHES = 12
$COMMITS_PER_BATCH = [Math]::Ceiling($ahead / $TARGET_BATCHES)

Write-Host "Will push $ahead commits in $TARGET_BATCHES batches" -ForegroundColor Cyan
Write-Host "Approximately $COMMITS_PER_BATCH commits per batch" -ForegroundColor Cyan

# Get all commit hashes from oldest to newest
$commits = git rev-list --reverse origin/master..HEAD
$commitArray = $commits -split "`n" | Where-Object { $_.Trim() }

# Store original HEAD
$originalHead = git rev-parse HEAD

try {
    for ($i = 0; $i -lt $TARGET_BATCHES; $i++) {
        $start = $i * $COMMITS_PER_BATCH
        $end = [Math]::Min($start + $COMMITS_PER_BATCH - 1, $commitArray.Count - 1)
        $batchNum = $i + 1
        $commitsInBatch = $end - $start + 1
        
        # Skip if no commits left
        if ($start -ge $commitArray.Count) {
            break
        }
        
        Write-Host ""
        Write-Host "Batch $batchNum/$TARGET_BATCHES - Pushing $commitsInBatch commits" -ForegroundColor Cyan
        
        # Move HEAD to the end of this batch
        $targetCommit = $commitArray[$end]
        git reset --hard $targetCommit
        
        try {
            Write-Host "  Pushing commits up to: $($targetCommit.Substring(0,8))" -ForegroundColor White
            git push origin $currentBranch --force-with-lease
            
            Write-Host "  Batch $batchNum pushed successfully!" -ForegroundColor Green
            
            # Wait between batches to avoid overload
            if ($i -lt ($TARGET_BATCHES - 1) -and $end -lt ($commitArray.Count - 1)) {
                Write-Host "  Waiting 5 seconds..." -ForegroundColor Gray
                Start-Sleep -Seconds 5
            }
            
        } catch {
            Write-Host "  ERROR in batch ${batchNum}: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Retrying in 10 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10
            
            # Retry once
            try {
                git push origin $currentBranch --force-with-lease
                Write-Host "  Retry successful!" -ForegroundColor Green
            } catch {
                Write-Host "  Retry failed. Restoring original state." -ForegroundColor Red
                git reset --hard $originalHead
                exit 1
            }
        }
    }
    
    # Ensure we're back at the original HEAD and final push
    git reset --hard $originalHead
    Write-Host ""
    Write-Host "Final push to ensure all commits are synced..." -ForegroundColor Cyan
    git push origin $currentBranch
    
    Write-Host ""
    Write-Host "All commits pushed successfully in batches!" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "CRITICAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Restoring original state..." -ForegroundColor Yellow
    git reset --hard $originalHead
    exit 1
}