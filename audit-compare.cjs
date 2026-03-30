const fs = require('fs');
const path = require('path');

const MANUAL_DIR = path.join(__dirname, 'docs', 'Manual');
const DATA_DIR = path.join(__dirname, 'Data');

let report = [];

function log(msg) {
  console.log(msg);
  report.push(msg + '\n');
}

function readFile(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}

// ============================================================
// AUDIT 01: CLASSES
// ============================================================
log('='.repeat(80));
log('AUDITORIA 01: CLASSES');
log('Manual: docs/Manual/01-classes.md');
log('Data:   Data/classes/classes-en.ts');
log('='.repeat(80));

const classesMd = readFile(path.join(MANUAL_DIR, '01-classes.md'));
const classesTs = readFile(path.join(DATA_DIR, 'classes', 'classes-en.ts'));

const classExportMap = {
  'Artificer': 'artificerEn',
  'Barbarian': 'barbarianEn',
  'Bard': 'bardEn',
  'Cleric': 'clericEn',
  'Druid': 'druidEn',
  'Fighter': 'fighterEn',
  'Monk': 'monkEn',
  'Paladin': 'paladinEn',
  'Ranger': 'rangerEn',
  'Rogue': 'rogueEn',
  'Sorcerer': 'sorcererEn',
  'Warlock': 'warlockEn',
  'Wizard': 'wizardEn'
};

function getClassSection(md, className) {
  const pattern = '### ' + className;
  const idx = md.indexOf(pattern);
  if (idx === -1) return '';
  const next = md.indexOf('\n### ', idx + 1);
  return next === -1 ? md.substring(idx) : md.substring(idx, next);
}

function getHitDie(md, className) {
  const section = getClassSection(md, className);
  if (!section) return null;
  const m = section.match(/\*\*Hit Point Die\*\*:\s*D(\d+)/);
  return m ? parseInt(m[1]) : null;
}

function getSavingThrows(md, className) {
  const section = getClassSection(md, className);
  if (!section) return [];
  const m = section.match(/\*\*Saving Throw[^:]*:\s*(.+?)(?:\n|$)/);
  if (!m) return [];
  return m[1].split(/,\s*|\band\b/i).map(s => s.trim().toUpperCase().substring(0, 3));
}

function getSubclasses(md, className) {
  const section = getClassSection(md, className);
  if (!section) return [];
  const subs = [];
  const re = /^\s*-\s+(.+?)\s*$/gm;
  let m;
  while ((m = re.exec(section)) !== null) {
    const name = m[1].trim();
    if (name && name.length > 2 && !name.includes('**') && !name.includes(' Proficiency') && !name.includes('Choose')) {
      subs.push(name);
    }
  }
  return subs;
}

function getHitDieTS(ts, exportName) {
  const re = new RegExp('export const ' + exportName + '[\\s\\S]*?hitDie:\\s*(\\d+)', 'i');
  const m = ts.match(re);
  return m ? parseInt(m[1]) : null;
}

function getSavingThrowsTS(ts, exportName) {
  const re = new RegExp('export const ' + exportName + '[\\s\\S]*?savingThrows:\\s*\\[([^\\]]+)\\]', 'i');
  const m = ts.match(re);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim().replace(/'/g, '').toUpperCase());
}

function getSubclassesTS(ts, exportName) {
  const re = new RegExp('export const ' + exportName + '[\\s\\S]*?subclasses:\\s*\\[([\\s\\S]*?)\\]\\s*as SubclassData', 'i');
  const m = ts.match(re);
  if (!m) return [];
  const content = m[1];
  const names = [];
  const nameRe = /name:\s*'([^']+)'/g;
  let n;
  while ((n = nameRe.exec(content)) !== null) {
    names.push(n[1]);
  }
  return names;
}

let classesOk = 0, classesIssues = 0;

