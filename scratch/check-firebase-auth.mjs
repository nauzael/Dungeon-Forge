import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function checkUser() {
  try {
    const userRecord = await auth.getUserByEmail('nauzael@gmail.com');
    console.log('Successfully fetched user data:');
    console.log(`- UID: ${userRecord.uid}`);
    console.log(`- Email: ${userRecord.email}`);
    console.log(`- Display Name: ${userRecord.displayName}`);
    console.log(`- Provider: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

checkUser().catch(console.error);
