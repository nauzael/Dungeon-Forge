// Benchmark: Deduplication O(n) vs O(1)
import { Character } from './types';

// Current O(n) implementation
const deduplicateAndMergeCurrent = (current: Character[], incoming: Character): Character[] => {
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

// Optimized O(1) implementation using Map
const deduplicateAndMergeOptimized = (current: Character[], incoming: Character): Character[] => {
  const dedupMap = new Map<string, Character>();
  
  // Add current members to map
  for (const char of current) {
    dedupMap.set(char.id, char);
  }
  
  // Add/update incoming
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
  
  return Array.from(dedupMap.values());
};

// Generate synthetic test data
const generateMembers = (count: number): Character[] => {
  const members: Character[] = [];
  for (let i = 0; i < count; i++) {
    members.push({
      id: `char-${i}`,
      name: `Character ${i}`,
      level: 1,
      class: 'Fighter',
      species: 'Human',
      hp: { current: 10, max: 10, temp: 0 },
      stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      inventory: [],
      syncTimestamp: Date.now() - Math.random() * 10000,
    } as any as Character);
  }
  return members;
};

// Benchmark function
const benchmark = () => {
  console.log('=== DEDUPLICATION BENCHMARK ===\n');
  
  const sizes = [10, 50, 100, 200, 500];
  
  for (const size of sizes) {
    const members = generateMembers(size);
    const incomingMember = {
      ...members[Math.floor(size / 2)],
      syncTimestamp: Date.now(),
    };
    
    // Benchmark current O(n)
    console.time(`Current O(n) - ${size} members`);
    for (let i = 0; i < 1000; i++) {
      deduplicateAndMergeCurrent(members, incomingMember);
    }
    console.timeEnd(`Current O(n) - ${size} members`);
    
    // Benchmark optimized O(1)
    console.time(`Optimized O(1) - ${size} members`);
    for (let i = 0; i < 1000; i++) {
      deduplicateAndMergeOptimized(members, incomingMember);
    }
    console.timeEnd(`Optimized O(1) - ${size} members`);
    
    console.log('');
  }
};

benchmark();
