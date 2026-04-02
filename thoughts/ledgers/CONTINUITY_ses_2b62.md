---
session: ses_2b62
updated: 2026-04-01T18:03:45.785Z
---

# Session Summary

## Goal
Fix subclass spell access issues in Dungeon Forge, ensuring Warlock Celestial's Cleric spells are visible and Warlock has correct spell list (not Wizard's list).

## Constraints & Preferences
- All subclasses start at character level 3
- Maintain existing code patterns (useMemo hooks, TypeScript strict mode)
- Follow existing UI patterns for spell tags (purple for "Always Prepared")
- Use official D&D 5e 2024 spell lists from dnd2024.wikidot.com

## Progress
### Done
- [x] **Fixed Warlock spell list** - Created `WARLOCK_SPELLS` with correct spells from official source (removed Magic Missile, Mage Armor, Shield, Fire Bolt, etc.)
- [x] **Fixed Warlock Celestial Patron** - Now shows "Cleric (Celestial Patron)" source tab with correct DIVINE spells
- [x] **Fixed Spellfire Sorcery** - Now shows "Divine (Spellfire Sorcery)" source tab with correct DIVINE spells
- [x] **Fixed getSourceList** - Returns `subclassAlwaysPreparedSpells` instead of full `DIVINE_SPELLS` list
- [x] **Fixed Ranger subclass spells** - Added missing spells to PRIMAL_SPELLS: Charm Person, Disguise Self, Misty Step, Rope Trick, Fear, Dimension Door, Greater Invisibility, Mislead, Seeming
- [x] **Deployed OTA** versions: `2026.4.1-1299`, `2026.4.1-121733`, `2026.4.1-122249`, `2026.4.1-123125`, `2026.4.1-13256`

### In Progress
- [ ] **Verify Bard and Sorcerer spell lists** - Need to check if they match official source (dnd2024.wikidot.com/bard:spell-list and dnd2024.wikidot.com/sorcerer:spell-list)

## Key Decisions
- *WARLOCK_SPELLS separate from ARCANE_SPELLS*: Warlock has unique spells (Eldritch Blast, Hex, Armor of Agathys, Hunger of Hadar) that Wizard doesn't have, and lacks Wizard spells (Magic Missile, Shield, Fire Bolt)
- *Use subclassAlwaysPreparedSpells in getSourceList*: Returns only specific subclass spells, not full spell lists
- *Add missing spells to PRIMAL_SPELLS*: Rather than creating cross-list logic, added Arcane spells that Rangers need to Primal list

## Next Steps
1. **Verify Bard spell list** - Fetch dnd2024.wikidot.com/bard:spell-list and compare with ARCANE_SPELLS
2. **Verify Sorcerer spell list** - Fetch dnd2024.wikidot.com/sorcerer:spell-list and compare with ARCANE_SPELLS
3. **Deploy fix** if any discrepancies found
4. **Test Warlock Celestial** - Verify Cleric spells appear with purple "Always Prepared" tag
5. **Test Spellfire** - Verify Divine spells appear with correct source label

## Critical Context

### Warlock Official Spell List (from dnd2024.wikidot.com)
**Warlock CANTRIPS (0):** Blade Ward, Chill Touch, Eldritch Blast, Friends, Mage Hand, Mind Sliver, Minor Illusion, Poison Spray, Prestidigitation, Thunderclap, Toll the Dead, True Strike

**Warlock LEVEL 1:** Armor of Agathys, Arms of Hadar, Bane, Charm Person, Comprehend Languages, Detect Magic, Expeditious Retreat, Hellish Rebuke, Hex, Illusory Script, Protection from Evil and Good, Speak with Animals, Tasha's Hideous Laughter, Unseen Servant, Witch Bolt

**Warlock LEVEL 2:** Cloud of Daggers, Crown of Madness, Darkness, Enthrall, Hold Person, Invisibility, Mind Spike, Mirror Image, Misty Step, Ray of Enfeeblement, Spider Climb, Suggestion

**Warlock LEVEL 3:** Counterspell, Dispel Magic, Fear, Fly, Gaseous Form, Hunger of Hadar, Hypnotic Pattern, Magic Circle, Major Image, Remove Curse, Summon Fey, Summon Undead, Tongues, Vampiric Touch

**Warlock LEVEL 4:** Backlash, Banishment, Blight, Charm Monster, Dimension Door, Doomtide, Hallucinatory Terrain, Summon Aberration

**Warlock LEVEL 5:** Contact Other Plane, Dream, Hold Monster, Jallarzi's Storm of Radiance, Mislead, Planar Binding, Scrying, Synaptic Static, Teleportation Circle

### Spells in ARCANE_SPELLS but NOT in Warlock
Magic Missile, Mage Armor, Shield, Fire Bolt, Burning Hands, Scorching Ray, Fireball, Lightning Bolt, etc.

### Subclasses with Cross-List Spells (FIXED)
| Class    | Subclass         | Problem                              | Status   |
| -------- | ---------------- | ------------------------------------ | -------- |
| Warlock  | Celestial Patron | ARCANE class, DIVINE subclass spells | ✅ Fixed |
| Sorcerer | Spellfire        | ARCANE class, DIVINE subclass spells | ✅ Fixed |
| Ranger   | Fey Wanderer     | PRIMAL class, ARCANE spells missing  | ✅ Fixed |
| Ranger   | Gloom Stalker    | PRIMAL class, ARCANE spells missing  | ✅ Fixed |
| Ranger   | Winter Walker    | PRIMAL class, ARCANE spells missing  | ✅ Fixed |

## File Operations

### Modified
- `E:\Apks\Dungeon Forge\Data\spells.ts` - Added WARLOCK_SPELLS, updated SPELL_LIST_BY_CLASS, added spells to PRIMAL_SPELLS
- `E:\Apks\Dungeon Forge\components\sheet\SpellsTab.tsx` - Added subclassSpellSource useMemo, updated availableSources, updated getSourceList
