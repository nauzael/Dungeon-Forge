# Resumen Ejecutivo: Plan de Migración Supabase Parties → Firebase

**Fecha:** 25 de Mayo 2026  
**Plan ID:** `20260525-migrate-supabase-parties-to-firebase`  
**Estatus:** ✅ PLAN CREADO - LISTO PARA REVISIÓN

---

## 📋 Resumen

Se ha creado un **plan de migración exhaustivo** para mover la tabla `parties` de Supabase a Firebase Firestore con **garantía de cero pérdida de datos**.

**Deliverable Principal:** `MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml`

---

## 🎯 Objetivos Clave

1. **NO DATA LOSS** - Cada registro migra intacto
2. **Integridad de datos** - Sin truncación, tipos preservados
3. **Mapeo de UIDs** - Estrategia de 3 capas para users sin Firebase
4. **Dry-run obligatorio** - Preview sin escrituras antes de producción
5. **Validación completa** - Verificaciones pre/post migración
6. **Rollback ready** - Procedimiento claro si algo falla

---

## 📊 Estructura de Datos

### Supabase (Origen)
```sql
parties (
  id UUID PRIMARY KEY,
  creator_id TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Firebase (Destino)
```json
parties/{id} {
  id: "string (UUID)",
  creator_id: "string (Firebase UID)",
  name: "string",
  code: "string",
  createdAt: "ISO 8601",
  updatedAt: "ISO 8601",
  _metadata: {
    migrationSource: "supabase",
    migratedAt: "timestamp",
    sourceCreatorId: "original_id"
  }
}
```

---

## 🔄 5 Fases del Plan

| Fase | Objetivo | Duración | Validación |
|------|----------|----------|-----------|
| **1. Pre-Migración** | Auditoría, backup, mapeo UIDs | 20 min | ✅ Todos los records contados |
| **2. Desarrollo** | Script migración + dry-run | 60 min | ✅ DRY_RUN mode funcional |
| **3. Dry-Run** | Preview sin escrituras | 15 min | ✅ 0 errores de transformación |
| **4. Producción** | Ejecutar migración en vivo | 30 min | ✅ Todos records en Firebase |
| **5. Validación** | Integridad + spot-check | 30 min | ✅ Fuente = Destino |

---

## 🔐 Estrategia de Mapeo de UIDs

**Problema:** Supabase UIDs (TEXT/email) vs Firebase UIDs (strings)  
**Usuarios sin Firebase:** Necesitan mapping antes de migrar

### Solución (3 capas):
1. **Mapping automático** - Users ya en Firebase
2. **Fallback por email** - Encontrar usuario por email
3. **Mapeo manual** - Flag para revisión post-migración

**Archivo output:** `scripts/data/uid-mapping.json`

---

## 🛡️ Validación de Integridad

### Pre-Migración ✅
- [ ] Count Supabase parties
- [ ] Verify Firebase structure
- [ ] Check NULL values
- [ ] Validate code uniqueness
- [ ] Build UID mapping

### Dry-Run ✅
- [ ] DRY_RUN=true (preview only)
- [ ] Compare record counts
- [ ] Spot-check transformations
- [ ] Verify no Firebase writes

### Post-Migración ✅
- [ ] Row count verification (source = target)
- [ ] Data integrity (50+ random records)
- [ ] Code uniqueness in Firebase
- [ ] UID mapping coverage > 99%
- [ ] Relationship validation
- [ ] Archive backup

---

## 📋 Checklist de Ejecución

### Fase 1: Pre-Migración
```bash
# 1.1 Auditar Supabase
node scripts/audit-supabase-parties.mjs

# 1.2 Verificar Firebase
node scripts/verify-firebase-structure.mjs

# 1.3 Validar relaciones
node scripts/validate-party-relationships.mjs

# 1.4 Backup de Supabase
node scripts/export-supabase-parties-backup.mjs

# 1.5 Construir mapeo UIDs
node scripts/build-uid-mapping.mjs
```

### Fase 2: Desarrollo
Scripts creados:
- `migrate-parties-to-firebase.mjs` - Script principal
- `transform-party-record.mjs` - Lógica de transformación
- `validate-batch.mjs` - Validación por batch
- `rollback-parties-from-firebase.mjs` - Rollback

### Fase 3: Dry-Run
```bash
# PREVIEW ONLY - NO WRITES TO FIREBASE
DRY_RUN=true node scripts/migrate-parties-to-firebase.mjs
```

### Fase 4: Producción
```bash
# LIVE MIGRATION - WRITES TO FIREBASE
DRY_RUN=false node scripts/migrate-parties-to-firebase.mjs
```

### Fase 5: Validación
```bash
# Verificar counts
node scripts/verify-row-counts.mjs

