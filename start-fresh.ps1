# Script to start fresh with a clean git repository
Write-Host "Starting fresh repository setup..." -ForegroundColor Yellow
Write-Host "This will remove all git history and create a new clean repository." -ForegroundColor Cyan

$repoPath = "c:\Users\Nkosinathi\Downloads\stark-workspaceSecondone"
Set-Location $repoPath

$gitExe = "C:\Users\Nkosinathi\AppData\Local\GitHubDesktop\app-3.5.3\resources\app\git\cmd\git.exe"

# Step 1: Backup current .git (just in case)
Write-Host "`nStep 1: Backing up current .git folder..." -ForegroundColor Cyan
if (Test-Path ".git") {
    $backupPath = ".git.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -Path ".git" -Destination $backupPath -Recurse -ErrorAction SilentlyContinue
    Write-Host "Backup created at: $backupPath" -ForegroundColor Green
}

# Step 2: Remove old .git folder
Write-Host "`nStep 2: Removing old git history..." -ForegroundColor Cyan
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
    Write-Host "Old git history removed." -ForegroundColor Green
}

# Step 3: Initialize new repository
Write-Host "`nStep 3: Initializing new git repository..." -ForegroundColor Cyan
& $gitExe init
Write-Host "New repository initialized." -ForegroundColor Green

# Step 4: Add all files
Write-Host "`nStep 4: Adding all files..." -ForegroundColor Cyan
& $gitExe add .
$fileCount = (& $gitExe ls-files | Measure-Object -Line).Lines
Write-Host "Added $fileCount files." -ForegroundColor Green

# Step 5: Make initial commit
Write-Host "`nStep 5: Creating initial commit..." -ForegroundColor Cyan
& $gitExe commit -m "Initial commit - clean repository without exposed secrets"
Write-Host "Initial commit created." -ForegroundColor Green

# Step 6: Set up remote
Write-Host "`nStep 6: Setting up remote repository..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/nathidlamini445-cmd/DreamScale-Fixedv2.git"
& $gitExe remote add origin $remoteUrl
Write-Host "Remote set to: $remoteUrl" -ForegroundColor Green

# Step 7: Check current branch
& $gitExe branch -M main

Write-Host "`n" -NoNewline
Write-Host "SUCCESS! Fresh repository created!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Open GitHub Desktop" -ForegroundColor White
Write-Host "2. You'll see the new clean commit" -ForegroundColor White
Write-Host "3. Push to GitHub (you'll need to force push since history changed)" -ForegroundColor White
Write-Host "   - In GitHub Desktop: Repository -> Push -> Check 'Force push'" -ForegroundColor Cyan
Write-Host "   - Or use: git push --force origin main" -ForegroundColor Cyan
Write-Host "`nIMPORTANT:" -ForegroundColor Red
Write-Host "- Rotate your OpenAI API key at https://platform.openai.com/api-keys" -ForegroundColor Yellow
Write-Host "- The old key was exposed in the previous history" -ForegroundColor Yellow
Write-Host "`nYour code is now clean and ready to push!" -ForegroundColor Green

pause

