#!/usr/bin/env node

/**
 * Upload OTA usando curl en lugar del SDK de Supabase JS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.dirname(__dirname);
const otaDir = path.join(projectRoot, 'ota-release');

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_KEY no definida');
  process.exit(1);
}

async function uploadWithCurl() {
  // Find latest ZIP
  const files = fs.readdirSync(otaDir).filter(f => f.endsWith('.zip'));
  if (files.length === 0) {
    console.error('❌ No ZIP files found');
    process.exit(1);
  }

  const zipFile = files[files.length - 1];
  const zipPath = path.join(otaDir, zipFile);
  const versionJsonPath = path.join(otaDir, 'version.json');

  console.log(`📦 Subiendo con curl: ${zipFile}`);

  try {
    // Upload ZIP
    const curlZipCmd = `curl -X POST \
      -H "authorization: Bearer ${SERVICE_KEY}" \
      -H "apikey: ${SERVICE_KEY}" \
      -F "file=@${zipPath}" \
      "${SUPABASE_URL}/storage/v1/object/updates/${zipFile}"`;

    console.log('🚀 Ejecutando: curl POST...');
    const { stdout: zipResult, stderr: zipErr } = await execAsync(curlZipCmd, { 
      shell: true,
      maxBuffer: 50 * 1024 * 1024 
    });

    if (zipErr) {
      console.log('⚠️  STDERR:', zipErr);
    }
    console.log('Response:', zipResult);

    // Upload version.json
    const curlJsonCmd = `curl -X POST \
      -H "authorization: Bearer ${SERVICE_KEY}" \
      -H "apikey: ${SERVICE_KEY}" \
      -F "file=@${versionJsonPath}" \
      "${SUPABASE_URL}/storage/v1/object/updates/version.json"`;

    console.log('\n📤 Subiendo version.json...');
    const { stdout: jsonResult, stderr: jsonErr } = await execAsync(curlJsonCmd, { 
      shell: true,
      maxBuffer: 50 * 1024 * 1024 
    });

    if (jsonErr) {
      console.log('⚠️  STDERR:', jsonErr);
    }
    console.log('Response:', jsonResult);

    console.log('\n✅ Upload completado');

  } catch (err) {
    console.error('❌ Error ejecutando curl:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

uploadWithCurl();
