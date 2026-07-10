
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const rogue = {
  details: { 
    name: 'Rogue', 
    description: 'Masters of stealth, ingenuity, and precision. Rogues exploit their enemies\' weaknesses to deal lethal blows and are experts at overcoming any obstacle.', 
    traits: [
        { name: 'Sneak Attack', description: 'You know how to strike subtly and exploit a foe\'s distraction. Once per turn, you deal an extra 1d6 when you hit with an attack that has Advantage and uses a weapon with the Finesse or Ranged property. You don\'t need Advantage if an ally is within 5 feet of the target, isn\'t Incapacitated, and you don\'t have Disadvantage. The extra damage scales with level (see table).' }, 
        { name: 'Expertise', description: 'You gain Expertise in two of your skill proficiencies. At level 6, you gain Expertise in two more.' }, 
        { name: 'Weapon Mastery', description: 'Your training allows you to use the mastery properties of two weapon types with which you are proficient (Finesse or Light). When you finish a Long Rest, you can change your choice.' }
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
                 { name: 'Spellcasting', description: 'You have learned to cast spells. You know three cantrips: Mage Hand and two from the Wizard spell list (more at level 10). You have spell slots according to the Arcane Trickster table. You prepare 3 level 1 Wizard spells initially, gaining more as you level up. Intelligence is your spellcasting ability.' },
                 { name: 'Mage Hand Legerdemain', description: 'When you cast Mage Hand, you can do so as a Bonus Action and make the hand Invisible. You control the hand with a Bonus Action. You can make Dexterity (Sleight of Hand) checks through it.' }
            ],
            9: [{ name: 'Magical Ambush', description: 'If you are Invisible when you cast a spell on a creature, it has Disadvantage on its saving throw.' }],
            13: [{ name: 'Versatile Trickster', description: 'When you use the Trip option of Cunning Strike, you can also use it on another creature within 5 feet of your spectral Mage Hand.' }],
            17: [{ name: 'Spell Thief', description: 'When a creature casts a spell at you or includes you in its area, you can use your Reaction to force an Intelligence saving throw (DC your spell save DC). If it fails, you negate the effect and steal the spell if it\'s level 1+ and you can cast it. You have it prepared for 8 hours. Once per Long Rest.' }]
        }
    },
    {
        name: 'Assassin',
        description: 'Practice the Grim Art of Death. An Assassin\'s training focuses on using stealth, poison, and disguise to eliminate foes with deadly efficiency.',
        features: {
            3: [
                 { name: 'Assassinate', description: 'Initiative: Advantage on Initiative. Surprising Strikes: first round, Advantage on attacks against creatures that haven\'t acted. If your Sneak Attack hits, extra damage equal to your Rogue level.' },
                 { name: 'Assassin\'s Tools', description: 'You gain proficiency with Disguise Kit and Poisoner\'s Kit.' }
            ],
            9: [
                 { name: 'Infiltration Expertise', description: 'Masterful Mimicry: you can mimic voice/writing after 1 hour of study. Mobile Aim: your speed is not reduced to 0 when using Steady Aim.' }
            ],
            13: [{ name: 'Envenom Weapons', description: 'When you use the Poison Cunning Strike option, the target takes an additional 2d6 Poison damage if it fails its save. Ignores Poison Resistance.' }],
            17: [{ name: 'Death Strike', description: 'When you hit with Sneak Attack in the first round, the target makes a Constitution saving throw (DC 8 + Dexterity + Proficiency) or the attack damage is doubled.' }]
        }
    },
    {
        name: 'Thief',
        description: 'Hunt for Treasure as a Classic Adventurer. A mix of burglar, treasure hunter, and explorer, the Thief is the epitome of an adventurer.',
        features: {
            3: [
                 { name: 'Fast Hands', description: 'Bonus Action: Sleight of Hand (pick lock, disable trap, pick pocket) or Use an Object (Utilize action, or use a magic item that requires an action).' },
                 { name: 'Second Story Work', description: 'Climb: Climb Speed equals your Speed. Jump: you determine distance with Dexterity instead of Strength.' }
            ],
            9: [{ name: 'Supreme Sneak', description: 'Cunning Strike option: Stealthy Attack (cost 1d6). If you are Invisible from Hiding, this attack doesn\'t end the invisibility if you end your turn behind Three-Quarters or Total Cover.' }],
            13: [
                 { name: 'Use Magic Device', description: 'You can attune to up to 4 magic items. When using an item with charges, roll 1d6; on a 6 you don\'t expend charges. You can use any Spell Scroll with Intelligence; cantrips and level 1 always work; higher levels require Arcana DC 10 + level.' }
            ],
            17: [{ name: 'Thief\'s Reflexes', description: 'You take two turns in the first round of combat. First at your normal Initiative, second at Initiative -10.' }]
        }
    },
    {
        name: 'Soulknife',
        description: 'Strike Foes with Psionic Blades. A Soulknife strikes with the mind, cutting through barriers both physical and psychic. These Rogues discover psionic power within themselves and channel it to do their roguish work.',
        features: {
            3: [
                 { name: 'Psionic Power', description: 'You have Psionic Energy dice (d6 at L3, 4 dice; scales to d12 at L17, 12 dice). You regain 1 on a Short Rest, all on a Long Rest. Psi-Powered Trick: when you fail a check with proficiency, you expend a die. Psychic Whispers: Magic action, telepathy with up to Proficiency creatures.' },
                 { name: 'Psychic Blades', description: 'As part of the Attack action or Opportunity Attack, you create a Psychic Blade (1d6 Psychic, Finesse, Thrown 60/120, Mastery: Vex). A second blade with your free hand as a Bonus Action (1d4). The blade disappears after hitting or missing.' }
            ],
            9: [
                 { name: 'Soul Blades', description: 'Accurate Strikes: when you miss with a Psychic Blade, roll an energy die and add to the attack; if it hits, the die is expended. Psychic Teleportation: Bonus Action, expend a die, teleport up to 10 × result feet.' }
            ],
            13: [{ name: 'Psychic Veil', description: 'Magic action: Invisible for 1 hour or until you deal damage or force a saving throw. Once per Long Rest, or by expending a die.' }],
            17: [{ name: 'Rend Mind', description: 'When you deal Sneak Attack damage with Psychic Blades, the target makes a Wisdom save (DC 8 + Dex + Proficiency) or is Stunned for 1 minute. Once per Long Rest, or 3 dice.' }]
        }
    },
    {
        name: 'Scion of the Three',
        description: 'Become a Gruesome Agent of Malice. A Scion of the Three draws power from the Dead Three: Bane (god of tyranny), Bhaal (god of violence and murder), and Myrkul (god of death). Their power manifests as occult gifts and an uncanny talent for striking and terrifying foes.',
        features: {
            3: [
                 { name: 'Bloodthirst', description: 'When an enemy within 30 feet takes damage and is Bloodied but doesn\'t die, you can use your Reaction to teleport within 5 feet and make a melee attack. Uses = Intelligence per Long Rest.' },
                 { name: 'Dread Allegiance', description: 'Choose one of the Dead Three: Bane (Psychic Resistance, Minor Illusion cantrip), Bhaal (Poison Resistance, Blade Ward cantrip), Myrkul (Necrotic Resistance, Chill Touch cantrip). Changeable on Long Rest.' }
            ],
            9: [{ name: 'Strike Fear', description: 'Cunning Strike option: Frighten (cost 1d6). Target Wisdom save or Frightened for 1 minute. While Frightened, you have Advantage on attacks against it.' }],
            13: [{ name: 'Aura of Malevolence', description: 'When you use Bloodthirst and teleport, each creature within 10 feet of your origin or destination takes damage = Intelligence. Ignores Resistance.' }],
            17: [
                 { name: 'Dread Incarnate', description: 'Bloodthirsty: you regain one use of Bloodthirst on a Short Rest. Murderous Intent: when rolling Sneak Attack dice, 1s and 2s count as 3.' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10, STR: 8 }
};
