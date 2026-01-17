@echo off
REM Start Neon Writers Backend Server

echo.
echo ╔════════════════════════════════════════╗
echo ║  STARTING NEON WRITERS BACKEND         ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo.
    echo Please create .env file first:
    echo  1. Copy .env.example to .env
    echo  2. Add your Gmail App Password
    echo  3. See BACKEND_SETUP.md for details
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ❌ node_modules not found!
    echo.
    echo Please run setup first:
    echo  1. Run setup.bat
    echo  2. Then try again
    echo.
    pause
    exit /b 1
)

REM Start the server
echo Starting server on port 3000...
echo.
echo To test the API:
echo   Health Check: http://localhost:3000/api/health
echo.
echo To stop the server: Press Ctrl+C
echo.
echo ════════════════════════════════════════
echo.

npm start
pause
