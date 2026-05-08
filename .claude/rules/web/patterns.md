---
description: "Web patterns - components, state management, data fetching"
alwaysApply: true
---

# Web Patterns - Dungeon Forge

## Component Composition

### Compound Components

Para UI relacionada con estado e interacción compartida:

```tsx
<SpellBook>
  <SpellBook.Filter />
  <SpellBook.List>
    <SpellBook.Spell />
  </SpellBook.List>
</SpellBook>
```

- Parent ownership del estado
- Children consumen via context
- Preferir sobre prop drilling

## State Management

Separar concerns:

| Concern | Tool |
|---------|------|
| Server state | Supabase |
| Client state | useState/useReducer |
| URL state | URL params |
| Form state | useState o custom hooks |

## Optimistic Updates

Para cloud sync:

1. Snapshot estado actual
2. Apply update optimista
3. Rollback en failure
4. Feedback visual de error

```typescript
const saveOptimistic = async (character: Character) => {
  const snapshot = charactersRef.current;
  setCharacters(prev => prev.map(c => c.id === character.id ? character : c));
  
  try {
    await saveToCloud(character);
  } catch {
    setCharacters(snapshot); // rollback
    showError();
  }
};
```

## URL As State

Persistir estado compartible en URL:
- filtros de búsqueda
- sort order
- tab activo
- personaje seleccionado

## Data Fetching

### Parallel Loading
- Fetch data independiente en paralelo
- Evitar parent-child request waterfalls
- Prefetch likely next routes

## Image Optimization

- Explicit `width` y `height`
- `loading="lazy"` para assets below-the-fold
- Optimizar imágenes antes de servir

## Loading States

Siempre mostrar feedback:
```tsx
{isLoading ? <Spinner /> : <Content />}
{error && <ErrorMessage error={error} />}
```

## Responsive Design

Mobile-first:
```tsx
<div className="max-w-md mx-auto">
  {/* Mobile optimized content */}
</div>
```
