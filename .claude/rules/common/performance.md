---
description: "Performance optimization - bundle, calculations, context"
alwaysApply: true
---

# Performance Rules - Dungeon Forge

## Core Web Vitals Target

| Métrica | Target |
|---------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |

## Cálculos Costosos (D&D Game Logic)

### Siempre usar useMemo para cálculos de juego
```typescript
const finalStats = useMemo(() => getFinalStats(character), [character]);
const armorClass = useMemo(() => calculateAC(character), [character]);
```

Funciones como `getFinalStats`, `getArmorClass` se llaman frecuentemente. SIEMPRE memoizar.

### Memoizar lookups de items
```typescript
const itemData = useMemo(() => findItemData(item.name), [item.name]);
```

## Debouncing

### Saves a localStorage
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    try {
      localStorage.setItem('dnd-characters', JSON.stringify(data));
    } catch (e) {
      console.error("Save failed:", e);
    }
  }, 300); // 300ms debounce
  return () => clearTimeout(timer);
}, [data]);
```

## Large Components

Componentes >500 líneas deben ser divididos:
- Extraer modales a componentes separados
- Extraer cards de sección
- SheetTabs, CombatTab, SpellsTab son candidates

## Animaciones

- Usar CSS transitions para efectos simples
- `will-change` para animaciones GPU
- Evitar animaciones en scroll handlers

## Cleanup

- Unsubscribe de canales Supabase
- Remover event listeners
- Limpiar intervals en useEffect
