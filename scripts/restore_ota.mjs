import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const otaDir = path.join(projectRoot, 'ota-release');
const auditLogPath = path.join(projectRoot, 'rollback-audit.json');
const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET || 'dungeon-forge-prod.firebasestorage.app';

const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get current timestamp in ISO format
 * @returns {string} ISO timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log message with timestamp
 * @param {string} level - 'INFO', 'WARN', 'ERROR'
 * @param {string} message - Log message
 */
function logWithTimestamp(level, message) {
  const ts = getTimestamp();
  console.log(`[${ts}] [${level}] ${message}`);
}

/**
 * Validate semantic versioning format
 * Accepts formats like:
 * - 1.0.0
 * - 1.0.0-2026.5.25-000000
 * - 2026.4.16-182359
 * @param {string} version - Version string
 * @returns {boolean} True if valid
 */
function isValidVersion(version) {
  if (!version || typeof version !== 'string') return false;
  
  // Match common version patterns:
  // - semantic: 1.0.0[-suffix]
  // - date-based: 2026.4.16[-suffix]
  // Allows numbers, dots, dashes, and alphanumeric in suffix
  const versionRegex = /^(\d+\.\d+\.\d+(-[\w.\-]+)?)$/;
  return versionRegex.test(version.trim());
}

/**
 * Validate arguments
 * @param {string} targetVersion - Version to restore
 * @param {string} message - Audit message
 * @throws {Error} If validation fails
 */
function validateArguments(targetVersion, message) {
  if (!targetVersion) {
    throw new Error('Missing required argument: targetVersion. Usage: node scripts/restore_ota.mjs <version> <"message">');
  }

  if (typeof targetVersion !== 'string') {
    throw new Error(`targetVersion must be a string, got ${typeof targetVersion}`);
  }

  if (!isValidVersion(targetVersion)) {
    throw new Error(`Invalid version format: "${targetVersion}". Expected semantic versioning (e.g., 1.0.0 or 1.0.0-2026.5.25-000000)`);
  }

  if (!message) {
    throw new Error('Missing required argument: message. Usage: node scripts/restore_ota.mjs <version> <"message">');
  }

  if (typeof message !== 'string') {
    throw new Error(`message must be a string, got ${typeof message}`);
  }

  if (message.trim().length === 0) {
    throw new Error('message cannot be empty or whitespace-only');
  }
}

/**
 * Initialize Firebase Admin
 * @returns {Promise<object>} Storage bucket
 * @throws {Error} If Firebase init fails
 */
async function initializeFirebase() {
  // Validate service account path
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(`Firebase Service Account JSON not found at ${serviceAccountPath}`);
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    const adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: bucketName
    });

    logWithTimestamp('INFO', `Firebase Admin initialized with bucket: ${bucketName}`);
    return admin.storage().bucket();
  } catch (err) {
    throw new Error(`Failed to initialize Firebase Admin: ${err.message}`);
  }
}

/**
 * Read current version.json from storage
 * @param {object} bucket - Firebase Storage bucket
 * @returns {Promise<object>} Current version data
 * @throws {Error} If read fails
 */
async function readCurrentVersion(bucket) {
  try {
    const file = bucket.file('version.json');
    const [exists] = await file.exists();

    if (!exists) {
      logWithTimestamp('WARN', 'No existing version.json found in storage');
      return null;
    }

    const [data] = await file.download();
    const versionData = JSON.parse(data.toString('utf8'));
    logWithTimestamp('INFO', `Current version: ${versionData.version}`);
    return versionData;
  } catch (err) {
    throw new Error(`Failed to read current version.json: ${err.message}`);
  }
}

/**
 * Verify ZIP file exists in Firebase Storage
 * @param {object} bucket - Firebase Storage bucket
 * @param {string} zipFileName - ZIP filename
 * @returns {Promise<number>} File size in bytes
 * @throws {Error} If ZIP not found or size is 0
 */
