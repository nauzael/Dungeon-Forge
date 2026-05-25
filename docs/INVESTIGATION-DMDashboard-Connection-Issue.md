# 🔍 Investigation: DMDashboard Connection Issue - Wave 10

**Investigation Date:** 2026-05-25  
**Status:** 🔴 CRITICAL ISSUE IDENTIFIED  
**Severity:** HIGH  
**Affected Component:** DMDashboard + useDMParty hook + subscribeWithRetry  

---

## Executive Summary

**Current Implementation:** DMDashboard Realtime listener is NOT using Wave 10 (selective document listeners). The primary hook `useDMParty.ts` calls `subscribeWithRetry()` **WITHOUT** the `activeCharacterId` parameter, forcing the component to listen to **ALL characters in a party** instead of selective character streams. This violates Wave 10 optimization and creates unnecessary database load.

**User Symptom:** "panel del DM no conecta" — DM Dashboard fails to establish or maintain realtime connection for party members.

---

## Issue Analysis

### 1. Current Implementation Summary

**DMDashboard.tsx (116 lines - refactored)**
- Composes hooks: `useDMParty`, `useInitiativeTracker`
- Renders: `Controls`, `PartySelector`, `TabContent`, `BottomNav`, `ConnectionDebugPanel`
- Lazy-loads individual character listeners via `handleStartEditCharacter()` (Wave 8 pattern)

**useDMParty.ts Hook (277 lines)**
- Encapsulates party state: `parties`, `party`, `members`, `realtimeStatus`
- Manages realtime subscription with `subscribeWithRetry()` at line 260
- Returns: `{ party, parties, members, isLoading, realtimeStatus, ... }`

**subscribeWithRetry() Function (utils/supabase.ts, line 429)**
- **Signature:** `subscribeWithRetry(partyId, onUpdate, onBroadcast, onStatusChange, activeCharacterId?)`
- Implements retry logic with exponential backoff
- Supports selective sync via optional `activeCharacterId` parameter (Wave 7)
- Builds filter dynamically:
  ```typescript
  const characterFilter = activeCharacterId 
    ? `party_id=eq.${partyId} AND id=eq.${activeCharacterId}`
    : `party_id=eq.${partyId}`;  // ← Listens to ALL characters
  ```

---

### 2. Root Cause: Missing Wave 10 Implementation

#### Problem 1: useDMParty NOT Using Selective Sync

**File:** `hooks/useDMParty.ts` (lines 260-324)

```typescript
// ❌ PROBLEM: No activeCharacterId parameter passed
const subscription = subscribeWithRetry(
  party.id,
  (payload: any) => { /* onUpdate */ },
  (broadcastChar: any) => { /* onBroadcast */ },
  (status) => { setRealtimeStatus(status); }
  // ← MISSING 5th parameter: activeCharacterId
);
```

**Impact:**
- Listener opens to **ALL characters** in the party
- Receives updates for every character edit, not just active one
- Wastes database "listeners" quota (Wave 10 objective is 300→50 simultaneous listeners)
- DMDashboard receives bloated payloads for members not being edited

#### Problem 2: Inconsistent Implementation

**File:** `components/DMDashboard.tsx` (lines 47-63)

```typescript
// ✅ ATTEMPTS to use selective sync in handleStartEditCharacter
const subscription = subscribeWithRetry(
  party?.id || '',
  (payload: any) => { /* ... */ },
  undefined,
  undefined,
  characterId // ← WAVE 7: Selective sync
);
```

**But:** This is a SECONDARY listener opened only on edit. The PRIMARY listener from useDMParty.ts is STILL listening to all characters.

**Dual-listener design** creates confusion:
- useDMParty = listens to all (no selective)
- DMDashboard = tries to add selective listeners on-demand

This inconsistency means Wave 10 is **partially implemented and broken**.

---

### 3. Identified Issues

#### Issue #1: Connection Establishment Failure (Most Likely)

**Symptom:** "panel del DM no conecta"

**Root Cause:** If `subscribeWithRetry()` fails during initial connection in useDMParty, the status becomes `'error'` or `'reconnecting'` indefinitely.

**Failure Modes:**
1. **RLS Policy Violation**: Party or character data has RLS policies that reject DM user's reads
   - Symptom: Status stays "connecting" > 15s (timeout)
   - Log: `[Realtime] Timeout after 15000ms` in console
   
2. **Missing Credentials**: If `.env` wasn't loaded during build
   - Symptom: Supabase URL/Key empty
   - Log: `[Realtime] Local mode detected` but DM Dashboard still tries to load data
   
3. **Network Timeout**: Supabase Realtime unreachable
   - Symptom: Status cycles through "reconnecting" (exponential backoff: 1s → 2s → 4s → 8s)
   - After 10 retries, gives up with `[Realtime] Max retries reached`

