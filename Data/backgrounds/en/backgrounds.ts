import { BackgroundData } from '../../../types';

// AUTO-GENERATED from docs/Manual/02-species-backgrounds.md
// Do not edit manually - regenerate with: node generate-backgrounds.cjs

export const BACKGROUND_DATA: Record<string, BackgroundData> = {
    'Acolyte': {
        description: 'Devoted to service in a temple, either nestled in a town or secluded in a sacred grove.',
        scores: ['INT', 'WIS', 'CHA'],
        feat: 'Magic Initiate (Cleric)',
        featDescription: 'Learn 2 Cleric cantrips and 1 level 1 Cleric spell. Cast it once per long rest for free.',
        skills: ['Insight', 'Religion'],
        tool: 'Calligrapher\'s Supplies',
        equipment: ['Calligrapher\'s Supplies', 'Book (prayers)', 'Holy Symbol', 'Parchment (10)', 'Robe', '8 GP']
    },
    'Artisan': {
        description: 'You began mopping floors and scrubbing counters in an artisan\'s workshop.',
        scores: ['STR', 'DEX', 'INT'],
        feat: 'Crafter',
        featDescription: 'Proficiency with three Artisan\'s Tools. 20% discount on nonmagical items. Fast Crafting.',
        skills: ['Investigation', 'Persuasion'],
        tool: 'Artisan\'s Tools',
        equipment: ['Artisan\'s Tools', '2 Pouches', 'Traveler\'s Clothes', '32 GP']
    },
    'Charlatan': {
        description: 'Once you were old enough to order an ale, you soon had a favorite stool in every tavern.',
        scores: ['DEX', 'CON', 'CHA'],
        feat: 'Skilled',
        featDescription: 'Gain proficiency in any combination of three skills or tools.',
        skills: ['Deception', 'Sleight of Hand'],
        tool: 'Forgery Kit',
        equipment: ['Forgery Kit', 'Costume', 'Fine Clothes', '15 GP']
    },
    'Criminal': {
        description: 'You eked out a living in dark alleyways, cutting purses or burgling shops.',
        scores: ['DEX', 'CON', 'INT'],
        feat: 'Alert',
        featDescription: 'Gain initiative proficiency and can swap your initiative with a willing ally.',
        skills: ['Sleight of Hand', 'Stealth'],
        tool: 'Thieves\' Tools',
        equipment: ['Thieves\' Tools', '2 Daggers', 'Crowbar', '2 Pouches', 'Traveler\'s Clothes', '16 GP']
    },
    'Entertainer': {
        description: 'You spent much of your youth following roving fairs and carnivals.',
        scores: ['STR', 'DEX', 'CHA'],
        feat: 'Musician',
        featDescription: 'Proficiency with three Musical Instruments. Grant Heroic Inspiration to allies after a rest.',
        skills: ['Acrobatics', 'Performance'],
        tool: 'Musical Instrument',
        equipment: ['Musical Instrument', '2 Costumes', 'Mirror', 'Perfume', 'Traveler\'s Clothes', '11 GP']
    },
    'Farmer': {
        description: 'You grew up close to the land, tending animals and cultivating the earth.',
        scores: ['STR', 'CON', 'WIS'],
        feat: 'Tough',
        featDescription: 'Your hit point maximum increases by 2 per level.',
        skills: ['Animal Handling', 'Nature'],
        tool: 'Carpenter\'s Tools',
        equipment: ['Carpenter\'s Tools', 'Sickle', 'Healer\'s Kit', 'Iron Pot', 'Shovel', 'Traveler\'s Clothes', '30 GP']
    },
    'Guard': {
        description: 'Your feet ache when you remember the countless hours you spent at your post.',
        scores: ['STR', 'INT', 'WIS'],
        feat: 'Alert',
        featDescription: 'Gain initiative proficiency and can swap your initiative with a willing ally.',
        skills: ['Athletics', 'Perception'],
        tool: 'Gaming Set',
        equipment: ['Gaming Set', 'Spear', 'Light Crossbow', '20 Bolts', 'Hooded Lantern', 'Manacles', 'Quiver', 'Traveler\'s Clothes', '12 GP']
    },
    'Guide': {
        description: 'You came of age outdoors, far from settled lands.',
        scores: ['DEX', 'CON', 'WIS'],
        feat: 'Magic Initiate (Druid)',
        featDescription: 'Learn 2 Druid cantrips and 1 level 1 Druid spell. Cast it once per long rest for free.',
        skills: ['Stealth', 'Survival'],
        tool: 'Cartographer\'s Tools',
        equipment: ['Cartographer\'s Tools', 'Shortbow', '20 Arrows', 'Bedroll', 'Quiver', 'Tent', 'Traveler\'s Clothes', '3 GP']
    },
    'Hermit': {
        description: 'You spent your early years secluded in a hut or monastery.',
        scores: ['CON', 'WIS', 'CHA'],
        feat: 'Healer',
        featDescription: 'Improve treatment with healer\'s kits and spend Hit Dice to heal allies in battle.',
        skills: ['Medicine', 'Religion'],
        tool: 'Herbalism Kit',
        equipment: ['Herbalism Kit', 'Quarterstaff', 'Bedroll', 'Book (philosophy)', 'Lamp', 'Oil (3 flasks)', 'Traveler\'s Clothes', '16 GP']
    },
    'Merchant': {
        description: 'You were apprenticed to a trader, caravan master, or shopkeeper.',
        scores: ['CON', 'INT', 'CHA'],
        feat: 'Lucky',
        featDescription: 'Gain Luck Points equal to your Proficiency Bonus.',
        skills: ['Animal Handling', 'Persuasion'],
        tool: 'Navigator\'s Tools',
        equipment: ['Navigator\'s Tools', '2 Pouches', 'Traveler\'s Clothes', '22 GP']
    },
    'Noble': {
        description: 'You were raised in a castle, surrounded by wealth, power, and privilege.',
        scores: ['STR', 'INT', 'CHA'],
        feat: 'Skilled',
        featDescription: 'Gain proficiency in any combination of three skills or tools.',
        skills: ['History', 'Persuasion'],
        tool: 'Gaming Set',
        equipment: ['Gaming Set', 'Fine Clothes', 'Perfume', '29 GP']
    },
    'Sage': {
        description: 'You spent your formative years traveling between manors and monasteries.',
        scores: ['CON', 'INT', 'WIS'],
        feat: 'Magic Initiate (Wizard)',
        featDescription: 'Learn 2 Wizard cantrips and 1 level 1 Wizard spell. Cast it once per long rest for free.',
        skills: ['Arcana', 'History'],
        tool: 'Calligrapher\'s Supplies',
        equipment: ['Calligrapher\'s Supplies', 'Quarterstaff', 'Book (history)', 'Parchment (8 sheets)', 'Robe', '8 GP']
    },
    'Sailor': {
        description: 'You lived as a seafarer, wind at your back and decks swaying beneath your feet.',
        scores: ['STR', 'DEX', 'WIS'],
        feat: 'Tavern Brawler',
        featDescription: 'Improved unarmed strikes (d4) and can shove as bonus action when hitting unarmed.',
        skills: ['Acrobatics', 'Perception'],
        tool: 'Navigator\'s Tools',
        equipment: ['Navigator\'s Tools', 'Dagger', 'Rope', 'Traveler\'s Clothes', '20 GP']
    },
    'Scribe': {
        description: 'You spent formative years in a scriptorium or monastery dedicated to knowledge.',
        scores: ['DEX', 'INT', 'WIS'],
        feat: 'Skilled',
        featDescription: 'Gain proficiency in any combination of three skills or tools.',
        skills: ['Investigation', 'Perception'],
        tool: 'Calligrapher\'s Supplies',
        equipment: ['Calligrapher\'s Supplies', 'Fine Clothes', 'Lamp', 'Oil (3 flasks)', 'Parchment (12 sheets)', '23 GP']
    },
    'Soldier': {
        description: 'You began training for war as soon as you reached adulthood.',
        scores: ['STR', 'DEX', 'CON'],
        feat: 'Savage Attacker',
        featDescription: 'Once per turn, roll weapon damage dice twice and use the higher total.',
        skills: ['Athletics', 'Intimidation'],
        tool: 'Gaming Set',
        equipment: ['Gaming Set', 'Spear', 'Shortbow', '20 Arrows', 'Healer\'s Kit', 'Quiver', 'Traveler\'s Clothes', '14 GP']
    },
    'Wayfarer': {
        description: 'You grew up on the streets surrounded by similarly ill-fated castoffs.',
        scores: ['DEX', 'WIS', 'CHA'],
        feat: 'Lucky',
        featDescription: 'Gain Luck Points equal to your Proficiency Bonus.',
        skills: ['Insight', 'Stealth'],
        tool: 'Thieves\' Tools',
        equipment: ['Thieves\' Tools', '2 Daggers', 'Gaming Set', 'Bedroll', '2 Pouches', 'Traveler\'s Clothes', '16 GP']
    },
};
