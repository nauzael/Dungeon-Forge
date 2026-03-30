import { Ability } from '../types';

export interface Feat {
  name: string;
  category: string;
  level: number;
  prerequisite?: string;
  description: string;
  asi?: Ability[];
}

export const FEAT_OPTIONS_ES: Feat[] = [
    { 
        name: 'Alerta', 
        category: 'Origin', 
        level: 1, 
        description: 'Competencia en Iniciativa y Cambio de Iniciativa (con un aliado voluntario).' 
    },
    { 
        name: 'Afortunado', 
        category: 'Origin', 
        level: 1, 
        description: 'Puntos de Suerte iguales al Bonificador de Competencia para obtener Ventaja o imponer Desventaja.' 
    },
    { 
        name: 'Atacante Salvaje', 
        category: 'Origin', 
        level: 1, 
        description: 'Lanza los dados de daño de arma dos veces y usa el total más alto (una vez por turno).' 
    },
    { 
        name: 'Artesano', 
        category: 'Origin', 
        level: 1, 
        description: 'Competencia con Herramientas en 3 Herramientas de Artesano, 20% de descuento en objetos no mágicos, y Fabricación Rápida.' 
    },
    { 
        name: 'Resistente', 
        category: 'Origin', 
        level: 1, 
        description: 'El máximo de Puntos de Golpe aumenta en 2 por nivel.' 
    },
    { 
        name: 'Experto', 
        category: 'Origin', 
        level: 1, 
        description: 'Competencia en cualquier combinación de tres Habilidades o Herramientas.' 
    },
    { 
        name: 'Sanador', 
        category: 'Origin', 
        level: 1, 
        description: 'Médico de Batalla (gasta un Dado de Golpe para sanar) y relanza 1s en dados de sanación.' 
    },
    { 
        name: 'Iniciado Mágico (Clérigo)', 
        category: 'Origin', 
        level: 1, 
        description: '2 trucos de Clérigo y 1 hechizo de nivel 1 de Clérigo (Sabiduría).' 
    },
    { 
        name: 'Iniciado Mágico (Druida)', 
        category: 'Origin', 
        level: 1, 
        description: '2 trucos de Druida y 1 hechizo de nivel 1 de Druida (Sabiduría).' 
    },
    { 
        name: 'Iniciado Mágico (Mago)', 
        category: 'Origin', 
        level: 1, 
        description: '2 trucos de Mago y 1 hechizo de nivel 1 de Mago (Inteligencia).' 
    },
    { 
        name: 'Peleador de Taberna', 
        category: 'Origin', 
        level: 1, 
        description: 'Golpe Sin Arma mejorado (1d4), empujar 5 pies al golpear, y competencia con Armas Improvisadas.' 
    },
    { 
        name: 'Músico', 
        category: 'Origin', 
        level: 1, 
        description: 'Formación Musical (3 instrumentos) y Canción Animadora (concede Inspiración Heroica durante descansos).' 
    },

    { 
        name: 'Mejora de Puntuación de Característica', 
        category: 'General', 
        level: 4, 
        description: 'Aumenta una puntuación de característica de tu elección en 2, o aumenta dos puntuaciones de característica de tu elección en 1.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Atleta', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Velocidad de Escalada, levantarse cuesta 5 pies, y aumento de distancia de salto.',
        asi: ['STR', 'DEX'] 
    },
    { 
        name: 'Actor', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Carisma 13+', 
        description: 'Ventaja en Engaño/Interpretación para hacerse pasar por otro, y mimetismo.',
        asi: ['CHA']
    },
    { 
        name: 'Cargador', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: '+10 pies de velocidad al Correr, y daño adicional de 1d8 o empujar 10 pies después de moverse 10 pies.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Aplastador', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Constitución 13+', 
        description: 'Empujar 5 pies al golpear con daño contundente, ventaja en daño de impacto crítico.',
        asi: ['STR', 'CON']
    },
    { 
        name: 'Cocinero', 
        category: 'General', 
        level: 4, 
        description: 'Cocina comida especial que concede sanación adicional durante descansos y golosinas para Puntos de Golpe temporales.',
        asi: ['CON', 'WIS']
    },
    { 
        name: 'Experto en Ballesta', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Destreza 13+', 
        description: 'Ignorar Carga, disparar en melé sin desventaja, y ataque adicional con Ballesta de Mano.',
        asi: ['DEX']
    },
    { 
        name: 'Duelista Defensivo', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Destreza 13+', 
        description: 'Usa reacción para añadir el Bonificador de Competencia a la CA al ser golpeado con arma corpo a corpo mientras usas un arma de Finesse.',
        asi: ['DEX']
    },
    { 
        name: 'Doble Empuñadura', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Lucha con Dos Armas con armas que no son Ligeras, +1 CA mientras lucha con dos armas.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Durable', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Constitución 13+', 
        description: 'Ventaja en tiradas de muerte, y acción adicional para gastar Dados de Golpe para sanar.',
        asi: ['CON']
    },
    { 
        name: 'Adepto Elemental', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Lanzamiento de Hechizos/Magia de Pacto', 
        description: 'Ignorar resistencia del tipo de daño elegido y tratar 1s en dados de daño como 2s.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Toque Feérico', 
        category: 'General', 
        level: 4, 
        description: 'Aprende Paso Brumoso y un hechizo de Adivinación o Encantamiento (nivel 1).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Luchador', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Agarrar como parte de Golpe Sin Arma, y Ventaja en ataques contra objetivos agarrados.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Maestro de Armas Pesadas', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza 13+', 
        description: 'Daño adicional igual al Bonificador de Competencia al golpear con armas Pesadas, y ataque adicional en Crítico/Matar.',
        asi: ['STR']
    },
    { 
        name: 'Pesadamente Armado', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Competencia con Armadura Media', 
        description: 'Competencia con Armadura Pesada.',
        asi: ['STR', 'CON']
    },
    { 
        name: 'Maestro de Armadura Pesada', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Competencia con Armadura Pesada', 
        description: 'Reducción de daño B/P/C igual al Bonificador de Competencia mientras usa Armadura Pesada.',
        asi: ['STR', 'CON']
    },
    { 
        name: 'Líder Inspirador', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Sabiduría o Carisma 13+', 
        description: 'Concede Puntos de Golpe Temporales (Nivel + Mod) a aliados con un discurso.',
        asi: ['WIS', 'CHA']
    },
    { 
        name: 'Mente Aguda', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Inteligencia 13+', 
        description: 'Experiencia en una habilidad de conocimiento, y acción de Estudiar como Acción Adicional.',
        asi: ['INT']
    },
    { 
        name: 'Levemente Armado', 
        category: 'General', 
        level: 4, 
        description: 'Competencia con Armadura Ligera, Armadura Media y Escudos.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Matamagos', 
        category: 'General', 
        level: 4, 
        description: 'Desventaja en tiradas de concentración para enemigos que golpeas, y éxito automático en una tirada de salvación mental fallida por día.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Entrenamiento con Armas Marciales', 
        category: 'General', 
        level: 4, 
        description: 'Competencia con todas las Armas Marciales.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Maestro de Armadura Media', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Competencia con Armadura Media', 
        description: 'Sin desventaja de Sigilo en armadura media, y el bono máximo de Destreza a la CA aumenta a 3.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Moderadamente Armado', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Competencia con Armadura Ligera', 
        description: 'Competencia con Armadura Media y Escudos.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Combatiente Montado', 
        category: 'General', 
        level: 4, 
        description: 'Ventaja en ataques cuerpo a cuerpo vs objetivos más pequeños sin montar, y redirigir daño de montura.',
        asi: ['STR', 'DEX', 'WIS']
    },
    { 
        name: 'Observador', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Inteligencia o Sabiduría 13+', 
        description: 'Experiencia en Percepción/Investigación, y acción de Buscar como Acción Adicional.',
        asi: ['INT', 'WIS']
    },
    { 
        name: 'Perforador', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Relanzar un dado de daño perforante, dado adicional en impacto crítico.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Maestro de Armas de Asta', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Ataque adicional de d4 con el extremo de la alabarda, y ataque de oportunidad al entrar en alcance.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Resiliente', 
        category: 'General', 
        level: 4, 
        description: 'Competencia en tiradas de salvación de la puntuación de característica aumentada.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Lanzador de Rituales', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Int, Sab, o Car 13+', 
        description: 'Lanza rituales de cualquier lista, y ritual rápido (tiempo estándar) una vez por día.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Centinela', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Ataque de reacción cuando el enemigo ataca a un aliado, y detener movimiento enemigo al golpear en oportunidad.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Toque de Sombra', 
        category: 'General', 
        level: 4, 
        description: 'Aprende Invisibilidad y un hechizo de Ilusión o Nigromancia (nivel 1).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Tirador de Elite', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Destreza 13+', 
        description: 'Ignorar Cobertura, sin desventaja a larga distancia, y disparar en melé sin desventaja.',
        asi: ['DEX']
    },
    { 
        name: 'Maestro del Escudo', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Competencia con Escudo', 
        description: 'Empujar como acción adicional, añadir CA del escudo a salvaciones de Destreza vs efectos de un solo objetivo, y Evasión de reacción.',
        asi: ['STR']
    },
    { 
        name: 'Experto en Habilidad', 
        category: 'General', 
        level: 4, 
        description: 'Una competencia y una Experiencia.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Cuchillo', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Fuerza o Destreza 13+', 
        description: 'Reducir velocidad al golpear con daño cortante, imponer desventaja en siguiente ataque con crítico.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Veloz', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Destreza o Constitución 13+', 
        description: '+10 pies de velocidad, ignorar terreno difícil al Correr, y sin Ataques de Oportunidad después de alejarse.',
        asi: ['DEX', 'CON']
    },
    { 
        name: 'Francotirador de Conjuros', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Lanzamiento de Hechizos/Magia de Pacto', 
        description: 'Ignorar Cobertura, doble alcance de hechizo, y sin desventaja en melé para ataques de hechizo.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Telequinético', 
        category: 'General', 
        level: 4, 
        description: 'Mano de Mago (invisible) y empujar telequinético como acción adicional (5 pies).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Telépata', 
        category: 'General', 
        level: 4, 
        description: 'Telepatía de 60 pies y Detectar Pensamientos 1/día.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Lanzador de Guerra', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Lanzamiento de Hechizos/Magia de Pacto', 
        description: 'Ventaja en tiradas de concentración y lanzar hechizos como ataques de oportunidad.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Maestro de Armas', 
        category: 'General', 
        level: 4, 
        description: 'Aprende 3 Dominios de Arma, y cambia uno durante descansos. Obtiene todas las competencias con armas.',
        asi: ['STR', 'DEX']
    },

    { name: 'Arquero', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: '+2 a las tiradas de ataque con armas a distancia.' },
    { name: 'Defensa', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: '+1 a la CA mientras usa armadura.' },
    { name: 'Duelo', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: '+2 al daño con arma de una mano.' },
    { name: 'Lucha con Armas Pesadas', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Relanza 1s y 2s en dados de daño con armas a dos manos.' },
    { name: 'Lucha con Dos Armas', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Añade el modificador de característica al daño del segundo ataque.' },
    { name: 'Lucha con Armas Arrojadizas', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Draw as part of attack, +2 damage on hits.' },
    { name: 'Lucha Sin Arma', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Golpe Sin Arma es 1d6 (d8 si sin manos) + Fuerza. Daño adicional a objetivos agarrados.' },
    { name: 'Protección', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Impone Desventaja al ataque vs aliado mientras usa escudo.' },
    { name: 'Intercepción', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Reduce el daño a un aliado cercano (1d10 + Prof) usando escudo/arma.' },
    { name: 'Lucha a Ciegas', category: 'Fighting Style', level: 1, prerequisite: 'Estilo de Lucha', description: 'Visión en la Oscuridad 10 pies.' },

    { 
        name: 'Don de Viaje Dimensional', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Paso Brumoso ilimitado (recarga en Iniciativa o Descanso Corto).',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Don de Resistencia Energética', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Resistencia a dos tipos de daño, cambiable durante descansos.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Don del Destino', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Añadir o restar 2d4 a cualquier prueba de d20 dentro de 60 pies (1/turno).',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Don de la Fortaleza', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'El máximo de Puntos de Golpe aumenta en 40, y gana el modificador de Con en cualquier sanación recibida.',
        asi: ['CON']
    },
    { 
        name: 'Don de Ofensa Irresistible', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Tus ataques ignoran toda resistencia al daño.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Don de Recuperación', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Acción adicional para sanar la mitad del HP máximo (1/Descanso Largo), y caer a 1 HP en lugar de 0 (1/Descanso Largo).',
        asi: ['CON']
    },
    { 
        name: 'Don de Habilidad', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Competencia en todas las Habilidades, y una Experiencia.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Don de Velocidad', 
        category: 'Epic Boon', 
        level: 19, 
        description: '+30 pies de velocidad, y Desenganche como Acción Adicional.',
        asi: ['DEX']
    },
    { 
        name: 'Don de Recuerdo de Hechizos', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Lanza hechizos de nivel 1-4 sin espacios (25% de probabilidad de retener uso).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Don de Vista Verdadera', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Obtiene Vista Verdadera 60 pies.',
        asi: ['WIS']
    }
];
