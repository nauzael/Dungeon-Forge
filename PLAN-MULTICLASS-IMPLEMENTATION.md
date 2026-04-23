# 🎯 PLAN: Sistema de Multiclases D&D 5e (2024)

**Estado:** Pendiente aprobación  
**Última actualización:** 2026-04-20  
**Autor:** Team Planning  

---

## 📋 Visión General

Implementar un sistema robusto de multiclases que permita a los personajes tener múltiples clases con niveles independientes, sincronizando correctamente:
- HP con múltiples Hit Dice
- Bonus de Proficiencia (total level)
- Características de clase (por cada clase)
- Recursos de clase (Ki, Channel Divinity, etc.)
- Spell slots (multiclass spellcasting rules)

---

## 🏗️ Análisis de Dependencias

```
types.ts (modelo Character + ClassLevel)
    │
    ├─→ multiclassCalculations.ts (HP, profBonus, features)
    │       │
    │       ├─→ characterCalculations.ts (refactor)
    │       │
    │       ├─→ SpellsTab.tsx (spell slots)
    │       └─→ FeaturesTab.tsx (características)
    │
    ├─→ characterMigrations.ts (compatibilidad backward)
    │
    ├─→ CreatorSteps.tsx (multi-class selection)
    │
    ├─→ LevelUpWizard/ (choose class to level up)
    │
    ├─→ CharacterList.tsx (show multiclass info)
    │
    └─→ SheetTabs.tsx (display multiclass details)
```

---

## ✅ TAREAS POR HACER

### 📌 CHECKPOINT 0: Diseño de Tipos (Bloquea todas las tareas)

#### **Task 1: Extender Character interface con multiclase**

- **Descripción:** Actualizar `types.ts` para soportar múltiples clases manteniendo compatibilidad hacia atrás (personajes single-class seguirán funcionando). Crear tipos para `ClassLevel` y arrays de clases/subclases.

- **Aceptación:**
  - [ ] Interfaz `ClassLevel` define: `{ class: string; level: number; subclass?: string }`
  - [ ] Character.classes es un array `ClassLevel[]` (opcional, default a `[{ class: Character.class, level: Character.level }]`)
  - [ ] TypeScript compila sin errores
  - [ ] Backward compatible: personajes viejos sin `.classes` siguen siendo válidos

- **Verificación:**
  - Build: `npm run build` ✓
  - Archivo modificado: [types.ts](types.ts)

- **Scope:** XS (1 archivo)
- **Prioridad:** 🔴 CRÍTICA (bloquea todo)

---

### 📌 CHECKPOINT 1: Cálculos Base (Bloquea UI y Features)

#### **Task 2: Crear utilidades de cálculo multiclase**

- **Descripción:** Nuevo archivo `utils/multiclassCalculations.ts` con funciones para:
  - Calcular nivel total (suma de todos los niveles)
  - Calcular HP total considerando Hit Dice de múltiples clases
  - Calcular profBonus basado en nivel total
  - Obtener características de clase agrupadas por nivel (por cada clase)
  - Obtener lista de hechizos/cantrips agrupados (multiclass casting)

- **Aceptación:**
  - [ ] `getTotalLevel(character): number` = suma de todos `ClassLevel.level`
  - [ ] `calculateMulticlassHP(character, stats)` considera Hit Dice de cada clase
  - [ ] `getProfBonus(totalLevel)` retorna bonus correcto (2@L1-4, 3@L5-8, etc.)
  - [ ] `getMulticlassFeatures(character): Feature[]` agrupa características por nivel
  - [ ] Funciones exportables y testeables

- **Verificación:**
  - Crear test cases manuales para personajes ejemplo
  - Ejemplo: Barbarian L5 / Wizard L3
    - Expected HP: (12+CON)*5 + (6+CON)*3
    - Expected profBonus: 3 (total L8)
    - Expected features: Rage, Extra Attack, Spellcasting, etc.

- **Scope:** M (1 archivo ~150 líneas)
- **Prioridad:** 🔴 CRÍTICA (bloquea Tasks 3+)

