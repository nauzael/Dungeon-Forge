const fs = require('fs');

const filePath = './Data/items.ts';
let content = fs.readFileSync(filePath, 'utf8');

const newGearItems = `    'Barrel': { name: 'Barrel', type: 'Gear', weight: 70, cost: '2 GP', description: 'A Barrel holds up to 40 gallons of liquid or up to 4 cubic feet of dry goods.' },
    'Basket': { name: 'Basket', type: 'Gear', weight: 2, cost: '4 SP', description: 'A Basket holds up to 40 pounds within 2 cubic feet.' },
    'Bottle, Glass': { name: 'Bottle, Glass', type: 'Gear', weight: 2, cost: '2 GP', description: 'A Glass Bottle holds up to 1 1/2 pints.' },
    'Bucket': { name: 'Bucket', type: 'Gear', weight: 2, cost: '5 CP', description: 'A Bucket holds up to half a cubic foot of contents.' },
    'Case, Crossbow Bolt': { name: 'Case, Crossbow Bolt', type: 'Gear', weight: 1, cost: '1 GP', description: 'A Crossbow Bolt Case holds up to 20 Bolts.' },
    'Case, Map or Scroll': { name: 'Case, Map or Scroll', type: 'Gear', weight: 1, cost: '1 GP', description: 'A Map or Scroll Case holds up to 10 sheets of paper or 5 sheets of parchment.' },
    'Costume': { name: 'Costume', type: 'Gear', weight: 4, cost: '5 GP', description: 'While wearing a Costume, you have Advantage on any ability check you make to impersonate the person or type of person it represents.' },
    'Desert Clothing': { name: 'Desert Clothing', type: 'Gear', weight: 0, cost: '5 GP', description: 'When you are wearing Desert Clothing and not wearing Medium or Heavy armor, you automatically succeed on saving throws against the effects of extreme heat.' },
    'Devil Mask': { name: 'Devil Mask', type: 'Gear', weight: 0, cost: '25 GP', description: 'While wearing a Devil Mask, other creatures have Disadvantage on Intelligence (Investigation) and Wisdom (Insight) checks made to discern your true identity or intentions.' },
    'Flask': { name: 'Flask', type: 'Gear', weight: 1, cost: '2 CP', description: 'A Flask holds up to 1 pint.' },
    'Garb of Light and Shadow': { name: 'Garb of Light and Shadow', type: 'Gear', weight: 0, cost: '50 GP', description: 'This garb appeals to Fey from one Domain of Delight. While wearing the garb, you have Advantage on ability checks to influence Fey associated with that Domain of Delight.' },
    'Genie Robe': { name: 'Genie Robe', type: 'Gear', weight: 0, cost: '50 GP', description: 'This robe appeals to Elementals associated with a particular Elemental Plane (Air, Earth, Fire, Water). While wearing a Genie Robe, you have Advantage on ability checks made to influence Elementals associated with that plane.' },
    'Ink Pen': { name: 'Ink Pen', type: 'Gear', weight: 0, cost: '2 CP', description: 'Using Ink, an Ink Pen is used to write or draw.' },
    'Jug': { name: 'Jug', type: 'Gear', weight: 4, cost: '2 CP', description: 'A Jug holds up to 1 gallon.' },
    'Ladder': { name: 'Ladder', type: 'Gear', weight: 25, cost: '1 SP', description: 'A Ladder is 10 feet tall. You must climb to move up or down it.' },
    'Lamp': { name: 'Lamp', type: 'Gear', weight: 1, cost: '5 SP', description: 'A Lamp burns Oil as fuel to cast Bright Light in a 15-foot radius and Dim Light for an additional 30 feet.' },
    'Magnifying Glass': { name: 'Magnifying Glass', type: 'Gear', weight: 0, cost: '100 GP', description: 'A Magnifying Glass grants Advantage on any ability check made to appraise or inspect a highly detailed item. Lighting a fire with a Magnifying Glass requires light as bright as sunlight to focus, tinder to ignite, and about 5 minutes.' },
    'Map': { name: 'Map', type: 'Gear', weight: 0, cost: '1 GP', description: 'If you consult an accurate Map, you gain a +5 bonus to Wisdom (Survival) checks you make to find your way in the place represented on it.' },
    'Mirror': { name: 'Mirror', type: 'Gear', weight: 0.5, cost: '5 GP', description: 'A handheld steel Mirror is useful for personal cosmetics but also for peeking around corners and reflecting light as a signal.' },
    'Pole': { name: 'Pole', type: 'Gear', weight: 7, cost: '5 CP', description: 'A Pole is 10 feet long. You can use it to touch something up to 10 feet away. If you must make a Strength (Athletics) check as part of a High or Long Jump, you can use the Pole to vault, giving yourself Advantage on the check.' },
    'Pot, Iron': { name: 'Pot, Iron', type: 'Gear', weight: 10, cost: '2 GP', description: 'An Iron Pot holds up to 1 gallon.' },
    'Quiver': { name: 'Quiver', type: 'Gear', weight: 1, cost: '1 GP', description: 'A Quiver holds up to 20 Arrows.' },
    'Ram, Portable': { name: 'Ram, Portable', type: 'Gear', weight: 35, cost: '4 GP', description: 'You can use a Portable Ram to break down doors. When doing so, you gain a +4 bonus to the Strength check. One other character can help you, giving you Advantage.' },
    'Robe': { name: 'Robe', type: 'Gear', weight: 4, cost: '1 GP', description: 'A Robe has vocational or ceremonial significance. Some events and locations admit only people wearing a Robe bearing certain colors or symbols.' },
    'Sack': { name: 'Sack', type: 'Gear', weight: 0.5, cost: '1 CP', description: 'A Sack holds up to 30 pounds within 1 cubic foot.' },
    'Spikes, Iron': { name: 'Spikes, Iron', type: 'Gear', weight: 5, cost: '1 GP', description: 'Iron Spikes come in bundles of ten. As a Utilize action, you can use a blunt object to hammer a spike into wood, earth, or similar material. You can jam a door shut or tie a Rope or Chain to the Spike.' },
    'String': { name: 'String', type: 'Gear', weight: 0, cost: '1 SP', description: 'String is 10 feet long. You can tie a knot in it as a Utilize action.' },
    'Vial': { name: 'Vial', type: 'Gear', weight: 0, cost: '1 GP', description: 'A Vial holds up to 4 ounces.' },
    'Warm Fungal Clothing': { name: 'Warm Fungal Clothing', type: 'Gear', weight: 0, cost: '15 GP', description: 'When wearing Warm Fungal Clothing, you automatically succeed on saving throws against the effects of extreme cold. One pound of fungus is sewn into it and can be eaten. Once all fungus is consumed, it becomes mundane Traveler\'s Clothes.' },
    'Winter Camouflage': { name: 'Winter Camouflage', type: 'Gear', weight: 0, cost: '50 GP', description: 'While you wear Winter Camouflage in an appropriate environment, you have Advantage on Dexterity (Stealth) checks.' },`;

