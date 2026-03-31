
export interface CompendiumItem {
    id: string;
    title: string;
    category: 'Class' | 'Species' | 'Condition' | 'Feat' | 'Rule' | 'Subclass';
    content: string; // Summary
    fullInfo?: string; // Full markdown-like content
}

export const COMPENDIUM_DATA: CompendiumItem[] = [
    // --- CLASSES ---
    {
        id: 'barbarian-2024',
        category: 'Class',
        title: 'Barbarian',
        content: 'Unstoppable warrior of primal fury who uses Rage to resist damage and deal devastating blows.',
        fullInfo: `### Barbarian (2024 Features)

#### Level 1: Rage

You can enter Rage as a Bonus Action. While active:

*   **Damage Resistance.** Resistance to Bludgeoning, Piercing, and Slashing damage.
*   **Rage Damage.** Bonus damage to Strength-based melee attacks (+2).
*   **Strength Advantage.** Advantage on Strength checks and Saving Throws.
*   **No Spells.** You can't cast spells or maintain Concentration.
*   **Duration.** Lasts 10 minutes. Ends if you are Unconscious or haven't attacked/taken damage.

#### Level 1: Unarmored Defense

While not wearing armor, your AC equals 10 + Dexterity modifier + Constitution modifier.

#### Level 1: Weapon Mastery

Training allows you to use Mastery properties of two kinds of weapons.

#### Level 2: Danger Sense

Advantage on Dexterity saving throws unless Incapacitated.

#### Level 2: Reckless Attack

Gain Advantage on Strength-based attacks, but attacks against you have Advantage until your next turn.`
    },
    {
        id: 'bard-2024',
        category: 'Class',
        title: 'Bard',
        content: 'Master of music and words who can inspire allies and manipulate reality with songs.',
        fullInfo: `### Bard (2024 Features)

#### Level 1: Bardic Inspiration

Bonus Action to inspire another creature within 60 feet. They gain a d6 die.

*   **Usage.** Within 10 minutes, they can add it to one d20 roll.
*   **Uses.** Equal to Charisma modifier (min 1).

#### Level 1: Spellcasting

Cast Bard spells using Charisma. Start with two Cantrips and two Level 1 spells.

#### Level 2: Expertise

Double proficiency for two skill proficiencies.

#### Level 2: Jack of All Trades

Add half Proficiency Bonus (round down) to any ability check that doesn't use it.`
    },
    {
        id: 'cleric-2024',
        category: 'Class',
        title: 'Cleric',
        content: 'Agent of divine power, capable of healing, protecting, or punishing in their deity\'s name.',
        fullInfo: `### Cleric (2024 Features)

#### Level 1: Divine Order

Choose your path:
*   **Protector.** Heavy Armor and Martial weapon proficiency.
*   **Thaumaturge.** Extra Cantrip and +Wis to Religion.

#### Level 1: Spellcasting

Cast Cleric spells using Wisdom.

#### Level 2: Channel Divinity

Channel energy from the Outer Planes.
*   **Divine Spark.** Heal or Damage by touch.
*   **Turn Undead.** Force Undead to flee.`
    },
    {
        id: 'druid-2024',
        category: 'Class',
        title: 'Druid',
        content: 'Guardian of nature who wields elemental power and transforms into animal forms.',
        fullInfo: `### Druid (2024 Features)

#### Level 1: Primal Order

Choose your path:
*   **Magician.** Extra Cantrip and +Wis to Arcana/Nature.
*   **Warden.** Medium Armor and Martial weapon proficiency.

#### Level 1: Spellcasting

Cast Druid spells using Wisdom.

#### Level 2: Wild Shape

Magically transform into a Beast form.
*   **Duration.** Hours equal to half Druid level.
*   **Usage.** Uses expand as you level up.`
    },
    {
        id: 'fighter-2024',
        category: 'Class',
        title: 'Fighter',
        content: 'Combat specialist skilled in tactical maneuvers, capable of making a high volume of attacks.',
        fullInfo: `### Fighter (2024 Features)

#### Level 1: Fighting Style

Gain a Fighting Style feat (e.g. Archery, Defense).

#### Level 1: Second Wind

Bonus Action to regain 1d10 + Fighter level HP. (2 uses per rest).

#### Level 1: Weapon Mastery

Use Mastery properties of three kinds of weapons.

#### Level 2: Action Surge

Take one additional action on your turn (once per rest).

#### Level 2: Tactical Mind

Expend Second Wind to add 1d10 to a failed ability check.`
    },
    {
        id: 'monk-2024',
        category: 'Class',
        title: 'Monk',
        content: 'Agile fighter who channels internal Focus to achieve incredible physical feats.',
        fullInfo: `### Monk (2024 Features)

#### Level 1: Martial Arts

*   Use Dex for Monk Weapons/Unarmed Strikes.
*   Unarmed damage: 1d6.
*   Bonus Action Unarmed Strike.

#### Level 1: Unarmored Defense

AC = 10 + Dex + Wis (no armor/shield).

#### Level 2: Monk's Focus

Expend Focus points for:
*   **Flurry of Blows.** Two Unarmed Strikes as Bonus Action.
*   **Patient Defense.** Disadvantage on hits against you.
*   **Step of the Wind.** Dash or Disengage as Bonus Action.`
    },
    {
        id: 'paladin-2024',
        category: 'Class',
        title: 'Paladin',
        content: 'Sacred warrior who combines martial prowess with divine magic and the power of an Oath.',
        fullInfo: `### Paladin (2024 Features)

#### Level 1: Lay on Hands

Heal a creature by touch using a pool of points.

#### Level 1: Spellcasting

Cast Paladin spells using Charisma.

#### Level 2: Paladin's Smite

Expend a slot to deal extra Radiant damage (shares space with Divine Smite).`
    },
    {
        id: 'ranger-2024',
        category: 'Class',
        title: 'Ranger',
        content: 'Expert tracker and hunter who uses primal magic to hunt their prey.',
        fullInfo: `### Ranger (2024 Features)

#### Level 1: Favored Enemy

You always have *Hunter's Mark* prepared.

#### Level 1: Spellcasting

Cast Ranger spells using Wisdom.

#### Level 1: Weapon Mastery

Use Mastery properties of two kinds of weapons.

#### Level 2: Deft Explorer

Expertise in one skill and learn two extra languages.`
    },
    {
        id: 'rogue-2024',
        category: 'Class',
        title: 'Rogue',
        content: 'Stealth specialist who deals precise and lethal blows, excelling in multiple skills.',
        fullInfo: `### Rogue (2024 Features)

#### Level 1: Expertise

Double proficiency for two skill choices.

#### Level 1: Sneak Attack

Deal extra 1d6 damage (scales up) once per turn under right conditions.

#### Level 2: Cunning Action

Bonus Action to Dash, Disengage, or Hide.`
    },
    {
        id: 'sorcerer-2024',
        category: 'Class',
        title: 'Sorcerer',
        content: 'Wielder of innate magic whose power comes from a lineage or cosmic origin.',
        fullInfo: `### Sorcerer (2024 Features)

#### Level 1: Innate Sorcery

Bonus Action to gain Advantage on spell attacks for 1 minute.

#### Level 2: Font of Magic

Use Sorcery Points to regain slots or fuel Metamagic choices.`
    },
    {
        id: 'warlock-2024',
        category: 'Class',
        title: 'Warlock',
        content: 'Seeker of forbidden knowledge who made a pact with a powerful patron.',
        fullInfo: `### Warlock (2024 Features)

#### Level 1: Eldritch Invocations

Choose two Invocations to customize your power.

#### Level 2: Magical Cunning

Magic Action to regain half your Pact slots (once per rest).`
    },
    {
        id: 'wizard-2024',
        category: 'Class',
        title: 'Wizard',
        content: 'Scholar who masters the arcane through intense study and their spellbook.',
        fullInfo: `### Wizard (2024 Features)

#### Level 1: Ritual Adept

Cast any Wizard ritual spell you know without preparing it.

#### Level 2: Scholar

Expertise in one knowledge skill (Arcane, History, etc.).`
    },

    // --- SUBCLASSES ---
    // Barbarian
    {
        id: 'path-of-the-berserker',
        category: 'Subclass',
        title: 'Path of the Berserker (Barbarian)',
        content: 'Channel your Rage into violent fury. Strike with brutal violence and without fear.',
        fullInfo: `### Path of the Berserker
*Barbarian Subclass*

**Description:** Barbarians who walk the Path of the Berserker direct their Rage primarily toward violence. Their path is one of untrammeled fury, and they thrill in the chaos of battle as they allow their Rage to seize and empower them.

#### Features

**Level 3: Frenzy**
If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. Roll a number of d6s equal to your Rage Damage bonus. The damage has the same type as the weapon or Unarmed Strike used for the attack.

**Level 6: Mindless Rage**
You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you're Charmed or Frightened when you enter your Rage, the condition ends on you.

**Level 10: Retaliation**
When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature.

**Level 14: Intimidating Presence**
As a Bonus Action, you can strike terror into others. Each creature of your choice in a 30-foot Emanation must make a Wisdom saving throw (DC 8 + Strength + Proficiency). On a failed save, a creature has the Frightened condition for 1 minute. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage.`
    },
    {
        id: 'path-of-the-wild-heart',
        category: 'Subclass',
        title: 'Path of the Wild Heart (Barbarian)',
        content: 'Walk in communion with the animal world. Speak with beasts and enhance your Rage with primal power.',
        fullInfo: `### Path of the Wild Heart
*Barbarian Subclass*

**Description:** Barbarians who follow the Path of the Wild Heart view themselves as kin to animals. These Barbarians learn magical means to communicate with animals, and their Rage heightens their connection to animals as it fills them with supernatural might.

#### Features

**Level 3: Animal Speaker**
You can cast the Beast Sense and Speak with Animals spells but only as Rituals. Wisdom is your spellcasting ability for them.

**Level 3: Rage of the Wilds**
Your Rage taps into the primal power of animals. Whenever you activate your Rage, you gain one of the following options:
- **Bear.** Resistance to every damage type except Force, Necrotic, Psychic, and Radiant.
- **Eagle.** You can take the Disengage and Dash actions as part of that Bonus Action.
- **Wolf.** Your allies have Advantage on attack rolls against any enemy of yours within 5 feet of you.

**Level 6: Aspect of the Wilds**
You gain one of the following options:
- **Owl.** Darkvision with a range of 60 feet.
- **Panther.** A Climb Speed equal to your Speed.
- **Salmon.** A Swim Speed equal to your Speed.

**Level 10: Nature Speaker**
You can cast the Commune with Nature spell but only as a Ritual.

**Level 14: Power of the Wilds**
Whenever you activate your Rage, you gain one of the following options:
- **Falcon.** Fly Speed equal to your Speed.
- **Lion.** Enemies within 5 feet of you have Disadvantage on attack rolls against targets other than you.
- **Ram.** Large or smaller creature has the Prone condition when you hit it with a melee attack.`
    },
    {
        id: 'path-of-the-world-tree',
        category: 'Subclass',
        title: 'Path of the World Tree (Barbarian)',
        content: 'Connect with the cosmic tree Yggdrasil. Absorb life force and travel between dimensions.',
        fullInfo: `### Path of the World Tree
*Barbarian Subclass*

**Description:** Barbarians who follow the Path of the World Tree connect with the cosmic tree Yggdrasil through their Rage. These Barbarians draw on the tree's magic for vitality and as a means of dimensional travel.

#### Features

**Level 3: Vitality of the Tree**
Your Rage taps into the life force of the World Tree:
- **Vitality Surge.** When you activate your Rage, you gain Temporary Hit Points equal to your Barbarian level.
- **Life-Giving Force.** At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet to gain Temporary Hit Points.

**Level 6: Branches of the Tree**
Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral branches. The target must succeed on a Strength saving throw or be teleported to an unoccupied space within 5 feet of yourself.

**Level 10: Battering Roots**
During your turn, your reach is 10 feet greater with any Melee weapon that has the Heavy or Versatile property.

**Level 14: Travel along the Tree**
When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see.`
    },
    {
        id: 'path-of-the-zealot',
        category: 'Subclass',
        title: 'Path of the Zealot (Barbarian)',
        content: 'Mystical union with a god. Additional divine damage and celestial warrior form.',
        fullInfo: `### Path of the Zealot
*Barbarian Subclass*

**Description:** Barbarians who walk the Path of the Zealot receive boons from a god or pantheon. These Barbarians experience their Rage as an ecstatic episode of divine union.

#### Features

**Level 3: Divine Fury**
On each of your turns while your Rage is active, the first creature you hit with a weapon or an Unarmed Strike takes extra damage equal to 1d6 plus half your Barbarian level (round down). The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage.

**Level 3: Warrior of the Gods**
You have a pool of four d12s that you can spend to heal yourself. As a Bonus Action, you can expend dice from the pool, roll them, and regain Hit Points equal to the roll's total. Your pool regains all expended dice when you finish a Long Rest.

**Level 6: Fanatical Focus**
Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus.

**Level 10: Zealous Presence**
As a Bonus Action, you unleash a battle cry. Up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage.

**Level 14: Rage of the Gods**
When you activate your Rage, you can assume the form of a divine warrior for 1 minute or until you drop to 0 Hit Points. While in this form, you gain Flight, Resistance to Necrotic, Psychic, and Radiant damage, and when a creature within 30 feet of you would drop to 0 Hit Points, you can expend a use of your Rage to instead change the target's Hit Points to a number equal to your Barbarian level.`
    },

    // Bard Colleges
    {
        id: 'college-of-dance',
        category: 'Subclass',
        title: 'College of Dance (Bard)',
        content: 'The Words of Creation flow through celestial movements. Mystical inspiration.',
        fullInfo: `### College of Dance
*Bard Subclass*

**Description:** Bards of the College of Dance know that the Words of Creation can't be contained within speech or song; the words are uttered by the movements of celestial bodies and flow through the motions of the smallest creatures.

#### Features

**Level 3: Inspire Wonder**
As a Bonus Action, you can inspire wonder in creatures of your choice within 60 feet. Each creature gains Temporary Hit Points equal to your Charisma modifier plus your Proficiency Bonus.

**Level 3: Vertiginous Dance**
As a Bonus Action, you can inspire vertigo in creatures of your choice within 60 feet. Each creature must succeed on a Wisdom saving throw or have Disadvantage on the next attack roll or ability check it makes before the end of its next turn.

**Level 6: Daunting Display**
When you cast a spell that deals damage or forces a saving throw, you can inspire dread in creatures of your choice within 60 feet. Each creature must make a Wisdom saving throw or have the Frightened condition until the end of your next turn.

**Level 14: Dance of Death**
When you take the Attack action, you can inspire killing intent in creatures of your choice within 60 feet. Each creature gains an additional damage die on its next attack before the end of its next turn.`
    },
    {
        id: 'college-of-glamour',
        category: 'Subclass',
        title: 'College of Glamour (Bard)',
        content: 'Fey magic that charms and protects. Keep your allies safe with supernatural light.',
        fullInfo: `### College of Glamour
*Bard Subclass*

**Description:** The College of Glamour traces its origins to the beguiling magic of the Feywild. Bards who study this magic weave threads of beauty and terror into their songs and stories.

#### Features

**Level 3: Enthralling Performance**
When you cast a Bard spell that causes one or more creatures that aren't Constructs or Undead to gain the Charmed or Stunned condition, you can choose any number of those creatures to also gain Temporary Hit Points equal to your Charisma modifier.

**Level 3: Glamour's Mantle**
You can cast Mirror Image without expending a spell slot. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.

**Level 6: Unbreakable Majesty**
As a Bonus Action, you can assume an aura of majestic presence. When you do so, creatures of your choice that can see you must succeed on a Wisdom saving throw or have the Frightened condition until the end of your next turn. Creatures that fail this saving throw have Disadvantage on attack rolls against you until the end of your next turn.

**Level 14: Glamour's Veil**
As a Bonus Action, you can become invisible for 1 minute or until you take an action, cast a spell, or force a creature to make a saving throw. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'college-of-lore',
        category: 'Subclass',
        title: 'College of Lore (Bard)',
        content: 'Collect spells and secrets from diverse sources. Supreme arcane knowledge.',
        fullInfo: `### College of Lore
*Bard Subclass*

**Description:** Bards of the College of Lore collect spells and secrets from diverse sources. The college's members gather in libraries and universities to share their lore with one another.

#### Features

**Level 3: Bonus Proficiencies**
You gain proficiency with Medium Armor and Shields.

**Level 3: Cutting Words**
When a creature that you can see within 60 feet makes an attack roll, an ability check, or a damage roll, you can use your Reaction to expend one use of your Bardic Inspiration. Roll the Bardic Inspiration die and subtract the number rolled from the creature's roll. You can choose to do this after the creature rolls but before any effects of the roll occur.

**Level 6: Additional Magical Secrets**
You learn two spells of your choice from any spell list. The chosen spells count as Bard spells for you.

**Level 14: Peerless Smugness**
When you use Cutting Words, you can roll the Bardic Inspiration die twice and use either result.`
    },
    {
        id: 'college-of-the-moon',
        category: 'Subclass',
        title: 'College of the Moon (Bard)',
        content: 'Primal lunar magic. Transform your allies with moonlight and fey protection.',
        fullInfo: `### College of the Moon
*Bard Subclass*

**Description:** Bards of the College of the Moon draw from the fey magic and the primal power of the moonwells to bolster their allies, protect the natural world, and inspire their bardic works.

#### Features

**Level 3: Moonlight Song**
You can cast Moonbeam without expending a spell slot. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.

**Level 3: Lunar Inspiration**
When you give a creature a Bardic Inspiration die, you can also grant them Temporary Hit Points equal to your Charisma modifier.

**Level 6: Moonbeam Recovery**
When a creature within 60 feet of you that you can see fails a saving throw, you can use your Reaction to grant that creature a Bardic Inspiration die.

**Level 14: Serenity of the Moon**
While you aren't wearing armor, you can't have the Frightened or Charmed condition, and you have Resistance to Radiant and Necrotic damage.`
    },
    {
        id: 'college-of-valor',
        category: 'Subclass',
        title: 'College of Valor (Bard)',
        content: 'Sing the deeds of ancient heroes. Inspire your allies to combat.',
        fullInfo: `### College of Valor
*Bard Subclass*

**Description:** Bards of the Valor are daring storytellers whose tales preserve the memory of the great heroes of the past.

#### Features

**Level 3: Bonus Proficiencies**
You gain proficiency with Medium Armor, Shields, and Martial weapons.

**Level 3: Combat Inspiration**
When you give a creature a Bardic Inspiration die, you can also inspire them to strike truly. The creature can add the die to one weapon attack roll it makes before the end of your next turn.

**Level 6: Fighting Inspiration**
When a creature adds a Bardic Inspiration die to an attack roll and the attack hits, the creature gains a bonus to the damage roll equal to your Charisma modifier.

**Level 14: Epic Tale**
When you give a creature a Bardic Inspiration die, you can also inspire them to greatness. The creature gains Temporary Hit Points equal to your Charisma modifier plus your Proficiency Bonus, and it has Advantage on the next attack roll or saving throw it makes before the end of your next turn.`
    },

    // Cleric Domains
    {
        id: 'knowledge-domain',
        category: 'Subclass',
        title: 'Knowledge Domain (Cleric)',
        content: 'Master arcane secrets. Read minds and access hidden information.',
        fullInfo: `### Knowledge Domain
*Cleric Subclass*

**Description:** The Knowledge Domain values learning and understanding above all. Clerics who tap into this domain study esoteric lore, collect old tomes, and delve into secret places.

#### Features

**Level 1: Blessings of Knowledge**
You know two languages of your choice, and you have Proficiency in two skills of your choice. Wisdom is your spellcasting ability for these skills.

**Level 2: Channel Divinity: Knowledge**
As a Magic action, you can expend one use of your Channel Divinity to manifest your magical knowledge. Choose one spell from the Divination school on the Knowledge Domain Spells table that you have prepared and cast it without expending a spell slot or needing Material components.

**Level 6: Knowledge of the Ages**
When you finish a Long Rest, you gain proficiency in one skill or tool of your choice.

**Level 17: Omniscient Mouth**
As a Bonus Action, you can speak with clarity that transcends normal communication. For 1 hour, you have Advantage on Charisma checks, and creatures that can understand your language have the Stunned condition unless they succeed on a Wisdom saving throw. The DC equals 8 + your Wisdom modifier + your Proficiency Bonus. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'life-domain',
        category: 'Subclass',
        title: 'Life Domain (Cleric)',
        content: 'Heal wounds and protect life. The supreme healer.',
        fullInfo: `### Life Domain
*Cleric Subclass*

**Description:** The Life Domain focuses on the positive energy that helps sustain all life. Clerics who tap into this domain are masters of healing.

#### Features

**Level 1: Bonus Proficiency**
You have Proficiency with Heavy armor.

**Level 1: Life Devotion**
Whenever you cast a spell of level 1 or higher that restores Hit Points to a creature, you gain Temporary Hit Points equal to the spell's level.

**Level 2: Channel Divinity: Preserve Life**
As an Action, you present your Holy Symbol and invoke healing. Choose creatures within 30 feet of you. For each creature, restore Hit Points equal to 2d6 plus your Wisdom modifier. You can't use this feature on Constructs or Undead.

**Level 6: Blessed Healer**
When you cast a spell of level 1 or higher that restores Hit Points to another creature, you regain Hit Points equal to 2 plus the spell's level.

**Level 17: Supreme Harvest**
When you would normally roll one or more dice to restore Hit Points with a spell, you can instead use the highest possible result for each of those dice. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest.`
    },
    {
        id: 'light-domain',
        category: 'Subclass',
        title: 'Light Domain (Cleric)',
        content: 'Brilliant light that blinds enemies. Reveals hidden truths.',
        fullInfo: `### Light Domain
*Cleric Subclass*

**Description:** The Light Domain emphasizes the divine power to bring about blazing fire and revelation. Clerics who wield this power are enlightened souls infused with radiance.

#### Features

**Level 1: Light Bearer**
You know the Light and Dancing Lights cantrips.

**Level 1: Radiance of the Dawn**
When you cast a spell of level 1 or higher that deals Fire or Radiant damage, you can add your Wisdom modifier to the damage roll of that spell.

**Level 2: Channel Divinity: Radiance**
As an Action, you present your Holy Symbol, and healing energy flows into you. You regain Hit Points equal to 2d6 plus your Wisdom modifier. Alternatively, as a Magic action, you can extinguish each light source within 30 feet of you.

**Level 6: Blinding Light**
When you deal Radiant damage to a creature, you can also deal extra Radiant damage equal to your Wisdom modifier.

**Level 17: Corona of Light**
As a Bonus Action, you can manifest a crown of radiance that lasts for 1 minute. Each creature of your choice within 30 feet of you has Disadvantage on attack rolls against you, and each creature that starts its turn within 30 feet of you takes Radiant damage equal to your Wisdom modifier. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'trickery-domain',
        category: 'Subclass',
        title: 'Trickery Domain (Cleric)',
        content: 'Deception, illusion, and stealth. The divine trickster.',
        fullInfo: `### Trickery Domain
*Cleric Subclass*

**Description:** The Trickery Domain offers magic of deception, illusion, and stealth. Clerics who wield this magic are a disruptive force in the world.

#### Features

**Level 1: Blessing of the Trickster**
You have Proficiency in the Stealth skill, and you have Advantage on Dexterity (Stealth) checks you make to hide.

**Level 2: Channel Divinity: Tricks**
As a Magic action, you invoke the gifts of your deity. Choose a creature within 60 feet of you that you can see. That creature must succeed on a Wisdom saving throw or have Disadvantage on the next ability check, attack roll, or saving throw it makes within the next minute.

**Level 6: Invoke the Gift**
You can cast Mirror Image without expending a spell slot. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.

**Level 17: God's Eye**
As a Magic action, you gain Tru暗Sight with a range of 120 feet for 1 hour. In addition, attack rolls against you have Disadvantage until the start of your next turn. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'war-domain',
        category: 'Subclass',
        title: 'War Domain (Cleric)',
        content: 'Inspiration for battle and supernatural weapon blessing.',
        fullInfo: `### War Domain
*Cleric Subclass*

**Description:** War has many manifestations. Clerics who tap into the magic of the War Domain excel in battle, inspiring others to fight the good fight.

#### Features

**Level 1: Bonus Proficiency**
You have Proficiency with Martial weapons and Heavy armor.

**Level 1: War Devotion**
When you attack with a weapon, you can deal extra damage equal to your Wisdom modifier (minimum of +1).

**Level 2: Channel Divinity: War**
As a Bonus Action, you present your Holy Symbol and invoke your deity's aid. Until the end of your next turn, attacks you make deal extra damage, and you can make an additional attack as part of the same action.

**Level 6: War God's Blessing**
When you cast a spell of level 1 or higher that deals damage, you can cast Shield of Faith or Spiritual Weapon rather than expending a spell slot. When you cast either spell in this way, the spell doesn't require Concentration.

**Level 17: Avatar of War**
When you take the Attack action, you can make one additional attack as part of that action. In addition, when you score a Critical Hit with a weapon attack, you gain Resistance to all damage until the end of your next turn.`
    },

    // Druid Circles
    {
        id: 'circle-of-the-land',
        category: 'Subclass',
        title: 'Circle of the Land (Druid)',
        content: 'Protector of natural knowledge. Fog spells and difficult terrain.',
        fullInfo: `### Circle of the Land
*Druid Subclass*

**Description:** The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites.

#### Features

**Level 3: Land's Embrace**
You can cast one of your level 1+ Circle Spells without expending a spell slot, and you must finish a Long Rest before you do so again. When you finish a Short Rest, you can choose expended spell slots to recover.

**Level 3: Circle Spells**
You have敌人的 Circle Spells:

| Level | Circle Spells |
|-------|--------------|
| 3 | Misty Step, Moonbeam |
| 5 | Call Lightning, Revivify |
| 7 | Confusion, Grasping Vine |
| 9 | Greater Restoration, Hold Monster |

**Level 6: Natural Recovery**
During a Short Rest, you can recover one spell slot of level 3 or lower.

**Level 10: Land's Defenses**
When a creature you can see attacks a creature other than you, you can impose Disadvantage on the attack roll.

**Level 14: Active Tracker**
As a Bonus Action, you can cast Locate Creature without expending a spell slot. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.`
    },
    {
        id: 'circle-of-the-moon',
        category: 'Subclass',
        title: 'Circle of the Moon (Druid)',
        content: 'Transform your animal form with natural armor and more powerful forms.',
        fullInfo: `### Circle of the Moon
*Druid Subclass*

**Description:** Druids of the Circle of the Moon draw on lunar magic to transform themselves.

#### Features

**Level 3: Circle Forms**
**Armor Class.** Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast's AC.

**Level 3: Circle of the Moon Spells**
You have the following Circle Spells:

| Level | Circle Spells |
|-------|--------------|
| 3 | Jump, Lunar Mend |
| 5 | Flame Blade, Melf's Acid Arrow |
| 7 | Confusion, Fire Shield |
| 9 | Greater Restoration, Hold Monster |

**Level 6: Improved Circle Forms**
You can transform into Beasts with a Challenge Rating as high as your Druid level divided by 3 (minimum of 1), rounded down. In addition, your Wild Shape form has the following benefits:
- You can use your bonus action to enter Wild Shape.
- While in Wild Shape, you have Resistance to Force, Necrotic, Psychic, and Radiant damage.

**Level 10: Primal Strike**
On weapon or Beast attack hit, extra 1d8 Cold, Fire, Lightning, or Thunder damage.

**Level 18: Beast Spells**
You can cast spells that have only Beast or Plant targets while in your Wild Shape form.`
    },
    {
        id: 'circle-of-the-sea',
        category: 'Subclass',
        title: 'Circle of the Sea (Druid)',
        content: 'One with the tides and storms. Flight and water breathing.',
        fullInfo: `### Circle of the Sea
*Druid Subclass*

**Description:** Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms.

#### Features

**Level 3: Aquatic Affinity**
You have a Swim Speed equal to your Speed, and you can breathe both air and water.

**Level 3: Sea's Wrath**
When you deal Cold or Lightning damage, you can deal extra damage equal to your Proficiency Bonus.

**Level 3: Circle of the Sea Spells**
You have the following Circle Spells:

| Level | Circle Spells |
|-------|--------------|
| 3 | Fog Cloud, Thunderwave |
| 5 | Geyser, Lightning Bolt |
| 7 | Control Water, Freedom of Movement |
| 9 | Commune with Nature, Control Winds |

**Level 6: Shifting Currents**
As a Bonus Action, you can cast Gust of Wind without expending a spell slot.

**Level 10: Deep Reserves**
When you cast a spell that deals Cold, Lightning, or Thunder damage, you gain Temporary Hit Points equal to your Proficiency Bonus.

**Level 14: Tidal Wave**
As an Action, you summon a wave that crashes forward. Each creature in a 30-foot Cone must make a Strength saving throw or take 4d10 Cold or Lightning damage (your choice) and be pushed 20 feet away from you. On a successful save, a creature takes half as much damage and isn't pushed. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'circle-of-the-stars',
        category: 'Subclass',
        title: 'Circle of the Stars (Druid)',
        content: 'Uses the secrets of the constellations. Starry archer and celestial damage.',
        fullInfo: `### Circle of the Stars
*Druid Subclass*

**Description:** The Circle of the Stars has tracked heavenly patterns since time immemorial, discovering secrets hidden amid the constellations.

#### Features

**Level 3: Star Map**
You can use a bonus action to invoke the power of your Star Map to illuminate the darkness. For 10 minutes, bright light shines from you in a 60-foot radius, and dim light extends an additional 60 feet. In addition, you gain a bonus to saving throws equal to your Wisdom modifier (minimum of +1).

**Level 3: Constellation**
You can summon the power of a constellation to enhance your spells:

**Archer.** When you cast a spell that deals damage, you can deal extra Lightning or Cold damage equal to your Proficiency Bonus.

**Chalice.** When you cast a spell that restores Hit Points, the creature regains extra Hit Points equal to 2 plus your Proficiency Bonus.

**Dragon.** When you cast a spell that deals damage, you can roll a d6. On a 5 or 6, the spell deals maximum damage.

**Level 6: Star Constellation**
You can change the active constellation as a Bonus Action.

**Level 10: Cosmic Omens**
When you roll a d20, you can spend 1 use of your Channel Nature to treat the roll as a 20. Once you use this feature, you can't use it again until you finish a Short or Long Rest.

**Level 14: Full Constellation**
Your Constellation abilities are enhanced. The damage or healing of your Archer, Chalice, and Dragon abilities increases to 2d6 plus your Proficiency Bonus.`
    },

    // Fighter
    {
        id: 'battle-master',
        category: 'Subclass',
        title: 'Battle Master (Fighter)',
        content: 'Master of tactical combat. Gains Superiority Dice for combat maneuvers.',
        fullInfo: `### Battle Master
*Fighter Subclass*

**Description:** Battle Masters are consummate tacticians who fight with a reserve of maneuvers that depletion depletes and that they regains with a Short Rest.

#### Features

**Level 3: Combat Superiority**
You have Superiority Dice (d8) equal to your Proficiency Bonus. You regain all expended Superiority Dice when you finish a Short or Long Rest.

**Level 3: Student of War**
You gain proficiency in one type of Artisan's Tools or Gaming Set of your choice.

**Level 3: Maneuvers**
You learn three Maneuvers of your choice. You can use a Maneuver after you make an attack roll. The DC for each is 8 + your Constitution modifier + your Proficiency Bonus:

- **Ambush.** When you make an attack roll, you can add a Superiority Die to the roll.
- **Commander's Strike.** As a Bonus Action, you can designate an ally who can make one weapon attack with a Reaction.
- **Disarming Attack.** The target must succeed on a Strength saving throw or drop one held object.
- **Evasive Footwork.** Add a Superiority Die to a Dexterity saving throw.
- **Feinting Attack.** As a Bonus Action, you have Advantage on your next attack roll.
- **Goading Attack.** The target must succeed on a Wisdom saving throw or have Disadvantage on attack rolls.
- **Lunging Attack.** Add a Superiority Die to a melee weapon attack, and increase the reach by 5 feet.
- **Menacing Attack.** The target must succeed on a Wisdom saving throw or have the Frightened condition.
- **Parry.** Add a Superiority Die to your AC against one attack.
- **Precision Attack.** Add a Superiority Die to an attack roll.
- **Pushing Attack.** The target must succeed on a Strength saving throw or be pushed 15 feet.
- **Quickening Attack.** Make one weapon attack as a Bonus Action.
- **Rally.** An ally gains Temporary Hit Points equal to your Constitution modifier plus the Superiority Die.
- **Riposte.** When a creature misses you, make a weapon attack as a Reaction.
- **Sweeping Attack.** One other creature within 5 feet of the original target must succeed on a Strength saving throw or take damage.
- **Tripping Attack.** The target must succeed on a Strength saving throw or have the Prone condition.

**Level 7: Know Your Enemy**
As a Bonus Action, you can study an enemy you can see within 30 feet. You learn if the creature is your equal, superior, or inferior in regards to two of the following: Strength, Dexterity, Constitution, Armor Class, current Hit Points, total levels or Hit Dice, and Proficiency Bonus.

**Level 10: Improved Combat Superiority**
Your Superiority Dice become d10s.

**Level 15: Relentless**
When you roll Initiative and have no Superiority Dice remaining, you regain one Superiority Die.

**Level 18: Master of Battle**
When you roll Initiative, you regain two Superiority Dice.`
    },
    {
        id: 'champion',
        category: 'Subclass',
        title: 'Champion (Fighter)',
        content: 'Supreme survivor. Improved crits and expanded proficiencies.',
        fullInfo: `### Champion
*Fighter Subclass*

**Description:** The Champion is a warrior who relies on sheer prowess and an enhanced critical range to dominate the battlefield.

#### Features

**Level 3: Improved Critical**
Your attack rolls score a Critical Hit on a roll of 19-20.

**Level 3: Second Wind**
As a Bonus Action, you can regain Hit Points equal to 1d10 plus your Fighter level. Once you use this feature, you can't use it again until you finish a Short or Long Rest.

**Level 7: Great Combat Superiority**
When you take the Attack action, you can make one additional attack.

**Level 10: Superior Critical**
Your attack rolls score a Critical Hit on a roll of 18-20.

**Level 15: Survivor**
At the start of each of your turns, if you have no Hit Points, you regain Hit Points equal to 5 + your Constitution modifier if your HP is less than half your HP max.

**Level 18: Ultimate Champion**
When you score a Critical Hit, you roll additional damage dice equal to your Proficiency Bonus.`
    },
    {
        id: 'eldritch-knight',
        category: 'Subclass',
        title: 'Eldritch Knight (Fighter)',
        content: 'Combines evocation magic with combat. Cast damage spells with weapon in hand.',
        fullInfo: `### Eldritch Knight
*Fighter Subclass*

**Description:** Eldritch Knights combine magical prowess with martial prowess, weaving arcane energy into their weapon attacks.

#### Features

**Level 3: Spellcasting**
You learn three cantrips and two level 1 spells from the Evocation school. Intelligence is your spellcasting ability for these spells.

**Level 3: Weapon Bond**
You learn a ritual that creates a magical bond between yourself and a weapon. Once per Short Rest, you can summon that weapon to your hand as a Bonus Action. A bonded weapon can't be taken from you against your will, and you have Advantage on Attack rolls with it.

**Level 7: Arcane Charge**
When you use Action Surge, you can teleport up to 30 feet to an unoccupied space you can see.

**Level 10: War Magic**
When you take the Attack action, you can make a weapon attack as a Bonus Action.

**Level 15: Arcane Deflection**
When a creature hits you with an attack roll, you can use your Reaction to gain a bonus to your AC equal to your Intelligence modifier (minimum of +1) until the start of your next turn.

**Level 18: Eldritch Veil**
As a Bonus Action, you can spend 3 sorcery points to become Invisible until the end of your next turn.`
    },

    // Monk
    {
        id: 'ascendant-dragon',
        category: 'Subclass',
        title: 'Ascendant Dragon (Monk)',
        content: 'Channels draconic power. Wings, breath, and elemental damage.',
        fullInfo: `### Ascendant Dragon
*Monk Subclass*

**Description:** Ascendant Dragons have unlocked the secret of draconic power, manifesting fangs, wings, scales, and even breath weapons.

#### Features

**Level 3: Bond with Two Creatures**
You can spend 1 ki point to bond with two creatures simultaneously.

**Level 3: Draconic Strike**
When you hit a creature with an Unarmed Strike, you can deal extra damage equal to your Martial Arts die. The damage type matches the damage type of your Draconic Presence.

**Level 6: Breath of the Dragon**
As an Action, you exhale shimmering energy in a 30-foot Cone. Each creature in that area must make a Dexterity saving throw (DC 8 + your Dexterity modifier + your Proficiency Bonus). On a failed save, a creature takes 2d6 damage of the type matching your Draconic Presence, and on a successful save, a creature takes half as much damage.

**Level 11: Wings of the Dragon**
As a Bonus Action, you sprout spectral wings from your back for 1 minute. You gain a Fly Speed equal to your Speed. Once you use this feature, you can't use it again until you finish a Long Rest.

**Level 17: Aspect of the Wyrm**
When you use your Breath of the Dragon or Wings of the Dragon features, you can spend 3 ki points to empower them:
- Breath of the Dragon deals an additional 2d6 damage, and the save DC increases by 2.
- Wings of the Dragon last until the end of your next turn, and you can hover.`
    },
    {
        id: 'mercy',
        category: 'Subclass',
        title: 'Mercy (Monk)',
        content: 'Sanador y asesino. Mana也不知疲倦滴治愈伤口。',
        fullInfo: `### Mercy
*Monk Subclass*

**Description:** Mercy monks are martial arts masters who have learned to manipulate the body's vital energy to heal wounds and inflict precise damage.

#### Features

**Level 3: Flurry of Healing and Harm**
As a Bonus Action, you can spend 1 ki point to touch a creature and restore Hit Points equal to the roll of your Martial Arts die plus your Wisdom modifier. Alternatively, you can touch a creature and deal damage equal to the roll of your Martial Arts die plus your Wisdom modifier.

**Level 3: Hex海的术**
You can use your Flurry of Healing and Harm to instead inflict the Poisoned condition on the target for 1 minute.

**Level 6: Hand of Healing**
When you use your Flurry of Healing and Harm on a creature, you can heal an additional amount equal to your Martial Arts die.

**Level 6: Hand of Harm**
When you use your Flurry of Healing and Harm on a creature, you can deal additional damage equal to your Martial Arts die.

**Level 11: Improved Flurry**
When you use Flurry of Healing and Harm, you can affect two creatures instead of one.

**Level 17: Hand of Ultimate Mercy**
When a creature would drop to 0 Hit Points while within 5 feet of you, you can use your Reaction to reduce the damage it takes and heal it.`
    },
    {
        id: 'shadows',
        category: 'Subclass',
        title: 'Shadow (Monk)',
        content: 'Manipulador de oscuridad. Crea oscuridad, teletransportate y pasa desapercibido.',
        fullInfo: `### Shadow
*Monk Subclass*

**Description:** Shadow monks master the Elemental Plane of Shadow, using its darkness to mask their movements and strike unseen.

#### Features

**Level 3: Shadow Arts**
You know the Light, Minor Illusion, and Darkness cantrips. You can cast them without material components.

**Level 3: Shadow Step**
As a Bonus Action, you can teleport up to 30 feet to an unoccupied space in dim light or darkness. You have Advantage on the first attack roll you make before the end of your next turn.

**Level 6: Shadow Hunt**
As an Action, you become invisible in dim light or darkness until the end of your next turn.

**Level 11: Cloak of Shadows**
As an Action, you can become invisible until the end of your next turn. You can do this a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.

**Level 17: Oppressive Darkness**
As an Action, you can cast Darkness without expending a spell slot. The spell doesn't require Concentration, but it ends when you end your turn. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'four-elements',
        category: 'Subclass',
        title: 'Four Elements (Monk)',
        content: 'Controla los cuatro elementos. Fuegos, agua, tierra y aire.',
        fullInfo: `### Four Elements
*Monk Subclass*

**Description:** Four Elements monks channel the elemental forces of fire, earth, water, and air to empower their combat.

#### Features

**Level 3: Elemental Attunement**
You can spend 2 ki points to cast a level 1 spell that deals damage of the type matching your chosen element.

**Level 3: Disciple of the Elements**
You learn the following spells, which you can cast without material components:

| Level | Spells |
|-------|--------|
| 3 | Burning Hands, Thunderwave |
| 5 | Gust of Wind, Misty Step |
| 9 | Shield, Fireball |
| 13 | Wall of Fire, Ice Storm |
| 17 | Cone of Cold, Chain Lightning |

**Level 6: Breath of Fire**
When you deal Fire damage with a Flurry of Blows, you can deal additional Fire damage equal to your Martial Arts die.

**Level 11: Unleashed Elements**
You can spend 3 ki points to cast a spell of level 4 or lower without material components.

**Level 17: Elemental Mastery**
You can spend 5 ki points to cast an 8th-level spell from the ElementalEvocation list.`
    },

    // Paladin Oaths
    {
        id: 'oath-of-devotion',
        category: 'Subclass',
        title: 'Oath of Devotion (Paladin)',
        content: 'Virtue and absolute justice. Protection against evil and aura of devotion.',
        fullInfo: `### Oath of Devotion
*Paladin Subclass*

**Description:** Paladins of Devotion bind themselves to Justice and Order ideals, vowing to always act with honor and protect the innocent.

#### Features

**Level 3: Oath Spells**
| Level | Spells |
|-------|--------|
| 3 | Shield of Faith, Sanctuary |
| 5 | Aid,zone of Truth |
| 9 | Beacon of Hope, Revivify |
| 13 | Death Ward, Locate Creature |
| 17 | Greater Restoration, Raise Dead |

**Level 3: Channel Divinity: Sacred Weapon**
As a Bonus Action, you imbue a weapon with radiance. The weapon emits Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. Attacks with this weapon deal extra Radiant damage equal to your Charisma modifier.

**Level 3: Channel Divinity: Turn the Unholy**
As an Action, you present your Holy Symbol. Each Fiend or Undead within 30 feet of you must succeed on a Wisdom saving throw or have the Frightened condition until the end of your next turn.

**Level 7: Aura of Devotion**
You and your allies within 10 feet of you have Immunity to the Charmed condition.

**Level 15: Purity of Spirit**
You have Advantage on saving throws against curses and petrification.

**Level 18: Holy Avenger**
As a Bonus Action, you can become an avatar of justice. For 1 minute, you shed Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. In addition, attacks deal extra Radiant damage, and each creature of your choice within 10 feet of you has Resistance to damage from the creature.`
    },
    {
        id: 'oath-of-the-ancients',
        category: 'Subclass',
        title: 'Oath of the Ancients (Paladin)',
        content: 'Protector de la magia y la naturaleza. Resiste hechizos y Aura de Warding.',
        fullInfo: `### Oath of the Ancients
*Paladin Subclass*

**Description:** Paladins of the Oath of the Ancients vow to preserve the light and protect the natural world from darkness.

#### Features

**Level 3: Oath Spells**
| Level | Spells |
|-------|--------|
| 3 | Ensnaring Strike, Speak with Animals |
| 5 | Misty Step, Moonbeam |
| 9 | Call Lightning, Nondetection |
| 13 | Ice Storm, Stoneskin |
| 17 | Commanded, Greater Restoration |

**Level 3: Channel Divinity: Nature's Wrath**
As a Bonus Action, you can imbue a weapon with verdant energy. Attacks with this weapon deal extra damage equal to your Proficiency Bonus, and the target must succeed on a Strength saving throw or have the Restrained condition until the end of your next turn.

**Level 3: Channel Divinity: Turn the Faithless**
As an Action, you present your Holy Symbol. Each Fey or creature of your choice within 30 feet of you must succeed on a Wisdom saving throw or have the Frightened condition until the end of your next turn.

**Level 7: Aura of Warding**
You and your allies within 10 feet of you have Resistance to damage from spells.

**Level 15: Undying Sentinel**
When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this feature, you can't use it again until you finish a Long Rest.

**Level 18: Elder Champion**
As a Bonus Action, you can assume the form of an ancient champion for 1 minute. During this time, you have Advantage on all Charisma checks, and you shed Bright Light in a 30-foot radius and Dim Light for an additional 30 feet.`
    },
    {
        id: 'oath-of-vengeance',
        category: 'Subclass',
        title: 'Oath of Vengeance (Paladin)',
        content: 'Caza악마 sin descanso. Velocidad y golpe potencial contra enemigos.',
        fullInfo: `### Oath of Vengeance
*Paladin Subclass*

**Description:** Paladins of the Oath of Vengeance dedicate themselves to hunting down those who have committed evil acts, pursuing them relentlessly.

#### Features

**Level 3: Oath Spells**
| Level | Spells |
|-------|--------|
| 3 | Bane, Hunter's Mark |
| 5 | Hold Person, Misty Step |
| 9 | Haste, Protection from Energy |
| 13 | Banishment, Dimension Door |
| 17 | Hold Monster, Tree Stride |

**Level 3: Channel Divinity: Abjure Enemy**
As a Bonus Action, you present your Holy Symbol. Choose one creature within 60 feet of you that you can see. That creature must succeed on a Wisdom saving throw or be Stunned until the end of your next turn.

**Level 3: Channel Divinity: Vow of Enmity**
As a Bonus Action, you can enter a vow of enmity against a creature within 10 feet of you. You have Advantage on attack rolls against that creature until it drops to 0 Hit Points or you have the Unconscious condition.

**Level 7: Relentless Avenger**
After you take the Attack action, you can make one additional attack as part of the same action.

**Level 15: Soul of Vengeance**
When a creature under your Vow of Enmity makes an attack roll, you can make a weapon attack as a Reaction against that creature.

**Level 18: Avenging Angel**
As a Bonus Action, you gain a flying speed equal to your current speed for 1 minute, and you can emit a 30-foot Emanation. Creatures of your choice in the Emanation have the Frightened condition until the end of your next turn.`
    },

    // Ranger
    {
        id: 'beast-master',
        category: 'Subclass',
        title: 'Beast Master (Ranger)',
        content: 'Mystic bond with a primal beast that acts in combat.',
        fullInfo: `### Beast Master
*Ranger Subclass*

**Description:** A Beast Master forms mystical bond with a primal beast.

#### Features

**Level 3: Primal Companion**
Magically summon primal beast (Beast of Land, Sky, or Sea). Beast acts on your turn, can move/use Reaction but only Dodge unless commanded. Command with Bonus Action or sacrifice attack to command Beast's Strike. If you have Incapacitated, beast acts on its own. Restore dead beast with Magic action and spell slot within 1 hour. Summon new beast on Long Rest.

**Beast of the Land** - Medium, AC 13 plus Wis mod, HP 5 plus five times ranger level, Speed 40 ft./Climb 40 ft. Primal Bond: add PB to beast's checks/saves. Beast's Strike: 1d8 plus Wis Bludgeoning/Piercing/Slashing, extra 1d6 if moved 20 feet straight toward target, target Prone if Large or smaller.

**Beast of the Sky** - Small, AC 13 plus Wis mod, HP 4 plus four times ranger level, Speed 10 ft./Fly 60 ft. Flyby. Primal Bond. Beast's Strike: 1d4 plus 3 Slashing.

**Beast of the Sea** - Medium, AC 13 plus Wis mod, HP 5 plus five times ranger level, Speed 5 ft./Swim 60 ft. Amphibious. Primal Bond. Beast's Strike: 1d6 plus 2 Bludgeoning/Piercing, target Grappled (escape DC equals spell save DC).

**Level 5: Coordinated Attack**
When you take the Attack action, you can make one additional attack from your Primal Companion.

**Level 7: Beastly Punishment**
When a creature you can see within 5 feet of your Primal Companion deals damage, you can make a weapon attack against that creature as a Reaction.

**Level 11: Bestial Fury**
When commanding Beast's Strike, beast uses it twice. First time each turn it hits creature under Hunter's Mark, deal extra Force damage equal to spell's bonus damage.

**Level 13: Share Spells**
You can cast a spell that targets only you to also affect your Primal Companion.

**Level 15: Storm's Reward**
When your Primal Companion drops to 0 Hit Points, you can heal it as a Bonus Action by spending Hit Dice equal to your Ranger level.`
    },
    {
        id: 'fey-wanderer',
        category: 'Subclass',
        title: 'Fey Wanderer (Ranger)',
        content: 'Walker of the fey realm. Charm spells and fey damage.',
        fullInfo: `### Fey Wanderer
*Ranger Subclass*

**Description:** Fey Wanderers are rangers who have a strong connection to the Feywild and its inhabitants.

#### Features

**Level 3: Fey Wanderer Spells**
| Level | Spells |
|-------|--------|
| 3 | Charm Person, Faerie Fire |
| 5 | Misty Step, Silence |
| 9 | Blink, Nondetection |
| 13 | Confusion, Dimension Door |
| 17 | Greater Restoration, Teleportation Circle |

**Level 3: Beguiling Twist**
When you or a creature you can see within 120 feet of you fails a saving throw against a Charm effect, you can use your Reaction to impose Disadvantage on the next attack roll against you or the affected creature.

**Level 7: Fey reinforcement**
When you finish a Short Rest, you can change the damage type of your weapons to Acid, Cold, Fire, Lightning, or Thunder.

**Level 11: Misty Wanderer**
When you deal damage to a creature with a weapon attack, you can deal additional Psychic damage equal to your Wisdom modifier (minimum of +1).

**Level 15: Bewitching Aura**
As a Bonus Action, you can emanate a bewitching aura for 1 minute. Creatures of your choice within 10 feet of you have Disadvantage on saving throws against charm effects. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'gloom-stalker',
        category: 'Subclass',
        title: 'Gloom Stalker (Ranger)',
        content: 'Cazador de las sombras. Ataque inicial devastador y sigilo supreme.',
        fullInfo: `### Gloom Stalker
*Ranger Subclass*

**Description:** Gloom Stalkers are rangers who specialize in hunting creatures that dwell in darkness.

#### Features

**Level 3: Gloom Stalker Spells**
| Level | Spells |
|-------|--------|
| 3 | Disguise Self, Shadow Blade |
| 5 | Rope Trick, Spider Climb |
| 9 | Fear, Greater Invisibility |
| 13 | Attribute, Greater Restoration |
| 17 |oul's.tragedy, Mislead |

**Level 3: Deep Stalker Apparel**
You know the Pass without Trace spell. Once per Long Rest, you can cast it without expending a spell slot.

**Level 3: Stalker's Prey**
The first time you deal damage to a creature on your first turn of combat, you can deal an additional damage dice.

**Level 7: Shadowy Dodge**
When a creature you can see attacks you, you can use your Reaction to impose Disadvantage on the attack roll.

**Level 11: Stalker Flurry**
When you miss with a weapon attack, you can make another weapon attack as part of the same action.

**Level 15: Shadowy Menace**
When you deal damage to a creature, you can deal additional Psychic damage equal to your Wisdom modifier if the creature is in darkness or dim light.`
    },
    {
        id: 'hunter',
        category: 'Subclass',
        title: 'Hunter (Ranger)',
        content: 'Consummate hunter. Selects tactics against different prey.',
        fullInfo: `### Hunter
*Ranger Subclass*

**Description:** Hunters are rangers who have honed their skills to become deadly predators.

#### Features

**Level 3: Hunter's Prey**
You gain one of the following abilities of your choice:

**Colossus Slayer.** When you deal damage to a creature that is below its hit point maximum, you deal an additional 1d8 damage.

**Giant Killer.** When a Large or larger creature within 5 feet of you deals damage to you, you can use your Reaction to make a weapon attack against that creature.

**Horde Breaker.** When you make a weapon attack, you can make another attack against a different creature that is within 5 feet of the first target and within range.

**Level 7: Defensive Tactics**
You gain one of the following abilities of your choice:

**Evasion.** When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you take no damage on a successful save and only half damage on a failed save.

**Multiattack Defense.** When a creature hits you, you gain a +4 bonus to AC for that attack.

**Steel Will.** You have Advantage on saving throws against being Frightened.

**Level 11: Multiattack**
You gain one of the following abilities of your choice:

**Volley.** As an Action, you can make ranged attacks against any number of creatures within 10 feet of a point you can see.

**Whirlwind Attack.** As an Action, you can make melee attacks against any number of creatures within 5 feet of you.

**Level 15: Superior Hunter's Prey**
You gain one of the following abilities of your choice:

**Evasion.** Your Evasion becomes more powerful.

**Stand Against the Tide.** When a creature you can see misses you with a melee attack, you can use your Reaction to make a weapon attack against that creature.

**Uncanny Browser.** When you deal damage to a creature, you can deal additional damage equal to your Wisdom modifier (minimum of +1).`
    },
    {
        id: 'winter-walker',
        category: 'Subclass',
        title: 'Winter Walker (Ranger)',
        content: 'Cold walker. Frost, frozen ground, and teleport.',
        fullInfo: `### Winter Walker
*Ranger Subclass*

**Description:** Winter Walkers are rangers who have learned to harness the power of winter.

#### Features

**Level 3: Winter Walker Spells**
| Level | Spells |
|-------|--------|
| 3 | Fog Cloud, Ray of Frost |
| 5 | Hold Person, Misty Step |
| 9 | Bestow Curse, Sleet Storm |
| 13 | Greater Invisibility, Ice Storm |
| 17 | Cone of Cold, Commandel |

**Level 3: Tracks of the Frozen**
You can cast Ice Knife without expending a spell slot. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.

**Level 7: Winter's Grip**
When you deal Cold damage to a creature, you can reduce its Speed by 10 feet until the end of the creature's next turn.

**Level 11: Frigid Strikes**
When you deal damage with a weapon attack, you can deal additional Cold damage equal to your Wisdom modifier (minimum of +1).

**Level 15: Blizzard's Howl**
As an Action, you can summon a blizzard that surrounds you for 1 minute. Creatures of your choice within 20 feet of you have Disadvantage on the next attack roll they make. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },

    // Rogue
    {
        id: 'arcane-trickster',
        category: 'Subclass',
        title: 'Arcane Trickster (Rogue)',
        content: 'Rogue with illusion magic. Master of deception and stealth.',
        fullInfo: `### Arcane Trickster
*Rogue Subclass*

**Description:** Arcane Tricksters are rogues who supplement their sneak attacks with magical illusions and enchantments.

#### Features

**Level 3: Spellcasting**
You learn three cantrips and two level 1 spells from the Illusion and Enchantment schools. Intelligence is your spellcasting ability for these spells.

**Level 3: Mage Hand Legerdemain**
You can use your Cunning Action to control the spectral Mage Hand. In addition, you can use it to pick pockets and palm objects.

**Level 9: Magical Jumble**
When a creature within 60 feet of you makes an ability check, you can use your Reaction to impose Disadvantage on the roll.

**Level 13: Illusory Self**
As a Reaction, you can cause an illusory duplicate to appear in your space. The creature that dealt damage to you last turn must succeed on an Intelligence saving throw or have Disadvantage on its next attack roll against you.

**Level 17: Spellcasting Mastery**
When you cast a spell of level 1 or higher, you can gain temporary hit points equal to the spell's level.`
    },
    {
        id: 'assassin',
        category: 'Subclass',
        title: 'Assassin (Rogue)',
        content: 'Assassination master. Surprise attack and instant death.',
        fullInfo: `### Assassin
*Rogue Subclass*

**Description:** Assassins are rogues who specialize in eliminating targets quickly and efficiently.

#### Features

**Level 3: Bonus Proficiencies**
You gain proficiency with Disguise Kit and Poisoner's Kit.

**Level 3: Assassinate**
You have Advantage on attack rolls against creatures that haven't acted yet in combat. In addition, any Critical Hit you score is upgraded to a maximum damage roll.

**Level 9: Infiltration Expertise**
You can cast Detect Poison and Disease as a ritual. In addition, you can cast Identify without expending a spell slot.

**Level 13: Impostor**
You have Advantage on Charisma checks to pass yourself off as a different person.

**Level 17: Death Strike**
When you deal damage to a creature that is surprised, you can deal additional damage equal to your Sneak Attack damage. If the target takes damage from this extra damage, it must succeed on a Constitution saving throw (DC equal to 8 + your Dexterity modifier + your Proficiency Bonus) or have the Unconscious condition until the end of its next turn.`
    },
    {
        id: 'thief',
        category: 'Subclass',
        title: 'Thief (Rogue)',
        content: 'Skilled thief. Uses objects quickly and climbs with speed.',
        fullInfo: `### Thief
*Rogue Subclass*

**Description:** Thieves are rogues who specialize in stealing objects and infiltrating secure locations.

#### Features

**Level 3: Fast Hands**
You can use a Bonus Action to take the Use an Object action.

**Level 3: Second-Story Work**
You have a Climb Speed equal to your Speed. In addition, jumping is considered as moving, not as an action.

**Level 9: Supreme Sneak**
You have Advantage on Dexterity (Stealth) checks to hide.

**Level 13: Use Magic Device**
You can cast spells from scrolls, even if they are from spell lists you don't normally have access to.

**Level 17: Thief's Reflexes**
You can take a second turn during the first round of combat, but you can only use the Attack action and no other actions on that turn.`
    },

    // Sorcerer
    {
        id: 'aberrant-mind',
        category: 'Subclass',
        title: 'Aberrant Mind (Sorcerer)',
        content: 'Psychic power of chaos. Telepathy, psionic damage and charm.',
        fullInfo: `### Aberrant Mind
*Sorcerer Subclass*

**Description:** Aberrant Mind sorcerers have been exposed to the strange magic of the Far Realm, granting them psionic powers.

#### Features

**Level 1: Telepathic Communication**
You can communicate telepathically with creatures within 60 feet of you. In addition, you can cast Detect Thoughts without expending a spell slot.

**Level 1: Psionic Sorcery**
When you cast a spell of level 1 or higher, you can use your Psionic Talent to deal extra Psychic damage equal to the number of sorcery points you spend.

**Level 6: Psychic Defenses**
You have Resistance to Psychic damage, and you have Advantage on saving throws against being Frightened or Charmed.

**Level 6: Aberrant Armor**
As a Bonus Action, you can manifest psychic armor that grants you a +2 bonus to AC until the end of your next turn.

**Level 18: Revelation**
You can cast Reality Break without expending a spell slot. You can do so once per Long Rest, and you regain all expended sorcery points when you cast the spell.`
    },
    {
        id: 'clockwork-soul',
        category: 'Subclass',
        title: 'Clockwork Soul (Sorcerer)',
        content: 'Mechanical order magic. Restores order and neutralizes effects.',
        fullInfo: `### Clockwork Soul
*Sorcerer Subclass*

**Description:** Clockwork Soul sorcerers tap into the power of mechanus, gaining abilities related to order and control.

#### Features

**Level 1: Clockwork Magic**
You know the Guidance cantrip. In addition, you can cast the following spells without expending a spell slot:

| Level | Spells |
|-------|--------|
| 1 | Alarm, Protection from Evil and Good |
| 3 | Lesser Restoration, Silence |
| 5 | Counterspell, Dispel Magic |
| 7 | Banishment, Freedom of Movement |
| 9 | Greater Restoration, Teleportation Circle |

**Level 1: Abjariant Skill**
You have proficiency in one skill from the following list: Arcana, History, Investigation, Nature, or Religion.

**Level 6: Defensive Field**
As a Bonus Action, you can manifest a protective ward that lasts for 1 minute. You gain a number of temporary hit points equal to your sorcerer level plus your Charisma modifier.

**Level 6: Trinity of Threats**
When you cast a spell of level 1 or higher, you can reduce the damage a creature takes by an amount equal to your Proficiency Bonus.

**Level 18: Clockwork Mastery**
You can cast Greater Restoration, Heal, or Teleportation Circle without expending a spell slot. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'draconic',
        category: 'Subclass',
        title: 'Draconic (Sorcerer)',
        content: 'Draconic lineage. Reinforced scales and additional elemental damage.',
        fullInfo: `### Draconic
*Sorcerer Subclass*

**Description:** Draconic sorcerers have a bloodline connection to a dragon, granting them enhanced defenses and offensive capabilities.

#### Features

**Level 1: Draconic Ancestry**
You choose one type of dragon from the Draconic Ancestry table. This choice determines your damage type and other abilities:

| Dragon | Damage Type |
|--------|-------------|
| Black | Acid |
| Blue | Lightning |
| Brass | Fire |
| Bronze | Lightning |
| Copper | Acid |
| Gold | Fire |
| Green | Poison |
| Red | Fire |
| Silver | Cold |
| White | Cold |

**Level 1: Draconic Resilience**
Your skin develops chromatic patches that harden like a dragon's scales. While you aren't wearing armor, your AC equals 13 plus your Dexterity modifier.

**Level 1: Chromatic Warding**
As a Magic action, you can spend 1 sorcery point to gain Resistance to the damage type associated with your Draconic Ancestry until the end of your next turn.

**Level 6: Dragon Wings**
As a Bonus Action, you can manifest spectral wings that grant you a Fly Speed equal to your Speed for 1 minute. You can do so a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.

**Level 18: Draconic Presence**
As an Action, you can emanate dread for 1 minute. Creatures of your choice within 60 feet of you have the Frightened condition until the end of your next turn. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'wild-magic',
        category: 'Subclass',
        title: 'Wild Magic (Sorcerer)',
        content: 'Chaotic magic. Produces wild and unpredictable effects.',
        fullInfo: `### Wild Magic
*Sorcerer Subclass*

**Description:** Wild Magic sorcerers draw on the unpredictable forces of chaos, causing their spells to produce wild and unexpected effects.

#### Features

**Level 1: Wild Magic Surge**
When you cast a spell of level 1 or higher, the DM can have you roll on the Wild Magic Surge table. If the result is 1-2, a Wild Magic Surge occurs.

**Level 1: Tides of Chaos**
You can reroll an attack roll, ability check, or saving throw that fails. Once you use this feature, you can't use it again until you finish a Long Rest.

**Level 6: Unstable Defensive Field**
When you take damage, you can use your Reaction to gain Resistance to that damage until the start of your next turn.

**Level 6: Controlled Chaos**
When you roll on the Wild Magic Surge table, you can roll twice and choose which result to use.

**Level 18: Wild Magic Mastery**
You can cast any spell of level 8 or lower without expending a spell slot. Once you use this feature, you can't use it again until you finish a Long Rest.`
    },

    // Warlock Patrons
    {
        id: 'archfey',
        category: 'Subclass',
        title: 'Archfey (Warlock)',
        content: 'Fey patron. Deception, teleportation and mind control.',
        fullInfo: `### Archfey
*Warlock Subclass*

**Description:** Warlocks who have made pacts with Archfey gain powers related to the Feywild, including abilities to charm, deceive, and teleport.

#### Features

**Level 1: Expanded Spell List**
| Level | Spells |
|-------|--------|
| 1 | Charm Person, Faerie Fire |
| 2 | Blink, Calm Emotions |
| 3 | Bestow Curse, Dispel Magic |
| 4 | Dominate Beast, Greater Invisibility |
| 5 | Greater Restoration, Modify Memory |

**Level 1: Fey Presence**
As a Bonus Action, you can cause each creature of your choice within 10 feet of you to succeed on a Wisdom saving throw or have the Charmed or Frightened condition (your choice) until the end of your next turn.

**Level 6: Misty Escape**
When you take damage, you can use your Reaction to turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn.

**Level 10: Beguiling Defenses**
You have Advantage on saving throws against charm effects. In addition, when a creature you can see fails a charm effect, you can use your Reaction to make a weapon attack against that creature.

**Level 14: Dark Delirium**
As an Action, you can cause a creature to have the Charmed or Frightened condition (your choice) for 1 minute. The creature must succeed on a Wisdom saving throw or be unable to see or hear you.`
    },
    {
        id: 'fiend',
        category: 'Subclass',
        title: 'Fiend (Warlock)',
        content: 'Infernal patron. Additional damage when reducing enemies and temporary hit points.',
        fullInfo: `### Fiend
*Warlock Subclass*

**Description:** Warlocks who have made pacts with Fiends gain powers related to the Lower Planes, including abilities to deal extra damage and heal.

#### Features

**Level 1: Expanded Spell List**
| Level | Spells |
|-------|--------|
| 1 | Burning Hands, Command |
| 2 | Blindness/Deafness, Scorching Ray |
| 3 | Fireball, Stinking Cloud |
| 4 | Banishment, Wall of Fire |
| 5 | Flame Strike, Geas |

**Level 1: Dark One's Blessing**
When you reduce a creature to 0 Hit Points, you gain Temporary Hit Points equal to your Charisma modifier plus your Warlock level.

**Level 6: Dark One's Own Luck**
You can add a d10 to any ability check, attack roll, or saving throw. Once you use this feature, you can't use it again until you finish a Short or Long Rest.

**Level 10: Fiendish Resilience**
You have Resistance to one damage type of your choice: Acid, Cold, Fire, Lightning, or Necrotic.

**Level 14: Hurl through Hell**
When you deal damage to a creature, you can deal additional damage equal to your Charisma modifier (minimum of +1). If this damage reduces the creature to 0 Hit Points, you can teleport to an unoccupied space within 60 feet of the creature.`
    },
    {
        id: 'great-old-one',
        category: 'Subclass',
        title: 'Great Old One (Warlock)',
        content: 'Cosmic patron. Telepathic communication and psychic damage.',
        fullInfo: `### Great Old One
*Warlock Subclass*

**Description:** Warlocks who have made pacts with Great Old Ones gain powers related to the Far Realm, including telepathy and psychic abilities.

#### Features

**Level 1: Expanded Spell List**
| Level | Spells |
|-------|--------|
| 1 | Disonceit, Tasha's Mind Whip |
| 2 | Detect Thoughts, Mind Spike |
| 3 | Clairvoyance, Sending |
| 4 | Dominate Beast, Evard's Black Tentacles |
| 5 | Dominate Person, Modify Memory |

**Level 1: Awakened Mind**
You can communicate telepathically with creatures within 30 feet of you. In addition, you can cast Detect Thoughts without expending a spell slot.

**Level 6: Entropic Ward**
When a creature attacks you, you can use your Reaction to impose Disadvantage on the attack roll. If the attack misses, you have Advantage on your next attack roll against that creature.

**Level 10: Thought Shield**
Your thoughts can't be read by telepathic means, and you have Resistance to Psychic damage.

**Level 14: Create Thrall**
As an Action, you can touch an incapacitated Humanoid. The target has the Stunned condition until you end this effect as a Bonus Action.`
    },
    {
        id: 'hexblade',
        category: 'Subclass',
        title: 'Hexblade (Warlock)',
        content: 'Shadow weapon patron. Weapon attack with curse.',
        fullInfo: `### Hexblade
*Warlock Subclass*

**Description:** Hexblade warlocks have made pacts with entities that exist in the Shadowfell, granting them powers related to weapons and curses.

#### Features

**Level 1: Expanded Spell List**
| Level | Spells |
|-------|--------|
| 1 | Blade Ward, Shield |
| 2 | Blur, Scorching Ray |
| 3 | Blink, Fireball |
| 4 | Dimension Door, Greater Invisibility |
| 5 | Cone of Cold, Scrying |

**Level 1: Hexblade's Curse**
As a Bonus Action, you mark a creature for 1 minute. You gain the following benefits:
- You deal extra damage equal to your Proficiency Bonus to the target.
- The target can't regain Hit Points.
- When you deal damage to the target, you can roll a d10 and reduce the target's Speed to 0 until the end of your current turn.

**Level 1: Hex Warrior**
You can use your Charisma modifier for attack and damage rolls with weapons. In addition, you can use the weapon as your spellcasting focus.

**Level 6: Shadow Shield**
When you have the Hexblade's Curse active, you have Resistance to the target's attack rolls against you.

**Level 10: Ring of the Sire**
When a creature marked by your Hexblade's Curse drops to 0 Hit Points, you gain Temporary Hit Points equal to your Charisma modifier plus your Warlock level.

**Level 14: Death Grip**
When a creature marked by your Hexblade's Curse takes damage, you can deal additional Necrotic damage equal to your Charisma modifier (minimum of +1).`
    },

    // Wizard Schools
    {
        id: 'school-of-abjuration',
        category: 'Subclass',
        title: 'School of Abjuration (Wizard)',
        content: 'School of abjuration. Reinforced health and counterspells.',
        fullInfo: `### School of Abjuration
*Wizard Subclass*

**Description:** Abjuration wizards specialize in protective magic, gaining enhanced health and abilities to counter spells.

#### Features

**Level 2: Arcane Expanse**
You gain proficiency in Medium armor.

**Level 2: Abjuration Savant**
You halve the time and reduce the cost of copying Abjuration spells into your Spellbook.

**Level 2: Projected Ward**
When a creature you can see within 30 feet of you takes damage, you can use your Reaction to reduce the damage by 2d10 plus your Intelligence modifier.

**Level 6: Magic Resistance**
You have Advantage on saving throws against spells. In addition, creatures of your choice within 30 feet of you have Advantage on saving throws against spells.

**Level 10: Spell Resistance**
You have Resistance to damage from spells. In addition, you have Advantage on saving throws against spells.

**Level 14: Improved Abjuration**
When you cast an Abjuration spell, you gain Temporary Hit Points equal to your Intelligence modifier plus the spell's level.`
    },
    {
        id: 'school-of-divination',
        category: 'Subclass',
        title: 'School of Divination (Wizard)',
        content: 'School of divination. Predicts the future and reinforces your rolls.',
        fullInfo: `### School of Divination
*Wizard Subclass*

**Description:** Divination wizards specialize in seeing the future and gathering information, gaining powerful abilities to manipulate fate.

#### Features

**Level 2: Arcane Expanse**
You gain proficiency in Perception.

**Level 2: Divination Savant**
You halve the time and reduce the cost of copying Divination spells into your Spellbook.

**Level 2: Portent**
When you finish a Long Rest, you can roll two d20s and record the results. When a creature makes an attack roll, ability check, or saving throw within 60 feet of you, you can replace the roll with one of your Portent results.

**Level 6: Expert Divination**
When you cast a Divination spell of level 2 or higher, you regain a spell slot of a lower level.

**Level 10: Third Eye**
You gain one of the following abilities of your choice:
- Darkvision 60 feet
- Comprehend Languages
- See Invisibility

**Level 14: Greater Portent**
You can roll three d20s instead of two when you use your Portent feature.`
    },
    {
        id: 'school-of-evocation',
        category: 'Subclass',
        title: 'School of Evocation (Wizard)',
        content: 'School of evocation. Maximum elemental damage and enhanced area of effect.',
        fullInfo: `### School of Evocation
*Wizard Subclass*

**Description:** Evocation wizards specialize in dealing damage, gaining abilities to maximize the impact of their spells.

#### Features

**Level 2: Arcane Expanse**
You gain proficiency in Constitution saving throws.

**Level 2: Evocation Savant**
You halve the time and reduce the cost of copying Evocation spells into your Spellbook.

**Level 2: Sculpted Shields**
When you cast an Evocation spell that affects other creatures you can see, you can exclude a number of them equal to your Intelligence modifier (minimum of 1).

**Level 6: Potent Cantrip**
When you cast a cantrip that deals damage, you add your Intelligence modifier to the damage roll.

**Level 10: Empowered Evocation**
When you roll damage for an Evocation spell, you can reroll a number of damage dice up to your Intelligence modifier (minimum of 1).

**Level 14: Overchannel**
When you cast a Wizard spell of level 1-5 that deals damage, you can deal maximum damage instead of rolling. When you do so, you take 2d12 extra damage for 6th-level or higher spells.`
    },
    {
        id: 'school-of-illusion',
        category: 'Subclass',
        title: 'School of Illusion (Wizard)',
        content: 'School of illusion. Realistic illusions and improved invisibility.',
        fullInfo: `### School of Illusion
*Wizard Subclass*

**Description:** Illusion wizards specialize in creating deceptive images and effects, making their illusions increasingly real.

#### Features

**Level 2: Arcane Expanse**
You gain proficiency in Dexterity saving throws.

**Level 2: Illusion Savant**
You halve the time and reduce the cost of copying Illusion spells into your Spellbook.

**Level 2: Extended Illusion**
When you cast an Illusion spell that lasts 1 minute or longer, you can make the spell last up to 1 hour.

**Level 6: Malleable Illusions**
When you cast an Illusion spell that lasts 1 minute or longer, you can use your Bonus Action to change the nature of the spell.

**Level 10: Illusory Self**
As a Reaction, you can cause an illusory duplicate to appear in your space. The creature that dealt damage to you last turn must succeed on an Intelligence saving throw or have Disadvantage on its next attack roll against you.

**Level 14: Illusory Reality**
When you cast an Illusion spell of level 1 or higher, you can make one object or creature within the spell's area appear real for 1 minute.`
    },

    // --- SPECIES (COMMON) ---
    {
        id: 'aasimar',
        category: 'Species',
        title: 'Aasimar',
        content: 'Mortals with a spark of the Celestial Plane. Divine light, healing, and celestial fury.',
        fullInfo: `### Aasimar (Player's Handbook)

**Source:** Player's Handbook

**Description:** Aasimar (pronounced AH-sih-mar) are mortals who carry a spark of the Upper Planes in their souls. Whether descended from an angelic being or infused with celestial power, they can ignite that spark to bring forth light, healing, and celestial fury. Aasimar resemble their parentage but live up to 160 years and have features that reveal their celestial heritage: metallic freckles, luminous eyes, a halo, or skin the color of an angel (silver, opal-green, or copper).

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Celestial Resistance.** You have Resistance to Necrotic and Radiant damage.

**Darkvision.** You have Darkvision out to 60 feet.

**Healing Hands.** As a Magic Action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains Hit Points equal to the total. Once used, you can't use this again until you finish a Long Rest.

**Light Bearer.** You know the Light cantrip. Charisma is your spellcasting ability for it.

**Celestial Revelation.** At level 3, you can transform as a Bonus Action choosing an option (lasts 1 minute, up to twice per Long Rest):

- **Heavenly Wings.** Spectral wings and Flight Speed equal to your Speed.
- **Inner Radiance.** Bright light (10 feet) and extra Radiant damage to nearby creatures.
- **Necrotic Shroud.** Wings without flight, fear to nearby creatures (DC 8+Charisma+Proficiency).`
    },
    {
        id: 'dragonborn',
        category: 'Species',
        title: 'Dragonborn',
        content: 'Dragon ancestors. Lethal breath, elemental resistance, and draconic flight.',
        fullInfo: `### Dragonborn (Player's Handbook)

**Source:** Player's Handbook

**Description:** The ancestors of dragonborn hatched from the eggs of chromatic and metallic dragons. One story says these eggs were blessed by the dragon gods Bahamut and Tiamat. Another says dragons created the first dragonborn without divine blessings. Dragonborn resemble bipedal dragons without wings: scaly, bright-eyed, and thick-boned with horns on their heads.

**Creature Type:** Humanoid
**Size:** Medium (5-7 feet)
**Speed:** 30 feet

#### Traits

**Draconic Ancestry.** Choose a dragon type that affects your Breath, Resistance, and appearance:

| Dragon | Damage Type |
|--------|-------------|
| Black | Acid |
| Blue | Lightning |
| Brass | Fire |
| Bronze | Lightning |
| Copper | Acid |
| Gold | Fire |
| Green | Poison |
| Red | Fire |
| Silver | Cold |
| White | Cold |

**Breath Weapon.** As part of the Attack Action, you can replace one attack with a breath of energy in a 15-foot Cone or a 30-foot Line (your choice each time). DC 8+Constitution+Proficiency. Damage 1d10 (scales to 2d10/3d10/4d10 at levels 5/11/17). Uses: Proficiency Bonus per Long Rest.

**Damage Resistance.** Resistance to the damage type of your draconic ancestor.

**Darkvision.** 60 feet.

**Draconic Flight.** At level 5, as a Bonus Action you gain Flight equal to your Speed for 10 minutes (1 use per Long Rest).`
    },
    {
        id: 'dwarf',
        category: 'Species',
        title: 'Dwarf',
        content: 'Mountain folk, poison resistance, and stone detection.',
        fullInfo: `### Dwarf (Player's Handbook)

**Source:** Player's Handbook

**Description:** Dwarves were created from the earth by a god of the forge. Called by various names in different worlds (Moradin, Reorx), that god gave them affinity for stone, metal, and underground life. Dwarves are resilient as the mountains, with a lifespan of about 350 years. The eldest tell legends of conflicts with monsters of the mountains and the Underdark.

**Creature Type:** Humanoid
**Size:** Medium (4-5 feet)
**Speed:** 30 feet

#### Traits

**Darkvision.** 120 feet.

**Dwarven Resilience.** Resistance to Poison damage. Advantage on saving throws to avoid or end the Poisoned condition.

**Dwarven Toughness.** Your maximum HP increases by 1, and it increases by 1 additional each time you gain a level.

**Stonecunning.** As a Bonus Action, you gain Tremorsense out to 60 feet for 10 minutes (you must be in contact with stone). Uses: Proficiency Bonus per Long Rest.`
    },
    {
        id: 'elf',
        category: 'Species',
        title: 'Elf',
        content: 'Fey folk, long-lived, 4-hour trance, and magical lineages.',
        fullInfo: `### Elf (Player's Handbook)

**Source:** Player's Handbook

**Description:** Created by the god Corellon, the first elves could change their form at will. They lost this ability when Corellon cursed them for conspiring with the deity Lolth. When Lolth was thrown into the Abyss, most elves renounced her and earned Corellon's forgiveness. Elves have pointed ears and lack facial and body hair. They live about 750 years and don't sleep but enter a trance.

**Creature Type:** Humanoid
**Size:** Medium (5-6 feet)
**Speed:** 30 feet

#### Traits

**Darkvision.** 60 feet.

**Elven Lineage.** Choose a supernatural lineage with specific magic:

| Lineage | Level 1 | Level 3 | Level 5 |
|---------|---------|---------|---------|
| Drow | Darkvision 120 feet, Prestidigitation | Faerie Fire | Darkness |
| High Elf | Prestidigitation (can change) | Detect Magic | Misty Step |
| Wood Elf | Speed 35 feet, Druidcraft | Longstrider | Pass without Trace |
| Lorwyn Elf | Thorn Whip (can change) | Command | Silence |
| Shadowmoor Elf | Darkvision 120 feet, Starry Wisp | Heroism | Gentle Repose |

**Fey Ancestry.** Advantage on saving throws to avoid or end the Charmed condition.

**Keen Senses.** Proficiency in one skill: Insight, Perception, or Survival.

**Trance.** You don't need to sleep. You can finish a Long Rest in 4 hours of meditation.`
    },
    {
        id: 'gnome',
        category: 'Species',
        title: 'Gnome',
        content: 'Small but ingenious, innate magic, and superior mental defenses.',
        fullInfo: `### Gnome (Player's Handbook)

**Source:** Player's Handbook

**Description:** Gnomes are magical beings created by gods of invention, illusions, and underground life. The first gnome communities were rarely seen due to their secretive nature. What they lacked in size, they made up for with ingenuity. They live around 425 years.

**Creature Type:** Humanoid
**Size:** Small (3-4 feet)
**Speed:** 30 feet

#### Traits

**Darkvision.** 60 feet.

**Gnomish Cunning.** Advantage on Intelligence, Wisdom, and Charisma saving throws.

**Gnomish Lineage.** Choose a supernatural lineage:

**Forest Gnome.** You know Minor Illusion. You always have Speak with Animals prepared (Proficiency Bonus uses per Long Rest).

**Rock Gnome.** You know Mending and Prestidigitation. You can spend 10 minutes to create a tiny clockwork device (AC 5, 1 HP) with a Prestidigitation effect. Maximum 3 devices at once.`
    },
    {
        id: 'goliath',
        category: 'Species',
        title: 'Goliath',
        content: 'Giant descendants, ancestral strength, and ability to become Large.',
        fullInfo: `### Goliath (Player's Handbook)

**Source:** Player's Handbook

**Description:** Goliaths dominate over most, being distant descendants of giants. Each goliath carries the favors of the first giants manifested in various supernatural benefits, including the ability to grow quickly and temporarily approach the height of their giant relatives.

**Creature Type:** Humanoid
**Size:** Medium (7-8 feet)
**Speed:** 35 feet

#### Traits

**Giant Ancestry.** Choose a giant benefit (Proficiency Bonus uses per Long Rest):

- **Cloud's Jaunt (Cloud Giant).** As a Bonus Action, teleport 30 feet.
- **Fire's Burn (Fire Giant).** +1d10 Fire damage when you hit.
- **Frost's Chill (Frost Giant).** +1d6 Cold and reduce speed by 10 feet.
- **Hill's Tumble (Hill Giant).** Grant Prone to Large or smaller creatures.
- **Stone's Endurance (Stone Giant).** Reaction: 1d12+Constitution to reduce damage.
- **Storm's Thunder (Storm Giant).** Reaction: 1d8 Thunder to creature that damaged you.

**Large Form.** At level 5, as a Bonus Action become Large (advantage on Strength, +10 feet speed). Lasts 10 minutes. 1 use per Long Rest.

**Powerful Build.** Advantage to end Grappled conditions. You count as one size larger for carrying capacity.`
    },
    {
        id: 'halfling',
        category: 'Species',
        title: 'Halfling',
        content: 'Cheerful and lucky, reroll 1s, and ability to hide behind creatures.',
        fullInfo: `### Halfling (Player's Handbook)

**Source:** Player's Handbook

**Description:** Beloved and guided by gods who value life, home, and hearth, halflings gravitate toward bucolic refuges where family and community shape their lives. Many halflings possess an adventurous spirit that leads them to explore larger worlds. Their size similar to a human child helps them go unnoticed.

**Creature Type:** Humanoid
**Size:** Small (2-3 feet)
**Speed:** 30 feet

#### Traits

**Brave.** Advantage on saving throws to avoid the Frightened condition.

**Halfling Nimbleness.** You can move through the space of any creature that is one size larger than you.

**Luck.** When you roll a 1 on a d20 for a Test, you can reroll the die and must use the new result.

**Naturally Stealthy.** You can take the Hide action even when you are obscured only by a creature at least one size larger than you.`
    },
{
        id: 'human',
        category: 'Species',
        title: 'Human',
        content: 'Versatile and ambitious, source of inspiration and adaptability.',
        fullInfo: `### Human (Player's Handbook)

**Source:** Player's Handbook

**Description:** Found throughout the multiverse, humans are as varied as they are numerous and strive to accomplish as much as they can in the years given to them. Their ambition and ingenuity are praised, respected, and feared on many worlds.

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (2-4 feet), chosen when selecting this species
**Speed:** 30 feet

#### Traits

**Resourceful.** You gain Heroic Inspiration whenever you finish a Long Rest.

**Skillful.** You gain proficiency in one skill of your choice.

**Versatile.** You gain one Origin Feat of your choice.`
    },
    {
        id: 'orc',
        category: 'Species',
        title: 'Orc',
        content: 'Relentless survivors with adrenaline rush and unbreakable endurance.',
        fullInfo: `### Orc (Player's Handbook)

**Source:** Player's Handbook

**Description:** Orcs trace their creation to Gruumsh, a powerful god who equipped his children with gifts to wander plains, vast caverns, and turbulent seas and face the monsters that lurk there. Orcs are tall and stout on average, with gray skin, pointed ears, and prominent lower tusks. They retain Gruumsh's gifts: resilience, determination, and the ability to see in the dark.

**Creature Type:** Humanoid
**Size:** Medium (6-7 feet)
**Speed:** 30 feet

#### Traits

**Adrenaline Rush.** You can take the Dash action as a Bonus Action. When you do, you gain Temporary Hit Points equal to your Proficiency Bonus. Uses: Proficiency Bonus per Short or Long Rest.

**Darkvision.** 120 feet.

**Relentless Endurance.** When you are reduced to 0 HP but don't die instantly, you can drop to 1 HP instead. Once used, you can't use it again until you finish a Long Rest.`
    },
    {
        id: 'tiefling',
        category: 'Species',
        title: 'Tiefling',
        content: 'Infernal legacy with innate magic and supernatural presence.',
        fullInfo: `### Tiefling (Player's Handbook)

**Source:** Player's Handbook

**Description:** Tiefling are born in the Lower Planes or have infernal ancestors. A tiefling is blood-linked to a devil, demon, or other Demon. This connection is the tiefling's infernal legacy, which comes with the promise of power but doesn't affect their moral inclination.

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (3-4 feet), chosen when selecting
**Speed:** 30 feet

#### Traits

**Darkvision.** 60 feet.

**Fiendish Legacy.** Choose a supernatural legacy:

| Legacy | Level 1 | Level 3 | Level 5 |
|--------|---------|---------|---------|
| Abyssal | Poison Resistance + Poison Spray | Ray of Sickness | Hold Person |
| Chthonic | Necrotic Resistance + Chill Touch | False Life | Ray of Enfeeblement |
| Infernal | Fire Resistance + Fire Bolt | Hellish Rebuke | Darkness |

**Otherworldly Presence.** You know the Thaumaturgy cantrip. Charisma is your spellcasting ability for it.`
    },

    // --- SPECIES (EBERRON) ---
    {
        id: 'changeling',
        category: 'Species',
        title: 'Changeling (Eberron)',
        content: 'Masters of shapeshifting with Fey instincts and social skills.',
        fullInfo: `### Changeling (Eberron)

**Source:** Eberron - Forge of the Artificer

**Description:** With constantly changing appearances, changelings reside in many societies undetected. Each changeling can supernaturally adopt any face they desire. In their true form, changelings appear faded, their features almost detailless. However, many changelings develop identities with more depth, creating complete persons with history and beliefs.

**Creature Type:** Fey
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Changeling Instincts.** You gain proficiency in two skills: Deception, Insight, Intimidation, Performance, or Persuasion.

**Shape-Shifter.** As an action, you can change your appearance and voice. You can adjust height, weight, and size between Medium and Small. You can look like another species but your stats don't change. You can't duplicate the appearance of someone you've never seen. While transformed, you have Advantage on Charisma checks. 1 use per turn.`
    },
    {
        id: 'kalashtar',
        category: 'Species',
        title: 'Kalashtar (Eberron)',
        content: 'Union of humans and Quori spirits with telepathy and mental discipline.',
        fullInfo: `### Kalashtar (Eberron)

**Source:** Eberron - Forge of the Artificer

**Description:** Kalashtar (pronounced kal-ASH-tar) are created from the union of humans and renegade spirits called quori from the plane of dreams. Kalashtar appear human but their spiritual connection affects them in various ways. They have slightly angular, symmetrical features and their eyes often glow when they concentrate or express strong emotions.

**Creature Type:** Aberration
**Size:** Medium (6-7 feet)
**Speed:** 30 feet

#### Traits

**Dual Mind.** Advantage on Wisdom and Charisma saving throws.

**Mental Discipline.** Resistance to Psychic damage.

**Mind Link.** Telepathy with range equal to 10 times your level. As a Magic Action, you can give a creature the ability to speak telepathically with you for 1 hour.

**Severed from Dreams.** You can't be targeted by the Dream spell. Additionally, when you finish a Long Rest, you gain proficiency in one skill of your choice until the next Long Rest.`
    },
{
        id: 'khoravar',
        category: 'Species',
        title: 'Khoravar (Eberron)',
        content: 'Half-elves of Eberron with Fey magic and resistance to unconsciousness.',
        fullInfo: `### Khoravar (Eberron)

**Source:** Eberron - Forge of the Artificer

**Description:** Over centuries, descendants of humans and elves have developed their own communities and traditions in Khorvaire. Many Khoravar champion the idea of being "the bridge between," believing they are called to facilitate communication and cooperation between different cultures or species.

**Creature Type:** Humanoid
**Size:** Medium (4-6 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Darkvision.** 60 feet.

**Fey Ancestry.** Advantage on saving throws to avoid or end the Charmed condition.

**Fey Gift.** You know the Friends cantrip. When you finish a Long Rest, you can replace it with another cantrip from the Cleric, Druid, or Wizard lists.

**Lethargy Resilience.** When you fail a saving throw to avoid or end the Unconscious condition, you can succeed instead. Once used, you can't use it again until you finish 1d4 Long Rests.

**Skill Versatility.** You gain proficiency in one skill or tool. You can replace it when you finish a Long Rest.`
    },
    {
        id: 'shifter',
        category: 'Species',
        title: 'Shifter (Eberron)',
        content: 'Bestial humanoids with temporary transformation and animal instincts.',
        fullInfo: `### Shifter (Eberron)

**Source:** Eberron - Forge of the Artificer

**Description:** Shifters - sometimes called "weretouched" - descend from people who contracted full or partial lycanthropy. Shifters look human in height and build but are typically more agile and flexible. Their facial features have a bestial air, often with large eyes and pointed ears.

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Bestial Instincts.** You gain proficiency in one skill: Acrobatics, Athletics, Intimidation, or Survival.

**Darkvision.** 60 feet.

**Shifting.** As a Bonus Action, you can transform into a more bestial appearance (1 minute). You gain Temporary HP equal to 2 × Proficiency Bonus. Uses: Proficiency Bonus per Long Rest. Choose a benefit:

- **Beasthide.** +1d6 Temporary HP. +1 to AC while shifted.
- **Longtooth.** You can make Unarmed Strikes with fangs: 1d6+Strength Piercing.
- **Swiftstride.** +10 feet speed. Reaction to move 10 feet when a creature ends its turn near you.
- **Wildhunt.** Advantage on Wisdom checks while shifted. No creature within 30 feet can have Advantage against you.`
    },
    {
        id: 'warforged',
        category: 'Species',
        title: 'Warforged (Eberron)',
        content: 'Construct beings with integrated armor and poison resistance.',
        fullInfo: `### Warforged (Eberron)

**Source:** Eberron - Forge of the Artificer

**Description:** Warforged are mechanical beings built as weapons to fight in the Last War. An unexpected rupture produced sentient beings made of wood and metal who can nonetheless feel pain and emotion. Warforged comprise a mix of organic and inorganic materials.

**Creature Type:** Construct
**Size:** Medium (6-8 feet) or Small (3-4 feet)
**Speed:** 30 feet

#### Traits

**Construct Resilience.** Resistance to Poison damage. Advantage on saving throws to avoid or end the Poisoned condition.

**Integrated Protection.** +1 to your AC. The armor you don can't be removed against your will while you are alive.

**Sentry's Rest.** You don't need to sleep. You can finish a Long Rest in 6 hours of inactive, motionless state but remain conscious.

**Specialized Design.** You gain proficiency in one skill and one tool of your choice.

**Tireless.** You don't gain levels of Exhaustion from dehydration, malnutrition, or suffocation.`
    },

    // --- SPECIES (LORWYN) ---
    {
        id: 'boggart',
        category: 'Species',
        title: 'Boggart (Lorwyn)',
        content: 'Small goblinoids with Fey magic, fury of the small, and nimble escape.',
        fullInfo: `### Boggart (Lorwyn)

**Source:** Lorwyn - First Light

**Description:** Boggarts are small goblinoid humanoids found in the realm of Lorwyn-Shadowmoor. They possess bestial physical features including horns and animal snouts. Beyond this commonality, boggart appearances vary widely. One boggart might resemble a hedgehog while another might have the snout and fleshy ears of a pig. Boggarts tend to love potion crafting.

**Creature Type:** Humanoid (goblinoid)
**Size:** Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Darkvision.** 60 feet.

**Fey Ancestry.** Advantage on saving throws to avoid or end the Charmed condition.

**Fury of the Small.** When you damage with an attack or spell a creature larger than you, you can cause extra damage equal to your Proficiency Bonus. Maximum once per turn.

**Nimble Escape.** You can take the Disengage or Hide action as a Bonus Action on each of your turns.`
    },
    {
        id: 'faerie',
        category: 'Species',
        title: 'Faerie (Lorwyn)',
        content: 'Small fey beings with Druid magic and natural flight.',
        fullInfo: `### Faerie (Lorwyn)

**Source:** Lorwyn - First Light

**Description:** Known for their pranks, faeries resemble insects with humanoid features. Their size and form can vary, but all have antennae, black eyes, chitinous skin, and insectile legs and wings. Each faerie is born from a flower and possesses innate magic.

**Creature Type:** Fey
**Size:** Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Fairy Magic.** You know Druidcraft.

From level 3: You can cast Faerie Fire. From level 5: You can also cast Enlarge/Reduce. Each 1 use per Long Rest. Intelligence, Wisdom, or Charisma for casting.

**Flight.** You have Flight Speed equal to your Walking Speed. You can't use this speed if you wear medium or heavy armor.

**Shadowmoor Faeries.** Darkvision 120 feet.`
    },
    {
        id: 'flamekin',
        category: 'Species',
        title: 'Flamekin (Lorwyn)',
        content: 'Fire and stone humanoids with Produce Flame and fire magic.',
        fullInfo: `### Flamekin (Lorwyn)

**Source:** Lorwyn - First Light

**Description:** Flamekin are beings created from two key elements of creation: fire and stone. As a result, many flamekin feel a strong connection to the natural world. Flamekin bodies radiate harmless magical flames.

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Darkvision.** 60 feet.

**Fire Resistance.** Resistance to Fire damage.

**Reach to the Blaze.** You know Produce Flame. From level 3: You can cast Burning Hands. From level 5: You can also cast Flame Blade without material components. Intelligence, Wisdom, or Charisma for casting.`
    },
    {
        id: 'lorwyn-changeling',
        category: 'Species',
        title: 'Lorwyn Changeling (Lorwyn)',
        content: 'Fey shapeshifters with blue-green skin and unpredictable movement.',
        fullInfo: `### Lorwyn Changeling (Lorwyn)

**Source:** Lorwyn - First Light

**Description:** Lorwyn changelings are charismatic shapeshifters capable of crudely imitating creature and plant forms. Regardless of form, Lorwyn changelings maintain their key features: blue-green skin, tufts of fur-like tentacles, and bulbous yellow eyes with vertical pupils.

**Creature Type:** Fey
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Shape Self.** As an action, you can reshape your body to bipedal Humanoid form or quadruped Beast form. You can wear clothes and armor made for your size.

**Darkvision.** 120 feet.

**Delightful Imitator.** Proficiency in Performance.

**Unpredictable Movement.** When you roll Initiative without Disadvantage, you can take the Dash action as a Reaction.`
    },
{
        id: 'rimekin',
        category: 'Species',
        title: 'Rimekin (Lorwyn)',
        content: 'Transformed flamekin with cold magic and intense cold.',
        fullInfo: `### Rimekin (Lorwyn)

**Source:** Lorwyn - First Light

**Description:** Rimekin come from both Lorwyn and Shadowmoor, though the first ones emerged from flamekin during the Phyrexian invasion. These flamekin approached their problems with cold logic and rejected reactive responses. As a result, the magical flames that wrapped their bodies took on a icy air and became rimekin.

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 30 feet

#### Traits

**Cold Fire Magic.** You know Ray of Frost. From level 3: Ice Knife. From level 5: Flame Blade (deals Cold instead of Fire). Intelligence, Wisdom, or Charisma for casting.

**Cold Resistance.** Resistance to Cold damage.

**Darkvision.** 60 feet.`
    },

    // --- SPECIES (EXOTIC) ---
    {
        id: 'dhampir',
        category: 'Species',
        title: 'Dhampir (Exotic)',
        content: 'Humanoids with vampiric powers and cursed hunger, speed, and vampiric bite.',
        fullInfo: `### Dhampir (Exotic)

**Source:** Astarion's Book of Hungers

**Description:** Dhampirs are living beings who possess vampiric powers but are cursed with a macabre hunger. Most dhampirs have a thirst for blood, but some derive sustenance from dreams, vital energy, or other sources. Dhampirs must choose whether to fight to control their hunger or yield to predatory impulses.

**Creature Type:** Humanoid
**Size:** Medium (4-7 feet) or Small (2-4 feet)
**Speed:** 35 feet

#### Traits

**Darkvision.** 60 feet.

**Spider Climb.** You have Climb Speed equal to your Speed. From level 3: You can move across vertical surfaces and ceilings leaving your hands free.

**Trace of Undeath.** Resistance to Necrotic damage.

**Vampiric Bite.** When you use Unarmed Strike, you can bite instead of other damage. Piercing Damage 1d4+Constitution instead of normal Unarmed Strike damage.

Additionally, when you damage a creature that is not a Construct or Undead, you can choose one:

- **Drain.** You regain HP equal to the Piercing damage.
- **Strengthen.** You gain a bonus to your next ability check or attack within 1 minute equal to the Piercing damage.

Uses: Proficiency Bonus per Long Rest.`
    },

// --- CONDITIONS ---
    {
        id: 'blinded',
        category: 'Condition',
        title: 'Blinded',
        content: 'You can\'t see. Fail sight-based perception rolls. Disadvantage on attacks.',
        fullInfo: `### Blinded

*   **Can't See.** Automatically fail any ability check that requires sight.
*   **Attacks against You.** Attack rolls against you have Advantage.
*   **Attacks by You.** Your attack rolls have Disadvantage.`
    },
    {
        id: 'exhaustion-2024',
        category: 'Condition',
        title: 'Exhaustion',
        content: 'Cumulative penalties to d20 tests and speed. Lethal at level 6.',
        fullInfo: `### Exhaustion (New Rules)

*   **D20 Test Penalty.** Each level imparts a -2 penalty to all d20 tests.
*   **Speed Reduction.** Speed is reduced by 5 feet for each level.
*   **Death.** Reach level 6 and die immediately.`
    },
    {
        id: 'grappled',
        category: 'Condition',
        title: 'Grappled',
        content: 'Speed 0. Disadvantage on attacks against others.',
        fullInfo: `### Grappled

*   **Speed 0.** Your speed can't increase.
*   **Attacks.** Disadvantage on attack rolls against anyone except the grappler.
*   **Incapacitated.** Condition ends if the grappler becomes Incapacitated.`
    },
    {
        id: 'incapacitated',
        category: 'Condition',
        title: 'Incapacitated',
        content: 'You can\'t take actions or reactions. Breaks concentration.',
        fullInfo: `### Incapacitated

*   **No Actions.** You can't take actions, bonus actions, or reactions.
*   **Concentration.** Breaking immediately.`
    },
    {
        id: 'restrained',
        category: 'Condition',
        title: 'Restrained',
        content: 'Speed 0. Disadvantage on attacks and Dexterity saves.',
        fullInfo: `### Restrained

*   **Speed 0.** Your speed can't increase.
*   **Attack Penalty.** Disadvantage on your attack rolls.
*   **Defensive Penalty.** Advantage on attacks against you and Disadvantage on Dex saves.`
    },
    {
        id: 'charmed',
        category: 'Condition',
        title: 'Charmed',
        content: 'You can\'t attack the one who charmed you. Disadvantage on rolls against the charmer.',
        fullInfo: `### Charmed

*   **Can't Attack.** You can't attack or target the creature that charmed you, or deal damage to it.
*   **Social Disadvantage.** You have Disadvantage on attack rolls against creatures other than the one that charmed you.`
    },
    {
        id: 'deafened',
        category: 'Condition',
        title: 'Deafened',
        content: 'You can\'t hear. Fail hearing-dependent rolls.',
        fullInfo: `### Deafened

*   **Can't Hear.** You can't hear. You automatically fail any ability check that requires hearing.`
    },
    {
        id: 'frightened',
        category: 'Condition',
        title: 'Frightened',
        content: 'Disadvantage on tests and attacks while the source of fear is visible.',
        fullInfo: `### Frightened

*   **Fear Disadvantage.** You have Disadvantage on ability checks and attack rolls while the source of your fear is within line of sight.
*   **Can't Move Closer.** You can't willingly move closer to the source of your fear.`
    },
    {
        id: 'invisible',
        category: 'Condition',
        title: 'Invisible',
        content: 'You can\'t be seen without special aid. Grants advantage on attacks, disadvantage to attacks against you.',
        fullInfo: `### Invisible

*   **Undetectable.** You can't be seen without special aids or magic.
*   **Attack Advantage.** You have Advantage on attack rolls.
*   **Attack Disadvantage.** Attack rolls against you have Disadvantage.`
    },
    {
        id: 'paralyzed',
        category: 'Condition',
        title: 'Paralyzed',
        content: 'Incapacitated. Can\'t move or act. Fail Dexterity saves. Automatic hits.',
        fullInfo: `### Paralyzed

*   **Incapacitated.** You can't move or take actions.
*   **Dex Save Auto-Fail.** You automatically fail Strength and Dexterity saving throws.
*   **Auto-Hit.** Attack rolls against you have Advantage. Any hit deals double damage.`
    },
    {
        id: 'petrified',
        category: 'Condition',
        title: 'Petrified',
        content: 'Transformed to stone. Weight x4. Immune to all damage. Incapacitated and unconscious.',
        fullInfo: `### Petrified

*   **Transformed.** You are transformed into stone. Your weight quadruples and you become unaware of your surroundings.
*   **Incapacitated.** You can't move or take actions.
*   **Unconscious.** You automatically fail Strength and Dexterity saving throws.
*   **Immunity.** You have resistance to all damage.
*   **Attack Advantage.** Attack rolls against you have Advantage.`
    },
    {
        id: 'poisoned',
        category: 'Condition',
        title: 'Poisoned',
        content: 'Disadvantage on attack rolls and ability checks.',
        fullInfo: `### Poisoned

*   **Attack/Check Disadvantage.** You have Disadvantage on attack rolls and ability checks.`
    },
    {
        id: 'prone',
        category: 'Condition',
        title: 'Prone',
        content: 'Only movement is crawling. Attacks within 5 feet have advantage, attacks beyond 5 feet have disadvantage.',
        fullInfo: `### Prone

*   **Crawling.** The only movement you can make is to crawl or creep on the ground, unless you stand up.
*   **Attack Disadvantage.** You have Disadvantage on attack rolls.
*   **Melee Advantage.** Attack rolls against you have Advantage if the attacker is within 5 feet of you. Otherwise, the attack roll has Disadvantage.`
    },
    {
        id: 'stunned',
        category: 'Condition',
        title: 'Stunned',
        content: 'Incapacitated. Can\'t move. Fail Dexterity saves. Automatic hits.',
        fullInfo: `### Stunned

*   **Incapacitated.** You can't move or take actions.
*   **Dex Save Auto-Fail.** You automatically fail Strength and Dexterity saving throws.
*   **Auto-Hit.** Attack rolls against you have Advantage.`
    },
    {
        id: 'unconscious',
        category: 'Condition',
        title: 'Unconscious',
        content: 'Incapacitated. Can\'t move or act. Ignored. Automatic hits.',
        fullInfo: `### Unconscious

*   **Incapacitated.** You can't move or take actions.
*   **Ignored.** You automatically fail Strength and Dexterity saving throws.
*   **Drop Items.** You drop what you're holding and fall Prone.
*   **Unaware.** You can't perceive your surroundings.
*   **Auto-Hit.** Attack rolls against you have Advantage. Any hit deals double damage.`
    },

    // --- FEATS ---
    {
        id: 'alert',
        category: 'Feat',
        title: 'Alert',
        content: 'Initiative Proficiency. When you roll Initiative, you can add your Proficiency Bonus to the roll. Initia',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Initiative Proficiency.** When you roll Initiative, you can add your Proficiency Bonus to the roll.
**Initiative Swap.** Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat.`
    },
    {
        id: 'crafter',
        category: 'Feat',
        title: 'Crafter',
        content: 'Tool Proficiency. You gain proficiency with three Artisan\'s Tools of your choice.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Tool Proficiency.** You gain proficiency with three Artisan's Tools of your choice.
**Discount.** Whenever you buy a nonmagical item, you receive a 20 percent discount on it.
**Fast Crafting.** When you finish a Long Rest, you can craft one piece of gear. The item lasts until you finish another Long Rest.`
    },
    {
        id: 'healer',
        category: 'Feat',
        title: 'Healer',
        content: 'Healing. When you use a Healer\'s Kit to stabilize a dying creature, you also give that creature 1d6 Hit Points.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Healing.** When you use a Healer's Kit to stabilize a dying creature, you also give that creature 1d6 Hit Points.
**Surgical Skill.** As a Bonus Action, you can use a Healer's Kit to tend to a creature's wounds. The creature regains Hit Points equal to 1d6 + your Proficiency Bonus.`
    },
    {
        id: 'lucky',
        category: 'Feat',
        title: 'Lucky',
        content: 'Luck Points. You have a number of Luck Points equal to your Proficiency Bonus.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Luck Points.** You have a number of Luck Points equal to your Proficiency Bonus.
**Advantage.** When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll.
**Disadvantage.** When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.`
    },
    {
        id: 'magic-initiate',
        category: 'Feat',
        title: 'Magic Initiate',
        content: 'Two Cantrips. You learn two cantrips from the Cleric, Druid, or Wizard spell list.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Two Cantrips.** You learn two cantrips from the Cleric, Druid, or Wizard spell list.
**Level 1 Spell.** Choose a level 1 spell. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability when you finish a Long Rest.
**Repeatable.** You can take this feat more than once, but you must choose a different spell list each time.`
    },
    {
        id: 'musician',
        category: 'Feat',
        title: 'Musician',
        content: 'Instrument Training. You gain proficiency with three Musical Instruments of your choice.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Instrument Training.** You gain proficiency with three Musical Instruments of your choice.
**Encouraging Song.** As you finish a Short or Long Rest, you can play a song and give Heroic Inspiration to allies who hear it. The number of allies equals your Proficiency Bonus.`
    },
    {
        id: 'savage-attacker',
        category: 'Feat',
        title: 'Savage Attacker',
        content: 'Rage Damage. When you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Rage Damage.** When you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total. This property can be used a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'skilled',
        category: 'Feat',
        title: 'Skilled',
        content: 'You gain proficiency in three skills of your choice, or you gain expertise in one skill.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain proficiency in three skills of your choice, or you gain expertise in one skill.`
    },
    {
        id: 'tavern-brawler',
        category: 'Feat',
        title: 'Tavern Brawler',
        content: 'Improvised Weapon. A weapon you use for an improvised attack has a +1 bonus to attack rolls.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Improvised Weapon.** A weapon you use for an improvised attack has a +1 bonus to attack rolls, and deals 1d4 damage.
**Grappler.** You have Advantage on attack rolls against a creature you are Grappling.
**Unarmed Strike.** Your Unarmed Strikes deal 1d4 damage, and you have the Grappling Fighting Style.`
    },
    {
        id: 'tough',
        category: 'Feat',
        title: 'Tough',
        content: 'Your Hit Point maximum increases by an amount equal to twice your level when you gain this feat.',
        fullInfo: `### Category
Origin Feat

**Prerequisite:** None


### Benefit
Your Hit Point maximum increases by an amount equal to twice your level when you gain this feat, and then increases by 2 Hit Points whenever you gain a level.`
    },
    {
        id: 'cult-of-the-dragon-initiate',
        category: 'Feat',
        title: 'Cult of the Dragon Initiate',
        content: 'Draconic Spell. You have joined the Cult of the Dragon.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You have joined the Cult of the Dragon.

**Draconic Spell.** You learn the Thunderwave spell and can cast it at 2nd level without using a spell slot.
**Dark One's Blessing.** When you reduce a creature to 0 Hit Points, you gain temporary Hit Points equal to your Proficiency Bonus.`
    },
    {
        id: 'emerald-enclave-fledgling',
        category: 'Feat',
        title: 'Emerald Enclave Fledgling',
        content: 'Natural Recovery. As a Bonus Action, you can regain a spell slot of level 1 or 2.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are a fledgling member of the Emerald Enclave.

**Natural Recovery.** As a Bonus Action, you can regain a spell slot of level 1 or 2. Once you use this benefit, you can't use it again until you finish a Long Rest.
**Reactive.** When a creature you can see moves within 30 feet of you, you can take a Reaction to make an Opportunity Attack.`
    },
    {
        id: 'harper-agent',
        category: 'Feat',
        title: 'Harper Agent',
        content: 'Harper\'s Eye. You have Advantage on Insight and Perception checks.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are an agent of the Harpers.

**Harper's Eye.** You have Advantage on Insight and Perception checks.
**Spellcasting.** You learn the Detect Magic spell and can cast it as a Ritual.`
    },
    {
        id: 'lords-alliance-agent',
        category: 'Feat',
        title: 'Lords\' Alliance Agent',
        content: 'Political Mimicry. You have Advantage on Deception checks to pass as a member of a different noble house.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are an agent of the Lords' Alliance.

**Political Mimicry.** You have Advantage on Deception checks to pass as a member of a different noble house.
**Silver Tongue.** You have Proficiency in Persuasion.`
    },
    {
        id: 'purple-dragon-rook',
        category: 'Feat',
        title: 'Purple Dragon Rook',
        content: 'Shield Bearer. When an ally within 5 feet of you is attacked, you can use your Reaction.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are a member of the Purple Dragon.

**Shield Bearer.** When an ally within 5 feet of you is attacked, you can use your Reaction to impose Disadvantage on the attack roll.
**Retribution.** When you use your Shield Bearer benefit, you can make a melee attack against the attacker as part of the same Reaction.`
    },
    {
        id: 'spellfire-spark',
        category: 'Feat',
        title: 'Spellfire Spark',
        content: 'Spellfire Adept. You have been touched by spellfire.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You have been touched by spellfire.

**Spellfire Adept.** You learn the Eldritch Blast cantrip and can cast it as a 2nd-level spell.
**Spellfire Healing.** As a Bonus Action, you can touch a creature and restore Hit Points equal to your Proficiency Bonus.`
    },
    {
        id: 'tyro-of-the-gauntlet',
        category: 'Feat',
        title: 'Tyro of the Gauntlet',
        content: 'Fighting Style. You gain a Fighting Style feat.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** Level 4+, Strength or Dexterity 13+


### Benefit
You are a newcomer to the fighting styles.

**Fighting Style.** You gain a Fighting Style feat.
**Unarmored Defense.** While you aren't wearing armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier.`
    },
    {
        id: 'zhentarim-ruffian',
        category: 'Feat',
        title: 'Zhentarim Ruffian',
        content: 'Dark Traveler. You have Advantage on Stealth checks in dim light and darkness.',
        fullInfo: `### Category
Origin Feat (Faerun)

**Prerequisite:** None


### Benefit
You are a member of the Zhentarim.

**Dark Traveler.** You have Advantage on Stealth checks in dim light and darkness.
**Snake Oil Salesman.** You have Proficiency in Deception and Persuasion.`
    },
    {
        id: 'child-of-the-sun',
        category: 'Feat',
        title: 'Child of the Sun',
        content: 'Sun\'s Blessing. You have been blessed by the sun.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You have been blessed by the sun.

**Sun's Blessing.** You have Resistance to Radiant damage.
**Light Bearer.** You can cast the Light cantrip at will.`
    },
    {
        id: 'shadowmoor-hexer',
        category: 'Feat',
        title: 'Shadowmoor Hexer',
        content: 'Shadow Step. As a Bonus Action, you can teleport up to 30 feet to an unoccupied space.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You have been touched by the shadows of Shadowmoor.

**Shadow Step.** As a Bonus Action, you can teleport up to 30 feet to an unoccupied space in dim light or darkness.
**Umbral Form.** While in dim light or darkness, you can take the Hide action as a Bonus Action.`
    },
    {
        id: 'tireless-reveler',
        category: 'Feat',
        title: 'Tireless Reveler',
        content: 'Endless Endurance. You have Advantage on Constitution saving throws.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You are a creature of endless party.

**Endless Endurance.** You have Advantage on Constitution saving throws.
**Partier.** You have Proficiency in Performance and Persuasion.`
    },
    {
        id: 'vampire-hunter',
        category: 'Feat',
        title: 'Vampire Hunter',
        content: 'Vampire Slayer. You have Advantage on attack rolls against Vampires.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You hunt the undead.

**Vampire Slayer.** You have Advantage on attack rolls against Vampires.
**Hunter's Sense.** You can sense the presence of undead within 60 feet of you.`
    },
    {
        id: 'vampires-plaything',
        category: 'Feat',
        title: 'Vampire\'s Plaything',
        content: 'Vampire\'s Blessing. You have been touched by a Vampire.',
        fullInfo: `### Category
Origin Feat (Exotic)

**Prerequisite:** None


### Benefit
You have been touched by a Vampire.

**Vampire's Blessing.** You have Resistance to Necrotic damage.
**Undead Weakness.** You have Vulnerability to Radiant damage.`
    },
    {
        id: 'ability-score-improvement',
        category: 'Feat',
        title: 'Ability Score Improvement',
        content: 'Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1. This feat can't increase an ability score above 20.

**Repeatable.** You can take this feat more than once.`
    },
    {
        id: 'actor',
        category: 'Feat',
        title: 'Actor',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Impersonation.** You have Proficiency in Deception and Performance. In addition, when you impersonate someone else, you have Advantage on Deception checks to conceal your identity.`
    },
    {
        id: 'athlete',
        category: 'Feat',
        title: 'Athlete',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Climber.** You have a Climb Speed equal to your Speed.
**Jump.** You have Advantage on Strength (Athletics) checks made to jump, and you don't fall damage if you fall less than 20 feet.`
    },
    {
        id: 'charger',
        category: 'Feat',
        title: 'Charger',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Charge Attack.** If you move at least 10 feet in a straight line before hitting the Attack action, you gain a +2 bonus to the attack's damage roll, or you can make an extra attack as part of the same action.`
    },
    {
        id: 'chef',
        category: 'Feat',
        title: 'Chef',
        content: 'Ability Score Increase. Increase your Constitution or Wisdom score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution or Wisdom score by 1, to a maximum of 20.
**Prepare Feast.** When you finish a Long Rest, you can prepare a feast for up to six people. The feast takes 1 hour to complete, and the creatures who eat the feast gain 1d8 Hit Points, and they can't have the Poisoned condition for 24 hours.`
    },
    {
        id: 'crossbow-expert',
        category: 'Feat',
        title: 'Crossbow Expert',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Ignore Loading.** You ignore the Loading property of Hand Crossbow, Heavy Crossbow, and Light Crossbow.
**Firing in Melee.** Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with crossbows.
**Dual Wielding.** When you make the extra attack of the Light property, you can add your ability modifier to the damage of the extra attack if that attack is with a crossbow that has the Light property.`
    },
    {
        id: 'crusher',
        category: 'Feat',
        title: 'Crusher',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Temporal.** When you hit a creature with an attack that deals bludgeoning damage, you can move the creature 5 feet to an unoccupied space.
**Sundering Strike.** When you hit a creature with a weapon attack, you can deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'defensive-duelist',
        category: 'Feat',
        title: 'Defensive Duelist',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Parry.** When a creature attacks you and you are wielding a melee weapon, you can use your reaction to add your Proficiency Bonus to your Armor Class for that attack.`
    },
    {
        id: 'dual-wielder',
        category: 'Feat',
        title: 'Dual Wielder',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength or Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Enhanced Dual Wielding.** When you take the Attack action and attack with a weapon with the Light property, you can make one extra attack as a Bonus Action later on the same turn with a different weapon.
**Quick Draw.** You can draw or stow two weapons that lack the Two-Handed property.`
    },
    {
        id: 'durable',
        category: 'Feat',
        title: 'Durable',
        content: 'Ability Score Increase. Increase your Constitution score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution score by 1, to a maximum of 20.
**Forceful.** When you roll a Hit Point Die to regain Hit Points, you can reroll the die and use either total.
**Stay Down.** When you have the Unconscious condition, you can make a DC 10 Constitution saving throw to stabilize yourself.`
    },
    {
        id: 'elemental-adept',
        category: 'Feat',
        title: 'Elemental Adept',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Elemental Mastery.** Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. Your spells of that element ignore Resistance to damage of that type.
**Elemental Cantrip.** When you select this feat, you learn one cantrip of the chosen element.`
    },
    {
        id: 'fey-touched',
        category: 'Feat',
        title: 'Fey Touched',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
Your exposure to the Feywild's magic grants you the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Fey Magic.** Choose one level 1 spell from the Divination or Enchantment school. You always have that spell and Misty Step prepared. You can cast each spell once without a spell slot, regaining the ability when you finish a Long Rest.`
    },
    {
        id: 'grappler',
        category: 'Feat',
        title: 'Grappler',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Grappler.** You have Advantage on attack rolls against a creature you are Grappling.
**Pin.** When you have a creature Grappled, you can use your action to deal 1d6 damage to the creature.`
    },
    {
        id: 'great-weapon-master',
        category: 'Feat',
        title: 'Great Weapon Master',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Heavy Weapon Mastery.** When you hit a creature with a weapon that has the Heavy property as part of the Attack action, you can cause the weapon to deal extra damage equal to your Proficiency Bonus.
**Hew.** Immediately after you score a Critical Hit or reduce a creature to 0 Hit Points with a melee weapon, you can make one attack with the same weapon as a Bonus Action.`
    },
    {
        id: 'heavily-armored',
        category: 'Feat',
        title: 'Heavily Armored',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Medium Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Armor Training.** You gain training with Heavy armor.`
    },
    {
        id: 'heavy-armor-master',
        category: 'Feat',
        title: 'Heavy Armor Master',
        content: 'Ability Score Increase. Increase your Strength score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Heavy Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength score by 1, to a maximum of 20.
**Resilient.** While wearing Heavy armor, you have Resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.`
    },
    {
        id: 'inspiring-leader',
        category: 'Feat',
        title: 'Inspiring Leader',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Inspiring Presence.** As a Bonus Action, you can grant yourself and up to five friendly creatures within 30 feet temporary Hit Points equal to your level + your Charisma modifier.`
    },
    {
        id: 'keen-mind',
        category: 'Feat',
        title: 'Keen Mind',
        content: 'Ability Score Increase. Increase your Intelligence score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence score by 1, to a maximum of 20.
**Memory.** You have Advantage on Intelligence (Investigation) and Wisdom (Survival) checks.
**Know-it-all.** You can take the Search action as a Bonus Action.`
    },
    {
        id: 'lightly-armored',
        category: 'Feat',
        title: 'Lightly Armored',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Armor Training.** You gain training with Light armor.`
    },
    {
        id: 'mage-slayer',
        category: 'Feat',
        title: 'Mage Slayer',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Mage Hunter.** When a creature within 5 feet of you casts a spell, you can make an Opportunity Attack against the creature.`
    },
    {
        id: 'martial-weapon-training',
        category: 'Feat',
        title: 'Martial Weapon Training',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Weapon Training.** You gain training with all Martial weapons.`
    },
    {
        id: 'medium-armor-master',
        category: 'Feat',
        title: 'Medium Armor Master',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Medium Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Armor Training.** You gain training with Medium armor.
**Dexterous.** When you wear Medium armor, you can add your Dexterity modifier to your Armor Class.`
    },
    {
        id: 'moderately-armored',
        category: 'Feat',
        title: 'Moderately Armored',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Light Armor Proficiency


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Armor Training.** You gain training with Medium armor and Shields.`
    },
    {
        id: 'mounted-combatant',
        category: 'Feat',
        title: 'Mounted Combatant',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Mounted Fighter.** While you are mounted, you have Advantage on attack rolls against creatures that are Small or smaller.
**Unseat.** When you hit a creature while mounted and the creature is your size or smaller, you can force the creature to make a Strength saving throw or be knocked Prone.`
    },
    {
        id: 'observant',
        category: 'Feat',
        title: 'Observant',
        content: 'Ability Score Increase. Increase your Intelligence or Wisdom score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence or Wisdom score by 1, to a maximum of 20.
**Quick Study.** You have Proficiency in Investigation and Perception. In addition, you can take the Search action as a Bonus Action.`
    },
    {
        id: 'piercer',
        category: 'Feat',
        title: 'Piercer',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Sundering Strike.** When you hit a creature with a weapon that deals piercing damage, you can deal extra damage equal to your Proficiency Bonus.
**Critical.** When you roll a 20 on a d20 for an attack roll with a piercing weapon, you can roll an extra damage die.`
    },
    {
        id: 'poisoner',
        category: 'Feat',
        title: 'Poisoner',
        content: 'Ability Score Increase. Increase your Intelligence or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence or Dexterity score by 1, to a maximum of 20.
**Poisonous Attack.** When you hit a creature with a weapon attack, you can deal extra poison damage equal to your Proficiency Bonus.
**Poison Master.** You have Proficiency with poisoner's supplies, and you have Resistance to poison damage.`
    },
    {
        id: 'polearm-master',
        category: 'Feat',
        title: 'Polearm Master',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Polearm Attack.** When you take the Attack action and attack with a weapon that has the Heavy and Reach properties, you can use your Bonus Action to make a melee attack with the opposite end of the weapon.
**Lunge.** When you make a melee attack with a polearm, you can deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'resilient',
        category: 'Feat',
        title: 'Resilient',
        content: 'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase one ability score of your choice by 1, to a maximum of 20.
**Save Proficiency.** Gain Proficiency in the saving throw of the ability increased.`
    },
    {
        id: 'ritual-caster',
        category: 'Feat',
        title: 'Ritual Caster',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Ritual Adept.** You know three spells with the Ritual tag, and you can cast them as Rituals without preparing them.`
    },
    {
        id: 'sentinel',
        category: 'Feat',
        title: 'Sentinel',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Strength or Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Guardian.** Immediately after a creature within 5 feet of you takes the Disengage action or hits a target other than you, you can make an Opportunity Attack against that creature.
**Halt.** When you hit a creature with an Opportunity Attack, the creature's Speed becomes 0 for the rest of the current turn.`
    },
    {
        id: 'shadow-touched',
        category: 'Feat',
        title: 'Shadow Touched',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
Your exposure to the Shadowfell's magic grants you the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Shadow Magic.** Choose one level 1 spell from the Illusion or Necromancy school. You always have that spell and Invisibility prepared. You can cast each spell once without a spell slot, regaining the ability when you finish a Long Rest.`
    },
    {
        id: 'sharpshooter',
        category: 'Feat',
        title: 'Sharpshooter',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Dexterity 13+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Bypass Cover.** Your ranged attacks ignore Half Cover and Three-Quarters Cover.
**Firing in Melee.** Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with ranged weapons.
**Long Shots.** Attacking at long range doesn't impose Disadvantage on your attack rolls with ranged weapons.`
    },
    {
        id: 'shield-master',
        category: 'Feat',
        title: 'Shield Master',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Shield Bash.** When you take the Attack action, you can use your Bonus Action to make a shield bash.
**Protection.** When you are wielding a Shield, you have +2 bonus to AC.`
    },
    {
        id: 'skill-expert',
        category: 'Feat',
        title: 'Skill Expert',
        content: 'Ability Score Increase. Increase one ability score of your choice by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase one ability score of your choice by 1, to a maximum of 20.
**Skill Expertise.** Choose one skill in which you have Proficiency. Your Proficiency Bonus doubles for ability checks with that skill.`
    },
    {
        id: 'skulker',
        category: 'Feat',
        title: 'Skulker',
        content: 'Ability Score Increase. Increase your Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity score by 1, to a maximum of 20.
**Hide in Plain Sight.** You can attempt to Hide as a Bonus Action, and you can do so even when only lightly obscured.`
    },
    {
        id: 'slasher',
        category: 'Feat',
        title: 'Slasher',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Sundering Strike.** When you hit a creature with a weapon that deals slashing damage, you can reduce the creature's Speed by 10 feet until the start of your next turn.
**Critical.** When you roll a 20 on a d20 for an attack roll with a slashing weapon, you can roll an extra damage die.`
    },
    {
        id: 'speedy',
        category: 'Feat',
        title: 'Speedy',
        content: 'Ability Score Increase. Increase your Dexterity or Constitution score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity or Constitution score by 1, to a maximum of 20.
**Hustle.** You can take the Dash action as a Bonus Action.
**Second Wind.** As a Bonus Action, you can regain Hit Points equal to 1d10 + your Proficiency Bonus.`
    },
    {
        id: 'spell-sniper',
        category: 'Feat',
        title: 'Spell Sniper',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Bypass Cover.** Your ranged spell attacks ignore Half Cover and Three-Quarters Cover.
**War Caster.** You have Advantage on Constitution saving throws made to maintain Concentration.`
    },
    {
        id: 'telekinetic',
        category: 'Feat',
        title: 'Telekinetic',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Minor Telekinesis.** You learn the Mage Hand spell. You can cast it without Verbal or Somatic components, you can make the spectral hand Invisible, and its range increases by 30 feet.
**Telekinetic Shove.** As a Bonus Action, you can telekinetically shove one creature you can see within 30 feet.`
    },
    {
        id: 'telepathic',
        category: 'Feat',
        title: 'Telepathic',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Telepathy.** You can communicate telepathically with creatures within 60 feet of you.
**Sense Thoughts.** You can cast Detect Thoughts once per Long Rest.`
    },
    {
        id: 'war-caster',
        category: 'Feat',
        title: 'War Caster',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** Level 4+, Spellcasting or Pact Magic Feature


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Concentration.** You have Advantage on Constitution saving throws made to maintain Concentration.
**Reactive Spell.** When a creature provokes an Opportunity Attack, you can take a Reaction to cast a spell at the creature.
**Somatic Components.** You can perform the Somatic components of spells even when you have weapons or a Shield in one or both hands.`
    },
    {
        id: 'weapon-master',
        category: 'Feat',
        title: 'Weapon Master',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Weapon Proficiency.** You gain Proficiency with four weapons of your choice.
**Mastery.** Choose one weapon you are proficient with. That weapon gains a Mastery property of your choice.`
    },
    {
        id: 'cold-caster',
        category: 'Feat',
        title: 'Cold Caster',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Frost Cantrip.** You learn the Ray of Frost cantrip.
**Cold Mastery.** When you cast a spell that deals cold damage, you can add your Proficiency Bonus to the damage.`
    },
    {
        id: 'dragonscarred',
        category: 'Feat',
        title: 'Dragonscarred',
        content: 'Ability Score Increase. Increase your Constitution score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution score by 1, to a maximum of 20.
**Dragonscarred Skin.** You have Resistance to one damage type that matches a dragon (choose acid, cold, fire, lightning, or poison).`
    },
    {
        id: 'enclave-magic',
        category: 'Feat',
        title: 'Enclave Magic',
        content: 'Ability Score Increase. Increase your Wisdom score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Wisdom score by 1, to a maximum of 20.
**Enclave Spell.** You learn one Druid cantrip and one level 1 spell from the Druid spell list.`
    },
    {
        id: 'flames-of-phlegethon',
        category: 'Feat',
        title: 'Flames of Phlegethon',
        content: 'Ability Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.
**Fire Cantrip.** You learn the Fire Bolt cantrip if you don't already know it.
**Fire Mastery.** When you cast a spell that deals fire damage, you can add your Proficiency Bonus to the damage.`
    },
    {
        id: 'lor不大的法师',
        category: 'Feat',
        title: 'Lor不大的法师',
        content: 'You have Advantage on Intelligence (Arcana) checks.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You have Advantage on Intelligence (Arcana) checks.`
    },
    {
        id: 'menacing',
        category: 'Feat',
        title: 'Menacing',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Menacing Attack.** When you hit a creature with a weapon attack, you can deal extra psychic damage equal to your Proficiency Bonus.`
    },
    {
        id: 'resourceful-shooter',
        category: 'Feat',
        title: 'Resourceful Shooter',
        content: 'You have a number of special rounds equal to your Proficiency Bonus.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You have a number of special rounds equal to your Proficiency Bonus. You can use a bonus action to enhance your ranged weapon attacks with the following effects until the end of your next turn: the attacks ignore half cover and three-quarters cover, and each hit deals an additional 1d6 force damage. You regain your expended special rounds when you finish a Long Rest.`
    },
    {
        id: 'second-chance',
        category: 'Feat',
        title: 'Second Chance',
        content: 'Ability Score Increase. Increase your Dexterity, Constitution, or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Dexterity, Constitution, or Charisma score by 1, to a maximum of 20.
**Second Chance.** When a creature within 5 feet of you hits you with an attack roll, you can force that creature to reroll the d20 and use the new result. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'silver-tongue',
        category: 'Feat',
        title: 'Silver Tongue',
        content: 'Ability Score Increase. Increase your Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Charisma score by 1, to a maximum of 20.
**Silver Tongue.** You have Advantage on Persuasion checks.`
    },
    {
        id: 'squat-specialist',
        category: 'Feat',
        title: 'Squat Specialist',
        content: 'Ability Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.
**Squat Stature.** You have Advantage on Strength (Athletics) checks to escape from being Grappled.`
    },
    {
        id: 'warchanter',
        category: 'Feat',
        title: 'Warchanter',
        content: 'Ability Score Increase. Increase your Constitution or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Faerun)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Constitution or Charisma score by 1, to a maximum of 20.
**Warchanter Song.** When you take the Attack action on your turn, you can use a Bonus Action to start a Warchanter Song. The song lasts for 1 minute and gives you and allies within 30 feet who can hear you a +1 bonus to attack rolls. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'ally-of-shadow',
        category: 'Feat',
        title: 'Ally of Shadow',
        content: 'Ability Score Increase. Increase your Intelligence or Charisma score by 1, to a maximum of 20.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You gain the following benefits.

**Ability Score Increase.** Increase your Intelligence or Charisma score by 1, to a maximum of 20.
**Darkness.** You learn the Darkness spell and can cast it at 2nd level without using a spell slot.
**Shadow Step.** As a Bonus Action, you can teleport up to 30 feet to an unoccupied space in dim light or darkness.`
    },
    {
        id: 'bane-of-the-stars',
        category: 'Feat',
        title: 'Bane of the Stars',
        content: 'You have Advantage on attack rolls against celestials, fiends, and undead.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on attack rolls against celestials, fiends, and undead.`
    },
    {
        id: 'bear-bpeaker',
        category: 'Feat',
        title: 'Bear-bpeaker',
        content: 'You have Advantage on Wisdom (Animal Handling) checks.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Wisdom (Animal Handling) checks.`
    },
    {
        id: 'black-water-breath',
        category: 'Feat',
        title: 'Black Water Breath',
        content: 'You can hold your breath for 1 hour.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can hold your breath for 1 hour.`
    },
    {
        id: 'cat-footed',
        category: 'Feat',
        title: 'Cat-footed',
        content: 'You can take the Dodge action as a Bonus Action.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can take the Dodge action as a Bonus Action.`
    },
    {
        id: 'dreamspeaker',
        category: 'Feat',
        title: 'Dreamspeaker',
        content: 'You have Advantage on Wisdom (Survival) checks while in deserts.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Wisdom (Survival) checks while in deserts.`
    },
    {
        id: 'elder-fiend',
        category: 'Feat',
        title: 'Elder Fiend',
        content: 'You have Resistance to psychic damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefi
You have Resistance to psychic damage.`
    },
    {
        id: 'fey-barrier',
        category: 'Feat',
        title: 'Fey Barrier',
        content: 'You have Resistance to force damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Resistance to force damage.`
    },
    {
        id: 'ghost-step',
        category: 'Feat',
        title: 'Ghost Step',
        content: 'As a Bonus Action, you can become incorporeal until the end of your next turn.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
As a Bonus Action, you can become incorporeal until the end of your next turn.`
    },
    {
        id: 'iron-hands',
        category: 'Feat',
        title: 'Iron Hands',
        content: 'Your Unarmed Strikes deal 1d6 damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
Your Unarmed Strikes deal 1d6 damage.`
    },
    {
        id: 'iron-mind',
        category: 'Feat',
        title: 'Iron Mind',
        content: 'You have Proficiency in Intelligence saving throws.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Proficiency in Intelligence saving throws.`
    },
    {
        id: 'master-of-disguise',
        category: 'Feat',
        title: 'Master of Disguise',
        content: 'You have Proficiency in Deception and Performance.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Proficiency in Deception and Performance.`
    },
    {
        id: 'pathfinder',
        category: 'Feat',
        title: 'Pathfinder',
        content: 'You can use a Bonus Action to become immune to the charmed and frightened conditions for 1 minute.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can use a Bonus Action to become immune to the charmed and frightened conditions for 1 minute.`
    },
    {
        id: 'rune-stalker',
        category: 'Feat',
        title: 'Rune Stalker',
        content: 'You have Advantage on Wisdom (Survival) checks to track creatures.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Wisdom (Survival) checks to track creatures.`
    },
    {
        id: 'scar-beast',
        category: 'Feat',
        title: 'Scar-beast',
        content: 'You have Resistance to piercing damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Resistance to piercing damage.`
    },
    {
        id: 'spell-stealer',
        category: 'Feat',
        title: 'Spell Stealer',
        content: 'When you reduce a creature to 0 Hit Points, you can steal a spell that creature knew.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
When you reduce a creature to 0 Hit Points, you can steal a spell that creature knew.`
    },
    {
        id: 'storm-step',
        category: 'Feat',
        title: 'Storm Step',
        content: 'You can take the Dash action as a Bonus Action.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You can take the Dash action as a Bonus Action.`
    },
    {
        id: 'suspend-reality',
        category: 'Feat',
        title: 'Suspend Reality',
        content: 'As an Action, you can cause up to three creatures you can see within 60 feet to be paralyzed.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
As an Action, you can cause up to three creatures you can see within 60 feet to be paralyzed. Each target must succeed on a Wisdom saving throw (DC 10 + your Proficiency Bonus + your Charisma modifier) or be paralyzed for 1 minute. A paralyzed creature can make a Wisdom saving throw at the end of each of its turns, ending the effect on itself on a success. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'undead-spawn',
        category: 'Feat',
        title: 'Undead Spawn',
        content: 'When you kill a creature with a melee weapon attack, you can cause it to rise as a zombie.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
When you kill a creature with a melee weapon attack, you can cause it to rise as a zombie under your control. The zombie has a number of Hit Dice equal to your Proficiency Bonus, and it obeys your commands. You can have a number of zombies equal to your Proficiency Bonus at one time. You regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'war-tutor',
        category: 'Feat',
        title: 'War Tutor',
        content: 'When you hit a creature with a weapon attack, you can deal extra damage equal to your Proficiency Bonus.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
When you hit a creature with a weapon attack, you can deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'wild-editor',
        category: 'Feat',
        title: 'Wild Editor',
        content: 'You have Advantage on Charisma (Deception) checks to pass yourself off as a different person.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Advantage on Charisma (Deception) checks to pass yourself off as a different person.`
    },
    {
        id: 'wind-tamer',
        category: 'Feat',
        title: 'Wind Tamer',
        content: 'You have Resistance to lightning damage.',
        fullInfo: `### Category
General Feat (Exotic)

**Prerequisite:** None


### Benefit
You have Resistance to lightning damage.`
    },
    {
        id: 'archery',
        category: 'Feat',
        title: 'Archery',
        content: 'You gain a +2 bonus to attack rolls you make with ranged weapons.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
You gain a +2 bonus to attack rolls you make with ranged weapons.`
    },
    {
        id: 'defense',
        category: 'Feat',
        title: 'Defense',
        content: 'While you are wearing armor, you gain a +1 bonus to AC.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
While you are wearing armor, you gain a +1 bonus to AC.`
    },
    {
        id: 'dueling',
        category: 'Feat',
        title: 'Dueling',
        content: 'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls.`
    },
    {
        id: 'great-weapon-fighting',
        category: 'Feat',
        title: 'Great Weapon Fighting',
        content: 'When you roll a 1 or 2 on a damage die for an attack you make with a two-handed weapon, you can reroll the die.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When you roll a 1 or 2 on a damage die for an attack you make with a two-handed weapon, you can reroll the die and must use the new roll.`
    },
    {
        id: 'two-weapon-fighting',
        category: 'Feat',
        title: 'Two-Weapon Fighting',
        content: 'When you make an extra attack as a result of using a weapon with the Light property, you can add your ability modifier to the damage of that attack.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When you make an extra attack as a result of using a weapon with the Light property, you can add your ability modifier to the damage of that attack if that attack is with a crossbow that has the Light property.`
    },
    {
        id: 'thrown-weapon-fighting',
        category: 'Feat',
        title: 'Thrown Weapon Fighting',
        content: 'You can draw a weapon that has the Thrown property as part of the attack you make with the weapon.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
You can draw a weapon that has the Thrown property as part of the attack you make with the weapon. In addition, your ranged attacks with thrown weapons deal extra damage equal to your Proficiency Bonus.`
    },
    {
        id: 'unarmed-fighting',
        category: 'Feat',
        title: 'Unarmed Fighting',
        content: 'Your Unarmed Strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
Your Unarmed Strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier on a hit. If you are not holding a shield or weapon, you can deal 1d8 damage instead. When you hit a grappled creature with an Unarmed Strike, you can deal bludgeoning damage equal to 1d6 + your Strength modifier, and the target must succeed on a Constitution saving throw (DC 8 + your Proficiency Bonus + your Strength modifier) or be stunned until the end of your next turn.`
    },
    {
        id: 'protection',
        category: 'Feat',
        title: 'Protection',
        content: 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield to use this benefit.`
    },
    {
        id: 'interception',
        category: 'Feat',
        title: 'Interception',
        content: 'When a creature you can see hits a target within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
When a creature you can see hits a target within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your Proficiency Bonus. You must be wielding a shield or a simple or martial weapon to use this benefit.`
    },
    {
        id: 'blind-fighting',
        category: 'Feat',
        title: 'Blind Fighting',
        content: 'You have blindsight with a range of 10 feet.',
        fullInfo: `### Category
Fighting Style Feat

**Prerequisite:** Fighting Style Feature


### Benefit
You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that isn't behind total darkness, even if you're blinded. You can also see invisible creatures within that range.`
    },
    {
        id: 'boon-of-dimensional-travel',
        category: 'Feat',
        title: 'Boon of Dimensional Travel',
        content: 'You can cast Misty Step without expending a spell slot.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You can cast Misty Step without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'boon-of-energy-resistance',
        category: 'Feat',
        title: 'Boon of Energy Resistance',
        content: 'You have Resistance to two damage types of your choice.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You have Resistance to two damage types of your choice. You can change the chosen damage types when you finish a Long Rest.`
    },
    {
        id: 'boon-of-fate',
        category: 'Feat',
        title: 'Boon of Fate',
        content: 'Once per turn, when you roll a d20, you can force the roll to be a 20.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Once per turn, when you roll a d20, you can force the roll to be a 20.`
    },
    {
        id: 'boon-of-fortitude',
        category: 'Feat',
        title: 'Boon of Fortitude',
        content: 'Your Hit Point maximum increases by 40.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Your Hit Point maximum increases by 40, and your Constitution score increases by 2 (to a maximum of 22). In addition, whenever you receive healing, you regain twice as many Hit Points as normal.`
    },
    {
        id: 'boon-of-irresistible-offense',
        category: 'Feat',
        title: 'Boon of Irresistible Offense',
        content: 'Your attacks ignore all damage resistances.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Your attacks ignore all damage resistances.`
    },
    {
        id: 'boon-of-recovery',
        category: 'Feat',
        title: 'Boon of Recovery',
        content: 'You can heal yourself as a Bonus Action.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You can heal yourself as a Bonus Action. You regain a number of Hit Points equal to half your Hit Point maximum. You can use this benefit once per Long Rest.`
    },
    {
        id: 'boon-of-skill',
        category: 'Feat',
        title: 'Boon of Skill',
        content: 'You gain Proficiency in all skills.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You gain Proficiency in all skills, and you can choose one skill to gain Expertise.`
    },
    {
        id: 'boon-of-speed',
        category: 'Feat',
        title: 'Boon of Speed',
        content: 'Your walking speed increases by 30 feet.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
Your walking speed increases by 30 feet. In addition, you can take the Dash action as a Bonus Action.`
    },
    {
        id: 'boon-of-spell-recall',
        category: 'Feat',
        title: 'Boon of Spell Recall',
        content: 'You can cast any spell you know or have prepared without expending a spell slot.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You can cast any spell you know or have prepared without expending a spell slot. Once you use this benefit, you must succeed on a DC 10 Constitution saving throw to use it again.`
    },
    {
        id: 'boon-of-truesight',
        category: 'Feat',
        title: 'Boon of Truesight',
        content: 'You have Truesight with a range of 60 feet.',
        fullInfo: `### Category
Epic Boon Feat

**Prerequisite:** Level 19+


### Benefit
You have Truesight with a range of 60 feet. Within that range, you can see creatures and objects that are invisible, on the Ethereal Plane, or hidden by illusion or magical disguise.`
    },
    {
        id: 'aberrant-dragonmark',
        category: 'Feat',
        title: 'Aberrant Dragonmark',
        content: 'You learn a level 1 spell from the Sorcerer spell list.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You learn a level 1 spell from the Sorcerer spell list. You always have that spell prepared, and you can cast it once without a spell slot. You regain the ability to cast it when you finish a Long Rest.`
    },
    {
        id: 'dragonmark-of Scribing',
        category: 'Feat',
        title: 'Dragonmark of Scribing',
        content: 'You know the Message cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Message cantrip. When you cast it, targets have a +2 bonus to their Wisdom saving throw.`
    },
    {
        id: 'dragonmark-of-sentinels',
        category: 'Feat',
        title: 'Dragonmark of Sentinels',
        content: 'You know the Blade Ward spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Blade Ward spell. When you cast it, you gain a +2 bonus to your Armor Class until the start of your next turn.`
    },
    {
        id: 'dragonmark-of-death',
        category: 'Feat',
        title: 'Dragonmark of Death',
        content: 'You know the Spare the Dying cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Spare the Dying cantrip. When you cast it, the target regains 1 Hit Point.`
    },
    {
        id: 'dragonmark-of-detection',
        category: 'Feat',
        title: 'Dragonmark of Detection',
        content: 'You know the Detect Magic cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Detect Magic cantrip. When you cast it, you can sense the presence of traps within 30 feet of you.`
    },
    {
        id: 'dragonmark-of-findings',
        category: 'Feat',
        title: 'Dragonmark of Findings',
        content: 'You know the Light cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Light cantrip. When you cast it, you can make the light dimmer or brighter.`
    },
    {
        id: 'dragonmark-of-hand',
        category: 'Feat',
        title: 'Dragonmark of Hand',
        content: 'You know the Spare the Dying cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Spare the Dying cantrip. When you cast it, the target regains 1 Hit Point.`
    },
    {
        id: 'dragonmark-of-healing',
        category: 'Feat',
        title: 'Dragonmark of Healing',
        content: 'You know the Cure Wounds spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Cure Wounds spell. When you cast it, you can target one creature within 5 feet of you.`
    },
    {
        id: 'dragonmark-of-hospitality',
        category: 'Feat',
        title: 'Dragonmark of Hospitality',
        content: 'You know the Prestidigitation cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Prestidigitation cantrip. When you cast it, you can create a comfortable area of 10 feet.`
    },
    {
        id: 'dragonmark-of-making',
        category: 'Feat',
        title: 'Dragonmark of Making',
        content: 'You know the Mending cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Mending cantrip. When you cast it, you can repair an object of up to 1 pound of damage.`
    },
    {
        id: 'dragonmark-of-passage',
        category: 'Feat',
        title: 'Dragonmark of Passage',
        content: 'You know the Blade Ward spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Blade Ward spell. When you cast it, you gain a +2 bonus to your Armor Class until the start of your next turn.`
    },
    {
        id: 'dragonmark-of-recovery',
        category: 'Feat',
        title: 'Dragonmark of Recovery',
        content: 'You know the Spare the Dying cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Spare the Dying cantrip. When you cast it, the target regains 1 Hit Point.`
    },
    {
        id: 'dragonmark-of-scribing',
        category: 'Feat',
        title: 'Dragonmark of Scribing',
        content: 'You know the Message cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Message cantrip. When you cast it, targets have a +2 bonus to their Wisdom saving throw.`
    },
    {
        id: 'dragonmark-of-detection',
        category: 'Feat',
        title: 'Dragonmark of Detection',
        content: 'You know the Detect Magic cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Detect Magic cantrip. When you cast it, you can sense the presence of traps within 30 feet of you.`
    },
    {
        id: 'dragonmark-of-storms',
        category: 'Feat',
        title: 'Dragonmark of Storms',
        content: 'You know the Lightning Lure cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Lightning Lure cantrip. When you cast it, you can target one creature.`
    },
    {
        id: 'dragonmark-of-warding',
        category: 'Feat',
        title: 'Dragonmark of Warding',
        content: 'You know the Shield of Faith spell.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Shield of Faith spell. When you cast it, you can target yourself only.`
    },
    {
        id: 'dragonmark-of-waves',
        category: 'Feat',
        title: 'Dragonmark of Waves',
        content: 'You know the Shape Water cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Shape Water cantrip. When you cast it, you can create a small whirlpool.`
    },
    {
        id: 'dragonmark-of-shadow',
        category: 'Feat',
        title: 'Dragonmark of Shadow',
        content: 'You know the Minor Illusion cantrip.',
        fullInfo: `### Category
Dragonmark Feat

**Prerequisite:** None


### Benefit
You know the Minor Illusion cantrip. When you cast it, you can create a silent image.`
    },
    {
        id: 'greater-dragonmark-of-finding',
        category: 'Feat',
        title: 'Greater Dragonmark of Finding',
        content: 'You can cast Locate Object without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Aberrant Dragonmark


### Benefit
You can cast Locate Object without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-scribing',
        category: 'Feat',
        title: 'Greater Dragonmark of Scribing',
        content: 'You can cast Detect Magic at will.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Scribing


### Benefit
You can cast Detect Magic at will, without expending a spell slot.`
    },
    {
        id: 'greater-dragonmark-of-sentinels',
        category: 'Feat',
        title: 'Greater Dragonmark of Sentinels',
        content: 'You can cast Shield without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Sentinels


### Benefit
You can cast Shield without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-death',
        category: 'Feat',
        title: 'Greater Dragonmark of Death',
        content: 'You can cast Speak with Dead without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Death


### Benefit
You can cast Speak with Dead without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-healing',
        category: 'Feat',
        title: 'Greater Dragonmark of Healing',
        content: 'You can cast Cure Wounds without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Healing


### Benefit
You can cast Cure Wounds without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-passage',
        category: 'Feat',
        title: 'Greater Dragonmark of Passage',
        content: 'You can cast Misty Step without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Passage


### Benefit
You can cast Misty Step without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-storms',
        category: 'Feat',
        title: 'Greater Dragonmark of Storms',
        content: 'You can cast Shocking Grasp without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Storms


### Benefit
You can cast Shocking Grasp without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-waves',
        category: 'Feat',
        title: 'Greater Dragonmark of Waves',
        content: 'You can cast Create or Destroy Water without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Waves


### Benefit
You can cast Create or Destroy Water without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-warding',
        category: 'Feat',
        title: 'Greater Dragonmark of Warding',
        content: 'You can cast Protection from Evil and Good without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Warding


### Benefit
You can cast Protection from Evil and Good without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-shadow',
        category: 'Feat',
        title: 'Greater Dragonmark of Shadow',
        content: 'You can cast Pass without Trace without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Shadow


### Benefit
You can cast Pass without Trace without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-hospitality',
        category: 'Feat',
        title: 'Greater Dragonmark of Hospitality',
        content: 'You can cast Locate Object without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Hospitality


### Benefit
You can cast Locate Object without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-making',
        category: 'Feat',
        title: 'Greater Dragonmark of Making',
        content: 'You can cast Detect Magic without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Making


### Benefit
You can cast Detect Magic without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-detection',
        category: 'Feat',
        title: 'Greater Dragonmark of Detection',
        content: 'You can cast Detect Magic without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Detection


### Benefit
You can cast Detect Magic without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-recovery',
        category: 'Feat',
        title: 'Greater Dragonmark of Recovery',
        content: 'You can cast Lesser Restoration without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Recovery


### Benefit
You can cast Lesser Restoration without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-hand',
        category: 'Feat',
        title: 'Greater Dragonmark of Hand',
        content: 'You can cast Mending without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Hand


### Benefit
You can cast Mending without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-death',
        category: 'Feat',
        title: 'Greater Dragonmark of Death',
        content: 'You can cast Speak with Dead without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Death


### Benefit
You can cast Speak with Dead without expending a spell slot. You can use this benefit once per Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-storms',
        category: 'Feat',
        title: 'Greater Dragonmark of Storms',
        content: 'You can cast Shocking Grasp without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Storms


### Benefit
You can cast Shocking Grasp without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-scribing',
        category: 'Feat',
        title: 'Greater Dragonmark of Scribing',
        content: 'You can cast Detect Magic at will.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Scribing


### Benefit
You can cast Detect Magic at will, without expending a spell slot.`
    },
    {
        id: 'greater-dragonmark-of-passage',
        category: 'Feat',
        title: 'Greater Dragonmark of Passage',
        content: 'You can cast Misty Step without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Passage


### Benefit
You can cast Misty Step without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-waves',
        category: 'Feat',
        title: 'Greater Dragonmark of Waves',
        content: 'You can cast Create or Destroy Water without expending a spell slot.',
        fullInfo: `### Category
Greater Dragonmark Feat

**Prerequisite:** Dragonmark of Waves


### Benefit
You can cast Create or Destroy Water without expending a spell slot. You can use this benefit a number of times equal to your Proficiency Bonus, and you regain your expended uses when you finish a Long Rest.`
    },
    {
        id: 'greater-dragonmark-of-warding',
        category: 'Feat',
        title: 'Greater Dragonmark of Warding',
        content: 'Stoneskin',
        fullInfo: `Greater Dragonmark Feat.

Benefit: **Stoneskin.** You can cast Stoneskin once per Long Rest.`
    },
    {
        id: 'potent-dragonmark',
        category: 'Feat',
        title: 'Potent Dragonmark',
        content: 'Arcane Injection',
        fullInfo: `Greater Dragonmark Feat.

Benefit: **Arcane Injection.** When you cast a spell, you can deal extra force damage equal to your Proficiency Bonus.`
    }
];
