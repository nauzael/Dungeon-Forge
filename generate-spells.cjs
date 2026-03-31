const fs = require('fs');

const INPUT = 'spells-extracted.json';
const OUTPUT_DIR = 'Data/spells';

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

function generateFile(levelName, spells, exportName) {
  let out = `import { SpellDetail } from '../../types';

export const ${exportName}: Record<string, SpellDetail> = {
`;
  spells.forEach(spell => {
    const key = esc(spell.name);
    out += `  "${key}":{level:${spell.level},school:'${esc(spell.school)}',castingTime:'${esc(spell.castingTime)}',range:'${esc(spell.range)}',components:'${esc(spell.components)}',duration:'${esc(spell.duration)}',description:'${formatDescription(spell.description)}',name:'${key}'},\n`;
  });
  out += `};
`;
  fs.writeFileSync(`${OUTPUT_DIR}/${levelName}.ts`, out, 'utf8');
  console.log(`Written ${OUTPUT_DIR}/${levelName}.ts with ${spells.length} spells`);
}

generateFile('cantrips', data.cantrips, 'CANTRIPS');
generateFile('level1', data.level1, 'LEVEL1');
generateFile('level2', data.level2, 'LEVEL2');
generateFile('level3', data.level3, 'LEVEL3');
generateFile('level4', data.level4, 'LEVEL4');
generateFile('level5', data.level5, 'LEVEL5');
generateFile('level6', data.level6, 'LEVEL6');
generateFile('level7', data.level7, 'LEVEL7');
generateFile('level8', data.level8, 'LEVEL8');
generateFile('level9', data.level9, 'LEVEL9');

console.log('All spell files generated!');
console.log(`Total spells: ${Object.values(data).flat().length}`);