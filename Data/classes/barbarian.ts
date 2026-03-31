
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
        description: 'Barbarians who channel their fury toward pure violence.', 
        features: { 
            3: [{ name: 'Frenzy', description: 'When using Reckless Attack while raging, you deal extra damage equal to rage damage dice to the first target hit.' }],
            6: [{ name: 'Mindless Rage', description: 'Immunity to Charmed and Frightened while raging. If you enter rage while affected, the effect is suspended.' }],
            10: [{ name: 'Retaliation', description: 'When you take damage from a creature within 5 feet, use your reaction to make a melee attack against it.' }],
            14: [{ name: 'Intimidating Presence', description: 'As a bonus action, frighten creatures in a 30-foot area (DC 8+STR+PB). Lasts 1 minute.' }]
        } 
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Believers that their fury connects them with the cosmic ash tree Yggdrasil.', 
        features: { 
            3: [{ name: 'Vitality of the Tree', description: 'You gain THP (d6 dice = PB) when entering rage and can grant THP to allies at the start of each turn.' }],
            6: [{ name: 'Branches of the Tree', description: 'While raging, you can teleport creatures within 30 feet of you using a reaction (DC STR).' }],
            10: [{ name: 'Battering Roots', description: 'Your heavy or versatile weapons gain +10 feet reach. You can use Push or Topple in addition to another mastery.' }],
            14: [{ name: 'Travel along the Tree', description: 'Bonus action to teleport up to 60 feet and bring up to 5 allies with you.' }]
        } 
    },
    { 
        name: 'Path of the Wild Heart', 
        description: 'Barbarians in communion with the spirits of nature.', 
        features: { 
            3: [
                { name: 'Animal Speaker', description: 'You can cast Beast Sense and Speak with Animals as rituals (uses WIS).' },
                { name: 'Rage of the Wilds', description: 'While raging choose: Bear (Resistance to almost everything), Eagle (BA Dash/Disengage), or Wolf (Ally advantage).' }
            ],
            6: [{ name: 'Aspect of the Wilds', description: 'Passive upgrade: Owl (Darkvision 60ft), Panther (Climbing Speed), or Salmon (Swimming Speed).' }],
            10: [{ name: 'Nature Speaker', description: 'You can cast Commune with Nature as a ritual.' }],
            14: [{ name: 'Power of the Wilds', description: 'Rage upgrade: Falcon (Flight), Lion (Enemy disadvantage on attacks), or Ram (Knock Prone on hit).' }]
        } 
    },
    {
        name: 'Path of the Zealot',
        description: 'Barbarians blessed by a god with divine power.',
        features: {
            3: [
                { name: 'Divine Fury', description: 'While raging, the first hit each turn deals 1d6 + half your level Radiant or Necrotic damage.' },
                { name: 'Warrior of the Gods', description: 'Healing reserve (4d12). As a bonus action, heal yourself. Recovers on Long Rest.' }
            ],
            6: [
                { name: 'Fanatical Focus', description: 'Once per rage, repeat a failed save adding your rage damage as a bonus.' }
            ],
            10: [
                { name: 'Zealous Presence', description: 'Battle cry (10 allies): Advantage on attacks and saves until your next turn.' }
            ],
            14: [
                { name: 'Rage of the Gods', description: 'Divine form (1 min): Flight, Necrotic/Radiant/Psychic Resistances and you can save an ally from death.' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, INT: 8 }
};
