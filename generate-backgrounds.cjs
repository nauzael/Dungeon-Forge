const fs = require('fs');
const path = require('path');

const MANUAL = fs.readFileSync('docs/Manual/02-species-backgrounds.md', 'utf8');
const OUTPUT_DIR_EN = 'Data/backgrounds/en';
const OUTPUT_DIR_ES = 'Data/backgrounds/es';

const backgrounds = {
  // === COMMON BACKGROUNDS ===
  'Acolyte': {
    description: 'Devoto al servicio en un templo.',
    descriptionEn: 'Devoted to service in a temple, either nestled in a town or secluded in a sacred grove.',
    scores: ['INT', 'WIS', 'CHA'],
    feat: 'Iniciado en la Magia (Clérigo)',
    featEn: 'Magic Initiate (Cleric)',
    featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de clérigo. Puedes lanzarlo una vez gratis por descanso largo.',
    featDescriptionEn: 'Learn 2 Cleric cantrips and 1 level 1 Cleric spell. Cast it once per long rest for free.',
    skills: ['Insight', 'Religion'],
    tool: 'Suministros de Caligrafía',
    toolEn: "Calligrapher's Supplies",
    equipment: ['Suministros de Caligrafía', 'Libro (Oraciones)', 'Símbolo Sagrado', 'Pergamino (10)', 'Túnica', '8 PO'],
    equipmentEn: ["Calligrapher's Supplies", 'Book (prayers)', 'Holy Symbol', 'Parchment (10)', 'Robe', '8 GP']
  },
  'Artisan': {
    description: 'Empezaste como aprendiz de artesano.',
    descriptionEn: 'You began mopping floors and scrubbing counters in an artisan\'s workshop.',
    scores: ['STR', 'DEX', 'INT'],
    feat: 'Fabricante',
    featEn: 'Crafter',
    featDescription: 'Competencia con 3 herramientas de artesano. Descuento del 20% en objetos no mágicos. Fabricación rápida.',
    featDescriptionEn: 'Proficiency with three Artisan\'s Tools. 20% discount on nonmagical items. Fast Crafting.',
    skills: ['Investigation', 'Persuasion'],
    tool: 'Herramientas de Artesano',
    toolEn: "Artisan's Tools",
    equipment: ['Herramientas de Artesano', 'Bolsa (2)', 'Ropa de Viajero', '32 PO'],
    equipmentEn: ["Artisan's Tools", '2 Pouches', "Traveler's Clothes", '32 GP']
  },
  'Charlatan': {
    description: 'Aprendiste a engañar para sobrevivir.',
    descriptionEn: 'Once you were old enough to order an ale, you soon had a favorite stool in every tavern.',
    scores: ['DEX', 'CON', 'CHA'],
    feat: 'Habilidoso',
    featEn: 'Skilled',
    featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.',
    featDescriptionEn: 'Gain proficiency in any combination of three skills or tools.',
    skills: ['Deception', 'Sleight of Hand'],
    tool: 'Kit de Falsificación',
    toolEn: 'Forgery Kit',
    equipment: ['Kit de Falsificación', 'Disfraz', 'Ropa Fina', '15 PO'],
    equipmentEn: ['Forgery Kit', 'Costume', 'Fine Clothes', '15 GP']
  },
  'Criminal': {
    description: 'Sobreviviste en los callejones oscuros.',
    descriptionEn: 'You eked out a living in dark alleyways, cutting purses or burgling shops.',
    scores: ['DEX', 'CON', 'INT'],
    feat: 'Alerta',
    featEn: 'Alert',
    featDescription: 'Ganas competencia en iniciativa y puedes intercambio tu iniciativa con un aliado.',
    featDescriptionEn: 'Gain initiative proficiency and can swap your initiative with a willing ally.',
    skills: ['Sleight of Hand', 'Stealth'],
    tool: 'Herramientas de Ladrón',
    toolEn: "Thieves' Tools",
    equipment: ['Herramientas de Ladrón', 'Daga (2)', 'Palanca', 'Bolsa (2)', 'Ropa de Viajero', '16 PO'],
    equipmentEn: ["Thieves' Tools", '2 Daggers', 'Crowbar', '2 Pouches', "Traveler's Clothes", '16 GP']
  },
  'Entertainer': {
    description: 'Prosperas bajo el aplauso del público.',
    descriptionEn: 'You spent much of your youth following roving fairs and carnivals.',
    scores: ['STR', 'DEX', 'CHA'],
    feat: 'Músico',
    featEn: 'Musician',
    featDescription: 'Competencia con 3 instrumentos. Puedes dar Inspiración Heroica a aliados.',
    featDescriptionEn: 'Proficiency with three Musical Instruments. Grant Heroic Inspiration to allies after a rest.',
    skills: ['Acrobatics', 'Performance'],
    tool: 'Instrumento Musical',
    toolEn: 'Musical Instrument',
    equipment: ['Instrumento Musical', 'Disfraz (2)', 'Espejo', 'Perfume', 'Ropa de Viajero', '11 PO'],
    equipmentEn: ['Musical Instrument', '2 Costumes', 'Mirror', 'Perfume', "Traveler's Clothes", '11 GP']
  },
  'Farmer': {
    description: 'Creciste cerca de la tierra y la naturaleza.',
    descriptionEn: 'You grew up close to the land, tending animals and cultivating the earth.',
    scores: ['STR', 'CON', 'WIS'],
    feat: 'Duro',
    featEn: 'Tough',
    featDescription: 'Tu máximo de puntos de golpe aumenta en 2 por nivel actual y futuro.',
    featDescriptionEn: 'Your hit point maximum increases by 2 per level.',
    skills: ['Animal Handling', 'Nature'],
    tool: 'Herramientas de Carpintero',
    toolEn: "Carpenter's Tools",
    equipment: ['Herramientas de Carpintero', 'Hoz', 'Kit de Curación', 'Olla de Hierro', 'Pala', 'Ropa de Viajero', '30 PO'],
    equipmentEn: ["Carpenter's Tools", 'Sickle', "Healer's Kit", 'Iron Pot', 'Shovel', "Traveler's Clothes", '30 GP']
  },
  'Guard': {
    description: 'Entrenado para vigilar contra peligros.',
    descriptionEn: 'Your feet ache when you remember the countless hours you spent at your post.',
    scores: ['STR', 'INT', 'WIS'],
    feat: 'Alerta',
    featEn: 'Alert',
    featDescription: 'Ganas competencia en iniciativa y puedes intercambio tu iniciativa con un aliado.',
    featDescriptionEn: 'Gain initiative proficiency and can swap your initiative with a willing ally.',
    skills: ['Athletics', 'Perception'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Lanza', 'Ballesta Ligera', 'Virotes (20)', 'Linterna Encapuchada', 'Grilletes', 'Carcaj', 'Ropa de Viajero', '12 PO'],
    equipmentEn: ['Gaming Set', 'Spear', 'Light Crossbow', '20 Bolts', 'Hooded Lantern', 'Manacles', 'Quiver', "Traveler's Clothes", '12 GP']
  },
  'Guide': {
    description: 'Creciste al aire libre, lejos de la ciudad.',
    descriptionEn: 'You came of age outdoors, far from settled lands.',
    scores: ['DEX', 'CON', 'WIS'],
    feat: 'Iniciado en la Magia (Druida)',
    featEn: 'Magic Initiate (Druid)',
    featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de druida. Puedes lanzarlo una vez gratis por descanso largo.',
    featDescriptionEn: 'Learn 2 Druid cantrips and 1 level 1 Druid spell. Cast it once per long rest for free.',
    skills: ['Stealth', 'Survival'],
    tool: 'Herramientas de Cartógrafo',
    toolEn: "Cartographer's Tools",
    equipment: ['Herramientas de Cartógrafo', 'Arco Corto', 'Flechas (20)', 'Saco de Dormir', 'Carcaj', 'Tienda de Campaña', 'Ropa de Viajero', '3 PO'],
    equipmentEn: ["Cartographer's Tools", 'Shortbow', '20 Arrows', 'Bedroll', 'Quiver', 'Tent', "Traveler's Clothes", '3 GP']
  },
  'Hermit': {
    description: 'Pasaste tus primeros años en reclusión.',
    descriptionEn: 'You spent your early years secluded in a hut or monastery.',
    scores: ['CON', 'WIS', 'CHA'],
    feat: 'Sanador',
    featEn: 'Healer',
    featDescription: 'Mejoras el uso de kits de sanador y puedes gastar Dados de Golpe para curar.',
    featDescriptionEn: "Improve treatment with healer's kits and spend Hit Dice to heal allies in battle.",
    skills: ['Medicine', 'Religion'],
    tool: 'Kit de Herboristería',
    toolEn: 'Herbalism Kit',
    equipment: ['Kit de Herboristería', 'Bastón', 'Saco de Dormir', 'Libro (Filosofía)', 'Lámpara', 'Aceite (3)', 'Ropa de Viajero', '16 PO'],
    equipmentEn: ['Herbalism Kit', 'Quarterstaff', 'Bedroll', 'Book (philosophy)', 'Lamp', 'Oil (3 flasks)', "Traveler's Clothes", '16 GP']
  },
  'Merchant': {
    description: 'Aprendiz de comerciante o tendero.',
    descriptionEn: 'You were apprenticed to a trader, caravan master, or shopkeeper.',
    scores: ['CON', 'INT', 'CHA'],
    feat: 'Afortunado',
    featEn: 'Lucky',
    featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia.',
    featDescriptionEn: 'Gain Luck Points equal to your Proficiency Bonus.',
    skills: ['Animal Handling', 'Persuasion'],
    tool: 'Herramientas de Navegante',
    toolEn: "Navigator's Tools",
    equipment: ['Herramientas de Navegante', 'Bolsa (2)', 'Ropa de Viajero', '22 PO'],
    equipmentEn: ["Navigator's Tools", '2 Pouches', "Traveler's Clothes", '22 GP']
  },
  'Noble': {
    description: 'Criado en un castillo con riqueza y poder.',
    descriptionEn: 'You were raised in a castle, surrounded by wealth, power, and privilege.',
    scores: ['STR', 'INT', 'CHA'],
    feat: 'Habilidoso',
    featEn: 'Skilled',
    featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.',
    featDescriptionEn: 'Gain proficiency in any combination of three skills or tools.',
    skills: ['History', 'Persuasion'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Ropa Fina', 'Perfume', '29 PO'],
    equipmentEn: ['Gaming Set', 'Fine Clothes', 'Perfume', '29 GP']
  },
  'Sage': {
    description: 'Pasaste noches estudiando libros y pergaminos.',
    descriptionEn: 'You spent your formative years traveling between manors and monasteries.',
    scores: ['CON', 'INT', 'WIS'],
    feat: 'Iniciado en la Magia (Mago)',
    featEn: 'Magic Initiate (Wizard)',
    featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de mago. Puedes lanzarlo una vez gratis por descanso largo.',
    featDescriptionEn: 'Learn 2 Wizard cantrips and 1 level 1 Wizard spell. Cast it once per long rest for free.',
    skills: ['Arcana', 'History'],
    tool: 'Suministros de Caligrafía',
    toolEn: "Calligrapher's Supplies",
    equipment: ['Suministros de Caligrafía', 'Bastón', 'Libro (Historia)', 'Pergamino (8)', 'Túnica', '8 PO'],
    equipmentEn: ["Calligrapher's Supplies", 'Quarterstaff', 'Book (history)', 'Parchment (8 sheets)', 'Robe', '8 GP']
  },
  'Sailor': {
    description: 'Viviste como marino, con el viento a tu espalda.',
    descriptionEn: 'You lived as a seafarer, wind at your back and decks swaying beneath your feet.',
    scores: ['STR', 'DEX', 'WIS'],
    feat: 'Matón de Taberna',
    featEn: 'Tavern Brawler',
    featDescription: 'Ataques sin armas mejorados (d4) y puedes empujar como acción adicional.',
    featDescriptionEn: 'Improved unarmed strikes (d4) and can shove as bonus action when hitting unarmed.',
    skills: ['Acrobatics', 'Perception'],
    tool: 'Herramientas de Navegante',
    toolEn: "Navigator's Tools",
    equipment: ['Herramientas de Navegante', 'Daga', 'Cuerda', 'Ropa de Viajero', '20 PO'],
    equipmentEn: ["Navigator's Tools", 'Dagger', 'Rope', "Traveler's Clothes", '20 GP']
  },
  'Scribe': {
    description: 'Aprendiste a escribir con mano clara.',
    descriptionEn: 'You spent formative years in a scriptorium or monastery dedicated to knowledge.',
    scores: ['DEX', 'INT', 'WIS'],
    feat: 'Habilidoso',
    featEn: 'Skilled',
    featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.',
    featDescriptionEn: 'Gain proficiency in any combination of three skills or tools.',
    skills: ['Investigation', 'Perception'],
    tool: 'Suministros de Caligrafía',
    toolEn: "Calligrapher's Supplies",
    equipment: ['Suministros de Caligrafía', 'Ropa Fina', 'Lámpara', 'Aceite (3)', 'Pergamino (12)', '23 PO'],
    equipmentEn: ["Calligrapher's Supplies", 'Fine Clothes', 'Lamp', 'Oil (3 flasks)', 'Parchment (12 sheets)', '23 GP']
  },
  'Soldier': {
    description: 'Entrenado para la guerra desde joven.',
    descriptionEn: 'You began training for war as soon as you reached adulthood.',
    scores: ['STR', 'DEX', 'CON'],
    feat: 'Atacante Salvaje',
    featEn: 'Savage Attacker',
    featDescription: 'Una vez por turno, puedes tirar los dados de daño de un arma dos veces.',
    featDescriptionEn: 'Once per turn, roll weapon damage dice twice and use the higher total.',
    skills: ['Athletics', 'Intimidation'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Lanza', 'Arco Corto', 'Flechas (20)', 'Kit de Curación', 'Carcaj', 'Ropa de Viajero', '14 PO'],
    equipmentEn: ['Gaming Set', 'Spear', 'Shortbow', '20 Arrows', "Healer's Kit", 'Quiver', "Traveler's Clothes", '14 GP']
  },
  'Wayfarer': {
    description: 'Creciste en las calles, recurriendo al robo.',
    descriptionEn: 'You grew up on the streets surrounded by similarly ill-fated castoffs.',
    scores: ['DEX', 'WIS', 'CHA'],
    feat: 'Afortunado',
    featEn: 'Lucky',
    featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia.',
    featDescriptionEn: 'Gain Luck Points equal to your Proficiency Bonus.',
    skills: ['Insight', 'Stealth'],
    tool: 'Herramientas de Ladrón',
    toolEn: "Thieves' Tools",
    equipment: ['Herramientas de Ladrón', 'Daga (2)', 'Juego de Juego', 'Saco de Dormir', 'Bolsa (2)', 'Ropa de Viajero', '16 PO'],
    equipmentEn: ["Thieves' Tools", '2 Daggers', 'Gaming Set', 'Bedroll', '2 Pouches', "Traveler's Clothes", '16 GP']
  }
};

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function writeBackgroundsFile(outputDir, isSpanish) {
  let out = `import { BackgroundData } from '../../../types';

// AUTO-GENERATED from docs/Manual/02-species-backgrounds.md
// Do not edit manually - regenerate with: node generate-backgrounds.cjs

export const BACKGROUND_DATA: Record<string, BackgroundData> = {
`;
  Object.keys(backgrounds).forEach(name => {
    const bg = backgrounds[name];
    out += `    '${esc(name)}': {
`;
    out += `        description: '${esc(isSpanish ? bg.description : bg.descriptionEn)}',
`;
    out += `        scores: [${bg.scores.map(s => `'${s}'`).join(', ')}],
`;
    out += `        feat: '${esc(isSpanish ? bg.feat : bg.featEn)}',
`;
    out += `        featDescription: '${esc(isSpanish ? bg.featDescription : bg.featDescriptionEn)}',
`;
    out += `        skills: [${bg.skills.map(s => `'${s}'`).join(', ')}],
`;
    out += `        tool: '${esc(isSpanish ? bg.tool : bg.toolEn)}',
`;
    out += `        equipment: [${(isSpanish ? bg.equipment : bg.equipmentEn).map(e => `'${esc(e)}'`).join(', ')}]
`;
    out += `    },
`;
  });
  out += `};
`;
  fs.writeFileSync(path.join(outputDir, 'backgrounds.ts'), out, 'utf8');
  console.log(`Written ${outputDir}/backgrounds.ts with ${Object.keys(backgrounds).length} backgrounds`);
}

writeBackgroundsFile(OUTPUT_DIR_ES, true);
writeBackgroundsFile(OUTPUT_DIR_EN, false);

console.log('Backgrounds generation complete!');
