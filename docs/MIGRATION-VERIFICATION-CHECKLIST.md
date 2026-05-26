# Verificación Rápida: Conteo de Registros en Supabase

**Objetivo:** Obtener los números exactos que faltan en el análisis

---

## 🔍 Queries a Ejecutar en Supabase SQL Editor

Ir a: **Supabase Dashboard → SQL Editor → Nueva Query**

### Query 1: Characters Count
```sql
SELECT 
  COUNT(*) as total_characters,
  COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_characters,
  COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_characters,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT party_id) as parties_referenced
FROM characters;
```

**Resultado esperado:** ~50-500 personajes

---

### Query 2: Party Resources Count
```sql
SELECT 
  COUNT(*) as total_resources,
  COUNT(DISTINCT party_id) as parties_with_resources,
  COUNT(*) FILTER (WHERE is_persistent = true) as persistent_resources,
  COUNT(*) FILTER (WHERE is_persistent = false) as ephemeral_resources
FROM party_resources;
```

**Resultado esperado:** ~25-250 recursos

---

### Query 3: Telegram Tables Count
```sql
SELECT 
  (SELECT COUNT(*) FROM telegram_commands) as telegram_commands_count,
  (SELECT COUNT(*) FILTER (WHERE status = 'pending') FROM telegram_commands) as pending_commands,
  (SELECT COUNT(*) FROM allowed_telegram_users) as authorized_users,
  (SELECT COUNT(*) FROM telegram_sessions) as active_sessions;
```

**Resultado esperado:**
- Commands: 0-50 (ephemeral)
- Authorized users: 1-5
- Sessions: 0-5

---

### Query 4: Data Integrity Check
```sql
-- Detectar orphaned records
SELECT 
  'Orphaned party_resources (parent party deleted)' as issue_type,
  COUNT(*) as count
FROM party_resources pr
LEFT JOIN parties p ON pr.party_id = p.id
WHERE p.id IS NULL
UNION ALL
SELECT 
  'Characters referencing non-existent parties' as issue_type,
  COUNT(*) as count
FROM characters c
LEFT JOIN parties p ON c.party_id = p.id
WHERE c.party_id IS NOT NULL AND p.id IS NULL;
```

**Resultado esperado:** Idealmente 0 en ambos

---

## 🔥 Firebase Verification (requiere Firebase Admin SDK)

### Script: `verify-migration.mjs`

Crear archivo `scripts/verify-migration.mjs`:

```javascript
#!/usr/bin/env node
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || 
  './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Service account file not found: ${serviceAccountPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'dungeon-forge-prod'
});

const db = admin.firestore();

async function verifyMigration() {
  console.log('\n📊 Firebase Migration Verification\n' + '─'.repeat(50));

  try {
    // Count characters
    const charSnapshot = await db.collection('characters').get();
    console.log(`\n✅ Characters: ${charSnapshot.size} docs`);
    
    // Sample a few
    if (charSnapshot.size > 0) {
      const samples = charSnapshot.docs.slice(0, 3);
      samples.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.data?.name || 'Unknown'} (user_id: ${data.user_id})`);
      });
    }

    // Count parties
    const partiesSnapshot = await db.collection('parties').get();
    console.log(`\n✅ Parties: ${partiesSnapshot.size} docs`);
    partiesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`   - ${data.name} (code: ${data.partyCode})`);
    });

    // Check resources (should be empty)
    const resourcesSnapshot = await db.collectionGroup('resources').get();
    console.log(`\n${resourcesSnapshot.size === 0 ? '⚠️ ' : '✅ '}Resources: ${resourcesSnapshot.size} docs`);
    
    if (resourcesSnapshot.size > 0) {
      console.log('   ⚠️  Resources should be empty until migration runs');
    }

    // Check party_codes (should be empty)
    const codesSnapshot = await db.collection('party_codes').get();
    console.log(`\n${codesSnapshot.size === 0 ? '⚠️ ' : '✅ '}Party Codes: ${codesSnapshot.size} docs`);
    
    if (codesSnapshot.size > 0) {
      codesSnapshot.docs.slice(0, 3).forEach(doc => {
        console.log(`   - Code: ${doc.id}`);
      });
    }

    // Summary
    console.log('\n' + '─'.repeat(50));
    console.log('✅ Verification complete');
    
    const migratedCount = charSnapshot.size + partiesSnapshot.size;
    console.log(`\n📈 Total migrated docs: ${migratedCount}`);
    console.log(`📈 Total pending: ${resourcesSnapshot.size} (resources)\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

verifyMigration();
```

### Ejecutar:
```bash
FIREBASE_SERVICE_ACCOUNT=./dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json \
node scripts/verify-migration.mjs
```

---

## 📋 Checklist de Verificación

- [ ] **Characters:** Ejecutar Query 1, anotar total
- [ ] **Party Resources:** Ejecutar Query 2, anotar total
- [ ] **Telegram:** Ejecutar Query 3, anotar totales
- [ ] **Data Integrity:** Ejecutar Query 4, verificar orphans = 0
- [ ] **Firebase Count:** Ejecutar verify-migration.mjs, comparar conteos
- [ ] **UID Mapping:** Verificar que Firebase characters.user_id son valid Firebase UIDs

---

## 🎯 Flujo de Acción Post-Verificación

### Si characters count es > 0 en ambas BD:
✅ **Character migration fue exitosa**
→ Proceder a `party_resources`

### Si characters count es 0 en Firebase:
⚠️ **Character migration FALLÓ o no se ejecutó**
→ Ejecutar `migrate-to-firebase.mjs` manualmente

### Si party_resources count > 0 en Supabase pero 0 en Firebase:
⚠️ **Necesario crear y ejecutar `migrate-party-resources-to-firebase.mjs`**
→ Ver: `docs/plan/supabase_to_firebase_migration_status.yaml`

---

## 📞 Soporte / Troubleshooting

**Error: "Firebase Service Account file not found"**
→ Copiar `dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json` al root del proyecto

**Error: "Supabase permission denied"**
→ Usar SERVICE ROLE KEY, no anon key (en `AI_CONTEXT.md`)

**Error: "Cannot read characters from Firebase"**
→ Verificar que `VITE_FIREBASE_*` env vars están seteadas en `.env`
