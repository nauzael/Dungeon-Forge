import admin from 'firebase-admin';
import fs from 'fs';

const SERVICE_ACCOUNT = JSON.parse(fs.readFileSync('./dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json', 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  projectId: 'dungeon-forge-8b829',
});

console.log('Service Account Info:');
console.log('- Project ID:', SERVICE_ACCOUNT.project_id);
console.log('- Project:', SERVICE_ACCOUNT.project_id);

try {
  // Try to list buckets
  const storage = admin.storage();
  console.log('\nFire admin.storage() initialized');
  console.log('Default bucket:', storage.bucket().name);
  
  // Try direct initialization with different bucket names
  const candidates = [
    'dungeon-forge-8b829.appspot.com',
    'dungeon-forge-prod.appspot.com',
    'dungeon-forge-prod.firebasestorage.app',
    'dungeon-forge-8b829.firebasestorage.app'
  ];
  
  for (const bucketName of candidates) {
    console.log(`\nTesting bucket: ${bucketName}`);
    try {
      const bucket = admin.storage().bucket(bucketName);
      const [exists] = await bucket.exists();
      console.log(`  ✓ Exists: ${exists}`);
    } catch (e) {
      console.log(`  ✗ Error: ${e.message}`);
    }
  }
} catch (err) {
  console.error('Error:', err.message);
}
