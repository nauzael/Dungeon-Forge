import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function checkCharactersFull() {
  const snapshot = await db.collection('characters').get();
  
  if (snapshot.empty) {
    console.log('No documents found.');
    return;
  }

  console.log(`\n==========================================`);
  console.log(`TOTAL CHARACTERS IN FIRESTORE: ${snapshot.size}`);
  
  const userMap = {};
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const userId = data.user_id;
    const charName = data.data?.name || 'Unnamed';
    if (!userMap[userId]) {
      userMap[userId] = [];
    }
    userMap[userId].push(charName);
  });

  console.log(`\nCHARACTERS BY USER_ID:`);
  for (const [userId, chars] of Object.entries(userMap)) {
    console.log(`- User: ${userId} (${chars.length} characters)`);
    console.log(`  Names: ${chars.join(', ')}`);
  }
  console.log(`==========================================\n`);
}

checkCharactersFull().catch(console.error);
