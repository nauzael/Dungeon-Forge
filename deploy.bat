@echo off
setlocal enabledelayedexpansion

REM ============================================================
REM   DUNGEON FORGE - Build & Deploy Script
REM ============================================================
REM   Usage:
REM     deploy.bat                    Build + OTA + APK
REM     deploy.bat "mi mensaje"       Build + OTA with custom message
REM     deploy.bat --ota-only         OTA only (skip build)
REM     deploy.bat --apk-only         APK only (skip build)
REM     deploy.bat --build-only       Build only (no deploy)
REM ============================================================

set START_TIME=%time%
set "MSG="
set "MODE=full"

REM --- Parse arguments ---
:parse_args
if "%~1"=="" goto :done_args
if /i "%~1"=="--ota-only" (set MODE=ota-only& shift& goto :parse_args)
if /i "%~1"=="--apk-only" (set MODE=apk-only& shift& goto :parse_args)
if /i "%~1"=="--build-only" (set MODE=build-only& shift& goto :parse_args)
if /i "%~1"=="--help" goto :show_help
if /i "%~1"=="-h" goto :show_help
set "MSG=%~1"
shift
goto :parse_args

:show_help
echo.
echo   deploy.bat [message] [--mode]
echo.
echo   Modes:
echo     (none)         Build + OTA + APK (default)
echo     --ota-only     Build + OTA only
echo     --apk-only     Build APK only
echo     --build-only   Build only, no deploy
echo     --help         Show this help
echo.
echo   Examples:
echo     deploy.bat "Fix party member visibility"
echo     deploy.bat --ota-only "Hotfix login"
echo     deploy.bat --apk-only
echo.
pause
exit /b 0

:done_args
echo.
echo ===============================================================
echo   DUNGEON FORGE - Build ^& Deploy
echo ===============================================================
echo   Mode: %MODE%
if not "%MSG%"=="" echo   Message: "%MSG%"
echo   Started: %START_TIME%
echo ===============================================================
echo.

REM ====================== STEP 1: BUILD ======================
if "%MODE%"=="apk-only" goto :skip_build

echo [1/3] Building project...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo X BUILD FAILED
    echo   Check the errors above ^& fix them.
    pause
    exit /b 1
)
echo   OK Build successful
echo.

REM ====================== STEP 2: OTA UPDATE ======================
if "%MODE%"=="build-only" goto :skip_ota
if "%MODE%"=="apk-only" goto :skip_ota

echo [2/3] Uploading OTA update...
if not "%MSG%"=="" (
    node scripts/build_ota.mjs "%MSG%"
) else (
    node scripts/build_ota.mjs
)
if %ERRORLEVEL% neq 0 (
    echo X OTA UPLOAD FAILED
    echo   The build succeeded but the OTA upload failed.
    echo   Check Firebase credentials and network.
    pause
    exit /b 1
)
echo.
goto :step3

:skip_ota
echo [2/3] OTA SKIPPED (--%MODE%)
echo.

:skip_build
if "%MODE%"=="apk-only" echo [1/3] BUILD SKIPPED (--apk-only)
echo.

REM ====================== STEP 3: APK ======================
:step3
if "%MODE%"=="build-only" goto :skip_apk
if "%MODE%"=="ota-only" goto :skip_apk

echo [3/3] Building Android APK...
cd android
if not exist "local.properties" (
    if defined ANDROID_HOME (
        > local.properties echo sdk.dir=!ANDROID_HOME!
    ) else (
        echo   W ANDROID_HOME not set — APK may fail if SDK is missing
    )
)
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo X APK BUILD FAILED
    cd ..
    pause
    exit /b 1
)
set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
echo   OK APK built: %APK_PATH%
cd ..
echo.
goto :done

:skip_apk
echo [3/3] APK SKIPPED (--%MODE%)
echo.

REM ====================== DONE ======================
:done
set END_TIME=%time%
echo ===============================================================
echo   DEPLOY COMPLETE
echo ===============================================================
echo   Started:   %START_TIME%
echo   Finished:  %END_TIME%
echo   Mode:      %MODE%
if not "%MSG%"=="" echo   Message:   "%MSG%"
echo ===============================================================
echo.

exit /b 0
