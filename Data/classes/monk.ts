
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const monk = {
  details: { name: 'Monk', description: 'Monks focus their internal power to create extraordinary, even supernatural, effects. They channel uncanny speed and strength into their attacks, with or without the use of weapons.', traits: [{   name: 'Martial Arts', description: 'Your martial arts practice gives you mastery in combat using your Unarmed Strikes and Monk weapons (Simple melee and Light Martial melee weapons). You gain: Unarmed Strike as a Bonus Action, Martial Arts Die (1d6, scales with level), and Finesse Attacks (you can use Dexterity instead of Strength for attack and damage).' }, { name: 'Unarmored Defense', description: 'While you aren\'t wearing armor or a Shield, your base AC is 10 + Dexterity + Wisdom.' }] } as DetailData,
  hitDie: 8,
  savingThrows: ['STR', 'DEX'] as Ability[],
  statPriorities: ['DEX', 'WIS', 'CON'] as Ability[],
  skillData: { count: 2, options: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] as Skill[] },
  progression: { 1: ['Martial Arts', 'Unarmored Defense'], 2: ['Monk\'s Focus', 'Unarmored Movement', 'Uncanny Metabolism'], 3: ['Deflect Attacks', 'Monk Subclass'], 4: ['Ability Score Improvement', 'Slow Fall'], 5: ['Extra Attack', 'Stunning Strike'], 6: ['Empowered Strikes', 'Monk Subclass'], 7: ['Evasion'], 8: ['Ability Score Improvement'], 9: ['Acrobatic Movement'], 10: ['Heightened Focus', 'Self-Restoration'], 11: ['Monk Subclass'], 12: ['Ability Score Improvement'], 13: ['Deflect Energy'], 14: ['Disciplined Survivor'], 15: ['Perfect Focus'], 16: ['Ability Score Improvement'], 17: ['Monk Subclass'], 18: ['Superior Defense'], 19: ['Epic Boon Feat'], 20: ['Body and Mind'] } as Record<number, string[]>,
  subclasses: [
      { 
          name: 'Warrior of the Open Hand', 
          description: 'Masters of unarmed combat who learn techniques to push and trip opponents.', 
          features: { 
              3: [{ name: 'Open Hand Technique', description: 'When you hit with Flurry of Blows, you impose: Stun (can\'t take reactions until start of its turn), Push (Strength save or 15 feet), or Knock Down (Dexterity save or Prone).' }],
              6: [{ name: 'Wholeness of Body', description: 'Bonus Action: roll your Martial Arts die, regain HP = result + Wisdom. Uses = Wisdom modifier per Long Rest.' }],
              11: [{ name: 'Fleet Step', description: 'When you take a Bonus Action other than Step of the Wind, you can also use it immediately after.' }],
              17: [{ name: 'Quivering Palm', description: 'When you hit with an Unarmed Strike, spend 4 Focus Points to start vibrations lasting days = your level. With an action, you end the vibrations dealing 10d12 Force damage (Constitution save for half). Only one creature at a time.' }]
          } 
      },
      { 
          name: 'Warrior of Shadow', 
          description: 'Warriors of Shadow practice stealth and subterfuge, harnessing the power of the Shadowfell. They are at home in darkness, able to draw gloom around themselves to hide, leap from shadow to shadow, and take on a wraithlike form. (Harness Shadow Power for Stealth and Subterfuge)', 
          features: { 
              3: [{ name: 'Shadow Arts', description: 'You can spend 1 Focus Point to cast Darkness without components. You see inside the area. You can move the area at the start of each turn. You gain Darkvision 60 feet (or +60). You know the Minor Illusion cantrip with Wisdom.' }],
              6: [{ name: 'Shadow Step', description: 'While in Dim Light or Darkness, Bonus Action teleport 60 feet to a space also in dim light. Advantage on the next melee attack.' }],
              11: [{ name: 'Improved Shadow Step', description: 'Spend 1 Focus Point to ignore the dim light requirement. You can make an Unarmed Strike after teleporting.' }],
              17: [{ name: 'Cloak of Shadows', description: 'While in dim light, action + 3 Focus Points for 1 minute: Invisible, you move through occupied spaces, and Flurry of Blows without spending Focus Points.' }]
          } 
      },
      { 
          name: 'Warrior of the Elements', 
          description: 'Tap into the power of the Elemental Planes, focusing on elements to wreathe fists in fire or icy wind.', 
          features: { 
              3: [{ name: 'Elemental Attunement', description: 'Bonus Action, spend 1 Focus Point for 10 minutes: +10 foot range on Unarmed Strikes, Acid/Cold/Fire/Lightning/Thunder damage, and Strength save or pushed 10 feet.' }, { name: 'Manipulate Elements', description: 'You know the Elementalism cantrip with Wisdom.' }],
              6: [{ name: 'Elemental Burst', description: 'Action, spend 2 Focus Points. 20-foot sphere at 120 feet. Dexterity save: damage = 3 Martial Arts dice (choose type) or half.' }],
              11: [{ name: 'Stride of the Elements', description: 'While Elemental Attunement is active, you gain Flight and Swimming = speed.' }],
              17: [{ name: 'Elemental Epitome', description: 'While Attunement active: Resistance to the chosen type; movement without provoking Opportunity Attacks; once per turn extra Martial Arts die damage on hit.' }]
          } 
      },
      { 
          name: 'Warrior of Mercy', 
          description: 'Manipulate Forces of Life and Death. Warriors of Mercy manipulate the life force of others. These Monks are wandering physicians, but they bring a swift end to their enemies. They often wear masks, presenting themselves as faceless bringers of life and death.', 
          features: { 
              3: [
                  { name: 'Hand of Harm', description: 'Once per turn when you hit with an Unarmed Strike, spend 1 Focus Point for extra Necrotic damage = Martial Arts die + Wisdom.' },
                  { name: 'Hand of Healing', description: 'Action, spend 1 Focus Point to touch and restore HP = Martial Arts die + Wisdom. With Flurry of Blows, you can replace one attack with this without spending Focus Points.' },
                  { name: 'Implements of Mercy', description: 'Proficiency in Insight, Medicine, and Herbalism Kit.' }
              ],
              6: [{ name: 'Physician\'s Touch', description: 'Hand of Harm: can also Poison until end of your next turn. Hand of Healing: also ends Blinded, Deafened, Paralyzed, Poisoned, or Stunned. Uses = Wis per Long Rest.' }],
              11: [{ name: 'Flurry of Healing and Harm', description: 'Flurry of Blows can replace attacks with Hand of Healing at no cost. Hand of Harm at no cost when damaging with Flurry. Uses = Wis per Long Rest.' }],
              17: [{ name: 'Hand of Ultimate Mercy', description: 'Action, touch corpse of a creature that died within 24 hours, spend 5 Focus Points. Returns to life with 4d10 + Wis HP, removing conditions.' }]
          } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, INT: 10, CHA: 8 }
};

