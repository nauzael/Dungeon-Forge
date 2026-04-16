/**
 * Script para generar iconos PNG para Android desde el SVG
 * Ejecutar con: node scripts/generate-icons.cjs
 *
 * Requiere: npm install sharp
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const androidRes = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

// Tamaños para Android mipmap
const androidSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

async function generateIcons() {
  console.log('Generando iconos para Android...');

  // Leer SVG
  const svgBuffer = fs.readFileSync(svgPath);

  for (const { dir, size } of androidSizes) {
    const outputDir = path.join(androidRes, dir);

    // Crear directorio si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generar ic_launcher.png
    const launcherPath = path.join(outputDir, 'ic_launcher.png');
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(launcherPath);
    console.log(`  Generado: ${launcherPath}`);

    // Generar ic_launcher_round.png (mismo contenido para este diseño)
    const roundPath = path.join(outputDir, 'ic_launcher_round.png');
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(roundPath);
    console.log(`  Generado: ${roundPath}`);

    // Generar ic_launcher_foreground.png (requerido por adaptive icons Android 8+)
    const foregroundPath = path.join(outputDir, 'ic_launcher_foreground.png');
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(foregroundPath);
    console.log(`  Generado: ${foregroundPath}`);
  }

  console.log('\nIconos de Android generados correctamente!');
  console.log('Recuerda regenerar el APK para aplicar los nuevos iconos.');
}

generateIcons().catch(console.error);