---

#### **Task 3: Actualizar characterCalculations.ts para multiclase**

- **Descripción:** Refactorizar las funciones existentes (HP, AC, Initiative, etc.) para usar el nuevo sistema multiclase. Mantener comportamiento igual para single-class.

- **Aceptación:**
  - [ ] `calculateMaxHP()` usa `calculateMulticlassHP()` si `character.classes` existe
  - [ ] `calculateAC()` sigue funcionando igual (AC no cambia con multiclase)
  - [ ] `getTotalInitiative()` sigue igual
  - [ ] Todas las funciones aceptan tanto single-class como multi-class
  - [ ] No breaking changes para personajes existentes

- **Verificación:**
  - Comparar HP resultado: single-class vs con `.classes` array idéntico
  - Build: `npm run build` ✓
  - Archivo modificado: [utils/characterCalculations.ts](utils/characterCalculations.ts)

- **Scope:** S (1 archivo modificado)
- **Prioridad:** 🔴 CRÍTICA

---

#### **Task 4: Migration para convertir personajes a multiclase**

- **Descripción:** Agregar migración en `characterMigrations.ts` que:
  - Detecta personajes sin `.classes`
  - Crea `.classes` array con `[{ class, level, subclass }]`
  - Marca como aplicada para no re-ejecutar

- **Aceptación:**
  - [ ] Migración `migrateToMulticlass` ejecuta automáticamente
  - [ ] Personajes existentes adquieren `.classes`
  - [ ] No pierde datos
  - [ ] Idempotente (ejecutarse 2x no causa problemas)

- **Verificación:**
  - Crear personaje con método viejo, verificar que tenga `.classes` después de cargar
  - Archivo modificado: [utils/characterMigrations.ts](utils/characterMigrations.ts)

- **Scope:** S (modificar 1 archivo)
- **Prioridad:** 🟡 ALTA

---

### 📌 CHECKPOINT 2: UI Fase 1 - Lectura

#### **Task 5: Mostrar información multiclase en SheetTabs.tsx**

- **Descripción:** Actualizar la sección de "Class Info" en SheetTabs para mostrar:
  - Listado de clases con niveles individuales y total
  - Hit Dice disponibles por clase
  - Características de clase activas (mostrar para CADA clase que aplica)

- **Aceptación:**
  - [ ] Componente nuevo: `<MulticlassInfo character={character} />`
  - [ ] Muestra: "Barbarian Lv5 / Wizard Lv3 (Total: 8)"
  - [ ] Muestra Hit Dice breakdown: "D12 (5d12) + D6 (3d6)"
  - [ ] Lista características de cada clase por separado
  - [ ] UI móvil-first (max-w-md)

- **Verificación:**
  - Crear personaje multiclase test, verificar visualización
  - Manual check: ver componente renderiza correctamente
  - Archivo: [components/sheet/SheetTabs.tsx](components/sheet/SheetTabs.tsx)

- **Scope:** M (1 componente ~200 líneas)
- **Prioridad:** 🟡 MEDIA

---

#### **Task 6: Actualizar CharacterList.tsx para mostrar multiclase**

- **Descripción:** Modificar las character cards para mostrar múltiples clases:
  - Cambiar de "Barbarian • Tiefling" a "Barbarian 5 / Wizard 3 • Tiefling"
  - O mostrar clases en línea separada con niveles

- **Aceptación:**
  - [ ] Cards muestran todas las clases con niveles
  - [ ] Layout responsive no se rompe (keep mobile-friendly)
  - [ ] Mantiene estilo visual existente

- **Verificación:**
  - Visual check: cards se ven bien con 1, 2, 3 clases
  - Responsive test: mobile y desktop
  - Archivo: [components/CharacterList.tsx](components/CharacterList.tsx)

- **Scope:** S (modificar 1 componente)
- **Prioridad:** 🟢 BAJA

---

### 📌 CHECKPOINT 3: Features & Características

