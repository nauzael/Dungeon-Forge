#!/usr/bin/env node
/**
 * 🔍 DIAGNÓSTICO DETALLADO - DM Dashboard Storage
 * 
 * Analiza qué datos del DM Dashboard están consumiendo espacio
 * y dónde están guardados (localStorage vs Supabase)
 * 
 * USO:
 * node scripts/diagnose-dm-storage.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>
 */

import { createClient } from '@supabase/supabase-js';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Falta la URL y/o service role key');
  console.error('\nUSO:');
  console.error('  node scripts/diagnose-dm-storage.mjs <SUPABASE_URL> <SERVICE_ROLE_KEY>');
  process.exit(1);
}

const [supabaseUrl, serviceRoleKey] = args;
const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log(`
╔════════════════════════════════════════════════════════════╗
║     🔍 DIAGNÓSTICO: DM Dashboard Storage                  ║
║     Analizando datos de parties e iniciativas              ║
╚════════════════════════════════════════════════════════════╝
`);

async function main() {
  try {
    // 1️⃣ ANALIZAR PARTIES
    console.log('\n1️⃣  Analizando tabla PARTIES...\n');

    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('id, name, creator_id, created_at, code');

    if (partiesError) {
      console.error('❌ Error:', partiesError);
      return;
    }

    if (!parties || parties.length === 0) {
      console.log('✅ No hay parties creadas');
    } else {
      console.log(`📊 Total de mesas creadas: ${parties.length}\n`);

      // Agrupar por creador
      const byCreator = new Map();
      for (const party of parties) {
        if (!byCreator.has(party.creator_id)) {
          byCreator.set(party.creator_id, []);
        }
        byCreator.get(party.creator_id).push(party);
      }

      let totalCreators = 0;
      for (const [creatorId, creatorParties] of byCreator.entries()) {
        totalCreators++;
        console.log(`   👤 Creator: ${creatorId}`);
        console.log(`      Mesas: ${creatorParties.length}`);
        creatorParties.forEach((p, idx) => {
          const daysOld = Math.floor(
            (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          console.log(`      ${idx + 1}. "${p.name}" (${daysOld} días) - Código: ${p.code}`);
        });
        console.log();
      }

      console.log(`   Total creadores: ${totalCreators}`);
    }

    // 2️⃣ ANALIZAR CHARACTERS RELACIONADOS A PARTIES
    console.log('\n2️⃣  Analizando CHARACTERS en parties...\n');

    const { data: partyChars, error: charError } = await supabase
      .from('characters')
      .select('id, user_id, party_id, data, deleted_at')
      .not('party_id', 'is', null);

    if (charError) {
      console.error('❌ Error:', charError);
      return;
    }

    if (!partyChars || partyChars.length === 0) {
      console.log('✅ No hay personajes en parties');
    } else {
      console.log(`📊 Total de personajes en parties: ${partyChars.length}\n`);

      // Análisis por party
      const charsByParty = new Map();
      let totalSizeKb = 0;

      for (const char of partyChars) {
        if (!charsByParty.has(char.party_id)) {
          charsByParty.set(char.party_id, []);
        }
        charsByParty.get(char.party_id).push(char);

        const sizeKb = (JSON.stringify(char.data).length / 1024);
        totalSizeKb += sizeKb;
      }

      // Mostrar por party
      const relatedPartyIds = new Set(Array.from(charsByParty.keys()));
      const relatedParties = parties.filter(p => relatedPartyIds.has(p.id));

      relatedParties.forEach(party => {
        const chars = charsByParty.get(party.id) || [];
        const activos = chars.filter(c => !c.deleted_at).length;
        const eliminados = chars.filter(c => c.deleted_at).length;

        console.log(`   🎲 Mesa: "${party.name}"`);
        console.log(`      Personajes: ${chars.length} (${activos} activos, ${eliminados} soft-deleted)`);

        let partySize = 0;
        chars.forEach((c, idx) => {
          const sizeKb = (JSON.stringify(c.data).length / 1024);
          partySize += sizeKb;
        });

        console.log(`      Tamaño: ${partySize.toFixed(2)} KB\n`);
      });

      console.log(`   📈 Total en parties: ${totalSizeKb.toFixed(2)} KB (${(totalSizeKb / 1024).toFixed(2)} MB)\n`);
    }

    // 3️⃣ RECOMENDACIONES
    console.log('\n' + '='.repeat(60));
    console.log('💡 RECOMENDACIONES PARA LIMPIAR DM DASHBOARD');
    console.log('='.repeat(60));

    const softDeletedCount = partyChars ? partyChars.filter(c => c.deleted_at).length : 0;

    console.log(`
⚠️  PROBLEMAS IDENTIFICADOS:
───────────────────────────

1. localStorage "df-dm-initiative-<partyId>"
   ├─ Se guarda SIN LÍMITE de tiempo
   ├─ Acumula datos de combate históricos
   └─ Causa: useInitiativeTracker.ts no tiene limpieza

2. Personajes soft-deleted en parties
   ├─ ${softDeletedCount} personajes marcados como eliminados
   ├─ Siguen ocupando espacio en Supabase
   └─ Ya fueron purgados en la limpieza anterior

3. Historial de parties
   ├─ ${parties ? parties.length : 0} mesas creadas
   ├─ Algunas podrían estar abandonadas
   └─ No hay forma de limpiar automáticamente


🔧 SOLUCIONES:
──────────────

A) LIMPIAR localStorage (AUTOMÁTICO)
   └─ Borrar keys "df-dm-initiative-*" de parties antiguas
   └─ Mantener solo últimos 30 días

B) LIMPIAR Parties abandonadas (MANUAL)
   └─ Eliminar parties sin actividad en 90+ días
   └─ Los usuarios pueden recrearlas si las necesitan

C) OPTIMIZAR FUTURO
   └─ Guardar iniciativa en Supabase en vez de localStorage
   └─ Implementar auto-cleanup de datos viejos


📊 ESTADÍSTICAS:
────────────────
`);

    if (parties) {
      const oldParties = parties.filter(p => {
        const daysOld = Math.floor(
          (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysOld > 90;
      });

      console.log(`   Parties creadas hace >90 días: ${oldParties.length}`);
      if (oldParties.length > 0) {
        console.log(`   Potencial a limpiar: ${oldParties.length} mesas\n`);
      }
    }

    console.log('\n💾 PRÓXIMO PASO: Ejecutar script de limpieza de DM');
    console.log('   node scripts/cleanup-dm-storage.mjs <URL> <KEY>');

  } catch (e) {
    console.error('❌ Error inesperado:', e);
  }
}

main();