const ammoDB = `
// --- AMMUNITION ---
export const AMMO_DB: Record<string, ItemData> = {
    'Arrows (20)': { name: 'Arrows (20)', type: 'Ammunition', weight: 1, cost: '1 GP' },
    'Bolts (20)': { name: 'Bolts (20)', type: 'Ammunition', weight: 1.5, cost: '1 GP' },
    'Bullets, Firearm (10)': { name: 'Bullets, Firearm (10)', type: 'Ammunition', weight: 2, cost: '3 GP' },
    'Bullets, Sling (20)': { name: 'Bullets, Sling (20)', type: 'Ammunition', weight: 1.5, cost: '4 CP' },
    'Needles (50)': { name: 'Needles (50)', type: 'Ammunition', weight: 1, cost: '1 GP' },
};`;

const mountsDB = `
// --- MOUNTS & ANIMALS ---
export const MOUNTS_DB: Record<string, ItemData> = {
    'Axe Beak': { name: 'Axe Beak', type: 'Mount', weight: 0, cost: '50 GP', carryingCapacity: '210 lb.' },
    'Camel': { name: 'Camel', type: 'Mount', weight: 0, cost: '50 GP', carryingCapacity: '450 lb.' },
    'Elephant': { name: 'Elephant', type: 'Mount', weight: 0, cost: '200 GP', carryingCapacity: '1,320 lb.' },
    'Flying Snake': { name: 'Flying Snake', type: 'Mount', weight: 0, cost: '25 GP', carryingCapacity: '60 lb.' },
    'Horse, Draft': { name: 'Horse, Draft', type: 'Mount', weight: 0, cost: '50 GP', carryingCapacity: '540 lb.' },
    'Horse, Riding': { name: 'Horse, Riding', type: 'Mount', weight: 0, cost: '75 GP', carryingCapacity: '480 lb.' },
    'Mastiff': { name: 'Mastiff', type: 'Mount', weight: 0, cost: '25 GP', carryingCapacity: '195 lb.' },
    'Mule': { name: 'Mule', type: 'Mount', weight: 0, cost: '8 GP', carryingCapacity: '420 lb.' },
    'Pony': { name: 'Pony', type: 'Mount', weight: 0, cost: '30 GP', carryingCapacity: '225 lb.' },
    'Sled Dog': { name: 'Sled Dog', type: 'Mount', weight: 0, cost: '50 GP', carryingCapacity: '210 lb.' },
    'Warhorse': { name: 'Warhorse', type: 'Mount', weight: 0, cost: '400 GP', carryingCapacity: '540 lb.' },
};`;

