export interface SkillData {
  name: string;
  description: string;
  ability: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
}

export const SKILLS_EN: SkillData[] = [
  {
    name: 'Acrobatics',
    description: 'Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky situation, such as when you are trying to run across a sheet of ice, balance on a tightrope, or remain upright on a rocking ship\'s deck. The DM might also call for a Dexterity (Acrobatics) check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and escapes from grabs.',
    ability: 'DEX'
  },
  {
    name: 'Animal Handling',
    description: 'When there is any question whether you can calm down a domesticated animal, keep a mount from getting spooked, or intuit an animal\'s intentions, the DM might call for a Wisdom (Animal Handling) check. You also make Wisdom (Animal Handling) checks to control your mount when you attempt a risky maneuver.',
    ability: 'WIS'
  },
  {
    name: 'Arcana',
    description: 'Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of those planes.',
    ability: 'INT'
  },
  {
    name: 'Athletics',
    description: 'Your Strength (Athletics) check covers difficult situations you encounter while climbing, jumping, or swimming. Examples include the following activities: scaling a sheer or slippery cliff wall, jumping across a wide chasm, swimming against a strong current, or rolling upright after a devastating hit. The DM might also call for a Strength (Athletics) check to grapple or shove a creature.',
    ability: 'STR'
  },
  {
    name: 'Deception',
    description: 'Your Charisma (Deception) check determines whether you can convincingly hide the truth, either verbally or through your actions. This deception can encompass everything from misleading others through verbal patter to concealing truth by actions. Examples include lying, disguising yourself, bluffing at cards, or conning someone.',
    ability: 'CHA'
  },
  {
    name: 'History',
    description: 'Your Intelligence (History) check measures your ability to recall lore about historical events, legendary figures, ancient kingdoms, past disputes, recent wars, and lost civilizations.',
    ability: 'INT'
  },
  {
    name: 'Insight',
    description: 'Your Wisdom (Insight) check decides whether you can determine the true intentions of a creature, such as when you are trying to detect a lie or predict someone\'s next move. Doing so involves reading body language, speech habits, and changes in mannerisms or demeanor.',
    ability: 'WIS'
  },
  {
    name: 'Intimidation',
    description: 'When you attempt to influence someone through overt threats, hostile actions, and physical violence, the DM might ask for a Charisma (Intimidation) check. Examples include trying to pry information out of a prisoner, convincing street thugs to back down from a confrontation, or using the edge of a broken bottle to convince a sneering merchant to pay up.',
    ability: 'CHA'
  },
  {
    name: 'Investigation',
    description: 'When you look around for clues and make deductions based on those clues, you make an Intelligence (Investigation) check. You might deduce the location of a hidden object, discern from the type of wound what kind of weapon dealt it, or find a weak point in a crumbling tunnel wall.',
    ability: 'INT'
  },
  {
    name: 'Medicine',
    description: 'A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness or disease.',
    ability: 'WIS'
  },
  {
    name: 'Nature',
    description: 'Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants and animals, the weather, and the natural cycles.',
    ability: 'INT'
  },
  {
    name: 'Perception',
    description: 'Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of something. It measures your general awareness of your surroundings and your keenness of senses. For example, you might try to hear a conversation through a closed door, make out a creature hiding in the bushes, or detect the presence of something hidden.',
    ability: 'WIS'
  },
  {
    name: 'Performance',
    description: 'Your Charisma (Performance) check determines how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.',
    ability: 'CHA'
  },
  {
    name: 'Persuasion',
    description: 'When you attempt to influence a person or a group of people with tact, social graces, or good nature, the DM might ask for a Charisma (Persuasion) check. You typically use persuasion when acting in good faith, to foster friendships, make bargain, or make proper requests.',
    ability: 'CHA'
  },
  {
    name: 'Religion',
    description: 'Your Intelligence (Religion) check measures your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and practices of secret cults.',
    ability: 'INT'
  },
  {
    name: 'Sleight of Hand',
    description: 'Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check. The DM might also call for a Dexterity (Sleight of Hand) check to determine whether you can lift a coin purse off another person or slip something out of another person\'s pack.',
    ability: 'DEX'
  },
  {
    name: 'Stealth',
    description: 'Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past guards, sneak away without being noticed, or sneak up on someone without being seen or heard.',
    ability: 'DEX'
  },
  {
    name: 'Survival',
    description: 'The DM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game, guide your group through wastelands, identify signs that monsters are nearby, predict the weather, or avoid natural hazards.',
    ability: 'WIS'
  }
];
