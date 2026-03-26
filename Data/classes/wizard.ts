
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const wizard = {
  details: { 
    name: 'Wizard', 
    description: 'Los magos se definen por su estudio exhaustivo de los entresijos de la magia. Lanzan hechizos de fuego explosivo, rayos arqueados, sutil engaño y transformaciones espectaculares.', 
    traits: [
        { name: 'Spellcasting', description: 'Magia arcana basada en Inteligencia. Utilizas un libro de conjuros y eres un lanzador de conjuros preparados.' }, 
        { name: 'Ritual Adept', description: 'Puedes lanzar cualquier hechizo como un Ritual si tiene la etiqueta Ritual y está en tu libro de conjuros. No necesitas tenerlo preparado.' }, 
        { name: 'Arcane Recovery', description: 'Puedes recuperar parte de tu energía mágica estudiando tu libro de conjuros durante un Descanso Corto. (1/Descanso Largo).' }
    ] 
  } as DetailData,
  hitDie: 6,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['INT', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Ritual Adept', 'Arcane Recovery'], 
    2: ['Scholar'], 
    3: ['Wizard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Memorize Spell'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    18: ['Spell Mastery'], 
    19: ['Epic Boon Feat'], 
    20: ['Signature Spells'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'Abjurer', 
        description: 'Especialistas en magia que bloquea, destierra o protege.', 
        features: { 
            3: [
                { name: 'Abjuration Savant', description: 'Elige dos conjuros de la escuela de Abjuración de nivel 2 o menor y añádelos a tu libro gratis. Además, cada vez que ganes acceso a un nuevo nivel de espacios, añade otro conjuro de Abjuración gratis.' },
                { name: 'Arcane Ward', description: 'Al lanzar un conjuro de Abjuración con espacio, creas un escudo mágico. HP Máx = (2 x Nivel Mago) + Mod. INT. Absorbe daño antes que tú. Recupera HP al lanzar Abjuraciones.' }
            ],
            6: [{ name: 'Projected Ward', description: 'Reacción: Cuando una criatura a 30 pies reciba daño, tu Arcane Ward absorbs ese daño en su lugar.' }],
            10: [
                { name: 'Spell Breaker', description: 'Siempre tienes preparados Contrahechizo and Disipar Magia. Puedes lanzar Disipar Magia como Acción Adicional y añades tu Competencia a la prueba. Si fallas en detener un hechizo, no gastas el espacio.' }
            ],
            14: [{ name: 'Spell Resistance', description: 'Tienes Ventaja en salvaciones contra hechizos y Resistencia al daño de los mismos.' }]
        } 
      },
      { 
        name: 'Diviner', 
        description: 'Buscadores de una comprensión más clara del pasado, presente y futuro.', 
        features: { 
            3: [
                { name: 'Divination Savant', description: 'Elige dos conjuros de Adivinación de nivel 2 o menor para tu libro. Gana uno extra cada vez que desbloquees nuevos niveles de espacios de conjuro.' },
                { name: 'Portent', description: 'Al terminar un Descanso Largo, tira dos d20 y anota los resultados. Puedes sustituir cualquier tirada de d20 que veas por uno de estos resultados (1/turno).' }
            ],
            6: [{ name: 'Expert Divination', description: 'Al lanzar un conjuro de Adivinación de nivel 2+, recuperas un espacio de conjuro de nivel inferior (máximo nivel 5).' }],
            10: [{ name: 'The Third Eye', description: 'Acción Adicional: Elige un beneficio hasta tu próximo descanso (Visión en la Oscuridad 120ft, Leer todos los idiomas o ver lo Invisible sin gastar espacio).' }],
            14: [{ name: 'Greater Portent', description: 'Tiras tres d20 para tu rasgo de Portento en lugar de dos.' }]
        } 
      },
      { 
        name: 'Evoker', 
        description: 'Maestros de la energía destructiva pura.', 
        features: { 
            3: [
                { name: 'Evocation Savant', description: 'Elige dos conjuros de Evocación de nivel 2 o menor para tu libro. Gana uno extra al subir de nivel de espacios de conjuro.' },
                { name: 'Potent Cantrip', description: 'Tus trucos dañinos afectan incluso a quienes evitan el impacto. Si fallan la salvación o el ataque falla, reciben la mitad del daño del truco.' }
            ],
            6: [{ name: 'Sculpt Spells', description: 'Crea bolsas de seguridad en tus evocaciones de área. Elige (1 + Nivel Conjuro) criaturas; superan la salvación automáticamente y no reciben daño.' }],
            10: [{ name: 'Empowered Evocation', description: 'Suma tu modificador de Inteligencia a una tirada de daño de tus conjuros de Evocación.' }],
            14: [{ name: 'Overchannel', description: 'Aumenta el power de tus conjuros de nivel 1-5 para infligir el máximo daño posible. El primer uso es seguro; los siguientes te infligen daño Necrótico (2d12 por nivel de espacio).' }]
        } 
      },
      { 
        name: 'Illusionist', 
        description: 'Especialistas en engañar los sentidos y la mente.', 
        features: { 
            3: [
                { name: 'Illusion Savant', description: 'Elige dos conjuros de Ilusión de nivel 2 o menor para tu libro. Gana uno extra al subir de nivel de espacios de conjuro.' },
                { name: 'Improved Illusions', description: 'Lanzas Ilusiones sin componentes Verbales. Si el hechizo tiene rango 10ft+, el rango aumenta 60ft. Aprendes Ilusión Menor y puedes crear sonido e imagen a la vez como Acción Adicional.' }
            ],
            6: [{ name: 'Phantasmal Creatures', description: 'Siempre tienes preparados Summon Beast and Summon Fey. Al lanzarlos, puedes cambiar su escuela a Ilusión y lanzarlos sin gastar espacio (con la mitad de HP).' }],
            10: [{ name: 'Illusory Self', description: 'Reacción: Interpones un duplicado ante un ataque, haciendo que falle automáticamente. 1/Descanso corto o largo (o gasta espacio nivel 2+).' }],
            14: [{ name: 'Illusory Reality', description: 'Acción Adicional: Eliges un objeto inanimado de una de tus ilusiones y lo haces real durante 1 minuto (no puede hacer daño).' }]
        } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { INT: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, STR: 8 }
};
