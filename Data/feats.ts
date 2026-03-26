
import { Feat } from '../types';

export const FEAT_OPTIONS: Feat[] = [
    // --- ORIGIN FEATS (Level 1) ---
    { 
        name: 'Alert', 
        category: 'Origin', 
        level: 1, 
        description: 'Initiative Proficiency and Initiative Swap (with a willing ally).' 
    },
    { 
        name: 'Lucky', 
        category: 'Origin', 
        level: 1, 
        description: 'Luck Points equal to Proficiency Bonus to gain Advantage or impose Disadvantage.' 
    },
    { 
        name: 'Savage Attacker', 
        category: 'Origin', 
        level: 1, 
        description: 'Roll weapon damage dice twice and use the higher total (once per turn).' 
    },
    { 
        name: 'Crafter', 
        category: 'Origin', 
        level: 1, 
        description: 'Tool Proficiency with 3 Artisan Tools, 20% discount on nonmagical items, and Fast Crafting.' 
    },
    { 
        name: 'Tough', 
        category: 'Origin', 
        level: 1, 
        description: 'HP maximum increases by 2 per level.' 
    },
    { 
        name: 'Skilled', 
        category: 'Origin', 
        level: 1, 
        description: 'Proficiency in any combination of three Skills or Tools.' 
    },
    { 
        name: 'Healer', 
        category: 'Origin', 
        level: 1, 
        description: 'Battle Medic (spend Hit Die to heal) and reroll 1s on healing dice.' 
    },
    { 
        name: 'Magic Initiate (Cleric)', 
        category: 'Origin', 
        level: 1, 
        description: '2 Cleric cantrips and 1 level 1 Cleric spell (Wisdom).' 
    },
    { 
        name: 'Magic Initiate (Druid)', 
        category: 'Origin', 
        level: 1, 
        description: '2 Druid cantrips and 1 level 1 Druid spell (Wisdom).' 
    },
    { 
        name: 'Magic Initiate (Wizard)', 
        category: 'Origin', 
        level: 1, 
        description: '2 Wizard cantrips and 1 level 1 Wizard spell (Intelligence).' 
    },
    { 
        name: 'Tavern Brawler', 
        category: 'Origin', 
        level: 1, 
        description: 'Enhanced Unarmed Strike (1d4), push 5 feet on hit, and proficiency with Improvised Weapons.' 
    },
    { 
        name: 'Musician', 
        category: 'Origin', 
        level: 1, 
        description: 'Instrument Training (3 tools) and Inspiring Song (grant Heroic Inspiration during rests).' 
    },

    // --- GENERAL FEATS (Level 4+) ---
    { 
        name: 'Ability Score Improvement', 
        category: 'General', 
        level: 4, 
        description: 'Increase one ability score of your choice by 2, or increase two different ability scores of your choice by 1.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Athlete', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Climb Speed, standing up costs 5ft, and jump distance increase.',
        asi: ['STR', 'DEX'] 
    },
    { 
        name: 'Actor', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Cha 13+', 
        description: 'Advantage on Deception/Performance to pass as another, and mimicry.',
        asi: ['CHA']
    },
    { 
        name: 'Charger', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: '+10ft speed on Dash, and extra 1d8 damage or 10ft push after moving 10ft.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Crusher', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Con 13+', 
        description: 'Shove 5ft on bludgeoning hit, advantage on critical hit damage.',
        asi: ['STR', 'CON']
    },
    { 
        name: 'Chef', 
        category: 'General', 
        level: 4, 
        description: 'Cook special food that grants extra healing during rests and treats for temporary HP.',
        asi: ['CON', 'WIS']
    },
    { 
        name: 'Crossbow Expert', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Dex 13+', 
        description: 'Ignore Loading, fire in melee without disadvantage, and bonus attack with Hand Crossbow.',
        asi: ['DEX']
    },
    { 
        name: 'Defensive Duelist', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Dex 13+', 
        description: 'Use reaction to add Proficiency Bonus to AC when hit with melee attack while using Finesse weapon.',
        asi: ['DEX']
    },
    { 
        name: 'Dual Wielder', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Two-Weapon Fighting with non-Light weapons, +1 AC while dual wielding.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Durable', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Con 13+', 
        description: 'Advantage on Death saves, and bonus action to expend Hit Die to heal.',
        asi: ['CON']
    },
    { 
        name: 'Elemental Adept', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Spellcasting/Pact Magic', 
        description: 'Bypass resistance of chosen damage type and treat 1s on damage dice as 2s.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Fey Touched', 
        category: 'General', 
        level: 4, 
        description: 'Learn Misty Step and one Divination or Enchantment spell (level 1).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Grappler', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Grapple as part of Unarmed Strike, and Advantage on attacks against grappled targets.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Great Weapon Master', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str 13+', 
        description: 'Bonus damage equal to Prof Bonus on hit with Heavy weapons, and bonus attack on Crit/Kill.',
        asi: ['STR']
    },
    { 
        name: 'Heavily Armored', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Medium Armor Proficiency', 
        description: 'Proficiency with Heavy Armor.',
        asi: ['STR', 'CON']
    },
    { 
        name: 'Heavy Armor Master', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Heavy Armor Proficiency', 
        description: 'B/P/S damage reduction equal to Prof Bonus while wearing Heavy Armor.',
        asi: ['STR', 'CON']
    },
    { 
        name: 'Inspirational Leader', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Wis or Cha 13+', 
        description: 'Grant Temporary HP (Level + Mod) to allies with a speech.',
        asi: ['WIS', 'CHA']
    },
    { 
        name: 'Keen Mind', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Int 13+', 
        description: 'Expertise in a lore skill, and Study action as Bonus Action.',
        asi: ['INT']
    },
    { 
        name: 'Lightly Armored', 
        category: 'General', 
        level: 4, 
        description: 'Proficiency with Light Armor, Medium Armor, and Shields.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Mage Slayer', 
        category: 'General', 
        level: 4, 
        description: 'Disadvantage on concentration saves for enemies you hit, and automatic success on one failed Mental save per day.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Martial Weapon Training', 
        category: 'General', 
        level: 4, 
        description: 'Proficiency with all Martial Weapons.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Medium Armor Master', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Medium Armor Proficiency', 
        description: 'No Stealth disadvantage in medium armor, and max Dex bonus to AC increases to 3.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Moderately Armored', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Light Armor Proficiency', 
        description: 'Proficiency with Medium Armor and Shields.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Mounted Combatant', 
        category: 'General', 
        level: 4, 
        description: 'Advantage on melee attacks vs smaller unmounted targets, and redirect damage from mount.',
        asi: ['STR', 'DEX', 'WIS']
    },
    { 
        name: 'Observant', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Int or Wis 13+', 
        description: 'Expertise in Perception/Investigation, and Search action as Bonus Action.',
        asi: ['INT', 'WIS']
    },
    { 
        name: 'Piercer', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Reroll one piercing damage die, extra die on critical hit.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Polearm Master', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Bonus d4 attack with butt of polearm, and opportunity attack when entering reach.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Resilient', 
        category: 'General', 
        level: 4, 
        description: 'Proficiency in saving throws of the naturally increased ability score.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Ritual Caster', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Int, Wis, or Cha 13+', 
        description: 'Cast rituals from any list, and quick ritual (standard time) once per day.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Sentinel', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Reaction attack when enemy attacks ally, and stop enemy movement on opportunity hit.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Shadow Touched', 
        category: 'General', 
        level: 4, 
        description: 'Learn Invisibility and one Illusion or Necromancy spell (level 1).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Sharpshooter', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Dex 13+', 
        description: 'Ignore Cover, no disadvantage at long range, and fire in melee without disadvantage.',
        asi: ['DEX']
    },
    { 
        name: 'Shield Master', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Shield Proficiency', 
        description: 'Bonus action Shove, add shield AC to Dex saves vs single target effects, and reaction Evasion.',
        asi: ['STR']
    },
    { 
        name: 'Skill Expert', 
        category: 'General', 
        level: 4, 
        description: 'One proficiency and one Expertise.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Slasher', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Str or Dex 13+', 
        description: 'Reduce speed on slashing hit, impose disadvantage on next attack with crit.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Speedy', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Dex or Con 13+', 
        description: '+10ft speed, ignore difficult terrain on Dash, and no Opportunity Attacks after moving away.',
        asi: ['DEX', 'CON']
    },
    { 
        name: 'Spell Sniper', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Spellcasting/Pact Magic', 
        description: 'Ignore Cover, double spell range, and no disadvantage in melee for spell attacks.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Telekinetic', 
        category: 'General', 
        level: 4, 
        description: 'Mage Hand (invisible) and bonus action telekinetic shove (5ft).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Telepathic', 
        category: 'General', 
        level: 4, 
        description: '60ft telepathy and Detect Thoughts 1/day.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'War Caster', 
        category: 'General', 
        level: 4, 
        prerequisite: 'Spellcasting/Pact Magic', 
        description: 'Advantage on concentration saves and cast spells as opportunity attacks.',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Weapon Master', 
        category: 'General', 
        level: 4, 
        description: 'Learn 3 Weapon Masteries, and change one during rests. Gain all weapon proficiencies.',
        asi: ['STR', 'DEX']
    },

    // --- FIGHTING STYLE FEATS (Level 1) ---
    { name: 'Archery', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: '+2 bonus to attack rolls with Ranged weapons.' },
    { name: 'Defense', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: '+1 bonus to AC while wearing armor.' },
    { name: 'Dueling', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: '+2 bonus to damage with one-handed melee weapon.' },
    { name: 'Great Weapon Fighting', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Reroll 1s and 2s on damage dice with two-handed weapons.' },
    { name: 'Two-Weapon Fighting', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Add ability modifier to second attack damage.' },
    { name: 'Thrown Weapon Fighting', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Draw as part of attack, +2 damage on hits.' },
    { name: 'Unarmed Fighting', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Unarmed strike is 1d6 (d8 if empty handed) + Str. Bonus damage to grappled targets.' },
    { name: 'Protection', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Impose Disadvantage on attack vs ally while using shield.' },
    { name: 'Interception', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Reduce damage to nearby ally (1d10 + Prof) using shield/weapon.' },
    { name: 'Blind Fighting', category: 'Fighting Style', level: 1, prerequisite: 'Fighting Style Feature', description: 'Blindsight 10ft.' },

    // --- EPIC BOON FEATS (Level 19) ---
    { 
        name: 'Boon of Dimensional Travel', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Unlimited Misty Step (recharge on Initiative or Short Rest).',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Boon of Energy Resistance', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Resistance to two damage types, changeable during rests.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Boon of Fate', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Add or subtract 2d4 to any d20 Test within 60ft (1/turn).',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Boon of Fortitude', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'HP maximum increases by 40, and gain Con mod to any healing received.',
        asi: ['CON']
    },
    { 
        name: 'Boon of Irresistible Offense', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Your attacks ignore all damage resistances.',
        asi: ['STR', 'DEX']
    },
    { 
        name: 'Boon of Recovery', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Bonus action to heal half max HP (1/Long Rest), and drop to 1 HP instead of 0 (1/Long Rest).',
        asi: ['CON']
    },
    { 
        name: 'Boon of Skill', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Proficiency in all Skills, and one Expertise.',
        asi: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    },
    { 
        name: 'Boon of Speed', 
        category: 'Epic Boon', 
        level: 19, 
        description: '+30ft speed, and Bonus Action Disengage.',
        asi: ['DEX']
    },
    { 
        name: 'Boon of Spell Recall', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Cast level 1-4 spells without slots (25% chance to retain use).',
        asi: ['INT', 'WIS', 'CHA']
    },
    { 
        name: 'Boon of Truesight', 
        category: 'Epic Boon', 
        level: 19, 
        description: 'Gain Truesight 60ft.',
        asi: ['WIS']
    }
];

export const GENERIC_FEATURES: Record<string, string> = {
  "Rage": "Entras en furia como Acción Adicional (BA). Ganas resistencia a B/P/S, bono al daño de Fuerza y ventaja en pruebas de Fuerza. Dura hasta el final de tu siguiente turno o 10 min si se extiende (atacando, forzando salvación o usando BA).",
  "Unarmored Defense": "Sin armadura, tu CA es 10 + DEX + CON. Se puede usar escudo.",
  "Weapon Mastery": "Dominas las propiedades de maestría (como Cleave, Push, Slow) de armas elegidas.",
  "Danger Sense": "Ventaja en salvaciones de Destreza que puedas ver (no aplica si estás incapacitado).",
  "Reckless Attack": "Ganas ventaja en ataques de Fuerza, pero los ataques contra ti tienen ventaja hasta tu siguiente turno.",
  "Primal Knowledge": "Ganas competencia en otra habilidad de la lista de bárbaro. Mientras estás en furia, puedes usar tu Fuerza para pruebas de Acrobacias, Intimidación, Percepción, Sigilo o Supervivencia.",
  "Fast Movement": "Tu velocidad aumenta 10 pies si no llevas armadura pesada.",
  "Feral Instinct": "Ventaja en tiradas de Iniciativa.",
  "Instinctive Pounce": "Como parte de la Acción Adicional para entrar en furia, puedes moverte hasta la mitad de tu velocidad.",
  "Brutal Strike": "Al usar Ataque Temerario, puedes renunciar a la ventaja para infligir +1d10 daño y un efecto: Forceful Blow (empujar 15ft y seguirlo) o Hamstring Blow (reducir velocidad 15ft).",
  "Relentless Rage": "Si caes a 0 HP en furia, CD 10 CON para volver a 2x nivel de bárbaro HP. La CD sube +5 por uso.",
  "Persistent Rage": "Al tirar iniciativa, recuperas un uso de furia (1/Long Rest). La furia dura 10 minutos sin necesidad de extensión.",
  "Indomitable Might": "Si el total de tu prueba de Fuerza es menor a tu puntuación de Fuerza, puedes usar la puntuación en su lugar.",
  "Primal Champion": "Tu Fuerza y Constitución aumentan en 4, hasta un máximo de 25.",
  "Bardic Inspiration": "Acción Adicional: Inspira a un aliado a 60 pies (d6 escala a d8/d10/d12). El aliado puede añadir el dado a una prueba fallida de d20 durante la próxima hora.",
  "Jack of All Trades": "Añade la mitad de tu bonificador por competencia (redondeado hacia abajo) a cualquier prueba de característica que no use ya tu bonificador.",
  "Font of Inspiration": "Recuperas todos los usos de Inspiración tras un descanso corto o largo. Puedes gastar un espacio de conjuro para recuperar un uso (sin acción).",
  "Countercharm": "Reacción: Si tú o un aliado a 30 pies falláis una salvación contra Encantado o Asustado, obligas a repetir la tirada con Ventaja.",
  "Magical Secrets": "Rediseñado 2024: Cuando preparas conjuros, puedes elegir conjuros de las listas de Bardo, Clérigo, Druida o Mago si son de un nivel para el que tengas espacios.",
  "Superior Inspiration": "Al tirar iniciativa, si tienes menos de dos usos de Inspiración de Bardo, recuperas hasta tener dos.",
  "Words of Creation": "Siempre tienes preparados Power Word Heal y Power Word Kill. Puedes afectar a una segunda criatura a 10 pies del objetivo principal.",
  "Divine Order": "Nivel 1. Eliges tu vocación sagrada: Protector (Armas marciales y armadura pesada) o Taumaturgo (Bono a Arcana/Religión y un truco extra).",
  "Channel Divinity": "Capacidad de canalizar energía divina para efectos mágicos. Tienes 2 usos (más a niveles altos) que se recuperan tras un descanso corto o largo.",
  "Divine Spark": "Canalizar Divinidad: Acción Mágica. A 30 pies, cura 1d8+mod o inflige 1d8+mod daño Radiante/Necrótico (CD CON). El dado escala a niveles 7, 13 y 18.",
  "Turn Undead": "Canalizar Divinidad: Acción Mágica. Los no-muertos a 30 pies deben salvar Sabiduría o quedar Incapacitados and Asustados durante 1 minuto.",
  "Sear Undead": "Nivel 5. Al usar Turn Undead, los no-muertos que fallen la salvación reciben daño Radiante igual a dados d8 sumados (tu mod Sabiduría).",
  "Blessed Strikes": "Nivel 7. Elige entre Divine Strike (1d8 daño extra en ataques con arma) o Potent Spellcasting (suma Sabiduría al daño de trucos).",
  "Divine Intervention": "Nivel 10. Acción Mágica: Eliges un conjuro de clérigo de nivel 5 o menos (sin reacción) y lo lanzas gratis sin componentes ni espacio. 1/Long Rest.",
  "Improved Blessed Strikes": "Nivel 14. Divine Strike sube a 2d8 daño. Potent Spellcasting ahora también otorga THP (2x mod Sab) al lanzar un truco que dañe.",
  "Greater Divine Intervention": "Nivel 20. Al usar Divine Intervention, puedes elegir lanzar el hechizo Wish (Deseo). Tras usarlo, debes esperar 2d4 descansos largos para repetir.",
  "Druidic": "Conoces el lenguaje secreto de los druidas. Además, siempre tienes preparado el conjuro Hablar con los Animales.",
  "Primal Order": "Nivel 1. Eliges tu rol: Mago (truco extra y bono a Arcana/Naturaleza) o Guardián (armadura media y armas marciales).",
  "Wild Shape": "Nivel 2. Acción Adicional: Te transformas en una Bestia conocida. Ganas THP igual a tu nivel de Druida. La transformación dura horas (nivel / 2).",
  "Wild Companion": "Nivel 2. Acción Mágica: Gasta un uso de Forma Salvaje para lanzar Find Familiar sin componentes materiales.",
  "Wild Resurgence": "Nivel 5. 1/turno: Gasta un espacio de conjuro para ganar un uso de Forma Salvaje (sin acción). O gasta Forma Salvaje para ganar un espacio de nivel 1 (1/descanso largo).",
  "Elemental Fury": "Nivel 7. Elige entre Potent Spellcasting (Sabiduría al daño de trucos) o Primal Strike (1d8 daño elemental extra en ataques cuerpo a cuerpo).",
  "Improved Elemental Fury": "Nivel 15. Potent Spellcasting aumenta el alcance de trucos a 300 pies. Primal Strike aumenta el daño extra a 2d8.",
  "Beast Spells": "Nivel 18. Puedes lanzar conjuros mientras estás en Forma Salvaje, siempre que no tengan componentes materiales costosos o consumibles.",
  "Archdruid": "Nivel 20. Evergreen: Si tiras Iniciativa y no tienes usos de Forma Salvaje, recuperas uno. Nature Magician: Convierte usos de Forma Salvaje en espacios de conjuro (1 uso = 2 niveles).",
  "Tactical Mind": "Nivel 2. Si fallas una prueba de habilidad, gasta un uso de Toma de Aliento para sumar 1d10 al resultado. Si aún fallas, no gastas el uso.",
  "Tactical Shift": "Nivel 5. Cuando usas Toma de Aliento como Acción Adicional, puedes moverte hasta la mitad de tu velocidad sin provocar ataques de oportunidad.",
  "Indomitable": "Nivel 9. Si fallas una salvación, puedes repetirla sumando un bono igual a tu nivel de Guerrero. No puedes usarlo de nuevo hasta un descanso largo (más usos a nivel 13 y 17).",
  "Tactical Master": "Nivel 9. Al atacar con un arma cuya maestría dominas, puedes sustituir su propiedad por Empujar, Debilitar o Ralentizar.",
  "Two Extra Attacks": "Nivel 11. Puedes atacar tres veces en lugar de una cuando realizas la acción de Atacar.",
  "Three Extra Attacks": "Nivel 20. Puedes atacar cuatro veces en lugar de una cuando realizas la acción de Atacar.",
  "Studied Attacks": "Nivel 13. Si fallas un ataque contra una criatura, tienes Ventaja en tu próximo ataque contra ella antes del final de tu próximo turno.",
  "Lay on Hands": "Nivel 1. Acción Adicional: Sana 5 HP por punto gastado de tu reserva (5 x Nivel). También puedes gastar 5 puntos para curar la condición Envenenado.",
  "Paladin's Smite": "Nivel 2. Siempre tienes preparado el conjuro Divine Smite. Puedes lanzarlo una vez al día sin gastar espacio de conjuro tras un Descanso Largo.",
  "Divine Sense": "Canalizar Divinidad: Acción Adicional (10 min). Detectas Celestiales, Infernales y No-muertos a 60 pies. También detectas lugares consagrados o profanados.",
  "Faithful Steed": "Nivel 5. Siempre tienes preparado el conjuro Find Steed. Puedes lanzarlo una vez al día sin gastar espacio de conjuro.",
  "Aura of Protection": "Nivel 6. Tú y aliados a 10 pies ganáis un bono a todas las salvaciones igual a tu mod. Carisma (mínimo +1).",
  "Abjure Foes": "Nivel 9. Canalizar Divinidad: Acción Mágica. Hasta tu mod. Carisma de enemigos a 60 pies deben salvar Sabiduría o quedar Asustados (1 min).",
  "Aura of Courage": "Nivel 10. Tú y tus aliados en tu Aura de Protección sois inmunes a la condición Asustado.",
  "Radiant Strikes": "Nivel 11. Tus ataques cuerpo a cuerpo infligen 1d8 daño Radiante adicional permanentemente.",
  "Restoring Touch": "Nivel 14. Al usar Imposición de Manos, puedes gastar 5 puntos adicionales para curar: Cegado, Encantado, Ensordecido, Asustado, Paralizado o Aturdido.",
  "Aura Expansion": "Nivel 18. El radio de tu Aura de Protección (y otras auras de clase) aumenta a 30 pies.",
  "Favored Enemy": "Nivel 1. Siempre tienes preparado Hunter's Mark. Puedes lanzarlo gratis un número de veces igual a tu bonificador por competencia al día.",
  "Deft Explorer": "Nivel 2. Obtienes Pericia (Expertise) en una de tus habilidades entrenadas y conoces dos idiomas adicionales.",
  "Roving": "Nivel 6. Tu velocidad aumenta en 10 pies mientras no lleves armadura pesada. Ganas velocidad de escalada y nado igual a tu velocidad actual.",
  "Expertise": "Poder elegir dos habilidades entrenadas para duplicar el bonificador de competencia (Lvl 1 y 6).",
  "Steady Aim": "Nivel 3. Acción Adicional: Ganas Ventaja en tu próximo ataque este turno si no te has movido. Tu velocidad cae a 0 hasta el final del turno.",
  "Cunning Strike": "Nivel 5. Al usar Ataque Furtivo, puedes sacrificar 1d6 de daño para aplicar efectos: Veneno (CD 8+Dex+Prof), Tropezar (CD Dex) o Retirada (moverte media velocidad).",
  "Improved Cunning Strike": "Nivel 11. Puedes usar hasta dos efectos de Cunning Strike en un solo ataque, pagando el coste de dados de ambos.",
  "Devious Strikes": "Nivel 14. Nuevos efectos de Cunning Strike: Aturdir (CD Con, coste 2d6), Noquear (CD Con, coste 6d6, Inconsciente) y Oscurecer (CD Dex, coste 3d6, Cegado).",
  "Reliable Talent": "Nivel 7. Siempre que hagas una prueba de habilidad o herramienta en la que seas competente, tratas cualquier resultado de 9 o inferior en el d20 como un 10.",
  "Slippery Mind": "Nivel 15. Tu mente es difícil de controlar. Ganas competencia en tiradas de salvación de Sabiduría y Carisma.",
  "Stroke of Luck": "Nivel 20. Si fallas una prueba de d20 (ataque o habilidad), puedes convertir el resultado del dado en un 20. 1/Descanso corto o largo.",
  "Innate Sorcery": "Nivel 1. Acción Adicional (1 min): Tu CD de salvación de hechizos aumenta en 1 y tienes Ventaja en las tiradas de ataque de tus hechizos. Puedes usarlo 2 veces por Descanso Largo (o gastando 2 puntos de hechicería a partir del nivel 7).",
  "Font of Magic": "Nivel 2. Tienes una fuente de poder representada por Puntos de Hechicería. Puedes convertirlos en espacios de conjuro o usar espacios para ganar puntos. Recuperas todos tras un Descanso Largo.",
  "Sorcerous Restoration": "Nivel 5. Al terminar un Descanso Corto, recuperas puntos de hechicería iguales a la mitad de tu nivel (redondeado hacia abajo).",
  "Sorcery Incarnate": "Nivel 7. Mientras tu Hechicería Innata está activa, puedes usar hasta dos opciones de Metamagia en cada hechizo que lances.",
  "Arcane Apotheosis": "Nivel 20. Mientras tu Hechicería Innata está activa, puedes usar una opción de Metamagia en cada uno de tus turnos sin gastar puntos de hechicería.",
  "Eldritch Invocations": "Nivel 1. Recibes fragmentos de saber prohibido. Ganas invocaciones adicionales según subes de nivel (Lvl 2: 3, Lvl 5: 5, Lvl 18: 10).",
  "Magical Cunning": "Nivel 2. Rito de 1 min: Recuperas espacios de Pact Magic (máx la mitad del total). 1/Descanso Largo (a nivel 20 recuperas todos).",
  "Contact Patron": "Nivel 9. Siempre tienes preparado Contact Other Plane. Puedes lanzarlo gratis para contactar a tu patrón y superas la salvación automáticamente.",
  "Mystic Arcanum": "Nivel 11. Tu patrón te otorga un secreto mágico. Elige un conjuro de nivel 6 para lanzar gratis 1/Descanso Largo. Ganas más a nivel 13, 15 y 17.",
  "Eldritch Master": "Nivel 20. Tu rasgo Magical Cunning ahora te permite recuperar TODOS tus espacios de Pact Magic tras el rito de 1 minuto.",
  "Martial Arts": "Monk weapons now include all simple melee weapons and all martial melee weapons that have the Light property.",
  "Monk's Focus": "Renamed Ki. Spend points for Flurry of Blows, Patient Defense (Dodge as BA), or Step of the Wind (Dash+Disengage as BA).",
  "Uncanny Metabolism": "Level 2. Regain all Focus points on Initiative roll once per day, and heal some HP.",
  "Deflect Attacks": "Level 3. Now works on all melee and ranged attacks that deal B/P/S damage. Can redirect for 1 Focus.",
  "Self-Restoration": "Level 10. End Charmed, Frightened, or Poisoned at the end of each turn automatically.",
  "Deflect Energy": "Level 13. Works on all damage types.",
  "Perfect Focus": "Level 15. Start combat with at least 4 Focus points.",
  "Superior Defense": "Level 18. Gain resistance to all damage except Force for 1 minute (cost 3 Focus).",
  "Body and Mind": "Level 20. +4 to Dex and Wis (max 26).",
  "Extra Attack": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
  "Empowered Strikes": "Your Unarmed Strikes deal Force damage instead of Bludgeoning.",
  "Evasion": "No damage on successful Dex save vs area effects.",
  "Ritual Adept": "Level 1 Wizard feature. Constant access to rituals in your spellbook.",
  "Arcane Recovery": "Recover spell slots (half level sum) during short rest.",
  "Scholar": "Level 2. Expertise in one knowledge skill.",
  "Memorize Spell": "Level 5. Swap one prepared spell during a short rest.",
  "Spell Mastery": "Level 18. Cast one 1st and one 2nd level spell freely.",
  "Signature Spells": "Level 20. Gain two 3rd level spells always prepared and cast free once each."
};
