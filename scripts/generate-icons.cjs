/**
 * Script para generar iconos PNG para Android desde el SVG
 * Ejecutar con: node scripts/generate-icons.cjs
 *
 * Requiere: npm install sharp
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '..', 'public', 'icon.png');
const androidRes = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
const publicPath = path.join(__dirname, '..', 'public');

// Tamaños para Android mipmap
const androidSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

// Tamaños para PWA / Web
const webSizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generateIcons() {
  console.log('Generando iconos desde PNG:', sourcePath);

  if (!fs.existsSync(sourcePath)) {
    console.error('Error: No se encontró el archivo de origen icon.png');
    return;
  }

  // Generar iconos para Android
  console.log('\nGenerando iconos para Android...');
  for (const { dir, size } of androidSizes) {
    const outputDir = path.join(androidRes, dir);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ic_launcher.png
    await sharp(sourcePath).resize(size, size).toFile(path.join(outputDir, 'ic_launcher.png'));
    // ic_launcher_round.png
    await sharp(sourcePath).resize(size, size).toFile(path.join(outputDir, 'ic_launcher_round.png'));
    // ic_launcher_foreground.png
    await sharp(sourcePath).resize(size, size).toFile(path.join(outputDir, 'ic_launcher_foreground.png'));
    
    console.log(`  Procesado: ${dir} (${size}x${size})`);
  }

  // Generar iconos para Web/PWA
  console.log('\nGenerando iconos para Web/PWA...');
  for (const { name, size } of webSizes) {
    const outputPath = path.join(publicPath, name);
    await sharp(sourcePath).resize(size, size).toFile(outputPath);
    console.log(`  Generado: public/${name}`);
  }

  console.log('\nIconos de Android generados correctamente!');
  console.log('Recuerda regenerar el APK para aplicar los nuevos iconos.');
}

generateIcons().catch(console.error);
