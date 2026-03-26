# Task 006: Skills Data - Crear datos de skills bilingües

## Objetivo

Crear archivos de datos con todas las habilidades en español e inglés.

## BDD Scenario

```gherkin
Scenario: Mostrar habilidades en español
  Given el idioma está en español
  When se muestra la lista de habilidades
  Then aparecen con nombres y descripciones en español

Scenario: Mostrar habilidades en inglés
  Given el idioma está en inglés
  When se muestra la lista de habilidades
  Then aparecen con nombres y descripciones en inglés
```

## Pasos

1. Leer `Data/skills.ts` actual para entender estructura
2. Crear `Data/skills/skills-es.ts` con todas las habilidades en español
3. Crear `Data/skills/skills-en.ts` con todas las habilidades en inglés
4. Crear `Data/skills/index.ts` que exporta según idioma

## Archivos a crear

- `Data/skills/skills-es.ts`
- `Data/skills/skills-en.ts`
- `Data/skills/index.ts`

## Verificación

- Verificar que al cambiar idioma las habilidades se muestran en el idioma correcto

Depende de: task-001-setup-structure
