
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const wizard = {
  details: { 
    name: 'Wizard', 
    description: 'Wizards are defined by their exhaustive study of the intricacies of magic. They cast explosive fire spells, arched lightning, subtle deception, and spectacular transformations.', 
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
    1: ['Spellcasting', 'Ritual Adept', 'Arcane Recovery'], 
    2: ['Scholar'], 
    3: ['Wizard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Memorize Spell'], 
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
  subclasses: [
      { 
        name: 'Abjurer', 
        description: 'Specialists in magic that blocks, banishes, or protects.', 
        features: { 
            3: [
                { name: 'Abjuration Savant', description: 'Choose two Abjuration spells of level 2 or lower and add them to your book for free. Additionally, each time you gain access to a new spell slot level, add another Abjuration spell for free.' },
                { name: 'Arcane Ward', description: 'When casting an Abjuration spell with a slot, you create a magical shield. Max HP = (2 x Wizard Level) + INT Mod. It absorbs damage before you do. Recovers HP when casting Abjuration spells.' }
            ],
            6: [{ name: 'Projected Ward', description: 'Reaction: When a creature within 30 feet takes damage, your Arcane Ward absorbs that damage instead.' }],
            10: [
                { name: 'Spell Breaker', description: 'You always have Counterspell and Dispel Magic prepared. You can cast Dispel Magic as a bonus action and add your Proficiency to the check. If you fail to stop a spell, you don\'t spend the slot.' }
            ],
            14: [{ name: 'Spell Resistance', description: 'You have Advantage on saves against spells and Resistance to damage from spells.' }]
        } 
      },
      { 
        name: 'Diviner', 
        description: 'Seekers of a clearer understanding of the past, present, and future.', 
        features: { 
            3: [
                { name: 'Divination Savant', description: 'Choose two Divination spells of level 2 or lower for your book. Gain one extra each time you unlock new spell slot levels.' },
                { name: 'Portent', description: 'When finishing a Long Rest, roll two d20s and record the results. You can substitute any d20 roll you see with one of these results (1/turn).' }
            ],
            6: [{ name: 'Expert Divination', description: 'When casting a Divination spell of level 2+, you recover a lower-level spell slot (maximum level 5).' }],
            10: [{ name: 'The Third Eye', description: 'Bonus action: Choose a benefit until your next rest (Darkvision 120ft, Read all languages, or see Invisible without spending a slot).' }],
            14: [{ name: 'Greater Portent', description: 'You roll three d20s for your Portent feature instead of two.' }]
        } 
      },
      { 
        name: 'Evoker', 
        description: 'Masters of pure destructive energy.', 
        features: { 
            3: [
                { name: 'Evocation Savant', description: 'Choose two Evocation spells of level 2 or lower for your book. Gain one extra when leveling up spell slots.' },
                { name: 'Potent Cantrip', description: 'Your damaging cantrips affect even those who avoid the hit. If they fail the save or the attack misses, they take half the cantrip\'s damage.' }
            ],
            6: [{ name: 'Sculpt Spells', description: 'Create safety pockets in your area evocations. Choose (1 + Spell Level) creatures; they automatically succeed on the save and take no damage.' }],
            10: [{ name: 'Empowered Evocation', description: 'Add your Intelligence modifier to one damage roll of your Evocation spells.' }],
            14: [{ name: 'Overchannel', description: 'Increase the power of your spells of level 1-5 to deal maximum possible damage. The first use is safe; subsequent uses deal Necrotic damage to you (2d12 per spell level).' }]
        } 
      },
      { 
        name: 'Illusionist', 
        description: 'Specialists in deceiving the senses and mind.', 
        features: { 
            3: [
                { name: 'Illusion Savant', description: 'Choose two Illusion spells of level 2 or lower for your book. Gain one extra when leveling up spell slots.' },
                { name: 'Improved Illusions', description: 'You cast Illusions without Verbal components. If the spell has range 10ft+, the range increases 60ft. You learn Minor Illusion and can create sound and image simultaneously as a bonus action.' }
            ],
            6: [{ name: 'Phantasmal Creatures', description: 'You always have Summon Beast and Summon Fey prepared. When casting them, you can change their school to Illusion and cast them without spending a slot (with half HP).' }],
            10: [{ name: 'Illusory Self', description: 'Reaction: Interpose a duplicate before an attack, causing it to automatically miss. 1/Short or long rest (or spend slot level 2+).' }],
            14: [{ name: 'Illusory Reality', description: 'Bonus action: Choose an inanimate object from one of your illusions and make it real for 1 minute (cannot deal damage).' }]
        } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { INT: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, STR: 8 }
};
