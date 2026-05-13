
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const wizard = {
  details: { 
    name: 'Wizard', 
    description: 'Wizards are defined by their exhaustive study of magic\'s inner workings. They cast spells of explosive fire, arcing lightning, subtle deception, and spectacular transformations.', 
    traits: [
        { name: 'Spellcasting', description: 'Intelligence-based arcane magic. You use a spellbook and are a prepared spellcaster.' }, 
        { name: 'Ritual Adept', description: 'You can cast any spell as a Ritual if it has the Ritual tag and is in your spellbook. You don\'t need to have it prepared.' }, 
        { name: 'Arcane Recovery', description: 'You can recover part of your magical energy by studying your spellbook during a Short Rest. (1/Long Rest).' }
    ] 
  } as DetailData,
  hitDie: 6,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['INT', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting (6 spells in spellbook)', 'Ritual Adept', 'Arcane Recovery'], 
    2: ['Scholar'], 
    3: ['Wizard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Memorize Spell', 'Learn 2 new spells'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    18: ['Spell Mastery'], 
    19: ['Epic Boon Feat'], 
    20: ['Signature Spells'] 
  } as Record<number, string[]>,
  // Wizard Spellbook Progression (2024 D&D 5e)
  spellbookProgression: {
    1: 6,    // Start with 6 spells
    2: 8,    // +2 spells
    3: 10,   // +2 spells
    4: 12,   // +2 spells
    5: 14,   // +2 spells
    6: 16,   // +2 spells
    7: 18,   // +2 spells
    8: 20,   // +2 spells
    9: 22,   // +2 spells
    10: 24,  // +2 spells
    11: 26,  // +2 spells
    12: 28,  // +2 spells
    13: 30,  // +2 spells
    14: 32,  // +2 spells
    15: 34,  // +2 spells
    16: 36,  // +2 spells
    17: 38,  // +2 spells
    18: 40,  // +2 spells
    19: 42,  // +2 spells
    20: 44   // +2 spells
  } as Record<number, number>,
  subclasses: [
      { 
        name: 'Abjurer', 
        description: 'Protectors and defenders, Abjurers master magic that blocks, banishes, and protects. They are unmatched experts at creating magical wards and breaking enemy spellcasting.',
        features: { 
            3: [
                { name: 'Abjuration Savant', description: 'When you add an Abjuration spell to your spellbook, it costs 1 hour and 25 gold per spell level (instead of 2 hours and 50 gold). You automatically gain 2 Abjuration spells of level 1-2. Each time you gain access to a new spell slot level (levels 5, 7, 9, 11, 13, 15, 17), you gain 1 additional Abjuration spell for free.' },
                { name: 'Arcane Ward', description: 'When you cast an Abjuration spell with a spell slot for the first time each day, you create an invisible magical ward. The ward has HP equal to your Wizard level × 2 + your INT modifier. Damage you take is absorbed by the ward first, then by your HP. The ward lasts until your next Long Rest. When you cast another Abjuration spell, the ward regains HP equal to the damage absorbed by your last spell.' }
            ],
            6: [{ name: 'Projected Ward', description: 'As a Reaction when a creature you can see within 30 feet takes damage, you can have your Arcane Ward absorb that damage instead. The ward is destroyed when it reaches 0 HP.' }],
            10: [
                { name: 'Spell Breaker', description: 'You always have Counterspell and Dispel Magic prepared and they don\'t count against your prepared spells. You can cast Dispel Magic as a Bonus Action instead of an action. When you fail a Counterspell or Dispel Magic check, you don\'t expend the spell slot.' }
            ],
            14: [{ name: 'Improved Ward', description: 'Your Arcane Ward gains HP equal to your Wizard level × 2 (cumulative with other bonuses). As a Bonus Action, you can expend a spell slot to restore HP to your ward equal to 2d6 + your INT modifier.' }]
        } 
      },
      { 
        name: 'Diviner', 
        description: 'Seers of fate and manipulators of destiny, Diviners unravel the mysteries of past, present, and future. They see fragments of what might be and make reality bend to match their visions.',
        features: { 
            3: [
                { name: 'Divination Savant', description: 'When you add a Divination spell to your spellbook, it costs 1 hour and 25 gold per spell level (instead of 2 hours and 50 gold). You automatically gain 2 Divination spells of level 1-2. Each time you gain access to a new spell slot level (levels 5, 7, 9, 11, 13, 15, 17), you gain 1 additional Divination spell for free.' },
                { name: 'Portent (Presagio)', description: 'After each Long Rest, roll 2d20 and record the numbers. You can replace any d20 roll made by you or a creature you can see with one of these Portent rolls. You can only use this once per turn. The rolled d20 must be replaced before rolling. Unused Portent rolls are lost after your next Long Rest.' }
            ],
            6: [{ name: 'Third Eye', description: 'As a Bonus Action, you can activate or deactivate your Third Eye until your next Long Rest. While active: You see in darkness up to 120 feet, you can see invisible creatures and objects within 30 feet, and you automatically detect magical auras (as if using Detect Magic). You can cast See Invisibility without expending a spell slot. The effect lasts 10 minutes (or until deactivated).' }],
            10: [{ name: 'Read Thoughts', description: 'When you cast a Divination spell of level 1+, you can read the surface thoughts of one creature within 30 feet that you can see (unless it has Wisdom 16 or higher). You sense its immediate emotions and surface thoughts (but not secrets or true intentions). The creature doesn\'t know you\'re reading its thoughts unless it has magic that detects such magic.' }],
            14: [{ name: 'Greater Portent', description: 'You now roll 3d20 after each Long Rest instead of 2d20, giving you more flexibility with your Portent feature. You can still only use Portent to replace one d20 roll per turn.' }]
        } 
      },
      { 
        name: 'Evoker', 
        description: 'Masters of raw elemental power, Evokers wield fire, frost, lightning, and acid to create devastation. They channel magic into explosive destruction that reshapes the battlefield.',
        features: { 
            3: [
                { name: 'Evocation Savant', description: 'When you add an Evocation spell to your spellbook, it costs 1 hour and 25 gold per spell level (instead of 2 hours and 50 gold). You automatically gain 2 Evocation spells of level 1-2. Each time you gain access to a new spell slot level (levels 5, 7, 9, 11, 13, 15, 17), you gain 1 additional Evocation spell for free.' },
                { name: 'Potent Cantrip', description: 'When a creature succeeds on a saving throw against your cantrip or your ranged spell attack with a cantrip misses, the creature still takes half the cantrip\'s damage (if any). The additional effects of the cantrip don\'t occur.' }
            ],
            6: [{ name: 'Sculpt Spells', description: 'When you cast an Evocation spell that affects multiple creatures in an area, you can choose a number of those creatures equal to 1 + the spell\'s level. Those chosen creatures automatically succeed on their saves and take no damage from the spell (or half damage if they would take half on a successful save). This allows you to protect allies when casting area spells like Fireball.' }],
            10: [{ name: 'Empowered Evocation', description: 'When you cast an Evocation spell of level 1+, add your Intelligence modifier to one damage roll of that spell.' }],
            14: [{ name: 'Overchannel', description: 'When you cast an Evocation spell of level 1-5 that deals damage, you can maximize the damage roll. The first time you use this each Long Rest, no penalty occurs. Each subsequent use before finishing a Long Rest deals you 2d12 Necrotic damage (ignoring resistances) for each level of the spell above 1st (stacking with each use: 3d12 the second time, 4d12 the third time, etc).' }]
        } 
      },
      { 
        name: 'Illusionist', 
        description: 'Weavers of light and shadow, Illusionists redefine reality through deception. They twist perception to confuse enemies and create impossible scenarios from thin air.',
        features: { 
            3: [
                { name: 'Illusion Savant', description: 'When you add an Illusion spell to your spellbook, it costs 1 hour and 25 gold per spell level (instead of 2 hours and 50 gold). You automatically gain 2 Illusion spells of level 1-2. Each time you gain access to a new spell slot level (levels 5, 7, 9, 11, 13, 15, 17), you gain 1 additional Illusion spell for free.' },
                { name: 'Improved Illusion', description: 'You can cast Minor Illusion as a Bonus Action instead of an action. When you cast an Illusion spell, you ignore verbal and somatic components. The range of Illusion spells increases by 30 feet (to 120 feet instead of the normal range).' }
            ],
            6: [{ name: 'Phantasmal Creatures', description: 'You always have Summon Beast and Summon Fey prepared (as Illusion spells). When you cast these spells using the Illusion version, the summoned creature appears as a magical illusion. You can cast each one once per Long Rest without expending a spell slot, though they appear translucent and may interact differently with the environment.' }],
            10: [{ name: 'Illusory Self', description: 'When a creature that you can see attacks you, you can use your Reaction to create an illusory duplicate of yourself in the attacker\'s line of sight. The attack targets the illusion instead and misses. You have 3 uses of this feature, regaining all uses at the end of a Short or Long Rest.' }],
            14: [{ name: 'Illusory Reinforcement', description: 'When you use Illusory Self, you can expend a spell slot of level 2+ (Bonus Action, no action required) to regain all expended uses. Your illusions become more convincing: creatures have Disadvantage on checks to determine they are false. The more detailed your illusions, the harder they are to see through.' }]
        } 
      },
      { 
        name: 'Bladesinger', 
        description: 'Bladesingers master a tradition of wizardry that incorporates swordplay and dance. They use intricate, elegant maneuvers that fend off harm and allow them to channel magic into devastating attacks.',
        features: { 
            3: [
                { name: 'Bladesong', description: 'As a Bonus Action (if not wearing armor or using a shield), you invoke the Bladesong for 1 minute. You gain: Agility (AC + INT mod, Speed +10 ft, Advantage on Acrobatics); Bladework (use INT for weapon attack/damage); Focus (add INT to Constitution saves for Concentration). Uses = INT mod per Long Rest.' },
                { name: 'Training in War and Song', description: 'Gain proficiency with all Melee Martial weapons (except Two-Handed or Heavy). You can use a Melee weapon as a Spellcasting Focus. Also gain proficiency in one skill: Acrobatics, Athletics, Performance, or Persuasion.' }
            ],
            6: [{ name: 'Extra Attack', description: 'You can attack twice (instead of once) when you take the Attack action on your turn. You can also cast a Wizard cantrip in place of one of these attacks.' }],
            10: [{ name: 'Song of Defense', description: 'When you take damage while your Bladesong is active, you can take a Reaction to expend a spell slot and reduce the damage by 5 times the spell slot\'s level.' }],
            14: [{ name: 'Song of Victory', description: 'After you cast a spell with an action, you can make one weapon attack as a Bonus Action.' }]
        } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { INT: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, STR: 8 }
};