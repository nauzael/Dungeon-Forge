---
name: "dungeon-forge-react"
description: "React patterns and rules for Dungeon Forge"
paths:
  - "**/*.tsx"
  - "**/*.ts"
---

# Dungeon Forge React Rules

## Component Patterns

### Always use React.FC for components
```typescript
const MyComponent: React.FC<MyProps> = ({ prop1, prop2 }) => {
  // ...
};
```

### Always use explicit generic for useState
```typescript
// ❌ Bad
const [state, setState] = useState(null);

// ✅ Good
const [state, setState] = useState<string | null>(null);
```

### Always return cleanup from useEffect
```typescript
// ❌ Bad
useEffect(() => {
  subscribe();
}, [id]);

// ✅ Good
useEffect(() => {
  const cleanup = subscribe();
  return () => cleanup();
}, [id]);
```

### Use lazy loading for route components
```typescript
const CreatorSteps = lazy(() => import('./components/CreatorSteps'));
// Always wrap in <Suspense>
```

## Import Order

1. React core: `import React, { useState, useEffect } from 'react';`
2. External libraries
3. Internal types: `import { Character, Spell } from '../types';`
4. Internal constants
5. Internal components

## Memory Leak Prevention

### Event Listeners
```typescript
useEffect(() => {
  const listener = CapacitorApp.addListener('appStateChange', handler);
  return () => listener.remove(); // Always store and remove!
}, []);
```

### Intervals
```typescript
useEffect(() => {
  const interval = setInterval(fn, 1000);
  return () => clearInterval(interval);
}, []);
```

## Props Drilling

Avoid passing props through 5+ levels. Use context or consider if state should be lifted.

## localStorage

Always wrap in try/catch:
```typescript
try {
  localStorage.setItem('key', JSON.stringify(data));
} catch (e) {
  console.error("Failed to save:", e);
}
```

Check for QuotaExceededError specifically:
```typescript
if (error instanceof Error && 
    (error.name === 'QuotaExceededError' || 
     error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
  alert("⚠️ Memory Alert! Local storage is full.");
}
```
