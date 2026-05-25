import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

async function listAllUsers() {
  console.log('Listing all Firebase Auth users:');
  let nextPageToken;
  let totalUsers = 0;
  
  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    listUsersResult.users.forEach((userRecord) => {
      totalUsers++;
      console.log(`- UID: ${userRecord.uid}`);
      console.log(`  Email: ${userRecord.email}`);
      console.log(`  Display Name: ${userRecord.displayName}`);
      console.log(`  Last Sign In: ${userRecord.metadata.lastSignInTime}`);
    });
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  
  console.log(`Total users in Firebase Auth: ${totalUsers}`);
}

listAllUsers().catch(console.error);
