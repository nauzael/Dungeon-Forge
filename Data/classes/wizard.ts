
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const wizard = {
  details: { 
    name: 'Wizard', 
    description: 'Wizards are defined by their exhaustive study of magic\'s inner workings. They cast spells of explosive fire, arcing lightning, subtle deception, and spectacular transformations.', 
    traits: [
        { name: 'Spellcasting', description: 'Intelligence-based arcane magic. You use a spellbook and are a prepared spellcaster.' }, 
        { name: 'Ritual Adept', description: 'You can cast any spell as a Ritual if it has the Ritual tag and is in your spellbook. You don\'t need to have it prepared.' }, 
        { name: 'Arcane Recovery', description: 'You can recover part of your magical energy by studying your spellbook during a Short Rest. (1/Long Rest).' }
    ] 
  } as DetailData,
  hitDie: 6,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['INT', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Ritual Adept', 'Arcane Recovery'], 
    2: ['Scholar'], 
    3: ['Wizard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Memorize Spell'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    18: ['Spell Mastery'], 
    19: ['Epic Boon Feat'], 
    20: ['Signature Spells'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'Abjurer', 
        description: 'Abjurers specialize in magic that blocks, banishes, or protects. They are experts at warding and counter magic.',
        features: { 
            3: [
                { name: 'Abjuration Savant', description: 'Choose two Abjuration spells of level 2 or lower and add them to your spellbook for free. Each time you gain access to a new spell slot level, add another Abjuration spell for free.' },
                { name: 'Arcane Ward', description: 'When casting an Abjuration spell with a spell slot, you create a magical ward. The ward\'s maximum Hit Points equal twice your Wizard level plus your Intelligence modifier. It absorbs damage before you do. You regain Hit Points equal to the amount of damage absorbed when you cast an Abjuration spell.' }
            ],
            6: [{ name: 'Projected Ward', description: 'When a creature you can see within 30 feet takes damage, you can take a Reaction to have your Arcane Ward absorb that damage instead.' }],
            10: [
                { name: 'Spell Breaker', description: 'You always have Counterspell and Dispel Magic prepared. You can cast Dispel Magic as a Bonus Action, and you add your Proficiency Bonus to the ability check to end a spell. If you fail the check to end a spell, you don\'t expend the spell slot.' }
            ],
            14: [{ name: 'Spell Resistance', description: 'You have Advantage on saving throws against spells, and you have Resistance to damage from spells.' }]
        } 
      },
      { 
        name: 'Diviner', 
        description: 'Diviners seek to unravel the mysteries of past, present, and future. They peer through divination magic to uncover secrets.',
        features: { 
            3: [
                { name: 'Divination Savant', description: 'Choose two Divination spells of level 2 or lower and add them to your spellbook for free. Each time you gain access to a new spell slot level, add another Divination spell for free.' },
                { name: 'Portent', description: 'When you finish a Long Rest, roll two d20s and record the numbers. When you make a d20 roll, you can substitute one of your portent rolls for the roll. You can only do this once per turn.' }
            ],
            6: [{ name: 'Expert Divination', description: 'When you cast a Divination spell of level 2 or higher, you regain a expended spell slot of a level lower than the spell you cast.' }],
            10: [{ name: 'The Third Eye', description: 'As a Bonus Action, you can spend 1 or more sorcery points to choose an effect until your next Long Rest: see invisibility (2 SP), read any language (2 SP), or darkvision 120 ft (2 SP).' }],
            14: [{ name: 'Greater Portent', description: 'You now roll three d20s for your Portent feature.' }]
        } 
      },
      { 
        name: 'Evoker', 
        description: 'Evokers specialize in pure destructive energy. They master the art of dealing maximum damage with area-effect spells.',
        features: { 
            3: [
                { name: 'Evocation Savant', description: 'Choose two Evocation spells of level 2 or lower and add them to your spellbook for free. Each time you gain access to a new spell slot level, add another Evocation spell for free.' },
                { name: 'Potent Cantrip', description: 'When a creature succeeds on a saving throw against your cantrip, the creature takes half the cantrip\'s damage (if any) but suffers no effect from the failed save.' }
            ],
            6: [{ name: 'Sculpt Spells', description: 'When you cast an Evocation spell that affects other creatures, you can choose a number of them equal to 1 plus the spell\'s level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save.' }],
            10: [{ name: 'Empowered Evocation', description: 'When you cast an Evocation spell, add your Intelligence modifier to one damage roll of the spell.' }],
            14: [{ name: 'Overchannel', description: 'When you cast a damage spell of level 1-5, you can deal maximum damage with that spell. The first time you do this, you suffer no adverse effect. If you use this feature again before finishing a Long Rest, you take 2d12 Necrotic damage for each spell level above 1.' }]
        } 
      },
      { 
        name: 'Illusionist', 
        description: 'Illusionists specialize in deceiving the senses and mind. They make the impossible appear real.',
        features: { 
            3: [
                { name: 'Illusion Savant', description: 'Choose two Illusion spells of level 2 or lower and add them to your spellbook for free. Each time you gain access to a new spell slot level, add another Illusion spell for free.' },
                { name: 'Improved Minor Illusion', description: 'You learn the Minor Illusion cantrip. When you cast it, you can create both a sound and an image simultaneously. Additionally, when you cast an Illusion spell with a range of 10 feet or more, the spell\'s range increases by 30 feet.' }
            ],
            6: [{ name: 'Phantasmal Creatures', description: 'When you cast a Summon Beast or Summon Fey spell, you can choose to have it be an Illusion: the summoned creature appears translucent, and its attacks have no effect on material creatures. It has half the normal hit points.' }],
            10: [{ name: 'Illusory Self', description: 'When a creature makes an attack roll against you, you can create an illusory duplicate of yourself as a Reaction. The attack misses, then you can use your Bonus Action to have the duplicate move up to 20 feet and create a distraction.' }],
            14: [{ name: 'Illusory Reality', description: 'As a Bonus Action, you can choose one inanimate, nonmagical object that is part of an illusion you created and make that object real for 1 minute.' }]
        } 
      },
      { 
        name: 'Bladesinger', 
        description: 'Bladesingers master a tradition of wizardry that incorporates swordplay and dance. They use intricate, elegant maneuvers that fend off harm and allow them to channel magic into devastating attacks.',
        features: { 
            3: [
                { name: 'Bladesong', description: 'As a Bonus Action (if not wearing armor or using a shield), you invoke the Bladesong for 1 minute. You gain: Agility (AC + INT mod, Speed +10 ft, Advantage on Acrobatics); Bladework (use INT for weapon attack/damage); Focus (add INT to Constitution saves for Concentration). Uses = INT mod per Long Rest.' },
                { name: 'Training in War and Song', description: 'Gain proficiency with all Melee Martial weapons (except Two-Handed or Heavy). You can use a Melee weapon as a Spellcasting Focus. Also gain proficiency in one skill: Acrobatics, Athletics, Performance, or Persuasion.' }
            ],
            6: [{ name: 'Extra Attack', description: 'You can attack twice (instead of once) when you take the Attack action on your turn. You can also cast a Wizard cantrip in place of one of these attacks.' }],
            10: [{ name: 'Song of Defense', description: 'When you take damage while your Bladesong is active, you can take a Reaction to expend a spell slot and reduce the damage by 5 times the spell slot\'s level.' }],
            14: [{ name: 'Song of Victory', description: 'After you cast a spell with an action, you can make one weapon attack as a Bonus Action.' }]
        } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { INT: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, STR: 8 }
};