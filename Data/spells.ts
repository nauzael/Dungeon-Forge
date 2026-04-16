
import { Ability, SpellDetail } from '../types';
import { CANTRIPS } from './spells/cantrips';
import { LEVEL1 } from './spells/level1';
import { LEVEL2 } from './spells/level2';
import { LEVEL3 } from './spells/level3';
import { LEVEL4 } from './spells/level4';
import { LEVEL5 } from './spells/level5';
import { LEVEL6 } from './spells/level6';
import { LEVEL7 } from './spells/level7';
import { LEVEL8 } from './spells/level8';
import { LEVEL9 } from './spells/level9';

// Warlock spell list (official 2024)
export const WARLOCK_SPELLS = [
  // Cantrips (level 0)
  'Blade Ward', 'Chill Touch', 'Eldritch Blast', 'Friends', 'Mage Hand', 'Mind Sliver', 'Minor Illusion', 'Poison Spray', 'Prestidigitation', 'Thunderclap', 'Toll the Dead', 'True Strike',
  // 1st level
  'Armor of Agathys', 'Arms of Hadar', 'Bane', 'Charm Person', 'Comprehend Languages', 'Detect Magic', 'Expeditious Retreat', 'Hellish Rebuke', 'Hex', 'Illusory Script', 'Protection from Evil and Good', 'Speak with Animals', 'Tasha\'s Hideous Laughter', 'Unseen Servant', 'Witch Bolt',
  // 2nd level
  'Cloud of Daggers', 'Crown of Madness', 'Darkness', 'Enthrall', 'Hold Person', 'Invisibility', 'Mind Spike', 'Mirror Image', 'Misty Step', 'Ray of Enfeeblement', 'Spider Climb', 'Suggestion',
  // 3rd level
  'Counterspell', 'Dispel Magic', 'Fear', 'Fly', 'Gaseous Form', 'Hunger of Hadar', 'Hypnotic Pattern', 'Magic Circle', 'Major Image', 'Remove Curse', 'Summon Fey', 'Summon Undead', 'Tongues', 'Vampiric Touch',
  // 4th level
  'Backlash', 'Banishment', 'Blight', 'Charm Monster', 'Dimension Door', 'Doomtide', 'Hallucinatory Terrain', 'Summon Aberration',
  // 5th level
  'Contact Other Plane', 'Dream', 'Hold Monster', 'Jallarzi\'s Storm of Radiance', 'Mislead', 'Planar Binding', 'Scrying', 'Synaptic Static', 'Teleportation Circle',
  // 6th level
  'Arcane Gate', 'Circle of Death', 'Create Undead', 'Eyebite', 'Summon Fiend', 'Tasha\'s Bubbling Cauldron', 'True Seeing',
  // 7th level
  'Etherealness', 'Finger of Death', 'Forcecage', 'Plane Shift',
  // 8th level
  'Befuddlement', 'Demiplane', 'Dominate Monster', 'Glibness', 'Power Word Stun',
  // 9th level
  'Astral Projection', 'Blade of Disaster', 'Foresight', 'Gate', 'Imprisonment', 'Power Word Kill', 'True Polymorph', 'Weird',
];

