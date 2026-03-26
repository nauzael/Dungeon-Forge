import { DetailData } from '../../types';

export const dwarfEn: DetailData = { 
  name: 'Dwarf', 
  description: 'Stout and hardy, dwarves are known for their craftsmanship and resilience. They value tradition and loyalty above all else.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'Superior Darkvision of 120 feet.' }, 
    { name: 'Dwarven Resilience', description: 'Resistance to Poison damage. Advantage on saving throws against the Poisoned condition.' }, 
    { name: 'Dwarven Toughness', description: 'Your hit point maximum increases by 1 for each level you have.' }, 
    { name: 'Stonecunning', description: 'Bonus Action: Gain Tremorsense of 60ft through stone for 10 minutes. (Uses = PB/LR).' }
  ],
  subspecies: []
};

export const elfEn: DetailData = { 
  name: 'Elf', 
  description: 'Magical beings of otherworldly grace. Your ancestors from the Wilds or the Underdark define your magical heritage.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' }, 
    { name: 'Fey Ancestry', description: 'You have advantage on saving throws you make to avoid or end the Charmed condition. Additionally, magic can\'t put you to sleep.' }, 
    { name: 'Keen Senses', description: 'You gain proficiency in one of the following skills of your choice: Insight, Perception, or Survival.' }, 
    { name: 'Trance', description: 'You don\'t need to sleep. Instead, you meditate deeply for 4 hours to get the same benefits a human gets from an 8-hour rest.' }
  ],
  subspecies: [
    { 
      name: 'High Elf', 
      description: 'Bonds with the Wilds and pure arcane magic of the upper planes.', 
      traits: [
        { name: 'High Elf Magic', description: 'You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can swap that cantrip for another from the Wizard spell list.\n\nAt level 3: Detect Magic.\nAt level 5: Misty Step.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. INT, WIS, or CHA is your spellcasting ability.' }
      ] 
    },
    { 
      name: 'Wood Elf', 
      description: 'Swift hunters attuned to the power of primordial forests.', 
      traits: [
        { name: 'Wood Elf Magic', description: 'You know the Druidcraft cantrip.\n\nAt level 3: Longstrider.\nAt level 5: Pass without Trace.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. INT, WIS, or CHA is your spellcasting ability.' },
        { name: 'Fleet of Foot', description: 'Your walking speed increases to 35 feet.' }
      ] 
    },
    { 
      name: 'Drow', 
      description: 'Adapted to the deep darkness of the Underdark, with magic inherited from the shadows.', 
      traits: [
        { name: 'Drow Magic', description: 'You know the Dancing Lights cantrip.\n\nAt level 3: Faerie Fire.\nAt level 5: Darkness.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. INT, WIS, or CHA is your spellcasting ability.' },
        { name: 'Superior Darkvision', description: 'Your darkvision has a range of 120 feet.' }
      ] 
    }
  ]
};

