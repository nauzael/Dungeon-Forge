# AI Context: Dungeon Forge (Master Reference)

> **Última actualización**: 2026-04-16

Este archivo es la fuente de verdad definitiva para el contexto del proyecto Dungeon Forge. Proporciona una visión integral de la arquitectura, credenciales reales y workflows operativos.

---

## 🚀 Resumen del Proyecto
**Dungeon Forge** es una "Character Sheet" avanzada para D&D 5e (Edición 2024).
- **Core**: React 19 + TypeScript + Vite.
- **PWA/Offline**: Service Worker (`sw.js`) con estrategia *Stale-While-Revalidate* para activos y *Network-First* para navegación.
- **Mobile-First**: Optimizado para dispositivos móviles y empaquetado con **Capacitor**.
- **Backend**: **Supabase** para sincronización en tiempo real entre Jugadores y DMs.

---

## 🔑 Credenciales Reales (USO PRIVADO)
Estas credenciales están activas y configuradas en el proyecto. **NO ELIMINAR NI COMPARTIR.**

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://usnlhzkpukkuwbtortil.supabase.co` | Endpoint de la base de datos |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjg0NzcsImV4cCI6MjA4OTk0NDQ3N30.EQmHpS5esPhdi_Cd9OtYusMs58r9J4GG-0j5JC5riqc` | Key pública de Supabase |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw` | Key de servicio para despliegues OTA |

### .env listo para restaurar
```env
VITE_SUPABASE_URL=https://usnlhzkpukkuwbtortil.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjg0NzcsImV4cCI6MjA4OTk0NDQ3N30.EQmHpS5esPhdi_Cd9OtYusMs58r9J4GG-0j5JC5riqc
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbmxoemtwdWtrdXdidG9ydGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM2ODQ3NywiZXhwIjoyMDg5OTQ0NDc3fQ.QNSwwJ10U4UDiQiYQBci7GUxYM15w14vGgKqJnWvhJw
```

---

## 🛠 Workflows y Automatización

### 1. Despliegue de Actualizaciones OTA (Over-The-Air)
El proyecto usa **Capacitor Updater** para actualizar la app instalada en móviles sin pasar por la Play Store.
```bash
# Sube una nueva versión a Supabase accesible por la App
npm run ota "Descripción del cambio"
```
- **Script**: `scripts/build_ota.mjs`
- **Bucket**: `updates` en Supabase.
- **Acción**: Crea un ZIP del `dist/`, genera un `version.json` y lo sube.

### 2. Sincronización en Tiempo Real (Realtime)
Ubicación: `utils/supabase.ts`.
- **Canales**: `party-{partyId}`.
- **Eventos**: 
  - `postgres_changes`: Para cambios en la DB.
  - `broadcast (character-update)`: Para actualizaciones instantáneas de HP y slots sin esperar a la DB.
  - `broadcast (resource-share)`: Para que el DM comparta imágenes/mapas en pantalla.

### 3. Sistema de Traducción
Ubicación: `Data/translations/ui.ts`.
- Usa el hook `useLanguage` para cambiar dinámicamente entre **Español** e **Inglés**.
- **Nota**: El contenido de juego (hechizos, dotes) suele estar en español por defecto en los archivos de `Data/`.

---

## 📜 Reglas de Diseño y Código
1. **Idioma UI**: El usuario prefiere **Español** para toda la interfaz.
2. **Iconos**: Siempre usar `<span className="material-symbols-outlined">key</span>`.
3. **Estructura de Datos (Data/)**:
   - `spells/`: Hechizos divididos por nivel.
   - `classes/`: Definiciones de clase (rogue.ts, wizard.ts, etc.).
   - `items.ts`: Catálogo de equipo.
   - `dm/criticalTables.ts`: Tablas de críticos y pifias (20 efectos c/u).
4. **Resiliencia**: Si Supabase no responde, la app debe persistir cambios en `localStorage` usando los helpers de `supabase.ts`.

---

## 🎲 Portal del DM (DM Nexus)

Accesible desde `CharacterList` → `onOpenDMDashboard` → `view = 'dm-dashboard'`.

