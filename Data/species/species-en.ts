import { DetailData } from '../../types';

// AUTO-GENERATED from docs/Manual/02-species-backgrounds.md
// Do not edit manually - regenerate with: node generate-species.cjs


export const aasimarEn: DetailData = {
  name: 'Aasimar',
  description: 'Aasimar are mortals who carry a spark of the Upper Planes within their souls. Whether descended from an angelic being or infused with celestial power, they can fan that spark to bring light, healing, and heavenly fury.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Celestial Resistance', description: 'You have Resistance to Necrotic damage and Radiant damage.' },
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Healing Hands', description: 'As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can\'t use it again until you finish a Long Rest.' },
    { name: 'Light Bearer', description: 'You know the Light cantrip. Charisma is your spellcasting ability for it.' },
  ],
  innateSpells: [
    { level: 0, spell: 'Light' }
  ],
  subspecies: [
  ]
};

export const boggartEn: DetailData = {
  name: 'Boggart',
  description: 'Boggarts are Small, squat goblinoids found in the realm of Lorwyn-Shadowmoor. They possess bestial physical features, including horns and animal-like snouts.',
  size: 'Small',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light. You discern colors in that darkness only as shades of gray.' },
    { name: 'Fey Ancestry', description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.' },
    { name: 'Fury of the Small', description: 'When you damage a creature with an attack or a spell and the creature\'s size is larger than yours, you can cause the attack or spell to deal extra damage equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, regaining all expended uses when you finish a Long Rest.' },
    { name: 'Nimble Escape', description: 'You can take the Disengage or Hide action as a Bonus Action on each of your turns.' },
  ],
  subspecies: [
  ]
};

export const changelingEn: DetailData = {
  name: 'Changeling',
  description: 'With ever-changing appearances, changelings reside in many societies undetected. Each changeling can supernaturally adopt any face they like.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Changeling Instincts', description: 'You gain proficiency in two of the following skills of your choice: Deception, Insight, Intimidation, Performance, or Persuasion.' },
    { name: 'Shape-Shifter', description: 'As an action, you can shape-shift to change your appearance and your voice. You determine the specifics of the changes. You can make yourself appear as a member of another playable species. While shape-shifted, you have Advantage on Charisma checks.' },
  ],
  subspecies: [
  ]
};

export const dhampirEn: DetailData = {
  name: 'Dhampir',
  description: 'Dhampirs are living people who possess vampiric prowess but are cursed with macabre hunger. Most dhampirs thirst for blood.',
  size: 'Medium or Small',
  speed: 35,
  traits: [
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Spider Climb', description: 'You have a Climb Speed equal to your Speed. When you reach character level 3, you can move up, down, and across vertical surfaces and along ceilings while leaving your hands free.' },
    { name: 'Trace of Undeath', description: 'You have Resistance to Necrotic damage.' },
    { name: 'Vampiric Bite', description: 'When you use your Unarmed Strike and deal damage, you can bite with your fangs. You deal Piercing damage equal to 1d4 plus your Constitution modifier instead of the normal damage. When you deal this damage to a creature that isn\'t a Construct or Undead, you can empower yourself: Drain (regain HP equal to damage dealt) or Strengthen (bonus to next ability check or attack roll equal to damage dealt). Uses equal to Proficiency Bonus per Long Rest.' },
  ],
  subspecies: [
  ]
};

