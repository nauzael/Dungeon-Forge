/**
 * Test de verificación: Cálculo de HP con Tough/Dwarf/Draconic
 * Comparar CreatorSteps vs LevelUpWizard
 */

const HIT_DIE = {
  Barbarian: 12,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Fighter: 10,
  Monk: 8,
  Paladin: 10,
  Ranger: 10,
  Rogue: 8,
  Sorcerer: 6,
  Warlock: 8,
  Wizard: 6,
};

// ========================================
// SCENARIO 1: Crear un personaje DESDE CERO
// Sorcerer Draconic Nivel 5
// ========================================
console.log("\n=== SCENARIO 1: Crear Sorcerer Draconic desde Nivel 1 a Nivel 5 ===");

const createCharacterHP = (level, conMod, hasFeats = [], subclass = null, isDwarf = false) => {
  const hitDie = HIT_DIE['Sorcerer'];
  
  let baseHp = hitDie + conMod; // Nivel 1
  
  if (level > 1) {
    const avgGain = Math.floor(hitDie / 2) + 1; // 3 + 1 = 4
    baseHp += (avgGain + conMod) * (level - 1); // Niveles 2+
  }
  
  let bonusTotal = 0;
  if (isDwarf) bonusTotal += level;
  if (subclass === 'Draconic Sorcery') bonusTotal += level;
  if (hasFeats.includes('Tough')) bonusTotal += level * 2;
  
  const totalHp = baseHp + bonusTotal;
  
  return { baseHp, bonusTotal, totalHp };
};

const result1 = createCharacterHP(5, 2, [], 'Draconic Sorcery', false);
console.log("Crear desde cero - Sorcerer Draconic CON +2:");
console.log(`  hitDie=6, conMod=+2, draconic=+1/nivel`);
console.log(`  Nivel 1: 6 + 2 = 8`);
console.log(`  Niveles 2-5: 4 * (4 + 2) = 24`);
console.log(`  Draconic (5 niveles): 5 * 1 = 5`);
console.log(`  Base HP: ${result1.baseHp}, Bonuses: ${result1.bonusTotal}, Total: ${result1.totalHp}`);
console.log();

// ========================================
// SCENARIO 2: Subir de NIVEL 4 a 5
// Personaje que YA tiene Draconic
// ========================================
console.log("=== SCENARIO 2: LevelUpWizard - Subir de Nivel 4 a 5 (YA tiene Draconic) ===");

const character_lvl4_with_draconic = {
  level: 4,
  class: 'Sorcerer',
  subclass: 'Draconic Sorcery',
  hp: { max: 22, current: 22 }, // Calculado: 6+2 + (4+2)*3 + 4*1 = 8 + 18 + 4 = 30... espera no
  // Recalculemos: Nivel 1: 6+2=8. Nivel 2-4: (4+2)*3 = 18. Draconic (niveles 1-4): 4*1=4. Total = 8+18+4 = 30
  // Pero en el sistema cada nivel suma por separado
};

// En LevelUpWizard cuando está en Nivel 4 y sube a 5:
const hitDie = HIT_DIE['Sorcerer']; // 6
const conMod = 2;

// Línea 103: Inicializar hpGain
const getAllHpBonusesPerLevel = (hasTough, isDwarf, isDraconic) => {
  let bonus = 0;
  if (hasTough) bonus += 2;
  if (isDwarf) bonus += 1;
  if (isDraconic) bonus += 1;
  return bonus;
};

const hpBonusPerLevel_lvl4 = getAllHpBonusesPerLevel(false, false, true); // 1 (por Draconic)
const avgGain = Math.floor(hitDie / 2) + 1; // 4
const hpGain_lvl5 = Math.max(1, avgGain + conMod + hpBonusPerLevel_lvl4); // 4 + 2 + 1 = 7

console.log(`Actual state (Level 4):`);
console.log(`  hpBonusPerLevel = ${hpBonusPerLevel_lvl4} (Draconic)`);
console.log(`  avgGain = ${avgGain}, conMod = ${conMod}`);
console.log(`  hpGain = ${hpGain_lvl5}`);

// Línea 177: No gana Draconic en este level (ya lo tiene)
const extraHpTotal = 0;
const extraHp = 0; // El usuario no agrega nada

const hpGain_total = hpGain_lvl5 + extraHp + extraHpTotal;
console.log(`  extraHpTotal = 0 (already has Draconic)`);
console.log(`  Total HP gain on Level 5: ${hpGain_total} ✅`);
console.log();

// ========================================
// SCENARIO 3: Subir de NIVEL 4 a 5
// Y GANAR Draconic AHORA (como subclass selection)
// ========================================
console.log("=== SCENARIO 3: LevelUpWizard - Subir a Nivel 2 y Tomar Draconic (NEW) ===");

