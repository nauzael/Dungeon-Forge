# Task 009: Update Components - Actualizar componentes para usar idioma

## Objetivo

Actualizar todos los componentes de la aplicación para usar el sistema de idioma.

## BDD Scenario

```gherkin
Scenario: UI actualiza al cambiar idioma
  Given el usuario está en la hoja del personaje
  When cambia el idioma a inglés
  Then todos los textos de la interfaz cambian a inglés
  And los datos (feats, spells, skills) cambian al idioma seleccionado
```

## Pasos

1. **Actualizar FeaturesTab.tsx**:
   - Importar useLanguage
   - Usar datos de feats según idioma
   - Eliminar traducciones antiguas

2. **Actualizar SpellsTab.tsx**:
   - Importar useLanguage
   - Usar datos de spells según idioma
   - Eliminar traducciones antiguas

3. **Actualizar InventoryTab.tsx**:
   - Actualizar textos de UI (Encabezados, botones)

4. **Actualizar CombatTab.tsx**:
   - Actualizar textos de UI

5. **Actualizar NotesTab.tsx**:
   - Actualizar textos de UI

6. **Actualizar componentes del Creator**:
   - Step1Identity.tsx
   - Step2Stats.tsx
   - Step3Details.tsx
   - Step4Skills.tsx
   - Step5Review.tsx
   - FeatModal.tsx

7. **Actualizar CharacterList.tsx**:
   - Textos de UI

## Archivos a modificar

- `components/sheet/FeaturesTab.tsx`
- `components/sheet/SpellsTab.tsx`
- `components/sheet/InventoryTab.tsx`
- `components/sheet/CombatTab.tsx`
- `components/sheet/NotesTab.tsx`
- `components/creator/Step1Identity.tsx`
- `components/creator/Step2Stats.tsx`
- `components/creator/Step3Details.tsx`
- `components/creator/Step4Skills.tsx`
- `components/creator/Step5Review.tsx`
- `components/creator/FeatModal.tsx`
- `components/CharacterList.tsx`
- `Data/characterOptions.ts` (para datos de clase/raza)

## Verificación

- Cambiar idioma y verificar que toda la UI responde correctamente
- Verificar datos de feats, spells, skills

Depende de: task-002-language-context, task-003-settings-component, task-004-feats-data, task-005-spells-data, task-006-skills-data, task-007-species-data, task-008-classes-data
