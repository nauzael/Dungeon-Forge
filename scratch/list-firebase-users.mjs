import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function listUsers() {
  console.log('--- USUARIOS EN FIREBASE AUTH ---');
  const listUsersResult = await admin.auth().listUsers(100);
  listUsersResult.users.forEach((userRecord) => {
    console.log(`- Email: ${userRecord.email}`);
    console.log(`  UID: ${userRecord.uid}`);
    console.log(`  Provider: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
    console.log(`  Creation Time: ${userRecord.metadata.creationTime}`);
    console.log(`  Last Sign-in Time: ${userRecord.metadata.lastSignInTime}`);
    console.log('-----------------------------');
  });
}

listUsers().catch(console.error);