// Bard spell list (official 2024 from dnd2024.wikidot.com)
export const BARD_SPELLS = [
  // Cantrips (13)
  'Blade Ward', 'Dancing Lights', 'Friends', 'Light', 'Mage Hand', 'Mending', 'Message', 'Minor Illusion', 'Prestidigitation', 'Starry Wisp', 'Thunderclap', 'True Strike', 'Vicious Mockery',
  // Level 1 (24)
  'Animal Friendship', 'Bane', 'Charm Person', 'Color Spray', 'Command', 'Comprehend Languages', 'Cure Wounds', 'Detect Magic', 'Disguise Self', 'Dissonant Whispers', 'Faerie Fire', 'Feather Fall', 'Healing Word', 'Heroism', 'Identify', 'Illusory Script', 'Longstrider', 'Silent Image', 'Sleep', 'Speak with Animals', 'Tasha\'s Hideous Laughter', 'Thunderwave', 'Unseen Servant', 'Wardaway',
  // Level 2 (25)
  'Aid', 'Animal Messenger', 'Blindness/Deafness', 'Calm Emotions', 'Cloud of Daggers', 'Crown of Madness', 'Detect Thoughts', 'Enhance Ability', 'Enlarge/Reduce', 'Enthrall', 'Heat Metal', 'Hold Person', 'Invisibility', 'Knock', 'Lesser Restoration', 'Locate Animals or Plants', 'Locate Object', 'Magic Mouth', 'Mirror Image', 'Phantasmal Force', 'See Invisibility', 'Shatter', 'Silence', 'Suggestion', 'Zone of Truth',
  // Level 3 (19)
  'Bestow Curse', 'Cacophonic Shield', 'Clairvoyance', 'Dispel Magic', 'Fear', 'Feign Death', 'Glyph of Warding', 'Hypnotic Pattern', 'Leomund\'s Tiny Hut', 'Major Image', 'Mass Healing Word', 'Nondetection', 'Plant Growth', 'Sending', 'Slow', 'Speak with Dead', 'Speak with Plants', 'Stinking Cloud', 'Tongues',
  // Level 4 (14)
  'Backlash', 'Charm Monster', 'Compulsion', 'Confusion', 'Dimension Door', 'Doomtide', 'Fount of Moonlight', 'Freedom of Movement', 'Greater Invisibility', 'Hallucinatory Terrain', 'Locate Creature', 'Phantasmal Killer', 'Polymorph',
  // Level 5 (20)
  'Alustriel\'s Mooncloak', 'Animate Objects', 'Awaken', 'Dominate Person', 'Dream', 'Geas', 'Greater Restoration', 'Hold Monster', 'Legend Lore', 'Mass Cure Wounds', 'Mislead', 'Modify Memory', 'Planar Binding', 'Raise Dead', 'Rary\'s Telepathic Bond', 'Scrying', 'Seeming', 'Synaptic Static', 'Teleportation Circle', 'Yolande\'s Regal Presence',
  // Level 6 (9)
  'Dirge', 'Eyebite', 'Find the Path', 'Guards and Wards', 'Heroes\' Feast', 'Mass Suggestion', 'Otto\'s Irresistible Dance', 'Programmed Illusion', 'True Seeing',
  // Level 7 (7)
  'Etherealness', 'Forcecage', 'Mirage Arcane', 'Mordenkainen\'s Magnificent Mansion', 'Mordenkainen\'s Sword', 'Power Word Fortify', 'Prismatic Spray',
  // Level 8 (8)
  'Antimagic Field', 'Befuddlement', 'Clone', 'Control Weather', 'Demiplane', 'Dominate Monster', 'Glibness', 'Incendiary Cloud', 'Maze', 'Mind Blank', 'Power Word Stun', 'Sunburst',
  // Level 9 (8)
  'Astral Projection', 'Foresight', 'Gate', 'Imprisonment', 'Meteor Swarm', 'Power Word Heal', 'Power Word Kill', 'True Resurrection',
];

