export interface MonsterData {
  name: string;
  cr: string;
  hp: number;
  ac: number;
  type: MonsterType;
  alignment: string;
  description?: string;
}

export type MonsterType =
  | 'aberration'
  | 'beast'
  | 'celestial'
  | 'construct'
  | 'dragon'
  | 'elemental'
  | 'fey'
  | 'fiend'
  | 'giant'
  | 'humanoid'
  | 'monstrosity'
  | 'ooze'
  | 'plant'
  | 'undead';

export const MONSTER_TYPES: Record<MonsterType, { label: string; icon: string }> = {
  aberration: { label: 'Aberración', icon: 'bubble_chart' },
  beast: { label: 'Bestia', icon: 'pets' },
  celestial: { label: 'Celestial', icon: 'auto_awesome' },
  construct: { label: 'Constructo', icon: 'precision_manufacturing' },
  dragon: { label: 'Dragón', icon: 'dragon' },
  elemental: { label: 'Elemental', icon: 'whirlwind' },
  fey: { label: 'Hada', icon: 'forest' },
  fiend: { label: 'Demonio', icon: 'local_fire_department' },
  giant: { label: 'Gigante', icon: 'height' },
  humanoid: { label: 'Humanoide', icon: 'person' },
  monstrosity: { label: 'Monstruosidad', icon: 'warning' },
  ooze: { label: 'Moco', icon: 'water_drop' },
  plant: { label: 'Planta', icon: 'grass' },
  undead: { label: 'No-muerto', icon: 'air' },
};

