# Push commits in small batches to avoid Git overload
# Pushes 10-15 commits at a time

Write-Host "Starting Batch Push..." -ForegroundColor Cyan

# Get the number of commits ahead
$ahead = git rev-list --count origin/master..HEAD
Write-Host "Total commits to push: $ahead" -ForegroundColor Yellow

if ($ahead -eq 0) {
    Write-Host "No commits to push!" -ForegroundColor Green
    exit 0
}

$BATCH_SIZE = 12  # Push 12 commits at a time
$totalBatches = [Math]::Ceiling($ahead / $BATCH_SIZE)

Write-Host "Will push in $totalBatches batches of $BATCH_SIZE commits each" -ForegroundColor Cyan

for ($i = 0; $i -lt $totalBatches; $i++) {
    $batchNum = $i + 1
    $commitsInBatch = [Math]::Min($BATCH_SIZE, $ahead - ($i * $BATCH_SIZE))
    
    Write-Host ""
    Write-Host "Batch $batchNum/$totalBatches - Pushing $commitsInBatch commits" -ForegroundColor Cyan
    
    try {
        # Push current batch
        Write-Host "  Pushing..." -ForegroundColor White
        git push
        
        Write-Host "  Batch $batchNum pushed successfully!" -ForegroundColor Green
        
        # Wait between batches to avoid overload
        if ($i -lt ($totalBatches - 1)) {
            Write-Host "  Waiting 3 seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 3
        }
        
    } catch {
        Write-Host ""
        Write-Host "ERROR in batch ${batchNum}:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host ""
        Write-Host "Retrying in 5 seconds..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Retry once
        try {
            git push
            Write-Host "  Retry successful!" -ForegroundColor Green
        } catch {
            Write-Host "  Retry failed. Stopping." -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host ""
Write-Host "All commits pushed successfully!" -ForegroundColor Green