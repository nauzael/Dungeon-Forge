
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const pugilist = {
  details: {
    name: 'Pugilist',
    description: 'Masters of unarmed combat who fight with grit, moxie, and sheer determination. Whether in back-alley brawls or the grandest arenas, Pugilists rely on their fists, wits, and an iron chin to overcome any foe.',
    traits: [
      { name: 'Fisticuffs', description: 'Mastery of combat using Unarmed Strikes and Pugilist weapons (Simple Melee & Improvised). Gain Bonus Unarmed Strike, Fisticuffs Die (1d8 scaling to 2d6), and Improved Improvisation (Improvised weapons gain Sap mastery).' },
      { name: 'Iron Chin', description: 'While wearing Light or no armor and no Shield, your base Armor Class equals 12 plus your Constitution modifier.' },
      { name: 'Moxie', description: 'You have Moxie Points to fuel abilities like Brace Up (temp HP), One-Two Punch (two Unarmed Strikes as BA), and Stick and Move (Unarmed Strike + Dash/Disengage). Points reset on Short/Long Rest.' }
    ]
  } as DetailData,
  hitDie: 10,
  savingThrows: ['STR', 'CON'] as Ability[],
  statPriorities: ['STR', 'CON', 'DEX'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Athletics', 'Insight', 'Intimidation', 'Perception', 'Survival'] as Skill[] },
  progression: {
    1: ['Fisticuffs', 'Iron Chin'],
    2: ['Moxie', 'Bloodied But Unbowed', 'Swagger Streak'],
    3: ['Heavy Hitter', 'Pugilist Subclass'],
    4: ['Ability Score Improvement', 'Dig Deep'],
    5: ['Extra Attack', 'Haymaker'],
    6: ['Moxie-Fueled Fists', 'Subclass Feature'],
    7: ['Down But Not Out'],
    8: ['Ability Score Improvement'],
    9: ['School of Hard Knocks'],
    10: ['Herculean', 'Shake It Off'],
    11: ['Subclass Feature'],
    12: ['Ability Score Improvement'],
    13: ['Dig Deeper'],
    14: ['Unbreakable'],
    15: ['Pugnacious'],
    16: ['Ability Score Improvement'],
    17: ['Subclass Feature'],
    18: ['Fighting Spirit'],
    19: ['Epic Boon'],
    20: ['Peak Physical Condition']
  } as Record<number, string[]>,
  subclasses: [
    {
      name: 'Dog and Hound',
      description: 'Fight side by side with a brawler\'s best friend. Pugilists know what it\'s like to be an underdog, so some form a battleforged bond with a canine companion.',
      features: {
        3: [
          { name: 'Brawler\'s Best Friend', description: 'You summon a Hound that draws strength from your resilience. It uses the Hound stat block (AC 12+CON, HP 5+5xPL, Speed 40ft, Pack Bond + PB to checks/saves). In combat, the hound acts on your turn; it Dodges unless you command it via Bonus Action or sacrifice an Attack. If the hound died within the last hour, you can take a Magic action and expend 2 Moxie Points to revive it after 1 minute. You can also summon a new hound during a Long Rest.' },
          { name: 'Mutt With Moxie', description: 'Your hound shares your Moxie benefits. Brace Up: hound gains same temp HP. One-Two Punch: hound can make attacks instead of you. Stick and Move: hound can Dash, Disengage, or Help.' }
        ],
        6: [{ name: 'Coordinated Attack', description: 'When you attack a creature and your hound is within 5ft of it, your hound can use Reaction to give you Advantage and deal +3d4 damage on a hit. The hound\'s attacks can deal Force damage.' }],
        11: [{ name: 'Hound\'s Best Friend', description: 'When a creature damages your hound, you can use Reaction to move half Speed and make one melee attack against that creature.' }],
        17: [{ name: 'Off The Chain', description: 'When your hound becomes Bloodied or takes damage while Bloodied, you can use Reaction to let it off the chain: it gains temp HP equal to 5xPL, +15ft Speed, and can Bite without BA for 1 minute. Once per Long Rest (or expend 3 Moxie Points to restore).' }]
      }
    },
    {
      name: 'Hand of Dread',
      description: 'Dabble with dread powers. In your darkest hour you pleaded for strength and a dread power took notice, granting eldritch might with strings attached.',
      features: {
        3: [
          { name: 'Black Magic', description: 'You learn two Warlock cantrips and one level 1 Warlock spell (cast once without spell slot per Long Rest). Constitution is your spellcasting ability. You can swap spells on level up.' },
          { name: 'Dread Hand', description: 'When you take the Attack action, manifest a monstrous limb for 1 minute. Gain: Revenging Strike (Reaction to make Unarmed Strike against attacker), Unslakeable Bloodlust (roll damage dice twice and use either result), and Whirlwind of Violence (reroll first missed Unarmed Strike each turn). Once per Short/Long Rest.' }
        ],
        6: [{ name: 'Deal with the Devil', description: 'Choose one option (changeable on Long Rest): Cloak of Shadows (cast Invisibility once without spell slot, regain on Short or Long Rest), Mask of Many Faces (cast Disguise Self at will), or Otherworldly Walk (cast Misty Step once without spell slot, regain on Short or Long Rest).' }],
        11: [{ name: 'Grotesque Growth', description: 'When you use Dread Hand, you gain Enlarge effect and 10ft reach. Once per Long Rest unless you take a level of Exhaustion to restore it.' }],
        17: [{ name: 'Fountain of Viscera', description: 'Magic action + 6 Moxie Points: target within reach must make Dex save (DC 8+STR+PB) or take 100 Piercing damage (50 on success). If reduced to 0 HP, creatures in 30ft Emanation make Wis save or become Frightened for 1 minute. Once per Long Rest.' }]
      }
    },
    {
      name: 'Piss and Vinegar',
      description: 'Throw barbs and hands. These Pugilists revel in their reputation as heels, using obscene curses and dirty tricks to win at any cost.',
      features: {
        3: [
          { name: 'Bad Attitude', description: 'You gain proficiency in the Intimidation skill if you don\'t have it already. Additionally, you gain a bonus to checks using this skill equal to your Strength modifier (minimum bonus of +1).' },
          { name: 'Salty Salute', description: 'Bonus Action: provoke a creature within 60ft that can see or hear you. Wis save (DC 8+CON+PB) or take Psychic damage equal to Fisticuffs die + CON mod and have Disadvantage on attack rolls against creatures other than you until the start of your next turn.' }
        ],
        6: [{ name: 'Dirty Tricks', description: 'Use one Dirty Trick per turn, each recharges on Short/Long Rest: Heelstomper (reduce Speed to 0 for 1 min, save ends), Low Blow (Advantage on attacks until next turn), Pocket Sand (Bonus Action, 10ft, Con save or Blinded until end of next turn).' }],
        11: [{ name: 'Mean Old Cuss', description: 'Bonus Action: choose up to your Pugilist level creatures within 30ft. Each must make Wis save or take Psychic damage (Fisticuffs + CON) and have Disadvantage attacking others. Once per Short/Long Rest (or expend 3 Moxie Points to restore).' }],
        17: [{ name: 'Dirtier Tricks', description: 'Additional Dirty Tricks (same recharge rules): Rabbit Punch (target loses Psychic resistance and has Disadvantage on saves), Sucker Punch (turn a hit into a Critical Hit rolling damage dice three times).' }]
      }
    },
    {
      name: 'Street Saint',
      description: 'Devote yourself to prayer and pummeling. These Pugilists draw on deep faith in the gods, emerging from trials with righteous resolve.',
      features: {
        3: [
          { name: 'Channel Divinity', description: 'Channel divine energy to fuel effects. Fists of Faith: BA to imbue fists for 1 minute, Unarmed Strikes deal +1d4 Radiant (2d4 vs Fiends/Undead). Grace of the Gods: BA for 1 minute, Resistance to Necrotic, +1d4 on saving throws. Once per Short/Long Rest.' },
          { name: 'Lay On Hands', description: 'You have a pool of healing equal to 3x Pugilist level. BA: touch a creature to restore HP from the pool. You can expend 5 points to cure the Poisoned condition.' }
        ],
        6: [{ name: 'Ravaged But Resolute', description: 'When you use Bloodied But Unbowed, you fully replenish your Lay On Hands pool. Once per Long Rest.' }],
        11: [{ name: 'Aura of Resilience', description: 'When you use Dig Deep, you radiate a protective aura in a 10ft Emanation for 10 minutes. Allies within gain Resistance to Bludgeoning, Piercing, and Slashing damage. Once per Long Rest.' }],
        17: [{ name: 'Hallowed Hands', description: 'Once per turn when you hit with Unarmed Strike or Pugilist weapon, you can expend points from your Lay On Hands pool to deal extra Radiant damage equal to points expended (double vs Fiends/Undead), up to your Pugilist level.' }]
      }
    },
    {
      name: 'Squared Circle',
      description: 'Drop and lock your foes. These wrestlers focus on controlling powerful opponents with chokeholds and arm bars, forcing submission.',
      features: {
        3: [
          { name: 'Groundwork', description: 'Compression Lock: At start of turn, deal Fisticuffs + STR damage to each creature you have Grappled (no action required). Inescapable: Expend 1 Moxie to give Disadvantage on grapple/shove saves. Stop and Drop: When you hit with Unarmed Strike and don\'t use a mastery property, you can use both the Grapple and Shove option.' },
          { name: 'Muscle Mass', description: 'Choose Acrobatics or Athletics. You gain proficiency, or Expertise if already proficient.' }
        ],
        6: [{ name: 'Meat Shield', description: 'While Grappling a creature, you gain Half Cover against others. When a creature misses you, you can use Reaction + 1 Moxie to redirect the attack to your Grappled target.' }],
        11: [{ name: 'Heavyweight', description: 'You count as one size larger for Grapple/Shove. You don\'t spend extra movement to move a Grappled creature your size or smaller.' }],
        17: [{ name: 'Clean Finish', description: 'When a creature ends its turn Grappled by you, use Reaction to force a Con save (escape DC) or become Incapacitated until end of next turn. If Bloodied and already Incapacitated, its HP drops to 0. Once per Long Rest.' }]
      }
    },
    {
      name: 'Sweet Science',
      description: 'Float like a butterfly, sting like a bee. These Pugilists hit hard, fast, and often, sometimes fighting for entertainment but always ready for a real scrap.',
      features: {
        3: [
          { name: 'Bare Knuckle Boxer', description: 'Your Unarmed Strikes score a Critical Hit on a roll of 19 or 20 on the d20.' },
          { name: 'Cross Counter', description: 'When you take damage from a melee attack, use Reaction + 1 Moxie to reduce the damage by 1d10 + STR + Pugilist level. If reduced to 0, make an Unarmed Strike or Pugilist weapon attack as part of the same Reaction.' }
        ],
        6: [{ name: 'Combo Maker', description: 'When you deal damage with an Unarmed Strike, instead of Grapple/Shove from Heavy Hitter, you can give yourself Advantage on attack rolls against that target until your next turn.' }],
        11: [{ name: 'Combo Breaker', description: 'When you use Cross Counter and reduce the triggering damage to 0, you regain 1 Moxie Point.' }],
        17: [{ name: 'Knock Out', description: 'Gain the following benefits. Coldcock: When you score a Critical Hit, the target must make a Con save (DC 8+STR+PB) or become Unconscious for 1 minute (ends on damage). Uppercut: When you hit with an Unarmed Strike, you can expend 1 Moxie and use Reaction to make the attack a Critical Hit (roll damage dice three times). Once per Short/Long Rest.' }]
      }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { STR: 15, CON: 14, DEX: 13, WIS: 12, CHA: 10, INT: 8 }
};
