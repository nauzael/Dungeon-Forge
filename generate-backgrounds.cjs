const fs = require('fs');

const MANUAL = fs.readFileSync('docs/Manual/02-species-backgrounds.md', 'utf8');
const OUTPUT_ES = 'Data/backgrounds.ts';

let out = `import { BackgroundData } from '../types';

// AUTO-GENERATED from docs/Manual/02-species-backgrounds.md
// Do not edit manually - regenerate with: node generate-backgrounds.cjs

// =============== SPANISH BACKGROUNDS ===============

`;

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
  },
  // === EBERON BACKGROUNDS ===
  'Aberrant Heir': {
    description: 'Tu marca dragoncica aberrante ha complicado tu vida desde que se manifestó.',
    descriptionEn: 'Your aberrant dragonmark has made life challenging since it manifested.',
    scores: ['STR', 'CON', 'CHA'],
    feat: 'Marca Dragoncica Aberrante',
    featEn: 'Aberrant Dragonmark',
    featDescription: 'Puedes lanzar un trueno de nivel 1 sin usar espacios de magia.',
    featDescriptionEn: 'You can cast a 1st-level thunder spell without using spell slots.',
    skills: ['History', 'Intimidation'],
    tool: 'Kit de Disfraz',
    toolEn: 'Disguise Kit',
    equipment: ['Kit de Disfraz', 'Daga', 'Disfraz', 'Ropa de Viajero', '16 PO'],
    equipmentEn: ['Disguise Kit', 'Dagger', 'Costume', "Traveler's Clothes", '16 GP']
  },
  'Archaeologist': {
    description: 'Has estudiado toda tu vida las culturas perdidas y caídas del pasado.',
    descriptionEn: 'You\'ve made a lifelong study of the lost and fallen cultures of the past.',
    scores: ['DEX', 'INT', 'WIS'],
    feat: 'Habilidoso',
    featEn: 'Skilled',
    featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.',
    featDescriptionEn: 'Gain proficiency in any combination of three skills or tools.',
    skills: ['History', 'Survival'],
    tool: 'Herramientas de Cartógrafo',
    toolEn: "Cartographer's Tools",
    equipment: ['Herramientas de Cartógrafo', 'Linterna Sobresaliente', 'Mapa', 'Pala', 'Tienda', 'Ropa de Viajero', '17 PO'],
    equipmentEn: ["Cartographer's Tools", 'Bullseye Lantern', 'Map', 'Shovel', 'Tent', "Traveler's Clothes", '17 GP']
  },
  'House Agent': {
    description: 'Estás conectado a una de las casas dragoncicas.',
    descriptionEn: 'You are connected to one of the dragonmarked houses.',
    scores: ['STR', 'INT', 'CHA'],
    feat: 'Afortunado',
    featEn: 'Lucky',
    featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia.',
    featDescriptionEn: 'Gain Luck Points equal to your Proficiency Bonus.',
    skills: ['Investigation', 'Persuasion'],
    tool: 'Herramientas de Artesano',
    toolEn: "Artisan's Tools",
    equipment: ['Herramientas de Artesano', 'Ropa Fina', '20 PO'],
    equipmentEn: ["Artisan's Tools", 'Fine Clothes', '20 GP']
  },
  'House Cannith Heir': {
    description: 'Como vástago de Casa Cannith, llevas un legado orgulloso.',
    descriptionEn: 'As a scion of House Cannith, you carry a proud legacy.',
    scores: ['STR', 'DEX', 'INT'],
    feat: 'Marca de Fabricación',
    featEn: 'Mark of Making',
    featDescription: 'Puedes fabricar objetos mágicos y conoces trucos de Artisan.',
    featDescriptionEn: 'You can craft magical items and know Artisan cantrips.',
    skills: ['Investigation', 'Sleight of Hand'],
    tool: 'Herramientas de Artesano',
    toolEn: "Artisan's Tools",
    equipment: ['Herramientas de Artesano', 'Palanca', 'Ropa Fina', 'Bolsa (2)', '17 PO'],
    equipmentEn: ["Artisan's Tools", 'Crowbar', 'Fine Clothes', '2 Pouches', '17 GP']
  },
  'House Deneith Heir': {
    description: 'Como heredero de Casa Deneith, has sido entrenado para el combate.',
    descriptionEn: 'As an heir of House Deneith, you\'ve been trained for combat.',
    scores: ['STR', 'CON', 'WIS'],
    feat: 'Marca del Centinela',
    featEn: 'Mark of Sentinel',
    featDescription: 'Puedes percibir peligros y proteger a aliados.',
    featDescriptionEn: 'You can sense danger and protect allies.',
    skills: ['Insight', 'Perception'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Lanza', 'Arco Corto', 'Flechas (20)', 'Ropa Fina', 'Kit de Curación', 'Carcaj', '1 PO'],
    equipmentEn: ['Gaming Set', 'Spear', 'Shortbow', '20 Arrows', 'Fine Clothes', "Healer's Kit", 'Quiver', '1 GP']
  },
  'House Ghallanda Heir': {
    description: 'Gracias a tus conexiones con Casa Ghallanda, creciste acostumbrado a la comodidad.',
    descriptionEn: 'Thanks to House Ghallanda, you grew up accustomed to creature comforts.',
    scores: ['DEX', 'WIS', 'CHA'],
    feat: 'Marca de Hospitalidad',
    featEn: 'Mark of Hospitality',
    featDescription: 'Puedes descansar en cualquier lugar y preparar comida.',
    featDescriptionEn: 'You can rest anywhere and prepare food.',
    skills: ['Insight', 'Persuasion'],
    tool: 'Utensilios de Cocina',
    toolEn: "Cook's Utensils",
    equipment: ['Utensilios de Cocina', 'Ropa Fina', 'Olla de Hierro', 'Perfume', '26 PO'],
    equipmentEn: ["Cook's Utensils", 'Fine Clothes', 'Iron Pot', 'Perfume', '26 GP']
  },
  'House Jorasco Heir': {
    description: 'Casa Jorasco enseña que la enfermedad y las heridas acechan a los vivos.',
    descriptionEn: 'House Jorasco teaches that illness and injury stalk the living.',
    scores: ['DEX', 'CON', 'WIS'],
    feat: 'Marca de Curación',
    featEn: 'Mark of Healing',
    featDescription: 'Puedes lanzar hechizos de curación menores.',
    featDescriptionEn: 'You can cast minor healing spells.',
    skills: ['Medicine', 'Stealth'],
    tool: 'Kit de Herboristería',
    toolEn: 'Herbalism Kit',
    equipment: ['Kit de Herboristería', 'Ropa Fina', 'Kit de Curación', '25 PO'],
    equipmentEn: ['Herbalism Kit', 'Fine Clothes', "Healer's Kit", '25 GP']
  },
  'House Kundarak Heir': {
    description: 'Como heredero de Casa Kundarak, te enorgulleces de tu familia y su trabajo.',
    descriptionEn: 'As an heir of House Kundarak, you take great pride in your family.',
    scores: ['STR', 'CON', 'INT'],
    feat: 'Marca de Guarda',
    featEn: 'Mark of Warding',
    featDescription: 'Puedes crear wardos mágicos temporales.',
    featDescriptionEn: 'You can create temporary magical wards.',
    skills: ['Arcana', 'Investigation'],
    tool: 'Herramientas de Ladrón',
    toolEn: "Thieves' Tools",
    equipment: ['Herramientas de Ladrón', 'Ropa Fina', '10 PO'],
    equipmentEn: ["Thieves' Tools", 'Fine Clothes', '10 GP']
  },
  'House Lyrandar Heir': {
    description: 'Como heredero de Casa Lyrandar, el viento es tu aliado.',
    descriptionEn: 'As an heir of House Lyrandar, the wind is your ally.',
    scores: ['STR', 'DEX', 'CHA'],
    feat: 'Marca de la Tormenta',
    featEn: 'Mark of Storm',
    featDescription: 'Puedes controlar el clima y tienes resistencia al daño de rayos.',
    featDescriptionEn: 'You can control weather and have resistance to lightning.',
    skills: ['Acrobatics', 'Nature'],
    tool: 'Herramientas de Navegante',
    toolEn: "Navigator's Tools",
    equipment: ['Herramientas de Navegante', 'Ropa Fina', '10 PO'],
    equipmentEn: ["Navigator's Tools", 'Fine Clothes', '10 GP']
  },
  'House Medani Heir': {
    description: 'Como miembro de Casa Medani, tu vida gira en torno al engaño, pero para prevenirlo.',
    descriptionEn: 'As a member of House Medani, your life revolves around subterfuge.',
    scores: ['DEX', 'INT', 'WIS'],
    feat: 'Marca de Detección',
    featEn: 'Mark of Detection',
    featDescription: 'Puedes percibir ilusiones y trampas ocultas.',
    featDescriptionEn: 'You can sense hidden illusions and traps.',
    skills: ['Insight', 'Investigation'],
    tool: 'Kit de Disfraz',
    toolEn: 'Disguise Kit',
    equipment: ['Kit de Disfraz', 'Ropa Fina', '10 PO'],
    equipmentEn: ['Disguise Kit', 'Fine Clothes', '10 GP']
  },
  'House Orien Heir': {
    description: 'Antes de la Última Guerra, la influencia de Orien cubría Khorvaire.',
    descriptionEn: 'Before the Last War, Orien\'s influence covered Khorvaire.',
    scores: ['DEX', 'CON', 'INT'],
    feat: 'Marca de Paso',
    featEn: 'Mark of Passage',
    featDescription: 'Puedes teletransportarte cortas distancias.',
    featDescriptionEn: 'You can teleport short distances.',
    skills: ['Acrobatics', 'Athletics'],
    tool: 'Herramientas de Cartógrafo',
    toolEn: "Cartographer's Tools",
    equipment: ['Herramientas de Cartógrafo', 'Ropa Fina', 'Mapa', '18 PO'],
    equipmentEn: ["Cartographer's Tools", 'Fine Clothes', 'Map', '18 GP']
  },
  'House Phiarlan Heir': {
    description: 'Aunque has visto riqueza y fama como hijo de Casa Phiarlan, consideras el conocimiento el mayor tesoro.',
    descriptionEn: 'Though you have seen wealth and fame, you consider knowledge the greatest treasure.',
    scores: ['DEX', 'WIS', 'CHA'],
    feat: 'Marca de Sombra',
    featEn: 'Mark of Shadow',
    featDescription: 'Puedes crear ilusiones menores y moverte entre sombras.',
    featDescriptionEn: 'You can create minor illusions and move through shadows.',
    skills: ['Deception', 'Stealth'],
    tool: 'Kit de Disfraz',
    toolEn: 'Disguise Kit',
    equipment: ['Kit de Disfraz', 'Ropa Fina', '10 PO'],
    equipmentEn: ['Disguise Kit', 'Fine Clothes', '10 GP']
  },
  'House Sivis Heir': {
    description: 'Durante casi treinta siglos, tu familia ha trabajado para mantener el orden.',
    descriptionEn: 'For nearly thirty centuries, your family has worked to maintain order.',
    scores: ['INT', 'WIS', 'CHA'],
    feat: 'Marca de Escritura',
    featEn: 'Mark of Scribing',
    featDescription: 'Puedes escribir mensajes que se entienden en cualquier idioma.',
    featDescriptionEn: 'You can write messages understood in any language.',
    skills: ['History', 'Perception'],
    tool: 'Suministros de Caligrafía',
    toolEn: "Calligrapher's Supplies",
    equipment: ['Suministros de Caligrafía', 'Tinta', '5 Plumas', 'Papel (30)', 'Pergamino (9)', '8 PO'],
    equipmentEn: ["Calligrapher's Supplies", 'Ink', '5 Ink Pens', 'Paper (30 sheets)', 'Parchment (9 sheets)', '8 GP']
  },
  'House Tharashk Heir': {
    description: 'Los herederos de otras casas viven con lujos, pero en Casa Tharashk aprendiste a valerte por ti mismo.',
    descriptionEn: 'Heirs of other houses live in luxury, but in House Tharashk you learned self-reliance.',
    scores: ['CON', 'INT', 'WIS'],
    feat: 'Marca de Búsqueda',
    featEn: 'Mark of Finding',
    featDescription: 'Puedes encontrar objetos y criaturas ocultas.',
    featDescriptionEn: 'You can find hidden objects and creatures.',
    skills: ['Perception', 'Survival'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Equipo de Escalada', 'Ropa Fina', 'Trampa de Caza', 'Grilletes', '2 PO'],
    equipmentEn: ['Gaming Set', "Climber's Kit", 'Fine Clothes', 'Hunting Trap', 'Manacles', '2 GP']
  },
  'House Thuranni Heir': {
    description: 'Dado el corto historial de Casa Thuranni y su enfoque en espionaje.',
    descriptionEn: 'Given House Thuranni\'s short history and focus on espionage.',
    scores: ['DEX', 'INT', 'CHA'],
    feat: 'Marca de Sombra',
    featEn: 'Mark of Shadow',
    featDescription: 'Puedes crear ilusiones menores y moverte entre sombras.',
    featDescriptionEn: 'You can create minor illusions and move through shadows.',
    skills: ['Performance', 'Stealth'],
    tool: 'Instrumento Musical',
    toolEn: 'Musical Instrument',
    equipment: ['Instrumento Musical', 'Disfraz', 'Ropa Fina', '13 PO'],
    equipmentEn: ['Musical Instrument', 'Costume', 'Fine Clothes', '13 GP']
  },
  'House Vadalis Heir': {
    description: 'Has crecido con respeto por la familia y la naturaleza.',
    descriptionEn: 'You have grown up with respect for both family and nature.',
    scores: ['CON', 'WIS', 'CHA'],
    feat: 'Marca de Manejo',
    featEn: 'Mark of Handling',
    featDescription: 'Puedes comunicar con animales y encantarlos.',
    featDescriptionEn: 'You can communicate with animals and charm them.',
    skills: ['Animal Handling', 'Nature'],
    tool: 'Kit de Herboristería',
    toolEn: 'Herbalism Kit',
    equipment: ['Kit de Herboristería', 'Ropa Fina', 'Red', '29 PO'],
    equipmentEn: ['Herbalism Kit', 'Fine Clothes', 'Net', '29 GP']
  },
  'Inquisitive': {
    description: 'Has perfeccionado tus talentos de investigación y deducción.',
    descriptionEn: 'You have honed your talents of investigation and deduction.',
    scores: ['CON', 'INT', 'CHA'],
    feat: 'Alerta',
    featEn: 'Alert',
    featDescription: 'Ganas competencia en iniciativa y puedes intercambio tu iniciativa.',
    featDescriptionEn: 'Gain initiative proficiency and can swap your initiative.',
    skills: ['Insight', 'Investigation'],
    tool: 'Herramientas de Ladrón',
    toolEn: "Thieves' Tools",
    equipment: ['Herramientas de Ladrón', 'Linterna Sobresaliente', 'Palanca', 'Aceite (10)', 'Ropa de Viajero', '10 PO'],
    equipmentEn: ["Thieves' Tools", 'Bullseye Lantern', 'Crowbar', 'Oil (10 flasks)', "Traveler's Clothes", '10 GP']
  },
  // === FAERUN BACKGROUNDS ===
  'Chondathan Freebooter': {
    description: 'Abandonaste la ciudad natal y trabajaste como bucanero.',
    descriptionEn: 'You forsook your nationhood and worked as a freebooter with the first ship.',
    scores: ['STR', 'DEX', 'WIS'],
    feat: 'Habilidoso',
    featEn: 'Skilled',
    featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.',
    featDescriptionEn: 'Gain proficiency in any combination of three skills or tools.',
    skills: ['Athletics', 'Sleight of Hand'],
    tool: 'Herramientas de Tejero',
    toolEn: "Weaver's Tools",
    equipment: ['Herramientas de Tejero', 'Daga', 'Mochila', 'Bolitas', 'Canasta', 'Saco de Dormir', 'Cubo', 'Raciones (3)', 'Cuerda', 'Silbato de Señal', 'Ropa de Viajero', '38 PO'],
    equipmentEn: ["Weaver's Tools", 'Dagger', "Weaver's Tools", 'Backpack', 'Ball Bearings', 'Basket', 'Bedroll', 'Bucket', 'Rations (3 days)', 'Rope', 'Signal Whistle', "Traveler's Clothes", '38 GP']
  },
  'Dead Magic Dweller': {
    description: 'Las zonas de magia muerta de Anauroch son odiosas para los lanzadores de hechizos.',
    descriptionEn: 'The dead magic zones of Anauroch are anathema to spellcasters.',
    scores: ['STR', 'CON', 'WIS'],
    feat: 'Sanador',
    featEn: 'Healer',
    featDescription: 'Mejoras el uso de kits de sanador.',
    featDescriptionEn: "Improve treatment with healer's kits.",
    skills: ['Medicine', 'Survival'],
    tool: 'Herramientas de Talabartero',
    toolEn: "Leatherworker's Tools",
    equipment: ['Herramientas de Talabartero', 'Mayal', 'Saco de Dormir', 'Manta', 'Kit de Curación', 'Pértiga', 'Raciones (3)', 'Tienda', 'Yesca', '5 Antorchas', 'Ropa de Viajero', 'Botella de Agua', '32 PO'],
    equipmentEn: ["Leatherworker's Tools", 'Greatclub', 'Bedroll', 'Blanket', "Healer's Kit", 'Pole', 'Rations (3 days)', 'Tent', 'Tinderbox', '5 Torches', "Traveler's Clothes", 'Waterskin', '32 GP']
  },
  'Dragon Cultist': {
    description: 'Eres un iniciado del Culto del Dragón.',
    descriptionEn: 'You are an initiate of the Cult of the Dragon.',
    scores: ['DEX', 'CON', 'INT'],
    feat: 'Iniciado del Culto del Dragón',
    featEn: 'Cult of the Dragon Initiate',
    featDescription: 'Puedes invocar dragones menores y tienes resistencia al daño de fuego.',
    featDescriptionEn: 'You can summon minor dragons and have fire resistance.',
    skills: ['Deception', 'Stealth'],
    tool: 'Suministros de Caligrafía',
    toolEn: "Calligrapher's Supplies",
    equipment: ['Suministros de Caligrafía', 'Daga', 'Botella de Vidrio', 'Lámpara', 'Grilletes', 'Aceite (5)', 'Bolsa (2)', 'Túnica', 'Cuerda', '30 PO'],
    equipmentEn: ["Calligrapher's Supplies", 'Dagger', 'Glass Bottle', 'Lamp', 'Manacles', 'Oil (5 flasks)', '2 Pouches', 'Robe', 'Rope', '30 GP']
  },
  'Emerald Enclave Caretaker': {
    description: 'Como Cuidador del Clan Esmerealda, te ocupas de los que cuidan del mundo.',
    descriptionEn: 'As a Caretaker with the Emerald Enclave, you take care of those who care for the world.',
    scores: ['CON', 'INT', 'WIS'],
    feat: 'Principiante del Clan Esmerealda',
    featEn: 'Emerald Enclave Fledgling',
    featDescription: 'Puedes hablar con animales y plantas.',
    featDescriptionEn: 'You can speak with animals and plants.',
    skills: ['Nature', 'Survival'],
    tool: 'Kit de Herboristería',
    toolEn: 'Herbalism Kit',
    equipment: ['Kit de Herboristería', 'Arco Corto', 'Flechas (20)', 'Saco de Dormir', 'Manta', 'Bolsa', 'Tienda', 'Ropa de Viajero', '13 PO'],
    equipmentEn: ['Herbalism Kit', 'Shortbow', '20 Arrows', 'Bedroll', 'Blanket', 'Pouch', 'Tent', "Traveler's Clothes", '13 GP']
  },
  'Flaming Fist Mercenary': {
    description: 'Una vez serviste como Puño Flamígero, la rama de aplicación de la ley de Baldur\'s Gate.',
    descriptionEn: 'You once served as a Flaming Fist, the chief law enforcement of Baldur\'s Gate.',
    scores: ['STR', 'CON', 'CHA'],
    feat: 'Duro',
    featEn: 'Tough',
    featDescription: 'Tu máximo de puntos de golpe aumenta.',
    featDescriptionEn: 'Your hit point maximum increases.',
    skills: ['Intimidation', 'Perception'],
    tool: 'Herramientas de Herrero',
    toolEn: "Smith's Tools",
    equipment: ['Herramientas de Herrero', 'Maza', 'Ropa Fina', 'Grilletes', 'Carnero Portátil', '4 PO'],
    equipmentEn: ["Smith's Tools", 'Mace', 'Fine Clothes', 'Manacles', 'Portable Ram', '4 GP']
  },
  'Genie Touched': {
    description: 'Aunque los genios ya no gobiernan Calimshan, la magia genie es común en tu tierra natal.',
    descriptionEn: 'Although genies no longer rule Calimshan, genie magic is still common in your homeland.',
    scores: ['DEX', 'WIS', 'CHA'],
    feat: 'Iniciado en la Magia (Mago)',
    featEn: 'Magic Initiate (Wizard)',
    featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de mago.',
    featDescriptionEn: 'Learn 2 Wizard cantrips and 1 level 1 Wizard spell.',
    skills: ['Perception', 'Persuasion'],
    tool: 'Herramientas de Soplador de Vidrio',
    toolEn: "Glassblower's Tools",
    equipment: ['Herramientas de Soplador de Vidrio', 'Martillo Ligero', 'Ropa Fina', 'Lámpara', 'Aceite (3)', 'Botella de Agua', '2 PO'],
    equipmentEn: ["Glassblower's Tools", 'Light Hammer', 'Fine Clothes', 'Lamp', 'Oil (3 flasks)', 'Waterskin', '2 GP']
  },
  'Harper': {
    description: 'Aceptaste una invitación para unirte a los Harken, prometiendo uphold the Harper code.',
    descriptionEn: 'You accepted an invitation to join the Harpers, pledging an oath to uphold their code.',
    scores: ['DEX', 'INT', 'CHA'],
    feat: 'Agente de los Harken',
    featEn: 'Harper Agent',
    featDescription: 'Tienes conexiones en tinggi círculos y puedes Gather Information.',
    featDescriptionEn: 'You have connections in high circles and can Gather Information.',
    skills: ['Performance', 'Sleight of Hand'],
    tool: 'Kit de Disfraz',
    toolEn: 'Disguise Kit',
    equipment: ['Kit de Disfraz', 'Saco de Dormir', 'Disfraz', 'Gancho de Escalada', 'Cuerda', 'Ropa de Viajero', '14 PO'],
    equipmentEn: ['Disguise Kit', 'Bedroll', 'Costume', 'Grappling Hook', 'Rope', "Traveler's Clothes", '14 GP']
  },
  'Ice Fisher': {
    description: 'Vienes de una orgullosa línea de pescadores de hielo de Ten-Towns.',
    descriptionEn: 'You come from a proud line of ice fishers out of Ten-Towns in Icewind Dale.',
    scores: ['STR', 'DEX', 'CON'],
    feat: 'Alerta',
    featEn: 'Alert',
    featDescription: 'Ganas competencia en iniciativa.',
    featDescriptionEn: 'Gain initiative proficiency.',
    skills: ['Animal Handling', 'Athletics'],
    tool: 'Herramientas de Tallador de Madera',
    toolEn: "Woodcarver's Tools",
    equipment: ['Herramientas de Tallador de Madera', 'Canasta', 'Polipasto', 'Cubo', 'Cadena', 'Trampa de Caza', 'Red', 'Pértiga', 'Raciones (3)', 'Cuerda', 'Ropa de Viajero', '32 PO'],
    equipmentEn: ["Woodcarver's Tools", 'Basket', 'Block and Tackle', 'Bucket', 'Chain', 'Hunting Trap', 'Net', 'Pole', 'Rations (3 days)', 'Rope', "Traveler's Clothes", '32 GP']
  },
  'Knight of the Gauntlet': {
    description: 'Uniste la Orden del Guantelete como caballero sagrado.',
    descriptionEn: 'You chose the path of the holy warrior by joining the Order of the Gauntlet.',
    scores: ['STR', 'INT', 'WIS'],
    feat: 'Tyro del Guantelete',
    featEn: 'Tyro of the Gauntlet',
    featDescription: 'Recibes bendiciones divinas para proteger a los inocentes.',
    featDescriptionEn: 'You receive divine blessings to protect the innocent.',
    skills: ['Athletics', 'Medicine'],
    tool: 'Herramientas de Herrero',
    toolEn: "Smith's Tools",
    equipment: ['Herramientas de Herrero', 'Lanza', 'Linterna Sobresaliente', 'Símbolo Sagrado', 'Grilletes', 'Aceite (5)', 'Yesca', 'Ropa de Viajero', '9 PO'],
    equipmentEn: ["Smith's Tools", 'Spear', 'Bullseye Lantern', 'Holy Symbol', 'Manacles', 'Oil (5 flasks)', 'Tinderbox', "Traveler's Clothes", '9 GP']
  },
  'Lords\' Alliance Vassal': {
    description: 'Has prometido lealtad a un miembro-ciudad de la Alianza de Señores.',
    descriptionEn: 'You\'ve pledged your loyalty to a member-city of the Lords\' Alliance.',
    scores: ['STR', 'INT', 'CHA'],
    feat: 'Agente de la Alianza de Señores',
    featEn: 'Lords\' Alliance Agent',
    featDescription: 'Tienes acceso a los círculos de poder de la Alianza.',
    featDescriptionEn: 'You have access to the power circles of the Alliance.',
    skills: ['Insight', 'Persuasion'],
    tool: 'Suministros de Caligrafía',
    toolEn: "Calligrapher's Supplies",
    equipment: ['Suministros de Caligrafía', '2 Javelines', 'Ropa Fina', 'Tinta', '5 Plumas', 'Pergamino (9)', '13 PO'],
    equipmentEn: ["Calligrapher's Supplies", '2 Javelins', 'Fine Clothes', 'Ink', '5 Ink Pens', 'Parchment (9 sheets)', '13 GP']
  },
  'Moonwell Pilgrim': {
    description: 'Como peregrino del Pozo Lunar, visitaste y te comunicaste con cada pozo lunar.',
    descriptionEn: 'Like many from the Moonshae Isles, you grew up revering the blessed land.',
    scores: ['CON', 'WIS', 'CHA'],
    feat: 'Iniciado en la Magia (Druida)',
    featEn: 'Magic Initiate (Druid)',
    featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de druida.',
    featDescriptionEn: 'Learn 2 Druid cantrips and 1 level 1 Druid spell.',
    skills: ['Nature', 'Performance'],
    tool: 'Suministros de Pintor',
    toolEn: "Painter's Supplies",
    equipment: ['Suministros de Pintor', 'Bastón', 'Saco de Dormir', 'Campana', 'Bolsa', 'Túnica', 'Cuerda', 'Ropa de Viajero', 'Botella de Agua', '34 PO'],
    equipmentEn: ["Painter's Supplies", 'Quarterstaff', 'Bedroll', 'Bell', 'Pouch', 'Robe', 'String', "Traveler's Clothes", 'Waterskin', '34 GP']
  },
  'Mulhorandi Tomb Raider': {
    description: 'Creciste en una tierra de dioses vivos, y como niño escuchaste historias de imperios enterrados.',
    descriptionEn: 'You grew up in a land of living god-kings, hearing stories of ancient empires.',
    scores: ['DEX', 'CON', 'INT'],
    feat: 'Afortunado',
    featEn: 'Lucky',
    featDescription: 'Ganas Puntos de Suerte.',
    featDescriptionEn: 'Gain Luck Points.',
    skills: ['Investigation', 'Religion'],
    tool: 'Herramientas de Albañil',
    toolEn: "Mason's Tools",
    equipment: ['Herramientas de Albañil', 'Daga', 'Martillo Ligero', 'Mochila', 'Saco de Dormir', 'Palanca', 'Escalera', 'Pértiga', 'Bolsa (2)', 'Cuerda', 'Yesca', '5 Antorchas', 'Ropa de Viajero', 'Botella de Agua', '26 PO'],
    equipmentEn: ["Mason's Tools", 'Dagger', 'Light Hammer', 'Backpack', 'Bedroll', 'Crowbar', 'Ladder', 'Pole', '2 Pouches', 'Rope', 'Tinderbox', '5 Torches', "Traveler's Clothes", 'Waterskin', '26 GP']
  },
  'Mythalkeeper': {
    description: 'Los Mythals son fuentes de gran poder mágico que pueden alterar la realidad.',
    descriptionEn: 'Mythals are sources of great magical power that can alter the Weave or reality.',
    scores: ['INT', 'WIS', 'CHA'],
    feat: 'Fabricante',
    featEn: 'Crafter',
    featDescription: 'Competencia con herramientas de artesano y descuento.',
    featDescriptionEn: 'Proficiency with Artisan\'s Tools and discount.',
    skills: ['Arcana', 'History'],
    tool: 'Herramientas de Joyero',
    toolEn: "Jeweler's Tools",
    equipment: ['Herramientas de Joyero', 'Bastón', 'Perfume', 'Bolsa', 'Túnica', 'Pala', 'Ropa de Viajero', '16 PO'],
    equipmentEn: ["Jeweler's Tools", 'Quarterstaff', 'Perfume', 'Pouch', 'Robe', 'Shovel', "Traveler's Clothes", '16 GP']
  },
  'Purple Dragon Squire': {
    description: 'Has prometido tu vida a la seguridad de Cormyr y a la orden de los Caballeros del Dragón Púrpura.',
    descriptionEn: 'You\'ve pledged your life to the safety of Cormyr and the Purple Dragon Knights.',
    scores: ['STR', 'WIS', 'CHA'],
    feat: 'Coronel del Dragón Púrpura',
    featEn: 'Purple Dragon Rook',
    featDescription: 'Entrenado en el honor y las tácticas de caballería.',
    featDescriptionEn: 'Trained in honor and cavalry tactics.',
    skills: ['Animal Handling', 'Insight'],
    tool: 'Herramientas de Navegante',
    toolEn: "Navigator's Tools",
    equipment: ['Herramientas de Navegante', 'Lanza', 'Ropa Fina', '9 PO'],
    equipmentEn: ["Navigator's Tools", 'Spear', 'Fine Clothes', '9 GP']
  },
  'Rashemi Wanderer': {
    description: 'Pasaste años vagando por las tierras altas de Rashemen.',
    descriptionEn: 'You spent years wandering the highlands of Rashemen.',
    scores: ['STR', 'CON', 'CHA'],
    feat: 'Duro',
    featEn: 'Tough',
    featDescription: 'Tu máximo de puntos de golpe aumenta.',
    featDescriptionEn: 'Your hit point maximum increases.',
    skills: ['Intimidation', 'Perception'],
    tool: 'Herramientas de Cartógrafo',
    toolEn: "Cartographer's Tools",
    equipment: ['Herramientas de Cartógrafo', 'Mochila', 'Saco de Dormir', 'Linterna Encapuchada', 'Aceite (3)', 'Cuerda', 'Yesca', 'Ropa de Viajero', 'Botella de Agua', '23 PO'],
    equipmentEn: ["Cartographer's Tools", 'Backpack', 'Bedroll', 'Hooded Lantern', 'Oil (3 flasks)', 'Rope', 'Tinderbox', "Traveler's Clothes", 'Waterskin', '23 GP']
  },
  'Shadowmasters Exile': {
    description: 'Entrenaste toda tu vida para convertirte en miembro de los Shadowmasters.',
    descriptionEn: 'You trained your whole life to become a member of the Shadowmasters.',
    scores: ['DEX', 'INT', 'CHA'],
    feat: 'Atacante Salvaje',
    featEn: 'Savage Attacker',
    featDescription: 'Una vez por turno, tiras los dados de daño dos veces.',
    featDescriptionEn: 'Once per turn, roll damage dice twice.',
    skills: ['Acrobatics', 'Stealth'],
    tool: 'Herramientas de Ladrón',
    toolEn: "Thieves' Tools",
    equipment: ['Herramientas de Ladrón', '2 Dagas', 'Clavos', 'Disfraz', 'Gancho de Escalada', 'Picos de Hierro', 'Espejo', 'Bolsa (2)', 'Cuerda', 'Ropa de Viajero', '3 PO'],
    equipmentEn: ["Thieves' Tools", '2 Daggers', 'Caltrops', 'Costume', 'Grappling Hook', 'Iron Spikes', 'Mirror', '2 Pouches', 'Rope', "Traveler's Clothes", '3 GP']
  },
  'Spellfire Initiate': {
    description: 'Llevas el don del spellfire: una rara forma de magia que canaliza el poder de la Weave.',
    descriptionEn: 'You bear the gift of spellfire: a rare form of magic channeling the Weave\'s power.',
    scores: ['CON', 'INT', 'CHA'],
    feat: 'Chispa del Spellfire',
    featEn: 'Spellfire Spark',
    featDescription: 'Puedes lanzar hechizos de fuego y luz.',
    featDescriptionEn: 'You can cast fire and light spells.',
    skills: ['Arcana', 'Perception'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Foco Arcano (Cristal o Vara)', 'Bolsa (2)', 'Ropa de Viajero', '36 PO'],
    equipmentEn: ['Gaming Set', 'Arcane Focus (Crystal or Wand)', '2 Pouches', "Traveler's Clothes", '36 GP']
  },
  'Zhentarim Mercenary': {
    description: 'Quizás necesitabas el dinero. Quizás anhelabas una familia.',
    descriptionEn: 'Maybe you needed the money. Maybe you longed for a family.',
    scores: ['STR', 'DEX', 'CHA'],
    feat: 'Granuja de Zhentarim',
    featEn: 'Zhentarim Ruffian',
    featDescription: 'Tienes conexiones en los bajos fondos y puedes encontrar trabajo como mercenario.',
    featDescriptionEn: 'You have connections in the underworld and can find work as a mercenary.',
    skills: ['Intimidation', 'Perception'],
    tool: 'Kit de Falsificación',
    toolEn: 'Forgery Kit',
    equipment: ['Kit de Falsificación', 'Club', 'Daga', 'Ropa Fina', 'Linterna Encapuchada', 'Aceite (3)', 'Bolsa (2)', 'Yesca', '11 PO'],
    equipmentEn: ['Forgery Kit', 'Club', 'Dagger', 'Fine Clothes', 'Hooded Lantern', 'Oil (3 flasks)', '2 Pouches', 'Tinderbox', '11 GP']
  },
  // === EXOTIC BACKGROUNDS ===
  'Carouser': {
    description: 'Creciste hasta la edad adulta en el corazón de una gran ciudad.',
    descriptionEn: 'You grew to adulthood in the beating heart of a large city.',
    scores: ['DEX', 'INT', 'CHA'],
    feat: 'Parrandista Incansable',
    featEn: 'Tireless Reveler',
    featDescription: 'Puedes sobrevivir sin descanso y tienes buena fortuna.',
    featDescriptionEn: 'You can survive without rest and have good fortune.',
    skills: ['Deception', 'Persuasion'],
    tool: 'Juego de Juego',
    toolEn: 'Gaming Set',
    equipment: ['Juego de Juego', 'Daga', 'Disfraz', 'Botella de Vidrio', 'Perfume', 'Bolsa', 'Yesca', '19 PO'],
    equipmentEn: ['Gaming Set', 'Dagger', 'Costume', 'Glass Bottle', 'Perfume', 'Pouch', 'Tinderbox', '19 GP']
  },
  'Lorwyn Expert': {
    description: 'Eres natural de Lorwyn, una tierra de sol eterno.',
    descriptionEn: 'You hail from Lorwyn, a land of eternal sunshine.',
    scores: ['STR', 'CON', 'WIS'],
    feat: 'Hijo del Sol',
    featEn: 'Child of the Sun',
    featDescription: 'Tienes resistencia al daño de fuego y luz.',
    featDescriptionEn: 'You have resistance to fire and light damage.',
    skills: ['Athletics', 'Nature'],
    tool: 'Herramientas de Cartógrafo',
    toolEn: "Cartographer's Tools",
    equipment: ['Herramientas de Cartógrafo', 'Bastón', 'Mochila', 'Canasta', 'Pergamino (4)', 'Cuerda', 'Ropa de Viajero', '29 PO'],
    equipmentEn: ["Cartographer's Tools", 'Quarterstaff', 'Backpack', 'Basket', 'Parchment (4 sheets)', 'Rope', "Traveler's Clothes", '29 GP']
  },
  'Shadowmoor Expert': {
    description: 'Eres de Shadowmoor o has estudiado el lugar durante años.',
    descriptionEn: 'You are from Shadowmoor or have studied it for years.',
    scores: ['DEX', 'INT', 'CHA'],
    feat: 'Hechicero de Shadowmoor',
    featEn: 'Shadowmoor Hexer',
    featDescription: 'Puedes lanzar hechizos de ilusión y sombra.',
    featDescriptionEn: 'You can cast illusion and shadow spells.',
    skills: ['Acrobatics', 'Deception'],
    tool: 'Herramientas de Soplador de Vidrio',
    toolEn: "Glassblower's Tools",
    equipment: ['Herramientas de Soplador de Vidrio', 'Daga', 'Trampa de Caza', 'Lámpara', 'Aceite (3)', 'Ropa de Viajero', 'Botella de Agua', '8 PO'],
    equipmentEn: ["Glassblower's Tools", 'Dagger', 'Hunting Trap', 'Lamp', 'Oil (3 flasks)', "Traveler's Clothes", 'Waterskin', '8 GP']
  },
  'Vampire Devotee': {
    description: 'Estuviste al servicio de un vampiro o de un pequeño grupo de vampiros.',
    descriptionEn: 'You were in service to a vampire or a small group of vampires.',
    scores: ['STR', 'CON', 'CHA'],
    feat: 'Juguete del Vampiro',
    featEn: 'Vampire\'s Plaything',
    featDescription: 'Tienes conocimiento de los misterios vampíricos.',
    featDescriptionEn: 'You have knowledge of vampire mysteries.',
    skills: ['Persuasion', 'Stealth'],
    tool: 'Utensilios de Cocina',
    toolEn: "Cook's Utensils",
    equipment: ['Utensilios de Cocina', 'Ropa Fina', '2 Botellas de Vidrio', 'Kit de Curación', 'Perfume', 'Lámpara', 'Aceite (3)', 'Botella de Agua', '19 PO'],
    equipmentEn: ["Cook's Utensils", 'Fine Clothes', '2 Glass Bottles', "Healer's Kit", 'Perfume', 'Lamp', 'Oil (3 flasks)', 'Waterskin', '19 GP']
  },
  'Vampire Survivor': {
    description: 'Presenciaste o sobreviviste un ataque de vampiro.',
    descriptionEn: 'You witnessed or survived a vampire attack.',
    scores: ['DEX', 'CON', 'WIS'],
    feat: 'Cazador de Vampiros',
    featEn: 'Vampire Hunter',
    featDescription: 'Estás preparado para enfrentar monstruos.',
    featDescriptionEn: 'You are prepared to face monsters.',
    skills: ['Insight', 'Religion'],
    tool: 'Herramientas de Tallador de Madera',
    toolEn: "Woodcarver's Tools",
    equipment: ['Herramientas de Tallador de Madera', 'Palanca', 'Linterna Encapuchada', 'Símbolo Sagrado (Reliquia)', 'Agua Bendita', 'Espejo', 'Aceite (3)', 'Yesca', 'Ropa de Viajero', '4 PO'],
    equipmentEn: ["Woodcarver's Tools", 'Crowbar', 'Hooded Lantern', 'Holy Symbol (reliquary)', 'Holy Water', 'Mirror', 'Oil (3 flasks)', 'Tinderbox', "Traveler's Clothes", '4 GP']
  }
};

// Write ES
out += `export const BACKGROUNDS_ES: Record<string, BackgroundData> = {\n`;
Object.keys(backgrounds).forEach(name => {
  const bg = backgrounds[name];
  out += `    '${name}': {\n`;
  out += `        description: '${bg.description.replace(/'/g, "\\'")}',\n`;
  out += `        scores: [${bg.scores.map(s => `'${s}'`).join(', ')}],\n`;
  out += `        feat: '${bg.feat}',\n`;
  out += `        featDescription: '${bg.featDescription.replace(/'/g, "\\'")}',\n`;
  out += `        skills: [${bg.skills.map(s => `'${s}'`).join(', ')}],\n`;
  out += `        tool: '${bg.tool}',\n`;
  out += `        equipment: [${bg.equipment.map(e => `'${e}'`).join(', ')}]\n`;
  out += `    },\n`;
});
out += `};\n\n// =============== ENGLISH BACKGROUNDS ===============

`;

// Write EN
out += `export const BACKGROUNDS_EN: Record<string, BackgroundData> = {\n`;
Object.keys(backgrounds).forEach(name => {
  const bg = backgrounds[name];
  out += `    '${name}': {\n`;
  out += `        description: '${bg.descriptionEn.replace(/'/g, "\\'")}',\n`;
  out += `        scores: [${bg.scores.map(s => `'${s}'`).join(', ')}],\n`;
  out += `        feat: '${bg.featEn}',\n`;
  out += `        featDescription: '${bg.featDescriptionEn.replace(/'/g, "\\'")}',\n`;
  out += `        skills: [${bg.skills.map(s => `'${s}'`).join(', ')}],\n`;
  out += `        tool: '${bg.toolEn}',\n`;
  out += `        equipment: [${bg.equipmentEn.map(e => `'${e}'`).join(', ')}]\n`;
  out += `    },\n`;
});
out += `};\n`;

fs.writeFileSync(OUTPUT_ES, out, 'utf8');
console.log(`Written to ${OUTPUT_ES} with ${Object.keys(backgrounds).length} backgrounds`);
