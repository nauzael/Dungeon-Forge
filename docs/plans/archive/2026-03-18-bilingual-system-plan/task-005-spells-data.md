# Task 005: Spells Data - Crear datos de spells bilingües

## Objetivo

Crear archivos de datos con todos los hechizos en español e inglés para cada nivel.

## BDD Scenario

```gherkin
Scenario: Mostrar hechizos en español
  Given el idioma está en español
  When se muestra el grimorio de hechizos
  Then aparecen con nombres, descripciones y stats en español

Scenario: Mostrar hechizos en inglés
  Given el idioma está en inglés
  When se muestra el grimorio de hechizos
  Then aparecen con nombres, descripciones y stats en inglés
```

## Pasos

1. Leer archivos actuales en `Data/spells/` para entender estructura
2. Crear versión ES y EN de cada archivo:
   - `cantrips-es.ts`, `cantrips-en.ts`
   - `level1-es.ts`, `level1-en.ts`
   - `level2-es.ts`, `level2-en.ts`
   - ... hasta level9
3. Crear `Data/spells/index.ts` que exporta según idioma

## Archivos a crear

- `Data/spells/cantrips-es.ts`
- `Data/spells/cantrips-en.ts`
- `Data/spells/level1-es.ts` ... `level9-es.ts`
- `Data/spells/level1-en.ts` ... `level9-en.ts`
- `Data/spells/index.ts` (actualizar existente)

## Verificación

- Verificar que al cambiar idioma los hechizos se muestran en el idioma correcto
- Verificar stats (casting time, range, components, duration)

Depende de: task-001-setup-structure
