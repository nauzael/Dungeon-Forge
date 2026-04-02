
import { Ability, Skill, DetailData, SubclassData } from '../../types';

export const cleric = {
  details: { 
    name: 'Cleric', 
    description: 'Clerics draw power from the realms of the gods and use it to work miracles. They are conduits of divine magic from the Outer Planes.', 
    traits: [
        { name: 'Spellcasting', description: 'Wisdom-based divine magic. You are a prepared spellcaster.' }, 
        { name: 'Divine Order', description: 'You have dedicated your life to a sacred role: Protector (proficiency with martial weapons and heavy armor) or Thaumaturge (extra cantrip and bonus to Religion/Arcana).' }, 
        { name: 'Channel Divinity', description: 'Ability to channel divine energy for magical effects like Turn Undead or Divine Spark.' }
    ] 
  } as DetailData,
  hitDie: 8,
  savingThrows: ['WIS', 'CHA'] as Ability[],
  statPriorities: ['WIS', 'CON', 'STR'] as Ability[],
  skillData: { count: 2, options: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] as Skill[] },
  progression: { 
    1: ['Spellcasting', 'Divine Order'], 
    2: ['Channel Divinity'], 
    3: ['Cleric Subclass'], 
    4: ['Ability Score Improvement'], 
    5: ['Sear Undead'], 
    6: ['Subclass Feature'],
    7: ['Blessed Strikes'],
    8: ['Ability Score Improvement'], 
    10: ['Divine Intervention'], 
    12: ['Ability Score Improvement'], 
    14: ['Improved Blessed Strikes'], 
    16: ['Ability Score Improvement'], 
    17: ['Subclass Feature'],
    18: ['Channel Divinity Upgrade'],
    19: ['Epic Boon Feat'], 
    20: ['Greater Divine Intervention'] 
  } as Record<number, string[]>,
  subclasses: [
    { 
        name: 'Life Domain', 
        description: 'Soothe the Hurts of the World. The Life Domain focuses on the positive energy that helps sustain all life in the multiverse. Clerics who tap into this domain are masters of healing, using that life force to cure many hurts.', 
        features: { 
            3: [
                { name: 'Disciple of Life', description: 'When a spell you cast with a spell slot restores Hit Points to a creature, that creature regains additional Hit Points on the turn you cast the spell. The additional Hit Points equal 2 plus the spell slot\'s level.' },
                { name: 'Life Domain Spells', description: 'L3: Aid, Bless, Cure Wounds, Lesser Restoration. L5: Mass Healing Word, Revivify. L7: Aura of Life, Death Ward. L9: Greater Restoration, Mass Cure Wounds.' },
                { name: 'Preserve Life', description: 'As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to evoke healing energy that can restore a number of Hit Points equal to five times your Cleric level. Choose Bloodied creatures within 30 feet of yourself, and divide those Hit Points among them. This feature can restore a creature to no more than half its Hit Point maximum.' }
            ],
            6: [{ name: 'Blessed Healer', description: 'The healing spells you cast on others heal you as well. Immediately after you cast a spell with a spell slot that restores Hit Points to one or more creatures other than yourself, you regain Hit Points equal to 2 plus the spell slot\'s level.' }],
            17: [{ name: 'Supreme Healing', description: 'When you would normally roll one or more dice to restore Hit Points to a creature with a spell or Channel Divinity, don\'t roll those dice for the healing; instead use the highest number possible for each die.' }]
        } 
    },
    { 
        name: 'Light Domain', 
        description: 'Bring Light to Banish Darkness. The Light Domain emphasizes the divine power to bring about blazing fire and revelation. Clerics who wield this power are enlightened souls infused with radiance and the power of their deities\' discerning vision.', 
        features: { 
            3: [
                { name: 'Light Domain Spells', description: 'L3: Burning Hands, Faerie Fire, Scorching Ray, See Invisibility. L5: Daylight, Fireball. L7: Arcane Eye, Wall of Fire. L9: Flame Strike, Scrying.' },
                { name: 'Radiance of the Dawn', description: 'As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to emit a flash of light in a 30-foot Emanation. Any magical Darkness in that area is dispelled. Additionally, each creature of your choice in that area must make a Constitution saving throw, taking Radiant damage equal to 2d10 plus your Cleric level on a failed save or half as much on a successful one.' },
                { name: 'Warding Flare', description: 'When a creature that you can see within 30 feet of yourself makes an attack roll, you can take a Reaction to impose Disadvantage on the attack roll, causing light to flare before it hits or misses. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest.' }
            ],
            6: [{ name: 'Improved Warding Flare', description: 'You regain all expended uses of your Warding Flare when you finish a Short or Long Rest. In addition, whenever you use Warding Flare, you can give the target of the triggering attack a number of Temporary Hit Points equal to 2d6 plus your Wisdom modifier.' }],
            17: [{ name: 'Corona of Light', description: 'As a Magic action, you cause yourself to emit an aura of sunlight that lasts for 1 minute or until you dismiss it. You emit Bright Light in a 60-foot radius and Dim Light for an additional 30 feet. Your enemies in the Bright Light have Disadvantage on saving throws against your Radiance of the Dawn and any spell that deals Fire or Radiant damage. You can use this feature a number of times equal to your Wisdom modifier, and you regain all expended uses when you finish a Long Rest.' }]
        } 
    },
    { 
        name: 'Trickery Domain', 
        description: 'Make Mischief and Challenge Authority. The Trickery Domain offers magic of deception, illusion, and stealth. Clerics who wield this magic are a disruptive force in the world, puncturing pride, mocking tyrants, freeing captives, and flouting hollow traditions.', 
        features: { 
            3: [
                { name: 'Blessing of the Trickster', description: 'As a Magic action, you can choose yourself or a willing creature within 30 feet of yourself to have Advantage on Dexterity (Stealth) checks. This blessing lasts until you finish a Long Rest or you use this feature again.' },
                { name: 'Trickery Domain Spells', description: 'L3: Charm Person, Disguise Self, Invisibility, Pass without Trace. L5: Hypnotic Pattern, Nondetection. L7: Confusion, Dimension Door. L9: Dominate Person, Modify Memory.' },
                { name: 'Invoke Duplicity', description: 'As a Bonus Action, you can expend one use of your Channel Divinity to create a perfect visual illusion of yourself in an unoccupied space you can see within 30 feet. The illusion is intangible and lasts for 1 minute. Cast Spells: You can cast spells as though you were in the illusion\'s space. Distract: When both you and your illusion are within 5 feet of a creature that can see the illusion, you have Advantage on attack rolls against that creature. Move: As a Bonus Action, you can move the illusion up to 30 feet.' }
            ],
            6: [{ name: 'Trickster\'s Transposition', description: 'Whenever you take the Bonus Action to create or move the illusion of your Invoke Duplicity, you can teleport, swapping places with the illusion.' }],
            17: [{ name: 'Improved Duplicity', description: 'Shared Distraction: When you and your allies make attack rolls against a creature within 5 feet of the illusion, the attack rolls have Advantage. Healing Illusion: When the illusion ends, you or a creature of your choice within 5 feet of it regains a number of Hit Points equal to your Cleric level.' }]
        } 
    },
    { 
        name: 'War Domain', 
        description: 'Inspire Valor and Smite Foes. War has many manifestations. Clerics who tap into the magic of the War Domain excel in battle, inspiring others to fight the good fight or offering acts of violence as prayers.', 
        features: { 
            3: [
                { name: 'Guided Strike', description: 'When you or a creature within 30 feet of you misses with an attack roll, you can expend one use of your Channel Divinity and give that roll a +10 bonus, potentially causing it to hit.' },
                { name: 'War Domain Spells', description: 'L3: Guiding Bolt, Magic Weapon, Shield of Faith, Spiritual Weapon. L5: Crusader\'s Mantle, Spirit Guardians. L7: Fire Shield, Freedom of Movement. L9: Hold Monster, Steel Wind Strike.' },
                { name: 'War Priest', description: 'As a Bonus Action, you can make one attack with a weapon or an Unarmed Strike. You can use this Bonus Action a number of times equal to your Wisdom modifier. You regain all expended uses when you finish a Short or Long Rest.' }
            ],
            6: [{ name: 'War God\'s Blessing', description: 'You can expend a use of your Channel Divinity to cast Shield of Faith or Spiritual Weapon rather than expending a spell slot. When you cast either spell in this way, the spell doesn\'t require Concentration. Instead the spell lasts for 1 minute, but it ends early if you cast that spell again, have the Incapacitated condition, or die.' }],
            17: [{ name: 'Avatar of Battle', description: 'You gain Resistance to Bludgeoning, Piercing, and Slashing damage.' }]
        } 
    }
  ] as SubclassData[],
  masteriesCount: 0,
  suggestedArray: { WIS: 15, CON: 14, STR: 13, INT: 12, DEX: 10, CHA: 8 }
};
