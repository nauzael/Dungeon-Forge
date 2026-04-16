# Dungeon Forge - AI Development Context

## Brain Dump (Load First)

**Project:** D&D 5e (2024) character management companion - React 19, TypeScript, Tailwind, Capacitor mobile, Supabase cloud sync (Gemini AI removed)

**Tech Stack:** React 19, TypeScript strict, Vite, Capacitor, Supabase (auth + realtime)

**Commands:** `npm run dev` (dev), `npm run build` (prod), `cd android && ./gradlew assembleDebug` (Android)

**UI Language:** Spanish (usuario prefiere español para toda la interfaz)

**Critical Rules:**
- No test framework → no escribir tests
- Strict TypeScript → sin `any`, tipos explícitos
- Mobile-first → max-w-md, safe-area padding
- Spanish UI text → comentarios también en español
- localStorage: siempre try/catch + debounce 300ms

## Code Patterns

### Component Template
```typescript
import React, { useState, useEffect } from 'react';
import { Character } from '../types';

interface Props { character: Character; onUpdate: (c: Character) => void; }

const Component: React.FC<Props> = ({ character, onUpdate }) => {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    const cleanup = subscribe();
    return () => cleanup(); // ⚠️ Siempre cleanup
  }, []);

  return <div className="...">...</div>;
};
export default Component;
```

### Import Order
1. React: `import React, { useState } from 'react';`
2. External: `import { something } from 'library';`
3. Types: `import { Character } from '../types';`
4. Constants: `import { MOCK_CHARACTERS } from '../constants';`
5. Components: `import CharacterList from './CharacterList';`

### localStorage Pattern
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    try {
      localStorage.setItem('key', JSON.stringify(data));
    } catch (e) {
      console.error("Save failed:", e);
    }
  }, 300);
  return () => clearTimeout(timer);
}, [data]);
```

## Project Structure

```
components/
├── CharacterList.tsx      # Lista de personajes
├── CreatorSteps.tsx       # 5 pasos creación
├── SheetTabs.tsx          # Tabs: combat|inventory|spells|features|notes
├── Login.tsx              # Supabase OAuth
├── DMDashboard.tsx        # Panel DM
└── sheet/
    ├── CombatTab.tsx      # ⚠️ ~1200 lines - refactor candidate
    ├── SpellsTab.tsx      # ~732 lines
    └── LevelUpWizard/    # Wizard para subir nivel
Data/
├── classes/*.ts           # 12 clases D&D 5e 2024
├── species/*.ts           # Especies
├── spells/level*.ts       # Hechizos por nivel
├── items.ts               # Equipment
└── backgrounds.ts        # Backgrounds
```

## Key Interfaces (types.ts)

```typescript
type ViewState = 'list' | 'create' | 'sheet' | 'dm-dashboard' | 'observer-sheet';
type SheetTab = 'combat' | 'inventory' | 'spells' | 'features' | 'notes';
type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

interface Character {
  id: string; name: string; level: number; class: string; species: string;
  hp: { current: number; max: number; temp: number };
  stats: Record<string, number>; inventory: InventoryItem[];
  // ... 50+ más campos para recursos de clase, hechizos, etc.
}
```

## Common Patterns

### Memoize Game Calculations
```typescript
const finalStats = useMemo(() => getFinalStats(character), [character]);
const ac = useMemo(() => calculateAC(character, finalStats), [character]);
```

### Lazy Load Routes
```typescript
const SheetTabs = lazy(() => import('./components/SheetTabs'));
// Wrap: <Suspense fallback={<Loading />}><SheetTabs /></Suspense>
```

### Supabase Channel Cleanup
```typescript
useEffect(() => {
  const channel = supabase.channel('party-123');
  channel.subscribe();
  return () => channel.unsubscribe();
}, []);
```

## Red Flags (No Hacer)

| ❌ No | ✅ Hacer |
|-------|---------|
| `useState(null)` | `useState<Type>(null)` |
| `data: any` | `data: Character` |
| `localStorage.setItem()` sin try/catch | try/catch + debounce |
| Componente > 500 líneas | Split en sub-componentes |
| Props drilling > 4 niveles | Context o lift state |

## .claude/ Structure

```
.claude/
├── settings.json        # Permisos y configuración global
├── commands/            # Slash commands personalizados
├── hooks/               # Scripts pre/post herramienta
├── skills/              # 9 skills disponibles
│   ├── code-review-and-quality/
│   ├── context-engineering/
│   ├── debugging-and-error-recovery/
│   ├── frontend-ui-engineering/
│   ├── gsap-core/
│   ├── incremental-implementation/
│   ├── performance-optimization/
│   ├── planning-and-task-breakdown/
│   └── spec-driven-development/
├── rules/               # Reglas modulares (ECC-based + Dungeon Forge)
│   ├── common/          # Reglas universales
│   │   ├── coding-style.md    # KISS, DRY, YAGNI, naming
│   │   ├── security.md        # Secrets, XSS, inputs
│   │   └── performance.md     # useMemo, debounce, cleanup
│   ├── typescript/      # Reglas TypeScript/React
│   │   ├── patterns.md        # Interfaces, types, exports
│   │   └── react-hooks.md     # useState, useEffect, cleanup
│   ├── web/             # Reglas Web/Frontend
│   │   ├── patterns.md        # Compound components, state
│   │   ├── performance.md    # Core Web Vitals
│   │   └── security.md        # CSP, HTTPS headers
│   ├── dungeon-forge-typescript.md  # Legacy
│   ├── dungeon-forge-react.md       # Legacy
│   └── dungeon-forge-performance.md # Legacy
└── CLAUDE.md            # Este archivo
```

## Rules Integration

Las reglas fueron adaptadas de **everything-claude-code** (ECC) 140K+ stars e integradas con las reglas existentes de Dungeon Forge.

### Orden de precedencia:
1. `rules/common/*` - Siempre aplican (alwaysApply: true)
2. `rules/typescript/*` - Para archivos .ts/.tsx
3. `rules/web/*` - Para frontend web/mobile
4. `rules/dungeon-forge-*.md` - Legacy, mantenido por compatibilidad

## Skills Available

Usar skill apropiada según tarea:
| Skill | Uso |
|-------|-----|
| **frontend-ui-engineering** | UI components, diseño, layouts |
| **spec-driven-development** | Antes de features nuevas, SPEC.md |
| **planning-and-task-breakdown** | Tasks complejas, descomponer |
| **debugging-and-error-recovery** | Bugs, errores, troubleshooting |
| **code-review-and-quality** | QA antes de merge, calidad código |
| **context-engineering** | Optimizar contexto, rendimiento |
| **incremental-implementation** | Cambios multi-archivo, incremental |
| **performance-optimization** | Core Web Vitals, optimizaciones |
| **gsap-core** | Animaciones, GSAP animations |
