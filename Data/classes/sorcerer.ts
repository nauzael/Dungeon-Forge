
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const sorcerer = {
  details: { 
    name: 'Sorcerer', 
    description: 'Sorcerers carry innate magic sealed within their being. They don\'t learn magic; the raw, seething power is part of them, inherited through lineage or strange events.', 
    traits: [
        { name: 'Spellcasting', description: 'Innate Charisma-based arcane magic. You are a prepared spellcaster.' }, 
        { name: 'Innate Sorcery', description: 'Bonus action: For 1 min, your save DC increases by 1 and you have advantage on spell attack rolls. (2 uses/Long Rest).' }, 
        { name: 'Font of Magic', description: 'Sorcery Points reserve (equal to your level starting at level 2). Use them to create spell slots or fuel your Metamagic.' }
    ] 
  } as DetailData,
  hitDie: 6,
  savingThrows: ['CON', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Innate Sorcery'], 
    2: ['Font of Magic', 'Metamagic'], 
    3: ['Sorcerer Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Sorcerous Restoration'], 
    6: ['Subclass Feature'],
    7: ['Sorcery Incarnate'], 
    8: ['Ability Score Improvement'], 
    10: ['Metamagic'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    17: ['Metamagic'], 
    18: ['Subclass Feature'], 
    19: ['Epic Boon Feat'], 
    20: ['Arcane Apotheosis'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Draconic Sorcery', 
        description: 'Your innate magic comes from the gift of a dragon, inherited from an ancestor who was blessed or absorbed the power of a draconic lair.', 
        features: { 
            3: [
                { name: 'Draconic Resilience', description: 'Your maximum Hit Points increase by 3, and increase by 1 each time you level up in sorcerer. While not wearing armor, your base AC equals 10 + your Dexterity and Charisma modifiers.' },
                { name: 'Draconic Spells', description: 'Always prepared spells like Alter Self, Chromatic Orb, Command, and Dragon\'s Breath. More spells at levels 5, 7, and 9.' }
            ],
            6: [{ name: 'Elemental Affinity', description: 'Choose a damage type (Acid, Cold, Fire, Lightning, or Poison). You gain Resistance to that damage, and when casting a spell that deals that type, you add your Charisma modifier to one damage roll.' }],
            14: [{ name: 'Dragon wings', description: 'As a bonus action, you can summon draconic wings (1h). You gain a 60-foot Fly speed. You can spend 3 Sorcery Points to restore this use before a long rest.' }],
            18: [{ name: 'Dragon Companion', description: 'You can cast Summon Dragon without material components and once for free per long rest. You can cast it without concentration (1 min duration).' }]
        } 
    },
    {
        name: 'Wild Magic Sorcery',
        description: 'Your magic bursts from the forces of chaos that underlie the order of creation, seeking any outlet.',
        features: {
            3: [
                { name: 'Wild Magic Surge', description: '1/turn after casting a spell with a slot, roll 1d20. On a 20, roll on the Wild Magic Surge table. The effects are too wild for Metamagic and last their full duration.' },
                { name: 'Tides of Chaos', description: 'You gain advantage on one d20 roll. You recover the use after a long rest or after casting a spell of level 1+ that triggers a Wild Magic Surge.' }
            ],
            6: [{ name: 'Bend Luck', description: 'Reaction (1 point): When you see another roll a d20, roll 1d4 and add or subtract the result from their roll.' }],
            14: [{ name: 'Controlled Chaos', description: 'When rolling on the Wild Magic Surge table, roll twice and choose the result you prefer.' }],
            18: [{ name: 'Tamed Surge', description: 'After casting a spell with a slot, you can choose any effect from the Surge table (except the last one) that casts a spell or restores all your sorcery points. (1/1d4 long rests).' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};