export const dragonbornEn: DetailData = {
  name: 'Dragonborn',
  description: 'The ancestors of dragonborn hatched from the eggs of chromatic and metallic dragons. Dragonborn look like wingless, bipedal dragons with scaly, bright-eyed appearance.',
  size: 'Medium',
  speed: 30,
  traits: [
    { name: 'Draconic Ancestry', description: 'Your lineage stems from a dragon progenitor. Choose the kind of dragon from: Black (Acid), Blue (Lightning), Brass (Fire), Bronze (Lightning), Copper (Acid), Gold (Fire), Green (Poison), Red (Fire), Silver (Cold), White (Cold). Your choice affects your Breath Weapon and Damage Resistance.' },
    { name: 'Breath Weapon', description: 'When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line. Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of your draconic type. On a successful save, a creature takes half as much damage. This damage increases by 1d10 at levels 5, 11, and 17. You can use this a number of times equal to your Proficiency Bonus, regaining all uses when you finish a Long Rest.' },
    { name: 'Damage Resistance', description: 'You have Resistance to the damage type determined by your Draconic Ancestry trait.' },
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Draconic Flight', description: 'When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes. During that time, you have a Fly Speed equal to your Speed. Once you use this trait, you can\'t use it again until you finish a Long Rest.' },
  ],
  subspecies: [
    {
      name: 'Black Dragon',
      description: 'Acid Resistance and 15ft Line Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Blue Dragon',
      description: 'Lightning Resistance and 15ft Line Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Brass Dragon',
      description: 'Fire Resistance and 15ft Line Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Bronze Dragon',
      description: 'Lightning Resistance and 15ft Line Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Copper Dragon',
      description: 'Acid Resistance and 15ft Line Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Gold Dragon',
      description: 'Fire Resistance and 15ft Cone Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Green Dragon',
      description: 'Poison Resistance and 15ft Cone Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Red Dragon',
      description: 'Fire Resistance and 15ft Cone Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'Silver Dragon',
      description: 'Cold Resistance and 15ft Cone Breath Weapon.',
      traits: [
      ]
    },
    {
      name: 'White Dragon',
      description: 'Cold Resistance and 15ft Cone Breath Weapon.',
      traits: [
      ]
    },
  ]
};

export const dwarfEn: DetailData = {
  name: 'Dwarf',
  description: 'Dwarves were raised from the earth in the elder days by a deity of the forge. They are resilient, with a life span of about 350 years.',
  size: 'Medium',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You have Darkvision with a range of 120 feet.' },
    { name: 'Dwarven Resilience', description: 'You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.' },
    { name: 'Dwarven Toughness', description: 'Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.' },
    { name: 'Stonecunning', description: 'As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on or touching a stone surface to use this Tremorsense. You can use this a number of times equal to your Proficiency Bonus, regaining all expended uses when you finish a Long Rest.' },
  ],
  subspecies: [
  ]
};

