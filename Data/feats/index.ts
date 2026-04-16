
import { FEATS_EN } from './feats-en';
import type { Feat } from './feats-en';

// Re-export the full Feat interface from feats-en
export type { Feat } from './feats-en';

// Use English feats from feats-en
export const FEAT_OPTIONS: Feat[] = FEATS_EN;

export const useFeats = (): Feat[] => {
  return FEATS_EN;
};

// GENERIC_FEATURES - English translations of class features
export const GENERIC_FEATURES: Record<string, string> = {
  // Barbarian
  "Rage": "Enter rage as a Bonus Action. You gain resistance to B/P/S damage, a bonus to Strength damage, and advantage on Strength checks. Lasts until the end of your next turn or 10 min if extended (attacking, forcing a save, or using BA).",
  "Unarmored Defense": "Without armor, your AC is 10 + DEX + CON. Shield can be used.",
  "Weapon Mastery": "You master the mastery properties (like Cleave, Push, Slow) of chosen weapons.",
  "Danger Sense": "Advantage on Dexterity saves you can see (does not apply if incapacitated).",
  "Reckless Attack": "You gain advantage on Strength attacks, but attacks against you have advantage until your next turn.",
  "Primal Knowledge": "You gain proficiency in another skill from the barbarian list. While raging, you can use your Strength for Acrobatics, Intimidation, Perception, Stealth, or Survival checks.",
  "Fast Movement": "Your speed increases by 10 feet if not wearing heavy armor.",
  "Feral Instinct": "Advantage on Initiative rolls.",
  "Instinctive Pounce": "As part of the Bonus Action to enter rage, you can move up to half your speed.",
  "Brutal Strike": "When using Reckless Attack, you can give up advantage to deal +1d10 damage and an effect: Forceful Blow (push 15ft and follow) or Hamstring Blow (reduce speed by 15ft).",
  "Relentless Rage": "If you drop to 0 HP while raging, DC 10 CON save to return to 2x barbarian level HP. DC increases by +5 per use.",
  "Persistent Rage": "When rolling initiative, you recover one use of rage (1/Long Rest). Rage lasts 10 minutes without needing to extend.",
  "Indomitable Might": "If your Strength check total is less than your Strength score, you can use the score instead.",
  "Primal Champion": "Your Strength and Constitution increase by 4, to a maximum of 25.",

  // Bard
  "Bardic Inspiration": "Bonus Action: Inspire an ally within 60 feet (d6 scales to d8/d10/d12). The ally can add the die to a failed d20 check within the next hour.",
  "Jack of All Trades": "Add half your proficiency bonus (rounded down) to any ability check that does not already use your bonus.",
  "Font of Inspiration": "Recover all uses of Inspiration after a short or long rest. You can spend a spell slot to recover one use (no action).",
  "Countercharm": "Reaction: If you or an ally within 30 feet fail a save against Charmed or Frightened, you force a reroll with Advantage.",
  "Magical Secrets": "2024 Redesigned: When preparing spells, you can choose spells from the Bard, Cleric, Druid, or Wizard lists if they are of a level for which you have slots.",
  "Superior Inspiration": "When rolling initiative, if you have fewer than two uses of Bardic Inspiration, you recover up to two.",
  "Words of Creation": "You always have Power Word Heal and Power Word Kill prepared. You can affect a second creature within 10 feet of the main target.",

  // Cleric
  "Divine Order": "Level 1. Choose your sacred vocation: Protector (Martial weapons and heavy armor) or Thaumaturge (Bonus to Arcana/Religion and an extra cantrip).",
  "Channel Divinity": "Ability to channel divine energy for magical effects. You have 2 uses (more at higher levels) that recover after a short or long rest.",
  "Divine Spark": "Channel Divinity: Magical Action. At 30 feet, heal 1d8+mod or deal 1d8+mod Radiant/Necrotic damage (DC CON). Die scales at levels 7, 13, and 18.",
  "Turn Undead": "Channel Divinity: Magical Action. Undead within 30 feet must save Wisdom or become Incapacitated and Frightened for 1 minute.",
  "Sear Undead": "Level 5. When using Turn Undead, undead that fail the save take Radiant damage equal to your Wisdom modifier in d8s.",
  "Blessed Strikes": "Level 7. Choose between Divine Strike (1d8 extra damage on weapon attacks) or Potent Spellcasting (add Wisdom to cantrip damage).",
  "Divine Intervention": "Level 10. Magical Action: Choose a cleric spell of level 5 or less (no reaction) and cast it for free without components or slot. 1/Long Rest.",
  "Improved Blessed Strikes": "Level 14. Divine Strike increases to 2d8 damage. Potent Spellcasting now also grants THP (2x Wis mod) when casting a spell that damages.",
  "Greater Divine Intervention": "Level 20. When using Divine Intervention, you can choose to cast the spell Wish. After using it, you must wait 2d4 long rests to repeat.",

  // Druid
  "Druidic": "You know the secret language of druids. Additionally, you always have the Speak with Animals spell prepared.",
  "Primal Order": "Level 1. Choose your role: Mage (extra cantrip and bonus to Arcana/Nature) or Guardian (medium armor and martial weapons).",
  "Wild Shape": "Level 2. Bonus Action: Transform into a known Beast. Gain THP equal to your Druid level. Transformation lasts hours (level / 2).",
  "Wild Companion": "Level 2. Magical Action: Spend a use of Wild Shape to cast Find Familiar without material components.",
  "Wild Resurgence": "Level 5. 1/turn: Spend a spell slot to gain a use of Wild Shape (no action). Or spend Wild Shape to gain a level 1 slot (1/long rest).",
  "Elemental Fury": "Level 7. Choose between Potent Spellcasting (Wisdom to cantrip damage) or Primal Strike (1d8 extra elemental damage on melee attacks).",
  "Improved Elemental Fury": "Level 15. Potent Spellcasting increases cantrip range to 300 feet. Primal Strike increases extra damage to 2d8.",
  "Beast Spells": "Level 18. You can cast spells while in Wild Shape, as long as they do not have costly or consumable material components.",
  "Archdruid": "Level 20. Evergreen: If rolling initiative and you have no uses of Wild Shape, recover one. Nature Magician: Convert Wild Shape uses into spell slots (1 use = 2 levels).",

  // Fighter
  "Tactical Mind": "Level 2. If you fail a skill check, spend a use of Second Wind to add 1d10 to the result. If you still fail, you do not spend the use.",
  "Tactical Shift": "Level 5. When using Second Wind as a Bonus Action, you can move up to half your speed without provoking opportunity attacks.",
  "Indomitable": "Level 9. If you fail a save, you can reroll it adding a bonus equal to your Fighter level. Cannot be used again until a long rest (more uses at level 13 and 17).",
  "Tactical Master": "Level 9. When attacking with a weapon you have mastery of, you can replace its property with Push, Hamstring, or Slow.",
  "Two Extra Attacks": "Level 11. You can attack three times instead of once when you take the Attack action.",
  "Three Extra Attacks": "Level 20. You can attack four times instead of once when you take the Attack action.",
  "Studied Attacks": "Level 13. If you miss an attack against a creature, you have Advantage on your next attack against it before the end of your next turn.",
  "Second Wind": "Level 1. Bonus Action: Regain 1d10 + Fighter level HP. Once per short rest.",
  "Action Surge": "Level 2. On your turn, you can take one additional Action. Once per short rest (or twice at level 17).",
  "Improved Combat Superiority": "Level 7. Your maneuver die increases and you learn a second maneuver.",
  "Relentless": "Level 15. When you roll Initiative and have no uses of Second Wind, you recover one use.",

  // Paladin
  "Lay on Hands": "Level 1. Bonus Action: Heal 5 HP per point spent from your pool (5 x Level). You can also spend 5 points to cure the Poisoned condition.",
  "Paladin's Smite": "Level 2. You always have the Divine Smite spell prepared. You can cast it once per day without spending a spell slot after a Long Rest.",
  "Divine Sense": "Channel Divinity: Bonus Action (10 min). Detect Celestials, Infernal, and Undead within 60 feet. Also detect consecrated or desecrated places.",
  "Faithful Steed": "Level 5. You always have the Find Steed spell prepared. You can cast it once per day without spending a spell slot.",
  "Aura of Protection": "Level 6. You and allies within 10 feet gain a bonus to all saves equal to your Charisma modifier (minimum +1).",
  "Abjure Foes": "Level 9. Channel Divinity: Magical Action. Up to your Charisma modifier of enemies within 60 feet must save Wisdom or become Frightened (1 min).",
  "Aura of Courage": "Level 10. You and allies in your Aura of Protection are immune to the Frightened condition.",
  "Radiant Strikes": "Level 11. Your melee attacks deal 1d8 additional Radiant damage permanently.",
  "Restoring Touch": "Level 14. When using Lay on Hands, you can spend an additional 5 points to cure: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned.",
  "Aura Expansion": "Level 18. The radius of your Aura of Protection (and other class auras) increases to 30 feet.",

  // Ranger
  "Favored Enemy": "Level 1. You always have Hunter's Mark prepared. You can cast it for free a number of times equal to your proficiency bonus per day.",
  "Deft Explorer": "Level 2. You gain Expertise in one of your trained skills and know two additional languages.",
  "Roving": "Level 6. Your speed increases by 10 feet while not wearing heavy armor. You gain climbing and swimming speed equal to your current speed.",
  "Expertise": "Power to choose two trained skills to double the proficiency bonus (Lvl 1 and 6).",

  // Rogue
  "Steady Aim": "Level 3. Bonus Action: Gain Advantage on your next attack this turn if you have not moved. Your speed drops to 0 until the end of the turn.",
  "Cunning Strike": "Level 5. When using Sneak Attack, you can sacrifice 1d6 of damage to apply effects: Poison (DC 8+Dex+Prof), Trip (DC Dex), or Withdraw (move half speed).",
  "Improved Cunning Strike": "Level 11. You can use up to two Cunning Strike effects in a single attack, paying the die cost of both.",
  "Devious Strikes": "Level 14. New Cunning Strike effects: Stun (DC Con, cost 2d6), Knockout (DC Con, cost 6d6, Unconscious), and Darken (DC Dex, cost 3d6, Blinded).",
  "Reliable Talent": "Level 7. Whenever you make a skill or tool check in which you are proficient, treat any result of 9 or lower on the d20 as a 10.",
  "Slippery Mind": "Level 15. Your mind is difficult to control. You gain proficiency in Wisdom and Charisma saving throws.",
  "Stroke of Luck": "Level 20. If you fail a d20 check (attack or skill), you can turn the die result into a 20. 1/Short or long rest.",

  // Sorcerer
  "Innate Sorcery": "Level 1. Bonus Action (1 min): Your spell save DC increases by 1 and you have Advantage on the attack rolls of your spells. You can use it 2 times per Long Rest (or spend 2 sorcery points starting at level 7).",
  "Font of Magic": "Level 2. You have a power source represented by Sorcery Points. You can convert them to spell slots or use slots to gain points. All recover after a Long Rest.",
  "Sorcerous Restoration": "Level 5. At the end of a Short Rest, you recover sorcery points equal to half your level (rounded down).",
  "Sorcery Incarnate": "Level 7. While your Innate Sorcery is active, you can use up to two Metamagic options on each spell you cast.",
  "Arcane Apotheosis": "Level 20. While your Innate Sorcery is active, you can use a Metamagic option on each of your turns without spending sorcery points.",

  // Warlock
  "Eldritch Invocations": "Level 1. You receive fragments of forbidden knowledge. You gain additional invocations as you level up (Lvl 2: 3, Lvl 5: 5, Lvl 18: 10).",
  "Magical Cunning": "Level 2. Rite of 1 min: Recover Pact Magic slots (max half of total). 1/Long Rest (at level 20 recover all).",
  "Contact Patron": "Level 9. You always have Contact Other Plane prepared. You can cast it for free to contact your patron and automatically succeed the save.",
  "Mystic Arcanum": "Level 11. Your patron grants you a magical secret. Choose a level 6 spell to cast for free 1/Long Rest. You gain more at level 13, 15, and 17.",
  "Eldritch Master": "Level 20. Your Magical Cunning trait now allows you to recover ALL your Pact Magic slots after the 1 minute rite.",

  // Monk
  "Martial Arts": "Monk weapons now include all simple melee weapons and all martial melee weapons that have the Light property.",
  "Monk's Focus": "Renamed Ki. Spend points for Flurry of Blows, Patient Defense (Dodge as BA), or Step of the Wind (Dash+Disengage as BA).",
  "Uncanny Metabolism": "Level 2. Regain all Focus points on Initiative roll once per day, and heal some HP.",
  "Deflect Attacks": "Level 3. Now works on all melee and ranged attacks that deal B/P/S damage. Can redirect for 1 Focus.",
  "Self-Restoration": "Level 10. End Charmed, Frightened, or Poisoned at the end of each turn automatically.",
  "Deflect Energy": "Level 13. Works on all damage types.",
  "Perfect Focus": "Level 15. Start combat with at least 4 Focus points.",
  "Superior Defense": "Level 18. Gain resistance to all damage except Force for 1 minute (cost 3 Focus).",
  "Body and Mind": "Level 20. +4 to Dex and Wis (max 26).",

  // Fighter/Warlock/Sorcerer
  "Extra Attack": "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
  "Empowered Strikes": "Your Unarmed Strikes deal Force damage instead of Bludgeoning.",

  // Monk/Rogue
  "Evasion": "No damage on successful Dex save vs area effects.",

  // Wizard
  "Ritual Adept": "Level 1 Wizard feature. Constant access to rituals in your spellbook.",
  "Arcane Recovery": "Recover spell slots (half level sum) during short rest.",
  "Scholar": "Level 2. Expertise in one knowledge skill.",
  "Memorize Spell": "Level 5. Swap one prepared spell during a short rest.",
  "Spell Mastery": "Level 18. Cast one 1st and one 2nd level spell freely.",
  "Signature Spells": "Level 20. Gain two 3rd level spells always prepared and cast free once each."
};