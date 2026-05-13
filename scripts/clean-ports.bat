@echo off
REM clean-ports.bat
REM Limpia manualmente los puertos 5173-5175 en caso de emergencia
REM Uso: .\scripts\clean-ports.bat

echo.
echo 🧹 Limpiando puertos 5173-5175...
echo.

REM Limpiar puerto 5173
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
    echo Matando PID %%a en puerto 5173...
    taskkill /PID %%a /F 2>nul
)

REM Limpiar puerto 5174
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5174"') do (
    echo Matando PID %%a en puerto 5174...
    taskkill /PID %%a /F 2>nul
)

REM Limpiar puerto 5175
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5175"') do (
    echo Matando PID %%a en puerto 5175...
    taskkill /PID %%a /F 2>nul
)

echo.
echo ✅ Puertos limpios!
echo.
echo Ahora puedes correr: npm run dev
echo.
pause