export const elfEn: DetailData = {
  name: 'Elf',
  description: 'Created by the god Corellon, the first elves could change their forms at will. They live for around 750 years and don\'t sleep but enter a trance.',
  size: 'Medium',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Elven Lineage', description: 'You are part of a lineage that grants you supernatural abilities. Choose a lineage: Drow, High Elf, Wood Elf, Lorwyn Elf, or Shadowmoor Elf. You gain the level 1 benefit of that lineage.' },
    { name: 'Fey Ancestry', description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.' },
    { name: 'Keen Senses', description: 'You have proficiency in the Insight, Perception, or Survival skill.' },
    { name: 'Trance', description: 'You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation.' },
  ],
  subspecies: [
    {
      name: 'Drow',
      description: 'Bonds with the Underdark and shadow magic.',
      traits: [
        { name: 'Drow Magic', description: 'The range of your Darkvision increases to 120 feet. You also know the Dancing Lights cantrip.\n\nAt level 3: Faerie Fire.\nAt level 5: Darkness.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Dancing Lights' },
        { level: 1, spell: 'Faerie Fire' },
        { level: 2, spell: 'Darkness' },
      ]
    },
    {
      name: 'High Elf',
      description: 'Bonds with the Wilds and pure arcane magic of the upper planes.',
      traits: [
        { name: 'High Elf Magic', description: 'You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Wizard spell list.\n\nAt level 3: Detect Magic.\nAt level 5: Misty Step.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Prestidigitation' },
        { level: 1, spell: 'Detect Magic' },
        { level: 2, spell: 'Misty Step' },
      ]
    },
    {
      name: 'Wood Elf',
      description: 'Swift hunters attuned to the power of primordial forests.',
      traits: [
        { name: 'Wood Elf Magic', description: 'Your Speed increases to 35 feet. You also know the Druidcraft cantrip.\n\nAt level 3: Longstrider.\nAt level 5: Pass without Trace.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
        { name: 'Fleet of Foot', description: 'Your walking speed increases to 35 feet.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Druidcraft' },
        { level: 1, spell: 'Longstrider' },
        { level: 2, spell: 'Pass without Trace' },
      ]
    },
    {
      name: 'Lorwyn Elf',
      description: 'Elves from the realm of Lorwyn.',
      traits: [
        { name: 'Lorwyn Elf Magic', description: 'You know the Thorn Whip cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Druid spell list.\n\nAt level 3: Command.\nAt level 5: Silence.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Thorn Whip' },
        { level: 1, spell: 'Command' },
        { level: 2, spell: 'Silence' },
      ]
    },
    {
      name: 'Shadowmoor Elf',
      description: 'Elves from the realm of Shadowmoor.',
      traits: [
        { name: 'Shadowmoor Elf Magic', description: 'The range of your Darkvision increases to 120 feet. You also know the Starry Wisp cantrip.\n\nAt level 3: Heroism.\nAt level 5: Gentle Repose.\n\nYou always have these spells prepared and can cast them once without expending a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Starry Wisp' },
        { level: 1, spell: 'Heroism' },
        { level: 2, spell: 'Gentle Repose' },
      ]
    },
  ]
};

export const faerieEn: DetailData = {
  name: 'Faerie',
  description: 'Known for their mischief, faeries resemble insects with humanoid features. Every faerie is born from a flower and possesses innate magic.',
  size: 'Small',
  speed: 30,
  traits: [
    { name: 'Fairy Magic', description: 'You know the Druidcraft cantrip.\n\nStarting at 3rd level, you can cast the Faerie Fire spell with this trait. Starting at 5th level, you can also cast the Enlarge/Reduce spell with this trait. Once you cast Faerie Fire or Enlarge/Reduce with this trait, you can\'t cast that spell with it again until you finish a Long Rest. You can also cast either of those spells using any spell slots you have. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells.' },
    { name: 'Flight', description: 'Because of your wings, you have a Flying Speed equal to your Walking Speed. You can\'t use this Flying Speed if you\'re wearing Medium or Heavy armor.\n\nShadowmoor faeries also have Darkvision with a range of 120 feet.' },
  ],
  innateSpells: [
    { level: 0, spell: 'Druidcraft' },
    { level: 1, spell: 'Faerie Fire' },
    { level: 2, spell: 'Enlarge/Reduce' },
  ],
  subspecies: [
  ]
};

export const flamekinEn: DetailData = {
  name: 'Flamekin',
  description: 'Flamekin are people made from two key elements of creation: fire and stone. Flamekin\'s bodies radiate harmless magical flames.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You can see in dim light within 60 feet of you as if it were bright light and in darkness as if it were dim light.' },
    { name: 'Fire Resistance', description: 'You have Resistance to Fire damage.' },
    { name: 'Reach to the Blaze', description: 'You know the Produce Flame cantrip.\n\nStarting at 3rd level, you can cast the Burning Hands spell with this trait. Starting at 5th level, you can also cast the Flame Blade spell with this trait without requiring material components. Once you cast Burning Hands or Flame Blade with this trait, you can\'t cast that spell with it again until you finish a Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability for these spells.' },
  ],
  innateSpells: [
    { level: 0, spell: 'Produce Flame' },
    { level: 1, spell: 'Burning Hands' },
    { level: 2, spell: 'Flame Blade' },
  ],
  subspecies: [
  ]
};

export const gnomeEn: DetailData = {
  name: 'Gnome',
  description: 'Gnomes are magical folk created by gods of invention, illusions, and life underground. They are petite folk with big eyes and pointed ears, who live around 425 years.',
  size: 'Small',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Gnomish Cunning', description: 'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.' },
    { name: 'Gnomish Lineage', description: 'You are part of a lineage that grants you supernatural abilities. Choose Forest Gnome or Rock Gnome. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait.' },
  ],
  subspecies: [
    {
      name: 'Forest Gnome',
      description: 'Gnomes with a bond with small forest creatures.',
      traits: [
        { name: 'Forest Gnome Magic', description: 'You know the Minor Illusion cantrip. You also always have the Speak with Animals spell prepared. You can cast it without a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Minor Illusion' },
        { level: 1, spell: 'Speak with Animals', alwaysPrepared: true },
      ]
    },
    {
      name: 'Rock Gnome',
      description: 'Gnomes with a knack for tinkering.',
      traits: [
        { name: 'Rock Gnome Tinker', description: 'You know the Mending and Prestidigitation cantrips. In addition, you can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (AC 5, 1 HP). You can have three such devices in existence at a time, and each falls apart 8 hours after its creation or when you dismantle it.' },
      ]
    },
  ]
};

