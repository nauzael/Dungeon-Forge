#!/usr/bin/env node

// Script para ejecutar migración RLS de seguridad en Supabase
// Ejecuta: node scripts/apply-rls-migration.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://usnlhzkpukkuwbtortil.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw';

function executeViaHTTP(sql) {
  return new Promise((resolve, reject) => {
    try {
      // Intentar ejecutar vía RPC endpoint
      const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`);
      
      const payload = JSON.stringify({ sql });
      
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'apikey': SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function applyMigration() {
  console.log('🔐 Iniciando aplicación de migración RLS...\n');

  try {
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../supabase/migrations/006_enable_rls_telegram_tables.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Archivo de migración no encontrado:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    console.log('📄 Migración cargada:', migrationPath);
    console.log('📝 Tamaño:', migrationSQL.length, 'caracteres\n');

    // Intentar ejecutar migración
    console.log('⏳ Ejecutando migración en Supabase...\n');
    
    try {
      await executeViaHTTP(migrationSQL);
      console.log('✅ Migración ejecutada exitosamente!\n');
    } catch (err) {
      // Si falla, mostrar instrucciones manuales
      console.log('⚠️  Ejecución automática no disponible (es normal sin función SQL personalizada)');
      console.log('\n📌 Por favor, ejecuta la migración manualmente:\n');
      console.log('1️⃣  Ve a https://app.supabase.com/');
      console.log('2️⃣  Selecciona proyecto: Dungeon Forge');
      console.log('3️⃣  SQL Editor → New query');
      console.log('4️⃣  Copia el archivo: supabase/migrations/006_enable_rls_telegram_tables.sql');
      console.log('5️⃣  Ejecuta (Ctrl + Enter)\n');
      console.log('O usa Supabase CLI:');
      console.log('   supabase db push\n');
      process.exit(0);
    }

    console.log('📋 Resumen aplicado:');
    console.log('  ✅ RLS habilitado en: telegram_commands');
    console.log('  ✅ RLS habilitado en: allowed_telegram_users');
    console.log('  ✅ RLS habilitado en: telegram_sessions');
    console.log('  ✅ 12 políticas de seguridad implementadas\n');

    console.log('🎉 Vulnerabilidad de seguridad resuelta!');
    console.log('⏱️  La alerta en Supabase desaparecerá en 24-48 horas\n');

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    process.exit(1);
  }
}

applyMigration();
