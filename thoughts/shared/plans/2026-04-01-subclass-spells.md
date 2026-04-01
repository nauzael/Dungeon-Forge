# Subclass Always Prepared Spells - Implementation Plan

## Overview

Add `alwaysPreparedSpells` field to `SubclassData` interface and implement auto-add logic when leveling up.

## Tasks

### Task 001: Update types.ts

**File**: `types.ts`

Add `alwaysPreparedSpells` field to `SubclassData` interface:

```typescript
export interface SubclassData {
    name: string;
    description: string;
    features: Record<number, Trait[]>;
    // NEW
    alwaysPreparedSpells?: Record<number, string[]>;
}
```

**Verification**: Build passes, no TypeScript errors.

---

### Task 002: Add alwaysPreparedSpells to Artificer subclasses

**File**: `Data/classes/classes-en.ts`

Add `alwaysPreparedSpells` to these subclasses:
- Alchemist (lines ~21-40)
- Armorer (lines ~42-60)
- Artillerist (lines ~62-80)
- Battle Smith (lines ~82-100)
- Cartographer (lines ~102-120)

Example format:
```typescript
alwaysPreparedSpells: {
    3: ['Healing Word', 'Ray of Sickness'],
    5: ['Flaming Sphere', "Melf's Acid Arrow"],
    9: ['Gaseous Form', 'Mass Healing Word'],
    13: ['Death Ward', 'Vitriolic Sphere'],
    17: ['Cloudkill', 'Raise Dead'],
}
```

**Verification**: Build passes, spells match descriptions.

---

### Task 003: Add alwaysPreparedSpells to Paladin Oaths

**File**: `Data/classes/classes-en.ts`

Add `alwaysPreparedSpells` to:
- Oath of Devotion (line ~760)
- Oath of Glory (line ~780)
- Oath of the Ancients (line ~800)
- Oath of Vengeance (line ~838)

**Verification**: Build passes, spells match descriptions.

---

### Task 004: Add alwaysPreparedSpells to Ranger subclasses

**File**: `Data/classes/classes-en.ts`

Add `alwaysPreparedSpells` to:
- Fey Wanderer (line ~896)
- Gloom Stalker (line ~916)
- Winter Walker (line ~956)

Note: Fey Wanderer has extra "Feywild Gift" text - only extract spells.

**Verification**: Build passes.

---

### Task 005: Add alwaysPreparedSpells to Warlock Patrons

**File**: `Data/classes/classes-en.ts`

Add `alwaysPreparedSpells` to:
- Archfey (line ~1225)
- Celestial (line ~1244)
- Fiend (line ~1264)
- Great Old One (line ~1283)

**Verification**: Build passes.

---

### Task 006: Add alwaysPreparedSpells to Sorcerer Origins

**File**: `Data/classes/classes-en.ts`

Add `alwaysPreparedSpells` to:
- Aberrant Sorcery (line ~1109)
- Clockwork Sorcery (line ~1129)
- Draconic Sorcery (line ~1149)
- Spellfire Sorcery (line ~1168)

**Verification**: Build passes.

---

### Task 007: Update confirmLevelUp to auto-add subclass spells

**File**: `components/SheetTabs.tsx`

Modify `confirmLevelUp()` function to auto-add subclass spells:

```typescript
if (needsSubclass && pendingSubclass) {
    const subclassData = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === pendingSubclass);
    
    if (subclassData?.alwaysPreparedSpells) {
        const spellsToAdd: string[] = [];
        Object.entries(subclassData.alwaysPreparedSpells).forEach(([lvl, spells]) => {
            if (parseInt(lvl) <= nextLevel) {
                spellsToAdd.push(...spells);
            }
        });
        
        if (spellsToAdd.length > 0) {
            updatedChar.preparedSpells = [...new Set([...updatedChar.preparedSpells, ...spellsToAdd])];
        }
    }
}
```

**Verification**: Test with Artificer character leveling up to level 3.

---

## Summary

| Task | Description | File |
|------|-------------|------|
| 001 | Add field to interface | types.ts |
| 002 | Add to Artificer | classes-en.ts |
| 003 | Add to Paladin | classes-en.ts |
| 004 | Add to Ranger | classes-en.ts |
| 005 | Add to Warlock | classes-en.ts |
| 006 | Add to Sorcerer | classes-en.ts |
| 007 | Level up logic | SheetTabs.tsx |

## Status

Pending implementation