Object.keys(classExportMap).forEach(className => {
  const exportName = classExportMap[className];
  log(`\n### ${className}`);

  const manualHD = getHitDie(classesMd, className);
  const dataHD = getHitDieTS(classesTs, exportName);
  if (manualHD === dataHD) {
    log(`  Hit Die: OK D${dataHD}`);
    classesOk++;
  } else {
    log(`  Hit Die: DIF MANUAL D${manualHD} vs DATA D${dataHD}`);
    classesIssues++;
  }

  const manualST = getSavingThrows(classesMd, className);
  const dataST = getSavingThrowsTS(classesTs, exportName);
  const stMatch = manualST.length === dataST.length && manualST.every(s => dataST.includes(s));
  if (stMatch) {
    log(`  Saving Throws: OK [${dataST.join(', ')}]`);
    classesOk++;
  } else {
    log(`  Saving Throws: DIF MANUAL [${manualST.join(', ')}] vs DATA [${dataST.join(', ')}]`);
    classesIssues++;
  }

  const manualSub = getSubclasses(classesMd, className);
  const dataSub = getSubclassesTS(classesTs, exportName);
  const subMatch = manualSub.length === dataSub.length && manualSub.every(s => dataSub.includes(s));
  if (subMatch) {
    log(`  Subclasses: OK ${dataSub.length} - [${dataSub.join(', ')}]`);
    classesOk++;
  } else {
    log(`  Subclasses: DIF`);
    log(`    MANUAL (${manualSub.length}): [${manualSub.slice(0,5).join(', ')}${manualSub.length > 5 ? '...' : ''}]`);
    log(`    DATA   (${dataSub.length}): [${dataSub.join(', ')}]`);
    classesIssues++;
  }
});

log(`\n${'='.repeat(80)}`);
log(`CLASES RESUMEN: ${classesOk} OK, ${classesIssues} problemas`);
log(`${'='.repeat(80)}\n`);

// ============================================================
// AUDIT 02: SPECIES & BACKGROUNDS
// ============================================================
log('='.repeat(80));
log('AUDITORIA 02: SPECIES & BACKGROUNDS');
log('='.repeat(80));

const speciesMd = readFile(path.join(MANUAL_DIR, '02-species-backgrounds.md'));
const speciesTs = readFile(path.join(DATA_DIR, 'species', 'species-en.ts'));
const backgroundsTs = readFile(path.join(DATA_DIR, 'backgrounds.ts'));

function getSpeciesFromManual(md) {
  const idx = md.indexOf('## Species');
  if (idx === -1) return [];
  const section = md.substring(idx);
  const names = [];
  const re = /###\s+(\w+(?:\s+\w+)?)\s*\n/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    const name = m[1];
    if (!['Species', 'Traits', 'Partes', 'Comunes'].includes(name)) {
      names.push(name);
    }
  }
  return names;
}

function getSpeciesFromTS(ts) {
  const names = [];
  // Match "export const dwarfEn: DetailData ="
  const re = /export const (\w+En):\s*DetailData\s*=/g;
  let m;
  while ((m = re.exec(ts)) !== null) {
    names.push(m[1].replace('En', ''));
  }
  return names;
}

function getBackgroundsFromManual(md) {
  const idx = md.indexOf('## Backgrounds');
  if (idx === -1) return [];
  const endIdx = md.indexOf('\n## ', idx + 1);
  const section = endIdx === -1 ? md.substring(idx) : md.substring(idx, endIdx);
  const names = [];
  const re = /###\s+(\w+(?:\s+\w+)?)\s*\n/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    const name = m[1];
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

function getBackgroundsFromTS(ts) {
  const names = [];
  const re = /name:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(ts)) !== null) {
    if (!names.includes(m[1])) names.push(m[1]);
  }
  return names;
}

const speciesManual = getSpeciesFromManual(speciesMd);
const speciesData = getSpeciesFromTS(speciesTs);
log(`\nSpecies:`);
log(`  MANUAL: ${speciesManual.length} - ${speciesManual.slice(0,5).join(', ')}...`);
log(`  DATA:   ${speciesData.length} - ${speciesData.slice(0,5).join(', ')}...`);
const missSpecies = speciesManual.filter(s => !speciesData.includes(s));
const missSpeciesReverse = speciesData.filter(s => !speciesManual.includes(s));
if (missSpecies.length > 0) log(`  FALTAN EN DATA (${missSpecies.length}): ${missSpecies.slice(0,5).join(', ')}...`);
if (missSpeciesReverse.length > 0) log(`  FALTAN EN MANUAL (${missSpeciesReverse.length}): ${missSpeciesReverse.slice(0,5).join(', ')}...`);
if (missSpecies.length === 0 && missSpeciesReverse.length === 0) log(`  OK`);

const bgManual = getBackgroundsFromManual(speciesMd);
const bgData = getBackgroundsFromTS(backgroundsTs);
log(`\nBackgrounds:`);
log(`  MANUAL: ${bgManual.length}`);
log(`  DATA:   ${bgData.length}`);
const missBg = bgManual.filter(b => !bgData.includes(b));
const missBgReverse = bgData.filter(b => !bgManual.includes(b));
if (missBg.length > 0) log(`  FALTAN EN DATA: ${missBg.join(', ')}`);
if (missBgReverse.length > 0) log(`  FALTAN EN MANUAL: ${missBgReverse.join(', ')}`);
if (missBg.length === 0 && missBgReverse.length === 0) log(`  OK`);

