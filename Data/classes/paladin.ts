
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
        description: 'Paladins who swear to preserve the light of the world, delighting in art, laughter, and nature.',
        features: {
            3: [
                { name: 'Nature\'s Wrath', description: 'Channel Divinity: As a Magic action, invoke spectral vines to restrain a creature within 15 feet (DC Strength).' },
                { name: 'Oath of the Ancients Spells', description: 'Spells like Ensnaring Strike, Speak with Animals, and Animal Growth.' }
            ],
            7: [{ name: 'Aura of Warding', description: 'You and allies in your Protection Aura have Resistance to Necrotic, Psychic, and Radiant damage.' }],
            15: [{ name: 'Undying Sentinel', description: 'When you drop to 0 HP and don\'t die, you can remain at 1 HP (1/Long Rest). You stop aging visibly.' }],
            20: [{ name: 'Elder Champion', description: 'Bonus action (1 min): You regenerate 10 HP per turn, your paladin spells are cast as bonus actions, and enemies have disadvantage on saves.' }]
        }
    },
    {
        name: 'Oath of Vengeance',
        description: 'A solemn commitment to punish those who have committed grievous evil acts.',
        features: {
            3: [
                { name: 'Vow of Enmity', description: 'Channel Divinity: As an Attack action, choose an enemy within 30 feet to have Advantage on attacks against them for 1 minute.' },
                { name: 'Oath of Vengeance Spells', description: 'Spells like Bane, Hunter\'s Mark, and Hold Person.' }
            ],
            7: [{ name: 'Relentless Avenger', description: 'When hitting with an opportunity attack, the enemy\'s speed drops to 0 and you can move half your speed.' }],
            15: [{ name: 'Soul of Vengeance', description: 'When the target of your Vow of Enmity makes an attack, you can use your reaction to make a melee attack against them.' }],
            20: [{ name: 'Avenging Angel', description: 'Bonus action (10 min): You gain wings (60 ft flight) and an aura that can frighten enemies that start their turn near you.' }]
        }
    },
    {
        name: 'Oath of the Spellguard',
        description: 'Paladins sworn to combat those who use magic to harm others, acting as bodyguards against magical attacks.',
        features: {
            3: [
                { name: 'Guardian Bond', description: 'Channel Divinity: As a Magic action, forge a bond with an ally within 5 feet (1 hour). You can use your reaction to add your Charisma bonus to their AC if they are within reach.' },
                { name: 'Oath of the Spellguard Spells', description: 'Always prepared spells: Detect Magic, Shield (3), See Invisibility, Silence (5), Counterspell, Dispel Magic (9), Freedom of Movement, Otiluke\'s Resilient Sphere (13), Circle of Power, Sanctuary (17).' },
                { name: 'Spellguard Strike', description: 'Reaction: When a creature within reach casts a spell (V, S, or M), you can make a melee weapon attack against them.' }
            ],
            7: [{ name: 'Aura of Concentration', description: 'You and allies have advantage on Constitution saving throws to maintain concentration while in your Protection Aura.' }],
            15: [{ name: 'Spell-Breaking Blade', description: 'Immediately after hitting with your Spellguard Strike, you can cast Counterspell as part of the same reaction. If the Counterspell fails, you don\'t spend the slot.' }],
            20: [{ name: 'Eternal Spellguard', description: 'Bonus action (1 min): Your Protection Aura is enhanced. Your Bond target has Resistance to all damage, and you and allies have advantage on saves against spells and spell attacks against you have disadvantage.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CHA: 14, CON: 13, WIS: 12, DEX: 10, INT: 8 }
};
