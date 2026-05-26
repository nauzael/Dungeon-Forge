# Migration Execution Checklist - Supabase Parties → Firebase

**Plan ID:** `20260525-migrate-supabase-parties-to-firebase`  
**Start Date:** [DATE]  
**Status:** 🟡 READY TO EXECUTE  

---

## 📋 PRE-EXECUTION (Before Starting Any Phase)

- [ ] **Read all documentation**
  - [ ] MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml
  - [ ] MIGRATION-SUMMARY-20260525.md
  - [ ] MIGRATION-SCRIPTS-DEVELOPMENT-GUIDE.md

- [ ] **Verify environment**
  - [ ] Supabase credentials working (test connection)
  - [ ] Firebase credentials working (test connection)
  - [ ] Service account key present and valid
  - [ ] Node.js v18+ installed
  - [ ] npm packages installed

- [ ] **Backup critical data**
  - [ ] Supabase database backed up
  - [ ] Current Firebase data backed up
  - [ ] Git repository clean and pushed

- [ ] **Stakeholder notification**
  - [ ] Team notified of migration window
  - [ ] Users aware of potential downtime
  - [ ] Support team briefed on rollback procedure

---

## ✅ PHASE 1: PRE-MIGRATION VALIDATION (20 minutes)

### Step 1.1: Audit Supabase Parties Table
```bash
cd i:\Apks\Dungeon\ Forge
node scripts/audit-supabase-parties.mjs 2>&1 | tee logs/phase1-audit-20260525.log
```

- [ ] Script runs without errors
- [ ] Output file: `audit/supabase-parties-audit.json` created
- [ ] Check results:
  - [ ] `total_count > 0` (or 0 if empty)
  - [ ] `validation_errors = 0`
  - [ ] `orphaned_records = 0`
  - [ ] `code_uniqueness = 100%`

**If audit fails:** Stop and investigate. Do not proceed.

---

### Step 1.2: Verify Firebase Structure
```bash
node scripts/verify-firebase-structure.mjs 2>&1 | tee logs/phase1-firebase-verify-20260525.log
```

- [ ] Script runs without errors
- [ ] Output file: `audit/firebase-structure-check.json` created
- [ ] Check results:
  - [ ] `collection_accessible = true`
  - [ ] `write_permission = true`
  - [ ] `test_doc_created = true`
  - [ ] `test_doc_deleted = true`

**If verification fails:** Check Firebase credentials and permissions.

---

### Step 1.3: Validate Party-Character Relationships
```bash
node scripts/validate-party-relationships.mjs 2>&1 | tee logs/phase1-relationships-20260525.log
```

- [ ] Script runs without errors
- [ ] Output file: `audit/party-relationships.json` created
- [ ] Check results:
  - [ ] `orphaned_characters = 0`
  - [ ] All party references valid

**If relationships are broken:** Investigate and fix before migration.

---

### Step 1.4: Export Supabase Backup
```bash
node scripts/export-supabase-parties-backup.mjs 2>&1 | tee logs/phase1-backup-export-20260525.log
```

- [ ] Script runs without errors
- [ ] Files created:
  - [ ] `backups/supabase-parties-backup-20260525.json` exists and is valid JSON
  - [ ] `backups/supabase-parties-backup-20260525.sha256` contains hash

**Verify backup:**
```bash
# Check file is valid JSON
cat backups/supabase-parties-backup-20260525.json | jq . | head -20

# Verify hash
sha256sum -c backups/supabase-parties-backup-20260525.sha256
```

- [ ] Backup file valid
- [ ] Hash verification passed

---

### Step 1.5: Build UID Mapping
```bash
node scripts/build-uid-mapping.mjs 2>&1 | tee logs/phase1-uid-mapping-20260525.log
```

- [ ] Script runs without errors
- [ ] Files created:
  - [ ] `scripts/data/uid-mapping.json` exists
  - [ ] `audit/uid-mapping-report.json` exists

**Verify mapping quality:**
```bash
cat audit/uid-mapping-report.json | jq '.coverage_percent'
```

- [ ] `coverage_percent >= 95%`
- [ ] Review unmapped accounts:
  ```bash
  cat scripts/data/uid-mapping.json | jq '.mappings[] | select(.status == "unmapped")'
  ```