// Sorcerer spell list (official 2024 from dnd2024.wikidot.com)
export const SORCERER_SPELLS = [
  // Cantrips (19)
  'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Elementalism', 'Fire Bolt', 'Friends', 'Light', 'Mage Hand', 'Mending', 'Message', 'Mind Sliver', 'Minor Illusion', 'Poison Spray', 'Prestidigitation', 'Ray of Frost', 'Shocking Grasp', 'Sorcerous Burst', 'Thunderclap', 'True Strike',
  // Level 1 (23)
  'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray', 'Comprehend Languages', 'Detect Magic', 'Disguise Self', 'Expeditious Retreat', 'False Life', 'Feather Fall', 'Fog Cloud', 'Grease', 'Ice Knife', 'Jump', 'Mage Armor', 'Magic Missile', 'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep', 'Spellfire Flare', 'Thunderwave', 'Witch Bolt',
  // Level 2 (30)
  'Alter Self', 'Arcane Vigor', 'Blindness/Deafness', 'Blur', 'Cloud of Daggers', 'Crown of Madness', 'Darkness', 'Darkvision', 'Death Armor', 'Detect Thoughts', 'Dragon\'s Breath', 'Enhance Ability', 'Enlarge/Reduce', 'Flame Blade', 'Flaming Sphere', 'Gust of Wind', 'Hold Person', 'Invisibility', 'Knock', 'Levitate', 'Magic Weapon', 'Mind Spike', 'Mirror Image', 'Misty Step', 'Phantasmal Force', 'Scorching Ray', 'See Invisibility', 'Shatter', 'Spider Climb', 'Suggestion', 'Web',
  // Level 3 (23)
  'Blink', 'Cacophonic Shield', 'Clairvoyance', 'Counterspell', 'Daylight', 'Dispel Magic', 'Fear', 'Fireball', 'Fly', 'Gaseous Form', 'Haste', 'Hypnotic Pattern', 'Laeral\'s Silver Lance', 'Lightning Bolt', 'Major Image', 'Protection from Energy', 'Sleet Storm', 'Slow', 'Stinking Cloud', 'Tongues', 'Vampiric Touch', 'Water Breathing', 'Water Walk',
  // Level 4 (15)
  'Backlash', 'Banishment', 'Blight', 'Charm Monster', 'Confusion', 'Dimension Door', 'Dominate Beast', 'Fire Shield', 'Greater Invisibility', 'Ice Storm', 'Polymorph', 'Spellfire Storm', 'Stoneskin', 'Vitriolic Sphere', 'Wall of Fire',
  // Level 5 (14)
  'Animate Objects', 'Bigby\'s Hand', 'Cloudkill', 'Cone of Cold', 'Creation', 'Dominate Person', 'Hold Monster', 'Insect Plague', 'Seeming', 'Songal\'s Elemental Suffusion', 'Synaptic Static', 'Telekinesis', 'Teleportation Circle', 'Wall of Stone',
  // Level 6 (11)
  'Arcane Gate', 'Chain Lightning', 'Circle of Death', 'Disintegrate', 'Elminster\'s Effulgent Spheres', 'Eyebite', 'Globe of Invulnerability', 'Mass Suggestion', 'Move Earth', 'Otto\'s Irresistible Dance', 'Sunbeam',
  // Level 7 (10)
  'Delayed Blast Fireball', 'Etherealness', 'Finger of Death', 'Forcecage', 'Mirage Arcane', 'Mordenkainen\'s Magnificent Mansion', 'Mordenkainen\'s Sword', 'Plane Shift', 'Prismatic Spray', 'Simulacrum',
  // Level 8 (8)
  'Antimagic Field', 'Clone', 'Control Weather', 'Demiplane', 'Incendiary Cloud', 'Maze', 'Mind Blank', 'Power Word Stun',
  // Level 9 (8)
  'Astral Projection', 'Foresight', 'Gate', 'Imprisonment', 'Meteor Swarm', 'Power Word Heal', 'Power Word Kill', 'True Resurrection',
];

