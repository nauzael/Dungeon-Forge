import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function checkUser(uid) {
  try {
    const userRecord = await auth.getUser(uid);
    console.log(`Successfully fetched user data for ${uid}:`);
    console.log(`- Email: ${userRecord.email}`);
    console.log(`- Display Name: ${userRecord.displayName}`);
    console.log(`- Provider: ${userRecord.providerData.map(p => p.providerId).join(', ')}`);
  } catch (error) {
    console.error(`Error fetching user ${uid}:`, error.message);
  }
}

async function run() {
  await checkUser('QdeOiDwtHjVzg3tbmtexOSVbc463');
  await checkUser('Bu2iH1U34uV3PJk5jRZHfX12J6U2');
}

run().catch(console.error);
