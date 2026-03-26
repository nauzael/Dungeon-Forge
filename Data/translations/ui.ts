export interface Translation {
  // Navigation
  combat: string;
  features: string;
  spells: string;
  inventory: string;
  notes: string;
  bag: string;
  
  // Actions
  back: string;
  save: string;
  cancel: string;
  close: string;
  delete: string;
  edit: string;
  create: string;
  confirm: string;
  login: string;
  logout: string;
  user: string;
  password: string;
  remember_me: string;
  session_active: string;
  login_welcome: string;
  login_subtitle: string;
  
  character_name: string;
  character_name_placeholder: string;
  start_adventure: string;
  adventure: string;
  define_identity: string;
  profile_image: string;
  upload_local: string;
  use_url: string;
  delete_photo: string;
  subclass_title: string;
  subclass_linage: string;
  subspecies_title: string;
  select_lineage: string;
  select_specialization: string;
  hit_die: string;
  primary_ability: string;
  config_magic: string;
  magic_initiate: string;
  confirm_selection: string;
  choose_cantrips: string;
  choose_level1: string;
  attributes: string;
  feature: string;
  background_bonuses: string;
  point_buy: string;
  manual: string;
  final: string;
  hit_points: string;
  fixed_average: string;
  rolled_sum: string;
  rolled_sum_desc: string;
  level_improvements: string;
  feat_bonus: string;
  plus_one_to: string;
  alignment: string;
  additional_languages: string;
  select_language_1: string;
  select_language_2: string;
  human_feat: string;
  keen_senses: string;
  racial_skill: string;
  choose_skill_desc: string;
  choose_extra_skill_desc: string;
  select_skill_prompt: string;
  select_extra_skill_prompt: string;
  class_skills: string;
  chosen: string;
  background_label: string;
  human_label: string;
  elf_label: string;
  metamagics: string;
  hero: string;
  feats_and_traits: string;
  trained_skills: string;
  confirm_character: string;
  search_feat: string;
  select_feat_title: string;
  class_progression: string;
  see_levels_1_20: string;
  choose_asi_or_feat: string;
  gain_subclass_feature: string;
  innate_spellcasting_ability: string;
  innate_spells_note: string;
  starting_equipment: string;
  starting_gold_title: string;
  starting_gold_desc: string;
  starting_equipment_title: string;
  starting_equipment_desc: string;
  weapon_masteries: string;
  mastery_slot: string;
  select_weapon_mastery_prompt: string;

  // Character
  level: string;
  hp: string;
  ac: string;
  speed: string;
  initiative: string;
  proficiency: string;
  
  // Abilities
  strength: string;
  dexterity: string;
  constitution: string;
  intelligence: string;
  wisdom: string;
  charisma: string;
  str: string;
  dex: string;
  con: string;
  int: string;
  wis: string;
  cha: string;
  
  // Skills
  acrobatics: string;
  animalHandling: string;
  arcana: string;
  athletics: string;
  deception: string;
  history: string;
  insight: string;
  intimidation: string;
  investigation: string;
  medicine: string;
  nature: string;
  perception: string;
  performance: string;
  persuasion: string;
  religion: string;
  sleightOfHand: string;
  stealth: string;
  survival: string;
  
  // Creator
  characterCreator: string;
  name: string;
  species: string;
  class: string;
  subclass: string;
  background: string;
  abilities: string;
  skills: string;
  equipment: string;
  review: string;
  finish: string;
  next: string;
  previous: string;
  
  // Settings
  settings: string;
  language: string;
  spanish: string;
  english: string;
  
  // Misc
  description: string;
  origin: string;
  feat: string;
  attack: string;
  damage: string;
  range: string;
  components: string;
  duration: string;
  castingTime: string;
  concentration: string;
  ritual: string;
  prepared: string;
  known: string;
  tools: string;
  slots: string;
  DC: string;
  characters: string;
  exportData: string;
  importData: string;
  noCharacters: string;
  noCharactersDesc: string;
  deleteChar: string;
  createChar: string;
  step: string;
  of: string;
  resume: string;
  or: string;
  continue: string;
  levelMaxReached: string;
  no_results_found: string;
  to: string;
  levelUp: string;
  hpMaxIncrease: string;
  chooseMetamagic: string;
  selectSubclass: string;
  chooseSubclass: string;
  abilityImprovement: string;
  stats: string;
  selectFeat: string;
  subirNivel: string;
  dwarfResilience: string;
  draconicResilience: string;
  toughFeat: string;
  amuletOfHealth: string;
  total: string;
  level1: string;
  levels: string;
  grimoire: string;
  search_spells: string;
  capacity: string;
  level_label: string;
  all_sources: string;
  pact_source: string;
  feat_source: string;
  spell_details: string;
  prepared_spells: string;
  cantrips_label: string;
  save_dc: string;
  attack_bonus: string;
  amt_spells: string;
  open_grimoire: string;
  information: string;
  time: string;
  sorcery_points: string;
  max: string;
  spell_slots: string;
  no_spells_prepared: string;
  view_grimoire: string;
  cast_spell: string;
  pact_choice: string;
  abjuration: string;
  conjuration: string;
  divination: string;
  enchantment: string;
  evocation: string;
  illusion: string;
  necromancy: string;
  transmutation: string;
  barbarian: string;
  bard: string;
  cleric: string;
  druid: string;
  fighter: string;
  monk: string;
  paladin: string;
  ranger: string;
  rogue: string;
  sorcerer: string;
  warlock: string;
  wizard: string;
  cantrip: string;
  limit: string;
  abrir: string;
  cambiar: string;
  cerrar: string;
  nivel: string;
}

