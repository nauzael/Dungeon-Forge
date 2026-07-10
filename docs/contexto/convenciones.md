# Convenciones

## Estilo de Código

- **TypeScript strict** — sin `any`, tipos explícitos en todo.
- **Prettier** — single quotes, trailing commas `es5`, printWidth 100, semi siempre.
- **ESLint** — flat config con `typescript-eslint`, `react`, `react-hooks`, `jsx-a11y`. Cero warnings.
- **Import order** (documentado en AGENTS.md, verificado en código):
  1. React / hooks
  2. Librerías externas (Capacitor, Firebase, DOM)
  3. Types (`../../types`)
  4. Constants (`../../constants`)
  5. Data de juego (`../../Data/...`)
  6. Utils
  7. Contexts
  8. Hooks
  9. Componentes

## Naming

- **Componentes:** PascalCase → `CharacterList.tsx`
- **Interfaces:** PascalCase → `InventoryItem`, `Character`
- **Funciones/variables:** camelCase → `handleCreateNew`
- **Archivos:** kebab-case → `sheetUtils.ts`
- **Tipos unión:** PascalCase → `ViewState`, `SheetTab`, `Ability`
- **Hooks:** prefijo `use` → `useAuth`, `useCharacters`

## Patrones Obligatorios

- **Functional components** con `React.FC<Props>` — sin clases.
- **Lazy loading** para vistas pesadas: `lazy(() => import('./path'))` + `<Suspense>`.
- **Cleanup de effects** siempre: retornar función en `useEffect`.
- **`useCallback`** en handlers pasados a hijos memoizados.
- **`memo`** en componentes que reciben props estables (SheetTabs, CharacterList).
- **Refs para IDs activos** fuera de closures: `const activeIdRef = useRef(id)` + efecto para sincronizar.
- **Functional updater** en `setCharacters(prev => prev.map(...))` para evitar stale closures.

### Patrón de Persistencia

```typescript
// localStorage siempre, cloud con debounce 500ms
useEffect(() => {
  localStorage.setItem(KEY, JSON.stringify(characters));
  const timeout = setTimeout(async () => {
    for (const dirty of dirtyChars) await saveToCloud(dirty);
  }, 500);
  return () => clearTimeout(timeout);
}, [characters]);
```

## Prohibiciones

- **No `any`** — si es inevitable, documentar con comentario.
- **No `require()`** — usar ES module `import`.
- **No mutar `characters` directamente** — siempre `setCharacters(fn)`.
- **No generar `Date.now()` nuevo en persist effect** — usar `char.syncTimestamp` existente.
- **No llamar `broadcastCharacterUpdate()` dentro de handlers** — hacerlo en persist effect.
- **No spread desde variable de closure** en handlers de HP/rest — spread desde `prev` parameter.

## Tests

- **Framework:** Vitest + jsdom + @testing-library/react.
- **Ubicación:** `tests/` (raíz, no junto a componentes).
- **Helpers inline** — `createValidCharacter(overrides)` en cada test file.
- **E2E:** Playwright en `e2e/`, mobile-first (390×844), chromium-only, contra Vercel.
- **Sin tests de componentes para UI pura** — solo lógica y validación por ahora.
- **Cobertura:** ~3% (117 tests / ~39k LOC).

## Commits

- **Formato:** `tipo: mensaje descriptivo` — ej: `fix:`, `feat:`, `perf:`, `chore:`, `docs:`, `security:`.
- **Commits con contexto:** el cuerpo explica el problema + solución + archivos tocados.
- **Tags semánticos:** `v1.0.0`, `v1.1.0`.
- **Ramas estables inmutables:** `stable-v1.0`, `stable-v1.1`.
