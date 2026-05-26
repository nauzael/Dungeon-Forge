import admin from 'firebase-admin';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth as getClientAuth, signInWithCustomToken } from 'firebase/auth';
import { getFirestore as getClientFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

// 1. Initialize Admin SDK to generate custom token
const serviceAccountPath = './dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const adminAuth = admin.auth();
const userId = 'Bu2iH1U34uV3PJk5jRZHfX12J6U2';
console.log(`Generating custom token for UID: ${userId}...`);
const customToken = await adminAuth.createCustomToken(userId);
console.log('Custom token generated successfully.');

// 2. Initialize Client SDK
const firebaseConfig = {
  apiKey: 'AIzaSyBYbpNyUtDIrZCi_44_q1z41MEZpkcg6h8',
  projectId: 'dungeon-forge-prod',
  authDomain: 'dungeon-forge-prod.firebaseapp.com',
};

const clientApp = initializeClientApp(firebaseConfig);
const clientAuth = getClientAuth(clientApp);
const clientDb = getClientFirestore(clientApp);

console.log('Signing in on Client SDK using custom token...');
const userCredential = await signInWithCustomToken(clientAuth, customToken);
console.log(`Successfully signed in! Current client user: ${userCredential.user.email || userCredential.user.uid}`);

// 3. Test querying characters collection exactly like the client
try {
  console.log('Querying characters collection using client-side query...');
  const q = query(
    collection(clientDb, 'characters'),
    where('user_id', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  console.log(`Query succeeded! Found ${snapshot.size} documents.`);
  snapshot.docs.forEach(doc => {
    console.log(`- ${doc.id}: ${doc.data().data?.name}`);
  });
} catch (error) {
  console.error('Query failed on client SDK:', error.message);
  console.error('Error Code:', error.code);
}

// Clean up Node process
process.exit(0);