// Wizard spell list (official 2024)
export const ARCANE_SPELLS = [
  'Acid Splash', 'Blade Ward', 'Chill Touch', 'Dancing Lights', 'Eldritch Blast', 'Elementalism', 'Fire Bolt', 'Friends', 'Light', 'Mage Hand', 'Mending', 'Message', 'Mind Sliver', 'Minor Illusion', 'Poison Spray', 'Prestidigitation', 'Ray of Frost', 'Shocking Grasp', 'Sorcerous Burst', 'Thunderclap', 'Toll the Dead', 'True Strike', 'Vicious Mockery',
  'Alarm', 'Animal Friendship', 'Armor of Agathys', 'Arms of Hadar', 'Bane', 'Burning Hands', 'Charm Person', 'Chromatic Orb', 'Color Spray', 'Command', 'Comprehend Languages', 'Cure Wounds', 'Detect Magic', 'Disguise Self', 'Dissonant Whispers', 'Expeditious Retreat', 'Faerie Fire', 'False Life', 'Feather Fall', 'Find Familiar', 'Fog Cloud', 'Grease', 'Healing Word', 'Hellish Rebuke', 'Heroism', 'Hex', 'Ice Knife', 'Identify', 'Illusory Script', 'Jump', 'Longstrider', 'Mage Armor', 'Magic Missile', 'Protection from Evil and Good', 'Ray of Sickness', 'Shield', 'Silent Image', 'Sleep', 'Speak with Animals', 'Tasha\'s Hideous Laughter', 'Tenser\'s Floating Disk', 'Thunderwave', 'Unseen Servant', 'Witch Bolt',
  'Aid', 'Alter Self', 'Animal Messenger', 'Arcane Lock', 'Arcane Vigor', 'Augury', 'Blindness/Deafness', 'Blur', 'Calm Emotions', 'Cloud of Daggers', 'Continual Flame', 'Crown of Madness', 'Darkness', 'Darkvision', 'Detect Thoughts', 'Dragon\'s Breath', 'Enhance Ability', 'Enlarge/Reduce', 'Enthrall', 'Flaming Sphere', 'Gentle Repose', 'Gust of Wind', 'Heat Metal', 'Hold Person', 'Invisibility', 'Knock', 'Levitate', 'Locate Object', 'Magic Mouth', 'Magic Weapon', 'Melf\'s Acid Arrow', 'Mind Spike', 'Mirror Image', 'Misty Step', 'Moonbeam', 'Nystul\'s Magic Aura', 'Phantasmal Force', 'Ray of Enfeeblement', 'Rope Trick', 'Scorching Ray', 'See Invisibility', 'Shatter', 'Silence', 'Spider Climb', 'Suggestion', 'Web', 'Zone of Truth',
  'Animate Dead', 'Bestow Curse', 'Blink', 'Clairvoyance', 'Counterspell', 'Dispel Magic', 'Elemental Weapon', 'Fear', 'Feign Death', 'Fireball', 'Fly', 'Gaseous Form', 'Glyph of Warding', 'Haste', 'Hunger of Hadar', 'Hypnotic Pattern', 'Leomund\'s Tiny Hut', 'Lightning Bolt', 'Magic Circle', 'Major Image', 'Mass Healing Word', 'Nondetection', 'Phantom Steed', 'Protection from Energy', 'Remove Curse', 'Sending', 'Sleet Storm', 'Slow', 'Speak with Dead', 'Stinking Cloud', 'Summon Fey', 'Summon Undead', 'Tongues', 'Vampiric Touch', 'Water Breathing',
  'Arcane Eye', 'Banishment', 'Blight', 'Charm Monster', 'Compulsion', 'Confusion', 'Control Water', 'Dimension Door', 'Dominate Beast', 'Evard\'s Black Tentacles', 'Fabricate', 'Fire Shield', 'Fount of Moonlight', 'Greater Invisibility', 'Hallucinatory Terrain', 'Ice Storm', 'Jallarzi\'s Storm of Radiance', 'Legend Lore', 'Leomund\'s Secret Chest', 'Locate Creature', 'Mordenkainen\'s Faithful Hound', 'Mordenkainen\'s Private Sanctum', 'Otiluke\'s Resilient Sphere', 'Phantasmal Killer', 'Polymorph', 'Stoneskin', 'Summon Aberration', 'Summon Construct', 'Summon Elemental', 'Synaptic Static', 'Telekinesis', 'Teleportation Circle', 'Vitriolic Sphere', 'Wall of Fire', 'Wall of Force', 'Wall of Stone', 'Yolande\'s Regal Presence',
  'Animate Objects', 'Bigby\'s Hand', 'Circle of Power', 'Cloudkill', 'Cone of Cold', 'Conjure Elemental', 'Contact Other Plane', 'Creation', 'Dominate Person', 'Dream', 'Geas', 'Hold Monster', 'Legend Lore', 'Mass Cure Wounds', 'Mislead', 'Modify Memory', 'Passwall', 'Planar Binding', 'Rary\'s Telepathic Bond', 'Scrying', 'Seeming', 'Steel Wind Strike', 'Summon Fiend', 'Sunbeam', 'Synaptic Static', 'Telekinesis', 'Teleportation Circle', 'Wall of Force', 'Wall of Stone',
  'Arcane Gate', 'Chain Lightning', 'Circle of Death', 'Contingency', 'Create Undead', 'Disintegrate', 'Drawmij\'s Instant Summons', 'Eyebite', 'Flesh to Stone', 'Globe of Invulnerability', 'Guards and Wards', 'Heroes\' Feast', 'Magic Jar', 'Mass Suggestion', 'Move Earth', 'Otiluke\'s Freezing Sphere', 'Otto\'s Irresistible Dance', 'Programmed Illusion', 'Sunbeam', 'Tasha\'s Bubbling Cauldron', 'True Seeing', 'Wall of Ice',
  'Delayed Blast Fireball', 'Etherealness', 'Finger of Death', 'Forcecage', 'Mirage Arcane', 'Mordenkainen\'s Magnificent Mansion', 'Mordenkainen\'s Sword', 'Plane Shift', 'Power Word Fortify', 'Prismatic Spray', 'Project Image', 'Reverse Gravity', 'Sequester', 'Simulacrum', 'Symbol', 'Teleport',
  'Antimagic Field', 'Antipathy/Sympathy', 'Befuddlement', 'Clone', 'Control Weather', 'Demiplane', 'Dominate Monster', 'Glibness', 'Incendiary Cloud', 'Maze', 'Mind Blank', 'Power Word Stun', 'Sunburst', 'Telepathy',
  'Astral Projection', 'Foresight', 'Gate', 'Imprisonment', 'Meteor Swarm', 'Power Word Heal', 'Power Word Kill', 'Prismatic Wall', 'Shapechange', 'Time Stop', 'True Polymorph', 'Weird', 'Wish'
];

