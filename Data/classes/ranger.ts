
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const ranger = {
  details: { 
    name: 'Ranger', 
    description: 'Guerreros de la naturaleza que vigilan las fronteras de la civilización. Combinan el combate letal, el rastreo y la magia primordial para proteger el mundo de monstruos y tiranos.', 
    traits: [
        { name: 'Spellcasting', description: 'Magia primordial basada en Sabiduría. Eres un lanzador de conjuros preparados.' }, 
        { name: 'Favored Enemy', description: 'Siempre tienes preparado Hunter\'s Mark. Puedes lanzarlo gratis varias veces al día.' }, 
        { name: 'Weapon Mastery', description: 'Dominas las propiedades de maestría de dos tipos de armas.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 3, options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'], 
    2: ['Deft Explorer', 'Fighting Style'], 
    3: ['Ranger Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack'], 
    6: ['Roving'],
    7: ['Subclass Feature'],
    8: ['Ability Score Improvement'], 
    9: ['Expertise'], 
    10: ['Tireless'], 
    11: ['Subclass Feature'],
    12: ['Ability Score Improvement'], 
    13: ['Relentless Hunter'], 
    14: ['Nature\'s Veil'], 
    15: ['Subclass Feature'],
    16: ['Ability Score Improvement'], 
    17: ['Precise Hunter'], 
    18: ['Feral Senses'], 
    19: ['Epic Boon Feat'], 
    20: ['Foe Slayer'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Beast Master',
        description: 'Exploradores que forman un vínculo místico con una bestia especial, recurriendo a la magia primordial para luchar en armonía.',
        features: {
            3: [{ name: 'Primal Companion', description: 'Invocas un espíritu bestial (Tierra, Mar o Aire). En combate, actúa en tu turno y obedece tus órdenes (Acción Adicional para mandar atacar).' }],
            7: [{ name: 'Exceptional Training', description: 'Puedes ordenar a tu bestia que use Dash, Disengage, Dodge or Help como Acción Adicional. Sus ataques ahora pueden infligir daño de Fuerza.' }],
            11: [{ name: 'Bestial Fury', description: 'Tu bestia puede atacar dos veces. Además, inflige daño extra (igual al de Hunter\'s Mark) si el objetivo está marcado por ti.' }],
            15: [{ name: 'Share Spells', description: 'Cuando lanzas un conjuro sobre ti mismo, también puedes afectar a tu bestia si está a 30 pies.' }]
        }
    },
    {
        name: 'Fey Wanderer',
        description: 'Exploradores que representan la alegría y el pavor de las tierras feéricas, imbuyendo sus ataques con magia de otro mundo.',
        features: {
            3: [
                { name: 'Dreadful Strike', description: 'Una vez por turno, al golpear con weapon, infliges 1d4 de daño Psíquico extra. El dado escala con el nivel.' },
                { name: 'Otherworldly Glamour', description: 'Ganas un bono a las pruebas de Carisma igual a tu modificador de Sabiduría.' }
            ],
            7: [{ name: 'Beguiling Twist', description: 'Cuando alguien cerca de ti supera una salvación contra Encantado o Asustado, puedes intentar redirigir el efecto a otra criatura.' }],
            11: [{ name: 'Fey Wilds Summons', description: 'Puedes lanzar Summon Fey sin gastar espacio de conjuro una vez al día.' }],
            15: [{ name: 'Misty Wanderer', description: 'Puedes lanzar Misty Step varias veces sin gastar espacio y puedes llevar a un aliado contigo.' }]
        }
    },
    {
        name: 'Gloom Stalker',
        description: 'Maestros de la emboscada y la oscuridad, recurriendo a la magia del Shadowfell para cazar a los horrores que acechan en las sombras.',
        features: {
            3: [
                { name: 'Dread Ambusher', description: '+10 pies de velocidad en el primer turno. Puedes infligir 2d6 daño Psíquico extra (Sab usos/día). Sumas Sabiduría a Iniciativa.' },
                { name: 'Umbral Sight', description: 'Visión en la oscuridad 60 pies (o +60 si ya tienes). Eres Invisible para criaturas que usen Visión en la oscuridad en oscuridad total.' },
                { name: 'Gloom Stalker Spells', description: 'Hechizos como Disguise Self, Rope Trick and Fear.' }
            ],
            7: [{ name: 'Iron Mind', description: 'Ganas competencia en tiradas de salvación de Sabiduría (o Inteligencia/Carisma si ya la tenías).' }],
            11: [{ name: 'Stalker\'s Flurry', description: 'El daño de Dreadful Strike sube a 2d8. Si fallas un ataque tras usarlo, puedes hacer otro ataque como parte de la misma acción.' }],
            15: [{ name: 'Shadowy Dodge', description: 'Reacción: Impones Desventaja a un atacante que veas. Si el ataque falla, puedes teletransportarte 30 pies.' }]
        }
    },
    {
        name: 'Hunter',
        description: 'Cazadores definitivos, expertos en rastrear y derrotar a las presas más formidables de la naturaleza.',
        features: {
            3: [
                { name: 'Hunter\'s Lore', description: 'Mientras un enemigo está marcado por Hunter\'s Mark, conoces sus inmunidades, resistencias y vulnerabilidades.' },
                { name: 'Hunter\'s Prey', description: 'Elige una especialidad (intercambiable en descanso largo): Colossus Slayer (+1d8 daño a heridos) o Horde Breaker (ataque extra a objetivo adyacente).' }
            ],
            7: [{ name: 'Defensive Tactics', description: 'Elige (intercambiable): Escape the Horde (desventaja a ataques de op.) o Multiattack Defense (+4 CA tras ser golpeado).' }],
            11: [{ name: 'Superior Hunter\'s Prey', description: 'Una vez por turno, cuando dañas al objetivo de tu Hunter\'s Mark, puedes infligir el daño extra a otra criatura a 30 pies.' }],
            15: [{ name: 'Superior Hunter\'s Defense', description: 'Reacción: Al recibir daño, ganas Resistencia a ese daño y cualquier otro daño del mismo tipo hasta el final del turno.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, INT: 10, CHA: 8 }
};
