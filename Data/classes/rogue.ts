
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const rogue = {
  details: { 
    name: 'Rogue', 
    description: 'Masters of stealth, ingenuity, and precision. Rogues exploit their enemies\' weaknesses to deal lethal blows and are experts at overcoming any obstacle.', 
    traits: [
        { name: 'Sneak Attack', description: 'Once per turn, you deal extra damage (1d6 at lvl 1, scales) to a creature you hit with Advantage or that has an ally nearby.' }, 
        { name: 'Expertise', description: 'Choose two skills to double your proficiency bonus.' }, 
        { name: 'Weapon Mastery', description: 'You master the mastery properties of two types of weapons (Finesse or Light).' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'INT'] as Ability[],
  statPriorities: ['DEX', 'INT', 'CON'] as Ability[],
  skillData: { count: 4, options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] as Skill[] },
  progression: { 
    1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'], 
    2: ['Cunning Action'], 
    3: ['Rogue Subclass', 'Steady Aim'], 
    4: ['Ability Score Improvement'], 
    5: ['Cunning Strike', 'Uncanny Dodge'], 
    6: ['Expertise'],
    7: ['Evasion', 'Reliable Talent'], 
    8: ['Ability Score Improvement'], 
    9: ['Subclass Feature'], 
    10: ['Ability Score Improvement'], 
    11: ['Improved Cunning Strike'], 
    12: ['Ability Score Improvement'], 
    13: ['Subclass Feature'], 
    14: ['Devious Strikes'], 
    15: ['Slippery Mind'], 
    16: ['Ability Score Improvement'], 
    17: ['Subclass Feature'],
    18: ['Elusive'], 
    19: ['Epic Boon Feat'], 
    20: ['Stroke of Luck'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Arcane Trickster',
        description: 'Rogues who combine stealth and agility with arcane spells, experts in pranks and survival.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'Intelligence-based spellcasting (using the Wizard list). See spell table.' },
                { name: 'Mage Hand Legerdemain', description: 'Your Mage Hand is invisible. You can use it to steal, use thief\'s tools, or pick locks as a bonus action.' }
            ],
            9: [{ name: 'Magical Ambush', description: 'If you are hidden when you cast a spell at a creature, they have disadvantage on the save against that spell.' }],
            13: [{ name: 'Versatile Trickster', description: 'You can use your Mage Hand to distract an enemy: as a bonus action, choose an enemy within 5 feet of the hand to use your Cunning Strike options.' }],
            17: [{ name: 'Spell Thief', description: 'As a reaction when affected by a spell, you can force the caster to save. If they fail, the spell doesn\'t affect you and you "steal" the spell to use for 8 hours.' }]
        }
    },
    {
        name: 'Assassin',
        description: 'Trained killers, spies, and bounty hunters who eliminate their targets with terrifying efficiency.',
        features: {
            3: [
                { name: 'Assassinate', description: 'Advantage on initiative. In the first combat round, you have advantage against creatures that haven\'t acted and your Sneak Attack deals extra damage equal to your level.' },
                { name: 'Assassin\'s Tools', description: 'You gain proficiency with the Disguise Kit and Poisoner\'s Kit.' }
            ],
            9: [
                { name: 'Masterful Mimicry', description: 'You can perfectly mimic speech and writing after studying someone for 1 hour.' },
                { name: 'Roving Aim', description: 'Your speed is not reduced to 0 when using Steady Aim.' }
            ],
            13: [{ name: 'Envenom Weapons', description: 'When using the poison option of Cunning Strike, you deal 2d6 extra poison damage ignoring resistances.' }],
            17: [{ name: 'Death Strike', description: 'In the first combat round, when hitting with Sneak Attack, the target must save Constitution or take double damage.' }]
        }
    },
    {
        name: 'Thief',
        description: 'The archetype of the adventurer: a mix of thief, treasure hunter, and explorer of ruins.',
        features: {
            3: [
                { name: 'Fast Hands', description: 'As a bonus action you can take the Use an Object action, Use a Magic Object, or make a Sleight of Hand / Thieves\' Tools check.' },
                { name: 'Second-Story Work', description: 'You gain a climbing speed equal to your current speed. Jumps use Dexterity instead of Strength.' }
            ],
            9: [{ name: 'Supreme Sneak', description: 'You gain the Stealth Attack option (Cunning Strike): for 1 damage die, if you are invisible from Hide, the attack doesn\'t reveal your position behind cover.' }],
            13: [
                { name: 'Use Magic Device', description: 'You can attune to up to 4 magic items. When using an item with charges, a 6 on 1d6 doesn\'t spend the charge. You can use any spell scroll.' }
            ],
            17: [{ name: 'Thief\'s Reflexes', description: 'You are so fast that you get two turns during the first round of any combat.' }]
        }
    },
    {
        name: 'Magic Stealer',
        description: 'Rogues who specialize in stealing the magical power of others, using their abilities to drain magic from allies and enemies.',
        features: {
            3: [
                { name: 'Empower Sneak Attack', description: 'Reaction (after seeing someone cast spell lvl 1+ within 30 feet): You absorb energy. The next time you use Sneak Attack, you add 1d6 Force damage per level of the absorbed spell. Uses = INT mod.' },
                { name: 'Drain Magic', description: 'Magic action: Touch a willing creature to end a spell of lvl 1 or 2 on them. The target recovers a spell slot of level 2 or lower. 1/Short Rest.' }
            ],
            9: [{ name: 'Magical Sabotage', description: 'New Cunning Strike options (Cunning Attack): Spell Susceptibility (2d6, disadvantage on saves vs spells), Disrupt Spell (3d6, INT save or lose the spell), Steal Resistance (2d6, you steal a resistance).' }],
            13: [
                { name: 'Occult Shroud', description: 'After finishing a long rest, you can cast Nondetection on yourself (duration 24 hours, uses your Intelligence).' },
                { name: 'Improved Drain Magic', description: 'Drain Magic is now a bonus action and can affect spells and recover slots up to level 3.' }
            ],
            17: [{ name: 'Eldritch Implosion', description: 'When using Empower Sneak Attack, you can force a Constitution save (DC 8 + DEX + PB) or the spell dissipates and the target is stunned.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10, STR: 8 }
};
