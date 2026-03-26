
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const barbarian = {
  details: { 
    name: 'Barbarian', 
    description: 'Guerreros poderosos impulsados por fuerzas primordiales que se manifiestan como Furia. Más que una emoción, esta Furia es la encarnación de la ferocidad de un depredador y la tormenta.', 
    traits: [
        { name: 'Rage', description: 'Como acción adicional, entras en Furia si no llevas armadura pesada. Ganas resistencia a daño físico, daño adicional en ataques de Fuerza y ventaja en pruebas/salvaciones de Fuerza.' }, 
        { name: 'Unarmored Defense', description: 'Sin armadura, tu CA es 10 + DEX + CON. Puedes usar escudo.' }, 
        { name: 'Weapon Mastery', description: 'Dominas las propiedades de maestría de dos tipos de armas cuerpo a cuerpo.' }
    ] 
  } as DetailData,
  hitDie: 12,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] as Skill[] },
  progression: { 
    1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 
    2: ['Danger Sense', 'Reckless Attack'], 
    3: ['Barbarian Subclass', 'Primal Knowledge'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Fast Movement'], 
    7: ['Feral Instinct', 'Instinctive Pounce'],
    8: ['Ability Score Improvement'], 
    9: ['Brutal Strike'], 
    11: ['Relentless Rage'], 
    12: ['Ability Score Improvement'], 
    13: ['Improved Brutal Strike'], 
    15: ['Persistent Rage'], 
    16: ['Ability Score Improvement'], 
    17: ['Improved Brutal Strike (2nd Effect)'],
    18: ['Indomitable Might'], 
    19: ['Epic Boon Feat'], 
    20: ['Primal Champion'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Path of the Berserker', 
        description: 'Bárbaros que canalizan su furia hacia la violencia pura.', 
        features: { 
            3: [{ name: 'Frenzy', description: 'Al usar Ataque Temerario en furia, infliges daño extra igual a dados d6 igual a tu bono de daño de furia al primer objetivo impactado.' }],
            6: [{ name: 'Mindless Rage', description: 'Inmunidad a Encantado y Asustado mientras estás en furia. Si entras en furia mientras estás afectado, el efecto se suspende.' }],
            10: [{ name: 'Retaliation', description: 'Cuando recibes daño de una criatura a 5 pies, usa tu reacción para realizar un ataque cuerpo a cuerpo contra ella.' }],
            14: [{ name: 'Intimidating Presence', description: 'Como Acción Adicional, asusta a criaturas en un área de 30 pies (CD 8+STR+PB). Dura 1 minuto.' }]
        } 
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Creyentes de que su furia los vincula con el fresno cósmico Yggdrasil.', 
        features: { 
            3: [{ name: 'Vitality of the Tree', description: 'Ganas THP (dados d6 = PB) al entrar en furia y puedes otorgar THP a aliados al inicio de cada turno.' }],
            6: [{ name: 'Branches of the Tree', description: 'Mientras estás en furia, puedes teletransportar criaturas a 30 pies de ti mediante una reacción (CD STR).' }],
            10: [{ name: 'Battering Roots', description: 'Tus armas pesadas o versátiles ganan +10 pies de alcance. Puedes usar Empujar o Derribar además de otra maestría.' }],
            14: [{ name: 'Travel along the Tree', description: 'Acción adicional para teletransportarte hasta 60 pies y llevar hasta 5 aliados contigo.' }]
        } 
    },
    { 
        name: 'Path of the Wild Heart', 
        description: 'Bárbaros en comunión con los espíritus de la naturaleza.', 
        features: { 
            3: [
                { name: 'Animal Speaker', description: 'Puedes lanzar Sentido Bestial y Hablar con los Animales como rituales (USA WIS).' },
                { name: 'Rage of the Wilds', description: 'En furia elige: Oso (Resistencia a casi todo), Águila (BA Dash/Disengage), o Lobo (Ventaja aliados).' }
            ],
            6: [{ name: 'Aspect of the Wilds', description: 'Mejora pasiva: Búho (Darkvision 60ft), Pantera (Vel. Escalada), o Salmón (Vel. Nado).' }],
            10: [{ name: 'Nature Speaker', description: 'Puedes lanzar Comulgar con la Naturaleza como ritual.' }],
            14: [{ name: 'Power of the Wilds', description: 'Mejora de furia: Halcón (Vuelo), León (Desventaja ataques enemigos), o Carnero (Derribar al impactar).' }]
        } 
    },
    {
        name: 'Path of the Zealot',
        description: 'Bárbaros bendecidos por un dios con poder divino.',
        features: {
            3: [
                { name: 'Divine Fury', description: 'En furia, el primer impacto de cada turno inflige 1d6 + mitad nivel daño Radiante o Necrótico.' },
                { name: 'Warrior of the Gods', description: 'Reserva de curación (4d12). Como Acción Adicional, te curas a ti mismo. Se recupera en Descanso Largo.' }
            ],
            6: [
                { name: 'Fanatical Focus', description: 'Una vez por furia, repite una salvación fallida sumando tu daño de furia como bono.' }
            ],
            10: [
                { name: 'Zealous Presence', description: 'Grito de batalla (10 aliados): Ventaja en ataques y salvaciones hasta tu próximo turno.' }
            ],
            14: [
                { name: 'Rage of the Gods', description: 'Forma divina (1 min): Vuelo, Resistencias Necrótico/Radiante/Psíquico y puedes salvar a un aliado de la muerte.' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, INT: 8 }
};
