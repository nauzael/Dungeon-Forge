
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const druid = {
  details: { 
    name: 'Druid', 
    description: 'Los druidas pertenecen a órdenes antiguas que invocan las fuerzas de la naturaleza. Curan, se transforman en animales y dominan la destrucción elemental.', 
    traits: [
        { name: 'Spellcasting', description: 'Magia primordial basada en Sabiduría. Eres un lanzador de conjuros preparados.' }, 
        { name: 'Druidic', description: 'Conoces el lenguaje secreto de los druidas. Siempre tienes preparado Hablar con los Animales.' }, 
        { name: 'Primal Order', description: 'Eliges tu camino: Mago (truco extra y bono a Arcana/Naturaleza) o Guardián (armadura media y armas marciales).' }
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
        description: 'Druidas místicos que salvaguardan ritos antiguos dentro de círculos de árboles o piedras, sintonizados con un bioma específico.',
        features: {
            3: [
                { name: 'Circle of the Land Spells', description: 'Tras un descanso largo, elige un bioma: Árido, Polar, Templado o Tropical. Obtienes conjuros preparados adicionales según tu nivel.' },
                { name: 'Land\'s Aid', description: 'Acción Mágica: Gasta un uso de Forma Salvaje para invocar flores vitales y espinas en un área de 10 pies. Criaturas enemigas reciben 2d6 daño necrótico (CD Sab) y un aliado recupera 2d6 HP.' }
            ],
            6: [{ name: 'Natural Recovery', description: 'Puedes lanzar un conjuro de tu lista de bioma sin gastar espacio. Además, en descanso corto recuperas espacios de conjuro cuya suma de niveles sea igual a la mitad de tu nivel de druida.' }],
            10: [{ name: 'Nature\'s Ward', description: 'Inmunidad a Envenenado y Resistencia al daño asociado a tu bioma actual (Fuego, Frío, Rayo o Veneno).' }],
            14: [{ name: 'Nature\'s Sanctuary', description: 'Acción Mágica: Gasta Forma Salvaje para crear un cubo de 15 pies con vegetación espectral (1 min). Tú y aliados tenéis Cobertura Media y las resistencias de Nature\'s Ward.' }]
        }
    },
    {
        name: 'Circle of the Moon',
        description: 'Druidas que usan la magia lunar para transformarse en combatientes feroces, protegiendo el mundo natural con garra y colmillo.',
        features: {
            3: [
                { name: 'Circle Forms', description: 'Tu Forma Salvaje mejora: Puedes usarla como Acción Adicional. Tu CA es 13 + Sabiduría (si es mayor). Ganas THP igual a 3 veces tu nivel de Druid.' },
                { name: 'Circle of the Moon Spells', description: 'Siempre tienes preparados conjuros como Cure Wounds and Moonbeam. Puedes lanzarlos mientras estás en Forma Salvaje.' }
            ],
            6: [
                { name: 'Lunar Radiance', description: 'Tus ataques en Forma Salvaje pueden infligir daño Radiante en lugar de su tipo normal.' },
                { name: 'Increased Toughness', description: 'Puedes sumar tu modificador de Sabiduría a tus tiradas de salvación de Constitución.' }
            ],
            10: [{ name: 'Moonlight Step', description: 'Acción Adicional: Te teletransportas hasta 30 pies y tienes ventaja en tu próximo ataque. (Usos = mod Sab, recuperas con descanso largo o gastando espacio lvl 2+).' }],
            14: [{ name: 'Lunar Form', description: 'Una vez por turno en Forma Salvaje, infliges 2d10 daño Radiante extra. Además, puedes teletransportar a un aliado contigo al usar Moonlight Step.' }]
        }
    },
    {
        name: 'Circle of the Sea',
        description: 'Druidas vinculados a la furia de los océanos y las tormentas, encarnando la ira de la naturaleza contra quienes la despojan.',
        features: {
            3: [
                { name: 'Wrath of the Sea', description: 'Acción Adicional: Gasta Forma Salvaje para crear un aura de rocío marino (10 min). Al final de tu turno, dañas con Trueno (dados d6 = mod Sab) y empujas 15 pies a un enemigo a 10 pies.' },
                { name: 'Circle of the Sea Spells', description: 'Conjuros preparados adicionales como Fog Cloud, Shatter and Lightning Bolt.' }
            ],
            6: [{ name: 'Aquatic Affinity', description: 'El alcance de Wrath of the Sea sube a 10 pies. Ganas velocidad de nado igual a tu velocidad.' }],
            10: [{ name: 'Stormborn', description: 'Mientras Wrath of the Sea está activa, ganas Vuelo y Resistencia a daño por Frío, Rayo y Trueno.' }],
            14: [{ name: 'Oceanic Gift', description: 'Puedes manifestar el aura de Wrath of the Sea alrededor de un aliado dispuesto a 60 pies. Gastando dos usos de Forma Salvaje, puedes tenerla tú y el aliado a la vez.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, DEX: 13, INT: 12, STR: 10, CHA: 8 }
};