export const DIVINE_SPELLS = [
  'Guidance', 'Light', 'Resistance', 'Sacred Flame', 'Spare the dying', 'Thaumaturgy', 'Toll the Dead', 'Word of Radiance',
  'Bane', 'Bless', 'Command', 'Compelled Duel', 'Cure Wounds', 'Detect Evil and Good', 'Detect Magic', 'Detect Poison and Disease', 'Divine Favor', 'Divine Smite', 'Guiding Bolt', 'Healing Word', 'Heroism', 'Inflict Wounds', 'Protection from Evil and Good', 'Purify Food and Drink', 'Sanctuary', 'Searing Smite', 'Shield of Faith', 'Thunderous Smite', 'Wrathful Smite',
  'Aid', 'Augury', 'Blindness/Deafness', 'Calm Emotions', 'Continual Flame', 'Enhance Ability', 'Find Steed', 'Find Traps', 'Gentle Repose', 'Hold Person', 'Lesser Restoration', 'Locate Object', 'Magic Weapon', 'Prayer of Healing', 'Protection from Poison', 'Shining Smite', 'Silence', 'Spiritual Weapon', 'Warding Bond', 'Zone of Truth',
  'Animate Dead', 'Aura of Vitality', 'Beacon of Hope', 'Bestow Curse', 'Blinding Smite', 'Clairvoyance', 'Create Food and Water', 'Crusader\'s Mantle', 'Daylight', 'Dispel Magic', 'Feign Death', 'Glyph of Warding', 'Magic Circle', 'Mass Healing Word', 'Meld into Stone', 'Planar Ally', 'Protection from Energy', 'Remove Curse', 'Revivify', 'Sending', 'Speak with Dead', 'Spirit Guardians', 'Tongues', 'Water Walk',
  'Aura of Life', 'Aura of Purity', 'Banishment', 'Control Water', 'Death Ward', 'Divination', 'Freedom of Movement', 'Guardian of Faith', 'Locate Creature', 'Staggering Smite', 'Stone Shape',
  'Circle of Power', 'Commune', 'Contagion', 'Destructive Wave', 'Dispel Evil and Good', 'Flame Strike', 'Geas', 'Greater Restoration', 'Hallow', 'Insect Plague', 'Legend Lore', 'Mass Cure Wounds', 'Planar Binding', 'Raise Dead', 'Scrying', 'Summon Celestial', 'Sunbeam',
  'Blade Barrier', 'Create Undead', 'Forbiddance', 'Harm', 'Heal', 'Heroes\' Feast', 'Planar Ally', 'Sunbeam', 'True Seeing', 'Word of Recall',
  'Conjure Celestial', 'Divine Word', 'Etherealness', 'Fire Storm', 'Plane Shift', 'Power Word Fortify', 'Regenerate', 'Resurrection', 'Symbol',
  'Antimagic Field', 'Control Weather', 'Earthquake', 'Holy Aura', 'Sunburst',
  'Astral Projection', 'Gate', 'Mass Heal', 'Power Word Heal', 'True Resurrection'
];

