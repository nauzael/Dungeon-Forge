import 'dotenv/config';
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('./dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'dungeon-forge-prod'
});

const db = admin.firestore();

console.log('\n=== FIREBASE PARTIES VERIFICATION ===\n');

const snapshot = await db.collection('parties').get();

console.log(`Total parties in Firebase: ${snapshot.size}\n`);
console.log('Parties:');

snapshot.forEach(doc => {
  const data = doc.data();
  const id = doc.id.substring(0, 8);
  const code = data.partyCode || 'N/A';
  const creator = data.creatorId.substring(0, 8);
  console.log(`  [${id}...] ${data.name} | Code: ${code} | Creator: ${creator}...`);
});

console.log('\n✅ Migration verification complete\n');
process.exit(0);
