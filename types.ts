export interface InventoryItem {
  id: string; // Unique ID for this instance
  name: string;
  quantity: number;
  equipped: boolean;
  customStat?: Ability; // Added to support custom scaling (Hexblade, Battle Ready, etc.)
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface InitiativeCombatant {
  id: string;
  name: string;
  initiative: number | null;
  isPlayer: boolean;
  isCurrentTurn: boolean;
  ac?: number;
  hp?: { current: number; max: number };
}

export interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  subclass?: string;
  species: string;
  subspecies?: string;
  background: string;
  alignment?: string;
  hp: { current: number; max: number; temp: number };
  focus?: { current: number; max: number }; // Added for Monks
  hitDice?: { current: number; max: number }; // Added for Hit Dice tracking
  lucky?: { current: number; max: number }; // Added for Feat Lucky (Afortunado)
  inspiration?: { current: number; max: number }; // Heroic Inspiration counter
  // Class-specific resource trackers
  rageUses?: { current: number; max: number }; // Barbarian
  rageDamage?: number; // Barbarian: bonus damage (2 at Lv1, +1 at Lv5,9,13,17)
  bardicInspiration?: { current: number; max: number }; // Bard
  bardicInspirationDie?: number; // Bard: d6 at Lv1, d8 at Lv5, d10 at Lv10, d12 at Lv15
  channelDivinity?: { current: number; max: number }; // Cleric / Paladin
  wildShape?: { current: number; max: number }; // Druid uses
  wildShapeMax?: number; // Druid: max CR and flying speed level
  layOnHands?: { current: number; max: number }; // Paladin (pool of HP)
  actionSurge?: { current: number; max: number }; // Fighter
  secondWind?: { current: number; max: number }; // Fighter
  indomitable?: { current: number; max: number }; // Fighter uses
  sneakAttackDie?: number; // Rogue: d6 at Lv1, increases every few levels
  martialArtsDie?: number; // Monk: d6 at Lv1, d8 at Lv5, d10 at Lv11, d12 at Lv17
  kiMax?: number; // Monk: max Ki points (equals level)
  concentrationSpell?: string; // Active concentration spell name
  ac: number; // Base or override, calculated usually
  init: number;
  speed: number;
  profBonus: number;
  stats: Record<string, number>;
  skills: string[];
  languages: string[];
  feats: string[];
  invocations?: string[]; // Added for Warlocks
  agonizingBlastCantrips?: string[]; // Choices for Agonizing Blast (2024 rules)
  pactCantrips?: string[]; // Selections for Pact of the Tome
  pactRituals?: string[]; // Selections for Pact of the Tome rituals
  lessonsFeats?: string[]; // Feats from Lessons of the First Ones
  metamagics?: string[];
  expertise?: string[];
  imageUrl: string;
  inventory: InventoryItem[];
  preparedSpells?: string[];
  innateSpells?: string[]; // Spells that don't consume slots (species innate, etc.)
  weaponMasteries?: string[]; // Added for 2024 Weapon Mastery
  spellcastingAbility?: Ability; // To pick INT/WIS/CHA for species spells
  startingGold?: number; // Chosen instead of background equipment
  money?: { cp: number; sp: number; gp: number; ep: number; pp: number };
  notes?: NoteItem[];
  // Subclass specific state
  empoweredSneakAttack?: { dice: number }; // Rogue: Magic Stealer
  vestige?: {
    type: 'Celestial' | 'Fiend' | 'Undead';
    hp: { current: number; max: number };
    domain: string;
  }; // Warlock: Vestige Patron
  guardianBondTarget?: string; // Paladin: Oath of the Spellguard
  party_id?: string;
  party_name?: string;
  usedSlots?: Record<string, boolean>; // Spell slot tracking
  spellSlots?: Record<number, { current: number; max: number }>; // Added for 2024 spell slot tracking
  sorceryPoints?: { current: number; max: number }; // Sorcerer
  innateSorcery?: { current: number; max: number }; // Sorcerer uses (Lv1=2)
  extraAttacks?: number; // Number of attacks per Attack action (Fighter: 1 at Lv5, 2 at Lv11, 3 at Lv20)
  hunterMarkUses?: { current: number; max: number }; // Ranger: uses of Hunter's Mark (Lv1=2, +1 at 5,9,13,17)
  fightingStyle?: string; // Ranger/Fighter: chosen fighting style
  druidicWarriorCantrips?: string[]; // Ranger: Druidic Warrior cantrips (2 Druid cantrips)
  pactSlotLevel?: number; // Warlock: Pact Magic slot level (Lv3=2, Lv5=3, Lv7=4, Lv9=5)
  magicalCunning?: { current: number; max: number }; // Warlock: recover half slots (1 use per long rest)
  mysticArcanum?: { level6?: string; level7?: string; level8?: string; level9?: string }; // Warlock Lv11+
  arcaneRecovery?: { uses: number }; // Wizard: recover spell slots on short rest
  fontOfInspiration?: { current: number; max: number }; // Bard Lv5: recover inspiration on short rest
  spellMastery?: string[]; // Wizard Lv18: 2 lv1 and 2 lv2 spells at will
  signatureSpells?: string[]; // Wizard Lv20: 2 lv3 spells without slot
  bondedWeapons?: string[]; // Eldritch Knight: War Bond - up to 2 bonded weapons
  summonedWeapon?: string | null; // Eldritch Knight: currently summoned bonded weapon
  warMagicCantrip?: string; // Eldritch Knight L7: cantrip for War Magic attack replacement
  warMagicActive?: boolean; // Eldritch Knight L7: toggle War Magic replacement
  eldritchStrikeActive?: boolean; // Eldritch Knight L10: next save disadvantage
  arcaneChargeActive?: boolean; // Eldritch Knight L15: teleport on Action Surge
  improvedWarMagicActive?: boolean; // Eldritch Knight L18: replace 2 attacks with L1-L2 spell
  lastLongRest?: number; // Timestamp of last long rest (for 24h cooldown)
  isRaging?: boolean;
  isRecklessAttack?: boolean; // Berserker: Reckless Attack toggle
  activeConcentration?: string; // Spell name being concentrated on
  syncTimestamp?: number; // Timestamp de última sincronización (ms)
  wildShapeForms?: string[]; // Bestias conocidas por el Druida
  activeWildShape?: string; // Seguro: bestia activa al recargar
  savantSpellsAdded?: boolean; // Wizard Savant: ya seleccionó hechizos gratuitos
  savantSpells?: string[]; // Wizard Savant: hechizos gratuitos de la escuela
  featureUsages?: Record<string, FeatureUsage>; // Feature usage tracking (generic system)
}

