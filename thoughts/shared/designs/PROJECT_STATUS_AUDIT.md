# Dungeon Forge - Estado del Proyecto

**Fecha:** 2026-03-31  
**Versión:** 1.0.0  
**Stack:** React 19 + TypeScript + Vite + Capacitor + Supabase

---

## Resumen Ejecutivo

Dungeon Forge es una aplicación de gestión de personajes D&D 5e (Edición 2024) funcional con características avanzadas como sincronización en tiempo real, OTA updates, y soporte offline. El proyecto está **mayormente completo** pero tiene **bloqueos críticos** en traducción y algunas features D&D 2024 pendientes.

---

## ✅ Lo Que Está Bien

### Arquitectura y Tecnología
| Área | Estado | Detalles |
|------|--------|----------|
| Stack Principal | ✅ | React 19 + TypeScript + Vite |
| Mobile (Android/iOS) | ✅ | Capacitor configurado |
| Backend (Realtime) | ✅ | Supabase con canales broadcast |
| OTA Updates | ✅ | Capgo con version.json |
| PWA/Offline | ✅ | Service Worker implementado |
| Tema Oscuro/Dorado | ✅ | CSS variables + dark: prefix |
| Auth | ✅ | Supabase Auth + deep links |

### Features Core
| Feature | Estado | Notas |
|---------|--------|-------|
| Character List | ✅ | Import/Export JSON |
| Creator Wizard (5 pasos) | ✅ | Funcional |
| Sheet Tabs | ✅ | Combat, Inventory, Spells, Features, Notes |
| DM Dashboard | ✅ | Party management |
| Observer Mode | ✅ | Para que jugadores vean sus chars |
| Cloud Sync | ✅ | Supabase + localStorage fallback |
| Shared Resources | ✅ | Maps/imágenes via broadcast |

### Data Layer
| Área | Estado | Notas |
|------|--------|----------|
| Types (types.ts) | ✅ | Bien definido, 2024 features |
| Classes | ✅ | 12 clases + English files |
| Species | ✅ | ~20 species + species-en.ts |
| Spells | ✅ | Por nivel + translations |
| Feats | ✅ | 159 feats en English |
| Items | ✅ | Con Weapon Mastery |
| Skills | ✅ | skills-en.ts |
| Compendium | ⚠️ | Necesita traducción |

### Traducción (Progreso Reciente)
| Archivo | Estado | Notas |
|---------|--------|----------|
| CombatTab.tsx | ✅ | 100% traducido |
| FeaturesTab.tsx | ✅ | Traducido |
| characterOptions.ts | ✅ | Importa de fuentes EN |
| Data/feats/index.ts | ✅ | Exporta English |
| Data/skills/index.ts | ✅ | English |
| Data/species/index.ts | ✅ | English |

---

## 🚨 Bloqueos Críticos

### 1. Build Fails - GENERIC_FEATURES
```
GENERIC_FEATURES not exported from Data/feats/index.ts
```
- **Causa:** `feats.ts` (líneas 481-577) contiene ~100 features en español
- **Archivos afectados:** FeaturesTab.tsx, SheetTabs.tsx, Shared.tsx
- **Solución requerida:** Crear versión English de GENERIC_FEATURES o exportar desde feats-en.ts

### 2. CompendiumData.ts No Traducido
- **Tamaño:** 5008 líneas
- **Contenido pendiente:**
  - Class titles (~12 entries) - algunos en ES
  - Species (~20 entries) - todo en ES
  - Subclasses (~63 entries) - content en ES
  - Conditions (~15 entries) - mixto

---

## 📋 Work In Progress

### Traducción Sistema Bilingüe
**Plan:** `docs/plans/2026-03-18-bilingual-system-plan/_index.md`

| Task | Estado | Dependencias |
|------|--------|--------------|
| 001 Setup | ✅ | - |
| 002 Language Context | ✅ | - |
| 003 Settings Component | ✅ | - |
| 004 Feats Data | ✅ | - |
| 005 Spells Data | ⚠️ | Parcial |
| 006 Skills Data | ✅ | - |
| 007 Species Data | ✅ | - |
| 008 Classes Data | ✅ | - |
| 009 Update Components | 🔄 | Bloqueado por GENERIC_FEATURES |
| 010 Cleanup | ⏳ | Pendiente |

### D&D 2024 Implementation
**Plan:** `.agents/workflows/implementacion_dnd2024.md`

