import { Ability } from '../types';

export interface BeastStats {
  name: string;
  cr: number;
  hp: number;
  ac: number;
  size: 'Tiny' | 'Small' | 'Medium' | 'Large';
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
      name: 'Lobo',
      cr: 0.25,
      hp: 11,
      ac: 12,
      size: 'Medium',
      speed: 12,
      stats: { STR: 12, DEX: 15, CON: 12, INT: 3, WIS: 12, CHA: 6 },
      skills: ['Percepción +5', 'Sigilo +4'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 15'],
      attacks: [
        {
          name: 'Mordisco',
          attackBonus: 4,
          damage: '1d6+2',
          damageType: 'perforante',
          reach: 1.5,
          effect: 'Si impacta a criatura Mediana o más pequeña, objetivo derribado'
        }
      ],
      special: ['Atacar en manada: Ventaja contra enemigos si aliado a 1.5m']
    },
    {
      name: 'Araña',
      cr: 0.25,
      hp: 11,
      ac: 12,
      size: 'Small',
      speed: 6,
      climbSpeed: 6,
      stats: { STR: 12, DEX: 16, CON: 12, INT: 2, WIS: 12, CHA: 4 },
      skills: ['Sigilo +6'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 12'],
      attacks: [
        {
          name: 'Mordisco',
          attackBonus: 5,
          damage: '1d6+3',
          damageType: 'perforante',
          reach: 1.5,
          effect: 'DC 10 CON o queda envenenado'
        }
      ],
      special: ['Trepar difícil: ignora restricciones de movimiento', 'Web Walker: ignora telarañas']
    },
    {
      name: 'Rata',
      cr: 0,
      hp: 4,
      ac: 10,
      size: 'Tiny',
      speed: 6,
      climbSpeed: 6,
      stats: { STR: 2, DEX: 11, CON: 10, INT: 2, WIS: 10, CHA: 4 },
      skills: ['Percepción +2'],
      senses: ['Visión en la oscuridad 9m', 'Percepción pasiva 12'],
      attacks: [
        {
          name: 'Mordisco',
          attackBonus: 0,
          damage: '1',
          damageType: 'perforante',
          reach: 1.5
        }
      ],
      special: ['Ágil: no provoca AO al alejarse']
    },
    {
      name: 'Caballo de monta',
      cr: 0.25,
      hp: 13,
      ac: 11,
      size: 'Large',
      speed: 18,
      stats: { STR: 16, DEX: 13, CON: 12, INT: 2, WIS: 11, CHA: 7 },
      skills: ['Percepción +2'],
      senses: ['Percepción pasiva 12'],
      attacks: [
        {
          name: 'Cascos',
          attackBonus: 3,
          damage: '1d8+2',
          damageType: 'contundente',
          reach: 1.5
        }
      ]
    },
    {
      name: 'Jabalí',
      cr: 0.25,
      hp: 13,
      ac: 11,
      size: 'Medium',
      speed: 12,
      stats: { STR: 13, DEX: 11, CON: 14, INT: 2, WIS: 9, CHA: 5 },
      skills: ['Percepción +2'],
      senses: ['Percepción pasiva 11'],
      attacks: [
        {
          name: 'Cornada',
          attackBonus: 3,
          damage: '1d6+1',
          damageType: 'perforante',
          reach: 1.5,
          effect: 'Si se movió 6m+ en línea recta: derribado + 1d6 adicional'
        }
      ],
      special: ['Furia maltrecha: Ventaja si tiene menos de la mitad de PG']
    }
  ],
  4: [ // Level 4-7: CR 1/4, + CR 1/2
    {
      name: 'Búho gigante',
      cr: 0.25,
      hp: 19,
      ac: 12,
      size: 'Large',
      speed: 1.5,
      flySpeed: 18,
      stats: { STR: 13, DEX: 15, CON: 12, INT: 10, WIS: 14, CHA: 10 },
      skills: ['Percepción +6', 'Sigilo +6'],
      senses: ['Visión en la oscuridad 36m', 'Percepción pasiva 16'],
      attacks: [
        {
          name: 'Garras',
          attackBonus: 4,
          damage: '1d10+2',
          damageType: 'cortante',
          reach: 1.5
        }
      ],
      special: ['Pasar volando: No provoca AO al alejarse volando']
    },
    {
      name: 'Caballo de guerra',
      cr: 0.5,
      hp: 19,
      ac: 11,
      size: 'Large',
      speed: 18,
      stats: { STR: 18, DEX: 12, CON: 13, INT: 2, WIS: 12, CHA: 7 },
      skills: ['Percepción +3'],
      senses: ['Percepción pasiva 13'],
      attacks: [
        {
          name: 'Cascos',
          attackBonus: 6,
          damage: '2d4+4',
          damageType: 'contundente',
          reach: 1.5,
          effect: 'Si se movió 6m+: +2d4 daño y derribado'
        }
      ]
    },
    {
      name: 'Cocodrilo',
      cr: 0.5,
      hp: 13,
      ac: 12,
      size: 'Large',
      speed: 6,
      swimSpeed: 9,
      stats: { STR: 15, DEX: 10, CON: 13, INT: 2, WIS: 10, CHA: 5 },
      skills: ['Sigilo +2'],
      senses: ['Percepción pasiva 10'],
      attacks: [
        {
          name: 'Mordisco',
          attackBonus: 4,
          damage: '1d8+2',
          damageType: 'perforante',
          reach: 1.5,
          effect: 'DC 12 para escapar de agarre. Aguantar respiración 1 hora.'
        }
      ],
      special: ['Aguantar respiración: 1 hora']
    }
  ],
  8: [ // Level 8+: CR 1, includes fly speed options
    {
      name: 'Oso pardo',
      cr: 1,
      hp: 22,
      ac: 11,
      size: 'Large',
      speed: 12,
      climbSpeed: 9,
      stats: { STR: 17, DEX: 12, CON: 15, INT: 2, WIS: 13, CHA: 7 },
      skills: ['Percepción +3'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 13'],
      attacks: [
        {
          name: 'Ataque múltiple',
          attackBonus: 5,
          damage: '0',
          damageType: 'especial',
          effect: 'Mordisco + Garras como un ataque'
        },
        {
          name: 'Garras',
          attackBonus: 5,
          damage: '1d4+3',
          damageType: 'cortante',
          reach: 1.5,
          effect: 'Si impacta: objetivo derribado'
        },
        {
          name: 'Mordisco',
          attackBonus: 5,
          damage: '1d8+3',
          damageType: 'perforante',
          reach: 1.5
        }
      ]
    },
    {
      name: 'León',
      cr: 1,
      hp: 22,
      ac: 12,
      size: 'Large',
      speed: 15,
      stats: { STR: 17, DEX: 15, CON: 11, INT: 3, WIS: 12, CHA: 8 },
      skills: ['Percepción +3', 'Sigilo +4'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 13'],
      attacks: [
        {
          name: 'Ataque múltiple',
          attackBonus: 5,
          damage: '0',
          damageType: 'especial',
          effect: 'Dos ataques de desgarro'
        },
        {
          name: 'Desgarro',
          attackBonus: 5,
          damage: '1d8+3',
          damageType: 'cortante',
          reach: 1.5
        },
        {
          name: 'Rugido',
          attackBonus: 0,
          damage: '0',
          damageType: 'miedo',
          effect: 'DC 13 SAB: criaturas a 4.5m asustadas'
        }
      ],
      special: ['Atacar en manada: Ventaja si aliado a 1.5m', 'Saltar con carrera: Puede saltar 7.5m en longitud']
    },
    {
      name: 'Tigre',
      cr: 1,
      hp: 30,
      ac: 13,
      size: 'Large',
      speed: 12,
      stats: { STR: 17, DEX: 16, CON: 14, INT: 3, WIS: 12, CHA: 8 },
      skills: ['Percepción +3', 'Sigilo +7'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 13'],
      attacks: [
        {
          name: 'Desgarro',
          attackBonus: 5,
          damage: '2d6+3',
          damageType: 'cortante',
          reach: 1.5,
          effect: 'Si impacta a Grande o menor: derribado'
        }
      ],
      special: ['Huida veloz: Puede usar Destrabarse o Esconderse como acción bonus']
    },
    {
      name: 'Águila gigante',
      cr: 1,
      hp: 26,
      ac: 13,
      size: 'Large',
      speed: 3,
      flySpeed: 24,
      stats: { STR: 16, DEX: 17, CON: 13, INT: 8, WIS: 14, CHA: 10 },
      skills: ['Percepción +6'],
      senses: ['Visión en la oscuridad 36m', 'Percepción pasiva 16'],
      attacks: [
        {
          name: 'Ataque múltiple',
          attackBonus: 5,
          damage: '0',
          damageType: 'especial',
          effect: 'Dos ataques de garra'
        },
        {
          name: 'Garras',
          attackBonus: 5,
          damage: '1d4+3',
          damageType: 'cortante',
          reach: 1.5
        }
      ],
      special: ['Vista de águila: Puede ver 3 veces más lejos']
    },
    {
      name: 'Hiena gigante',
      cr: 1,
      hp: 45,
      ac: 12,
      size: 'Large',
      speed: 15,
      stats: { STR: 16, DEX: 14, CON: 14, INT: 2, WIS: 12, CHA: 7 },
      skills: ['Percepción +3'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 13'],
      attacks: [
        {
          name: 'Mordisco',
          attackBonus: 5,
          damage: '2d6+3',
          damageType: 'perforante',
          reach: 1.5
        }
      ],
      special: ['Rabia: +2d6 daño si objetivo ya maltrecho']
    },
    {
      name: 'Pulpo gigante',
      cr: 1,
      hp: 45,
      ac: 11,
      size: 'Large',
      speed: 3,
      swimSpeed: 18,
      stats: { STR: 17, DEX: 13, CON: 13, INT: 5, WIS: 10, CHA: 4 },
      skills: ['Percepción +4', 'Sigilo +5'],
      senses: ['Visión en la oscuridad 18m', 'Percepción pasiva 14'],
      attacks: [
        {
          name: 'Tentáculos',
          attackBonus: 5,
          damage: '2d6+3',
          damageType: 'contundente',
          reach: 3,
          effect: 'DC 13 CON: Agarrado por 8 tentáculos'
        }
      ],
      special: ['Nube de tinta (1/día)', 'Respirar agua: 1 hora fuera del agua']
    }
  ],
  6: [
    {
      name: 'Serpiente constrictora gigante',
      cr: 2,
      hp: 60,
      ac: 12,
      size: 'Huge',
      speed: 9,
      swimSpeed: 9,
      stats: { STR: 19, DEX: 14, CON: 12, INT: 1, WIS: 10, CHA: 3 },
      skills: ['Percepción +2'],
      senses: ['Visión ciega 3m', 'Percepción pasiva 12'],
      attacks: [
        {
          name: 'Mordisco',
          attackBonus: 6,
          damage: '2d6+4',
          damageType: 'perforante',
          reach: 3,
          effect: 'Constreñir: CD 14 STR para escapar'
        },
        {
          name: 'Constreñir',
          attackBonus: 0,
          damage: '2d8+4',
          damageType: 'contundente',
          reach: 0,
          effect: 'DC 14 STR: Agarrado + 2d8 daño'
        }
      ],
      special: ['Ataque múltiple: Mordisco + Constreñir']
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

export const getBeastByName = (name: string): BeastStats | undefined => {
  const allBeasts = [
    ...WILD_SHAPE_BEASTS[2],
    ...WILD_SHAPE_BEASTS[4],
    ...WILD_SHAPE_BEASTS[6],
    ...WILD_SHAPE_BEASTS[8],
  ];
  return allBeasts.find(b => b.name.toLowerCase() === name.toLowerCase());
};
