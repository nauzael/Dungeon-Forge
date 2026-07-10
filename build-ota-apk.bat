@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM   DUNGEON FORGE - Quick Build + OTA + APK
REM ============================================================
REM   Usage:
REM     build-ota-apk.bat                    Full build + OTA + APK
REM     build-ota-apk.bat "mi mensaje"       Custom OTA message
REM     build-ota-apk.bat --help             Show help
REM ============================================================

set "MSG="
if /i "%~1"=="--help" goto :show_help
if not "%~1"=="" set "MSG=%~1"

echo.
echo ===============================================================
echo   DUNGEON FORGE - Build ^& OTA ^& APK
echo ===============================================================
if not "!MSG!"=="" echo   Message: "!MSG!"
echo ===============================================================
echo.

REM ====================== STEP 1: BUILD ======================
echo [1/3] Building project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo X BUILD FAILED
    echo   Fix the errors above and try again.
    pause
    exit /b 1
)
echo   OK Build successful
echo.

REM ====================== STEP 2: OTA UPDATE ======================
echo [2/3] Uploading OTA update...
if not "!MSG!"=="" (
    node scripts/build_ota.mjs "!MSG!"
) else (
    node scripts/build_ota.mjs
)
if %ERRORLEVEL% neq 0 (
    echo.
    echo X OTA UPLOAD FAILED
    echo   The build succeeded but the OTA upload failed.
    echo   Check Firebase credentials and network.
    pause
    exit /b 1
)
echo.

REM ====================== STEP 3: APK ======================
echo [3/3] Building Android APK...
if not exist "android" (
    echo X Android platform not found. Run: npx cap add android
    pause
    exit /b 1
)
cd android
if not exist "local.properties" (
    if defined ANDROID_HOME (
        > local.properties echo sdk.dir=!ANDROID_HOME!
    ) else (
        echo W ANDROID_HOME not set — APK build may fail if SDK path is missing
    )
)
call gradlew.bat assembleDebug
set APK_RESULT=%ERRORLEVEL%
cd ..
if %APK_RESULT% neq 0 (
    echo.
    echo X APK BUILD FAILED
    cd ..
    pause
    exit /b 1
)
echo   OK APK built: android\app\build\outputs\apk\debug\app-debug.apk
echo.

REM ====================== DONE ======================
echo ===============================================================
echo   ALL STEPS COMPLETE
echo ===============================================================
echo   Build:  ✓
if not "!MSG!"=="" echo   OTA:    ✓ ("!MSG!")
echo   APK:    ✓
echo ===============================================================
echo.
pause
exit /b 0

:show_help
echo.
echo   build-ota-apk.bat ["mensaje"]
echo.
echo   Builds the app, uploads OTA, and builds Android APK.
echo.
echo   Arguments:
echo     "mensaje"    Optional custom message for the OTA update
echo     --help       Show this help
echo.
echo   Examples:
echo     build-ota-apk.bat
echo     build-ota-apk.bat "Hotfix party sync"
echo.
pause
exit /b 0
