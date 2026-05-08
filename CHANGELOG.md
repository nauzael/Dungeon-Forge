# Changelog — Dungeon Forge

All notable changes to this project will be documented in this file.

Format: [version] — YYYY-MM-DD

---

## [1.0.0] — 2026-04-16 🏆 STABLE CHECKPOINT

**Versión sellada como punto de control oficial. OTA: `2026.4.16-123234`**

### ✅ Features Incluidas en v1.0

#### Sistema de Personajes
- Creador de personajes paso a paso (CreatorSteps) con 5 pasos completos
- Soporte para 13 clases D&D 5e 2024
- 11 especies con rasgos completos
- Maestrías de arma (Weapon Mastery) por clase
- Sistema de feats con catálogo completo del PHB 2024
- Fondos (Backgrounds) con rasgos y equipo inicial

#### Hoja de Personaje
- 5 tabs: Combat, Inventory, Spells, Features, Notes
- HP tracking con indicadores de estado
- Sistema de hechizos con filtros por nivel y escuela
- Inventario con gestión de peso y equipamiento
- Rasgos de clase por nivel

#### Modo DM Dashboard
- Observación de personajes del partido en tiempo real
- Panel de Compendium con criaturas, condiciones, feats y subclases
- Gestión de recursos de campaña (imágenes compartibles)
- Monster Builder básico

#### Infraestructura
- Autenticación via Supabase (email + OAuth)
- Sincronización en nube con Realtime channels
- Sistema OTA auto-update via Capgo (self-hosted en Supabase)
- PWA con Service Worker y manifest
- CI/CD mediante script `npm run ota`
- Script de rollback `scripts/restore_ota.mjs`
- Configuración Claude Code en `.claude/` con 9 skills
- Contexto de IA en `AI_CONTEXT.md` y `MEMORY.md`

---

## Procedimiento de Rollback a v1.0

En caso de error crítico, restaurar a v1.0 ejecutando:

```bash
# 1. Revertir código fuente al tag de v1.0
git checkout v1.0.0

# 2. Restaurar la OTA "viva" en Supabase a la versión 1.0
node scripts/restore_ota.mjs 2026.4.16-123234 "Rollback a v1.0 Stable"

# 3. Instalar dependencias correspondientes
npm install
```

O para una restauración permanente desde la rama archivada:
```bash
git checkout stable-v1.0
```
