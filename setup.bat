@echo off
chcp 65001 >nul
title Egypt Prayer Times - Setup
echo ============================================
echo   Egypt Prayer Times - Extension Setup
echo ============================================
echo.

:: Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please download and install Node.js first:
    echo https://nodejs.org/
    echo.
    echo Then run this file again.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

:: Install dependencies
echo 📦 Installing dependencies...
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
echo   ✅ Setup Complete!
echo ============================================
echo.
echo Next steps to load the extension in Chrome:
echo.
echo 1. Open Chrome
echo 2. Type chrome://extensions/ in the address bar
echo 3. Turn ON ^"Developer mode^" (top-right switch)
echo 4. Click ^"Load unpacked^"
echo 5. Select this folder: 
echo    %CD%\dist
echo.
echo ============================================
echo.

:: Open dist folder
echo 📂 Opening the dist folder...
start explorer "%CD%\dist"

:: Optionally open Chrome extensions page
echo 🌐 Opening Chrome extensions page...
start chrome "chrome://extensions/"

echo.
pause
