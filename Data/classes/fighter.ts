
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const fighter = {
  details: { 
    name: 'Fighter', 
    description: 'Maestros del combate marcial, expertos en todo tipo de armas y armaduras. Son la vanguardia en cualquier campo de batalla.', 
    traits: [
        { name: 'Fighting Style', description: 'Eliges una dote de Estilo de Combate (Arquero, Defensa, etc.) para especializarte.' }, 
        { name: 'Second Wind', description: 'Acción Adicional: Recuperas 1d10 + nivel de guerrero HP. Tienes múltiples usos que se recuperan con descansos.' }, 
        { name: 'Weapon Mastery', description: 'Dominas las propiedades de maestría de tres armas (escala con el nivel).' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] as Skill[] },
  progression: { 
    1: ['Fighting Style', 'Second Wind', 'Weapon Mastery'], 
    2: ['Action Surge', 'Tactical Mind'], 
    3: ['Fighter Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Tactical Shift'], 
    6: ['Ability Score Improvement'], 
    7: ['Subclass Feature'],
    8: ['Ability Score Improvement'], 
    9: ['Indomitable', 'Tactical Master'], 
    10: ['Subclass Feature'],
    11: ['Two Extra Attacks'], 
    12: ['Ability Score Improvement'], 
    13: ['Indomitable (2)', 'Studied Attacks'], 
    14: ['Ability Score Improvement'], 
    15: ['Subclass Feature'],
    16: ['Ability Score Improvement'], 
    17: ['Action Surge (2)', 'Indomitable (3)'],
    18: ['Subclass Feature'],
    19: ['Epic Boon Feat'], 
    20: ['Three Extra Attacks'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Battle Master',
        description: 'Tácticos de élite que usan maniobras marciales.',
        features: {
            3: [
                { name: 'Combat Superiority', description: 'Ganas 4 dados de Superioridad (d8) para realizar Maniobras. Eliges 3 maniobras iniciales.' },
                { name: 'Student of War', description: 'ELEGIR: Ganas competencia en una herramienta de artesano y una habilidad de la lista de guerrero.' }
            ],
            7: [
                { name: 'Know Your Enemy', description: 'BA: Identifica vulnerabilidades/resistencias. Eliges 2 maniobras nuevas.' },
                { name: 'Additional Superiority Die', description: 'Ganas un dado extra (Total: 5).' }
            ],
            10: [{ name: 'Improved Combat Superiority', description: 'Dados suben a d10. Eliges 2 maniobras nuevas.' }],
            15: [
                { name: 'Relentless', description: 'Una vez por turno, usa una maniobra lanzando un d8 sin gastar dado de superioridad.' },
                { name: 'Additional Superiority Die', description: 'Ganas un dado extra (Total: 6). Eliges 2 maniobras nuevas.' }
            ],
            18: [{ name: 'Ultimate Combat Superiority', description: 'Dados suben a d12.' }]
        }
    },
    {
        name: 'Champion',
        description: 'La perfección física absoluta del guerrero.',
        features: {
            3: [
                { name: 'Improved Critical', description: 'Impactos críticos con 19 o 20.' },
                { name: 'Remarkable Athlete', description: 'Ventaja en iniciativa y Atletismo. Tras un crítico, puedes moverte media velocidad sin provocar ataques.' }
            ],
            7: [{ name: 'Additional Fighting Style', description: 'ELEGIR: Ganas una dote adicional de Estilo de Combate.' }],
            10: [{ name: 'Heroic Warrior', description: 'Ganas Inspiración Heroica automáticamente al inicio de tu turno si no tienes.' }],
            15: [{ name: 'Superior Critical', description: 'Impactos críticos con 18, 19 o 20.' }],
            18: [
                { name: 'Defy Death', description: 'Ventaja en salvaciones de muerte.' },
                { name: 'Heroic Rally', description: 'Recuperas HP constante mientras estés por debajo de la mitad de vida.' }
            ]
        }
    },
    {
        name: 'Eldritch Knight',
        description: 'Guerreros que tejen acero y magia arcana.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'MAGIA: Basada en INT (Mago). Sin restricciones de escuela en 2024.' },
                { name: 'War Bond', description: 'Vincula armas para invocarlas a tu mano como BA.' }
            ],
            7: [{ name: 'War Magic', description: 'Sustituye un ataque por un Truco al usar la acción de Atacar.' }],
            10: [{ name: 'Eldritch Strike', description: 'Al golpear a un enemigo, este tiene desventaja en su próxima salvación contra un hechizo tuyo.' }],
            15: [{ name: 'Arcane Charge', description: 'Teletransporte de 30 pies vinculado al uso de Acción Súbita.' }],
            18: [{ name: 'Improved War Magic', description: 'Sustituye dos ataques por el lanzamiento de un conjuro de nivel 1 o 2.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 3,
  suggestedArray: { STR: 15, DEX: 14, CON: 13, CHA: 12, WIS: 10, INT: 8 }
};