#### **Task 7: Actualizar sistema de características de clase**

- **Descripción:** Modificar `FeaturesTab.tsx` para mostrar características agregadas de todas las clases. Las características se calculan por nivel total pero se agrupan por clase de origen.

- **Ejemplo:**
  - Barbarian Lv5 + Fighter Lv3 obtiene "Extra Attack" de Fighter cuando Fighter alcanza Lv5
  - Pero se calcula a nivel total 8, donde Fighter está en Lv5

- **Aceptación:**
  - [ ] Características se agrupan por clase
  - [ ] Muestra características de cada clase en su propia sección
  - [ ] Las características multiclase se calculan correctamente según D&D 5e
  - [ ] No duplica características

- **Verificación:**
  - Test: Monk Lv5 + Rogue Lv1 debe mostrar "Extra Attack" de Monk
  - Archivo: [components/sheet/FeaturesTab.tsx](components/sheet/FeaturesTab.tsx)

- **Scope:** M (modificar 1 componente)
- **Prioridad:** 🟡 MEDIA

---

### 📌 CHECKPOINT 4: Creación & Level Up (Alto Riesgo)

#### **Task 8: Actualizar CreatorSteps.tsx para multiclase opcional**

- **Descripción:** Permitir que el usuario seleccione múltiples clases en Step 3 (Class Selection). Inicialmente todos los niveles en 1 clase, pero agregar botón "+ Agregar Clase" que permite seleccionar una segunda clase al nivel 1.

- **Aceptación:**
  - [ ] Interface permite selector de clases múltiples
  - [ ] Puede agregar hasta 12 clases (límite D&D)
  - [ ] Cada clase comienza en Lv1, total = suma
  - [ ] Calcula correctamente HP, profBonus, features
  - [ ] No rompe creación de single-class

- **Verificación:**
  - Create: seleccionar Barbarian Lv1, + Wizard Lv1 = Level 2 total
  - Verificar HP = (12+con) + (6+con)
  - Archivo: [components/CreatorSteps.tsx](components/CreatorSteps.tsx)

- **Scope:** L (modificar 1 componente, múltiples pasos)
- **Prioridad:** 🔴 CRÍTICA (alto riesgo, hace primero)

---

#### **Task 9: Actualizar LevelUpWizard para multiclase**

- **Descripción:** Modificar el wizard de subida de nivel para permitir que el usuario elija QUÉ clase sube de nivel (si tiene multiclase). Distribuir niveles entre clases.

- **Ejemplo:**
  - Personaje: Barbarian Lv3 / Wizard Lv2 (total Level 5)
  - Sube a Level 6
  - Usuario elige si es: Barbarian Lv4 / Wizard Lv2 O Barbarian Lv3 / Wizard Lv3

- **Aceptación:**
  - [ ] Wizard muestra clases actuales con sus niveles
  - [ ] Permite elegir qué clase sube de nivel
  - [ ] Actualiza `Character.classes` array
  - [ ] Recalcula HP, características, features correctamente
  - [ ] UI clara mostrando impacto de cada opción

- **Verificación:**
  - Level up multiclass character, elegir qué clase sube, verificar stats
  - Comprobar HP se recalcula correctamente
  - Archivos: [components/sheet/LevelUpWizard/](components/sheet/LevelUpWizard/)

- **Scope:** L (modificar 1 componente, lógica compleja)
- **Prioridad:** 🔴 CRÍTICA

---

### 📌 CHECKPOINT 5: Spellcasting (Bloquea SpellsTab)

#### **Task 10: Calcular Spell Slots multiclase**

- **Descripción:** D&D 5e multiclase: cada clase contribuye al "spellcaster level" basado en su hit die. Crear utilidad que:
  - Suma niveles de clases full caster (Wizard, Cleric, Druid, Sorcerer, etc.)
  - Suma MITAD los niveles de clases half-caster (Paladin, Ranger, Bard)
  - Suma 1/3 los niveles de clases third-caster (Eldritch Knight Fighter, Arcane Trickster Rogue)
  - Calcula spell slots combinados

