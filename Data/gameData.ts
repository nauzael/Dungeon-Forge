import { Trait } from '../types';

export const METAMAGIC: Trait[] = [
    { name: 'Careful Spell', description: '(1 Sorcery Point) When you cast a spell that forces other creatures to make a saving throw, you can protect some of them. Choose a number of creatures up to your Charisma modifier (min 1). A chosen creature automatically succeeds on its saving throw, and it takes no damage if it would normally take half damage on a successful save.' },
    { name: 'Distant Spell', description: '(1 Sorcery Point) When you cast a spell that has a range of at least 5 feet, you can spend 1 Sorcery Point to double the range. Or when you cast a spell with a range of Touch, you can make the range 30 feet.' },
    { name: 'Empowered Spell', description: '(1 Sorcery Point) When you roll damage for a spell, you can spend 1 Sorcery Point to reroll a number of the damage dice up to your Charisma modifier (min 1). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option.' },
    { name: 'Extended Spell', description: '(1 Sorcery Point) When you cast a spell with a duration of 1 minute or longer, you can spend 1 Sorcery Point to double its duration (max 24 hours). If the affected spell requires Concentration, you have Advantage on any saving throw you make to maintain it.' },
    { name: 'Heightened Spell', description: '(2 Sorcery Points) When you cast a spell that forces a creature to make a saving throw, you can spend 2 Sorcery Points to give one target of the spell Disadvantage on saves against the spell.' },
    { name: 'Quickened Spell', description: '(2 Sorcery Points) Change the casting time of a spell from an Action to a Bonus Action. You can\'t modify a spell in this way if you have already cast a level 1+ spell on the current turn, nor can you cast a level 1+ spell on this turn after modifying a spell in this way.' },
    { name: 'Seeking Spell', description: '(1 Sorcery Point) If you make an attack roll for a spell and miss, you can spend 1 Sorcery Point to reroll the d20, and you must use the new roll. You can use Seeking Spell even if you have already used a different Metamagic option.' },
    { name: 'Subtle Spell', description: '(1 Sorcery Point) Cast a spell without any Verbal, Somatic, or Material components (unless the Material components are consumed by the spell or have a cost specified).' },
    { name: 'Transmuted Spell', description: '(1 Sorcery Point) Change the damage type of a spell from Acid, Cold, Fire, Lightning, Poison, or Thunder to another from that list.' },
    { name: 'Twinned Spell', description: '(1 Sorcery Point) When you cast a spell that can be cast with a higher-level spell slot to target an additional creature, you can spend 1 Sorcery Point to increase the spell\'s effective level by 1.' },
];

