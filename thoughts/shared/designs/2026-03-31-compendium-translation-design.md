# Compendium Data Translation Design

## Problem Statement

Translate `Data/compendiumData.ts` (5008 lines) from Spanish to English. This file contains D&D 5e reference content used in the Compendium feature - a user-facing database of game rules, classes, species, conditions, feats, and subclasses.

## Scope

### Content to Translate

| Category | Count | Lines | Status |
|----------|-------|-------|--------|
| Classes | 12 | ~270 | title (ES), content (ES), fullInfo (EN) |
| Subclasses | ~63 | ~1500 | title (EN), content (ES), fullInfo (EN) |
| Species | 20 | ~550 | title (ES/Mixed), content (ES), fullInfo (ES) |
| Conditions | ~15 | ~200 | Mixed, content (ES), fullInfo (EN) |
| Feats | 159 | ~2500 | All English - NO TRANSLATION NEEDED |

### Key Observation
- **Feats** (159 entries) are already fully in English - skip
- **Classes**: `fullInfo` is English, but `title` and `content` need translation
- **Species**: Everything needs translation (title, content, fullInfo)
- **Subclasses**: `title` and `fullInfo` are English, but `content` needs translation
- **Conditions**: Some are bilingual, some Spanish

## Translation Strategy

### 1. Class Titles (12 entries)
| Spanish | English |
|---------|---------|
| Bárbaro | Barbarian |
| Bardo | Bard |
| Clérigo | Cleric |
| Druida | Druid |
| Guerrero | Fighter |
| Monje | Monk |
| Paladín | Paladin |
| Explorador | Ranger |
| Picaro | Rogue |
| Hechicero | Sorcerer |
| Brujo | Warlock |
| Mago | Wizard |

### 2. Species Content (20 entries - ~550 lines)
Complete translation of all `content` and `fullInfo` fields. This is the bulk of translation work.

### 3. Subclass Content (~63 entries - ~1500 lines)
Translate `content` field only. Keep `title` and `fullInfo` in English.

### 4. Conditions (~15 entries)
Review and translate as needed. Most already have English titles.

## Implementation Plan

1. **Create backup** of original file
2. **Process in batches** by category:
   - Batch 1: Classes (title + content only)
   - Batch 2: Subclasses (content only)
   - Batch 3: Species (complete translation)
   - Batch 4: Conditions (review + translate)
3. **Verify Feats** are truly English (159 entries)
4. **Build and test** after each batch
5. **Run full build** to verify no breaking changes

## Technical Notes

- File: `Data/compendiumData.ts`
- Interface: `CompendiumItem { id, title, category, content, fullInfo }`
- Keep `id` values unchanged (they're keys)
- Keep English `fullInfo` unchanged for Classes/Subclasses
- Only translate Spanish text within `title` and `content` fields

## Constraints

- Must maintain exact same file structure
- Must not break TypeScript compilation
- Build must pass after each batch
- Preserve all markdown formatting in `fullInfo`

## Success Criteria

- 100% of user-facing content in Compendium is in English
- Feats section already English - no changes needed
- All Classes, Species, Subclasses, Conditions show English text
- Build passes successfully