export const PRIMAL_SPELLS = [
  'Druidcraft', 'Elementalism', 'Guidance', 'Poison Spray', 'Produce Flame', 'Resistance', 'Shillelagh', 'Starry Wisp', 'Thorn Whip', 'Thunderclap',
  'Animal Friendship', 'Charm Person', 'Create or Destroy Water', 'Cure Wounds', 'Detect Magic', 'Detect Poison and Disease', 'Disguise Self', 'Entangle', 'Faerie Fire', 'Fog Cloud', 'Goodberry', 'Healing Word', 'Ice Knife', 'Jump', 'Longstrider', 'Protection from Evil and Good', 'Purify Food and Drink', 'Speak with Animals', 'Thunderwave',
  'Aid', 'Animal Messenger', 'Barkskin', 'Beast Sense', 'Darkvision', 'Enhance Ability', 'Enlarge/Reduce', 'Find Traps', 'Flame Blade', 'Flaming Sphere', 'Gust of Wind', 'Heat Metal', 'Hold Person', 'Lesser Restoration', 'Locate Animals or Plants', 'Locate Object', 'Misty Step', 'Moonbeam', 'Pass without Trace', 'Protection from Poison', 'Rope Trick', 'Spike Growth', 'Summon Beast',
  'Aura of Vitality', 'Call Lightning', 'Conjure Animals', 'Conjure Barrage', 'Daylight', 'Dispel Magic', 'Elemental Weapon', 'Fear', 'Feign Death', 'Lightning Arrow', 'Meld into Stone', 'Plant Growth', 'Protection from Energy', 'Revivify', 'Sleet Storm', 'Speak with Plants', 'Summon Fey', 'Water Breathing', 'Water Walk', 'Wind Wall',
  'Blight', 'Charm Monster', 'Confusion', 'Conjure Minor Elementals', 'Conjure Woodland Beings', 'Control Water', 'Dimension Door', 'Dominate Beast', 'Fire Shield', 'Fount of Moonlight', 'Freedom of Movement', 'Giant Insect', 'Grasping Vine', 'Greater Invisibility', 'Hallucinatory Terrain', 'Ice Storm', 'Locate Creature', 'Polymorph', 'Stone Shape', 'Stoneskin', 'Summon Elemental', 'Wall of Fire',
  'Antilife Shell', 'Awaken', 'Commune with Nature', 'Cone of Cold', 'Conjure Elemental', 'Contagion', 'Geas', 'Greater Restoration', 'Insect Plague', 'Mass Cure Wounds', 'Mislead', 'Planar Binding', 'Reincarnate', 'Scrying', 'Seeming', 'Swift Quiver', 'Tree Stride', 'Wall of Stone',
  'Conjure Fey', 'Find the Path', 'Flesh to Stone', 'Heal', 'Heroes\' Feast', 'Move Earth', 'Sunbeam', 'Transport via Plants', 'Wall of Thorns', 'Wind Walk',
  'Fire Storm', 'Mirage Arcane', 'Plane Shift', 'Regenerate', 'Reverse Gravity', 'Symbol',
  'Animal Shapes', 'Antipathy/Sympathy', 'Befuddlement', 'Control Weather', 'Earthquake', 'Incendiary Cloud', 'Sunburst', 'Tsunami',
  'Foresight', 'Shapechange', 'Storm of Vengeance', 'True Resurrection'
];

