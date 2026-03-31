
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const rogue = {
  details: { 
    name: 'Rogue', 
    description: 'Maestros del sigilo, el ingenio y la precisión. Los pícaros aprovechan las debilidades de sus enemigos para dar golpes letales y son expertos en superar cualquier obstáculo.', 
    traits: [
        { name: 'Sneak Attack', description: 'Una vez por turno, infliges daño extra (1d6 a lvl 1, escala) a una criatura que impactes con Ventaja o que tenga un aliado cerca.' }, 
        { name: 'Expertise', description: 'Eliges dos habilidades para duplicar tu bonificador por competencia.' }, 
        { name: 'Weapon Mastery', description: 'Dominas las propiedades de maestría de dos tipos de armas (Finesse o Light).' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'INT'] as Ability[],
  statPriorities: ['DEX', 'INT', 'CON'] as Ability[],
  skillData: { count: 4, options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] as Skill[] },
  progression: { 
    1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'], 
    2: ['Cunning Action'], 
    3: ['Rogue Subclass', 'Steady Aim'], 
    4: ['Ability Score Improvement'], 
    5: ['Cunning Strike', 'Uncanny Dodge'], 
    6: ['Expertise'],
    7: ['Evasion', 'Reliable Talent'], 
    8: ['Ability Score Improvement'], 
    9: ['Subclass Feature'], 
    10: ['Ability Score Improvement'], 
    11: ['Improved Cunning Strike'], 
    12: ['Ability Score Improvement'], 
    13: ['Subclass Feature'], 
    14: ['Devious Strikes'], 
    15: ['Slippery Mind'], 
    16: ['Ability Score Improvement'], 
    17: ['Subclass Feature'],
    18: ['Elusive'], 
    19: ['Epic Boon Feat'], 
    20: ['Stroke of Luck'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Arcane Trickster',
        description: 'Pícaros que combinan el sigilo y la agilidad con conjuros arcanos, expertos en travesuras y supervivencia.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'Lanzamiento de conjuros basado en Inteligencia (usando la lista de Mago). Ver tabla de conjuros.' },
                { name: 'Mage Hand Legerdemain', description: 'Tu Mano de Mago es invisible. Puedes usarla para robar, usar herramientas de ladrón o abrir cerraduras como Acción Adicional.' }
            ],
            9: [{ name: 'Magical Ambush', description: 'Si estás escondido cuando lanzas un conjuro a una criatura, esta tiene desventaja en la salvación contra ese conjuro.' }],
            13: [{ name: 'Versatile Trickster', description: 'Puedes usar tu Mano de Mago para distraer a un enemigo: como Acción Adicional, elige un enemigo a 5 pies de la mano para usar tus opciones de Cunning Strike.' }],
            17: [{ name: 'Spell Thief', description: 'Como reacción al ser afectado por un conjuro, puedes forzar al lanzador a salvar. Si falla, el conjuro no te afecta y "robas" el conjuro para usarlo tú durante 8 horas.' }]
        }
    },
    {
        name: 'Assassin',
        description: 'Homicidas entrenados, espías y cazarrecompensas que eliminan a sus objetivos con una eficiencia aterradora.',
        features: {
            3: [
                { name: 'Assassinate', description: 'Ventaja en iniciativa. En el primer asalto de combate, tienes ventaja contra criaturas que no hayan actuado y tu Ataque Furtivo inflige daño extra igual a tu nivel.' },
                { name: 'Assassin\'s Tools', description: 'Ganas competencia con el Kit de Disfraz y el Kit de Venenos.' }
            ],
            9: [
                { name: 'Masterful Mimicry', description: 'Puedes imitar perfectamente el habla y la escritura de alguien tras estudiarlo 1 hora.' },
                { name: 'Roving Aim', description: 'Tu velocidad no se reduce a 0 al usar Puntería Firme (Steady Aim).' }
            ],
            13: [{ name: 'Envenom Weapons', description: 'Al usar la opción de veneno de Cunning Strike, infliges 2d6 daño de veneno extra ignorando resistencias.' }],
            17: [{ name: 'Death Strike', description: 'En el primer asalto de combate, al impactar con Ataque Furtivo, el objetivo debe salvar Constitución o recibir el doble de daño.' }]
        }
    },
    {
        name: 'Thief',
        description: 'El arquetipo del aventurero: una mezcla de ladrón, buscador de tesoros y explorador de ruinas.',
        features: {
            3: [
                { name: 'Fast Hands', description: 'Como Acción Adicional puedes realizar la acción de Utilizar (Objeto), Usar un Objeto Mágico o hacer una prueba de Juego de Manos / Herramientas de Ladrón.' },
                { name: 'Second-Story Work', description: 'Ganas velocidad de escalada igual a tu velocidad actual. Saltas usando Destreza en lugar de Fuerza.' }
            ],
            9: [{ name: 'Supreme Sneak', description: 'Ganas la opción Stealth Attack (Cunning Strike): por 1 dado de daño, si estás invisible por Esconderse, el ataque no revela tu posición tras coberturas.' }],
            13: [
                { name: 'Use Magic Device', description: 'Puedes sintonizar hasta 4 objetos mágicos. Al usar un objeto con cargas, con un 6 en 1d6 no gastas la carga. Puedes usar cualquier pergamino de conjuro.' }
            ],
            17: [{ name: 'Thief\'s Reflexes', description: 'Eres tan rápido que tienes dos turnos durante el primer asalto de cualquier combate.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, CON: 14, INT: 13, WIS: 12, CHA: 10, STR: 8 }
};
