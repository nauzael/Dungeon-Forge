# 🛠️ Scripts - Dungeon Forge

Scripts de desarrollo, compilación y testing.

## 📂 Estructura

### `generate/`
Scripts que generan data para el juego:
- `generate-backgrounds.cjs`
- `generate-classes.cjs`
- `generate-feats.cjs`
- `generate-items.cjs`
- `generate-species.cjs`
- `generate-spells.cjs`

### `test/`
Scripts para testing:
- `test-atlas.js` - Test de atlas de hechizos
- `test-hp-*.js` - Tests de cálculo de HP
- `test-upload.js` - Test de upload

### `build/`
Scripts de compilación y deployment:
- `build-and-deploy.bat` (Windows)
- `build-and-deploy.sh` (Mac/Linux)
- `start-telegram-agent.bat`

### `dev/`
Herramientas de desarrollo:
- `capture-logs.js` - Capturar logs

---

## 📖 Uso

```bash
# Ejecutar un script de generación
node scripts/generate/generate-classes.cjs

# Ejecutar test
node scripts/test/test-hp-calculation.js

# Build para Android
bash scripts/build/build-and-deploy.sh
```

Todos los scripts se invocan desde `package.json` en la mayoría de casos.