- [ ] If unmapped > 0: Document manually mapped accounts for later

**If coverage < 95%:** Investigate and rebuild mapping or create Firebase accounts for missing users.

---

### ✅ PHASE 1 SIGN-OFF

**Checklist before proceeding to Phase 2:**
- [ ] Audit completed (0 errors)
- [ ] Firebase verified (write permission OK)
- [ ] Relationships validated (0 orphaned)
- [ ] Backup exported and verified
- [ ] UID mapping created (>95% coverage)
- [ ] All logs saved

**Status:** ✅ PHASE 1 COMPLETE - Ready for Phase 2

---

## 📝 PHASE 2: SCRIPT DEVELOPMENT (60 minutes)

**Note:** Phase 2 is implementation work. This checklist assumes scripts are already created.

### Step 2.1: Verify All Migration Scripts Exist
```bash
ls -la scripts/ | grep migrate
ls -la scripts/ | grep transform
ls -la scripts/ | grep validate
ls -la scripts/ | grep rollback
```

- [ ] `migrate-parties-to-firebase.mjs` exists
- [ ] `transform-party-record.mjs` exists
- [ ] `validate-batch.mjs` exists
- [ ] `rollback-parties-from-firebase.mjs` exists

### Step 2.2: Test Scripts in Isolation
```bash
# Test transform script
node scripts/transform-party-record.mjs

# Test validate script
node scripts/validate-batch.mjs

# Test logger
node scripts/migration-logger.mjs
```

- [ ] All scripts parse without syntax errors
- [ ] Each script produces expected output format

---

## 🎭 PHASE 3: DRY-RUN EXECUTION (15 minutes)

### Step 3.1: Run Migration in Preview Mode
```bash
# DRY_RUN=true (preview only, NO WRITES to Firebase)
DRY_RUN=true node scripts/migrate-parties-to-firebase.mjs 2>&1 | tee logs/dry-run-20260525.log
```

- [ ] Script completes without errors
- [ ] Log file created: `logs/dry-run-20260525.log`
- [ ] Check for validation errors in log

**Review dry-run output:**
```bash
tail -100 logs/dry-run-20260525.log
```

- [ ] Record count shown
- [ ] All records marked as "would migrate"
- [ ] 0 transformation errors
- [ ] Estimated migration size shown

### Step 3.2: Validate Dry-Run Output
```bash
cat audit/dry-run-report-20260525.json | jq '.'
```

- [ ] `total_records == supabase_count` (from Phase 1 audit)
- [ ] `validation_failures == 0`
- [ ] `transformation_errors == 0`

### Step 3.3: Verify Firebase Unchanged
```bash
# Check Firestore - should still be empty or have pre-migration data
firebase --project=[PROJECT_ID] firestore:delete parties --all
# (Don't actually run this, just verify via console)
```

- [ ] Firebase /parties collection unchanged (confirm via console)
- [ ] No documents written during dry-run

### ✅ PHASE 3 SIGN-OFF

- [ ] Dry-run completed without errors
- [ ] Record counts match
- [ ] No transformations failed
- [ ] Firebase verified unchanged
- [ ] Spot-check 5 random records in dry-run output

**Status:** ✅ PHASE 3 COMPLETE - Dry-run PASSED

---

## 🚀 PHASE 4: PRODUCTION MIGRATION (30 minutes)

### ⚠️ CRITICAL: Get Approval Before This Point

- [ ] **APPROVAL OBTAINED FROM:** _________________ **DATE:** _______

### Step 4.1: Final Safety Checks
```bash
# 1. Verify credentials fresh
echo $SUPABASE_URL
echo $FIREBASE_PROJECT_ID

# 2. Verify backup exists and is readable
file backups/supabase-parties-backup-20260525.json

# 3. Verify UID mapping exists
file scripts/data/uid-mapping.json

# 4. Check logs directory writable
touch logs/test.txt && rm logs/test.txt
```

- [ ] Credentials present
- [ ] Backup file readable
- [ ] UID mapping file readable
- [ ] Logs directory writable

### Step 4.2: Notify Team
- [ ] **Post message:** "Migration starting - parties table sync to Firebase"
- [ ] **Time:** [TIMESTAMP]
- [ ] **Estimated duration:** 30 minutes