- **Fórmula D&D 5e 2024:**
  ```
  Spellcaster Level = 
    (Wizard + Cleric + Druid + Sorcerer) +
    ½(Paladin + Ranger + Bard) +
    ⅓(Eldritch Knight + Arcane Trickster)
  ```

- **Aceptación:**
  - [ ] `getMulticlassSpellSlots(character)` calcula slots correctamente
  - [ ] Trata full vs half vs third-casters según D&D 5e 2024
  - [ ] Retorna `Record<number, { current: number; max: number }>` para cada nivel de spell
  - [ ] Funciona con combinaciones complejas

- **Verificación:**
  - Test 1: Wizard Lv5 + Cleric Lv3 = 8 "spellcaster level"
    - Expected slots: Lv1=4, Lv2=3, Lv3=2, etc.
  - Test 2: Wizard Lv4 + Paladin Lv4 = 6 "spellcaster level"
  - Test 3: Fighter (Eldritch Knight) Lv9 = 3 "spellcaster level"
  - Archivo: `utils/multiclassSpellcasting.ts` (nuevo)

- **Scope:** M (1 archivo nuevo)
- **Prioridad:** 🟡 MEDIA

---

#### **Task 11: Actualizar SpellsTab.tsx para multiclase**

- **Descripción:** Mostrar hechizos y cantrips de TODAS las clases. Agregar sección per-class para "spells known" vs "prepared spells".

- **Aceptación:**
  - [ ] Muestra cantrips de cada clase
  - [ ] Muestra spells known/prepared agregadas
  - [ ] Spell slots calculados correctamente usando Task 10
  - [ ] UI clara indicando qué clase contribuye qué
  - [ ] Mantiene compatibilidad con single-class

- **Verificación:**
  - Crear Wizard/Cleric multiclass, verificar spell list agrupada
  - Comprobar spell slots calculan correctamente
  - Archivo: [components/sheet/SpellsTab.tsx](components/sheet/SpellsTab.tsx)

- **Scope:** L (modificar 1 componente)
- **Prioridad:** 🟡 MEDIA

---

### 📌 CHECKPOINT 6: Validación & Testing

#### **Task 12: Testing integrado y bug fixes**

- **Descripción:** Crear caracteres multiclase test y validar:
  - HP cálculo
  - profBonus
  - Características de clase
  - Spell slots
  - Resources (Ki, Channel Divinity, etc.)
  - Save/load funciona

- **Casos de Prueba:**
  1. Barbarian Lv5 / Wizard Lv3 (total L8)
     - HP: (12+CON)*5 + (6+CON)*3
     - profBonus: +3
     - Features: Rage, Extra Attack, Spellcasting
     - Spell Slots: Lv1=4, Lv2=3

  2. Cleric Lv4 / Paladin Lv4 (total L8, half-caster)
     - HP: (8+CON)*4 + (10+CON)*4
     - profBonus: +3
     - Spell Slots: Lv1=4, Lv2=3

  3. Fighter (Eldritch Knight) Lv9 / Wizard Lv2 (mixed spellcaster)
     - Spellcaster Level: 3 + 2 = 5
     - Spell Slots: Lv1=4, Lv2=3

- **Aceptación:**
  - [ ] 5+ caracteres multiclase test creados exitosamente
  - [ ] Todos los stats calculan correctamente vs tablas D&D 5e
  - [ ] No hay errores en console
  - [ ] Save/load funciona
  - [ ] Backward compatibility: personajes single-class siguen siendo válidos

- **Verificación:**
  - Manual testing con múltiples combinaciones
  - Comparar con caracteres creados en herramientas D&D oficiales (D&D Beyond, etc.)

- **Scope:** M (testing manual)
- **Prioridad:** 🔴 CRÍTICA

---

#### **Task 13: Supabase schema updates (si aplica)**

- **Descripción:** Si la base de datos almacena `class` y `level` por separado, agregar migración para permitir `classes` array.

