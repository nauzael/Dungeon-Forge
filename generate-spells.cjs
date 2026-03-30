const fs = require('fs');
const path = require('path');

const INPUT = 'spells-extracted.json';
const OUTPUT_DIR_EN = 'Data/spells/en';
const OUTPUT_DIR_ES = 'Data/spells/es';

const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'));

function escapeForJS(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function esc(s) {
  return s.replace(/'/g, "\\'");
}

function formatDescription(desc) {
  return esc(desc).replace(/\n/g, '\\n');
}

function generateFileEN(levelName, spells, exportName) {
  let out = `import { SpellDetail } from '../../../types';

export const ${exportName}: Record<string, SpellDetail> = {
`;
  spells.forEach(spell => {
    const key = esc(spell.name);
    out += `  "${key}":{level:${spell.level},school:'${esc(spell.school)}',castingTime:'${esc(spell.castingTime)}',range:'${esc(spell.range)}',components:'${esc(spell.components)}',duration:'${esc(spell.duration)}',description:'${formatDescription(spell.description)}',name:'${key}'},
`;
  });
  out += `};
`;
  fs.writeFileSync(path.join(OUTPUT_DIR_EN, `${levelName}.ts`), out, 'utf8');
  console.log(`Written ${OUTPUT_DIR_EN}/${levelName}.ts with ${spells.length} spells`);
}

function generateFileES(levelName, spells, exportName) {
  let out = `import { SpellDetail } from '../../../types';

export const ${exportName}: Record<string, SpellDetail> = {
`;
  spells.forEach(spell => {
    const key = esc(spell.name);
    out += `  "${key}":{level:${spell.level},school:'${esc(spell.school)}',castingTime:'${esc(spell.castingTime)}',range:'${esc(spell.range)}',components:'${esc(spell.components)}',duration:'${esc(spell.duration)}',description:'${formatDescription(spell.description)}',name:'${key}'},
`;
  });
  out += `};
`;
  fs.writeFileSync(path.join(OUTPUT_DIR_ES, `${levelName}.ts`), out, 'utf8');
  console.log(`Written ${OUTPUT_DIR_ES}/${levelName}.ts with ${spells.length} spells`);
}

generateFileEN('cantrips', data.cantrips, 'CANTRIPS');
generateFileEN('level1', data.level1, 'LEVEL1');
generateFileEN('level2', data.level2, 'LEVEL2');
generateFileEN('level3', data.level3, 'LEVEL3');
generateFileEN('level4', data.level4, 'LEVEL4');
generateFileEN('level5', data.level5, 'LEVEL5');
generateFileEN('level6', data.level6, 'LEVEL6');
generateFileEN('level7', data.level7, 'LEVEL7');
generateFileEN('level8', data.level8, 'LEVEL8');
generateFileEN('level9', data.level9, 'LEVEL9');

generateFileES('cantrips', data.cantrips, 'CANTRIPS');
generateFileES('level1', data.level1, 'LEVEL1');
generateFileES('level2', data.level2, 'LEVEL2');
generateFileES('level3', data.level3, 'LEVEL3');
generateFileES('level4', data.level4, 'LEVEL4');
generateFileES('level5', data.level5, 'LEVEL5');
generateFileES('level6', data.level6, 'LEVEL6');
generateFileES('level7', data.level7, 'LEVEL7');
generateFileES('level8', data.level8, 'LEVEL8');
generateFileES('level9', data.level9, 'LEVEL9');

console.log('All spell files generated!');
console.log(`Total spells: ${Object.values(data).flat().length}`);
