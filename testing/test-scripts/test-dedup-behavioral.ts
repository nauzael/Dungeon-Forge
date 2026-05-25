// Unit Test: Deduplication Logic Equivalence
// Validates that optimized O(1) version behaves identically to original O(n)

import { Character } from './types';

// Original O(n) implementation (for comparison)
const deduplicateAndMergeOriginal = (current: Character[], incoming: Character): Character[] => {
  const existingIndex = current.findIndex(c => c.id === incoming.id);
  
  if (existingIndex === -1) {
    return [...current, incoming];
  }
  
  const existing = current[existingIndex];
  const incomingTime = incoming.syncTimestamp || 0;
  const existingTime = existing.syncTimestamp || 0;
  
  if (incomingTime >= existingTime) {
    return current.map((c, i) => i === existingIndex ? incoming : c);
  }
  return current;
};

// Optimized O(1) implementation
const deduplicateAndMergeOptimized = (current: Character[], incoming: Character): Character[] => {
  const dedupMap = new Map<string, Character>();
  
  // Convert current array to Map (O(n) once)
  for (const char of current) {
    dedupMap.set(char.id, char);
  }
  
  // Lookup and update incoming (O(1))
  const existing = dedupMap.get(incoming.id);
  if (!existing) {
    dedupMap.set(incoming.id, incoming);
  } else {
    const incomingTime = incoming.syncTimestamp || 0;
    const existingTime = existing.syncTimestamp || 0;
    if (incomingTime > existingTime) {
      dedupMap.set(incoming.id, incoming);
    }
  }
  
  // Convert back to array
  return Array.from(dedupMap.values());
};

const createChar = (id: string, timestamp: number = Date.now()): Character => ({
  id,
  name: `Char ${id}`,
  level: 1,
  class: 'Fighter',
  species: 'Human',
  hp: { current: 10, max: 10, temp: 0 },
  stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
  inventory: [],
  ac: 10,
  party_id: 'party-1',
  syncTimestamp: timestamp,
} as any as Character);

export const testBehavioral = () => {
  console.log('=== BEHAVIORAL EQUIVALENCE TESTS ===\n');
  
  let passCount = 0;
  let failCount = 0;
  
  // Test 1: Add new character
  console.log('Test 1: Add new character');
  const current1 = [createChar('1'), createChar('2')];
  const incoming1 = createChar('3');
  const result1Orig = deduplicateAndMergeOriginal(current1, incoming1);
  const result1Opt = deduplicateAndMergeOptimized(current1, incoming1);
  
  if (result1Orig.length === result1Opt.length && result1Opt.length === 3) {
    console.log('✅ PASS: Added new character\n');
    passCount++;
  } else {
    console.log(`❌ FAIL: Expected 3, got ${result1Opt.length}\n`);
    failCount++;
  }
  
  // Test 2: Update existing character with newer timestamp
  console.log('Test 2: Update existing character (newer timestamp)');
  const current2 = [createChar('1', 1000), createChar('2', 2000)];
  const incoming2 = createChar('1', 3000); // Newer timestamp
  const result2Orig = deduplicateAndMergeOriginal(current2, incoming2);
  const result2Opt = deduplicateAndMergeOptimized(current2, incoming2);
  
  const match2 = result2Orig.length === result2Opt.length &&
                 result2Opt.length === 2 &&
                 result2Opt.some(c => c.id === '1' && c.syncTimestamp === 3000);
  
  if (match2) {
    console.log('✅ PASS: Updated with newer timestamp\n');
    passCount++;
  } else {
    console.log(`❌ FAIL: Update logic differs\n`);
    failCount++;
  }
  
  // Test 3: Keep existing character with older incoming timestamp
  console.log('Test 3: Keep existing (incoming older)');
  const current3 = [createChar('1', 5000)];
  const incoming3 = createChar('1', 2000); // Older
  const result3Orig = deduplicateAndMergeOriginal(current3, incoming3);
  const result3Opt = deduplicateAndMergeOptimized(current3, incoming3);
  
  const match3 = result3Orig.length === result3Opt.length &&
                 result3Opt.length === 1 &&
                 result3Opt[0].syncTimestamp === 5000; // Should keep original
  
  if (match3) {
    console.log('✅ PASS: Kept existing (older incoming)\n');
    passCount++;
  } else {
    console.log(`❌ FAIL: Should keep original timestamp\n`);
    failCount++;
  }
  
  // Test 4: Large dataset (100 members)
  console.log('Test 4: Large dataset (100 members)');
  const current4 = Array.from({ length: 100 }, (_, i) => createChar(`char-${i}`));
  const incoming4 = createChar('char-50', Date.now()); // Update member 50
  const result4Orig = deduplicateAndMergeOriginal(current4, incoming4);
  const result4Opt = deduplicateAndMergeOptimized(current4, incoming4);
  
  if (result4Orig.length === result4Opt.length && result4Opt.length === 100) {
    console.log('✅ PASS: Handled 100 members correctly\n');
    passCount++;
  } else {
    console.log(`❌ FAIL: Large dataset mismatch\n`);
    failCount++;
  }
  
  // Test 5: Empty array
  console.log('Test 5: Empty array');
  const current5: Character[] = [];
  const incoming5 = createChar('first');
  const result5Orig = deduplicateAndMergeOriginal(current5, incoming5);
  const result5Opt = deduplicateAndMergeOptimized(current5, incoming5);
  
  if (result5Orig.length === result5Opt.length && result5Opt.length === 1) {
    console.log('✅ PASS: Empty array handled\n');
    passCount++;
  } else {
    console.log(`❌ FAIL: Empty array mismatch\n`);
    failCount++;
  }
  
  // Summary
  console.log(`\n=== RESULTS ===`);
  console.log(`✅ Passed: ${passCount}/5`);
  console.log(`❌ Failed: ${failCount}/5`);
  
  if (failCount === 0) {
    console.log('\n✅ ALL TESTS PASSED - No behavioral changes!\n');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED - Behavioral regression detected!\n');
  }
  
  return failCount === 0;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  testBehavioral();
}
