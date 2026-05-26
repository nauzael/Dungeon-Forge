# Migration Scripts Development Guide

**Status:** 📋 PLAN CREATED - READY FOR IMPLEMENTATION  
**Prepared:** 2026-05-25

---

## 📦 Scripts to Implement

All scripts will be created in `scripts/` directory with `.mjs` extension.

### Phase 1: Pre-Migration Audit Scripts

#### 1️⃣ `audit-supabase-parties.mjs`
**Purpose:** Comprehensive audit of Supabase parties table  
**Inputs:**
- Supabase connection details (env vars)
- Query: `SELECT * FROM parties`

**Outputs:**
- `audit/supabase-parties-audit.json`

**Logic:**
```
1. Connect to Supabase
2. SELECT COUNT(*) from parties → total_count
3. For each party, check:
   - id is UUID
   - creator_id not NULL
   - name not NULL and length > 0
   - code not NULL and matches [A-Z0-9]{6}
   - created_at valid timestamp
   - updated_at valid timestamp
4. Check for duplicates in code field (should be 0)
5. Identify orphaned records (creator_id not in auth)
6. Generate summary report
```

**Success:** `total_count > 0`, `validation_errors = 0`, `orphaned_records = 0`

---

#### 2️⃣ `verify-firebase-structure.mjs`
**Purpose:** Verify Firebase Firestore is ready for migration  
**Inputs:**
- Firebase credentials (env vars)
- Firebase project ID

**Outputs:**
- `audit/firebase-structure-check.json`

**Logic:**
```
1. Connect to Firebase Admin SDK
2. Test write permission to /parties collection
3. Try creating test doc → test-migration-doc
4. Verify doc was created
5. Delete test doc
6. Check Firestore rules allow service account writes
7. Generate structure report
```

**Success:** Can create/delete test documents

---

#### 3️⃣ `validate-party-relationships.mjs`
**Purpose:** Check party-character relationships are consistent  
**Inputs:**
- Supabase connection

**Outputs:**
- `audit/party-relationships.json`

**Logic:**
```
1. SELECT all parties (id, name)
2. For each party:
   - COUNT characters WHERE party_id = party.id
   - Verify all characters.party_id reference valid parties
3. Identify orphaned characters (party_id not in parties)
4. Report summary: party_count, character_count, orphaned_count
```

**Success:** `orphaned_count = 0`

---

#### 4️⃣ `export-supabase-parties-backup.mjs`
**Purpose:** Export all parties data as JSON backup  
**Inputs:**
- Supabase connection

**Outputs:**
- `backups/supabase-parties-backup-20260525.json`
- `backups/supabase-parties-backup-20260525.sha256`

**Logic:**
```
1. SELECT * FROM parties (all fields)
2. Convert to JSON array
3. Add metadata:
   - export_timestamp: ISO 8601
   - total_records: count
   - export_source: "supabase-parties"
4. Write to file
5. Compute SHA256 hash
6. Write hash to separate file
7. Verify file readable and valid JSON
```

**Success:** Backup file exists, hash valid

---

#### 5️⃣ `build-uid-mapping.mjs`
**Purpose:** Map Supabase auth UIDs to Firebase UIDs  
**Inputs:**
- Supabase connection (get auth users)
- Firebase Admin SDK (get Firebase users)

**Outputs:**
- `scripts/data/uid-mapping.json`
- `audit/uid-mapping-report.json`

**Logic:**
```
1. Get all parties from Supabase
2. Extract unique creator_ids from parties
3. Query Supabase Auth for these users
4. Query Firebase Auth for all users
5. Build mapping using hierarchy:
   
   For each creator_id:
   a) Try exact match in Firebase (if already migrated)
   b) Try email-based lookup
   c) Mark as unmapped if no match
   
6. Generate mapping JSON:
   {
     mappings: [
       {
         supabase_id: "...",
         firebase_uid: "...",
         email: "...",
         status: "mapped" | "email_based" | "unmapped"
       }
     ],
     unmapped_count: N,
     total_users: M,
     coverage_percent: (M - N) / M * 100
   }

7. Report unmapped accounts for manual review
```

**Success:** `coverage_percent > 95%`

---

### Phase 2: Core Migration Scripts

#### 6️⃣ `migrate-parties-to-firebase.mjs` (MAIN)
**Purpose:** Main migration script orchestrator  
**Inputs:**
- DRY_RUN env var (true/false) - DEFAULT: true
- BATCH_SIZE env var (default: 500)
- `scripts/data/uid-mapping.json`

**Outputs:**
- `logs/migration-20260525.log`
- `audit/migration-report-20260525.json`

