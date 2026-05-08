---
description: "TypeScript patterns - interfaces, types, exports"
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript Patterns - Dungeon Forge

## Type Safety

### Strict Mode is ON
- Todos los tipos deben ser explícitos
- No `any` sin razón válida
- Usar `unknown` para datos externos, luego narrowing

### Evitar `any`
```typescript
// ❌ Mal
const handleData = (data: any) => { ... };

// ✅ Bien
const handleData = (data: CharacterUpdate) => { ... };

// Si es realmente unknown:
const parseExternal = (data: unknown): Character | null => {
  if (typeof data !== 'object' || data === null) return null;
  // narrowing seguro
};
```

## Interfaces para Datos

```typescript
// ✅ Bien - exportados desde types.ts
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  equipped: boolean;
}

// ❌ Mal - tipo inline
const item: { id: string; name: string } = { ... };
```

## Types para Uniones

```typescript
type ViewState = 'list' | 'create' | 'sheet' | 'dm-dashboard';
type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
type SheetTab = 'combat' | 'inventory' | 'spells' | 'features' | 'notes';
```

## Exports de Types

Todos los tipos compartidos van en `types.ts`. Componentes importan de ahí.

## Generic Constraints

Explícitos con generics:
```typescript
// ❌ Mal
const getItem = <T>(arr: T[], id: string): T | undefined => ...

// ✅ Bien
const getItem = <T extends { id: string }>(arr: T[], id: string): T | undefined => ...
```

## Null Checks

Siempre manejar undefined/null explícitamente:
```typescript
// ✅ Bien
const name = character?.name ?? 'Unknown';

// ❌ Mal - undefined silencioso
const name = character.name;
```

## Type Narrowing

Usar type guards para datos externos:
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

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Repository Pattern

```typescript
interface CharacterRepository {
  findAll(): Promise<Character[]>;
  findById(id: string): Promise<Character | null>;
  create(data: CreateCharacterDto): Promise<Character>;
  update(id: string, data: Partial<Character>): Promise<Character>;
  delete(id: string): Promise<void>;
}
```
