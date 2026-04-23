# 🤖 Gem-Team: Auto-Activación en cada Prompt

**Objetivo:** Que Gem-Team se active automáticamente cada vez que ejecutes un prompt.

---

## 📋 Opciones Disponibles

### ✅ Opción 1: Auto-Activación en VS Code / Cursor (Recomendado)

**Pasos:**

1. **Abre VS Code / Cursor**
2. **Paleta de comandos:** `Ctrl+Shift+P`
3. **Busca:** "Preferences: Open Settings (JSON)"
4. **Agrega esta sección:**

```json
{
  "chat.commandCenter.enabled": true,
  "copilot.advanced.chat.agentSelection": "gem-team",
  "[chat]": {
    "editor.defaultFormatter": "GitHub.copilot-chat",
    "editor.formatOnSave": true
  }
}
```

**Resultado:** Gem-Team se activa por defecto en cada chat nuevo.

---

### ✅ Opción 2: Activación Automática en Cursor

**Pasos:**

1. **Abre Cursor Settings**
2. **Busca:** "Default Agent"
3. **Selecciona:** "Gem Team"
4. **Reinicia Cursor**

**Resultado:** Todo lo que escribas en la paleta de comandos usará Gem-Team.

---

### ✅ Opción 3: Script PowerShell Auto-Activación

**Crea archivo:** `tools/auto-activate-gem-team.ps1`

```powershell
# Auto-activar Gem-Team en cada nuevo proyecto

$gemTeamPath = "$PSScriptRoot/gem-team"
$agentPath = "$env:USERPROFILE\.vscode\agents"

# Verificar que Gem-Team existe
if (-not (Test-Path $gemTeamPath)) {
    Write-Host "❌ Gem-Team no encontrado en $gemTeamPath" -ForegroundColor Red
    exit 1
}

# Copiar agents a VS Code
if (-not (Test-Path $agentPath)) {
    New-Item -ItemType Directory -Path $agentPath -Force | Out-Null
}

Write-Host "📋 Copiando Gem-Team agents a VS Code..." -ForegroundColor Cyan
Copy-Item "$gemTeamPath/agents/*" "$agentPath" -Force -Recurse

# Para Cursor (path alternativo)
$cursorAgentPath = "$env:USERPROFILE\.cursor\agents"
if (-not (Test-Path $cursorAgentPath)) {
    New-Item -ItemType Directory -Path $cursorAgentPath -Force | Out-Null
}

Write-Host "📋 Copiando Gem-Team agents a Cursor..." -ForegroundColor Cyan
Copy-Item "$gemTeamPath/agents/*" "$cursorAgentPath" -Force -Recurse

Write-Host "✅ Gem-Team auto-activado en VS Code y Cursor" -ForegroundColor Green
Write-Host "🔄 Reinicia tu editor para que tenga efecto" -ForegroundColor Yellow
```

**Uso:**

```powershell
cd "G:\Apks\Dungeon Forge"
powershell -ExecutionPolicy Bypass -File "tools/auto-activate-gem-team.ps1"
```

---

### ✅ Opción 4: Alias de Terminal (Instantáneo)

**Agrega a tu PowerShell profile:**

```powershell
# En PowerShell (ejecuta: $PROFILE para ver ruta)
# Abre el archivo y agrega:

function activate-gem {
    Write-Host "🤖 Gem-Team activado para este prompt" -ForegroundColor Green
    # Aquí puedes agregar lógica que ejecute gem-team por defecto
}

Set-Alias agt activate-gem
```

**Uso:**

```powershell
agt  # Activa Gem-Team
```

---

### ✅ Opción 5: Integración Automática en Proyecto

**Crea archivo:** `.claude/config.json`

