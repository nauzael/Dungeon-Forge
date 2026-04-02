
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
  innateSpells?: string[];  // Spells that don't consume slots (species innate, etc.)
  weaponMasteries?: string[]; // Added for 2024 Weapon Mastery
  spellcastingAbility?: Ability; // To pick INT/WIS/CHA for species spells
  startingGold?: number; // Chosen instead of background equipment
  money?: { cp: number; sp: number; gp: number; ep: number; pp: number };
  notes?: NoteItem[];
  // Subclass specific state
  empoweredSneakAttack?: { dice: number }; // Rogue: Magic Stealer
  vestige?: { type: 'Celestial' | 'Fiend' | 'Undead', hp: { current: number, max: number }, domain: string }; // Warlock: Vestige Patron
  guardianBondTarget?: string; // Paladin: Oath of the Spellguard
  party_id?: string;
  party_name?: string;
  usedSlots?: Record<string, boolean>; // Spell slot tracking
  spellSlots?: Record<number, { current: number; max: number }>; // Added for 2024 spell slot tracking
  sorceryPoints?: { current: number; max: number }; // Sorcerer
  innateSorcery?: { current: number; max: number }; // Sorcerer uses (Lv1=2)
  extraAttacks?: number; // Number of attacks per Attack action (Fighter: 1 at Lv5, 2 at Lv11, 3 at Lv20)
  isRaging?: boolean;
  activeConcentration?: string; // Spell name being concentrated on
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
    level?: number;  // Character level when trait unlocks. Default is 1.
}

export interface SpeciesSpell {
    level: number;      // 0 = cantrip, 1 = level 1, etc.
    spell: string;
    alwaysPrepared?: boolean;  // Some spells are always prepared regardless of level
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
    innateSpells?: SpeciesSpell[];  // Spells for species without subspecies
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
