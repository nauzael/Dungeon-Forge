
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const warlock = {
  details: { 
    name: 'Warlock', 
    description: 'Seekers of hidden knowledge who forge pacts with powerful entities. Warlocks combine short-range magic with mystic invocations that alter their reality.', 
    traits: [
        { name: 'Eldritch Invocations', description: 'You have discovered Eldritch Invocations, fragments of forbidden knowledge that grant you magical abilities. You gain 1 invocation at level 1. When you level up, you can replace one.' }, 
        { name: 'Pact Magic', description: 'You have forged a pact with a mysterious entity. You know 2 cantrips (more at levels 4 and 10). You prepare level 1+ spells. Your spell slots are always the same level and are regained on a Short Rest. Charisma is your spellcasting ability.' }, 
        { name: 'Magical Cunning', description: 'You perform a 1-minute esoteric rite. You regain Pact slots up to half your maximum (rounded up). Once per Long Rest.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Eldritch Invocations', 'Pact Magic'], 
    2: ['Magical Cunning'], 
    3: ['Warlock Subclass'], 
     4: ['Ability Score Improvement'],
     5: ['—'],
     6: ['Subclass Feature'],
     7: ['—'],
     8: ['Ability Score Improvement'], 
    9: ['Contact Patron'], 
    10: ['Subclass Feature'], 
    11: ['Mystic Arcanum (Level 6)'], 
    12: ['Ability Score Improvement'], 
    13: ['Mystic Arcanum (Level 7)'], 
    14: ['Subclass Feature'], 
    15: ['Mystic Arcanum (Level 8)'], 
    16: ['Ability Score Improvement'], 
     17: ['Mystic Arcanum (Level 9)'],
     18: ['—'],
     19: ['Epic Boon Feat'], 
    20: ['Eldritch Master'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Archfey Patron',
        description: 'Pact with a noble of the Fey Court, masters of illusion and playful teleportation.',
        features: {
            3: [
                 { name: 'Archfey Spells', description: 'Always prepared: 3: Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep; 5: Blink, Plant Growth; 7: Dominate Beast, Greater Invisibility; 9: Dominate Person, Glibness.' },
                 { name: 'Steps of the Fey', description: 'You cast Misty Step without a spell slot. Uses = Charisma per Long Rest. Additional effects: Refreshing Step (THP 1d10) or Taunting Step (Wis save or Disadvantage on attacks against others).' }
            ],
            6: [{ name: 'Misty Escape', description: 'Misty Step as a Reaction when taking damage. Additional options: Vanishing Step (Invisible until start of next turn) or Frightful Step (2d10 Psychic to creatures within 5 feet).' }],
            10: [{ name: 'Beguiling Defenses', description: 'Immunity to Charmed. When taking damage, Reaction halves the damage and forces a Wis save on the attacker or takes equal Psychic damage. Once per Long Rest or spell slot.' }],
            14: [{ name: 'Bewitching Magic', description: 'After casting an Enchantment/Illusion spell with an action and spell slot, you cast Misty Step as part of the same action without expending a slot.' }]
        },
        alwaysPreparedSpells: {
            3: ['Misty Step', 'Faerie Fire', 'Sleep', 'Calm Emotions'],
            5: ['Invisible Stalker', 'Rary\'s Telepathic Bond'],
            7: ['Gate', 'Phantasmal Killer'],
            9: ['Imprisonment', 'True Polymorph']
        }
    },
    {
        name: 'Celestial Patron',
        description: 'Your patron is a being from the upper planes, an entity of purifying light and eternal hope.',
        features: {
            3: [
                 { name: 'Celestial Spells', description: 'Spells: Cure Wounds, Guiding Bolt, Lesser Restoration, Daylight.' },
                 { name: 'Healing Light', description: 'Pool of d6s (1 + level). Bonus Action: expend dice (max Charisma) to heal a creature within 60 feet.' }
            ],
            6: [{ name: 'Radiant Soul', description: 'Resistance to Radiant. You add Charisma to damage of spells that deal Radiant or Fire damage.' }],
            10: [{ name: 'Celestial Resilience', description: 'When you finish a rest or use Magical Cunning, you and up to 5 allies gain THP = level + Charisma.' }],
            14: [{ name: 'Searing Vengeance', description: 'Reaction when rolling a death save: you rise with half HP, deal 2d8+Cha Radiant damage and blind nearby enemies.' }]
        },
        alwaysPreparedSpells: {
            3: ['Cure Wounds', 'Guiding Bolt', 'Lesser Restoration', 'Daylight'],
            5: ['Revivify', 'Mass Healing Word'],
            7: ['Aura of Life', 'Death Ward'],
            9: ['Greater Restoration', 'Mass Cure Wounds']
        }
    },
    {
        name: 'Fiend Patron',
        description: 'You have forged a pact with a demon or devil, granting you destructive power and infernal resilience.',
        features: {
            3: [
                 { name: 'Fiend Spells', description: 'Spells: Burning Hands, Command, Scorching Ray, Fireball.' },
                 { name: 'Dark One\'s Blessing', description: 'When you reduce an enemy to 0 HP (you or someone within 10 feet), you gain THP = level + Charisma.' }
            ],
            6: [{ name: 'Dark One\'s Own Luck', description: 'Add 1d10 to a check or saving throw. Once per Long Rest or by expending a spell slot.' }],
            10: [{ name: 'Fiendish Resilience', description: 'When you finish a rest, choose a damage type (not Force). Resistance until the next rest.' }],
            14: [{ name: 'Hurl Through Hell', description: 'On hit: you send the target to the lower planes. It disappears until end of your turn and takes 8d10 Psychic damage (unless Fiend). Once per Long Rest.' }]
        },
        alwaysPreparedSpells: {
            3: ['Burning Hands', 'Command', 'Scorching Ray', 'Fireball'],
            5: ['Hellish Rebuke', 'Counterspell'],
            7: ['Wall of Fire', 'Summon Fiend'],
            9: ['Flamestrike', 'Infernal Gateway']
        }
    },
    {
        name: 'Great Old One Patron',
        description: 'Your patron is an unspeakable entity from distant realms, whose mere presence alters sanity.',
        features: {
            3: [
                 { name: 'Great Old One Spells', description: 'Spells: Dissonant Whispers, Tasha\'s Hideous Laughter, Detect Thoughts.' },
                 { name: 'Awakened Mind', description: 'Telepathy with a creature within 30 feet for minutes = your level. You can speak mentally over miles if there is a connection.' },
                 { name: 'Psychic Spells', description: 'You can change spell damage to Psychic. Illusion/Enchantment spells don\'t require V/S components.' }
            ],
            6: [{ name: 'Clairvoyant Combatant', description: 'Using Awakened Mind, force Wis save: Disadvantage on attacks against you and Advantage against them.' }],
            10: [
                 { name: 'Eldritch Hex', description: 'When you cast Hex, the target has Disadvantage on saving throws of the chosen ability.' },
                 { name: 'Thought Shield', description: 'Resistance to Psychic. You reflect Psychic damage to the attacker.' }
            ],
            14: [{ name: 'Create Thrall', description: 'You always have Summon Aberration prepared. You can cast it without components and without Concentration for 1 minute with extra THP.' }]
        },
        alwaysPreparedSpells: {
            3: ['Dissonant Whispers', 'Tasha\'s Hideous Laughter', 'Detect Thoughts'],
            5: ['Detect Thoughts', 'Counterspell'],
            7: ['Summon Aberration', 'Synaptic Static'],
            9: ['Rary\'s Telepathic Bond', 'Imprisonment']
        }
    },
    {
        name: 'Vestige Patron',
        description: 'Your pact is with a vestige, the remains of a dying god seeking to regain its power through you.',
        features: {
            3: [
                 { name: 'Vestige Companion', description: 'You summon a Vestige (Celestial, Fiend, or Undead) that acts on your turn. It has its own stat block that scales with level.' },
                 { name: 'Vestige Spells', description: 'Choose a Cleric domain (Life, Light, Trickery, or War) to have its spells always prepared.' }
            ],
            6: [{ name: 'Vestige Recovery', description: 'Your Vestige regains Divine Power on a Short/Long Rest or when you use Magical Cunning.' }],
            10: [{ name: 'Aura of Power', description: 'Magic action: the Vestige emits a 30-foot aura (Resistance to Fire, Necrotic, Radiant; Immunity to Charmed, Frightened). If you drop to 0 in the aura, you stay at 1 HP.' }],
            14: [{ name: 'Semblance of Life', description: 'Magic action: the Vestige takes a more powerful form (Summon Celestial, Fiend, or Undead) without concentration.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};
