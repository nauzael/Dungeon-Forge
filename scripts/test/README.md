# 🧪 Scripts de Testing

Scripts para validar que el código funciona correctamente.

## Scripts

- **test-atlas.js** - Test de atlas de hechizos
- **test-hp-automatic.js** - Test automático de HP
- **test-hp-calculation.js** - Test detallado de cálculo HP
- **test-hp-detailed.js** - Test muy detallado de HP
- **test-upload.js** - Test de upload a Supabase

## Uso

```bash
# Ejecutar un test
node test-hp-calculation.js

# O desde package.json
npm run test:hp
```

---

Estos tests validan:
- ✅ Cálculo correcto de HP
- ✅ Spell casting mechanics
- ✅ Supabase sync
- ✅ Data integrity
