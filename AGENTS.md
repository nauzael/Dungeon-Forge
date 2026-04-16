# Dungeon Forge - Development Guide

## Project Overview

**Dungeon Forge** es una app de gestión de personajes D&D 5e (2024) construida con React 19, TypeScript, y Tailwind CSS. Corre en web y compila a Android/iOS via Capacitor.

## Commands

```bash
npm run dev              # Dev server (http://localhost:5173)
npm run build            # Production build → dist/
npm run preview          # Preview prod build
cd android && ./gradlew assembleDebug   # Android APK
```

## Tech Stack

| Componente | Tecnología |
|------------|------------|
| Frontend | React 19, TypeScript (strict) |
| Estilos | Tailwind CSS, Material Symbols |
| Build | Vite |
| Mobile | Capacitor 6 |
| Backend | Supabase (auth + realtime) |
| PWA | Service Worker + manifest.json |

## Reglas Críticas

### TypeScript
- `strict: true` → sin `any`, tipos explícitos
- Interfaces para datos → exportar de `types.ts`
- `React.FC<Props>` para componentes
- `useState<T>` con genérico explícito

### React Patterns
- Componentes funcionales con hooks
- Lazy loading: `const Component = lazy(() => import('./path'))`
- Siempre retornar cleanup de `useEffect`

### Import Order
```typescript
import React, { useState } from 'react';           // 1. React
import { something } from 'library';               // 2. External
import { Character } from './types';               // 3. Types
import { MOCK_CHARACTERS } from './constants';    // 4. Constants
import CharacterList from './CharacterList';       // 5. Components
```

### Naming Conventions
- **Componentes**: PascalCase → `CharacterList.tsx`
- **Interfaces**: PascalCase → `InventoryItem`, `Character`
- **Functions/Variables**: camelCase → `handleCreateNew`
- **Files**: kebab-case → `sheetUtils.ts`

### Error Handling
```typescript
try {
  localStorage.setItem('key', JSON.stringify(data));
} catch (e) {
  console.error("Failed:", e);
}
```

### Tailwind CSS
- Dark mode: `dark:` prefix
- CSS variables: `bg-background-dark`, `text-primary`
- Mobile-first: `max-w-md container`
- Icons: `<span className="material-symbols-outlined">icon</span>`

## Data Types (types.ts)

```typescript
type ViewState = 'list' | 'create' | 'sheet' | 'dm-dashboard' | 'observer-sheet';
type SheetTab = 'combat' | 'inventory' | 'spells' | 'features' | 'notes';
type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

interface Character { id, name, level, class, species, hp, stats, inventory... }
interface InventoryItem { id, name, quantity, equipped }
interface Spell { name, level, school, range, components, duration, description }
```

## Data Organization

```
Data/
├── classes/       # 12 archivos (barbarian.ts, wizard.ts, etc.)
├── species/       # Especies D&D 5e
├── spells/        # Por nivel (cantrips.ts, level1.ts...level9.ts)
├── items.ts       # Equipment y items
├── feats.ts       # Feats
├── skills.ts     # Skill definitions
└── backgrounds.ts # Backgrounds
```

## State Management

- **Local**: `useState<T>`, `useReducer`
- **Persistence**: localStorage con debounce 300ms
- **Cloud**: Supabase realtime channels
- **Cleanup**: Siempre unsubscribe de canales

## UI Components

- Material Symbols Outlined para iconos
- Dark/light theme con CSS variables
- Sticky headers con safe-area padding
- Responsive mobile-first

## Notas Importantes

1. **No tests** → no escribir tests a menos que se agregue framework
2. **Español/English mixed** → UI en español, comentarios también
3. **Mobile-first** → target principal es mobile web (PWA)
4. **Context7** → usar para verificar APIs externas

## Skills Disponibles

Ubicar en `.agents/skills/`:

| Skill | Usar Para |
|-------|-----------|
| frontend-ui-engineering | UI components, diseño |
| spec-driven-development | PRD antes de código |
| planning-and-task-breakdown | Descomponer tareas |
| code-review-and-quality | QA antes de merge |
| debugging-and-error-recovery | Bugs y errores |
| performance-optimization | Optimizar rendimiento |
| context-engineering | Optimizar contexto agente |
| incremental-implementation | Cambios multi-archivo |
