
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const monk = {
  details: { name: 'Monk', description: 'Monks focus their internal power to create extraordinary, even supernatural, effects. They channel uncanny speed and strength into their attacks, with or without the use of weapons.', traits: [{ name: 'Martial Arts', description: 'Practice of combat styles that use your Unarmed Strike and Monk Weapons (Simple Melee & Light Martial). Gain Dexterous Attacks (DEX for Atk/Dmg/Grapple), Bonus Unarmed Strike, and Martial Arts Die.' }, { name: 'Unarmored Defense', description: 'While you aren’t wearing armor or wielding a Shield, your base Armor Class equals 10 + Dexterity modifier + Wisdom modifier.' }] } as DetailData,
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
              3: [{ name: 'Open Hand Technique', description: 'Whenever you hit a creature with an attack granted by your Flurry of Blows, you can impose one of the following effects: Addle (can\'t make opportunity attacks), Push (Strength save or pushed 15ft), or Topple (Dexterity save or Prone condition).' }],
              6: [{ name: 'Wholeness of Body', description: 'You gain the ability to heal yourself. As a Bonus Action, roll your Martial Arts die. You regain HP equal to the number rolled plus your Wisdom modifier (min 1). You can use this a number of times equal to your Wisdom modifier (min 1) per Long Rest.' }],
              11: [{ name: 'Fleet Step', description: 'When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after that Bonus Action.' }],
              17: [{ name: 'Quivering Palm', description: 'As a Bonus Action, you can expend 4 Focus Points to start a series of vibrations within the body of a creature you have hit with an Unarmed Strike on your turn. The vibrations last for a number of days equal to your Monk level. At any point during that time, you can use an Action to end the vibrations and deal 10d12 Force damage to the target. The target can make a Constitution saving throw against your ki save DC, taking half damage on a success. Only one creature can suffer from this condition at a time.' }]
          } 
      },
      { 
          name: 'Warrior of Shadow', 
          description: 'Warriors of Shadow practice stealth and subterfuge, harnessing the power of the Shadowfell. They are at home in darkness, able to draw gloom around themselves to hide, leap from shadow to shadow, and take on a wraithlike form. (Harness Shadow Power for Stealth and Subterfuge)', 
          features: { 
              3: [{ name: 'Shadow Arts', description: 'You have learned to draw on the power of the Shadowfell. DARKNESS: You can expend 1 Focus Point to cast the Darkness spell without needing spell components. You can see within the spell\'s area when you cast it with this feature. While the spell persists, you can move its area of Darkness to a space within 60 feet of yourself at the start of each of your turns. DARKVISION: You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. SHADOWY FIGMENTS: You know the Minor Illusion spell. Wisdom is your spellcasting ability for it.' }],
              6: [{ name: 'Shadow Step', description: 'While entirely within Dim Light or Darkness, you can use a Bonus Action to teleport up to 60 feet to an unoccupied space you can see that is also in Dim Light or Darkness. You then have Advantage on the next melee attack you make before the end of the current turn.' }],
              11: [{ name: 'Improved Shadow Step', description: 'You can draw on your Shadowfell connection to empower your teleportation. When you use your Shadow Step, you can expend 1 Focus Point to remove the requirement that you must start and end in Dim Light or Darkness for that use of the feature. As part of this Bonus Action, you can make an Unarmed Strike immediately after you teleport.' }],
              17: [{ name: 'Cloak of Shadows', description: 'As an Action while entirely within Dim Light or Darkness, you can expend 3 Focus Points to shroud yourself with shadows for 1 minute, until you have the Incapacitated condition, or until you end your turn in Bright Light. While shrouded: INVISIBILITY - You have the Invisible condition. PARTIALLY INCORPOREAL - You can move through occupied spaces as if they were Difficult Terrain. If you end your turn in such a space, you are shunted to the last unoccupied space you were in. SHADOW FLURRY - You can use your Flurry of Blows without expending any Focus Points.' }]
          } 
      },
      { 
          name: 'Warrior of the Elements', 
          description: 'Tap into the power of the Elemental Planes, focusing on elements to wreathe fists in fire or icy wind.', 
          features: { 
              3: [{ name: 'Elemental Attunement', description: 'As a Bonus Action, you can expend 1 Focus Point to enhance your martial arts with elemental power for 10 minutes. For the duration: Your reach increases by 10 feet when you make an Unarmed Strike. Your Unarmed Strikes can deal your choice of Bludgeoning damage or Acid, Cold, Fire, or Lightning damage. Once per turn when you hit a creature with an Unarmed Strike, you can force it to make a Strength saving throw. On a failed save, the target is pushed up to 10 feet away from you.' }, { name: 'Manipulate Elements', description: 'You know the Elementalism cantrip. Wisdom is your spellcasting ability for it.' }],
              6: [{ name: 'Elemental Burst', description: 'As an Action, you can expend 2 Focus Points to create a burst of elemental power. Choose a 20-foot-radius sphere within 120 feet that you can see. Creatures in that area make a Dexterity saving throw. A creature takes damage equal to three rolls of your Martial Arts die (choose Acid, Cold, Fire, or Lightning) on a failed save, or half as much on a successful one. You can make one Unarmed Strike as a Bonus Action after this action.' }],
              11: [{ name: 'Stride of the Elements', description: 'When you use Elemental Attunement, you gain a Fly and Swim speed equal to your walking speed for the duration.' }],
              17: [{ name: 'Elemental Epitome', description: 'When you use Elemental Attunement, you gain these additional benefits: Resistance to the chosen damage type (Acid, Cold, Fire, or Lightning). Your movement doesn\'t provoke opportunity attacks. Once per turn when you hit a creature with an Unarmed Strike, that creature takes extra damage of the chosen type equal to your Martial Arts die.' }]
          } 
      },
      { 
          name: 'Warrior of Mercy', 
          description: 'Manipulate Forces of Life and Death. Warriors of Mercy manipulate the life force of others. These Monks are wandering physicians, but they bring a swift end to their enemies. They often wear masks, presenting themselves as faceless bringers of life and death.', 
          features: { 
              3: [
                  { name: 'Hand of Harm', description: 'Once per turn when you hit a creature with an Unarmed Strike and deal damage, you can expend 1 Focus Point to deal extra Necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier.' },
                  { name: 'Hand of Healing', description: 'As an Action, you can expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the Unarmed Strikes with a use of this feature without expending a Focus Point for the healing.' },
                  { name: 'Implements of Mercy', description: 'You gain proficiency in the Insight and Medicine skills and proficiency with the Herbalism Kit.' }
              ],
              6: [{ name: 'Physician\'s Touch', description: 'Hand of Harm: When you use Hand of Harm on a creature, you can also give that creature the Poisoned condition until the end of your next turn. Hand of Healing: When you use Hand of Healing, you can also end one of the following conditions on the creature you heal: Blinded, Deafened, Paralyzed, Poisoned, or Stunned. You can use these benefits a total number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.' }],
              11: [{ name: 'Flurry of Healing and Harm', description: 'When you use Flurry of Blows, you can replace each of the Unarmed Strikes with a use of Hand of Healing without expending Focus Points for the healing. In addition, when you make an Unarmed Strike with Flurry of Blows and deal damage, you can use Hand of Harm with that strike without expending a Focus Point for Hand of Harm. You can still use Hand of Harm only once per turn. You can use these benefits a total number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.' }],
              17: [{ name: 'Hand of Ultimate Mercy', description: 'Your mastery of life energy opens the door to the ultimate mercy. As an Action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 Focus Points. The creature then returns to life with a number of Hit Points equal to 4d10 plus your Wisdom modifier. If the creature died with any of the following conditions, the creature revives with the conditions removed: Blinded, Deafened, Paralyzed, Poisoned, and Stunned. Once you use this feature, you can\'t use it again until you finish a Long Rest.' }]
          } 
      }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { DEX: 15, WIS: 14, CON: 13, STR: 12, INT: 10, CHA: 8 }
};
