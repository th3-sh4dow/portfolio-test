# Git Push in Batches - PowerShell Script
# Pushes files in batches of 300 to avoid errors

Write-Host "Starting Git Push in Batches..." -ForegroundColor Cyan
Write-Host ""

# Get all untracked/modified files
$status = git status --porcelain
$files = $status -split "`n" | Where-Object { $_.Trim() } | ForEach-Object { $_.Substring(3).Trim() }

$totalFiles = $files.Count
Write-Host "Total files to commit: $totalFiles" -ForegroundColor Yellow
Write-Host ""

if ($totalFiles -eq 0) {
    Write-Host "No files to commit!" -ForegroundColor Green
    exit 0
}

$BATCH_SIZE = 300
$totalBatches = [Math]::Ceiling($totalFiles / $BATCH_SIZE)

Write-Host "Will create $totalBatches batches of $BATCH_SIZE files each" -ForegroundColor Cyan
Write-Host ""

for ($i = 0; $i -lt $totalBatches; $i++) {
    $start = $i * $BATCH_SIZE
    $end = [Math]::Min($start + $BATCH_SIZE, $totalFiles)
    $batch = $files[$start..($end-1)]
    $batchNum = $i + 1
    $batchCount = $batch.Count

    Write-Host ""
    Write-Host "Batch $batchNum/$totalBatches - $batchCount files" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Gray

    try {
        # Add files in this batch
        Write-Host "  Adding files..." -ForegroundColor White
        foreach ($file in $batch) {
            try {
                git add $file 2>$null
            } catch {
                Write-Host "  Skipped: $file" -ForegroundColor Yellow
            }
        }

        # Commit
        $commitMessage = "Batch $batchNum/${totalBatches}: Added $batchCount files"
        Write-Host "  Committing: $commitMessage" -ForegroundColor White
        git commit -m $commitMessage 2>&1 | Out-Null

        # Push
        Write-Host "  Pushing to remote..." -ForegroundColor White
        git push

        Write-Host "  Batch $batchNum completed!" -ForegroundColor Green

        # Small delay between batches
        if ($i -lt ($totalBatches - 1)) {
            Write-Host "  Waiting 2 seconds..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }

    } catch {
        Write-Host ""
        Write-Host "ERROR in batch ${batchNum}:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host ""
        Write-Host "Stopping process. You can run the script again to continue." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "All batches pushed successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