export const INVOCATIONS: (Trait & { level?: number, repeatable?: boolean })[] = [
    { name: 'Agonizing Blast', description: 'Choose one of your Warlock cantrips that deals damage. Add your Charisma modifier to the damage it deals. Repeatable.', level: 1, repeatable: true },
    { name: 'Armor of Shadows', description: 'You can cast Mage Armor on yourself at will, without expending a spell slot or material components.', level: 1 },
    { name: 'Ascendant Step', description: 'You can cast Levitate on yourself at will, without expending a spell slot or material components.', level: 9 },
    { name: 'Beast Speech', description: 'You can cast Speak with Animals at will, without expending a spell slot.', level: 1 },
    { name: 'Beguiling Influence', description: 'You gain proficiency in the Deception and Persuasion skills.', level: 1 },
    { name: 'Devils Sight', description: 'You can see normally in darkness, both magical and nonmagical, to a distance of 120 feet.', level: 1 },
    { name: 'Eldritch Mind', description: 'You have Advantage on Constitution saving throws that you make to maintain Concentration on a spell.', level: 1 },
    { name: 'Eldritch Smite', description: 'Once per turn when you hit a creature with your Pact Weapon, you can expend a Warlock spell slot to deal an extra 1d8 Force damage to the target, plus another 1d8 per level of the spell slot, and you can knock the target Prone if it is Huge or smaller.', level: 5 },
    { name: 'Eldritch Spear', description: 'When you cast a Warlock cantrip with a range of 10 feet or more, its range becomes 300 feet.', level: 1 },
    { name: 'Eyes of the Rune Keeper', description: 'You can read all writing.', level: 1 },
    { name: 'Fiendish Vigor', description: 'You can cast False Life on yourself at will as a 1st-level spell, without expending a spell slot or material components.', level: 1 },
    { name: 'Gaze of Two Minds', description: 'You can use your action to touch a willing Humanoid and perceive through its senses. While the connection is active, you can cast spells as though you were in the other creature\'s space. 1/Long Rest.', level: 1 },
    { name: 'Gift of the Depths', description: 'You can breathe underwater, and you gain a Swim Speed equal to your walking speed. You can also cast Water Breathing once without expending a spell slot.', level: 5 },
    { name: 'Gift of the Protectors', description: 'A protective page in your Book of Shadows. When a creature whose name is on it drops to 0 HP, it drops to 1 instead (1/Long Rest).', level: 9 },
    { name: 'Lessons of the First Ones', description: 'You gain one Origin feat of your choice. Repeatable.', level: 2, repeatable: true },
    { name: 'Lifedrinker', description: 'When you hit a creature with your Pact Weapon, it takes extra Necrotic damage equal to your Charisma modifier, and you regain the same amount of HP.', level: 9 },
    { name: 'Mask of Many Faces', description: 'You can cast Disguise Self at will, without expending a spell slot.', level: 1 },
    { name: 'Master of Myriad Forms', description: 'You can cast Alter Self at will, without expending a spell slot.', level: 15 },
    { name: 'Misty Visions', description: 'You can cast Silent Image at will, without expending a spell slot.', level: 1 },
    { name: 'One with Shadows', description: 'While in Dim Light or Darkness, use your action to become Invisible until you move or take an action.', level: 5 },
    { name: 'Otherworldly Leap', description: 'You can cast Jump on yourself at will, without expending a spell slot.', level: 9 },
    { name: 'Pact of the Blade', description: 'Bind or create a weapon. You are proficient, it is magical, and you can use your Charisma for attack and damage rolls.', level: 1 },
    { name: 'Pact of the Chain', description: 'You learn the Find Familiar spell. You can choose special forms and command it to attack using your Reaction.', level: 1 },
    { name: 'Pact of the Tome', description: 'Gain a grimoire with 2 cantrips and two 1st-level spells (Wizard). They count as Warlock spells and can be swapped after a Long Rest.', level: 1 },
    { name: 'Repelling Blast', description: 'When you hit a creature with Eldritch Blast, you can push the creature up to 10 feet away.', level: 1 },
    { name: 'Sculptor of Flesh', description: 'You can cast Polymorph once by expending a Warlock spell slot.', level: 7 },
    { name: 'Shadow Sight', description: 'You can see in Dim Light and Darkness within 120 feet as if it were Bright Light.', level: 1 },
    { name: 'Shroud of Shadow', description: 'You can cast Invisibility at will, without expending a spell slot.', level: 15 },
    { name: 'Sign of Ill Omen', description: 'You can cast Bestow Curse once by expending a Warlock spell slot.', level: 5 },
    { name: 'Thirsting Blade', description: 'You can attack twice with your Pact Weapon whenever you take the Attack action.', level: 5 },
    { name: 'Visions of Distant Realms', description: 'You can cast Arcane Eye at will, without expending a spell slot.', level: 15 },
    { name: 'Whispers of the Grave', description: 'You can cast Speak with Dead at will, without expending a spell slot.', level: 9 },
];

export const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good', 
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export const LANGUAGES = [
  'Common', 'Common Sign Language', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc', 
  'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon', 'Thieves\' Cant', 'Druidic'
];