const vehiclesDB = `
// --- VEHICLES ---
export const VEHICLES_DB: Record<string, ItemData> = {
    'Carriage': { name: 'Carriage', type: 'Vehicle', weight: 600, cost: '100 GP' },
    'Cart': { name: 'Cart', type: 'Vehicle', weight: 200, cost: '15 GP' },
    'Chariot': { name: 'Chariot', type: 'Vehicle', weight: 100, cost: '250 GP' },
    'Covered Wagon': { name: 'Covered Wagon', type: 'Vehicle', weight: 1300, cost: '250 GP' },
    'Feed per day': { name: 'Feed per day', type: 'Vehicle', weight: 10, cost: '5 CP' },
    'Sled': { name: 'Sled', type: 'Vehicle', weight: 300, cost: '20 GP' },
    'Stabling per day': { name: 'Stabling per day', type: 'Vehicle', weight: 0, cost: '5 SP' },
    'Wagon': { name: 'Wagon', type: 'Vehicle', weight: 400, cost: '35 GP' },
    'Rowboat': { name: 'Rowboat', type: 'Vehicle', weight: 100, cost: '50 GP' },
    'Keelboat': { name: 'Keelboat', type: 'Vehicle', weight: 0, cost: '3,000 GP' },
    'Longship': { name: 'Longship', type: 'Vehicle', weight: 0, cost: '10,000 GP' },
    'Sailing Ship': { name: 'Sailing Ship', type: 'Vehicle', weight: 0, cost: '10,000 GP' },
    'Warship': { name: 'Warship', type: 'Vehicle', weight: 0, cost: '25,000 GP' },
    'Galley': { name: 'Galley', type: 'Vehicle', weight: 0, cost: '30,000 GP' },
    'Airship': { name: 'Airship', type: 'Vehicle', weight: 0, cost: '40,000 GP' },
};`;