export const halflingEn: DetailData = { 
  name: 'Halfling', 
  description: 'Small and nimble, halflings are known for their luck and stealth. They prefer peaceful lives but are capable of great courage.', 
  size: 'Small', 
  speed: 30, 
  traits: [
    { name: 'Lucky', description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.' }, 
    { name: 'Nimble', description: 'You can move through the space of any creature that is of a size larger than yours.' }, 
    { name: 'Stout', description: 'You have resistance to Poison damage and advantage on saving throws against the Poisoned condition.' }
  ],
  subspecies: []
};

export const humanEn: DetailData = { 
  name: 'Human', 
  description: 'The most versatile species in the multiverse. Adaptable and ambitious, they excel in any path they choose.', 
  size: 'Medium or Small', 
  speed: 30, 
  traits: [
    { name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' }, 
    { name: 'Skillful', description: 'You gain proficiency in one Skill of your choice (Select in Step 4).' }, 
    { name: 'Versatile', description: 'You gain one Origin Feat of your choice (Select in Step 3).' }
  ],
  subspecies: []
};

export const dragonbornEn: DetailData = { 
  name: 'Dragonborn', 
  description: 'Proud heirs of draconic blood. Their breath weapon and resistance reflect their elemental heritage.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Draconic Ancestry', description: 'Choose one type of Dragon from the Draconic Ancestry table. Your damage type is determined by the dragon type.' }, 
    { name: 'Breath Weapon', description: 'As an Action, exhale destructive energy. Each creature in a 15-foot Cone must make a Dexterity saving throw (DC 8 + CON + PB). On failure, take 1d10 damage of your draconic type. This scales with level.' }, 
    { name: 'Damage Resistance', description: 'You have resistance to the damage type associated with your Draconic Ancestry.' }
  ],
  subspecies: [
    { name: 'Black Dragon', description: 'Acid Resistance & 15ft Line Breath.', traits: [] },
    { name: 'Blue Dragon', description: 'Lightning Resistance & 15ft Line Breath.', traits: [] },
    { name: 'Brass Dragon', description: 'Fire Resistance & 15ft Line Breath.', traits: [] },
    { name: 'Bronze Dragon', description: 'Lightning Resistance & 15ft Line Breath.', traits: [] },
    { name: 'Copper Dragon', description: 'Acid Resistance & 15ft Line Breath.', traits: [] },
    { name: 'Gold Dragon', description: 'Fire Resistance & 15ft Cone Breath.', traits: [] },
    { name: 'Green Dragon', description: 'Poison Resistance & 15ft Cone Breath.', traits: [] },
    { name: 'Red Dragon', description: 'Fire Resistance & 15ft Cone Breath.', traits: [] },
    { name: 'Silver Dragon', description: 'Cold Resistance & 15ft Cone Breath.', traits: [] },
    { name: 'White Dragon', description: 'Cold Resistance & 15ft Cone Breath.', traits: [] }
  ]
};

export const gnomeEn: DetailData = { 
  name: 'Gnome', 
  description: 'Small folk with big imaginations. Gnomes are curious and inventive, with natural magical abilities.', 
  size: 'Small', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' }, 
    { name: 'Gnome Cunning', description: 'You have advantage on Intelligence, Wisdom, and Charisma saving throws against magic.' }, 
    { name: 'Natural Illusionist', description: 'You know the Minor Illusion cantrip. Intelligence is your spellcasting ability for it.' },
    { name: 'Speak with Small Beasts', description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.' }
  ],
  subspecies: [
    {
      name: 'Forest Gnome',
      description: 'Gnomes with a knack for illusions and a bond with small forest creatures.',
      traits: [
        { name: 'Forest Magic', description: 'You know the Minor Illusion cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for it.' }
      ]
    },
    {
      name: 'Rock Gnome',
      description: 'Gnomes with a natural curiosity for how things work and a knack for tinkering.',
      traits: [
        { name: 'Rock Gnome Tinker', description: 'You know the Prestidigitation cantrip. Intelligence, Wisdom, or Charisma is your spellcasting ability for it. Also, you can spend 10 minutes to create a Tiny clockwork device (AC 5, 1 HP).' }
      ]
    }
  ]
};

export const halfOrcEn: DetailData = { 
  name: 'Half-Orc', 
  description: 'The union of human and orc creates a warrior of exceptional strength and resilience.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Relentless Endurance', description: 'When you are reduced to 0 HP but not killed outright, you can drop to 1 HP instead. You can\'t use this feature again until you finish a Long Rest.' }, 
    { name: 'Savage Attacks', description: 'When you score a Critical Hit with a Melee Weapon Attack, you can roll one of the weapon\'s damage dice one additional time and add it to the damage.' },
    { name: 'Adrenaline Rush', description: 'As a Bonus Action, you can move up to your Speed toward a hostile creature. You can use this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' }
  ],
  subspecies: []
};

