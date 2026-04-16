# Dungeon Forge - Project Memory

Auto-captured learnings and patterns specific to this project.

---

## Project Context

- **Type**: React 19 + TypeScript + Vite PWA for D&D 5e character management
- **Target**: Mobile-first (Capacitor for iOS/Android)
- **Backend**: Supabase (real-time sync, auth)
- **UI**: Spanish primary, dark theme with gold accents
- **Note**: No test framework - do not write tests unless one is added

---

## Code Quality Patterns

### ✅ Good Patterns Observed

- Lazy loading with Suspense for route components
- localStorage wrapped in try/catch in App.tsx
- Debounced saves (300ms) for character updates
- useMemo for expensive calculations (getFinalStats, getArmorClass)
- Cleanup functions in useEffect (most cases)
- Type exports from types.ts for shared interfaces

### ⚠️ Issues Detected (Require Attention)

- **Race conditions in sync logic** (`App.tsx:178-195`): `setCharacters` closure captures stale state during cloud sync
- **JSON import validation**: Now validates structure (name, class, level, hp) before accepting

### 🔧 Debugging Patterns

- `console.error` for logging errors
- QuotaExceededError handling for localStorage full
- Alert-based user notifications for critical errors

---

## Architecture Decisions

### Why This Structure

- **Components at root level**: Easy imports, no deep nesting
- **Data files in `Data/`**: Spells by level, classes by name, items consolidated
- **Utilities in `utils/`**: sheetUtils for game calculations, supabase for cloud sync
- **Types centralized in `types.ts`**: Single source of truth for interfaces

### State Management

- React useState/useEffect for local component state
- localStorage for persistence (with debounce)
- Supabase Realtime for party sync (broadcast channels)
- No external state library needed for this scale

---

## Import Conventions

```typescript
// Order matters:
1. React core: 'react'
2. External libraries: '@capacitor/*', '@supabase/*', etc.
3. Internal types: '../types', './types'
4. Internal constants: '../constants', './constants'
5. Internal components: '../components/*'
```

---

## React Patterns

- `React.FC<Props>` for component typing
- `useState<T>` with explicit generic
- `useEffect` always returns cleanup function
- Lazy loading: `const Component = lazy(() => import('./path'))`
- Wrap lazy in `<Suspense>`

---

## File Naming

- **Components**: PascalCase (`CharacterList.tsx`, `SheetTabs.tsx`)
- **Utils/Hooks/Constants**: kebab-case (`sheetUtils.ts`, `useLanguage.ts`)
- **Types**: PascalCase in `types.ts`

---

## Supabase Integration

- **Auth**: Email/password via Supabase
- **Realtime**: Party channels for character sync
- **Broadcast**: `character-update` for HP/slots, `resource-share` for DM maps
- **Fallback**: localStorage persistence if Supabase unavailable

---

## OTA Updates

- Uses `@capgo/capacitor-updater`
- Version checked every 10 minutes + on app resume
- Downloads from Supabase storage bucket `updates`
- User confirms before install

---

## Last Updated

2026-04-05 - Cleaned stale FIXED/CONSOLIDATED entries

## Tags

#react #typescript #capacitor #supabase #dnd5e #mobile-first
