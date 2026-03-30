
export interface CompendiumItem {
    id: string;
    title: string;
    category: 'Class' | 'Species' | 'Condition' | 'Feat' | 'Rule';
    content: string; // Summary
    fullInfo?: string; // Full markdown-like content
}

export const COMPENDIUM_DATA: CompendiumItem[] = [
    // --- CLASSES ---
    {
        id: 'barbarian-2024',
        category: 'Class',
        title: 'Bárbaro',
        content: 'Guerrero imparable de furia primigenia que usa su Rabia para resistir daño y asestar golpes devastadores.',
        fullInfo: `### Barbarian (2024 Features)

#### Level 1: Rage

You can enter Rage as a Bonus Action. While active:

*   **Damage Resistance.** Resistance to Bludgeoning, Piercing, and Slashing damage.
*   **Rage Damage.** Bonus damage to Strength-based melee attacks (+2).
*   **Strength Advantage.** Advantage on Strength checks and Saving Throws.
*   **No Spells.** You can't cast spells or maintain Concentration.
*   **Duration.** Lasts 10 minutes. Ends if you are Unconscious or haven't attacked/taken damage.

#### Level 1: Unarmored Defense

While not wearing armor, your AC equals 10 + Dexterity modifier + Constitution modifier.

#### Level 1: Weapon Mastery

Training allows you to use Mastery properties of two kinds of weapons.

#### Level 2: Danger Sense

Advantage on Dexterity saving throws unless Incapacitated.

#### Level 2: Reckless Attack

Gain Advantage on Strength-based attacks, but attacks against you have Advantage until your next turn.`
    },
    {
        id: 'bard-2024',
        category: 'Class',
        title: 'Bardo',
        content: 'Maestro de la música y las palabras que puede inspirar aliados y manipular la realidad con canciones.',
        fullInfo: `### Bard (2024 Features)

#### Level 1: Bardic Inspiration

Bonus Action to inspire another creature within 60 feet. They gain a d6 die.

*   **Usage.** Within 10 minutes, they can add it to one d20 roll.
*   **Uses.** Equal to Charisma modifier (min 1).

#### Level 1: Spellcasting

Cast Bard spells using Charisma. Start with two Cantrips and two Level 1 spells.

#### Level 2: Expertise

Double proficiency for two skill proficiencies.

#### Level 2: Jack of All Trades

Add half Proficiency Bonus (round down) to any ability check that doesn't use it.`
    },
    {
        id: 'cleric-2024',
        category: 'Class',
        title: 'Clérigo',
        content: 'Agente del poder divino, capaz de sanar, proteger o castigar en nombre de su deidad.',
        fullInfo: `### Cleric (2024 Features)

#### Level 1: Divine Order

Choose your path:
*   **Protector.** Heavy Armor and Martial weapon proficiency.
*   **Thaumaturge.** Extra Cantrip and +Wis to Religion.

#### Level 1: Spellcasting

Cast Cleric spells using Wisdom.

#### Level 2: Channel Divinity

Channel energy from the Outer Planes.
*   **Divine Spark.** Heal or Damage by touch.
*   **Turn Undead.** Force Undead to flee.`
    },
    {
        id: 'druid-2024',
        category: 'Class',
        title: 'Druida',
        content: 'Guardián de la naturaleza que maneja poder elemental y se transforma en formas animales.',
        fullInfo: `### Druid (2024 Features)

#### Level 1: Primal Order

Choose your path:
*   **Magician.** Extra Cantrip and +Wis to Arcana/Nature.
*   **Warden.** Medium Armor and Martial weapon proficiency.

#### Level 1: Spellcasting

Cast Druid spells using Wisdom.

#### Level 2: Wild Shape

Magically transform into a Beast form.
*   **Duration.** Hours equal to half Druid level.
*   **Usage.** Uses expand as you level up.`
    },
    {
        id: 'fighter-2024',
        category: 'Class',
        title: 'Guerrero',
        content: 'Especialista en combate y maniobras tácticas, capaz de realizar un gran volumen de ataques.',
        fullInfo: `### Fighter (2024 Features)

#### Level 1: Fighting Style

Gain a Fighting Style feat (e.g. Archery, Defense).

#### Level 1: Second Wind

Bonus Action to regain 1d10 + Fighter level HP. (2 uses per rest).

#### Level 1: Weapon Mastery

Use Mastery properties of three kinds of weapons.

#### Level 2: Action Surge

Take one additional action on your turn (once per rest).

#### Level 2: Tactical Mind

Expend Second Wind to add 1d10 to a failed ability check.`
    },
    {
        id: 'monk-2024',
        category: 'Class',
        title: 'Monje',
        content: 'Luchador ágil que canaliza su Foco interno para lograr hazañas físicas increíbles.',
        fullInfo: `### Monk (2024 Features)

#### Level 1: Martial Arts

*   Use Dex for Monk Weapons/Unarmed Strikes.
*   Unarmed damage: 1d6.
*   Bonus Action Unarmed Strike.

#### Level 1: Unarmored Defense

AC = 10 + Dex + Wis (no armor/shield).

#### Level 2: Monk's Focus

Expend Focus points for:
*   **Flurry of Blows.** Two Unarmed Strikes as Bonus Action.
*   **Patient Defense.** Disadvantage on hits against you.
*   **Step of the Wind.** Dash or Disengage as Bonus Action.`
    },
    {
        id: 'paladin-2024',
        category: 'Class',
        title: 'Paladín',
        content: 'Guerrero sagrado que combina destreza marcial con magia divina y el poder de un Juramento.',
        fullInfo: `### Paladin (2024 Features)

#### Level 1: Lay on Hands

Heal a creature by touch using a pool of points.

#### Level 1: Spellcasting

Cast Paladin spells using Charisma.

#### Level 2: Paladin's Smite

Expend a slot to deal extra Radiant damage (shares space with Divine Smite).`
    },
    {
        id: 'ranger-2024',
        category: 'Class',
        title: 'Explorador',
        content: 'Rastreador experto y luchador que usa magia primigenia para cazar a sus presas.',
        fullInfo: `### Ranger (2024 Features)

#### Level 1: Favored Enemy

You always have *Hunter's Mark* prepared.

#### Level 1: Spellcasting

Cast Ranger spells using Wisdom.

#### Level 1: Weapon Mastery

Use Mastery properties of two kinds of weapons.

#### Level 2: Deft Explorer

Expertise in one skill and learn two extra languages.`
    },
    {
        id: 'rogue-2024',
        category: 'Class',
        title: 'Pícaro',
        content: 'Especialista en sigilo que asesta golpes precisos y letales, destacando en múltiples habilidades.',
        fullInfo: `### Rogue (2024 Features)

#### Level 1: Expertise

Double proficiency for two skill choices.

#### Level 1: Sneak Attack

Deal extra 1d6 damage (scales up) once per turn under right conditions.

#### Level 2: Cunning Action

Bonus Action to Dash, Disengage, or Hide.`
    },
    {
        id: 'sorcerer-2024',
        category: 'Class',
        title: 'Hechicero',
        content: 'Usuario de magia innata cuyo poder proviene de un linaje o un origen cósmico.',
        fullInfo: `### Sorcerer (2024 Features)

#### Level 1: Innate Sorcery

Bonus Action to gain Advantage on spell attacks for 1 minute.

#### Level 2: Font of Magic

Use Sorcery Points to regain slots or fuel Metamagic choices.`
    },
    {
        id: 'warlock-2024',
        category: 'Class',
        title: 'Brujo',
        content: 'Buscador de conocimiento prohibido que hizo un pacto con un patrón poderoso.',
        fullInfo: `### Warlock (2024 Features)

#### Level 1: Eldritch Invocations

Choose two Invocations to customize your power.

#### Level 2: Magical Cunning

Magic Action to regain half your Pact slots (once per rest).`
    },
    {
        id: 'wizard-2024',
        category: 'Class',
        title: 'Mago',
        content: 'Erudito que domina lo arcano mediante el estudio intenso y su libro de hechizos.',
        fullInfo: `### Wizard (2024 Features)

#### Level 1: Ritual Adept

Cast any Wizard ritual spell you know without preparing it.

#### Level 2: Scholar

Expertise in one knowledge skill (Arcane, History, etc.).`
    },

    // --- SPECIES (COMMON) ---
    {
        id: 'aasimar',
        category: 'Species',
        title: 'Aasimar',
        content: 'Mortales con una chispa del Plano Celestial. Luz divina, sanación y furia celestial.',
        fullInfo: `### Aasimar (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los Aasimar (pronunciado AH-sih-mar) son mortales que llevan una chispa de los Planos Superiores en sus almas. Ya sean descendientes de un ser angelical o infundidos con poder celestial, pueden encender esa chispa para aportar luz, sanación y furia celestial. Los Aasimar se parecen a sus padres, pero viven hasta 160 años y tienen características que revelan su herencia celestial: pecas metálicas, ojos luminosos, un halo o el color de piel de un ángel (plata, verde opalino o cobrizo).

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Celestial Resistance.** Tienes Resistencia al daño Necrótico y Radiante.

**Darkvision.** Tienes Visión en la Oscuridad a 60 pies.

**Healing Hands.** Como Acción Mágica, tocas a una criatura y lanzas un número de d4s igual a tu Bono de Competencia. La criatura recupera Puntos de Golpe iguales al total. Una vez usado, no puedes usarlo hasta terminar un Descanso Largo.

**Light Bearer.** Conoces el truco Light. Charisma es tu característica para lanzar hechizos.

**Celestial Revelation.** Al alcanzar nivel 3, puedes transformarte como Acción Adicional eligiendo una opción (dura 1 minuto, hasta 2 veces por Descanso Largo):

- **Heavenly Wings.** Alas espectrales y Velocidad de Vuelo igual a tu Velocidad.
- **Inner Radiance.** Luz brillante (10 pies) y daño Radiante adicional a criaturas cercanas.
- **Necrotic Shroud.** Alas sin vuelo, miedo a criaturas cercanas (CD 8+Carisma+Competencia).`
    },
    {
        id: 'dragonborn',
        category: 'Species',
        title: 'Dracónido',
        content: 'Ancestros dragón. Aliento letal, resistencia elemental y vuelo dracónico.',
        fullInfo: `### Dragonborn (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los ancestros de los dragonborn nacieron de los huevos de dragones cromáticos y metálicos. Una historia dice que estos huevos fueron bendecidos por los dioses dragón Bahamut y Tiamat. Otra dice que los dragones crearon a los primeros dragonborn sin bendiciones divinas. Los dragonborn parecen dragones bípedos sin alas: escamosos, ojos brillantes y huesos gruesos con cuernos en la cabeza.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (5-7 pies)
**Velocidad:** 30 pies

#### Traits

**Draconic Ancestry.** Elige un tipo de dragón que afecta tu Aliento, Resistencia y apariencia:

| Dragón | Tipo de Daño |
|--------|-------------|
| Black | Acid |
| Blue | Lightning |
| Brass | Fire |
| Bronze | Lightning |
| Copper | Acid |
| Gold | Fire |
| Green | Poison |
| Red | Fire |
| Silver | Cold |
| White | Cold |

**Breath Weapon.** Como parte de la Acción de Atacar, puedes reemplazar un ataque con una exhalación de energía en un Cono de 15 pies o una Línea de 30 pies (elige cada vez). DC 8+Constitución+Competencia. Daño 1d10 (escala a 2d10/3d10/4d10 en niveles 5/11/17). Usos: Bono de Competencia por Descanso Largo.

**Damage Resistance.** Resistencia al tipo de daño de tu ancestro dracónico.

**Darkvision.** 60 pies.

**Draconic Flight.** Al alcanzar nivel 5, como Acción Adicional ganas Vuelo igual a tu Velocidad por 10 minutos (1 uso por Descanso Largo).`
    },
    {
        id: 'dwarf',
        category: 'Species',
        title: 'Enano',
        content: 'Pueblo de las montañas, resistencia al veneno y detección de piedra.',
        fullInfo: `### Dwarf (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los enanos fueron creados de la tierra por un dios de la forja. Llamados de varias formas en diferentes mundos (Moradin, Reorx), ese dios les dio afinidad por la piedra, el metal y la vida subterránea. Los enanos son resilientes como las montañas, con una vida útil de unos 350 años. Los más antiguos cuentan leyendas de conflictos con monstruos de montañas y el Subsuelo.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-5 pies)
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 120 pies.

**Dwarven Resilience.** Resistencia al daño por Veneno. Ventaja en tiradas de salvación para evitar o terminar la condición Envenenado.

**Dwarven Toughness.** Tu HP máximo aumenta en 1, y aumenta en 1 adicional cada vez que ganas un nivel.

**Stonecunning.** Como Acción Adicional, ganas Tremorsense a 60 pies por 10 minutos (debes estar en contacto con piedra). Usos: Bono de Competencia por Descanso Largo.`
    },
    {
        id: 'elf',
        category: 'Species',
        title: 'Elfo',
        content: 'Pueblo feérico, longevo, trance en 4 horas y linajes mágicos.',
        fullInfo: `### Elf (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Creados por el dios Corellon, los primeros elfos podían cambiar su forma a voluntad. Perdieron esta habilidad cuando Corellon los maldijo por conspirar con la deidad Lolth. Cuando Lolth fue arrojada al Abismo, la mayoría de los elfos renunciaron a ella y merecieron el perdón de Corellon. Los elfos tienen orejas puntiagudas y carecen de vello facial y corporal. Viven unos 750 años y no duermen sino que entran en trance.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (5-6 pies)
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 60 pies.

**Elven Lineage.** Elige un linaje sobrenatural con magia específica:

| Linaje | Nivel 1 | Nivel 3 | Nivel 5 |
|--------|---------|---------|---------|
| Drow | Visión en Oscuridad 120 pies, Prestidigitation | Faerie Fire | Darkness |
| High Elf | Prestidigitation (puede cambiarse) | Detect Magic | Misty Step |
| Wood Elf | Velocidad 35 pies, Druidcraft | Longstrider | Pass without Trace |
| Lorwyn Elf | Thorn Whip (puede cambiarse) | Command | Silence |
| Shadowmoor Elf | Visión en Oscuridad 120 pies, Starry Wisp | Heroism | Gentle Repose |

**Fey Ancestry.** Ventaja en tiradas de salvación para evitar o terminar la condición Encantado.

**Keen Senses.** Competencia en una habilidad: Insight, Perception o Survival.

**Trance.** No necesitas dormir. Puedes terminar un Descanso Largo en 4 horas de meditación.`
    },
    {
        id: 'gnome',
        category: 'Species',
        title: 'Gnomo',
        content: 'Pequeños pero ingeniosos, magia innata y defensas mentales superiores.',
        fullInfo: `### Gnome (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los gnomos son seres mágicos creados por dioses de la invención, ilusiones y vida subterránea. Las primeras comunidades gnomas rara vez eran vistas debido a su naturaleza secreta. Lo que les faltaba en tamaño, lo compensaban con ingenio. Viven alrededor de 425 años.

**Tipo de Criatura:** Humanoid
**Tamaño:** Small (3-4 pies)
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 60 pies.

**Gnomish Cunning.** Ventaja en tiradas de salvación de Inteligencia, Sabiduría y Carisma.

**Gnomish Lineage.** Elige un linaje sobrenatural:

**Forest Gnome.** Conoces Minor Illusion. Siempre tienes Speak with Animals preparado (Bono de Competencia usos por Descanso Largo).

**Rock Gnome.** Conoces Mending y Prestidigitation. Puedes gastar 10 minutos para crear un dispositivo clockwork diminuto (AC 5, 1 HP) con efecto de Prestidigitation. Máximo 3 dispositivos simultáneos.`
    },
    {
        id: 'goliath',
        category: 'Species',
        title: 'Goliat',
        content: 'Descendientes de gigantes, fuerza ancestral y capacidad de volverse Large.',
        fullInfo: `### Goliath (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los goliaths dominan sobre la mayoría, siendo descendientes distantes de gigantes. Cada goliat porta los favores de los primeros gigantes que se manifiestan en varios beneficios sobrenaturales, incluyendo la habilidad de crecer rápidamente y aproximarse temporalmente a la altura de sus parientes gigantes.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (7-8 pies)
**Velocidad:** 35 pies

#### Traits

**Giant Ancestry.** Elige un beneficio de gigante (Bono de Competencia usos por Descanso Largo):

- **Cloud's Jaunt (Cloud Giant).** Como Acción Adicional, teletransporte de 30 pies.
- **Fire's Burn (Fire Giant).** +1d10 daño Fire al golpear.
- **Frost's Chill (Frost Giant).** +1d6 Cold y reducir velocidad 10 pies.
- **Hill's Tumble (Hill Giant).** Otorgar Prone a criaturas Large o menores.
- **Stone's Endurance (Stone Giant).** Reacción: 1d12+Constitución para reducir daño.
- **Storm's Thunder (Storm Giant).** Reacción: 1d8 Thunder a criatura que te dañó.

**Large Form.** Al alcanzar nivel 5, como Acción Adicional vuélvete Large (ventaja en Fuerza, +10 pies velocidad). Dura 10 minutos. 1 uso por Descanso Largo.

**Powerful Build.** Ventaja para terminar condiciones Grappled. Cuentas como una categoría de tamaño mayor para capacidad de carga.`
    },
    {
        id: 'halfling',
        category: 'Species',
        title: 'Mediano',
        content: 'Alegre y afortunado, reroll de 1s y capacidad de esconderse detrás de criaturas.',
        fullInfo: `### Halfling (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Queridos y guiados por dioses que valoran la vida, el hogar y el hearth, los medianos gravitan hacia refugios bucólicos donde la familia y la comunidad dan forma a sus vidas. Muchos medianos poseen un espíritu aventurero que los lleva a explorar mundos más grandes. Su tamaño similar al de un niño humano les ayuda a pasar desapercibidos.

**Tipo de Criatura:** Humanoid
**Tamaño:** Small (2-3 pies)
**Velocidad:** 30 pies

#### Traits

**Brave.** Ventaja en tiradas de salvación para evitar la condición Asustado.

**Halfling Nimbleness.** Puedes moverte a través del espacio de cualquier criatura de tamaño una categoría mayor que la tuya.

**Luck.** Cuando tiras 1 en un d20 de una Prueba d20, puedes rerrollear el dado y usar el nuevo resultado.

**Naturally Stealthy.** Puedes tomar la acción de Esconderse incluso cuando estás obscured solo por una criatura al menos una categoría de tamaño mayor.`
    },
    {
        id: 'human',
        category: 'Species',
        title: 'Humano',
        content: 'Versátiles y ambiciosos, fuente de inspiración y adaptabilidad.',
        fullInfo: `### Human (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Encontrados en todo el multiverso, los humanos son tan variados como numerosos y se esforzan por lograr tanto como puedan en los años que se les dan. Su ambición e ingenio son alabados, respetados y temidos en muchos mundos.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies), elegido al seleccionar esta especie
**Velocidad:** 30 pies

#### Traits

**Resourceful.** Ganas Inspiración Heroica siempre que terminas un Descanso Largo.

**Skillful.** Ganas competencia en una habilidad de tu elección.

**Versatile.** Ganas una Dote de Origen de tu elección.`
    },
    {
        id: 'orc',
        category: 'Species',
        title: 'Orco',
        content: 'Supervivientes implacables con impulso de adrenalina y resistencia inquebrantable.',
        fullInfo: `### Orc (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los orcos trazan su creación hasta Gruumsh, un dios poderoso que equipó a sus hijos con dones para vagar por llanuras, vastas cavernas y mares turbulentos y enfrentar a los monstruos que acechan allí. Los orcos son altos y fornidos en promedio, con piel gris, orejas puntiagudas y colmillos inferiores prominentes. Conservan los dones de Gruumsh: resistencia, determinación y la habilidad de ver en la oscuridad.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (6-7 pies)
**Velocidad:** 30 pies

#### Traits

**Adrenaline Rush.** Puedes tomar la acción de Dash como Acción Adicional. Cuando lo haces, ganas Puntos de Golpe Temporales iguales a tu Bono de Competencia. Usos: Bono de Competencia por Descanso Corto o Largo.

**Darkvision.** 120 pies.

**Relentless Endurance.** Cuando se te reduce a 0 PG pero no mueres instantáneamente, puedes caer a 1 PG en su lugar. Una vez usado, no puedes usarlo hasta terminar un Descanso Largo.`
    },
    {
        id: 'tiefling',
        category: 'Species',
        title: 'Tiflin',
        content: 'Legado infernal con magia innata y presencia sobrenatural.',
        fullInfo: `### Tiefling (Player's Handbook)

**Source:** Player's Handbook

**Descripción:** Los tieflings nacen en los Planos Inferiores o tienen ancestros infernales. Un tiefling está vinculado por sangre a un diablo, demonio u otro Demonio. Esta conexión es el legado infernal del tiefling, que viene con la promesa de poder pero no afecta su inclinación moral.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (3-4 pies), elegido al seleccionar
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 60 pies.

**Fiendish Legacy.** Elige un legado sobrenatural:

| Legado | Nivel 1 | Nivel 3 | Nivel 5 |
|--------|---------|---------|---------|
| Abyssal | Resistencia Poison + Poison Spray | Ray of Sickness | Hold Person |
| Chthonic | Resistencia Necrotic + Chill Touch | False Life | Ray of Enfeeblement |
| Infernal | Resistencia Fire + Fire Bolt | Hellish Rebuke | Darkness |

**Otherworldly Presence.** Conoces el truco Thaumaturgy. Carisma es tu característica para lanzarlo.`
    },

    // --- SPECIES (EBERRON) ---
    {
        id: 'changeling',
        category: 'Species',
        title: 'Changeling (Eberron)',
        content: 'Maestros del cambio de forma con instincts Fey y habilidades sociales.',
        fullInfo: `### Changeling (Eberron)

**Source:** Eberron - Forge of the Artificer

**Descripción:** Con apariencias que cambian constantemente, los changelings residen en muchas sociedades sin ser detectados. Cada changeling puede adoptar sobrenaturalmente cualquier cara que deseen. En su forma verdadera, los changelings parecen desvaídos, sus rasgos casi sin detalles. Sin embargo, muchos changelings desarrollan identidades con más profundidad, creando personas completas con historia y creencias.

**Tipo de Criatura:** Fey
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Changeling Instincts.** Ganas competencia en dos habilidades: Deception, Insight, Intimidation, Performance o Persuasion.

**Shape-Shifter.** Como acción, puedes cambiar tu apariencia y voz. Puedes ajustar altura, peso y tamaño entre Medium y Small. Puedes parecerte a otro especie pero tus estadísticas no cambian. No puedes duplicar la apariencia de alguien que nunca has visto. Mientras transformado, tienes Ventaja en cheques de Carisma. 1 uso por turno.`
    },
    {
        id: 'kalashtar',
        category: 'Species',
        title: 'Kalashtar (Eberron)',
        content: 'Unión de humanos y espíritus Quori con telepatía y disciplina mental.',
        fullInfo: `### Kalashtar (Eberron)

**Source:** Eberron - Forge of the Artificer

**Descripción:** Los kalashtar (pronunciado kal-ASH-tar) se crean de la unión de humanos y espíritus renegados llamados quori del plano de los sueños. Los kalashtar parecen humanos pero su conexión espiritual los afecta de varias maneras. Tienen rasgos simétricos ligeramente angulares y sus ojos a menudo brillan cuando se concentran o expresan emociones fuertes.

**Tipo de Criatura:** Aberration
**Tamaño:** Medium (6-7 pies)
**Velocidad:** 30 pies

#### Traits

**Dual Mind.** Ventaja en tiradas de salvación de Sabiduría y Carisma.

**Mental Discipline.** Resistencia al daño Psíquico.

**Mind Link.** Telepatía con alcance igual a 10 veces tu nivel. Como Acción Mágica, puedes dar a una criatura la habilidad de hablar telepáticamente contigo por 1 hora.

**Severed from Dreams.** No puedes ser objetivo del hechizo Dream. Además, al terminar un Descanso Largo, ganas competencia en una habilidad de tu elección hasta el siguiente Descanso Largo.`
    },
    {
        id: 'khoravar',
        category: 'Species',
        title: 'Khoravar (Eberron)',
        content: 'Medio-elfos de Eberron con magia Fey y resistencia a la inconsciencia.',
        fullInfo: `### Khoravar (Eberron)

**Source:** Eberron - Forge of the Artificer

**Descripción:** A lo largo de siglos, los descendientes de humanos y elfos han desarrollado sus propias comunidades y tradiciones en Khorvaire. Muchos Khoravar defienden la idea de ser "el puente entre", creyendo que están llamados a facilitar la comunicación y cooperación entre diferentes culturas o especies.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-6 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 60 pies.

**Fey Ancestry.** Ventaja en tiradas de salvación para evitar o terminar la condición Encantado.

**Fey Gift.** Conoces el truco Friends. Al terminar un Descanso Largo, puedes reemplazarlo por otro truco de las listas de Clérigo, Druida o Mago.

**Lethargy Resilience.** Cuando fallas una tirada de salvación para evitar o terminar la condición Inconsciente, puedes tener éxito en su lugar. Una vez usado, no puedes usarlo hasta terminar 1d4 Descansos Larg.

**Skill Versatility.** Ganas competencia en una habilidad o herramienta. Puedes reemplazarla al terminar un Descanso Largo.`
    },
    {
        id: 'shifter',
        category: 'Species',
        title: 'Shifter (Eberron)',
        content: 'Humanoides bestiales con transformación temporal y instintos animales.',
        fullInfo: `### Shifter (Eberron)

**Source:** Eberron - Forge of the Artificer

**Descripción:** Los shifters -a veces llamados "weretouched"- descienden de personas que contrajeron licantropía total o parcial. Los shifters se parecen a humanos en altura y complexión pero son típicamente más ágiles y flexibles. Sus rasgos faciales tienen un aire bestial, a menudo con ojos grandes y orejas puntiagudas.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Bestial Instincts.** Ganas competencia en una habilidad: Acrobatics, Athletics, Intimidation o Survival.

**Darkvision.** 60 pies.

**Shifting.** Como Acción Adicional, puedes transformarte en una apariencia más bestial (1 minuto). Ganas PG Temporales iguales a 2 × Bono de Competencia. Usos: Bono de Competencia por Descanso Largo. Elige un beneficio:

- **Beasthide.** +1d6 PG Temporales. +1 a CA mientras transformado.
- **Longtooth.** Puedes hacer Unarmed Strike con colmillos: 1d6+Strength Piercing.
- **Swiftstride.** +10 pies velocidad. Reacción para moverte 10 pies cuando una criatura termina su turno cerca de ti.
- **Wildhunt.** Ventaja en cheques de Sabiduría transformado. Ninguna criatura a 30 pies puede tener Ventaja contra ti.`
    },
    {
        id: 'warforged',
        category: 'Species',
        title: 'Warforged (Eberron)',
        content: 'Seres construct con armadura integrada y resistencia a veneno.',
        fullInfo: `### Warforged (Eberron)

**Source:** Eberron - Forge of the Artificer

**Descripción:** Los warforged son seres mecánicos construidos como armas para pelear en la Última Guerra. Una ruptura inesperada produjo seres sentimentados hechos de madera y metal que sin embargo pueden sentir dolor y emoción. Los warforged comprenden una mezcla de materiales orgánicos e inorgánicos.

**Tipo de Criatura:** Construct
**Tamaño:** Medium (6-8 pies) o Small (3-4 pies)
**Velocidad:** 30 pies

#### Traits

**Construct Resilience.** Resistencia al daño por Veneno. Ventaja en tiradas de salvación para evitar o terminar la condición Envenenado.

**Integrated Protection.** +1 a tu CA. La armadura que te pones no puede ser removida en tu contra mientras estés vivo.

**Sentry's Rest.** No necesitas dormir. Puedes terminar un Descanso Largo en 6 horas de estado inactivo e inmóvil pero permaneces consciente.

**Specialized Design.** Ganas competencia en una habilidad y una herramienta de tu elección.

**Tireless.** No ganas niveles de Agotamiento por deshidratación, malnutrición o asfixia.`
    },

    // --- SPECIES (LORWYN) ---
    {
        id: 'boggart',
        category: 'Species',
        title: 'Boggart (Lorwyn)',
        content: 'Goblinoides pequeños con magia Fey, furia del pequeño y escape nimble.',
        fullInfo: `### Boggart (Lorwyn)

**Source:** Lorwyn - First Light

**Descripción:** Los boggarts son pequeños humanoides goblinoides encontrados en el reino de Lorwyn-Shadowmoor. Poseen rasgos físicos bestiales incluyendo cuernos y hocicos animales. Más allá de estas общительность, las apariencias de los boggarts varían ampliamente. Un boggart puede parecerse a un erizo mientras que otro puede tener el hocico y orejas carnosas de un cerdo. Los boggarts tienden a amar la elaboración de pociones.

**Tipo de Criatura:** Humanoid (goblinoid)
**Tamaño:** Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 60 pies.

**Fey Ancestry.** Ventaja en tiradas de salvación para evitar o terminar la condición Encantado.

**Fury of the Small.** Cuando dañas con ataque o hechizo a una criatura más grande que tú, puedes causar daño extra igual a tu Bono de Competencia. Máximo una vez por turno.

**Nimble Escape.** Puedes tomar la acción de Disengage o Hide como Acción Adicional en cada uno de tus turnos.`
    },
    {
        id: 'faerie',
        category: 'Species',
        title: 'Faerie (Lorwyn)',
        content: 'Pequeños seres feéricos con magia Druida y vuelo natural.',
        fullInfo: `### Faerie (Lorwyn)

**Source:** Lorwyn - First Light

**Descripción:** Conocidos por sus travesuras, las faeries se parecen a insectos con rasgos humanoides. Su tamaño y forma pueden variar, pero todas tienen antenas, ojos negros, piel quitinosa y piernas y alas de insecto. Cada faerie nace de una flor y posee magia innata.

**Tipo de Criatura:** Fey
**Tamaño:** Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Fairy Magic.** Conoces Druidcraft.

Desde nivel 3: Puedes lanzar Faerie Fire. Desde nivel 5: También puedes lanzar Enlarge/Reduce. Cada una 1 uso por Descanso Largo. Inteligencia, Sabiduría o Carisma para lanzar.

**Flight.**Tienes Velocidad de Vuelo igual a tu Velocidad de Caminata. No puedes usar esta velocidad si usas armadura medium o heavy.

**Shadowmoor Faeries.** Visión en Oscuridad 120 pies.`
    },
    {
        id: 'flamekin',
        category: 'Species',
        title: 'Flamekin (Lorwyn)',
        content: 'Humanoides de fuego y piedra con Produce Flame y magia de fuego.',
        fullInfo: `### Flamekin (Lorwyn)

**Source:** Lorwyn - First Light

**Descripción:** Los flamekin son seres creados de dos elementos clave de la creación: fuego y piedra. Como resultado, muchos flamekin sienten una fuerte conexión con el mundo natural. Los cuerpos de los flamekin irradian llamas mágicas inofensivas.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Darkvision.** 60 pies.

**Fire Resistance.** Resistencia al daño por Fuego.

**Reach to the Blaze.** Conoces Produce Flame. Desde nivel 3: Puedes lanzar Burning Hands. Desde nivel 5: También puedes lanzar Flame Blade sin componentes materiales. Inteligencia, Sabiduría o Carisma para lanzar.`
    },
    {
        id: 'lorwyn-changeling',
        category: 'Species',
        title: 'Lorwyn Changeling (Lorwyn)',
        content: 'Shapeshifters Fey con piel azul-verde y movimiento impredecible.',
        fullInfo: `### Lorwyn Changeling (Lorwyn)

**Source:** Lorwyn - First Light

**Descripción:** Los changelings de Lorwyn son shapeshifters carismáticos capaces de crudamente imitar formas de criaturas y plantas. Independientemente de la forma, los changelings de Lorwyn mantienen sus rasgos clave: piel azul-verde, mechones de pelaje como tentáculos y ojos amarillos bulbosos con pupilas verticales.

**Tipo de Criatura:** Fey
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Shape Self.** Como acción, puedes reshapear tu cuerpo a forma Humanoid bípedo o forma Beast cuadrúpedo. Puedes usar ropa y armadura hecha para tu tamaño.

**Darkvision.** 120 pies.

**Delightful Imitator.** Competencia en Performance.

**Unpredictable Movement.** Cuando tiras Iniciativa sin Desventaja, puedes tomar la acción de Dash como Reacción.`
    },
    {
        id: 'rimekin',
        category: 'Species',
        title: 'Rimekin (Lorwyn)',
        content: 'Flamekin transformados con magia de frío y frío intenso.',
        fullInfo: `### Rimekin (Lorwyn)

**Source:** Lorwyn - First Light

**Descripción:** Los rimekin provienen tanto de Lorwyn como de Shadowmoor, aunque los primeros surgieron de flamekin durante la invasión Phyrexiana. Estos flamekin abordaron sus problemas con lógica fría y rechazaron respuestas reactivas. Como resultado, las llamas mágicas que envolvían sus cuerpos tomaron un aire gélido y se volvieron rimekin.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 30 pies

#### Traits

**Cold Fire Magic.** Conoces Ray of Frost. Desde nivel 3: Ice Knife. Desde nivel 5: Flame Blade (trata Cold en lugar de Fire). Inteligencia, Sabiduría o Carisma para lanzar.

**Cold Resistance.** Resistencia al daño por Frío.

**Darkvision.** 60 pies.`
    },

    // --- SPECIES (EXOTIC) ---
    {
        id: 'dhampir',
        category: 'Species',
        title: 'Dhampir (Exótico)',
        content: 'Humanoides con poderes vampíricos y hambre maldita, velocidad y mordida vampírica.',
        fullInfo: `### Dhampir (Exotic)

**Source:** Astarion's Book of Hungers

**Descripción:** Los dhampirs son seres vivos que poseen poderes vampíricos pero están malditos con un hambre macabra. La mayoría de los dhampirs tienen sed de sangre, pero algunos obtienen sustento de sueños, energía vital u otras fuentes. Los dhampirs deben elegir si luchar para controlar su hambre o ceder a impulsos depredadores.

**Tipo de Criatura:** Humanoid
**Tamaño:** Medium (4-7 pies) o Small (2-4 pies)
**Velocidad:** 35 pies

#### Traits

**Darkvision.** 60 pies.

**Spider Climb.** Tienes Velocidad de Escalada igual a tu Velocidad. Desde nivel 3: Puedes moverte por superficies verticales y techos dejando tus manos libres.

**Trace of Undeath.** Resistencia al daño Necrótico.

**Vampiric Bite.** Cuando usas Unarmed Strike, puedes morder en lugar de otros daños. Daño Piercing 1d4+Constitución en lugar del daño normal de Unarmed Strike.

Además, cuando dañas a una criatura que no es Construct o Undead, puedes elegir uno:

- **Drain.** Recuperas PG iguales al daño Piercing.
- **Strengthen.** Obtienes bono a tu siguiente prueba de característica o ataque en 1 minuto igual al daño Piercing.

Usos: Bono de Competencia por Descanso Largo.`
    },

    // --- CONDITIONS ---
    {
        id: 'blinded',
        category: 'Condition',
        title: 'Cegado (Blinded)',
        content: 'No puedes ver. Fallas tiradas de percepción visual. Desventaja en ataques.',
        fullInfo: `### Blinded

*   **Can't See.** Automatically fail any ability check that requires sight.
*   **Attacks against You.** Attack rolls against you have Advantage.
*   **Attacks by You.** Your attack rolls have Disadvantage.`
    },
    {
        id: 'exhaustion-2024',
        category: 'Condition',
        title: 'Agotamiento (Exhaustion)',
        content: 'Penalizaciones acumulativas a pruebas d20 y velocidad. Letal en nivel 6.',
        fullInfo: `### Exhaustion (New Rules)

*   **D20 Test Penalty.** Each level imparts a -2 penalty to all d20 tests.
*   **Speed Reduction.** Speed is reduced by 5 feet for each level.
*   **Death.** Reach level 6 and die immediately.`
    },
    {
        id: 'grappled',
        category: 'Condition',
        title: 'Presado (Grappled)',
        content: 'Velocidad 0. Desventaja en ataques contra otros.',
        fullInfo: `### Grappled

*   **Speed 0.** Your speed can't increase.
*   **Attacks.** Disadvantage on attack rolls against anyone except the grappler.
*   **Incapacitated.** Condition ends if the grappler becomes Incapacitated.`
    },
    {
        id: 'incapacitated',
        category: 'Condition',
        title: 'Incapacitado (Incapacitated)',
        content: 'No puedes realizar acciones ni reacciones. Rompe la concentración.',
        fullInfo: `### Incapacitated

*   **No Actions.** You can't take actions, bonus actions, or reactions.
*   **Concentration.** Breaking immediately.`
    },
    {
        id: 'restrained',
        category: 'Condition',
        title: 'Apresado (Restrained)',
        content: 'Velocidad 0. Desventaja en ataques y salvaciones de Destreza.',
        fullInfo: `### Restrained

*   **Speed 0.** Your speed can't increase.
*   **Attack Penalty.** Disadvantage on your attack rolls.
*   **Defensive Penalty.** Advantage on attacks against you and Disadvantage on Dex saves.`
    },
    {
        id: 'charmed',
        category: 'Condition',
        title: 'Encantado (Charmed)',
        content: 'No puedes atacar al que te encantó. Desventaja en tiradas contra el encantador.',
        fullInfo: `### Charmed

*   **Can't Attack.** You can't attack or target the creature that charmed you, or deal damage to it.
*   **Social Disadvantage.** You have Disadvantage on attack rolls against creatures other than the one that charmed you.`
    },
    {
        id: 'deafened',
        category: 'Condition',
        title: 'Sordado (Deafened)',
        content: 'No puedes oír. Fallas tiradas que dependan de oír.',
        fullInfo: `### Deafened

*   **Can't Hear.** You can't hear. You automatically fail any ability check that requires hearing.`
    },
    {
        id: 'frightened',
        category: 'Condition',
        title: 'Asustado (Frightened)',
        content: 'Desventaja en pruebas y ataques mientras la fuente de miedo esté visible.',
        fullInfo: `### Frightened

*   **Fear Disadvantage.** You have Disadvantage on ability checks and attack rolls while the source of your fear is within line of sight.
*   **Can't Move Closer.** You can't willingly move closer to the source of your fear.`
    },
    {
        id: 'invisible',
        category: 'Condition',
        title: 'Invisible (Invisible)',
        content: 'No puedes ser visto sin ayuda especial. Otorga ventaja en ataques, desventaja a ataques contra ti.',
        fullInfo: `### Invisible

*   **Undetectable.** You can't be seen without special aids or magic.
*   **Attack Advantage.** You have Advantage on attack rolls.
*   **Attack Disadvantage.** Attack rolls against you have Disadvantage.`
    },
    {
        id: 'paralyzed',
        category: 'Condition',
        title: 'Paralizado (Paralyzed)',
        content: 'Incapacitado. No puedes moverte ni actuar. Fallas tiradas de salvación de Destreza. Golpes automáticos.',
        fullInfo: `### Paralyzed

*   **Incapacitated.** You can't move or take actions.
*   **Dex Save Auto-Fail.** You automatically fail Strength and Dexterity saving throws.
*   **Auto-Hit.** Attack rolls against you have Advantage. Any hit deals double damage.`
    },
    {
        id: 'petrified',
        category: 'Condition',
        title: 'Petrified (Petrified)',
        content: 'Transformado en piedra. Peso x4. Inmune a todo daño. Incapacitado y inconsciente.',
        fullInfo: `### Petrified

*   **Transformed.** You are transformed into stone. Your weight quadruples and you become unaware of your surroundings.
*   **Incapacitated.** You can't move or take actions.
*   **Unconscious.** You automatically fail Strength and Dexterity saving throws.
*   **Immunity.** You have resistance to all damage.
*   **Attack Advantage.** Attack rolls against you have Advantage.`
    },
    {
        id: 'poisoned',
        category: 'Condition',
        title: 'Envenenado (Poisoned)',
        content: 'Desventaja en tiradas de ataque y pruebas de característica.',
        fullInfo: `### Poisoned

*   **Attack/Check Disadvantage.** You have Disadvantage on attack rolls and ability checks.`
    },
    {
        id: 'prone',
        category: 'Condition',
        title: 'Derribado (Prone)',
        content: 'Unico movimiento es arrastrarse. Ataques a 5 pies tienen ventaja, ataques a mas de 5 pies tienen desventaja.',
        fullInfo: `### Prone

*   **Crawling.** The only movement you can make is to crawl or creep on the ground, unless you stand up.
*   **Attack Disadvantage.** You have Disadvantage on attack rolls.
*   **Melee Advantage.** Attack rolls against you have Advantage if the attacker is within 5 feet of you. Otherwise, the attack roll has Disadvantage.`
    },
    {
        id: 'stunned',
        category: 'Condition',
        title: 'Aturdido (Stunned)',
        content: 'Incapacitado. No puedes moverte. Fallas tiradas de salvación de Destreza. Golpes automáticos.',
        fullInfo: `### Stunned

*   **Incapacitated.** You can't move or take actions.
*   **Dex Save Auto-Fail.** You automatically fail Strength and Dexterity saving throws.
*   **Auto-Hit.** Attack rolls against you have Advantage.`
    },
    {
        id: 'unconscious',
        category: 'Condition',
        title: 'Inconsciente (Unconscious)',
        content: 'Incapacitado. No puedes moverte ni actuar. Ignorado. Golpes automáticos.',
        fullInfo: `### Unconscious

*   **Incapacitated.** You can't move or take actions.
*   **Ignored.** You automatically fail Strength and Dexterity saving throws.
*   **Drop Items.** You drop what you're holding and fall Prone.
*   **Unaware.** You can't perceive your surroundings.
*   **Auto-Hit.** Attack rolls against you have Advantage. Any hit deals double damage.`
    },

    // --- FEATS ---
    {
        id: 'alert',
        category: 'Feat',
        title: 'Alert',
        content: 'Initiative Proficiency. When you roll Initiative, you can add your Proficiency Bonus to the roll. Initia',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Initiative Proficiency.** When you roll Initiative, you can add your Proficiency Bonus to the roll.
**Initiative Swap.** Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat.`
    },
    {
        id: 'crafter',
        category: 'Feat',
        title: 'Crafter',
        content: 'Tool Proficiency. You gain proficiency with three Artisan\'s Tools of your choice.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Tool Proficiency.** You gain proficiency with three Artisan's Tools of your choice.
**Discount.** Whenever you buy a nonmagical item, you receive a 20 percent discount on it.
**Fast Crafting.** When you finish a Long Rest, you can craft one piece of gear. The item lasts until you finish another Long Rest.`
    },
    {
        id: 'healer',
        category: 'Feat',
        title: 'Healer',
        content: 'Healing. When you use a Healer\'s Kit to stabilize a dying creature, you also give that creature 1d6 Hit Points.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Healing.** When you use a Healer's Kit to stabilize a dying creature, you also give that creature 1d6 Hit Points.
**Surgical Skill.** As a Bonus Action, you can use a Healer's Kit to tend to a creature's wounds. The creature regains Hit Points equal to 1d6 + your Proficiency Bonus.`
    },
    {
        id: 'lucky',
        category: 'Feat',
        title: 'Lucky',
        content: 'Luck Points. You have a number of Luck Points equal to your Proficiency Bonus.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Luck Points.** You have a number of Luck Points equal to your Proficiency Bonus.
**Advantage.** When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll.
**Disadvantage.** When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.`
    },
    {
        id: 'magic-initiate',
        category: 'Feat',
        title: 'Magic Initiate',
        content: 'Two Cantrips. You learn two cantrips from the Cleric, Druid, or Wizard spell list.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Two Cantrips.** You learn two cantrips from the Cleric, Druid, or Wizard spell list.
**Level 1 Spell.** Choose a level 1 spell. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability when you finish a Long Rest.
**Repeatable.** You can take this feat more than once, but you must choose a different spell list each time.`
    },
    {
        id: 'musician',
        category: 'Feat',
        title: 'Musician',
        content: 'Instrument Training. You gain proficiency with three Musical Instruments of your choice.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Instrument Training.** You gain proficiency with three Musical Instruments of your choice.
**Encouraging Song.** As you finish a Short or Long Rest, you can play a song and give Heroic Inspiration to allies who hear it. The number of allies equals your Proficiency Bonus.`
    },
    {
        id: 'savage-attacker',
        category: 'Feat',
        title: 'Savage Attacker',
        content: 'Rage Damage. When you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Rage Damage.** When you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total. This property can be used a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'skilled',
        category: 'Feat',
        title: 'Skilled',
        content: 'You gain proficiency in three skills of your choice, or you gain expertise in one skill.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain proficiency in three skills of your choice, or you gain expertise in one skill.`
    },
    {
        id: 'tavern-brawler',
        category: 'Feat',
        title: 'Tavern Brawler',
        content: 'Improvised Weapon. A weapon you use for an improvised attack has a +1 bonus to attack rolls.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Improvised Weapon.** A weapon you use for an improvised attack has a +1 bonus to attack rolls, and deals 1d4 damage.
**Grappler.** You have Advantage on attack rolls against a creature you are Grappling.
**Unarmed Strike.** Your Unarmed Strikes deal 1d4 damage, and you have the Grappling Fighting Style.`
    },
    {
        id: 'tough',
        category: 'Feat',
        title: 'Tough',
        content: 'Your Hit Point maximum increases by an amount equal to twice your level when you gain this feat.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
Your Hit Point maximum increases by an amount equal to twice your level when you gain this feat, and then increases by 2 Hit Points whenever you gain a level.`
    },
    {
        id: 'cult-of-the-dragon-initiate',
        category: 'Feat',
        title: 'Cult of the Dragon Initiate',
        content: 'Draconic Spell. You have joined the Cult of the Dragon.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You have joined the Cult of the Dragon.

**Draconic Spell.** You learn the Thunderwave spell and can cast it at 2nd level without using a spell slot.
**Dark One's Blessing.** When you reduce a creature to 0 Hit Points, you gain temporary Hit Points equal to your Proficiency Bonus.`
    },
    {
        id: 'emerald-enclave-fledgling',
        category: 'Feat',
        title: 'Emerald Enclave Fledgling',
        content: 'Natural Recovery. As a Bonus Action, you can regain a spell slot of level 1 or 2.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are a fledgling member of the Emerald Enclave.

**Natural Recovery.** As a Bonus Action, you can regain a spell slot of level 1 or 2. Once you use this benefit, you can't use it again until you finish a Long Rest.
**Reactive.** When a creature you can see moves within 30 feet of you, you can take a Reaction to make an Opportunity Attack.`
    },
    {
        id: 'harper-agent',
        category: 'Feat',
        title: 'Harper Agent',
        content: 'Harper\'s Eye. You have Advantage on Insight and Perception checks.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are an agent of the Harpers.

**Harper's Eye.** You have Advantage on Insight and Perception checks.
**Spellcasting.** You learn the Detect Magic spell and can cast it as a Ritual.`
    },
    {
        id: 'lords-alliance-agent',
        category: 'Feat',
        title: 'Lords\' Alliance Agent',
        content: 'Political Mimicry. You have Advantage on Deception checks to pass as a member of a different noble house.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are an agent of the Lords' Alliance.

**Political Mimicry.** You have Advantage on Deception checks to pass as a member of a different noble house.
**Silver Tongue.** You have Proficiency in Persuasion.`
    },
    {
        id: 'purple-dragon-rook',
        category: 'Feat',
        title: 'Purple Dragon Rook',
        content: 'Shield Bearer. When an ally within 5 feet of you is attacked, you can use your Reaction.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are a member of the Purple Dragon.

**Shield Bearer.** When an ally within 5 feet of you is attacked, you can use your Reaction to impose Disadvantage on the attack roll.
**Retribution.** When you use your Shield Bearer benefit, you can make a melee attack against the attacker as part of the same Reaction.`
    },
    {
        id: 'spellfire-spark',
        category: 'Feat',
        title: 'Spellfire Spark',
        content: 'Spellfire Adept. You have been touched by spellfire.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You have been touched by spellfire.

**Spellfire Adept.** You learn the Eldritch Blast cantrip and can cast it as a 2nd-level spell.
**Spellfire Healing.** As a Bonus Action, you can touch a creature and restore Hit Points equal to your Proficiency Bonus.`
    },
    {
        id: 'tyro-of-the-gauntlet',
        category: 'Feat',
        title: 'Tyro of the Gauntlet',
        content: 'Fighting Style. You gain a Fighting Style feat.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** Level 4+, Strength or Dexterity 13+


### Benefit
You are a newcomer to the fighting styles.

**Fighting Style.** You gain a Fighting Style feat.
**Unarmored Defense.** While you aren't wearing armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier.`
    },
    {
        id: 'zhentarim-ruffian',
        category: 'Feat',
        title: 'Zhentarim Ruffian',
        content: 'Dark Traveler. You have Advantage on Stealth checks in dim light and darkness.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are a member of the Zhentarim.

**Dark Traveler.** You have Advantage on Stealth checks in dim light and darkness.
**Snake Oil Salesman.** You have Proficiency in Deception and Persuasion.`
    },
    {
        id: 'child-of-the-sun',
        category: 'Feat',
        title: 'Child of the Sun',
        content: 'Sun\'s Blessing. You have been blessed by the sun.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You have been blessed by the sun.

**Sun's Blessing.** You have Resistance to Radiant damage.
**Light Bearer.** You can cast the Light cantrip at will.`
    },
    {
        id: 'shadowmoor-hexer',
        category: 'Feat',
        title: 'Shadowmoor Hexer',
        content: 'Shadow Step. As a Bonus Action, you can teleport up to 30 feet to an unoccupied space.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You have been touched by the shadows of Shadowmoor.

**Shadow Step.** As a Bonus Action, you can teleport up to 30 feet to an unoccupied space in dim light or darkness.
**Umbral Form.** While in dim light or darkness, you can take the Hide action as a Bonus Action.`
    },
    {
        id: 'tireless-reveler',
        category: 'Feat',
        title: 'Tireless Reveler',
        content: 'Endless Endurance. You have Advantage on Constitution saving throws.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You are a creature of endless party.

**Endless Endurance.** You have Advantage on Constitution saving throws.
**Partier.** You have Proficiency in Performance and Persuasion.`
    },
    {
        id: 'vampire-hunter',
        category: 'Feat',
        title: 'Vampire Hunter',
        content: 'Vampire Slayer. You have Advantage on attack rolls against Vampires.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You hunt the undead.

**Vampire Slayer.** You have Advantage on attack rolls against Vampires.
**Hunter's Sense.** You can sense the presence of undead within 60 feet of you.`
    },
    {
        id: 'vampires-plaything',
        category: 'Feat',
        title: 'Vampire\'s Plaything',
        content: 'Vampire\'s Blessing. You have been touched by a Vampire.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You have been touched by a Vampire.

**Vampire's Blessing.** You have Resistance to Necrotic damage.
**Undead Weakness.** You have Vulnerability to Radiant damage.`
    },
    {
        id: 'ability-score-improvement',
        category: 'Feat',
        title: 'Ability Score Improvement',
        content: 'Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1. This feat can't increase an ability score above 20.

**Repeatable.** You can take this feat more than once.`
    },
    {
        id: 'actor',
        category: 'Feat',
        title: 'Actor',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Impersonation.** You have Proficiency in Deception and Performance. In addition, when you impersonate someone else, you have Advantage on Deception checks to conceal your identity.`
    },
    {
        id: 'athlete',
        category: 'Feat',
        title: 'Athlete',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Climber.** You have a Climb Speed equal to your Speed.
**Jump.** You have Advantage on Strength (Athletics) checks made to jump, and you don't fall damage if you fall less than 20 feet.`
    },
    {
        id: 'charger',
        category: 'Feat',
        title: 'Charger',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Charge Attack.** If you move at least 10 feet in a straight line before hitting the Attack action, you gain a +2 bonus to the attack's damage roll, or you can make an extra attack as part of the same action.`
    },
    {
        id: 'chef',
        category: 'Feat',
        title: 'Chef',
        content: 'Ability Score Increase. Increase your Constitution or Wisdom score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution or Wisdom score by 1, to a maximum of 20.
**Prepare Feast.** When you finish a Long Rest, you can prepare a feast for up to six people. The feast takes 1 hour to complete, and the creatures who eat the feast gain 1d8 Hit Points, and they can't have the Poisoned condition for 24 hours.`
    },
    {
        id: 'crossbow-expert',
        category: 'Feat',
        title: 'Crossbow Expert',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Ignore Loading.** You ignore the Loading property of Hand Crossbow, Heavy Crossbow, and Light Crossbow.
**Firing in Melee.** Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with crossbows.
**Dual Wielding.** When you make the extra attack of the Light property, you can add your ability modifier to the damage of the extra attack if that attack is with a crossbow that has the Light property.`
    },
    {
        id: 'crusher',
        category: 'Feat',
        title: 'Crusher',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Temporal.** When you hit a creature with an attack that deals bludgeoning damage, you can move the creature 5 feet to an unoccupied space.
**Sundering Strike.** When you hit a creature with a weapon attack, you can deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'defensive-duelist',
        category: 'Feat',
        title: 'Defensive Duelist',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Parry.** When a creature attacks you and you are wielding a melee weapon, you can use your reaction to add your Proficiency Bonus to your Armor Class for that attack.`
    },
    {
        id: 'dual-wielder',
        category: 'Feat',
        title: 'Dual Wielder',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength or Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Enhanced Dual Wielding.** When you take the Attack action and attack with a weapon with the Light property, you can make one extra attack as a Bonus Action later on the same turn with a different weapon.
**Quick Draw.** You can draw or stow two weapons that lack the Two-Handed property.`
    },
    {
        id: 'durable',
        category: 'Feat',
        title: 'Durable',
        content: 'Ability Score Increase. Increase your Constitution score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution score by 1, to a maximum of 20.
**Forceful.** When you roll a Hit Point Die to regain Hit Points, you can reroll the die and use either total.
**Stay Down.** When you have the Unconscious condition, you can make a DC 10 Constitution saving throw to stabilize yourself.`
    },
    {
        id: 'elemental-adept',
        category: 'Feat',
        title: 'Elemental Adept',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Elemental Mastery.** Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. Your spells of that element ignore Resistance to damage of that type.
**Elemental Cantrip.** When you select this feat, you learn one cantrip of the chosen element.`
    },
    {
        id: 'fey-touched',
        category: 'Feat',
        title: 'Fey Touched',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
Your exposure to the Feywild's magic grants you the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Fey Magic.** Choose one level 1 spell from the Divination or Enchantment school. You always have that spell and Misty Step prepared. You can cast each spell once without a spell slot, regaining the ability when you finish a Long Rest.`
    },
    {
        id: 'grappler',
        category: 'Feat',
        title: 'Grappler',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Grappler.** You have Advantage on attack rolls against a creature you are Grappling.
**Pin.** When you have a creature Grappled, you can use your action to deal 1d6 damage to the creature.`
    },
    {
        id: 'great-weapon-master',
        category: 'Feat',
        title: 'Great Weapon Master',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Heavy Weapon Mastery.** When you hit a creature with a weapon that has the Heavy property as part of the Attack action, you can cause the weapon to deal extra damage equal to your Proficiency Bonus.
**Hew.** Immediately after you score a Critical Hit or reduce a creature to 0 Hit Points with a melee weapon, you can make one attack with the same weapon as a Bonus Action.`
    },
    {
        id: 'heavily-armored',
        category: 'Feat',
        title: 'Heavily Armored',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Medium Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Armor Training.** You gain training with Heavy armor.`
    },
    {
        id: 'heavy-armor-master',
        category: 'Feat',
        title: 'Heavy Armor Master',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Heavy Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Resilient.** While wearing Heavy armor, you have Resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.`
    },
    {
        id: 'inspiring-leader',
        category: 'Feat',
        title: 'Inspiring Leader',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Inspiring Presence.** As a Bonus Action, you can grant yourself and up to five friendly creatures within 30 feet temporary Hit Points equal to your level + your Charisma modifier.`
    },
    {
        id: 'keen-mind',
        category: 'Feat',
        title: 'Keen Mind',
        content: 'Ability Score Increase. Increase your Intelligence score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence score by 1, to a maximum of 20.
**Memory.** You have Advantage on Intelligence (Investigation) and Wisdom (Survival) checks.
**Know-it-all.** You can take the Search action as a Bonus Action.`
    },
    {
        id: 'lightly-armored',
        category: 'Feat',
        title: 'Lightly Armored',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Armor Training.** You gain training with Light armor.`
    },
    {
        id: 'mage-slayer',
        category: 'Feat',
        title: 'Mage Slayer',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Mage Hunter.** When a creature within 5 feet of you casts a spell, you can make an Opportunity Attack against the creature.`
    },
    {
        id: 'martial-weapon-training',
        category: 'Feat',
        title: 'Martial Weapon Training',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Weapon Training.** You gain training with all Martial weapons.`
    },
    {
        id: 'medium-armor-master',
        category: 'Feat',
        title: 'Medium Armor Master',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Medium Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Armor Training.** You gain training with Medium armor.
**Dexterous.** When you wear Medium armor, you can add your Dexterity modifier to your Armor Class.`
    },
    {
        id: 'moderately-armored',
        category: 'Feat',
        title: 'Moderately Armored',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Light Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Armor Training.** You gain training with Medium armor and Shields.`
    },
    {
        id: 'mounted-combatant',
        category: 'Feat',
        title: 'Mounted Combatant',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Mounted Fighter.** While you are mounted, you have Advantage on attack rolls against creatures that are Small or smaller.
**Unseat.** When you hit a creature while mounted and the creature is your size or smaller, you can force the creature to make a Strength saving throw or be knocked Prone.`
    },
    {
        id: 'observant',
        category: 'Feat',
        title: 'Observant',
        content: 'Ability Score Increase. Increase your Intelligence or Wisdom score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence or Wisdom score by 1, to a maximum of 20.
**Quick Study.** You have Proficiency in Investigation and Perception. In addition, you can take the Search action as a Bonus Action.`
    },
    {
        id: 'piercer',
        category: 'Feat',
        title: 'Piercer',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Sundering Strike.** When you hit a creature with a weapon that deals piercing damage, you can deal extra damage equal to your Proficiency Bonus.
**Critical.** When you roll a 20 on a d20 for an attack roll with a piercing weapon, you can roll an extra damage die.`
    },
    {
        id: 'poisoner',
        category: 'Feat',
        title: 'Poisoner',
        content: 'Ability Score Increase. Increase your Intelligence or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence or Dexterity score by 1, to a maximum of 20.
**Poisonous Attack.** When you hit a creature with a weapon attack, you can deal extra poison damage equal to your Proficiency Bonus.
**Poison Master.** You have Proficiency with poisoner's supplies, and you have Resistance to poison damage.`
    },
    {
        id: 'polearm-master',
        category: 'Feat',
        title: 'Polearm Master',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Polearm Attack.** When you take the Attack action and attack with a weapon that has the Heavy and Reach properties, you can use your Bonus Action to make a melee attack with the opposite end of the weapon.
**Lunge.** When you make a melee attack with a polearm, you can deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'resilient',
        category: 'Feat',
        title: 'Resilient',
        content: 'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase one ability score of your choice by 1, to a maximum of 20.
**Save Proficiency.** Gain Proficiency in the saving throw of the ability increased.`
    },
    {
        id: 'ritual-caster',
        category: 'Feat',
        title: 'Ritual Caster',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Ritual Adept.** You know three spells with the Ritual tag, and you can cast them as Rituals without preparing them.`
    },
    {
        id: 'sentinel',
        category: 'Feat',
        title: 'Sentinel',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength or Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Guardian.** Immediately after a creature within 5 feet of you takes the Disengage action or hits a target other than you, you can make an Opportunity Attack against that creature.
**Halt.** When you hit a creature with an Opportunity Attack, the creature's Speed becomes 0 for the rest of the current turn.`
    },
    {
        id: 'shadow-touched',
        category: 'Feat',
        title: 'Shadow Touched',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
Your exposure to the Shadowfell's magic grants you the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Shadow Magic.** Choose one level 1 spell from the Illusion or Necromancy school. You always have that spell and Invisibility prepared. You can cast each spell once without a spell slot, regaining the ability when you finish a Long Rest.`
    },
    {
        id: 'sharpshooter',
        category: 'Feat',
        title: 'Sharpshooter',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Bypass Cover.** Your ranged attacks ignore Half Cover and Three-Quarters Cover.
**Firing in Melee.** Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with ranged weapons.
**Long Shots.** Attacking at long range doesn't impose Disadvantage on your attack rolls with ranged weapons.`
    },
    {
        id: 'shield-master',
        category: 'Feat',
        title: 'Shield Master',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Shield Bash.** When you take the Attack action, you can use your Bonus Action to make a shield bash.
**Protection.** When you are wielding a Shield, you have +2 bonus to AC.`
    },
    {
        id: 'skill-expert',
        category: 'Feat',
        title: 'Skill Expert',
        content: 'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase one ability score of your choice by 1, to a maximum of 20.
**Skill Expertise.** Choose one skill in which you have Proficiency. Your Proficiency Bonus doubles for ability checks with that skill.`
    },
    {
        id: 'skulker',
        category: 'Feat',
        title: 'Skulker',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Hide in Plain Sight.** You can attempt to Hide as a Bonus Action, and you can do so even when only lightly obscured.`
    },
    {
        id: 'slasher',
        category: 'Feat',
        title: 'Slasher',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Sundering Strike.** When you hit a creature with a weapon that deals slashing damage, you can reduce the creature's Speed by 10 feet until the start of your next turn.
**Critical.** When you roll a 20 on a d20 for an attack roll with a slashing weapon, you can roll an extra damage die.`
    },
    {
        id: 'speedy',
        category: 'Feat',
        title: 'Speedy',
        content: 'Ability Score Increase. Increase your Dexterity or Constitution score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity or Constitution score by 1, to a maximum of 20.
**Hustle.** You can take the Dash action as a Bonus Action.
**Second Wind.** As a Bonus Action, you can regain Hit Points equal to 1d10 + your Proficiency Bonus.`
    },
    {
        id: 'spell-sniper',
        category: 'Feat',
        title: 'Spell Sniper',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Bypass Cover.** Your ranged spell attacks ignore Half Cover and Three-Quarters Cover.
**War Caster.** You have Advantage on Constitution saving throws made to maintain Concentration.`
    },
    {
        id: 'telekinetic',
        category: 'Feat',
        title: 'Telekinetic',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Minor Telekinesis.** You learn the Mage Hand spell. You can cast it without Verbal or Somatic components, you can make the spectral hand Invisible, and its range increases by 30 feet.
**Telekinetic Shove.** As a Bonus Action, you can telekinetically shove one creature you can see within 30 feet.`
    },
    {
        id: 'telepathic',
        category: 'Feat',
        title: 'Telepathic',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Telepathy.** You can communicate telepathically with creatures within 60 feet of you.
**Sense Thoughts.** You can cast Detect Thoughts once per Long Rest.`
    },
    {
        id: 'war-caster',
        category: 'Feat',
        title: 'War Caster',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Concentration.** You have Advantage on Constitution saving throws made to maintain Concentration.
**Reactive Spell.** When a creature provokes an Opportunity Attack, you can take a Reaction to cast a spell at the creature.
**Somatic Components.** You can perform the Somatic components of spells even when you have weapons or a Shield in one or both hands.`
    },
    {
        id: 'weapon-master',
        category: 'Feat',
        title: 'Weapon Master',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Weapon Proficiency.** You gain Proficiency with four weapons of your choice.
**Mastery.** Choose one weapon you are proficient with. That weapon gains a Mastery property of your choice.`
    },
    {
        id: 'cold-caster',
        category: 'Feat',
        title: 'Cold Caster',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Frost Cantrip.** You learn the Ray of Frost cantrip.
**Cold Mastery.** When you cast a spell that deals cold damage, you can add your Proficiency Bonus to the damage.`
    },
    {
        id: 'dragonscarred',
        category: 'Feat',
        title: 'Dragonscarred',
        content: 'Ability Score Increase. Increase your Constitution score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution score by 1, to a maximum of 20.
**Dragonscarred Skin.** You have Resistance to one damage type that matches a dragon (choose acid, cold, fire, lightning, or poison).`
    },
    {
        id: 'enclave-magic',
        category: 'Feat',
        title: 'Enclave Magic',
        content: 'Ability Score Increase. Increase your Wisdom score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Wisdom score by 1, to a maximum of 20.
**Enclave Spell.** You learn one Druid cantrip and one level 1 spell from the Druid spell list.`
    },
    {
        id: 'flames-of-phlegethon',
        category: 'Feat',
        title: 'Flames of Phlegethon',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Fire Cantrip.** You learn the Fire Bolt cantrip if you don't already know it.
**Fire Mastery.** When you cast a spell that deals fire damage, you can add your Proficiency Bonus to the damage.`
    },
    {
        id: 'lor不大的法师',
        category: 'Feat',
        title: 'Lor不大的法师',
        content: 'You have Advantage on Intelligence (Arcana) checks.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You have Advantage on Intelligence (Arcana) checks.`
    },
    {
        id: 'menacing',
        category: 'Feat',
        title: 'Menacing',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Menacing Attack.** When you hit a creature with a weapon attack, you can deal extra psychic damage equal to your Proficiency Bonus.`
    },
    {
        id: 'resourceful-shooter',
        category: 'Feat',
        title: 'Resourceful Shooter',
        content: 'You have a number of special rounds equal to your Proficiency Bonus.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You have a number of special rounds equal to your Proficiency Bonus. You can use a bonus action to enhance your ranged weapon attacks with the following effects until the end of your next turn: the attacks ignore half cover and three-quarters cover, and each hit deals an additional 1d6 force damage. You regain your expended special rounds when you finish a Long Rest.`
    },
    {
        id: 'second-chance',
        category: 'Feat',
        title: 'Second Chance',
        content: 'Ability Score Increase. Increase your Dexterity, Constitution, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity, Constitution, or Charisma score by 1, to a maximum of 20.
**Second Chance.** When a creature within 5 feet of you hits you with an attack roll, you can force that creature to reroll the d20 and use the new result. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'silver-tongue',
        category: 'Feat',
        title: 'Silver Tongue',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Silver Tongue.** You have Advantage on Persuasion checks.`
    },
    {
        id: 'squat-specialist',
        category: 'Feat',
        title: 'Squat Specialist',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Squat Stature.** You have Advantage on Strength (Athletics) checks to escape from being Grappled.`
    },
    {
        id: 'warchanter',
        category: 'Feat',
        title: 'Warchanter',
        content: 'Ability Score Increase. Increase your Constitution or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution or Charisma score by 1, to a maximum of 20.
**Warchanter Song.** When you take the Attack action on your turn, you can use a Bonus Action to start a Warchanter Song. The song lasts for 1 minute and gives you and allies within 30 feet who can hear you a +1 bonus to attack rolls. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'ally-of-shadow',
        category: 'Feat',
        title: 'Ally of Shadow',
        content: 'Ability Score Increase. Increase your Intelligence or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence or Charisma score by 1, to a maximum of 20.
**Darkness.** You learn the Darkness spell and can cast it at 2nd level without using a spell slot.
**Shadow Step.** As a Bonus Action, you can teleport up to 30 feet to an unoccupied space in dim light or darkness.`
    },
    {
        id: 'bane-of-the-stars',
        category: 'Feat',
        title: 'Bane of the Stars',
        content: 'You have Advantage on attack rolls against celestials, fiends, and undead.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on attack rolls against celestials, fiends, and undead.`
    },
    {
        id: 'bear-bpeaker',
        category: 'Feat',
        title: 'Bear-bpeaker',
        content: 'You have Advantage on Wisdom (Animal Handling) checks.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Wisdom (Animal Handling) checks.`
    },
    {
        id: 'black-water-breath',
        category: 'Feat',
        title: 'Black Water Breath',
        content: 'You can hold your breath for 1 hour.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can hold your breath for 1 hour.`
    },
    {
        id: 'cat-footed',
        category: 'Feat',
        title: 'Cat-footed',
        content: 'You can take the Dodge action as a Bonus Action.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can take the Dodge action as a Bonus Action.`
    },
    {
        id: 'dreamspeaker',
        category: 'Feat',
        title: 'Dreamspeaker',
        content: 'You have Advantage on Wisdom (Survival) checks while in deserts.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Wisdom (Survival) checks while in deserts.`
    },
    {
        id: 'elder-fiend',
        category: 'Feat',
        title: 'Elder Fiend',
        content: 'You have Resistance to psychic damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefi
You have Resistance to psychic damage.`
    },
    {
        id: 'fey-barrier',
        category: 'Feat',
        title: 'Fey Barrier',
        content: 'You have Resistance to force damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Resistance to force damage.`
    },
    {
        id: 'ghost-step',
        category: 'Feat',
        title: 'Ghost Step',
        content: 'As a Bonus Action, you can become incorporeal until the end of your next turn.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
As a Bonus Action, you can become incorporeal until the end of your next turn.`
    },
    {
        id: 'iron-hands',
        category: 'Feat',
        title: 'Iron Hands',
        content: 'Your Unarmed Strikes deal 1d6 damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
Your Unarmed Strikes deal 1d6 damage.`
    },
    {
        id: 'iron-mind',
        category: 'Feat',
        title: 'Iron Mind',
        content: 'You have Proficiency in Intelligence saving throws.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Proficiency in Intelligence saving throws.`
    },
    {
        id: 'master-of-disguise',
        category: 'Feat',
        title: 'Master of Disguise',
        content: 'You have Proficiency in Deception and Performance.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Proficiency in Deception and Performance.`
    },
    {
        id: 'pathfinder',
        category: 'Feat',
        title: 'Pathfinder',
        content: 'You can use a Bonus Action to become immune to the charmed and frightened conditions for 1 minute.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can use a Bonus Action to become immune to the charmed and frightened conditions for 1 minute.`
    },
    {
        id: 'rune-stalker',
        category: 'Feat',
        title: 'Rune Stalker',
        content: 'You have Advantage on Wisdom (Survival) checks to track creatures.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Wisdom (Survival) checks to track creatures.`
    },
    {
        id: 'scar-beast',
        category: 'Feat',
        title: 'Scar-beast',
        content: 'You have Resistance to piercing damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Resistance to piercing damage.`
    },
    {
        id: 'spell-stealer',
        category: 'Feat',
        title: 'Spell Stealer',
        content: 'When you reduce a creature to 0 Hit Points, you can steal a spell that creature knew.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
When you reduce a creature to 0 Hit Points, you can steal a spell that creature knew.`
    },
    {
        id: 'storm-step',
        category: 'Feat',
        title: 'Storm Step',
        content: 'You can take the Dash action as a Bonus Action.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can take the Dash action as a Bonus Action.`
    },
    {
        id: 'suspend-reality',
        category: 'Feat',
        title: 'Suspend Reality',
        content: 'As an Action, you can cause up to three creatures you can see within 60 feet to be paralyzed.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
As an Action, you can cause up to three creatures you can see within 60 feet to be paralyzed. Each target must succeed on a Wisdom saving throw (DC 10 + your Proficiency Bonus + your Charisma modifier) or be paralyzed for 1 minute. A paralyzed creature can make a Wisdom saving throw at the end of each of its turns, ending the effect on itself on a success. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'undead-spawn',
        category: 'Feat',
        title: 'Undead Spawn',
        content: 'When you kill a creature with a melee weapon attack, you can cause it to rise as a zombie.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
When you kill a creature with a melee weapon attack, you can cause it to rise as a zombie under your control. The zombie has a number of Hit Dice equal to your Proficiency Bonus, and it obeys your commands. You can have a number of zombies equal to your Proficiency Bonus at one time. You regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'war-tutor',
        category: 'Feat',
        title: 'War Tutor',
        content: 'When you hit a creature with a weapon attack, you can deal extra damage equal to your Proficiency Bonus.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
When you hit a creature with a weapon attack, you can deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'wild-editor',
        category: 'Feat',
        title: 'Wild Editor',
        content: 'You have Advantage on Charisma (Deception) checks to pass yourself off as a different person.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Charisma (Deception) checks to pass yourself off as a different person.`
    },
    {
        id: 'wind-tamer',
        category: 'Feat',
        title: 'Wind Tamer',
        content: 'You have Resistance to lightning damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Resistance to lightning damage.`
    },
    {
        id: 'archery',
        category: 'Feat',
        title: 'Archery',
        content: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
You gain a +2 bonus to attack rolls you make with ranged weapons.`
    },
    {
        id: 'defense',
        category: 'Feat',
        title: 'Defense',
        content: 'While you are wearing armor, you gain a +1 bonus to AC.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
While you are wearing armor, you gain a +1 bonus to AC.`
    },
    {
        id: 'dueling',
        category: 'Feat',
        title: 'Dueling',
        content: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.`
    },
    {
        id: 'great-weapon-fighting',
        category: 'Feat',
        title: 'Great Weapon Fighting',
        content: 'When you roll a 1 or 2 on a damage die for an attack you make with a two-handed weapon, you can reroll the die.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When you roll a 1 or 2 on a damage die for an attack you make with a two-handed weapon, you can reroll the die and must use the new roll.`
    },
    {
        id: 'two-weapon-fighting',
        category: 'Feat',
        title: 'Two-Weapon Fighting',
        content: 'When you make an extra attack as a result of using a weapon with the Light property, you can add your ability modifier to the damage of that attack.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When you make an extra attack as a result of using a weapon with the Light property, you can add your ability modifier to the damage of that attack if that attack is with a crossbow that has the Light property.`
    },
    {
        id: 'thrown-weapon-fighting',
        category: 'Feat',
        title: 'Thrown Weapon Fighting',
        content: 'You can draw a weapon that has the Thrown property as part of the attack you make with the weapon.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
You can draw a weapon that has the Thrown property as part of the attack you make with the weapon. In addition, your ranged attacks with thrown weapons deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'unarmed-fighting',
        category: 'Feat',
        title: 'Unarmed Fighting',
        content: 'Your Unarmed Strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
Your Unarmed Strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier on a hit. If you are not holding a shield or weapon, you can deal 1d8 damage instead. When you hit a grappled creature with an Unarmed Strike, you can deal bludgeoning damage equal to 1d6 + your Strength modifier, and the target must succeed on a Constitution saving throw (DC 8 + your Proficiency Bonus + your Strength modifier) or be stunned until the end of your next turn.`
    },
    {
        id: 'protection',
        category: 'Feat',
        title: 'Protection',
        content: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield to use this benefit.`
    },
    {
        id: 'interception',
        category: 'Feat',
        title: 'Interception',
        content: 'When a creature you can see hits a target within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When a creature you can see hits a target within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your Proficiency Bonus. You must be wielding a shield or a simple or martial weapon to use this benefit.`
    },
    {
        id: 'blind-fighting',
        category: 'Feat',
        title: 'Blind Fighting',
        content: 'You have blindsight with a range of 10 feet.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total darkness, even if you're blinded. You can also see invisible creatures within that range.`
    },
    {
        id: 'boon-of-dimensional-travel',
        category: 'Feat',
        title: 'Boon of Dimensional Travel',
        content: 'You can cast Misty Step without expending a spell slot.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You can cast Misty Step without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'boon-of-energy-resistance',
        category: 'Feat',
        title: 'Boon of Energy Resistance',
        content: 'You have Resistance to two damage types of your choice.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You have Resistance to two damage types of your choice. You can change the chosen damage types when you finish a Long Rest.`
    },
    {
        id: 'boon-of-fate',
        category: 'Feat',
        title: 'Boon of Fate',
        content: 'Once per turn, when you roll a d20, you can force the roll to be a 20.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Once per turn, when you roll a d20, you can force the roll to be a 20.`
    },
    {
        id: 'boon-of-fortitude',
        category: 'Feat',
        title: 'Boon of Fortitude',
        content: 'Your Hit Point maximum increases by 40.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Your Hit Point maximum increases by 40, and your Constitution score increases by 2 (to a maximum of 22). In addition, whenever you receive healing, you regain twice as many Hit Points as normal.`
    },
    {
        id: 'boon-of-irresistible-offense',
        category: 'Feat',
        title: 'Boon of Irresistible Offense',
        content: 'Your attacks ignore all damage resistances.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Your attacks ignore all damage resistances.`
    },
    {
        id: 'boon-of-recovery',
        category: 'Feat',
        title: 'Boon of Recovery',
        content: 'You can heal yourself as a Bonus Action.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You can heal yourself as a Bonus Action. You regain a number of Hit Points equal to half your Hit Point maximum. You can use this benefit once per Long Rest.`
    },
    {
        id: 'boon-of-skill',
        category: 'Feat',
        title: 'Boon of Skill',
        content: 'You gain Proficiency in all skills.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You gain Proficiency in all skills, and you can choose one skill to gain Expertise.`
    },
    {
        id: 'boon-of-speed',
        category: 'Feat',
        title: 'Boon of Speed',
        content: 'Your walking speed increases by 30 feet.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Your walking speed increases by 30 feet. In addition, you can take the Dash action as a Bonus Action.`
    },
    {
        id: 'boon-of-spell-recall',
        category: 'Feat',
        title: 'Boon of Spell Recall',
        content: 'You can cast any spell you know or have prepared without expending a spell slot.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You can cast any spell you know or have prepared without expending a spell slot. Once you use this benefit, you must succeed on a DC 10 Constitution saving throw to use it again.`
    },
    {
        id: 'boon-of-truesight',
        category: 'Feat',
        title: 'Boon of Truesight',
        content: 'You have Truesight with a range of 60 feet.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You have Truesight with a range of 60 feet. Within that range, you can see creatures and objects that are invisible, on the Ethereal Plane, or hidden by illusion or magical disguise.`
    },
    {
        id: 'aberrant-dragonmark',
        category: 'Feat',
        title: 'Aberrant Dragonmark',
        content: 'You learn a level 1 spell from the Sorcerer spell list.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You learn a level 1 spell from the Sorcerer spell list. You always have that spell prepared, and you can cast it once without a spell slot. You regain the ability to cast it when you finish a Long Rest.`
    },
    {
        id: 'dragonmark-of Scribing',
        category: 'Feat',
        title: 'Dragonmark of Scribing',
        content: 'You know the Message cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Message cantrip. When you cast it, targets have a +2 bonus to their Wisdom saving throw.`
    },
    {
        id: 'dragonmark-of-sentinels',
        category: 'Feat',
        title: 'Dragonmark of Sentinels',
        content: 'You know the Blade Ward spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Blade Ward spell. When you cast it, you gain a +2 bonus to your Armor Class until the start of your next turn.`
    },
    {
        id: 'dragonmark-of-death',
        category: 'Feat',
        title: 'Dragonmark of Death',
        content: 'You know the Spare the Dying cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Spare the Dying cantrip. When you cast it, the target regains 1 Hit Point.`
    },
    {
        id: 'dragonmark-of-detection',
        category: 'Feat',
        title: 'Dragonmark of Detection',
        content: 'You know the Detect Magic cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Detect Magic cantrip. When you cast it, you can sense the presence of traps within 30 feet of you.`
    },
    {
        id: 'dragonmark-of-findings',
        category: 'Feat',
        title: 'Dragonmark of Findings',
        content: 'You know the Light cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Light cantrip. When you cast it, you can make the light dimmer or brighter.`
    },
    {
        id: 'dragonmark-of-hand',
        category: 'Feat',
        title: 'Dragonmark of Hand',
        content: 'You know the Spare the Dying cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Spare the Dying cantrip. When you cast it, the target regains 1 Hit Point.`
    },
    {
        id: 'dragonmark-of-healing',
        category: 'Feat',
        title: 'Dragonmark of Healing',
        content: 'You know the Cure Wounds spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Cure Wounds spell. When you cast it, you can target one creature within 5 feet of you.`
    },
    {
        id: 'dragonmark-of-hospitality',
        category: 'Feat',
        title: 'Dragonmark of Hospitality',
        content: 'You know the Prestidigitation cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Prestidigitation cantrip. When you cast it, you can create a comfortable area of 10 feet.`
    },
    {
        id: 'dragonmark-of-making',
        category: 'Feat',
        title: 'Dragonmark of Making',
        content: 'You know the Mending cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Mending cantrip. When you cast it, you can repair an object of up to 1 pound of damage.`
    },
    {
        id: 'dragonmark-of-passage',
        category: 'Feat',
        title: 'Dragonmark of Passage',
        content: 'You know the Blade Ward spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Blade Ward spell. When you cast it, you gain a +2 bonus to your Armor Class until the start of your next turn.`
    },
    {
        id: 'dragonmark-of-recovery',
        category: 'Feat',
        title: 'Dragonmark of Recovery',
        content: 'You know the Spare the Dying cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Spare the Dying cantrip. When you cast it, the target regains 1 Hit Point.`
    },
    {
        id: 'dragonmark-of-scribing',
        category: 'Feat',
        title: 'Dragonmark of Scribing',
        content: 'You know the Message cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Message cantrip. When you cast it, targets have a +2 bonus to their Wisdom saving throw.`
    },
    {
        id: 'dragonmark-of-detection',
        category: 'Feat',
        title: 'Dragonmark of Detection',
        content: 'You know the Detect Magic cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Detect Magic cantrip. When you cast it, you can sense the presence of traps within 30 feet of you.`
    },
    {
        id: 'dragonmark-of-storms',
        category: 'Feat',
        title: 'Dragonmark of Storms',
        content: 'You know the Lightning Lure cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Lightning Lure cantrip. When you cast it, you can target one creature.`
    },
    {
        id: 'dragonmark-of-warding',
        category: 'Feat',
        title: 'Dragonmark of Warding',
        content: 'You know the Shield of Faith spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Shield of Faith spell. When you cast it, you can target yourself only.`
    },
    {
        id: 'dragonmark-of-waves',
        category: 'Feat',
        title: 'Dragonmark of Waves',
        content: 'You know the Shape Water cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Shape Water cantrip. When you cast it, you can create a small whirlpool.`
    },
    {
        id: 'dragonmark-of-shadow',
        category: 'Feat',
        title: 'Dragonmark of Shadow',
        content: 'You know the Minor Illusion cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Minor Illusion cantrip. When you cast it, you can create a silent image.`
    },
    {
        id: 'greater-dragonmark-of-finding',
        category: 'Feat',
        title: 'Greater Dragonmark of Finding',
        content: 'You can cast Locate Object without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Aberrant Dragonmark


### Benefit
You can cast Locate Object without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-scribing',
        category: 'Feat',
        title: 'Greater Dragonmark of Scribing',
        content: 'You can cast Detect Magic at will.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Scribing


### Benefit
You can cast Detect Magic at will, without expending a spell slot.`
    },
    {
        id: 'greater-dragonmark-of-sentinels',
        category: 'Feat',
        title: 'Greater Dragonmark of Sentinels',
        content: 'You can cast Shield without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Sentinels


### Benefit
You can cast Shield without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-death',
        category: 'Feat',
        title: 'Greater Dragonmark of Death',
        content: 'You can cast Speak with Dead without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Death


### Benefit
You can cast Speak with Dead without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-healing',
        category: 'Feat',
        title: 'Greater Dragonmark of Healing',
        content: 'You can cast Cure Wounds without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Healing


### Benefit
You can cast Cure Wounds without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-passage',
        category: 'Feat',
        title: 'Greater Dragonmark of Passage',
        content: 'You can cast Misty Step without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Passage


### Benefit
You can cast Misty Step without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-storms',
        category: 'Feat',
        title: 'Greater Dragonmark of Storms',
        content: 'You can cast Shocking Grasp without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Storms


### Benefit
You can cast Shocking Grasp without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-waves',
        category: 'Feat',
        title: 'Greater Dragonmark of Waves',
        content: 'You can cast Create or Destroy Water without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Waves


### Benefit
You can cast Create or Destroy Water without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-warding',
        category: 'Feat',
        title: 'Greater Dragonmark of Warding',
        content: 'You can cast Protection from Evil and Good without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Warding


### Benefit
You can cast Protection from Evil and Good without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-shadow',
        category: 'Feat',
        title: 'Greater Dragonmark of Shadow',
        content: 'You can cast Pass without Trace without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Shadow


### Benefit
You can cast Pass without Trace without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-hospitality',
        category: 'Feat',
        title: 'Greater Dragonmark of Hospitality',
        content: 'You can cast Locate Object without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Hospitality


### Benefit
You can cast Locate Object without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-making',
        category: 'Feat',
        title: 'Greater Dragonmark of Making',
        content: 'You can cast Detect Magic without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Making


### Benefit
You can cast Detect Magic without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-detection',
        category: 'Feat',
        title: 'Greater Dragonmark of Detection',
        content: 'You can cast Detect Magic without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Detection


### Benefit
You can cast Detect Magic without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-recovery',
        category: 'Feat',
        title: 'Greater Dragonmark of Recovery',
        content: 'You can cast Lesser Restoration without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Recovery


### Benefit
You can cast Lesser Restoration without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-hand',
        category: 'Feat',
        title: 'Greater Dragonmark of Hand',
        content: 'You can cast Mending without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Hand


### Benefit
You can cast Mending without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-death',
        category: 'Feat',
        title: 'Greater Dragonmark of Death',
        content: 'You can cast Speak with Dead without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Death


### Benefit
You can cast Speak with Dead without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-storms',
        category: 'Feat',
        title: 'Greater Dragonmark of Storms',
        content: 'You can cast Shocking Grasp without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Storms


### Benefit
You can cast Shocking Grasp without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-scribing',
        category: 'Feat',
        title: 'Greater Dragonmark of Scribing',
        content: 'You can cast Detect Magic at will.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Scribing


### Benefit
You can cast Detect Magic at will, without expending a spell slot.`
    },
    {
        id: 'greater-dragonmark-of-passage',
        category: 'Feat',
        title: 'Greater Dragonmark of Passage',
        content: 'You can cast Misty Step without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Passage


### Benefit
You can cast Misty Step without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-waves',
        category: 'Feat',
        title: 'Greater Dragonmark of Waves',
        content: 'You can cast Create or Destroy Water without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Waves


### Benefit
You can cast Create or Destroy Water without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-warding',
        category: 'Feat',
        title: 'Greater Dragonmark of Warding',
        content: 'Stoneskin',
        fullInfo: `Greater Dragonmark Feat.

Benefit: **Stoneskin.** You can cast Stoneskin once per Long Rest.`
    },
    {
        id: 'potent-dragonmark',
        category: 'Feat',
        title: 'Potent Dragonmark',
        content: 'Arcane Injection',
        fullInfo: `Greater Dragonmark Feat.

Benefit: **Arcane Injection.** When you cast a spell, you can deal extra force damage equal to your Proficiency Bonus.`
    }
];
