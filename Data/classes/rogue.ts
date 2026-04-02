
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
        description: 'Enhance Stealth with Arcane Spells. Some Rogues enhance their fine-honed skills of stealth and agility with spells, learning magical tricks to aid them in their trade.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'You have learned to cast spells. You know three cantrips including Mage Hand and two other Wizard cantrips of your choice. At level 10, learn another Wizard cantrip. You prepare a list of Wizard spells; see Arcane Trickster Spellcasting table for prepared spells and slots.' },
                { name: 'Mage Hand Legerdemain', description: 'When you cast Mage Hand, you can cast it as a Bonus Action, and you can make the spectral hand Invisible. You can control the hand as a Bonus Action, and through it, you can make Dexterity (Sleight of Hand) checks.' }
            ],
            9: [{ name: 'Magical Ambush', description: 'If you have the Invisible condition when you cast a spell on a creature, it has Disadvantage on any saving throw it makes against the spell on the same turn.' }],
            13: [{ name: 'Versatile Trickster', description: 'You gain the ability to distract targets with your Mage Hand. When you use the Trip option of your Cunning Strike on a creature, you can also use that option on another creature within 5 feet of the spectral hand.' }],
            17: [{ name: 'Spell Thief', description: 'Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can take a Reaction to force the creature to make an Intelligence save (DC equals your spell save DC). On a failed save, you negate the spell\'s effect against you, and you steal the knowledge of the spell if it is at least level 1 and of a level you can cast. For the next 8 hours, you have the spell prepared. Once you steal a spell, you can\'t use this feature again until you finish a Long Rest.' }]
        }
    },
    {
        name: 'Assassin',
        description: 'Practice the Grim Art of Death. An Assassin\'s training focuses on using stealth, poison, and disguise to eliminate foes with deadly efficiency.',
        features: {
            3: [
                { name: 'Assassinate', description: 'Initiative: You have Advantage on Initiative rolls. Surprising Strikes: During the first round of each combat, you have Advantage on attack rolls against any creature that hasn\'t taken a turn. If your Sneak Attack hits any target during that round, the target takes extra damage of the weapon\'s type equal to your Rogue level.' },
                { name: 'Assassin\'s Tools', description: 'You gain a Disguise Kit and a Poisoner\'s Kit, and you have proficiency with them.' }
            ],
            9: [
                { name: 'Infiltration Expertise', description: 'Masterful Mimicry: You can unerringly mimic another person\'s speech, handwriting or both if you have spent at least 1 hour studying them. Roving Aim: Your speed isn\'t reduced to 0 by using Steady Aim.' }
            ],
            13: [{ name: 'Envenom Weapons', description: 'When you use the Poison option of your Cunning Strike, the target also takes 2d6 Poison damage whenever it fails the saving throw. This damage ignores Resistance to Poison damage.' }],
            17: [{ name: 'Death Strike', description: 'When you hit with your Sneak Attack on the first round of a combat, the target must succeed on a Constitution saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus), or the attack\'s damage is doubled against the target.' }]
        }
    },
    {
        name: 'Thief',
        description: 'Hunt for Treasure as a Classic Adventurer. A mix of burglar, treasure hunter, and explorer, the Thief is the epitome of an adventurer.',
        features: {
            3: [
                { name: 'Fast Hands', description: 'As a Bonus Action, you can do one of the following: Sleight of Hand (pick a lock or disarm a trap with Thieves\' Tools or pick a pocket), Use an Object (take the Utilize action or take the Magic action to use a magic item that requires an action).' },
                { name: 'Second Story Work', description: 'Climber: You gain a Climb Speed equal to your Speed. Jumper: You can determine your jump distance using your Dexterity rather than your Strength.' }
            ],
            9: [{ name: 'Supreme Sneak', description: 'New Cunning Strike option: Stealth Attack (Cost: 1d6). If you have the Hide action\'s Invisible condition, this attack doesn\'t end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover.' }],
            13: [
                { name: 'Use Magic Device', description: 'Attunement: You can attune to up to four magic items at once. Charges: Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges. Scrolls: You can use any Spell Scroll, using Intelligence as your spellcasting ability. If the spell is a cantrip or level 1, you can cast it reliably. For higher-level spells, you must succeed on an Intelligence (Arcana) check (DC 10 plus the spell\'s level).' }
            ],
            17: [{ name: 'Thief\'s Reflexes', description: 'You are adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.' }]
        }
    },
    {
        name: 'Soulknife',
        description: 'Strike Foes with Psionic Blades. A Soulknife strikes with the mind, cutting through barriers both physical and psychic. These Rogues discover psionic power within themselves and channel it to do their roguish work.',
        features: {
            3: [
                { name: 'Psionic Power', description: 'You have Psionic Energy Dice (d6 at level 3, d8 at 5, d10 at 9, d12 at 13). Psi-Bolstered Knack: If you fail an ability check with a skill/tool you\'re proficient in, roll 1 Psionic Energy Die and add it to the check. Psychic Whispers: As a Magic action, telepathic communication with up to Proficiency Bonus creatures for a number of hours equal to the roll of 1 Psionic Energy Die.' },
                { name: 'Psychic Blades', description: 'You manifest shimmering blades of psychic energy. Attack action or Opportunity Attack: create a Psychic Blade (1d6 Psychic damage, Finesse, Thrown 60/120 ft, Mastery: Vex). After attacking with the blade, make a second attack as a Bonus Action with 1d4 damage if your other hand is free.' }
            ],
            9: [
                { name: 'Soul Blades', description: 'Homing Strikes: If you miss with Psychic Blade, roll 1 Psionic Energy Die and add to the attack roll; die is expended only if the roll then hits. Psychic Teleportation: Bonus Action, expend 1 Psionic Energy Die, teleport up to 10 feet times the number rolled to an unoccupied space you can see.' }
            ],
            13: [{ name: 'Psychic Veil', description: 'As a Magic action, gain Invisible for 1 hour or until you deal damage/force a save. Once per Long Rest, or expend 1 Psionic Energy Die to restore use.' }],
            17: [{ name: 'Rend Mind', description: 'When you deal Sneak Attack damage with Psychic Blades, force the target to make a Wisdom save (DC 8 + DEX + PB) or be Stunned for 1 minute. Once per Long Rest, or expend 3 Psionic Energy Dice to restore.' }]
        }
    },
    {
        name: 'Scion of the Three',
        description: 'Become a Gruesome Agent of Malice. A Scion of the Three draws power from the Dead Three: Bane (god of tyranny), Bhaal (god of violence and murder), and Myrkul (god of death). Their power manifests as occult gifts and an uncanny talent for striking and terrifying foes.',
        features: {
            3: [
                { name: 'Bloodthirst', description: 'When an enemy you can see within 30 feet takes damage and is Bloodied but not killed, you can Reaction teleport to within 5 feet and make one melee attack. Uses = Intelligence modifier per Long Rest.' },
                { name: 'Dread Allegiance', description: 'Choose one of the Dead Three: Bane (Resistance to Psychic, Minor Illusion cantrip), Bhaal (Resistance to Poison, Blade Ward cantrip), or Myrkul (Resistance to Necrotic, Chill Touch cantrip). Changeable on Long Rest.' }
            ],
            9: [{ name: 'Strike Fear', description: 'New Cunning Strike option: Terrify (Cost: 1d6). Target must make a Wisdom save or be Frightened for 1 minute. While Frightened, you have Advantage on attacks against the target.' }],
            13: [{ name: 'Aura of Malevolence', description: 'When you use Bloodthirst and teleport, each creature of your choice within 10 feet of either the space you left or your destination takes damage equal to your Intelligence modifier (type matches your Dread Allegiance Resistance). Damage ignores Resistance.' }],
            17: [
                { name: 'Dread Incarnate', description: 'Cutthroat: Regain one expended use of Bloodthirst on Short Rest. Murderous Intent: When rolling Sneak Attack damage, treat 1s and 2s on dice as 3s.' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10, STR: 8 }
};
