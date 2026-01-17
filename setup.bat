@echo off
REM Neon Writers Backend Setup Script for Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║  NEON WRITERS BACKEND SETUP            ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed!
    echo npm should come with Node.js
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.
npm install

if errorlevel 1 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo ╔════════════════════════════════════════╗
echo ║       SETUP COMPLETE                   ║
echo ║                                        ║
echo ║  Next steps:                           ║
echo ║  1. Create .env file (copy .env.example)
echo ║  2. Add Gmail credentials to .env      ║
echo ║  3. Run: npm start                     ║
echo ║                                        ║
echo ║  See BACKEND_SETUP.md for details      ║
echo ╚════════════════════════════════════════╝
echo.
pause
