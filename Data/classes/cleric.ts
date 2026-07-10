
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const cleric = {
  details: { 
    name: 'Cleric', 
    description: 'Clerics draw power from the realms of the gods and use it to work miracles. They are conduits of divine magic from the Outer Planes.', 
    traits: [
        { name: 'Spellcasting', description: 'You have learned to cast spells through prayer and meditation. You know 3 cantrips (more at levels 4 and 10). You prepare your list of level 1+ spells from the Cleric spell list. You change your list when you finish a Long Rest. Wisdom is your spellcasting ability. You use a Holy Symbol as a Spellcasting Focus.' }, 
        { name: 'Divine Order', description: 'You have dedicated yourself to one of these sacred roles: Protector (proficiency with Martial weapons and Heavy Armor) or Thaumaturge (1 extra Cleric cantrip and bonus to Wisdom on Arcana/Religion checks).' }, 
        { name: 'Channel Divinity', description: 'You can channel divine energy directly from the Outer Planes. You have two effects: Divine Spark (heals 1d8+Wis damage or deals Necrotic/Radiant damage) and Turn Undead (Undead within 30 feet flee Frightened and Incapacitated for 1 min). You have 2 uses; you regain 1 on a Short Rest, all on a Long Rest. You gain additional uses at levels 6 and 18.' }
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
     9: ['—'],
     10: ['Divine Intervention'],
     11: ['—'],
     12: ['Ability Score Improvement'],
     13: ['—'],
     14: ['Improved Blessed Strikes'],
     15: ['—'],
     16: ['Ability Score Improvement'],
     17: ['Subclass Feature'],
     18: ['—'],
     19: ['Epic Boon Feat'], 
    20: ['Greater Divine Intervention'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Life Domain', 
        description: 'Soothe the Hurts of the World. The Life Domain focuses on the positive energy that helps sustain all life in the multiverse. Clerics who tap into this domain are masters of healing, using that life force to cure many hurts.', 
        features: { 
            3: [
                { name: 'Disciple of Life', description: 'When you cast a spell using a spell slot that restores HP, the creature regains additional HP equal to 2 + the spell\'s level.' },
                { name: 'Life Domain Spells', description: 'L3: Aid, Bless, Cure Wounds, Lesser Restoration. L5: Mass Healing Word, Revivify. L7: Aura of Life, Death Ward. L9: Greater Restoration, Mass Cure Wounds.' },
                { name: 'Preserve Life', description: 'As a Magic action, you expend a use of Channel Divinity to evoke healing energy that restores 5\u00D7 your Cleric level in HP. Divide those HP among Bloodied creatures within 30 feet. No creature can exceed half its maximum.' }
            ],
            6: [{ name: 'Blessed Healer', description: 'The healing spells you cast on others heal you. After casting a spell with a slot that restored HP to others, you regain 2 + the spell\'s level in HP.' }],
            17: [{ name: 'Supreme Healing', description: 'When you roll dice to restore HP with a spell or Channel Divinity, use the highest possible number on each die instead of rolling.' }]
        },
        alwaysPreparedSpells: {
            3: ['Aid', 'Bless', 'Cure Wounds', 'Lesser Restoration'],
            5: ['Mass Healing Word', 'Revivify'],
            7: ['Aura of Life', 'Death Ward'],
            9: ['Greater Restoration', 'Mass Cure Wounds']
        }
    },
    { 
        name: 'Light Domain', 
        description: 'Bring Light to Banish Darkness. The Light Domain emphasizes the divine power to bring about blazing fire and revelation. Clerics who wield this power are enlightened souls infused with radiance and the power of their deities\' discerning vision.', 
        features: { 
            3: [
                { name: 'Light Domain Spells', description: 'L3: Burning Hands, Faerie Fire, Scorching Ray, See Invisibility. L5: Daylight, Fireball. L7: Arcane Eye, Wall of Fire. L9: Flame Strike, Scrying.' },
                { name: 'Radiance of the Dawn', description: 'As a Magic action, you expend Channel Divinity to emit a flash in a 30-foot Emanation. You dispel any magical Darkness. Each creature you choose must make a Constitution saving throw: 2d10 + Cleric level Radiant damage (half on success).' },
                { name: 'Warding Flare', description: 'When a creature within 30 feet makes an attack roll, you can use your Reaction to impose Disadvantage. Uses = Wisdom modifier. You regain all uses when you finish a Long Rest.' }
            ],
            6: [{ name: 'Improved Warding Flare', description: 'You regain all uses of Warding Flare when you finish a Short or Long Rest. Additionally, when you use it, you grant Temporary HP = 2d6 + Wisdom to the attack\'s target.' }],
            17: [{ name: 'Corona of Light', description: 'As a Magic action, you emit an aura of sunlight for 1 minute. Bright Light in 60 feet, Dim Light +30 feet. Enemies in the Bright Light have Disadvantage on saving throws against your Radiance of the Dawn and Fire or Radiant spells. Uses = Wisdom modifier.' }]
        },
        alwaysPreparedSpells: {
            3: ['Burning Hands', 'Faerie Fire', 'Scorching Ray', 'See Invisibility'],
            5: ['Daylight', 'Fireball'],
            7: ['Arcane Eye', 'Wall of Fire'],
            9: ['Flame Strike', 'Scrying']
        }
    },
    { 
        name: 'Trickery Domain', 
        description: 'Make Mischief and Challenge Authority. The Trickery Domain offers magic of deception, illusion, and stealth. Clerics who wield this magic are a disruptive force in the world, puncturing pride, mocking tyrants, freeing captives, and flouting hollow traditions.', 
        features: { 
            3: [
                { name: 'Blessing of the Trickster', description: 'As a Magic action, you or a willing creature within 30 feet has Advantage on Dexterity (Stealth) checks until you finish a Long Rest or use this again.' },
                { name: 'Trickery Domain Spells', description: 'L3: Charm Person, Disguise Self, Invisibility, Pass without Trace. L5: Hypnotic Pattern, Nondetection. L7: Confusion, Dimension Door. L9: Dominate Person, Modify Memory.' },
                { name: 'Invoke Duplicity', description: 'As a Bonus Action, you expend Channel Divinity to create a perfect visual illusion of yourself in a space within 30 feet for 1 minute. You can cast spells from the illusion\'s space. You have Advantage when attacking creatures within 5 feet of both you and the illusion. You move the illusion 30 feet as a Bonus Action.' }
            ],
            6: [{ name: 'Trickster\'s Transposition', description: 'When you create or move the illusion from Invoke Duplicity, you can teleport by swapping places with it.' }],
            17: [{ name: 'Improved Duplicity', description: 'You and your allies have Advantage against creatures within 5 feet of the illusion. When the illusion ends, you or a creature within 5 feet regains HP = your Cleric level.' }]
        },
        alwaysPreparedSpells: {
            3: ['Charm Person', 'Disguise Self', 'Invisibility', 'Pass without Trace'],
            5: ['Hypnotic Pattern', 'Nondetection'],
            7: ['Confusion', 'Dimension Door'],
            9: ['Dominate Person', 'Modify Memory']
        }
    },
    { 
        name: 'War Domain', 
        description: 'Inspire Valor and Smite Foes. War has many manifestations. Clerics who tap into the magic of the War Domain excel in battle, inspiring others to fight the good fight or offering acts of violence as prayers.', 
        features: { 
            3: [
                { name: 'Guided Strike', description: 'When you or a creature within 30 feet fails with an attack roll, you can expend Channel Divinity to add +10 to the roll.' },
                { name: 'War Domain Spells', description: 'L3: Guiding Bolt, Magic Weapon, Shield of Faith, Spiritual Weapon. L5: Crusader\'s Mantle, Spirit Guardians. L7: Fire Shield, Freedom of Movement. L9: Hold Monster, Steel Wind Strike.' },
                { name: 'War Priest', description: 'As a Bonus Action, you can make a weapon attack or Unarmed Strike. Uses = Wisdom modifier. You regain all uses on a Short or Long Rest.' }
            ],
            6: [{ name: 'War God\'s Blessing', description: 'You can expend Channel Divinity to cast Shield of Faith or Spiritual Weapon without expending a spell slot. The spell doesn\'t require Concentration and lasts 1 minute.' }],
            17: [{ name: 'Avatar of Battle', description: 'You gain Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        },
        alwaysPreparedSpells: {
            3: ['Guiding Bolt', 'Magic Weapon', 'Shield of Faith', 'Spiritual Weapon'],
            5: ["Crusader's Mantle", 'Spirit Guardians'],
            7: ['Fire Shield', 'Freedom of Movement'],
            9: ['Hold Monster', 'Steel Wind Strike']
        }
    },
    { 
        name: 'Knowledge Domain', 
        description: 'Unearth Secrets and Master the Mind. The Knowledge Domain values learning and understanding above all. Clerics who tap into this domain study esoteric lore, collect old tomes, delve into secret places, and examine the processes of the mind. To them, knowledge is more valuable than material wealth, and learning is an act of worship.', 
        features: { 
            3: [
                { name: 'Blessings of Knowledge', description: 'You gain proficiency with one type of Artisan\'s Tools and with two skills from among Arcana, History, Nature, or Religion. You have Expertise in those two skills.' },
                { name: 'Knowledge Domain Spells', description: 'L3: Command, Comprehend Languages, Detect Magic, Detect Thoughts, Identify, Mind Spike. L5: Dispel Magic, Nondetection, Tongues. L7: Arcane Eye, Banishment, Confusion. L9: Legend Lore, Scrying, Synaptic Static.' },
                { name: 'Mind Magic', description: 'As a Magic action, you expend Channel Divinity to cast a Divination spell from the Knowledge Domain Spells that you have prepared, without expending a spell slot or material components.' }
            ],
            6: [{ name: 'Unfettered Mind', description: 'You gain telepathy with a range of 60 feet. When using it, you can simultaneously contact up to your Wisdom modifier of creatures. You gain proficiency in Intelligence saving throws.' }],
            17: [{ name: 'Divine Foreknowledge', description: 'As a Bonus Action, you expand your mind into the future for 1 hour. You have Advantage on d20 Tests. Once per Long Rest, or by expending a level 6+ spell slot.' }]
        },
        alwaysPreparedSpells: {
            3: ['Command', 'Comprehend Languages', 'Detect Magic', 'Detect Thoughts', 'Identify', 'Mind Spike'],
            5: ['Dispel Magic', 'Nondetection', 'Tongues'],
            7: ['Arcane Eye', 'Banishment', 'Confusion'],
            9: ['Legend Lore', 'Scrying', 'Synaptic Static']
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, STR: 13, INT: 12, DEX: 10, CHA: 8 }
};
