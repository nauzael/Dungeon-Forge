
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const barbarian = {
  details: { 
    name: 'Barbarian', 
    description: 'Powerful warriors driven by primal forces that manifest as Rage. More than an emotion, Rage is the embodiment of a predator\'s ferocity and the fury of the storm. Barbarians channel this primal power to gain extraordinary strength and endurance, becoming an unstoppable force on the battlefield.',
    traits: [
        { name: 'Rage', description: 'You can imbue yourself with a primal power called Rage, a force that grants you extraordinary strength and endurance. You can enter it as a Bonus Action if you aren\'t wearing Heavy Armor. You have a number of uses based on your Barbarian level (2 at level 1). You regain one use when you finish a Short Rest and all uses when you finish a Long Rest. While active: Resistance to Bludgeoning, Piercing, and Slashing damage; damage bonus on Strength-based attacks (+2); Advantage on Strength checks and saving throws; you can\'t maintain Concentration or cast spells. Lasts until the end of your next turn (you extend it by attacking, forcing a save, or using a Bonus Action). Maximum 10 minutes.' }, 
        { name: 'Unarmored Defense', description: 'While you aren\'t wearing armor, your base Armor Class (AC) is 10 + your Dexterity modifier + your Constitution modifier. You can use a Shield and still benefit from this feature.' }, 
        { name: 'Weapon Mastery', description: 'Your training with weapons allows you to use the mastery properties of two Simple or Martial melee weapon types of your choice. When you finish a Long Rest, you can change one of those weapon options for a different one.' }
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
     6: ['Subclass Feature'],
     7: ['Feral Instinct', 'Instinctive Pounce'],
    8: ['Ability Score Improvement'], 
     9: ['Brutal Strike'],
     10: ['Subclass Feature'],
     11: ['Relentless Rage'],
    12: ['Ability Score Improvement'], 
     13: ['Improved Brutal Strike'],
     14: ['Subclass Feature'],
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
        description: 'Channel Rage into Violent Fury. Barbarians who follow the Path of the Berserker direct their Rage primarily toward violence. Their path is one of unrestrained fury, and they revel in the chaos of battle as they allow their Rage to dominate and strengthen them. These barbarians are known for their ability to deal devastating damage while maintaining a terrifying presence on the battlefield.', 
        features: { 
            3: [{ name: 'Frenzy', description: 'If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. Roll a number of d6 equal to your Rage damage bonus and add them. The extra damage is the same type as the weapon or Unarmed Strike used for the attack.' }],
            6: [{ name: 'Mindless Rage', description: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you are Charmed or Frightened when you enter Rage, the condition ends automatically when you activate it.' }],
            10: [{ name: 'Retaliation', description: 'When you take damage from a creature within 5 feet of you, you can use your Reaction to make a melee attack against it, using a weapon or an Unarmed Strike.' }],
            14: [{ name: 'Intimidating Presence', description: 'As a Bonus Action, you can instill terror in others with your threatening presence and primal power. When you do, each creature you choose in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 + your Strength modifier + your Proficiency Bonus). On a failure, the creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature\'s turns, it repeats the save, ending the effect on itself on a success. Once you use this feature, you can\'t use it again until you finish a Long Rest, unless you expend a use of your Rage (no action required) to restore its use.' }]
        } 
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Trace the Roots and Branches of the Multiverse. Barbarians who follow the Path of the World Tree connect with the cosmic tree Yggdrasil through their Rage. This tree grows among the Outer Planes, connecting them to each other and to the Material Plane. These barbarians draw the tree\'s magic for vitality and as a means of dimensional travel, channeling its power to protect their allies and manipulate the battlefield.', 
        features: { 
            3: [{ name: 'Vitality of the Tree', description: 'Your Rage connects with the life force of the World Tree. Vitality Surge: When you activate your Rage, you gain Temporary Hit Points equal to your Barbarian level. Vital Force: At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet of you to gain Temporary Hit Points. To determine the amount, roll a number of d6 equal to your Rage damage bonus and add them. If any of these Temporary Hit Points remain when your Rage ends, they disappear.' }],
            6: [{ name: 'Branches of the Tree', description: 'When a creature you can see starts its turn within 30 feet of you while your Rage is active, you can use your Reaction to summon spectral branches of the World Tree around it. The target must succeed on a Strength saving throw (DC 8 + your Strength modifier + your Proficiency Bonus) or be teleported to an unoccupied space you can see within 5 feet of you or the nearest unoccupied space you can see. After the target is teleported, you can reduce its Speed to 0 until the end of the current turn.' }],
            10: [{ name: 'Battering Roots', description: 'During your turn, your melee reach increases by 10 feet with any melee weapon that has the Heavy or Versatile property, as tendrils of the World Tree extend from you. When you hit with such a weapon on your turn, you can activate the Push or Topple mastery property in addition to another different mastery property you are using with that weapon.' }],
            14: [{ name: 'Travel along the Tree', description: 'When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see. Additionally, once per Rage, you can increase the range of that teleport to 150 feet. When you do so, you can also bring up to six willing creatures within 10 feet of you. Each creature teleports to an unoccupied space of your choice within 10 feet of your destination space.' }]
        } 
    },
    { 
        name: 'Path of the Wild Heart', 
        description: 'Walk in Communion with the Animal World. Barbarians who follow the Path of the Wild Heart consider themselves kin to animals. These barbarians learn magical means to communicate with animals, and their Rage increases their connection to the natural world while filling them with supernatural power, allowing them to adopt the characteristics of various beasts.', 
        features: { 
            3: [
                { name: 'Animal Speaker', description: 'You can cast the spells Beast Sense and Speak with Animals, but only as Rituals. Wisdom is your spellcasting ability for these spells.' },
                { name: 'Rage of the Wilds', description: 'Your Rage harnesses the primal power of animals. Each time you activate your Rage, you gain one of the following options of your choice: Bear (While your Rage is active, you have Resistance to all damage types except Force, Necrotic, Psychic, and Radiant); Eagle (When you activate your Rage, you can take the Disengage and Dash actions as part of that Bonus Action. While your Rage is active, you can use a Bonus Action to take both actions); Wolf (While your Rage is active, your allies have Advantage on attack rolls against any enemy of yours within 5 feet of you).' }
            ],
            6: [{ name: 'Aspect of the Wilds', description: 'You gain one of the following options of your choice. Whenever you finish a Long Rest, you can change your choice: Owl (You have Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet); Panther (You have a Climb Speed equal to your Speed); Salmon (You have a Swim Speed equal to your Speed).' }],
            10: [{ name: 'Nature Speaker', description: 'You can cast the spell Commune with Nature, but only as a Ritual. Wisdom is your spellcasting ability for this spell.' }],
            14: [{ name: 'Power of the Wilds', description: 'Each time you activate your Rage, you gain one of the following options of your choice: Hawk (While your Rage is active, you have a Fly Speed equal to your Speed if you aren\'t wearing armor); Lion (While your Rage is active, any enemy of yours within 5 feet of you has Disadvantage on attack rolls against targets other than you or another Barbarian who has this option active); Ram (While your Rage is active, you can cause a Large or smaller creature to fall Prone when you hit it with a melee attack).' }]
        } 
    },
    {
        name: 'Path of the Zealot',
        description: 'Rage in Ecstatic Union with a God. Barbarians who follow the Path of the Zealot receive gifts from a god or pantheon. These barbarians experience their Rage as an ecstatic episode of divine union that infuses them with power, gaining sacred abilities to destroy their enemies and protect their allies with divine fury.',
        features: {
            3: [
                { name: 'Divine Fury', description: 'You can channel divine power into your strikes. On each of your turns while your Rage is active, the first creature you hit with a weapon or Unarmed Strike takes extra damage equal to 1d6 plus half your Barbarian level (rounded down). The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage.' },
                { name: 'Warrior of the Gods', description: 'A divine entity helps ensure you can continue the fight. You have a pool of four d12s that you can expend to heal yourself. As a Bonus Action, you can expend dice from the pool, roll them, and regain a number of Hit Points equal to the total rolled. Your pool regains all expended dice when you finish a Long Rest. The maximum number of dice in the pool increases by one when you reach Barbarian levels 6 (5 dice), 12 (6 dice), and 17 (7 dice).' }
            ],
            6: [
                { name: 'Fanatical Focus', description: 'Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage damage bonus, and you must use the new roll.' }
            ],
            10: [
                { name: 'Zealous Presence', description: 'As a Bonus Action, you emit a battle cry imbued with divine energy. Up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can\'t use it again until you finish a Long Rest, unless you expend a use of your Rage (no action required) to restore its use.' }
            ],
            14: [
                { name: 'Rage of the Gods', description: 'When you activate your Rage, you can assume the form of a divine warrior. This form lasts 1 minute or until your Hit Points are reduced to 0. Once you use this feature, you can\'t do so again until you finish a Long Rest. While in this form, you gain: Flight (you have a Fly Speed equal to your Speed and can hover), Resistance (you have Resistance to Necrotic, Psychic, and Radiant damage), and Revivification (when a creature within 30 feet of you would be reduced to 0 Hit Points, you can use your Reaction to expend a use of your Rage and instead change the target\'s Hit Points to a number equal to your Barbarian level).' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, INT: 8 }
};