export const SPELL_LIST_BY_CLASS: Record<string, string[]> = {
    'Bard': BARD_SPELLS,
    'Cleric': DIVINE_SPELLS,
    'Druid': PRIMAL_SPELLS,
    'Paladin': DIVINE_SPELLS,
    'Ranger': PRIMAL_SPELLS,
    'Sorcerer': SORCERER_SPELLS,
    'Warlock': WARLOCK_SPELLS,
    'Wizard': ARCANE_SPELLS,
};

export const SPELLCASTING_ABILITY: Record<string, Ability> = {
    'Bard': 'CHA',
    'Cleric': 'WIS',
    'Druid': 'WIS',
    'Paladin': 'CHA',
    'Ranger': 'WIS',
    'Sorcerer': 'CHA',
    'Warlock': 'CHA',
    'Wizard': 'INT',
};

export const CASTER_TYPE: Record<string, 'full' | 'half' | 'pact' | 'none'> = {
    'Barbarian': 'none', 'Bard': 'full', 'Cleric': 'full', 'Druid': 'full',
    'Fighter': 'none', 'Monk': 'none', 'Paladin': 'half', 'Ranger': 'half',
    'Rogue': 'none', 'Sorcerer': 'full', 'Warlock': 'pact', 'Wizard': 'full',
};

export const MAX_SPELL_LEVEL: Record<'full' | 'half' | 'pact', Record<number, number>> = {
    'full': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 6, 12: 6, 13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 9, 20: 9, },
    'half': { 1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5, },
    'pact': { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5, }
};

export const CANTRIPS_KNOWN_BY_LEVEL: Record<string, Record<number, number>> = {
    'Bard': { 1: 2, 4: 3, 10: 4},
    'Cleric': { 1: 3, 4: 4, 10: 5},
    'Druid': { 1: 2, 4: 3, 10: 4},
    'Sorcerer': { 1: 4, 4: 5, 10: 6},
    'Warlock': { 1: 2, 4: 3, 10: 4},
    'Paladin': { 1: 0, 4: 0, 10: 0},
    'Ranger': { 1: 0, 4: 0, 10: 0},
    'Wizard': { 1: 3, 4: 4, 10: 5},
    'Eldritch Knight': { 3: 2, 10: 3},
    'Arcane Trickster': { 3: 2, 10: 3},
};

