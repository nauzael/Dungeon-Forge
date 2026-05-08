---
description: "Core coding principles - immutability, KISS, DRY, YAGNI"
alwaysApply: true
---

# Coding Style - Dungeon Forge

## Immutabilidad (CRÍTICO)

SIEMPRE crear nuevos objetos, NUNCA mutar existentes:

```typescript
// ❌ Mal: modifica el original
const modify = (character, field, value) => {
  character[field] = value;
  return character;
};

// ✅ Bien: retorna nueva copia
const update = (character, field, value) => ({
  ...character,
  [field]: value
});
```

## Principios Core

### KISS (Keep It Simple)
- Preferir la solución más simple que funcione
- Evitar optimización prematura
- Optimizar para claridad sobre ingenio

### DRY (Don't Repeat Yourself)
- Extraer lógica repetida en funciones compartidas
- Evitar copy-paste que cause drift
- Introducir abstracciones cuando hay repetición real

### YAGNI (You Aren't Gonna Need It)
- No construir features antes de que sean necesarias
- Evitar especulación

## Organización de Archivos

ARCHIVOS PEQUEÑOS > ARCHIVOS GRANDES:
- Alta cohesión, bajo acoplamiento
- 200-400 líneas típico, 800 máximo
- Extraer utilities de módulos grandes

## Manejo de Errores

SIEMPRE manejar errores:
- Try/catch en localStorage
- Mensajes de error claros en UI
- Nunca silenciar errores

## Validación de Inputs

Validar en límites del sistema:
- Validar todo input de usuario
- Usar tipos para seguridad
- Fail fast con errores claros

## Convenciones de Nombres

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Variables | camelCase | `characterName` |
| Booleanos | is/has/should | `isActive`, `hasFeat` |
| Interfaces | PascalCase | `Character`, `Spell` |
| Constantes | UPPER_SNAKE | `MAX_LEVEL` |
| Hooks | use前缀 | `useCharacter`, `useDebounce` |

## Code Smells a Evitar

- Anidamiento profundo (>4 niveles)
- Números mágicos
- Funciones largas (>50 líneas)
- Props drilling (>4 niveles)
