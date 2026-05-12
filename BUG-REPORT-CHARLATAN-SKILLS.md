# BUG REPORT: Charlatán Background - Skills sincronización en Paso 4

## Descripción del Problema

Cuando un usuario selecciona el background **"Charlatán"** (u otro background con el feat "Skilled"), el sistema muestra un modal en **Paso 1** para elegir **3 skills adicionales**. Sin embargo, al avanzar al **Paso 4 (Habilidades)**, estos 3 skills no aparecen correctamente sincronizados, permitiendo que se seleccionen nuevamente otros skills como si los del Paso 1 no existieran.

## Root Cause (Causa Raíz)

### El Problema Técnico

Hay una **desincronización de estado** entre Paso 1 y Paso 4:

1. **En Step1Identity.tsx (Paso 1)**:
   - Se selecciona background "Charlatán" con feat "Skilled"
   - Se abre modal para elegir 3 skills
   - Los 3 skills se guardan en el estado `bgSkilledSkills: string[]`
   - Estos datos se almacenan correctamente en CreatorSteps.tsx

2. **En Step4Skills.tsx (Paso 4)**:
   - **NO recibe `bgSkilledSkills` como prop**
   - Solo recibe `selectedSkills` 
   - La lógica de renderizado **no tiene en cuenta** los skills del feat "Skilled"
   - El código que comprueba si un skill está seleccionado es:
     ```typescript
     const isSelected = selectedSkills.includes(skill);
     ```
   - Esto **ignora completamente** `bgSkilledSkills`

3. **En la construcción del Character (CreatorSteps.tsx línea 557-558)**:
   - SÍ se incluyen correctamente:
     ```typescript
     skills: [
       ...(backgroundData?.skills || []),
       ...bgSkilledSkills,  // ← Aquí SÍ se agregan
       ...selectedSkills,
       ...(selectedHumanSkill ? [selectedHumanSkill] : []),
       ...(selectedElfSkill ? [selectedElfSkill] : []),
     ]
     ```
   - Pero el UI no refleja esto

### Síntomas Visibles

- Los 3 skills seleccionados en el feat "Skilled" (Paso 1) **no aparecen marcados** en Paso 4
- El contador de skills seleccionados en Paso 4 **no incluye** los 3 skills del feat "Skilled"
- El usuario ve skills sin marcar cuando deberían estar deshabilitados o marcados
- Hay confusión sobre cuáles skills fueron seleccionados

## Archivos Afectados

| Archivo | Línea | Problema |
|---------|-------|----------|
| `components/creator/Step4Skills.tsx` | Props interface | No recibe `bgSkilledSkills` |
| `components/creator/Step4Skills.tsx` | ~90 | `isSelected` logic no incluye `bgSkilledSkills` |
| `components/creator/Step4Skills.tsx` | ~85 | Contador de skills no refleja `bgSkilledSkills` |
| `components/CreatorSteps.tsx` | ~767-788 | No pasa `bgSkilledSkills` a Step4Skills |

## Backgrounds Afectados

Cualquier background con feat **"Skilled"** (permite elegir 3 skills):
- ✅ **Charlatán** (Charlatan)
- ✅ **Noble** (Noble)
- ✅ **Escriba** (Scribe)

## Solución Propuesta

### Cambios Necesarios:

1. **Step4Skills.tsx**: Agregar `bgSkilledSkills` a las props
2. **Step4Skills.tsx**: Actualizar la lógica de visualización para incluir skills de `bgSkilledSkills`
3. **Step4Skills.tsx**: Actualizar el contador de skills
4. **CreatorSteps.tsx**: Pasar `bgSkilledSkills` a Step4Skills

### Impacto:
- ✅ Sincronización correcta de skills entre Paso 1 y Paso 4
- ✅ UI refleja correctamente qué skills están seleccionados
- ✅ Contador de skills es preciso
- ✅ Los skills del feat "Skilled" se deshabilitan en Paso 4 (no son clickeables)

## Testing

Para verificar el fix:
1. Crear personaje nuevo
2. Seleccionar background "Charlatán"
3. Completar feat "Skilled" seleccionando 3 skills (ej: Perception, Insight, Stealth)
4. Avanzar a Paso 4
5. **Esperado**: Los 3 skills aparecen deshabilitados y marcados en Paso 4
6. El contador dice: "Elegidos: X / Y" (donde X incluye los 3 del feat)

