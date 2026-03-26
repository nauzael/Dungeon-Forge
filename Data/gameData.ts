import { Trait } from '../types';

export const METAMAGIC_ES: Trait[] = [
    { name: 'Conjuro Cuidadoso', description: '(1 Punto de Hechicería) Cuando lanzas un conjuro que obliga a otras criaturas a realizar una tirada de salvación, puedes proteger a algunas de ellas. Elige un número de criaturas hasta tu modificador de Carisma (mín. 1). Una criatura elegida tiene éxito automáticamente en su tirada de salvación, y no recibe daño si normalmente recibiría la mitad con un éxito.' },
    { name: 'Conjuro Distante', description: '(1 Punto de Hechicería) Cuando lanzas un conjuro con un alcance de al menos 5 pies, puedes gastar 1 Punto de Hechicería para duplicar el alcance. O cuando lanzas un conjuro con un alcance de Toque, puedes hacer que el alcance sea de 30 pies.' },
    { name: 'Conjuro Potenciado', description: '(1 Punto de Hechicería) Al tirar el daño de un conjuro, puedes gastar 1 Punto de Hechicería para volver a tirar un número de dados de daño hasta tu modificador de Carisma (mín. 1). Debes usar las nuevas tiradas. Puedes usar este efecto incluso si ya has usado otra opción de Metamagia.' },
    { name: 'Conjuro Extendido', description: '(1 Punto de Hechicería) Cuando lanzas un conjuro con una duración de 1 minuto o más, puedes gastar 1 Punto de Hechicería para duplicar su duración (máx. 24 horas). Si el conjuro requiere Concentración, tienes Ventaja en las tiradas para mantenerla.' },
    { name: 'Conjuro Elevado', description: '(2 Puntos de Hechicería) Cuando lanzas un conjuro que obliga a una criatura a realizar una tirada de salvación, puedes gastar 2 Puntos de Hechicería para dar a un objetivo del conjuro Desventaja en las tiradas contra ese conjuro.' },
    { name: 'Conjuro Acelerado', description: '(2 Puntos de Hechicería) Cambia el tiempo de lanzamiento de un conjuro de una Acción a una Acción Adicional. No puedes hacerlo si ya has lanzado un conjuro de nivel 1+ en el mismo turno, ni puedes hacerlo después.' },
    { name: 'Conjuro Buscador', description: '(1 Punto de Hechicería) Si fallas un ataque de conjuro, puedes gastar 1 Punto de Hechicería para volver a tirar el d20, y debes usar la nueva tirada. Puedes usarlo incluso si ya has usado otra opción de Metamagia.' },
    { name: 'Conjuro Sutil', description: '(1 Punto de Hechicería) Lanza un conjuro sin componentes Verbales o Somáticos.' },
    { name: 'Conjuro Transmutado', description: '(1 Punto de Hechicería) Cambia el tipo de daño de un conjuro de Ácido, Frío, Fuego, Relámpago, Veneno o Trueno a otro de esa lista.' },
    { name: 'Conjuro Duplicado', description: '(1 Punto de Hechicería) Cuando lanzas un conjuro que puede fijar un objetivo adicional al usar un espacio de nivel superior, puedes gastar 1 Punto de Hechicería para aumentar el nivel efectivo del conjuro en 1.' },
];

