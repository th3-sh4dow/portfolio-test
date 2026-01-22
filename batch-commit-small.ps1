# Small Batch Git Commit Script
# Commits files in batches of 10-12 to avoid overload

Write-Host "Starting Small Batch Git Commits..." -ForegroundColor Cyan

# Get all untracked/modified files
$status = git status --porcelain
$files = $status -split "`n" | Where-Object { $_.Trim() } | ForEach-Object { $_.Substring(3).Trim() }

$totalFiles = $files.Count
Write-Host "Total files to commit: $totalFiles" -ForegroundColor Yellow

if ($totalFiles -eq 0) {
    Write-Host "No files to commit!" -ForegroundColor Green
    exit 0
}

$BATCH_SIZE = 10
$totalBatches = [Math]::Ceiling($totalFiles / $BATCH_SIZE)

Write-Host "Will create $totalBatches batches of $BATCH_SIZE files each" -ForegroundColor Cyan

for ($i = 0; $i -lt $totalBatches; $i++) {
    $start = $i * $BATCH_SIZE
    $end = [Math]::Min($start + $BATCH_SIZE, $totalFiles)
    $batch = $files[$start..($end-1)]
    $batchNum = $i + 1
    $batchCount = $batch.Count

    Write-Host ""
    Write-Host "Batch $batchNum/$totalBatches - $batchCount files" -ForegroundColor Cyan
    Write-Host "Files: $($batch -join ', ')" -ForegroundColor Gray

    try {
        # Add files in this batch
        foreach ($file in $batch) {
            git add $file 2>$null
        }

        # Commit
        $commitMessage = "Batch $batchNum/${totalBatches}: Added $batchCount files"
        Write-Host "Committing: $commitMessage" -ForegroundColor White
        git commit -m $commitMessage

        Write-Host "Batch $batchNum completed!" -ForegroundColor Green

        # Small delay between batches
        if ($i -lt ($totalBatches - 1)) {
            Write-Host "Waiting 1 second..." -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }

    } catch {
        Write-Host "ERROR in batch ${batchNum}: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "All batches committed successfully!" -ForegroundColor Green