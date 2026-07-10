# ❌ PROBLEMAS DETECTADOS: Migración de Parties a Firebase

**Fecha:** 2026-05-25  
**Severidad:** 🔴 CRÍTICA (Bloquea funcionalidad)  
**Status:** Requiere corrección inmediata

---

## 📋 RESUMEN EJECUTIVO

Los datos de **parties** migrados de Supabase a Firebase **NO funcionan correctamente** debido a inconsistencias en:
1. **Schema mismatch** - Campos faltantes en escritura
2. **Security Rules conflict** - Las rules esperan campos que no se escriben
3. **Type mismatch** - Timestamps en formato incorrecto
4. **Logic error** - `dm_uid` vs `creator_id` confusión

---

## 🔴 PROBLEMA 1: Campo `dm_uid` Faltante

### Ubicación del Problema

**Archivo:** `firestore.rules` líneas 22-26
```typescript
function isPartyDM(partyId) {
  return get(/databases/$(database)/documents/parties/$(partyId)).data.dm_uid == uid();
}

function isCreator(partyId) {
  return get(/databases/$(database)/documents/parties/$(partyId)).data.creator_id == uid();
}
```

**Archivo:** `utils/firebase.ts` líneas 660-680
```typescript
export const createParty = async (userId: string, name: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const partyData = {
    id: partyRef.id,
    creator_id: userId,  // ❌ Solo se escribe creator_id
    name,
    code,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
    // ❌ FALTA: dm_uid
    // ❌ FALTA: members (object para isPartyMember)
  };
  await setDoc(partyRef, partyData);
};
```

### El Conflicto

| Función | Esperado | Código Actual | Resultado |
|---------|----------|--------------|-----------|
| `isPartyDM()` | `dm_uid == uid()` | `dm_uid` NO existe | ❌ **SIEMPRE FALLA** |
| `isCreator()` | `creator_id == uid()` | `creator_id: userId` | ✅ Funciona |
| Rules para `/parties/{id}` | Crear requiere `dm_uid` | No se escribe | ❌ **UPDATE/DELETE BLOQUEADO** |

### Impacto

```
❌ updateParty() → FALLA (no es DM, campo no existe)
❌ deleteParty() → FALLA (creator check funciona, pero update después falla)
❌ subscribeToPartyResources() → FALLA (isPartyMember check recursivo falla)
```

---

## 🔴 PROBLEMA 2: Timestamp Format Mismatch

### Ubicación del Problema

**Supabase Original Schema:**
```sql
created_at TIMESTAMPTZ DEFAULT now()  -- ISO 8601 string: "2026-05-25T10:30:00Z"
updated_at TIMESTAMPTZ DEFAULT now()  -- ISO 8601 string
```

**Firebase Actual Code:**
```typescript
const partyData = {
  created_at: Timestamp.now(),    // ❌ Firebase Timestamp object
  updated_at: Timestamp.now(),    // ❌ Firebase Timestamp object
};
```

### El Problema

1. **Incompatible con búsquedas:** Queries por rango de fecha fallan
2. **Serialización:** Los Timestamp se serializan como `{_seconds, _nanoseconds}`, no como ISO strings
3. **Lectura del cliente:** El código espera strings ISO pero obtiene objetos

### Impacto

```typescript
// ❌ Esto falla o devuelve datos malformados
const parties = query(
  collection(db, 'parties'),
  where('created_at', '>', new Date('2026-05-01'))  // Type mismatch
);

// ❌ Cliente espera ISO string
const party = partyDoc.data();
console.log(party.created_at);  // {_seconds: 1780207800, _nanoseconds: 0}
                                 // NO: "2026-05-25T10:30:00Z"
```

---

## 🔴 PROBLEMA 3: Missing Nested Collections

### Ubicación del Problema

**Security Rules:** `firestore.rules` líneas 92-114
```typescript
match /parties/{partyId} {
  match /members/{memberId} {
    // Expects subcollection /parties/{partyId}/members/{memberId}
    allow read: if isAuth() && (isPartyDM(partyId) || uid() == memberId);
  }
  
  match /resources/{resourceId} {
    // Expects subcollection /parties/{partyId}/resources/{resourceId}
    allow read: if isAuth() && (isPartyDM(partyId) || isPartyMember(partyId));
  }
}
```

