@echo off
REM OAuth Login Fix - Build & Deploy Script (Windows)
REM 
REM Usage: build-and-deploy.bat
REM 
REM This script:
REM 1. Verifies build status
REM 2. Builds APK
REM 3. Installs on connected device
REM 4. Shows deployment instructions

setlocal enabledelayedexpansion

echo.
echo ==============================================================
echo    OAuth Login Fix - Build ^& Deploy Script (Windows)
echo ==============================================================
echo.

REM Step 1: Verify build
echo [1/4] Verifying TypeScript build...
call npm run build > nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo X Build failed - see errors above
    pause
    exit /b 1
)
echo. ^✓ Build successful
echo.

REM Step 2: Build APK
echo [2/4] Building APK...
cd android
if not exist "local.properties" (
    echo. ⚠ local.properties not found - generating...
    (
        echo sdk.dir=%ANDROID_HOME%
    ) > local.properties
)

REM Build APK
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo. X APK build failed
    pause
    exit /b 1
)

set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
echo. ✓ APK built successfully
echo. Location: %APK_PATH%
echo.
cd ..

REM Step 3: Check for devices
echo [3/4] Checking for connected devices...
for /f "tokens=*" %%A in ('adb devices ^| findstr /v "List" ^| findstr /v "^$"') do (
    set DEVICE=%%A
    if not "!DEVICE!"=="" (
        echo. ✓ Device found: !DEVICE!
    )
)

REM Step 4: Install APK
echo.
echo [4/4] Installing APK...
call adb install -r "android\app\build\outputs\apk\debug\app-debug.apk"
if %ERRORLEVEL% neq 0 (
    echo. X Installation failed
    pause
    exit /b 1
)
echo. ✓ APK installed successfully

echo.
echo ==============================================================
echo      OAuth Fix Ready for Testing
echo ==============================================================
echo.
echo ✓ All steps completed!
echo.
echo Next steps:
echo 1. Open 'Dungeon Forge' app on your device
echo 2. Tap the 🔍 button (bottom-right corner)
echo 3. Select 'Diagnostics' tab
echo 4. Tap 'Run Diagnostics' to verify setup
echo.
echo Then test OAuth:
echo 1. Go to 'Session' tab
echo 2. Tap 'Test OAuth Flow' (simulated test)
echo 3. Check 'Logs' tab to see the flow
echo.
echo Real test:
echo 1. Close debug panel
echo 2. Tap 'Sign in with Google'
echo 3. Select your account
echo 4. Wait 2+ seconds for redirect
echo 5. Should enter app successfully ✓
echo.
echo If it still hangs:
echo   - Check debug panel Logs tab for failure point
echo   - See OAUTH-FIX-GUIDE.md for troubleshooting
echo.
pause
