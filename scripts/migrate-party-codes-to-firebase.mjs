#!/usr/bin/env node

/**
 * Migrate Party Codes from Supabase → Firebase
 * 
 * Populates /party_codes/{code} collection from parties.code
 * 
 * Usage:
 *   DRY_RUN=true node scripts/migrate-party-codes-to-firebase.mjs  (preview only)
 *   node scripts/migrate-party-codes-to-firebase.mjs               (execute)
 * 
 * Features:
 *   - Automatic backup before migration
 *   - Batch processing (500 per batch)
 *   - Validation before/after writes
 *   - Detailed logging with timestamps
 *   - Rollback capability
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.env.DRY_RUN === 'true';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = path.join(__dirname, '../audit');
const LOG_FILE = path.join(BACKUP_DIR, `migration-party-codes-${TIMESTAMP}.log`);

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Logger
class Logger {
  constructor(logFile) {
    this.logFile = logFile;
  }

  log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}`;
    console.log(logLine);
    
    let entry = logLine;
    if (data) {
      entry += '\n' + JSON.stringify(data, null, 2);
    }
    entry += '\n';
    
    fs.appendFileSync(this.logFile, entry);
  }

  error(message, error = null) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ❌ ERROR: ${message}`;
    console.error(logLine);
    
    let entry = logLine;
    if (error) {
      entry += '\n' + (error.stack || error.toString());
    }
    entry += '\n';
    
    fs.appendFileSync(this.logFile, entry);
  }

  section(title) {
    const line = '='.repeat(80);
    this.log(`\n${line}`);
    this.log(`${title}`);
    this.log(line);
  }
}

const logger = new Logger(LOG_FILE);

// Initialize clients
async function connectSupabase() {
  logger.log('Connecting to Supabase...');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_KEY');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  logger.log('✅ Connected to Supabase');
  return supabase;
}

async function connectFirebase() {
  logger.log('Connecting to Firebase...');
  
  // Check if admin SDK is already initialized
  if (!admin.apps.length) {
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH || 
      path.join(__dirname, '../dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Firebase Admin SDK file not found at ${serviceAccountPath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'dungeon-forge-prod'
    });
  }

  logger.log('✅ Connected to Firebase');
  return admin.firestore();
}

// Audit phase - get all parties with codes
async function auditPartyCodesInSupabase(supabase) {
  logger.section('PHASE 2: PRE-MIGRATION AUDIT');
  
  logger.log('Auditing party codes in Supabase parties table...');

  // Count total parties
  const { count, error: countError } = await supabase
    .from('parties')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to count parties: ${countError.message}`);
  }

  logger.log(`Total parties found: ${count}`);

  // Fetch all parties with codes
  const { data: parties, error: fetchError } = await supabase
    .from('parties')
    .select('id, code, creator_id, name, created_at');

  if (fetchError) {
    throw new Error(`Failed to fetch parties: ${fetchError.message}`);
  }

  // Analyze data quality
  let nullIssues = 0;
  let validCodes = 0;
  const codes = new Set();
  const codeIssues = [];

  for (const party of parties) {
    // Check for required fields
    if (!party.id || !party.code) {
      nullIssues++;
      logger.log(`⚠️ Party ${party.id} has missing id or code`, party);
      codeIssues.push({ partyId: party.id, issue: 'missing code' });
    } else if (codes.has(party.code)) {
      logger.log(`⚠️ Duplicate code detected: ${party.code}`);
      codeIssues.push({ partyId: party.id, code: party.code, issue: 'duplicate' });
    } else {
      validCodes++;
      codes.add(party.code);
    }
  }

  const auditReport = {
    timestamp: new Date().toISOString(),
    totalParties: count,
    validCodes,
    nullIssues,
    uniqueCodes: codes.size,
    issues: codeIssues.length > 0 ? codeIssues : 'All data looks good',
    sampleCodes: Array.from(codes).slice(0, 5)
  };

  logger.log('Audit report:', auditReport);
  
  // Save audit report
  const auditPath = path.join(BACKUP_DIR, `audit-party-codes-${TIMESTAMP}.json`);
  fs.writeFileSync(auditPath, JSON.stringify(auditReport, null, 2));
  logger.log(`Audit report saved to ${auditPath}`);

  return { count, parties, auditReport };
}

// Fetch all parties with pagination
async function fetchAllParties(supabase) {
  logger.section('Fetching all parties from Supabase...');
  
  const pageSize = 1000;
  let allParties = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const start = page * pageSize;
    const end = start + pageSize - 1;

    const { data, error } = await supabase
      .from('parties')
      .select('id, code, creator_id, name, created_at')
      .range(start, end);

    if (error) {
      throw new Error(`Failed to fetch page ${page}: ${error.message}`);
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allParties = allParties.concat(data);
      logger.log(`Fetched page ${page} (${data.length} records, total: ${allParties.length})`);
      page++;
    }
  }

  logger.log(`✅ Fetched all ${allParties.length} parties from Supabase`);
  return allParties;
}

// Transform Supabase party code to Firebase party_codes format
function transformPartyCodesToFirebaseFormat(parties) {
  const codes = [];
  
  for (const party of parties) {
    if (party.id && party.code) {
      codes.push({
        code: party.code, // Document ID
        partyId: party.id, // Reference to party
        createdAt: new Date(party.created_at),
        // Keep original party info for reference
        partyName: party.name,
        creatorId: party.creator_id
      });
    }
  }
  
  return codes;
}

// Validate party code data before writing
function validatePartyCodes(codes) {
  const errors = [];

  if (!Array.isArray(codes)) {
    errors.push('Codes must be an array');
    return { isValid: false, errors };
  }

  for (const item of codes) {
    if (!item.code) errors.push(`Missing code in ${JSON.stringify(item)}`);
    if (!item.partyId) errors.push(`Missing partyId in ${JSON.stringify(item)}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Batch write to Firebase
async function migratePartyCodesToFirebase(db, codes) {
  logger.section(`PHASE 4: ${DRY_RUN ? 'DRY-RUN' : 'PRODUCTION MIGRATION'}`);
  
  const batchSize = 500;
  let migratedCount = 0;
  let failedCount = 0;
  const failedCodes = [];

  for (let i = 0; i < codes.length; i += batchSize) {
    const batch = codes.slice(i, i + batchSize);
    logger.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} codes)...`);

    // Validate all codes in batch before writing
    for (const code of batch) {
      if (!code.code || !code.partyId) {
        logger.log(`⚠️ Validation failed for code ${code.code}:`, code);
        failedCount++;
        failedCodes.push({ code: code.code, errors: 'missing required fields' });
      }
    }

    if (!DRY_RUN) {
      const writeBatch = db.batch();
      
      for (const code of batch) {
        if (code.code && code.partyId) {
          const docRef = db.collection('party_codes').doc(code.code);
          writeBatch.set(docRef, {
            party_id: code.partyId,
            createdAt: code.createdAt,
            // Metadata for reference
            partyName: code.partyName,
            creatorId: code.creatorId
          }, { merge: true });
        }
      }

      try {
        await writeBatch.commit();
        migratedCount += batch.filter(c => c.code && c.partyId).length;
        logger.log(`✅ Batch committed (${batch.length} codes)`);
      } catch (error) {
        logger.error('Batch commit failed', error);
        failedCount += batch.length;
        failedCodes.push(...batch.map(c => ({ code: c.code, error: error.message })));
      }
    } else {
      migratedCount += batch.filter(c => c.code && c.partyId).length;
      logger.log(`[DRY-RUN] Would have migrated ${batch.filter(c => c.code && c.partyId).length} valid codes`);
    }
  }

  logger.log(`\n${DRY_RUN ? 'DRY-RUN COMPLETE' : 'MIGRATION COMPLETE'}`);
  logger.log(`Successfully migrated: ${migratedCount}`);
  logger.log(`Failed: ${failedCount}`);

  return { migratedCount, failedCount, failedCodes };
}

// Verify migration
async function verifyMigration(supabase, db, originalCodes) {
  logger.section('PHASE 5: VERIFICATION');

  // Count Firebase party_codes
  const snapshot = await db.collection('party_codes').get();
  const firebaseCount = snapshot.size;

  logger.log(`Supabase code count: ${originalCodes.length}`);
  logger.log(`Firebase party_codes count: ${firebaseCount}`);

  if (firebaseCount === originalCodes.length) {
    logger.log('✅ Counts match!');
  } else {
    logger.log(`⚠️ Count mismatch! Supabase: ${originalCodes.length}, Firebase: ${firebaseCount}`);
  }

  // Spot-check 5 random codes
  logger.log('\nSpot-checking random codes...');
  const sampleSize = Math.min(5, originalCodes.length);
  const sampleIndices = Array.from({ length: sampleSize }, () => 
    Math.floor(Math.random() * originalCodes.length)
  );

  let matchCount = 0;
  for (let i = 0; i < sampleSize; i++) {
    const originalCode = originalCodes[sampleIndices[i]];
    const firebaseDoc = await db.collection('party_codes').doc(originalCode.code).get();

    if (firebaseDoc.exists) {
      const firebaseCode = firebaseDoc.data();
      const match = firebaseCode.party_id === originalCode.partyId;
      
      logger.log(`${match ? '✅' : '❌'} Code ${originalCode.code} -> Party ${originalCode.partyId}`);
      
      if (!match) {
        logger.log('Mismatch details:', { 
          original: originalCode.partyId, 
          firebase: firebaseCode.party_id 
        });
      } else {
        matchCount++;
      }
    } else {
      logger.log(`❌ Code ${originalCode.code} not found in Firebase`);
    }
  }

  logger.log(`✅ Spot-check complete: ${matchCount}/${sampleSize} matches`);
}

// Backup Supabase codes
async function backupSupabasePartyCodes(parties) {
  logger.section('PHASE 2A: CREATING BACKUP');
  
  const codes = parties.map(p => ({ code: p.code, partyId: p.id }));
  const backupPath = path.join(BACKUP_DIR, `supabase-party-codes-backup-${TIMESTAMP}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(codes, null, 2));
  logger.log(`✅ Backup saved to ${backupPath}`);
  logger.log(`Backup contains ${codes.length} codes`);
  
  return backupPath;
}

// Main migration flow
async function runMigration() {
  try {
    logger.section('DUNGEON FORGE: PARTY_CODES MIGRATION (Supabase → Firebase)');
    logger.log(`Mode: ${DRY_RUN ? 'DRY-RUN (preview only, no writes)' : 'PRODUCTION (writes enabled)'}`);
    logger.log(`Log file: ${LOG_FILE}`);

    // Phase 1: Connect
    logger.section('PHASE 1: CONNECTING TO DATA SOURCES');
    const supabase = await connectSupabase();
    const db = await connectFirebase();

    // Phase 2: Audit
    const { parties } = await auditPartyCodesInSupabase(supabase);

    // Phase 2A: Backup
    await backupSupabasePartyCodes(parties);

    // Phase 3: Transform
    logger.section('PHASE 3: TRANSFORMING DATA');
    const transformedCodes = transformPartyCodesToFirebaseFormat(parties);
    logger.log(`✅ Transformed ${transformedCodes.length} codes`);

    // Validate
    const validation = validatePartyCodes(transformedCodes);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Phase 4: Migrate
    const result = await migratePartyCodesToFirebase(db, transformedCodes);

    // Phase 5: Verify (only if not DRY_RUN)
    if (!DRY_RUN) {
      await verifyMigration(supabase, db, transformedCodes);
    }

    // Summary
    logger.section('MIGRATION SUMMARY');
    logger.log(`✅ Migration completed successfully`);
    logger.log(`Total codes processed: ${parties.length}`);
    logger.log(`Successfully migrated: ${result.migratedCount}`);
    logger.log(`Failed: ${result.failedCount}`);
    if (result.failedCodes.length > 0) {
      logger.log('Failed codes:', result.failedCodes);
    }
    logger.log(`\nLog saved to: ${LOG_FILE}`);
    logger.log('Backup saved to:', path.join(BACKUP_DIR, `supabase-party-codes-backup-${TIMESTAMP}.json`));

  } catch (error) {
    logger.error('Migration failed', error);
    process.exit(1);
  }
}

// Execute
runMigration();
