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

const [buckets] = await storage.getBuckets();
console.log("Available Buckets:");
buckets.forEach(b => {
  console.log(`- ${b.name}`);
});