# Integrity check
node scripts/integrity-check-sample.mjs

# Validar relaciones
node scripts/validate-migrated-relationships.mjs
```

---

## 🚨 Criterios de Éxito (TODO DEBE PASAR)

- ✓ Audit Supabase completado
- ✓ UID mapping > 95% coverage
- ✓ Dry-run 0 errores
- ✓ Row count exacto (source = target)
- ✓ Integrity check: 0 truncations
- ✓ Code uniqueness: 100%
- ✓ UID mapping: > 99% validos
- ✓ Relationships: 0 orphaned records
- ✓ Backup archivado con hash

---

## ⏮️ Plan de Rollback

Si algo falla:

1. **STOP** - Detener inmediatamente
2. **DELETE** - `node scripts/rollback-parties-from-firebase.mjs`
3. **INVESTIGATE** - Revisar logs de error
4. **FIX** - Corregir root cause
5. **RETRY** - Nuevo dry-run antes de producción

**Casos de rollback:**
- Row count mismatch
- Data corruption encontrada
- UID mapping > 5% unmapped
- Firestore quota exceeded

---

## 📁 Archivos Generados

**Plan YAML (Source of Truth):**
- `MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml`

**Scripts de Migración:**
- `scripts/audit-supabase-parties.mjs`
- `scripts/verify-firebase-structure.mjs`
- `scripts/validate-party-relationships.mjs`
- `scripts/export-supabase-parties-backup.mjs`
- `scripts/build-uid-mapping.mjs`
- `scripts/migrate-parties-to-firebase.mjs` (main)
- `scripts/transform-party-record.mjs`
- `scripts/validate-batch.mjs`
- `scripts/rollback-parties-from-firebase.mjs`

**Data Files:**
- `scripts/data/uid-mapping.json`
- `backups/supabase-parties-backup-20260525.json`

**Audit Reports:**
- `audit/supabase-parties-audit.json`
- `audit/uid-mapping-report.json`
- `audit/FINAL-VALIDATION-20260525.json`

---

## ✅ Próximos Pasos

### 1. **Revisión del Plan** (30 min)
- [ ] Revisar `MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml`
- [ ] Verificar que el schema es correcto
- [ ] Confirmar UID mapping strategy
- [ ] Obtener aprobación

### 2. **Crear Scripts de Migración** (2-3 horas)
- Implementar `migrate-parties-to-firebase.mjs`
- Crear `transform-party-record.mjs`
- Crear funciones de validación
- Crear rollback script

### 3. **Ejecutar Fase 1: Pre-Migración** (30 min)
- Auditar Supabase
- Construir UID mapping
- Exportar backup
- Validar Firebase

### 4. **Ejecutar Fase 3: Dry-Run** (15 min)
- `DRY_RUN=true` - preview completo
- Validar transformaciones
- Spot-check resultados

### 5. **Ejecutar Fase 4: Producción** (30 min)
- `DRY_RUN=false` - migración en vivo
- Monitorear errores
- Mantener logs

### 6. **Ejecutar Fase 5: Validación** (30 min)
- Verificar row counts
- Integrity check
- Relationship validation

---

## 📞 Contacto & Escalación

Si durante la migración se encuentra:
- **Error de datos:** Rollback inmediato
- **UID mapping issue:** Investigar y mapear manualmente
- **Quota exceeded:** Esperar 24h y reintentar
- **Structural mismatch:** Revisar schema y replanificar

---

## 📌 Notas Importantes

1. **DRY_RUN es obligatorio** - Never skip the preview step
2. **Backups antes de migrar** - Cannot recover without backups
3. **UID mapping crítico** - Sin mapeo correcto, parties quedan sin creador
4. **Relaciones deben validarse** - Characters deben seguir vinculados a parties
5. **Firestore rules después** - Implementar RLS post-migración

---

**PLAN READY FOR EXECUTION**  
Documento ejecutivo: `MIGRATION-SUMMARY-20260525.md`  
Plan detallado: `MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml`