export const SRD_MONSTERS: MonsterData[] = [
  // --- BEASTS ---
  {
    name: 'Ape',
    cr: '1',
    hp: 45,
    ac: 12,
    type: 'beast',
    alignment: 'unaligned',
    description: 'Large primate',
  },
  { name: 'Awakened Shrub', cr: '0', hp: 10, ac: 9, type: 'plant', alignment: 'unaligned' },
  { name: 'Axe Beak', cr: '1/4', hp: 19, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Baboon', cr: '0', hp: 3, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Badger', cr: '0', hp: 3, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Bat', cr: '0', hp: 1, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Bear (Brown)', cr: '1', hp: 34, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Boar', cr: '1/4', hp: 11, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Cat', cr: '0', hp: 2, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Cheetah', cr: '1/4', hp: 26, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Constrictor Snake', cr: '1/4', hp: 11, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Crab', cr: '0', hp: 2, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Crocodile', cr: '1/2', hp: 19, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Deer', cr: '0', hp: 4, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Draft Horse', cr: '1/4', hp: 19, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Eagle', cr: '0', hp: 3, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Elephant', cr: '4', hp: 126, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Elk', cr: '1/4', hp: 13, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Flying Snake', cr: '1/8', hp: 5, ac: 14, type: 'beast', alignment: 'unaligned' },
  { name: 'Frog', cr: '0', hp: 1, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Ape', cr: '6', hp: 157, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Badger', cr: '1/2', hp: 13, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Bat', cr: '1/4', hp: 26, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Boar', cr: '2', hp: 42, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Centipede', cr: '1/4', hp: 4, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Crab', cr: '1/8', hp: 3, ac: 15, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Crocodile', cr: '5', hp: 85, ac: 14, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Eagle', cr: '1', hp: 26, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Elk', cr: '2', hp: 42, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Fire Beetle', cr: '1/8', hp: 4, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Goat', cr: '1/2', hp: 19, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Hyena', cr: '1', hp: 45, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Octopus', cr: '1', hp: 52, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Owl', cr: '1/4', hp: 19, ac: 12, type: 'beast', alignment: 'unaligned' },
  {
    name: 'Giant Poisonous Snake',
    cr: '1/4',
    hp: 11,
    ac: 14,
    type: 'beast',
    alignment: 'unaligned',
  },
  { name: 'Giant Shark', cr: '5', hp: 126, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Spider', cr: '1', hp: 26, ac: 14, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Toad', cr: '1', hp: 39, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Vulture', cr: '1/2', hp: 15, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Giant Wasp', cr: '1/2', hp: 13, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Goat', cr: '0', hp: 2, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Hawk', cr: '0', hp: 1, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Hippopotamus', cr: '2', hp: 45, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Horse', cr: '1/4', hp: 19, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Jackal', cr: '0', hp: 3, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Killer Whale', cr: '3', hp: 52, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Lion', cr: '1', hp: 45, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Lizard', cr: '0', hp: 2, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Mastiff', cr: '1/8', hp: 5, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Mule', cr: '1/8', hp: 4, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Octopus', cr: '0', hp: 3, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Owl', cr: '0', hp: 1, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Panther', cr: '1/4', hp: 18, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Poisonous Snake', cr: '1/8', hp: 4, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Pony', cr: '1/8', hp: 11, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Quasit', cr: '1', hp: 7, ac: 13, type: 'fiend', alignment: 'chaotic evil' },
  { name: 'Rat', cr: '0', hp: 1, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Raven', cr: '0', hp: 1, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Reef Shark', cr: '1/2', hp: 22, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Rhinoceros', cr: '2', hp: 45, ac: 11, type: 'beast', alignment: 'unaligned' },
  { name: 'River Shark', cr: '2', hp: 26, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Riding Horse', cr: '1/4', hp: 13, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Scorpion', cr: '0', hp: 1, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Spider', cr: '0', hp: 1, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Tiger', cr: '1', hp: 52, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Turtle', cr: '1/4', hp: 9, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Vulture', cr: '0', hp: 3, ac: 10, type: 'beast', alignment: 'unaligned' },
  { name: 'Warhorse', cr: '1/2', hp: 19, ac: 12, type: 'beast', alignment: 'unaligned' },
  { name: 'Weasel', cr: '0', hp: 1, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Wolf', cr: '1/4', hp: 11, ac: 13, type: 'beast', alignment: 'unaligned' },
  { name: 'Worg', cr: '1/2', hp: 26, ac: 13, type: 'beast', alignment: 'chaotic evil' },

  // --- HUMANOIDS ---
  { name: 'Bandit', cr: '1/8', hp: 11, ac: 12, type: 'humanoid', alignment: 'non-lawful' },
  { name: 'Cultist', cr: '1/8', hp: 9, ac: 12, type: 'humanoid', alignment: 'chaotic evil' },
  { name: 'Goblin', cr: '1/4', hp: 7, ac: 15, type: 'humanoid', alignment: 'neutral evil' },
  { name: 'Kobold', cr: '1/8', hp: 7, ac: 13, type: 'humanoid', alignment: 'lawful evil' },
  { name: 'Orc', cr: '1/2', hp: 15, ac: 13, type: 'humanoid', alignment: 'chaotic evil' },
  { name: 'Gnoll', cr: '1/2', hp: 22, ac: 15, type: 'humanoid', alignment: 'chaotic evil' },
  { name: 'Hobgoblin', cr: '1/2', hp: 11, ac: 18, type: 'humanoid', alignment: 'lawful evil' },
  { name: 'Lizardfolk', cr: '1/2', hp: 22, ac: 15, type: 'humanoid', alignment: 'neutral' },
  {
    name: 'Tribal Warrior',
    cr: '1/8',
    hp: 9,
    ac: 12,
    type: 'humanoid',
    alignment: 'any alignment',
  },
  { name: 'Commoner', cr: '0', hp: 4, ac: 10, type: 'humanoid', alignment: 'any alignment' },
  { name: 'Acolyte', cr: '1/4', hp: 9, ac: 10, type: 'humanoid', alignment: 'any alignment' },
  { name: 'Guard', cr: '1/8', hp: 11, ac: 16, type: 'humanoid', alignment: 'any alignment' },
  { name: 'Noble', cr: '1/8', hp: 9, ac: 13, type: 'humanoid', alignment: 'any alignment' },
  { name: 'Priest', cr: '2', hp: 27, ac: 13, type: 'humanoid', alignment: 'any alignment' },
  { name: 'Berserker', cr: '1/2', hp: 67, ac: 13, type: 'humanoid', alignment: 'chaotic neutral' },
  { name: 'Scout', cr: '1/2', hp: 16, ac: 14, type: 'humanoid', alignment: 'any alignment' },
  { name: 'Thug', cr: '1/2', hp: 32, ac: 11, type: 'humanoid', alignment: 'non-lawful' },

  // --- UNDEAD ---
  { name: 'Skeleton', cr: '1/4', hp: 13, ac: 13, type: 'undead', alignment: 'lawful evil' },
  { name: 'Zombie', cr: '1/4', hp: 22, ac: 8, type: 'undead', alignment: 'neutral evil' },
  { name: 'Ghost', cr: '4', hp: 45, ac: 12, type: 'undead', alignment: 'any alignment' },
  { name: 'Ghoul', cr: '1', hp: 22, ac: 13, type: 'undead', alignment: 'chaotic evil' },
  { name: 'Wight', cr: '3', hp: 45, ac: 14, type: 'undead', alignment: 'neutral evil' },
  { name: 'Wraith', cr: '5', hp: 67, ac: 13, type: 'undead', alignment: 'neutral evil' },
  { name: 'Mummy', cr: '3', hp: 58, ac: 11, type: 'undead', alignment: 'lawful evil' },
  { name: 'Vampire Spawn', cr: '5', hp: 78, ac: 15, type: 'undead', alignment: 'neutral evil' },
  { name: 'Vampire', cr: '13', hp: 144, ac: 16, type: 'undead', alignment: 'lawful evil' },
  { name: 'Lich', cr: '21', hp: 135, ac: 17, type: 'undead', alignment: 'any evil alignment' },
  { name: 'Ghast', cr: '2', hp: 36, ac: 13, type: 'undead', alignment: 'chaotic evil' },
  { name: 'Crawling Claw', cr: '0', hp: 2, ac: 12, type: 'undead', alignment: 'neutral evil' },
  { name: 'Shadow', cr: '1/2', hp: 16, ac: 12, type: 'undead', alignment: 'chaotic evil' },
  { name: 'Sea Hag', cr: '2', hp: 52, ac: 14, type: 'humanoid', alignment: 'chaotic evil' },

  // --- FIENDS ---
  { name: 'Imp', cr: '1', hp: 9, ac: 13, type: 'fiend', alignment: 'lawful evil' },
  { name: 'Lemure', cr: '0', hp: 13, ac: 7, type: 'fiend', alignment: 'lawful evil' },
  { name: 'Pit Fiend', cr: '20', hp: 300, ac: 19, type: 'fiend', alignment: 'lawful evil' },
  { name: 'Manes', cr: '1/8', hp: 9, ac: 10, type: 'fiend', alignment: 'chaotic evil' },
  { name: 'Dretch', cr: '1/4', hp: 18, ac: 13, type: 'fiend', alignment: 'chaotic evil' },

  // --- DRAGONS ---
  { name: 'Dragon Turtle', cr: '17', hp: 341, ac: 19, type: 'dragon', alignment: 'neutral' },
  { name: 'Tidecaller', cr: '1/2', hp: 22, ac: 13, type: 'dragon', alignment: 'neutral' },
  { name: 'Young Dragon', cr: '10', hp: 150, ac: 19, type: 'dragon', alignment: 'chaotic evil' },
  { name: 'Wyvern', cr: '6', hp: 110, ac: 13, type: 'dragon', alignment: 'unaligned' },

  // --- GIANTS ---
  { name: 'Hill Giant', cr: '5', hp: 105, ac: 13, type: 'giant', alignment: 'chaotic evil' },
  { name: 'Stone Giant', cr: '7', hp: 126, ac: 17, type: 'giant', alignment: 'neutral' },
  { name: 'Fire Giant', cr: '9', hp: 162, ac: 18, type: 'giant', alignment: 'lawful evil' },
  { name: 'Frost Giant', cr: '8', hp: 138, ac: 15, type: 'giant', alignment: 'chaotic evil' },
  { name: 'Cloud Giant', cr: '11', hp: 200, ac: 17, type: 'giant', alignment: 'neutral' },
  { name: 'Storm Giant', cr: '15', hp: 230, ac: 16, type: 'giant', alignment: 'chaotic good' },
  { name: 'Ogre', cr: '2', hp: 59, ac: 11, type: 'giant', alignment: 'chaotic evil' },
  { name: 'Oni', cr: '7', hp: 110, ac: 16, type: 'giant', alignment: 'lawful evil' },

  // --- ABERRATIONS ---
  { name: 'Mind Flayer', cr: '7', hp: 71, ac: 15, type: 'aberration', alignment: 'lawful evil' },
  { name: 'Beholder', cr: '13', hp: 180, ac: 18, type: 'aberration', alignment: 'lawful evil' },
  { name: 'Otyugh', cr: '5', hp: 75, ac: 15, type: 'aberration', alignment: 'neutral' },

  // --- ELEMENTALS ---
  { name: 'Air Elemental', cr: '5', hp: 90, ac: 15, type: 'elemental', alignment: 'neutral' },
  { name: 'Fire Elemental', cr: '5', hp: 93, ac: 13, type: 'elemental', alignment: 'neutral' },
  { name: 'Water Elemental', cr: '5', hp: 114, ac: 14, type: 'elemental', alignment: 'neutral' },
  { name: 'Earth Elemental', cr: '5', hp: 126, ac: 17, type: 'elemental', alignment: 'neutral' },
  { name: 'Dust Devil', cr: '1/2', hp: 17, ac: 11, type: 'elemental', alignment: 'neutral' },
  { name: 'Ice Mephit', cr: '1/2', hp: 21, ac: 11, type: 'elemental', alignment: 'neutral' },
  { name: 'Magma Mephit', cr: '1/2', hp: 22, ac: 11, type: 'elemental', alignment: 'neutral' },
  { name: 'Steam Mephit', cr: '0', hp: 9, ac: 10, type: 'elemental', alignment: 'neutral' },

  // --- CONSTRUCTS ---
  { name: 'Animated Armor', cr: '1', hp: 33, ac: 18, type: 'construct', alignment: 'unaligned' },
  { name: 'Shield Guardian', cr: '7', hp: 142, ac: 17, type: 'construct', alignment: 'unaligned' },
  { name: 'Flying Sword', cr: '1/4', hp: 17, ac: 17, type: 'construct', alignment: 'unaligned' },
  {
    name: 'Rug of Smothering',
    cr: '1/2',
    hp: 33,
    ac: 12,
    type: 'construct',
    alignment: 'unaligned',
  },

  // --- FEY ---
  { name: 'Sprite', cr: '1/4', hp: 2, ac: 15, type: 'fey', alignment: 'neutral' },
  { name: 'Dryad', cr: '1', hp: 22, ac: 11, type: 'fey', alignment: 'neutral' },
  { name: 'Satyr', cr: '1/2', hp: 31, ac: 14, type: 'fey', alignment: 'chaotic neutral' },
  { name: 'Pixie', cr: '1/4', hp: 1, ac: 15, type: 'fey', alignment: 'neutral' },

  // --- PLANTS ---
  { name: 'Shambling Mound', cr: '5', hp: 136, ac: 8, type: 'plant', alignment: 'unaligned' },
  { name: 'Assassin Vine', cr: '3', hp: 85, ac: 12, type: 'plant', alignment: 'unaligned' },
  { name: 'Thorny Vampire', cr: '3', hp: 67, ac: 13, type: 'plant', alignment: 'neutral evil' },

  // --- MONSTROSITIES ---
  { name: 'Mimic', cr: '2', hp: 58, ac: 13, type: 'monstrosity', alignment: 'neutral' },
  { name: 'Basilisk', cr: '3', hp: 52, ac: 15, type: 'monstrosity', alignment: 'unaligned' },
  { name: 'Chimera', cr: '6', hp: 147, ac: 15, type: 'monstrosity', alignment: 'chaotic evil' },
  { name: 'Girallon', cr: '5', hp: 114, ac: 13, type: 'monstrosity', alignment: 'unaligned' },
  { name: 'Griffon', cr: '2', hp: 59, ac: 15, type: 'monstrosity', alignment: 'unaligned' },
  { name: 'Harpy', cr: '1', hp: 38, ac: 12, type: 'monstrosity', alignment: 'chaotic evil' },
  { name: 'Hippogriff', cr: '1', hp: 19, ac: 13, type: 'monstrosity', alignment: 'unaligned' },
  { name: 'Minotaur', cr: '3', hp: 76, ac: 14, type: 'monstrosity', alignment: 'chaotic evil' },
  { name: 'Owlbear', cr: '3', hp: 59, ac: 13, type: 'monstrosity', alignment: 'unaligned' },
  { name: 'Peryton', cr: '2', hp: 33, ac: 13, type: 'monstrosity', alignment: 'chaotic evil' },
  { name: 'Triceratops', cr: '5', hp: 85, ac: 16, type: 'monstrosity', alignment: 'unaligned' },
  { name: 'Winter Wolf', cr: '3', hp: 75, ac: 14, type: 'monstrosity', alignment: 'neutral evil' },
  {
    name: 'Woolly Rhinoceros',
    cr: '6',
    hp: 76,
    ac: 15,
    type: 'monstrosity',
    alignment: 'unaligned',
  },
];

export const POPULAR_MONSTERS = SRD_MONSTERS.filter((m) =>
  [
    'Goblin',
    'Orc',
    'Skeleton',
    'Zombie',
    'Wolf',
    'Spider',
    'Bear (Brown)',
    'Giant Spider',
    'Ghoul',
    'Bandit',
    'Cultist',
    'Ogre',
    ' Hobgoblin',
    'Dragon Turtle',
  ].includes(m.name)
);

export const getMonsterByName = (name: string): MonsterData | undefined => {
  return SRD_MONSTERS.find((m) => m.name.toLowerCase() === name.toLowerCase());
};

export const getMonstersByType = (type: MonsterType): MonsterData[] => {
  return SRD_MONSTERS.filter((m) => m.type === type);
};

export const getMonstersByCR = (cr: string): MonsterData[] => {
  return SRD_MONSTERS.filter((m) => m.cr === cr);
};

export const searchMonsters = (query: string): MonsterData[] => {
  const q = query.toLowerCase();
  return SRD_MONSTERS.filter((m) => m.name.toLowerCase().includes(q) || m.type.includes(q)).slice(
    0,
    8
  );
};
