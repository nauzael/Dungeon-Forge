import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const otaDir = path.join(projectRoot, 'ota-release');
const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET || 'dungeon-forge-prod.firebasestorage.app';

if (!fs.existsSync(distDir)) {
  console.error("❌ The 'dist/' directory was not found. Please run 'npm run build' first.");
  process.exit(1);
}

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
    credential: admin.cert(serviceAccount),
    storageBucket: bucketName
  });
} catch (e) {
  console.error("❌ Failed to initialize Firebase Admin:", e.message);
  process.exit(1);
}

const storage = getStorage(adminApp);
const bucket = storage.bucket();

// Read version from package.json
const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
const semanticVersion = pkg.version || '1.1.0';

// Generate new version based on semantic version + timestamp for uniqueness
const versionDate = new Date();
const timestamp = `${versionDate.getFullYear()}.${versionDate.getMonth() + 1}.${versionDate.getDate()}-${versionDate.getHours()}${versionDate.getMinutes()}${versionDate.getSeconds()}`;
const versionStr = `${semanticVersion}-${timestamp}`;
const zipFile = `app-update-${versionStr}.zip`;

// Pick up message argument (e.g. npm run ota "arreglé cositas")
// Windows CMD npm runner escapes spaces with ^, so we must clean it up
const rawMessage = process.argv.slice(2).join(' ');
const customMessage = rawMessage 
  ? rawMessage.replace(/\^/g, '').trim() 
  : "Correcciones y mejoras menores en la estabilidad de Dungeon Forge.";

async function createOTA() {
  // Ensure output directory
  if (!fs.existsSync(otaDir)) fs.mkdirSync(otaDir);

  const outputPath = path.join(otaDir, zipFile);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  console.log(`📦 Packaging OTA update v${versionStr}...`);

  return new Promise((resolve, reject) => {
    output.on('close', async () => {
      console.log(`✅ Packaged successfully! (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);

      // Create version.json dynamically
      const versionJsonPath = path.join(otaDir, 'version.json');
      const versionData = {
        version: versionStr,
        url: `https://storage.googleapis.com/${bucketName}/${zipFile}`,
        message: customMessage
      };
      
      fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));
      console.log(`✅ Generated version.json.`);
      
      console.log(`🚀 Uploading directly to Firebase Storage...`);
      try {
        // Upload zip
        console.log(`   Uploading ZIP payload: ${zipFile}...`);
        const [zipFileObj] = await bucket.upload(outputPath, {
          destination: zipFile,
          metadata: {
            contentType: 'application/zip',
            cacheControl: 'public, max-age=31536000'
          }
        });
        console.log(`   Making ZIP public...`);
        await zipFileObj.makePublic();
        console.log(`✅ Uploaded and published ZIP payload.`);

        // Upload version.json
        console.log(`   Uploading version.json...`);
        const [jsonFileObj] = await bucket.upload(versionJsonPath, {
          destination: 'version.json',
          metadata: {
            contentType: 'application/json',
            cacheControl: 'public, no-cache, no-store, must-revalidate, max-age=0' // Prevent caching version.json
          }
        });
        console.log(`   Making version.json public...`);
        await jsonFileObj.makePublic();
        console.log(`✅ Uploaded and published version.json.`);
        
        console.log(`\n===========================================`);
        console.log(`🎉 OTA DEPLOYMENT 100% SUCCESSFUL!`);
        console.log(`Version ${versionStr} is now live and will instantly`);
        console.log(`download to cellphones the next time the app opens!`);
        console.log(`===========================================\n`);

      } catch (err) {
         console.error("❌ Failed to upload automatically:", err.message);
      }
      resolve();
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);
    archive.directory(distDir, false); // Add all content of 'dist' to zip's root
    archive.finalize();
  });
}

createOTA();
