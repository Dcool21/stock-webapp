@echo off
TITLE Stock Tracker - Starting App
echo Starting Stock Tracker Web App...
echo.
echo 1. Navigating to project directory...
cd /d "%~dp0"

echo 2. Scheduling browser to open in 5 seconds...
:: This starts a background command that waits for 5 seconds then opens the URL
start /b "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000"

echo 3. Starting Next.js development server...
echo.
echo [INFO] The browser will open automatically once the server is ready.
echo [INFO] Press Ctrl+C in this window to stop the server.
echo.
npm run dev
pause