async function verifyZipInBucket(bucket, zipFileName) {
  try {
    const file = bucket.file(zipFileName);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error(`ZIP file "${zipFileName}" not found in Firebase Storage bucket`);
    }

    const [metadata] = await file.getMetadata();
    const fileSize = parseInt(metadata.size, 10);

    if (!fileSize || fileSize === 0) {
      throw new Error(`ZIP file "${zipFileName}" has zero size (corrupted or incomplete)`);
    }

    logWithTimestamp('INFO', `✓ ZIP verified: ${zipFileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
    return fileSize;
  } catch (err) {
    throw new Error(`ZIP verification failed: ${err.message}`);
  }
}

/**
 * Create audit log entry
 * @param {object} entry - Audit log entry
 * @throws {Error} If write fails
 */
function writeAuditLog(entry) {
  try {
    let auditLog = [];

    if (fs.existsSync(auditLogPath)) {
      const existing = fs.readFileSync(auditLogPath, 'utf8');
      auditLog = JSON.parse(existing);
    }

    auditLog.push(entry);
    fs.writeFileSync(auditLogPath, JSON.stringify(auditLog, null, 2));
    logWithTimestamp('INFO', `Audit log saved to ${auditLogPath}`);
  } catch (err) {
    throw new Error(`Failed to write audit log: ${err.message}`);
  }
}

// ============================================================================
// MAIN RESTORE LOGIC
// ============================================================================

// Parse and validate arguments
const targetVersion = process.argv[2];
const customMessage = process.argv[3];

try {
  validateArguments(targetVersion, customMessage);
} catch (err) {
  console.error(`\n❌ Argument Error: ${err.message}\n`);
  process.exit(1);
}

const zipFile = `app-update-${targetVersion}.zip`;
const zipFilePath = path.join(otaDir, zipFile);

let bucket;
let currentVersion;
const startTimestamp = getTimestamp();

/**
 * Main restore operation
 */
async function restoreOTA() {
  try {
    logWithTimestamp('INFO', '🔄 Starting OTA restoration...');
    console.log(`   Target version: ${targetVersion}`);
    console.log(`   Message: ${customMessage}\n`);

    // Step 1: Initialize Firebase
    logWithTimestamp('INFO', 'Step 1/5: Initializing Firebase...');
    bucket = await initializeFirebase();

    // Step 2: Read current version
    logWithTimestamp('INFO', 'Step 2/5: Reading current version from storage...');
    currentVersion = await readCurrentVersion(bucket);

    // Step 3: Verify ZIP exists and has valid size
    logWithTimestamp('INFO', 'Step 3/5: Verifying ZIP file in Firebase Storage...');
    const zipSize = await verifyZipInBucket(bucket, zipFile);

    // Step 4: Upload version.json to Firebase Storage
    logWithTimestamp('INFO', 'Step 4/5: Uploading new version.json to Firebase Storage...');
    const versionJsonPath = path.join(otaDir, 'version.json');
    const newVersionData = {
      version: targetVersion,
      url: `https://storage.googleapis.com/${bucketName}/${zipFile}`,
      message: customMessage,
      timestamp: getTimestamp()
    };

    // Write local version.json first
    try {
      fs.writeFileSync(versionJsonPath, JSON.stringify(newVersionData, null, 2));
      logWithTimestamp('INFO', '   ✓ Local version.json updated');
    } catch (err) {
      throw new Error(`Failed to write local version.json: ${err.message}`);
    }

    // Upload to Firebase Storage
    try {
      const [jsonFileObj] = await bucket.upload(versionJsonPath, {
        destination: 'version.json',
        metadata: {
          contentType: 'application/json',
          cacheControl: 'public, no-cache, no-store, must-revalidate, max-age=0'
        }
      });

      await jsonFileObj.makePublic();
      logWithTimestamp('INFO', '   ✓ version.json uploaded and published to Firebase Storage');
    } catch (err) {
      throw new Error(`Failed to upload version.json to Firebase: ${err.message}`);
    }

    // Step 5: Write audit log
    logWithTimestamp('INFO', 'Step 5/5: Writing audit log...');
    const auditEntry = {
      timestamp: startTimestamp,
      action: 'restore_ota',
      targetVersion,
      previousVersion: currentVersion ? currentVersion.version : null,
      message: customMessage,
      zipFileSize: zipSize,
      user: process.env.CI_USER || process.env.USER || 'unknown',
      status: 'success'
    };

    writeAuditLog(auditEntry);

    // Success output
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🎉 OTA RESTORATION SUCCESSFUL!`);
    console.log(`${'='.repeat(50)}`);
    console.log(`   Previous version: ${currentVersion ? currentVersion.version : 'none'}`);
    console.log(`   New version: ${targetVersion}`);
    console.log(`   Timestamp: ${startTimestamp}`);
    console.log(`   Message: ${customMessage}`);
    console.log(`${'='.repeat(50)}\n`);

    logWithTimestamp('INFO', 'Restoration completed successfully');
    process.exit(0);
  } catch (err) {
    // Log error with context
    logWithTimestamp('ERROR', `${err.message}`);

    // Write failure audit log
    try {
      const auditEntry = {
        timestamp: startTimestamp,
        action: 'restore_ota',
        targetVersion,
        previousVersion: currentVersion ? currentVersion.version : null,
        message: customMessage,
        user: process.env.CI_USER || process.env.USER || 'unknown',
        status: 'failed',
        error: err.message
      };
      writeAuditLog(auditEntry);
    } catch (logErr) {
      logWithTimestamp('ERROR', `Failed to write failure audit log: ${logErr.message}`);
    }

    // Failure output
    console.log(`\n${'='.repeat(50)}`);
    console.log(`❌ OTA RESTORATION FAILED`);
    console.log(`${'='.repeat(50)}`);
    console.log(`   Error: ${err.message}`);
    console.log(`   Timestamp: ${startTimestamp}`);
    console.log(`${'='.repeat(50)}\n`);

    logWithTimestamp('ERROR', 'Restoration failed - no changes applied');
    process.exit(1);
  }
}

// Start restoration
restoreOTA();
