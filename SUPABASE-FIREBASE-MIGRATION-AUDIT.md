# Auditoría de Migración Supabase → Firebase
**Fecha:** 25 de mayo de 2026  
**Proyecto:** Dungeon Forge  
**Rama:** feature/firebase-migration  
**Estado:** ✅ **MIGRACIÓN EJECUTABLE**

---

## 📋 Resumen Ejecutivo

La migración de Supabase a Firebase está **parcialmente completada**:
- ✅ Colección **characters** lista para migración (script existe)
- ❌ Colección **parties** NO incluida en script actual
- ⚠️ Se requieren credenciales de Supabase (Service Role Key)
- ✅ Firebase Firestore ya está en producción (dungeon-forge-prod)

**Acción Inmediata:** Obtener credenciales de Supabase y ejecutar migration preview (DRY_RUN)

---

## 🗄️ Esquema Supabase

### Tabla: `characters`
```
id (UUID)
user_id (UUID) → auth.users
data (JSONB) → Character object completo
party_id (UUID, nullable) → parties.id
updated_at (timestamp)
deleted_at (timestamp, nullable - soft deletes)
```

**Estimado de registros:** DESCONOCIDO (no hay acceso a DB)  
**RLS:** Activo (requiere SERVICE_ROLE_KEY para leer)  
**Migración:** ✅ Script existe: `scripts/migrate-to-firebase.mjs`

### Tabla: `parties` ⚠️
```
id (UUID)
creator_id (UUID)
dm_uid (UUID)
name (text)
created_at (timestamp)
updated_at (timestamp)
members (JSONB) → { user_id: {...} }
```

**Estimado de registros:** DESCONOCIDO  
**Migración:** ❌ NO IMPLEMENTADA - Bloqueador prioritario

### Tabla: `campaigns`
Probablemente existe pero no se usa activamente en Supabase.

---

## 🔥 Esquema Firebase (Actual)

### Colección: `/characters`
```javascript
{
  id: "char-uuid",
  user_id: "firebase-uid",           // Mapeado desde Supabase UUID
  data: { /* full Character object */ },
  party_id: "party-uuid" | null,
  updated_at: Timestamp,
  deleted_at: Timestamp | null
}
```
**Docs activos:** DESCONOCIDO  
**RLS:** read if user_id == auth.uid  
**Sync:** ✅ Activo (App.tsx subscribeToOwnCharacters)

### Colección: `/parties`
```javascript
{
  id: "auto-generated",
  creator_id: "firebase-uid",
  dm_uid: "firebase-uid",
  name: "string",
  created_at: Timestamp,
  updated_at: Timestamp,
  members: { "firebase-uid": { joined_at: Timestamp } }
}
```
**Subcollections:**
- `/parties/{partyId}/members/{memberId}` (RLS: DM only)
- `/parties/{partyId}/resources/{resourceId}` (Campaign resources)

### Colección: `/party_codes`
Códigos de 6-8 caracteres para unirse a partidas sin invitación directa.

### Colección: `/campaigns`
Placeholder (RLS: deny all read/write) - no implementado.

---

## 🔄 Mapeo de Migración

| Supabase | Firebase | Notas |
|----------|----------|-------|
| characters.id | characters.{charId}.id | UUID→String |
| characters.user_id | characters.{charId}.user_id | **UID mapping** por email |
| characters.data | characters.{charId}.data | JSONB→Object |
| characters.party_id | characters.{charId}.party_id | Preservado |
| characters.updated_at | characters.{charId}.updated_at | timestamp→Timestamp |
| characters.deleted_at | characters.{charId}.deleted_at | Soft delete preserved |
| **parties** | **parties** | **❌ NO MIGRADO** |

### UID Mapping (Crítico)
Supabase UIDs (UUID4) ≠ Firebase UIDs (alphanumeric)
- Script mapea automáticamente **por email**
- Si el email no existe en Firebase, **crea el usuario automáticamente**
- Si no hay email → **salta el personaje** (no se pierde, solo no migrado)

---

## 🛠️ Script de Migración

**Archivo:** `scripts/migrate-to-firebase.mjs`  
**Estado:** ✅ Listo para usar

### Modos de Ejecución

#### 1️⃣ Preview (Dry-Run) - Recomendado primero
```bash
DRY_RUN=true \
  SUPABASE_URL=https://xxx.supabase.co \
  SUPABASE_SERVICE_KEY=eyJhbGc... \
  node scripts/migrate-to-firebase.mjs
```
**Output:** Listado de personajes que se migrarían (sin escribir nada en Firestore)

