
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
        description: 'Support Combat Skills with Arcane Magic. Eldritch Knights combine the martial mastery common to all Fighters with a careful study of magic.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'You have learned to cast spells. Cantrips: Two Wizard cantrips of your choice. Spell Slots: See Eldritch Knight Spellcasting table. Prepared Spells: Start with three level 1 Wizard spells. Spellcasting Ability: Intelligence.' },
                { name: 'War Bond', description: 'You learn a ritual that creates a magical bond with one weapon. You perform the ritual over 1 hour (during Short Rest). The bond fails if another Fighter is bonded or the weapon is a magic item attuned by someone else. Once bonded, you can\'t be disarmed unless Incapacitated, and you can summon it as a Bonus Action. You can have up to two bonded weapons.' }
            ],
            7: [{ name: 'War Magic', description: 'When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Wizard cantrips that has a casting time of an action.' }],
            10: [{ name: 'Eldritch Strike', description: 'When you hit a creature with an attack using a weapon, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.' }],
            15: [{ name: 'Arcane Charge', description: 'When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see. You can teleport before or after the additional action.' }],
            18: [{ name: 'Improved War Magic', description: 'When you take the Attack action on your turn, you can replace two of the attacks with a casting of one of your level 1 or level 2 Wizard spells that has a casting time of an action.' }]
        }
    },
    {
        name: 'Psi Warrior',
        description: 'Augment Physical Might with Psionic Power. Psi Warriors awaken the power of their minds to augment their physical might.',
        features: {
            3: [
                { name: 'Psionic Power', description: 'You have Psionic Energy Dice (d6 at L3, d8 at L5, d10 at L9, d12 at L13). Protctve Field: When you or a creature within 30 feet takes damage, use Reaction to expend 1 die and reduce damage by the roll plus INT mod. Psionic Strike: After hitting with a weapon within 30 feet, expend 1 die to deal Force damage equal to the roll plus INT mod. Telekinetic Movement: Magic action to move one object or creature (Large or smaller) up to 30 feet.' },
                { name: 'Psi Warrior Energy Dice', description: 'L3: 4d6, L5: 4d8, L9: 6d8, L11: 6d10, L13: 8d10, L17: 12d12.' }
            ],
            7: [{ name: 'Telekinetic Adept', description: 'Psi-Powered Leap: Bonus Action, gain Fly Speed equal to 2x your Speed until end of turn. Telekinetic Thrust: When you deal damage with Psionic Strike, force a STR save (DC 8+INT+PB) to give the target Prone or transport it 10 feet horizontally.' }],
            10: [{ name: 'Guarded Mind', description: 'You have Resistance to Psychic damage. If you start your turn with Charmed or Frightened, expend 1 Psionic Energy Die to end every effect giving you those conditions.' }],
            15: [{ name: 'Bulwark of Force', description: 'Bonus Action: Choose creatures within 30 feet (up to INT mod), granting each Half Cover for 1 minute or until Incapacitated. Once per Long Rest, or by expending 1 Psionic Energy Die.' }],
            18: [{ name: 'Telekinetic Master', description: 'You always have Telekinesis prepared, castable without spell slot or components (INT). While maintaining Concentration, you can make one weapon attack as a Bonus Action each turn.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 3,
  suggestedArray: { STR: 15, DEX: 14, CON: 13, CHA: 12, WIS: 10, INT: 8 }
};