export const goliathEn: DetailData = {
  name: 'Goliath',
  description: 'Towering over most folk, goliaths are distant descendants of giants. Each goliath bears the favors of the first giants.',
  size: 'Medium',
  speed: 35,
  traits: [
    { name: 'Giant Ancestry', description: 'You are descended from Giants. Choose one benefit from: Cloud\'s Jaunt (teleport 30ft as Bonus Action), Fire\'s Burn (1d10 Fire damage on hit), Frost\'s Chill (1d6 Cold damage and slow 10ft), Hill\'s Tumble (knock Prone on hit), Stone\'s Endurance (reduce damage by 1d12+CON), Storm\'s Thunder (1d8 Thunder damage when hit). Use a number of times equal to Proficiency Bonus per Long Rest.' },
    { name: 'Large Form', description: 'Starting at character level 5, you can change your size to Large as a Bonus Action if you\'re in a big enough space. This transformation lasts for 10 minutes. For that duration, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can\'t use it again until you finish a Long Rest.' },
    { name: 'Powerful Build', description: 'You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.' },
  ],
  subspecies: [
  ]
};

export const halflingEn: DetailData = {
  name: 'Halfling',
  description: 'Cherished and guided by gods who value life, home, and hearth, halflings gravitate towards bucolic havens. Their size helps them pass through crowds unnoticed.',
  size: 'Small',
  speed: 30,
  traits: [
    { name: 'Brave', description: 'You have Advantage on saving throws you make to avoid or end the Frightened condition.' },
    { name: 'Halfling Nimbleness', description: 'You can move through the space of any creature that is a size larger than you, but you can\'t stop in the same space.' },
    { name: 'Luck', description: 'When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.' },
    { name: 'Naturally Stealthy', description: 'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.' },
  ],
  subspecies: [
  ]
};

export const humanEn: DetailData = {
  name: 'Human',
  description: 'Found throughout the multiverse, humans are as varied as they are numerous. Their ambition and resourcefulness are commended, respected, and feared.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Resourceful', description: 'You gain Heroic Inspiration whenever you finish a Long Rest.' },
    { name: 'Skillful', description: 'You gain proficiency in one skill of your choice.' },
    { name: 'Versatile', description: 'You gain an Origin feat of your choice.' },
  ],
  subspecies: [
  ]
};

export const kalashtarEn: DetailData = {
  name: 'Kalashtar',
  description: 'Kalashtar are created from the union of humanity and renegade spirits called quori from the plane of dreams. They have symmetrical, slightly angular features, and their eyes often glow.',
  size: 'Medium',
  speed: 30,
  traits: [
    { name: 'Dual Mind', description: 'You have Advantage on Wisdom and Charisma saving throws.' },
    { name: 'Mental Discipline', description: 'You have Resistance to Psychic damage.' },
    { name: 'Mind Link', description: 'You have telepathy with a range in feet equal to 10 times your level. When you\'re using this trait to speak telepathically to a creature, you can take a Magic action to give that creature the ability to speak telepathically with you for 1 hour.' },
    { name: 'Severed from Dreams', description: 'You can\'t be the target of the Dream spell. In addition, when you finish a Long Rest, you gain proficiency in one skill of your choice until you finish another Long Rest.' },
  ],
  subspecies: [
  ]
};

