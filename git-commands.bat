@echo off
echo ========================================
echo DreamScale - GitHub Push Script
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com/download/win
    echo Or use GitHub Desktop: https://desktop.github.com/
    pause
    exit /b 1
)

echo Checking git status...
git status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Initializing Git repository...
    git init
)

echo.
echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Initial commit - DreamScale workspace ready for GitHub"

echo.
echo Checking remote origin...
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Adding remote origin...
    git remote add origin https://github.com/nathidlamini445-cmd/DreamScalee.git
) else (
    echo Remote origin already exists.
    echo Current remote: 
    git remote get-url origin
)

echo.
echo Setting branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
echo (You may be prompted for credentials)
git push -u origin main

echo.
echo ========================================
echo Done! Your code is now on GitHub!
echo ========================================
echo.
pause
