
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const bard = {
  details: { 
    name: 'Bard', 
    description: 'Masters of song, oratory, and magic. Bards use Words of Creation to inspire allies, demoralize enemies, and manipulate reality.', 
    traits: [
        { name: 'Bardic Inspiration', description: 'You can supernaturally inspire others through words, music, or dance. As a Bonus Action, you can inspire a creature within 60 feet that can see or hear you. That creature gains a Bardic Inspiration die (d6). Once within the next hour, when the creature fails a d20 Test, it can roll the die and add the result, potentially turning the failure into a success. You have a number of uses equal to your Charisma modifier. You regain all uses when you finish a Long Rest. The die increases to d8 at level 5, d10 at level 10, and d12 at level 15.' }, 
        { name: 'Spellcasting', description: 'You have learned to cast spells through your bardic arts. You know 2 cantrips (more at levels 4 and 10). You are a prepared spellcaster. Your spellcasting ability is Charisma. You use a Musical Instrument as a Spellcasting Focus.' }, 
        { name: 'Tool Proficiency', description: 'You gain proficiency with three musical instruments of your choice.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'DEX', 'CON'] as Ability[],
  skillData: { count: 3, options: 'Any' as const },
  progression: { 
    1: ['Bardic Inspiration', 'Spellcasting'], 
    2: ['Expertise', 'Jack of All Trades'], 
    3: ['Bard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Font of Inspiration'], 
    6: ['Subclass Feature'], 
    7: ['Countercharm'], 
    8: ['Ability Score Improvement'], 
    9: ['Expertise'], 
     10: ['Magical Secrets'],
     11: ['—'],
     12: ['Ability Score Improvement'],
     13: ['—'],
     14: ['Subclass Feature'],
     15: ['—'],
     16: ['Ability Score Improvement'],
     17: ['—'],
     18: ['Superior Inspiration'],
    19: ['Epic Boon Feat'], 
    20: ['Words of Creation'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'College of Lore', 
        description: 'Plumb the Depths of Magical Knowledge. Bards of the College of Lore collect spells and secrets from diverse sources, such as scholarly tomes, mystical rites, and peasant tales.', 
        features: { 
            3: [
                { name: 'Bonus Proficiencies', description: 'You gain proficiency with three skills of your choice.' }, 
                { name: 'Cutting Words', description: 'You learn to use your wit to distract and confuse. When a creature within 60 feet makes a damage roll or succeeds on an ability check or attack roll, you can use your Reaction to expend Bardic Inspiration, subtract the result from the roll, reducing damage or turning a success into a failure.' }
            ],
            6: [{ name: 'Magical Discoveries', description: 'You learn two spells of your choice from the Cleric, Druid, or Wizard spell lists. They must be cantrips or spells of a level for which you have spell slots. You always have them prepared. When you gain a level, you can replace one of them.' }],
            14: [{ name: 'Peerless Skill', description: 'When you fail an ability check or attack roll, you can expend Bardic Inspiration; roll the die and add it to the d20. If it\'s still a failure, the Bardic Inspiration is not expended.' }]
        } 
      },
      {
        name: 'College of Valor',
        description: 'Sing the Deeds of Ancient Heroes. Bards of the College of Valor are daring storytellers whose tales preserve the memory of the great heroes of the past.',
        features: {
            3: [
                { name: 'Combat Inspiration', description: 'A creature with your Bardic Inspiration can use it for: Defense (Reaction, add the die to its AC against an attack) or Offensive (after hitting, add the die to the damage).' },
                { name: 'Martial Training', description: 'You gain proficiency with Martial weapons and training with Medium Armor and Shields. You can use a Simple or Martial weapon as a Spellcasting Focus.' }
            ],
            6: [{ name: 'Extra Attack', description: 'You can attack twice instead of once when you take the Attack action. You can cast a cantrip in place of one of those attacks.' }],
            14: [{ name: 'Battle Magic', description: 'After you cast a spell with a casting time of an action, you can make a weapon attack as a Bonus Action.' }]
        }
      },
      {
        name: 'College of Glamour',
        description: 'Weave Beguiling Fey Magic. The College of Glamour traces its origins to the beguiling magic of the Feywild. Bards who study this magic weave threads of beauty and terror into their songs and stories.',
        features: {
            3: [
                { name: 'Beguiling Magic', description: 'You always have Hypnotic Pattern and Mirror Image prepared. After you cast an Enchantment or Illusion spell using a spell slot, you can force a creature within 60 feet to make a Wisdom saving throw or have the Charmed or Frightened condition for 1 minute. Once per Long Rest.' },
                { name: 'Mantle of Inspiration', description: 'As a Bonus Action, expend Bardic Inspiration. Choose creatures within 60 feet up to your Charisma modifier. Each gains Temporary HP equal to 2\u00D7 the die result and can use its Reaction to move up to its speed without provoking Opportunity Attacks.' }
            ],
            6: [{ name: 'Mantle of Majesty', description: 'You always have Command prepared. As a Bonus Action, you cast Command without expending a spell slot. For 1 minute or until you lose Concentration, you can cast Command as a Bonus Action without a spell slot. Charmed creatures automatically fail the saving throw. Once per Long Rest.' }],
            14: [{ name: 'Unbreakable Majesty', description: 'As a Bonus Action, you assume a majestic presence for 1 minute. When a creature hits you with an attack, it must make a Charisma saving throw or the attack misses. Once per Short or Long Rest.' }]
        }
      },
      {
        name: 'College of Dance',
        description: 'Move in Harmony with the Cosmos. Bards of the College of Dance know that the Words of Creation can\'t be contained within speech or song; the words are uttered by the movements of celestial bodies.',
        features: {
            3: [
                { name: 'Dazzling Footwork', description: 'While you aren\'t wearing armor or a shield: Dance Virtuoso (Advantage on Performance checks involving dance); Unarmored Defense (AC = 10 + Dexterity + Charisma); Agile Strikes (when you expend Bardic Inspiration, make an Unarmed Strike); Bardic Damage (Bludgeoning damage = Inspiration die + Dexterity).' }
            ],
            6: [
                { name: 'Inspiring Movement', description: 'When an enemy ends its turn within 5 feet, you can use your Reaction and expend Bardic Inspiration to move half your speed. An ally within 30 feet can move half its speed. No Opportunity Attacks.' },
                { name: 'Tandem Footwork', description: 'When you roll Initiative, you can expend Bardic Inspiration. You and each ally within 30 feet gain a bonus to Initiative equal to the die result.' }
            ],
            14: [{ name: 'Leading Evasion', description: 'When you are subjected to an effect that allows a Dexterity saving throw for half damage, you take no damage on a success and half on a failure. You can share this benefit with creatures within 5 feet.' }]
        }
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, DEX: 14, CON: 13, WIS: 12, INT: 10, STR: 8 }
};
