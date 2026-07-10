export interface CriticalEffect {
  roll: number;
  physical: string;
  magic: string;
}

export const CRITICAL_TABLE: CriticalEffect[] = [
  { roll: 1, physical: "Precise Strike: You deal maximum possible damage with your weapon without rolling the base damage die.", magic: "Arcane Echo: The magic resonates; the spell repeats once more on the same turn without spending an action." },
  { roll: 2, physical: "Heavy Bleeding: You cause a severe wound. The enemy takes 1d6 extra damage at the start of each of its turns.", magic: "Elemental Bond: The magic clings; the enemy becomes vulnerable to that damage type for 1 turn." },
  { roll: 3, physical: "Heroic Disarm: You strike with such precision that the enemy's weapon or shield flies 6 meters away.", magic: "Seal of Silence: The energy seals the target's vocal cords; it cannot speak for 1 turn." },
  { roll: 4, physical: "Leg Strike: You shatter the target's mobility. Its speed drops to 0 until healed.", magic: "Magical Shackles: Energy tendrils bind the enemy, leaving it restrained for 1 turn." },
  { roll: 5, physical: "Break Guard: You leave the enemy completely exposed. The next attack against it has advantage.", magic: "Mental Breach: The impact saturates its mind; it has disadvantage on its next saving throw." },
  { roll: 6, physical: "Violent Shove: The force of the impact pushes the enemy 3 meters back and knocks it prone.", magic: "Shockwave: An explosion of magical force pushes all enemies 1.5m away." },
  { roll: 7, physical: "Gash/Impact to the Face: Blood or dirt in the eyes. The enemy is blinded for 1 turn.", magic: "Blinding Radiance: An intense flash burns the target's retinas, blinding it for 1 turn." },
  { roll: 8, physical: "Numbed Hand: You strike its dominant arm. It has disadvantage on all its attacks during its turn.", magic: "Energy Drain: Absolute magical sync; you recover a level 1 spell slot." },
  { roll: 9, physical: "Coordinated Attack: You open a perfect gap. An ally within 1.5m can use its reaction to attack it.", magic: "Vital Transfer: Part of the impact's energy heals a nearby ally, restoring 2d6 hit points." },
  { roll: 10, physical: "Concussion: A brutal blow to the head or body. The enemy is stunned for 1 turn.", magic: "Static Overload: Excess energy courses through its body, leaving it paralyzed for 1 turn." },
  { roll: 11, physical: "Cleave: If the target dies from your blow, you can make an additional attack against another adjacent enemy.", magic: "Chain Explosion: The magic rebounds; half the damage dealt jumps to another enemy within 3m." },
  { roll: 12, physical: "Winded: A direct hit to the solar plexus or chest. The enemy loses its extra action on its turn.", magic: "Slowness: The flow of time alters around it. It suffers the effects of the Slow spell for 1 turn." },
  { roll: 13, physical: "Pure Adrenaline: The clamor of battle strengthens you. You immediately recover 1d10 hit points.", magic: "Mana Shield: Residual magic forms a barrier around you; you gain 2d6 temporary hit points." },
  { roll: 14, physical: "Armor Break: You shatter its protection. The enemy suffers a permanent -2 penalty to AC.", magic: "Magical Frailty: You nullify its defenses. The target loses any damage resistance for this combat." },
  { roll: 15, physical: "Brutal Intimidation: Your attack is so terrifying that the enemy is frightened of you for 1 turn.", magic: "Imposing Presence: The magnitude of your magic frightens all enemies within 6 meters." },
  { roll: 16, physical: "Coup de Grâce: You find a critical vital point. You add 2d10 additional damage to the total.", magic: "Pure Critical: Total mastery of the arcane arts; you roll the spell's damage dice three times instead of two." },
  { roll: 17, physical: "Martial Mastery: As soon as you finish your movement, you can make an additional attack.", magic: "Mental Clarity: Your mind works at light speed; you can cast an additional Cantrip immediately." },
  { roll: 18, physical: "Prepared Counter: You remain in perfect guard. You can use your reaction to attack if someone misses you.", magic: "Arcane Mirage: Your figure flickers. You create a perfect illusion of yourself that draws the next enemy attack." },
  { roll: 19, physical: "Inspiring!: Your feat boosts morale. All your allies have advantage on their next attack.", magic: "Aura of Power: You shine brightly. Nearby allies have advantage on saving throws for 1 minute." },
  { roll: 20, physical: "Living Legend!: Perfect execution. If the enemy is a minion, it dies; if it is a boss, it drops to 0 hit points.", magic: "Apotheosis!: Arcane miracle. If the spell has a duration, it becomes permanent (or its most extreme effect applies)." },
];

