
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const cleric = {
  details: { 
    name: 'Cleric', 
    description: 'Clerics draw power from the realms of the gods and use it to work miracles. They are conduits of divine magic from the Outer Planes.', 
    traits: [
        { name: 'Spellcasting', description: 'Wisdom-based divine magic. You are a prepared spellcaster.' }, 
        { name: 'Divine Order', description: 'You have dedicated your life to a sacred role: Protector (proficiency with martial weapons and heavy armor) or Thaumaturge (extra cantrip and bonus to Religion/Arcana).' }, 
        { name: 'Channel Divinity', description: 'Ability to channel divine energy for magical effects like Turn Undead or Divine Spark.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['WIS', 'CON', 'STR'] as Ability[],
  skillData: { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Divine Order'], 
    2: ['Channel Divinity'], 
    3: ['Cleric Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Sear Undead'], 
    6: ['Subclass Feature'],
    7: ['Blessed Strikes'],
    8: ['Ability Score Improvement'], 
    10: ['Divine Intervention'], 
    12: ['Ability Score Improvement'], 
    14: ['Improved Blessed Strikes'], 
    16: ['Ability Score Improvement'], 
    17: ['Subclass Feature'],
    18: ['Channel Divinity Upgrade'],
    19: ['Epic Boon Feat'], 
    20: ['Greater Divine Intervention'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Life Domain', 
        description: 'The Life Domain focuses on the positive energy that sustains all life.', 
        features: { 
            3: [
                { name: 'Disciple of Life', description: 'When healing with a spell, the target recovers extra HP equal to 2 + the spell slot level spent.' },
                { name: 'Preserve Life', description: 'Channel Divinity: As a magic action, heal HP equal to 5 times your level to creatures within 30 feet (maximum up to half their life).' }
            ],
            6: [{ name: 'Blessed Healer', description: 'When healing others, you also heal yourself (2 + spell level).' }],
            17: [{ name: 'Supreme Healing', description: 'You use the maximum possible value for any healing dice.' }]
        } 
    },
    { 
        name: 'Light Domain', 
        description: 'Focused on vision, truth, and purifying fire.', 
        features: { 
            3: [
                { name: 'Radiance of the Dawn', description: 'Channel Divinity: Create a flash in a 30-foot area dealing 2d10 + cleric level Radiant damage (DC CON).' },
                { name: 'Warding Flare', description: 'Reaction: Impose Disadvantage on an attacker you can see within 30 feet (uses equal to WIS mod).' }
            ],
            6: [{ name: 'Improved Warding Flare', description: 'Recover uses of Warding Flare with a short rest. When using it, grant THP (2d6 + WIS mod) to the attacked target.' }],
            17: [{ name: 'Corona of Light', description: 'As a magic action, emit a sunlight aura (1 min): Enemies have Disadvantage on saves vs light/fire.' }]
        } 
    },
    { 
        name: 'Trickery Domain', 
        description: 'Gods of mischief, change, and illusion.', 
        features: { 
            3: [
                { name: 'Blessing of the Trickster', description: 'Magic action: Give Stealth Advantage to a creature (not you) until your next long rest.' },
                { name: 'Invoke Duplicity', description: 'Bonus Action: Create an illusion of yourself at 30 feet. You gain Advantage on attacks against enemies near the illusion.' }
            ],
            6: [{ name: 'Trickster\'s Transposition', description: 'When creating or moving your duplicate, you can teleport by swapping places with it.' }],
            17: [{ name: 'Improved Duplicity', description: 'Your duplicate gives Advantage to nearby allies. When it disappears, it heals you HP equal to your level.' }]
        } 
    },
    { 
        name: 'War Domain', 
        description: 'Excellence in combat and inspiration of courage in battle.', 
        features: { 
            3: [
                { name: 'Guided Strike', description: 'Reaction: When an attack (yours or an ally\'s) misses, add +10 to the roll using Channel Divinity.' },
                { name: 'War Priest', description: 'Bonus Action: Make an extra attack (uses equal to WIS mod, recover on long rest).' }
            ],
            6: [{ name: 'War God\'s Blessing', description: 'You can spend Channel Divinity to cast Shield of Faith or Spiritual Weapon without spending a slot or requiring concentration (lasts 1 min).' }],
            17: [{ name: 'Avatar of Battle', description: 'You gain Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, STR: 13, INT: 12, DEX: 10, CHA: 8 }
};
