# Level-Gated Features Design
## Fix Features to Appear Only When Unlocked by Level

### Date: 2026-04-01
### Status: draft

---

## Problem Statement

Features/abilities that unlock at specific character levels are appearing before that level is reached. For example, a Wood Elf character shows "Wood Elf Magic" abilities at level 1, but some of those abilities should only appear at level 3 and level 5.

---

## Current System Analysis

### Trait Interface (`types.ts`)
```typescript
export interface Trait {
    name: string;
    description: string;
}
```
**Problem:** No `level` field to indicate when the trait unlocks.

### Species Features with Level Requirements

| Species | Trait | Level |
|---------|-------|-------|
| Dhampir | Spider Climb | 3 |
| Dragonborn | Draconic Flight | 5 |
| Goliath | Large Form | 5 |
| Wood Elf | Wood Elf Magic (Longstrider) | 3 |
| Wood Elf | Wood Elf Magic (Pass without Trace) | 5 |
| Faerie | Fairy Magic (Faerie Fire) | 3 |
| Faerie | Fairy Magic (Enlarge/Reduce) | 5 |

### FeaturesTab Bug (`components/sheet/FeaturesTab.tsx`, lines 73-81)
```typescript
if (speciesData) {
    speciesData.traits.forEach(t => list.push({...t, source: 'Species', level: 1}));
    if (character.subspecies) {
        const subData = speciesData.subspecies?.find(s => s.name === character.subspecies);
        subData?.traits.forEach(t => list.push({...t, source: 'Species', level: 1}));
    }
}
```
**Problem:** All species traits are added with `level: 1` regardless of actual unlock level.

---

## Solution Design

### 1. Add Optional `level` Field to Trait Interface

```typescript
export interface Trait {
    name: string;
    description: string;
    level?: number;  // Character level when trait unlocks. Default is 1.
}
```

### 2. Update Species Data with Level Information

Update these species traits in `Data/species/species-en.ts`:

**Dhampir:**
```typescript
{ name: 'Spider Climb', description: '...', level: 3 },
```

**Dragonborn:**
```typescript
{ name: 'Draconic Flight', description: '...', level: 5 },
```

**Goliath:**
```typescript
{ name: 'Large Form', description: '...', level: 5 },
```

**Wood Elf (subspecies):**
- The "Wood Elf Magic" trait is complex - it mentions multiple level-gated abilities
- Options:
  1. Split into separate traits with different levels
  2. Keep as single trait but update to level 3 (first unlock)
  3. Add `level: 3` and note in UI that part of description unlocks later

**Faerie (if exists in data):**
- Same situation as Wood Elf

### 3. Update FeaturesTab to Filter by Level

```typescript
if (speciesData) {
    speciesData.traits.forEach(t => {
        const traitLevel = t.level || 1;  // Default to level 1
        if (traitLevel <= character.level) {
            list.push({...t, source: 'Species', level: traitLevel});
        }
    });
    if (character.subspecies) {
        const subData = speciesData.subspecies?.find(s => s.name === character.subspecies);
        subData?.traits.forEach(t => {
            const traitLevel = t.level || 1;
            if (traitLevel <= character.level) {
                list.push({...t, source: 'Species', level: traitLevel});
            }
        });
    }
}
```

---

## Implementation Steps

### Step 1: Update Trait Interface
Modify `types.ts` to add optional `level` field.

### Step 2: Update Species Data
Add `level` field to traits that have level requirements in `Data/species/species-en.ts`:
- Dhampir: Spider Climb → level 3
- Dragonborn: Draconic Flight → level 5
- Goliath: Large Form → level 5
- (Check for other species with level-gated traits)

### Step 3: Update FeaturesTab Filtering
Modify `groupedFeatures` useMemo in `components/sheet/FeaturesTab.tsx` to filter species traits by level.

### Step 4: Test
Create a character at various levels and verify features appear at correct levels.

---

## Files to Modify

1. `types.ts` - Add `level?: number` to Trait interface
2. `Data/species/species-en.ts` - Add level fields to affected traits
3. `components/sheet/FeaturesTab.tsx` - Add level filtering logic

---

## Testing Checklist

- [ ] Dhampir at level 1: Spider Climb NOT shown
- [ ] Dhampir at level 3: Spider Climb IS shown
- [ ] Dragonborn at level 4: Draconic Flight NOT shown
- [ ] Dragonborn at level 5: Draconic Flight IS shown
- [ ] Goliath at level 4: Large Form NOT shown
- [ ] Goliath at level 5: Large Form IS shown
- [ ] Wood Elf at level 2: Wood Elf Magic partial/early info NOT shown
- [ ] Wood Elf at level 3: Wood Elf Magic (Longstrider part) IS shown
- [ ] Wood Elf at level 5: Wood Elf Magic (Pass without Trace part) IS shown

---

## Open Questions

1. **Wood Elf Magic handling:** The "Wood Elf Magic" trait mentions both level 3 and level 5 abilities in a single description. Should we:
   - A) Split into two separate traits
   - B) Keep as one trait but only show when level 3 reached, noting the level 5 part in description
   - C) Keep as one trait at level 3 (first unlock)

2. **Backward compatibility:** Existing characters created before this fix will have species traits stored without level info. The code should default to `level: 1` if not specified.
