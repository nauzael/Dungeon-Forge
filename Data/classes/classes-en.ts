
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const barbarianEn = {
  details: { 
    name: 'Barbarian', 
    description: 'Powerful warriors driven by primal forces that manifest as Rage. More than mere emotion, this Rage is the embodiment of a predator\'s ferocity and the storm.', 
    traits: [
        { name: 'Rage', description: 'As a Bonus Action, you enter a Rage if you aren\'t wearing Heavy Armor. You gain resistance to Bludgeoning, Piercing, and Slashing damage, extra damage on Strength melee attacks, and advantage on Strength checks and saving throws.' }, 
        { name: 'Unarmored Defense', description: 'Without armor, your AC is 10 + DEX + CON. You can use a Shield.' }, 
        { name: 'Weapon Mastery', description: 'You master the Mastery properties of two melee weapon types.' }
    ] 
  } as DetailData,
  hitDie: 12,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] as Skill[] },
  progression: { 
    1: ['Rage', 'Unarmored Defense', 'Weapon Mastery'], 
    2: ['Danger Sense', 'Reckless Attack'], 
    3: ['Barbarian Subclass', 'Primal Knowledge'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Fast Movement'], 
    7: ['Feral Instinct', 'Instinctive Pounce'],
    8: ['Ability Score Improvement'], 
    9: ['Brutal Strike'], 
    11: ['Relentless Rage'], 
    12: ['Ability Score Improvement'], 
    13: ['Improved Brutal Strike'], 
    15: ['Persistent Rage'], 
    16: ['Ability Score Improvement'], 
    17: ['Improved Brutal Strike (2nd Effect)'],
    18: ['Indomitable Might'], 
    19: ['Epic Boon Feat'], 
    20: ['Primal Champion'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Path of the Berserker', 
        description: 'Barbarians who channel their fury into pure violence.', 
        features: { 
            3: [{ name: 'Frenzy', description: 'When you make a Reckless Attack while Raged, you deal extra damage equal to your Rage damage dice to the first target hit.' }],
            6: [{ name: 'Mindless Rage', description: 'You are immune to Charmed and Frightened while Raged. If you enter a Rage while affected, the effect is suspended.' }],
            10: [{ name: 'Retaliation', description: 'When you take damage from a creature within 5 feet, use your Reaction to make a melee attack against it.' }],
            14: [{ name: 'Intimidating Presence', description: 'As a Bonus Action, Frighten creatures in a 30-foot area (DC 8+STR+PB). Lasts 1 minute.' }]
        } 
    },
    { 
        name: 'Path of the World Tree', 
        description: 'Believers that their fury connects them to the cosmic ash tree Yggdrasil.', 
        features: { 
            3: [{ name: 'Vitality of the Tree', description: 'You gain THP (d6 = PB) when you enter Rage and can grant THP to allies at the start of each turn.' }],
            6: [{ name: 'Branches of the Tree', description: 'While Raged, you can teleport creatures within 30 feet of you using a Reaction (STR DC).' }],
            10: [{ name: 'Battering Roots', description: 'Your Heavy or Versatile weapons gain +10 feet reach. You can use Shove or Trip in addition to another Mastery.' }],
            14: [{ name: 'Travel along the Tree', description: 'Bonus Action to teleport up to 60 feet and bring up to 5 allies with you.' }]
        } 
    },
    { 
        name: 'Path of the Wild Heart', 
        description: 'Barbarians in communion with the spirits of nature.', 
        features: { 
            3: [
                { name: 'Animal Speaker', description: 'You can cast Beast Sense and Speak with Animals as rituals (uses WIS).' },
                { name: 'Rage of the Wilds', description: 'While Raged choose: Bear (Resistance to almost everything), Eagle (BA Dash/Disengage), or Wolf (Ally Advantage).' }
            ],
            6: [{ name: 'Aspect of the Wilds', description: 'Passive enhancement: Owl (Darkvision 60ft), Panther (Climb Speed), or Salmon (Swim Speed).' }],
            10: [{ name: 'Nature Speaker', description: 'You can cast Commune with Nature as a ritual.' }],
            14: [{ name: 'Power of the Wilds', description: 'Rage enhancement: Falcon (Flight), Lion (Enemy Disadvantage), or Ram (Trip on hit).' }]
        } 
    },
    {
        name: 'Path of the Zealot',
        description: 'Barbarians blessed by a god with divine power.',
        features: {
            3: [
                { name: 'Divine Fury', description: 'While Raged, the first hit each turn deals 1d6 + half level Radiant or Necrotic damage.' },
                { name: 'Warrior of the Gods', description: 'Healing pool (4d12). As a Bonus Action, heal yourself. Recovered on Long Rest.' }
            ],
            6: [
                { name: 'Fanatical Focus', description: 'Once per Rage, reroll a failed saving throw adding your Rage damage as a bonus.' }
            ],
            10: [
                { name: 'Zealous Presence', description: 'Battle cry (10 allies): Advantage on attacks and saves until your next turn.' }
            ],
            14: [
                { name: 'Rage of the Gods', description: 'Divine Form (1 min): Flight, Necrotic/Radiant/Psychic Resistance, and you can save an ally from death.' }
            ]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, INT: 8 }
};

export const bardEn = {
  details: { 
    name: 'Bard', 
    description: 'Masters of music, storytelling, and magical inspiration. Bards use their artistic talents to manipulate emotions and cast spells.', 
    traits: [
        { name: 'Spellcasting', description: 'Magical inspiration based on Charisma. You use an instrument as your spellcasting focus.' }, 
        { name: 'Bardic Inspiration', description: 'As a Bonus Action, you can inspire others. They can add a d6 to an ability check, attack roll, or saving throw.' }, 
        { name: 'Jack of All Trades', description: 'You can add half your Proficiency Bonus to any ability check that doesn\'t already include it.' },
        { name: 'Font of Inspiration', description: 'You recover all expended uses of Bardic Inspiration when you finish a Short or Long Rest.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'DEX', 'WIS'] as Ability[],
  skillData: { count: 3, options: ['Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 'Sleight of Hand', 'Stealth', 'Survival'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Bardic Inspiration', 'Jack of All Trades', 'Font of Inspiration'], 
    2: ['Expertise'], 
    3: ['Bard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Magical Secrets'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    9: ['Magical Secrets'], 
    10: ['Subclass Feature', 'Expertise'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    18: ['Magical Secrets'], 
    19: ['Epic Boon Feat'], 
    20: ['Superior Bardic Inspiration'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'College of Lore', 
        description: 'Bards who collect and preserve knowledge from all corners of the world.', 
        features: { 
            3: [
                { name: 'Lore Keeper', description: 'Choose three Skills from the Bard spell list. When you use Jack of All Trades, add half your PB to any ability check, not just ones without proficiency.' }
            ],
            6: [{ name: 'Cutting Words', description: 'As a Reaction, you can use Bardic Inspiration to subtract a d6 from a creature\'s attack roll, ability check, or damage roll.' }],
            10: [{ name: 'Peerless Skill', description: 'When you make an ability check, you can spend one use of Bardic Inspiration to add a d10. You can wait until after seeing the roll.' }],
            14: [{ name: 'Masterful Secrets', description: 'Learn two additional Magical Secrets of your choice from any class.' }]
        } 
    },
    { 
        name: 'College of Valor', 
        description: 'Bards who inspire courage and martial prowess in their allies.', 
        features: { 
            3: [
                { name: 'Combat Inspiration', description: 'When a creature uses your Bardic Inspiration to make an attack roll or damage roll, they can add the die to the roll instead of waiting to add it after seeing the result.' }
            ],
            6: [{ name: 'Inspiring Surge', description: 'As a Bonus Action, you can inspire up to six creatures. They can make one weapon attack as a reaction if they can hear you.' }],
            10: [{ name: 'Battle Magic', description: 'You can use a Bonus Action to make a weapon attack after casting a Bard spell.' }],
            14: [{ name: 'Masterful Combatant', description: 'You gain Expertise in two Skills of your choice from the Bard list.' }]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, DEX: 14, INT: 13, CON: 12, WIS: 10, STR: 8 }
};

export const clericEn = {
  details: { 
    name: 'Cleric', 
    description: 'Divine agents wielding the power of their deity. They heal the faithful and destroy the enemies of their gods.', 
    traits: [
        { name: 'Spellcasting', description: 'Divine magic based on Wisdom. You use a Holy Symbol as your spellcasting focus.' }, 
        { name: 'Divine Domain', description: 'Choose a Domain that reflects your deity\'s sphere of influence.' }, 
        { name: 'Channel Divinity', description: 'You can channel divine energy to fuel magical effects. The effect depends on your Domain.' },
        { name: 'Potent Spellcasting', description: 'Add your Wisdom modifier to the damage of your cantrips and the healing of your 1st-level spells.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['WIS', 'STR', 'CON'] as Ability[],
  skillData: { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Divine Domain', 'Channel Divinity'], 
    2: ['Channel Divinity'], 
    3: ['Divine Domain Feature'], 
    4: ['Ability Score Improvement'], 
    5: ['Destroy Undead'], 
    6: ['Divine Domain Feature'], 
    8: ['Ability Score Improvement', 'Destroy Undead'], 
    10: ['Divine Intervention'], 
    12: ['Ability Score Improvement'], 
    14: ['Destroy Undead'], 
    16: ['Ability Score Improvement'], 
    18: ['Divine Intervention Improvement'], 
    19: ['Epic Boon Feat'], 
    20: ['Saint'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Life Domain', 
        description: 'Clerics dedicated to preserving life and healing the wounded.', 
        features: { 
            1: [
                { name: 'Disciple of Life', description: 'Your healing spells are more effective. When you cast a spell of 1st level or higher to restore Hit Points, the target regains additional Hit Points equal to 2 + the spell\'s level.' },
                { name: 'Preserve Life', description: 'As an Action, you can restore Hit Points to up to six creatures. You restore a total of 5 × your Cleric level.' }
            ],
            3: [
                { name: 'Blessed Healer', description: 'When you cast a spell to restore Hit Points to another creature, you also restore 2 + your Cleric level to yourself.' }
            ],
            6: [
                { name: 'Divine Strike', description: 'Once on each of your turns when you hit a creature with a weapon attack, you can deal extra Radiant damage equal to 1d8 + your Wisdom modifier.' }
            ],
            8: [
                { name: 'Supreme Healing', description: 'When you would roll dice to restore Hit Points with a spell, you use the maximum number instead of rolling.' }
            ]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CHA: 14, STR: 13, CON: 12, INT: 10, DEX: 8 }
};

export const druidEn = {
  details: { 
    name: 'Druid', 
    description: 'Guardians of the natural world with the power to shapeshift and command the forces of nature.', 
    traits: [
        { name: 'Spellcasting', description: 'Nature magic based on Wisdom. You use a Druidic Focus (Sprig of Mistletoe or Wooden Staff).' }, 
        { name: 'Wild Shape', description: 'As a Bonus Action, you can assume the form of a Beast that you have seen before. You can use this twice per Long Rest.' }, 
        { name: 'Druidic', description: 'You know the Druidic language and can use it to hide messages.' },
        { name: 'Primeval Awareness', description: 'You can use your Bonus Action to sense if Aberrations, Celestials, Dragons, Elementals, Fey, Fiends, or Undead are within 1 mile.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['WIS', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Wild Shape', 'Druidic', 'Primeval Awareness'], 
    2: ['Wild Shape Improvement'], 
    3: ['Druid Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Wild Shape Improvement'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    18: ['Timeless Body', 'Beast Spells'], 
    19: ['Epic Boon Feat'], 
    20: ['Archdruid'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Circle of the Land', 
        description: 'Druids who maintain a sacred bond with a particular type of terrain.', 
        features: { 
            2: [
                { name: 'Land\'s Stride', description: 'You can move through nonmagical Difficult Terrain as if it were normal terrain. You have advantage on saving throws against plants that impede movement.' }
            ],
            3: [
                { name: 'Natural Recovery', description: 'When you finish a Short Rest, you can choose expended spell slots to recover. The total level can\'t exceed half your Druid level (rounded up), and none can be 6th level or higher.' }
            ],
            6: [
                { name: 'Land\'s Shield', description: 'You are never surprised, and you have advantage on saving throws against illusions.' }
            ],
            10: [
                { name: 'Nature\'s Ward', description: 'You are immune to being Charmed and Frightened by elementals and fey, and you are immune to Poison and disease.' }
            ],
            14: [
                { name: 'Nature\'s Sanctuary', description: 'When a creature attacks you, it must make a Wisdom saving throw. On a failure, it must choose another target or have its attack fail.' }
            ]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, INT: 13, DEX: 12, STR: 10, CHA: 8 }
};

export const fighterEn = {
  details: { 
    name: 'Fighter', 
    description: 'Masters of all weapons, fighters are the ultimate combat specialists. They train relentlessly to perfect their martial skills.', 
    traits: [
        { name: 'Fighting Style', description: 'Choose a Fighting Style: Archery, Blind Fighting, Defense, Dueling, Great Weapon Fighting, Interception, Protection, Superior Technique,Thrown Weapon Fighting, or Two-Weapon Fighting.' }, 
        { name: 'Second Wind', description: 'As a Bonus Action, you can regain Hit Points equal to 1d10 + your Fighter level. Once per Rest.' }, 
        { name: 'Weapon Mastery', description: 'You master the Mastery properties of four weapon types.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] as Skill[] },
  progression: { 
    1: ['Fighting Style', 'Second Wind', 'Weapon Mastery'], 
    2: ['Action Surge'], 
    3: ['Fighter Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack'], 
    6: ['Fighting Style'], 
    8: ['Ability Score Improvement'], 
    9: ['Indomitable'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Action Surge'], 
    16: ['Ability Score Improvement'], 
    18: ['Indomitable'], 
    19: ['Epic Boon Feat'], 
    20: ['Champion'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Champion', 
        description: 'Fighters who focus on physical perfection and battlefield prowess.', 
        features: { 
            3: [
                { name: 'Improved Critical', description: 'Your weapon attacks score a Critical Hit on a roll of 19 or 20.' }
            ],
            7: [
                { name: 'Remarkable Athlete', description: 'You can add half your PB to any Strength, Dexterity, or Constitution check that doesn\'t already include your PB. When you jump, you can make a running Long Jump or High Jump equal to your Strength score.' }
            ],
            10: [
                { name: 'Additional Fighting Style', description: 'Choose a second Fighting Style.' }
            ],
            15: [
                { name: 'Superior Critical', description: 'Your weapon attacks score a Critical Hit on a roll of 18-20.' }
            ],
            18: [
                { name: 'Survivor', description: 'At the start of your turn, if you are below half your HP, you regain HP equal to 5 + your Constitution modifier.' }
            ]
        } 
    },
    { 
        name: 'Battle Master', 
        description: 'Fighters who learn tactical maneuvers to gain superiority on the battlefield.', 
        features: { 
            3: [
                { name: 'Combat Superiority', description: 'You gain four Maneuvers and three Superiority Dice (d8). Maneuvers include: Disarm, Distract, Feint, Goad, Lunging Attack, Maneuvering Attack, Menacing Attack, Parry, Precision Attack, Pushing Attack, Rally, Riposte, Sweeping Attack, Trip.' },
                { name: 'Student of War', description: 'You gain proficiency with one type of Artisan\'s Tools.' }
            ],
            7: [
                { name: 'Know Your Enemy', description: 'If you spend at least 1 minute observing or interacting with a creature, you learn whether it has any Immunities, Resistances, or Vulnerabilities, and what its current HP is.' }
            ],
            10: [
                { name: 'Improved Combat Superiority', description: 'Your Superiority Dice become d10.' }
            ],
            15: [
                { name: 'Relentless', description: 'When you start your turn with no Superiority Dice, you regain one.' }
            ]
        } 
    },
    { 
        name: 'Eldritch Knight', 
        description: 'Fighters who combine martial prowess with arcane magic.', 
        features: { 
            3: [
                { name: 'Spellcasting', description: 'You can cast Wizard spells. You have a spellbook with four 1st-level spells.' },
                { name: 'Weapon Bond', description: 'You can bond with up to two weapons. As a Bonus Action, you can summon one to your hand.' }
            ],
            7: [
                { name: 'War Magic', description: 'When you take the Attack action on your turn, you can cast a cantrip as part of that action.' }
            ],
            10: [
                { name: 'Eldritch Strike', description: 'When you hit a creature with a weapon attack, it has disadvantage on the next saving throw against a spell you cast before the end of your next turn.' }
            ],
            15: [
                { name: 'Arcane Charge', description: 'When you use Action Surge, you can make a melee weapon attack at the end of the action.' }
            ]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 3,
  suggestedArray: { STR: 15, DEX: 14, CON: 13, CHA: 12, WIS: 10, INT: 8 }
};

export const monkEn = {
  details: { 
    name: 'Monk', 
    description: 'Masters of martial arts and ki energy. Monks combine hand-to-hand combat with mystical abilities.', 
    traits: [
        { name: 'Martial Arts', description: 'Your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons. You can use DEX instead of STR for attacks and damage.' }, 
        { name: 'Ki', description: 'You can spend Ki points to fuel special abilities. You have a pool of Ki equal to your Monk level.' }, 
        { name: 'Unarmored Defense', description: 'While not wearing armor or using a Shield, your AC is 10 + DEX + WIS.' },
        { name: 'Deflect Missiles', description: 'As a Reaction, you can deflect or catch a missile. If you do, the damage is reduced by 1d10 + DEX + Monk level. You can spend 1 Ki to make a ranged attack with the missile.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] as Skill[] },
  progression: { 
    1: ['Martial Arts', 'Unarmored Defense', 'Deflect Missiles'], 
    2: ['Ki', 'Flurry of Blows', 'Patient Defense', 'Step of the Wind'], 
    3: ['Monk Subclass', 'Slow Fall'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack', 'Stunning Strike'], 
    6: ['Ki-Empowered Strikes'], 
    7: ['Evasion', 'Stillness of Mind'], 
    8: ['Ability Score Improvement'], 
    9: ['Unarmored Movement'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Diamond Soul', 'Purity of Body'], 
    16: ['Ability Score Improvement'], 
    18: ['Tongue of the Sun and Moon', 'Empty Body'], 
    19: ['Epic Boon Feat'], 
    20: ['Perfect Self'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Way of the Open Hand', 
        description: 'Monks who master the art of manipulating life energy to affect others.', 
        features: { 
            3: [
                { name: 'Open Hand Technique', description: 'When you hit a creature with a Flurry of Blows attack, you can cause one of: knock Prone, push 15 feet away, or prevent Reactions until its next turn.' }
            ],
            6: [
                { name: 'Wholeness of Body', description: 'As an Action, you regain HP equal to three times your Monk level. You can use this a number of times equal to your Wisdom modifier (minimum once).' }
            ],
            11: [
                { name: 'Tranquility', description: 'At the end of a Long Rest, you gain the effects of a Sanctuary spell (DC 8 + WIS + PB) that lasts until your next Long Rest.' }
            ],
            17: [
                { name: 'Quivering Palm', description: 'As a Bonus Action, choose a creature you can see and make a melee weapon attack. On hit, the creature must make a CON save (DC 8 + DEX + PB) or take 10d10 Necrotic damage and be stunned for 1 minute.' }
            ]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, CHA: 10, INT: 8 }
};

export const paladinEn = {
  details: { 
    name: 'Paladin', 
    description: 'Holy warriors bound by sacred oaths to uphold justice and righteousness. They combine martial prowess with divine magic.', 
    traits: [
        { name: 'Divine Sense', description: 'As an Action, you can sense the presence of Celestial, Fiend, or Undead within 60 feet. You know their location and type.' }, 
        { name: 'Lay on Hands', description: 'Your blessed touch can heal wounds. You have a pool of HP equal to 5 × your Paladin level. As an Action, you can restore HP to a creature by touching it.' }, 
        { name: 'Fighting Style', description: 'Choose a Fighting Style: Blessed Warrior, Blind Fighting, Defense, Dueling, Great Weapon Fighting, Interception, or Protection.' },
        { name: 'Divine Smite', description: 'When you hit with a melee weapon attack, you can expend one spell slot to deal extra Radiant damage. The damage increases with the spell slot level.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['STR', 'CHA', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Divine Sense', 'Lay on Hands', 'Fighting Style', 'Divine Smite'], 
    2: ['Spellcasting', 'Divine Health'], 
    3: ['Paladin Subclass', 'Channel Divinity'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack'], 
    6: ['Aura of Protection'], 
    8: ['Ability Score Improvement'], 
    10: ['Aura of Courage'], 
    12: ['Ability Score Improvement'], 
    14: ['Cleansing Touch'], 
    16: ['Ability Score Improvement'], 
    18: ['Aura Improvements'], 
    19: ['Epic Boon Feat'], 
    20: ['Aura of Sanctity'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Oath of Devotion', 
        description: 'Paladins who embody the ideals of honesty, honor, and justice.', 
        features: {            3: [
                { name: 'Sacred Weapon', description: 'Channel Divinity: As a Magic action, imbue one weapon with positive energy (10 min). Add your CHA modifier to attack rolls and it emits bright light.' },
                { name: 'Oath of Devotion Spells', description: 'Always prepared spells like Protection from Evil and Good, Shield of Faith and Aid.' }
            ],
            7: [{ name: 'Aura of Devotion', description: 'You and friendly creatures in your Aura of Protection can\'t be Charmed while you are conscious.' }],
            15: [{ name: 'Smite of Protection', description: 'Your Divine Smite radiates protective energy: you and allies have Half Cover in your Aura until your next turn.' }],
            20: [{ name: 'Holy Nimbus', description: 'Bonus Action (10 min): You emit sunlight, have advantage on saves against Fiends/Undead, and enemies starting near you take Radiant damage.' }]
        } 
    },
    {
        name: 'Oath of Glory',
        description: 'Paladins who believe they are destined to achieve glory through deeds of heroism.',
        features: {
            3: [
                { name: 'Inspiring Smite', description: 'Channel Divinity: After using Divine Smite, deal THP (2d8 + Paladin Level) divided among creatures within 30 feet.' },
                { name: 'Peerless Athlete', description: 'Channel Divinity: As a Bonus Action (1 hour), gain advantage on Athletics/Acrobatics and jump distance increases by 10 feet.' },
                { name: 'Oath of Glory Spells', description: 'Spells like Guiding Bolt, Heroism and Haste.' }
            ],
            7: [{ name: 'Aura of Alacrity', description: 'Your speed increases by 10 feet. Allies entering or starting their turn in your Aura gain +10 speed until the end of their turn.' }],
            15: [{ name: 'Glorious Defense', description: 'Reaction: When hit, add your CHA modifier to the target\'s AC. If it misses, you can make an attack against the attacker.' }],
            20: [{ name: 'Living Legend', description: 'Bonus Action (1 min): Advantage on Charisma checks and once per turn turn a failed save into a success via Reaction.' }]
        }
    },
    {
        name: 'Oath of the Ancients',
        description: 'Paladins who vow to preserve the light into the world, delighting in art, laughter, and nature.',
        features: {
            3: [
                { name: 'Nature\'s Wrath', description: 'Channel Divinity: As a Magic Action, invoke spectral vines to restrain a creature within 15 feet (STR DC).' },
                { name: 'Oath of the Ancients Spells', description: 'Spells like Ensnaring Strike, Speak with Animals and Plant Growth.' }
            ],
            7: [{ name: 'Aura of Warding', description: 'You and allies in your Aura of Protection have resistance to Necrotic, Psychic, and Radiant damage.' }],
            15: [{ name: 'Undying Sentinel', description: 'When reduced to 0 HP, stand at 1 HP instead (1/Long Rest). Stop aging visually.' }],
            20: [{ name: 'Elder Champion', description: 'Bonus Action (1 min): Regenerate 10 HP per turn, paladin spells cast as Bonus Action, and enemies have disadvantage on saves.' }]
        }
    },
    {
        name: 'Oath of Vengeance',
        description: 'A solemn commitment to punish those who have committed grievous evil acts.',
        features: {
            3: [
                { name: 'Vow of Enmity', description: 'Channel Divinity: As an Attack Action, choose an enemy within 30 feet to have Advantage on attacks against it for 1 minute.' },
                { name: 'Oath of Vengeance Spells', description: 'Spells like Bane, Hunter\'s Mark and Hold Person.' }
            ],
            7: [{ name: 'Relentless Avenger', description: 'When hit with an opportunity attack, the enemy speed becomes 0 and you can move half your speed.' }],
            15: [{ name: 'Soul of Vengeance', description: 'When your Vow of Enmity target makes an attack, use your Reaction to make a melee attack against it.' }],
            20: [{ name: 'Avenging Angel', description: 'Bonus Action (10 min): Sprout wings (60ft fly) and an aura that can frighten enemies starting their turn nearby.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { STR: 15, CHA: 14, CON: 13, WIS: 12, DEX: 10, INT: 8 }
};

export const rangerEn = {
  details: { 
    name: 'Ranger', 
    description: 'Wilderness warriors who track prey and survive in the wild. They combine lethal combat, tracking, and primal magic to protect the world from monsters and tyrants.', 
    traits: [
        { name: 'Spellcasting', description: 'Primal magic based on Wisdom. You are a prepared spellcaster and start casting at level 1.' }, 
        { name: 'Favored Enemy', description: 'You always have Hunter\'s Mark prepared. You can cast it for free a number of times equal to your Proficiency Bonus per day.' }, 
        { name: 'Weapon Mastery', description: 'You master the Mastery properties of two weapon types.' }
    ] 
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 3, options: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Favored Enemy', 'Weapon Mastery'], 
    2: ['Deft Explorer', 'Fighting Style'], 
    3: ['Ranger Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Extra Attack'], 
    6: ['Roving'], 
    7: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    9: ['Expertise'], 
    10: ['Tireless'], 
    12: ['Ability Score Improvement'], 
    14: ['Nature\'s Veil'], 
    16: ['Ability Score Improvement'], 
    18: ['Feral Senses'], 
    19: ['Epic Boon Feat'], 
    20: ['Foe Slayer'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Beast Master',
        description: 'Explorers who form a mystical bond with a special beast, calling upon primal magic to fight in harmony.',
        features: {
            3: [{ name: 'Primal Companion', description: 'Summon a bestial spirit (Land, Sea, or Sky). In combat, it acts on your turn (Bonus Action to command attack).' }],
            7: [{ name: 'Exceptional Training', description: 'Command your beast to use Dash, Disengage, Dodge or Help as a Bonus Action. Attacks deal Force damage.' }],
            11: [{ name: 'Bestial Fury', description: 'Your beast can attack twice. It deals extra damage (equal to Hunter\'s Mark) if the target is marked by you.' }],
            15: [{ name: 'Share Spells', description: 'When you cast a spell on yourself, it also affects your beast if it is within 30 feet.' }]
        }
    },
    {
        name: 'Fey Wanderer',
        description: 'Explorers who represent the joy and dread of the Feywild, imbuing attacks with otherworldly magic.',
        features: {
            3: [
                { name: 'Dreadful Strike', description: 'Once per turn, when hitting with a weapon, deal 1d4 extra Psychic damage. Scales with level.' },
                { name: 'Otherworldly Glamour', description: 'Add your Wisdom modifier to Charisma checks.' }
            ],
            7: [{ name: 'Beguiling Twist', description: 'When someone near you succeeds on a save against Charm or Fear, redirect the effect to another creature.' }],
            11: [{ name: 'Fey Wilds Summons', description: 'Cast Summon Fey without spending a slot once per day.' }],
            15: [{ name: 'Misty Wanderer', description: 'Cast Misty Step multiple times without slots and take an ally with you.' }]
        }
    },
    {
        name: 'Gloom Stalker',
        description: 'Masters of ambush and darkness, calling upon Shadowfell magic to hunt horrors lurking in shadows.',
        features: {
            3: [
                { name: 'Dread Ambusher', description: '+10ft speed on first turn. Deal 2d6 extra Psychic damage (Wis uses/day). Add Wisdom to Initiative.' },
                { name: 'Umbral Sight', description: 'Darkvision 60ft (or +60ft). Invisible to creatures using Darkvision in total darkness.' },
                { name: 'Gloom Stalker Spells', description: 'Spells like Disguise Self, Rope Trick and Fear.' }
            ],
            7: [{ name: 'Iron Mind', description: 'Gain Proficiency in Wisdom saves (or Int/Cha if already proficient).' }],
            11: [{ name: 'Stalker\'s Flurry', description: 'Dreadful Strike damage increases to 2d8. If you miss an attack after using it, make another attack as part of the same action.' }],
            15: [{ name: 'Shadowy Dodge', description: 'Reaction: Impose Disadvantage on an attacker. If it misses, teleport 30 feet.' }]
        }
    },
    {
        name: 'Hunter',
        description: 'Ultimate hunters, experts at tracking and defeating nature\'s most formidable prey.',
        features: {
            3: [
                { name: 'Hunter\'s Lore', description: 'While an enemy is marked by Hunter\'s Mark, you know its immunities, resistances, and vulnerabilities.' },
                { name: 'Hunter\'s Prey', description: 'Choose a specialty: Colossus Slayer (+1d8 damage to wounded) or Horde Breaker (extra attack to adjacent target).' }
            ],
            7: [{ name: 'Defensive Tactics', description: 'Choose: Escape the Horde (disadvantage to opportunity attacks) or Multiattack Defense (+4 AC after being hit).' }],
            11: [{ name: 'Superior Hunter\'s Prey', description: 'Once per turn, when you damage your Hunter\'s Mark target, deal the extra damage to another creature within 30 feet.' }],
            15: [{ name: 'Superior Hunter\'s Defense', description: 'Reaction: When hit, gain resistance to that damage type until the end of the turn.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, CHA: 10, INT: 8 }
};

export const rogueEn = {
  details: { 
    name: 'Rogue', 
    description: 'Masters of stealth, wit, and precision. Rogues exploit their enemies\' weaknesses to deal lethal blows and are experts in overcoming any obstacle.', 
    traits: [
        { name: 'Sneak Attack', description: 'Once per turn, you deal extra damage (1d6 at level 1, scales) to a creature you hit with Advantage or that has an ally within 5 feet.' }, 
        { name: 'Expertise', description: 'Choose two skill proficiencies to double your Proficiency Bonus.' }, 
        { name: 'Weapon Mastery', description: 'You master the Mastery properties of two weapon types (Finesse or Light).' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['DEX', 'INT'] as Ability[],
  statPriorities: ['DEX', 'INT', 'CON'] as Ability[],
  skillData: { count: 4, options: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] as Skill[] },
  progression: { 
    1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant', 'Weapon Mastery'], 
    2: ['Cunning Action'], 
    3: ['Rogue Subclass', 'Steady Aim'], 
    4: ['Ability Score Improvement'], 
    5: ['Cunning Strike', 'Uncanny Dodge'], 
    6: ['Expertise'], 
    7: ['Evasion', 'Reliable Talent'], 
    8: ['Ability Score Improvement'], 
    9: ['Subclass Feature'], 
    10: ['Ability Score Improvement'], 
    11: ['Improved Cunning Strike'], 
    12: ['Ability Score Improvement'], 
    13: ['Subclass Feature'], 
    14: ['Devious Strikes'], 
    15: ['Slippery Mind'], 
    16: ['Ability Score Improvement'], 
    17: ['Subclass Feature'], 
    18: ['Elusive'], 
    19: ['Epic Boon Feat'], 
    20: ['Stroke of Luck'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Arcane Trickster',
        description: 'Rogues who combine stealth and agility with arcane spells, experts at mischief and survival.',
        features: {
            3: [
                { name: 'Spellcasting', description: 'Intelligence-based spellcasting (using Wizard list). See spell table.' },
                { name: 'Mage Hand Legerdemain', description: 'Your Mage Hand is invisible. Use it to steal, use thieves\' tools, or open locks as a Bonus Action.' }
            ],
            9: [{ name: 'Magical Ambush', description: 'If hidden when casting a spell, the target has disadvantage on the save.' }],
            13: [{ name: 'Versatile Trickster', description: 'Use Mage Hand to distract: as a Bonus Action, choose an enemy within 5 feet of the hand to use Cunning Strike options.' }],
            17: [{ name: 'Spell Thief', description: 'Reaction to being affected by a spell: force caster to save. If they fail, "steal" the spell for 8 hours.' }]
        }
    },
    {
        name: 'Assassin',
        description: 'Trained killers, spies, and bounty hunters who eliminate targets with terrifying efficiency.',
        features: {
            3: [
                { name: 'Assassinate', description: 'Advantage on Initiative. In the first round, advantage against creatures that haven\'t acted, and Sneak Attack deals extra damage equal to level.' },
                { name: 'Assassin\'s Tools', description: 'Gain Proficiency with Disguise Kit and Poisoner\'s Kit.' }
            ],
            9: [
                { name: 'Masterful Mimicry', description: 'Mimic speech and writing after studying for 1 hour.' },
                { name: 'Roving Aim', description: 'Your speed is not reduced to 0 when using Steady Aim.' }
            ],
            13: [{ name: 'Envenom Weapons', description: 'When using Poison option of Cunning Strike, deal 2d6 extra poison damage ignoring resistances.' }],
            17: [{ name: 'Death Strike', description: 'In the first round, on Sneak Attack hit, target must save CON or take double damage.' }]
        }
    },
    {
        name: 'Thief',
        description: 'The archetype of the adventurer: a blend of burglar, treasure hunter, and ruin explorer.',
        features: {
            3: [
                { name: 'Fast Hands', description: 'As a Bonus Action: Utilize (Object), Use Magic Object, or Sleight of Hand / Thieves\' Tools check.' },
                { name: 'Second-Story Work', description: 'Climb speed equals current speed. Jump using Dexterity instead of Strength.' }
            ],
            9: [{ name: 'Supreme Sneak', description: 'Stealth Attack (Cunning Strike): for 1 damage die, if invisible by Hiding, attack doesn\'t reveal position.' }],
            13: [
                { name: 'Use Magic Device', description: 'Attune up to 4 magic items. On using charges, 6 on 1d6 doesn\'t spend it. Use any spell scroll.' }
            ],
            17: [{ name: 'Thief\'s Reflexes', description: 'Two turns during the first round of combat.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 2,
  suggestedArray: { DEX: 15, CON: 14, INT: 13, WIS: 12, STR: 10, CHA: 8 }
};

export const sorcererEn = {
  details: { 
    name: 'Sorcerer', 
    description: 'Sorcerers possess innate magic sealed within their beings. They don\'t learn magic; raw, churning power is part of them, inherited by lineage or strange events.', 
    traits: [
        { name: 'Spellcasting', description: 'Innate arcane magic based on Charisma. You are a prepared spellcaster.' }, 
        { name: 'Innate Sorcery', description: 'Bonus Action: For 1 min, your spell save DC increases by 1 and you have advantage on spell attack rolls. (2 uses/Long Rest).' }, 
        { name: 'Font of Magic', description: 'Pool of Sorcery Points (equal to level starting at level 2). Use them to create spell slots or fuel Metamagic.' }
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
        description: 'Your innate magic comes from the gift of a dragon, inherited from an ancestor or from absorbing power from a draconic lair.', 
        features: { 
            3: [
                { name: 'Draconic Resilience', description: 'Your HP maximum increases by 3, and by 1 whenever you level up. While unarmored, AC = 10 + DEX + CHA.' },
                { name: 'Draconic Spells', description: 'Always prepared: Alter Self, Chromatic Orb, Command, Dragon\'s Breath. More at 5, 7, 9.' }
            ],
            6: [{ name: 'Elemental Affinity', description: 'Choose a damage type (Acid, Cold, Fire, Lightning, Poison). Gain Resistance and add CHA modifier to one damage roll.' }],
            14: [{ name: 'Dragon Wings', description: 'Bonus Action: Summon draconic wings (1h). 60ft fly speed. Spend 3 SP to reuse.' }],
            18: [{ name: 'Dragon Companion', description: 'Cast Summon Dragon without materials once for free. No concentration (1 min).' }]
        } 
    },
    {
        name: 'Wild Magic Sorcery',
        description: 'Your magic erupts from chaotic forces underlying creation, waiting for any outlet.',
        features: {
            3: [
                { name: 'Wild Magic Surge', description: '1/turn after casting a spell with a slot, roll 1d20. On a 20, roll on Wild Magic Surge table.' },
                { name: 'Tides of Chaos', description: 'Advantage on one d20 roll. Regain after Long Rest or a Surge.' }
            ],
            6: [{ name: 'Bend Luck', description: 'Reaction (1 point): Roll 1d4 and add/subtract from another\'s d20 roll.' }],
            14: [{ name: 'Controlled Chaos', description: 'Roll twice on Wild Magic Surge table and choose result.' }],
            18: [{ name: 'Tamed Surge', description: 'Choose any effect on table except the last. (1/1d4 Long Rests).' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, DEX: 14, CON: 13, WIS: 12, INT: 10, STR: 8 }
};

export const warlockEn = {
  details: { 
    name: 'Warlock', 
    description: 'Seekers of hidden knowledge who forge pacts with powerful entities. Warlocks combine short-range magic with mystical invocations that alter their reality.', 
    traits: [
        { name: 'Eldritch Invocations', description: 'Fragments of forbidden knowledge that grant you permanent magical abilities. You gain one at level 1 (like Pact of the Tome).' }, 
        { name: 'Pact Magic', description: 'Unique Charisma-based magic. Your spell slots are always of the maximum level you can cast and recover on a Short Rest.' }, 
        { name: 'Magical Cunning', description: 'Action (1 min): You recover half of your Pact Magic slots (rounded up). 1/Long Rest.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['CHA', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Eldritch Invocations', 'Pact Magic'], 
    2: ['Magical Cunning'], 
    3: ['Warlock Subclass'], 
    4: ['Ability Score Improvement'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    9: ['Contact Patron'], 
    10: ['Subclass Feature'], 
    11: ['Mystic Arcanum (Level 6)'], 
    12: ['Ability Score Improvement'], 
    13: ['Mystic Arcanum (Level 7)'], 
    14: ['Subclass Feature'], 
    15: ['Mystic Arcanum (Level 8)'], 
    16: ['Ability Score Improvement'], 
    17: ['Mystic Arcanum (Level 9)'], 
    19: ['Epic Boon Feat'], 
    20: ['Eldritch Master'] 
  } as Record<number, string[]>,
  subclasses: [
    {
        name: 'Archfey Patron',
        description: 'Pact with a noble of the Fey Court, masters of illusion and playful teleportation.',
        features: {
            3: [
                { name: 'Archfey Spells', description: 'Always prepared: Misty Step, Faerie Fire, Sleep, Calm Emotions. More at 5, 7, 9.' },
                { name: 'Steps of the Fey', description: 'Cast Misty Step for free (CHA mod uses). Choose: Refreshing Step (THP) or Taunting Step (Disadvantage for enemies).' }
            ],
            6: [{ name: 'Misty Escape', description: 'Reaction to damage: Become Invisible and teleport 30 feet. Gain Steps of the Fey benefits.' }],
            10: [{ name: 'Beguiling Defenses', description: 'Immunity to Charm. Reaction: Half damage and attacker saves WIS or takes Psychic damage.' }],
            14: [{ name: 'Bewitching Magic', description: 'When casting Illusion/Enchantment spell, cast Misty Step as part of the action without spending a slot.' }]
        }
    },
    {
        name: 'Celestial Patron',
        description: 'Your patron is a being of the upper planes, an entity of purifying light and eternal hope.',
        features: {
            3: [
                { name: 'Celestial Spells', description: 'Spells like Cure Wounds, Guiding Bolt, Lesser Restoration and Daylight.' },
                { name: 'Healing Light', description: 'Pool of d6s (1 + Warlock Level). Bonus Action: Spend dice (max CHA mod) to heal a creature within 60 feet.' }
            ],
            6: [{ name: 'Radiant Soul', description: 'Resistance to Radiant damage. Add CHA to damage of a Radiant or Fire spell.' }],
            10: [{ name: 'Celestial Resilience', description: 'After rest or Magical Cunning, you and 5 allies gain THP (Level + CHA mod).' }],
            14: [{ name: 'Searing Vengeance', description: 'Reaction on death save: Stand with half HP, deal Radiant damage (2d8+CHA) and blind nearby enemies.' }]
        }
    },
    {
        name: 'Fiend Patron',
        description: 'You have forged a pact with a demon or devil, granting you destructive power and infernal resilience.',
        features: {
            3: [
                { name: 'Fiend Spells', description: 'Spells like Burning Hands, Command, Scorching Ray and Fireball.' },
                { name: 'Dark One\'s Blessing', description: 'When reducing an enemy to 0 HP, gain THP equal to Warlock Level + CHA mod.' }
            ],
            6: [{ name: 'Dark One\'s Own Luck', description: 'Add 1d10 to an ability check or save. 1/Long Rest or spend Pact slot.' }],
            10: [{ name: 'Fiendish Resilience', description: 'Choose a damage type (except Force) to gain resistance until next rest.' }],
            14: [{ name: 'Hurl Through Hell', description: 'On hit: Send target to lower planes until end of your turn. They take 8d10 Psychic damage.' }]
        }
    },
    {
        name: 'Great Old One Patron',
        description: 'Your patron is an unfathomable entity from the far realms, whose mere presence alters sanity.',
        features: {
            3: [
                { name: 'Great Old One Spells', description: 'Spells like Dissonant Whispers, Tasha\'s Hideous Laughter and Detect Thoughts.' },
                { name: 'Awakened Mind', description: 'Telepathy 30ft with a creature. Mental speech at miles distance if link exists.' },
                { name: 'Psychic Spells', description: 'Change warlock spell damage to Psychic. Illusion/Enchantment spells don\'t require Verbal/Somatic components.' }
            ],
            6: [{ name: 'Clairvoyant Combatant', description: 'Using Awakened Mind, force WIS save: Target has Disadvantage on attacks against you, and you have Advantage against it.' }],
            10: [
                { name: 'Eldritch Hex', description: 'When casting Hex, target has Disadvantage on saves of the chosen attribute.' },
                { name: 'Thought Shield', description: 'Resistance to Psychic damage and reflect received psychic damage to attacker.' }
            ],
            14: [{ name: 'Create Thrall', description: 'Always have Summon Aberration prepared. Cast without components or concentration for 1 minute with extra THP.' }]
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};

export const wizardEn = {
  details: { 
    name: 'Wizard', 
    description: 'Mages defined by their exhaustive study of the intricacies of magic. They cast explosive fire spells, arcane rays, subtle deception, and spectacular transformations.', 
    traits: [
        { name: 'Spellcasting', description: 'Arcane magic based on Intelligence. You use a Spellbook and are a Prepared Spellcaster.' }, 
        { name: 'Ritual Adept', description: 'You can cast any spell as a Ritual if it has the Ritual tag and is in your spellbook. You don\'t need to have it prepared.' }, 
        { name: 'Arcane Recovery', description: 'You can recover part of your magical energy by studying your spellbook during a Short Rest. (1/Long Rest).' }
    ] 
  } as DetailData,
  hitDie: 6,
  savingThrows: ['INT', 'WIS'] as Ability[],
  statPriorities: ['INT', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Ritual Adept', 'Arcane Recovery'], 
    2: ['Scholar'], 
    3: ['Wizard Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Memorize Spell'], 
    6: ['Subclass Feature'], 
    8: ['Ability Score Improvement'], 
    10: ['Subclass Feature'], 
    12: ['Ability Score Improvement'], 
    14: ['Subclass Feature'], 
    16: ['Ability Score Improvement'], 
    18: ['Spell Mastery'], 
    19: ['Epic Boon Feat'], 
    20: ['Signature Spells'] 
  } as Record<number, string[]>,
  subclasses: [
      { 
        name: 'Abjurer', 
        description: 'Specialists in magic that blocks, banishes, or protects.', 
        features: { 
            3: [
                { name: 'Abjuration Savant', description: 'Choose two Abjuration spells of 2nd level or lower and add them to your spellbook for free. Additionally, whenever you gain access to a new spell level, add another Abjuration spell for free.' },
                { name: 'Arcane Ward', description: 'When you cast an Abjuration spell with a spell slot, you create a magical shield. Max HP = (2 × Wizard Level) + INT modifier. It absorbs damage before you do. It regains HP when you cast Abjuration spells.' }
            ],
            6: [{ name: 'Projected Ward', description: 'Reaction: When a creature within 30 feet takes damage, your Arcane Ward absorbs that damage instead.' }],
            10: [
                { name: 'Spell Breaker', description: 'You always have Counterspell and Dispel Magic prepared. You can cast Dispel Magic as a Bonus Action and add your Proficiency to the check. If you fail to stop a spell, you don\'t waste the slot.' }
            ],
            14: [{ name: 'Spell Resistance', description: 'You have Advantage on saving throws against spells and resistance to spell damage.' }]
        } 
      },
      { 
        name: 'Diviner', 
        description: 'Seekers of a clearer understanding of the past, present, and future.', 
        features: { 
            3: [
                { name: 'Divination Savant', description: 'Choose two Divination spells of 2nd level or lower for your spellbook. Gain one extra whenever you unlock new spell slot levels.' },
                { name: 'Portent', description: 'When you finish a Long Rest, roll two d20 and record the results. You can substitute any d20 roll you see with one of these results (1/turn).' }
            ],
            6: [{ name: 'Expert Divination', description: 'When you cast a Divination spell of level 2+, you recover one spell slot of lower level (max level 5).' }],
            10: [{ name: 'The Third Eye', description: 'Bonus Action: Choose a benefit until your next rest (Darkvision 120ft, Read all languages, or see Invisible without spending a slot).' }],
            14: [{ name: 'Greater Portent', description: 'You roll three d20 for your Portent feature instead of two.' }]
        } 
      },
      { 
        name: 'Evoker', 
        description: 'Masters of pure destructive energy.', 
        features: { 
            3: [
                { name: 'Evocation Savant', description: 'Choose two Evocation spells of 2nd level or lower for your spellbook. Gain one extra when leveling up spell slots.' },
                { name: 'Potent Cantrip', description: 'Your damaging cantrips affect even those who avoid the hit. If they fail the save or the attack misses, they take half the cantrip\'s damage.' }
            ],
            6: [{ name: 'Sculpt Spells', description: 'Create safe pockets in your area evocations. Choose (1 + Spell Level) creatures; they automatically save and take no damage.' }],
            10: [{ name: 'Empowered Evocation', description: 'Add your Intelligence modifier to one damage roll of your Evocation spells.' }],
            14: [{ name: 'Overchannel', description: 'Increase the power of your spells of levels 1-5 to deal maximum damage. The first use is safe; subsequent uses deal Necrotic damage (2d12 per spell slot level).' }]
        } 
      },
      { 
        name: 'Illusionist', 
        description: 'Specialists in deceiving the senses and mind.', 
        features: { 
            3: [
                { name: 'Illusion Savant', description: 'Choose two Illusion spells of 2nd level or lower for your spellbook. Gain one extra when leveling up spell slots.' },
                { name: 'Improved Illusions', description: 'You cast Illusions without Verbal components. If the spell has 10ft+ range, increase range by 60ft. You learn Minor Illusion and can create sound and image simultaneously as a Bonus Action.' }
            ],
            6: [{ name: 'Phantasmal Creatures', description: 'You always have Summon Beast and Summon Fey prepared. When you cast them, you can change their school to Illusion and cast them without spending a slot (with half HP).' }],
            10: [{ name: 'Illusory Self', description: 'Reaction: Interpose a duplicate before an attack, causing it to automatically miss. 1/Short or Long Rest (or spend slot level 2+).' }],
            14: [{ name: 'Illusory Reality', description: 'Bonus Action: Choose an inanimate object from one of your Illusions and make it real for 1 minute (can\'t deal damage).' }]
        } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { INT: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, STR: 8 }
};