export const TRANSLATIONS_ES: Translation = {
  // Navigation
  combat: 'Combate',
  features: 'Rasgos',
  spells: 'Hechizos',
  inventory: 'Inventario',
  notes: 'Notas',
  bag: 'Bolsa',
  
  // Actions
  back: 'Volver',
  save: 'Guardar',
  cancel: 'Cancelar',
  close: 'Cerrar',
  delete: 'Eliminar',
  edit: 'Editar',
  create: 'Crear',
  confirm: 'Confirmar',
  login: 'Iniciar Sesión',
  logout: 'Cerrar Sesión',
  user: 'Usuario',
  password: 'Contraseña',
  remember_me: 'Recordar sesión',
  session_active: 'Conexión activa',
  login_welcome: 'Bienvenido, aventurero',
  login_subtitle: 'Ingresa tus credenciales para continuar.',
  
  character_name: 'Nombre',
  character_name_placeholder: 'Ej. Gandalf, Drizzt...',
  start_adventure: 'Comienza tu',
  adventure: 'Aventura',
  define_identity: 'Define la identidad de tu héroe.',
  profile_image: 'Imagen de Perfil',
  upload_local: 'Subir Foto Local',
  use_url: 'Usar URL de Imagen',
  delete_photo: 'Eliminar Foto',
  subclass_title: 'Escoge tu Linaje',
  subclass_linage: 'Subclase / Especialización',
  subspecies_title: 'Linajes Raciales',
  select_lineage: 'Selecciona tu herencia o linaje',
  select_specialization: 'Selecciona una especialización',
  hit_die: 'Dado de Golpe',
  primary_ability: 'Habilidad Principal',
  config_magic: 'Configurar Magia',
  magic_initiate: 'Iniciado en la Magia',
  confirm_selection: 'Confirmar Selección',
  choose_cantrips: 'Elige 2 Trucos',
  choose_level1: 'Elige 1 Hechizo Lvl 1',
  attributes: 'Atributos',
  feature: 'Característica',
  background_bonuses: 'Bonificadores de Trasfondo',
  point_buy: 'Point Buy',
  manual: 'Manual',
  final: 'Final',
  hit_points: 'Puntos de Golpe',
  fixed_average: 'Media Fija',
  rolled_sum: 'Suma tirada',
  rolled_sum_desc: 'Introduce la suma total de los dados de golpe tirados para los niveles posteriores al 1.',
  level_improvements: 'Mejoras de Nivel',
  feat_bonus: 'Bono de dote',
  plus_one_to: '+1 a...',
  alignment: 'Alineamiento',
  additional_languages: 'Idiomas Adicionales',
  select_language_1: 'Selecciona el 1er idioma...',
  select_language_2: 'Selecciona el 2do idioma...',
  human_feat: 'Hazaña de Humano',
  keen_senses: 'Keen Senses (Elfo)',
  racial_skill: 'Habilidad Racial (Humano)',
  choose_skill_desc: 'Elige una de estas habilidades.',
  choose_extra_skill_desc: 'Elige una habilidad adicional.',
  select_skill_prompt: 'Selecciona una habilidad...',
  select_extra_skill_prompt: 'Selecciona una habilidad extra...',
  class_skills: 'Habilidades de Clase',
  chosen: 'Elegidas',
  background_label: 'Trasfondo',
  human_label: 'Humano',
  elf_label: 'Elfo',
  metamagics: 'Metamagias',
  hero: 'Héroe',
  feats_and_traits: 'Hazañas & Rasgos',
  trained_skills: 'Habilidades Entrenadas',
  confirm_character: 'Confirmar Personaje',
  search_feat: 'Buscar dote...',
  select_feat_title: 'Selecciona una Dote',
  class_progression: 'Progresión de Clase',
  see_levels_1_20: 'Ver niveles 1-20',
  choose_asi_or_feat: 'Mejora una característica o elige una dote.',
  gain_subclass_feature: 'Ganás un rasgo de tu subclase elegida.',
  innate_spellcasting_ability: 'Aptitud Mágica Innata',
  innate_spells_note: 'Esta característica se usará para los conjuros que lances por tu especie.',
  starting_equipment: 'Equipo Inicial',
  starting_gold_title: 'Oro Inicial (50 PO)',
  starting_gold_desc: 'Comienza con oro para comprar tu propio equipo.',
  starting_equipment_title: 'Equipo de Trasfondo',
  starting_equipment_desc: 'Comienza con el equipo estándar de tu trasfondo.',
  weapon_masteries: 'Maestrías de Armas',
  mastery_slot: 'Ranura de Maestría',
  select_weapon_mastery_prompt: 'Selecciona dominio de arma...',
  // Character
  level: 'Nivel',
  hp: 'PG',
  ac: 'CA',
  speed: 'Velocidad',
  initiative: 'Iniciativa',
  proficiency: 'Competencia',
  
  // Abilities
  strength: 'Fuerza',
  dexterity: 'Destreza',
  constitution: 'Constitución',
  intelligence: 'Inteligencia',
  wisdom: 'Sabiduría',
  charisma: 'Carisma',
  str: 'FUE',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
  
  // Skills
  acrobatics: 'Acrobacias',
  animalHandling: 'Manejo de Animales',
  arcana: 'Arcana',
  athletics: 'Atletismo',
  deception: 'Engaño',
  history: 'Historia',
  insight: 'Perspicacia',
  intimidation: 'Intimidación',
  investigation: 'Investigación',
  medicine: 'Medicina',
  nature: 'Naturaleza',
  perception: 'Percepción',
  performance: 'Interpretación',
  persuasion: 'Persuasión',
  religion: 'Religión',
  sleightOfHand: 'Juego de Manos',
  stealth: 'Sigilo',
  survival: 'Supervivencia',
  
  // Creator
  characterCreator: 'Creador de Personaje',
  name: 'Nombre',
  species: 'Especie',
  class: 'Clase',
  subclass: 'Subclase',
  background: 'Trasfondo',
  abilities: 'Características',
  skills: 'Habilidades',
  equipment: 'Equipo',
  review: 'Revisar',
  finish: 'Finalizar',
  next: 'Siguiente',
  previous: 'Anterior',
  
  // Settings
  settings: 'Configuración',
  language: 'Idioma',
  spanish: 'Español',
  english: 'English',
  
  // Misc
  description: 'Descripción',
  origin: 'Origen',
  feat: 'Dote',
  attack: 'Ataque',
  damage: 'Daño',
  range: 'Alcance',
  components: 'Componentes',
  duration: 'Duración',
  castingTime: 'Tiempo de lanzamiento',
  concentration: 'Concentración',
  ritual: 'Ritual',
  prepared: 'Preparados',
  known: 'Conocidos',
  tools: 'Herramientas',
  slots: 'Espacios',
  DC: 'CD',
  characters: 'Personajes',
  exportData: 'Exportar Datos',
  importData: 'Importar Datos',
  noCharacters: 'Sin Personajes',
  noCharactersDesc: 'Tu lista está vacía. Crea un nuevo héroe para comenzar tu aventura.',
  deleteChar: 'Borrar personaje',
  createChar: 'Crear Personaje',
  step: 'Paso',
  of: 'de',
  resume: 'Resumen',
  or: 'o',
  continue: 'Continuar',
  levelMaxReached: '¡Has alcanzado el nivel máximo (20)!',
  no_results_found: 'No se encontraron resultados',
  to: 'a',
  levelUp: '¡Subida de Nivel!',
  hpMaxIncrease: 'Aumento de HP Máximo',
  chooseMetamagic: 'Elige Metamagia(s)',
  selectSubclass: 'Seleccionar Subclase...',
  chooseSubclass: 'Elige tu Subclase',
  abilityImprovement: 'Mejora de Característica',
  stats: 'Estadísticas',
  selectFeat: 'Seleccionar Dote...',
  subirNivel: 'Subir de Nivel',
  dwarfResilience: 'Resistencia Enana',
  draconicResilience: 'Resiliencia Dracónica',
  toughFeat: 'Dote: Duro',
  amuletOfHealth: 'Amuleto de Salud (+CON 19)',
  total: 'Total',
  level1: 'Nivel 1',
  levels: 'Niveles',
  grimoire: 'Grimorio',
  search_spells: 'Buscar hechizo...',
  capacity: 'Capacidad',
  level_label: 'Nivel',
  all_sources: 'Todos',
  pact_source: 'Pacto',
  feat_source: 'Dote',
  spell_details: 'Detalles del Hechizo',
  prepared_spells: 'Preparados',
  cantrips_label: 'Trucos',
  save_dc: 'CD Salvación',
  attack_bonus: 'Bono Ataque',
  amt_spells: 'Cant. Hechizos',
  open_grimoire: 'Abrir Grimorio',
  information: 'Información',
  time: 'Tiempo',
  sorcery_points: 'Puntos de Hechicería',
  max: 'Máx',
  spell_slots: 'Espacios de Conjuro',
  no_spells_prepared: 'No tienes hechizos preparados de este nivel.',
  view_grimoire: 'Ver Grimorio',
  cast_spell: 'Lanzar Hechizo',
  pact_choice: 'Elección de Pacto',
  abjuration: 'Abjuración',
  conjuration: 'Conjuración',
  divination: 'Adivinación',
  enchantment: 'Encantamiento',
  evocation: 'Evocación',
  illusion: 'Ilusión',
  necromancy: 'Nigromancia',
  transmutation: 'Transmutación',
  barbarian: 'Bárbaro',
  bard: 'Bardo',
  cleric: 'Clérigo',
  druid: 'Druida',
  fighter: 'Guerrero',
  monk: 'Monje',
  paladin: 'Paladín',
  ranger: 'Explorador',
  rogue: 'Pícaro',
  sorcerer: 'Hechicero',
  warlock: 'Brujo',
  wizard: 'Mago',
  cantrip: 'Truco',
  limit: 'Límite',
  abrir: 'Abrir',
  cambiar: 'Cambiar',
  cerrar: 'Cerrar',
  nivel: 'Nivel',
};

