
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const bard = {
  details: { 
    name: 'Bard', 
    description: 'Maestros del canto, la oratoria y la magia. Los bardos usan las Palabras de Creación para inspirar aliados, desmoralizar enemigos y manipular la realidad.', 
    traits: [
        { name: 'Bardic Inspiration', description: 'Usa una acción adicional para inspirar a un aliado a 60 pies. Gana un dado de bardo (d6 a nivel 1) para añadir a una prueba de d20.' }, 
        { name: 'Spellcasting', description: 'Magia arcana basada en Carisma. Eres un lanzador de conjuros preparados.' }, 
        { name: 'Tool Proficiency', description: 'Competencia con 3 instrumentos musicales.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'DEX', 'CON'] as Ability[],
  skillData: { count: 3, options: 'Any' as const },
  progression: { 
    1: ['Bardic Inspiration', 'Spellcasting'], 
    2: ['Expertise', 'Jack of All Trades'], 
    3: ['Bard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Font of Inspiration'], 
    6: ['Subclass Feature'], 
    7: ['Countercharm'], 
    8: ['Ability Score Improvement'], 
    9: ['Expertise'], 
    10: ['Magical Secrets'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'],
    15: ['Inspiration Upgrade (d12)'],
    16: ['Ability Score Improvement'], 
    18: ['Superior Inspiration'],
    19: ['Epic Boon Feat'], 
    20: ['Words of Creation'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'College of Lore', 
        description: 'El Colegio del Saber busca la verdad en todas las fuentes.', 
        features: { 
            3: [
                { name: 'Bonus Proficiencies', description: 'ELEGIR: Ganas competencia en 3 habilidades a tu elección.' }, 
                { name: 'Cutting Words', description: 'Como Reacción, resta un dado de Inspiración al ataque, daño o prueba de un enemigo.' }
            ],
            6: [{ name: 'Magical Discoveries', description: 'ELEGIR: Aprendes 2 conjuros de cualquier clase (Clérigo, Druida o Mago) de un nivel que puedas lanzar.' }],
            14: [{ name: 'Peerless Skill', description: 'Añade Inspiración a tus propias pruebas de d20. Si fallas, no consumes el dado.' }]
        } 
      },
      {
        name: 'College of Valor',
        description: 'Bardos guerreros que cantan en la vanguardia.',
        features: {
            3: [
                { name: 'Combat Inspiration', description: 'Aliados pueden añadir Inspiración al daño o a la CA como reacción.' },
                { name: 'Martial Training', description: 'MEJORA: Competencia en armas marciales, escudos y armaduras medias. El arma sirve de foco mágico.' }
            ],
            6: [{ name: 'Extra Attack', description: 'Atacas dos veces. Puedes cambiar un ataque por el lanzamiento de un Truco.' }],
            14: [{ name: 'Battle Magic', description: 'Tras lanzar un conjuro con tu acción, realiza un ataque con arma como Acción Adicional.' }]
        }
      },
      {
        name: 'College of Glamour',
        description: 'Maestros de la seducción feérica y el asombro.',
        features: {
            3: [
                { name: 'Beguiling Magic', description: 'MAGIA: Charm Person y Mirror Image siempre preparados. Reacción: Encantar/Asustar al lanzar Ilusión/Encantamiento.' },
                { name: 'Mantle of Inspiration', description: 'BA: Otorga THP (2x dado) a aliados y movimiento gratuito sin ataques de oportunidad.' }
            ],
            6: [{ name: 'Mantle of Majesty', description: 'MAGIA: Command siempre preparado. Lánzalo como BA sin gastar espacios durante 1 min.' }],
            14: [{ name: 'Unbreakable Majesty', description: 'BA: Durante 1 min, enemigos deben salvar CHA para poder golpearte.' }]
        }
      },
      {
        name: 'College of Dance',
        description: 'La elegancia del movimiento convertida en arma.',
        features: {
            3: [
                { name: 'Dazzling Footwork', description: 'MEJORA: CA = 10+DEX+CHA. BA: Ataque desarmado usando el dado de Inspiración para el daño.' },
                { name: 'Dance Virtuoso', description: 'Ganas maestría en interpretación de danza.' }
            ],
            6: [
                { name: 'Inspiring Movement', description: 'Reacción: Permite a un aliado moverse gratis cuando un enemigo se acerque.' },
                { name: 'Tandem Footwork', description: 'INICIATIVA: Suma el dado de bardo a la iniciativa propia y de aliados cercanos.' }
            ],
            14: [{ name: 'Leading Evasion', description: 'Evasión compartida con aliados a 5 pies de ti.' }]
        }
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, DEX: 14, CON: 13, WIS: 12, INT: 10, STR: 8 }
};
