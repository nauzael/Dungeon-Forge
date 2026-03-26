
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const cleric = {
  details: { 
    name: 'Cleric', 
    description: 'Los clérigos extraen power de los reinos de los dioses y lo aprovechan para obrar milagros. Son conductos de la magia divina de los Planos Exteriores.', 
    traits: [
        { name: 'Spellcasting', description: 'Magia divina basada en Sabiduría. Eres un lanzador de conjuros preparados.' }, 
        { name: 'Divine Order', description: 'Has dedicado tu vida a un rol sagrado: Protector (competencia con armas marciales y armaduras pesadas) o Taumaturgo (truco extra y bono a Religión/Arcana).' }, 
        { name: 'Channel Divinity', description: 'Capacidad de canalizar energía divina para efectos mágicos como Turn Undead o Divine Spark.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['WIS', 'CON', 'STR'] as Ability[],
  skillData: { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Divine Order'], 
    2: ['Channel Divinity'], 
    3: ['Cleric Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Sear Undead'], 
    6: ['Subclass Feature'],
    7: ['Blessed Strikes'],
    8: ['Ability Score Improvement'], 
    10: ['Divine Intervention'], 
    12: ['Ability Score Improvement'], 
    14: ['Improved Blessed Strikes'], 
    16: ['Ability Score Improvement'], 
    17: ['Subclass Feature'],
    18: ['Channel Divinity Upgrade'],
    19: ['Epic Boon Feat'], 
    20: ['Greater Divine Intervention'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Life Domain', 
        description: 'El Dominio de la Vida se centra en la energía positiva que sostiene toda la vida.', 
        features: { 
            3: [
                { name: 'Disciple of Life', description: 'Al curar con un conjuro, el objetivo recupera HP extra igual a 2 + el nivel del espacio gastado.' },
                { name: 'Preserve Life', description: 'Canalizar Divinidad: Como acción mágica, cura HP igual a 5 veces tu nivel a criaturas a 30 pies (máximo hasta la mitad de su vida).' }
            ],
            6: [{ name: 'Blessed Healer', description: 'Al curar a otros, también te curas a ti mismo (2 + nivel del conjuro).' }],
            17: [{ name: 'Supreme Healing', description: 'Usas el máximo valor posible para cualquier dado de curación.' }]
        } 
    },
    { 
        name: 'Light Domain', 
        description: 'Enfocado en la visión, la verdad y el fuego purificador.', 
        features: { 
            3: [
                { name: 'Radiance of the Dawn', description: 'Canalizar Divinidad: Crea un destello en un área de 30 pies que inflige 2d10 + nivel de clérigo de daño Radiante (CD CON).' },
                { name: 'Warding Flare', description: 'Reacción: Impone Desventaja a un atacante que puedas ver a 30 pies (usos igual a mod. Sabiduría).' }
            ],
            6: [{ name: 'Improved Warding Flare', description: 'Recuperas usos de Warding Flare con descanso corto. Al usarlo, otorgas THP (2d6 + mod Sab) al objetivo atacado.' }],
            17: [{ name: 'Corona of Light', description: 'Como acción mágica, emites una aura de luz solar (1 min): Los enemigos tienen Desventaja en salvaciones vs luz/fuego.' }]
        } 
    },
    { 
        name: 'Trickery Domain', 
        description: 'Dioses de la travesura, el cambio y la ilusión.', 
        features: { 
            3: [
                { name: 'Blessing of the Trickster', description: 'Acción Mágica: Das Ventaja en Sigilo a una criatura (que no seas tú) hasta tu próximo descanso largo.' },
                { name: 'Invoke Duplicity', description: 'Acción Adicional: Crea una ilusión de ti mismo a 30 pies. Ganas Ventaja en ataques contra enemigos cerca de la ilusión.' }
            ],
            6: [{ name: 'Trickster\'s Transposition', description: 'Al crear o mover tu duplicado, puedes teletransportarte intercambiando sitio con él.' }],
            17: [{ name: 'Improved Duplicity', description: 'Tu duplicado da Ventaja a aliados cercanos. Al desaparecer, te cura HP igual a tu nivel.' }]
        } 
    },
    { 
        name: 'War Domain', 
        description: 'Excelencia en el combate e inspiración del coraje en la batalla.', 
        features: { 
            3: [
                { name: 'Guided Strike', description: 'Reacción: Al fallar un ataque (tuyo o de aliado), suma +10 a la tirada usando Canalizar Divinidad.' },
                { name: 'War Priest', description: 'Acción Adicional: Haz un ataque extra (usos igual a mod. Sabiduría, recuperas con descanso largo).' }
            ],
            6: [{ name: 'War God\'s Blessing', description: 'Puedes gastar Canalizar Divinidad para lanzar Escudo de Fe o Arma Espiritual sin gastar espacio ni requerir concentración (dura 1 min).' }],
            17: [{ name: 'Avatar of Battle', description: 'Ganas Resistencia a daño Contundente, Perforante y Cortante.' }]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, STR: 13, INT: 12, DEX: 10, CHA: 8 }
};
