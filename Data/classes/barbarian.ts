
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const barbarian = {
  details: { 
    name: 'Barbarian', 
    description: 'Powerful warriors driven by primal forces that manifest as Rage. More than an emotion, this Rage is the embodiment of a predator\'s ferocity and the storm.',
    traits: [
        { name: 'Rage', description: 'As a bonus action, you enter Rage if you are not wearing heavy armor. You gain resistance to physical damage, extra damage on Strength attacks, and advantage on Strength checks/saves.' }, 
        { name: 'Unarmored Defense', description: 'Without armor, your AC is 10 + DEX + CON. You can use a shield.' }, 
        { name: 'Weapon Mastery', description: 'You master the mastery properties of two types of melee weapons.' }
    ] 
  } as DetailData,
  hitDie: 12,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] as Skill[] },
  progression: { 
    1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 
    2: ['Danger Sense', 'Reckless Attack'], 
    3: ['Barbarian Subclass', 'Primal Knowledge'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Fast Movement'], 
    7: ['Feral Instinct', 'Instinctive Pounce'],
    8: ['Ability Score Improvement'], 
    9: ['Brutal Strike'], 
    11: ['Relentless Rage'], 
    12: ['Ability Score Improvement'], 
    13: ['Improved Brutal Strike'], 
    15: ['Persistent Rage'], 
    16: ['Ability Score Improvement'], 
    17: ['Improved Brutal Strike (2nd Effect)'],
    18: ['Indomitable Might'], 
    19: ['Epic Boon Feat'], 
    20: ['Primal Champion'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Path of the Berserker', 
        description: 'Channel Rage into Violent Fury. Barbarians who walk the Path of the Berserker direct their Rage primarily toward violence. Their path is one of untrammeled fury, and they thrill in the chaos of battle as they allow their Rage to seize and empower them.', 
        features: { 
            3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack.' }],
            6: [{ name: 'Mindless Rage', description: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you\'re Charmed or Frightened when you enter your Rage, the condition ends on you.' }],
            10: [{ name: 'Retaliation', description: 'When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.' }],
            14: [{ name: 'Intimidating Presence', description: 'As a Bonus Action, you can strike terror into others with your menacing presence and primal power. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, a creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature\'s turns, the creature repeats the save, ending the effect on itself on a success. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.' }]
        } 
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Trace the Roots and Branches of the Multiverse. Barbarians who follow the Path of the World Tree connect with the cosmic tree Yggdrasil through their Rage. This tree grows among the Outer Planes, connecting them to each other and the Material Plane. These Barbarians draw on the tree\'s magic for vitality and as a means of dimensional travel.', 
        features: { 
            3: [{ name: 'Vitality of the Tree', description: 'Your Rage taps into the life force of the World Tree. Vitalitiy Surge: When you activate your Rage, you gain a number of Temporary Hit Points equal to your Barbarian level. Life-Giving Force: At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet of yourself to gain Temporary Hit Points. To determine the number of Temporary Hit Points, roll a number of d6s equal to your Rage Damage bonus, and add them together. If any of these Temporary Hit Points remain when your Rage ends, they vanish.' }],
            6: [{ name: 'Branches of the Tree', description: 'Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral branches of the World Tree around it. The target must succeed on a Strength saving throw (DC 8 plus your Strength modifier and Proficiency Bonus) or be teleported to an unoccupied space you can see within 5 feet of yourself or in the nearest unoccupied space you can see. After the target teleports, you can reduce its Speed to 0 until the end of the current turn.' }],
            10: [{ name: 'Battering Roots', description: 'During your turn, your reach is 10 feet greater with any Melee weapon that has the Heavy or Versatile property, as tendrils of the World Tree extend from you. When you hit with such a weapon on your turn, you can activate the Push or Topple mastery property in addition to a different mastery property you\'re using with that weapon.' }],
            14: [{ name: 'Travel along the Tree', description: 'When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see. In addition, once per Rage, you can increase the range of that teleport to 150 feet. When you do so, you can also bring up to six willing creatures who are within 10 feet of you. Each creature teleports to an unoccupied space of your choice within 10 feet of your destination space.' }]
        } 
    },
    { 
        name: 'Path of the Wild Heart', 
        description: 'Walk in Community with the Animal World. Barbarians who follow the Path of the Wild Heart view themselves as kin to animals. These Barbarians learn magical means to communicate with animals, and their Rage heightens their connection to animals as it fills them with supernatural might.', 
        features: { 
            3: [
                { name: 'Animal Speaker', description: 'You can cast the Beast Sense and Speak with Animals spells but only as Rituals. Wisdom is your spellcasting ability for them.' },
                { name: 'Rage of the Wilds', description: 'Your Rage taps into the primal power of animals. Whenever you activate your Rage, you gain one of the following options of your choice: Bear (While your Rage is active, you have Resistance to every damage type except Force, Necrotic, Psychic, and Radiant), Eagle (When you activate your Rage, you can take the Disengage and Dash actions as part of that Bonus Action. While your Rage is active, you can take a Bonus Action to take both of those actions), Wolf (While your Rage is active, your allies have Advantage on attack rolls against any enemy of yours within 5 feet of you).' }
            ],
            6: [{ name: 'Aspect of the Wilds', description: 'You gain one of the following options of your choice. Whenever you finish a Long Rest, you can change your choice: Owl (You have Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet), Panther (You have a Climb Speed equal to your Speed), Salmon (You have a Swim Speed equal to your Speed).' }],
            10: [{ name: 'Nature Speaker', description: 'You can cast the Commune with Nature spell but only as a Ritual. Wisdom is your spellcasting ability for it.' }],
            14: [{ name: 'Power of the Wilds', description: 'Whenever you activate your Rage, you gain one of the following options of your choice: Falcon (While your Rage is active, you have a Fly Speed equal to your Speed if you aren\'t wearing any armor), Lion (While your Rage is active, any of your enemies within 5 feet of you have Disadvantage on attack rolls against targets other than you or another Barbarian who has this option active), Ram (While your Rage is active, you can cause a Large or smaller creature to have the Prone condition when you hit it with a melee attack).' }]
        } 
    },
    {
        name: 'Path of the Zealot',
        description: 'Rage in Ecstatic Union with a God. Barbarians who walk the Path of the Zealot receive boons from a god or pantheon. These Barbarians experience their Rage as an ecstatic episode of divine union that infuses them with power.',
        features: {
            3: [
                { name: 'Divine Fury', description: 'You can channel divine power into your strikes. On each of your turns while your Rage is active, the first creature you hit with a weapon or an Unarmed Strike takes extra damage equal to 1d6 plus half your Barbarian level (round down). The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage.' },
                { name: 'Warrior of the Gods', description: 'A divine entity helps ensure you can continue the fight. You have a pool of four d12s that you can spend to heal yourself. As a Bonus Action, you can expend dice from the pool, roll them, and regain a number of Hit Points equal to the roll\'s total. Your pool regains all expended dice when you finish a Long Rest. The pool\'s maximum number of dice increases by one when you reach Barbarian levels 6 (5 dice), 12 (6 dice), and 17 (7 dice).' }
            ],
            6: [
                { name: 'Fanatical Focus', description: 'Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus, and you must use the new roll.' }
            ],
            10: [
                { name: 'Zealous Presence', description: 'As a Bonus Action, you unleash a battle cry infused with divine energy. Up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it.' }
            ],
            14: [
                { name: 'Rage of the Gods', description: 'When you activate your Rage, you can assume the form of a divine warrior. This form lasts for 1 minute or until you drop to 0 Hit Points. Once you use this feature, you can\'t do so again until you finish a Long Rest. While in this form, you gain: Flight (You have a Fly Speed equal to your Speed and can hover), Resistance (You have Resistance to Necrotic, Psychic, and Radiant damage), Revivification (When a creature within 30 feet of you would drop to 0 Hit Points, you can take a Reaction to expend a use of your Rage to instead change the target\'s Hit Points to a number equal to your Barbarian level).' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, INT: 8 }
};
