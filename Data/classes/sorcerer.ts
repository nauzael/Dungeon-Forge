
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const sorcerer = {
  details: { 
    name: 'Sorcerer', 
    description: 'Los hechiceros portan magia innata sellada en su ser. No aprenden magia; el poder crudo y bullente forma parte de ellos, heredado por linaje o eventos extraños.', 
    traits: [
        { name: 'Spellcasting', description: 'Magia arcana innata basada en Carisma. Eres un lanzador de conjuros preparados.' }, 
        { name: 'Innate Sorcery', description: 'Acción Adicional: Durante 1 min, tu CD de salvación aumenta en 1 y tienes ventaja en tiradas de ataque de conjuros. (2 usos/Long Rest).' }, 
        { name: 'Font of Magic', description: 'Reserva de Puntos de Hechicería (igual a tu nivel a partir del nivel 2). Úsalos para crear espacios de conjuro o alimentar tu Metamagia.' }
    ] 
  } as DetailData,
  hitDie: 6,
  savingThrows: ['CON', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Innate Sorcery'], 
    2: ['Font of Magic', 'Metamagic'], 
    3: ['Sorcerer Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Sorcerous Restoration'], 
    6: ['Subclass Feature'],
    7: ['Sorcery Incarnate'], 
    8: ['Ability Score Improvement'], 
    10: ['Metamagic'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    17: ['Metamagic'], 
    18: ['Subclass Feature'], 
    19: ['Epic Boon Feat'], 
    20: ['Arcane Apotheosis'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Draconic Sorcery', 
        description: 'Tu magia innata proviene del don de un dragón, heredado de un ancestro que fue bendecido o absorbido el power de una guarida dracónica.', 
        features: { 
            3: [
                { name: 'Draconic Resilience', description: 'Tu máximo de Puntos de Golpe aumenta en 3, y aumenta en 1 cada vez que subas de nivel de hechicero. Mientras no lleves armadura, tu CA base es igual a 10 + tus modificadores de Destreza y Carisma.' },
                { name: 'Draconic Spells', description: 'Hechizos siempre preparados como Alter Self, Chromatic Orb, Command and Dragon\'s Breath. Más hechizos a niveles 5, 7 y 9.' }
            ],
            6: [{ name: 'Elemental Affinity', description: 'Elige un tipo de daño (Ácido, Frío, Fuego, Rayo o Veneno). Ganas Resistencia a ese daño, y al lanzar un conjuro que inflija ese tipo, sumas tu modificador de Carisma a una tirada de daño.' }],
            14: [{ name: 'Dragon wings', description: 'Como Acción Adicional, puedes invocar alas dracónicas (1h). Ganas velocidad de Vuelo de 60 pies. Puedes gastar 3 Puntos de Hechicería para restaurar este uso antes de un descanso largo.' }],
            18: [{ name: 'Dragon Companion', description: 'Puedes lanzar Summon Dragon sin componentes materiales y una vez gratis por descanso largo. Puedes lanzarlo sin concentración (duración 1 min).' }]
        } 
    },
    {
        name: 'Wild Magic Sorcery',
        description: 'Tu magia brota de las fuerzas del caos que subyacen en el orden de la creación, esperando cualquier salida.',
        features: {
            3: [
                { name: 'Wild Magic Surge', description: '1/turno después de lanzar un conjuro con espacio, lanza 1d20. Con un 20, tira en la tabla de Oleada de Magia Salvaje. Los efectos son demasiado salvajes para la Metamagia y duran su tiempo completo.' },
                { name: 'Tides of Chaos', description: 'Ganas ventaja en una tirada de d20. Recuperas el uso tras un descanso largo o tras lanzar un conjuro de nivel 1+ que provoque una Oleada de Magia Salvaje.' }
            ],
            6: [{ name: 'Bend Luck', description: 'Reacción (1 punto): Cuando veas a otro lanzar d20, tira 1d4 y suma o resta el resultado a su tirada.' }],
            14: [{ name: 'Controlled Chaos', description: 'Al tirar en la tabla de Oleada de Magia Salvaje, tira dos veces y elige el resultado que prefieras.' }],
            18: [{ name: 'Tamed Surge', description: 'Tras lanzar un conjuro con espacio, puedes elegir cualquier efecto de la tabla de Oleada (excepto el último) que lance un conjuro o restaure todos tus puntos de hechicería. (1/1d4 descansos largos).' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};