**Firebase Actual Code:** 
```typescript
// ✅ Solo escribe en /parties/{id}, NO escribe en subcollections
const partyRef = doc(collection(firestoreInstance, 'parties'));
await setDoc(partyRef, partyData);
```

### El Problema

1. **No hay código** que escriba en `/parties/{id}/members/{uid}`
2. **isPartyMember()** falla porque intenta leer documento inexistente
3. **CampaignResources.tsx** espera `/parties/{id}/resources/{resourceId}` pero no se crea

### Impacto

```typescript
// ❌ FALLA: party members no se escriben en subcollection
// ❌ FALLA: resources no se escriben en subcollection
// ❌ FALLA: isPartyMember() siempre retorna false
// ❌ FALLA: party_resources table data nunca se migra
```

---

## 🔴 PROBLEMA 4: party_code Lookup Collection Not Implemented

### Ubicación del Problema

**Security Rules:** `firestore.rules` líneas 118-135
```typescript
match /party_codes/{code} {
  allow read: if isAuth();
  allow create: if isAuth() &&
    partyExists(request.resource.data.party_id) &&
    isPartyDM(request.resource.data.party_id) &&
    request.resource.data.code == code;
  allow delete: if isAuth() && isPartyDM(resource.data.party_id);
}
```

**Firebase Code:**
```typescript
// Query parties directly by code
const partiesSnapshot = await getDocs(
  query(
    collection(firestoreInstance, 'parties'),
    where('code', '==', code.trim().toUpperCase())  // ⚠️ Works but inefficient
  )
);
```

### The Problem

1. **No separate lookup collection** `/party_codes/{code}`
2. **Works by accident** because querying `/parties` by code works
3. **Violates rules design** - Rules expect `/party_codes` path
4. **Performance issue** - Each lookup queries entire parties collection

### Impact

```
⚠️ Code lookup works but violates expected architecture
⚠️ Performance degrades as parties grow
⚠️ /party_codes CREATE rule never used, never tested
```

---

## 📊 COMPARISON TABLE: Supabase vs Firebase Schema

| Field | Supabase Type | Firebase Code | Firebase Rules Expected | Match? |
|-------|---------------|---------------|-------------------------|--------|
| `id` | UUID (PK) | `id: partyRef.id` | `parties/{id}` | ✅ |
| `creator_id` | TEXT | `creator_id: userId` | `creator_id` in doc | ✅ |
| `dm_uid` | NOT IN SOURCE | Not written | Expected in `isPartyDM()` | ❌ |
| `name` | TEXT | `name: string` | Not checked | ✅ |
| `code` | TEXT | `code: string` | Not checked | ✅ |
| `created_at` | TIMESTAMPTZ (ISO) | `Timestamp.now()` | Not checked | ❌ |
| `updated_at` | TIMESTAMPTZ (ISO) | `Timestamp.now()` | Not checked | ❌ |
| `members` | Sub-table | Not written | Expected as nested doc map | ❌ |

---

## 🔧 REQUIRED FIXES

### Fix 1: Add `dm_uid` to Party Documents

**Location:** `utils/firebase.ts` line 660-680

```typescript
// ❌ CURRENT (BROKEN)
const partyData = {
  id: partyRef.id,
  creator_id: userId,
  name,
  code,
  created_at: Timestamp.now(),
  updated_at: Timestamp.now(),
};

// ✅ FIXED
const partyData = {
  id: partyRef.id,
  creator_id: userId,
  dm_uid: userId,                    // ADD: Same as creator_id for new parties
  name,
  code,
  createdAt: new Date().toISOString(),  // CHANGE: ISO string
  updatedAt: new Date().toISOString(),  // CHANGE: ISO string
  members: {},                        // ADD: Empty object for members
  settings: {},                       // ADD: Empty object for settings
};
```

### Fix 2: Update joinParty() to Add Members

