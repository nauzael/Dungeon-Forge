
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const paladin = {
  details: { 
    name: 'Paladin', 
    description: 'Holy warriors united by sacred oaths to combat annihilation and corruption. They are blessed champions capable of healing, punishing, and protecting.', 
    traits: [
        { name: 'Lay on Hands', description: 'Healing reserve (5 x Level). As a bonus action, restore HP or cure the Poisoned condition (spending 5 points).' }, 
        { name: 'Spellcasting', description: 'Charisma-based divine magic. You start casting spells at level 1.' }, 
        { name: 'Weapon Mastery', description: 'You master the mastery properties of two types of weapons.' }
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
    14: ['Restoring Touch'], 
    15: ['Subclass Feature'],
    16: ['Ability Score Improvement'], 
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
                { name: 'Sacred Weapon', description: 'Channel Divinity: As a Magic action, imbue a weapon with positive energy (10 min). Add your Charisma modifier to attack rolls and the weapon emits bright light.' },
                { name: 'Oath of Devotion Spells', description: 'Always prepared spells like Protection from Evil and Good, Shield of Faith, and Aid.' }
            ],
            7: [{ name: 'Aura of Devotion', description: 'You and allies in your Protection Aura are immune to the Charmed condition.' }],
            15: [{ name: 'Smite of Protection', description: 'Your Divine Smite radiates protective energy: You and allies have Half Cover in your Aura until the start of your next turn.' }],
            20: [{ name: 'Holy Nimbus', description: 'Bonus action (10 min): You emit sunlight, have advantage on saves against Fiends/Undead, and enemies that start their turn nearby take Radiant damage.' }]
        }
    },
    {
        name: 'Oath of Glory',
        description: 'Paladins who believe they and their companions are destined to achieve glory through acts of heroism.',
        features: {
            3: [
                { name: 'Inspiring Smite', description: 'Channel Divinity: After using Divine Smite, you can give THP (2d8 + Paladin Level) distributed among creatures within 30 feet.' },
                { name: 'Peerless Athlete', description: 'Channel Divinity: As a bonus action (1 hour), you have advantage on Athletics/Acrobatics and your jumps increase by 10 feet.' },
                { name: 'Oath of Glory Spells', description: 'Spells like Guiding Bolt, Heroism, and Haste.' }
            ],
            7: [{ name: 'Aura of Alacrity', description: 'Your speed increases by 10 feet. Allies that enter or start their turn in your Aura gain +10 feet speed until the end of their turn.' }],
            15: [{ name: 'Glorious Defense', description: 'Reaction: When hit, add your Charisma modifier to the target\'s AC. If the attack fails, you can make an attack against the attacker.' }],
            20: [{ name: 'Living Legend', description: 'Bonus action (1 min): You have advantage on Charisma checks and once per turn you can turn a save failure into a success via Reaction.' }]
        }
    },
    {
        name: 'Oath of the Ancients',
        description: 'Preserve Life and Light in the World. The Oath of the Ancients is as old as the first elves. Paladins who swear this oath cherish the light; they love the beautiful and life-giving things of the world more than any principles of honor, courage and justice.',
        features: {
            3: [
                { name: 'Nature\'s Wrath', description: 'As a Magic action, you can expend one of your uses of Channel Divinity to conjure spectral vines around nearby creatures. Each creature of your choice that you can see within 15 feet of yourself must succeed on a Strength saving throw or have the Restrained condition for 1 minute. A Restrained creature repeats the save at the end of each of its turns, ending the effect on a success.' },
                { name: 'Oath of the Ancients Spells', description: 'L3: Ensnaring Strike, Speak with Animals. L5: Misty Step, Moonbeam. L9: Plant Growth, Protection from Energy. L13: Ice Storm, Stoneskin. L17: Commune with Nature, Tree Stride.' }
            ],
            7: [{ name: 'Aura of Warding', description: 'Ancient magic lies so heavily upon you that it forms an eldritch ward, blunting energy from beyond the Material Plane; you and your allies have Resistance to Necrotic, Psychic and Radiant damage while in your Aura of Protection.' }],
            15: [{ name: 'Undying Sentinel', description: 'When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead, and regain a number of Hit Points equal to three times your Paladin level. Additionally, you can\'t be aged magically, and you cease visibly aging.' }],
            20: [{ name: 'Elder Champion', description: 'As a Bonus Action, you can imbue your Aura of Protection with primal power for 1 minute: Diminish Defiance (enemies in aura have Disadvantage on saves against your spells and Channel Divinity), Regeneration (regain 10 HP at start of each turn), Swift Spells (cast spells with casting time of action as Bonus Action).' }]
        }
    },
    {
        name: 'Oath of Vengeance',
        description: 'Punish Evildoers at Any Cost. The Oath of Vengeance is a solemn commitment to punish those who have committed grievously evil acts.',
        features: {
            3: [
                { name: 'Vow of Enmity', description: 'When you take the Attack action, you can expend one use of your Channel Divinity to utter a vow of enmity against a creature you can see within 30 feet. You have Advantage on attack rolls against the creature for 1 minute or until you use this feature again.' },
                { name: 'Oath of Vengeance Spells', description: 'L3: Bane, Hunter\'s Mark. L5: Hold Person, Misty Step. L9: Haste, Protection from Energy. L13: Banishment, Dimension Door. L17: Hold Monster, Scrying.' }
            ],
            7: [{ name: 'Relentless Avenger', description: 'Your supernatural focus helps you close off a foe\'s retreat. When you hit a creature with an Opportunity Attack, you can reduce the creature\'s Speed to 0 until the end of the current turn. You can then move up to half your Speed as part of the same Reaction.' }],
            15: [{ name: 'Soul of Vengeance', description: 'Immediately after a creature under the effect of your Vow of Enmity hits or misses with an attack roll, you can take a Reaction to make a melee attack against that creature if it\'s within range.' }],
            20: [{ name: 'Avenging Angel', description: 'As a Bonus Action, you gain Flight (spectral wings, 60 ft Fly Speed, can hover) and Frightful Aura (enemies in your Aura must make Wisdom save or be Frightened). Once per Long Rest, or by expending a level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of the Noble Genies',
        description: 'Brandish the Elemental Splendor of Genies. Paladins sworn to the Oath of the Noble Genies revere the forces of the Elemental Planes.',
        features: {
            3: [
                { name: 'Elemental Smite', description: 'After casting Divine Smite, you can expend one use of Channel Divinity: Dao\'s Crush (Grappled), Djinni\'s Escape (Teleport 30ft + Resistance to BPS + Immunity to Grappled/Prone/Restrained), Efreeti\'s Fury (extra 2d4 Fire damage + fire jumps to nearby creature), or Marid\'s Surge (push 15ft + Prone in 10ft Emanation).' },
                { name: 'Genie Spells', description: 'L3: Chromatic Orb, Elementalism, Thunderous Smite. L5: Mirror Image, Phantasmal Force. L9: Fly, Gaseous Form. L13: Conjure Minor Elementals, Summon Elemental. L17: Banishing Smite, Contact Other Plane.' },
                { name: 'Genie\'s Splendor', description: 'Your base AC equals 10 + Dexterity + Charisma while unarmored. You gain proficiency in one skill: Acrobatics, Intimidation, Performance, or Persuasion.' }
            ],
            7: [{ name: 'Aura of Elemental Shielding', description: 'Choose Acid, Cold, Fire, Lightning, or Thunder. You and allies have Resistance to that damage type in your Aura. At the start of each turn, you can change the type.' }],
            15: [{ name: 'Elemental Rebuke', description: 'When hit by an attack, take a Reaction to halve the damage and force attacker to make a Dexterity save or take 2d10 + CHA modifier damage of a chosen energy type. Uses equal to CHA modifier per Long Rest.' }],
            20: [{ name: 'Noble Scion', description: 'Bonus Action (10 min): Flight (60 ft, hover). Minor Wish: When you or ally in your Aura fails a D20 Test, use Reaction to make them succeed instead. Once per Long Rest, or by expending a level 5 spell slot.' }]
        }
    },
    {
        name: 'Oath of the Spellguard',
        description: 'Paladins sworn to combat those who use magic to harm others, acting as bodyguards against magical attacks.',
        features: {
            3: [
                { name: 'Guardian Bond', description: 'Channel Divinity: As a Magic action, forge a bond with an ally within 5 feet (1 hour). You can use your reaction to add your Charisma bonus to their AC if they are within reach.' },
                { name: 'Spellguard Strike', description: 'Reaction: When a creature within reach casts a spell (V, S, or M), you can make a melee weapon attack against them.' }
            ],
            7: [{ name: 'Aura of Concentration', description: 'You and allies have advantage on Constitution saving throws to maintain concentration while in your Protection Aura.' }],
            15: [{ name: 'Spell-Breaking Blade', description: 'Immediately after hitting with your Spellguard Strike, you can cast Counterspell as part of the same reaction.' }],
            20: [{ name: 'Eternal Spellguard', description: 'Bonus action (1 min): Your Protection Aura is enhanced. Your Bond target has Resistance to all damage, and you and allies have advantage on saves against spells.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CHA: 14, CON: 13, WIS: 12, DEX: 10, INT: 8 }
};
