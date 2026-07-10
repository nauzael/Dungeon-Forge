
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const druid = {
  details: { 
    name: 'Druid', 
    description: 'Druids belong to ancient orders that invoke the forces of nature. They heal, transform into animals, and master elemental destruction.', 
    traits: [
        { name: 'Spellcasting', description: 'You have learned to cast spells through the study of nature\'s mystical forces. You know 2 cantrips (more at levels 4 and 10). You prepare your list of level 1+ spells from the Druid spell list. You change them when you finish a Long Rest. Wisdom is your spellcasting ability. You use a Druidic Focus as a Spellcasting Focus.' }, 
        { name: 'Druidic', description: 'You know Druidic, the secret language of druids. You always have the spell Speak with Animals prepared. You can use Druidic to leave hidden messages that other druids automatically detect.' }, 
        { name: 'Primal Order', description: 'You have dedicated yourself to one of these roles: Mage (1 extra cantrip and bonus to Wisdom on Arcana/Nature checks) or Guardian (proficiency with Martial weapons and Medium Armor).' }
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
     9: ['—'],
     10: ['Subclass Feature'],
     11: ['—'],
     12: ['Ability Score Improvement'],
     13: ['—'],
     14: ['Subclass Feature'], 
     15: ['Improved Elemental Fury'],
     16: ['Ability Score Improvement'],
     17: ['—'],
     18: ['Beast Spells'], 
    19: ['Epic Boon Feat'], 
    20: ['Archdruid'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Circle of the Land',
        description: 'Celebrate Connection to the Natural World. The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites. These Druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic.',
        features: {
            3: [
                { name: 'Circle of the Land Spells', description: 'At the end of a Long Rest, you choose a land type: Arid, Polar, Temperate, or Tropical. Consult the table for your land: Arid (Blur, Burning Hands, Scorching Ray at lv3; Fireball at lv5; Blight at lv7; Wall of Stone at lv9), Polar (Fog Cloud, Hold Person, Ray of Frost at lv3; Sleet Storm at lv5; Ice Storm at lv7; Cone of Cold at lv9), Temperate (Misty Step, Shocking Grasp, Sleep at lv3; Lightning Bolt at lv5; Freedom of Movement at lv7; Tree Stride at lv9), Tropical (Acid Splash, Ray of Sickness, Web at lv3; Stinking Cloud at lv5; Polymorph at lv7; Insect Plague at lv9).' },
                { name: 'Land\'s Aid', description: 'As a Magic action, you expend a use of Wild Shape. Flowers and thorns appear in a 10-foot Sphere within 60 feet. Each creature you choose makes a Constitution saving throw: 2d6 Necrotic damage (half on success). One creature you choose regains 2d6 HP. The damage and healing increase by 1d6 at levels 10 and 14.' }
            ],
            6: [{ name: 'Natural Recovery', description: 'You can cast one of your Circle spells without expending a spell slot, once per Long Rest. Additionally, when you finish a Short Rest, you regain spell slots with a total level equal to or less than half your Druid level (rounded up), none of which can be 6th level or higher.' }],
            10: [{ name: 'Nature\'s Ward', description: 'You are immune to the Poisoned condition. You have Resistance to a damage type based on your land: Arid (Fire), Polar (Cold), Temperate (Lightning), Tropical (Poison).' }],
            14: [{ name: 'Nature\'s Sanctuary', description: 'As a Magic action, you expend Wild Shape to create spectral trees in a 15-foot Cube within 120 feet for 1 minute. You and your allies have Half Cover and the Resistance of Natural Barrier. As a Bonus Action, you move the cube 60 feet.' }]
        }
    },
    {
        name: 'Circle of the Moon',
        description: 'Adopt Animal Forms to Guard the Wilds. Druids of the Circle of the Moon draw on lunar magic to transform themselves. Their order gathers under the moon to share news and perform rituals.',
        features: {
            3: [
                { name: 'Circle Forms', description: 'When you use Wild Shape, you channel lunar magic. Maximum CR = level/3 (rounded down). AC = 13 + Wisdom if higher than the Beast\'s. You gain Temporary HP = 3 \u00D7 Druid level.' },
                { name: 'Circle of the Moon Spells', description: 'When you reach the indicated Druid levels, you always have these spells prepared: L3 (Cure Wounds, Moonbeam, Starry Wisp), L5 (Conjure Animals), L7 (Fount of Moonlight), L9 (Mass Cure Wounds). You can cast them while in Wild Shape.' }
            ],
            6: [
                { name: 'Lunar Radiance', description: 'Each of your attacks in Wild Shape can deal its normal damage type or Radiant damage. You make this choice each time you hit with those attacks. Moonlight imbues your bestial forms.' },
                { name: 'Increased Toughness', description: 'You can add your Wisdom modifier to your Constitution saving throws. The resilience of your bestial form is reinforced by your wisdom.' }
            ],
            10: [{ name: 'Moonlight Step', description: 'As a Bonus Action, teleport up to 30 feet. You have Advantage on your next attack. Uses = Wisdom modifier, regain on a Long Rest. You can recover uses by expending level 2+ spell slots.' }],
            14: [{ name: 'Lunar Form', description: 'Improvement: once per turn, you deal 2d10 extra Radiant damage with a Wild Shape attack. When you use Moonlight Step, you can bring a willing creature within 10 feet of your destination.' }]
        }
    },
    {
        name: 'Circle of the Sea',
        description: 'Become One with Tides and Storms. Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms. Some view themselves as embodiments of nature\'s wrath, seeking vengeance against those who despoil nature.',
        features: {
            3: [
                { name: 'Circle of the Sea Spells', description: 'Cuando alcanzas los niveles de Druida indicados, siempre tienes preparados estos conjuros: L3 (Fog Cloud, Gust of Wind, Ray of Frost, Thunderwave), L5 (Lightning Bolt, Water Breathing), L7 (Control Water, Ice Storm), L9 (Conjure Elemental, Hold Monster).' },
                { name: 'Wrath of the Sea', description: 'As a Bonus Action, you expend Wild Shape to manifest a 5-foot Emanation of ocean spray for 10 minutes. As a Bonus Action, a creature in the emanation makes a Constitution saving throw or takes Cold damage (d6 \u00D7 Wisdom modifier) and is pushed 15 feet.' }
            ],
            6: [{ name: 'Aquatic Affinity', description: 'The emanation increases to 10 feet. You gain a Swim Speed equal to your Speed.' }],
            10: [{ name: 'Stormborn', description: 'While the emanation is active: Flight (speed equal to your Speed) and Resistance to Cold, Lightning, and Thunder damage.' }],
            14: [{ name: 'Oceanic Gift', description: 'You can manifest the emanation around an ally within 60 feet instead of yourself. If you expend 2 uses of Wild Shape, it manifests around both.' }]
        }
    },
    {
        name: 'Circle of the Stars',
        description: 'Harness Secrets Hidden in Constellations. The Circle of the Stars has tracked heavenly patterns since time immemorial, discovering secrets hidden amid the constellations. By understanding these secrets, the Druids of this circle seek to harness the powers of the cosmos.',
        features: {
            3: [
                { name: 'Star Map', description: 'You have created a star map as part of your celestial studies. It is a Tiny object and you can use it as a Spellcasting Focus for your Druid spells. While holding it, you have the Guidance and Guiding Bolt spells prepared. You can cast Guiding Bolt without expending a spell slot a number of times equal to your Wisdom modifier (minimum 1) and you regain all uses when you finish a Long Rest.' },
                { name: 'Starry Form', description: 'As a Bonus Action, you expend Wild Shape to take on a starry form for 10 min: you emit Bright Light 10 feet, Dim Light +10 feet. Choose constellation: Archer (ranged attack 60 feet, 1d8+Wis Radiant); Chalice (when you restore HP with a spell, another creature regains 1d8+Wis); Dragon (on Int/Wis checks or Concentration saving throws, a 9 or lower counts as 10).' }
            ],
            6: [{ name: 'Cosmic Omen', description: 'When you finish a Long Rest, you consult your Star Map and roll a die. Until your next Long Rest, you have this special Reaction based on even/odd: Fortune (Even): when a creature within 30 feet makes a d20 Test, use your Reaction to roll 1d6 and add it. Misfortune (Odd): when a creature within 30 feet makes a d20 Test, use your Reaction to roll 1d6 and subtract it. Uses = Wisdom modifier, regain on a Long Rest.' }],
            10: [{ name: 'Twinkling Constellations', description: 'The d8 for Archer and Chalice becomes 2d8. Dragon grants Flight 20 feet. At the start of each turn in Starry Form, you can change constellation.' }],
            14: [{ name: 'Full of Stars', description: 'While in Starry Form, you are partially incorporeal. You have Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, DEX: 13, INT: 12, STR: 10, CHA: 8 }
};
