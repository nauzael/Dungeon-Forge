# 📁 PLAN: Reorganización de Archivos en Root

**Estado:** Propuesta para aprobación  
**Fecha:** 2026-04-20  
**Objetivo:** Agrupar 50+ archivos sueltos en la raíz en carpetas lógicas

---

## 🔍 Situación Actual

```
Root está desordenado con:
├─ 30+ archivos .md y .txt (docs mezcladas)
├─ 6 scripts de generación (generate-*.cjs)
├─ 5 scripts de testing (test-*.js)
├─ 3 scripts de build (build-*.bat/sh)
├─ 10+ archivos config (eslint, vite, tailwind, etc.)
├─ 3 archivos de datos (spells-extracted.json, metadata.json, etc.)
├─ Archivos de entrada principales (index.tsx, App.tsx, types.ts)
└─ Carpetas dispersas (.agents, .claude, opencode-telegram-agent, etc.)
```

---

## 📋 Propuesta de Nueva Estructura

```
📦 Dungeon Forge/
│
├── 📁 docs/                           (Carpeta existente, consolidar aquí)
│   ├── GETTING-STARTED/               (Onboarding rápido)
│   │   ├── 👉-START-HERE.txt
│   │   ├── QUICK-START-OAUTH-TEST.txt
│   │   └── START-HERE-OAUTH-FIX.txt
│   │
│   ├── GUIDES/                        (Guías completas)
│   │   ├── OAUTH-FIX-GUIDE.md
│   │   ├── FILE-GUIDE.txt
│   │   ├── FINAL-DEPLOYMENT-CHECKLIST.md
│   │   ├── INSTALL-AND-TEST-APK.txt
│   │   ├── DEVICE-VERIFICATION.txt
│   │   └── QUICK-START-OAUTH-TEST.txt
│   │
│   ├── SPECS/                         (Especificaciones técnicas)
│   │   ├── SPEC-Level-Reset-System.md
│   │   ├── TECHNICAL-IMPLEMENTATION-PLAN-2026-04-09.md
│   │   ├── VERIFICATION-LEVEL-PROGRESSION-2026-04-09.md
│   │   ├── DEFT-EXPLORER-IMPLEMENTATION.md
│   │   └── PLAN-MULTICLASS-IMPLEMENTATION.md
│   │
│   ├── CHECKLISTS/                    (Listas de verificación)
│   │   ├── COMPILATION-CHECKLIST.txt
│   │   ├── FINAL-DEPLOYMENT-CHECKLIST.md
│   │   ├── OAUTH-FIX-COMPLETION-CHECKLIST.txt
│   │   ├── PRE-INSTALL-CHECKLIST.txt
│   │   ├── APK-READY-TO-TEST.txt
│   │   └── DEVICE-VERIFICATION.txt
│   │
│   ├── PROGRESS/                      (Documentación de progreso)
│   │   ├── IMPLEMENTATION-COMPLETE.txt
│   │   ├── IMPLEMENTATION-VERIFIED.txt
│   │   ├── SOLUTION-COMPLETE.txt
│   │   ├── PROOF-OF-FIX.txt
│   │   ├── CODE-CHANGES-SUMMARY.txt
│   │   └── TECHNICAL-SUMMARY.txt
│   │
│   ├── REFERENCE/                     (Documentación de referencia)
│   │   ├── CHANGELOG.md
│   │   ├── AGENTS.md
│   │   ├── AI_CONTEXT.md
│   │   ├── FILE-GUIDE.txt
│   │   ├── GUIDES-INDEX.txt
│   │   ├── FEATS-AUDIT-2024.md
│   │   └── MEMORY.md
│   │
│   └── DEPLOYMENT/                    (Info de deploy específica)
│       ├── README-APK-LISTO.txt
│       ├── INSTALL-COMMAND.txt
│       ├── COMPLETE-WORKFLOW.txt
│       └── APK-READY-TO-TEST.txt
│
├── 📁 scripts/                        (Carpeta existente, agregar subdirectories)
│   ├── generate/                      (Generadores de datos)
│   │   ├── generate-backgrounds.cjs
│   │   ├── generate-classes.cjs
│   │   ├── generate-feats.cjs
│   │   ├── generate-items.cjs
│   │   ├── generate-species.cjs
│   │   └── generate-spells.cjs
│   │
│   ├── test/                          (Scripts de testing)
│   │   ├── test-atlas.js
│   │   ├── test-hp-automatic.js
│   │   ├── test-hp-calculation.js
│   │   ├── test-hp-detailed.js
│   │   └── test-upload.js
│   │
│   ├── build/                         (Scripts de compilación)
│   │   ├── build-and-deploy.bat
│   │   ├── build-and-deploy.sh
│   │   └── start-telegram-agent.bat
│   │
│   ├── dev/                           (Herramientas de desarrollo)
│   │   ├── capture-logs.js
│   │   └── (agregar más aquí)
│   │
│   └── README.md                      (Índice de scripts)
│
├── 📁 config/                         (NUEVA: Archivos de configuración)
│   ├── eslint.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── vercel.json
│   ├── capacitor.config.json
│   ├── manifest.json
│   ├── .prettierrc (symlink o copy)
│   ├── .npmrc (symlink o copy)
│   └── README.md                      (Explicación de cada config)
│
├── 📁 data/                           (NUEVA: Data estática)
│   ├── spells-extracted.json
│   ├── metadata.json
│   ├── skills-lock.json
│   └── README.md                      (Explicación de cada archivo)
│
├── 📁 src/                            (NUEVA: Código fuente)
│   ├── index.tsx
│   ├── index.html
│   ├── index.css
│   ├── App.tsx
│   ├── types.ts
│   ├── constants.ts
│   ├── sw.js
│   ├── components/                    (mover desde root)
│   ├── utils/                         (mover desde root)
│   ├── hooks/                         (mover desde root)
│   ├── constants/                     (ya existe, restructurar)
│   ├── Data/                          (mover desde root)
│   ├── types/                         (mover desde root)
│   └── README.md
│
├── 📁 integration/                    (Herramientas externas)
│   ├── supabase/                      (ya existe)
│   ├── opencode-telegram-agent/       (mover desde root)
│   ├── ota-release/                   (mover desde root)
│   └── README.md
│
├── 📁 build-output/                   (NUEVA: Salida de compilación)
│   ├── dist/                          (ya existe, mover aquí)
│   └── android/                       (ya existe, mover aquí)
│
├── 📁 tools/                          (NUEVA: Herramientas de desarrollo)
│   ├── .agents/                       (mover desde root)
│   ├── .claude/                       (mover desde root)
│   ├── .vscode/                       (mover desde root)
│   ├── .vercel/                       (mover desde root)
│   └── README.md
│
├── 📁 tmp/                            (NUEVA: Archivos temporales)
│   ├── thoughts/                      (mover desde root)
│   ├── Libros/                        (mover desde root)
│   ├── .logs/                         (mover desde root)
│   ├── .ruff_cache/                   (mover desde root)
│   └── .README.md (no tocar, ignorados)
│
├── 📁 env/                            (NUEVA: Variables de entorno)
│   ├── .env
│   ├── .env.example
│   ├── .env.local
│   └── README.md (IMPORTANTE: cómo configurar)
│
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md                       (Reorganizado: punto de entrada principal)
├── 📄 LICENSE
├── 📄 .gitignore
├── 📄 AGENTS.md                       (Mantener aquí para visibilidad)
├── 📄 MEMORY.md                       (Mantener aquí)
├── 📄 SKILLS_README.md                (Mantener aquí)
├── 📄 PLAN-MULTICLASS-IMPLEMENTATION.md  (Mantener aquí: plan actual)
│
└── 📁 mocks/                          (Ya existe)
```

