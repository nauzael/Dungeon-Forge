---
description: "React patterns - components, hooks, cleanup, state"
paths:
  - "**/*.tsx"
  - "**/*.ts"
---

# React Patterns - Dungeon Forge

## Component Patterns

### Usar React.FC para componentes
```typescript
const MyComponent: React.FC<MyProps> = ({ prop1, prop2 }) => {
  return <div>...</div>;
};
```

### Usar generic explícito en useState
```typescript
// ❌ Mal
const [state, setState] = useState(null);

// ✅ Bien
const [state, setState] = useState<string | null>(null);
```

### SIEMPRE retornar cleanup de useEffect
```typescript
// ❌ Mal
useEffect(() => {
  subscribe();
}, [id]);

// ✅ Bien
useEffect(() => {
  const cleanup = subscribe();
  return () => cleanup();
}, [id]);
```

### Lazy loading para rutas
```typescript
const CreatorSteps = lazy(() => import('./components/CreatorSteps'));
// Siempre envolver en <Suspense>
```

## Import Order

1. React core: `import React, { useState, useEffect } from 'react';`
2. Libraries externas
3. Types internos: `import { Character, Spell } from '../types';`
4. Constants internas
5. Componentes internos

## Memory Leak Prevention

### Event Listeners (Capacitor)
```typescript
useEffect(() => {
  const listener = CapacitorApp.addListener('appStateChange', handler);
  return () => listener.remove();
}, []);
```

### Intervals
```typescript
useEffect(() => {
  const interval = setInterval(fn, 1000);
  return () => clearInterval(interval);
}, []);
```

### Channel subscriptions (Supabase)
```typescript
useEffect(() => {
  const channel = supabase.channel('party-123');
  channel.subscribe();
  return () => channel.unsubscribe();
}, []);
```

## Props Drilling

Evitar pasar props por 5+ niveles. Usar context o lift state.

## localStorage Pattern

SIEMPRE try/catch:
```typescript
try {
  localStorage.setItem('key', JSON.stringify(data));
} catch (e) {
  console.error("Failed to save:", e);
}
```

Manejar QuotaExceededError:
```typescript
if (error instanceof Error && 
    error.name === 'QuotaExceededError') {
  alert("⚠️ Alerta! Almacenamiento local lleno.");
}
```

## Compound Components

Para UI relacionada con estado compartido:

```tsx
<Tabs defaultValue="combat">
  <Tabs.List>
    <Tabs.Trigger value="combat">Combate</Tabs.Trigger>
    <Tabs.Trigger value="inventory">Inventario</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="combat">...</Tabs.Content>
  <Tabs.Content value="inventory">...</Tabs.Content>
</Tabs>
```

- Parent ownership del estado
- Children consumen via context

## React.memo

Para list item components:
```typescript
const WeaponCard: React.FC<WeaponProps> = memo(({ weapon, onEquip }) => {
  return <div>...</div>;
});
```
