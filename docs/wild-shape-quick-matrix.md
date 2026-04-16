# MATRIZ RÁPIDA: Wild Shape Verificación de Condiciones
**Dungeon Forge - 2026-04-12**

---

## 📊 MATRIZ DE ESTADO

```
CONDICIÓN 1: FLUJO DE MODAL
═════════════════════════════════════════════════════════════════════════════
Estado: ✅ FUNCIONA
├─ Click "Transformar" → abre modal          ✅ WildShapePanel.tsx:115-126
├─ Modal centrado en pantalla                 ✅ WildShapeModal.tsx:205 (100dvh, items-center)
├─ Props recibidas correctamente              ✅ character, onSelect, onClose
├─ Cierre por backdrop o botón X              ✅ onClick handlers presentes
└─ wildShapeForms opcional para filtrado      ✅ Handled (pero nunca poblado)

IMPACTO: El usuario VE el modal correcto ✅


CONDICIÓN 2: FILTRADO DE BESTIAS
═════════════════════════════════════════════════════════════════════════════
Estado: ⚠️ PARCIALMENTE FUNCIONA

2A. CR Filtering
   Estado: ✅ FUNCIONA
   ├─ getMaxCRForLevel correcto               ✅ wildShapeUtils.ts:5-11
   ├─ Estándar Lv2: maxCR=0.25               ✅ Correcto
   ├─ Circle Moon Lv6: maxCR=2                ✅ Correcto
   └─ Filter: beast.cr > maxCR → RECHAZA      ✅ Lógica correcta
   
   RESULTADO: Druida Lv2 ve Lobo/Araña/Rata ✅

2B. Fly Speed Filtering
   Estado: ❌ LÓGICA INVERTIDA
   ├─ canUseFlySpeed: retorna TRUE si PUEDE   ✅ Lógica OK
   ├─ Filter: !canUseFlySpeed() → RECHAZA     ❌ INVERTIDO
   └─ PROBLEMA: Rechaza bestias voladoras cuando el druida LAS PUEDE USAR
   
   RESULTADO: Druida Circle of Moon NO ve bestias con flySpeed ❌

2C. Known Forms (bestias conocidas)
   Estado: ⚠️ FRÁGIL PERO FUNCIONA
   ├─ wildShapeForms siempre undefined        ❌ Nunca inicializado
   ├─ Filter: if (knownForms && length > 0)   ✅ Falla seguro si undefined
   └─ Pero si alguien llena con [], rechaza TODO
   
   RESULTADO: Filtro no operacional (wildShapeForms nunca se actualiza) ❌

IMPACTO GLOBAL: CR Filter OK, Fly Speed roto, Known Forms no funciona


CONDICIÓN 3: STATS AL TRANSFORMAR  
═════════════════════════════════════════════════════════════════════════════
Estado: ❌ CRÍTICA - Stats INT/WIS/CHA reemplazados

3A. Reemplazar STR/DEX/CON
    Estado: ✅ CORRECTO
    └─ stats: {...beast.stats}               ✅ Reemplaza correctamente

3B. Preservar INT/WIS/CHA
    Estado: ❌ INCORRECTO - LOS REEMPLAZA
    ├─ Código: stats: {...beast.stats}       ❌ Copia TODAS las stats (INT/WIS/CHA incluido)
    ├─ Espera: stats: {STR/DEX/CON de bestia, INT/WIS/CHA de druid}
    └─ IMPACTO: Druid pierde su WIS/INT/CHA permanentemente
    
    wildShapeUtils.ts:108

3C. AC Circle of the Moon
    Estado: ❌ INCORRECTO - Usa WIS de bestia
    ├─ Código: (character.stats.WIS - 10) / 2  ❌ WIS ya fue reemplazada
    ├─ Espera: 13 + druidWISmod
    ├─ Real: 13 + beastWISmod (generalmente 0, porque WIS bestia = 10-12)
    └─ EJEMPLO: Druid WIS 16 (+3), se convierte en Lobo (WIS 12, +1) 
               AC debería ser max(12, 13+3) = 16
               Pero calcula: max(12, 13+1) = 14
    
    wildShapeUtils.ts:41

3D. THP Calculation
    Estado: ✅ CORRECTO
    ├─ Estándar: druidLevel                  ✅
    └─ Circle of Moon: druidLevel × 3        ✅

3E. Snapshot (para restaurar después)
    Estado: ✅ GUARDADO (pero data está incompleta)
    ├─ originalStats: guardado               ✅ (pero contiene TODO, no necesario)
    ├─ originalHP: guardado                  ✅
    └─ originalAC: guardado                  ✅

IMPACTO GLOBAL: Druid PERMANENTEMENTE sin INT/WIS/CHA después de transformar


CONDICIÓN 4: RESTAURACIÓN DE STATS
═════════════════════════════════════════════════════════════════════════════
Estado: ❌ CRÍTICA - Restaura usos incorrectamente

4A. Restore Stats
    Estado: ✅ Restaurado de snapshot
    └─ stats: {...wildShapeState.originalStats} ✅

4B. Restore HP
    Estado: ✅ Correcto
    ├─ hp.current/max: originalHP            ✅
    └─ hp.temp: original - thpGained         ✅

4C. Restore AC
    Estado: ✅ Correcto
    └─ ac: originalAC                        ✅

4D. Decrement Uses (CRÍTICA)
    Estado: ❌ RESTAURA EN LUGAR DE MANTENER
    ├─ Código: current: Math.min(max, current + 1)  ❌ SUMA 1 (RESTAURA A MAX)
    ├─ Espera: current mantiene su valor decrementado  
    ├─ FLUJO INCORRECTO:
    │  Antes: wildShape {current: 2, max: 2}
    │  Transforma: {current: 1, max: 2}  ← decrementado
    │  Termina forma: {current: 2, max: 2}  ← RESTAURADO (INCORRECTO)
    │  Puede transformarse de nuevo sin Long Rest
    │
    └─ DEBERÍA ser: {current: 1, max: 2}  ← mantiene 1 hasta Long Rest
    
    wildShapeUtils.ts:144-146

4E. Clear activeWildShape
    Estado: ✅ Correcto
    └─ activeWildShape: undefined            ✅

4F. Clear localStorage
    Estado: ✅ Correcto
    └─ localStorage.removeItem()             ✅

IMPACTO GLOBAL: Druid puede transformarse INFINITAS veces sin consumir usos


CONDICIÓN 5: PERSISTENCIA (RELOAD)
═════════════════════════════════════════════════════════════════════════════
Estado: 🔴 CRÍTICA - Datos originales perdidos en reload

5A. Guardar en localStorage al transformar
    Estado: ✅ GUARDADO
    ├─ Key: wildshape_${characterId}        ✅
    ├─ Value: {form, timestamp}             ✅
    └─ wildShapeUtils.ts:158-168
    
    PROBLEMA: NO guarda originalStats/HP/AC

5B. Cargar en localStorage al montar
    Estado: ❌ INCORRECTO - Pierde datos originales
    ├─ Cargar: localStorage.getItem()       ✅ Lee correctamente
    ├─ Reconstruir state: ❌ USA DATOS INCORRECTOS
    │  originalStats: char.stats            ❌ Son stats de BESTIA, no druid
    │  originalHP: {...char.hp}             ❌ Es HP de BESTIA, no druid  
    │  originalAC: char.ac                  ❌ Es AC modificada, no original
    │
    └─ IMPACTO: Si usuario recarga página mientras transformado:
       - Termina forma → Obtiene stats/HP/AC de bestia PERMANENTEMENTE
    
    CombatTab.tsx:101-119

5C. Player recarga página mientras transformado
    Estado: FALLO TOTAL
    Flujo:
    ├─ Línea 1: Druid (STR 10, HP 50, AC 14) transforma a Lobo (STR 12, HP 60, AC 12)
    ├─ Línea 2: character.stats = Lobo stats, character.hp = Lobo HP, character.ac = 12
    ├─ Línea 3: localStorage = {form: "Lobo", timestamp}  ← NO CONTIENE ORIGINAL
    ├─ Línea 4: Player recarga página (F5)
    ├─ Línea 5: CombatTab carga: originalStats = Lobo (INCORRECTO)
    ├─ Línea 6: wildShapeState reconstructed con stats INCORRECTAS
    └─ Línea 7: User presiona "Terminar Forma" → Druid permanece con STR 12 (PERMANENTEMENTE ROTO)

    ⚠️  SOLUCIÓN: localStorage debe guardar originalStats/HP/AC snapshot

5D. wildShapeForms tracking (bestias conocidas)
    Estado: ❌ NUNCA IMPLEMENTADO
    ├─ Se define en types.ts                ✅ wildShapeForms?: string[]
    ├─ Se inicializa en CreatorSteps        ⚠️ Probablemente sí
    ├─ Se actualiza al transformar          ❌ NO HAY CÓDIGO
    └─ Se usa para filtrado               ❌ Nunca poblado
    
    IMPACTO: Filtro de "bestias conocidas" nunca funciona

5E. Character.activeWildShape persistencia
    Estado: ✅ SE PERSISTE
    └─ Se guarda en character JSON si onUpdate lo preserva

IMPACTO GLOBAL: Reload mientras transformado = CORRUPCIÓN DE STATS PERMANENTE


═════════════════════════════════════════════════════════════════════════════
RESUMEN CRÍTICO (7 BUGS ENCONTRADOS)
═════════════════════════════════════════════════════════════════════════════

🔴 CRÍTICA - Bloquea uso correcto:
  1. Stats INT/WIS/CHA reemplazadas           wildShapeUtils.ts:108
  2. localStorage pierde datos originales      wildShapeUtils.ts:158-168
  3. Reload corrompe stats permanentemente     CombatTab.tsx:101-119
  4. Restaura usos a max                      wildShapeUtils.ts:144-146
  5. AC Circle of Moon usa beast WIS          wildShapeUtils.ts:36-45

🟡 IMPORTANTE - Impacta features:
  6. canUseFlySpeed lógica invertida          wildShapeUtils.ts:62
  7. wildShapeForms nunca se actualiza        CombatTab.tsx (falta implementación)
```

