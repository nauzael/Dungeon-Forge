#!/usr/bin/env node

/**
 * Diagnóstico simple: Busca a Kaelen en la BD y muestra estado
 * No usa types, solo Node.js vanilla
 */

import https from 'https';

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!ANON_KEY) {
  console.error('❌ VITE_SUPABASE_ANON_KEY no encontrada');
  console.error('Ejecuta: VITE_SUPABASE_ANON_KEY="tu_key" node test-kaelen.mjs');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + path);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
      },
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

console.log('🔍 Buscando a Kaelen en Supabase...\n');

try {
  // Buscar por nombre tipo Kaelen
  const searchPath = `/rest/v1/characters?select=id,user_id,party_id,deleted_at,updated_at,data&data->>name=ilike.*kaelen*`;
  
  console.log('📍 Query:', searchPath);
  const result = await makeRequest('GET', searchPath);

  if (result.status !== 200) {
    console.error(`❌ Error HTTP ${result.status}:`, result.body);
    process.exit(1);
  }

  const characters = result.body;
  
  if (!Array.isArray(characters) || characters.length === 0) {
    console.log('❌ Kaelen no encontrado');
    process.exit(1);
  }

  console.log(`✅ Encontrado(s): ${characters.length} character(s)\n`);

  for (const char of characters) {
    const charData = typeof char.data === 'string' ? JSON.parse(char.data) : char.data;
    
    console.log(`📌 Nombre: ${charData.name}`);
    console.log(`   ID: ${char.id}`);
    console.log(`   Usuario: ${char.user_id}`);
    console.log(`   Party ID (field): ${char.party_id || 'null'}`);
    console.log(`   Party ID (JSON): ${charData.party_id || 'null'}`);
    console.log(`   Deleted: ${char.deleted_at ? '✅ SOFT-DELETED' : '❌ ACTIVE'}`);
    console.log(`   Actualizado: ${char.updated_at}\n`);

    // Si tiene party_id, verificar que party existe
    if (char.party_id) {
      console.log(`   🏛️  Verificando party ${char.party_id}...`);
      const partyResult = await makeRequest('GET', `/rest/v1/parties?id=eq.${char.party_id}`);
      
      if (partyResult.status === 200 && partyResult.body.length > 0) {
        const party = partyResult.body[0];
        console.log(`      ✅ Party existe: ${party.name} (${party.code})`);
        console.log(`         Creador: ${party.creator_id}`);
      } else {
        console.log(`      ❌ Party NO EXISTE (referencia fantasma)`);
      }
    }
  }

} catch (err) {
  console.error('❌ Error:', err);
  process.exit(1);
}
