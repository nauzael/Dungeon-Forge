
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const ranger = {
  details: { 
    name: 'Ranger', 
    description: 'Warriors of nature who guard the frontiers of civilization. They combine lethal combat, tracking, and primal magic to protect the world from monsters and tyrants.', 
    traits: [
        { name: 'Spellcasting', description: 'Wisdom-based primal magic. You are a prepared spellcaster.' }, 
        { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. You can cast it for free several times per day.' }, 
        { name: 'Weapon Mastery', description: 'You master the mastery properties of two types of weapons.' }
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
        description: 'Explorers who form a mystic bond with a special beast, relying on primal magic to fight in harmony.',
        features: {
            3: [{ name: 'Primal Companion', description: 'You summon a beast spirit (Land, Sea, or Sky). In combat, it acts on your turn and obeys your orders (Bonus action to command to attack).' }],
            7: [{ name: 'Exceptional Training', description: 'You can order your beast to use Dash, Disengage, Dodge, or Help as a bonus action. Its attacks can now deal Force damage.' }],
            11: [{ name: 'Bestial Fury', description: 'Your beast can attack twice. Additionally, it deals extra damage (equal to Hunter\'s Mark) if the target is marked by you.' }],
            15: [{ name: 'Share Spells', description: 'When you cast a spell on yourself, you can also affect your beast if it is within 30 feet.' }]
        }
    },
    {
        name: 'Fey Wanderer',
        description: 'Explorers who embody the joy and dread of the feywilds, imbuing their attacks with otherworldly magic.',
        features: {
            3: [
                { name: 'Dreadful Strike', description: 'Once per turn, when hitting with a weapon, you deal 1d4 extra Psychic damage. The die scales with level.' },
                { name: 'Otherworldly Glamour', description: 'You gain a bonus to Charisma checks equal to your Wisdom modifier.' }
            ],
            7: [{ name: 'Beguiling Twist', description: 'When someone near you succeeds on a save against Charmed or Frightened, you can try to redirect the effect to another creature.' }],
            11: [{ name: 'Fey Wilds Summons', description: 'You can cast Summon Fey without spending a spell slot once per day.' }],
            15: [{ name: 'Misty Wanderer', description: 'You can cast Misty Step multiple times without spending a slot and you can bring an ally with you.' }]
        }
    },
    {
        name: 'Gloom Stalker',
        description: 'Masters of ambush and darkness, drawing on Shadowfell magic to hunt the horrors that lurk in shadows.',
        features: {
            3: [
                { name: 'Dread Ambusher', description: '+10 feet speed on the first turn. You can deal 2d6 extra Psychic damage (WIS uses/day). Add Wisdom to Initiative.' },
                { name: 'Umbral Sight', description: 'Darkvision 60 feet (or +60 if you already have it). You are Invisible to creatures using Darkvision in total darkness.' },
                { name: 'Gloom Stalker Spells', description: 'Spells like Disguise Self, Rope Trick, and Fear.' }
            ],
            7: [{ name: 'Iron Mind', description: 'You gain proficiency in Wisdom saving throws (or Intelligence/Charisma if you already had it).' }],
            11: [{ name: 'Stalker\'s Flurry', description: 'The Dreadful Strike damage increases to 2d8. If you miss an attack after using it, you can make another attack as part of the same action.' }],
            15: [{ name: 'Shadowy Dodge', description: 'Reaction: Impose Disadvantage on an attacker you can see. If the attack misses, you can teleport 30 feet.' }]
        }
    },
    {
        name: 'Hunter',
        description: 'Definitive hunters, experts in tracking and defeating the most formidable prey of nature.',
        features: {
            3: [
                { name: 'Hunter\'s Lore', description: 'While an enemy is marked by Hunter\'s Mark, you know their immunities, resistances, and vulnerabilities.' },
                { name: 'Hunter\'s Prey', description: 'Choose a specialty (exchangeable on long rest): Colossus Slayer (+1d8 damage to wounded) or Horde Breaker (extra attack to adjacent target).' }
            ],
            7: [{ name: 'Defensive Tactics', description: 'Choose (exchangeable): Escape the Horde (disadvantage to op. attacks) or Multiattack Defense (+4 AC after being hit).' }],
            11: [{ name: 'Superior Hunter\'s Prey', description: 'Once per turn, when you damage the target of your Hunter\'s Mark, you can deal the extra damage to another creature within 30 feet.' }],
            15: [{ name: 'Superior Hunter\'s Defense', description: 'Reaction: When taking damage, you gain Resistance to that damage and any other damage of the same type until the end of your turn.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, INT: 10, CHA: 8 }
};
