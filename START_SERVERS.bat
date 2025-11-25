@echo off
echo ========================================
echo   ETRIXX EXAM - Starting Servers
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo ERROR: Failed to start MongoDB
        echo Please start MongoDB manually: net start MongoDB
        pause
        exit /b 1
    )
) else (
    echo MongoDB is already running
)
echo.

REM Start Backend in new window
echo [2/4] Starting Django Backend...
start "Django Backend" cmd /k "cd django_backend && python manage.py runserver"
timeout /t 3 >nul
echo Backend starting at http://localhost:8000
echo.

REM Start Frontend in new window
echo [3/4] Starting React Frontend...
start "React Frontend" cmd /k "npm run dev"
timeout /t 3 >nul
echo Frontend starting at http://localhost:5173
echo.

echo [4/4] Opening browser...
timeout /t 5 >nul
start http://localhost:5173
echo.

echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo (Servers will continue running in separate windows)
pause >nul