---

## 🎯 Fases de Implementación

### **Fase 1: Creación de estructura (sin mover archivos)**
- [ ] Crear carpetas: `docs/`, `config/`, `data/`, `src/`, `scripts/` (subdirs), `integration/`, `build-output/`, `tools/`, `tmp/`, `env/`
- [ ] Crear archivos README.md en cada carpeta explicando contenido
- [ ] Tiempo estimado: 30 minutos

### **Fase 2: Reorganización de archivos (MÁS RIESGOSO)**
- [ ] Mover archivos de docs a `docs/` subcarpetas
- [ ] Mover scripts a `scripts/` subdirectories
- [ ] Mover config a `config/`
- [ ] Mover data a `data/`
- [ ] **⚠️ Actualizar imports en código (si hay referencias directas)**
- [ ] Tiempo estimado: 1-2 horas

### **Fase 3: Consolidación y actualización (CRÍTICA)**
- [ ] Actualizar `.gitignore` con nuevas rutas
- [ ] Actualizar scripts en `package.json` (si hay)
- [ ] Actualizar referencias en `vite.config.ts`, `vitest.config.ts`, etc.
- [ ] Verificar que build sigue funcionando
- [ ] Verificar que no se rompieron imports
- [ ] Tiempo estimado: 1-2 horas

---

## ⚠️ Decisiones Críticas

