import { BackgroundData } from '../types';

export const BACKGROUNDS_ES: Record<string, BackgroundData> = {
    'Acolyte': { 
        description: 'Devoto al servicio en un templo.', 
        scores: ['INT', 'WIS', 'CHA'], 
        feat: 'Iniciado en la Magia (Clérigo)', 
        featDescription: 'Aprende 2 trucos y 1 conjuro de nivel 1 de clérigo. Puedes lanzarlo una vez gratis por descanso largo.', 
        skills: ['Insight', 'Religion'], 
        tool: 'Suministros de Caligrafía',
        equipment: ['Suministros de Caligrafía', 'Libro (Oraciones)', 'Símbolo Sagrado', 'Pergamino (10)', 'Túnica', '8 PO'] 
    },
    'Artisan': { 
        description: 'Empezaste como aprendiz de artesano.', 
        scores: ['STR', 'DEX', 'INT'], 
        feat: 'Fabricante', 
        featDescription: 'Competencia con 3 herramientas de artesano. Descuento del 20% en objetos no mágicos. Fabricación rápida.', 
        skills: ['Investigation', 'Persuasion'], 
        tool: 'Herramientas de Artesano',
        equipment: ['Herramientas de Artesano', 'Bolsa (2)', 'Ropa de Viajero', '32 PO'] 
    },
    'Charlatan': { 
        description: 'Aprendiste a engañar para sobrevivir.', 
        scores: ['DEX', 'CON', 'CHA'], 
        feat: 'Habilidoso', 
        featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.', 
        skills: ['Deception', 'Sleight of Hand'], 
        tool: 'Kit de Falsificación',
        equipment: ['Kit de Falsificación', 'Disfraz', 'Ropa Fina', '15 PO'] 
    },
    'Criminal': { 
        description: 'Sobreviviste en los callejones oscuros.', 
        scores: ['DEX', 'CON', 'INT'], 
        feat: 'Alerta', 
        featDescription: 'Ganas competencia en iniciativa y puedes intercambiar tu iniciativa con un aliado dispuesto.', 
        skills: ['Sleight of Hand', 'Stealth'], 
        tool: 'Herramientas de Ladrón',
        equipment: ['Herramientas de Ladrón', 'Daga (2)', 'Palanca', 'Bolsa (2)', 'Ropa de Viajero', '16 PO'] 
    },
    'Entertainer': { 
        description: 'Prosperas bajo el aplauso del público.', 
        scores: ['STR', 'DEX', 'CHA'], 
        feat: 'Músico', 
        featDescription: 'Competencia con 3 instrumentos. Puedes dar Inspiración Heroica a tus aliados tras un descanso.', 
        skills: ['Acrobatics', 'Performance'], 
        tool: 'Instrumento Musical',
        equipment: ['Instrumento Musical', 'Disfraz (2)', 'Espejo', 'Perfume', 'Ropa de Viajero', '11 PO'] 
    },
    'Farmer': { 
        description: 'Creciste cerca de la tierra y la naturaleza.', 
        scores: ['STR', 'CON', 'WIS'], 
        feat: 'Duro', 
        featDescription: 'Tu máximo de puntos de golpe aumenta en 2 por nivel actual y futuro.', 
        skills: ['Animal Handling', 'Nature'], 
        tool: 'Herramientas de Carpintero',
        equipment: ['Herramientas de Carpintero', 'Hoz', 'Kit de Curación', 'Olla de Hierro', 'Pala', 'Ropa de Viajero', '30 PO'] 
    },
    'Guard': { 
        description: 'Entrenado para vigilar contra peligros.', 
        scores: ['STR', 'INT', 'WIS'], 
        feat: 'Alerta', 
        featDescription: 'Ganas competencia en iniciativa y puedes intercambiar tu iniciativa con un aliado dispuesto.', 
        skills: ['Athletics', 'Perception'], 
        tool: 'Juego de Juego',
        equipment: ['Juego de Juego', 'Lanza', 'Ballesta Ligera', 'Virotes (20)', 'Linterna Encapuchada', 'Grilletes', 'Carcaj', 'Ropa de Viajero', '12 PO'] 
    },
    'Guide': { 
        description: 'Creciste al aire libre, lejos de la ciudad.', 
        scores: ['DEX', 'CON', 'WIS'], 
        feat: 'Iniciado en la Magia (Druida)', 
        featDescription: 'Aprende 2 trucos y 1 conjuro de nivel 1 de druida. Puedes lanzarlo una vez gratis por descanso largo.', 
        skills: ['Stealth', 'Survival'], 
        tool: 'Herramientas de Cartógrafo',
        equipment: ['Herramientas de Cartógrafo', 'Arco Corto', 'Flechas (20)', 'Saco de Dormir', 'Carcaj', 'Tienda de Campaña', 'Ropa de Viajero', '3 PO'] 
    },
    'Hermit': { 
        description: 'Pasaste tus primeros años en reclusión.', 
        scores: ['CON', 'WIS', 'CHA'], 
        feat: 'Sanador', 
        featDescription: 'Mejoras el uso de kits de sanador y puedes gastar Dados de Golpe para curar aliados en combate.', 
        skills: ['Medicine', 'Religion'], 
        tool: 'Kit de Herboristería',
        equipment: ['Kit de Herboristería', 'Bastón', 'Saco de Dormir', 'Libro (Filosofía)', 'Lámpara', 'Aceite (3)', 'Ropa de Viajero', '16 PO'] 
    },
    'Merchant': { 
        description: 'Aprendiz de comerciante o tendero.', 
        scores: ['CON', 'INT', 'CHA'], 
        feat: 'Afortunado', 
        featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia para ganar ventaja o imponer desventaja.', 
        skills: ['Animal Handling', 'Persuasion'], 
        tool: 'Herramientas de Navegante',
        equipment: ['Herramientas de Navegante', 'Bolsa (2)', 'Ropa de Viajero', '22 PO'] 
    },
    'Noble': { 
        description: 'Criado en un castillo con riqueza y poder.', 
        scores: ['STR', 'INT', 'CHA'], 
        feat: 'Habilidoso', 
        featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.', 
        skills: ['History', 'Persuasion'], 
        tool: 'Juego de Juego',
        equipment: ['Juego de Juego', 'Ropa Fina', 'Perfume', '29 PO'] 
    },
    'Sage': { 
        description: 'Pasaste noches estudiando libros y pergaminos.', 
        scores: ['CON', 'INT', 'WIS'], 
        feat: 'Iniciado en la Magia (Mago)', 
        featDescription: 'Aprende 2 trucos y 1 conjuro de nivel 1 de mago. Puedes lanzarlo una vez gratis por descanso largo.', 
        skills: ['Arcana', 'History'], 
        tool: 'Suministros de Caligrafía',
        equipment: ['Suministros de Caligrafía', 'Bastón', 'Libro (Historia)', 'Pergamino (8)', 'Túnica', '8 PO'] 
    },
    'Sailor': { 
        description: 'Viviste como marino, con el viento a tu espalda.', 
        scores: ['STR', 'DEX', 'WIS'], 
        feat: 'Matón de Taberna', 
        featDescription: 'Ataques sin armas mejorados (d4) y puedes empujar como acción adicional al impactar desarmado.', 
        skills: ['Acrobatics', 'Perception'], 
        tool: 'Herramientas de Navegante',
        equipment: ['Herramientas de Navegante', 'Daga', 'Cuerda', 'Ropa de Viajero', '20 PO'] 
    },
    'Scribe': { 
        description: 'Aprendiste a escribir con mano clara.', 
        scores: ['DEX', 'INT', 'WIS'], 
        feat: 'Habilidoso', 
        featDescription: 'Ganas competencia en cualquier combinación de 3 habilidades o herramientas.', 
        skills: ['Investigation', 'Perception'], 
        tool: 'Suministros de Caligrafía',
        equipment: ['Suministros de Caligrafía', 'Ropa Fina', 'Lámpara', 'Aceite (3)', 'Pergamino (12)', '23 PO'] 
    },
    'Soldier': { 
        description: 'Entrenado para la guerra desde joven.', 
        scores: ['STR', 'DEX', 'CON'], 
        feat: 'Atacante Salvaje', 
        featDescription: 'Una vez por turno, puedes tirar los dados de daño de un arma dos veces y quedarte con el mejor.', 
        skills: ['Athletics', 'Intimidation'], 
        tool: 'Juego de Juego',
        equipment: ['Juego de Juego', 'Lanza', 'Arco Corto', 'Flechas (20)', 'Kit de Curación', 'Carcaj', 'Ropa de Viajero', '14 PO'] 
    },
    'Wayfarer': { 
        description: 'Creciste en las calles, recurriendo al robo.', 
        scores: ['DEX', 'WIS', 'CHA'], 
        feat: 'Afortunado', 
        featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia para ganar ventaja o imponer desventaja.', 
        skills: ['Insight', 'Stealth'], 
        tool: 'Herramientas de Ladrón',
        equipment: ['Herramientas de Ladrón', 'Daga (2)', 'Juego de Juego', 'Saco de Dormir', 'Bolsa (2)', 'Ropa de Viajero', '16 PO'] 
    }
};

export const BACKGROUNDS_EN: Record<string, BackgroundData> = {
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
