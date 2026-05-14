#!/usr/bin/env node

/**
 * 🔍 Validar configuración de Supabase para Dungeon Forge
 * 
 * Este script verifica que:
 * - .env file existe
 * - VITE_SUPABASE_URL está configurada correctamente
 * - VITE_SUPABASE_ANON_KEY está configurada correctamente
 * 
 * Uso: node validate-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Validando configuración de Supabase...\n');

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

let hasErrors = false;

// 1. Verificar que .env existe
if (!fs.existsSync(envPath)) {
  console.log('❌ CRÍTICO: Archivo .env no encontrado');
  console.log(`   Ubicación esperada: ${envPath}`);
  console.log(`   Solución: Copia .env.example y llena con valores reales`);
  console.log(`   > cp .env.example .env`);
  hasErrors = true;
} else {
  console.log('✅ Archivo .env encontrado');
}

// 2. Cargar .env y validar valores
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  const envVars = {};
  
  envLines.forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  // 3. Validar VITE_SUPABASE_URL
  console.log('\n📋 Validando VITE_SUPABASE_URL:');
  const supabaseUrl = envVars['VITE_SUPABASE_URL'];
  
  if (!supabaseUrl) {
    console.log('   ❌ VITE_SUPABASE_URL no está configurada');
    console.log('      Debe ser: https://usnlhzkpukkuwbtortil.supabase.co');
    hasErrors = true;
  } else if (!supabaseUrl.includes('supabase.co')) {
    console.log(`   ⚠️  VITE_SUPABASE_URL parece inválida: ${supabaseUrl}`);
    hasErrors = true;
  } else if (supabaseUrl === 'https://your-project.supabase.co') {
    console.log('   ❌ VITE_SUPABASE_URL es un placeholder, reemplaza con valor real');
    hasErrors = true;
  } else {
    console.log(`   ✅ VITE_SUPABASE_URL = ${supabaseUrl}`);
  }
  
  // 4. Validar VITE_SUPABASE_ANON_KEY
  console.log('\n🔐 Validando VITE_SUPABASE_ANON_KEY:');
  const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];
  
  if (!supabaseKey) {
    console.log('   ❌ VITE_SUPABASE_ANON_KEY no está configurada');
    console.log('      Obtén el valor de: https://app.supabase.com/ → Settings → API');
    hasErrors = true;
  } else if (supabaseKey.includes('your-anon-key') || supabaseKey === 'your-anon-key-here') {
    console.log('   ❌ VITE_SUPABASE_ANON_KEY es un placeholder, reemplaza con valor real');
    hasErrors = true;
  } else if (!supabaseKey.startsWith('eyJ')) {
    console.log('   ⚠️  VITE_SUPABASE_ANON_KEY no parece un JWT válido');
    console.log(`      Primeros caracteres: ${supabaseKey.substring(0, 20)}...`);
    hasErrors = true;
  } else {
    console.log(`   ✅ VITE_SUPABASE_ANON_KEY configurada (${supabaseKey.substring(0, 20)}...)`);
  }
  
  // 5. Verificar contra .env.example
  console.log('\n📋 Comparación con .env.example:');
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    const exampleVars = exampleContent.split('\n').filter(line => line && !line.startsWith('#') && line.includes('='));
    
    exampleVars.forEach(line => {
      const key = line.split('=')[0].trim();
      if (envVars[key] === undefined) {
        console.log(`   ⚠️  ${key} no está en .env (tal vez sea opcional)`);
      }
    });
  }
}

// 6. Resumen
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ ERRORES ENCONTRADOS - Corrige antes de hacer build');
  console.log('\n📝 Pasos para corregir:');
  console.log('   1. Ve a https://app.supabase.com/');
  console.log('   2. Selecciona proyecto: usnlhzkpukkuwbtortil');
  console.log('   3. Settings → API');
  console.log('   4. Copia Project URL y Anon public key');
  console.log('   5. Edita .env y reemplaza los valores');
  console.log('   6. Guarda y ejecuta: node validate-env.js');
  process.exit(1);
} else {
  console.log('✅ TODAS LAS CREDENCIALES CORRECTAMENTE CONFIGURADAS');
  console.log('\n🚀 Listo para hacer build:');
  console.log('   > npm run build');
  console.log('   > npm run ota');
  process.exit(0);
}
