import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const otaDir = path.join(projectRoot, 'ota-release');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!serviceKey) {
  console.error("\n❌ ERROR: SUPABASE_SERVICE_KEY was not found in your .env file!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

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
    url: `${supabaseUrl}/storage/v1/object/public/updates/${zipFile}`,
    message: customMessage
  };
  
  console.log(`🔄 Restoring OTA update to v${targetVersion}...`);
  
  try {
    // Update local version.json
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));
    console.log(`✅ Updated local ota-release/version.json.`);

    // Upload ZIP to Supabase (in case it's missing)
    if (fs.existsSync(zipFilePath)) {
      console.log(`🚀 Uploading ZIP payload to Supabase...`);
      const zipBuffer = fs.readFileSync(zipFilePath);
      const { error: zipErr } = await supabase.storage.from('updates').upload(zipFile, zipBuffer, {
          contentType: 'application/zip',
          upsert: true
      });
      if (zipErr) throw zipErr;
      console.log(`✅ Uploaded ZIP payload.`);
    } else {
      console.warn(`⚠️ ZIP file ${zipFile} not found locally. Skipping upload, assuming it exists in Supabase.`);
    }

    // Upload version.json to Supabase
    console.log(`🚀 Uploading version.json...`);
    const jsonBuffer = fs.readFileSync(versionJsonPath);
    const { error: jsonErr } = await supabase.storage.from('updates').upload('version.json', jsonBuffer, {
        contentType: 'application/json',
        upsert: true
    });
    
    if (jsonErr) throw jsonErr;
    
    console.log(`\n===========================================`);
    console.log(`🎉 OTA RESTORATION SUCCESSFUL!`);
    console.log(`Version ${targetVersion} is now the active version.`);
    console.log(`===========================================\n`);

  } catch (err) {
     console.error("❌ Failed to restore version:", err.message);
  }
}

restoreOTA();
