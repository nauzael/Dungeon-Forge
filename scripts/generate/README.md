# 📋 Scripts de Generación

Scripts que generan datos para el juego basados en reglas D&D 5e 2024.

## Scripts

- **generate-backgrounds.cjs** - Genera backgrounds
- **generate-classes.cjs** - Genera clases D&D
- **generate-feats.cjs** - Genera feats
- **generate-items.cjs** - Genera items y equipment
- **generate-species.cjs** - Genera especies playables
- **generate-spells.cjs** - Genera hechizos

## Uso

```bash
# Generar una categoría específica
node generate-backgrounds.cjs

# O desde package.json (si está definido)
npm run generate:backgrounds
```

---

⚠️ **Nota:** Estos scripts sobrescriben archivos de datos en `src/Data/`.
Úsalos solo cuando necesites regenerar datos.
