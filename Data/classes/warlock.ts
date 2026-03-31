
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const warlock = {
  details: { 
    name: 'Warlock', 
    description: 'Buscadores de conocimientos ocultos que forjan pactos con entidades poderosas. Los brujos combinan magia de corto alcance con invocaciones místicas que alteran su realidad.', 
    traits: [
        { name: 'Eldritch Invocations', description: 'Fragmentos de conocimiento prohibido que te otorgan habilidades mágicas permanentes. Ganas una a nivel 1 (como Pact of the Tome).' }, 
        { name: 'Pact Magic', description: 'Magia única basada en Carisma. Tus espacios de conjuro son siempre del máximo nivel que puedes lanzar y se recuperan con descansos cortos.' }, 
        { name: 'Magical Cunning', description: 'Acción (1 min): Recuperas la mitad de tus espacios de Pact Magic (redondeado hacia arriba). 1/Descanso Largo.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Eldritch Invocations', 'Pact Magic'], 
    2: ['Magical Cunning'], 
    3: ['Warlock Subclass'], 
    4: ['Ability Score Improvement'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    9: ['Contact Patron'], 
    10: ['Subclass Feature'], 
    11: ['Mystic Arcanum (Level 6)'], 
    12: ['Ability Score Improvement'], 
    13: ['Mystic Arcanum (Level 7)'], 
    14: ['Subclass Feature'], 
    15: ['Mystic Arcanum (Level 8)'], 
    16: ['Ability Score Improvement'], 
    17: ['Mystic Arcanum (Level 9)'], 
    19: ['Epic Boon Feat'], 
    20: ['Eldritch Master'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Archfey Patron',
        description: 'Pacto con un noble de la Corte Feérica, maestros de la ilusión y el teletransporte juguetón.',
        features: {
            3: [
                { name: 'Archfey Spells', description: 'Hechizos siempre preparados como Misty Step, Faerie Fire, Sleep and Calm Emotions. Más a niveles 5, 7 y 9.' },
                { name: 'Steps of the Fey', description: 'Puedes lanzar Misty Step gratis un número de veces igual a tu mod. Carisma. Al usarlo, eliges un efecto: Refreshing Step (THP) o Taunting Step (Desventaja para enemigos).' }
            ],
            6: [{ name: 'Misty Escape', description: 'Reacción al recibir daño: Te vuelves Invisible y te teletransportas 30 pies. Ganas los beneficios de Steps of the Fey al hacerlo.' }],
            10: [{ name: 'Beguiling Defenses', description: 'Inmunidad a Encantado. Reacción al ser impactado: Reduces el daño a la mitad y el atacante debe salvar Sabiduría o recibir daño Psíquico.' }],
            14: [{ name: 'Bewitching Magic', description: 'Al lanzar un conjuro de Ilusión o Encantamiento, puedes lanzar Misty Step como parte de la misma acción sin gastar espacio.' }]
        }
    },
    {
        name: 'Celestial Patron',
        description: 'Tu patrón es un ser de los planos superiores, una entidad de luz purificadora y esperanza eterna.',
        features: {
            3: [
                { name: 'Celestial Spells', description: 'Hechizos como Cure Wounds, Guiding Bolt, Lesser Restoration and Daylight.' },
                { name: 'Healing Light', description: 'Reserva de d6s (1 + Nivel Brujo). Acción Adicional: Gasta dados (máx mod CHA) para curar a una criatura a 60 pies.' }
            ],
            6: [{ name: 'Radiant Soul', description: 'Resistencia a daño Radiante. Sumas Carisma al daño de un conjuro que inflija daño Radiante o de Fuego.' }],
            10: [{ name: 'Celestial Resilience', description: 'Al terminar un descanso o usar Magical Cunning, tú y hasta 5 aliados ganáis THP (Nivel + mod CHA).' }],
            14: [{ name: 'Searing Vengeance', description: 'Reacción al tirar salvación de muerte: Te levantas con medio HP, infliges daño Radiante (2d8+CHA) y ciegas a enemigos cercanos.' }]
        }
    },
    {
        name: 'Fiend Patron',
        description: 'Has forjado un pacto con un demonio o diablo, otorgándote poder destructivo y resiliencia infernal.',
        features: {
            3: [
                { name: 'Fiend Spells', description: 'Hechizos como Burning Hands, Command, Scorching Ray and Fireball.' },
                { name: 'Dark One\'s Blessing', description: 'Al reducir a un enemigo a 0 HP (tú o alguien a 10 pies), ganas THP igual a Nivel Brujo + mod Carisma.' }
            ],
            6: [{ name: 'Dark One\'s Own Luck', description: 'Suma 1d10 a una prueba de habilidad o salvación. 1/Descanso Largo o gasta espacio de Pact Magic.' }],
            10: [{ name: 'Fiendish Resilience', description: 'Elige un tipo de daño (no Fuerza) al terminar un descanso para ganar Resistencia a él hasta el próximo descanso.' }],
            14: [{ name: 'Hurl Through Hell', description: 'Al impactar con ataque: Envías al objetivo a los planos inferiores. Desaparece hasta el final de tu turno y recibe 8d10 daño Psíquico (si no es un Infernal).' }]
        }
    },
    {
        name: 'Great Old One Patron',
        description: 'Tu patrón es una entidad insondable de los reinos lejanos, cuya sola presencia altera la cordura.',
        features: {
            3: [
                { name: 'Great Old One Spells', description: 'Hechizos como Dissonant Whispers, Tasha\'s Hideous Laughter and Detect Thoughts.' },
                { name: 'Awakened Mind', description: 'Telepatía a 30 pies con una criatura durante Nivel Brujo minutos. Puedes hablar mentalmente a millas de distancia si ya hay vínculo.' },
                { name: 'Psychic Spells', description: 'Puedes cambiar el daño de tus conjuros de brujo a Psíquico. Los conjuros de Ilusión/Encantamiento no requieren componentes Verbales/Somáticos.' }
            ],
            6: [{ name: 'Clairvoyant Combatant', description: 'Usando Awakened Mind, puedes forzar salvación de Sabiduría: El objetivo tiene Desventaja en ataques contra ti y tú tienes Ventaja contra él.' }],
            10: [
                { name: 'Eldritch Hex', description: 'Al lanzar Hex, el objetivo tiene Desventaja en tiradas de salvación de la característica elegida.' },
                { name: 'Thought Shield', description: 'Resistencia a daño Psíquico y reflejas el daño psíquico recibido al atacante.' }
            ],
            14: [{ name: 'Create Thrall', description: 'Siempre tienes preparado Summon Aberration. Puedes lanzarlo sin componentes y sin concentración durante 1 minute con THP extra.' }]
        }
    },
    {
        name: 'Vestige Patron',
        description: 'Tu pacto es con un vestigio, los restos de un dios moribundo que busca recuperar su poder a través de ti.',
        features: {
            3: [
                { name: 'Vestige Companion', description: 'Invoca un Vestigio (Celestial, Infernal o No-Muerto) que actúa en tu turno. Tiene su propio bloque de estadísticas que escala con tu nivel de Brujo.' },
                { name: 'Vestige Spells', description: 'Elige un Dominio de Clérigo (Vida, Luz, Engaño o Guerra) para tener sus conjuros siempre preparados como conjuros de Brujo.' }
            ],
            6: [{ name: 'Vestige Recovery', description: 'Tu Vestigio recupera el uso de su Poder Divino al finalizar un descanso corto o largo, o al usar tu Astucia Mágica.' }],
            10: [{ name: 'Aura of Power', description: 'Como Acción Mágica, el Vestigio emite un aura de 30 pies (Resistencia a Fuego, Necrótico y Radiante; inmunidad a Encantamiento y Miedo). Si caes a 0 HP en el aura, quedas a 1 HP.' }],
            14: [{ name: 'Semblance of Life', description: 'Como Acción Mágica, el Vestigio adopta temporalmente una forma más poderosa (Summon Celestial, Fiend o Undead) sin requerir concentración.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};
