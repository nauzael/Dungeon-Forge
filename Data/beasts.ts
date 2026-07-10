import { Ability } from '../types';

export interface BeastStats {
  name: string;
  cr: number;
  hp: number;
  ac: number;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge';
  speed: number;
  flySpeed?: number;
  swimSpeed?: number;
  climbSpeed?: number;
  stats: Record<Ability, number>;
  skills?: string[];
  senses?: string[];
  special?: string[];
  attacks: BeastAttack[];
}

export interface BeastAttack {
  name: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  reach?: number;
  target?: string;
  effect?: string;
}

export const WILD_SHAPE_BEASTS: Record<number, BeastStats[]> = {
  1: [], // Level 1: no Wild Shape
  2: [ // Level 2-3: CR 1/4, no fly
    {
      name: 'Wolf',
      cr: 0.25,
      hp: 11,
      ac: 12,
      size: 'Medium',
      speed: 12,
      stats: { STR: 12, DEX: 15, CON: 12, INT: 3, WIS: 12, CHA: 6 },
      skills: ['Perception +5', 'Stealth +4'],
      senses: ['Darkvision 18m', 'Passive Perception 15'],
      attacks: [
        {
          name: 'Bite',
          attackBonus: 4,
          damage: '1d6+2',
          damageType: 'piercing',
          reach: 1.5,
          effect: 'If hitting a Medium or smaller creature, target is knocked prone'
        }
      ],
      special: ['Pack tactics: Advantage against enemies if ally within 1.5m']
    },
    {
      name: 'Spider',
      cr: 0.25,
      hp: 11,
      ac: 12,
      size: 'Small',
      speed: 6,
      climbSpeed: 6,
      stats: { STR: 12, DEX: 16, CON: 12, INT: 2, WIS: 12, CHA: 4 },
      skills: ['Stealth +6'],
      senses: ['Darkvision 18m', 'Passive Perception 12'],
      attacks: [
        {
          name: 'Bite',
          attackBonus: 5,
          damage: '1d6+3',
          damageType: 'piercing',
          reach: 1.5,
          effect: 'DC 10 CON or becomes poisoned'
        }
      ],
      special: ['Spider Climb: ignores movement restrictions', 'Web Walker: ignores webs']
    },
    {
      name: 'Rat',
      cr: 0,
      hp: 4,
      ac: 10,
      size: 'Tiny',
      speed: 6,
      climbSpeed: 6,
      stats: { STR: 2, DEX: 11, CON: 10, INT: 2, WIS: 10, CHA: 4 },
      skills: ['Perception +2'],
      senses: ['Darkvision 9m', 'Passive Perception 12'],
      attacks: [
        {
          name: 'Bite',
          attackBonus: 0,
          damage: '1',
          damageType: 'piercing',
          reach: 1.5
        }
      ],
      special: ['Keen: doesn\'t provoke OA when moving away']
    },
    {
      name: 'Riding Horse',
      cr: 0.25,
      hp: 13,
      ac: 11,
      size: 'Large',
      speed: 18,
      stats: { STR: 16, DEX: 13, CON: 12, INT: 2, WIS: 11, CHA: 7 },
      skills: ['Perception +2'],
      senses: ['Passive Perception 12'],
      attacks: [
        {
          name: 'Hooves',
          attackBonus: 3,
          damage: '1d8+2',
          damageType: 'bludgeoning',
          reach: 1.5
        }
      ]
    },
    {
      name: 'Boar',
      cr: 0.25,
      hp: 13,
      ac: 11,
      size: 'Medium',
      speed: 12,
      stats: { STR: 13, DEX: 11, CON: 14, INT: 2, WIS: 9, CHA: 5 },
      skills: ['Perception +2'],
      senses: ['Passive Perception 11'],
      attacks: [
        {
          name: 'Gore',
          attackBonus: 3,
          damage: '1d6+1',
          damageType: 'piercing',
          reach: 1.5,
          effect: 'If moved 6m+ in a straight line: prone + 1d6 additional damage'
        }
      ],
      special: ['Relentless: Advantage if less than half HP']
    }
  ],
  4: [ // Level 4-7: CR 1/4, + CR 1/2
    {
      name: 'Giant Owl',
      cr: 0.25,
      hp: 19,
      ac: 12,
      size: 'Large',
      speed: 1.5,
      flySpeed: 18,
      stats: { STR: 13, DEX: 15, CON: 12, INT: 10, WIS: 14, CHA: 10 },
      skills: ['Perception +6', 'Stealth +6'],
      senses: ['Darkvision 36m', 'Passive Perception 16'],
      attacks: [
        {
          name: 'Claws',
          attackBonus: 4,
          damage: '1d10+2',
          damageType: 'slashing',
          reach: 1.5
        }
      ],
      special: ['Flyby: Doesn\'t provoke OA when flying away']
    },
    {
      name: 'Warhorse',
      cr: 0.5,
      hp: 19,
      ac: 11,
      size: 'Large',
      speed: 18,
      stats: { STR: 18, DEX: 12, CON: 13, INT: 2, WIS: 12, CHA: 7 },
      skills: ['Perception +3'],
      senses: ['Passive Perception 13'],
      attacks: [
        {
          name: 'Hooves',
          attackBonus: 6,
          damage: '2d4+4',
          damageType: 'bludgeoning',
          reach: 1.5,
          effect: 'If moved 6m+: +2d4 damage and prone'
        }
      ]
    },
    {
      name: 'Crocodile',
      cr: 0.5,
      hp: 13,
      ac: 12,
      size: 'Large',
      speed: 6,
      swimSpeed: 9,
      stats: { STR: 15, DEX: 10, CON: 13, INT: 2, WIS: 10, CHA: 5 },
      skills: ['Stealth +2'],
      senses: ['Passive Perception 10'],
      attacks: [
        {
          name: 'Bite',
          attackBonus: 4,
          damage: '1d8+2',
          damageType: 'piercing',
          reach: 1.5,
          effect: 'DC 12 to escape grapple. Hold breath 1 hour.'
        }
      ],
      special: ['Hold Breath: 1 hour']
    }
  ],
  8: [ // Level 8+: CR 1, includes fly speed options
    {
      name: 'Brown Bear',
      cr: 1,
      hp: 22,
      ac: 11,
      size: 'Large',
      speed: 12,
      climbSpeed: 9,
      stats: { STR: 17, DEX: 12, CON: 15, INT: 2, WIS: 13, CHA: 7 },
      skills: ['Perception +3'],
      senses: ['Darkvision 18m', 'Passive Perception 13'],
      attacks: [
        {
          name: 'Multiattack',
          attackBonus: 5,
          damage: '0',
          damageType: 'special',
          effect: 'Bite + Claws as one attack'
        },
        {
          name: 'Claws',
          attackBonus: 5,
          damage: '1d4+3',
          damageType: 'slashing',
          reach: 1.5,
          effect: 'On hit: target knocked prone'
        },
        {
          name: 'Bite',
          attackBonus: 5,
          damage: '1d8+3',
          damageType: 'piercing',
          reach: 1.5
        }
      ]
    },
    {
      name: 'Lion',
      cr: 1,
      hp: 22,
      ac: 12,
      size: 'Large',
      speed: 15,
      stats: { STR: 17, DEX: 15, CON: 11, INT: 3, WIS: 12, CHA: 8 },
      skills: ['Perception +3', 'Stealth +4'],
      senses: ['Darkvision 18m', 'Passive Perception 13'],
      attacks: [
        {
          name: 'Multiattack',
          attackBonus: 5,
          damage: '0',
          damageType: 'special',
          effect: 'Two rend attacks'
        },
        {
          name: 'Rend',
          attackBonus: 5,
          damage: '1d8+3',
          damageType: 'slashing',
          reach: 1.5
        },
        {
          name: 'Roar',
          attackBonus: 0,
          damage: '0',
          damageType: 'fear',
          effect: 'DC 13 WIS: creatures within 4.5m frightened'
        }
      ],
      special: ['Pack tactics: Advantage if ally within 1.5m', 'Running leap: Can jump 7.5m in length']
    },
    {
      name: 'Tiger',
      cr: 1,
      hp: 30,
      ac: 13,
      size: 'Large',
      speed: 12,
      stats: { STR: 17, DEX: 16, CON: 14, INT: 3, WIS: 12, CHA: 8 },
      skills: ['Perception +3', 'Stealth +7'],
      senses: ['Darkvision 18m', 'Passive Perception 13'],
      attacks: [
        {
          name: 'Rend',
          attackBonus: 5,
          damage: '2d6+3',
          damageType: 'slashing',
          reach: 1.5,
          effect: 'If hitting Large or smaller: prone'
        }
      ],
      special: ['Fast getaway: Can use Disengage or Hide as bonus action']
    },
    {
      name: 'Giant Eagle',
      cr: 1,
      hp: 26,
      ac: 13,
      size: 'Large',
      speed: 3,
      flySpeed: 24,
      stats: { STR: 16, DEX: 17, CON: 13, INT: 8, WIS: 14, CHA: 10 },
      skills: ['Perception +6'],
      senses: ['Darkvision 36m', 'Passive Perception 16'],
      attacks: [
        {
          name: 'Multiattack',
          attackBonus: 5,
          damage: '0',
          damageType: 'special',
          effect: 'Two claw attacks'
        },
        {
          name: 'Claws',
          attackBonus: 5,
          damage: '1d4+3',
          damageType: 'slashing',
          reach: 1.5
        }
      ],
      special: ['Keen sight: Can see 3 times farther']
    },
    {
      name: 'Giant Hyena',
      cr: 1,
      hp: 45,
      ac: 12,
      size: 'Large',
      speed: 15,
      stats: { STR: 16, DEX: 14, CON: 14, INT: 2, WIS: 12, CHA: 7 },
      skills: ['Perception +3'],
      senses: ['Darkvision 18m', 'Passive Perception 13'],
      attacks: [
        {
          name: 'Bite',
          attackBonus: 5,
          damage: '2d6+3',
          damageType: 'piercing',
          reach: 1.5
        }
      ],
      special: ['Rampage: +2d6 damage if target already bloodied']
    },
    {
      name: 'Giant Octopus',
      cr: 1,
      hp: 45,
      ac: 11,
      size: 'Large',
      speed: 3,
      swimSpeed: 18,
      stats: { STR: 17, DEX: 13, CON: 13, INT: 5, WIS: 10, CHA: 4 },
      skills: ['Perception +4', 'Stealth +5'],
      senses: ['Darkvision 18m', 'Passive Perception 14'],
      attacks: [
        {
          name: 'Tentacles',
          attackBonus: 5,
          damage: '2d6+3',
          damageType: 'bludgeoning',
          reach: 3,
          effect: 'DC 13 CON: Grappled by 8 tentacles'
        }
      ],
      special: ['Ink cloud (1/day)', 'Water breathing: 1 hour out of water']
    }
  ],
  6: [
    {
      name: 'Giant Constrictor Snake',
      cr: 2,
      hp: 60,
      ac: 12,
      size: 'Huge',
      speed: 9,
      swimSpeed: 9,
      stats: { STR: 19, DEX: 14, CON: 12, INT: 1, WIS: 10, CHA: 3 },
      skills: ['Perception +2'],
      senses: ['Blindsight 3m', 'Passive Perception 12'],
      attacks: [
        {
          name: 'Bite',
          attackBonus: 6,
          damage: '2d6+4',
          damageType: 'piercing',
          reach: 3,
          effect: 'Constrict: DC 14 STR to escape'
        },
        {
          name: 'Constrict',
          attackBonus: 0,
          damage: '2d8+4',
          damageType: 'bludgeoning',
          reach: 0,
          effect: 'DC 14 STR: Grappled + 2d8 damage'
        }
      ],
      special: ['Multiattack: Bite + Constrict']
    }
  ]
};