log(`\n${'='.repeat(80)}\n`);

// ============================================================
// AUDIT 03: FEATS
// ============================================================
log('='.repeat(80));
log('AUDITORIA 03: FEATS');
log('='.repeat(80));

const featsMd = readFile(path.join(MANUAL_DIR, '03-feats.md'));
const featsTs = readFile(path.join(DATA_DIR, 'feats', 'feats-en.ts'));

function getFeatsFromManual(md) {
  const names = [];
  const re = /#####\s+([^'\n]+)/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const name = m[1].replace(/'/g, '').trim();
    if (name && name.length > 1 && name.length < 50 && !names.includes(name)) {
      names.push(name);
    }
  }
  return names;
}

function getFeatsFromTS(ts) {
  const names = [];
  const re = /name:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(ts)) !== null) {
    if (!names.includes(m[1])) names.push(m[1]);
  }
  return names;
}

const featsManual = getFeatsFromManual(featsMd);
const featsData = getFeatsFromTS(featsTs);
log(`\nFeats: MANUAL=${featsManual.length}, DATA=${featsData.length}`);
const featsOnlyManual = featsManual.filter(f => !featsData.includes(f));
const featsOnlyData = featsData.filter(f => !featsManual.includes(f));
if (featsOnlyManual.length > 0) {
  log(`  FALTAN EN DATA (${featsOnlyManual.length}): ${featsOnlyManual.slice(0,10).join(', ')}...`);
}
if (featsOnlyData.length > 0) {
  log(`  FALTAN EN MANUAL (${featsOnlyData.length}): ${featsOnlyData.slice(0,10).join(', ')}...`);
}
if (featsOnlyManual.length === 0 && featsOnlyData.length === 0) log(`  OK`);

log(`\n${'='.repeat(80)}\n`);

// ============================================================
// AUDIT 04: SPELLS
// ============================================================
log('='.repeat(80));
log('AUDITORIA 04: SPELLS');
log('='.repeat(80));

const spellsMd = readFile(path.join(MANUAL_DIR, '04-spells.md'));

function getSpellsFromManual(md) {
  const spells = [];
  const lines = md.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('|')) {
      // Skip separator rows like |------|------|
      if (t.match(/^\|[\s-]+\|/)) continue;
      // Skip header rows that contain 'Nombre'
      if (t.includes('Nombre')) continue;
      const cells = t.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 2 && cells[0].length > 2 && cells[0].length < 40) {
        const first = cells[0];
        if (!['Schools', 'Cantrips', 'Level', 'Spell', 'Magic'].includes(first)) {
          if (!spells.includes(first)) spells.push(first);
        }
      }
    }
  }
  return spells;
}

function getSpellsFromTS() {
  const spells = [];
  const spellFiles = ['cantrips', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9'];
  spellFiles.forEach(lvl => {
    const ts = readFile(path.join(DATA_DIR, 'spells', lvl + '.ts'));
    const re = /name:\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(ts)) !== null) {
      if (!spells.includes(m[1])) spells.push(m[1]);
    }
  });
  return spells;
}

const spellsManual = getSpellsFromManual(spellsMd);
const spellsData = getSpellsFromTS();
log(`\nSpells: MANUAL=${spellsManual.length}, DATA=${spellsData.length}`);
const spellsOnlyManual = spellsManual.filter(s => !spellsData.includes(s) && s.length > 3);
const spellsOnlyData = spellsData.filter(s => !spellsManual.includes(s));
if (spellsOnlyManual.length > 0) {
  log(`  FALTAN EN DATA (${spellsOnlyManual.length}): ${spellsOnlyManual.slice(0,10).join(', ')}...`);
}
if (spellsOnlyData.length > 0) {
  log(`  FALTAN EN MANUAL (${spellsOnlyData.length}): ${spellsOnlyData.slice(0,10).join(', ')}...`);
}
if (spellsOnlyManual.length === 0 && spellsOnlyData.length === 0) log(`  OK`);

log(`\n${'='.repeat(80)}\n`);

// ============================================================
// AUDIT 05: WEAPONS
// ============================================================
log('='.repeat(80));
log('AUDITORIA 05: WEAPONS');
log('='.repeat(80));

const equipmentMd = readFile(path.join(MANUAL_DIR, '05-equipment.md'));
const itemsTs = readFile(path.join(DATA_DIR, 'items.ts'));

