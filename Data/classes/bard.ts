
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const bard = {
  details: { 
    name: 'Bard', 
    description: 'Masters of song, oratory, and magic. Bards use Words of Creation to inspire allies, demoralize enemies, and manipulate reality.', 
    traits: [
        { name: 'Bardic Inspiration', description: 'Use a bonus action to inspire an ally within 60 feet. They gain a Bard die (d6 at level 1) to add to a d20 roll.' }, 
        { name: 'Spellcasting', description: 'Charisma-based arcane magic. You are a prepared spellcaster.' }, 
        { name: 'Tool Proficiency', description: 'Proficiency with 3 musical instruments.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'DEX', 'CON'] as Ability[],
  skillData: { count: 3, options: 'Any' as const },
  progression: { 
    1: ['Bardic Inspiration', 'Spellcasting'], 
    2: ['Expertise', 'Jack of All Trades'], 
    3: ['Bard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Font of Inspiration'], 
    6: ['Subclass Feature'], 
    7: ['Countercharm'], 
    8: ['Ability Score Improvement'], 
    9: ['Expertise'], 
    10: ['Magical Secrets'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'],
    15: ['Inspiration Upgrade (d12)'],
    16: ['Ability Score Improvement'], 
    18: ['Superior Inspiration'],
    19: ['Epic Boon Feat'], 
    20: ['Words of Creation'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'College of Lore', 
        description: 'Plumb the Depths of Magical Knowledge. Bards of the College of Lore collect spells and secrets from diverse sources, such as scholarly tomes, mystical rites, and peasant tales.', 
        features: { 
            3: [
                { name: 'Bonus Proficiencies', description: 'You gain proficiency with three skills of your choice.' }, 
                { name: 'Cutting Words', description: 'You learn to use your wit to supernaturally distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of yourself makes a damage roll or succeeds on an ability check or attack roll, you can take a Reaction to expend one use of your Bardic Inspiration; roll your Bardic Inspiration die, and subtract the number rolled from the creature\'s roll, reducing the damage or potentially turning the success into a failure.' }
            ],
            6: [{ name: 'Magical Discoveries', description: 'You learn two spells of your choice. These spells can come from the Cleric, Druid, or Wizard spell list or any combination thereof. A spell you choose must be a cantrip or a spell for which you have spell slots. You always have the chosen spells prepared, and whenever you gain a Bard level, you can replace one of the spells with another spell that meets these requirements.' }],
            14: [{ name: 'Peerless Skill', description: 'When you make an ability check or attack roll and fail, you can expend one use of Bardic Inspiration; roll the Bardic Inspiration die, and add the number rolled to the d20, potentially turning a failure into a success. On a failure, the Bardic Inspiration isn\'t expended.' }]
        } 
      },
      {
        name: 'College of Valor',
        description: 'Sing the Deeds of Ancient Heroes. Bards of the College of Valor are daring storytellers whose tales preserve the memory of the great heroes of the past.',
        features: {
            3: [
                { name: 'Combat Inspiration', description: 'A creature that has a Bardic Inspiration die from you can use it for one of the following effects: Defense: When the creature is hit by an attack roll, that creature can use its Reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, potentially causing the attack to miss. Offense: Immediately after the creature hits a target with an attack roll, the creature can roll the Bardic Inspiration die and add the number rolled to the attack\'s damage against the target.' },
                { name: 'Martial Training', description: 'You gain proficiency with Martial weapons and training with Medium armor and Shields. In addition, you can use a Simple or Martial weapon as a Spellcasting Focus to cast spells from your Bard spell list.' }
            ],
            6: [{ name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn. In addition, you can cast one of your cantrips that has a casting time of an action in place of one of those attacks.' }],
            14: [{ name: 'Battle Magic', description: 'After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.' }]
        }
      },
      {
        name: 'College of Glamour',
        description: 'Weave Beguiling Fey Magic. The College of Glamour traces its origins to the beguiling magic of the Feywild. Bards who study this magic weave threads of beauty and terror into their songs and stories.',
        features: {
            3: [
                { name: 'Beguiling Magic', description: 'You always have the Charm Person and Mirror Image spells prepared. In addition, immediately after you cast an Enchantment or Illusion spell using a spell slot, you can cause a creature you can see within 60 feet of yourself to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Charmed or Frightened condition (your choice) for 1 minute. Once you use this benefit, you can\'t use it again until you finish a Long Rest.' },
                { name: 'Mantle of Inspiration', description: 'You can weave fey magic into a song or dance to fill others with vigor. As a Bonus Action, you can expend a use of Bardic Inspiration, rolling a Bardic Inspiration die. When you do so, choose a number of other creatures within 60 feet of yourself, up to a number equal to your Charisma modifier. Each of those creatures gains a number of Temporary Hit Points equal to two times the number rolled on the Bardic Inspiration die, and then each can use its Reaction to move up to its Speed without provoking Opportunity Attacks.' }
            ],
            6: [{ name: 'Mantle of Majesty', description: 'You always have the Command spell prepared. As a Bonus Action, you cast Command without expending a spell slot, and you take on an unearthly appearance for 1 minute or until your Concentration ends. During this time, you can cast Command as a Bonus Action without expending a spell slot. Any creature Charmed by you automatically fails its saving throw against the Command you cast with this feature. Once you use this feature, you can\'t use it again until you finish a Long Rest.' }],
            14: [{ name: 'Unbreakable Majesty', description: 'As a Bonus Action, you can assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. For the duration, whenever any creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a Charisma saving throw against your spell save DC, or the attack misses instead, as the creature recoils from your majesty. Once you assume this majestic presence, you can\'t do so again until you finish a Short or Long Rest.' }]
        }
      },
      {
        name: 'College of Dance',
        description: 'Move in Harmony with the Cosmos. Bards of the College of Dance know that the Words of Creation can\'t be contained within speech or song; the words are uttered by the movements of celestial bodies.',
        features: {
            3: [
                { name: 'Dazzling Footwork', description: 'While you aren\'t wearing armor or wielding a Shield, you gain: Dance Virtuoso (Advantage on Charisma Performance checks involving dancing), Unarmored Defense (AC = 10 + Dexterity + Charisma), Agile Strikes (When you expend a use of your Bardic Inspiration as part of an action, Bonus Action, or Reaction, you can make one Unarmed Strike as part of that action), Bardic Damage (When you deal damage with an Unarmed Strike, you can deal Bludgeoning damage equal to a roll of your Bardic Inspiration die plus your Dexterity modifier instead of the strike\'s normal damage).' }
            ],
            6: [
                { name: 'Inspiring Movement', description: 'When an enemy you can see ends its turn within 5 feet of you, you can take a Reaction and expend one use of your Bardic Inspiration to move up to half your Speed. Then one ally of your choice within 30 feet of you can also move up to half their Speed using their Reaction. None of this feature\'s movement provokes Opportunity Attacks.' },
                { name: 'Tandem Footwork', description: 'When you roll Initiative, you can expend one use of your Bardic Inspiration if you don\'t have the Incapacitated condition. When you do so, roll your Bardic Inspiration die; you and each ally within 30 feet of you who can see or hear you gains a bonus to Initiative equal to the number rolled.' }
            ],
            14: [{ name: 'Leading Evasion', description: 'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. If any creatures within 5 feet of you are making the same Dexterity saving throw, you can share this benefit with them for that save. You can\'t use this feature if you have the Incapacitated condition.' }]
        }
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, DEX: 14, CON: 13, WIS: 12, INT: 10, STR: 8 }
};
