# T8 Integration Testing - Action Plan to Unblock

## Executive Summary
- **Status**: BLOCKED (RLS Policy prevents party creation)
- **Code Changes**: ✅ DONE (UUID fix implemented)
- **Build**: ✅ PASSED
- **Test Execution**: ❌ BLOCKED (missing prerequisites - cannot create parties)

## Root Cause Analysis

### Two-Layer Problem

**Layer 1: UUID Type Mismatch** ✅ FIXED
```
Error: "invalid input syntax for type uuid: 'local-dev-mode'"
Fix: generateUUID() → valid UUID v4
Status: IMPLEMENTED
```

**Layer 2: RLS Policy Blocking** ❌ NEEDS FIX
```
Error: "new row violates row-level security policy for table 'parties'" (code 42501)
Cause: App in local mode still tries Supabase, but RLS blocks unauthenticated writes
Fix Needed: localStorage fallback when RLS fails
Status: NOT IMPLEMENTED
```

## Recommended Fix: localStorage Fallback (30-60 minutes)

### Implementation Steps

#### 1. Create localStorage storage adapter (utils/localStorage.ts)
```typescript
interface PartyData {
  id: string;
  name: string;
  creator_id: string;
  code: string;
}

export const localPartyStorage = {
  createParty: (userId: string, name: string): PartyData => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const party = {
      id: generateUUID(),
      name,
      creator_id: userId,
      code,
    };
    const parties = JSON.parse(localStorage.getItem('df_parties') || '[]');
    parties.push(party);
    localStorage.setItem('df_parties', JSON.stringify(parties));
    return party;
  },
  
  fetchAllParties: (userId: string): PartyData[] => {
    const parties = JSON.parse(localStorage.getItem('df_parties') || '[]');
    return parties.filter((p: PartyData) => p.creator_id === userId);
  },
  
  deleteParty: (partyId: string) => {
    const parties = JSON.parse(localStorage.getItem('df_parties') || '[]');
    const filtered = parties.filter((p: PartyData) => p.id !== partyId);
    localStorage.setItem('df_parties', JSON.stringify(filtered));
  },
};
```

#### 2. Update utils/supabase.ts - Add fallback logic
```typescript
export const createParty = async (userId: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('parties')
      .insert({ creator_id: userId, name, code })
      .select()
      .single();
    
    if (error?.code === '42501') {
      // RLS violation - fallback to localStorage
      console.warn('[Local Mode] RLS blocked, using localStorage');
      return localPartyStorage.createParty(userId, name);
    }
    
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Failed to create party:', e);
    // Fallback on any error
    return localPartyStorage.createParty(userId, name);
  }
};
```

#### 3. Update hooks/useDMParty.ts
```typescript
// Fetch parties with fallback
const fetchAllParties = useCallback(async () => {
  if (!userId) return;
  
  try {
    const { data } = await supabase
      .from('parties')
      .select('*')
      .eq('creator_id', userId);
    
    if (data) setParties(data);
  } catch (e) {
    // Fallback to localStorage on error
    const localParties = localPartyStorage.fetchAllParties(userId);
    setParties(localParties);
  }
}, [userId]);
```

#### 4. Disable realtime in local mode
```typescript
// In subscribeToParty hook:
if (isLocalMode) {
  console.log('[Local Mode] Realtime disabled, using polling');
  // Use manual refresh instead of realtime
  const interval = setInterval(() => fetchMembers(partyId), 5000);
  return () => clearInterval(interval);
}
```

## Testing Strategy After Fix

Once localStorage fallback is implemented:

1. **Scenario 1**: Party Sync - Debounce
   - Create Party A → Party B (3 rapid clicks)
   - Verify fetchMembers debounce in Network tab (1 call, <400ms)
   - ✅ Debounce T1 verified

2. **Scenario 2**: Member Render - useMemo
   - Change equipment on member → AC updates <100ms
   - React Profiler: only 1 MemberCard re-renders
   - ✅ useMemo T2 verified

3. **Scenario 3**: Combat Sync - Batching
   - Roll initiative → take turn → HP update <500ms
   - Verify 1 render commit in React DevTools Profiler
   - ✅ Batching T6 verified

4. **Scenario 4**: Network Failure - Backoff
   - DevTools throttle: Offline
   - Observe: realtimeStatus → 'error' <5s
   - Restore connection → exponential backoff reconnect
   - ✅ Backoff T4 verified

5. **Scenario 5**: Deduplication - Performance
   - Mock 100+ members
   - Trigger rapid realtime updates
   - Console.time: dedup <10ms
   - ✅ Dedup T5 verified

## Files to Modify (Priority Order)

1. **utils/localStorage.ts** - NEW
   - Local party/character storage adapter
   
2. **utils/supabase.ts**
   - createParty() → add fallback on RLS error
   - deleteParty() → add fallback
   - updatePartyName() → add fallback
   
3. **hooks/useDMParty.ts**
   - fetchAllParties() → add fallback
   - subscribeToParty() → disable realtime in local mode
   
4. **App.tsx**
   - Pass isLocalMode to DMDashboard context

## Effort Estimate

| Task | Effort | Status |
|------|--------|--------|
| Create localStorage adapter | 10 min | Blocked |
| Update createParty/deleteParty | 10 min | Blocked |
| Update hooks | 15 min | Blocked |
| Test all 5 scenarios | 30 min | Blocked |
| **TOTAL** | **65 min** | **BLOCKED** |

## Success Criteria After Fix

- [ ] Party A created successfully (localStorage)
- [ ] Party B created successfully (localStorage)
- [ ] 5 test scenarios execute without blocking errors
- [ ] All acceptance criteria from T8 PASS
- [ ] Zero console errors from RLS violations
- [ ] Performance metrics: debounce <400ms, render <100ms, sync <500ms, backoff <5s, dedup <10ms

## Rollback Plan

If localStorage fallback causes issues:
1. `git checkout HEAD -- utils/localStorage.ts utils/supabase.ts hooks/useDMParty.ts`
2. `npm run build` && reload browser
3. Back to RLS-blocked state (recoverable)

---

**Blocker Resolution Required**: Without localStorage fallback, integration tests cannot execute. This is architectural, not test-related.