export const tieflingEn: DetailData = { 
  name: 'Tiefling', 
  description: 'Humans with infernal heritage, marked by their horns and crimson skin. They carry a touch of the Lower Planes within them.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' }, 
    { name: 'Hellish Resistance', description: 'You have resistance to Fire damage.' }, 
    { name: 'Infernal Legacy', description: 'You know the Thaumaturgy cantrip. At level 3, you can cast Hellish Rebuke once per Long Rest. At level 5, you can cast Darkness once per Long Rest. CHA is your spellcasting ability for these.' }
  ],
  subspecies: [
    { 
      name: 'Abyssal', 
      description: 'Linked to the infinite chaos and entropy of the Abyss.', 
      traits: [
        { name: 'Abyssal Resilience', description: 'You gain resistance to Poison damage.' },
        { name: 'Abyssal Legacy', description: 'Innate magic from the Abyss:\nLevel 1: Poison Spray.\nLevel 3: Ray of Sickness.\nLevel 5: Hold Person.' }
      ] 
    },
    { 
      name: 'Chthonic', 
      description: 'Linked to the shadowy realms of Hades and the deep underworld.', 
      traits: [
        { name: 'Chthonic Resilience', description: 'You gain resistance to Necrotic damage.' },
        { name: 'Chthonic Legacy', description: 'Innate magic from the shadows:\nLevel 1: Chill Touch.\nLevel 3: False Life.\nLevel 5: Ray of Enfeeblement.' }
      ] 
    },
    { 
      name: 'Infernal', 
      description: 'Linked to the iron hierarchy and eternal fire of the Nine Hells.', 
      traits: [
        { name: 'Infernal Resilience', description: 'You gain resistance to Fire damage.' },
        { name: 'Infernal Legacy', description: 'Innate magic from hell:\nLevel 1: Fire Bolt.\nLevel 3: Hellish Rebuke.\nLevel 5: Darkness.' }
      ] 
    }
  ]
};

export const aasimarEn: DetailData = { 
  name: 'Aasimar', 
  description: 'Beings touched by divine light. Their celestial heritage grants them healing hands and protective auras.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Darkvision', description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.' }, 
    { name: 'Celestial Resistance', description: 'You have resistance to Radiant and Necrotic damage.' }, 
    { name: 'Healing Hands', description: 'As an Action, you can touch a creature and cause it to regain a number of HP equal to your Proficiency Bonus. You can use this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
    { name: 'Light Bearer', description: 'You know the Light cantrip. CHA is your spellcasting ability for it.' }
  ],
  subspecies: []
};

export const goliathEn: DetailData = { 
  name: 'Goliath', 
  description: 'Nomadic mountain dwellers of incredible physical power. Their granite-like skin and giant heritage make them formidable.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Long-Limbed', description: 'When you make a Melee Attack on your turn, your reach for it is 5 feet greater.' }, 
    { name: 'Stone\'s Endurance', description: 'When you take damage, you can use your Reaction to reduce it by 1d12 + your Constitution modifier. You can use this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' }, 
    { name: 'Powerful Build', description: 'You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.' },
    { name: 'Mountain Born', description: 'You\'re acclimated to high altitude, including elevations above 20,000 feet. Additionally, you don\'t suffer the effects of exhaustion due to forced marches or running without water.' }
  ],
  subspecies: [
    { name: 'Cloud Giant', description: 'Cloud\'s Jaunt: Bonus Action teleport 30ft (Uses = PB/LR).', traits: [] },
    { name: 'Fire Giant', description: 'Fire\'s Burn: Add 1d10 fire damage to an attack (Uses = PB/LR).', traits: [] },
    { name: 'Frost Giant', description: 'Frost\'s Chill: Add 1d6 cold damage and slow enemy 10ft (Uses = PB/LR).', traits: [] },
    { name: 'Hill Giant', description: 'Hill\'s Tumble: Knock enemy prone on hit (Uses = PB/LR).', traits: [] },
    { name: 'Stone Giant', description: 'Stone\'s Endurance: Reaction reduce damage by 1d12 + CON (Uses = PB/LR).', traits: [] },
    { name: 'Storm Giant', description: 'Storm\'s Thunder: Reaction deal 1d8 thunder damage when hit (Uses = PB/LR).', traits: [] }
  ]
};

export const orcEn: DetailData = { 
  name: 'Orc', 
  description: 'Fierce warriors of the wilds, driven by their god\'s brutal will. Their physical prowess is matched only by their ferocity.', 
  size: 'Medium', 
  speed: 30, 
  traits: [
    { name: 'Aggressive', description: 'As a Bonus Action, you can move up to your Speed toward a Hostile creature you can see or hear. You must end this move closer to the creature.' }, 
    { name: 'Relentless Endurance', description: 'When you are reduced to 0 HP but not killed outright, you can drop to 1 HP instead. You can\'t use this feature again until you finish a Long Rest.' }, 
    { name: 'Adrenaline Rush', description: 'You can take the Dash action as a Bonus Action. You can use this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' }
  ],
  subspecies: []
};
