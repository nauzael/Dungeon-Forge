# Claude Code — Project Structure

## 📁 Estructura de Archivos

```
CLAUDE.md
Claude.local.md
.mcp.json
.cl Claude/
├── settings.json
├── settings.local.json
├── rules/
│   ├── code-style.md
│   ├── testing.md
│   └── api-conventions.md
├── commands/
│   ├── review.md
│   └── fix-issue.md
├── skills/
│   ├── review.md
│   └── fix-issue.md
├── commands/
│   ├── skill.md
│   └── deploy-config.md
├── agents/
│   ├── codeReviewer.md
│   └── security-auditor.md
└── hooks/
    └── validate-bash.sh
```

---

## 📄 CLAUDE.md

- Cargado al inicio de la sesión
- Define el resumen del proyecto, tech stack y comandos
- Contiene convenciones de código y arquitectura
- Soporta overrides mediante `CLAUDE.local.md`

---

## ⚙️ .mcp.json

- Almacena la configuración de integración MCP
- Conecta con GitHub, JIRA, Slack, DBs
- Acceso compartido con el equipo vía git

---

## 🔧 settings.json

- Define permisos y acceso a herramientas
- Define selecciones de modelos y hooks
- Soporta overrides mediante `settings.local.json`

---

## 📋 rules/

- Archivos `.md` modulares organizados por tema
- Estilos de código, testing, diseño de API
- Pueden apuntar a archivos/rutas específicas

---

## 💬 commands/

- Comandos slash personalizados (`/project-name`)
- Soporta flujos de trabajo extensibles
- Sistema de payload personalizado

---

## 🧠 skills/

- Se activan automáticamente según el contexto de la tarea
- Se cargan solo cuando se necesitan
- Payload personalizado y ligero

---

## 🤖 agents/

- Sub-agentes especializados con roles definidos
- Manejan comandos específicos
- Herramientas personalizadas y preferencias de modelo

---

## 🪝 hooks/

- Scripts orientados a eventos (pre/post uso de herramienta)
- Automatizan validación y formateo
- Bloquean operaciones inseguras

---

## ✅ Implementación en Dungeon Forge

El proyecto **Dungeon Forge** implementa esta estructura en `.claude/`:

```
.claude/
├── settings.json                    # Config de permisos y hooks
├── commands/                        # Slash commands (vacío por ahora)
├── hooks/                           # Hooks de validación (vacío por ahora)
├── skills/                          # 9 skills integrados
│   ├── code-review-and-quality/      # QA de código
│   ├── context-engineering/          # Optimización de contexto
│   ├── debugging-and-error-recovery/  # Troubleshooting
│   ├── frontend-ui-engineering/      # UI components
│   ├── gsap-core/                    # Animaciones
│   ├── incremental-implementation/   # Cambios incrementales
│   ├── performance-optimization/     # Optimización rendimiento
│   ├── planning-and-task-breakdown/   # Descomposición de tareas
│   └── spec-driven-development/      # Specs antes de código
├── rules/                           # Reglas específicas del proyecto
│   ├── dungeon-forge-typescript.md
│   ├── dungeon-forge-react.md
│   └── dungeon-forge-performance.md
├── CLAUDE.md                        # Contexto principal
└── Estructura de proyecto.md        # Este documento
```

### Skills Recomendados por Tarea

| Tarea | Skill |
|-------|-------|
| UI/Componentes | `frontend-ui-engineering` |
| Bugs/Errores | `debugging-and-error-recovery` |
| Features nuevas | `spec-driven-development` |
| Código complejo | `planning-and-task-breakdown` |
| QA pre-merge | `code-review-and-quality` |
| Animaciones | `gsap-core` |

