
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const sorcerer = {
  details: { 
    name: 'Sorcerer', 
    description: 'Sorcerers carry innate magic sealed within their being. They don\'t learn magic; the raw, seething power is part of them, inherited through lineage or strange events.', 
    traits: [
        { name: 'Spellcasting', description: 'Innate Casting: you enjoy innate magic sealed within your being. You know 4 cantrips (more at levels 4 and 10). You prepare your spell list. Charisma is your spellcasting ability. You use an Arcane Focus.' }, 
        { name: 'Innate Sorcery', description: 'Bonus Action for 1 minute: your spell save DC increases by 1 and you have Advantage on spell attacks. 2 uses, regain on Long Rest.' }, 
        { name: 'Font of Magic', description: 'You have Sorcery Points (2, increasing with level). You can convert spell slots into points and vice versa (creating slots up to level 5). Points are regained on a Long Rest.' }
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
     9: ['—'],
     10: ['Metamagic'],
     11: ['—'],
     12: ['Ability Score Improvement'],
     13: ['—'],
     14: ['Subclass Feature'],
     15: ['—'],
     16: ['Ability Score Improvement'],
     17: ['Metamagic'], 
    18: ['Subclass Feature'], 
    19: ['Epic Boon Feat'], 
    20: ['Arcane Apotheosis'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Draconic Sorcery', 
        description: 'Your innate magic comes from the gift of a dragon. Perhaps an ancient dragon facing death bequeathed some of its magical power to you or your ancestor. You might have absorbed magic from a site infused with dragons\' power. Or perhaps you handled a treasure taken from a dragon\'s hoard that was steeped in draconic power.',
        features: { 
            3: [
                 { name: 'Draconic Resilience', description: 'Your HP maximum increases by 3 and by 1 for each Sorcerer level. Parts of your body are covered in dragon scales. Without armor, AC = 10 + Dexterity + Charisma.' },
                 { name: 'Draconic Spells', description: 'Always prepared: 3: Alter Self, Chromatic Orb, Command, Dragon\'s Breath; 5: Fear, Fly; 7: Arcane Eye, Charm Monster; 9: Legend Lore, Summon Dragon.' }
            ],
            6: [{ name: 'Elemental Affinity', description: 'Choose Acid, Cold, Fire, Lightning, or Poison. Resistance to that type. When casting a spell of that type, you add Charisma to one damage roll.' }],
            14: [{ name: 'Dragon Wings', description: 'Bonus Action: dragon wings for 1 hour, Fly 60 feet. Once per Long Rest or 3 SP.' }],
            18: [{ name: 'Dragon Companion', description: 'You cast Summon Dragon without a material component. Once without a spell slot per Long Rest. It may not require Concentration (1 min duration).' }]
        },
        alwaysPreparedSpells: {
            3: ['Alter Self', 'Chromatic Orb', 'Command', "Dragon's Breath"],
            5: ['Fear', 'Fly'],
            7: ['Arcane Eye', 'Charm Monster'],
            9: ['Legend Lore', 'Summon Dragon'],
        }
    },
    {
        name: 'Wild Magic Sorcery',
        description: 'Your innate magic stems from the forces of chaos that underlie the order of creation. You or an ancestor might have endured exposure to raw magic, perhaps through a planar portal leading to Limbo or the Elemental Planes. Perhaps you were blessed by a fey being or marked by a demon.',
        features: {
            3: [
                 { name: 'Wild Magic Surge', description: 'Once per turn after casting a Sorcerer spell with a slot, roll 1d20. On a 20, roll on the Wild Magic table. The effect cannot be altered by Metamagic.' },
                 { name: 'Tides of Chaos', description: 'Advantage on one check before rolling. Once per Long Rest. If you cast a spell before the Long Rest, you automatically roll on the table.' }
            ],
            6: [{ name: 'Bend Luck', description: 'After a creature\'s roll, Reaction, 1 SP: roll 1d4 and add or subtract to the result.' }],
            14: [{ name: 'Controlled Chaos', description: 'When rolling on the table, roll twice and use either result.' }],
            18: [{ name: 'Tamed Surge', description: 'After casting a spell, you choose the effect from the table (except the last row). Once per Long Rest.' }]
        }
    },
    {
        name: 'Clockwork Sorcery',
        description: 'The cosmic force of order has suffused you with magic. That power arises from Mechanus or a realm like it—a plane of existence shaped entirely by clockwork efficiency. You or someone from your lineage might have become entangled in the machinations of modrons.',
        features: {
            3: [
                 { name: 'Clockwork Spells', description: 'Always prepared: 3: Aid, Alarm, Lesser Restoration, Protection from Evil and Good; 5: Dispel Magic, Protection from Energy; 7: Freedom of Movement, Summon Construct; 9: Greater Restoration, Wall of Force.' },
                 { name: 'Restore Balance', description: 'When a creature within 60 feet is about to roll with Advantage/Disadvantage, Reaction to negate it. Uses = Charisma per Long Rest.' }
            ],
            6: [{ name: 'Bastion of Law', description: 'Magic action: spend 1-5 SP to create guardians (d8s). When the protected creature takes damage, spend dice to reduce it.' }],
            14: [{ name: 'Trance of Order', description: 'Bonus Action 1 min: attacks against you don\'t have Advantage; you treat 9- as 10 on checks. Once per Long Rest or 5 SP.' }],
            18: [{ name: 'Clockwork Cavalcade', description: 'Magic action: spirits in a 30-foot Cube. Heal (up to 100 HP), Repair, or Dispel (level 6- spells). Once per Long Rest or 7 SP.' }]
        },
        alwaysPreparedSpells: {
            3: ['Aid', 'Alarm', 'Lesser Restoration', 'Protection from Evil and Good'],
            5: ['Dispel Magic', 'Protection from Energy'],
            7: ['Freedom of Movement', 'Summon Construct'],
            9: ['Greater Restoration', 'Wall of Force'],
        }
    },
    {
        name: 'Spellfire Sorcery',
        description: 'Your innate power stems from the source of magic itself: the Weave. This connection manifests as a rare ability known as spellfire, and you surge with radiant bursts of this raw magic. Wielders of spellfire tend to have a penchant for wandering.',
        features: {
            3: [
                 { name: 'Spellfire Burst', description: 'When you spend 1+ SP as an Action/Bonus: Invigorating Flames (THP 1d4+Cha to self or creature within 30) or Radiant Fire (1d4 Fire/Radiant to a creature within 30). Once per turn.' },
                 { name: 'Spellfire Spells', description: 'Always prepared: 3: Cure Wounds, Guiding Bolt, Lesser Restoration, Scorching Ray; 5: Aura of Vitality, Dispel Magic; 7: Fire Shield, Wall of Fire; 9: Greater Restoration, Flame Strike.' }
            ],
            6: [{ name: 'Absorb Spells', description: 'You always have Counterspell prepared. When a target fails its save against your Counterspell, you regain 1d4 SP.' }],
            14: [{ name: 'Honed Spellfire', description: 'Invigorating Flames adds level to THP. Radiant Fire deals 1d8 damage.' }],
            18: [{ name: 'Crown of Spellfire', description: 'When using Innate Sorcery: Burn Life (reduce damage with Hit Dice), Flight (60, hover), Avoid Spells (no damage on success). Once per Long Rest or 5 SP.' }]
        },
        alwaysPreparedSpells: {
            3: ['Cure Wounds', 'Guiding Bolt', 'Lesser Restoration', 'Scorching Ray'],
            5: ['Aura of Vitality', 'Dispel Magic'],
            7: ['Fire Shield', 'Wall of Fire'],
            9: ['Greater Restoration', 'Flame Strike'],
        }
    },
    {
        name: 'Aberrant Sorcery',
        description: 'Your innate magic comes from the aberrant knowledge poured directly into your mind by creatures from distant realms. Perhaps an aboleth injected you with its saliva as a child, or a god of knowledge whispered secrets into your ear.',
        features: {
            3: [
                 { name: 'Aberrant Spells', description: 'Always prepared: 3: Arms of Hadar, Crown of Madness; 5: Darkness, Hunger of Hadar; 7: Arcane Eye, Evard\'s Black Tentacles; 9: Creation, Synaptic Static.' },
                 { name: 'Psionics', description: 'Bonus Action: establish a Telepathic Channel with a creature within 30 feet. Telepathic communication while within miles = Charisma, minutes = level.' }
            ],
            6: [{ name: 'Psionic Sorcery', description: 'When casting a spell from your Aberrant Spells with a slot, you can spend SP = the spell\'s level to cast it without components.' }],
            14: [{ name: 'Revelation', description: 'You cast Confusion without a spell slot. Once per Long Rest.' }],
            18: [{ name: 'Warping Surge', description: 'Magic action: each creature within 30 feet makes a Charisma save: 5d10 Psychic and Confused (fail) or half (success). Once per Long Rest or 7 SP.' }]
        },
        alwaysPreparedSpells: {
            3: ['Arms of Hadar', 'Crown of Madness'],
            5: ['Darkness', 'Hunger of Hadar'],
            7: ['Arcane Eye', "Evard's Black Tentacles"],
            9: ['Creation', 'Synaptic Static'],
        }
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { CHA: 15, CON: 14, DEX: 13, WIS: 12, INT: 10, STR: 8 }
};