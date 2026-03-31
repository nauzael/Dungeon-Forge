
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const paladin = {
  details: { 
    name: 'Paladin', 
    description: 'Guerreros santos unidos por juramentos sagrados para combatir la aniquilación y la corrupción. Son campeones bendecidos capaces de sanar, castigar y proteger.', 
    traits: [
        { name: 'Lay on Hands', description: 'Reserva de sanación (5 x Nivel). Como Acción Adicional, restaura HP o cura el estado Envenenado (gastando 5 puntos).' }, 
        { name: 'Spellcasting', description: 'Magia divina basada en Carisma. Empiezas a lanzar conjuros en nivel 1.' }, 
        { name: 'Weapon Mastery', description: 'Dominas las propiedades de maestría de dos tipos de armas.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['STR', 'CHA', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Lay on Hands', 'Spellcasting', 'Weapon Mastery'], 
    2: ['Fighting Style', 'Paladin\'s Smite'], 
    3: ['Channel Divinity', 'Paladin Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Faithful Steed'], 
    6: ['Aura of Protection'], 
    7: ['Subclass Feature'],
    8: ['Ability Score Improvement'], 
    9: ['Abjure Foes'], 
    10: ['Aura of Courage'], 
    11: ['Radiant Strikes'], 
    12: ['Ability Score Improvement'], 
    14: ['Restoring Touch'], 
    15: ['Subclass Feature'],
    16: ['Ability Score Improvement'], 
    18: ['Aura Expansion'],
    19: ['Epic Boon Feat'], 
    20: ['Subclass Feature'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Oath of Devotion',
        description: 'Paladines dedicados a los ideales de justicia, orden y el caballero de armadura brillante.',
        features: {
            3: [
                { name: 'Sacred Weapon', description: 'Canalizar Divinidad: Como Acción Mágica, imbuyes un arma con energía positiva (10 min). Sumas tu mod. Carisma a las tiradas de ataque y el arma emite luz brillante.' },
                { name: 'Oath of Devotion Spells', description: 'Hechizos siempre preparados como Protección contra el Mal, Escudo de Fe and Auxilio.' }
            ],
            7: [{ name: 'Aura of Devotion', description: 'Tú y tus aliados en tu Aura de Protección sois inmunes a la condición Encantado.' }],
            15: [{ name: 'Smite of Protection', description: 'Tu Castigo Divino radia energía protectora: tú y aliados tenéis Cobertura Media en tu Aura hasta el inicio de tu próximo turno.' }],
            20: [{ name: 'Holy Nimbus', description: 'Acción Adicional (10 min): Emites luz solar, tienes ventaja en salvaciones contra Infernales/No-muertos y los enemigos que empiecen su turno cerca reciben daño Radiante.' }]
        }
    },
    {
        name: 'Oath of Glory',
        description: 'Paladines que creen que ellos y sus compañeros están destinados a alcanzar la gloria mediante actos de heroísmo.',
        features: {
            3: [
                { name: 'Inspiring Smite', description: 'Canalizar Divinidad: Tras usar Castigo Divino, puedes dar THP (2d8 + Nivel Paladín) repartidos entre criaturas a 30 pies.' },
                { name: 'Peerless Athlete', description: 'Canalizar Divinidad: Como Acción Adicional (1 hora), tienes ventaja en Atletismo/Acrobacias y tus saltos aumentan 10 pies.' },
                { name: 'Oath of Glory Spells', description: 'Hechizos como Guiding Bolt, Heroísmo and Haste.' }
            ],
            7: [{ name: 'Aura of Alacrity', description: 'Tu velocidad aumenta 10 pies. Aliados que entren o empiecen su turno en tu Aura ganan +10 pies de velocidad hasta el final de su turno.' }],
            15: [{ name: 'Glorious Defense', description: 'Reacción: Al ser impactado, suma tu mod. Carisma a la CA del objetivo. Si falla el ataque, puedes hacer un ataque contra el atacante.' }],
            20: [{ name: 'Living Legend', description: 'Acción Adicional (1 min): Tienes ventaja en pruebas de Carisma y una vez por turno puedes convertir un fallo en salvación en un éxito mediante Reacción.' }]
        }
    },
    {
        name: 'Oath of the Ancients',
        description: 'Paladines que juran preservar la luz del mundo, deleitándose en el arte, la risa y la naturaleza.',
        features: {
            3: [
                { name: 'Nature\'s Wrath', description: 'Canalizar Divinidad: Como Acción Mágica, invocas enredaderas espectrales para apresar a una criatura a 15 pies (CD Fuerza).' },
                { name: 'Oath of the Ancients Spells', description: 'Hechizos como Ensnaring Strike, Hablar con los Animales and Crecimiento Vegetal.' }
            ],
            7: [{ name: 'Aura of Warding', description: 'Tú y aliados en tu Aura de Protección tenéis Resistencia a daño Necrótico, Psíquico y Radiante.' }],
            15: [{ name: 'Undying Sentinel', description: 'Cuando caigas a 0 HP y no mueras, puedes quedar a 1 HP (1/Long Rest). Dejas de envejecer visiblemente.' }],
            20: [{ name: 'Elder Champion', description: 'Acción Adicional (1 min): Te regeneras 10 HP por turno, tus conjuros de paladín se lanzan como Acción Adicional y los enemigos tienen desventaja en salvaciones.' }]
        }
    },
    {
        name: 'Oath of Vengeance',
        description: 'Un compromiso solemne para castigar a aquellos que han cometido actos malvados graves.',
        features: {
            3: [
                { name: 'Vow of Enmity', description: 'Canalizar Divinidad: Como Acción de Ataque, eliges un enemigo a 30 pies para tener Ventaja en ataques contra él durante 1 minute.' },
                { name: 'Oath of Vengeance Spells', description: 'Hechizos como Bane, Hunter\'s Mark and Hold Person.' }
            ],
            7: [{ name: 'Relentless Avenger', description: 'Al impactar con un ataque de oportunidad, la velocidad del enemigo cae a 0 y puedes moverte media velocidad.' }],
            15: [{ name: 'Soul of Vengeance', description: 'Cuando el objetivo de tu Voto de Enemistad hace un ataque, puedes usar tu reacción para hacer un ataque cuerpo a cuerpo contra él.' }],
            20: [{ name: 'Avenging Angel', description: 'Acción Adicional (10 min): Ganas alas (vuelo 60 pies) y un aura que puede asustar a los enemigos que empiecen su turno cerca de ti.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CHA: 14, CON: 13, WIS: 12, DEX: 10, INT: 8 }
};