#### 2️⃣ Migración de un solo usuario
```bash
SUPABASE_URL=https://xxx.supabase.co \
  SUPABASE_SERVICE_KEY=eyJhbGc... \
  FIREBASE_SERVICE_ACCOUNT=./service-account.json \
  FIREBASE_USER_ID=firebase-uid-aqui \
  node scripts/migrate-to-firebase.mjs
```
**Efecto:** Todos los personajes de Supabase → Firebase UID especificado

#### 3️⃣ Migración multi-usuario (Recomendado)
```bash
SUPABASE_URL=https://xxx.supabase.co \
  SUPABASE_SERVICE_KEY=eyJhbGc... \
  FIREBASE_SERVICE_ACCOUNT=./service-account.json \
  node scripts/migrate-to-firebase.mjs
```
**Efecto:** Mapea por email automáticamente; crea usuarios en Firebase si no existen

### Variables de Entorno Requeridas

| Variable | Obligatorio | Obtener de | Notas |
|----------|-------------|-----------|-------|
| `SUPABASE_URL` | ✅ Sí | Supabase Dashboard → Settings | ej: `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | ✅ Sí | Supabase → Settings → API → **Service Role** | ⚠️ NO la anon key |
| `FIREBASE_SERVICE_ACCOUNT` | ✅ Sí (prod) | Firebase Console → Settings → Service Accounts | Path local: `./service-account.json` |
| `FIREBASE_USER_ID` | ❌ No | Tu Firebase UID | Opcional, para single-user mode |
| `DRY_RUN` | ❌ No | N/A | `true` para preview sin escribir |
| `INCLUDE_DELETED` | ❌ No | N/A | `true` para incluir soft-deleted |

### Características del Script

✅ **Validación de Caracteres**
- Cada personaje se valida antes de escribir (isValidCharacter)
- Invalidos se saltan con warning en logs

✅ **Optimización de Imágenes**
- Detecta base64 imageUrl >200KB
- Las remueve para cumplir límite de 1MB por documento de Firestore
- Log: "Removiendo imageUrl base64 gigante"

✅ **Manejo de Usuarios**
- Intenta mapear Supabase UID → Firebase UID por email
- Si no existe, crea usuario en Firebase automáticamente
- Si mapeo falla → salta personaje (sin pérdida de datos)

✅ **Batching Inteligente**
- Página de 1000 registros
- Batch de 400 documentos (límite Firestore es 500)
- Ejecuta secuencialmente para evitar throttling

✅ **Progress Tracking**
- Logs de cada página, batch y summary final
- Resume: migrados, omitidos, errores

---

## 🚨 Bloqueadores Identificados

### 🔴 BLOQUEADOR 1: Parties no migradas
**Severidad:** ALTA  
**Descripción:** Tabla `parties` en Supabase no incluida en migration script  
**Impacto:** Datos de partidas se perderán; deben recrearse manualmente en Firebase  
**Resolución Recomendada:**
1. Crear `scripts/migrate-parties-to-firebase.mjs` (similar pattern)
2. Mapear Supabase party UIDs → Firebase party UIDs por nombre/email DM
3. Ejecutar DESPUÉS de character migration (dependencia de user_id)

**Esfuerzo estimado:** 2-3 horas  
**Prioridad:** ANTES de considerar migración "completa"

---

### ⚠️ BLOQUEADOR 2: Credenciales de Supabase faltantes
**Severidad:** MEDIA  
**Descripción:** .env no contiene credenciales de Supabase  
**Actual:** Solo Firebase vars  
**Resolución:**
```bash
# 1. Ir a Supabase Dashboard → Settings → API
# 2. Copiar "Project URL" → SUPABASE_URL
# 3. Copiar "Service Role Secret" (NO "anon public") → SUPABASE_SERVICE_KEY
# 4. Exportar variables:
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5..."
# 5. Ejecutar script
```

---

### ⚠️ BLOQUEADOR 3: Service Account JSON no presente
**Severidad:** MEDIA  
**Descripción:** `service-account.json` (Firebase) no en repo  
**Impacto:** Script no puede escribir a Firestore sin credenciales  
**Resolución:**
```bash
# 1. Firebase Console → Project Settings → Service Accounts
# 2. Click "Generate New Private Key"
# 3. Guardar como service-account.json en root del proyecto
# 4. ⚠️ SEGURIDAD: Añadir a .gitignore
echo "service-account.json" >> .gitignore
# 5. ⚠️ NO commitear credenciales
```

---

### 💛 BLOQUEADOR 4: UID Mapping por Email
**Severidad:** MEDIA  
**Descripción:** Supabase UIDs ≠ Firebase UIDs; requiere mapeo por email  
**Riesgo:** Si emails no coinciden, personajes se omiten  
**Mitigación:**
- Script auto-crea usuarios en Firebase si no existen
- Revisar logs post-migración por usuarios "omitidos"
- Opción: mapeo manual en multi-user mode

---

### 💚 BLOQUEADOR 5: Imágenes Base64 Gigantes
**Severidad:** BAJA (visual only)  
**Descripción:** Base64 imageUrl >200KB causa doc size >1MB (límite Firestore)  
**Solución:** Script las remueve automáticamente  
**Recovery:** Re-cargar avatares vía app UI post-migración

---

## ✅ Checklist Pre-Migración

- [ ] **Credenciales de Supabase obtenidas**
  - [ ] SUPABASE_URL copiado
  - [ ] SUPABASE_SERVICE_KEY copiado (Service Role, no anon)
  
- [ ] **Firebase service-account.json descargado**
  - [ ] Guardado en `./service-account.json`
  - [ ] Añadido a `.gitignore`
  - [ ] NO commiteado
  
- [ ] **Script de migración revisado**
  - [ ] `scripts/migrate-to-firebase.mjs` existe y es legible
  - [ ] Dependencias instaladas (firebase-admin en dev)
  
- [ ] **Dry-run ejecutado**
  - [ ] Comando: `DRY_RUN=true SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/migrate-to-firebase.mjs`
  - [ ] Preview de conteo de personajes revisado
  - [ ] Logs examinados por errores
  
- [ ] **Backup de Supabase**
  - [ ] Exportar datos como JSON (por si acaso)
  - [ ] Guardar en location seguro
  
- [ ] **Plan de migración de parties**
  - [ ] Decidir: script nuevo vs manual vs defer
  - [ ] Si script: asignar dev, estimar 2-3h

---

## 🔍 Datos Encontrados

### En Código
- **App.tsx:** Importa `subscribeToOwnCharacters` (Firebase) y `batchSaveCharacters` (Supabase legacy)
- **firebase.ts:** ~1200 líneas, mantiene 25+ funciones exportadas para Firestore
- **supabase.ts:** ~150 líneas, DEPRECATED pero aún exporta `saveCharacterToCloud`
- **firestore.rules:** Definidas todas las colecciones con RLS; vulnerabilidad de party codes FIXED

### En Configuración
- **.env.example:** Placeholder de Supabase (no real)
- **.env.testing:** Firebase prod (para regresión)
- **.env (actual):** Firebase only

### Scripts Detectados
1. `migrate-to-firebase.mjs` ✅ LISTO
2. `run_migration.js` ❓ Propósito unclear
3. `apply-remove-character-rpc.mjs` 🗑️ Legacy Supabase

---

## 📊 Estimaciones

| Métrica | Estimado |
|---------|----------|
| **Personajes en Supabase** | ❓ DESCONOCIDO (requiere acceso) |
| **Partidas en Supabase** | ❓ DESCONOCIDO |
| **Usuarios mapeados** | ❓ DESCONOCIDO |
| **Tiempo DRY_RUN** | 5-10 min |
| **Tiempo migración (prod)** | 15-30 min (depende de volumen) |
| **Esfuerzo para parties** | 2-3 horas |
| **Esfuerzo total** | 6-10 horas |

---

## 🎯 Próximos Pasos

### Ahora (Hoy)
1. ✅ Obtener `SUPABASE_SERVICE_KEY` de Supabase Dashboard
2. ✅ Descargar `service-account.json` de Firebase Console
3. ✅ Ejecutar DRY_RUN para preview
4. ✅ Revisar logs por errores o usuarios omitidos

### Mañana (Day 2)
5. 🔴 **CREAR SCRIPT DE MIGRACIÓN DE PARTIES**
6. ⚠️ Ejecutar migración real de characters (sin DRY_RUN)
7. ⚠️ Ejecutar migración de parties (después que esté listo)
8. 🔍 Auditar documentos Firestore vs conteos Supabase

### Semana 2
9. ✅ Testear character restore/delete flows
10. ✅ Testear party joins
11. ✅ Verificar user_id mappings (spot-check)
12. ✅ Decomisionar Supabase después de 30 días

---

## 📄 Archivos Generados

- **SUPABASE-FIREBASE-MIGRATION-AUDIT.json** ← Informe técnico (máquina)
- **SUPABASE-FIREBASE-MIGRATION-AUDIT.md** ← Este resumen (lectura)

---

## ✨ Conclusión

La migración es **EJECUTABLE** pero **INCOMPLETA** en parties.

**Riesgo:** 🟢 BAJO (con validación y fallback a localStorage)  
**Recomendación:** Ejecutar character migration AHORA; parties en próxima sprint

**Contacto para dudas:** Ver logs de `migrate-to-firebase.mjs`; código bien documentado
