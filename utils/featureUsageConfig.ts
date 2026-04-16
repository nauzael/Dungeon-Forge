import { FeatureUsageConfig } from '../types';

export const FEATURE_USAGE_CONFIGS: Record<string, FeatureUsageConfig> = {
  // === Core Class Features - Active Abilities with Limited Uses ===
  'Second Wind': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Action Surge': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Indomitable': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Rage': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Channel Divinity': {
    maxFormula: '2',
    resetType: 'short_rest',
  },
  'Lay On Hands': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Wild Shape': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Bardic Inspiration': {
    maxFormula: 'CHA',
    resetType: 'long_rest',
  },
  'Focus': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Arcane Recovery': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },

  // === Warlock ===
  'Magical Cunning': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Steps of the Fey': {
    maxFormula: 'CHA',
    resetType: 'long_rest',
  },
  "Dark One's Own Luck": {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Eldritch Master': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Contact Patron': {
    maxFormula: '1',
    resetType: 'long_rest',
  },

  // === Rogue ===
  'Bloodthirst': {
    maxFormula: 'INT',
    resetType: 'long_rest',
  },
  'Psychic Veil': {
    maxFormula: '1',
    resetType: 'long_rest',
    costToRestore: { resource: 'psionicEnergyDice', amount: 1 },
  },
  'Rend Mind': {
    maxFormula: '1',
    resetType: 'long_rest',
    costToRestore: { resource: 'psionicEnergyDice', amount: 3 },
  },

  // === Paladin ===
  'Divine Sense': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Second Breath': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Cleansing Touch': {
    maxFormula: 'CHA',
    resetType: 'long_rest',
  },

  // === Ranger Subclasses ===
  'Dread Ambusher': {
    maxFormula: 'proficiencyBonus',
    resetType: 'long_rest',
  },
  "Stalker's Flurry": {
    maxFormula: 'proficiencyBonus',
    resetType: 'long_rest',
  },
  'Shadowy Dodge': {
    maxFormula: 'proficiencyBonus',
    resetType: 'long_rest',
  },
  'Misty Wanderer': {
    maxFormula: 'WIS',
    resetType: 'long_rest',
  },
  'Fey Reinforcements': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Beguiling Twist': {
    maxFormula: 'proficiencyBonus',
    resetType: 'long_rest',
  },

  // === Barbarian Subclasses ===
  'Intimidating Presence': {
    maxFormula: '1',
    resetType: 'long_rest',
    costToRestore: { resource: 'rageUses', amount: 1 },
  },
  'Zealous Presence': {
    maxFormula: '1',
    resetType: 'long_rest',
    costToRestore: { resource: 'rageUses', amount: 1 },
  },
  'Rage of the Gods': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Warrior of the Gods': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },

  // === Monk Subclasses ===
  'Quivering Palm': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Wholeness of Body': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Empty Body': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Timeless Body': {
    maxFormula: '1',
    resetType: 'always',
  },

  // === Warlock Subclasses ===
  'Misty Escape': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Searing Vengeance': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Hurl Through Hell': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Create Thrall': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Vestige Recovery': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Aura of Power': {
    maxFormula: '1',
    resetType: 'long_rest',
  },

  // === Fighter Subclasses ===
  'Combat Superiority': {
    maxFormula: 'level',
    resetType: 'short_rest',
  },
  'Know Your Enemy': {
    maxFormula: 'proficiencyBonus',
    resetType: 'long_rest',
  },
  'Arcane Charge': {
    maxFormula: '1',
    resetType: 'short_rest',
  },

  // === Psi Warrior ===
  'Psionic Power': {
    maxFormula: 'level',
    resetType: 'short_rest',
  },
  'Bulwark of Force': {
    maxFormula: '1',
    resetType: 'long_rest',
    costToRestore: { resource: 'psionicEnergyDice', amount: 1 },
  },

  // === Artificer ===
  'Flash of Genius': {
    maxFormula: 'INT',
    resetType: 'long_rest',
  },

  // === Cleric Subclasses ===
  'Preserve Life': {
    maxFormula: '2',
    resetType: 'short_rest',
  },
  'Guiding Bolt': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Turn Undead': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Holy Week': {
    maxFormula: '1',
    resetType: 'long_rest',
  },
  'Dampen Elements': {
    maxFormula: 'CHA',
    resetType: 'short_rest',
  },
  'Invoke Duplicity': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Read Thoughts': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Psionic Blast': {
    maxFormula: 'INT',
    resetType: 'long_rest',
  },
  'Radiant Soul': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Radiance of the Dawn': {
    maxFormula: '2',
    resetType: 'short_rest',
  },

  // === Druid Subclasses ===
  'Baleful Scion': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Nurturing Voice': {
    maxFormula: 'level',
    resetType: 'long_rest',
  },
  'Wild Surge': {
    maxFormula: 'level',
    resetType: 'short_rest',
  },

  // === Paladin Oaths ===
  'Sacred Weapon': {
    maxFormula: 'CHA',
    resetType: 'short_rest',
  },
  'Turn the Unholy': {
    maxFormula: 'CHA',
    resetType: 'short_rest',
  },
  "Nature's Wrath": {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Abjure Enemy': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Vow of Enmity': {
    maxFormula: '1',
    resetType: 'short_rest',
  },
  'Shattering Smite': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Brash Smite': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Wrathful Smite': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Blinding Smite': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Staggering Smite': {
    maxFormula: '1',
    resetType: 'always',
  },

  // === Ranger - Hunter ===
  'Giant Killer': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Horizon Walker': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Volley': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Whirlwind Attack': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Multiattack Defense': {
    maxFormula: '1',
    resetType: 'always',
  },
  'Steel Will': {
    maxFormula: '1',
    resetType: 'always',
  },
};
