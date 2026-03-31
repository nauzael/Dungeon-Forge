import { BackgroundData } from '../types';

export const BACKGROUNDS: Record<string, BackgroundData> = {
    'Acolyte': { 
        description: 'Devoted to service in a temple.', 
        scores: ['INT', 'WIS', 'CHA'], 
        feat: 'Magic Initiate (Cleric)', 
        featDescription: 'Learn 2 Cleric cantrips and 1 level 1 Cleric spell. Cast it once per long rest for free.', 
        skills: ['Insight', 'Religion'], 
        tool: 'Calligrapher\'s Supplies',
        equipment: ['Calligrapher\'s Supplies', 'Book (Prayers)', 'Holy Symbol', 'Parchment (10)', 'Robe', '8 GP'] 
    },
    'Artisan': { 
        description: 'Started as an apprentice to a master craftsman.', 
        scores: ['STR', 'DEX', 'INT'], 
        feat: 'Crafter', 
        featDescription: 'Proficiency with 3 artisan tools. 20% discount on nonmagical items. Fast Crafting.', 
        skills: ['Investigation', 'Persuasion'], 
        tool: 'Artisan\'s Tools',
        equipment: ['Artisan\'s Tools', 'Pouch (2)', 'Traveler\'s Clothes', '32 GP'] 
    },
    'Charlatan': { 
        description: 'Learned to deceive to survive.', 
        scores: ['DEX', 'CON', 'CHA'], 
        feat: 'Skilled', 
        featDescription: 'Gain proficiency in any combination of three skills or tools.', 
        skills: ['Deception', 'Sleight of Hand'], 
        tool: 'Forgery Kit',
        equipment: ['Forgery Kit', 'Costume', 'Fine Clothes', '15 GP'] 
    },
    'Criminal': { 
        description: 'Survived in the dark alleys.', 
        scores: ['DEX', 'CON', 'INT'], 
        feat: 'Alert', 
        featDescription: 'Gain initiative proficiency and can swap your initiative with a willing ally.', 
        skills: ['Sleight of Hand', 'Stealth'], 
        tool: 'Thieves\' Tools',
        equipment: ['Thieves\' Tools', 'Dagger (2)', 'Crowbar', 'Pouch (2)', 'Traveler\'s Clothes', '16 GP'] 
    },
    'Entertainer': { 
        description: 'Thrive under the applause of the crowd.', 
        scores: ['STR', 'DEX', 'CHA'], 
        feat: 'Musician', 
        featDescription: 'Proficiency with 3 instruments. Grant Heroic Inspiration to allies after a rest.', 
        skills: ['Acrobatics', 'Performance'], 
        tool: 'Musical Instrument',
        equipment: ['Musical Instrument', 'Costume (2)', 'Mirror', 'Perfume', 'Traveler\'s Clothes', '11 GP'] 
    },
    'Farmer': { 
        description: 'Grew up close to the land and nature.', 
        scores: ['STR', 'CON', 'WIS'], 
        feat: 'Tough', 
        featDescription: 'Your hit point maximum increases by 2 per level.', 
        skills: ['Animal Handling', 'Nature'], 
        tool: 'Carpenter\'s Tools',
        equipment: ['Carpenter\'s Tools', 'Sickle', 'Healer\'s Kit', 'Iron Pot', 'Shovel', 'Traveler\'s Clothes', '30 GP'] 
    },
    'Guard': { 
        description: 'Trained to watch against dangers.', 
        scores: ['STR', 'INT', 'WIS'], 
        feat: 'Alert', 
        featDescription: 'Gain initiative proficiency and can swap your initiative with a willing ally.', 
        skills: ['Athletics', 'Perception'], 
        tool: 'Gaming Set',
        equipment: ['Gaming Set', 'Spear', 'Light Crossbow', 'Bolts (20)', 'Hooded Lantern', 'Manacles', 'Quiver', 'Traveler\'s Clothes', '12 GP'] 
    },
    'Guide': { 
        description: 'Grew up outdoors, far from the city.', 
        scores: ['DEX', 'CON', 'WIS'], 
        feat: 'Magic Initiate (Druid)', 
        featDescription: 'Learn 2 Druid cantrips and 1 level 1 Druid spell. Cast it once per long rest for free.', 
        skills: ['Stealth', 'Survival'], 
        tool: 'Cartographer\'s Tools',
        equipment: ['Cartographer\'s Tools', 'Shortbow', 'Arrows (20)', 'Bedroll', 'Quiver', 'Tent', 'Traveler\'s Clothes', '3 GP'] 
    },
    'Hermit': { 
        description: 'Spent your early years in seclusion.', 
        scores: ['CON', 'WIS', 'CHA'], 
        feat: 'Healer', 
        featDescription: 'Improve treatment with healer\'s kits and spend Hit Dice to heal allies in battle.', 
        skills: ['Medicine', 'Religion'], 
        tool: 'Herbalism Kit',
        equipment: ['Herbalism Kit', 'Quarterstaff', 'Bedroll', 'Book (Philosophy)', 'Lamp', 'Oil (3)', 'Traveler\'s Clothes', '16 GP'] 
    },
    'Merchant': { 
        description: 'Apprentice to a merchant or shopkeeper.', 
        scores: ['CON', 'INT', 'CHA'], 
        feat: 'Lucky', 
        featDescription: 'Gain Luck Points equal to your Proficiency Bonus to gain advantage or impose disadvantage.', 
        skills: ['Animal Handling', 'Persuasion'], 
        tool: 'Navigator\'s Tools',
        equipment: ['Navigator\'s Tools', 'Pouch (2)', 'Traveler\'s Clothes', '22 GP'] 
    },
    'Noble': { 
        description: 'Raised in a castle with wealth and power.', 
        scores: ['STR', 'INT', 'CHA'], 
        feat: 'Skilled', 
        featDescription: 'Gain proficiency in any combination of three skills or tools.', 
        skills: ['History', 'Persuasion'], 
        tool: 'Gaming Set',
        equipment: ['Gaming Set', 'Fine Clothes', 'Perfume', '29 GP'] 
    },
    'Sage': { 
        description: 'Spent nights studying books and scrolls.', 
        scores: ['CON', 'INT', 'WIS'], 
        feat: 'Magic Initiate (Wizard)', 
        featDescription: 'Learn 2 Wizard cantrips and 1 level 1 Wizard spell. Cast it once per long rest for free.', 
        skills: ['Arcana', 'History'], 
        tool: 'Calligrapher\'s Supplies',
        equipment: ['Calligrapher\'s Supplies', 'Quarterstaff', 'Book (History)', 'Parchment (8)', 'Robe', '8 GP'] 
    },
    'Sailor': { 
        description: 'Lived as a mariner, with the wind at your back.', 
        scores: ['STR', 'DEX', 'WIS'], 
        feat: 'Tavern Brawler', 
        featDescription: 'Improved unarmed strikes (d4) and can shove as a bonus action when hitting unarmed.', 
        skills: ['Acrobatics', 'Perception'], 
        tool: 'Navigator\'s Tools',
        equipment: ['Navigator\'s Tools', 'Dagger', 'Rope', 'Traveler\'s Clothes', '20 GP'] 
    },
    'Scribe': { 
        description: 'Learned to write with a clear hand.', 
        scores: ['DEX', 'INT', 'WIS'], 
        feat: 'Skilled', 
        featDescription: 'Gain proficiency in any combination of three skills or tools.', 
        skills: ['Investigation', 'Perception'], 
        tool: 'Calligrapher\'s Supplies',
        equipment: ['Calligrapher\'s Supplies', 'Fine Clothes', 'Lamp', 'Oil (3)', 'Parchment (12)', '23 GP'] 
    },
    'Soldier': { 
        description: 'Trained for war from a young age.', 
        scores: ['STR', 'DEX', 'CON'], 
        feat: 'Savage Attacker', 
        featDescription: 'Once per turn, roll weapon damage dice twice and use the higher total.', 
        skills: ['Athletics', 'Intimidation'], 
        tool: 'Gaming Set',
        equipment: ['Gaming Set', 'Spear', 'Shortbow', 'Arrows (20)', 'Healer\'s Kit', 'Quiver', 'Traveler\'s Clothes', '14 GP'] 
    },
    'Wayfarer': { 
        description: 'Grew up on the streets, resorting to theft.', 
        scores: ['DEX', 'WIS', 'CHA'], 
        feat: 'Lucky', 
        featDescription: 'Gain Luck Points equal to your Proficiency Bonus to gain advantage or impose disadvantage.', 
        skills: ['Insight', 'Stealth'], 
        tool: 'Thieves\' Tools',
        equipment: ['Thieves\' Tools', 'Dagger (2)', 'Gaming Set', 'Bedroll', 'Pouch (2)', 'Traveler\'s Clothes', '16 GP'] 
    }
};
