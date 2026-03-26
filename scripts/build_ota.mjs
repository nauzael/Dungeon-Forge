import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const otaDir = path.join(projectRoot, 'ota-release');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY; // Requires the Service Role Secret Key

if (!fs.existsSync(distDir)) {
  console.error("❌ The 'dist/' directory was not found. Please run 'npm run build' first.");
  process.exit(1);
}

if (!serviceKey) {
  console.error("\n❌ ERROR: SUPABASE_SERVICE_KEY was not found in your .env file!");
  console.error("To make OTA completely automatic, go to Supabase -> Project Settings -> API");
  console.error("Reveal the 'service_role' (secret) key, copy it, and put it in your .env like this:");
  console.error("SUPABASE_SERVICE_KEY=your_secret_key_here\n");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Generate new version based on timestamp
const versionDate = new Date();
const versionStr = `${versionDate.getFullYear()}.${versionDate.getMonth() + 1}.${versionDate.getDate()}-${versionDate.getHours()}${versionDate.getMinutes()}${versionDate.getSeconds()}`;
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
        url: `${supabaseUrl}/storage/v1/object/public/updates/${zipFile}`,
        message: customMessage
      };
      
      fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2));
      console.log(`✅ Generated version.json.`);
      
      console.log(`🚀 Uploading directly to Supabase...`);
      try {
        // Upload zip
        const zipBuffer = fs.readFileSync(outputPath);
        const { error: zipErr } = await supabase.storage.from('updates').upload(zipFile, zipBuffer, {
            contentType: 'application/zip',
            upsert: true
        });
        if (zipErr) throw zipErr;
        console.log(`✅ Uploaded ZIP payload.`);

        // Upload version.json
        const jsonBuffer = fs.readFileSync(versionJsonPath);
        const { error: jsonErr } = await supabase.storage.from('updates').upload('version.json', jsonBuffer, {
            contentType: 'application/json',
            upsert: true
        });
        if (jsonErr) throw jsonErr;
        
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
