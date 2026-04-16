
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const warlock = {
  details: { 
    name: 'Warlock', 
    description: 'Seekers of hidden knowledge who forge pacts with powerful entities. Warlocks combine short-range magic with mystic invocations that alter their reality.', 
    traits: [
        { name: 'Eldritch Invocations', description: 'Fragments of forbidden knowledge that grant you permanent magical abilities. You gain one at level 1 (like Pact of the Tome).' }, 
        { name: 'Pact Magic', description: 'Unique Charisma-based magic. Your spell slots are always the highest level you can cast and recover on short rests.' }, 
        { name: 'Magical Cunning', description: 'Action (1 min): You recover half your Pact Magic slots (rounded up). 1/Long Rest.' }
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
    6: ['Subclass Feature'], 
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
    19: ['Epic Boon Feat'], 
    20: ['Eldritch Master'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Archfey Patron',
        description: 'Pact with a noble of the Fey Court, masters of illusion and playful teleportation.',
        features: {
            3: [
                { name: 'Archfey Spells', description: 'Always prepared spells like Misty Step, Faerie Fire, Sleep, and Calm Emotions. More at levels 5, 7, and 9.' },
                { name: 'Steps of the Fey', description: 'You can cast Misty Step for free a number of times equal to your Charisma mod. When using it, choose an effect: Refreshing Step (THP) or Taunting Step (Disadvantage for enemies).' }
            ],
            6: [{ name: 'Misty Escape', description: 'Reaction when hit: You become Invisible and teleport 30 feet. You gain the benefits of Steps of the Fey when doing so.' }],
            10: [{ name: 'Beguiling Defenses', description: 'Immunity to Charmed. Reaction when hit: Reduce the damage in half and the attacker must save Wisdom or take Psychic damage.' }],
            14: [{ name: 'Bewitching Magic', description: 'When casting an Illusion or Enchantment spell, you can cast Misty Step as part of the same action without spending a slot.' }]
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
                { name: 'Celestial Spells', description: 'Spells like Cure Wounds, Guiding Bolt, Lesser Restoration, and Daylight.' },
                { name: 'Healing Light', description: 'Reserve of d6s (1 + Warlock Level). Bonus action: Spend dice (max CHA mod) to heal a creature within 60 feet.' }
            ],
            6: [{ name: 'Radiant Soul', description: 'Resistance to Radiant damage. Add Charisma to the damage of a spell that deals Radiant or Fire damage.' }],
            10: [{ name: 'Celestial Resilience', description: 'When finishing a rest or using Magical Cunning, you and up to 5 allies gain THP (Level + CHA mod).' }],
            14: [{ name: 'Searing Vengeance', description: 'Reaction when rolling a death save: You rise with half HP, deal Radiant damage (2d8+CHA) and blind nearby enemies.' }]
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
                { name: 'Fiend Spells', description: 'Spells like Burning Hands, Command, Scorching Ray, and Fireball.' },
                { name: 'Dark One\'s Blessing', description: 'When reducing an enemy to 0 HP (you or someone within 10 feet), you gain THP equal to Warlock Level + Charisma modifier.' }
            ],
            6: [{ name: 'Dark One\'s Own Luck', description: 'Add 1d10 to an ability check or save. 1/Long Rest or spend a Pact Magic slot.' }],
            10: [{ name: 'Fiendish Resilience', description: 'Choose a damage type (not Force) when finishing a rest to gain Resistance to it until the next rest.' }],
            14: [{ name: 'Hurl Through Hell', description: 'When hitting with an attack: Send the target to the lower planes. They disappear until the end of your turn and take 8d10 Psychic damage (if not a Fiend).' }]
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
                { name: 'Great Old One Spells', description: 'Spells like Dissonant Whispers, Tasha\'s Hideous Laughter, and Detect Thoughts.' },
                { name: 'Awakened Mind', description: 'Telepathy with one creature within 30 feet for Warlock Level minutes. You can mentally speak at miles away if there is already a bond.' },
                { name: 'Psychic Spells', description: 'You can change your warlock spells\' damage to Psychic. Illusion/Enchantment spells don\'t require Verbal/Somatic components.' }
            ],
            6: [{ name: 'Clairvoyant Combatant', description: 'Using Awakened Mind, you can force a Wisdom save: The target has Disadvantage on attacks against you and you have Advantage against them.' }],
            10: [
                { name: 'Eldritch Hex', description: 'When casting Hex, the target has Disadvantage on saving throws of the chosen ability.' },
                { name: 'Thought Shield', description: 'Resistance to Psychic damage and you reflect received psychic damage to the attacker.' }
            ],
            14: [{ name: 'Create Thrall', description: 'You always have Summon Aberration prepared. You can cast it without components and without concentration for 1 minute with extra THP.' }]
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
                { name: 'Vestige Companion', description: 'Summon a Vestige (Celestial, Fiend, or Undead) that acts on your turn. It has its own stat block that scales with your Warlock level.' },
                { name: 'Vestige Spells', description: 'Choose a Cleric Domain (Life, Light, Trickery, or War) to have their spells always prepared as Warlock spells.' }
            ],
            6: [{ name: 'Vestige Recovery', description: 'Your Vestige recovers the use of its Divine Power when finishing a short or long rest, or when using your Magical Cunning.' }],
            10: [{ name: 'Aura of Power', description: 'As a Magic action, the Vestige emits a 30-foot aura (Resistance to Fire, Necrotic, and Radiant; immunity to Charm and Fear). If you fall to 0 HP in the aura, you remain at 1 HP.' }],
            14: [{ name: 'Semblance of Life', description: 'As a Magic action, the Vestige temporarily adopts a more powerful form (Summon Celestial, Fiend, or Undead) without requiring concentration.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};