| Feature | Estado | Notas |
|---------|--------|----------|
| weaponMasteries en types | ✅ | Implementado |
| masteriesCount en classes | ⚠️ | Parcial |
| Weapon Mastery selector | ✅ | En inventory/creator |
| Stats suggestions (Standard Array) | ❌ | No implementado |
| Species spellcasting ability | ❌ | No implementado |
| Starting gold choice | ❌ | No implementado |

---

## 📊 Análisis de Componentes

### Componentes Completos ✅
- `CharacterList.tsx` - Lista + CRUD
- `Login.tsx` - Auth flow
- `CreatorSteps.tsx` - Wizard orchestrator
- `Step1Identity.tsx` - Name, species, class
- `Step5Review.tsx` - Summary
- `CombatTab.tsx` - HP, resources, skills (traducido)
- `InventoryTab.tsx` - Items + weapon mastery
- `SpellsTab.tsx` - Spell management
- `NotesTab.tsx` - Note taking
- `AiAssistant.tsx` - Google Gemini integration
- `JoinPartyModal.tsx` - Party joining

### Componentes Necesitan Atención ⚠️
| Componente | Problema | Prioridad |
|------------|----------|-----------|
| `FeaturesTab.tsx` | GENERIC_FEATURES import roto | 🔴 Alta |
| `Step2Stats.tsx` | No muestra Standard Array suggestions | 🟡 Media |
| `Step3Details.tsx` | Podría faltarle species spells | 🟡 Media |
| `Step4Skills.tsx` | No tiene weapon mastery selector | 🟡 Media |
| `DMDashboard.tsx` | UI podría mejorar | 🟢 Baja |
| `Compendium.tsx` | Datos en español | 🔴 Alta |
| `MonsterBuilder.tsx` | Funcionalidad básica | 🟢 Baja |

---

## 🔧 Issues Técnicos

### Sin Test Framework
```bash
# No hay tests configurados
# AGENTS.md indica: "Do not write tests unless one is added"
```
- **Recomendación:** Añadir Vitest cuando se implementen features críticas

### Sin Linter
- No ESLint/Prettier configurado
- TypeScript strict mode ✅ (bueno)

### UI Mixta ES/EN
- Algunos textos en español en componentes ya "traducidos"
- `gameData.ts`, `compendiumData.ts` contienen español

---

## 📁 Archivos Críticos

### Modificados Recientemente (ses_2fec)
| Archivo | Cambio |
|---------|--------|
| `Data/characterOptions.ts` | Importa de species/index.ts (EN) |
| `Data/feats/index.ts` | Añadido FEAT_OPTIONS export |
| `components/sheet/FeaturesTab.tsx` | Updated import path |
| `components/sheet/CombatTab.tsx` | Spanish → English |

### Pendientes de Traducción
| Archivo | Tamaño | Prioridad |
|---------|--------|-----------|
| `Data/compendiumData.ts` | 5008 líneas | 🔴 Alta |
| `Data/gameData.ts` | ? | 🟡 Media |
| `Data/feats.ts` | ~600 líneas | 🔴 Alta (GENERIC_FEATURES) |

---

## 🎯 Roadmap Sugerido

### Fase 1: Desbloqueo (Inmediato)
1. **Fix GENERIC_FEATURES** - Crear versión EN en feats-en.ts
2. **Rebuild + Deploy OTA** - Verificar que compila
3. **Traducir Compendium** - Batch approach por categoría

### Fase 2: D&D 2024 Completitud
1. Stats suggestions en Step2Stats
2. Species spellcasting ability selector
3. Starting gold vs equipment choice

### Fase 3: Polish
1. README.md custom (no AI Studio template)
2. Añadir tests con Vitest
3. Linter setup (ESLint + Prettier)
4. PWA manifest optimization

### Fase 4: Features Avanzadas
1. Monster Builder completo
2. Campaign management mejorado
3. Más integrations de IA

---

## 📈 Métricas

| Métrica | Valor |
|---------|-------|
| Componentes Totales | ~25 |
| Archivos de Datos | ~40 |
| Líneas de Código (approx) | ~15,000+ |
| Features D&D 2024 | 6/10 implementadas |
| Traducción UI | ~60% completa |
| Cobertura de Tests | 0% |

---

## 🔗 Referencias

- **AI_CONTEXT.md** - Credenciales y arquitectura
- **AGENTS.md** - Guidelines de desarrollo
- **CONTINUITY_ses_2fec.md** - Sesión reciente de traducción
- **implementacion_dnd2024.md** - Workflow D&D 2024
- **bilingual-system-plan/** - Plan de traducción
- **compendium-translation-design.md** - Diseño de traducción
