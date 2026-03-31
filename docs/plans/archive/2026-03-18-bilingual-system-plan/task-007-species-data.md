# Task 007: Species Data - Crear datos de species bilingües

## Objetivo

Crear archivos de datos con todas las especies (razas) en español e inglés.

## BDD Scenario

```gherkin
Scenario: Mostrar especies en español
  Given el idioma está en español
  When se muestra la selección de especie
  Then aparecen con nombres, rasgos y descripciones en español

Scenario: Mostrar especies en inglés
  Given el idioma está en inglés
  When se muestra la selección de especie
  Then aparecen con nombres, rasgos y descripciones en inglés
```

## Pasos

1. Leer archivos en `Data/species/` para entender estructura
2. Para cada especie existente, crear versión ES:
   - `dwarf-es.ts`, `elf-es.ts`, `human-es.ts`, etc.
3. Lo mismo para versión EN
4. Actualizar `Data/species/index.ts` para exportar según idioma

## Especies a traducir

- Dwarf (Enano)
- Elf (Elfo)
- Human (Humano)
- Halfling (Mediano)
- Dragonborn (Dracónido)
- Gnome (Gnomo)
- Half-Elf (Medio Elfo)
- Half-Orc (Medio Orco)
- Tiefling (Infernal)
- Goliath (Gólem)
- Aasimar (Aasimar)
- Orc (Orco)

## Archivos a crear/modificar

- `Data/species/dwarf-es.ts`, `Data/species/dwarf-en.ts`
- ... (12+ species × 2 idiomas)
- `Data/species/index.ts`

## Verificación

- Verificar que al cambiar idioma las species se muestran en el idioma correcto

Depende de: task-001-setup-structure