export const khoravarEn: DetailData = {
  name: 'Khoravar',
  description: 'Over the course of centuries, those descended from both humans and elves have developed their own communities in Khorvaire. They call themselves Khoravar.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Fey Ancestry', description: 'You have Advantage on saving throws you make to avoid or end the Charmed condition.' },
    { name: 'Fey Gift', description: 'You know the Friends cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
    { name: 'Lethargy Resilience', description: 'When you fail a saving throw to avoid or end the Unconscious condition, you can succeed instead. Once you use this trait, you can\'t do so again until you finish 1d4 Long Rests.' },
    { name: 'Skill Versatility', description: 'You gain proficiency in one skill or with one tool of your choice. Whenever you finish a Long Rest, you can replace it with another skill or tool proficiency.' },
  ],
  subspecies: [
  ]
};

export const lorwynChangelingEn: DetailData = {
  name: 'Lorwyn Changeling',
  description: 'The changelings of Lorwyn are charismatic shapeshifters able to crudely mimic the forms of creatures and plants. They keep their key traits: blue-green skin, tufts of tentacle-like fur, and bulbous yellow eyes.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Shape Self', description: 'As an action, you can reshape your body to a two-legged Humanoid shape or to a four-legged Beast shape. While you have a Humanoid shape, you can wear clothing and armor made for a Humanoid of your size.' },
    { name: 'Darkvision', description: 'You have Darkvision with a range of 120 feet.' },
    { name: 'Delightful Imitator', description: 'You have proficiency in the Performance skill.' },
    { name: 'Unpredictable Movement', description: 'When you roll Initiative and don\'t have Disadvantage on that roll, you can take the Dash action as a Reaction.' },
  ],
  subspecies: [
  ]
};

export const orcEn: DetailData = {
  name: 'Orc',
  description: 'Orcs trace their creation to Gruumsh, a powerful god who roamed the Material Plane. Orcs are tall and broad with gray skin, pointed ears, and prominent lower canines.',
  size: 'Medium',
  speed: 30,
  traits: [
    { name: 'Adrenaline Rush', description: 'You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.' },
    { name: 'Darkvision', description: 'You have Darkvision with a range of 120 feet.' },
    { name: 'Relentless Endurance', description: 'When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can\'t do so again until you finish a Long Rest.' },
  ],
  subspecies: [
  ]
};

export const rimekinEn: DetailData = {
  name: 'Rimekin',
  description: 'Rimekin hail from both Lorwyn and Shadowmoor. Their flames burn icy blue rather than red hot, and any armor or weapons they wield becomes coated in layers of hoarfrost.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Cold Fire Magic', description: 'You know the Ray of Frost cantrip. When you reach character levels 3 and 5, you learn the Ice Knife spell and the Flame Blade spell respectively. You always have those spells prepared and can cast them once without a spell slot per Long Rest. When you cast Flame Blade using this trait, the spell deals Cold damage instead of Fire damage. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
    { name: 'Cold Resistance', description: 'You have Resistance to Cold damage.' },
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
  ],
  innateSpells: [
    { level: 0, spell: 'Ray of Frost' },
    { level: 1, spell: 'Ice Knife' },
    { level: 2, spell: 'Flame Blade' },
  ],
  subspecies: [
  ]
};

export const shifterEn: DetailData = {
  name: 'Shifter',
  description: 'Shifters descend from people who contracted full or partial lycanthropy. They resemble humans but have bestial features: large eyes, pointed ears, and prominent canine teeth.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Bestial Instincts', description: 'You gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Intimidation, or Survival.' },
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Shifting', description: 'As a Bonus Action, you can shape-shift to assume a more bestial appearance. This transformation lasts for 1 minute or until you revert as a Bonus Action. When you shift, you gain Temporary Hit Points equal to 2 times your Proficiency Bonus. You can shift a number of times equal to your Proficiency Bonus, regaining all expended uses when you finish a Long Rest.\n\nWhen you shift, you gain the benefit of one of the following options: Beasthide (1d6 extra THP, +1 AC while shifted), Longtooth (use fangs for Unarmed Strike dealing 1d6 Piercing plus STR mod), Swiftstride (Speed +10 feet, move 10 feet as Reaction when creature ends turn within 5 feet), Wildhunt (Advantage on Wisdom checks, no creature within 30 feet can have Advantage on attacks against you unless you\'re Incapacitated).' },
  ],
  subspecies: [
  ]
};

