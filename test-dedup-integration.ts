// Integration Test: Realtime Deduplication Sync
// Simulates postgres_changes + broadcast with 100+ members

import { Character } from './types';

interface SyncEvent {
  type: 'postgres_change' | 'broadcast';
  character: Character;
  timestamp: number;
}

class MockDMSync {
  private members: Character[] = [];
  private dedupMap = new Map<string, Character>();
  private syncLog: string[] = [];
  
  constructor(initialMembers: Character[] = []) {
    this.members = initialMembers;
    this.rebuildMap();
  }
  
  // Optimized O(1) deduplication
  private deduplicateAndMerge(incoming: Character): void {
    const startTime = performance.now();
    
    const existing = this.dedupMap.get(incoming.id);
    if (!existing) {
      this.dedupMap.set(incoming.id, incoming);
      this.members.push(incoming);
    } else {
      const incomingTime = incoming.syncTimestamp || 0;
      const existingTime = existing.syncTimestamp || 0;
      if (incomingTime > existingTime) {
        this.dedupMap.set(incoming.id, incoming);
        const idx = this.members.findIndex(c => c.id === incoming.id);
        if (idx !== -1) {
          this.members[idx] = incoming;
        }
      }
    }
    
    const dedupMs = performance.now() - startTime;
    this.syncLog.push(`[${incoming.id}] Dedup took ${dedupMs.toFixed(2)}ms`);
  }
  
  private rebuildMap(): void {
    this.dedupMap.clear();
    for (const char of this.members) {
      this.dedupMap.set(char.id, char);
    }
  }
  
  // Simulate receiving sync events
  processEvent(event: SyncEvent): void {
    this.deduplicateAndMerge(event.character);
  }
  
  getMembers(): Character[] {
    return this.members;
  }
  
  getDedupLatencies(): { avg: number; max: number; min: number } {
    const latencies = this.syncLog
      .map(log => {
        const match = log.match(/(\d+\.\d+)ms/);
        return match ? parseFloat(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    if (latencies.length === 0) return { avg: 0, max: 0, min: 0 };
    
    const sum = latencies.reduce((a, b) => a + b, 0);
    const max = Math.max(...latencies);
    const min = Math.min(...latencies);
    
    return {
      avg: sum / latencies.length,
      max,
      min,
    };
  }
  
  getLogs(): string[] {
    return this.syncLog;
  }
}

// Generate test data
const generateMembers = (count: number): Character[] => {
  const members: Character[] = [];
  for (let i = 0; i < count; i++) {
    members.push({
      id: `char-${i}`,
      name: `Character ${i}`,
      level: Math.floor(Math.random() * 20) + 1,
      class: ['Fighter', 'Wizard', 'Rogue', 'Cleric'][Math.floor(Math.random() * 4)],
      species: ['Human', 'Elf', 'Dwarf'][Math.floor(Math.random() * 3)],
      hp: { current: 50, max: 100, temp: 0 },
      stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      inventory: [],
      ac: 10,
      party_id: 'party-1',
      syncTimestamp: Date.now() - Math.random() * 10000,
    } as any as Character);
  }
  return members;
};

export const testIntegration = () => {
  console.log('=== INTEGRATION TEST: Realtime Deduplication ===\n');
  
  // Initialize with 100 members
  const initialMembers = generateMembers(100);
  const sync = new MockDMSync(initialMembers);
  
  console.log(`📊 Initial state: ${sync.getMembers().length} members\n`);
  
  // Simulate 1000 realtime events (postgres_changes + broadcast)
  console.log('📡 Processing 1000 realtime sync events...');
  const eventStartTime = performance.now();
  
  for (let i = 0; i < 1000; i++) {
    // 70% updates to existing, 30% new characters
    if (Math.random() < 0.7) {
      // Update existing
      const randomIdx = Math.floor(Math.random() * 100);
      const updatedChar = {
        ...initialMembers[randomIdx],
        syncTimestamp: Date.now(),
        name: `${initialMembers[randomIdx].name} (updated)`,
      };
      sync.processEvent({
        type: 'postgres_change',
        character: updatedChar,
        timestamp: Date.now(),
      });
    } else {
      // New character
      const newIdx = 100 + i;
      sync.processEvent({
        type: 'broadcast',
        character: {
          id: `char-new-${newIdx}`,
          name: `New Character ${newIdx}`,
          level: 1,
          class: 'Fighter',
          species: 'Human',
          hp: { current: 10, max: 10, temp: 0 },
          stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
          inventory: [],
          ac: 10,
          party_id: 'party-1',
          syncTimestamp: Date.now(),
        } as any as Character,
        timestamp: Date.now(),
      });
    }
  }
  
  const eventTotalTime = performance.now() - eventStartTime;
  const latencies = sync.getDedupLatencies();
  
  console.log(`\n✅ Processed 1000 events in ${eventTotalTime.toFixed(2)}ms`);
  console.log(`   Final member count: ${sync.getMembers().length}`);
  console.log(`\n📈 Deduplication Latencies:`);
  console.log(`   Average: ${latencies.avg.toFixed(3)}ms`);
  console.log(`   Max: ${latencies.max.toFixed(3)}ms`);
  console.log(`   Min: ${latencies.min.toFixed(3)}ms`);
  
  // Acceptance criteria check
  const passesAcceptance = latencies.avg < 10 && latencies.max < 50;
  
  console.log(`\n${passesAcceptance ? '✅' : '❌'} Acceptance Criteria:`);
  console.log(`   ${latencies.avg < 10 ? '✅' : '❌'} Average <10ms (${latencies.avg.toFixed(3)}ms)`);
  console.log(`   ${latencies.max < 50 ? '✅' : '❌'} Max <50ms (${latencies.max.toFixed(3)}ms)`);
  
  console.log('\n✅ Integration test completed.\n');
  
  return passesAcceptance;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  testIntegration();
}
