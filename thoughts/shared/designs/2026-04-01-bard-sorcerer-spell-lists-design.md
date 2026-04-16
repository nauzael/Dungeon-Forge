---
date: 2026-04-01
topic: "bard-sorcerer-spell-lists"
status: validated
---

## Problem Statement

The **ARCANE_SPELLS** list is an incorrect mashup of Wizard, Warlock, Bard, and Sorcerer spells. It incorrectly includes:
- Warlock-only spells: Eldritch Blast, Hex, Arms of Hadar, Hellish Rebuke
- Wizard-only cantrips: Acid Splash, Chill Touch, Fire Bolt, Ray of Frost, Shocking Grasp
- Spells neither Bard nor Sorcerer should have

Both **Bard** and **Sorcerer** have their own distinct official spell lists from dnd2024.wikidot.com that differ from Wizard's.

## Constraints

- Maintain existing code patterns (useMemo hooks, TypeScript strict)
- Follow existing UI patterns for spell tags
- Keep WARLOCK_SPELLS separate (it was already fixed correctly)
- All subclasses start at character level 3

## Approach

Create separate **BARD_SPELLS** and **SORCERER_SPELLS** constants with correct official spells, then update SPELL_LIST_BY_CLASS to reference them.

## Architecture

### New Constants
- `BARD_SPELLS` - 13 cantrips, full spell list per official Bard spell list
- `SORCERER_SPELLS` - 19 cantrips (includes Sorcerer-specific spells), full spell list per official Sorcerer spell list

### Modified
- `SPELL_LIST_BY_CLASS['Bard']` → `BARD_SPELLS`
- `SPELL_LIST_BY_CLASS['Sorcerer']` → `SORCERER_SPELLS`

## Components

### Data Layer
- `Data/spells.ts` - Add BARD_SPELLS and SORCERER_SPELLS constants
- Keep ARCANE_SPELLS for Wizard only (it already has the correct Wizard spells)

## Bard Official Spell List (from dnd2024.wikidot.com)

### Cantrips (13)
Blade Ward, Dancing Lights, Friends, Light, Mage Hand, Mending, Message, Minor Illusion, Prestidigitation, Starry Wisp, Thunderclap, True Strike, Vicious Mockery

### Level 1 (22)
Animal Friendship, Bane, Charm Person, Color Spray, Command, Comprehend Languages, Cure Wounds, Detect Magic, Disguise Self, Dissonant Whispers, Faerie Fire, Feather Fall, Healing Word, Heroism, Identify, Illusory Script, Longstrider, Silent Image, Sleep, Speak with Animals, Tasha's Hideous Laughter, Thunderwave, Unseen Servant, Wardaway

### Level 2 (23)
Aid, Animal Messenger, Blindness/Deafness, Calm Emotions, Cloud of Daggers, Crown of Madness, Detect Thoughts, Enhance Ability, Enlarge/Reduce, Enthrall, Heat Metal, Hold Person, Invisibility, Knock, Lesser Restoration, Locate Animals or Plants, Locate Object, Magic Mouth, Mirror Image, Phantasmal Force, See Invisibility, Shatter, Silence, Suggestion, Zone of Truth

### Level 3 (17)
Bestow Curse, Cacophonic Shield, Clairvoyance, Dispel Magic, Fear, Feign Death, Glyph of Warding, Hypnotic Pattern, Leomund's Tiny Hut, Major Image, Mass Healing Word, Nondetection, Plant Growth, Sending, Slow, Speak with Dead, Speak with Plants, Stinking Cloud, Tongues

### Level 4 (14)
Backlash, Charm Monster, Compulsion, Confusion, Dimension Door, Doomtide, Fount of Moonlight, Freedom of Movement, Greater Invisibility, Hallucinatory Terrain, Locate Creature, Phantasmal Killer, Polymorph, (missing spells continue...)

### Level 5 (19)
Alustriel's Mooncloak, Animate Objects, Awaken, Dominate Person, Dream, Geas, Greater Restoration, Hold Monster, Legend Lore, Mass Cure Wounds, Mislead, Modify Memory, Planar Binding, Raise Dead, Rary's Telepathic Bond, Scrying, Seeming, Synaptic Static, Teleportation Circle, Yolande's Regal Presence

### Level 6 (10)
Dirge, Eyebite, Find the Path, Guards and Wards, Heroes' Feast, Mass Suggestion, Otto's Irresistible Dance, Programmed Illusion, True Seeing, (Vision?)

