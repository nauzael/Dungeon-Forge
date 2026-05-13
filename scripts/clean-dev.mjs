#!/usr/bin/env node
/**
 * clean-dev.mjs
 * Limpia procesos Node.js viejos en los puertos 5173-5175 y luego inicia dev server
 * Uso: node scripts/clean-dev.mjs
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === 'win32';

async function killProcessOnPort(port) {
  try {
    if (isWindows) {
      // Windows: Usa netstat + taskkill
      const { stdout } = await execAsync(
        `netstat -ano | findstr ":${port}" | findstr "LISTENING"`
      );
      
      if (stdout.trim()) {
        const match = stdout.match(/\s+(\d+)\s*$/m);
        if (match) {
          const pid = match[1];
          console.log(`🔪 Matando proceso ${pid} en puerto ${port}...`);
          await execAsync(`taskkill /PID ${pid} /F`);
          console.log(`✅ Proceso ${pid} eliminado`);
          return true;
        }
      }
    } else {
      // macOS/Linux: Usa lsof + kill
      const { stdout } = await execAsync(
        `lsof -i :${port} 2>/dev/null || true`
      );
      
      if (stdout.includes('node')) {
        const lines = stdout.split('\n');
        const pidLine = lines.find(l => l.includes('node'));
        if (pidLine) {
          const pid = pidLine.split(/\s+/)[1];
          console.log(`🔪 Matando proceso ${pid} en puerto ${port}...`);
          await execAsync(`kill -9 ${pid}`);
          console.log(`✅ Proceso ${pid} eliminado`);
          return true;
        }
      }
    }
  } catch (error) {
    // Silencioso si no hay proceso
  }
  return false;
}

async function main() {
  console.log('\n🧹 Limpiando procesos Node.js viejos...\n');
  
  // Limpiar puertos 5173-5175 (rango típico de Vite)
  const ports = [5173, 5174, 5175];
  let cleaned = false;
  
  for (const port of ports) {
    if (await killProcessOnPort(port)) {
      cleaned = true;
      // Esperar un poco entre kills
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  if (!cleaned) {
    console.log('✅ Puertos limpios, ningún proceso Node.js viejo encontrado\n');
  } else {
    console.log('✅ Procesos viejos eliminados. Esperando...\n');
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log('🚀 Iniciando dev server...\n');
  
  // Iniciar Vite dev server
  const { spawn } = await import('child_process');
  const vite = spawn('npm', ['run', 'dev:only'], {
    stdio: 'inherit',
    shell: isWindows ? 'powershell.exe' : '/bin/sh'
  });
  
  vite.on('error', (err) => {
    console.error('❌ Error iniciando dev server:', err);
    process.exit(1);
  });
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
