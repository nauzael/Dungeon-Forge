
export { GENERIC_AVATAR, MOCK_CHARACTERS } from './mocks/characters';

export const MAP_TEXTURE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCci_9LlzLBRVKMl1mc_U-PI7pOA37e5v9j0IBVPIWRTYMaSEvDrM1dNax_MOPK-cvdJKWHInGTW3RUm3dfYRMTZ5897zlqHPcb4EgyRbBn918kFop8Q7PDDdLrBSMF1NifHl7bvNMqa0jmiqxcY36X3xpBWnBZYFL42kFa8rqcCl9HKLdzHTFmAStCV2e9bZm1NjB_czY2xLfbStx3TdJheuPvI3tPOG8DwFefJ1fFM3ocgOa04FuaZHvYn0RBqQHqDyx1Tt2TSSf8";

// Map raw data names to UI elements (Colors, Icons, Roles)
export const CLASS_UI_MAP: Record<string, { role: string, color: string, icon: string }> = {
  "Barbarian": { role: "Rage Tank", color: "text-orange-600", icon: "swords" },
  "Bard": { role: "Support & Control", color: "text-purple-500", icon: "music_note" },
  "Cleric": { role: "Divine Healing", color: "text-yellow-500", icon: "verified_user" },
  "Druid": { role: "Nature & Shapes", color: "text-green-600", icon: "forest" },
  "Fighter": { role: "Weapon Master", color: "text-red-500", icon: "sports_martial_arts" },
  "Monk": { role: "Martial Arts", color: "text-blue-400", icon: "self_improvement" },
  "Paladin": { role: "Holy Warrior", color: "text-yellow-600", icon: "shield" },
  "Ranger": { role: "Explorer", color: "text-emerald-500", icon: "radar" },
  "Rogue": { role: "Stealth & Damage", color: "text-slate-400", icon: "visibility_off" },
  "Sorcerer": { role: "Innate Magic", color: "text-red-400", icon: "local_fire_department" },
  "Warlock": { role: "Arcane Pact", color: "text-purple-700", icon: "skull" },
  "Wizard": { role: "Arcane Master", color: "text-blue-600", icon: "auto_fix_high" },
};

export const SPECIES_UI_MAP: Record<string, { color: string, icon: string }> = {
  "Human": { color: "text-blue-500", icon: "accessibility_new" },
  "Elf": { color: "text-green-500", icon: "eco" },
  "Dwarf": { color: "text-orange-600", icon: "construction" },
  "Halfling": { color: "text-yellow-500", icon: "directions_walk" },
  "Dragonborn": { color: "text-red-600", icon: "local_fire_department" },
  "Gnome": { color: "text-purple-500", icon: "psychology" },
  "Orc": { color: "text-emerald-700", icon: "fitness_center" },
  "Tiefling": { color: "text-rose-500", icon: "contrast" },
  "Aasimar": { color: "text-amber-400", icon: "brightness_high" },
  "Goliath": { color: "text-slate-500", icon: "landscape" },
  "Boggart": { color: "text-emerald-500", icon: "masks" },
  "Changeling": { color: "text-violet-500", icon: "swap_horiz" },
  "Dhampir": { color: "text-purple-500", icon: "nightlight" },
  "Faerie": { color: "text-pink-400", icon: "flutter_dash" },
  "Flamekin": { color: "text-orange-500", icon: "whatshot" },
  "Kalashtar": { color: "text-indigo-500", icon: "psychology_alt" },
  "Khoravar": { color: "text-purple-400", icon: "palette" },
  "Lorwyn Changeling": { color: "text-violet-400", icon: "change_history" },
  "Rimekin": { color: "text-cyan-400", icon: "ac_unit" },
  "Shifter": { color: "text-amber-600", icon: "pets" },
  "Warforged": { color: "text-zinc-500", icon: "smart_toy" },
};

export const BACKGROUND_UI_MAP: Record<string, { color: string, icon: string }> = {
  'Acolyte': { color: 'text-yellow-500', icon: 'self_improvement' },
  'Artisan': { color: 'text-orange-500', icon: 'handyman' },
  'Charlatan': { color: 'text-purple-500', icon: 'theater_comedy' },
  'Criminal': { color: 'text-slate-500', icon: 'visibility_off' },
  'Entertainer': { color: 'text-pink-500', icon: 'music_note' },
  'Farmer': { color: 'text-green-600', icon: 'agriculture' },
  'Guard': { color: 'text-blue-600', icon: 'local_police' },
  'Guide': { color: 'text-emerald-500', icon: 'map' },
  'Hermit': { color: 'text-teal-600', icon: 'nature_people' },
  'Merchant': { color: 'text-amber-500', icon: 'storefront' },
  'Noble': { color: 'text-indigo-500', icon: 'diamond' },
  'Sage': { color: 'text-blue-400', icon: 'menu_book' },
  'Sailor': { color: 'text-cyan-500', icon: 'sailing' },
  'Scribe': { color: 'text-slate-600', icon: 'edit_note' },
  'Soldier': { color: 'text-red-600', icon: 'shield' },
  'Wayfarer': { color: 'text-lime-600', icon: 'hiking' }
};
