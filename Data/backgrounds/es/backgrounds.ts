import { BackgroundData } from '../../../types';

// AUTO-GENERATED from docs/Manual/02-species-backgrounds.md
// Do not edit manually - regenerate with: node generate-backgrounds.cjs

export const BACKGROUND_DATA: Record<string, BackgroundData> = {
    'Acolyte': {
        description: 'Devoto al servicio en un templo.',
        scores: ['INT', 'WIS', 'CHA'],
        feat: 'Iniciado en la Magia (Clérigo)',
        featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de clérigo. Puedes lanzarlo una vez gratis por descanso largo.',
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
        featDescription: 'Ganas competencia en iniciativa y puedes intercambio tu iniciativa con un aliado.',
        skills: ['Sleight of Hand', 'Stealth'],
        tool: 'Herramientas de Ladrón',
        equipment: ['Herramientas de Ladrón', 'Daga (2)', 'Palanca', 'Bolsa (2)', 'Ropa de Viajero', '16 PO']
    },
    'Entertainer': {
        description: 'Prosperas bajo el aplauso del público.',
        scores: ['STR', 'DEX', 'CHA'],
        feat: 'Músico',
        featDescription: 'Competencia con 3 instrumentos. Puedes dar Inspiración Heroica a aliados.',
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
        featDescription: 'Ganas competencia en iniciativa y puedes intercambio tu iniciativa con un aliado.',
        skills: ['Athletics', 'Perception'],
        tool: 'Juego de Juego',
        equipment: ['Juego de Juego', 'Lanza', 'Ballesta Ligera', 'Virotes (20)', 'Linterna Encapuchada', 'Grilletes', 'Carcaj', 'Ropa de Viajero', '12 PO']
    },
    'Guide': {
        description: 'Creciste al aire libre, lejos de la ciudad.',
        scores: ['DEX', 'CON', 'WIS'],
        feat: 'Iniciado en la Magia (Druida)',
        featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de druida. Puedes lanzarlo una vez gratis por descanso largo.',
        skills: ['Stealth', 'Survival'],
        tool: 'Herramientas de Cartógrafo',
        equipment: ['Herramientas de Cartógrafo', 'Arco Corto', 'Flechas (20)', 'Saco de Dormir', 'Carcaj', 'Tienda de Campaña', 'Ropa de Viajero', '3 PO']
    },
    'Hermit': {
        description: 'Pasaste tus primeros años en reclusión.',
        scores: ['CON', 'WIS', 'CHA'],
        feat: 'Sanador',
        featDescription: 'Mejoras el uso de kits de sanador y puedes gastar Dados de Golpe para curar.',
        skills: ['Medicine', 'Religion'],
        tool: 'Kit de Herboristería',
        equipment: ['Kit de Herboristería', 'Bastón', 'Saco de Dormir', 'Libro (Filosofía)', 'Lámpara', 'Aceite (3)', 'Ropa de Viajero', '16 PO']
    },
    'Merchant': {
        description: 'Aprendiz de comerciante o tendero.',
        scores: ['CON', 'INT', 'CHA'],
        feat: 'Afortunado',
        featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia.',
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
        featDescription: 'Aprendes 2 trucos y 1 conjuro de nivel 1 de mago. Puedes lanzarlo una vez gratis por descanso largo.',
        skills: ['Arcana', 'History'],
        tool: 'Suministros de Caligrafía',
        equipment: ['Suministros de Caligrafía', 'Bastón', 'Libro (Historia)', 'Pergamino (8)', 'Túnica', '8 PO']
    },
    'Sailor': {
        description: 'Viviste como marino, con el viento a tu espalda.',
        scores: ['STR', 'DEX', 'WIS'],
        feat: 'Matón de Taberna',
        featDescription: 'Ataques sin armas mejorados (d4) y puedes empujar como acción adicional.',
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
        featDescription: 'Una vez por turno, puedes tirar los dados de daño de un arma dos veces.',
        skills: ['Athletics', 'Intimidation'],
        tool: 'Juego de Juego',
        equipment: ['Juego de Juego', 'Lanza', 'Arco Corto', 'Flechas (20)', 'Kit de Curación', 'Carcaj', 'Ropa de Viajero', '14 PO']
    },
    'Wayfarer': {
        description: 'Creciste en las calles, recurriendo al robo.',
        scores: ['DEX', 'WIS', 'CHA'],
        feat: 'Afortunado',
        featDescription: 'Ganas Puntos de Suerte igual a tu Bono de Competencia.',
        skills: ['Insight', 'Stealth'],
        tool: 'Herramientas de Ladrón',
        equipment: ['Herramientas de Ladrón', 'Daga (2)', 'Juego de Juego', 'Saco de Dormir', 'Bolsa (2)', 'Ropa de Viajero', '16 PO']
    },
};
