
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const paladin = {
  details: { 
    name: 'Paladin', 
    description: 'Holy warriors united by sacred oaths to combat annihilation and corruption. They are blessed champions capable of healing, punishing, and protecting.', 
    traits: [
        { name: 'Lay on Hands', description: 'Your blessed touch can heal wounds. You have a pool of healing power that replenishes on a Long Rest, with a total of HP = 5 × Paladin level. As a Bonus Action, you touch a creature (including yourself) and restore HP from the pool. You can spend 5 HP from the pool to cure the Poisoned condition (those points don\'t restore HP).' }, 
        { name: 'Spellcasting', description: 'You have learned to cast spells through prayer. You are a prepared spellcaster. Your spellcasting ability is Charisma. You use a Holy Symbol as a Spellcasting Focus.' }, 
        { name: 'Weapon Mastery', description: 'Your training lets you use the mastery properties of two weapon types you are proficient with. When you finish a Long Rest, you can change your choice.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['STR', 'CHA', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Lay on Hands', 'Spellcasting', 'Weapon Mastery'], 
    2: ['Fighting Style', 'Paladin\'s Smite'], 
    3: ['Channel Divinity', 'Paladin Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Faithful Steed'], 
    6: ['Aura of Protection'], 
    7: ['Subclass Feature'],
    8: ['Ability Score Improvement'], 
    9: ['Abjure Foes'], 
    10: ['Aura of Courage'], 
     11: ['Radiant Strikes'],
     12: ['Ability Score Improvement'],
     13: ['—'],
     14: ['Restoring Touch'], 
     15: ['Subclass Feature'],
     16: ['Ability Score Improvement'],
     17: ['—'],
     18: ['Aura Expansion'],
    19: ['Epic Boon Feat'], 
    20: ['Subclass Feature'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Oath of Devotion',
        description: 'Paladins dedicated to the ideals of justice, order, and the knight of shining armor.',
        features: {
            3: [
                { name: 'Sacred Weapon', description: 'As a Magic action, you expend Channel Divinity to imbue a melee weapon with positive energy for 10 minutes. You add your Charisma modifier to attack rolls. The weapon sheds Bright Light in 20 feet and Dim Light for 20 more feet.' },
                { name: 'Oath of Devotion Spells', description: 'You always have prepared: level 3: Protection from Evil and Good, Shield of Faith; level 5: Aid, Zone of Truth; level 9: Beacon of Hope, Dispel Magic; level 13: Freedom of Movement, Guardian of Faith; level 17: Commune, Holy Weapon.' }
            ],
             7: [{ name: 'Aura of Devotion', description: 'You and allies in your Aura of Protection have Immunity to the Charmed condition.' }],
             15: [{ name: 'Smite of Protection', description: 'When you cast Divine Smite, allies in your Aura of Protection gain Half Cover until the start of your next turn.' }],
             20: [{ name: 'Holy Nimbus', description: 'Bonus Action for 10 minutes: you shed sunlight; Advantage on saves against Fiends/Undead; enemies that start their turn in the aura take Radiant damage = Charisma + Proficiency. Once per Long Rest, or by spending a level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of Glory',
        description: 'Paladins who believe they and their companions are destined to achieve glory through acts of heroism.',
        features: {
            3: [
                { name: 'Inspiring Smite', description: 'After casting Divine Smite, you expend Channel Divinity to distribute 2d8 + Paladin level in Temporary HP among creatures within 30 feet.' },
                { name: 'Peerless Athlete', description: 'Bonus Action, expend Channel Divinity for 1 hour: Advantage on Athletics and Acrobatics, your jumps increase by 10 feet.' },
                { name: 'Oath of Glory Spells', description: 'level 3: Guiding Bolt, Heroism; level 5: Zone of Truth, Spiritual Weapon; level 9: Haste, Protection from Energy; level 13: Freedom of Movement, Dimension Door; level 17: Spiritual Guardian, Steel Wind Strike.' }
            ],
             7: [{ name: 'Aura of Alacrity', description: 'Your speed increases by 10 feet. Allies who enter or start their turn in your Aura gain +10 feet until the end of their turn.' }],
             15: [{ name: 'Glorious Defense', description: 'When you or an ally within 10 feet is hit, Reaction to add Charisma to their AC. If the attack misses, you make an attack against the attacker. Uses = Charisma per Long Rest.' }],
             20: [{ name: 'Living Legend', description: 'Bonus Action 10 min: Advantage on Charisma; you can reroll failed saves; once per turn if you miss a weapon attack, it hits instead. Once per Long Rest, or level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of the Ancients',
        description: 'Preserve Life and Light in the World. The Oath of the Ancients is as old as the first elves. Paladins who swear this oath cherish the light; they love the beautiful and life-giving things of the world more than any principles of honor, courage and justice.',
        features: {
            3: [
                { name: 'Nature\'s Wrath', description: 'Magic action, expend Channel Divinity. Each creature you choose within 15 feet makes a Strength save or is Restrained for 1 minute. Repeats save at the end of each turn.' },
                { name: 'Oath of the Ancients Spells', description: 'level 3: Ensnaring Strike, Speak with Animals; 5: Misty Step, Moonbeam; 9: Plant Growth, Protection from Energy; 13: Ice Storm, Stoneskin; 17: Commune with Nature, Tree Stride.' }
            ],
             7: [{ name: 'Aura of Warding', description: 'You and allies have Resistance to Necrotic, Psychic, and Radiant damage in your Aura of Protection.' }],
             15: [{ name: 'Undying Sentinel', description: 'When you are reduced to 0 HP and don\'t die, you drop to 1 HP and regain 3 × Paladin level. You can\'t be magically aged. Once per Long Rest.' }],
             20: [{ name: 'Elder Champion', description: 'Bonus Action 1 minute: enemies in aura have Disadvantage against your spells; you regain 10 HP at start of turn; you cast action spells as a Bonus Action. Once per Long Rest or level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of Vengeance',
        description: 'Punish Evildoers at Any Cost. The Oath of Vengeance is a solemn commitment to punish those who have committed grievously evil acts.',
        features: {
            3: [
                { name: 'Vow of Enmity', description: 'When you take the Attack action, expend Channel Divinity to swear a vow against a creature within 30 feet. Advantage on attacks against it for 1 minute. If it drops to 0 HP, you transfer the vow.' },
                { name: 'Oath of Vengeance Spells', description: 'level 3: Bane, Hunter\'s Mark; 5: Hold Person, Misty Step; 9: Haste, Protection from Energy; 13: Banishment, Dimension Door; 17: Hold Monster, Scrying.' }
            ],
             7: [{ name: 'Relentless Avenger', description: 'When you hit with an Opportunity Attack, you reduce speed to 0 until end of turn. You can move up to half your speed.' }],
             15: [{ name: 'Soul of Vengeance', description: 'Immediately after a creature under your Vow of Enmity attacks, you can make a melee attack against it with your Reaction.' }],
             20: [{ name: 'Avenging Angel', description: 'Bonus Action 10 min: spectral wings, Flight 60 feet and hover; Frightful Aura (Wis save or Frightened, attacks against frightened with Advantage). Once per Long Rest or level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of the Noble Genies',
        description: 'Brandish the Elemental Splendor of Genies. Paladins sworn to the Oath of the Noble Genies revere the forces of the Elemental Planes.',
        features: {
            3: [
                { name: 'Elemental Smite', description: 'After Divine Smite, expend Channel Divinity for: Dao Crush (Restrained/Incapacitated), Djinn Escape (teleport 30 feet + resistance), Efreet Fury (+2d4 Fire and jumps to creature within 30 feet), Marid Wave (push 15 feet + knocked Prone in 10 foot emanation).' },
                { name: 'Genie Spells', description: 'level 3: Chromatic Orb, Elementalism, Thunderous Smite; 5: Mirror Image, Phantasmal Force; 9: Fly, Gaseous Form; 13: Conjure Minor Elementals, Summon Elemental; 17: Banishing Smite, Contact Other Plane.' },
                { name: 'Genie\'s Splendor', description: 'Base AC = 10 + Dexterity + Charisma without armor. Proficiency in one skill: Acrobatics, Intimidation, Performance, or Persuasion.' }
            ],
             7: [{ name: 'Aura of Elemental Shielding', description: 'Choose Acid, Cold, Fire, Lightning, or Thunder. You and allies have Resistance in the Aura. You change at the start of each turn.' }],
             15: [{ name: 'Elemental Rebuke', description: 'When you take damage from an attack, Reaction to halve the damage and force the attacker to make a Dexterity save or take 2d10 + Charisma. Uses = Charisma per Long Rest.' }],
             20: [{ name: 'Noble Scion', description: 'Bonus Action 10 min: Flight 60 and hover. When you or an ally fails an ability check, Reaction for automatic success. Once per Long Rest or level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of the Spellguard',
        description: 'Paladins sworn to combat those who use magic to harm others, acting as bodyguards against magical attacks.',
        features: {
            3: [
                { name: 'Guardian Bond', description: 'Channel Divinity: Magic action, you forge a bond with an ally within 5 feet (1 hour). You can use your Reaction to add Charisma to their AC if they are within your reach.' },
                { name: 'Spellguard Strike', description: 'Reaction: when a creature within your reach casts a spell (V, S, or M), you make a melee attack against it.' }
            ],
             7: [{ name: 'Aura of Concentration', description: 'You and allies have Advantage on Constitution saves to maintain Concentration in your Aura of Protection.' }],
             15: [{ name: 'Spell-Breaking Blade', description: 'After hitting with Spellguard Strike, you can cast Counterspell as part of the same reaction.' }],
             20: [{ name: 'Eternal Spellguard', description: 'Bonus Action 1 minute: your Aura improves. Your bond has Resistance to all damage. You and allies have Advantage on saves against spells.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CHA: 14, CON: 13, WIS: 12, DEX: 10, INT: 8 }
};