### **1. Mover `/src` como nueva carpeta de código**
```
Opción A (RECOMENDADO - Estándar en proyectos React):
  src/
  ├── index.tsx
  ├── components/
  ├── utils/
  ├── hooks/
  └── Data/
  
Ventajas:
  ✅ Estándar en industry
  ✅ Separación clara: src/ (código) vs tools/ (config)
  ✅ Facilita build tools
  
Desventajas:
  ❌ Requiere actualizar imports en muchos archivos
  ❌ Requiere actualizar tsconfig.json
  ❌ Requiere actualizar vite.config.ts
```

**RECOMENDACIÓN:** Hacer esta separación ahora, costará 1-2 horas pero ahorrará problemas después.

---

### **2. Dónde poner .env files**
```
Opción A (RECOMENDADO):
  env/
  ├── .env
  ├── .env.example
  ├── .env.local
  └── README.md (instrucciones)
  
Opción B (Alternativa):
  Mantener en root (estándar, pero menos limpio)
  
RECOMENDACIÓN: Crear env/ por claridad, pero considerar
que esto requiere actualizar scripts build en package.json
```

---

### **3. Qué archivos dejar en Root**

**SIEMPRE en root (estándar):**
- `package.json` ✅
- `README.md` ✅
- `LICENSE` ✅
- `.gitignore` ✅

**RECOMENDADO dejar en root (visibilidad):**
- `AGENTS.md` (importante para dev)
- `MEMORY.md` (importante para dev)
- `SKILLS_README.md` (importante para dev)
- `PLAN-MULTICLASS-IMPLEMENTATION.md` (plan actual activo)

**Estos DEBEN moverse:**
- Docs: → `docs/`
- Configs: → `config/`
- Scripts: → `scripts/`

---

## 📊 Impacto Estimado

| Aspecto | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Archivos en root** | 50+ | 8-10 | 80-90% reducción |
| **Claridad** | 🔴 Muy confuso | 🟢 Claro | Excelente |
| **Onboarding dev** | ❌ Difícil encontrar qué leer | ✅ Carpeta `docs/GETTING-STARTED/` claro | Mucho mejor |
| **Tiempo para actualizar imports** | N/A | 1-2 horas | Una sola vez |
| **Mantenimiento futuro** | 🔴 Difícil | 🟢 Fácil | Mejor |

---

## 🚨 Riesgos & Mitigaciones

| Riesgo | Severidad | Mitigación |
|--------|-----------|-----------|
| Romper imports si no se actualiza todo | 🔴 ALTO | Hacer búsqueda global de imports antes de mover |
| Build tools no encuentran archivos | 🔴 ALTO | Actualizar vite.config.ts, tsconfig.json primero |
| Scripts CI/CD se rompen | 🟡 MEDIO | Revisar package.json y scripts build |
| Git history se confunde con movimientos | 🟡 MEDIO | Usar `git mv` en lugar de copy-paste |
| Alguien más está trabajando simultáneamente | 🟡 MEDIO | Comunicar antes de hacer cambios |

---

## ✅ Recomendación Final

### **Opción 1: Reorganización COMPLETA (recomendado)**
- ⏱️ **Tiempo:** 3-4 horas
- 📦 **Alcance:** Mover TODO a nueva estructura
- 👍 **Pros:** Proyecto limpio y profesional
- 👎 **Contras:** Más trabajo ahora, pero vale la pena

**Pasos:**
1. Fase 1: Crear carpetas (30 min)
2. Fase 2: Mover archivos (1-2 horas)
3. Fase 3: Actualizar imports y configs (1-2 horas)
4. Testing: Verificar que build funciona (30 min)

### **Opción 2: Reorganización PROGRESIVA (menos riesgoso)**
- ⏱️ **Tiempo:** 1-2 horas por semana
- 📦 **Alcance:** Mover categoría por categoría
- 👍 **Pros:** Menos riesgo, más iterativo
- 👎 **Contras:** Toma más tiempo total

**Pasos:**
1. Semana 1: Mover docs + crear estructura
2. Semana 2: Mover scripts
3. Semana 3: Refactor src/
4. Etc.

---

## 📝 Preguntas para Ti

1. **¿Hacemos la reorganización COMPLETA ahora o PROGRESIVA?**
2. **¿Debo crear la carpeta `/src/` o dejar componentes/utils/etc en root?**
3. **¿Qué pasa con `.env` - lo movemos a `env/` o lo dejamos?**
4. **¿Hay archivos que NO deberían moverse?**

---

**¿Aprobamos esta propuesta? ¿Prefieres Opción 1 o 2?** 🚀
