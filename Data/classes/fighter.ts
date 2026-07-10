
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const fighter = {
  details: { 
    name: 'Fighter', 
    description: 'Masters of martial combat, experts in all types of weapons and armor. They are the vanguard on any battlefield.', 
    traits: [
        { name: 'Fighting Style', description: 'You gain a Fighting Style feat of your choice (Archery, Defense, etc.). Defense is recommended. Each time you gain a Fighter level, you can replace the chosen feat with a different one.' }, 
        { name: 'Second Wind', description: 'You have a limited reserve of physical and mental stamina. As a Bonus Action, you regain 1d10 + Fighter level HP. You have 2 uses. You regain 1 use on a Short Rest, all on a Long Rest. You gain more uses at levels 4, 10, and 16 (see table).' }, 
        { name: 'Weapon Mastery', description: 'Your training lets you use the mastery properties of three Simple or Martial weapon types. When you finish a Long Rest, you can practice and change one of those weapons. You gain more options at levels 4, 10, 13, and 16.' }
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
                 { name: 'Combat Superiority', description: 'You gain 4 Superiority Dice (d8) to perform Maneuvers. You choose 3 initial maneuvers. DC = 8 + Strength or Dexterity + Proficiency.' },
                 { name: 'Student of War', description: 'You gain proficiency with one Artisan\'s Tool and one skill from the Fighter list.' }
            ],
            7: [
                 { name: 'Know Your Enemy', description: 'As a Bonus Action, you identify a creature\'s immunities, resistances, or vulnerabilities. You spend a Superiority Die; you regain it at the end of the encounter.' },
                 { name: 'Additional Superiority Die', description: 'You gain an extra Superiority Die (Total: 5). You learn 2 new maneuvers.' }
            ],
             10: [{ name: 'Improved Combat Superiority', description: 'Your Superiority Dice increase to d10. You learn 2 new maneuvers.' }],
            15: [
                 { name: 'Relentless', description: 'Once per turn, when you use a maneuver, roll a d8 without spending a Superiority Die.' },
                 { name: 'Additional Superiority Die', description: 'You gain an extra Superiority Die (Total: 6). You learn 2 new maneuvers.' }
            ],
             18: [{ name: 'Ultimate Combat Superiority', description: 'Your Superiority Dice increase to d12.' }]
        }
    },
    {
        name: 'Champion',
        description: 'Absolute physical perfection of the warrior.',
        features: {
             3: [
                 { name: 'Improved Critical', description: 'Your critical hits occur on 19 or 20.' },
                 { name: 'Remarkable Athlete', description: 'You have Advantage on Initiative and Athletics. After a critical hit, you can move up to half your speed without provoking Opportunity Attacks.' }
             ],
             7: [{ name: 'Additional Fighting Style', description: 'You gain an additional Fighting Style feat.' }],
             10: [{ name: 'Heroic Warrior', description: 'If you don\'t have Heroic Inspiration at the start of your turn, you gain it automatically.' }],
             15: [{ name: 'Superior Critical', description: 'Your critical hits occur on 18, 19, or 20.' }],
            18: [
                 { name: 'Defy Death', description: 'You have Advantage on death saving throws, and if the result is 18-20, it counts as 20.' },
                 { name: 'Heroic Rally', description: 'While Bloodied, at the start of your turn you regain 5 + Constitution modifier HP.' }
            ]
        }
    },
    {
        name: 'Eldritch Knight',
        description: 'Support Combat Skills with Arcane Magic. Eldritch Knights combine the martial mastery common to all Fighters with a careful study of magic.',
        features: {
            3: [
                 { name: 'Spellcasting', description: 'You have learned to cast spells. You know 2 cantrips from the Wizard spell list (more at level 10). You have spell slots according to the Eldritch Knight table. You start with 3 level 1 spells from the Wizard spell list. Intelligence is your spellcasting ability. You use an Arcane Focus.' },
                 { name: 'War Bond', description: 'You learn a ritual that creates a magical bond with a weapon. The ritual takes 1 hour (can be during a Short Rest). You can\'t be disarmed unless Incapacitated. You can summon it as a Bonus Action. Maximum of 2 bonded weapons.' }
            ],
             7: [{ name: 'War Magic', description: 'When you take the Attack action, you can replace one of the attacks with casting a Wizard cantrip that has a casting time of an action.' }],
             10: [{ name: 'Eldritch Strike', description: 'When you hit with a weapon attack, the creature has Disadvantage on the next save against a spell you cast before the end of your next turn.' }],
             15: [{ name: 'Arcane Charge', description: 'When you use Action Surge, you can teleport up to 30 feet to an unoccupied space. You can do this before or after the additional action.' }],
             18: [{ name: 'Improved War Magic', description: 'When you take the Attack action, you can replace two of the attacks with casting a level 1 or 2 Wizard spell with a casting time of an action.' }]
        }
    },
    {
        name: 'Psi Warrior',
        description: 'Augment Physical Might with Psionic Power. Psi Warriors awaken the power of their minds to augment their physical might.',
        features: {
            3: [
                 { name: 'Psionic Power', description: 'You have Psionic Energy Dice (d6 at L3, d8 at L5, d10 at L9, d12 at L13). Protective Field: when you or a creature within 30 feet takes damage, Reaction to reduce damage. Psionic Strike: after hitting with a weapon, you deal additional Force damage. Telekinetic Movement: Magic action to move an object/creature 30 feet.' },
                 { name: 'Psi Warrior Energy Dice', description: 'L3: 4d6, L5: 4d8, L9: 6d8, L11: 6d10, L13: 8d10, L17: 12d12.' }
            ],
             7: [{ name: 'Telekinetic Adept', description: 'Psi-Powered Leap: Bonus Action, you gain Flight = 2× speed until end of turn. Telekinetic Push: when you damage with Psionic Strike, force a Strength save or knocked Prone/pushed 10 feet.' }],
             10: [{ name: 'Guarded Mind', description: 'Resistance to Psychic damage. If you start your turn Charmed or Frightened, spend 1 die to end those effects.' }],
             15: [{ name: 'Bulwark of Force', description: 'Bonus Action: up to your Intelligence modifier creatures within 30 feet gain Half Cover for 1 minute. Once per Long Rest or by spending 1 die.' }],
             18: [{ name: 'Telekinetic Master', description: 'You always have Telekinesis prepared, castable without a slot or components (Intelligence). While concentrating on it, you can make a weapon attack as a Bonus Action.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 3,
  suggestedArray: { STR: 15, DEX: 14, CON: 13, CHA: 12, WIS: 10, INT: 8 }
};