- **Aceptación:**
  - [ ] Schema actualizado (o compatible)
  - [ ] Datos viejos se preservan
  - [ ] Migración DB corre sin errores

- **Scope:** S (1 migración DB)
- **Prioridad:** 🟢 BAJA (final, si aplica)

---

## 🔄 Orden de Implementación (Dependencias)

```
1.  Task 1  → types.ts (tipos, bloquea todo)
    │
2.  Task 2  → multiclassCalculations.ts (cálculos base)
    │
3.  Task 3  → characterCalculations.ts (refactor)
    │
4.  Task 4  → characterMigrations.ts (compatibilidad)
    │
├─→ 5.  Task 5  → SheetTabs.tsx (info display)
├─→ 6.  Task 6  → CharacterList.tsx (cards)
├─→ 7.  Task 7  → FeaturesTab.tsx (características)
│
├─→ 8.  Task 8  → CreatorSteps.tsx (🔴 alto riesgo, hace primero)
├─→ 9.  Task 9  → LevelUpWizard (distribution)
│
├─→ 10. Task 10 → multiclassSpellcasting.ts (spell slots)
├─→ 11. Task 11 → SpellsTab.tsx (spells UI)
│
└─→ 12. Task 12 → Testing integrado (validación final)
└─→ 13. Task 13 → Supabase schema (final, si aplica)
```

---

## ⚠️ Riesgos Identificados

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|-------------|-----------|
| Romper single-class existentes | 🔴 ALTO | Media | Mantener backward compatibility en Task 1 |
| HP cálculo incorrecto | 🔴 ALTO | Media | Testing riguroso en Task 12, validar vs D&D tablas |
| Spell slots incorrectos | 🟡 MEDIO | Media | Validar fórmula con tablas D&D, test en Task 10 |
| UI se ve mal con 3+ clases | 🟢 BAJO | Baja | Mobile-first design, test responsive |
| CreatorSteps/LevelUpWizard complicados | 🔴 ALTO | Alta | Implementar primero (Task 8), iterar rápido |
| Supabase sync issues | 🟡 MEDIO | Baja | Task 13 al final, test con cloud sync |

---

## 📊 Métricas & Puntos de Control

- **Total Tasks:** 13
- **Arquitectura Tasks (0-4):** 4 tareas (foundation)
- **UI Tasks (5-11):** 7 tareas (frontend)
- **Validation Tasks (12-13):** 2 tareas (testing)

**Checkpoints:**
- ✅ CP0: Types & Interfaces (Task 1)
- ✅ CP1: Cálculos Base (Tasks 2-4)
- ✅ CP2: UI Display (Tasks 5-7)
- ✅ CP3: Creación/LevelUp (Tasks 8-9)
- ✅ CP4: Spellcasting (Tasks 10-11)
- ✅ CP5: Testing & Validation (Tasks 12-13)

**Estimación de Esfuerzo:**
- XS (1-2h): Tasks 1, 3, 4, 6, 13 = 5 tareas
- S (2-4h): Tasks 2, 5, 7, 10 = 4 tareas
- M (4-6h): Tasks 8, 9, 11, 12 = 4 tareas
- **Total estimado:** 40-50 horas de desarrollo

---

## ✨ Beneficios Post-Implementación

✅ Soporte completo para multiclase D&D 5e 2024  
✅ Sincronización automática de HP, profBonus, features  
✅ Spell slots calculados correctamente por multiclase  
✅ Distribución flexible de niveles entre clases  
✅ Backward compatible con 1000+ personajes existentes  
✅ UI clara y mobile-friendly  

---

## 📝 Notas

- Las tareas están ordenadas por **dependencias**, no por prioridad
- Tasks 8 y 9 son **alto riesgo** → implementar temprano para iterar
- Task 12 es **crítica** → no mergear sin testing exhaustivo
- Cada checkpoint es un punto de parada seguro para validar antes de continuar

---

**¿Listo para empezar con Task 1?** ✅
