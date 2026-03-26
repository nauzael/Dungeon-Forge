# Task 004: Feats Data - Crear datos de feats bilingües

## Objetivo

Crear archivos de datos con todas las dotes en español e inglés.

## BDD Scenario

```gherkin
Scenario: Mostrar dotes en español
  Given el idioma está en español
  When se muestran las dotes del personaje
  Then aparecen con nombres y descripciones en español

Scenario: Mostrar dotes en inglés
  Given el idioma está en inglés
  When se muestran las dotes del personaje
  Then aparecen con nombres y descripciones en inglés
```

## Pasos

1. Leer `Data/feats.ts` actual para entender estructura
2. Crear `Data/feats/feats-es.ts` con todas las dotes en español
3. Crear `Data/feats/feats-en.ts` con todas las dotes en inglés
4. Crear `Data/feats/index.ts` que exporta el archivo correcto según idioma

## Estructura de datos

```typescript
export const FEATS_ES: Feat[] = [
  {
    name: 'Iniciado en la magia (Clérigo)',
    description: 'Categoría: Dote de Origen...',
    // ... resto de campos
  },
  // ... todas las dotes
];

export const FEATS_EN: Feat[] = [
  {
    name: 'Magic Initiate (Cleric)',
    description: 'Category: Origin Feat...',
    // ... resto de campos
  },
  // ... todas las dotes
];
```

## Archivos a crear

- `Data/feats/feats-es.ts` - ~15+ dotes en español
- `Data/feats/feats-en.ts` - ~15+ dotes en inglés
- `Data/feats/index.ts` - Export dinámico según idioma

## Verificación

- Verificar que al cambiar idioma las dotes se muestran en el idioma correcto

Depende de: task-001-setup-structure
