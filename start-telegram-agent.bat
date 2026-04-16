@echo off
REM start-telegram-agent.bat
REM Script para iniciar el Telegram Agent

echo.
echo ========================================
echo    OpenCode Telegram Agent
echo ========================================
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo 📦 Instalando dependencias...
    cd opencode-telegram-agent
    call npm install
    cd ..
)

echo.
echo.
echo ℹ️  El agent procesara comandos de Telegram cada 3 segundos.
echo ℹ️  Los comandos se guardan en telegram-commands/
echo.
echo Presiona Ctrl+C para detener
echo.

cd opencode-telegram-agent
set TELEGRAM_BOT_TOKEN=8682922559:AAFrXEpwBETxh3LARpRI7x3E9bWUSwKS0ps
set VITE_SUPABASE_URL=https://usnlhzkpukkuwbtortil.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw

call npx tsx index.ts
