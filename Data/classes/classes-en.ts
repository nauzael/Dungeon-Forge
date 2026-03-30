import { Ability, Skill, DetailData, SubclassData } from '../../types';

// AUTO-GENERATED from docs/Manual/01-classes.md
// Do not edit manually - regenerate with: node generate-classes.cjs


export const artificerEn = {
  details: {
    name: 'Artificer',
    description: 'Masters of invention, Artificers use ingenuity and magic to unlock extraordinary capabilities in objects. They see magic as a complex system waiting to be decoded and then harnessed in their spells and inventions.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Artificer level' },
      { name: 'Saving Throws', description: 'CON and INT' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['CON', 'INT'] as Ability[],
  statPriorities: ['INT', 'DEX', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Sleight of Hand'] as Skill[] },
  progression: {1:["Spellcasting","Tinker's Magic"],2:["Replicate Magic Item"],3:["Artificer Subclass"],4:["Ability Score Improvement"],5:["Subclass Feature"],6:["Magic Item Tinker"],7:["Flash of Genius"],8:["Ability Score Improvement"],9:["Subclass Feature"],10:["Magic Item Adept"],11:["Spell-Storing Item"],12:["Ability Score Improvement"],14:["Advanced Artifice"],15:["Subclass Feature"],16:["Ability Score Improvement"],18:["Magic Item Master"],19:["Epic Boon"],20:["Soul of Artifice"]},
  subclasses: [
    {
      name: 'Alchemist',
      description: 'Alchemists combine reagents to produce magical effects.',
      features: {
        3: [
          { name: 'Tools of the Trade', description: 'Proficiency with Alchemist\'s Supplies and Herbalism Kit. When brewing potion, crafting time halved.' },
          { name: 'Alchemist Spells', description: 'Always prepared: 3: Healing Word, Ray of Sickness; 5: Flaming Sphere, Melf\'s Acid Arrow; 9: Gaseous Form, Mass Healing Word; 13: Death Ward, Vitriolic Sphere; 17: Cloudkill, Raise Dead.' },
          { name: 'Experimental Elixir', description: 'End of Long Rest create two elixirs (more at levels 5, 9, 15). Roll on table or choose effect. Drinking: Bonus Action. Creating additional: Magic action, expend spell slot, choose from table. Effects: Healing (2d8 plus Int mod HP, scales at 9/15); Swiftness (Speed +10 feet for 1 hour, scales); Resilience (+1 AC for 10 minutes, scales); Boldness (1d4 to attacks and saves for 1 minute, scales); Flight (Fly 10 feet for 10 minutes, scales); or choose other row.' },
        ],
        5: [
          { name: 'Alchemical Savant', description: 'When casting spell with Alchemist\'s Supplies as Focus, add Int modifier to one roll that restores HP or deals Acid/Fire/Poison damage.' },
        ],
        9: [
          { name: 'Restorative Reagents', description: 'Cast Lesser Restoration without slot, without preparing, using Alchemist\'s Supplies. Uses equal to Int modifier per Long Rest.' },
        ],
        15: [
          { name: 'Chemical Mastery', description: 'Alchemical Eruption: when Artificer spell deals Acid/Fire/Poison damage, add 2d8 Force damage. Chemical Resistance: Resistance to Acid and Poison, immunity to Poisoned. Conjured Cauldron: cast Tasha\'s Bubbling Cauldron without slot/components using Alchemist\'s Supplies. Once per Long Rest.' },
        ],
      }
    },
    {
      name: 'Armorer',
      description: 'Armorers modify armor to enhance abilities like a second skin.',
      features: {
        3: [
          { name: 'Tools of the Trade', description: 'Armor Training with Heavy armor. Proficiency with Smith\'s Tools. Crafting armor time halved.' },
          { name: 'Armorer Spells', description: 'Always prepared: 3: Magic Missile, Thunderwave; 5: Mirror Image, Shatter; 9: Hypnotic Pattern, Lightning Bolt; 13: Fire Shield, Greater Invisibility; 17: Passwall, Wall of Force.' },
          { name: 'Arcane Armor', description: 'Magic action turn wearing armor into Arcane Armor (until removed/die). Benefits: No Strength requirement; don/doff as Utilize action; use as Spellcasting Focus. Three models (choose on Short/Long Rest with tools): Dreadnaught (Force Demolisher 1d10 Reach, push/pull 10 feet; Giant Stature: Bonus Action enlarge 1 minute, reach +5 feet, become Large, uses Int mod); Guardian (Thunder Pulse 1d8 Thunder, target Disadvantage on attacks vs others; Defensive Field: when Bloodied, Bonus Action Temporary Hit Points equal Artificer level); Infiltrator (Lightning Launcher 1d6/90/300 feet, extra 1d6 on hit; Powered Steps: Speed +5 feet; Dampening Field: Advantage on Stealth).' },
        ],
        5: [
          { name: 'Extra Attack', description: 'Attack twice instead of once.' },
        ],
        9: [
          { name: 'Improved Armorer', description: 'Learn additional Replicate Magic Item plan (Armor category). Can create two items with that feature. Improved Arsenal: +1 to attack/damage with armor weapon.' },
        ],
        15: [
          { name: 'Perfected Armor', description: 'Dreadnaught: demolisher damage 2d6; Giant Stature reach +10, can become Huge, Advantage on Strength checks/saves. Guardian: Thunder Pulse damage 1d10; Reaction pull Huge or smaller creature 25 feet toward you, attack if within 5 feet. Infiltrator: Lightning Launcher 2d6; target glimmers (Disadvantage on attacks against you); Bonus Action Fly Speed twice Speed.' },
        ],
      }
    },
    {
      name: 'Artillerist',
      description: 'Artillerists use magic to hurl energy, projectiles, and explosions.',
      features: {
        3: [
          { name: 'Tools of the Trade', description: 'Proficiency with Martial Ranged weapons. Proficiency with Woodcarver\'s Tools. Crafting magic Wands time halved.' },
          { name: 'Artillerist Spells', description: 'Always prepared: 3: Shield, Thunderwave; 5: Scorching Ray, Shatter; 9: Fireball, Wind Wall; 13: Ice Storm, Wall of Fire; 17: Cone of Cold, Wall of Force.' },
          { name: 'Eldritch Cannon', description: 'Magic action create Small/Tiny Eldritch Cannon in unoccupied space within 5 feet. AC 18, HP 5 times Artificer level. Activate with Bonus Action (within 60 feet): Flamethrower (15-foot Cone, 2d8 Fire, Dex save); Force Ballista (ranged spell attack 120 feet, 2d8 Force, push 5 feet); Protector (Temporary Hit Points 1d8 plus Int mod to self and creatures within 10 feet). One cannon at a time. Destroyed at 0 HP, after 1 hour, or dismiss.' },
        ],
        5: [
          { name: 'Arcane Firearm', description: 'Long Rest carve sigils into Rod/Staff/Wand/Martial Ranged weapon to make Arcane Firearm. Use as Spellcasting Focus. When casting Artificer spell through it, roll 1d8 and add to one damage roll.' },
        ],
        9: [
          { name: 'Explosive Cannon', description: 'Detonate: when cannon takes damage, Reaction detonate (destroy cannon, 3d10 Force to creatures within 20 feet, Dex save). Firepower: cannon damage and Protector Temporary Hit Points increase by 1d8.' },
        ],
        15: [
          { name: 'Fortified Position', description: 'Double Firepower: two cannons at once, create both with same action. Shimmering Field: Half Cover for you and allies within 10 feet of cannon.' },
        ],
      }
    },
    {
      name: 'Battle Smith',
      description: 'Battle Smiths protect and repair, accompanied by Steel Defender.',
      features: {
        3: [
          { name: 'Tools of the Trade', description: 'Proficiency with Smith\'s Tools. Crafting weapons time halved.' },
          { name: 'Battle Smith Spells', description: 'Always prepared: 3: Heroism, Shield; 5: Shining Smite, Warding Bond; 9: Aura of Vitality, Conjure Barrage; 13: Aura of Purity, Fire Shield; 17: Banishing Smite, Mass Cure Wounds.' },
          { name: 'Steel Defender', description: 'Create Small/Tiny construct with Arcane Automation (AC 15, HP 5 plus four times Artificer level, Speed 30 ft., Darkvision 60 ft., melee 1d4 plus PB Piercing/Slashing). Shares Reaction with you. Defensive: can distract triggering attack; Defiant: after you roll Initiative, gain temporary HP equal to Artificer level. On Short Rest, repair with Tinker\'s Tools.' },
        ],
        5: [
          { name: 'Extra Attack', description: 'Attack twice instead of once.' },
        ],
        9: [
          { name: 'Arcane Jolt', description: 'When you hit with weapon attack, deal extra 2d6 Force damage. When dealing damage, choose ally within 30 feet to heal 2d6 HP. Uses equal to Int modifier per Long Rest.' },
        ],
        15: [
          { name: 'Improved Steel Defender', description: 'Steel Defender gains: Immune to your spells; Bonus to AC equal to Int modifier; attack uses d8; Defensive/Defiant improved; can take Dash, Disengage, Help, or Use an Object as Bonus Action.' },
        ],
      }
    },
    {
      name: 'Cartographer',
      description: 'Cartographers map terrain, dungeons, and realms, using maps to guide and protect.',
      features: {
        3: [
          { name: 'Cartographer\'s Tools', description: 'Proficiency with Cartographer\'s Tools and Navigator\'s Tools. When creating map with these tools, time halved.' },
          { name: 'Cartographer Spells', description: 'Always prepared: 3: Identify, Longstrider; 5: Locate Object, Suggestion; 9: Clairvoyance, Sending; 13: Locate Creature, Tongues; 17: Legend Lore, Teleportation Circle.' },
          { name: 'Strategic Mark', description: 'When creating map with tools, mark up to five locations/objects. As Magic action, learn direction/distance to marked target. Can also mark willing creature. Number of marks equals Int modifier, regained on Long Rest.' },
          { name: 'Guide', description: 'While holding map made with Cartographer\'s Tools, allies in 30 feet add Int modifier to Initiative. When you use Strategic Mark, allies have Advantage on saves vs. spells that would trap or banish them.' },
        ],
        5: [
          { name: 'Expanding Horizons', description: 'Strategic Mark range increases to 1 mile. When casting Teleportation Circle, create temporary circle (lasts 1 hour) that doesn\'t require materials.' },
        ],
        9: [
          { name: 'Cartographer\'s Eye', description: 'As Bonus Action, cast Locate Object at will (range 300 feet). When casting spells from Cartographer Spells, add Proficiency Bonus to Survival checks to avoid getting lost.' },
        ],
        15: [
          { name: 'Perfect Cartography', description: 'Strategic Mark marks an area (100-foot Cube). When you enter marked area, choose: gain Tremorsense 60 feet for 1 minute; or create three magic mouth alarms that last until rest. When casting Teleportation Circle, it becomes permanent without requiring a key object.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: {"INT":15,"DEX":14,"CON":13,"WIS":12,"CHA":10,"STR":8}
};

export const barbarianEn = {
  details: {
    name: 'Barbarian',
    description: 'Barbarians are mighty warriors who are powered by primal forces of the multiverse that manifest as a Rage. More than a mere emotion—and not limited to anger—this Rage is an incarnation of a predator\'s ferocity, a storm\'s fury, and a sea\'s turmoil.',
    traits: [
      { name: 'Hit Point Die', description: 'D12 per Barbarian level' },
      { name: 'Saving Throws', description: 'STR and CON' },
    ]
  } as DetailData,
  hitDie: 12,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] as Skill[] },
  progression: {1:["Rage","Unarmored Defense","Weapon Mastery"],2:["Danger Sense","Reckless Attack"],3:["Barbarian Subclass","Primal Knowledge"],4:["Ability Score Improvement"],5:["Extra Attack","Fast Movement"],7:["Feral Instinct","Instinctive Pounce"],8:["Ability Score Improvement"],9:["Brutal Strike"],11:["Relentless Rage"],12:["Ability Score Improvement"],13:["Improved Brutal Strike"],15:["Persistent Rage"],16:["Ability Score Improvement"],17:["Improved Brutal Strike"],18:["Indomitable Might"],19:["Epic Boon"],20:["Primal Champion"]},
  subclasses: [
    {
      name: 'Path of the Berserker',
      description: 'Channel Rage into Violent Fury. Barbarians who walk the Path of the Berserker direct their Rage primarily toward violence.',
      features: {
        3: [
          { name: 'Frenzy', description: 'If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack.' },
        ],
        6: [
          { name: 'Mindless Rage', description: 'You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you\'re Charmed or Frightened when you enter your Rage, the condition ends on you.' },
        ],
        10: [
          { name: 'Retaliation', description: 'When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike.' },
        ],
        14: [
          { name: 'Intimidating Presence', description: 'As a Bonus Action, you can strike terror into others with your menacing presence and primal power. Each creature of your choice in a 30-foot Emanation must make a Wisdom saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, a creature has the Frightened condition for 1 minute. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a use of your Rage.' },
        ],
      }
    },
    {
      name: 'Path of the Wild Heart',
      description: 'Walk in Community with the Animal World. Barbarians who follow the Path of the Wild Heart view themselves as kin to animals.',
      features: {
        3: [
          { name: 'Animal Speaker', description: 'You can cast the Beast Sense and Speak with Animals spells but only as Rituals. Wisdom is your spellcasting ability for them.' },
          { name: 'Rage of the Wilds', description: 'Your Rage taps into the primal power of animals. Whenever you activate your Rage, you gain one of the following options of your choice: Bear (Resistance to every damage type except Force, Necrotic, Psychic, and Radiant); Eagle (When you activate your Rage, you can take the Disengage and Dash actions as part of that Bonus Action); Wolf (While your Rage is active, your allies have Advantage on attack rolls against any enemy of yours within 5 feet of you).' },
        ],
        6: [
          { name: 'Aspect of the Wilds', description: 'You gain one of the following options of your choice: Owl (Darkvision with a range of 60 feet); Panther (Climb Speed equal to your Speed); Salmon (Swim Speed equal to your Speed).' },
        ],
        10: [
          { name: 'Nature Speaker', description: 'You can cast the Commune with Nature spell but only as a Ritual.' },
        ],
        14: [
          { name: 'Power of the Wilds', description: 'Whenever you activate your Rage, you gain one of the following options: Falcon (Fly Speed equal to your Speed); Lion (any enemies within 5 feet have Disadvantage on attack rolls against targets other than you); Ram (Large or smaller creature has Prone condition when you hit it with a melee attack).' },
        ],
      }
    },
    {
      name: 'Path of the World Tree',
      description: 'Trace the Roots and Branches of the Multiverse. Barbarians who follow the Path of the World Tree connect with the cosmic tree Yggdrasil through their Rage.',
      features: {
        3: [
          { name: 'Vitality of the Tree', description: 'Your Rage taps into the life force of the World Tree. You gain: Vitality Surge (Temporary Hit Points equal to your Barbarian level when you activate your Rage); Life-Giving Force (At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet to gain Temporary Hit Points).' },
        ],
        6: [
          { name: 'Branches of the Tree', description: 'Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral branches. The target must succeed on a Strength saving throw or be teleported to an unoccupied space within 5 feet of yourself.' },
        ],
        10: [
          { name: 'Battering Roots', description: 'During your turn, your reach is 10 feet greater with any Melee weapon that has the Heavy or Versatile property.' },
        ],
        14: [
          { name: 'Travel along the Tree', description: 'When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see.' },
        ],
      }
    },
    {
      name: 'Path of the Zealot',
      description: 'Rage in Ecstatic Union with a God. Barbarians who walk the Path of the Zealot receive boons from a god or pantheon.',
      features: {
        3: [
          { name: 'Divine Fury', description: 'On each of your turns while your Rage is active, the first creature you hit with a weapon or an Unarmed Strike takes extra damage equal to 1d6 plus half your Barbarian level (round down). The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage.' },
          { name: 'Warrior of the Gods', description: 'You have a pool of four d12s that you can spend to heal yourself. As a Bonus Action, you can expend dice from the pool, roll them, and regain a number of Hit Points equal to the roll\'s total. Your pool regains all expended dice when you finish a Long Rest.' },
        ],
        6: [
          { name: 'Fanatical Focus', description: 'Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus.' },
        ],
        10: [
          { name: 'Zealous Presence', description: 'As a Bonus Action, you unleash a battle cry. Up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you expend a use of your Rage.' },
        ],
        14: [
          { name: 'Rage of the Gods', description: 'When you activate your Rage, you can assume the form of a divine warrior for 1 minute or until you drop to 0 Hit Points. While in this form, you gain Flight, Resistance to Necrotic, Psychic, and Radiant damage, and when a creature within 30 feet of you would drop to 0 Hit Points, you can expend a use of your Rage to instead change the target\'s Hit Points to a number equal to your Barbarian level.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: {"STR":15,"CON":14,"DEX":13,"WIS":12,"CHA":10,"INT":8}
};

export const bardEn = {
  details: {
    name: 'Bard',
    description: 'Invoking magic through music, dance, and verse, Bards are expert at inspiring others, soothing hurts, disheartening foes, and creating illusions.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Bard level' },
      { name: 'Saving Throws', description: 'DEX and CHA' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'DEX', 'CON'] as Ability[],
  skillData: { count: 3, options: ['Any 3 skills'] as Skill[] },
  progression: {1:["Bardic Inspiration","Spellcasting"],2:["Expertise","Jack of all Trades"],3:["Bard Subclass"],4:["Ability Score Improvement"],5:["Font of Inspiration"],6:["Subclass feature"],7:["Countercharm"],8:["Ability Score Improvement"],9:["Expertise"],10:["Magical Secrets"],11:["—"],12:["Ability Score Improvement"],13:["—"],14:["Subclass feature"],15:["—"],16:["Ability Score Improvement"],17:["—"],18:["Superior Inspiration"],19:["Epic Boon"],20:["Words of Creation"]},
  subclasses: [
    {
      name: 'College of Dance',
      description: 'Move in Harmony with the Cosmos. Bards of the College of Dance know that the Words of Creation can\'t be contained within speech or song.',
      features: {
        3: [
          { name: 'Dazzling Footwork', description: 'While you aren\'t wearing armor or wielding a Shield, you gain: Dance Virtuoso (Advantage on any Charisma (Performance) check you make that involves you dancing); Unarmored Defense (Your base Armor Class equals 10 plus your Dexterity and Charisma modifiers); Agile Strikes (When you expend a use of your Bardic Inspiration, you can make one Unarmed Strike as part of that action); Bardic Damage (You can use Dexterity instead of Strength for Unarmed Strikes, dealing Bludgeoning damage equal to a roll of your Bardic Inspiration die plus your Dexterity modifier).' },
        ],
        6: [
          { name: 'Inspiring Movement', description: 'When an enemy you can see ends its turn within 5 feet of you, you can take a Reaction and expend one use of your Bardic Inspiration to move up to half your Speed. Then one ally within 30 feet can also move up to half their Speed using their Reaction.' },
          { name: 'Tandem Footwork', description: 'When you roll Initiative, you can expend one use of your Bardic Inspiration. You and each ally within 30 feet who can see or hear you gains a bonus to Initiative equal to the number rolled.' },
        ],
        14: [
          { name: 'Leading Evasion', description: 'When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed and only half if you fail. If any creatures within 5 feet of you are making the same save, you can share this benefit.' },
        ],
      }
    },
    {
      name: 'College of Glamour',
      description: 'Weave Beguiling Fey Magic. The College of Glamour traces its origins to the beguiling magic of the Feywild.',
      features: {
        3: [
          { name: 'Beguiling Magic', description: 'You always have the Charm Person and Mirror Image spells prepared. In addition, after you cast an Enchantment or Illusion spell, you can cause a creature you can see within 60 feet to make a Wisdom save or be Charmed or Frightened for 1 minute.' },
          { name: 'Mantle of Inspiration', description: 'As a Bonus Action, you can expend a use of Bardic Inspiration, rolling a Bardic Inspiration die. Choose a number of other creatures within 60 feet up to your Charisma modifier. Each gains Temporary Hit Points equal to two times the number rolled, and each can use its Reaction to move up to its Speed.' },
        ],
        6: [
          { name: 'Mantle of Majesty', description: 'You always have the Command spell prepared. As a Bonus Action, you cast Command without expending a spell slot, and you take on an unearthly appearance for 1 minute. Any creature Charmed by you automatically fails its saving throw against Command.' },
        ],
        14: [
          { name: 'Unbreakable Majesty', description: 'As a Bonus Action, you can assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. Whenever any creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a Charisma saving throw or the attack misses.' },
        ],
      }
    },
    {
      name: 'College of Lore',
      description: 'Plumb the Depths of Magical Knowledge. Bards of the College of Lore collect spells and secrets from diverse sources.',
      features: {
        3: [
          { name: 'Bonus Proficiencies', description: 'You gain proficiency with three skills of your choice.' },
          { name: 'Cutting Words', description: 'When a creature that you can see within 60 feet makes a damage roll or succeeds on an ability check or attack roll, you can take a Reaction to expend one use of your Bardic Inspiration and subtract the roll from the creature\'s roll.' },
        ],
        6: [
          { name: 'Magical Discoveries', description: 'You learn two spells of your choice from the Cleric, Druid, or Wizard spell list. A spell you choose must be a cantrip or a spell for which you have spell slots.' },
        ],
        14: [
          { name: 'Peerless Skill', description: 'When you make an ability check or attack roll and fail, you can expend one use of Bardic Inspiration and add the number rolled to the d20, potentially turning a failure into a success.' },
        ],
      }
    },
    {
      name: 'College of the Moon',
      description: 'Inspire Allies with Primal Tales. Bards of the College of the Moon draw from fey magic and the primal power of the moonwells.',
      features: {
        3: [
          { name: 'Moon\'s Inspiration', description: 'Inspired Eclipse (When you take a Bonus Action to give a creature a Bardic Inspiration die, you can have the Invisible condition and teleport up to 30 feet); Lunar Vitality (Once per turn when you restore Hit Points to a creature with a spell, you can expend a Bardic Inspiration die and increase the amount restored).' },
          { name: 'Primal Lore', description: 'You learn Druidic and one cantrip from the Druid spell list. Additionally, choose one skill from Animal Handling, Insight, Medicine, Nature, Perception, or Survival. You have proficiency in that skill.' },
        ],
        6: [
          { name: 'Blessing of Moonlight', description: 'You always have the Moonbeam spell prepared. When you cast Moonbeam, you can glow faintly while the spell is active, shedding Dim Light, and whenever a creature fails its saving throw against Moonbeam, another creature of your choice within 60 feet regains 2d4 Hit Points.' },
        ],
        14: [
          { name: 'Eventide\'s Splendor', description: 'Shadow of the New Moon (When you use Inspired Eclipse, the creature can also have Invisible and teleport up to 30 feet); Vibrance of the Full Moon (When you use Lunar Vitality, you can roll 1d6 instead of expending a Bardic Inspiration die).' },
        ],
      }
    },
    {
      name: 'College of Valor',
      description: 'Sing the Deeds of Ancient Heroes. Bards of the College of Valor are daring storytellers whose tales preserve the memory of the great heroes of the past.',
      features: {
        3: [
          { name: 'Combat Inspiration', description: 'A creature that has a Bardic Inspiration die from you can use it for: Defense (When the creature is hit by an attack roll, it can use its Reaction to roll the Bardic Inspiration die and add it to its AC); Offense (Immediately after the creature hits a target with an attack roll, it can roll the Bardic Inspiration die and add it to the attack\'s damage).' },
          { name: 'Martial Training', description: 'You gain proficiency with Martial weapons and training with Medium armor and Shields. You can use a Simple or Martial weapon as a Spellcasting Focus.' },
        ],
        6: [
          { name: 'Extra Attack', description: 'You can attack twice instead of once whenever you take the Attack action on your turn. You can cast one of your cantrips in place of one of those attacks.' },
        ],
        14: [
          { name: 'Battle Magic', description: 'After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"CHA":15,"DEX":14,"CON":13,"WIS":12,"INT":10,"STR":8}
};

export const clericEn = {
  details: {
    name: 'Cleric',
    description: 'Clerics draw power from the realms of the gods and harness it to work miracles. Blessed by a deity, a pantheon, or another immortal entity, a Cleric can reach out to the divine magic of the Outer Planes.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Cleric level' },
      { name: 'Saving Throws', description: 'WIS and CHA' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['WIS', 'STR', 'CON'] as Ability[],
  skillData: { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: {1:["Spellcasting","Divine Order"],2:["Channel Divinity"],3:["Cleric Subclass"],4:["Ability Score Improvement"],5:["Sear Undead"],6:["Subclass Feature"],7:["Blessed Strikes"],8:["Ability Score Improvement"],10:["Divine Intervention"],12:["Ability Score Improvement"],14:["Improved Blessed Strikes"],16:["Ability Score Improvement"],17:["Subclass Feature"],18:["—"],19:["Epic Boon"],20:["Greater Divine Intervention"]},
  subclasses: [
    {
      name: 'Knowledge Domain',
      description: 'Unearth Secrets and Master the Mind. The Knowledge Domain values learning and understanding above all.',
      features: {
        3: [
          { name: 'Blessings of Knowledge', description: 'You gain proficiency with one type of Artisan\'s Tools of your choice and in two skills from Arcana, History, Nature, or Religion. You have Expertise in those two skills.' },
          { name: 'Mind Magic', description: 'As a Magic action, you can expend one use of your Channel Divinity to manifest your magical knowledge. Choose one spell from the Divination school on the Knowledge Domain Spells table that you have prepared and cast it without expending a spell slot or needing Material components.' },
        ],
        6: [
          { name: 'Unfettered Mind', description: 'You gain telepathy out to 60 feet. When you use this telepathy, you can simultaneously contact a number of creatures equal to your Wisdom modifier. Additionally, you gain proficiency in Intelligence saving throws.' },
        ],
        17: [
          { name: 'Divine Foreknowledge', description: 'As a Bonus Action, you magically expand your mind to the future. For 1 hour, you have Advantage on D20 Tests. Once you use this feature, you can\'t use it again until you finish a Long Rest.' },
        ],
      }
    },
    {
      name: 'Life Domain',
      description: 'Soothe the Hurts of the World. The Life Domain focuses on the positive energy that helps sustain all life.',
      features: {
        3: [
          { name: 'Disciple of Life', description: 'When a spell you cast with a spell slot restores Hit Points to a creature, that creature regains additional Hit Points equal to 2 plus the spell slot\'s level.' },
          { name: 'Preserve Life', description: 'As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to evoke healing energy that can restore a number of Hit Points equal to five times your Cleric level. Choose Bloodied creatures within 30 feet and divide those Hit Points among them.' },
        ],
        6: [
          { name: 'Blessed Healer', description: 'The healing spells you cast on others heal you as well. Immediately after you cast a spell with a spell slot that restores Hit Points to one or more creatures other than yourself, you regain Hit Points equal to 2 plus the spell slot\'s level.' },
        ],
        17: [
          { name: 'Supreme Healing', description: 'When you would normally roll one or more dice to restore Hit Points to a creature with a spell or Channel Divinity, use the highest number possible for each die instead.' },
        ],
      }
    },
    {
      name: 'Light Domain',
      description: 'Bring Light to Banish Darkness. The Light Domain emphasizes the divine power to bring about blazing fire and revelation.',
      features: {
        3: [
          { name: 'Radiance of the Dawn', description: 'As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to emit a flash of light in a 30-foot Emanation. Any magical Darkness in that area is dispelled. Each creature of your choice must make a Constitution saving throw, taking Radiant damage equal to 2d10 plus your Cleric level on a failed save.' },
          { name: 'Warding Flare', description: 'When a creature that you can see within 30 feet makes an attack roll, you can take a Reaction to impose Disadvantage on the attack roll, causing light to flare before it hits or misses. You can use this feature a number of times equal to your Wisdom modifier.' },
        ],
        6: [
          { name: 'Improved Warding Flare', description: 'Whenever you use Warding Flare, you can give the target of the triggering attack Temporary Hit Points equal to 2d6 plus your Wisdom modifier.' },
        ],
        17: [
          { name: 'Corona of Light', description: 'As a Magic action, you cause yourself to emit an aura of sunlight that lasts for 1 minute. You emit Bright Light in a 60-foot radius. Your enemies in the Bright Light have Disadvantage on saving throws against your Radiance of the Dawn and any spell that deals Fire or Radiant damage.' },
        ],
      }
    },
    {
      name: 'Trickery Domain',
      description: 'Make Mischief and Challenge Authority. The Trickery Domain offers magic of deception, illusion, and stealth.',
      features: {
        3: [
          { name: 'Blessing of the Trickster', description: 'As a Magic action, you can choose yourself or a willing creature within 30 feet to have Advantage on Dexterity (Stealth) checks. This blessing lasts until you finish a Long Rest or you use this feature again.' },
          { name: 'Invoke Duplicity', description: 'As a Bonus Action, you can expend one use of your Channel Divinity to create a perfect visual illusion of yourself in an unoccupied space you can see within 30 feet. The illusion is intangible and mimics your expressions and gestures for 1 minute.' },
        ],
        6: [
          { name: 'Trickster\'s Transposition', description: 'Whenever you take the Bonus Action to create or move the illusion of your Invoke Duplicity, you can teleport, swapping places with the illusion.' },
        ],
        17: [
          { name: 'Improved Duplicity', description: 'The illusion of your Invoke Duplicity has grown more powerful. When you and your allies make attack rolls against a creature within 5 feet of the illusion, the attack rolls have Advantage. When the illusion ends, you or a creature of your choice within 5 feet of it regains Hit Points equal to your Cleric level.' },
        ],
      }
    },
    {
      name: 'War Domain',
      description: 'Inspire Valor and Smite Foes. War has many manifestations. Clerics who tap into the magic of the War Domain excel in battle.',
      features: {
        3: [
          { name: 'Guided Strike', description: 'When you or a creature within 30 feet misses with an attack roll, you can expend one use of your Channel Divinity and give that roll a +10 bonus, potentially causing it to hit.' },
          { name: 'War Priest', description: 'As a Bonus Action, you can make one attack with a weapon or an Unarmed Strike. You can use this Bonus Action a number of times equal to your Wisdom modifier. You regain all expended uses when you finish a Short or Long Rest.' },
        ],
        6: [
          { name: 'War God\'s Blessing', description: 'You can expend a use of your Channel Divinity to cast Shield of Faith or Spiritual Weapon rather than expending a spell slot. When you cast either spell in this way, the spell doesn\'t require Concentration.' },
        ],
        17: [
          { name: 'Avatar of Battle', description: 'You gain Resistance to Bludgeoning, Piercing, and Slashing damage.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"WIS":15,"STR":14,"CON":13,"DEX":12,"INT":10,"CHA":8}
};

export const druidEn = {
  details: {
    name: 'Druid',
    description: 'Druids belong to ancient orders that call on the forces of nature. Harnessing the magic of animals, plants, and the four elements, Druids heal, transform into animals, and wield elemental destruction.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Druid level' },
      { name: 'Saving Throws', description: 'INT and WIS' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['WIS', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] as Skill[] },
  progression: {1:["Spellcasting","Druidic","Primal Order"],2:["Wild Shape","Wild Companion"],3:["Druid Subclass"],4:["Ability Score Improvement"],5:["Wild Resurgence"],6:["Subclass Feature"],7:["Elemental Fury"],8:["Ability Score Improvement"],10:["Subclass Feature"],12:["Ability Score Improvement"],14:["Subclass Feature"],15:["Improved Elemental Fury"],16:["Ability Score Improvement"],18:["Beast Spells"],19:["Epic Boon"],20:["Archdruid"]},
  subclasses: [
    {
      name: 'Circle of the Land',
      description: 'Celebrate Connection to the Natural World. The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites.',
      features: {
        3: [
          { name: 'Land\'s Aid', description: 'As a Magic action, you can expend a use of your Wild Shape and choose a point within 60 feet. Vitality-giving flowers and life-draining thorns appear in a 10-foot-radius Sphere. Each creature of your choice must make a Constitution saving throw, taking 2d6 Necrotic damage on a failed save. One creature of your choice in that area regains 2d6 Hit Points. The damage and healing increase by 1d6 at levels 10 and 14.' },
        ],
        6: [
          { name: 'Natural Recovery', description: 'You can cast one of your level 1+ Circle Spells without expending a spell slot, and you must finish a Long Rest before you do so again. When you finish a Short Rest, you can choose expended spell slots to recover.' },
        ],
        10: [
          { name: 'Nature\'s Ward', description: 'You are immune to the Poisoned condition, and you have Resistance to a damage type associated with your current land choice: Arid (Fire), Polar (Cold), Temperate (Lightning), Tropical (Poison).' },
        ],
        14: [
          { name: 'Nature\'s Sanctuary', description: 'As a Magic action, you can expend a use of your Wild Shape and cause spectral trees and vines to appear in a 15-foot Cube within 120 feet. You and your allies have Half Cover while in that area, and your allies gain the current Resistance of your Nature\'s Ward.' },
        ],
      }
    },
    {
      name: 'Circle of the Moon',
      description: 'Adopt Animal Forms to Guard the Wilds. Druids of the Circle of the Moon draw on lunar magic to transform themselves.',
      features: {
        3: [
          { name: 'Circle Forms', description: 'Challenge Rating (The maximum Challenge Rating for your Wild Shape form equals your Druid level divided by 3 (round down)); Armor Class (Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast\'s AC); Temporary Hit Points (You gain a number of Temporary Hit Points equal to three times your Druid level).' },
          { name: 'Circle of the Moon Spells', description: 'You always have the Cure Wounds, Moonbeam, and Starry Wisp spells prepared. You can cast these spells while you\'re in a Wild Shape form.' },
        ],
        6: [
          { name: 'Improved Circle Forms', description: 'Lunar Radiance (Each of your attacks in Wild Shape can deal its normal damage type or Radiant damage); Increased Toughness (You can add your Wisdom modifier to your Constitution saving throws).' },
        ],
        10: [
          { name: 'Moonlight Step', description: 'As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see, and you have Advantage on the next attack roll you make before the end of this turn. You can use this a number of times equal to your Wisdom modifier, regaining all uses when you finish a Long Rest.' },
        ],
        14: [
          { name: 'Lunar Form', description: 'Improved Lunar Radiance (Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form\'s attack); Shared Moonlight (Whenever you use Moonlight Step, you can also teleport one willing creature within 10 feet).' },
        ],
      }
    },
    {
      name: 'Circle of the Sea',
      description: 'Become One with Tides and Storms. Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms.',
      features: {
        3: [
          { name: 'Wrath of the Sea', description: 'As a Bonus Action, you can expend a use of your Wild Shape to manifest a 5-foot Emanation that takes the form of ocean spray for 10 minutes. When you manifest the Emanation and as a Bonus Action on subsequent turns, you can choose another creature you can see. The target must succeed on a Constitution saving throw or take Cold damage and be pushed up to 15 feet away.' },
        ],
        6: [
          { name: 'Aquatic Affinity', description: 'The size of the Emanation created by your Wrath of the Sea increases to 10 feet. In addition, you gain a Swim Speed equal to your Speed.' },
        ],
        10: [
          { name: 'Stormborn', description: 'Your Wrath of the Sea confers two more benefits while active: Flight (Fly Speed equal to your Speed) and Resistance (Resistance to Cold, Lightning, and Thunder damage).' },
        ],
        14: [
          { name: 'Oceanic Gift', description: 'Instead of manifesting the Emanation around yourself, you can manifest it around one willing creature within 60 feet. You can manifest the Emanation around both the other creature and yourself if you expend two uses of your Wild Shape.' },
        ],
      }
    },
    {
      name: 'Circle of the Stars',
      description: 'Harness Secrets Hidden in Constellations. The Circle of the Stars has tracked heavenly patterns since time immemorial.',
      features: {
        3: [
          { name: 'Star Map', description: 'You\'ve created a star chart as part of your heavenly studies. While holding the map, you have the Guidance and Guiding Bolt spells prepared, and you can cast Guiding Bolt without expending a spell slot a number of times equal to your Wisdom modifier.' },
          { name: 'Starry Form', description: 'As a Bonus Action, you can expend a use of your Wild Shape to take on a starry form for 10 minutes. While in your starry form, you become luminous with joints glimmering like stars. Choose one constellation: Archer (ranged spell attack hurling a luminous arrow that deals Radiant damage equal to 1d8 plus your Wisdom modifier); Chalice (Whenever you cast a spell using a spell slot that restores Hit Points, you or another creature within 30 feet can regain Hit Points equal to 1d8 plus your Wisdom modifier); Dragon (When you make an Intelligence or Wisdom check or a Constitution saving throw to maintain Concentration, you can treat a roll of 9 or lower on the d20 as a 10).' },
        ],
        6: [
          { name: 'Cosmic Omen', description: 'Whenever you finish a Long Rest, you can consult your Star Map for omens and roll a die. Until you finish your next Long Rest, you gain access to: Weal (Even) - add 1d6 to D20 Tests within 30 feet, or Woe (Odd) - subtract 1d6 from D20 Tests within 30 feet.' },
        ],
        10: [
          { name: 'Twinkling Constellations', description: 'The constellations of your Starry Form improve. The 1d8 of the Archer and Chalice becomes 2d8, and while the Dragon is active, you have a Fly Speed of 20 feet and can hover. Moreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers.' },
        ],
        14: [
          { name: 'Full of Stars', description: 'While in your Starry Form, you become partially incorporeal, giving you Resistance to Bludgeoning, Piercing, and Slashing damage.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"WIS":15,"CON":14,"DEX":13,"INT":12,"CHA":10,"STR":8}
};

export const fighterEn = {
  details: {
    name: 'Fighter',
    description: 'Fighters rule many battlefields. Questing knights, royal champions, elite soldiers, and hardened mercenaries - as Fighters, they all share an unparalleled prowess with weapons and armor.',
    traits: [
      { name: 'Hit Point Die', description: 'D10 per Fighter level' },
      { name: 'Saving Throws', description: 'STR and CON' },
    ]
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'DEX', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Persuasion', 'Perception', 'Survival'] as Skill[] },
  progression: {1:["Fighting Style","Second Wind","Weapon Mastery"],2:["Action Surge","Tactical Mind"],3:["Fighter Subclass"],4:["Ability Score Improvement"],5:["Extra Attack","Tactical Shift"],6:["Ability Score Improvement"],7:["Subclass Feature"],8:["Ability Score Improvement"],9:["Indomitable","Tactical Master"],10:["Subclass Feature"],11:["Two Extra Attacks"],12:["Ability Score Improvement"],13:["Indomitable","Studied Attacks"],14:["Ability Score Improvement"],15:["Subclass Feature"],16:["Ability Score Improvement"],17:["Action Surge","Indomitable"],18:["Subclass Feature"],19:["Epic Boon"],20:["Three Extra Attacks"]},
  subclasses: [
    {
      name: 'Banneret',
      description: 'Bannerets are paragons of valor and leadership who protect the innocent and rally fellow adventurers to the causes of justice and freedom.',
      features: {
        3: [
          { name: 'Knightly Envoy', description: 'You know how to conduct yourself with grace as a noble ambassador. You gain Comprehend Languages (ritual only), Polyglot (learn one language), and Well Spoken (proficiency in Insight, Intimidation, Persuasion, or Performance).' },
          { name: 'Group Recovery', description: 'When you use Second Wind, choose allies within 30-foot Emanation up to your Charisma modifier. Each regains 1d4 plus your Fighter level in Hit Points.' },
        ],
        7: [
          { name: 'Team Tactics', description: 'When you use Group Recovery, each chosen ally has Advantage on D20 Tests until the start of your next turn.' },
        ],
        10: [
          { name: 'Rallying Surge', description: 'When you use Action Surge, choose allies within 30-foot Emanation up to your Charisma modifier. Each can take a Reaction to Attack or Move up to half their Speed.' },
        ],
        15: [
          { name: 'Shared Resilience', description: 'When an ally within 60 feet fails a saving throw, you can expend Indomitable to let them reroll with a bonus equal to your Fighter level.' },
        ],
        18: [
          { name: 'Inspiring Commander', description: 'Bolstered Rally increases Group Recovery and Rallying Surge area to 60 feet. You have Immunity to Charmed and Frightened.' },
        ],
      }
    },
    {
      name: 'Battle Master',
      description: 'Battle Masters are students of the art of battle, learning martial techniques passed down through generations.',
      features: {
        3: [
          { name: 'Combat Superiority', description: 'You learn three maneuvers (more at levels 7, 10, 15). You have four Superiority Dice (d8s), gaining more at levels 7 and 15. DC equals 8 plus your Strength/Dexterity modifier and Proficiency Bonus.' },
          { name: 'Student of War', description: 'Proficiency with one type of Artisan\'s Tools and one skill from Fighters at level 1.' },
        ],
        7: [
          { name: 'Know Your Enemy', description: 'As a Bonus Action, discern a creature\'s Immunities, Resistances, or Vulnerabilities. Restore by expending one Superiority Die.' },
        ],
        10: [
          { name: 'Improved Combat Superiority', description: 'Your Superiority Die becomes a d10.' },
        ],
        15: [
          { name: 'Relentless', description: 'Once per turn, when you use a maneuver, roll 1d8 instead of expending a Superiority Die.' },
        ],
        18: [
          { name: 'Ultimate Combat Superiority', description: 'Your Superiority Die becomes a d12.' },
        ],
      }
    },
    {
      name: 'Champion',
      description: 'A Champion focuses on the development of martial prowess in a relentless pursuit of victory.',
      features: {
        3: [
          { name: 'Improved Critical', description: 'Critical Hits on rolls of 19-20.' },
          { name: 'Remarkable Athlete', description: 'Advantage on Initiative and Strength (Athletics). After Critical Hit, move up to half Speed without provoking Opportunity Attacks.' },
        ],
        7: [
          { name: 'Additional Fighting Style', description: 'Gain another Fighting Style feat.' },
        ],
        10: [
          { name: 'Heroic Warrior', description: 'During combat, give yourself Heroic Inspiration when you start your turn without it.' },
        ],
        15: [
          { name: 'Superior Critical', description: 'Critical Hits on rolls of 18-20.' },
        ],
        18: [
          { name: 'Survivor', description: 'Defy Death: Advantage on Death Saves, rolling 18-20 counts as 20. Heroic Rally: Regain 5 plus Constitution modifier HP at start of each turn when Bloodied.' },
        ],
      }
    },
    {
      name: 'Eldritch Knight',
      description: 'Eldritch Knights combine martial mastery with magical study. Their spells complement combat skills.',
      features: {
        3: [
          { name: 'Spellcasting', description: 'You know two cantrips from Wizard list (more at level 10). You have spell slots per the Spellcasting table. Prepare three level 1 spells initially, increasing with levels.' },
          { name: 'War Bond', description: 'Ritual creates magical bond with one weapon. Can\'t be disarmed unless Incapacitated. Summon as Bonus Action. Max two bonded weapons.' },
        ],
        7: [
          { name: 'War Magic', description: 'When taking Attack action, replace one attack with casting a Wizard cantrip.' },
        ],
        10: [
          { name: 'Eldritch Strike', description: 'When you hit with weapon attack, target has Disadvantage on next saving throw against your spell.' },
        ],
        15: [
          { name: 'Arcane Charge', description: 'When you use Action Surge, teleport up to 30 feet.' },
        ],
        18: [
          { name: 'Improved War Magic', description: 'When taking Attack action, replace two attacks with casting a level 1 or 2 Wizard spell.' },
        ],
      }
    },
    {
      name: 'Psi Warrior',
      description: 'Psi Warriors awaken the power of their minds to augment physical might.',
      features: {
        3: [
          { name: 'Psionic Power', description: 'Psionic Energy Dice (d6 at level 3, scaling to d12 at level 17). Regain one on Short Rest, all on Long Rest. Powers: Protective Field (reduce damage), Psionic Strike (Force damage), Telekinetic Movement (move objects/creatures).' },
        ],
        7: [
          { name: 'Telekinetic Adept', description: 'Psi-Powered Leap: Gain Fly Speed equal to twice your Speed as Bonus Action. Telekinetic Thrust: When you hit with Psionic Strike, force Strength save to be pushed/prone.' },
        ],
        10: [
          { name: 'Guarded Mind', description: 'Resistance to Psychic damage. End Charmed/Frightened by expending a Psionic Energy Die.' },
        ],
        15: [
          { name: 'Bulwark of Force', description: 'As Bonus Action, grant creatures within 30 feet Half Cover for 1 minute (number equal to Int modifier).' },
        ],
        18: [
          { name: 'Telekinetic Master', description: 'Always have Telekinesis prepared, cast without slots/components. Make weapon attack as Bonus Action while concentrating.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 3,
  suggestedArray: {"STR":15,"DEX":14,"CON":13,"WIS":12,"INT":10,"CHA":8}
};

export const monkEn = {
  details: {
    name: 'Monk',
    description: 'Monks use rigorous combat training and mental discipline to align themselves with the multiverse and focus their internal reservoirs of power.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Monk level' },
      { name: 'Saving Throws', description: 'STR and DEX' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] as Skill[] },
  progression: {1:["Martial Arts","Unarmored Defense"],2:["Monk's Focus","Unarmored Movement","Uncanny Metabolism"],3:["Deflect Attacks","Monk Subclass"],4:["Ability Score Improvement","Slow Fall"],5:["Extra Attack","Stunning Strike"],6:["Empowered Strikes","Subclass Feature"],7:["Evasion"],8:["Ability Score Improvement"],9:["Acrobatic Movement"],10:["Heightened Focus","Self-Restoration"],11:["Subclass Feature"],12:["Ability Score Improvement"],13:["Deflect Energy"],14:["Disciplined Survivor"],15:["Perfect Focus"],16:["Ability Score Improvement"],17:["Subclass Feature"],18:["Superior Defense"],19:["Epic Boon"],20:["Body and Mind"]},
  subclasses: [
    {
      name: 'Warrior of Mercy',
      description: 'Warriors of Mercy manipulate life force. These wandering physicians bring swift ends to enemies.',
      features: {
        3: [
          { name: 'Hand of Harm', description: 'When you hit with Unarmed Strike, expend 1 Focus Point to deal extra Necrotic damage equal to Martial Arts die plus Wisdom modifier.' },
          { name: 'Hand of Healing', description: 'As Magic action, expend 1 Focus Point to restore HP equal to Martial Arts die plus Wisdom modifier. Flurry of Blows can replace one strike with healing without expending Focus.' },
          { name: 'Implements of Mercy', description: 'Proficiency in Insight and Medicine skills and Herbalism Kit.' },
        ],
        6: [
          { name: 'Physician\'s Touch', description: 'Hand of Harm can give target Poisoned until end of next turn. Hand of Healing can end one condition: Blinded, Deafened, Paralyzed, Poisoned, or Stunned.' },
        ],
        11: [
          { name: 'Flurry of Healing and Harm', description: 'Flurry of Blows can replace each Unarmed Strike with Hand of Healing at no Focus cost. When you deal damage with Flurry, use Hand of Harm without Focus (once per turn). Uses equal to Wisdom modifier per Long Rest.' },
        ],
        17: [
          { name: 'Hand of Ultimate Mercy', description: 'As Magic action, touch corpse dead within 24 hours, expend 5 Focus Points. Creature returns with 4d10 plus Wisdom modifier HP. Removes conditions: Blinded, Deafened, Paralyzed, Poisoned, Stunned.' },
        ],
      }
    },
    {
      name: 'Warrior of Shadow',
      description: 'Warriors of Shadow practice stealth and subterfuge, harnessing Shadowfell power.',
      features: {
        3: [
          { name: 'Shadow Arts', description: 'Expend 1 Focus Point to cast Darkness (see within it, move its area). Gain Darkvision 60 feet (or +60 if already have). Know Minor Illusion with Wisdom as spellcasting ability.' },
        ],
        6: [
          { name: 'Shadow Step', description: 'While in Dim Light/Darkness, Bonus Action teleport 60 feet to space in Dim Light/Darkness. Have Advantage on next melee attack.' },
        ],
        11: [
          { name: 'Improved Shadow Step', description: 'Expend 1 Focus Point to remove Dim Light/Darkness requirement. Make Unarmed Strike after teleporting.' },
        ],
        17: [
          { name: 'Cloak of Shadows', description: 'As Magic action while in Dim Light/Darkness, expend 3 Focus Points for 1 minute. Gain Invisibility, can move through spaces as Difficult Terrain, and Flurry of Blows costs no Focus.' },
        ],
      }
    },
    {
      name: 'Warrior of the Elements',
      description: 'Warriors of the Elements tap into Elemental Plane power.',
      features: {
        3: [
          { name: 'Elemental Attunement', description: 'Expend 1 Focus Point at start of turn for 10 minutes. Gain reach +10 feet for Unarmed Strikes. Unarmed Strikes can deal Acid, Cold, Fire, Lightning, or Thunder damage and force Strength save to push/pull target 10 feet.' },
          { name: 'Manipulate Elements', description: 'Know Elementalism spell with Wisdom as spellcasting ability.' },
        ],
        6: [
          { name: 'Elemental Burst', description: 'As Magic action, expend 2 Focus Points. 20-foot-radius Sphere, 120 feet away. Choose damage type. Creatures make Dexterity save: take three rolls of Martial Arts die on fail, half on success.' },
        ],
        11: [
          { name: 'Stride of the Elements', description: 'While Elemental Attunement active, gain Fly and Swim Speed equal to your Speed.' },
        ],
        17: [
          { name: 'Elemental Epitome', description: 'While Elemental Attunement active: choose damage Resistance (change each turn); Destructive Stride (Speed +20 feet, deal Martial Arts die damage to creatures you enter space near, damage type chosen); Empowered Strikes (extra Martial Arts die damage once per turn).' },
        ],
      }
    },
    {
      name: 'Warrior of the Open Hand',
      description: 'Warriors of the Open Hand master unarmed combat techniques.',
      features: {
        3: [
          { name: 'Open Hand Technique', description: 'When you hit with Flurry of Blows attack, impose one: Addle (can\'t make Opportunity Attacks), Push (Strength save or pushed 15 feet), Topple (Dexterity save or Prone).' },
        ],
        6: [
          { name: 'Wholeness of Body', description: 'As Bonus Action, roll Martial Arts die and heal for result plus Wisdom modifier. Uses equal to Wisdom modifier per Long Rest.' },
        ],
        11: [
          { name: 'Fleet Step', description: 'When you take Bonus Action other than Step of the Wind, also use Step of the Wind immediately after.' },
        ],
        17: [
          { name: 'Quivering Palm', description: 'When you hit with Unarmed Strike, expend 4 Focus Points to start vibrations for number of days equal to Monk level. Take action to end them (target Constitution save: 10d12 Force damage on fail, half on success). Only one creature at a time. Can end harmlessly.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"DEX":15,"WIS":14,"CON":13,"STR":12,"INT":10,"CHA":8}
};

export const paladinEn = {
  details: {
    name: 'Paladin',
    description: 'Paladins are united by their oaths to stand against the forces of annihilation and corruption.',
    traits: [
      { name: 'Hit Point Die', description: 'D10 per Paladin level' },
      { name: 'Saving Throws', description: 'WIS and CHA' },
    ]
  } as DetailData,
  hitDie: 10,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['STR', 'CHA', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: {1:["Lay on Hands","Spellcasting","Weapon Mastery"],2:["Fighting Style","Paladin's Smite"],3:["Channel Divinity","Paladin Subclass"],4:["Ability Score Improvement"],5:["Extra Attack","Faithful Steed"],6:["Aura of Protection"],7:["Subclass Feature"],8:["Ability Score Improvement"],9:["Abjure Foes"],10:["Aura of Courage"],11:["Radiant Strikes"],12:["Ability Score Improvement"],14:["Restoring Touch"],15:["Subclass Feature"],16:["Ability Score Improvement"],18:["Aura Expansion"],19:["Epic Boon"],20:["Subclass Feature"]},
  subclasses: [
    {
      name: 'Oath of Devotion',
      description: 'Paladins of Devotion bind themselves to Justice and Order ideals.',
      features: {
        3: [
          { name: 'Oath of Devotion Spells', description: 'Always prepared: level 3: Protection from Evil and Good, Shield of Faith; 5: Aid, Zone of Truth; 9: Beacon of Hope, Dispel Magic; 13: Freedom of Movement, Guardian of Faith; 17: Commune, Flame Strike.' },
          { name: 'Sacred Weapon', description: 'As Attack action, expend Channel Divinity to imbue melee weapon for 10 minutes. Add Charisma to attack rolls, deals normal or Radiant damage. Emits Bright Light 20 feet/Dim Light 20 feet more.' },
        ],
        7: [
          { name: 'Aura of Devotion', description: 'You and allies have Immunity to Charmed in your Aura of Protection.' },
        ],
        15: [
          { name: 'Smite of Protection', description: 'When you cast Divine Smite, allies in Aura of Protection have Half Cover until start of your next turn.' },
        ],
        20: [
          { name: 'Holy Nimbus', description: 'Bonus Action imbue Aura with holy power for 10 minutes: Advantage on saves vs. Fiends/Undead; Radiant damage to enemies starting turn in aura equal to Charisma plus Proficiency Bonus; Aura becomes sunlight. Long rest to reuse, or expend level 5 spell slot.' },
        ],
      }
    },
    {
      name: 'Oath of Glory',
      description: 'Paladins of Glory strive for heroic heights.',
      features: {
        3: [
          { name: 'Inspiring Smite', description: 'After casting Divine Smite, expend Channel Divinity to distribute 2d8 plus Paladin level Temporary Hit Points to creatures within 30 feet.' },
          { name: 'Oath of Glory Spells', description: 'Always prepared: 3: Guiding Bolt, Heroism; 5: Enhance Ability, Magic Weapon; 9: Haste, Protection from Energy; 13: Compulsion, Freedom of Movement; 17: Legend Lore, Yolande\'s Regal Presence.' },
          { name: 'Peerless Athlete', description: 'As Bonus Action, expend Channel Divinity for 1 hour: Advantage on Strength (Athletics) and Dexterity (Acrobatics), Long and High Jumps increase 10 feet.' },
        ],
        7: [
          { name: 'Aura of Alacrity', description: 'Speed increases 10 feet. When ally enters Aura or starts turn there, their Speed increases 10 feet until end of their next turn.' },
        ],
        15: [
          { name: 'Glorious Defense', description: 'When you or ally within 10 feet is hit, grant bonus to AC equal to Charisma modifier (minimum +1). If attack misses, make attack against attacker. Uses equal to Charisma modifier per Long Rest.' },
        ],
        20: [
          { name: 'Living Legend', description: 'Bonus Action for 10 minutes: Advantage on Charisma checks; reroll failed saving throws; once per turn when weapon attack misses, it hits instead. Long rest to reuse, or expend level 5 spell slot.' },
        ],
      }
    },
    {
      name: 'Oath of the Ancients',
      description: 'The Oath of the Ancients is as old as the first elves. Paladins cherish light and life.',
      features: {
        3: [
          { name: 'Nature\'s Wrath', description: 'As Magic action, expend Channel Divinity. Creatures within 15 feet must Strength save or be Restrained for 1 minute.' },
          { name: 'Oath of the Ancients Spells', description: 'Always prepared: 3: Ensnaring Strike, Speak with Animals; 5: Misty Step, Moonbeam; 9: Plant Growth, Protection from Energy; 13: Ice Storm, Stoneskin; 17: Commune with Nature, Tree Stride.' },
        ],
        7: [
          { name: 'Aura of Warding', description: 'You and allies have Resistance to Necrotic, Psychic, and Radiant damage in your Aura of Protection.' },
        ],
        15: [
          { name: 'Undying Sentinel', description: 'When reduced to 0 HP, drop to 1 HP instead and heal for three times Paladin level. Can\'t be magically aged. Once per Long Rest.' },
        ],
        20: [
          { name: 'Elder Champion', description: 'Bonus Action imbue Aura with primal power for 1 minute: Enemies have Disadvantage on saves vs. your spells and Channel Divinity; regenerate 10 HP at start of each turn; cast spells with casting time of action as Bonus Action. Long rest to reuse, or expend level 5 spell slot.' },
        ],
      }
    },
    {
      name: 'Oath of the Noble Genies',
      description: 'Paladins of Noble Genies draw power from the four genie types: dao (earth), djinn (air), efreet (fire), marid (water).',
      features: {
        3: [
          { name: 'Elemental Smite', description: 'After Divine Smite, expend Channel Divinity for one effect: Dao\'s Crush (Grappled, Restrained, escape DC equals spell save DC); Djinni\'s Escape (teleport 30 feet, semi-incorporeal, resistance to BPS, immunity to Grappled/Prone/Restrained); Efreeti\'s Fury (extra 2d4 Fire, fire jumps to creature within 30 feet for 2d4); Marid\'s Surge (target and creatures in 10-foot Emanation Strength save or pushed 15 feet and Prone).' },
          { name: 'Genie Spells', description: 'Always prepared: 3: Chromatic Orb, Elementalism, Thunderous Smite; 5: Mirror Image, Phantasmal Force; 9: Fly, Gaseous Form; 13: Conjure Minor Elementals, Summon Elemental; 17: Banishing Smite, Contact Other Plane.' },
          { name: 'Genie\'s Splendor', description: 'Base AC 10 plus Dexterity plus Charisma (no armor). Proficiency in Acrobatics, Intimidation, Performance, or Persuasion.' },
        ],
        7: [
          { name: 'Aura of Elemental Shielding', description: 'Choose damage type (Acid, Cold, Fire, Lightning, Thunder). You and allies have Resistance in your Aura. Change type at start of each turn.' },
        ],
        15: [
          { name: 'Elemental Rebuke', description: 'When hit, Reaction halve damage and force attacker Dexterity save. On fail, they take 2d10 plus Charisma modifier damage of your chosen type. Uses equal to Charisma modifier per Long Rest.' },
        ],
        20: [
          { name: 'Noble Scion', description: 'Bonus Action for 10 minutes: Fly Speed 60 feet and hover; when you/ally fails D20 Test, Reaction make them succeed instead. Long rest to reuse, or expend level 5 spell slot.' },
        ],
      }
    },
    {
      name: 'Oath of Vengeance',
      description: 'The Oath of Vengeance commits to punish grievously evil acts.',
      features: {
        3: [
          { name: 'Oath of Vengeance Spells', description: 'Always prepared: 3: Bane, Hunter\'s Mark; 5: Hold Person, Misty Step; 9: Haste, Protection from Energy; 13: Banishment, Dimension Door; 17: Hold Monster, Scrying.' },
          { name: 'Vow of Enmity', description: 'As Attack action, expend Channel Divinity. Vow against creature within 30 feet. Advantage on attacks against it for 1 minute. If it drops to 0 HP, transfer vow to another creature.' },
        ],
        7: [
          { name: 'Relentless Avenger', description: 'When you hit with Opportunity Attack, reduce creature\'s Speed to 0 until end of turn. Move up to half your Speed (doesn\'t provoke Opportunity Attacks).' },
        ],
        15: [
          { name: 'Soul of Vengeance', description: 'After creature under Vow of Enmity attacks (hits or misses), Reaction make melee attack if within range.' },
        ],
        20: [
          { name: 'Avenging Angel', description: 'Bonus Action for 10 minutes: spectral wings, Fly Speed 60 feet and hover; Frightful Aura (Wisdom save or Frightened, attacks against Frightened have Advantage). Long rest to reuse, or expend level 5 spell slot.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: {"STR":15,"CHA":14,"CON":13,"WIS":12,"DEX":10,"INT":8}
};

export const rangerEn = {
  details: {
    name: 'Ranger',
    description: 'Far from bustling cities, amid the trees of trackless forests and across wide plains, Rangers keep their unending watch in the wilderness.',
    traits: [
      { name: 'Hit Point Die', description: 'D10 per Ranger level' },
      { name: 'Saving Throws', description: 'STR and DEX' },
    ]
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 3, options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] as Skill[] },
  progression: {1:["Spellcasting","Favored Enemy","Weapon Mastery"],2:["Deft Explorer","Fighting Style"],3:["Ranger Subclass"],4:["Ability Score Improvement"],5:["Extra Attack"],6:["Roving"],7:["Subclass Feature"],8:["Ability Score Improvement"],9:["Expertise"],10:["Tireless"],11:["Subclass Feature"],12:["Ability Score Improvement"],13:["Relentless Hunter"],14:["Nature's Veil"],15:["Subclass Feature"],16:["Ability Score Improvement"],17:["Precise Hunter"],18:["Feral Senses"],19:["Epic Boon"],20:["Foe Slayer"]},
  subclasses: [
    {
      name: 'Beast Master',
      description: 'A Beast Master forms mystical bond with a primal beast.',
      features: {
        3: [
          { name: 'Primal Companion', description: 'Magically summon primal beast (Beast of Land, Sky, or Sea). Beast acts on your turn, can move/use Reaction but only Dodge unless commanded. Command with Bonus Action or sacrifice attack to command Beast\'s Strike. If you have Incapacitated, beast acts on its own. Restore dead beast with Magic action and spell slot within 1 hour. Summon new beast on Long Rest.' },
        ],
        7: [
          { name: 'Exceptional Training', description: 'When commanding Primal Companion with Bonus Action, it can take Dash, Disengage, Dodge, or Help as its Bonus Action. When beast hits and deals damage, it can deal Force damage instead.' },
        ],
        11: [
          { name: 'Bestial Fury', description: 'When commanding Beast\'s Strike, beast uses it twice. First time each turn it hits creature under Hunter\'s Mark, deal extra Force damage equal to spell\'s bonus damage.' },
        ],
        15: [
          { name: 'Share Spells', description: 'When you cast spell targeting yourself, also affect Primal Companion if within 30 feet.' },
        ],
      }
    },
    {
      name: 'Fey Wanderer',
      description: 'Fey mystique surrounds you from archfey boon or Feywild transformation.',
      features: {
        3: [
          { name: 'Dreadful Strikes', description: 'When you hit with weapon, deal extra 1d4 Psychic damage (1d6 at level 11). Extra damage to target only once per turn.' },
          { name: 'Fey Wanderer Spells', description: 'Always prepared: 3: Charm Person; 5: Misty Step; 9: Summon Fey; 13: Dimension Door; 17: Mislead. Also gain Feywild Gift (roll d6): butterflies flutter, flowers bloom, smell of spices, dancing shadow, antlers/horns, color-changing skin/hair.' },
          { name: 'Otherworldly Glamour', description: 'Add Wisdom modifier to Charisma checks (minimum +1). Proficiency in Deception, Performance, or Persuasion.' },
        ],
        7: [
          { name: 'Beguiling Twist', description: 'Advantage on saves vs. Charmed/Frightened. When you or creature within 120 feet succeeds on such save, Reaction force another visible creature within 120 feet to Wisdom save or be Charmed/Frightened (your choice) for 1 minute.' },
        ],
        11: [
          { name: 'Fey Reinforcements', description: 'Cast Summon Fey without Material component. Once without spell slot per Long Rest. Can modify to not require Concentration (1 minute duration).' },
        ],
        15: [
          { name: 'Misty Wanderer', description: 'Cast Misty Step without spell slot. Uses equal to Wisdom modifier per Long Rest. When casting Misty Step, bring one willing creature within 5 feet to space near your destination.' },
        ],
      }
    },
    {
      name: 'Gloom Stalker',
      description: 'Gloom Stalkers wield Shadowfell magic against enemies in darkness.',
      features: {
        3: [
          { name: 'Dread Ambusher', description: 'Ambusher\'s Leap: first turn, Speed increases 10 feet. Dreadful Strike: when you hit with weapon, deal extra 2d6 Psychic damage. Uses equal to Wisdom modifier per Long Rest. Initiative: add Wisdom modifier.' },
          { name: 'Gloom Stalker Spells', description: 'Always prepared: 3: Disguise Self; 5: Rope Trick; 9: Fear; 13: Greater Invisibility; 17: Seeming.' },
          { name: 'Umbral Sight', description: 'Darkvision 60 feet (or +60 if already have). While entirely in Darkness, have Invisible condition to creatures relying on Darkvision.' },
        ],
        7: [
          { name: 'Iron Mind', description: 'Proficiency in Wisdom saves, or Intelligence/Charisma if already have Wisdom proficiency.' },
        ],
        11: [
          { name: 'Stalker\'s Flurry', description: 'Dreadful Strike damage becomes 2d8. When using Dreadful Strike: Sudden Strike (attack another creature within 5 feet of original target and within weapon range) or Mass Fear (target and creatures within 10 feet Wisdom save or Frightened until start of your next turn).' },
        ],
        15: [
          { name: 'Shadowy Dodge', description: 'When creature makes attack roll against you, Reaction impose Disadvantage. Whether hit or miss, teleport up to 30 feet to unoccupied visible space.' },
        ],
      }
    },
    {
      name: 'Hunter',
      description: 'Hunters protect nature and people from destruction.',
      features: {
        3: [
          { name: 'Hunter\'s Lore', description: 'While creature is marked by Hunter\'s Mark, know its Immunities, Resistances, Vulnerabilities.' },
          { name: 'Hunter\'s Prey', description: 'Choose one (replace on Short/Long Rest): Colossus Slayer (extra 1d8 damage if target missing HP, once per turn); or Horde Breaker (once per turn when attacking with weapon, attack another creature within 5 feet of original target and within weapon range).' },
        ],
        7: [
          { name: 'Defensive Tactics', description: 'Choose one (replace on Short/Long Rest): Escape the Horde (Opportunity Attacks have Disadvantage against you); or Multiattack Defense (when creature hits you, it has Disadvantage on other attacks against you this turn).' },
        ],
        11: [
          { name: 'Superior Hunter\'s Prey', description: 'Once per turn when dealing damage to creature marked by Hunter\'s Mark, deal that spell\'s extra damage to different creature within 30 feet of first creature.' },
        ],
        15: [
          { name: 'Superior Hunter\'s Defense', description: 'When you take damage, Reaction give yourself Resistance to that damage and same type until end of current turn.' },
        ],
      }
    },
    {
      name: 'Winter Walker',
      description: 'Winter Walkers hunt in frozen wastelands, becoming frigid terrors.',
      features: {
        3: [
          { name: 'Frigid Explorer', description: 'Biting Cold: your weapon attacks, Ranger spells, and features ignore Cold resistance. Frost Resistance: Resistance to Cold damage. Polar Strikes: on weapon hit, deal extra 1d4 Cold (1d6 at level 11). Extra damage only once per turn.' },
          { name: 'Hunter\'s Rime', description: 'When casting Hunter\'s Mark, gain Temporary Hit Points equal to 1d10 plus Ranger level. Marked creature can\'t take Disengage action.' },
          { name: 'Winter Walker Spells', description: 'Always prepared: 3: Ice Knife; 5: Hold Person; 9: Remove Curse; 13: Ice Storm; 17: Cone of Cold.' },
        ],
        7: [
          { name: 'Fortifying Soul', description: 'As Magic action, choose number of creatures equal to Wisdom modifier. Each regains 1d10 plus Ranger level HP and has Advantage on saves vs. Frightened for 1 hour. Once per Long Rest.' },
        ],
        11: [
          { name: 'Chilling Retribution', description: 'When hit with attack, Reaction Wisdom save or Stunned until end of your next turn (Speed 0). Uses equal to Wisdom modifier per Long Rest.' },
        ],
        15: [
          { name: 'Frozen Haunt', description: 'When casting Hunter\'s Mark, adopt ghostly snowy form until spell ends: Immunity to Cold; 15-foot Emanation deals 2d4 Cold damage to creatures of your choice when you adopt form and at start of each turn; Immunity to Grappled, Prone, Restrained; move through creatures/objects as Difficult Terrain (1d10 Force if ending turn inside). Once per Long Rest, or expend level 4+ spell slot.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: {"DEX":15,"WIS":14,"CON":13,"STR":12,"INT":10,"CHA":8}
};

export const rogueEn = {
  details: {
    name: 'Rogue',
    description: 'Rogues rely on cunning, stealth, and their foes\' vulnerabilities to get the upper hand in any situation.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Rogue level' },
      { name: 'Saving Throws', description: 'DEX and INT' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'INT'] as Ability[],
  statPriorities: ['DEX', 'INT', 'CON'] as Ability[],
  skillData: { count: 4, options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Persuasion', 'Sleight of Hand', 'Stealth'] as Skill[] },
  progression: {1:["Expertise","Sneak Attack","Thieves' Cant","Weapon Mastery"],2:["Cunning Action"],3:["Rogue Subclass","Steady Aim"],4:["Ability Score Improvement"],5:["Cunning Strike","Uncanny Dodge"],6:["Expertise"],7:["Evasion","Reliable Talent"],8:["Ability Score Improvement"],9:["Subclass Feature"],10:["Ability Score Improvement"],11:["Improved Cunning Strike"],12:["Ability Score Improvement"],13:["Subclass Feature"],14:["Devious Strikes"],15:["Slippery Mind"],16:["Ability Score Improvement"],17:["Subclass Feature"],18:["Elusive"],19:["Epic Boon"],20:["Stroke of Luck"]},
  subclasses: [
    {
      name: 'Arcane Trickster',
      description: 'Arcane Tricksters enhance stealth with spells.',
      features: {
        3: [
          { name: 'Spellcasting', description: 'Know three cantrips: Mage Hand plus two from Wizard list (more at level 10). Spell slots per table. Prepare three level 1 Wizard spells, more as you gain levels.' },
          { name: 'Mage Hand Legerdemain', description: 'Cast Mage Hand as Bonus Action, make hand Invisible. Control hand as Bonus Action, make Dexterity (Sleight of Hand) checks through it.' },
        ],
        9: [
          { name: 'Magical Ambush', description: 'When you cast spell at creature while Invisible, it has Disadvantage on saving throw.' },
        ],
        13: [
          { name: 'Versatile Trickster', description: 'When using Cunning Strike Trip option, also use it on another creature within 5 feet of spectral hand.' },
        ],
        17: [
          { name: 'Spell Thief', description: 'After creature casts spell targeting you or including you in area, Reaction Intelligence save (DC equals spell save DC). On fail, negate spell\'s effect and steal knowledge if level 1+ and you can cast it. You have spell prepared for 8 hours. Creature can\'t cast it for 8 hours. Once per Long Rest.' },
        ],
      }
    },
    {
      name: 'Assassin',
      description: 'Assassins focus on stealth, poison, and disguise.',
      features: {
        3: [
          { name: 'Assassinate', description: 'Initiative: Advantage on Initiative rolls. Surprising Strikes: first round, Advantage against creatures that haven\'t acted. If Sneak Attack hits, extra damage equal to Rogue level.' },
          { name: 'Assassin\'s Tools', description: 'Proficiency with Disguise Kit and Poisoner\'s Kit.' },
        ],
        9: [
          { name: 'Infiltration Expertise', description: 'Masterful Mimicry: mimic speech/handwriting after 1 hour study. Roving Aim: Speed not reduced by Steady Aim.' },
        ],
        13: [
          { name: 'Envenom Weapons', description: 'When using Cunning Strike Poison, target takes extra 2d6 Poison damage on failed save. Damage ignores Poison resistance.' },
        ],
        17: [
          { name: 'Death Strike', description: 'When Sneak Attack hits first round, target Constitution save (DC 8 plus Dex mod plus Proficiency Bonus) or attack damage doubled.' },
        ],
      }
    },
    {
      name: 'Scion of the Three',
      description: 'Scion of the Three walks the path between light and darkness.',
      features: {
        3: [
          { name: 'Mystic Edge', description: 'When you hit with Sneak Attack, deal extra 1d6 Psychic or Necrotic (your choice).' },
          { name: 'Three\'s Guidance', description: 'Once per Long Rest, when creature within 60 feet fails ability check or save, you can Reaction let them reroll with 1d4 added (your Cha mod).' },
        ],
        9: [
          { name: 'Phantom Verification', description: 'When you deal Sneak Attack damage, target takes extra 1d6 Necrotic. If target is Incapacitated, extra 3d6.' },
        ],
        13: [
          { name: 'Twilight Shroud', description: 'As Bonus Action, become Invisible until end of next turn. If Incapacitated, automatically become Invisible until no longer Incapacitated. Uses equal to Proficiency Bonus per Long Rest.' },
        ],
        17: [
          { name: 'Aspect of the Three', description: 'Once per Long Rest, when you would roll Initiative, roll twice and take either result. When you attack Surprised creature, it is Incapacitated until end of its first turn.' },
        ],
      }
    },
    {
      name: 'Soulknife',
      description: 'Soulknives strike with psionic blades, cutting through physical and psychic barriers.',
      features: {
        3: [
          { name: 'Psionic Power', description: 'Psionic Energy Dice: d6 at level 3 (4 dice), scaling to d12 at level 17 (12 dice). Regain one on Short Rest, all on Long Rest. Psi-Bolstered Knack: when you fail skill/tool check with proficiency, roll Psionic Energy Die and add to check. Psychic Whispers: as Magic action, establish telepathic communication with number of creatures equal to Proficiency Bonus for number of hours equal to die roll.' },
          { name: 'Psychic Blades', description: 'Manifest shimmering blades as part of Attack action or Opportunity Attack. Simple Melee, 1d6 Psychic plus ability modifier, Finesse, Thrown (60/120 feet), Mastery: Vex. Second blade as Bonus Action if free hand (damage die 1d4). Blade vanishes after hit/miss.' },
        ],
        9: [
          { name: 'Soul Blades', description: 'Homing Strikes: when Psychic Blade attack misses, roll Psionic Energy Die and add to roll; if hits, die expended. Psychic Teleportation: Bonus Action, expend die, throw blade up to 10 times number rolled feet to unoccupied space, teleport to that space.' },
        ],
        13: [
          { name: 'Psychic Veil', description: 'As Magic action, gain Invisible for 1 hour or until you deal damage/force save. Once per Long Rest, or expend Psionic Energy Die.' },
        ],
        17: [
          { name: 'Rend Mind', description: 'When Psychic Blades deal Sneak Attack damage, target Wisdom save (DC 8 plus Dex plus Proficiency) or Stunned for 1 minute (save at end of each turn). Once per Long Rest, or expend three Psionic Energy Dice.' },
        ],
      }
    },
    {
      name: 'Thief',
      description: 'Thieves are burglars, treasure hunters, and explorers.',
      features: {
        3: [
          { name: 'Fast Hands', description: 'Bonus Action: Sleight of Hand to pick lock/disarm trap/pick pocket; or Use an Object (Utilize action, or use magic item requiring action).' },
          { name: 'Second Story Work', description: 'Climber: Climb Speed equals Speed. Jumper: determine jump distance using Dexterity.' },
        ],
        9: [
          { name: 'Supreme Sneak', description: 'Cunning Strike option: Stealth Attack (cost 1d6). If you have Invisible from Hide, this attack doesn\'t end Invisible if you end turn behind Three-Quarters Cover or Total Cover.' },
        ],
        13: [
          { name: 'Use Magic Device', description: 'Attunement: attune to four magic items. Charges: when using magic item that expends charges, roll 1d6; on 6, don\'t expend charges. Scrolls: use any Spell Scroll, use Intelligence for spells; cast cantrips/level 1 reliably; for higher level, Arcana check DC 10 plus spell level.' },
        ],
        17: [
          { name: 'Thief\'s Reflexes', description: 'Take two turns during first round of combat. First at normal Initiative, second at Initiative minus 10.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: {"DEX":15,"INT":14,"CON":13,"WIS":12,"CHA":10,"STR":8}
};

export const sorcererEn = {
  details: {
    name: 'Sorcerer',
    description: 'Sorcerers wield innate magic that is stamped into their being.',
    traits: [
      { name: 'Hit Point Die', description: 'D6 per Sorcerer level' },
      { name: 'Saving Throws', description: 'CON and CHA' },
    ]
  } as DetailData,
  hitDie: 6,
  savingThrows: ['CON', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] as Skill[] },
  progression: {1:["Spellcasting","Innate Sorcery"],2:["Font of Magic","Metamagic"],3:["Sorcerer Subclass"],4:["Ability Score Improvement"],5:["Sorcerous Restoration"],6:["Subclass Feature"],7:["Sorcery Incarnate"],8:["Ability Score Improvement"],10:["Metamagic"],12:["Ability Score Improvement"],14:["Subclass Feature"],16:["Ability Score Improvement"],17:["Metamagic"],18:["Subclass Feature"],19:["Epic Boon"],20:["Arcane Apotheosis"]},
  subclasses: [
    {
      name: 'Aberrant Sorcery',
      description: 'An alien influence gives you psionic power from the Far Realm or a mind flayer tadpole.',
      features: {
        3: [
          { name: 'Psionic Spells', description: 'Always prepared: 3: Arms of Hadar, Calm Emotions, Detect Thoughts, Dissonant Whispers, Mind Sliver; 5: Hunger of Hadar, Sending; 7: Evard\'s Black Tentacles, Summon Aberration; 9: Rary\'s Telepathic Bond, Telekinesis.' },
          { name: 'Telepathic Speech', description: 'Bonus Action form telepathic connection with one visible creature within 30 feet. Communicate telepathically while within miles equal to Charisma modifier. Lasts minutes equal to Sorcerer level.' },
        ],
        6: [
          { name: 'Psionic Sorcery', description: 'When casting level 1+ spell from Psionic Spells, spend spell slot or Sorcery Points equal to spell\'s level. No Verbal/Somatic components, no Material unless consumed or has cost.' },
          { name: 'Psychic Defenses', description: 'Resistance to Psychic damage. Advantage on saves vs. Charmed/Frightened.' },
        ],
        14: [
          { name: 'Revelation in Flesh', description: 'Bonus Action spend 1+ Sorcery Points for 10 minutes, each point grants one benefit: Aquatic Adaptation (Swim Speed 2x, breathe underwater); Glistening Flight (Fly Speed, hover, skin glistens); See the Invisible (see Invisible within 60 feet, eyes turn black/sensory tendrils); Wormlike Movement (squeeze through 1 inch spaces, escape from nonmagical restraints/Grappled).' },
        ],
        18: [
          { name: 'Warping Implosion', description: 'Magic action teleport to visible unoccupied space within 120 feet. Creatures within 30 feet of space you left Strength save: 3d10 Force damage and pulled toward space, or half on success. Once per Long Rest, or spend 5 Sorcery Points.' },
        ],
      }
    },
    {
      name: 'Clockwork Sorcery',
      description: 'Cosmic force of order suffuses you from Mechanus.',
      features: {
        3: [
          { name: 'Clockwork Spells', description: 'Always prepared: 3: Aid, Alarm, Lesser Restoration, Protection from Evil and Good; 5: Dispel Magic, Protection from Energy; 7: Freedom of Movement, Summon Construct; 9: Greater Restoration, Wall of Force. Manifestation of Order (d6): cogwheels, clock hands in eyes, brass skin, floating equations, tiny clockwork, ticking/ringing.' },
          { name: 'Restore Balance', description: 'When creature within 60 feet about to roll with Advantage/Disadvantage, Reaction prevent it. Uses equal to Charisma modifier per Long Rest.' },
        ],
        6: [
          { name: 'Bastion of Law', description: 'Magic action expend 1-5 Sorcery Points create ward with that many d8s. When warded creature takes damage, expend dice reduce damage by total rolled. Ward lasts until Long Rest or use again.' },
        ],
        14: [
          { name: 'Trance of Order', description: 'Bonus Action for 1 minute: attack rolls against you can\'t benefit from Advantage; treat d20 rolls of 9 or lower as 10 on D20 Tests. Once per Long Rest, or spend 5 Sorcery Points.' },
        ],
        18: [
          { name: 'Clockwork Cavalcade', description: 'Magic action summon spirits in 30-foot Cube (modron-like, intangible, invulnerable): Heal (restore up to 100 HP divided among creatures); Repair (damaged objects repaired); Dispel (end spells level 6 and lower). Once per Long Rest, or spend 7 Sorcery Points.' },
        ],
      }
    },
    {
      name: 'Draconic Sorcery',
      description: 'Innate magic from dragon gift.',
      features: {
        3: [
          { name: 'Draconic Resilience', description: 'HP maximum increases by 3, plus 1 per Sorcerer level. Dragon-like scales. Base AC 10 plus Dexterity plus Charisma (no armor).' },
          { name: 'Draconic Spells', description: 'Always prepared: 3: Alter Self, Chromatic Orb, Command, Dragon\'s Breath; 5: Fear, Fly; 7: Arcane Eye, Charm Monster; 9: Legend Lore, Summon Dragon.' },
        ],
        6: [
          { name: 'Elemental Affinity', description: 'Choose damage type (Acid, Cold, Fire, Lightning, Poison). Resistance to that type. When casting spell dealing that type, add Charisma modifier to one damage roll.' },
        ],
        14: [
          { name: 'Dragon Wings', description: 'Bonus Action for 1 hour: draconic wings, Fly Speed 60 feet. Once per Long Rest, or spend 3 Sorcery Points.' },
        ],
        18: [
          { name: 'Dragon Companion', description: 'Cast Summon Dragon without Material component. Once without spell slot per Long Rest. Can modify to not require Concentration (1 minute duration).' },
        ],
      }
    },
    {
      name: 'Spellfire Sorcery',
      description: 'Power from the Weave itself, manifesting as spellfire.',
      features: {
        3: [
          { name: 'Spellfire Burst', description: 'When spending 1+ Sorcery Points as part of Magic/Bonus Action, unleash one: Bolstering Flames (Temporary Hit Points 1d4 plus Charisma modifier to you or creature within 30 feet); or Radiant Fire (1d4 Fire or Radiant damage to creature within 30 feet). Once per turn.' },
          { name: 'Spellfire Spells', description: 'Always prepared: 3: Cure Wounds, Guiding Bolt, Lesser Restoration, Scorching Ray; 5: Aura of Vitality, Dispel Magic; 7: Fire Shield, Wall of Fire; 9: Greater Restoration, Flame Strike.' },
        ],
        6: [
          { name: 'Absorb Spells', description: 'Always have Counterspell prepared. When target fails save against Counterspell, regain 1d4 Sorcery Points.' },
        ],
        14: [
          { name: 'Honed Spellfire', description: 'Spellfire Burst improves: Bolstering Flames adds Sorcerer level to Temporary Hit Points; Radiant Fire damage increases to 1d8.' },
        ],
        18: [
          { name: 'Crown of Spellfire', description: 'When using Innate Sorcery, alter it: Burning Life Force (when hit, expend Hit Point Dice up to Charisma mod, reduce damage by total rolled); Flight (Fly Speed 60 feet and hover); Spell Avoidance (when save for half damage, take no damage on success, half on fail). Once per Long Rest, or spend 5 Sorcery Points.' },
        ],
      }
    },
    {
      name: 'Wild Magic Sorcery',
      description: 'Innate magic from chaos underlying creation.',
      features: {
        3: [
          { name: 'Wild Magic Surge', description: 'Once per turn when casting Sorcerer spell with spell slot, roll 1d20. On 20, roll on Wild Magic Surge table. Wild Magic effect can\'t be affected by Metamagic.' },
          { name: 'Tides of Chaos', description: 'Gain Advantage on one D20 Test before rolling. Once until Long Rest. If you cast Sorcerer spell with spell slot before resting, automatically roll on Wild Magic Surge table.' },
        ],
        6: [
          { name: 'Bend Luck', description: 'After creature you see rolls d20 for D20 Test, Reaction spend 1 Sorcery Point to roll 1d4 and apply as bonus or penalty.' },
        ],
        14: [
          { name: 'Controlled Chaos', description: 'When rolling on Wild Magic Surge table, roll twice and use either.' },
        ],
        18: [
          { name: 'Tamed Surge', description: 'After casting Sorcerer spell with spell slot, create effect from Wild Magic Surge table instead of rolling (except final row). Once per Long Rest.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"CHA":15,"CON":14,"DEX":13,"WIS":12,"INT":10,"STR":8}
};

export const warlockEn = {
  details: {
    name: 'Warlock',
    description: 'Warlocks quest for knowledge that lies hidden in the fabric of the multiverse.',
    traits: [
      { name: 'Hit Point Die', description: 'D8 per Warlock level' },
      { name: 'Saving Throws', description: 'WIS and CHA' },
    ]
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] as Skill[] },
  progression: {1:["Eldritch Invocations","Pact Magic"],2:["Magical Cunning"],3:["Warlock Subclass"],4:["Ability Score Improvement"],6:["Subclass Feature"],8:["Ability Score Improvement"],9:["Contact Patron"],10:["Subclass Feature"],11:["Mystic Arcanum (Level 6 Spell)"],12:["Ability Score Improvement"],13:["Mystic Arcanum (Level 7 Spell)"],14:["Subclass Feature"],15:["Mystic Arcanum (Level 8 Spell)"],16:["Ability Score Improvement"],17:["Mystic Arcanum (Level 9 Spell)"],18:["—"],19:["Epic Boon"],20:["Eldritch Master"]},
  subclasses: [
    {
      name: 'Archfey Patron',
      description: 'Your pact draws on Feywild power from an archfey.',
      features: {
        3: [
          { name: 'Archfey Spells', description: 'Always prepared: 3: Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep; 5: Blink, Plant Growth; 7: Dominate Beast, Greater Invisibility; 9: Dominate Person, Seeming.' },
          { name: 'Steps of the Fey', description: 'Cast Misty Step without spell slot uses equal to Charisma modifier per Long Rest. Additional effects: Refreshing Step (1d10 Temporary Hit Points after teleport); Taunting Step (Wisdom save or Disadvantage on attacks against others until your next turn).' },
        ],
        6: [
          { name: 'Misty Escape', description: 'Cast Misty Step as Reaction when taking damage. Additional Steps of the Fey options: Disappearing Step (Invisible until start of next turn or after attack/damage/spell); Dreadful Step (creatures within 5 feet of space left or appeared take 2d10 Psychic).' },
        ],
        10: [
          { name: 'Beguiling Defenses', description: 'Immunity to Charmed. After creature hits you, Reaction reduce damage by half and force Wisdom save; on fail, attacker takes Psychic damage equal to damage you took. Once per Long Rest, or expend spell slot.' },
        ],
        14: [
          { name: 'Bewitching Magic', description: 'After casting Enchantment/Illusion spell with action and spell slot, cast Misty Step as part of same action without expending slot.' },
        ],
      }
    },
    {
      name: 'Celestial Patron',
      description: 'Your pact draws on Upper Planes from empyrean, couatl, sphinx, unicorn.',
      features: {
        3: [
          { name: 'Celestial Spells', description: 'Always prepared: 3: Aid, Cure Wounds, Guiding Bolt, Lesser Restoration, Light, Sacred Flame; 5: Daylight, Revivify; 7: Guardian of Faith, Wall of Fire; 9: Greater Restoration, Summon Celestial.' },
          { name: 'Healing Light', description: 'Pool of d6s equals 1 plus Warlock level. Bonus Action heal yourself or creature within 60 feet, expend up to Charisma modifier dice, restore HP equal to roll total. Regain all dice on Long Rest.' },
        ],
        6: [
          { name: 'Radiant Soul', description: 'Resistance to Radiant damage. When spell deals Radiant/Fire damage, add Charisma modifier to one damage roll.' },
        ],
        10: [
          { name: 'Celestial Resilience', description: 'When using Magical Cunning or finishing Short/Long Rest, gain Temporary Hit Points equal to Warlock level plus Charisma modifier. Choose up to five creatures to gain half that amount.' },
        ],
        14: [
          { name: 'Searing Vengeance', description: 'When ally within 60 feet makes Death Save, unleash radiant energy. Creature regains half HP maximum and can end Prone. Each creature within 30 feet takes 2d8 plus Charisma Radiant damage and Blinded until end of current turn. Once per Long Rest.' },
        ],
      }
    },
    {
      name: 'Fiend Patron',
      description: 'Your pact draws on Lower Planes from demon lord, archdevil, pit fiend, balor, yugoloth, night hag.',
      features: {
        3: [
          { name: 'Dark One\'s Blessing', description: 'When enemy reduced to 0 HP, gain Temporary Hit Points equal to Charisma modifier plus Warlock level. Also gain if someone else kills enemy within 10 feet.' },
          { name: 'Fiend Spells', description: 'Always prepared: 3: Burning Hands, Command, Scorching Ray, Suggestion; 5: Fireball, Stinking Cloud; 7: Fire Shield, Wall of Fire; 9: Geas, Insect Plague.' },
        ],
        6: [
          { name: 'Dark One\'s Own Luck', description: 'When making ability check or saving throw, add 1d10 after seeing roll. Uses equal to Charisma modifier per Long Rest, no more than once per roll.' },
        ],
        10: [
          { name: 'Fiendish Resilience', description: 'Choose damage type (not Force) on Short/Long Rest. Resistance to that type until choosing another.' },
        ],
        14: [
          { name: 'Hurl Through Hell', description: 'When hitting creature with attack, transport target through Lower Planes. Charisma save or take 8d10 Psychic damage, Incapacitated until end of your next turn, then return. Once per Long Rest, or expend spell slot.' },
        ],
      }
    },
    {
      name: 'Great Old One Patron',
      description: 'Your pact binds you to unspeakable being from Far Realm or elder god.',
      features: {
        3: [
          { name: 'Awakened Mind', description: 'Bonus Action form telepathic connection with visible creature within 30 feet. Communicate telepathically while within miles equal to Charisma modifier. Lasts minutes equal to Warlock level.' },
          { name: 'Great Old One Spells', description: 'Always prepared: 3: Detect Thoughts, Dissonant Whispers, Phantasmal Force, Tasha\'s Hideous Laughter; 5: Clairvoyance, Hunger of Hadar; 7: Confusion, Summon Aberration; 9: Modify Memory, Telekinesis.' },
          { name: 'Psychic Spells', description: 'When casting damage spell, change damage type to Psychic. Cast Enchantment/Illusion without Verbal/Somatic components.' },
        ],
        6: [
          { name: 'Clairvoyant Combatant', description: 'When forming telepathic bond, target Wisdom save. On fail, Disadvantage on attacks against you, Advantage on attacks against target.' },
        ],
        10: [
          { name: 'Eldritch Hex', description: 'Always have Hex prepared. When casting Hex and choosing ability, target also has Disadvantage on saves of that ability.' },
          { name: 'Thought Shield', description: 'Thoughts can\'t be read unless you allow. Resistance to Psychic damage. When creature deals Psychic damage to you, it takes same amount.' },
        ],
        14: [
          { name: 'Create Thrall', description: 'When casting Summon Aberration, modify to not require Concentration (1 minute duration). Aberration has Temporary Hit Points equal to Warlock level plus Charisma modifier. First time each turn Aberration hits creature under Hex, deal extra Psychic damage equal to spell\'s bonus damage.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"CHA":15,"CON":14,"DEX":13,"WIS":12,"INT":10,"STR":8}
};

export const wizardEn = {
  details: {
    name: 'Wizard',
    description: 'Wizards are defined by their exhaustive study of magic\'s inner workings.',
    traits: [
      { name: 'Hit Point Die', description: 'D6 per Wizard level' },
      { name: 'Saving Throws', description: 'INT and WIS' },
    ]
  } as DetailData,
  hitDie: 6,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['INT', 'DEX', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Religion'] as Skill[] },
  progression: {1:["Spellcasting","Ritual Adept","Arcane Recovery"],2:["Scholar"],3:["Wizard Subclass"],4:["Ability Score Improvement"],5:["Memorize Spell"],6:["Subclass Feature"],8:["Ability Score Improvement"],10:["Subclass Feature"],12:["Ability Score Improvement"],14:["Subclass Feature"],16:["Ability Score Improvement"],18:["Spell Mastery"],19:["Epic Boon"],20:["Signature Spells"]},
  subclasses: [
    {
      name: 'Abjurer',
      description: 'Focus on spells that block, banish, protect—ending harmful effects and protecting the weak.',
      features: {
        3: [
          { name: 'Abjuration Savant', description: 'Add two Abjuration spells (level 2 or lower) to spellbook for free. When gaining new spell slot level, add one Abjuration spell to spellbook for free.' },
          { name: 'Arcane Ward', description: 'When casting Abjuration spell with spell slot, create ward: HP max equals twice Wizard level plus Int modifier. Ward takes damage instead. Regain HP by casting Abjuration spell or as Bonus Action expend spell slot. Once per Long Rest.' },
        ],
        6: [
          { name: 'Projected Ward', description: 'When creature within 30 feet takes damage, Reaction cause Arcane Ward to absorb that damage. If ward reduced to 0, creature takes remaining damage.' },
        ],
        10: [
          { name: 'Spell Breaker', description: 'Always have Counterspell and Dispel Magic prepared. Cast Dispel Magic as Bonus Action, add Proficiency Bonus to check. When casting these spells with slot and they fail, slot not expended.' },
        ],
        14: [
          { name: 'Spell Resistance', description: 'Advantage on saves vs. spells. Resistance to spell damage.' },
        ],
      }
    },
    {
      name: 'Bladesinger',
      description: 'Bladesingers incorporate swordplay and dance, channeling magic into devastating attacks.',
      features: {
        3: [
          { name: 'Bladesong', description: 'Bonus Action invoke Bladesong (no armor/shield, not two-handed weapon). Lasts 1 minute, ends if Incapacitated, don armor/shield, or attack with two hands. Uses equal to Int modifier per Long Rest (regain one with Arcane Recovery). While active: AC bonus equals Int modifier (min +1), Speed +10 feet, Advantage on Dex (Acrobatics); use Int for weapon attack/damage; add Int to Con saves for Concentration.' },
          { name: 'Training in War and Song', description: 'Proficiency with Melee Martial weapons (not Two-Handed/Heavy). Use Melee weapon as Spellcasting Focus. Proficiency in Acrobatics, Athletics, Performance, or Persuasion.' },
        ],
        6: [
          { name: 'Extra Attack', description: 'Attack twice when taking Attack action. Cast Wizard cantrip in place of one attack.' },
        ],
        10: [
          { name: 'Song of Defense', description: 'When taking damage while Bladesong active, Reaction expend spell slot to reduce damage by five times spell slot level.' },
        ],
        14: [
          { name: 'Song of Victory', description: 'After casting spell with action, make one weapon attack as Bonus Action.' },
        ],
      }
    },
    {
      name: 'Diviner',
      description: 'Diviners part veils of space, time, and consciousness, mastering spells of foresight.',
      features: {
        3: [
          { name: 'Divination Savant', description: 'Add two Divination spells (level 2 or lower) to spellbook for free. When gaining new spell slot level, add one Divination spell for free.' },
          { name: 'Portent', description: 'At end of Long Rest, roll two d20s, record numbers. Replace any D20 Test made by you or visible creature with one of these rolls. Must choose before roll. Once per turn. Unused rolls lost at Long Rest.' },
        ],
        6: [
          { name: 'Expert Divination', description: 'When casting Divination spell with level 2+ slot, regain one expended slot of level lower than spell (max level 5).' },
        ],
        10: [
          { name: 'The Third Eye', description: 'Bonus Action choose benefit until rest: Darkvision 120 feet; read any language; or cast See Invisibility without slot. Once per Short/Long Rest.' },
        ],
        14: [
          { name: 'Greater Portent', description: 'Roll three d20s for Portent instead of two.' },
        ],
      }
    },
    {
      name: 'Evoker',
      description: 'Focus on magic creating powerful elemental effects.',
      features: {
        3: [
          { name: 'Evocation Savant', description: 'Add two Evocation spells (level 2 or lower) to spellbook for free. When gaining new spell slot level, add one Evocation spell for free.' },
          { name: 'Potent Cantrip', description: 'When cantrip misses or target saves, target takes half damage (no other effect).' },
        ],
        6: [
          { name: 'Sculpt Spells', description: 'When casting Evocation affecting visible creatures, choose number equal to 1 plus spell level. Chosen creatures auto-succeed saves and take no damage on successful save.' },
        ],
        10: [
          { name: 'Empowered Evocation', description: 'When casting Evocation spell, add Int modifier to one damage roll.' },
        ],
        14: [
          { name: 'Overchannel', description: 'When casting damage spell with slot levels 1-5, deal maximum damage on turn cast. First use no adverse effect. Subsequent uses before Long Rest cause 2d12 Necrotic damage per slot level after casting (increases by 1d12 each subsequent use).' },
        ],
      }
    },
    {
      name: 'Illusionist',
      description: 'Specialize in magic that dazzles senses and tricks the mind.',
      features: {
        3: [
          { name: 'Illusion Savant', description: 'Add two Illusion spells (level 2 or lower) to spellbook for free. When gaining new spell slot level, add one Illusion spell for free.' },
          { name: 'Improved Illusions', description: 'Cast Illusion spells without Verbal components. Illusion spells with range 10+ feet have range increased 60 feet. Know Minor Illusion (or learn different Wizard cantrip). Create sound and image with single casting, cast as Bonus Action.' },
        ],
        6: [
          { name: 'Phantasmal Creatures', description: 'Always have Summon Beast and Summon Fey prepared. Cast them as Illusion (spectral appearance). Cast without slot (half HP), must finish Long Rest to do so again.' },
        ],
        10: [
          { name: 'Illusory Self', description: 'When creature hits you with attack roll, Reaction interpose illusory duplicate. Attack automatically misses, then illusion dissipates. Once per Short/Long Rest, or expend level 2+ slot.' },
        ],
        14: [
          { name: 'Illusory Reality', description: 'When casting Illusion spell with slot, Bonus Action make one inanimate nonmagical object in illusion real for 1 minute. Object can\'t deal damage or give conditions.' },
        ],
      }
    },
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: {"INT":15,"DEX":14,"CON":13,"WIS":12,"CHA":10,"STR":8}
};
