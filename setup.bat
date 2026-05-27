@echo off
chcp 65001 >nul
title Egypt Prayer Times - Developer Build
echo ============================================
echo   Egypt Prayer Times - Developer Build
echo ============================================
echo.
echo NOTE: This script is for developers who want to
echo modify the source code. Regular users can simply
echo load the pre-built dist/ folder in Chrome.
echo.

:: Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please download and install Node.js first:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

:: Install dependencies
echo 📦 Installing dependencies (this may take a minute)...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)
echo ✅ Dependencies installed.
echo.

:: Build extension
echo 🔨 Building extension...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed.
    pause
    exit /b 1
)
echo ✅ Build complete.
echo.

:: Show success
echo ============================================
echo   ✅ Build Complete!
echo ============================================
echo.
echo The dist/ folder has been updated.
echo Load it in Chrome at chrome://extensions/
echo (Developer mode ON ^> Load unpacked ^> select dist/)
echo.

:: Open dist folder
echo 📂 Opening the dist folder...
start explorer "%CD%\dist"

echo.
pause
