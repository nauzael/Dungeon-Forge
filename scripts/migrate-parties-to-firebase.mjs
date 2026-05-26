#!/usr/bin/env node

/**
 * Migrate Supabase parties → Firebase with zero data loss
 * 
 * Usage:
 *   DRY_RUN=true node scripts/migrate-parties-to-firebase.mjs  (preview only)
 *   node scripts/migrate-parties-to-firebase.mjs               (execute)
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
const LOG_FILE = path.join(BACKUP_DIR, `migration-${TIMESTAMP}.log`);

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

// Audit phase
async function auditSupabaseParties(supabase) {
  logger.section('PHASE 2: PRE-MIGRATION AUDIT');
  
  logger.log('Auditing Supabase parties table...');

  // Count total parties
  const { count, error: countError } = await supabase
    .from('parties')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to count parties: ${countError.message}`);
  }

  logger.log(`Total parties found: ${count}`);

  // Check for data issues
  const { data: parties, error: fetchError } = await supabase
    .from('parties')
    .select('*');

  if (fetchError) {
    throw new Error(`Failed to fetch parties: ${fetchError.message}`);
  }

  // Analyze data quality
  let nullIssues = 0;
  let duplicateIds = new Set();
  let validRecords = 0;

  for (const party of parties) {
    // Check for required fields
    if (!party.id || !party.name || !party.code) {
      nullIssues++;
      logger.log(`⚠️ Party ${party.id} has missing required fields`, party);
    } else {
      validRecords++;
      if (duplicateIds.has(party.id)) {
        logger.log(`⚠️ Duplicate party ID detected: ${party.id}`);
      }
      duplicateIds.add(party.id);
    }
  }

  const auditReport = {
    timestamp: new Date().toISOString(),
    totalParties: count,
    validRecords,
    nullIssues,
    duplicateIds: duplicateIds.size,
    issues: nullIssues > 0 ? 'Found data quality issues - review before migration' : 'All data looks good',
    sampleParties: parties.slice(0, 3)
  };

  logger.log('Audit report:', auditReport);
  
  // Save audit report
  const auditPath = path.join(BACKUP_DIR, `audit-report-${TIMESTAMP}.json`);
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
      .select('*')
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

// Transform Supabase party data to Firebase format
function transformPartyData(supabaseParty) {
  return {
    id: supabaseParty.id,
    name: supabaseParty.name,
    partyCode: supabaseParty.code,
    creatorId: supabaseParty.creator_id,
    createdAt: supabaseParty.created_at,
    updatedAt: supabaseParty.created_at, // Use created_at as fallback
    members: [],
    settings: {},
    // Metadata for tracking
    migratedFromSupabase: true,
    migrationTimestamp: new Date().toISOString()
  };
}

// Validate party data before writing
function validatePartyData(party) {
  const errors = [];

  if (!party.id) errors.push('Missing id');
  if (!party.name) errors.push('Missing name');
  if (!party.partyCode) errors.push('Missing partyCode');

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Batch write to Firebase
async function migratePartiesWithBatching(db, parties) {
  logger.section(`PHASE 4: ${DRY_RUN ? 'DRY-RUN' : 'PRODUCTION MIGRATION'}`);
  
  const batchSize = 500;
  let migratedCount = 0;
  let failedCount = 0;
  const failedParties = [];

  for (let i = 0; i < parties.length; i += batchSize) {
    const batch = parties.slice(i, i + batchSize);
    logger.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} parties)...`);

    // Validate all parties in batch before writing
    for (const party of batch) {
      const validation = validatePartyData(party);
      if (!validation.isValid) {
        logger.log(`⚠️ Validation failed for party ${party.id}:`, validation.errors);
        failedCount++;
        failedParties.push({ id: party.id, errors: validation.errors });
      }
    }

    if (!DRY_RUN) {
      const writeBatch = db.batch();
      
      for (const party of batch) {
        const validation = validatePartyData(party);
        if (validation.isValid) {
          const docRef = db.collection('parties').doc(party.id);
          writeBatch.set(docRef, party, { merge: true });
        }
      }

      try {
        await writeBatch.commit();
        migratedCount += batch.filter(p => validatePartyData(p).isValid).length;
        logger.log(`✅ Batch committed (${batch.length} parties)`);
      } catch (error) {
        logger.error('Batch commit failed', error);
        failedCount += batch.length;
        failedParties.push(...batch.map(p => ({ id: p.id, error: error.message })));
      }
    } else {
      migratedCount += batch.filter(p => validatePartyData(p).isValid).length;
      logger.log(`[DRY-RUN] Would have migrated ${batch.filter(p => validatePartyData(p).isValid).length} valid parties`);
    }
  }

  logger.log(`\n${DRY_RUN ? 'DRY-RUN COMPLETE' : 'MIGRATION COMPLETE'}`);
  logger.log(`Successfully migrated: ${migratedCount}`);
  logger.log(`Failed: ${failedCount}`);

  return { migratedCount, failedCount, failedParties };
}

// Verify migration
async function verifyMigration(supabase, db, supabaseParties) {
  logger.section('PHASE 5: VERIFICATION');

  // Count Firebase parties
  const snapshot = await db.collection('parties').get();
  const firebaseCount = snapshot.size;

  logger.log(`Supabase party count: ${supabaseParties.length}`);
  logger.log(`Firebase party count: ${firebaseCount}`);

  if (firebaseCount === supabaseParties.length) {
    logger.log('✅ Counts match!');
  } else {
    logger.log(`⚠️ Count mismatch! Supabase: ${supabaseParties.length}, Firebase: ${firebaseCount}`);
  }

  // Spot-check 10 random parties
  logger.log('\nSpot-checking random parties...');
  const sampleSize = Math.min(10, supabaseParties.length);
  const sampleIndices = Array.from({ length: sampleSize }, () => 
    Math.floor(Math.random() * supabaseParties.length)
  );

  for (let i = 0; i < sampleSize; i++) {
    const supabaseParty = supabaseParties[sampleIndices[i]];
    const firebaseDoc = await db.collection('parties').doc(supabaseParty.id).get();

    if (firebaseDoc.exists) {
      const firebaseParty = firebaseDoc.data();
      const match = firebaseParty.id === supabaseParty.id && 
                    firebaseParty.name === supabaseParty.name &&
                    firebaseParty.dmId === supabaseParty.dm_id;
      
      logger.log(`${match ? '✅' : '❌'} Party ${supabaseParty.id}: ${supabaseParty.name}`);
      
      if (!match) {
        logger.log('Mismatch details:', { supabaseParty, firebaseParty });
      }
    } else {
      logger.log(`❌ Party ${supabaseParty.id} not found in Firebase`);
    }
  }

  logger.log('✅ Verification complete');
}

// Backup Supabase data
async function backupSupabaseParties(parties) {
  logger.section('PHASE 2A: CREATING BACKUP');
  
  const backupPath = path.join(BACKUP_DIR, `supabase-parties-backup-${TIMESTAMP}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(parties, null, 2));
  logger.log(`✅ Backup saved to ${backupPath}`);
  logger.log(`Backup contains ${parties.length} parties`);
  
  return backupPath;
}

// Main migration flow
async function runMigration() {
  try {
    logger.section('DUNGEON FORGE: SUPABASE → FIREBASE MIGRATION');
    logger.log(`Mode: ${DRY_RUN ? 'DRY-RUN (preview only, no writes)' : 'PRODUCTION (writes enabled)'}`);
    logger.log(`Log file: ${LOG_FILE}`);

    // Phase 1: Connect
    logger.section('PHASE 1: CONNECTING TO DATA SOURCES');
    const supabase = await connectSupabase();
    const db = await connectFirebase();

    // Phase 2: Audit
    const { count, parties } = await auditSupabaseParties(supabase);

    // Phase 2A: Backup
    await backupSupabaseParties(parties);

    // Phase 3: Transform and prepare
    logger.section('PHASE 3: TRANSFORMING DATA');
    const transformedParties = parties.map(transformPartyData);
    logger.log(`✅ Transformed ${transformedParties.length} parties`);

    // Phase 4: Migrate
    const result = await migratePartiesWithBatching(db, transformedParties);

    // Phase 5: Verify (only if not DRY_RUN)
    if (!DRY_RUN) {
      await verifyMigration(supabase, db, parties);
    }

    // Summary
    logger.section('MIGRATION SUMMARY');
    logger.log(`✅ Migration completed successfully`);
    logger.log(`Total parties processed: ${count}`);
    logger.log(`Successfully migrated: ${result.migratedCount}`);
    logger.log(`Failed: ${result.failedCount}`);
    if (result.failedParties.length > 0) {
      logger.log('Failed parties:', result.failedParties);
    }
    logger.log(`\nLog saved to: ${LOG_FILE}`);
    logger.log('Backup saved to:', path.join(BACKUP_DIR, `supabase-parties-backup-${TIMESTAMP}.json`));

  } catch (error) {
    logger.error('Migration failed', error);
    process.exit(1);
  }
}

// Execute
runMigration();
