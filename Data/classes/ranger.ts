
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
        description: 'Bond with a Primal Beast. A Beast Master forms a mystical bond with a special animal, drawing on primal magic and a deep connection to the natural world.',
        features: {
            3: [{ name: 'Primal Companion', description: 'You magically summon a primal beast (Beast of the Land, Beast of the Sea, or Beast of the Sky). In Combat, the beast acts during your turn. It can move and use its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus Action to command it. You can also sacrifice one of your attacks when you take the Attack action to command the beast to take the Beast\'s Strike action. If you have the Incapacitated condition, the beast acts on its own.' }],
            7: [{ name: 'Exceptional Training', description: 'When you take a Bonus Action to command your Primal Companion beast to take an action, you can also command it to take the Dash, Disengage, Dodge, or Help action using its Bonus Action. In addition, whenever it hits with an attack roll and deals damage, it can deal your choice of Force damage or its normal damage type.' }],
            11: [{ name: 'Bestial Fury', description: 'When you command your Primal Companion beast to take the Beast\'s Strike action, the beast can use it twice. In addition, the first time each turn it hits a creature under the effect of your Hunter\'s Mark spell, the beast deals extra Force damage equal to the bonus damage of that spell.' }],
            15: [{ name: 'Share Spells', description: 'When you cast a spell targeting yourself, you can also affect your Primal Companion beast with the spell if the beast is within 30 feet of you.' }]
        }
    },
    {
        name: 'Fey Wanderer',
        description: 'Wield Fey Mirth and Fury. A fey mystique surrounds you, thanks to the boon of an archfey or a location in the Feywild that transformed you.',
        features: {
            3: [
                { name: 'Dreadful Strikes', description: 'You can augment your weapon strikes with mind-scarring magic drawn from the murky hollows of the Feywild. When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage to the target. The extra damage increases to 1d6 when you reach Ranger level 11.' },
                { name: 'Fey Wanderer Spells', description: 'L3: Charm Person. L5: Misty Step. L9: Summon Fey. L13: Dimension Door. L17: Mislead.' },
                { name: 'Otherworldly Glamour', description: 'Whenever you make a Charisma check, you gain a bonus to the check equal to your Wisdom modifier. You also gain proficiency in one of these skills of your choice: Deception, Performance, or Persuasion.' }
            ],
            7: [{ name: 'Beguiling Twist', description: 'You have advantage on saving throws to avoid or end the Charmed or Frightened condition. Whenever you or a creature you can see within 120 feet of you succeeds on a saving throw to avoid or end the Charmed or Frightened condition, you can take a Reaction to force a different creature you can see within 120 feet to make a Wisdom save against your spell save DC.' }],
            11: [{ name: 'Fey Reinforcements', description: 'You can cast Summon Fey without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn\'t require Concentration.' }],
            15: [{ name: 'Misty Wanderer', description: 'You can cast Misty Step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier, and you regain all expended uses when you finish a Long Rest. Whenever you cast Misty Step, you can bring along one willing creature you can see within 5 feet of yourself.' }]
        }
    },
    {
        name: 'Gloom Stalker',
        description: 'Draw on Shadow Magic to Fight Your Foes. Gloom Stalkers are at home in the darkest places, wielding magic drawn from the Shadowfell to combat enemies that lurk in darkness.',
        features: {
            3: [
                { name: 'Dread Ambusher', description: 'Ambusher\'s Leap: At the start of your first turn of each combat, your speed increases by 10 feet until the end of that turn. Dreadful Strike: When you attack a creature and hit it with a weapon, you can deal an extra 2d6 Psychic damage. Initiative Bonus: When you roll Initiative, you can add your Wisdom modifier to the roll.' },
                { name: 'Gloom Stalker Spells', description: 'L3: Disguise Self. L5: Rope Trick. L9: Fear. L13: Greater Invisibility. L17: Seeming.' },
                { name: 'Umbral Sight', description: 'You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range increases by 60 feet. You are also adept at evading creatures that rely on Darkvision. While entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you in that Darkness.' }
            ],
            7: [{ name: 'Iron Mind', description: 'You have honed your ability to resist mind-altering powers. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws.' }],
            11: [{ name: 'Stalker\'s Flurry', description: 'The Psychic damage of your Dreadful Strike becomes 2d8. In addition, when you use the Dreadful Strike effect, you can use one of the following: Sudden Strike (make another attack with the same weapon against a different creature within 5 feet of the original target) or Mass Fear (target and each creature within 10 feet must make a Wisdom save or be Frightened until the start of your next turn).' }],
            15: [{ name: 'Shadowy Dodge', description: 'When a creature makes an attack roll against you, you can take a Reaction to impose Disadvantage on that roll. Whether the attack hits or misses, you can teleport up to 30 feet to an unoccupied space that you can see.' }]
        }
    },
    {
        name: 'Hunter',
        description: 'Protect Nature and People from Destruction. You stalk prey in the wilds and elsewhere, using your abilities as a Hunter to protect nature and people everywhere from forces that would destroy them.',
        features: {
            3: [
                { name: 'Hunter\'s Lore', description: 'While a creature is marked by your Hunter\'s Mark, you know whether the creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are.' },
                { name: 'Hunter\'s Prey', description: 'You gain one of the following feature options of your choice: Colossus Slayer (When you hit a creature with a weapon, the weapon deals extra 1d8 damage if it\'s missing any of its Hit Points) or Horde Breaker (Once on each of your turns when you make an attack with a weapon, you can make another attack with the same weapon against a different creature within 5 feet of the original target).' }
            ],
            7: [{ name: 'Defensive Tactics', description: 'Escape the Horde: Opportunity Attacks have Disadvantage against you. OR Multiattack Defense: When a creature hits you with an attack roll, that creature has Disadvantage on all other attack rolls against you this turn.' }],
            11: [{ name: 'Superior Hunter\'s Prey', description: 'Once per turn when you deal damage to a creature marked by your Hunter\'s Mark, you can also deal that spell\'s extra damage to a different creature that you can see within 30 feet of the first creature.' }],
            15: [{ name: 'Superior Hunter\'s Defense', description: 'When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, INT: 10, CHA: 8 }
};