---

## 📋 TABLA RESUMEN RÁPIDA

| Aspecto | Esperado | Real | ✅/❌ | Archivo:Línea |
|---------|----------|------|-------|--------------|
| **1. Modal Apertura** | ✅ Click abre | Abre (centered) | ✅ | WildShapePanel:115 |
| **2. CR Filtering** | ✅ CR ≤ maxCR | Filtra bien | ✅ | wildShapeUtils:60-73 |
| **2b. Fly Speed** | Permite si puede | Rechaza si puede | ❌ | wildShapeUtils:62 |
| **2c. Known Forms** | Filtra xbestia | Nunca poblado | ❌ | CombatTab:152 |
| **3. Stats STR/DEX/CON** | Bestia | Bestia | ✅ | wildShapeUtils:108 |
| **3. Stats INT/WIS/CHA** | Druid original | Bestia (MALO) | ❌ | wildShapeUtils:108 |
| **3. THP** | +duidLevel o +3×| Correcto | ✅ | wildShapeUtils:23-26 |
| **3. AC Circle Moon** | 13+druidWIS | 13+beastWIS (MALO) | ❌ | wildShapeUtils:41 |
| **3. activeWildShape** | Setear nombre | Setea nombre | ✅ | wildShapeUtils:110 |
| **4. Decrement Uses** | current -= 1 | current += 1 (MALO) | ❌ | wildShapeUtils:144 |
| **4. Restore Stats** | Orig stats | Orig stats | ✅ | wildShapeUtils:127 |
| **4. Clear localStorage** | Limpiar | Limpia | ✅ | wildShapeUtils:151 |
| **5. Save localStorage** | form+timestamp | Guarda (pero incompleto) | ⚠️ | wildShapeUtils:158 |
| **5. Load localStorage** | Reconstruir state OK | Con datos INCORRECTOS | ❌ | CombatTab:101 |
| **5. Reload recovery** | Stats OK | Stats CORRUPTOS | ❌ | CombatTab:101-119 |

---

## 🎯 CONCLUSIONES RÁPIDAS

| Condición | Estado | Gravedad | Acción |
|-----------|--------|----------|--------|
| 1. Modal | ✅ OK | - | Sin cambios |
| 2. Filtrado | ⚠️ CR OK, Fly roto | 🔴 Alta | Invertir lógica fly + poblar wildShapeForms |
| 3. Transform | ❌ CRÍTICA | 🔴 Máxima | Separar INT/WIS/CHA, guardar originales |
| 4. Restore | ❌ CRÍTICA | 🔴 Máxima | Cambiar +1 a mantener current |
| 5. Persist | ❌ CRÍTICA | 🔴 Máxima | Guardar/cargar snapshot completo |

**Druid QUEDA ROTO si**: Recarga página, termina forma, o juega múltiples combates.
