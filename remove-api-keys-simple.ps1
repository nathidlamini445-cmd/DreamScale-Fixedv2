# Script to remove hardcoded API keys from git history
Write-Host "Removing hardcoded API keys from git history..." -ForegroundColor Yellow
Write-Host "WARNING: This will rewrite git history!" -ForegroundColor Red

$repoPath = "c:\Users\Nkosinathi\Downloads\stark-workspaceSecondone"
Set-Location $repoPath

$gitExe = "C:\Users\Nkosinathi\AppData\Local\GitHubDesktop\app-3.5.3\resources\app\git\cmd\git.exe"

Write-Host "`nStep 1: Removing API keys from all commits..." -ForegroundColor Cyan

# Use git filter-branch to rewrite history
# We'll use a command that replaces the hardcoded keys

# Create a bash script for filter-branch (git on Windows can use bash)
$bashScript = @'
if [ -f "app/api/analyze-competitor/route.ts" ]; then
    sed -i "s/const OPENAI_API_KEY = .*sk-proj.*/const OPENAI_API_KEY = process.env.OPENAI_API_KEY/g" "app/api/analyze-competitor/route.ts" 2>/dev/null || true
    sed -i "s/const SCRAPER_API_KEY = .*['\''\"].*/const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY/g" "app/api/analyze-competitor/route.ts" 2>/dev/null || true
fi
'@

$bashScriptPath = Join-Path $repoPath ".filter-script.sh"
$bashScript | Out-File -FilePath $bashScriptPath -Encoding ASCII -NoNewline

# Try using the bash script with git filter-branch
$result = & $gitExe filter-branch --force --tree-filter "bash `"$bashScriptPath`"" --prune-empty --tag-name-filter cat -- --all 2>&1

# Clean up
Remove-Item $bashScriptPath -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0 -or $result -match "was rewritten" -or $result -match "Ref.*was rewritten") {
    Write-Host "`nSuccessfully removed API keys!" -ForegroundColor Green
    
    Write-Host "`nStep 2: Cleaning up..." -ForegroundColor Cyan
    & $gitExe for-each-ref --format="%(refname)" refs/original/ | ForEach-Object { & $gitExe update-ref -d $_ }
    & $gitExe reflog expire --expire=now --all
    & $gitExe gc --prune=now --aggressive
    
    Write-Host "`nSUCCESS! API keys removed from history." -ForegroundColor Green
    Write-Host "`nIMPORTANT:" -ForegroundColor Red
    Write-Host "1. Rotate your OpenAI API key - it was exposed in git history!" -ForegroundColor Yellow
    Write-Host "2. You'll need to force push: git push --force" -ForegroundColor Yellow
    Write-Host "3. Check GitHub Desktop - the secret warning should be gone" -ForegroundColor Green
} else {
    Write-Host "`nFilter-branch may not work on Windows. Trying alternative..." -ForegroundColor Yellow
    
    # Check current file
    if (Test-Path "app/api/analyze-competitor/route.ts") {
        $content = Get-Content "app/api/analyze-competitor/route.ts" -Raw
        if ($content -match "sk-proj-") {
            Write-Host "Current file still has hardcoded key. Fixing..." -ForegroundColor Yellow
            $content = $content -replace "const OPENAI_API_KEY = 'sk-proj-[^']*'", "const OPENAI_API_KEY = process.env.OPENAI_API_KEY"
            $content = $content -replace "const SCRAPER_API_KEY = '[^']*'", "const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY"
            $content | Set-Content "app/api/analyze-competitor/route.ts" -NoNewline
            Write-Host "Fixed current file. You'll need to commit this change." -ForegroundColor Green
        }
    }
    
    Write-Host "`nFor removing from history, you may need:" -ForegroundColor Cyan
    Write-Host "- BFG Repo-Cleaner: https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor White
    Write-Host "- Or create a fresh repository without the old commits" -ForegroundColor White
}

pause