### Step 4.3: Execute Live Migration
```bash
# DRY_RUN=false (actual writes to Firebase)
DRY_RUN=false node scripts/migrate-parties-to-firebase.mjs 2>&1 | tee logs/migration-live-20260525.log
```

- [ ] Script completes without abort
- [ ] Log file created: `logs/migration-live-20260525.log`
- [ ] No fatal errors in log

**Monitor during execution:**
```bash
# In separate terminal, watch log in real-time
tail -f logs/migration-live-20260525.log
```

- [ ] Progress shown (batches processed)
- [ ] No errors or warnings in critical sections
- [ ] Script completes with success message

### Step 4.4: Immediate Verification
```bash
# Check last 20 lines of migration log
tail -20 logs/migration-live-20260525.log

# Check migration report
cat audit/migration-report-20260525.json | jq '.summary'
```

- [ ] `records_written > 0`
- [ ] `write_errors == 0`
- [ ] `status: "success"`

### ✅ PHASE 4 SIGN-OFF

- [ ] Migration script completed without abort
- [ ] No fatal errors in log
- [ ] Migration report shows success
- [ ] Post migration completion message

**Status:** ✅ PHASE 4 COMPLETE - Data written to Firebase

---

## ✨ PHASE 5: POST-MIGRATION VALIDATION (30 minutes)

### Step 5.1: Row Count Verification (CRITICAL)
```bash
node scripts/verify-row-counts.mjs 2>&1 | tee logs/phase5-row-counts-20260525.log
```

**Output file:** `audit/row-count-verification-20260525.json`

```bash
cat audit/row-count-verification-20260525.json | jq '.summary'
```

- [ ] `supabase_count == firebase_count` (MUST be equal)
- [ ] `difference == 0`
- [ ] `status: "PASSED"`

**If counts don't match:** ❌ FAILURE - See Rollback Procedure

---

### Step 5.2: Integrity Check on Sample (CRITICAL)
```bash
node scripts/integrity-check-sample.mjs 2>&1 | tee logs/phase5-integrity-20260525.log
```

**Output file:** `audit/integrity-check-sample-20260525.json`

```bash
cat audit/integrity-check-sample-20260525.json | jq '.summary'
```

- [ ] `sample_size: 50` (or configured value)
- [ ] `field_mismatches == 0`
- [ ] `truncation_found == 0`
- [ ] `status: "PASSED"`

**If mismatches found:** ❌ FAILURE - See Rollback Procedure

---

### Step 5.3: Relationship Validation
```bash
node scripts/validate-migrated-relationships.mjs 2>&1 | tee logs/phase5-relationships-20260525.log
```

**Output file:** `audit/relationship-validation-20260525.json`

```bash
cat audit/relationship-validation-20260525.json | jq '.summary'
```

- [ ] `broken_relationships == 0`
- [ ] `orphaned_characters == 0`
- [ ] `status: "PASSED"`

**If relationships broken:** ❌ FAILURE - See Rollback Procedure

---

### Step 5.4: UID Mapping Validation
```bash
node scripts/validate-uid-mapping-coverage.mjs 2>&1 | tee logs/phase5-uid-coverage-20260525.log
```

**Output file:** `audit/uid-mapping-coverage-20260525.json`

```bash
cat audit/uid-mapping-coverage-20260525.json | jq '.summary'
```

- [ ] `coverage_percent >= 99%`
- [ ] `unmapped_count < 1%` (or 0)
- [ ] `status: "PASSED"`

**If coverage < 99%:** ⚠️ WARNING - Document unmapped accounts for manual review

---

### Step 5.5: Generate Final Report
```bash
# Consolidate all validation results
node scripts/generate-final-migration-report.mjs 2>&1 | tee logs/final-report-generation.log
```

**Output files:**
- `MIGRATION-REPORT-20260525.md` (human-readable)
- `audit/FINAL-VALIDATION-20260525.json` (machine-readable)

---

### ✅ PHASE 5 SIGN-OFF

**All validation must PASS before signing off:**

