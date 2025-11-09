# Script to remove hardcoded API keys from git history
Write-Host "Removing hardcoded API keys from git history..." -ForegroundColor Yellow
Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Red

# Navigate to repository
$repoPath = "c:\Users\Nkosinathi\Downloads\stark-workspaceSecondone"
Set-Location $repoPath

# Find git executable
$gitExe = "C:\Users\Nkosinathi\AppData\Local\GitHubDesktop\app-3.5.3\resources\app\git\cmd\git.exe"

if (-not (Test-Path $gitExe)) {
    Write-Host "ERROR: Git executable not found." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "`nStep 1: Removing API keys from git history..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Remove the hardcoded API keys from all commits
# We'll use filter-branch to replace the hardcoded keys with environment variables

$script = @'
#!/bin/sh
git filter-branch --force --index-filter '
    git rm --cached --ignore-unmatch "app/api/analyze-competitor/route.ts" 2>/dev/null || true
    if git ls-files --error-unmatch "app/api/analyze-competitor/route.ts" >/dev/null 2>&1; then
        git checkout-index -f "app/api/analyze-competitor/route.ts"
        # Replace hardcoded keys with env vars
        sed -i "s/const OPENAI_API_KEY = .*sk-proj.*/const OPENAI_API_KEY = process.env.OPENAI_API_KEY/g" "app/api/analyze-competitor/route.ts" 2>/dev/null || true
        sed -i "s/const SCRAPER_API_KEY = .*['\"].*/const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY/g" "app/api/analyze-competitor/route.ts" 2>/dev/null || true
        git add "app/api/analyze-competitor/route.ts"
    fi
' --prune-empty --tag-name-filter cat -- --all
'@

# Use a simpler approach - remove the file from history and let the current version be the only one
Write-Host "`nRemoving file from history and rewriting commits..." -ForegroundColor Yellow

# Method: Use BFG-style approach with filter-branch
$filterScript = @'
if git ls-files --error-unmatch "app/api/analyze-competitor/route.ts" >/dev/null 2>&1; then
    git checkout-index -f "app/api/analyze-competitor/route.ts"
    # Use PowerShell-compatible sed replacement
    (Get-Content "app/api/analyze-competitor/route.ts") | 
        ForEach-Object { $_ -replace "const OPENAI_API_KEY = 'sk-proj-[^']*'", "const OPENAI_API_KEY = process.env.OPENAI_API_KEY" } |
        ForEach-Object { $_ -replace "const SCRAPER_API_KEY = '[^']*'", "const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY" } |
        Set-Content "app/api/analyze-competitor/route.ts"
    git add "app/api/analyze-competitor/route.ts"
fi
'@

# Save filter script temporarily
$filterScriptPath = Join-Path $repoPath "filter-script.ps1"
$filterScript | Out-File -FilePath $filterScriptPath -Encoding UTF8

# Use git filter-branch with a command that works on Windows
$result = & $gitExe filter-branch --force --index-filter "powershell -ExecutionPolicy Bypass -File `"$filterScriptPath`"" --prune-empty --tag-name-filter cat -- --all 2>&1

# Clean up temp script
Remove-Item $filterScriptPath -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0 -or $result -match "Ref 'refs/heads/main' was rewritten") {
    Write-Host "`nSuccessfully removed API keys from git history!" -ForegroundColor Green
    
    Write-Host "`nStep 2: Cleaning up backup refs..." -ForegroundColor Cyan
    & $gitExe for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { & $gitExe update-ref -d $_ }
    
    Write-Host "`nStep 3: Running garbage collection..." -ForegroundColor Cyan
    & $gitExe reflog expire --expire=now --all
    & $gitExe gc --prune=now --aggressive
    
    Write-Host "`n" -NoNewline
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "The API keys have been removed from git history." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Check GitHub Desktop - the secret should be gone" -ForegroundColor White
    Write-Host "2. You'll need to force push: git push --force" -ForegroundColor White
    Write-Host "   (Be careful - this rewrites history!)" -ForegroundColor Red
    Write-Host "3. IMPORTANT: Rotate/regenerate your OpenAI API key since it was exposed!" -ForegroundColor Red
} else {
    Write-Host "`nTrying alternative method..." -ForegroundColor Yellow
    
    # Alternative: Use git filter-repo approach or manual commit rewriting
    Write-Host "`nAlternative: You may need to:" -ForegroundColor Cyan
    Write-Host "1. Create a new repository without the history" -ForegroundColor White
    Write-Host "2. Or use BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor White
    Write-Host "3. Or manually edit the commit using interactive rebase" -ForegroundColor White
}

Write-Host "`nScript completed." -ForegroundColor Cyan
pause

