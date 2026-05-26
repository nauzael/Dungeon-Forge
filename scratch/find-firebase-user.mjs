import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function main() {
  const email = 'nauzael@gmail.com';
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`\n==========================================`);
    console.log(`Firebase User Details for ${email}:`);
    console.log(`UID: ${userRecord.uid}`);
    console.log(`Email: ${userRecord.email}`);
    console.log(`DisplayName: ${userRecord.displayName}`);
    console.log(`Providers:`, userRecord.providerData.map(p => ({
      providerId: p.providerId,
      uid: p.uid,
      email: p.email
    })));
    console.log(`==========================================\n`);
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
  }
}

main().catch(console.error);