export const METAMAGIC_EN: Trait[] = [
    { name: 'Careful Spell', description: '(1 Sorcery Point) When you cast a spell that forces other creatures to make a saving throw, you can protect some of them. Choose a number of creatures up to your Charisma modifier (min 1). A chosen creature automatically succeeds on its saving throw, and it takes no damage if it would normally take half damage on a successful save.' },
    { name: 'Distant Spell', description: '(1 Sorcery Point) When you cast a spell that has a range of at least 5 feet, you can spend 1 Sorcery Point to double the range. Or when you cast a spell with a range of Touch, you can make the range 30 feet.' },
    { name: 'Empowered Spell', description: '(1 Sorcery Point) When you roll damage for a spell, you can spend 1 Sorcery Point to reroll a number of the damage dice up to your Charisma modifier (min 1). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option.' },
    { name: 'Extended Spell', description: '(1 Sorcery Point) When you cast a spell with a duration of 1 minute or longer, you can spend 1 Sorcery Point to double its duration (max 24 hours). If the affected spell requires Concentration, you have Advantage on any saving throw you make to maintain it.' },
    { name: 'Heightened Spell', description: '(2 Sorcery Points) When you cast a spell that forces a creature to make a saving throw, you can spend 2 Sorcery Points to give one target of the spell Disadvantage on saves against the spell.' },
    { name: 'Quickened Spell', description: '(2 Sorcery Points) Change the casting time of a spell from an Action to a Bonus Action. You can\'t modify a spell in this way if you have already cast a level 1+ spell on the current turn, nor can you cast a level 1+ spell on this turn after modifying a spell in this way.' },
    { name: 'Seeking Spell', description: '(1 Sorcery Point) If you make an attack roll for a spell and miss, you can spend 1 Sorcery Point to reroll the d20, and you must use the new roll. You can use Seeking Spell even if you have already used a different Metamagic option.' },
    { name: 'Subtle Spell', description: '(1 Sorcery Point) Cast a spell without any Verbal, Somatic, or Material components (unless the Material components are consumed by the spell or have a cost specified).' },
    { name: 'Transmuted Spell', description: '(1 Sorcery Point) Change the damage type of a spell from Acid, Cold, Fire, Lightning, Poison, or Thunder to another from that list.' },
    { name: 'Twinned Spell', description: '(1 Sorcery Point) When you cast a spell that can be cast with a higher-level spell slot to target an additional creature, you can spend 1 Sorcery Point to increase the spell\'s effective level by 1.' },
];

export const INVOCATIONS_ES: (Trait & { level?: number, repeatable?: boolean })[] = [
    { name: 'Explosión Agonizante', description: 'Elige un truco de brujo que inflija daño. Añade tu modificador de Carisma al daño de ese truco. Repetible.', level: 1, repeatable: true },
    { name: 'Armadura de Sombras', description: 'Puedes lanzar Armadura de Mago sobre ti mismo a voluntad, sin gastar espacios ni componentes.', level: 1 },
    { name: 'Paso Ascendente', description: 'Puedes lanzar Levitar sobre ti mismo a voluntad, sin gastar espacios ni componentes.', level: 9 },
    { name: 'Habla de las Bestias', description: 'Puedes lanzar Hablar con los Animales a voluntad, sin gastar espacios.', level: 1 },
    { name: 'Influencia Seductora', description: 'Ganas competencia en Engaño y Persuasión.', level: 1 },
    { name: 'Vista del Diablo', description: 'Puedes ver normalmente en la oscuridad, tanto mágica como no mágica, hasta 120 pies.', level: 1 },
    { name: 'Mente Mística', description: 'Tienes Ventaja en las tiradas de salvación de Constitución para mantener la Concentración.', level: 1 },
    { name: 'Castigo Místico', description: 'Una vez por turno al golpear con tu Arma del Pacto, puedes gastar un espacio de brujo para infligir 1d8 extra de daño de Fuerza, más 1d8 por nivel del espacio, y puedes derribar al objetivo.', level: 5 },
    { name: 'Lanza Mística', description: 'Cuando lanzas un truco de brujo con alcance de 10 pies o más, su alcance es de 300 pies.', level: 1 },
    { name: 'Ojos del Guardián rúnico', description: 'Puedes leer toda la escritura.', level: 1 },
    { name: 'Vigor Siniestro', description: 'Puedes lanzar Falsa Vida a voluntad como nivel 1 sobre ti mismo, sin gastar espacios.', level: 1 },
    { name: 'Mirada de Dos Mentes', description: 'Usa tu acción para tocar a un humanoide voluntario y percibir a través de sus sentidos. Mientras la conexión esté activa, puedes lanzar hechizos como si estuvieras en su espacio (usando tus propios sentidos o los suyos). 1/descanso largo.', level: 1 },
    { name: 'Regalo de las Profundidades', description: 'Puedes respirar bajo el agua y ganas velocidad de nado igual a tu velocidad a pie. Puedes lanzar Respiración Acuática una vez gratis.', level: 5 },
    { name: 'Regalo de los Protectores', description: 'Página especial en tu Libro de las Sombras. Si una criatura escribe su nombre, cuando caiga a 0 PG, cae a 1 en su lugar (una vez por descanso largo).', level: 9 },
    { name: 'Lecciones de los Primeros', description: 'Ganas una dote de Origen de tu elección. Repetible.', level: 2, repeatable: true },
    { name: 'Succiona-vida', description: 'Cuando golpeas con tu Arma del Pacto, infliges daño necrótico extra igual a tu modificador de Carisma y recuperas esa misma cantidad de HP.', level: 9 },
    { name: 'Máscara de Muchas Caras', description: 'Puedes lanzar Disfrazarse a voluntad, sin gastar espacios.', level: 1 },
    { name: 'Maestro de las Mil Formas', description: 'Puedes lanzar Alterar el Propio Aspecto a voluntad, sin gastar espacios.', level: 15 },
    { name: 'Visiones Brumosas', description: 'Puedes lanzar Imagen Silenciosa a voluntad, sin gastar espacios.', level: 1 },
    { name: 'Uno con las Sombras', description: 'En luz tenue o oscuridad, usa tu acción para volverte Invisible hasta que te muevas o actúes.', level: 5 },
    { name: 'Salto de Otro Mundo', description: 'Puedes lanzar Saltar sobre ti mismo a voluntad, sin gastar espacios.', level: 9 },
    { name: 'Pacto de la Hoja', description: 'Vinculas un arma o creas una. Eres competente, es mágica y puedes usar tu Carisma para ataques y daño.', level: 1 },
    { name: 'Pacto de la Cadena', description: 'Aprendes el conjuro Buscar Familiar. Puedes elegir formas especiales como Imp o Pseudodragón y atacar con él como Reacción.', level: 1 },
    { name: 'Pacto del Tomo', description: 'Obtienes un grimorio con 2 trucos y dos conjuros de nivel 1 (Mago). Se consideran de Brujo y los puedes cambiar tras un descanso largo.', level: 1 },
    { name: 'Explosión Repulsora', description: 'Cuando golpeas con Explosión Mística, puedes empujar al objetivo hasta 10 pies.', level: 1 },
    { name: 'Escultor de Carne', description: 'Puedes lanzar Polimorfia una vez usando un espacio de brujo.', level: 7 },
    { name: 'Visión de Sombras', description: 'Ves en luz tenue y oscuridad hasta 120 pies como si fuera luz brillante.', level: 1 },
    { name: 'Sudario de Sombras', description: 'Puedes lanzar Invisibilidad a voluntad, sin gastar espacios.', level: 15 },
    { name: 'Signo de Mal Agüero', description: 'Puedes lanzar Imponer Maldición una vez usando un espacio de brujo.', level: 5 },
    { name: 'Hoja Sedienta', description: 'Puedes atacar dos veces con tu Arma del Pacto al usar la acción de Atacar.', level: 5 },
    { name: 'Visiones de Reinos Lejanos', description: 'Puedes lanzar Ojo Arcano a voluntad, sin gastar espacios.', level: 15 },
    { name: 'Susurros de la Tumba', description: 'Puedes lanzar Hablar con los Muertos a voluntad, sin gastar espacios.', level: 9 },
];