export const SPELLS_KNOWN_BY_LEVEL: Record<string, Record<number, number>> = {
    'Bard': { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    'Druid': { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    'Paladin': { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 8, 10: 8, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15 },
    'Ranger': { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 6, 7: 7, 8: 7, 9: 8, 10: 8, 11: 10, 12: 10, 13: 11, 14: 11, 15: 12, 16: 12, 17: 14, 18: 14, 19: 15, 20: 15 },
    'Sorcerer': { 1: 2, 2: 4, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    'Warlock': { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10, 11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15 },
    'Eldritch Knight': { 3: 3, 4: 4, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8, 12: 8, 13: 9, 14: 10, 15: 10, 16: 11, 17: 11, 18: 11, 19: 12, 20: 13 },
    'Arcane Trickster': { 3: 3, 4: 4, 5: 4, 6: 4, 7: 5, 8: 6, 9: 6, 10: 7, 11: 8, 12: 8, 13: 9, 14: 10, 15: 10, 16: 11, 17: 11, 18: 11, 19: 12, 20: 13 },
};

export const PREPARED_CASTERS = ['Cleric', 'Druid', 'Paladin', 'Wizard', 'Bard', 'Ranger'];

export const THIRD_CASTER_SLOTS: Record<string, Record<number, { prepared: number; 1?: number; 2?: number; 3?: number; 4?: number }>> = {
    'Eldritch Knight': {
        3: { prepared: 3, 1: 2 },
        4: { prepared: 4, 1: 3 },
        5: { prepared: 4, 1: 3 },
        6: { prepared: 4, 1: 3 },
        7: { prepared: 5, 1: 4, 2: 2 },
        8: { prepared: 6, 1: 4, 2: 2 },
        9: { prepared: 6, 1: 4, 2: 2 },
        10: { prepared: 7, 1: 4, 2: 3 },
        11: { prepared: 8, 1: 4, 2: 3 },
        12: { prepared: 8, 1: 4, 2: 3 },
        13: { prepared: 9, 1: 4, 2: 3, 3: 2 },
        14: { prepared: 10, 1: 4, 2: 3, 3: 2 },
        15: { prepared: 10, 1: 4, 2: 3, 3: 2 },
        16: { prepared: 11, 1: 4, 2: 3, 3: 3 },
        17: { prepared: 11, 1: 4, 2: 3, 3: 3 },
        18: { prepared: 11, 1: 4, 2: 3, 3: 3 },
        19: { prepared: 12, 1: 4, 2: 3, 3: 3 },
        20: { prepared: 13, 1: 4, 2: 3, 3: 3, 4: 1 },
    },
    'Arcane Trickster': {
        3: { prepared: 3, 1: 2 },
        4: { prepared: 4, 1: 3 },
        5: { prepared: 4, 1: 3 },
        6: { prepared: 4, 1: 3 },
        7: { prepared: 5, 1: 4, 2: 2 },
        8: { prepared: 6, 1: 4, 2: 2 },
        9: { prepared: 6, 1: 4, 2: 2 },
        10: { prepared: 7, 1: 4, 2: 3 },
        11: { prepared: 8, 1: 4, 2: 3 },
        12: { prepared: 8, 1: 4, 2: 3 },
        13: { prepared: 9, 1: 4, 2: 3, 3: 2 },
        14: { prepared: 10, 1: 4, 2: 3, 3: 2 },
        15: { prepared: 10, 1: 4, 2: 3, 3: 2 },
        16: { prepared: 11, 1: 4, 2: 3, 3: 3 },
        17: { prepared: 11, 1: 4, 2: 3, 3: 3 },
        18: { prepared: 11, 1: 4, 2: 3, 3: 3 },
        19: { prepared: 12, 1: 4, 2: 3, 3: 3 },
        20: { prepared: 13, 1: 4, 2: 3, 3: 3, 4: 1 },
    },
};

export const SPELL_DETAILS: Record<string, SpellDetail> = {
  ...CANTRIPS,
  ...LEVEL1,
  ...LEVEL2,
  ...LEVEL3,
  ...LEVEL4,
  ...LEVEL5,
  ...LEVEL6,
  ...LEVEL7,
  ...LEVEL8,
  ...LEVEL9
};