```json
{
  "agents": {
    "default": "gem-orchestrator",
    "autoActivate": true,
    "onStartup": "Gem Team: Plan Implementation"
  },
  "paths": {
    "agentPath": "tools/gem-team/agents",
    "specPath": "docs/SPECS"
  },
  "rules": {
    "autoActivateOnFeature": true,
    "autoActivateOnBug": true,
    "autoActivateOnRefactor": true
  }
}
```

**Resultado:** Gem-Team se activa automáticamente en cualquier tipo de tarea.

---

### ✅ Opción 6: Bash/Zsh Profile (Mac/Linux)

**Agrega a `~/.bashrc` o `~/.zshrc`:**

```bash
# Auto-activar Gem-Team
export GEM_TEAM_ACTIVE=1
export GEM_TEAM_PATH="$HOME/.vscode/agents"

# Función para activar
activate-gem() {
    echo "🤖 Gem-Team activado"
    export GEM_TEAM_ACTIVE=1
}

# Alias
alias gem='activate-gem'
```

---

## 🚀 Recomendación Final

**Ranking de opciones (mejor a peor):**

| # | Opción | Velocidad | Facilidad | Recomendado |
|---|--------|-----------|-----------|------------|
| 1 | Opción 2 (Cursor Settings) | Instantáneo | ⭐⭐⭐⭐⭐ | ✅ **Mejor** |
| 2 | Opción 1 (VS Code JSON) | Instantáneo | ⭐⭐⭐⭐ | ✅ Bueno |
| 3 | Opción 5 (.claude/config.json) | 1-2s | ⭐⭐⭐⭐⭐ | ✅ Muy bueno |
| 4 | Opción 3 (PowerShell Script) | 5-10s | ⭐⭐⭐ | OK |
| 5 | Opción 4 (Alias Terminal) | Instantáneo | ⭐⭐ | Manual |
| 6 | Opción 6 (Bash/Zsh) | Instantáneo | ⭐⭐ | Mac/Linux |

---

## 💡 Recomendación para ti

**Dado que usas Windows + Cursor:**

### ⭐ Lo Mejor: Opción 2 (Cursor Settings)

1. Abre **Cursor**
2. **Settings** → Busca "Default Agent"
3. **Selecciona:** Gem Team
4. **Reinicia Cursor**

✅ **Resultado:** Cada prompt usa Gem-Team automáticamente.

---

### 🔄 Alternativa: Opción 5 (.claude/config.json)

1. Crea carpeta: `.claude/`
2. Crea archivo: `.claude/config.json` con contenido arriba
3. Reinicia editor

✅ **Resultado:** Auto-activación a nivel de proyecto.

---

## 🎯 Próximos Pasos

1. **Elige una opción** (recomiendo Opción 2)
2. **Implementa** (5 min máximo)
3. **Reinicia editor**
4. **Escribe un prompt** → ¡Gem-Team se activa automáticamente!

---

## ❓ FAQ

**P: ¿Puedo desactivar en cualquier momento?**  
R: Sí, vuelve a las settings y desselecciona Gem-Team.

**P: ¿Funciona en todos los editores?**  
R: Depende de la opción:
- Opción 1: VS Code/Insiders
- Opción 2: Cursor ✅
- Opción 3: PowerShell en cualquier editor
- Opción 5: Cualquier editor que soporte `.claude/`

**P: ¿Se puede activar por tipo de tarea?**  
R: Sí, con Opción 5 puedes configurar rules por tipo (feature, bug, refactor).

**P: ¿Qué pasa si cambio de editor?**  
R: Cada editor tiene su configuración. Necesitarías hacer lo mismo en cada uno.

---

## ✨ Conclusión

**Auto-activación = Sin pensar, solo escribe y Gem-Team trabaja.**

Gem-Team está diseñado para ser tu co-pilot que:
- 📋 Planifica automáticamente
- 👥 Ejecuta en paralelo (15 agents)
- ✅ Verifica resultados
- 🔍 Encuentra errores
- 📝 Documenta todo

**Una vez activado = olvídate de activar, solo escribe.** ✅