export const tieflingEn: DetailData = {
  name: 'Tiefling',
  description: 'Tieflings are either born in the Lower Planes or have fiendish ancestors. A tiefling is linked by blood to a devil, demon, or other Fiend.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
    { name: 'Fiendish Legacy', description: 'You are the recipient of a legacy that grants you supernatural abilities. Choose a legacy: Abyssal, Chthonic, or Infernal. You gain the level 1 benefit of the chosen legacy.' },
    { name: 'Otherworldly Presence', description: 'You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses the same spellcasting ability you use for your Fiendish Legacy trait.' },
  ],
  innateSpells: [
    { level: 0, spell: 'Thaumaturgy' }
  ],
  subspecies: [
    {
      name: 'Abyssal',
      description: 'Linked to the infinite chaos and entropy of the Abyss.',
      traits: [
        { name: 'Abyssal Resilience', description: 'You have Resistance to Poison damage. You also know the Poison Spray cantrip.' },
        { name: 'Abyssal Legacy', description: 'Level 1: Poison Spray.\nLevel 3: Ray of Sickness.\nLevel 5: Hold Person.\n\nYou always have these spells prepared and can cast them once without a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Poison Spray' },
        { level: 1, spell: 'Ray of Sickness' },
        { level: 2, spell: 'Hold Person' },
      ]
    },
    {
      name: 'Chthonic',
      description: 'Linked to the shadowy realms of Hades and the deep underworld.',
      traits: [
        { name: 'Chthonic Resilience', description: 'You have Resistance to Necrotic damage. You also know the Chill Touch cantrip.' },
        { name: 'Chthonic Legacy', description: 'Level 1: Chill Touch.\nLevel 3: False Life.\nLevel 5: Ray of Enfeeblement.\n\nYou always have these spells prepared and can cast them once without a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Chill Touch' },
        { level: 1, spell: 'False Life' },
        { level: 2, spell: 'Ray of Enfeeblement' },
      ]
    },
    {
      name: 'Infernal',
      description: 'Linked to the iron hierarchy and eternal fire of the Nine Hells.',
      traits: [
        { name: 'Infernal Resilience', description: 'You have Resistance to Fire damage. You also know the Fire Bolt cantrip.' },
        { name: 'Infernal Legacy', description: 'Level 1: Fire Bolt.\nLevel 3: Hellish Rebuke.\nLevel 5: Darkness.\n\nYou always have these spells prepared and can cast them once without a spell slot per Long Rest. Intelligence, Wisdom, or Charisma is your spellcasting ability.' },
      ],
      innateSpells: [
        { level: 0, spell: 'Fire Bolt' },
        { level: 1, spell: 'Hellish Rebuke' },
        { level: 2, spell: 'Darkness' },
      ]
    },
  ]
};

export const warforgedEn: DetailData = {
  name: 'Warforged',
  description: 'Warforged are mechanical beings built as weapons to fight in the Last War. They are made from wood and metal that can feel pain and emotion.',
  size: 'Medium or Small',
  speed: 30,
  traits: [
    { name: 'Construct Resilience', description: 'You have Resistance to Poison damage. You also have Advantage on saving throws to avoid or end the Poisoned condition.' },
    { name: 'Integrated Protection', description: 'You gain a +1 bonus to your Armor Class. In addition, armor you have donned can\'t be removed against your will while you\'re alive.' },
    { name: 'Sentry\'s Rest', description: 'You don\'t need to sleep, and magic can\'t put you to sleep. You can finish a Long Rest in 6 hours if you spend those hours in an inactive, motionless state. During this time, you appear inert but remain conscious.' },
    { name: 'Specialized Design', description: 'You gain one skill proficiency and one tool proficiency of your choice.' },
    { name: 'Tireless', description: 'You don\'t gain Exhaustion levels from dehydration, malnutrition, or suffocation.' },
  ],
  subspecies: [
  ]
};
