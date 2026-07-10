import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load service account
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '..', 'dungeon-forge-prod-firebase-adminsdk-fbsvc-08adfe3b9a.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dungeon-forge-prod-default-rtdb.firebaseio.com',
});

const db = admin.firestore();

// First look up the user by email
async function main() {
  const targetEmail = 'nauzael@gmail.com';
  
  // Find user by email
  try {
    const userRecord = await admin.auth().getUserByEmail(targetEmail);
    console.log(`=== USER FOUND ===`);
    console.log(`UID: ${userRecord.uid}`);
    console.log(`Email: ${userRecord.email}`);
    console.log(`Display Name: ${userRecord.displayName || 'N/A'}`);
    console.log();
    
    // Query all characters for this user
    const charactersRef = db.collection('characters');
    const snapshot = await charactersRef.where('user_id', '==', userRecord.uid).get();
    
    console.log(`Characters found for ${targetEmail}: ${snapshot.size}`);
    console.log('='.repeat(50));
    
    if (snapshot.empty) {
      // Try also checking data.user_id field
      console.log('No characters found with user_id field. Checking data.user_id pattern...');
      const allChars = await charactersRef.get();
      
      for (const doc of allChars.docs) {
        const data = doc.data();
        const nestedData = data.data;
        
        if (nestedData && typeof nestedData === 'object') {
          const charUserId = nestedData.user_id || data.user_id;
          if (charUserId === userRecord.uid || nestedData.user_id === targetEmail) {
            console.log(`\nCharacter: ${nestedData.name || data.name || doc.id}`);
            console.log(`  ID: ${doc.id}`);
            console.log(`  Class: ${nestedData.class || data.class || 'N/A'}`);
            console.log(`  Level: ${nestedData.level || data.level || 'N/A'}`);
            console.log(`  Race: ${nestedData.race || nestedData.species || data.race || data.species || 'N/A'}`);
            console.log(`  HP: ${JSON.stringify(nestedData.hp || data.hp)}`);
          }
        }
        
        const name = data.name || nestedData?.name || doc.id;
        if (name.toLowerCase().includes('nozz') || name.toLowerCase().includes('duskforge')) {
          console.log(`\n*** MATCH: ${name} ***`);
          console.log(JSON.stringify(data, null, 2));
        }
      }
    } else {
      snapshot.forEach(doc => {
        const data = doc.data();
        const nestedData = data.data;
        const charData = nestedData || data;
        
        console.log(`\nCharacter: ${charData.name || doc.id}`);
        console.log(`  ID: ${doc.id}`);
        console.log(`  Class: ${charData.class || 'N/A'}`);
        console.log(`  Level: ${charData.level || 'N/A'}`);
        console.log(`  Species: ${charData.species || 'N/A'}`);
        console.log(`  HP: ${JSON.stringify(charData.hp || {})}`);
        
        if (charData.stats) {
          console.log(`  Stats: STR ${charData.stats.STR}, DEX ${charData.stats.DEX}, CON ${charData.stats.CON}, INT ${charData.stats.INT}, WIS ${charData.stats.WIS}, CHA ${charData.stats.CHA}`);
        }
        
        if (charData.name && charData.name.toLowerCase().includes('nozz')) {
          console.log('\n*** FULL DATA ***');
          console.log(JSON.stringify(charData, null, 2));
        }
        
        if (charData.syncTimestamp) {
          console.log(`  Last Sync: ${new Date(charData.syncTimestamp).toLocaleString()}`);
        }
      });
    }
    
    // Also search ALL characters for "nozz" or "duskforge" regardless of user
    console.log('\n' + '='.repeat(50));
    console.log('Searching ALL characters for "Nozz Duskforge"...');
    console.log('='.repeat(50));
    
    const allDocs = await charactersRef.get();
    let found = false;
    
    for (const doc of allDocs.docs) {
      const data = doc.data();
      const nestedData = data.data;
      const charData = nestedData || data;
      const name = charData.name || '';
      
      if (name.toLowerCase().includes('nozz') || name.toLowerCase().includes('duskforge')) {
        found = true;
        console.log(`\n*** FOUND: ${name} ***`);
        console.log(`Doc ID: ${doc.id}`);
        console.log(`User ID: ${data.user_id || nestedData?.user_id || 'N/A'}`);
        console.log(JSON.stringify(charData, null, 2));
      }
    }
    
    if (!found) {
      console.log('No character named "Nozz Duskforge" found in Firestore.');
    }
    
  } catch (error) {
    console.error('ERROR:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.log(`\nUser "${targetEmail}" not found in Firebase Auth.`);
      console.log('Searching all characters directly...');
      
      const charactersRef = db.collection('characters');
      const allDocs = await charactersRef.get();
      let found = false;
      
      for (const doc of allDocs.docs) {
        const data = doc.data();
        const nestedData = data.data;
        const charData = nestedData || data;
        const name = charData.name || '';
        
        if (name.toLowerCase().includes('nozz') || name.toLowerCase().includes('duskforge')) {
          found = true;
          console.log(`\n*** FOUND: ${name} ***`);
          console.log(`Doc ID: ${doc.id}`);
          console.log(JSON.stringify(charData, null, 2));
        }
      }
      
      if (!found) {
        console.log('No character named "Nozz Duskforge" found in Firestore.');
      }
    }
  }
  
  process.exit(0);
}

main();