const toolsDB = `
// --- TOOLS ---
export const TOOLS_DB: Record<string, ItemData> = {
    // Artisan's Tools
    'Alchemist\'s Supplies': { name: 'Alchemist\'s Supplies', type: 'Tool', weight: 8, cost: '50 GP' },
    'Brewer\'s Supplies': { name: 'Brewer\'s Supplies', type: 'Tool', weight: 9, cost: '20 GP' },
    'Calligrapher\'s Supplies': { name: 'Calligrapher\'s Supplies', type: 'Tool', weight: 5, cost: '10 GP' },
    'Carpenter\'s Tools': { name: 'Carpenter\'s Tools', type: 'Tool', weight: 6, cost: '8 GP' },
    'Cartographer\'s Tools': { name: 'Cartographer\'s Tools', type: 'Tool', weight: 6, cost: '15 GP' },
    'Cobbler\'s Tools': { name: 'Cobbler\'s Tools', type: 'Tool', weight: 5, cost: '5 GP' },
    'Cook\'s Utensils': { name: 'Cook\'s Utensils', type: 'Tool', weight: 8, cost: '1 GP' },
    'Glassblower\'s Tools': { name: 'Glassblower\'s Tools', type: 'Tool', weight: 5, cost: '30 GP' },
    'Jeweler\'s Tools': { name: 'Jeweler\'s Tools', type: 'Tool', weight: 2, cost: '25 GP' },
    'Leatherworker\'s Tools': { name: 'Leatherworker\'s Tools', type: 'Tool', weight: 5, cost: '5 GP' },
    'Mason\'s Tools': { name: 'Mason\'s Tools', type: 'Tool', weight: 8, cost: '10 GP' },
    'Painter\'s Supplies': { name: 'Painter\'s Supplies', type: 'Tool', weight: 5, cost: '10 GP' },
    'Potter\'s Tools': { name: 'Potter\'s Tools', type: 'Tool', weight: 3, cost: '10 GP' },
    'Smith\'s Tools': { name: 'Smith\'s Tools', type: 'Tool', weight: 8, cost: '20 GP' },
    'Tinker\'s Tools': { name: 'Tinker\'s Tools', type: 'Tool', weight: 10, cost: '50 GP' },
    'Weaver\'s Tools': { name: 'Weaver\'s Tools', type: 'Tool', weight: 5, cost: '1 GP' },
    'Woodcarver\'s Tools': { name: 'Woodcarver\'s Tools', type: 'Tool', weight: 5, cost: '1 GP' },
    // Gaming Sets
    'Dice': { name: 'Dice', type: 'Tool', weight: 0, cost: '1 SP' },
    'Dragonchess Set': { name: 'Dragonchess Set', type: 'Tool', weight: 0, cost: '1 GP' },
    'Playing Cards': { name: 'Playing Cards', type: 'Tool', weight: 0, cost: '5 SP' },
    'Three-dragon Ante Set': { name: 'Three-dragon Ante Set', type: 'Tool', weight: 0, cost: '1 GP' },
    // Musical Instruments
    'Bagpipes': { name: 'Bagpipes', type: 'Tool', weight: 6, cost: '30 GP' },
    'Drum': { name: 'Drum', type: 'Tool', weight: 3, cost: '6 GP' },
    'Dulcimer': { name: 'Dulcimer', type: 'Tool', weight: 10, cost: '25 GP' },
    'Flute': { name: 'Flute', type: 'Tool', weight: 1, cost: '2 GP' },
    'Horn': { name: 'Horn', type: 'Tool', weight: 2, cost: '3 GP' },
    'Lute': { name: 'Lute', type: 'Tool', weight: 2, cost: '35 GP' },
    'Lyre': { name: 'Lyre', type: 'Tool', weight: 2, cost: '30 GP' },
    'Pan Flute': { name: 'Pan Flute', type: 'Tool', weight: 2, cost: '12 GP' },
    'Shawm': { name: 'Shawm', type: 'Tool', weight: 1, cost: '2 GP' },
    'Viol': { name: 'Viol', type: 'Tool', weight: 1, cost: '30 GP' },
    // Other Tools
    'Disguise Kit': { name: 'Disguise Kit', type: 'Tool', weight: 3, cost: '25 GP' },
    'Forgery Kit': { name: 'Forgery Kit', type: 'Tool', weight: 5, cost: '15 GP' },
    'Herbalism Kit': { name: 'Herbalism Kit', type: 'Tool', weight: 3, cost: '5 GP' },
    'Poisoner\'s Kit': { name: 'Poisoner\'s Kit', type: 'Tool', weight: 2, cost: '50 GP' },
    'Navigator\'s Tools': { name: 'Navigator\'s Tools', type: 'Tool', weight: 2, cost: '25 GP' },
    'Thieves\' Tools': { name: 'Thieves\' Tools', type: 'Tool', weight: 1, cost: '25 GP' },
};`;

const saddlesDB = `
// --- SADDLES ---
export const SADDLES_DB: Record<string, ItemData> = {
    'Exotic Saddle': { name: 'Exotic Saddle', type: 'Saddle', weight: 40, cost: '60 GP', description: 'An Exotic Saddle is required for riding an aquatic or a flying mount.' },
    'Military Saddle': { name: 'Military Saddle', type: 'Saddle', weight: 30, cost: '20 GP', description: 'A Military Saddle gives Advantage on any ability check you make to remain mounted.' },
    'Riding Saddle': { name: 'Riding Saddle', type: 'Saddle', weight: 25, cost: '10 GP' },
};`;

const oldGearEnd = `    'Monster Camouflage': { name: 'Monster Camouflage', type: 'Gear', weight: 2, cost: '50 GP', description: "Disguise as a Beast/Monstrosity. DC 10 Int (Investigation/Nature) to discern. Advantage on check if within 30ft." },
};`;

const newGearEnd = `    'Monster Camouflage': { name: 'Monster Camouflage', type: 'Gear', weight: 2, cost: '50 GP', description: "Disguise as a Beast/Monstrosity. DC 10 Int (Investigation/Nature) to discern. Advantage on check if within 30ft." },
${newGearItems}
};`;

content = content.replace(oldGearEnd, newGearEnd);

content = content.replace(
    `// --- MAGIC ITEMS`,
    `${ammoDB}\n${mountsDB}\n${vehiclesDB}\n${toolsDB}\n${saddlesDB}\n\n// --- MAGIC ITEMS`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Items file updated successfully!');