export const INVOCATIONS_EN: (Trait & { level?: number, repeatable?: boolean })[] = [
    { name: 'Agonizing Blast', description: 'Choose one of your Warlock cantrips that deals damage. Add your Charisma modifier to the damage it deals. Repeatable.', level: 1, repeatable: true },
    { name: 'Armor of Shadows', description: 'You can cast Mage Armor on yourself at will, without expending a spell slot or material components.', level: 1 },
    { name: 'Ascendant Step', description: 'You can cast Levitate on yourself at will, without expending a spell slot or material components.', level: 9 },
    { name: 'Beast Speech', description: 'You can cast Speak with Animals at will, without expending a spell slot.', level: 1 },
    { name: 'Beguiling Influence', description: 'You gain proficiency in the Deception and Persuasion skills.', level: 1 },
    { name: 'Devils Sight', description: 'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.', level: 1 },
    { name: 'Eldritch Mind', description: 'You have Advantage on Constitution saving throws that you make to maintain Concentration on a spell.', level: 1 },
    { name: 'Eldritch Smite', description: 'Once per turn when you hit a creature with your Pact Weapon, you can expend a Warlock spell slot to deal an extra 1d8 Force damage to the target, plus another 1d8 per level of the spell slot, and you can knock the target Prone if it is Huge or smaller.', level: 5 },
    { name: 'Eldritch Spear', description: 'When you cast a Warlock cantrip with a range of 10 feet or more, its range becomes 300 feet.', level: 1 },
    { name: 'Eyes of the Rune Keeper', description: 'You can read all writing.', level: 1 },
    { name: 'Fiendish Vigor', description: 'You can cast False Life on yourself at will as a 1st-level spell, without expending a spell slot or material components.', level: 1 },
    { name: 'Gaze of Two Minds', description: 'You can use your action to touch a willing Humanoid and perceive through its senses. While the connection is active, you can cast spells as though you were in the other creature\'s space. 1/Long Rest.', level: 1 },
    { name: 'Gift of the Depths', description: 'You can breathe underwater, and you gain a Swim Speed equal to your walking speed. You can also cast Water Breathing once without expending a spell slot.', level: 5 },
    { name: 'Gift of the Protectors', description: 'A protective page in your Book of Shadows. When a creature whose name is on it drops to 0 HP, it drops to 1 instead (1/Long Rest).', level: 9 },
    { name: 'Lessons of the First Ones', description: 'You gain one Origin feat of your choice. Repeatable.', level: 2, repeatable: true },
    { name: 'Lifedrinker', description: 'When you hit a creature with your Pact Weapon, it takes extra Necrotic damage equal to your Charisma modifier, and you regain the same amount of HP.', level: 9 },
    { name: 'Mask of Many Faces', description: 'You can cast Disguise Self at will, without expending a spell slot.', level: 1 },
    { name: 'Master of Myriad Forms', description: 'You can cast Alter Self at will, without expending a spell slot.', level: 15 },
    { name: 'Misty Visions', description: 'You can cast Silent Image at will, without expending a spell slot.', level: 1 },
    { name: 'One with Shadows', description: 'While in Dim Light or Darkness, use your action to become Invisible until you move or take an action.', level: 5 },
    { name: 'Otherworldly Leap', description: 'You can cast Jump on yourself at will, without expending a spell slot.', level: 9 },
    { name: 'Pact of the Blade', description: 'Bind or create a weapon. You are proficient, it is magical, and you can use your Charisma for attack and damage rolls.', level: 1 },
    { name: 'Pact of the Chain', description: 'You learn the Find Familiar spell. You can choose special forms and command it to attack using your Reaction.', level: 1 },
    { name: 'Pact of the Tome', description: 'Gain a grimoire with 2 cantrips and two 1st-level spells (Wizard). They count as Warlock spells and can be swapped after a Long Rest.', level: 1 },
    { name: 'Repelling Blast', description: 'When you hit a creature with Eldritch Blast, you can push the creature up to 10 feet away.', level: 1 },
    { name: 'Sculptor of Flesh', description: 'You can cast Polymorph once by expending a Warlock spell slot.', level: 7 },
    { name: 'Shadow Sight', description: 'You can see in Dim Light and Darkness within 120 feet as if it were Bright Light.', level: 1 },
    { name: 'Shroud of Shadow', description: 'You can cast Invisibility at will, without expending a spell slot.', level: 15 },
    { name: 'Sign of Ill Omen', description: 'You can cast Bestow Curse once by expending a Warlock spell slot.', level: 5 },
    { name: 'Thirsting Blade', description: 'You can attack twice with your Pact Weapon whenever you take the Attack action.', level: 5 },
    { name: 'Visions of Distant Realms', description: 'You can cast Arcane Eye at will, without expending a spell slot.', level: 15 },
    { name: 'Whispers of the Grave', description: 'You can cast Speak with Dead at will, without expending a spell slot.', level: 9 },
];


export const ALIGNMENTS_ES = [
  'Legal Bueno', 'Neutral Bueno', 'Caótico Bueno', 
  'Legal Neutral', 'Neutral Verdadero', 'Caótico Neutral', 
  'Legal Malvado', 'Neutral Malvado', 'Caótico Malvado'
];

export const ALIGNMENTS_EN = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good', 
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export const LANGUAGES_ES = [
  'Común', 'Lenguaje de Signos Común', 'Enano', 'Élfico', 'Gigante', 'Gnomico', 'Goblin', 'Mediano', 'Orco', 
  'Abisal', 'Celestial', 'Dracónico', 'Habla Profunda', 'Infernal', 'Primordial', 'Silvano', 'Infracomún', 'Jerga de Ladrones', 'Druídico'
];

export const LANGUAGES_EN = [
  'Common', 'Common Sign Language', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon', 'Thieves\' Cant', 'Druidic'
];
