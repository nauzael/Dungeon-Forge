import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function findRecentChars() {
  console.log('Fetching all characters sorted by updated_at...');
  const snapshot = await db.collection('characters').orderBy('updated_at', 'desc').limit(15).get();
  
  if (snapshot.empty) {
    console.log('No documents found.');
    return;
  }

  console.log(`\n==========================================`);
  console.log(`15 MOST RECENTLY UPDATED CHARACTERS IN FIRESTORE:`);
  snapshot.docs.forEach((doc, idx) => {
    const data = doc.data();
    console.log(`${idx + 1}. Doc ID: ${doc.id}`);
    console.log(`   - Name: ${data.data?.name || 'Unnamed'}`);
    console.log(`   - User ID: ${data.user_id}`);
    console.log(`   - Updated At: ${data.updated_at ? data.updated_at.toDate().toISOString() : 'none'}`);
    console.log(`   - Deleted At: ${data.deleted_at}`);
  });
  console.log(`==========================================\n`);
}

findRecentChars().catch(console.error);
