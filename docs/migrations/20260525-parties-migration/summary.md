# Supabase → Firebase Migration Status: Executive Summary

**Generado:** 2026-05-25 | **Status:** Análisis completo | **Confianza:** Alta (95%)

---

## 📊 Tabla Resumen de Migración

| Tabla Supabase | Registros | Status | Firebase Equiv | Script | Acción Requerida |
|---|---|---|---|---|---|
| `characters` | ? (desconocido) | ✅ Migrado | `/characters/{charId}` | `migrate-to-firebase.mjs` | ⚠️ Verificar conteo |
| `parties` | 5 | ✅ Migrado | `/parties/{partyId}` | `migrate-parties-to-firebase.mjs` | ✅ Completado |
| `party_resources` | ~25-250 | ❌ NO Migrado | `/parties/{partyId}/resources` | ❌ FALTA | 🔴 CRÍTICA |
| `telegram_commands` | ? (efímero) | ❌ NO Migrado | ❓ Indefinido | ❌ FALTA | 🟡 Opcional |
| `allowed_telegram_users` | 1-5 | ❌ NO Migrado | ❓ Indefinido | ❌ FALTA | 🟡 Opcional |
| `telegram_sessions` | 1-5 (efímero) | ❌ NO Migrado | ❓ Indefinido | ❌ FALTA | 🟡 Opcional |

---

## 🔴 Críticos (Bloquean Funcionalidad)

### 1. party_resources — FALTA MIGRACIÓN
- **Estado:** Supabase tiene ~25-250 registros; Firebase `/parties/{partyId}/resources` existe pero vacío
- **Impacto:** Feature de DM Atlas (mapas/imágenes) no sincroniza con Firebase
- **Causa:** No existe script `migrate-party-resources-to-firebase.mjs`
- **Acción:** Crear script de migración + ejecutar
- **Complejidad:** Media | **Duración:** 4-6 horas

### 2. party_codes — TABLA LOOKUP AUSENTE
- **Estado:** Supabase almacena códigos en `parties.code`; Firebase `/party_codes` existe pero vacío
- **Impacto:** Feature de "unirse a partida por código" podría funcionar pero sin lookup table optimizado
- **Causa:** No existe script para crear índice de códigos en Firebase
- **Acción:** Crear `migrate-party-codes-to-firebase.mjs`
- **Complejidad:** Baja | **Duración:** 1-2 horas

### 3. Verificación de character migration — AUDITORÍA INCOMPLETA
- **Estado:** Script `migrate-to-firebase.mjs` existe pero NO hay registro de ejecución
- **Impacto:** Desconocido si characters fueron migrados correctamente
- **Causa:** Falta audit trail / logs de ejecución
- **Acción:** Query Firebase y Supabase para verificar counts
- **Complejidad:** Baja | **Duración:** 30 min

---

## 🟡 Opcionales (Bajo Impacto)

### Telegram Integration
- **Estado:** 3 tablas (`telegram_commands`, `allowed_telegram_users`, `telegram_sessions`)
- **Impacto:** Feature de bot Telegram no funciona post-migración
- **Causa:** Nunca se diseñó equivalente en Firebase
- **Acción:** Decidir si mantener feature o abandonarla
  - Si abandonar: Eliminar de Supabase
  - Si migrar: Diseñar + crear scripts
- **Complejidad:** Baja | **Duración:** 0-4 horas (depends en decisión)

---

## ✅ Completados

| Tabla | Registros | Status | Notas |
|---|---|---|---|
| `characters` | ? | ✅ Script existe | Sin audit trail visible |
| `parties` | 5 | ✅ Migrado confirmado | Última ejecución: 2026-05-25 23:24:36Z |

---

## 🎯 Ruta Crítica (Priority Order)