export const FUMBLE_TABLE: CriticalEffect[] = [
  { roll: 1, physical: "Stumble: You lose your balance and fall to the ground (prone).", magic: "Backlash: The energy bursts in your hands; you take the spell's damage." },
  { roll: 2, physical: "Jam: Your weapon gets stuck, snagged, or tangled.", magic: "Exhaustion: The magical effort exhausts you; you lose your extra action." },
  { roll: 3, physical: "Friendly Fire: You accidentally hit a nearby ally.", magic: "Miscast: The spell rebounds or veers toward a nearby ally." },
  { roll: 4, physical: "Disarm: Your weapon flies 1d4 meters in a random direction.", magic: "Blinding Sparks: A sudden flash leaves you blinded for 1 turn." },
  { roll: 5, physical: "Break: Your armor or shield suffers partial damage (-1 to AC).", magic: "Drain: The magical weave absorbs you; you lose a lower spell slot." },
  { roll: 6, physical: "Muscle Cramp: You suffer a cramp (disadvantage on Strength checks).", magic: "Mental Confusion: You forget what you were doing (disadvantage on Intelligence checks)." },
  { roll: 7, physical: "Temporary Blindness: Dust or blood in the eyes (disadvantage on your next attack).", magic: "Thick Smoke: The spell generates a cloud of smoke that obscures your area." },
  { roll: 8, physical: "Chipped Weapon: The edge is damaged (you deal minimum damage for the rest of combat).", magic: "Spell Pop: The spell fizzles and only produces a harmless burst of confetti." },
  { roll: 9, physical: "Painful Vibration: The clash of weapons leaves you stunned for 1 turn.", magic: "Runic Overload: Static magic leaves you paralyzed for 1 turn." },
  { roll: 10, physical: "Collateral Damage: You break an important object in the environment (rope, pillar, table).", magic: "Unstable Teleport: You teleport 3 meters in a random direction." },
  { roll: 11, physical: "Bite: You bite your tongue while attacking; you can't speak clearly.", magic: "Magical Dysphonia: Your voice becomes squeaky; verbal components fail." },
  { roll: 12, physical: "Broken Strap: Your shield or part of your gear hangs loose and unusable.", magic: "Frost/Fire Burn: Your hands hurt; somatic components fail." },
  { roll: 13, physical: "Dizziness: You spin too much and get dizzy (speed halved).", magic: "Blurred Vision: The magic alters your sight (penalty to visual perception)." },
  { roll: 14, physical: "Lethal Opening: You strike so clumsily that you provoke an opportunity attack.", magic: "Absorption: The target absorbs the energy of your spell and heals instead of taking damage." },
  { roll: 15, physical: "Wardrobe Malfunction: Your belt breaks; your pants fall down (-1.5m movement).", magic: "Arcane Dye: Your clothes and skin change to a bright neon color." },
  { roll: 16, physical: "Stuck: Your weapon is embedded deep in the ground, wood, or stone.", magic: "Wrong Summoning: Instead of the spell, you summon a frightened rabbit." },
  { roll: 17, physical: "Ridiculous Yell: You make a noise that alerts all enemies in the area.", magic: "Arcane Beacon: You shine like a torch, losing any stealth." },
  { roll: 18, physical: "Sprain: You twist an ankle while advancing; you take 1d4 bludgeoning damage.", magic: "Magical Amnesia: You forget the spell you just tried to cast for 1 minute." },
  { roll: 19, physical: "Disorientation: You spin around and end up with your back to the enemy.", magic: "Gravity Inversion: You float a meter in the air, becoming vulnerable." },
  { roll: 20, physical: "Physical Disaster! Roll twice more on this table and apply both results.", magic: "Arcane Chaos! Roll on the Wild Magic table (or roll twice more on this table)." },
];

export const rollOnTable = (table: CriticalEffect[], rollValue?: number): CriticalEffect => {
  const value = rollValue || Math.floor(Math.random() * 20) + 1;
  return table.find(e => e.roll === value) || table[table.length - 1];
};