**Logic:**
```javascript
async function main() {
  const DRY_RUN = process.env.DRY_RUN !== 'false'; // Default: true
  const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '500');
  
  console.log(`[MIGRATION] DRY_RUN=${DRY_RUN}, BATCH_SIZE=${BATCH_SIZE}`);
  
  // 1. Load UID mapping
  const uidMapping = loadUidMapping('scripts/data/uid-mapping.json');
  
  // 2. Fetch all parties from Supabase
  const supabaseParties = await supabase.from('parties').select('*');
  console.log(`[FETCH] ${supabaseParties.length} parties loaded from Supabase`);
  
  // 3. Transform each party
  const transformed = supabaseParties.map(party => 
    transformPartyRecord(party, uidMapping)
  );
  
  // 4. PRE-MIGRATION VALIDATION
  const validation = validateAllRecords(transformed);
  if (validation.failures > 0) {
    throw new Error(`Validation failed: ${validation.failures} records invalid`);
  }
  
  // 5. Process in batches
  const results = [];
  for (let i = 0; i < transformed.length; i += BATCH_SIZE) {
    const batch = transformed.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(transformed.length / BATCH_SIZE);
    
    console.log(`[BATCH ${batchNum}/${totalBatches}] Processing ${batch.length} records...`);
    
    // BATCH VALIDATION before writes
    const batchValidation = validateBatch(batch);
    if (batchValidation.failures > 0) {
      throw new Error(`Batch ${batchNum} validation failed`);
    }
    
    // Write batch
    const batchResults = await writeBatchToFirebase(batch, DRY_RUN);
    results.push(...batchResults);
  }
  
  // 6. Report results
  reportMigrationResults(results, supabaseParties.length, DRY_RUN);
}
```

**Success:** All records validated and written (or previewed if DRY_RUN)

---

#### 7️⃣ `transform-party-record.mjs`
**Purpose:** Transform single Supabase party to Firebase format  
**Input:** Supabase party object + UID mapping  
**Output:** Firebase document object

**Logic:**
```javascript
function transformPartyRecord(supabaseParty, uidMapping) {
  // Map creator_id to Firebase UID
  const firebaseUid = uidMapping[supabaseParty.creator_id]?.firebase_uid 
    || supabaseParty.creator_id;
  
  return {
    // Firestore doc ID
    id: supabaseParty.id, // UUID string
    
    // Fields
    creator_id: firebaseUid,
    name: supabaseParty.name,
    code: supabaseParty.code,
    
    // Timestamp conversion
    createdAt: new Date(supabaseParty.created_at).toISOString(),
    updatedAt: new Date(supabaseParty.updated_at).toISOString(),
    
    // Metadata for audit trail
    _metadata: {
      migrationSource: 'supabase',
      migratedAt: new Date().toISOString(),
      sourceCreatorId: supabaseParty.creator_id,
    }
  };
}
```

---

#### 8️⃣ `validate-batch.mjs`
**Purpose:** Validate entire batch before writing  
**Input:** Array of transformed party records  
**Output:** Validation report object

**Logic:**
```javascript
function validateBatch(records) {
  const results = {
    total: records.length,
    valid: 0,
    failures: 0,
    errors: []
  };
  
  for (const record of records) {
    const error = validateSingleRecord(record);
    if (error) {
      results.failures++;
      results.errors.push({ id: record.id, error });
    } else {
      results.valid++;
    }
  }
  
  return results;
}

function validateSingleRecord(record) {
  // Check id is valid UUID
  if (!isValidUUID(record.id)) 
    return 'Invalid UUID id';
  
  // Check creator_id is valid Firebase UID (28 chars)
  if (!isValidFirebaseUID(record.creator_id)) 
    return 'Invalid Firebase UID creator_id';
  
  // Check name is non-empty
  if (!record.name || record.name.trim().length === 0) 
    return 'Empty name';
  
  // Check code format
  if (!/^[A-Z0-9]{6}$/.test(record.code)) 
    return 'Invalid code format';
  
  // Check timestamps are ISO 8601
  if (!isValidISO8601(record.createdAt)) 
    return 'Invalid createdAt timestamp';
  
  if (!isValidISO8601(record.updatedAt)) 
    return 'Invalid updatedAt timestamp';
  
  return null; // Valid
}
```

---

#### 9️⃣ `migration-logger.mjs`
**Purpose:** Centralized logging for migration progress  
**Features:**
- Batch progress tracking
- Error aggregation
- Performance metrics (records/min)
- Estimated time remaining

**Outputs:**
- Console output with progress
- `logs/migration-TIMESTAMP.json`

---

### Phase 3 & 4: Validation & Rollback Scripts

#### 🔟 `rollback-parties-from-firebase.mjs`
**Purpose:** Delete migrated parties from Firebase (safe rollback)  
**Inputs:**
- List of party IDs to delete (from migration log)
- Firebase credentials

**Outputs:**
- Rollback confirmation report

**Logic:**
```javascript
async function rollbackPartiesMigration() {
  // Read migration log to get IDs that were written
  const partyIds = readMigrationLog().map(r => r.id);
  
  console.log(`[ROLLBACK] Deleting ${partyIds.length} parties from Firebase...`);
  
  const BATCH_SIZE = 500;
  for (let i = 0; i < partyIds.length; i += BATCH_SIZE) {
    const batch = partyIds.slice(i, i + BATCH_SIZE);
    const writeBatch = db.batch();
    
    for (const id of batch) {
      writeBatch.delete(db.collection('parties').doc(id));
    }
    
    await writeBatch.commit();
    console.log(`[ROLLBACK] Deleted batch ${Math.floor(i / BATCH_SIZE) + 1}`);
  }
  
  console.log(`[ROLLBACK] ✓ All parties deleted from Firebase`);
}
```

