# Plan: Sistema Bilingüe (ES/EN)

## Overview

Implementar un sistema de idioma completo usando archivos de datos paralelos. Todo el contenido de la aplicación existirá en ambos idiomas (español e inglés) y el usuario podrá alternar entre ellos desde configuración.

## Arquitectura

### Enfoque: Archivos de Datos Paralelos

```
Data/
  feats-es.ts        # Todas las dotes en español
  feats-en.ts        # Todas las dotes en inglés
  spells/
    cantrips-es.ts   # Trucos en español
    cantrips-en.ts   # Trucos en inglés
    level1-es.ts    # Hechizos nivel 1 en español
    level1-en.ts    # Hechizos nivel 1 en inglés
    ...
  skills-es.ts      # Habilidades en español
  skills-en.ts      # Habilidades en inglés
  species/
    dwarf-es.ts     # Enano en español
    dwarf-en.ts     # Enano en inglés
    ...
  classes/
    wizard-es.ts    # Mago en español
    wizard-en.ts    # Mago en inglés
    ...
```

### Cambio de Idioma

- **Ubicación**: Settings accessible desde cualquier pantalla
- **Toggle**: Switch entre ES/EN
- **Persistencia**: localStorage
- **Efecto**: Inmediato, sin reload

---

## Execution Plan

- [Task 001: Setup - Crear estructura de directorios](./task-001-setup-structure.md)
- [Task 002: Language Context - Crear sistema de contexto de idioma](./task-002-language-context.md)
- [Task 003: Settings Component - Crear panel de configuración](./task-003-settings-component.md)
- [Task 004: Feats Data - Crear datos de feats bilingües](./task-004-feats-data.md)
- [Task 005: Spells Data - Crear datos de spells bilingües](./task-005-spells-data.md)
- [Task 006: Skills Data - Crear datos de skills bilingües](./task-006-skills-data.md)
- [Task 007: Species Data - Crear datos de species bilingües](./task-007-species-data.md)
- [Task 008: Classes Data - Crear datos de classes bilingües](./task-008-classes-data.md)
- [Task 009: Update Components - Actualizar componentes para usar idioma](./task-009-update-components.md)
- [Task 010: Cleanup - Limpiar sistema antiguo de traducciones](./task-010-cleanup.md)

---

## Dependency Chain

```
task-001-setup-structure
    ↓
task-002-language-context
    ↓
task-003-settings-component
    ↓
task-004-feats-data
    ↓
task-005-spells-data
    ↓
task-006-skills-data
    ↓
task-007-species-data
    ↓
task-008-classes-data
    ↓
task-009-update-components
    ↓
task-010-cleanup
```

---

## BDD Coverage

| Escenario | Task |
|-----------|------|
| Usuario cambia idioma a EN desde Settings | task-003, task-009 |
| Toda la UI muestra contenido en inglés | task-009 |
| Usuario cambia idioma a ES desde Settings | task-003, task-009 |
| Toda la UI muestra contenido en español | task-009 |
| Preferencia de idioma persiste al recargar | task-002 |
| Datos de feats muestran correctamente en cada idioma | task-004 |
| Datos de spells muestran correctamente en cada idioma | task-005 |
| Datos de skills muestran correctamente en cada idioma | task-006 |
| Datos de species muestran correctamente en cada idioma | task-007 |
| Datos de classes muestran correctamente en cada idioma | task-008 |

---

## Archivos a Modificar/Crear

### Nuevos archivos a crear:
- `hooks/useLanguage.tsx` - Contexto de idioma
- `components/Settings.tsx` - Panel de configuración
- `Data/feats-en.ts` - Dotes en inglés
- `Data/spells/cantrips-en.ts` - Trucos EN
- `Data/spells/level1-en.ts` - Nivel 1 EN
- ... (más archivos de spells)
- `Data/skills-en.ts` - Habilidades EN
- `Data/species/*-en.ts` - Species EN
- `Data/classes/*-en.ts` - Classes EN

### Archivos a modificar:
- `App.tsx` - Agregar Settings provider
- `components/SheetTabs.tsx` - Agregar botón de Settings
- `components/sheet/FeaturesTab.tsx` - Usar idioma
- `components/sheet/SpellsTab.tsx` - Usar idioma
- `components/creator/*` - Usar idioma

### Archivos a eliminar:
- `hooks/useTranslation.tsx` - Sistema antiguo
- `Data/translations/*.json` - Archivos de traducción antiguos
- `utils/TranslationService.ts`
- `utils/TranslationCache.ts`
