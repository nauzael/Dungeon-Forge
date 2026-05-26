import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const serviceAccountPath = path.join(projectRoot, 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: serviceAccount
});

const candidates = [
  'dungeon-forge-prod.appspot.com',
  'dungeon-forge-prod.firebasestorage.app',
  'dungeon-forge-prod'
];

for (const bucketName of candidates) {
  console.log(`Testing bucket: ${bucketName}...`);
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file('test.txt');
    await file.save('Hello Firebase!', {
      metadata: { contentType: 'text/plain' }
    });
    console.log(`✅ Success uploading to: ${bucketName}`);
    
    console.log(`Trying to make public...`);
    await file.makePublic();
    console.log(`✅ Success making public!`);
    
    // Cleanup
    await file.delete();
    console.log(`✅ Success deleting!`);
    break; // Found it!
  } catch (err) {
    console.error(`❌ Failed for ${bucketName}:`, err.message);
  }
}