const hpBonusPerLevel_lvl1 = getAllHpBonusesPerLevel(false, false, false); // 0 (sin Draconic aún)
const hpGain_lvl2_no_draconic = Math.max(1, avgGain + conMod + hpBonusPerLevel_lvl1); // 4 + 2 + 0 = 6
const extraHpTotal_lvl2_draconic = (2 - 1) * 1; // 1 (retro bonus para nivel 1)

const totalGain_lvl2 = hpGain_lvl2_no_draconic + extraHpTotal_lvl2_draconic;
console.log(`Level 1: 6 + 2 = 8`);
console.log(`Sube a Nivel 2 y toma Draconic:`);
console.log(`  hpGain = ${hpGain_lvl2_no_draconic} (sin bonus de Draconic aún)`);
console.log(`  extraHpTotal = ${extraHpTotal_lvl2_draconic} (retro: (2-1)*1)`);
console.log(`  Total gain = ${totalGain_lvl2}`);
console.log(`  New max HP = 8 + ${totalGain_lvl2} = ${8 + totalGain_lvl2}`);
console.log();

// Luego, nivel 3:
const hpBonusPerLevel_lvl2 = getAllHpBonusesPerLevel(false, false, true); // 1 (ahora SÍ tiene Draconic)
const hpGain_lvl3_with_draconic = Math.max(1, avgGain + conMod + hpBonusPerLevel_lvl2); // 4 + 2 + 1 = 7
const extraHpTotal_lvl3 = 0; // No gana nada nuevo
const totalGain_lvl3 = hpGain_lvl3_with_draconic + extraHpTotal_lvl3;

console.log(`Sube a Nivel 3 (YA tiene Draconic):`);
console.log(`  hpGain = ${hpGain_lvl3_with_draconic} (con bonus de Draconic)`);
console.log(`  Total gain = ${totalGain_lvl3}`);
console.log(`  New max HP = ${8 + 8} + ${totalGain_lvl3} = ${8 + 8 + totalGain_lvl3}`);
console.log();

// ========================================
// SCENARIO 4: Tough feat
// ========================================
console.log("=== SCENARIO 4: Comparar con Tough Feat ===");

const createWith_Tough = (level, conMod) => {
  const hitDie = 6;
  let baseHp = hitDie + conMod;
  if (level > 1) {
    const avgGain = Math.floor(hitDie / 2) + 1;
    baseHp += (avgGain + conMod) * (level - 1);
  }
  const tough_bonus = level * 2;
  return baseHp + tough_bonus;
};

console.log(`Creator: Tomar Tough desde Nivel 1 hasta Nivel 5:`);
console.log(`  Total HP = ${createWith_Tough(5, 2)}`);

// Ahora simular en LevelUpWizard: Gana Tough en Nivel 3 como ASI
console.log(`\nLevelUpWizard: Gana Tough en Nivel 3:`);
console.log(`Nivel 1: 8 (sin bonus)`);
console.log(`Nivel 2: +4 = 12`);
console.log(`Nivel 3 (GAIN TOUGH):`);
const hpGain_lvl3_no_tough = Math.max(1, avgGain + conMod); // 4 + 2 = 6
const extraHpTotal_tough = (3 - 1) * 2; // 4 (retro para niveles 1-2)
console.log(`  hpGain = ${hpGain_lvl3_no_tough}, extraHpTotal = ${extraHpTotal_tough}`);
console.log(`  Total gain = ${hpGain_lvl3_no_tough + extraHpTotal_tough}`);
console.log(`  New max HP = 12 + ${hpGain_lvl3_no_tough + extraHpTotal_tough} = ${12 + hpGain_lvl3_no_tough + extraHpTotal_tough}`);

// Continuar a Nivel 4 y 5 con Tough
console.log(`\nNivel 4 (YA tiene Tough):`);
const hpGain_lvl4_with_tough = Math.max(1, avgGain + conMod + 2); // 4 + 2 + 2 = 8
console.log(`  hpGain = ${hpGain_lvl4_with_tough}`);
console.log(`  New max HP = ${12 + 10 + hpGain_lvl4_with_tough} = ${12 + 10 + hpGain_lvl4_with_tough}`);

console.log(`\nNivel 5 (YA tiene Tough):`);
const hpGain_lvl5_with_tough = Math.max(1, avgGain + conMod + 2); // 8
console.log(`  hpGain = ${hpGain_lvl5_with_tough}`);
console.log(`  New max HP = ${12 + 10 + 8 + hpGain_lvl5_with_tough} = ${12 + 10 + 8 + hpGain_lvl5_with_tough}`);

// Comparar con Creator
console.log(`\nComparación final:`);
console.log(`Creator approach (Tough desde nivel 1): ${createWith_Tough(5, 2)}`);
console.log(`LevelUpWizard (Tough gana en nivel 3): ${12 + 10 + 8 + 8}`);
console.log(`✅ MATCH: ${createWith_Tough(5, 2) === (12 + 10 + 8 + 8)}`);