### Tabs del Dashboard (`DashboardTab`)
| Tab | Componente | Descripción |
| :-- | :-- | :-- |
| `party` | inline en `DMDashboard.tsx` | Vista de miembros en tiempo real (HP, AC, spell slots) |
| `initiative` | `dm/InitiativeTracker.tsx` | Tracker de iniciativa (PC + monstruos) |
| `critical` | `dm/CriticalFumbleTable.tsx` | Tablas de críticos y pifias |
| `resources` | `dm/CampaignResources.tsx` | Atlas: mapas e imágenes compartibles |
| `compendium` | `dm/Compendium.tsx` | Referencia rápida de reglas |
| `monsters` | `dm/MonsterBuilder.tsx` | Constructor de monstruos + CR estimado |

### Sistema de Tablas de Críticos y Pifias
- **Datos**: `Data/dm/criticalTables.ts`
  - `CRITICAL_TABLE`: 20 efectos (físico + mágico).
  - `FUMBLE_TABLE`: 20 efectos (físico + mágico).
  - `rollOnTable(table, rollValue?)`: helper para tiradas.
- **Componente**: `components/dm/CriticalFumbleTable.tsx`
  - UI: grid 5×4 (1-20) para selección manual del dado físico.
  - Muestra simultáneamente efecto físico y mágico del mismo resultado.
  - Tirada aleatoria virtual con animación (500ms).
  - **NO** hace tiradas automáticas al abrir; el DM selecciona el número.

### Flujo Realtime del DM
1. DM suscribe al canal `party-{partyId}` vía `subscribeToParty()`.
2. `postgres_changes` actualiza miembros desde la DB (source of truth).
3. `broadcast (character-update)` actualizaciones efímeras de HP/slots en vivo.
4. Cleanup: `channel.unsubscribe()` en la función de limpieza de `useEffect`.

---

## 🔄 Sistema de Migraciones de Personaje

- **Archivo**: `utils/characterMigrations.ts`
- Se ejecuta en `App.tsx` al cargar personajes de `localStorage`:
  ```typescript
  const { characters: migratedChars } = migrateCharacters(loaded);
  ```
- Añade campos nuevos a personajes viejos sin romper retrocompatibilidad.
- **Regla crítica**: Cuando se agrega un campo nuevo a `Character` en `types.ts`, también debe añadirse la migración correspondiente aquí.

---

## 🗑️ Soft-Delete de Personajes

- Los personajes eliminados se marcan en Supabase con `deleted_at` (soft delete).
- `deletedCharacterIds: Set<string>` en `App.tsx` previene restauraciones desde el cloud tras eliminar localmente.
- Guardado en `localStorage` bajo clave `df-deleted-characters`.
- El canal realtime detecta cambios `UPDATE` con `deleted_at` presente y los filtra.

---

## ⚙️ Sistema Genérico de Features (`featureUsages`)

- Campo en `Character`: `featureUsages?: Record<string, FeatureUsage>`
- Permite trackear usos de habilidades de clase sin crear campos individuales.
- **Interface** `FeatureUsage`: `{ current, max, resetType, costToRestore? }`
- **`ResetType`**: `'long_rest' | 'short_rest' | 'always' | 'never'`
- **`FeatureUsageConfig`**: define la fórmula para el `max` (`'WIS' | 'level' | 'proficiencyBonus'` etc.)
- Úsalo en lugar de crear nuevos campos individuales para rasgos de clase.

---

## 📁 Archivos Críticos a Observar

| Archivo | Rol |
| :-- | :-- |
| `App.tsx` | Orquestador principal de vistas, auth, sync, OTA |
| `types.ts` | Esquema de datos de todo el proyecto |
| `index.css` | Sistema de diseño oscuro/dorado (CSS variables) |
| `sw.js` | Estrategia de cacheo offline (SWR + Network-First) |
| `utils/characterMigrations.ts` | Migraciones al cargar personajes de localStorage |
| `utils/sheetUtils.ts` | Cálculos de juego: AC, stats, spell slots, saves |
| `utils/supabase.ts` | Helpers de cloud: save, fetch, broadcast, subscribe |
| `components/DMDashboard.tsx` | Portal del DM — contiene DashboardTab type |
| `Data/dm/criticalTables.ts` | Datos de tablas de críticos y pifias |
| `components/dm/CriticalFumbleTable.tsx` | UI de selección manual de críticos/pifias |
