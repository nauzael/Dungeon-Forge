
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const sorcerer = {
  details: { 
    name: 'Sorcerer', 
    description: 'Sorcerers carry innate magic sealed within their being. They don\'t learn magic; the raw, seething power is part of them, inherited through lineage or strange events.', 
    traits: [
        { name: 'Spellcasting', description: 'Innate Charisma-based arcane magic. You are a prepared spellcaster.' }, 
        { name: 'Innate Sorcery', description: 'Bonus action: For 1 min, your save DC increases by 1 and you have advantage on spell attack rolls. (2 uses/Long Rest).' }, 
        { name: 'Font of Magic', description: 'Sorcery Points reserve (equal to your level starting at level 2). Use them to create spell slots or fuel your Metamagic.' }
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
        description: 'Your innate magic comes from the gift of a dragon. Perhaps an ancient dragon facing death bequeathed some of its magical power to you or your ancestor. You might have absorbed magic from a site infused with dragons\' power. Or perhaps you handled a treasure taken from a dragon\'s hoard that was steeped in draconic power.',
        features: { 
            3: [
                { name: 'Draconic Resilience', description: 'Your Hit Point maximum increases by 3, and it increases by 1 whenever you gain another Sorcerer level. Parts of you are covered by dragon-like scales. While you aren\'t wearing armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers.' },
                { name: 'Draconic Spells', description: 'Always prepared: 3: Alter Self, Chromatic Orb, Command, Dragon\'s Breath; 5: Fear, Fly; 7: Arcane Eye, Charm Monster; 9: Legend Lore, Summon Dragon.' }
            ],
            6: [{ name: 'Elemental Affinity', description: 'Choose one damage type from Acid, Cold, Fire, Lightning, or Poison. You have Resistance to that damage type, and when you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell.' }],
            14: [{ name: 'Dragon Wings', description: 'As a Bonus Action, you can cause draconic wings to appear on your back. The wings last for 1 hour or until you dismiss them (no action required). For the duration, you have a Fly Speed of 60 feet. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 3 Sorcery Points (no action required) to restore your use of it.' }],
            18: [{ name: 'Dragon Companion', description: 'You can cast Summon Dragon without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn\'t require Concentration. If you do so, the spell\'s duration becomes 1 minute for that casting.' }]
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
                { name: 'Wild Magic Surge', description: 'Once per turn, you can roll 1d20 immediately after you cast a Sorcerer spell with a spell slot. If you roll a 20, roll on the Wild Magic Surge table to create a magical effect. If the magical effect is a spell, it is too wild to be affected by your Metamagic.' },
                { name: 'Tides of Chaos', description: 'You can manipulate chaos itself to give yourself Advantage on one D20 Test before you roll the d20. Once you do so, you must cast a Sorcerer spell with a spell slot or finish a Long Rest before you can use this feature again. If you do cast a Sorcerer spell with a spell slot before you finish a Long Rest, you automatically roll on the Wild Magic Surge table.' }
            ],
            6: [{ name: 'Bend Luck', description: 'Immediately after another creature you can see rolls the d20 for a D20 Test, you can take a Reaction and spend 1 Sorcery Point to roll 1d4 and apply the number rolled as a bonus or penalty (your choice) to the d20 roll.' }],
            14: [{ name: 'Controlled Chaos', description: 'Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number.' }],
            18: [{ name: 'Tamed Surge', description: 'Immediately after you cast a Sorcerer spell with a spell slot, you can create an effect of your choice from the Wild Magic Surge table instead of rolling on that table. You can choose any effect in the table except for the final row, and if the chosen effect involves a roll, you must make it. Once you use this feature, you can\'t do so again until you finish a Long Rest.' }]
        }
    },
    {
        name: 'Clockwork Sorcery',
        description: 'The cosmic force of order has suffused you with magic. That power arises from Mechanus or a realm like it—a plane of existence shaped entirely by clockwork efficiency. You or someone from your lineage might have become entangled in the machinations of modrons.',
        features: {
            3: [
                { name: 'Clockwork Spells', description: 'Always prepared: 3: Aid, Alarm, Lesser Restoration, Protection from Evil and Good; 5: Dispel Magic, Protection from Energy; 7: Freedom of Movement, Summon Construct; 9: Greater Restoration, Wall of Force.' },
                { name: 'Restore Balance', description: 'When a creature you can see within 60 feet of yourself is about to roll a d20 with Advantage or Disadvantage, you can take a Reaction to prevent the roll from being affected by Advantage and Disadvantage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.' }
            ],
            6: [{ name: 'Bastion of Law', description: 'As a Magic action, you can expend 1 to 5 Sorcery Points to create a magical ward around yourself or another creature you can see within 30 feet of yourself. The ward is represented by a number of d8s equal to the number of Sorcery Points spent. When the warded creature takes damage, it can expend a number of those dice, roll them, and reduce the damage taken by the total rolled. The ward lasts until you finish a Long Rest or until you use this feature again.' }],
            14: [{ name: 'Trance of Order', description: 'As a Bonus Action, you can enter this state for 1 minute. For the duration, attack rolls against you can\'t benefit from Advantage, and whenever you make a D20 Test, you can treat a roll of 9 or lower on the d20 as a 10. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.' }],
            18: [{ name: 'Clockwork Cavalcade', description: 'As a Magic action, you summon spirits of order in a 30-foot Cube. The spirits are intangible and invulnerable, and they create one of the following effects: Heal (restore up to 100 HP), Repair (fix damaged objects), or Dispel (end every spell of level 6 and lower). Once you use this action, you can\'t use it again until you finish a Long Rest unless you spend 7 Sorcery Points (no action required) to restore your use of it.' }]
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
                { name: 'Spellfire Burst', description: 'When you spend at least 1 Sorcery Point as part of a Magic action or a Bonus Action on your turn, you can unleash one of the following effects: Bolstering Flames (you or one creature within 30 ft gains Temporary Hit Points equal to 1d4 plus your Charisma modifier) or Radiant Fire (one creature within 30 ft takes 1d4 Fire or Radiant damage).' },
                { name: 'Spellfire Spells', description: 'Always prepared: 3: Cure Wounds, Guiding Bolt, Lesser Restoration, Scorching Ray; 5: Aura of Vitality, Dispel Magic; 7: Fire Shield, Wall of Fire; 9: Greater Restoration, Flame Strike.' }
            ],
            6: [{ name: 'Absorb Spells', description: 'You always have Counterspell prepared. Additionally, whenever a target fails the saving throw against a Counterspell you cast, you regain 1d4 Sorcery Points.' }],
            14: [{ name: 'Honed Spellfire', description: 'Your Spellfire Burst improves. You add your Sorcerer level to the Temporary Hit Points gained from Bolstering Flames, and the damage of your Radiant Fire increases to 1d8.' }],
            18: [{ name: 'Crown of Spellfire', description: 'When you use Innate Sorcery, you can alter it and infuse yourself with the essence of spellfire, gaining the following benefits: Burning Life Force (when hit, expend Hit Point Dice to reduce damage), Flight (60 ft Fly Speed and hover), and Spell Avoidance (take no damage on successful save instead of half). Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it.' }]
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
                { name: 'Psionics', description: 'You have a limited telepathic sense. As a Bonus Action, you can establish the Telepathic Channel with one creature you can see within 30 feet of yourself. You can speak telepathically to any creature with which you have established this connection, and the creature can speak telepathically back to you. This connection lasts until you establish a new connection, finish a Long Rest, or the creature is reduced to 0 Hit Points.' }
            ],
            6: [{ name: 'Psionic Sorcery', description: 'When you cast a level 1+ spell from your Aberrant Spells, you can spend a number of Sorcery Points equal to the spell\'s level to cast it without Verbal, Somatic, or Material components (unless the Material components are consumed by the spell or have a cost specified).' }],
            14: [{ name: 'Revelation', description: 'You can cast Confusion without spending a spell slot. Once you use this feature, you can\'t use it again until you finish a Long Rest. Intelligence is your spellcasting ability for this spell.' }],
            18: [{ name: 'Warping Surge', description: 'As a Magic action, you can unleash a wave of mutagenic magic. Each creature of your choice within 30 feet of you must make a Charisma saving throw. On a failed save, the creature takes 5d10 Psychic damage and has the Confused condition until the start of your next turn. On a successful save, the creature takes half as much damage. Once you use this feature, you can\'t use it again until you finish a Long Rest unless you spend 7 Sorcery Points (no action required) to restore your use of it.' }]
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