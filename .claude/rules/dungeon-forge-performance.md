---
name: "dungeon-forge-performance"
description: "Performance rules for Dungeon Forge"
paths:
  - "**/*.tsx"
  - "**/*.ts"
---

# Dungeon Forge Performance Rules

## Expensive Calculations

### Use useMemo for game calculations
```typescript
const finalStats = useMemo(() => getFinalStats(character), [character]);
const armorClass = useMemo(() => getArmorClass(character, finalStats), [character, finalStats]);
```

Functions like `getFinalStats`, `getArmorClass`, `getACBreakdown` are called frequently. Always memoize when the result depends on character state.

### Memoize item lookups
```typescript
const itemData = useMemo(() => getItemData(item.name), [item.name]);
```

`getItemData` uses regex matching - don't call in render loops.

## Debouncing

### Character saves to localStorage
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('dnd-characters', JSON.stringify(characters));
  }, 300); // 300ms debounce
  return () => clearTimeout(timer);
}, [characters]);
```

### Cloud sync
Same pattern - don't sync on every keystroke.

## Large Files

Components over 500 lines should be split:
- Extract modal dialogs to separate components
- Extract section cards to sub-components
- Keep main component focused on composition

Known large files:
- `CombatTab.tsx` (~1200 lines) - priority refactor candidate
- `SpellsTab.tsx` (~732 lines)
- `CreatorSteps.tsx` (~560 lines)

## React.memo

Use for list item components:
```typescript
const WeaponCard: React.FC<WeaponProps> = memo(({ weapon, onEquip }) => {
  // ...
});
```

## Cleanup

### Unsubscribe from Supabase channels
```typescript
useEffect(() => {
  const channel = supabase.channel('party-123');
  channel.subscribe();
  return () => channel.unsubscribe();
}, []);
```

### Remove event listeners
Store references for cleanup:
```typescript
const listenerRef = useRef<{ remove: () => void } | null>(null);

useEffect(() => {
  listenerRef.current = CapacitorApp.addListener('appStateChange', handler);
  return () => listenerRef.current?.remove();
}, []);
```
