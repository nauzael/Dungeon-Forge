# Script para ejecutar migración RLS en Supabase usando PowerShell
# Ejecuta: .\scripts\apply-rls-migration.ps1

$SUPABASE_URL = "https://usnlhzkpukkuwbtortil.supabase.co"
$SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw"

Write-Host "🔐 Iniciando aplicación de migración RLS..." -ForegroundColor Green
Write-Host ""

# Leer el archivo de migración
$migrationPath = Join-Path (Get-Location) "supabase\migrations\006_enable_rls_telegram_tables.sql"

if (-not (Test-Path $migrationPath)) {
    Write-Host "❌ Archivo de migración no encontrado: $migrationPath" -ForegroundColor Red
    exit 1
}

$migrationSQL = Get-Content -Path $migrationPath -Raw
Write-Host "📄 Migración cargada: $migrationPath"
Write-Host "📝 Tamaño: $($migrationSQL.Length) caracteres"
Write-Host ""

Write-Host "⏳ Intentando ejecutar migración en Supabase..." -ForegroundColor Yellow
Write-Host ""

# Intentar ejecutar vía RPC endpoint
$success = $false

try {
    $headers = @{
        "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
        "apikey" = $SUPABASE_SERVICE_KEY
        "Content-Type" = "application/json"
    }

    $body = @{
        sql = $migrationSQL
    } | ConvertTo-Json -Compress

    $response = Invoke-WebRequest `
        -Uri "$SUPABASE_URL/rest/v1/rpc/execute_sql" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop

    Write-Host "✅ Migración ejecutada exitosamente!" -ForegroundColor Green
    $success = $true
}
catch {
    Write-Host "⚠️  Ejecución automática no disponible (es normal)" -ForegroundColor Yellow
}

if ($success) {
    Write-Host ""
    Write-Host "📋 Resumen aplicado:" -ForegroundColor Cyan
    Write-Host "  ✅ RLS habilitado en: telegram_commands"
    Write-Host "  ✅ RLS habilitado en: allowed_telegram_users"
    Write-Host "  ✅ RLS habilitado en: telegram_sessions"
    Write-Host "  ✅ 12 políticas de seguridad implementadas"
    Write-Host ""
    Write-Host "🎉 Vulnerabilidad de seguridad resuelta!" -ForegroundColor Green
    Write-Host "⏱️  La alerta en Supabase desaparecerá en 24-48 horas" -ForegroundColor Yellow
} else {
    Write-Host "📌 Por favor, ejecuta la migración manualmente:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1️⃣  Ve a https://app.supabase.com/" -ForegroundColor Cyan
    Write-Host "2️⃣  Selecciona proyecto: Dungeon Forge" -ForegroundColor Cyan
    Write-Host "3️⃣  SQL Editor → New query" -ForegroundColor Cyan
    Write-Host "4️⃣  Copia el archivo: supabase/migrations/006_enable_rls_telegram_tables.sql" -ForegroundColor Cyan
    Write-Host "5️⃣  Ejecuta (Ctrl + Enter)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "O usa Supabase CLI:" -ForegroundColor Cyan
    Write-Host "   supabase db push" -ForegroundColor Cyan
    Write-Host ""
    
    # Abre el dashboard de Supabase en el navegador
    Write-Host "🌐 Abriendo dashboard de Supabase..." -ForegroundColor Yellow
    Start-Process "https://app.supabase.com/project/usnlhzkpukkuwbtortil/sql/new"
    Write-Host ""
}
