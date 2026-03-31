# Task 010: Cleanup - Limpiar sistema antiguo de traducciones

## Objetivo

Eliminar el sistema antiguo de traducciones que ya no se usará.

## BDD Scenario

```gherkin
Scenario: Sistema antiguo eliminado
  Given se implementó el nuevo sistema bilingüe
  When se limpian los archivos antiguos
  Then no existen más archivos de traducción dinámica
  And la app funciona correctamente solo con datos embebidos
```

## Pasos

1. Eliminar `hooks/useTranslation.tsx`
2. Eliminar directorio `Data/translations/` completo
3. Eliminar `utils/TranslationService.ts`
4. Eliminar `utils/TranslationCache.ts`
5. Verificar que la app sigue funcionando

## Archivos a eliminar

- `hooks/useTranslation.tsx`
- `Data/translations/feats.json`
- `Data/translations/spells.json`
- `Data/translations/es.json`
- `Data/translations/cantrips.json`
- `utils/TranslationService.ts` (si existe)
- `utils/TranslationCache.ts` (si existe)

## Verificación

- La app funciona sin errores
- No hay referencias a useTranslation en el código

Depende de: task-009-update-components
