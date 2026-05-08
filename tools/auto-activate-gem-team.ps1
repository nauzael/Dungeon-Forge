#!/usr/bin/env pwsh
# Gem-Team Auto-Activation Script
# Activa automaticamente Gem-Team en VS Code, Cursor, Claude Code, etc.

param(
    [switch]$VSCode,
    [switch]$Cursor,
    [switch]$ClaudeCode,
    [switch]$All
)

$gemTeamPath = Join-Path $PSScriptRoot "gem-team"
$gem_agents = Join-Path $gemTeamPath "agents"

# Verificar que Gem-Team existe
if (-not (Test-Path $gemTeamPath)) {
    Write-Host "[ERROR] Gem-Team no encontrado en $gemTeamPath" -ForegroundColor Red
    Write-Host "Ejecuta primero: git clone https://github.com/mubaidr/gem-team.git tools/gem-team" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $gem_agents)) {
    Write-Host "[ERROR] Agents no encontrados en $gem_agents" -ForegroundColor Red
    exit 1
}

Write-Host "Gem-Team Auto-Activation Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Rutas de instalacion
$paths = @{
    "VS Code"     = "$env:USERPROFILE\.vscode\agents"
    "VS Code Insiders" = "$env:USERPROFILE\.vscode-insiders\agents"
    "Cursor"      = "$env:USERPROFILE\.cursor\agents"
    "Claude Code" = "$env:USERPROFILE\.claude\agents"
    "Windsurf"    = "$env:USERPROFILE\.windsurf\agents"
    "OpenCode"    = "$env:USERPROFILE\.opencode\agents"
}

# Si no especifica, activar todo
if (-not ($VSCode -or $Cursor -or $ClaudeCode)) {
    $All = $true
}

# Funcion para copiar agents
function Copy-GemTeamAgents {
    param(
        [string]$EditorName,
        [string]$EditorPath
    )
    
    if (-not (Test-Path $EditorPath)) {
        New-Item -ItemType Directory -Path $EditorPath -Force | Out-Null
        Write-Host "[CREAR] Carpeta: $EditorPath" -ForegroundColor Gray
    }
    
    # Copiar todos los agents
    try {
        Copy-Item "$gem_agents\*" "$EditorPath" -Force -Recurse -ErrorAction Stop
        Write-Host "[OK] $($EditorName): Agents instalados" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[ERROR] $($EditorName): $_" -ForegroundColor Red
        return $false
    }
}

# Ejecutar instalacion
$successCount = 0

if ($All) {
    foreach ($editor in $paths.Keys) {
        if (Copy-GemTeamAgents -EditorName $editor -EditorPath $paths[$editor]) {
            $successCount++
        }
    }
} else {
    if ($VSCode) {
        if (Copy-GemTeamAgents -EditorName "VS Code" -EditorPath $paths["VS Code"]) {
            $successCount++
        }
    }
    if ($Cursor) {
        if (Copy-GemTeamAgents -EditorName "Cursor" -EditorPath $paths["Cursor"]) {
            $successCount++
        }
    }
    if ($ClaudeCode) {
        if (Copy-GemTeamAgents -EditorName "Claude Code" -EditorPath $paths["Claude Code"]) {
            $successCount++
        }
    }
}

Write-Host ""
Write-Host "Resumen" -ForegroundColor Cyan
Write-Host "=======" -ForegroundColor Cyan
Write-Host "Editores configurados: $successCount" -ForegroundColor Green

Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Reinicia tu editor (VS Code, Cursor, etc.)"
Write-Host "2. Abre Paleta de Comandos (Ctrl+Shift+P)"
Write-Host "3. Busca: 'Gem Team' y selecciona un agent"
Write-Host "4. Gem-Team esta auto-activado!" -ForegroundColor Green

Write-Host ""
Write-Host "Para hacer Gem-Team el agent por defecto:" -ForegroundColor Cyan
Write-Host "Settings -> Search 'Default Agent' -> Select 'Gem Team'" -ForegroundColor Gray

Write-Host ""
Write-Host "Gem-Team se activara automaticamente en cada prompt" -ForegroundColor Green
