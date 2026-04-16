# Subclass Always Prepared Spells - Design

## Problem Statement

When a character selects a subclass that grants "always prepared spells" (e.g., Artificer Alchemist, Paladin Oath of Devotion), these spells are listed as features in the Features Tab but are NOT automatically added to the character's spell list. The player must manually add them, which is error-prone and inconsistent with how other class features work.

## Constraints

- All subclasses start at character level 3 (subclass level 1)
- Existing `SubclassData` interface must be extended, not replaced
- Must work with character creation flow and level up flow
- Key format: character level when feature is gained (3, 5, 7, 9, 13, 17)

## Solution: Add `alwaysPreparedSpells` to `SubclassData`

### Interface Change

**File**: `types.ts`

```typescript
export interface SubclassData {
    name: string;
    description: string;
    features: Record<number, Trait[]>;
    // NEW: Spells always prepared when reaching specific levels
    // Key = character level when feature is gained (3, 5, 7, 9, 13, 17)
    // Value = spell names to add
    alwaysPreparedSpells?: Record<number, string[]>;
}
```

### Data Format Examples

**Alchemist (Artificer)** - standard format:
```typescript
alwaysPreparedSpells: {
    3: ['Healing Word', 'Ray of Sickness'],
    5: ['Flaming Sphere', "Melf's Acid Arrow"],
    9: ['Gaseous Form', 'Mass Healing Word'],
    13: ['Death Ward', 'Vitriolic Sphere'],
    17: ['Cloudkill', 'Raise Dead'],
}
```

**Oath of Devotion (Paladin)** - uses "level 3:" in description:
```typescript
alwaysPreparedSpells: {
    3: ['Protection from Evil and Good', 'Shield of Faith'],
    5: ['Aid', 'Zone of Truth'],
    9: ['Beacon of Hope', 'Dispel Magic'],
    13: ['Freedom of Movement', 'Guardian of Faith'],
    17: ['Commune', 'Flame Strike'],
}
```

**Fey Wanderer (Ranger)** - has extra "Feywild Gift" text after spells:
```typescript
alwaysPreparedSpells: {
    3: ['Charm Person'],
    5: ['Misty Step'],
    9: ['Summon Fey'],
    13: ['Dimension Door'],
    17: ['Mislead'],
}
```

### Subclasses Requiring Migration

**Artificer** (5 subclasses):
- Alchemist, Armorer, Artillerist, Battle Smith, Cartographer

**Paladin** (4 oaths):
- Oath of Devotion, Oath of Glory, Oath of the Ancients, Oath of Vengeance

**Ranger** (3 subclasses):
- Fey Wanderer, Gloom Stalker, Winter Walker

**Warlock** (5 patrons):
- Genie, Archfey, Celestial, Fiend, Great Old One

**Sorcerer** (4 origins):
- Aberrant Sorcery, Clockwork Sorcery, Draconic Sorcery, Spellfire Sorcery

### Level Up Logic

**File**: `components/SheetTabs.tsx` - `confirmLevelUp()`

```typescript
if (needsSubclass && pendingSubclass) {
    const subclassData = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === pendingSubclass);
    
    if (subclassData?.alwaysPreparedSpells) {
        // Get all spells for levels 3 through nextLevel
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

### Features Tab Display

No changes needed - already correctly displays subclass features. The structured `alwaysPreparedSpells` is for automatic addition only.

## Implementation Order

1. Update `types.ts` - add `alwaysPreparedSpells` field
2. Add `alwaysPreparedSpells` to all affected subclasses in `classes-en.ts`
3. Update `SheetTabs.tsx` - modify `confirmLevelUp()` to auto-add spells
4. Test with Artificer character

## Status

Draft - pending review