- [ ] Row count verification PASSED (supabase = firebase)
- [ ] Integrity check PASSED (0 mismatches, 0 truncations)
- [ ] Relationship validation PASSED (0 broken refs)
- [ ] UID mapping coverage PASSED (>99%)
- [ ] Final report generated

**Spot-check Firebase data manually:**
```bash
# Check a specific party (use ID from backup)
PARTY_ID="[UUID from backup]"
firebase --project=[PROJECT_ID] firestore:describe parties/$PARTY_ID
```

- [ ] Document exists
- [ ] All fields present
- [ ] Data looks correct

**Status:** ✅ PHASE 5 COMPLETE - All validation PASSED

---

## 📦 POST-MIGRATION TASKS

- [ ] Archive all logs and reports:
  ```bash
  mkdir -p docs/migrations/20260525-parties-migration/
  cp logs/migration-live-20260525.log docs/migrations/20260525-parties-migration/
  cp audit/*.json docs/migrations/20260525-parties-migration/
  cp MIGRATION-REPORT-20260525.md docs/migrations/20260525-parties-migration/
  ```

- [ ] Update application code to read from Firebase (instead of Supabase)

- [ ] Update Firestore security rules for /parties collection

- [ ] Monitor Firebase for 24 hours for anomalies

- [ ] Schedule Supabase parties table deprecation (keep as read-only backup for 30 days)

- [ ] Document lessons learned

---

## ❌ FAILURE & ROLLBACK PROCEDURE

**If any Phase 5 validation FAILS:**

### Step 1: STOP IMMEDIATELY
```bash
# Kill any running processes
killall node
```

### Step 2: ANALYZE ROOT CAUSE
- Check error logs:
  ```bash
  tail -100 logs/migration-live-20260525.log
  tail -100 logs/phase5-*.log
  ```
- Review audit reports:
  ```bash
  cat audit/integrity-check-sample-20260525.json | jq '.failures[]'
  ```

### Step 3: EXECUTE ROLLBACK
```bash
# Delete all migrated parties from Firebase
node scripts/rollback-parties-from-firebase.mjs 2>&1 | tee logs/rollback-20260525.log
```

- [ ] Script completes successfully
- [ ] Verify Firebase is now empty:
  ```bash
  firebase --project=[PROJECT_ID] firestore:list-collectionGroups
  ```

### Step 4: INVESTIGATE ROOT CAUSE
Common causes:
- **Transformation error:** Check `transform-party-record.mjs` logic
- **UID mapping incomplete:** Rebuild mapping with more coverage
- **Network timeout:** Check Firestore quota/limits
- **Schema mismatch:** Verify Firebase document structure

### Step 5: FIX & RETRY
1. Fix root cause in script
2. Rebuild UID mapping if needed
3. Go back to Phase 3 (dry-run again)
4. Get re-approval
5. Execute Phase 4-5 again

---

## 📞 TROUBLESHOOTING

### DRY_RUN mode not working
```bash
# Verify env var is being read
echo $DRY_RUN
# Should be empty or "true"

# Or run explicitly
DRY_RUN=true node scripts/migrate-parties-to-firebase.mjs
```

### Batch size too large (slow performance)
```bash
# Reduce batch size
BATCH_SIZE=100 node scripts/migrate-parties-to-firebase.mjs
```

### Firebase quota exceeded
- Wait 24 hours for quota reset
- Rollback and retry

### UID mapping issues
```bash
# Rebuild mapping manually
node scripts/build-uid-mapping.mjs --verbose
# Review unmapped accounts in scripts/data/uid-mapping.json
```

---

## 📝 SIGN-OFF

**Execution completed by:** _________________ **DATE:** _______ **TIME:** _______

**Phase 1 completed:** ✓ □ ✗  
**Phase 2 completed:** ✓ □ ✗  
**Phase 3 (dry-run) passed:** ✓ □ ✗  
**Phase 4 (production) completed:** ✓ □ ✗  
**Phase 5 (validation) passed:** ✓ □ ✗  

**All validation passed:** ✓ □ ✗  
**Ready for production:** ✓ □ ✗  

**Notes:**
```
[Space for migration notes, issues encountered, solutions applied]




```

---

**END OF EXECUTION CHECKLIST**  
For questions, see: MIGRATION-PLAN-SUPABASE-PARTIES-TO-FIREBASE.yaml
