# Task 008: Classes Data - Crear datos de classes bilingües

## Objetivo

Crear archivos de datos con todas las clases en español e inglés.

## BDD Scenario

```gherkin
Scenario: Mostrar clases en español
  Given el idioma está en español
  When se muestra la selección de clase
  Then aparecen con nombres, descripciones, rasgos en español

Scenario: Mostrar clases en inglés
  Given el idioma está en inglés
  When se muestra la selección de clase
  Then aparecen con nombres, descripciones, rasgos en inglés
```

## Pasos

1. Leer archivos en `Data/classes/` para entender estructura
2. Para cada clase existente, crear versión ES:
   - `wizard-es.ts`, `fighter-es.ts`, etc.
3. Lo mismo para versión EN
4. Actualizar `Data/classes/index.ts` para exportar según idioma

## Clases a traducir

- Barbarian (Bárbaro)
- Bard (Bardo)
- Cleric (Clérigo)
- Druid (Druida)
- Fighter (Guerrero)
- Monk (Monje)
- Paladin (Paladín)
- Ranger (Explorador)
- Rogue (Pícaro)
- Sorcerer (Hechicero)
- Warlock (Brujo)
- Wizard (Mago)

## Archivos a crear/modificar

- `Data/classes/barbarian-es.ts`, `Data/classes/barbarian-en.ts`
- ... (12 clases × 2 idiomas)
- `Data/classes/index.ts`

## Verificación

- Verificar que al cambiar idioma las classes se muestran en el idioma correcto

Depende de: task-001-setup-structure
