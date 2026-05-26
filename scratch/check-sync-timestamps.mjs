import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function checkSyncTimestamps() {
  const userId = 'Bu2iH1U34uV3PJk5jRZHfX12J6U2';
  const snapshot = await db.collection('characters').where('user_id', '==', userId).get();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`\n==========================================`);
    console.log(`Document ID: ${doc.id}`);
    console.log(`Character Name: ${data.data?.name}`);
    console.log(`Root updated_at:`, data.updated_at ? data.updated_at.toDate().toISOString() : 'none');
    console.log(`Root updated_at millis:`, data.updated_at ? data.updated_at.toMillis() : 'none');
    console.log(`Nested syncTimestamp:`, data.data?.syncTimestamp);
    console.log(`Nested updated_at:`, data.data?.updated_at);
  });
}

checkSyncTimestamps().catch(console.error);
