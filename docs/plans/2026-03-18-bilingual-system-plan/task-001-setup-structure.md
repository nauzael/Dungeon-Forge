# Task 001: Setup - Crear estructura de directorios

## Objetivo

Crear la estructura de directorios necesaria para los archivos de datos bilingües.

## BDD Scenario

```gherkin
Scenario: Crear estructura de directorios para datos bilingües
  Given el proyecto Dungeon Forge
  When se ejecuta la tarea de setup
  Then existen los directorios:
    - Data/feats/
    - Data/skills/
    - Data/species/
    - Data/classes/
  And existen archivos de ejemplo:
    - Data/feats/feats-en.ts (export vacío)
    - Data/feats/feats-es.ts (export vacío)
```

## Pasos

1. Crear directorio `Data/feats/`
2. Crear directorio `Data/skills/`
3. Verificar que existen `Data/species/` y `Data/classes/`
4. Crear archivos de índice vacíos para cada directorio

## Archivos a crear

- `Data/feats/feats-en.ts` - Exporta objeto featsEn
- `Data/feats/feats-es.ts` - Exporta objeto featsEs

## Verificación

```bash
ls Data/feats/
ls Data/skills/
```

Depende de: - (ninguno)
