# Decisiones Técnicas

## 1. Sin Store Global — Solo `useState` + Context

**Qué:** No se usa Redux, Zustand ni ninguna librería de estado global. El estado vive en `App.tsx` con `useState` y se pasa por props + 3 contextos (tema, diálogos, sync).

**Por qué:** El árbol de componentes es relativamente plano y el estado crítico (characters[]) se actualiza desde un solo punto. Añadir una store añadiría complejidad sin beneficio claro. Los contextos solo cubren concerns ortogonales (tema visual, UI de diálogos, estado de sync), no estado de personajes.

**Descartado:** Redux, Zustand, Jotai.

## 2. `Character` Monolítico con ~80 Campos Opcionales

**Qué:** Una sola interfaz `Character` con todos los recursos de clase como campos opcionales (`rageUses?`, `channelDivinity?`, `sorceryPoints?`, etc.).

**Por qué:** Simplifica el acceso desde cualquier componente sin necesidad de uniones discriminadas por clase. Un `character.rageUses` funciona directo sin type narrowing.

**Costo:** Sin seguridad en tiempo de compilación — un `character.sorceryPoints` en un Bárbaro es `undefined` silencioso. Se aceptó como trade-off explícito.

**Descartado:** `Character<Barbarian>` genérico, unión `BarbarianCharacter | WizardCharacter`, tipo por clase.

## 3. SPA Pura con Vite (Sin SSR)

**Qué:** Aplicación de una sola página, sin Next.js, sin server-side rendering.

**Por qué:** Es una app tipo "tool" (gestión de personajes), no un sitio público. No necesita SEO. Vite da builds rápidos y el bundle con code-splitting manual es suficiente (< 410kb entry).

**Descartado:** Next.js, Remix, Gatsby.

## 4. Firebase sobre Supabase

**Qué:** Migración completa de Supabase a Firebase (junio 2026). Firestore para persistencia, RTDB para broadcasting en vivo, Storage para OTA.

**Por qué:** Firebase simplifica el stack de tiempo real (RTDB vs Supabase Realtime), la auth está más madura para Capacitor, y el plan gratuito es más generoso para el caso de uso.

**Descartado:** Supabase (migrado), backend propio.

## 5. RTDB para Broadcast, Firestore para Datos

**Qué:** Separación de concerns: Firestore guarda datos "oficiales" (characters con CRUD completo). RTDB solo replica personajes activos en una party para broadcasting en vivo.

**Por qué:** Firestore no tiene buen soporte de presencia/tiempo real masivo. RTDB es más barato para broadcasts frecuentes (HP changes, rest). Separar evita que el broadcasting masivo encarezca Firestore.

## 6. Sidecar para OTA con @capgo/capacitor-updater

**Qué:** Las actualizaciones over-the-air se sirven desde Firebase Storage, no desde stores. El proceso: `npm run ota` → zip + version.json → upload a Firebase.

**Por qué:** Evita pasar por Google Play Store para fixes pequeños. El version.json permite rollback inmediato desde CLI.

## 7. `syncTimestamp` + Guardias para Romper Loops de Sincronización

**Qué:** Cada personaje tiene un `syncTimestamp`. Los listeners de RTDB y Firestore comparan `incoming > current` antes de aplicar. El persist effect NO genera un nuevo `Date.now()` — usa el existente.

**Por qué:** Sin estas guardias, el broadcast loopback sobreescribe datos frescos con stale, y el persist effect genera flickering infinito (documentado en 7 gotchas de AGENTS.md).

## 8. Cleanup de Canal RTDB al Salir de Party

**Qué:** Cuando un personaje cambia de party o es expulsado, `useSync` limpia el listener RTDB anterior antes de suscribir al nuevo.

**Por qué:** Bug de "ghost players" — personajes reaparecían en la party después de ser expulsados porque el listener viejo seguía activo y traía datos de la party anterior.

## 9. PWA sin Framework (Service Worker Manual)

**Qué:** `sw.js` escrito a mano con estrategias network-first (HTML) y stale-while-revalidate (assets).

**Por qué:** VitePWA (Workbox) generaba bundles muy pesados. Un SW manual de 79 líneas cubre el caso de uso (offline parcial, cache de assets).

**Descartado:** `vite-plugin-pwa`, Workbox.

## 10. Sin CI/CD Automatizado

**Qué:** No hay GitHub Actions, GitLab CI ni Docker. Deploy manual: `npm run build` → subir a Vercel + `npm run ota` → Firebase.

**Por qué:** El proyecto es de un solo desarrollador. No justifica el overhead. Vercel hace deploy automático desde GitHub en main branch.
