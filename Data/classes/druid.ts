
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
        description: 'Celebrate Connection to the Natural World. The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites. These Druids meet within sacred circles of trees or standing stones to whisper primal secrets in Druidic.',
        features: {
            3: [
                { name: 'Circle of the Land Spells', description: 'Whenever you finish a Long Rest, choose one type of land: arid, polar, temperate, or tropical. Consult the table for your land: Arid (Blur, Burning Hands, Fire Bolt at L3; Fireball at L5; Blight at L7; Wall of Stone at L9), Polar (Fog Cloud, Hold Person, Ray of Frost at L3; Sleet Storm at L5; Ice Storm at L7; Cone of Cold at L9), Temperate (Misty Step, Shocking Grasp, Sleep at L3; Lightning Bolt at L5; Freedom of Movement at L7; Tree Stride at L9), Tropical (Acid Splash, Ray of Sickness, Web at L3; Stinking Cloud at L5; Polymorph at L7; Insect Plague at L9).' },
                { name: 'Land\'s Aid', description: 'As a Magic action, you can expend a use of your Wild Shape and choose a point within 60 feet. Vitality-giving flowers and life-draining thorns appear in a 10-foot-radius Sphere. Each creature of your choice must make a Constitution saving throw taking 2d6 Necrotic damage on a failed save or half as much on a success. One creature of your choice in the area regains 2d6 Hit Points. Damage and healing increase by 1d6 at Druid levels 10 and 14.' }
            ],
            6: [{ name: 'Natural Recovery', description: 'You can cast one of your Circle Spells without expending a spell slot, and you must finish a Long Rest before you do so again. In addition, when you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to or less than half your Druid level (round up), and none can be level 6+.' }],
            10: [{ name: 'Nature\'s Ward', description: 'You are immune to the Poisoned condition, and you have Resistance to a damage type associated with your current land choice: Arid (Fire), Polar (Cold), Temperate (Lightning), Tropical (Poison).' }],
            14: [{ name: 'Nature\'s Sanctuary', description: 'As a Magic action, you can expend a use of your Wild Shape and cause spectral trees and vines to appear in a 15-foot Cube on the ground within 120 feet of yourself. They last for 1 minute or until you have the Incapacitated condition or die. You and your allies have Half Cover while in that area, and your allies gain the current Resistance of your Nature\'s Ward while there. As a Bonus Action, you can move the Cube up to 60 feet to ground within 120 feet of yourself.' }]
        }
    },
    {
        name: 'Circle of the Moon',
        description: 'Adopt Animal Forms to Guard the Wilds. Druids of the Circle of the Moon draw on lunar magic to transform themselves. Their order gathers under the moon to share news and perform rituals.',
        features: {
            3: [
                { name: 'Circle Forms', description: 'You can channel lunar magic when you assume a Wild Shape form. Challenge Rating: Maximum CR equals your Druid level divided by 3 (round down). Armor Class: Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast\'s AC. Temporary Hit Points: You gain a number of Temporary Hit Points equal to three times your Druid level.' },
                { name: 'Circle of the Moon Spells', description: 'When you reach a Druid level specified in the table, you thereafter always have the listed spells prepared: L3 (Cure Wounds, Moonbeam, Starry Wisp), L5 (Conjure Animals), L7 (Fount of Moonlight), L9 (Mass Cure Wounds). You can cast these spells while you\'re in a Wild Shape form.' }
            ],
            6: [
                { name: 'Lunar Radiance', description: 'Each of your attacks in a Wild Shape form can deal its normal damage type or Radiant damage. You make this choice each time you hit with those attacks.' },
                { name: 'Increased Toughness', description: 'You can add your Wisdom modifier to your Constitution saving throws.' }
            ],
            10: [{ name: 'Moonlight Step', description: 'As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see, and you have Advantage on the next attack roll you make before the end of this turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You can also regain uses by expending a level 2+ spell slot for each use you want to restore (no action required).' }],
            14: [{ name: 'Lunar Form', description: 'Improved Lunar Radiance: Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form\'s attack. Shared Moonlight: Whenever you use Moonlight Step, you can also teleport one willing creature within 10 feet of you to an unoccupied space you can see within 10 feet of your destination space.' }]
        }
    },
    {
        name: 'Circle of the Sea',
        description: 'Become One with Tides and Storms. Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms. Some view themselves as embodiments of nature\'s wrath, seeking vengeance against those who despoil nature.',
        features: {
            3: [
                { name: 'Circle of the Sea Spells', description: 'When you reach a Druid level specified in the table, you thereafter always have the listed spells prepared: L3 (Fog Cloud, Gust of Wind, Ray of Frost, Thunderwave), L5 (Lightning Bolt, Water Breathing), L7 (Control Water, Ice Storm), L9 (Conjure Elemental, Hold Monster).' },
                { name: 'Wrath of the Sea', description: 'As a Bonus Action, you can expend a use of your Wild Shape to manifest a 5-foot Emanation that takes the form of ocean spray that surrounds you for 10 minutes (ends early if you dismiss it, manifest it again, or have the Incapacitated condition). When you manifest the Emanation and as a Bonus Action on your subsequent turns, you can choose another creature you can see in the Emanation. The target must succeed on a Constitution saving throw or take Cold damage and be pushed up to 15 feet away from you. To determine this damage, roll a number of d6s equal to your Wisdom modifier (minimum of one die).' }
            ],
            6: [{ name: 'Aquatic Affinity', description: 'The size of the Emanation created by your Wrath of the Sea increases to 10 feet. In addition, you gain a Swim Speed equal to your Speed.' }],
            10: [{ name: 'Stormborn', description: 'Your Wrath of the Sea confers two more benefits while active: Flight: You gain a Fly Speed equal to your Speed. Resistance: You have Resistance to Cold, Lightning, and Thunder damage.' }],
            14: [{ name: 'Oceanic Gift', description: 'Instead of manifesting the Emanation of Wrath of the Sea around yourself, you can manifest it around one willing creature within 60 feet of yourself. That creature gains all the benefits of the Emanation and uses your spell save DC and Wisdom modifier for it. In addition, you can manifest the Emanation around both the other creature and yourself if you expend two uses of your Wild Shape instead of one when manifesting it.' }]
        }
    },
    {
        name: 'Circle of the Stars',
        description: 'Harness Secrets Hidden in Constellations. The Circle of the Stars has tracked heavenly patterns since time immemorial, discovering secrets hidden amid the constellations. By understanding these secrets, the Druids of this circle seek to harness the powers of the cosmos.',
        features: {
            3: [
                { name: 'Star Map', description: 'You\'ve created a star chart as part of your heavenly studies. It is a Tiny object, and you can use it as a Spellcasting Focus for your Druid spells. While holding the map, you have the Guidance and Guiding Bolt spells prepared, and you can cast Guiding Bolt without expending a spell slot. You can cast it in that way a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' },
                { name: 'Starry Form', description: 'As a Bonus Action, you can expend a use of your Wild Shape feature to take on a starry form rather than shape-shifting. While in your starry form, you retain your game statistics, but your body becomes luminous, your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. The form lasts for 10 minutes. Choose a constellation: Archer (ranged spell attack 60ft, 1d8+ Wisdom Radiant damage), Chalice (when you cast a spell using a spell slot that restores Hit Points, you or another creature within 30 feet can regain 1d8+ Wisdom HP), Dragon (when making an Intelligence or Wisdom check or a Constitution saving throw to maintain Concentration, you can treat a roll of 9 or lower on the d20 as a 10).' }
            ],
            6: [{ name: 'Cosmic Omen', description: 'Whenever you finish a Long Rest, you can consult your Star Map for omens and roll a die. Until you finish your next Long Rest, you gain access to a special Reaction based on whether you rolled an even or an odd number: Weal (Even): Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and add the number rolled to the total. Woe (Odd): Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and subtract the number rolled from the total. You can use this Reaction a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' }],
            10: [{ name: 'Twinkling Constellations', description: 'The constellations of your Starry Form improve. The 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a Fly Speed of 20 feet and can hover. Moreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.' }],
            14: [{ name: 'Full of Stars', description: 'While in your Starry Form, you become partially incorporeal, giving you Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, DEX: 13, INT: 12, STR: 10, CHA: 8 }
};