export const TRANSLATIONS_EN: Translation = {
  // Navigation
  combat: 'Combat',
  features: 'Features',
  spells: 'Spells',
  inventory: 'Inventory',
  notes: 'Notes',
  bag: 'Bag',
  
  // Actions
  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  close: 'Close',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  confirm: 'Confirm',
  login: 'Login',
  logout: 'Logout',
  user: 'User',
  password: 'Password',
  remember_me: 'Remember me',
  session_active: 'Active connection',
  login_welcome: 'Welcome, adventurer',
  login_subtitle: 'Enter your credentials to continue.',
  
  character_name: 'Name',
  character_name_placeholder: 'Ex. Gandalf, Drizzt...',
  start_adventure: 'Start your',
  adventure: 'Adventure',
  define_identity: 'Define your hero\'s identity.',
  profile_image: 'Profile Image',
  upload_local: 'Upload Local Photo',
  use_url: 'Use Image URL',
  delete_photo: 'Delete Photo',
  subclass_title: 'Choose your Life Path',
  subclass_linage: 'Subclass / Specialization',
  subspecies_title: 'Species Lineages',
  select_lineage: 'Select your heritage or lineage',
  select_specialization: 'Select a specialization',
  hit_die: 'Hit Die',
  primary_ability: 'Primary Ability',
  config_magic: 'Configure Magic',
  magic_initiate: 'Magic Initiate',
  confirm_selection: 'Confirm Selection',
  choose_cantrips: 'Choose 2 Cantrips',
  choose_level1: 'Choose 1 Level 1 Spell',
  attributes: 'Attributes',
  feature: 'Feature',
  background_bonuses: 'Background Bonuses',
  point_buy: 'Point Buy',
  manual: 'Manual',
  final: 'Final',
  hit_points: 'Hit Points',
  fixed_average: 'Fixed Average',
  rolled_sum: 'Rolled Sum',
  rolled_sum_desc: 'Enter the total sum of hit dice rolled for levels after the 1st.',
  level_improvements: 'Level Improvements',
  feat_bonus: 'Feat Bonus',
  plus_one_to: '+1 to...',
  alignment: 'Alignment',
  additional_languages: 'Additional Languages',
  select_language_1: 'Select the 1st language...',
  select_language_2: 'Select the 2nd language...',
  human_feat: 'Human Feat',
  keen_senses: 'Keen Senses (Elf)',
  racial_skill: 'Racial Skill (Human)',
  choose_skill_desc: 'Choose one of these skills.',
  choose_extra_skill_desc: 'Choose an additional skill.',
  select_skill_prompt: 'Select a skill...',
  select_extra_skill_prompt: 'Select an extra skill...',
  class_skills: 'Class Skills',
  chosen: 'Chosen',
  background_label: 'Background',
  human_label: 'Human',
  elf_label: 'Elf',
  metamagics: 'Metamagics',
  hero: 'Hero',
  feats_and_traits: 'Feats & Traits',
  trained_skills: 'Trained Skills',
  confirm_character: 'Confirm Character',
  search_feat: 'Search feat...',
  select_feat_title: 'Select a Feat',
  class_progression: 'Class Progression',
  see_levels_1_20: 'See levels 1 to 20',
  choose_asi_or_feat: 'Improve an ability score or choose a feat.',
  gain_subclass_feature: 'You gain a feature from your chosen subclass.',
  innate_spellcasting_ability: 'Innate Spellcasting Ability',
  innate_spells_note: 'This ability will be used for any spells you cast via your species.',
  starting_equipment: 'Starting Equipment',
  starting_gold_title: 'Starting Gold (50 GP)',
  starting_gold_desc: 'Start with gold to buy your own custom gear.',
  starting_equipment_title: 'Background Equipment',
  starting_equipment_desc: 'Start with the standard gear from your background.',
  weapon_masteries: 'Weapon Masteries',
  mastery_slot: 'Mastery Slot',
  select_weapon_mastery_prompt: 'Select weapon mastery...',
  // Character
  level: 'Level',
  hp: 'HP',
  ac: 'AC',
  speed: 'Speed',
  initiative: 'Initiative',
  proficiency: 'Proficiency',
  
  // Abilities
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
  
  // Skills
  acrobatics: 'Acrobatics',
  animalHandling: 'Animal Handling',
  arcana: 'Arcana',
  athletics: 'Athletics',
  deception: 'Deception',
  history: 'History',
  insight: 'Insight',
  intimidation: 'Intimidation',
  investigation: 'Investigation',
  medicine: 'Medicine',
  nature: 'Nature',
  perception: 'Perception',
  performance: 'Performance',
  persuasion: 'Persuasion',
  religion: 'Religion',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  survival: 'Survival',
  
  // Creator
  characterCreator: 'Character Creator',
  name: 'Name',
  species: 'Species',
  class: 'Class',
  subclass: 'Subclass',
  background: 'Background',
  abilities: 'Abilities',
  skills: 'Skills',
  equipment: 'Equipment',
  review: 'Review',
  finish: 'Finish',
  next: 'Next',
  previous: 'Previous',
  
  // Settings
  settings: 'Settings',
  language: 'Language',
  spanish: 'Español',
  english: 'English',
  
  // Misc
  description: 'Description',
  origin: 'Origin',
  feat: 'Feat',
  attack: 'Attack',
  damage: 'Damage',
  range: 'Range',
  components: 'Components',
  duration: 'Duration',
  castingTime: 'Casting Time',
  concentration: 'Concentration',
  ritual: 'Ritual',
  prepared: 'Prepared',
  known: 'Known',
  tools: 'Tools',
  slots: 'Slots',
  DC: 'DC',
  characters: 'Characters',
  exportData: 'Export Data',
  importData: 'Import Data',
  noCharacters: 'No Characters',
  noCharactersDesc: 'Your list is empty. Create a new hero to start your adventure.',
  deleteChar: 'Delete character',
  createChar: 'Create Character',
  step: 'Step',
  of: 'of',
  resume: 'Summary',
  or: 'or',
  continue: 'Continue',
  levelMaxReached: 'You have reached the maximum level (20)!',
  no_results_found: 'No results found',
  to: 'to',
  levelUp: 'Level Up!',
  hpMaxIncrease: 'Max HP Increase',
  chooseMetamagic: 'Choose Metamagic(s)',
  selectSubclass: 'Select Subclass...',
  chooseSubclass: 'Choose your Subclass',
  abilityImprovement: 'Ability Score Improvement',
  stats: 'Stats',
  selectFeat: 'Select Feat...',
  subirNivel: 'Level Up',
  dwarfResilience: 'Dwarven Resilience',
  draconicResilience: 'Draconic Resilience',
  toughFeat: 'Feat: Tough',
  amuletOfHealth: 'Amulet of Health (+CON 19)',
  total: 'Total',
  level1: 'Level 1',
  levels: 'Levels',
  grimoire: 'Grimoire',
  search_spells: 'Search spell...',
  capacity: 'Capacity',
  level_label: 'Level',
  all_sources: 'All',
  pact_source: 'Pact',
  feat_source: 'Feat',
  spell_details: 'Spell Details',
  prepared_spells: 'Prepared',
  cantrips_label: 'Cantrips',
  save_dc: 'Save DC',
  attack_bonus: 'Attack Bonus',
  amt_spells: 'Spell Amt',
  open_grimoire: 'Open Grimoire',
  information: 'Information',
  time: 'Time',
  sorcery_points: 'Sorcery Points',
  max: 'Max',
  spell_slots: 'Spell Slots',
  no_spells_prepared: 'No spells prepared for this level.',
  view_grimoire: 'View Grimoire',
  cast_spell: 'Cast Spell',
  pact_choice: 'Pact Choice',
  abjuration: 'Abjuration',
  conjuration: 'Conjuration',
  divination: 'Divination',
  enchantment: 'Enchantment',
  evocation: 'Evocation',
  illusion: 'Illusion',
  necromancy: 'Necromancy',
  transmutation: 'Transmutation',
  barbarian: 'Barbarian',
  bard: 'Bard',
  cleric: 'Cleric',
  druid: 'Druid',
  fighter: 'Fighter',
  monk: 'Monk',
  paladin: 'Paladin',
  ranger: 'Ranger',
  rogue: 'Rogue',
  sorcerer: 'Sorcerer',
  warlock: 'Warlock',
  wizard: 'Wizard',
  cantrip: 'Cantrip',
  limit: 'Limit',
  abrir: 'Open',
  cambiar: 'Change',
  cerrar: 'Close',
  nivel: 'Level',
};
