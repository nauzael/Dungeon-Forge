
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const druid = {
  details: { 
    name: 'Druid', 
    description: 'Druids belong to ancient orders that invoke the forces of nature. They heal, transform into animals, and master elemental destruction.', 
    traits: [
        { name: 'Spellcasting', description: 'Wisdom-based primal magic. You are a prepared spellcaster.' }, 
        { name: 'Druidic', description: 'You know the secret language of druids. You always have Speak with Animals prepared.' }, 
        { name: 'Primal Order', description: 'Choose your path: Mage (extra cantrip and bonus to Arcana/Nature) or Guardian (medium armor and martial weapons).' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['WIS', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Animal Handling', 'Arcana', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Druidic', 'Primal Order'], 
    2: ['Wild Shape', 'Wild Companion'], 
    3: ['Druid Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Wild Resurgence'], 
    6: ['Subclass Feature'],
    7: ['Elemental Fury'],
    8: ['Ability Score Improvement'], 
    10: ['Subclass Feature'],
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    15: ['Improved Elemental Fury'],
    16: ['Ability Score Improvement'], 
    18: ['Beast Spells'], 
    19: ['Epic Boon Feat'], 
    20: ['Archdruid'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Circle of the Land',
        description: 'Mystic druids who safeguard ancient rites within circles of trees or stones, attuned to a specific biome.',
        features: {
            3: [
                { name: 'Circle of the Land Spells', description: 'After a long rest, choose a biome: Arctic, Polar, Temperate, or Tropical. You get additional prepared spells based on your level.' },
                { name: 'Land\'s Aid', description: 'Magic action: Spend a use of Wild Shape to summon vital flowers and thorns in a 10-foot area. Enemy creatures take 2d6 necrotic damage (DC WIS) and an ally recovers 2d6 HP.' }
            ],
            6: [{ name: 'Natural Recovery', description: 'You can cast a spell from your biome list without spending a slot. Additionally, during a short rest you recover spell slots whose sum of levels equals half your druid level.' }],
            10: [{ name: 'Nature\'s Ward', description: 'Immunity to Poisoned and Resistance to damage associated with your current biome (Fire, Cold, Lightning, or Poison).' }],
            14: [{ name: 'Nature\'s Sanctuary', description: 'Magic action: Spend Wild Shape to create a 15-foot cube with spectral vegetation (1 min). You and allies have Half Cover and the resistances from Nature\'s Ward.' }]
        }
    },
    {
        name: 'Circle of the Moon',
        description: 'Druids who use lunar magic to transform into fierce combatants, protecting the natural world with claw and fang.',
        features: {
            3: [
                { name: 'Circle Forms', description: 'Your Wild Shape improves: You can use it as a bonus action. Your AC is 13 + Wisdom (if higher). You gain THP equal to 3 times your Druid level.' },
                { name: 'Circle of the Moon Spells', description: 'You always have spells prepared like Cure Wounds and Moonbeam. You can cast them while in Wild Shape.' }
            ],
            6: [
                { name: 'Lunar Radiance', description: 'Your attacks in Wild Shape can deal Radiant damage instead of their normal type.' },
                { name: 'Increased Toughness', description: 'You can add your Wisdom modifier to your Constitution saving throws.' }
            ],
            10: [{ name: 'Moonlight Step', description: 'Bonus action: Teleport up to 30 feet and have advantage on your next attack. (Uses = WIS mod, recover on long rest or by spending a slot lvl 2+).' }],
            14: [{ name: 'Lunar Form', description: 'Once per turn in Wild Shape, deal 2d10 extra Radiant damage. Additionally, you can teleport an ally with you when using Moonlight Step.' }]
        }
    },
    {
        name: 'Circle of the Sea',
        description: 'Druids bound to the fury of the oceans and storms, embodying nature\'s wrath against those who despoil it.',
        features: {
            3: [
                { name: 'Wrath of the Sea', description: 'Bonus action: Spend Wild Shape to create a sea spray aura (10 min). At the end of your turn, deal Thunder damage (d6 dice = WIS mod) and push 15 feet an enemy within 10 feet.' },
                { name: 'Circle of the Sea Spells', description: 'Additional prepared spells like Fog Cloud, Shatter and Lightning Bolt.' }
            ],
            6: [{ name: 'Aquatic Affinity', description: 'The range of Wrath of the Sea increases to 10 feet. You gain swimming speed equal to your speed.' }],
            10: [{ name: 'Stormborn', description: 'While Wrath of the Sea is active, you gain Flight and Resistance to Cold, Lightning, and Thunder damage.' }],
            14: [{ name: 'Oceanic Gift', description: 'You can manifest the Wrath of the Sea aura around a willing ally within 60 feet. By spending two uses of Wild Shape, you can have it on yourself and the ally at the same time.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, DEX: 13, INT: 12, STR: 10, CHA: 8 }
};
