#!/usr/bin/env node

/**
 * Upload OTA files manualmente desde ota-release/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(__dirname);
const otaDir = path.join(projectRoot, 'ota-release');

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY no definida');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function uploadOTA() {
  // Find the latest zip file in ota-release
  const files = fs.readdirSync(otaDir).filter(f => f.endsWith('.zip'));
  
  if (files.length === 0) {
    console.error('❌ No ZIP files found in ota-release/');
    process.exit(1);
  }

  const zipFile = files[files.length - 1]; // Get latest (last alphabetically)
  const zipPath = path.join(otaDir, zipFile);
  const versionJsonPath = path.join(otaDir, 'version.json');

  console.log(`📦 Uploading ${zipFile}...`);

  try {
    const zipBuffer = fs.readFileSync(zipPath);
    const { error: zipErr } = await supabase.storage
      .from('updates')
      .upload(zipFile, zipBuffer, {
        contentType: 'application/zip',
        upsert: true
      });

    if (zipErr) throw zipErr;
    console.log(`✅ ZIP uploaded`);

    const jsonBuffer = fs.readFileSync(versionJsonPath);
    const { error: jsonErr } = await supabase.storage
      .from('updates')
      .upload('version.json', jsonBuffer, {
        contentType: 'application/json',
        upsert: true
      });

    if (jsonErr) throw jsonErr;
    console.log(`✅ version.json uploaded`);

    const versionData = JSON.parse(jsonBuffer.toString());
    console.log(`\n🎉 OTA DEPLOYMENT SUCCESSFUL!`);
    console.log(`   Version: ${versionData.version}`);
    console.log(`   Message: ${versionData.message}`);
    console.log(`   Update live in Supabase bucket "updates"`);

  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    process.exit(1);
  }
}

uploadOTA();
