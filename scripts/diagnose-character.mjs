#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO COMPLETO - "Kaelen rompehielos"
 * 
 * Este script identifica por qué el personaje no aparece
 * y sugiere soluciones específicas.
 * 
 * USO:
 * node scripts/diagnose-character.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

console.log(`
╔════════════════════════════════════════════════════════════╗
║     🔍 DIAGNÓSTICO: Kaelen rompehielos                    ║
║     Sincronización Missing después de actualización       ║
╚════════════════════════════════════════════════════════════╝
`);

// 1️⃣ REVISAR CAMBIOS RECIENTES EN CÓDIGO
console.log('\n1️⃣  Analizando cambios recientes...\n');

const criticalFiles = [
  'utils/supabase.ts',
  'App.tsx',
  'components/CharacterList.tsx',
  'CHANGELOG.md',
];

let issuesFound = [];

// Buscar cambios que podrían afectar
const supabaseContent = fs.readFileSync(path.join(projectRoot, 'utils', 'supabase.ts'), 'utf-8');

// Revisar fetchCharactersFromCloud
if (supabaseContent.includes('fetchCharactersFromCloud')) {
  const fetchMatch = supabaseContent.match(/export const fetchCharactersFromCloud[\s\S]*?\n\};/);
  if (fetchMatch) {
    const query = fetchMatch[0];
    
    // ✅ Verifica que filtre correctly
    if (query.includes('.is(\'deleted_at\', null)')) {
      console.log('✅ fetchCharactersFromCloud filtra correctamente (excluye soft-deleted)');
    }
    
    // ⚠️ Revisa si hay problemas
    if (query.includes('where') || query.includes('.eq(') || query.includes('.in(')) {
      console.log('📋 Query actual:');
      console.log('   ' + query.split('\n').slice(0, 8).join('\n   '));
    }
  }
}

// 2️⃣ VERIFICAR RLS POLICIES (necesita credenciales de Supabase)
console.log('\n2️⃣  Verificación de RLS (Row Level Security):\n');
console.log('   ⚠️  Requiere acceso a Supabase SQL Editor');
console.log('   📌 Ejecuta este query en Supabase > SQL Editor:');
console.log(`
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'characters'
ORDER BY tablename, policyname;
`);

// 3️⃣ DIAGNÓSTICO LOCAL
console.log('\n3️⃣  Verificación localStorage:\n');

try {
  // Buscar localStorage.ts para ver la estructura
  const localStorageContent = fs.readFileSync(path.join(projectRoot, 'utils', 'localStorage.ts'), 'utf-8');
  
  // Ver qué se guarda
  if (localStorageContent.includes('dnd-characters')) {
    console.log('✅ localStorage usa clave: "dnd-characters"');
  }
  
  // Buscar referencias a deletedCharacterIds
  if (localStorageContent.includes('deletedCharacterIds')) {
    console.log('⚠️  Hay tracking de "deletedCharacterIds" - verifica si Kaelen está marcado como eliminado localmente');
  }
} catch (e) {
  console.log('⚠️  No se puede leer localStorage.ts');
}

// 4️⃣ ANÁLISIS DE LA ÚLTIMA ACTUALIZACIÓN
console.log('\n4️⃣  Análisis de cambios recientes:\n');

const changelog = fs.readFileSync(path.join(projectRoot, 'CHANGELOG.md'), 'utf-8');
const recentChanges = changelog.split('\n').slice(0, 50).join('\n');

if (recentChanges.includes('RLS') || recentChanges.includes('filtering') || recentChanges.includes('deleted')) {
  console.log('⚠️  Cambios recientes mencionan RLS o filtering:');
  const lines = recentChanges.split('\n').filter(l => 
    l.toLowerCase().includes('rls') || 
    l.toLowerCase().includes('filter') ||
    l.toLowerCase().includes('delete') ||
    l.toLowerCase().includes('sync')
  ).slice(0, 5);
  lines.forEach(line => console.log('   📌 ' + line.trim()));
}

// 5️⃣ RECOMENDACIONES
console.log('\n' + '='.repeat(60));
console.log('💡 PLAN DE RECUPERACIÓN - PASOS A SEGUIR');
console.log('='.repeat(60));

console.log(`
OPCIÓN A: Usar Script Automatizado (MÁS RÁPIDO)
─────────────────────────────────────────────────
1. Obtén tus credenciales de Supabase:
   - URL: https://app.supabase.com → Proyecto → Settings → API
   - Service Role Key: Settings → API → service_role (⚠️ SECRETO)

2. Ejecuta:
   node scripts/recover-character.mjs "https://YOUR.supabase.co" "sbp_xxxxx"

3. ✅ El script:
   - Busca brothersen@gmail.com
   - Encuentra "Kaelen rompehielos"
   - Si está soft-deleted, lo restaura
   - Recarga automáticamente


OPCIÓN B: Diagnóstico Manual en Supabase
────────────────────────────────────────
1. Ve a: https://app.supabase.com → Tu proyecto → SQL Editor

2. Ejecuta: (Guardar como "Diagnóstico Kaelen")
────────────────────────────────────────────────
-- Buscar personaje
SELECT 
  c.id,
  (c.data->>'name') AS name,
  c.deleted_at,
  c.updated_at,
  CASE WHEN c.deleted_at IS NULL THEN '✅ ACTIVO' ELSE '❌ SOFT-DELETED' END AS status
FROM characters c
JOIN auth.users u ON c.user_id = u.id
WHERE u.email = 'brothersen@gmail.com'
  AND (c.data->>'name' ILIKE '%kaelen%' OR c.data->>'name' ILIKE '%rompehielos%');

3. Si aparece "❌ SOFT-DELETED", ejecuta esto:
───────────────────────────────────────────────
UPDATE characters
SET deleted_at = NULL, updated_at = NOW()
WHERE id = '[COPIAR ID DEL QUERY ANTERIOR]'
  AND user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'brothersen@gmail.com'
  );

4. ✅ Luego:
   - Recarga la app: Ctrl+R
   - Login: brothersen@gmail.com
   - El personaje reaparecerá


OPCIÓN C: Verificar Problema de RLS
────────────────────────────────────
Si el personaje existe pero no carga, podría haber un bloqueo RLS.

1. Ejecuta en SQL Editor:
────────────────────────
SELECT * FROM pg_policies WHERE tablename = 'characters';

2. Busca políticas que excluyan al usuario o personaje
3. Si encuentras una que bloquea, reporta el error


PARA EL STORAGE LLENO (Segundo Problema)
─────────────────────────────────────────
Ejecuta en SQL Editor:

-- Cuánto ocupa cada usuario
SELECT 
  u.email,
  COUNT(c.id) as total_characters,
  COUNT(CASE WHEN c.deleted_at IS NULL THEN 1 END) as active,
  COUNT(CASE WHEN c.deleted_at IS NOT NULL THEN 1 END) as soft_deleted,
  ROUND(SUM(pg_column_size(c.data)) / 1024.0, 2) as data_size_kb
FROM characters c
JOIN auth.users u ON c.user_id = u.id
GROUP BY u.email
ORDER BY data_size_kb DESC;

-- Solución: Limpiar soft-deleted más antiguos que 30 días
DELETE FROM characters
WHERE deleted_at IS NOT NULL
  AND deleted_at < NOW() - INTERVAL '30 days';
`);

console.log('\n' + '='.repeat(60));
console.log('\n✉️  ¿Necesitas ayuda? Comparte:');
console.log('   - Email de la cuenta: brothersen@gmail.com');
console.log('   - Output del script: recover-character.mjs');
console.log('   - O: Screenshots del SQL Editor');
console.log();
