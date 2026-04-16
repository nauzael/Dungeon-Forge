---
name: "dungeon-forge-typescript"
description: "TypeScript rules for Dungeon Forge"
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Dungeon Forge TypeScript Rules

## Type Safety

### Strict Mode is ON
- All types must be explicit
- No `any` without good reason
- Use `unknown` for external data, then narrow

### Avoid `any`
```typescript
// ❌ Bad
const handleData = (data: any) => { ... };

// ✅ Good
const handleData = (data: CharacterUpdate) => { ... };

// If truly unknown:
const parseExternal = (data: unknown): Character | null => {
  if (typeof data !== 'object' || data === null) return null;
  // narrow safely
};
```

### Use interfaces for data structures
```typescript
// ✅ Good - exported from types.ts
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  equipped: boolean;
}

// ❌ Bad - inline type
const item: { id: string; name: string } = { ... };
```

### Use `type` for unions and primitives
```typescript
type ViewState = 'list' | 'create' | 'sheet' | 'dm-dashboard';
type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
```

## Type Exports

All shared types go in `types.ts`. Components import from there.

## Generic Constraints

Be explicit with generics:
```typescript
// ❌ Bad
const getItem = <T>(arr: T[], id: string): T | undefined => ...

// ✅ Good
const getItem = <T extends { id: string }>(arr: T[], id: string): T | undefined => ...
```

## Null Checks

Always handle undefined/null explicitly:
```typescript
// ✅ Good
const name = character?.name ?? 'Unknown';

// ❌ Bad - silent undefined
const name = character.name;
```

## Type Narrowing

Use type guards for external data:
```typescript
const isCharacter = (obj: unknown): obj is Character => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'class' in obj &&
    'level' in obj
  );
};
```
