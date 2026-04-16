/**
 * scripts/create_checkpoint.mjs
 * 
 * Crea un checkpoint permanente de la versión actual en Supabase.
 * Copia el ZIP de la OTA a un bucket de archivo con nombre fijo.
 * 
 * Usage: node scripts/create_checkpoint.mjs <version-string> <label>
 * Example: node scripts/create_checkpoint.mjs 2026.4.16-123234 "v1.0.0"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const otaDir = path.join(projectRoot, 'ota-release');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!serviceKey) {
  console.error('\n❌ ERROR: SUPABASE_SERVICE_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const targetVersion = process.argv[2];
const label = process.argv[3] || `checkpoint-${targetVersion}`;

if (!targetVersion) {
  console.error('❌ Usage: node scripts/create_checkpoint.mjs <version> <label>');
  process.exit(1);
}

const srcZipFile = `app-update-${targetVersion}.zip`;
const srcZipPath = path.join(otaDir, srcZipFile);

// Checkpoint archive filename: e.g. "dungeon-forge-v1.0.zip"
const archiveFileName = `dungeon-forge-${label.replace(/\s+/g, '-')}.zip`;

async function createCheckpoint() {
  console.log(`\n🏆 Creating permanent checkpoint: "${label}" from v${targetVersion}`);

  // 1. Upload ZIP to the "archive" folder inside the "updates" bucket
  if (!fs.existsSync(srcZipPath)) {
    console.error(`❌ ZIP not found locally: ${srcZipPath}`);
    process.exit(1);
  }

  const zipBuffer = fs.readFileSync(srcZipPath);

  console.log(`📦 Uploading ${archiveFileName} to Supabase archive...`);
  const { error: zipErr } = await supabase.storage
    .from('updates')
    .upload(`archive/${archiveFileName}`, zipBuffer, {
      contentType: 'application/zip',
      upsert: true,
    });

  if (zipErr) {
    console.error('❌ Failed to upload archive ZIP:', zipErr.message);
    process.exit(1);
  }

  // 2. Upload a checkpoint version.json that always points to this specific build
  const checkpointJson = {
    label,
    version: targetVersion,
    url: `${supabaseUrl}/storage/v1/object/public/updates/archive/${archiveFileName}`,
    created_at: new Date().toISOString(),
    message: `Checkpoint permanente "${label}". OTA original: ${targetVersion}.`
  };

  const checkpointJsonPath = path.join(otaDir, `checkpoint-${label.replace(/\s+/g, '-')}.json`);
  fs.writeFileSync(checkpointJsonPath, JSON.stringify(checkpointJson, null, 2));

  const jsonBuffer = fs.readFileSync(checkpointJsonPath);
  const { error: jsonErr } = await supabase.storage
    .from('updates')
    .upload(`archive/checkpoint-${label.replace(/\s+/g, '-')}.json`, jsonBuffer, {
      contentType: 'application/json',
      upsert: true,
    });

  if (jsonErr) {
    console.error('❌ Failed to upload checkpoint JSON:', jsonErr.message);
    process.exit(1);
  }

  console.log(`\n===========================================`);
  console.log(`🎉 CHECKPOINT CREATED SUCCESSFULLY!`);
  console.log(`   Label:   "${label}"`);
  console.log(`   Version: ${targetVersion}`);
  console.log(`   Archive: updates/archive/${archiveFileName}`);
  console.log(`===========================================\n`);
}

createCheckpoint();
