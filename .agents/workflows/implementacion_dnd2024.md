---
description: Implementación de mejoras críticas D&D 2024 (Weapon Mastery, Stats Suggestions, Species Choice)
---

Este flujo de trabajo detalla los pasos para poner al día la aplicación con las reglas del Player's Handbook 2024.

### 1. Preparación de Tipos y Datos
- **Refactorizar `types.ts`**: Añadir `weaponMasteries: string[]` y `spellcastingAbility: Ability` (opcional) a `Character`.
- **Actualizar `Data/classes/`**: Añadir la propiedad `masteriesCount` (ej. Bárbaro: 2, Guerrero: 3) en los archivos correspondientes.
- **Añadir Maestrías**: Crear un catálogo de maestrías (Nick, Vex, Graze, Topple, etc.) en `Data/items.ts` o un nuevo archivo.

### 2. Actualización de Traducciones
- Añadir claves en `Data/translations/ui.ts` para:
  - `"weapon_mastery"`, `"suggested_stats"`, `"select_spellcasting_ability"`, `"starting_gold"`.

### 3. Mejora del Paso 2 (Estadísticas)
- Modificar `components/creator/Step2Stats.tsx` para mostrar visualmente los valores recomendados de **Standard Array** según la clase del personaje.

### 4. Implementación de Selección de Maestrías
- Crear un nuevo componente o sección en `Step4Skills.tsx` para elegir un número de armas igual a `masteriesCount`.
- Permitir filtrar las armas según la competencia de la clase.

### 5. Pulido de Elecciones de Especie
- Si la especie otorga hechizos (Hada, Enano, Elfo, etc.), permitir al usuario elegir su Atributo de Lanzamiento (INT, WIS, CHA) en el Paso 3.

### 6. Revisión Final y Persistencia
- Asegurarse de que `CreatorSteps.tsx` guarde correctamente los nuevos campos en el objeto final del personaje.
- Actualizar la Hoja de Personaje (`SheetTabs.tsx`) para mostrar las maestrías activas.
