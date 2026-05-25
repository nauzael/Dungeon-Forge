# Firebase Auth Fix - v1.1

**Date:** 2026-05-22  
**Error Fixed:** `TypeError: Gr.auth.onAuthStateChange is not a function`  
**Status:** ✅ FIXED

## Problem

The app crashed on startup with error:
```
TypeError: Gr.auth.onAuthStateChange is not a function
```

Root cause: The Firebase adapter had mismatched function signatures.

### What Was Wrong
```typescript
// ❌ WRONG - Named onAuthStateChanged but App.tsx calls onAuthStateChange
onAuthStateChanged: (callback: (user: any) => void) => {
  return unsubscribeFn;  // ❌ Wrong return format
}

// But App.tsx expects:
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {})
```

## Solution

Updated `utils/firebase.ts` to match Supabase API exactly:

### Changes Made
```typescript
// ✅ CORRECT - Named onAuthStateChange (no 'd' at end)
onAuthStateChange: (callback: (_event: string, session: any) => void) => {
  const unsubscribe = firebaseOnAuthStateChanged(authInstance, (user) => {
    if (user) {
      callback('SIGNED_IN', {  // ✅ Match Supabase event format
        user: { id, email, user_metadata },
        access_token: 'firebase-token'
      });
    } else {
      callback('SIGNED_OUT', null);
    }
  });
  
  // ✅ Return Supabase-compatible structure
  return { data: { subscription: unsubscribe } };
}
```

### Key Fixes
1. ✅ Renamed `onAuthStateChanged` → `onAuthStateChange`
2. ✅ Updated callback signature: `(user) => void` → `(_event, session) => void`
3. ✅ Simulated Supabase events: `SIGNED_IN` / `SIGNED_OUT`
4. ✅ Fixed return format: `unsubscribe` → `{ data: { subscription: unsubscribe } }`

## APK Updates

| Version | File | Status | Notes |
|---------|------|--------|-------|
| v1.0 | `dungeon-forge-firebase-v1.0-debug.apk` | ❌ Broken | Initial Firebase build (auth error) |
| v1.1 FIXED | `dungeon-forge-firebase-v1.1-debug-FIXED.apk` | ✅ Working | Auth adapter corrected |

## Testing

After the fix:
- ✅ App loads without auth errors
- ✅ `onAuthStateChange` listener initializes correctly
- ✅ User can see login screen (no crashes)

## Commits

```
c92ac50 fix: Correct Firebase auth adapter - onAuthStateChange signature and return format
2b978ca build: Generate Firebase APK v1.1 FIXED - corrected auth adapter signature
```

## Next Testing Steps

1. Test Google OAuth login
2. Verify token persistence
3. Test character creation & sync
4. Test party/campaign features
5. Test realtime updates

---

**APK:** `dungeon-forge-firebase-v1.1-debug-FIXED.apk` (11.43 MB)  
**Branch:** `feature/firebase-migration`  
**Ready for:** Full feature testing
