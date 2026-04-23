# 📦 Archivos Temporales

Esta carpeta contiene archivos temporales, caché y archivos que se pueden regenerar.

## Contenido

- `thoughts/` - Notas de trabajo y brainstorming
- `Libros/` - Recursos y referencias
- `.logs/` - Logs de ejecución
- `.ruff_cache/` - Caché de Ruff (Python linter)
- (más archivos temporales irán aquí)

---

⚠️ **NOTA:** Los archivos aquí NO deben ser commiteados a Git.
Ver `.gitignore` para la lista completa de ignorados.

## Limpiar

Para limpiar archivos temporales:
```bash
rm -rf tmp/*
```

O mantenerlos si son útiles para debugging.