function getWeaponsFromManual(md) {
  const weapons = [];
  const lines = md.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('|')) {
      if (t.match(/^\|[\s-]+\|/)) continue;
      if (t.includes('Nombre')) continue;
      const cells = t.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 2) {
        const name = cells[0];
        const dmg = cells[1];
        if (name && dmg && name.length > 1 && name.length < 30 && dmg.match(/\d+d?\d*/)) {
          if (!weapons.find(w => w.name === name)) {
            weapons.push({ name, damage: dmg });
          }
        }
      }
    }
  }
  return weapons;
}

function getWeaponsFromTS(ts) {
  const weapons = [];
  const re = /name:\s*['"]([^'"]+)['"][\s\S]*?damage:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(ts)) !== null) {
    if (!weapons.find(w => w.name === m[1])) {
      weapons.push({ name: m[1], damage: m[2] });
    }
  }
  return weapons;
}

const weaponsManual = getWeaponsFromManual(equipmentMd);
const weaponsData = getWeaponsFromTS(itemsTs);
log(`\nWeapons: MANUAL=${weaponsManual.length}, DATA=${weaponsData.length}`);

const weaponDiff = [];
weaponsManual.forEach(w => {
  const dw = weaponsData.find(d => d.name === w.name);
  if (!dw) {
    weaponDiff.push(`FALTA EN DATA: "${w.name}" (${w.damage})`);
  } else if (dw.damage !== w.damage) {
    weaponDiff.push(`DIF "${w.name}": MANUAL=${w.damage} vs DATA=${dw.damage}`);
  }
});

const weaponsOnlyData = weaponsData.filter(d => !weaponsManual.find(w => w.name === d.name));

if (weaponDiff.length > 0) {
  log(`  DIFERENCIAS (${weaponDiff.length}): ${weaponDiff.slice(0,5).join(', ')}...`);
} else {
  log(`  OK - Weapons coinciden en nombre y dano`);
}
if (weaponsOnlyData.length > 0) {
  log(`  EN DATA PERO NO EN MANUAL (${weaponsOnlyData.length}): ${weaponsOnlyData.slice(0,5).map(w => w.name).join(', ')}...`);
}

log(`\n${'='.repeat(80)}\n`);

// ============================================================
// AUDIT 06: MAGIC ITEMS
// ============================================================
log('='.repeat(80));
log('AUDITORIA 06: MAGIC ITEMS');
log('='.repeat(80));

const magicItemsMd = readFile(path.join(MANUAL_DIR, '06-magic-items.md'));

function getMagicItemsFromManual(md) {
  const idx = md.indexOf('## Magic Items');
  if (idx === -1) return [];
  const endIdx = md.indexOf('\n## Spells', idx);
  const section = endIdx === -1 ? md.substring(idx) : md.substring(idx, endIdx);
  const items = [];
  const lines = section.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('|')) {
      if (t.match(/^\|[\s-]+\|/)) continue;
      if (t.includes('Objeto') || t.includes('Item')) continue;
      const cells = t.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 2 && cells[0].length > 2 && cells[0].length < 50) {
        const name = cells[0];
        if (!items.includes(name)) items.push(name);
      }
    }
  }
  return items;
}

function getMagicItemsFromTS(ts) {
  const items = [];
  const idx = ts.indexOf('MAGIC_ITEMS');
  if (idx === -1) return items;
  const section = ts.substring(idx, idx + 200000);
  const re = /name:\s*['"]([^'"]+)['"][\s\S]*?type:\s*['"]/g;
  let m;
  while ((m = re.exec(section)) !== null) {
    if (!items.includes(m[1])) items.push(m[1]);
  }
  return items;
}

const magicItemsManual = getMagicItemsFromManual(magicItemsMd);
const magicItemsData = getMagicItemsFromTS(itemsTs);
log(`\nMagic Items: MANUAL=${magicItemsManual.length}, DATA=${magicItemsData.length}`);

const miOnlyManual = magicItemsManual.filter(m => !magicItemsData.includes(m));
const miOnlyData = magicItemsData.filter(m => !magicItemsManual.includes(m));

if (miOnlyManual.length > 0) {
  log(`  FALTAN EN DATA (${miOnlyManual.length}): ${miOnlyManual.slice(0,10).join(', ')}...`);
}
if (miOnlyData.length > 0) {
  log(`  FALTAN EN MANUAL (${miOnlyData.length}): ${miOnlyData.slice(0,10).join(', ')}...`);
}
if (miOnlyManual.length === 0 && miOnlyData.length === 0) log(`  OK`);

log(`\n${'='.repeat(80)}\n`);
log('FIN DE AUDITORIA');
log('='.repeat(80));

fs.writeFileSync(path.join(__dirname, 'audit-report.txt'), report.join(''), 'utf8');
console.log('\nReporte guardado en audit-report.txt');