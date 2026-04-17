/**
 * Test DETALLADO: Cálculo HP - Tough Feat
 * Comparar ruta de creación vs ruta de level up
 */

const HIT_DIE = 6; // Sorcerer
const CON_MOD = 2;

console.log("\n" + "=".repeat(70));
console.log("TEST: Verificar Bug de HP - Tough Feat");
console.log("=".repeat(70));

// ========================================
// RUTA 1: Crear Sorcerer con Tough DESDE NIVEL 1 (Creator)
// ========================================
console.log("\n📌 RUTA 1: Creator (Tough desde Nivel 1)");
console.log("-".repeat(70));

const creator_route = () => {
  let maxHp = 0;
  const levels = [];
  
  for (let lvl = 1; lvl <= 5; lvl++) {
    if (lvl === 1) {
      // Primer nivel: hitDie + conMod
      maxHp = HIT_DIE + CON_MOD; // 6 + 2 = 8
    } else {
      // Niveles siguientes: avgGain + conMod + bonuses
      const avgGain = Math.floor(HIT_DIE / 2) + 1; // 3 + 1 = 4
      const tough_bonus = 2;
      const gain = avgGain + CON_MOD + tough_bonus; // 4 + 2 + 2 = 8
      maxHp += gain;
    }
    
    const tough_accumulated = lvl * 2; // Acumulado de Tough
    levels.push({
      level: lvl,
      hp_before: maxHp - (lvl === 1 ? 0 : (Math.floor(HIT_DIE / 2) + 1 + CON_MOD + 2)),
      gain: lvl === 1 ? (HIT_DIE + CON_MOD) : (Math.floor(HIT_DIE / 2) + 1 + CON_MOD + 2),
      maxHp: maxHp,
    });
  }
  
  console.log("Cálculo por nivel:");
  levels.forEach(l => {
    console.log(`  Nivel ${l.level}: +${l.gain} HP → Total = ${l.maxHp}`);
  });
  
  return maxHp;
};

const creator_total = creator_route();
console.log(`\nTotal Creator: ${creator_total} HP`);

// ========================================
// RUTA 2: LevelUpWizard (gana Tough en Nivel 3)
// ========================================
console.log("\n\n📌 RUTA 2: LevelUpWizard (Tough gana en Nivel 3)");
console.log("-".repeat(70));

const levelup_route = () => {
  let maxHp = 0;
  const levels = [];
  let has_tough = false;
  
  for (let lvl = 1; lvl <= 5; lvl++) {
    let hpGain = 0;
    let extraHpTotal = 0;
    
    if (lvl === 1) {
      // Nivel 1: solo hitDie + conMod
      hpGain = HIT_DIE + CON_MOD; // 6 + 2 = 8
      maxHp = hpGain;
    } else {
      // Niveles 2+
      const avgGain = Math.floor(HIT_DIE / 2) + 1; // 4
      const bonus_per_level = has_tough ? 2 : 0;
      hpGain = Math.max(1, avgGain + CON_MOD + bonus_per_level);
      
      // Si está ganando Tough EN ESTE NIVEL (nivel 3)
      if (lvl === 3 && !has_tough) {
        // Retro bonus: debería haber ganado +2 en cada nivel previo
        // (lvl - 1) es la fórmula pero necesita ajuste
        extraHpTotal = (lvl - 1) * 2; // (3-1)*2 = 4
        has_tough = true; // Ahora sí tiene Tough
      }
      
      maxHp += hpGain + extraHpTotal;
    }
    
    levels.push({
      level: lvl,
      has_tough,
      hpGain,
      extraHpTotal,
      total_gain: hpGain + extraHpTotal,
      maxHp,
    });
  }
  
  console.log("Cálculo por nivel (simulando que gana Tough en Nivel 3):");
  levels.forEach(l => {
    const detail = l.level === 1 
      ? `Nivel 1: hitDie(6) + conMod(2) = ${l.total_gain}`
      : l.level === 3
      ? `Nivel 3: hpGain=${l.hpGain} + retroBonus=${l.extraHpTotal} = ${l.total_gain} (GANA TOUGH)`
      : `Nivel ${l.level}: hpGain=${l.hpGain} (hasTough=${l.has_tough})`;
    
    console.log(`  ${detail} → Total = ${l.maxHp}`);
  });
  
  return maxHp;
};

const levelup_total = levelup_route();
console.log(`\nTotal LevelUpWizard: ${levelup_total} HP`);

// ========================================
// ANÁLISIS
// ========================================
console.log("\n\n" + "=".repeat(70));
console.log("ANÁLISIS");
console.log("=".repeat(70));

console.log(`\nCreator approach:     ${creator_total} HP`);
console.log(`LevelUpWizard approach: ${levelup_total} HP`);
console.log(`Diferencia:           ${creator_total - levelup_total} HP`);

if (creator_total === levelup_total) {
  console.log("\n✅ MATCH: Los cálculos son idénticos");
} else {
  console.log("\n❌ MISMATCH: Los cálculos NO coinciden");
  console.log("\n⚠️  PROBLEMA IDENTIFICADO:");
  console.log("  El sistema de LevelUpWizard no está contando correctamente");
  console.log("  el retroactivo de Tough cuando se gana en un nivel intermedio.");
  
  if (levelup_total < creator_total) {
    console.log(`\n  El personaje está PERDIENDO ${creator_total - levelup_total} HP`);
    console.log("  cuando debería tener los mismos HP en ambas rutas.");
  }
}

// ========================================
// TEST ADICIONAL: Verificar fórmula retroactiva
// ========================================
console.log("\n\n" + "=".repeat(70));
console.log("TEST: Fórmula Retroactiva");
console.log("=".repeat(70));

console.log("\nSi ganas Tough en Nivel 3:");
console.log("  Debiste haber ganado +2 en niveles 1 y 2");
console.log("  Retro = (3-1) * 2 = 4");
console.log("  ✅ Esto es correcto");

console.log("\nPero hay un problema en el cálculo de hpGain en Nivel 3:");
console.log("  hpGain = avgGain + conMod + bonus_per_level");
console.log("  En el momento de llamar a confirmLevelUp():");
console.log("    - El character AÚN NO tiene Tough en su objeto");
console.log("    - Por lo tanto, bonus_per_level = 0");
console.log("    - hpGain = 4 + 2 + 0 = 6");
console.log("  Luego suma:");
console.log("    - extraHpTotal = (3-1) * 2 = 4");
console.log("  Total = 6 + 4 = 10 ✅");

console.log("\nEn Nivel 4 (YA tiene Tough):");
console.log("  hpGain = avgGain + conMod + 2 (porque NOW ha_tough=true)");
console.log("  hpGain = 4 + 2 + 2 = 8");
console.log("  ✅ Esto incluye el bonus de Tough para el nivel 4");

console.log("\nEl issue es: ¿El retroactivo está siendo aplicado CORRECTAMENTE?");
