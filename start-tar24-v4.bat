@echo off
title TAR24 v4 - C4ISR Command & Control System
color 0A

echo.
echo ============================================================
echo    TAR24 v4 - Advanced C4ISR Command & Control System
echo ============================================================
echo.
echo Starting TAR24 v4 server...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.7+ from https://python.org
    echo.
    pause
    exit /b 1
)

REM Check if tar24-v4.html exists
if not exist "tar24-v4.html" (
    echo ERROR: tar24-v4.html not found!
    echo Please ensure this batch file is in the TAR24 v4 project folder.
    echo.
    pause
    exit /b 1
)

echo Python found. Starting server...
echo.

REM Start the server
python server.py

echo.
echo Server stopped. Press any key to exit...
pause >nul