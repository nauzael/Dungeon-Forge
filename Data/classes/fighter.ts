
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const fighter = {
  details: { 
    name: 'Fighter', 
    description: 'Masters of martial combat, experts in all types of weapons and armor. They are the vanguard on any battlefield.', 
    traits: [
        { name: 'Fighting Style', description: 'Choose a Fighting Style feat (Archery, Defense, etc.) to specialize.' }, 
        { name: 'Second Wind', description: 'Bonus action: Recover 1d10 + fighter level HP. You have multiple uses that recover with rests.' }, 
        { name: 'Weapon Mastery', description: 'You master the mastery properties of three weapons (scales with level).' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] as Skill[] },
  progression: { 
    1: ['Fighting Style', 'Second Wind', 'Weapon Mastery'], 
    2: ['Action Surge', 'Tactical Mind'], 
    3: ['Fighter Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Tactical Shift'], 
    6: ['Ability Score Improvement'], 
    7: ['Subclass Feature'],
    8: ['Ability Score Improvement'], 
    9: ['Indomitable', 'Tactical Master'], 
    10: ['Subclass Feature'],
    11: ['Two Extra Attacks'], 
    12: ['Ability Score Improvement'], 
    13: ['Indomitable (2)', 'Studied Attacks'], 
    14: ['Ability Score Improvement'], 
    15: ['Subclass Feature'],
    16: ['Ability Score Improvement'], 
    17: ['Action Surge (2)', 'Indomitable (3)'],
    18: ['Subclass Feature'],
    19: ['Epic Boon Feat'], 
    20: ['Three Extra Attacks'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Battle Master',
        description: 'Elite tacticians who use martial maneuvers.',
        features: {
            3: [
                { name: 'Combat Superiority', description: 'You gain 4 Superiority dice (d8) to perform Maneuvers. You choose 3 initial maneuvers.' },
                { name: 'Student of War', description: 'CHOOSE: Gain proficiency in one artisan tool and one skill from the fighter list.' }
            ],
            7: [
                { name: 'Know Your Enemy', description: 'BA: Identify vulnerabilities/resistances. You choose 2 new maneuvers.' },
                { name: 'Additional Superiority Die', description: 'You gain an extra die (Total: 5).' }
            ],
            10: [{ name: 'Improved Combat Superiority', description: 'Dice increase to d10. You choose 2 new maneuvers.' }],
            15: [
                { name: 'Relentless', description: 'Once per turn, use a maneuver by rolling a d8 without spending a superiority die.' },
                { name: 'Additional Superiority Die', description: 'You gain an extra die (Total: 6). You choose 2 new maneuvers.' }
            ],
            18: [{ name: 'Ultimate Combat Superiority', description: 'Dice increase to d12.' }]
        }
    },
    {
        name: 'Champion',
        description: 'Absolute physical perfection of the warrior.',
        features: {
            3: [
                { name: 'Improved Critical', description: 'Critical hits on 19 or 20.' },
                { name: 'Remarkable Athlete', description: 'Advantage on initiative and Athletics. After a critical, you can move half your speed without provoking attacks.' }
            ],
            7: [{ name: 'Additional Fighting Style', description: 'CHOOSE: Gain an additional Fighting Style feat.' }],
            10: [{ name: 'Heroic Warrior', description: 'You automatically gain Heroic Inspiration at the start of your turn if you don\'t have it.' }],
            15: [{ name: 'Superior Critical', description: 'Critical hits on 18, 19, or 20.' }],
            18: [
                { name: 'Defy Death', description: 'Advantage on death saves.' },
                { name: 'Heroic Rally', description: 'You recover HP constantly while below half health.' }
            ]
        }
    },
    {
        name: 'Eldritch Knight',
        description: 'Warriors who weave steel and arcane magic.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'MAGIC: INT-based (Wizard). No school restrictions in 2024.' },
                { name: 'War Bond', description: 'Bind weapons to summon them to your hand as a BA.' }
            ],
            7: [{ name: 'War Magic', description: 'Replace an attack with a cantrip when using the Attack action.' }],
            10: [{ name: 'Eldritch Strike', description: 'When you hit an enemy, they have disadvantage on their next save against one of your spells.' }],
            15: [{ name: 'Arcane Charge', description: '30-foot teleport linked to the use of Action Surge.' }],
            18: [{ name: 'Improved War Magic', description: 'Replace two attacks with casting a spell of level 1 or 2.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 3,
  suggestedArray: { STR: 15, DEX: 14, CON: 13, CHA: 12, WIS: 10, INT: 8 }
};