---

#### Issue #2: Wave 10 Not Implemented

**Problem:** DMDashboard is not using the selective document listener optimization from Wave 10.

**Expected Behavior (Wave 10):**
- Open ONE listener listening to ONE character at a time
- Save ~50 simultaneous listeners (300→50 per user)
- Save ~87% of database reads

**Actual Behavior:**
- Opens listener to ALL characters in party
- Wastes listener slots
- Receives unnecessary updates

---

#### Issue #3: Listener Cleanup May Leak

**File:** `components/DMDashboard.tsx` (lines 74-79)

```typescript
useEffect(() => {
  return () => {
    listeners.current.forEach((listener) => {
      listener.unsubscribe();  // ← NO await here (async function called sync)
    });
    listeners.current.clear();
  };
}, [party?.id]);
```

**Problem:** `listener.unsubscribe()` is async but called without `await`. This creates a **promise that never resolves**, and cleanup handlers may not complete before unmount.

---

### 4. Evidence from Code

**Evidence 1: useDMParty doesn't pass activeCharacterId**
```typescript
// hooks/useDMParty.ts:260-264
const subscription = subscribeWithRetry(
  party.id,
  (payload: any) => { ... },
  (broadcastChar: any) => { ... },
  (status) => { setRealtimeStatus(status); }
  // Only 4 parameters — missing 5th (activeCharacterId)
);
```

**Evidence 2: subscribeWithRetry signature shows optional 5th param**
```typescript
// utils/supabase.ts:429-434
export const subscribeWithRetry = (
  partyId: string,
  onUpdate: (payload: unknown) => void,
  onBroadcast?: (payload: unknown) => void,
  onStatusChange?: (status: '...' ) => void,
  activeCharacterId?: string  // ← Optional but NOT being used
):
```

**Evidence 3: Selective filter logic exists but not triggered**
```typescript
// utils/supabase.ts:487-490
const characterFilter = activeCharacterId 
  ? `party_id=eq.${partyId} AND id=eq.${activeCharacterId}`
  : `party_id=eq.${partyId}`;  // ← ALWAYS this path in DMDashboard
```

---

## Recommended Next Steps

### Immediate Diagnostics (No Code Changes)

1. **Open ConnectionDebugPanel** (in DMDashboard Party Selector)
   - Check "Realtime Status:" field
   - Check "Credenciales:" — are they loaded?
   - Check "📋 Últimos Eventos" for error patterns

2. **Check Browser Console** for:
   ```
   [DM-Realtime] Status changed to: [?]
   [Realtime] Timeout after 15000ms
   [Realtime] Max retries reached
   ```

3. **Verify Supabase Connection:**
   - Go to Supabase Dashboard → Realtime tab
   - Check if DM user has active channels

### To Fix Wave 10 Implementation

1. **Pass activeCharacterId to useDMParty's subscription**
   - useDMParty needs to receive which character is being edited
   - Problem: useDMParty doesn't track "activeCharacterId" state
   - Solution: Accept `activeCharacterId` as parameter to hook

2. **Fix listener cleanup (async issue)**
   - Wrap in async cleanup handler
   - OR use Promise.allSettled

3. **Remove dual-listener pattern**
   - Either: use selective sync in useDMParty hook
   - OR: use lazy listeners only (remove main subscription)

---

## Issue Severity

| Factor | Status |
|--------|--------|
| **User Blocked?** | 🔴 YES — DM Dashboard non-functional |
| **Data Corruption?** | 🟢 NO — read-only issue |
| **Wave 10 Progress?** | 🟡 PARTIAL — selective sync not implemented in primary hook |
| **Fixability** | 🟢 HIGH — code structure is sound, needs parameter passing |

**Overall:** 🔴 **CRITICAL** — DMDashboard realtime is broken or missing selective sync

---

## Summary: What's Broken

| Component | Issue | Impact |
|-----------|-------|--------|
| **useDMParty.ts** | No activeCharacterId parameter to subscribeWithRetry | Listens to ALL characters, violates Wave 10 |
| **Cleanup handler** | Async unsubscribe not awaited | Potential listener leaks on unmount |
| **Connection** | May timeout if RLS/credentials/network issue | "panel del DM no conecta" |

---

## Files to Review

1. ✅ `components/DMDashboard.tsx` — Currently reviewed
2. ✅ `hooks/useDMParty.ts` — Currently reviewed
3. ✅ `utils/supabase.ts` (subscribeWithRetry) — Currently reviewed
4. 📋 ConnectionDebugPanel output — Needs user console logs
5. 📋 RLS policies on `parties` and `characters` tables — Needs Supabase check

---

**Investigation Complete**  
**Next Action:** Collect browser console logs from user, then proceed with fixes