---

#### 1️⃣1️⃣ `verify-row-counts.mjs`
**Purpose:** Verify source and target row counts match exactly  
**Inputs:**
- Supabase connection
- Firebase connection

**Outputs:**
- `audit/row-count-verification-20260525.json`

**Logic:**
```
1. COUNT(*) FROM parties (Supabase)
2. db.collection('parties').count() (Firebase)
3. Compare counts
4. Report: source_count, target_count, difference
5. If difference != 0: FAILURE
```

---

#### 1️⃣2️⃣ `integrity-check-sample.mjs`
**Purpose:** Spot-check random 50 parties for data corruption  
**Inputs:**
- Sample size (default: 50)
- Supabase + Firebase connections

**Outputs:**
- `audit/integrity-check-sample-20260525.json`

**Logic:**
```
1. SELECT random 50 parties from Firebase
2. For each party in sample:
   - Fetch matching record from Supabase by ID
   - Compare all fields:
     * id: exact match (UUID)
     * creator_id: mapped correctly
     * name: exact match (no truncation)
     * code: exact match
     * createdAt: timestamp matches
     * updatedAt: timestamp matches
   - Track mismatches
3. Report: sample_size, matches, mismatches, mismatch_rate
```

---

#### 1️⃣3️⃣ `validate-migrated-relationships.mjs`
**Purpose:** Verify party-character relationships still valid in Firebase  
**Inputs:**
- Firebase connections
- Migration mapping file (for UID verification)

**Outputs:**
- `audit/relationship-validation-20260525.json`

**Logic:**
```
1. For each party in Firebase:
   - Verify creator_id exists in Firebase Auth
   - Query characters collection for party_id references
   - Verify no orphaned characters
2. Report: valid_relationships, broken_relationships
3. If broken_relationships > 0: FAILURE
```

---

#### 1️⃣4️⃣ `validate-uid-mapping-coverage.mjs`
**Purpose:** Verify UID mapping success rate  
**Inputs:**
- UID mapping file
- Firebase Auth users

**Outputs:**
- `audit/uid-mapping-coverage-20260525.json`

**Logic:**
```
1. Load UID mapping
2. For each mapped UID:
   - Verify it exists in Firebase Auth
3. Count unmapped, verify unmapped < 1%
4. Report: total_mappings, valid, unmapped, coverage_percent
```

---

## 📊 Data Files

### `scripts/data/uid-mapping.json`
```json
{
  "mappings": [
    {
      "supabase_id": "user@example.com or UUID",
      "firebase_uid": "KaRwqKw0JFeaJzDWQOWzc8j7Q2Q",
      "email": "user@example.com",
      "status": "mapped" | "email_based" | "unmapped",
      "notes": "optional"
    }
  ],
  "unmapped_count": 0,
  "total_users": 42,
  "coverage_percent": 100
}
```

---

## 🔄 Execution Flow

```
PHASE 1: PRE-MIGRATION
├─ audit-supabase-parties.mjs ✓
├─ verify-firebase-structure.mjs ✓
├─ validate-party-relationships.mjs ✓
├─ export-supabase-parties-backup.mjs ✓
└─ build-uid-mapping.mjs ✓
   └─ outputs: uid-mapping.json

PHASE 3: DRY-RUN
└─ migrate-parties-to-firebase.mjs (DRY_RUN=true)
   ├─ transform-party-record.mjs
   ├─ validate-batch.mjs
   ├─ migration-logger.mjs
   └─ outputs: dry-run-report.json (NO FIREBASE WRITES)

PHASE 4: PRODUCTION
└─ migrate-parties-to-firebase.mjs (DRY_RUN=false)
   ├─ transform-party-record.mjs
   ├─ validate-batch.mjs
   ├─ migration-logger.mjs
   └─ outputs: migration-report.json (WRITES TO FIREBASE)

PHASE 5: VALIDATION
├─ verify-row-counts.mjs ✓
├─ integrity-check-sample.mjs ✓
└─ validate-migrated-relationships.mjs ✓
   └─ DECISION: Continue or Rollback
      └─ IF ROLLBACK: rollback-parties-from-firebase.mjs
```

---

## 🎯 Implementation Priority

1. **CRITICAL** - Main migration script + transform + batch validation
2. **CRITICAL** - Audit scripts (verify data exists and is valid)
3. **HIGH** - UID mapping builder
4. **HIGH** - Validation scripts (post-migration checks)
5. **MEDIUM** - Rollback script
6. **MEDIUM** - Logging and reporting

---

## ✅ Testing Before Production

Each script should be tested:
1. With test data (small sample)
2. In DRY_RUN mode (if applicable)
3. Against staging Firebase (not production)
4. With error cases (invalid data, network failures)

---

## 📝 Success Criteria

- ✓ All 14 scripts created and tested
- ✓ UID mapping file generated and validated
- ✓ DRY_RUN completes with 0 errors
- ✓ Production migration completes without errors
- ✓ Post-migration validation passes all checks
