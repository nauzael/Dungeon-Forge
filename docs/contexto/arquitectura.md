# Arquitectura

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + TypeScript | 19 / 5.4 (strict) |
| Build | Vite | 5.2 |
| Estilos | Tailwind CSS | 3.4 |
| Mobile | Capacitor | 6 |
| Backend | Firebase (Auth, Firestore, RTDB, Storage) | 12.13 |
| Testing | Vitest + Playwright | 4.1 / 1.59 |
| OTA | @capgo/capacitor-updater | 6 |
| PWA | Service Worker propio + manifest.json | — |

## Mapa de Carpetas

```
G:\Apks\Dungeon Forge\
├── App.tsx                  # Root: view state machine, lazy loading, sync orchestration
├── index.tsx                # Entry: createRoot + StrictMode + ErrorBoundary
├── index.css                # Design tokens, animations, safe-area, scrollbars
├── types.ts                 # Interfaz Character (~80 campos) + todos los tipos del dominio
├── constants.ts             # Storage keys, icon maps
├── manifest.json / sw.js    # PWA
│
├── src/
│   ├── components/
│   │   ├── creator/         # Wizard de creación (5 pasos)
│   │   ├── sheet/           # Hoja de personaje (pestañas combate/inventario/spells/etc.)
│   │   ├── sheet/LevelUpWizard/  # Subida de nivel (11 pasos)
│   │   ├── sheet/WildShape/      # Transformación druida
│   │   ├── dm/              # Herramientas de DM
│   │   ├── DMDashboard/     # Panel de DM completo
│   │   └── (raíz)           # CharacterList, Login, SheetTabs, SyncStatus, etc.
│   ├── contexts/            # ThemeContext, DialogContext, SyncContext
│   ├── hooks/               # useAuth, useCharacters, useSync
│   ├── types/               # theme.ts
│   └── constants/           # themes.ts, tags.ts
│
├── hooks/                   # 11 hooks adicionales (useDMParty, useRage, useInitiativeTracker…)
├── utils/
│   ├── firebase/            # init.ts, auth.ts, db.ts, subscriptions.ts
│   ├── sheetUtils.ts        # 1398 líneas — cálculos de stats, AC, daño
│   └── (validators, levelReset, wildShape, rage, logger…)
│
├── Data/                    # Compendio D&D 5e 2024
│   ├── classes/ (13+1)      # 12 clases oficiales + Pugilist (homebrew)
│   ├── species/             # Especies jugables
│   ├── spells/ (11 archivos) # Cantrips + niveles 1-9
│   ├── items.ts (772 líneas) # Armas, armaduras, equipo
│   └── (feats, skills, backgrounds, beasts, monsters…)
│
├── docs/                    # Documentación del proyecto (~60 archivos)
├── e2e/                     # Tests Playwright (3 specs)
├── tests/                   # Tests Vitest (7 archivos, 117 tests)
├── scripts/                 # Build, OTA, migración, CORS, debugging
└── android/                 # Proyecto nativo Capacitor Android
```

## Flujo de Datos

```
Usuario → [Login (Google OAuth / Local)]
   ↓
[App.tsx] ← useAuth() → Firebase Auth
   ↓
[useCharacters()] → localStorage (carga inicial + persistencia local)
   ↓
[useSync()] ──→ Firestore (characters/{id} → save/load con debounce 500ms)
             ──→ RTDB (parties/{partyId}/characters/{id} → broadcast en vivo)
             ──→ Broadcast loopback con guardia de timestamp
   ↓
[SheetTabs / CreatorSteps] → read characters[] + handlers desde props
   ↓
[Componentes hoja] → llaman onUpdate / onFastUpdate → suben a App → sync loop
   ↓
[Persist Effect] → localStorage + Firestore (con dirty tracking) → broadcast RTDB post-save
```

### Flujo OTA

```
build → dist/ → build_ota.mjs → ZIP + version.json → Firebase Storage ("updates")
App → fetch version.json → comparar → CapacitorUpdater.download() → set() + restart
```

## Qué NO Existe

- **No hay store global** (Redux, Zustand, etc.). Todo es `useState` + context + props drilling.
- **No hay `useReducer`** en todo el código base.
- **No hay CI/CD automatizado** (sin GitHub Actions, sin GitLab CI, sin Docker).
- **No hay tests de integración automatizados** — los 3 tests E2E de Playwright se corren manuales contra Vercel.
- **No hay `.claude/` ni `.opencode/` en disco** — existen solo como documentación de estructura intencionada.
- **No hay migraciones de base de datos versionadas** — las migraciones se aplican en `characterMigrations.ts` al cargar.
- **No hay server-side rendering** — SPA pura con Vite.
