
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const ranger = {
  details: { 
    name: 'Ranger', 
    description: 'Warriors of nature who guard the frontiers of civilization. They combine lethal combat, tracking, and primal magic to protect the world from monsters and tyrants.', 
    traits: [
        { name: 'Spellcasting', description: 'You have learned to channel the magical essence of nature to cast spells. You are a prepared spellcaster. Wisdom is your spellcasting ability. You use a Druidic Focus.' }, 
        { name: 'Favored Enemy', description: 'You always have the spell Hunter\'s Mark prepared. You can cast it twice without expending a spell slot. You regain all uses when you finish a Long Rest. The number of uses increases at levels 5, 9, 13, and 17.' }, 
        { name: 'Weapon Mastery', description: 'Your training lets you use the mastery properties of two weapon types. When you finish a Long Rest, you can change your choice.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 3, options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'], 
    2: ['Deft Explorer', 'Fighting Style'], 
    3: ['Ranger Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack'], 
    6: ['Roving'],
    7: ['Subclass Feature'],
    8: ['Ability Score Improvement'], 
    9: ['Expertise'], 
    10: ['Tireless'], 
    11: ['Subclass Feature'],
    12: ['Ability Score Improvement'], 
    13: ['Relentless Hunter'], 
    14: ['Nature\'s Veil'], 
    15: ['Subclass Feature'],
    16: ['Ability Score Improvement'], 
    17: ['Precise Hunter'], 
    18: ['Feral Senses'], 
    19: ['Epic Boon Feat'], 
    20: ['Foe Slayer'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Beast Master',
        description: 'Bond with a Primal Beast. A Beast Master forms a mystical bond with a special animal, drawing on primal magic and a deep connection to the natural world.',
        features: {
            3: [{ name: 'Primal Companion', description: 'You magically summon a primal beast (Beast of Land, Air, or Sea). In combat, it acts on your turn; it only Dodges unless you command it with a Bonus Action or sacrifice an attack. If you are Incapacitated, it acts on its own. If it dies, Magic action + spell slot to revive it within 1 hour. New beast on Long Rest.' }],
            7: [{ name: 'Exceptional Training', description: 'When you command your Companion with a Bonus Action, it can also take Dash, Disengage, Dodge, or Help with its Bonus Action. Its attacks can deal Force damage.' }],
            11: [{ name: 'Bestial Fury', description: 'When you command Beast\'s Strike, the beast uses it twice. The first time it hits a creature under Hunter\'s Mark, it deals extra Force damage equal to that spell\'s bonus.' }],
            15: [{ name: 'Share Spells', description: 'When you cast a spell that targets you, it also affects your Companion if it is within 30 feet.' }]
        }
    },
    {
        name: 'Fey Wanderer',
        description: 'Wield Fey Mirth and Fury. A fey mystique surrounds you, thanks to the boon of an archfey or a location in the Feywild that transformed you.',
        features: {
            3: [
                { name: 'Dreadful Strikes', description: 'When you hit with a weapon, you deal an extra 1d4 Psychic damage (1d6 at level 11). Only once per turn.' },
                { name: 'Fey Wanderer Spells', description: 'You always have prepared: level 3: Charm Person; 5: Misty Step; 9: Summon Fey; 13: Dimension Door; 17: Mislead.' },
                { name: 'Otherworldly Glamour', description: 'You add your Wisdom modifier to Charisma checks. Proficiency in one skill: Deception, Performance, or Persuasion.' }
            ],
            7: [{ name: 'Beguiling Twist', description: 'Advantage on saves against Charmed/Frightened. When you or an ally within 120 feet succeeds on one, Reaction to force another creature to make a Wisdom save or be Charmed/Frightened for 1 minute.' }],
            11: [{ name: 'Fey Reinforcements', description: 'You cast Summon Fey without a material component. Once without a spell slot per Long Rest. You can modify it to not require Concentration (duration 1 minute).' }],
            15: [{ name: 'Misty Wanderer', description: 'You cast Misty Step without a spell slot. Uses = Wisdom per Long Rest. When you cast it, you bring a willing creature within 5 feet.' }]
        }
    },
    {
        name: 'Gloom Stalker',
        description: 'Draw on Shadow Magic to Fight Your Foes. Gloom Stalkers are at home in the darkest places, wielding magic drawn from the Shadowfell to combat enemies that lurk in darkness.',
        features: {
            3: [
                { name: 'Dread Ambusher', description: 'Ambusher\'s Leap: first turn, speed +10 feet. Dreadful Strike: when you hit, you deal an extra 2d6 Psychic damage. Uses = Wis per Long Rest. Initiative: you add Wisdom.' },
                { name: 'Gloom Stalker Spells', description: 'Always prepared: 3: Disguise Self; 5: Rope Trick; 9: Fear; 13: Greater Invisibility; 17: Seeming.' },
                { name: 'Umbral Sight', description: 'Darkvision 60 feet (or +60). In total Darkness, you are Invisible to creatures that rely on Darkvision.' }
            ],
            7: [{ name: 'Iron Mind', description: 'Proficiency in Wisdom (or Intelligence/Charisma if you already have it).' }],
            11: [{ name: 'Stalker\'s Flurry', description: 'Dreadful Strike damage becomes 2d8. When you use it: Sudden Strike (attack another creature within 5 feet) or Mass Fear (target and creatures within 10 feet Wis save or Frightened).' }],
            15: [{ name: 'Shadowy Dodge', description: 'When you are attacked, Reaction to impose Disadvantage. Hit or miss, teleport 30 feet.' }]
        }
    },
    {
        name: 'Hunter',
        description: 'Protect Nature and People from Destruction. You stalk prey in the wilds and elsewhere, using your abilities as a Hunter to protect nature and people everywhere from forces that would destroy them.',
        features: {
            3: [
                { name: 'Hunter\'s Lore', description: 'While a creature is marked by your Hunter\'s Mark, you know its Immunities, Resistances, and Vulnerabilities.' },
                { name: 'Hunter\'s Prey', description: 'Choose: Colossus Slayer (1d8 extra if it is missing HP, once per turn) or Horde Breaker (an extra attack against a creature within 5 feet of the original target). Changeable on a Rest.' }
            ],
            7: [{ name: 'Defensive Tactics', description: 'Choose: Escape the Horde (Opportunity Attacks with Disadvantage) or Multiattack Defense (if they hit you, they have Disadvantage on other attacks this turn). Changeable.' }],
            11: [{ name: 'Superior Hunter\'s Prey', description: 'Once per turn, when you damage a marked creature, you deal the extra Mark damage to another creature within 30 feet.' }],
            15: [{ name: 'Superior Hunter\'s Defense', description: 'When you take damage, Reaction for Resistance to that type until end of turn.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, INT: 10, CHA: 8 }
};
