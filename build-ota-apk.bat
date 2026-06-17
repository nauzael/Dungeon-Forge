@echo off
echo [1/3] BUILDING...
call npm run build
if errorlevel 1 exit /b 1
echo.
echo [2/3] OTA UPDATE...
call npm run ota
echo.
echo [3/3] APK ANDROID...
cd android
call .\gradlew.bat assembleDebug
cd ..
echo.
echo ========== COMPLETE ==========
pause
