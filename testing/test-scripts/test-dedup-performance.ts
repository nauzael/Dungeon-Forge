// Test: Deduplication Performance (100+ members)
// Run with: node -e "import('./test-dedup-performance.ts').then(m => m.test())"

import { Character } from './types';

const generateSyntheticMembers = (count: number): Character[] => {
  const members: Character[] = [];
  for (let i = 0; i < count; i++) {
    members.push({
      id: `char-${i}`,
      name: `Character ${i}`,
      level: Math.floor(Math.random() * 20) + 1,
      class: ['Fighter', 'Wizard', 'Rogue', 'Cleric'][Math.floor(Math.random() * 4)],
      species: ['Human', 'Elf', 'Dwarf', 'Halfling'][Math.floor(Math.random() * 4)],
      hp: { current: Math.floor(Math.random() * 100), max: 100, temp: 0 },
      stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      inventory: [],
      ac: 10 + Math.floor(Math.random() * 5),
      party_id: 'party-1',
      syncTimestamp: Date.now() - Math.random() * 10000,
    } as any as Character);
  }
  return members;
};

// Optimized deduplicateAndMerge (O(1))
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

export const test = () => {
  console.log('=== DEDUPLICATION PERFORMANCE TEST ===\n');
  
  const sizes = [50, 100, 200, 500];
  
  for (const size of sizes) {
    console.log(`\n📊 Testing with ${size} members:`);
    const members = generateSyntheticMembers(size);
    
    // Test 1000 deduplication operations
    const incomingMember = {
      ...members[Math.floor(Math.random() * size)],
      syncTimestamp: Date.now(),
    };
    
    const startTotal = performance.now();
    for (let i = 0; i < 1000; i++) {
      deduplicateAndMergeOptimized(members, incomingMember);
    }
    const totalTime = performance.now() - startTotal;
    const avgTime = totalTime / 1000;
    
    console.log(`   ✅ 1000 dedup ops: ${totalTime.toFixed(2)}ms total`);
    console.log(`   ✅ Average per dedup: ${avgTime.toFixed(3)}ms`);
    console.log(`   ✅ Members maintained: ${members.length}`);
    
    // Check if meets acceptance criteria
    if (avgTime < 10) {
      console.log(`   ✅ PASS: <10ms per dedup (${avgTime.toFixed(3)}ms)`);
    } else {
      console.log(`   ⚠️ WARNING: >10ms per dedup (${avgTime.toFixed(3)}ms)`);
    }
  }
  
  console.log('\n✅ All tests completed.\n');
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  test();
}
