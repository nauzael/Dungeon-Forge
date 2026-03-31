
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const bard = {
  details: { 
    name: 'Bard', 
    description: 'Masters of song, oratory, and magic. Bards use Words of Creation to inspire allies, demoralize enemies, and manipulate reality.', 
    traits: [
        { name: 'Bardic Inspiration', description: 'Use a bonus action to inspire an ally within 60 feet. They gain a Bard die (d6 at level 1) to add to a d20 roll.' }, 
        { name: 'Spellcasting', description: 'Charisma-based arcane magic. You are a prepared spellcaster.' }, 
        { name: 'Tool Proficiency', description: 'Proficiency with 3 musical instruments.' }
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
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'],
    15: ['Inspiration Upgrade (d12)'],
    16: ['Ability Score Improvement'], 
    18: ['Superior Inspiration'],
    19: ['Epic Boon Feat'], 
    20: ['Words of Creation'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'College of Lore', 
        description: 'The College of Knowledge seeks truth from all sources.', 
        features: { 
            3: [
                { name: 'Bonus Proficiencies', description: 'CHOOSE: Gain proficiency in 3 skills of your choice.' }, 
                { name: 'Cutting Words', description: 'As a reaction, subtract an Inspiration die from a creature\'s attack roll, damage roll, or ability check.' }
            ],
            6: [{ name: 'Magical Discoveries', description: 'CHOOSE: Learn 2 spells from any class (Cleric, Druid, or Wizard) of a level you can cast.' }],
            14: [{ name: 'Peerless Skill', description: 'Add Inspiration to your own d20 checks. If you fail, you do not consume the die.' }]
        } 
      },
      {
        name: 'College of Valor',
        description: 'Warrior bards who sing on the front lines.',
        features: {
            3: [
                { name: 'Combat Inspiration', description: 'Allies can add Inspiration to damage or AC as a reaction.' },
                { name: 'Martial Training', description: 'UPGRADE: Proficiency with martial weapons, shields, and medium armor. The weapon serves as a spellcasting focus.' }
            ],
            6: [{ name: 'Extra Attack', description: 'You attack twice. You can swap one attack for casting a cantrip.' }],
            14: [{ name: 'Battle Magic', description: 'After casting a spell with your action, make a weapon attack as a bonus action.' }]
        }
      },
      {
        name: 'College of Glamour',
        description: 'Masters of fey seduction and wonder.',
        features: {
            3: [
                { name: 'Beguiling Magic', description: 'MAGIC: Charm Person and Mirror Image always prepared. Reaction: Charm/Frighten when casting Illusion/Enchantment.' },
                { name: 'Mantle of Inspiration', description: 'BA: Grant THP (2x die) to allies and free movement without opportunity attacks.' }
            ],
            6: [{ name: 'Mantle of Majesty', description: 'MAGIC: Command always prepared. Cast it as BA without spending slots for 1 min.' }],
            14: [{ name: 'Unbreakable Majesty', description: 'BA: For 1 min, enemies must save CHA to be able to hit you.' }]
        }
      },
      {
        name: 'College of Dance',
        description: 'The elegance of movement turned into a weapon.',
        features: {
            3: [
                { name: 'Dazzling Footwork', description: 'UPGRADE: AC = 10+DEX+CHA. BA: Unarmed strike using the Inspiration die for damage.' },
                { name: 'Dance Virtuoso', description: 'You gain proficiency in dance performance.' }
            ],
            6: [
                { name: 'Inspiring Movement', description: 'Reaction: Allow an ally to move freely when an enemy approaches.' },
                { name: 'Tandem Footwork', description: 'INITIATIVE: Add the Bard die to your and nearby allies\' initiative.' }
            ],
            14: [{ name: 'Leading Evasion', description: 'Evasion shared with allies within 5 feet of you.' }]
        }
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, DEX: 14, CON: 13, WIS: 12, INT: 10, STR: 8 }
};
