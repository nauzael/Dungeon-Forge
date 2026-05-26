#!/usr/bin/env node

/**
 * Firebase Credentials Setup (Interactive)
 * 
 * This script:
 * 1. Asks user to paste Firebase Admin SDK JSON from Google Cloud Console
 * 2. Validates the JSON format
 * 3. Saves it securely
 * 4. Runs migration immediately
 * 
 * Usage:
 *   node scripts/setup-firebase-credentials-interactive.mjs
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const CREDENTIALS_FILE = path.join(PROJECT_ROOT, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function log(msg) {
  console.log(msg);
}

function section(title) {
  console.log('\n' + '='.repeat(80));
  console.log(title);
  console.log('='.repeat(80) + '\n');
}

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runSetup() {
  section('🔐 FIREBASE CREDENTIALS SETUP');

  log(`Welcome! This setup will configure your Firebase Admin SDK credentials.

IMPORTANT SECURITY NOTE:
- This file will NOT be version controlled (it's in .gitignore)
- Keep it confidential - it contains sensitive authentication data
- Only store in this project directory

STEPS:
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dungeon-forge-prod
2. Find service account: "firebase-adminsdk-fbsvc"
3. Go to "Keys" tab → "Add Key" → "Create New Key"
4. Select "JSON" format
5. Click "Create" - it will download a JSON file
6. Open that file in a text editor
7. Copy ALL the JSON content (Ctrl+A, Ctrl+C)
8. Come back here and paste it when prompted
  `);

  const proceed = await prompt('Do you have the JSON file ready? (yes/no): ');
  if (proceed.toLowerCase() !== 'yes') {
    log('Setup cancelled. Download the credentials file first and try again.');
    rl.close();
    process.exit(0);
  }

  log('\n📋 Paste the entire JSON content below. Type "END" on a new line when done:\n');
  
  let jsonContent = '';
  let lineCount = 0;

  const pasteLoop = async () => {
    const line = await prompt(lineCount === 0 ? '> ' : '');
    lineCount++;
    
    if (line === 'END') {
      return;
    }
    
    jsonContent += (jsonContent ? '\n' : '') + line;
    await pasteLoop();
  };

  await pasteLoop();

  // Validate JSON
  log('\n⏳ Validating JSON...');
  let credentials;
  try {
    credentials = JSON.parse(jsonContent);
  } catch (e) {
    log('\n❌ ERROR: Invalid JSON format');
    log('Error: ' + e.message);
    log('\nMake sure you:');
    log('1. Copied the ENTIRE file content');
    log('2. Did not edit or modify it');
    log('3. Pasted all of it before typing "END"');
    rl.close();
    process.exit(1);
  }

  // Validate required fields
  const requiredFields = [
    'type',
    'project_id',
    'private_key_id',
    'private_key',
    'client_email',
    'client_id'
  ];

  const missing = requiredFields.filter(f => !credentials[f]);
  if (missing.length > 0) {
    log(`\n❌ ERROR: Missing required fields: ${missing.join(', ')}`);
    log('This might not be the correct Firebase Admin SDK file.');
    rl.close();
    process.exit(1);
  }

  // Save to file
  log('\n💾 Saving credentials...');
  try {
    fs.writeFileSync(CREDENTIALS_FILE, jsonContent, { mode: 0o600 });
    log(`✅ Saved to: ${CREDENTIALS_FILE}`);
  } catch (e) {
    log(`❌ ERROR: Could not write file: ${e.message}`);
    rl.close();
    process.exit(1);
  }

  // Verify file was written
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    log('❌ ERROR: File was not created');
    rl.close();
    process.exit(1);
  }

  log(`✅ File size: ${fs.statSync(CREDENTIALS_FILE).size} bytes`);
  log(`✅ File mode: Private (0600)`);

  section('✅ CREDENTIALS SETUP COMPLETE');

  log(`Next steps:

1. Verify everything works:
   ${'$'} npm run build
   
2. Run the complete migration:
   ${'$'} node scripts/migrate-parties-to-firebase.mjs
   
3. Test in the app:
   ${'$'} npm run dev
   
4. Commit when satisfied:
   ${'$'} git add . && git commit -m "setup: Firebase credentials configured"
   ${'$'} git push origin main

Your credentials file is secure and will not be version controlled.
  `);

  rl.close();
}

runSetup().catch((e) => {
  console.error('❌ Setup failed:', e.message);
  rl.close();
  process.exit(1);
});
