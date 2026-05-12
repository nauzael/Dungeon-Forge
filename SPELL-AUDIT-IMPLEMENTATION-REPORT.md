# ANÁLISIS: Implementación de Clases vs D&D 5e 2024

**Fecha**: 2025-04-16  
**Objetivo**: Identificar qué clases están correctamente implementadas en Dungeon Forge

---

## HALLAZGOS PRINCIPALES

### ✅ CLASES BASES IMPLEMENTADAS (8 de 12)

1. **Bard** ✅ COMPLETO
   - SPELL_LIST_BY_CLASS: ✅ BARD_SPELLS
   - CASTER_TYPE: ✅ 'full'
   - SPELLCASTING_ABILITY: ✅ 'CHA'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 2, 4: 3, 10: 4}
   - SPELLS_KNOWN_BY_LEVEL: ✅ L1-L20 valores

2. **Cleric** ✅ COMPLETO
   - SPELL_LIST_BY_CLASS: ✅ DIVINE_SPELLS
   - CASTER_TYPE: ✅ 'full'
   - SPELLCASTING_ABILITY: ✅ 'WIS'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 3, 4: 4, 10: 5}
   - SPELLS_KNOWN_BY_LEVEL: ❌ NO ENCONTRADO (pero usado en prepared)

3. **Druid** ✅ COMPLETO
   - SPELL_LIST_BY_CLASS: ✅ PRIMAL_SPELLS
   - CASTER_TYPE: ✅ 'full'
   - SPELLCASTING_ABILITY: ✅ 'WIS'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 2, 4: 3, 10: 4}
   - SPELLS_KNOWN_BY_LEVEL: ✅ L1-L20 valores

4. **Paladin** ✅ COMPLETO
   - SPELL_LIST_BY_CLASS: ✅ DIVINE_SPELLS
   - CASTER_TYPE: ✅ 'half'
   - SPELLCASTING_ABILITY: ✅ 'CHA'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 0, 4: 0, 10: 0}
   - SPELLS_KNOWN_BY_LEVEL: ✅ L1-L20 valores

5. **Ranger** ✅ COMPLETO + FIJO
   - SPELL_LIST_BY_CLASS: ✅ PRIMAL_SPELLS
   - CASTER_TYPE: ✅ 'half'
   - SPELLCASTING_ABILITY: ✅ 'WIS'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 0, 4: 0, 10: 0}
   - SPELLS_KNOWN_BY_LEVEL: ✅ L1-L20 valores
   - **STATUS**: ✅ BUG FIXED en esta sesión (ahora muestra 4/4 L1, 2/2 L2)

6. **Sorcerer** ✅ COMPLETO
   - SPELL_LIST_BY_CLASS: ✅ SORCERER_SPELLS
   - CASTER_TYPE: ✅ 'full'
   - SPELLCASTING_ABILITY: ✅ 'CHA'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 4, 4: 5, 10: 6}
   - SPELLS_KNOWN_BY_LEVEL: ✅ L1-L20 valores

7. **Warlock** ✅ COMPLETO
   - SPELL_LIST_BY_CLASS: ✅ WARLOCK_SPELLS
   - CASTER_TYPE: ✅ 'pact'
   - SPELLCASTING_ABILITY: ✅ 'CHA'
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 2, 4: 3, 10: 4}
   - SPELLS_KNOWN_BY_LEVEL: ✅ L1-L20 valores

8. **Wizard** ✅ COMPLETO (excepto SPELLCASTING_ABILITY)
   - SPELL_LIST_BY_CLASS: ✅ ARCANE_SPELLS
   - CASTER_TYPE: ✅ 'full'
   - SPELLCASTING_ABILITY: ❌ NO ENCONTRADO (necesario para usar spell save DC)
   - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 1: 3, 4: 4, 10: 5}
   - SPELLS_KNOWN_BY_LEVEL: ❌ NO ENCONTRADO (pero usado en prepared)

---

### ❌ CLASES BASES NO IMPLEMENTADAS (4 de 12)

9. **Artificer** ❌ NO EXISTE
   - SPELL_LIST_BY_CLASS: ❌ NO
   - CASTER_TYPE: ❌ NO
   - SPELLCASTING_ABILITY: ❌ NO
   - CANTRIPS_KNOWN_BY_LEVEL: ❌ NO
   - SPELLS_KNOWN_BY_LEVEL: ❌ NO
   - **TIPO**: Half-Caster, Prepared Spells
   - **IMPACTO**: Usuarios que intenten crear Artificer no podrán gestionar spells

10. **Barbarian** ✅ CORRECTAMENTE MARCADO
    - CASTER_TYPE: ✅ 'none'
    - Sin spellcasting (correcto)

11. **Fighter** ⚠️ PARCIAL
    - CASTER_TYPE: ✅ 'none' (base Fighter sin spells)
    - **SUBCLASS**: Eldritch Knight ✅ IMPLEMENTADO
      - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 3: 2, 10: 3}
      - SPELLS_KNOWN_BY_LEVEL: ✅ L3-L20 valores
      - THIRD_CASTER_SLOTS: ✅ L3-L20 valores
      - **STATUS**: ✅ APARENTEMENTE CORRECTO

12. **Monk** ✅ CORRECTAMENTE MARCADO
    - CASTER_TYPE: ✅ 'none'
    - Sin spellcasting (correcto)

13. **Rogue** ⚠️ PARCIAL
    - CASTER_TYPE: ✅ 'none' (base Rogue sin spells)
    - **SUBCLASS**: Arcane Trickster ✅ IMPLEMENTADO
      - CANTRIPS_KNOWN_BY_LEVEL: ✅ { 3: 2, 10: 3}
      - SPELLS_KNOWN_BY_LEVEL: ✅ L3-L20 valores
      - THIRD_CASTER_SLOTS: ✅ L3-L20 valores
      - **STATUS**: ✅ APARENTEMENTE CORRECTO