export const getBeastsForLevel = (druidLevel: number): BeastStats[] => {
  const beasts: BeastStats[] = [];
  
  if (druidLevel >= 8) {
    beasts.push(...WILD_SHAPE_BEASTS[8]);
  }
  
  if (druidLevel >= 6) {
    beasts.push(...WILD_SHAPE_BEASTS[6]);
  }
  
  if (druidLevel >= 4) {
    beasts.push(...WILD_SHAPE_BEASTS[4]);
  }
  
  if (druidLevel >= 2) {
    beasts.push(...WILD_SHAPE_BEASTS[2]);
  }
  
  return beasts;
};

// --- PUGILIST COMPANION (Dog and Hound subclass) ---
// Hound stats scale with Pugilist level (all computed at runtime):
// AC: 12 + Pugilist's CON modifier
// HP: 5 + 5 × Pugilist level
// Bite: 2d4 + 2 + Pugilist's CON modifier (attack bonus: 4 + PB)
// Pack Bond: Add PB to ability checks and saving throws
// Speed 40 ft., Medium Beast, Neutral
export const PUGILIST_HOUND_TEMPLATE: BeastStats = {
  name: 'Hound',
  cr: 0,
  hp: 0,
  ac: 0,
  size: 'Medium',
  speed: 40,
  stats: { STR: 14, DEX: 14, CON: 12, INT: 4, WIS: 12, CHA: 8 },
  senses: ['Passive Perception 11'],
  attacks: [
    {
      name: 'Bite',
      attackBonus: 0,
      damage: '2d4+2',
      damageType: 'Bludgeoning',
      reach: 1.5,
      effect: 'DC 8 + CON + PB or Grappled/Prone/Pushed'
    }
  ]
};

export const getBeastByName = (name: string): BeastStats | undefined => {
  const allBeasts = [
    ...WILD_SHAPE_BEASTS[2],
    ...WILD_SHAPE_BEASTS[4],
    ...WILD_SHAPE_BEASTS[6],
    ...WILD_SHAPE_BEASTS[8],
  ];
  return allBeasts.find(b => b.name.toLowerCase() === name.toLowerCase());
};