export type ResetType = 'long_rest' | 'short_rest' | 'always' | 'never';

export interface ResourceCost {
  resource: string;
  amount: number;
}

export interface FeatureUsage {
  current: number;
  max: number;
  resetType: ResetType;
  costToRestore?: ResourceCost;
}

export interface FeatureUsageConfig {
  maxFormula: 'WIS' | 'INT' | 'CHA' | 'DEX' | 'CON' | 'level' | 'proficiencyBonus' | '1';
  resetType: ResetType;
  costToRestore?: ResourceCost;
}

export interface BeastAttack {
  name: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  reach?: number;
  effect?: string;
}

export interface BeastStats {
  name: string;
  cr: number;
  hp: number;
  ac: number;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge';
  speed: number;
  flySpeed?: number;
  swimSpeed?: number;
  climbSpeed?: number;
  stats: Record<Ability, number>;
  skills?: string[];
  senses?: string[];
  attacks: BeastAttack[];
  special?: string[];
}

export interface WildShapeState {
  form: string;
  originalStats: Record<Ability, number>;
  originalHP: { current: number; max: number; temp: number };
  originalAC: number;
  thpGained: number;
  startedAt: number;
  isLunarRadiance: boolean;
  attacks: BeastAttack[];
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  range: string;
  components: string[];
  duration: string;
  description: string;
  prepared?: boolean;
}

export interface ItemData {
  name: string;
  type: 'Weapon' | 'Armor' | 'Gear' | 'Tool' | 'Ammunition' | 'Mount' | 'Vehicle' | 'Saddle';
  weight: number;
  cost: string; // "10 GP"
  description?: string;
  carryingCapacity?: string; // For Mounts
}

export interface WeaponData extends ItemData {
  type: 'Weapon';
  category: 'Simple' | 'Martial';
  rangeType: 'Melee' | 'Ranged';
  damage: string;
  damageType: string;
  properties: string[];
  mastery?: string;
}

export interface ArmorData extends ItemData {
  type: 'Armor';
  armorType: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  baseAC: number;
  stealthDisadvantage: boolean;
  strengthReq: number;
  maxDex?: number; // 2 for medium, 0 for heavy (effectively undefined means infinite for light)
}

export type ViewState = 'list' | 'create' | 'sheet' | 'dm-dashboard' | 'observer-sheet';
export type SheetTab = 'combat' | 'inventory' | 'spells' | 'features' | 'notes';
export type CreatorStep = 1 | 2 | 3 | 4 | 5;

export type Ability = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

// Added to support level-up decisions (Stats vs Feats)
export interface AsiDecision {
  type: 'stat' | 'feat';
  stat1?: Ability;
  stat2?: Ability;
  feat?: string;
}

export type Skill = string;

export interface BackgroundData {
  name?: string;
  description: string;
  scores: Ability[];
  feat: string;
  featDescription: string;
  skills: Skill[];
  tool: string;
  equipment: string[];
}

export interface Trait {
  name: string;
  description: string;
  level?: number; // Character level when trait unlocks. Default is 1.
}

export interface SpeciesSpell {
  level: number; // 0 = cantrip, 1 = level 1, etc.
  spell: string;
  alwaysPrepared?: boolean; // Some spells are always prepared regardless of level
}

export interface SubspeciesData {
  name: string;
  description: string;
  traits: Trait[];
  innateSpells?: SpeciesSpell[];
}

export interface DetailData {
  name: string;
  description: string;
  size?: string;
  speed?: number;
  traits: Trait[];
  subspecies?: SubspeciesData[];
  innateSpells?: SpeciesSpell[]; // Spells for species without subspecies
}

export interface SubclassData {
  name: string;
  description: string;
  features: Record<number, Trait[]>;
  alwaysPreparedSpells?: Record<number, string[]>;
}

export interface Feat {
  name: string;
  description: string;
  category: 'Origin' | 'General' | 'Fighting Style' | 'Epic Boon';
  level: number;
  prerequisite?: string;
  asi?: Ability[]; // List of abilities that can be increased by 1
}

export interface SpellDetail {
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  name: string;
}

export interface CampaignResource {
  id: string;
  party_id: string;
  title: string;
  url: string;
  thumbnail_url?: string; // Base64 thumbnail o URL a thumbnail en storage
  type: 'Map' | 'Setting' | 'NPC' | 'Item';
  description?: string;
  is_persistent: boolean;
  created_at?: string;
  is_optimizing?: boolean; // Flag para mostrar estado de migración
}

export interface SharedResourceEvent {
  url: string;
  title: string;
  description?: string;
}

export interface OTAUpdate {
  version: string;
  message: string;
  payload: unknown;
}

export interface VersionJsonResponse {
  version?: string;
  url?: string;
  message?: string;
}

export interface CharacterWithOwner extends Character {
  user_id?: string;
}
