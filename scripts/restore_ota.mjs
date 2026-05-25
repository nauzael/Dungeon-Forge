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
const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET || 'dungeon-forge-prod.firebasestorage.app';

const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`\n❌ ERROR: Firebase Service Account JSON not found at ${serviceAccountPath}!`);
  process.exit(1);
}

// Initialize Firebase Admin
let adminApp;
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
  });
} catch (e) {
  console.error("❌ Failed to initialize Firebase Admin:", e.message);
  process.exit(1);
}

const bucket = admin.storage().bucket();

// Arg 1: Version to restore (e.g. 2026.4.16-123234)
// Arg 2: Optional message
const targetVersion = process.argv[2];
const customMessage = process.argv[3] || `Restauración a la versión ${targetVersion}`;

if (!targetVersion) {
  console.error("❌ Please provide a version string to restore. Example: node scripts/restore_ota.mjs 2026.4.16-123234");
  process.exit(1);
}

const zipFile = `app-update-${targetVersion}.zip`;
const zipFilePath = path.join(otaDir, zipFile);

// Sanity check: Does the local zip exist?
if (!fs.existsSync(zipFilePath)) {
  console.warn(`⚠️ Warning: Local file ${zipFile} not found in ota-release/ folder.`);
  console.warn(`Continuing anyway, assuming it exists in the Supabase bucket.`);
}

async function restoreOTA() {
  const versionJsonPath = path.join(otaDir, 'version.json');
  const versionData = {
    version: targetVersion,
    url: `https://storage.googleapis.com/${bucketName}/${zipFile}`,
    message: customMessage
  };
  
  console.log(`🔄 Restoring OTA update to v${targetVersion}...`);
  
  try {
    // Update local version.json
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));
    console.log(`✅ Updated local ota-release/version.json.`);

    // Upload ZIP to Firebase Storage (in case it's missing)
    if (fs.existsSync(zipFilePath)) {
      console.log(`🚀 Uploading ZIP payload to Firebase Storage...`);
      const [zipFileObj] = await bucket.upload(zipFilePath, {
        destination: zipFile,
        metadata: {
          contentType: 'application/zip',
          cacheControl: 'public, max-age=31536000'
        }
      });
      console.log(`   Making ZIP public...`);
      await zipFileObj.makePublic();
      console.log(`✅ Uploaded and published ZIP payload.`);
    } else {
      console.warn(`⚠️ ZIP file ${zipFile} not found locally. Skipping upload, assuming it exists in Firebase Storage.`);
    }

    // Upload version.json to Firebase Storage
    console.log(`🚀 Uploading version.json to Firebase Storage...`);
    const [jsonFileObj] = await bucket.upload(versionJsonPath, {
      destination: 'version.json',
      metadata: {
        contentType: 'application/json',
        cacheControl: 'public, no-cache, no-store, must-revalidate, max-age=0'
      }
    });
    console.log(`   Making version.json public...`);
    await jsonFileObj.makePublic();
    
    console.log(`\n===========================================`);
    console.log(`🎉 OTA RESTORATION SUCCESSFUL!`);
    console.log(`Version ${targetVersion} is now the active version.`);
    console.log(`===========================================\n`);

  } catch (err) {
     console.error("❌ Failed to restore version:", err.message);
  }
}

restoreOTA();
