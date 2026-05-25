// Simulation of merging logic in App.tsx
import { readFileSync } from 'fs';

// Mock characters
const MOCK_CHARACTERS = [
  { id: 'c1', name: 'Mock Character 1', class: 'Fighter', level: 1 },
  { id: 'c2', name: 'Mock Character 2', class: 'Wizard', level: 1 }
];

// Cloud characters retrieved
const cloudChars = [
  {
    id: 'c-1767568888504',
    user_id: 'Bu2iH1U34uV3PJk5jRZHfX12J6U2',
    name: 'Torwil',
    class: 'Monk',
    level: 10,
  },
  {
    id: 'c-1776438734693',
    user_id: 'Bu2iH1U34uV3PJk5jRZHfX12J6U2',
    name: 'Vermund',
    class: 'Ranger',
    level: 5,
  },
  {
    id: 'c-1778983729590',
    user_id: 'Bu2iH1U34uV3PJk5jRZHfX12J6U2',
    name: 'Nozz Duskforge',
    class: 'Fighter',
    level: 2,
  }
];

let deletedCharacterIds = new Set();
let pendingUploads = [];

function simulateMerge(prevCharacters) {
  const merged = [...prevCharacters];
  let updated = false;
  
  for (const cloudChar of cloudChars) {
    if (deletedCharacterIds.has(cloudChar.id)) {
      console.log(`Restoring deleted character: ${cloudChar.name}`);
    }
      
    const localIndex = merged.findIndex(c => c.id === cloudChar.id);
    
    if (localIndex === -1) {
      console.log(`Adding cloud character: ${cloudChar.name}`);
      merged.push({ ...cloudChar, syncTimestamp: Date.now() });
      updated = true;
    } else {
      const localChar = merged[localIndex];
      const localTime = localChar.syncTimestamp || 0;
      const cloudTime = cloudChar.syncTimestamp || (cloudChar.updated_at ? new Date(cloudChar.updated_at).getTime() : 0);
      
      if (cloudTime > localTime) {
        console.log(`Updating local with cloud: ${cloudChar.name}`);
        merged[localIndex] = { ...cloudChar, syncTimestamp: Date.now() };
        updated = true;
      } else if (localTime > cloudTime && localTime > 0) {
        console.log(`Uploading local version: ${localChar.name}`);
        pendingUploads.push(merged[localIndex]);
      }
    }
  }
  
  return updated ? merged : prevCharacters;
}

console.log('--- Case 1: Initial state is mock characters ---');
const result1 = simulateMerge(MOCK_CHARACTERS);
console.log('Resulting character list names:', result1.map(c => c.name).join(', '));

console.log('\n--- Case 2: Initial state is empty ---');
const result2 = simulateMerge([]);
console.log('Resulting character list names:', result2.map(c => c.name).join(', '));