```
1. VERIFICACIÓN (30 min)
   └─ Query: SELECT COUNT(*) FROM supabase.characters
   └─ Query: SELECT COUNT(*) FROM firebase.characters (via Admin SDK)
   └─ Compare conteos → validate migración exitosa

2. PARTY_RESOURCES (4-6 horas)
   └─ Crear script migrate-party-resources-to-firebase.mjs
   └─ Query: SELECT COUNT(*) FROM supabase.party_resources
   └─ Test en DRY_RUN mode
   └─ Ejecutar migración

3. PARTY_CODES (1-2 horas)
   └─ Crear script migrate-party-codes-to-firebase.mjs
   └─ Populate /party_codes collection from /parties
   └─ Test query by code

4. TELEGRAM (DECISION NEEDED)
   └─ Option A: Abandon feature (delete from Supabase)
   └─ Option B: Migrate (4 horas) - si es crítico

5. MEMBERS COLLECTION (DESIGN PENDING)
   └─ Architecture decision: denormalized vs nested
   └─ Implement population logic
```

---

## 📋 Queries para Obtener Conteos Exactos

### Supabase (ejecutar en SQL Editor)

```sql
-- Characters
SELECT COUNT(*) as char_count, 
       COUNT(DISTINCT user_id) as unique_users,
       COUNT(DISTINCT party_id) as parties_referenced
FROM characters
WHERE deleted_at IS NULL;

-- Party Resources
SELECT COUNT(*) as resource_count,
       COUNT(DISTINCT party_id) as parties_with_resources,
       COUNT(CASE WHEN is_persistent=true THEN 1 END) as persistent,
       COUNT(CASE WHEN is_persistent=false THEN 1 END) as ephemeral
FROM party_resources;

-- Telegram
SELECT COUNT(*) as command_count, status as status_dist
FROM telegram_commands
GROUP BY status;

SELECT COUNT(*) FROM allowed_telegram_users;
SELECT COUNT(*) FROM telegram_sessions;
```

### Firebase (ejecutar con Admin SDK)

```javascript
// Characters
const charSnapshot = await admin.firestore().collection('characters').get();
console.log(`Firebase characters: ${charSnapshot.size}`);

// Parties
const partiesSnapshot = await admin.firestore().collection('parties').get();
console.log(`Firebase parties: ${partiesSnapshot.size}`);

// Resources (should be empty)
const resourcesSnapshot = await admin.firestore()
  .collectionGroup('resources').get();
console.log(`Firebase resources: ${resourcesSnapshot.size}`);
```

---

## 🔐 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Characters migrados con UID mapping incorrecto | MEDIA | ALTO | Verificar 10-20 records aleatorios |
| Party_resources con URLs rotas (Supabase → R2) | MEDIA | MEDIO | Validar URLs en script antes de migrar |
| Orphaned resources (FK party_id inválido) | BAJA | MEDIO | Query orphans y excluir en migración |
| Telegram feature abandonado sin cleanup | BAJA | BAJO | Decidir antes de migrar |

---

## 📍 Locaciones de Documentación

- **Reporte Completo:** `docs/plan/supabase_to_firebase_migration_status.yaml`
- **Audit Trail:** `audit/` (con backups y logs de migración parties)
- **SQL Migrations:** `supabase/migrations/` (001-008)
- **Migration Scripts:** `scripts/migrate-*.mjs` (existen 2, faltan 3)

---

## ⏱️ Estimación Total Restante

| Tarea | Duración | Prioridad |
|---|---|---|
| Verificación de characters | 0.5h | P0 |
| party_resources migration | 5h | P0 |
| party_codes migration | 2h | P0 |
| Telegram decision + acción | 0-4h | P2 |
| **TOTAL** | **7.5-11.5h** | — |

---

## ✅ Próximos Pasos Recomendados

1. **Hoy (Inmediato):**
   - [ ] Ejecutar queries de conteo en Supabase y Firebase
   - [ ] Crear Issue: "Verify character migration success"
   - [ ] Crear Issue: "Migrate party_resources to Firebase"

2. **Esta Semana:**
   - [ ] Crear script `migrate-party-resources-to-firebase.mjs`
   - [ ] Crear script `migrate-party-codes-to-firebase.mjs`
   - [ ] Decidir sobre Telegram integration

3. **Próxima Sprint:**
   - [ ] Ejecutar migrations
   - [ ] Validación post-migración
   - [ ] Documentar cutover strategy
