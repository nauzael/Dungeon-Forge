import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function inspectUserChars() {
  const userId = 'Bu2iH1U34uV3PJk5jRZHfX12J6U2';
  const snapshot = await db.collection('characters').where('user_id', '==', userId).get();
  
  if (snapshot.empty) {
    console.log('No documents found for user ID:', userId);
    return;
  }

  console.log(`Found ${snapshot.size} documents for user ID: ${userId}`);
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`\nDocument ID: ${doc.id}`);
    console.log(`- user_id: ${data.user_id}`);
    console.log(`- deleted_at: ${data.deleted_at}`);
    console.log(`- party_id: ${data.party_id}`);
    console.log(`- updated_at: ${data.updated_at ? data.updated_at.toDate().toISOString() : 'none'}`);
    console.log(`- data structure:`, data.data ? {
      id: data.data.id,
      name: data.data.name,
      class: data.data.class,
      level: data.data.level,
      imageUrlLength: data.data.imageUrl ? data.data.imageUrl.length : 0
    } : 'missing data field');
  });
}

inspectUserChars().catch(console.error);