**Location:** `utils/firebase.ts` line 690-745

```typescript
export const joinParty = async (character: Character, code: string) => {
  // ... existing code ...
  
  // ADD: Write member subcollection
  const memberRef = doc(
    collection(firestoreInstance, 'parties', party.id, 'members'),
    effectiveUserId
  );
  await setDoc(memberRef, {
    userId: effectiveUserId,
    characterName: character.name,
    joinedAt: new Date().toISOString(),
  });
  
  // ADD: Update party members map
  const partyRef = doc(firestoreInstance, 'parties', party.id);
  await updateDoc(partyRef, {
    [`members.${effectiveUserId}`]: {
      characterName: character.name,
      joinedAt: new Date().toISOString(),
    },
  });
};
```

### Fix 3: Create party_codes Collection

**Add new function in `utils/firebase.ts`:**

```typescript
export const createPartyCode = async (partyId: string, code: string) => {
  try {
    const codeRef = doc(firestoreInstance, 'party_codes', code);
    await setDoc(codeRef, {
      code,
      party_id: partyId,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[PartyCode] Failed to create code entry:', e);
  }
};
```

**Update `createParty()`:**

```typescript
export const createParty = async (userId: string, name: string) => {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  // ... write party doc ...
  // ADD:
  await createPartyCode(partyRef.id, code);
};
```

### Fix 4: Use ISO Timestamps Consistently

**Search all files:**
```bash
grep -r "Timestamp.now()" utils/firebase.ts
grep -r "created_at:\|updated_at:" utils/firebase.ts
```

**Replace with:**
```typescript
// USE THIS PATTERN
const now = new Date().toISOString();
const partyData = {
  // ... other fields ...
  createdAt: now,    // Consistent naming
  updatedAt: now,
};
```

---

## ✅ VERIFICATION CHECKLIST

After fixes, verify with:

```javascript
// 1. Check party document structure
const partyDoc = await getDoc(doc(db, 'parties', 'party-id'));
const party = partyDoc.data();
console.assert(party.dm_uid, '❌ Missing dm_uid');
console.assert(party.creator_id, '❌ Missing creator_id');
console.assert(typeof party.createdAt === 'string', '❌ createdAt not ISO string');
console.assert(party.members !== undefined, '❌ Missing members object');

// 2. Check security rules - try to update party
const partyRef = doc(db, 'parties', 'party-id');
try {
  await updateDoc(partyRef, { name: 'New Name' });
  console.log('✅ Update succeeded (DM check works)');
} catch (e) {
  console.error('❌ Update failed:', e.message);
}

// 3. Check subcollections exist
const membersRef = collection(db, 'parties', 'party-id', 'members');
const membersSnapshot = await getDocs(membersRef);
console.log(`✅ Members subcollection: ${membersSnapshot.size} members`);

// 4. Check codes collection
const codeDoc = await getDoc(doc(db, 'party_codes', 'ABC123'));
console.assert(codeDoc.exists(), '❌ party_codes entry missing');
```

---

## 📝 IMPLEMENTATION PRIORITY

| Priority | Item | Blocker? | Effort |
|----------|------|----------|--------|
| 🔴 P1 | Add `dm_uid` field | YES | 15 min |
| 🔴 P1 | Fix timestamp format | YES | 20 min |
| 🔴 P1 | Add members subcollection writes | YES | 30 min |
| 🟡 P2 | Create party_codes collection | NO | 15 min |
| 🟡 P2 | Update all party queries | NO | 45 min |
| 🟢 P3 | Write migration script | NO | 1h |

---

## 📞 NEXT STEPS

1. **APPLY FIXES IMMEDIATELY** - Parties won't work without them
2. **RUN VERIFICATION CHECKS** - Confirm schema matches rules
3. **MIGRATE EXISTING PARTIES** - Re-write existing party docs with `dm_uid`
4. **TEST PARTY OPERATIONS** - Create, update, join, delete
5. **UPDATE RULES** - If schema changes, update `firestore.rules`

---

**Generated:** 2026-05-25  
**Status:** Requires immediate remediation