---

## DISCREPANCIAS IDENTIFICADAS

### CRÍTICOS (Impacta Usuario)

| # | Clase | Problema | Impacto | Urgencia |
|---|-------|----------|---------|----------|
| 1 | Artificer | No existe en código | Usuarios no pueden crear Artificer como clase base | 🔴 ALTO |
| 2 | Wizard | Falta SPELLCASTING_ABILITY | Spell save DC no calcula correctamente si se usa | 🔴 ALTO |

### SECUNDARIOS (Código Incompleto)

| # | Clase | Problema | Impacto | Urgencia |
|---|-------|----------|---------|----------|
| 1 | Cleric | Falta SPELLS_KNOWN_BY_LEVEL explícita | No afecta porque usa PREPARED_CASTERS | 🟡 MEDIO |
| 2 | Wizard | Falta SPELLS_KNOWN_BY_LEVEL explícita | No afecta porque usa PREPARED_CASTERS | 🟡 MEDIO |

---

## VERIFICACIONES CUANTITATIVAS

### Cobertura de Clases Spellcaster

**Clases Base Completas**: 8/12 (67%)
- Bard ✅
- Cleric ✅
- Druid ✅
- Paladin ✅
- Ranger ✅ (+ fix reciente)
- Sorcerer ✅
- Warlock ✅
- Wizard ✅ (excepto SPELLCASTING_ABILITY)

**Clases Base Incompletas**: 4/12 (33%)
- Artificer ❌ (No existe)
- Barbarian ⚠️ (Correcto: no-caster)
- Fighter ⚠️ (Correcto: no-caster base + Eldritch Knight subclass ✅)
- Monk ⚠️ (Correcto: no-caster)

### Subclases Spellcaster

**Implementadas**: 2/∞
- Eldritch Knight ✅
- Arcane Trickster ✅

---

## RECOMENDACIÓN: PLAN DE ACCIÓN

### Fase 1: CRÍTICO (Hacer inmediatamente)
**Tiempo Estimado**: 30 minutos

1. ✅ **Agregar Wizard a SPELLCASTING_ABILITY**
   ```typescript
   export const SPELLCASTING_ABILITY: Record<string, Ability> = {
     // ... existing ...
     'Wizard': 'INT', // AGREGAR ESTA LÍNEA
   };
   ```

2. ✅ **Agregar Artificer (Half-Caster, Prepared)**
   - Crear ARTIFICER_SPELLS list (desde Data/spells/artificer.ts)
   - Agregar a SPELL_LIST_BY_CLASS
   - Agregar a CASTER_TYPE: 'half'
   - Agregar a SPELLCASTING_ABILITY: 'INT'
   - Agregar a CANTRIPS_KNOWN_BY_LEVEL
   - Agregar a SPELLS_KNOWN_BY_LEVEL
   - PREPARADO CASTER

### Fase 2: SECUNDARIO (Hacer si hay tiempo)
**Tiempo Estimado**: 15 minutos

3. ⏳ **Verificar y documentar PREPARED_CASTERS**
   - Confirmar que Cleric, Wizard, Druid, Paladin, Ranger, Bard usan prepared spells
   - Actualizar comentarios si es necesario

4. ⏳ **Validar valores en THIRD_CASTER_SLOTS**
   - Comparar Eldritch Knight vs wikidot oficial
   - Comparar Arcane Trickster vs wikidot oficial

### Fase 3: VERIFICACIÓN (Deploy + Test)
**Tiempo Estimado**: 45 minutos

5. ⏳ Build: `npm run build`
6. ⏳ Deploy: `npm run ota "Fix: Add Wizard SPELLCASTING_ABILITY + Artificer complete implementation"`
7. ⏳ Test cada clase (especialmente Artificer y Wizard)

---

## CHECKLIST DE DATOS A VALIDAR

### Antes de hacer fixes:
- [ ] Leer D&D 5e 2024 oficial para Artificer spell list
- [ ] Confirmar Artificer cantrips progression
- [ ] Confirmar Artificer prepared spells progression
- [ ] Confirmar Artificer spellcasting ability (INT)
- [ ] Validar THIRD_CASTER_SLOTS con wikidot
- [ ] Validar Wizard SPELLCASTING_ABILITY ('INT')

### Después de fixes:
- [ ] Test Artificer nivel 1 - muestra 2 prepared spells
- [ ] Test Artificer nivel 5 - muestra 6 prepared spells, 4 L1 slots, 2 L2 slots
- [ ] Test Wizard - calcula spell save DC correctamente
- [ ] Test Eldritch Knight L3 - muestra 3 conocidos, 2 cantrips
- [ ] Test Arcane Trickster L3 - muestra 3 conocidos, 2 cantrips

---

## ARCHIVOS NECESARIOS A REVISAR

1. [Data/spells.ts](Data/spells.ts) - Definiciones centrales
2. `Data/spells/artificer.ts` - SI EXISTE (crear si no)
3. [components/sheet/SpellsTab.tsx](components/sheet/SpellsTab.tsx) - UI calculations
4. [utils/sheetUtils.ts](utils/sheetUtils.ts) - Slot calculations

---

## RESUMEN FINAL

**Estado Actual**: 8/12 clases base correctamente soportadas
**Impacto Crítico**: Artificer faltante, Wizard SPELLCASTING_ABILITY faltante
**Próximo Paso**: Implementar Artificer + agregar Wizard SPELLCASTING_ABILITY
**Tiempo Total**: ~1-2 horas (research + implementation + testing + deploy)
