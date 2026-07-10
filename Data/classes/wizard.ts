
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const wizard = {
  details: { 
    name: 'Wizard', 
    description: 'Wizards are defined by their exhaustive study of magic\'s inner workings. They cast spells of explosive fire, arcing lightning, subtle deception, and spectacular transformations.', 
    traits: [
        { name: 'Spellcasting', description: 'You are a student of arcane magic. You have a spellbook with 6 level 1 spells. You know 3 cantrips (more at levels 4 and 10). You prepare spells from your book. Intelligence is your spellcasting ability. You use an Arcane Focus or your spellbook as a focus.' }, 
        { name: 'Ritual Adept', description: 'You can cast any spell as a Ritual if it has the Ritual tag and is in your book, without having it prepared.' }, 
        { name: 'Arcane Recovery', description: 'When you finish a Short Rest, you regain spell slots whose total level doesn\'t exceed half your level (rounded up). None of level 6+. Once per Long Rest.' }
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
     5: ['Memorize Spell'],
     6: ['Subclass Feature'],
     7: ['—'],
     8: ['Ability Score Improvement'],
     9: ['—'],
     10: ['Subclass Feature'],
     11: ['—'],
     12: ['Ability Score Improvement'],
     13: ['—'],
     14: ['Subclass Feature'],
     15: ['—'],
     16: ['Ability Score Improvement'],
     17: ['—'],
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
                 { name: 'Abjuration Savant', description: 'When adding an Abjuration spell to your book, it costs 1 hour and 25 GP per level. You gain 2 free Abjuration spells of level 1-2. Each time you access a new spell slot level (levels 5/7/9/11/13/15/17), you gain 1 free Abjuration spell.' },
                 { name: 'Arcane Ward', description: 'When you cast an Abjuration spell with a slot for the first time each day, you create an invisible ward. HP = level × 2 + Int. Damage is absorbed by the ward first. When you cast another Abjuration spell, the ward regains HP.' }
            ],
            6: [{ name: 'Projected Ward', description: 'Reaction when a creature within 30 feet takes damage: your Arcane Ward absorbs that damage instead.' }],
            10: [
                 { name: 'Spell Breaker', description: 'You always have Counterspell and Dispel Magic prepared, they don\'t count toward your limit. You cast Dispel Magic as a Bonus Action. When Counterspell/Dispel Magic fails, you don\'t expend the slot.' }
            ],
            14: [{ name: 'Improved Ward', description: 'Your Arcane Ward gains additional HP = level × 2. Bonus Action: expend a spell slot to restore 2d6 + Int HP to the ward.' }]
        } 
      },
      { 
        name: 'Diviner', 
        description: 'Seers of fate and manipulators of destiny, Diviners unravel the mysteries of past, present, and future. They see fragments of what might be and make reality bend to match their visions.',
        features: { 
            3: [
                 { name: 'Divination Savant', description: 'When adding a Divination spell to your book, it costs 1 hour and 25 GP per level. You gain 2 free spells of level 1-2. When you access a new spell slot level, you gain 1 free spell.' },
                 { name: 'Portent', description: 'After each Long Rest, roll 2d20 and record the results. You can replace any d20 from yourself or a creature you can see with one of these. Only once per turn.' }
            ],
            6: [{ name: 'Third Eye', description: 'Bonus Action to activate/deactivate your Third Eye until a Long Rest. You see in darkness up to 120 feet, see invisible creatures within 30 feet, and automatically detect magic.' }],
            10: [{ name: 'Read Thoughts', description: 'When you cast a Divination spell with a slot, you read surface thoughts of a creature within 30 feet (Wis 16+ immune). It doesn\'t know you are doing it.' }],
            14: [{ name: 'Greater Portent', description: 'You roll 3d20 after each Long Rest instead of 2.' }]
        } 
      },
      { 
        name: 'Evoker', 
        description: 'Masters of raw elemental power, Evokers wield fire, frost, lightning, and acid to create devastation. They channel magic into explosive destruction that reshapes the battlefield.',
        features: { 
            3: [
                 { name: 'Evocation Savant', description: 'When adding an Evocation spell to your book, it costs 1 hour and 25 GP per level. You gain 2 free spells of level 1-2. When you access a new spell slot level, you gain 1 free spell.' },
                 { name: 'Potent Cantrip', description: 'When a creature succeeds on a saving throw against your cantrip, or you miss with a cantrip attack, the creature takes half damage. Additional effects don\'t occur.' }
            ],
            6: [{ name: 'Sculpt Spells', description: 'When you cast an Evocation spell that affects multiple creatures, you choose 1 + the spell\'s level that automatically succeed and take no damage.' }],
            10: [{ name: 'Empowered Evocation', description: 'When you cast an Evocation spell of level 1+, you add Intelligence to one damage roll.' }],
            14: [{ name: 'Overchannel', description: 'When you cast a damaging Evocation spell of level 1-5, you maximize the damage. First time no penalty. Subsequent times: 2d12 Necrotic damage per level above 1.' }]
        } 
      },
      { 
        name: 'Illusionist', 
        description: 'Weavers of light and shadow, Illusionists redefine reality through deception. They twist perception to confuse enemies and create impossible scenarios from thin air.',
        features: { 
            3: [
                 { name: 'Illusion Savant', description: 'You gain 2 free spells of level 1-2. When you access a new spell slot level, you gain 1 free spell.' },
                 { name: 'Improved Illusion', description: 'You cast Minor Illusion as a Bonus Action. You ignore V/S components for Illusion spells. Range +30 feet.' }
            ],
            6: [{ name: 'Phantasmal Creatures', description: 'You always have Summon Beast and Summon Fey prepared (as Illusion spells). You can cast each once per Long Rest without a spell slot.' }],
            10: [{ name: 'Illusory Self', description: 'When you are attacked, Reaction to create a duplicate. The attack hits the illusion and misses. 3 uses, regain on Short/Long Rest.' }],
            14: [{ name: 'Illusory Reinforcement', description: 'When you use Illusory Self, expend a level 2+ slot to regain uses. Creatures have Disadvantage to detect they are false.' }]
        } 
      },
      { 
        name: 'Bladesinger', 
        description: 'Bladesingers master a tradition of wizardry that incorporates swordplay and dance. They use intricate, elegant maneuvers that fend off harm and allow them to channel magic into devastating attacks.',
        features: { 
            3: [
                 { name: 'Bladesong', description: 'Bonus Action (no armor or shield), 1 minute: AC + Int, speed +10, Advantage on Acrobatics; you use Int for attack/damage; you add Int to Concentration. Uses = Int per Long Rest.' },
                 { name: 'Training in War and Song', description: 'Proficiency with Martial melee weapons (except Two-Handed or Heavy). You use a melee weapon as a focus. Proficiency in one skill.' }
            ],
            6: [{ name: 'Extra Attack', description: 'You attack twice. You can cast a Wizard cantrip instead of one attack.' }],
            10: [{ name: 'Song of Defense', description: 'When you take damage with Bladesong active, Reaction: expend a spell slot to reduce damage by 5 × the slot\'s level.' }],
            14: [{ name: 'Song of Victory', description: 'After casting a spell with an action, you make a weapon attack as a Bonus Action.' }]
        } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { INT: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, STR: 8 }
};