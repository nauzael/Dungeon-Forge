/**
 * Tags Predefinidos - Dungeon Forge
 * Categorías de tags, palette de colores, y utilidad de color determinística
 */
import { NoteTag } from '../../types';

// ─── Exported Interfaces ───────────────────────────────────────────────

export interface PredefinedTag {
  id: string;
  label: string;
  icon: string;
  category: string;
}

export interface TagCategory {
  id: string;
  label: string;
  icon: string;
  tags: PredefinedTag[];
}

// ─── Color Palette ─────────────────────────────────────────────────────

export const TAG_COLOR_PALETTE: string[] = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#14b8a6', // teal
  '#22c55e', // green
  '#a855f7', // purple
  '#f43f5e', // rose
  '#f97316', // orange
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#eab308', // yellow
];

// ─── Category Colors ───────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  quest: '#f59e0b',
  entity: '#3b82f6',
  lore: '#14b8a6',
  location: '#22c55e',
  item: '#a855f7',
  meta: '#f43f5e',
  combat: '#f97316',
};

// ─── TAG_CATEGORIES (7 categories) ─────────────────────────────────────

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'quest',
    label: 'Quest',
    icon: 'explore',
    tags: [
      { id: 'clue', label: 'clue', icon: 'search', category: 'quest' },
      { id: 'mystery', label: 'mystery', icon: 'visibility', category: 'quest' },
      { id: 'main-quest', label: 'main-quest', icon: 'flag', category: 'quest' },
      { id: 'side-quest', label: 'side-quest', icon: 'outgoing_mail', category: 'quest' },
    ],
  },
  {
    id: 'entity',
    label: 'Entity',
    icon: 'group',
    tags: [
      { id: 'npc', label: 'npc', icon: 'person', category: 'entity' },
      { id: 'enemy', label: 'enemy', icon: 'dangerous', category: 'entity' },
      { id: 'ally', label: 'ally', icon: 'diversity_3', category: 'entity' },
      { id: 'faction', label: 'faction', icon: 'account_balance', category: 'entity' },
    ],
  },
  {
    id: 'lore',
    label: 'Lore',
    icon: 'menu_book',
    tags: [
      { id: 'lore', label: 'lore', icon: 'auto_stories', category: 'lore' },
      { id: 'history', label: 'history', icon: 'history', category: 'lore' },
      { id: 'prophecy', label: 'prophecy', icon: 'preview', category: 'lore' },
    ],
  },
  {
    id: 'location',
    label: 'Location',
    icon: 'map',
    tags: [
      { id: 'dungeon', label: 'dungeon', icon: 'fort', category: 'location' },
      { id: 'city', label: 'city', icon: 'location_city', category: 'location' },
      { id: 'landmark', label: 'landmark', icon: 'landscape', category: 'location' },
      { id: 'shop', label: 'shop', icon: 'storefront', category: 'location' },
    ],
  },
  {
    id: 'item',
    label: 'Item',
    icon: 'inventory_2',
    tags: [
      { id: 'treasure', label: 'treasure', icon: 'diamond', category: 'item' },
      { id: 'key-item', label: 'key-item', icon: 'vpn_key', category: 'item' },
      { id: 'magic-item', label: 'magic-item', icon: 'auto_awesome', category: 'item' },
    ],
  },
  {
    id: 'meta',
    label: 'Meta',
    icon: 'edit_note',
    tags: [
      { id: 'todo', label: 'todo', icon: 'checklist', category: 'meta' },
      { id: 'urgent', label: 'urgent', icon: 'priority_high', category: 'meta' },
      { id: 'theory', label: 'theory', icon: 'psychology', category: 'meta' },
      { id: 'secret', label: 'secret', icon: 'visibility_off', category: 'meta' },
    ],
  },
  {
    id: 'combat',
    label: 'Combat',
    icon: 'swords',
    tags: [
      { id: 'strategy', label: 'strategy', icon: 'psychology', category: 'combat' },
      { id: 'weakness', label: 'weakness', icon: 'bug_report', category: 'combat' },
      { id: 'loot', label: 'loot', icon: 'redeem', category: 'combat' },
    ],
  },
];

// ─── Internal Lookup ───────────────────────────────────────────────────

/** Build a fast label → category-color lookup from TAG_CATEGORIES */
function buildPredefinedColorMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const cat of TAG_CATEGORIES) {
    const color = CATEGORY_COLORS[cat.id];
    for (const tag of cat.tags) {
      map[tag.label] = color;
    }
  }
  return map;
}

const PREDEFINED_TAG_COLORS = buildPredefinedColorMap();

// ─── Public Functions ──────────────────────────────────────────────────

/**
 * Asigna color determinístico basado en el label del tag.
 * Tags predefinidos retornan su color de categoría.
 * Tags custom: hash determinístico del string label para elegir de TAG_COLOR_PALETTE.
 */
export function getTagColor(label: string): string {
  // Predefined tag → return its category color
  if (PREDEFINED_TAG_COLORS[label]) {
    return PREDEFINED_TAG_COLORS[label];
  }
  // Custom tag → deterministic hash
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = ((hash << 5) - hash) + label.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % TAG_COLOR_PALETTE.length;
  return TAG_COLOR_PALETTE[index];
}

/**
 * Retorna un flat list de todos los tags predefinidos como NoteTag[].
 * Cada tag incluye su color de categoría asignado via getTagColor.
 */
export function getAllPredefinedTags(): NoteTag[] {
  return TAG_CATEGORIES.flatMap(cat =>
    cat.tags.map(t => ({
      id: t.id,
      label: t.label,
      color: getTagColor(t.label),
      icon: t.icon,
    }))
  );
}