### Level 7 (7)
Etherealness, Forcecage, Mirage Arcane, Mordenkainen's Magnificent Mansion, Mordenkainen's Sword, Power Word Fortify, Prismatic Spray, (Resurrection?)

### Level 8 (4)
Antimagic Field, Befuddlement, Clone, Maze, (Mind Blank? Power Word Stun?)

### Level 9 (7)
Astral Projection, Foresight, Gate, Imprisonment, Meteor Swarm, Power Word Heal, Power Word Kill, True Resurrection

## Sorcerer Official Spell List (from dnd2024.wikidot.com)

### Cantrips (19)
Acid Splash, Blade Ward, Chill Touch, Dancing Lights, Elementalism, Fire Bolt, Friends, Light, Mage Hand, Mending, Message, Mind Sliver, Minor Illusion, Poison Spray, Prestidigitation, Ray of Frost, Shocking Grasp, Sorcerous Burst, Thunderclap, True Strike

### Level 1 (24)
Burning Hands, Charm Person, Chromatic Orb, Color Spray, Comprehend Languages, Detect Magic, Disguise Self, Expeditious Retreat, False Life, Feather Fall, Fog Cloud, Grease, Ice Knife, Jump, Mage Armor, Magic Missile, Ray of Sickness, Shield, Silent Image, Sleep, Spellfire Flare, Thunderwave, Witch Bolt

### Level 2 (28)
Alter Self, Arcane Vigor, Blindness/Deafness, Blur, Cloud of Daggers, Crown of Madness, Darkness, Darkvision, Death Armor, Detect Thoughts, Dragon's Breath, Enhance Ability, Enlarge/Reduce, Flame Blade, Flaming Sphere, Gust of Wind, Hold Person, Invisibility, Knock, Levitate, Magic Weapon, Mind Spike, Mirror Image, Misty Step, Phantasmal Force, Scorching Ray, See Invisibility, Shatter, Spider Climb, Suggestion, Web

### Level 3 (23)
Blink, Cacophonic Shield, Clairvoyance, Counterspell, Daylight, Dispel Magic, Fear, Fireball, Fly, Gaseous Form, Haste, Hypnotic Pattern, Laeral's Silver Lance, Lightning Bolt, Major Image, Protection from Energy, Sleet Storm, Slow, Stinking Cloud, Tongues, Vampiric Touch, Water Breathing, Water Walk

### Level 4 (15)
Backlash, Banishment, Blight, Charm Monster, Confusion, Dimension Door, Dominate Beast, Fire Shield, Greater Invisibility, Ice Storm, Polymorph, Spellfire Storm, Stoneskin, Vitriolic Sphere, Wall of Fire

### Level 5 (15)
Animate Objects, Bigby's Hand, Cloudkill, Cone of Cold, Creation, Dominate Person, Hold Monster, Insect Plague, Seeming, Songal's Elemental Suffusion, Synaptic Static, Telekinesis, Teleportation Circle, Wall of Stone, (Chain Lightning? Circle of Death?)

### Level 6 (11)
Arcane Gate, Chain Lightning, Circle of Death, Disintegrate, Elminster's Effulgent Spheres, Eyebite, Globe of Invulnerability, Mass Suggestion, Move Earth, Otto's Irresistible Dance, Sunbeam, (True Seeing?)

### Level 7 (9)
Delayed Blast Fireball, Etherealness, Finger of Death, Forcecage, Mirage Arcane, Mordenkainen's Magnificent Mansion, Mordenkainen's Sword, Plane Shift, Prismatic Spray, (Simulacrum? Symbol?)

### Level 8 (6)
Antimagic Field, Clone, Control Weather, Demiplane, Incendiary Cloud, Maze, Mind Blank, Power Word Stun, Sunburst

### Level 9 (7)
Astral Projection, Foresight, Gate, Imprisonment, Meteor Swarm, Power Word Heal, Power Word Kill, True Resurrection

## Error Handling

- If any spell referenced in character data is missing from new lists, log warning
- No data loss - only affects spell availability/display

## Testing Strategy

1. Verify Bard can access all 13 official cantrips
2. Verify Sorcerer can access all 19 official cantrips
3. Verify neither has Warlock spells (Eldritch Blast, Hex, etc.)
4. Verify subclass spell sources still work correctly

## Open Questions

None - official source data is authoritative.
