/**
 * Safe DS Token Migration — Opción A (riesgo CERO)
 * 
 * Reemplaza clases Tailwind hardcodeadas por tokens DS equivalentes
 * SOLO donde los valores coinciden exactamente.
 * Procesa ÚNICAMENTE archivos .tsx (contextos className en JSX).
 * 
 * Usage: node scripts/migrate-ds-tokens.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// ─── SOLO .tsx — excluye .ts (Data/ con texto) y .css (CSS vars) ───
const processExtensions = ['.tsx'];

const skipRegex = /node_modules|dist|\.git|design|docs|ota-release|\.vercel/;

// ─── SAFE REPLACEMENTS ───
const replacements = [
  {
    pattern: /(?<!-)rounded(?!-)/g,
    replace: 'rounded-radius-sm',
  },
  {
    pattern: /rounded-lg(?![-a-z])/g,
    replace: 'rounded-radius-md',
  },
  {
    pattern: /rounded-xl(?![-a-z])/g,
    replace: 'rounded-radius-lg',
  },
  {
    pattern: /rounded-full(?![-a-z])/g,
    replace: 'rounded-radius-pill',
  },
  {
    // `shadow` NOT preceded by `-` (excluye box-shadow) AND NOT followed by `-` (excluye shadow-lg, etc.)
    pattern: /(?<!-)shadow(?![\w-])/g,
    replace: 'shadow-elev-raised',
  },
  {
    // shadow-lg only as complete className token
    // NOT preceded by `-` (excluye box-shadow-lg)
    pattern: /(?<!-)shadow-lg(?![-a-z])/g,
    replace: 'shadow-elev-modal',
  },
  {
    // rounded-2xl → rounded-radius-xl (12px → 16px, cambio sutil)
    pattern: /rounded-2xl(?![-a-z])/g,
    replace: 'rounded-radius-xl',
  },
  {
    // rounded-3xl → rounded-radius-2xl (12px → 24px, cambio visible)
    pattern: /rounded-3xl(?![-a-z])/g,
    replace: 'rounded-radius-2xl',
  },
  {
    // rounded-[2rem] → rounded-radius-2xl (32px → 24px, más consistente)
    pattern: /rounded-\[2rem\](?![-a-z])/g,
    replace: 'rounded-radius-2xl',
  },
  {
    pattern: /duration-150(?![-a-z])/g,
    replace: 'duration-motion-fast',
  },
  {
    pattern: /duration-300(?![-a-z])/g,
    replace: 'duration-motion-base',
  },
  {
    pattern: /duration-500(?![-a-z])/g,
    replace: 'duration-motion-slow',
  },
  {
    pattern: /duration-700(?![-a-z])/g,
    replace: 'duration-motion-hp',
  },
];

function collectFiles(dir) {
  const files = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (skipRegex.test(fullPath)) continue;
      if (entry.isDirectory()) {
        files.push(...collectFiles(fullPath));
      } else if (entry.isFile() && processExtensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (_) {}
  return files;
}

function main() {
  console.log('🔍 DS Token Migration — Opción A (solo .tsx, className context)\n');
  
  const files = collectFiles(rootDir);
  console.log(`📁 Escaneando ${files.length} archivos .tsx...\n`);
  
  let totalChanges = 0;
  let modifiedFiles = 0;
  const dryRun = process.argv.includes('--dry-run');
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const before = content;
    let fileChanged = false;
    const fileLog = [];
    
    for (const r of replacements) {
      const beforeCount = (content.match(r.pattern) || []).length;
      if (beforeCount === 0) continue;
      
      content = content.replace(r.pattern, r.replace);
      fileLog.push(`    ${r.replace}: ${beforeCount}x`);
      fileChanged = true;
    }
    
    if (fileChanged) {
      const relPath = path.relative(rootDir, file);
      const changeCount = fileLog.length;
      totalChanges += changeCount;
      modifiedFiles++;
      console.log(`  📝 ${relPath}`);
      fileLog.forEach(l => console.log(l));
      
      if (!dryRun) {
        fs.writeFileSync(file, content, 'utf8');
      }
    }
  }
  
  console.log(`\n✅ Migración completada.`);
  console.log(`   Archivos modificados: ${modifiedFiles}`);
  console.log(`   Reemplazos totales:   ${totalChanges}`);
  
  if (totalChanges === 0) {
    console.log(`\n⚠️  Sin cambios necesarios.`);
  }
  
  if (dryRun) {
    console.log(`\n🔷 DRY RUN — no se escribieron cambios.`);
  }
}

main();
