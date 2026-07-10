# Auditoría de Zonas Táctiles — Mobile & Tablet

> **Fecha:** 2026-06-24  
> **App:** Dungeon Forge (React 19 + Capacitor 6)  
> **Target:** Mobile (PWA) + Tablet (landscape)

---

## Resumen Ejecutivo

Se identificaron **10 problemas** que afectan la experiencia táctil. El más crítico es la **ausencia total de `touch-action: manipulation`**, que fuerza un retardo de 300ms en cada toque. Combinado con **3 manejadores swipe** que compiten con los taps normales, esto explica la mayoría de "tap que va a otro lado" y "zonas muertas".

### Impacto por Tipo de Dispositivo

| Dispositivo | Problemas Principales | Gravedad |
|-------------|----------------------|----------|
| **Mobile portrait** | Delay 300ms + swipe conflict + tab bar shifting | 🔴 Alta |
| **Tablet landscape** | Swipe handlers duplicados + layout split competition | 🔴 Alta |
| **Ambos** | `stopPropagation` en modales + zoom overlay blocking | 🟡 Media |

---

## 🔴 P1 — Alto Impacto

### 1. Ausencia de `touch-action: manipulation`

| Archivo | `index.css` |
|---------|-------------|
| **Qué pasa** | No hay ninguna regla `touch-action` en todo el CSS. Los navegadores móviles asumen `touch-action: auto`, lo que significa que esperan 300ms antes de disparar un `click` para determinar si el toque es un doble-tap para zoom. |

**Síntomas:**
- Cada tap tiene un retraso de 300ms → la app se siente "laggy" al tacto
- El usuario toca y piensa que no funcionó → toca de nuevo → dos acciones
- Los botones parecen "zonas muertas" porque el feedback visual tarda

**Fix:**
```css
/* index.css - body o :root */
body {
  touch-action: manipulation; /* Elimina delay 300ms, desactiva doble-tap zoom */
}
```

---

### 2. Swipe Handler Compite con Taps Normales (Mobile)

| Archivo | `src/components/SheetTabs.tsx` — líneas 255-315 |
|---------|---------------------------------------------------|

Hay 3 manejadores (`onTouchStart`, `onTouchMove`, `onTouchEnd`) en el contenedor principal (`div` raíz del sheet). Este es el **wrapper de TODA la hoja de personaje**. Cualquier toque en cualquier pestaña pasa por estos handlers.

**El problema:**

```typescript
const onTouchEnd = () => {
  // ... checks scrollable parents ...
  const distanceX = touchStart.current.x - touchEnd.current.x;
  const absX = Math.abs(distanceX);
  const absY = Math.abs(distanceY);
  if (absX < minSwipeDistance || absX < absY * 1.2) return;
  // → Cambia de tab si detecta swipe ←
};
```

**Lo que ocurre en la práctica:**
- Usuario toca un botón en CombatTab
- `touchStart` captura la posición
- Aunque el dedo apenas se mueva (lo normal al tocar), `touchEnd` se ejecuta
- Si se movió horizontalmente >100px O si la componente horizontal domina sobre la vertical → cambia de pestaña
- El `onClick` del botón se dispara TAMBIÉN → el usuario ve que se ejecuta la acción DEL BOTÓN y ADEMÁS cambia de tab → **"tap que va a otro lado"**

**Por qué falla en scroll horizontal:** El guard `overflowX: auto/scroll` sube por el DOM buscando elementos scrollables. Pero si un hijo está dentro de un `overflow-x: hidden` (como muchos contenedores con `overflow-x-hidden`), el traversal se corta y la guardia no funciona.

**Fix:**

```typescript
// 1. Añadir un flag "isSwiping" que los onClick puedan verificar
const [isSwiping, setIsSwiping] = useState(false);
const SWIPE_THRESHOLD = 100;
const isTouchDevice = 'ontouchstart' in window;

const onTouchStart = (e: React.TouchEvent) => {
  if (zoomImage) return;
  setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  setIsSwiping(false);
};

const onTouchMove = (e: React.TouchEvent) => {
  if (zoomImage) return;
  const dx = Math.abs(e.touches[0].clientX - touchStart.x);
  const dy = Math.abs(e.touches[0].clientY - touchStart.y);
  if (dx > SWIPE_THRESHOLD && dx > dy * 1.2) {
    setIsSwiping(true); // ← Marca como swipe real
  }
};

const onTouchEnd = () => {
  if (isSwiping) {
    // Solo cambiar tab si hubo un swipe real, no un tap
    handleSwipeChange();
  }
  // Si no es swiping, el click event del botón se dispara normalmente
};
```

**O mejor:** Separar el swipe handler SOLO para la zona que no tiene botones (ej. el header o un gutter), y desactivarlo en el contenido scrolleable:

```tsx
// Solo en el sticky header, no en el contenedor principal
<div className="sticky top-0" onTouchStart={...} onTouchMove={...} onTouchEnd={...}>
```

---

### 3. Right-Panel Swipe Handler en Tablet Captura TODOS los Toques

| Archivo | `src/components/SheetTabs.tsx` — líneas 769-775 |
|---------|--------------------------------------------------|

```tsx
<div className="flex-1 h-screen flex flex-col relative min-w-0"
  onTouchStart={(e) => { ... }}
  onTouchMove={(e) => { ... }}
  onTouchEnd={handleRightPanelSwipe}
>
```

El right panel ocupa **70% de la pantalla** en landscape. Cualquier interacción: scrollear en SpellsTab, marcar un item en Inventory, tocar un hechizo → pasa por este handler. El threshold es solo **80px** horizontal.

**Esto es catastrófico en tablet:** el usuario está scrolleando verticalmente en la lista de hechizos, su dedo se mueve naturalmente 80px en diagonal (común al scrollear), y de repente cambia de pestaña en el right panel.

**Fix:**

```typescript
const handleRightPanelSwipe = () => {
  const dx = Math.abs(distance);
  const dy = Math.abs(deltaY);
  // Aumentar threshold y hacerlo más estricto
  if (dx < 120 || dx < dy * 1.5) return; // ← Antes: 80px y 1.2
  // ...
};
```

O mejor aún: **No usar swipe en el right panel**. Usar solo los botones del mini tab bar. O restringir el swipe a una zona específica (ej. el header del panel, no el contenido).

---

### 4. Avatar Tap Target + Swipe Conflict

| Archivo | `src/components/SheetTabs.tsx` — líneas 622-657 |
|---------|--------------------------------------------------|

El avatar es un círculo de `size-14` (56px). En mobile, el tap target mínimo recomendado es 44px, así que está apenas en el límite. **Pero**:

1. Al tocar el avatar, el `touchStart` del swipe handler captura el target
2. Si el dedo se mueve > 100px horizontal (fácil si se está scroleando), cambia de tab
3. El `onClick` del avatar tiene `e.stopPropagation()` pero eso no afecta al swipe handler porque está en `onTouchStart`, no en `onClick`

**Fix:** El avatar debería tener `onTouchStart={(e) => e.stopPropagation()}` para evitar que el swipe handler capture el inicio del toque.

---

## 🟡 P2 — Impacto Medio

### 5. Mobile Tab Bar — Targets se Desplazan al Activar

| Archivo | `src/components/SheetTabs.tsx` — líneas 932-935 |
|---------|--------------------------------------------------|

```tsx
className={`flex items-center justify-center gap-2 h-11 rounded-radius-pill ... ${
  activeTab === tab.id
    ? 'text-white bg-primary ... px-5'       // ← Ancho variable
    : 'text-slate-400 ... w-11'               // ← Ancho fijo 44px
}`}
```

Los tabs inactivos son `w-11` (44px, cuadrado) y el activo es `px-5` (ancho variable que incluye texto + icono). Cuando el usuario toca un tab inactivo:

1. Ese tab pasa a `px-5` (CREA espacio extra)
2. El tab que era activo pasa a `w-11` (SE ENCOGE)
3. Los tabs se desplazan 20-30px
4. Si el usuario tiene otro dedo o vuelve a tocar, la posición del botón cambió

**Fix:** Usar ancho fijo para TODOS los tabs, calculando el mayor ancho posible:

```tsx
// Todos los tabs con el mismo ancho mínimo
className={`
  flex items-center justify-center gap-2 h-11 px-4  // ← px-4 fijo para todos
  rounded-radius-pill transition-all ...
  ${activeTab === tab.id ? 'text-white bg-primary ...' : '...'}
`}
```

O usar `flex-1` para que se distribuyan equitativamente.

---

### 6. Mini Tab Bar en Landscape — Targets Muy Pequeños

| Archivo | `src/components/SheetTabs.tsx` — líneas 842-846 |
|---------|--------------------------------------------------|

```tsx
className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-radius-lg text-[10px] ...`}
```

`py-2.5` son ~10px. El touch target vertical es solo ~24px (10px padding × 2 + 4px gap + texto). **Muy por debajo de los 44px recomendados.** Es fácil tocar entre botones y no acertar.

**Fix:**

```tsx
// Aumentar touch target manteniendo visual compacto
className={`
  flex flex-col items-center justify-center gap-1 
  px-4 py-3 rounded-radius-lg text-[10px] ...
  min-h-[44px] min-w-[44px]  // ← Forzar touch target mínimo
`}
```

---

### 7. Cadena de `stopPropagation` en Modales

| Archivos | `CampaignResources.tsx`, `NotesTab.tsx`, `CombatTab.tsx`, `InventoryTab.tsx`, etc. |
|----------|--------------------------------------------------|

El patrón típico:
```tsx
<div className="fixed inset-0 z-[100] ..." onClick={() => setModalOpen(false)}>
  <div className="..." onClick={e => e.stopPropagation()}>
    {/* Contenido del modal */}
  </div>
</div>
```

**El problema:** El modal backdrop tiene `onClick` para cerrar, pero el contenido tiene `stopPropagation`. Esto es correcto para clicks. **Pero** los `onTouchStart`/`onTouchEnd` del swipe handler en el padre (SheetTabs) NO son detenidos por `stopPropagation` del onClick. Los touch events burbujean hasta el contenedor principal y el swipe handler se ejecuta aunque haya un modal abierto.

**Fix:** Agregar `onTouchMove={(e) => e.stopPropagation()}` a la capa del modal backdrop (similar a como ya se hace en el zoom modal, línea 1015). Mejor aún: agregar un estado `isModalOpen` en SheetTabs para desactivar el swipe handler mientras haya un modal.

---

### 8. Sin `overscroll-behavior` en Paneles Scrollables

| Archivo | Varios |
|----------|--------|

Solo `body` tiene `overscroll-behavior-y: none`. Los paneles scrollables internos (CombatTab en landscape, right panel) deberían tener `overscroll-behavior: contain` para evitar que el scroll "se salga" del panel y active el swipe handler del padre.

---

## 🟢 P3 — Bajo Impacto / Mejora

### 9. `active:scale-95` Puede Causar Jitter Visual

Muchos botones tienen `active:scale-95`. En mobile, CSS `transform: scale()` durante un touch puede causar parpadeo visual si el elemento tiene texto o si el layout circundante se reflow. No es crítico pero contribuye a la percepción de "tap que no funcionó".

**Fix:** Reemplazar con `active:opacity-80` donde sea posible, o asegurar `will-change: transform` en los botones con scale.

### 10. Zoom Modal con `stopPropagation` en Todos los Touch Events

| Archivo | `SheetTabs.tsx` — líneas 1014-1016 |
|---------|-------------------------------------|

```tsx
onTouchStart={(e) => e.stopPropagation()}
onTouchMove={(e) => e.stopPropagation()}
onTouchEnd={(e) => e.stopPropagation()}
```

Esto está bien para aislar el zoom del swipe handler, pero también bloquea cualquier otro handler de touch dentro del zoom. Si en el futuro se agregan gestos al zoom, habrá que recordar que estos `stopPropagation` están aquí. No es un bug hoy, pero es un gotcha.

---

## 📊 Mapa de Calor de Touch Targets

| Componente | Touch Target | Recomendado | Estado |
|-----------|-------------|-------------|--------|
| Tab bar (mobile) | 44×44px (inactivo) | 44×44px | ✅ Límite |
| Tab bar (mobile) | Variable (activo) | 44×44px | 🔴 Se desplaza |
| Mini tab bar (tablet) | ~24×40px | 44×44px | 🔴 Muy pequeño |
| Avatar | 56×56px | 44×44px | ✅ OK pero conflicto swipe |
| Botón back | 44×44px | 44×44px | ✅ OK |
| Delete button (card) | 44×44px | 44×44px | ✅ OK |
| Modal buttons | ~48px | 44×44px | ✅ OK |
| Botones CombatTab | Variable | 44×44px | 🟡 Verificar |
| Rage toggle | `h-10` (40px) | 44×44px | 🟡 Borde |
| Botones grimoire | ~36px | 44×44px | 🔴 Pequeños |

---

## 🛠️ Plan de Acción

### Prioridad 1 — Arreglar AHORA (afecta todos los usuarios móviles)

| # | Acción | Archivo | Tiempo |
|---|--------|---------|--------|
| 1 | Agregar `touch-action: manipulation` en body | `index.css` | 1 min |
| 2 | Desacoplar swipe handler de taps en SheetTabs | `SheetTabs.tsx` | 20 min |
| 3 | Aumentar threshold right-panel swipe (80→120, 1.2→1.5) | `SheetTabs.tsx` | 5 min |
| 4 | Agregar `onTouchStart.stopPropagation()` al avatar | `SheetTabs.tsx` | 2 min |

### Prioridad 2 — Arreglar PRONTO

| # | Acción | Archivo | Tiempo |
|---|--------|---------|--------|
| 5 | Fijar ancho de tabs para evitar desplazamiento | `SheetTabs.tsx` | 10 min |
| 6 | Aumentar touch target mini tab bar a min 44px | `SheetTabs.tsx` | 5 min |
| 7 | Prevenir swipe handlers cuando hay modal abierto | `SheetTabs.tsx` + modales | 15 min |

### Prioridad 3 — Mejora Continua

| # | Acción | Archivo | Tiempo |
|---|--------|---------|--------|
| 8 | Agregar `overscroll-behavior: contain` a paneles scrollables | Varios | 10 min |
| 9 | Revisar `active:scale-95` → `active:opacity-80` | Varios | 10 min |

---

## 🧪 Cómo Verificar

```bash
# 1. Build y preview
npm run build && npm run preview
# Abrir en Chrome → DevTools → Device Toolbar (iPhone 14 Pro, Pixel 7, iPad)

# 2. Verificar touch-action
# DevTools → Elements → Computed → touch-action → debe decir "manipulation"

# 3. Verificar delay de tap
# DevTools → Performance → grabar taps → buscar "pointer" y "click" con gap > 0ms

# 4. Prueba manual en Android
npx cap sync android
cd android && .\gradlew assembleDebug
# Instalar APK y probar gestos reales
```

---

## 🔗 Cascada de Eventos Táctiles (Diagrama)

```
Touch Start (dedo en pantalla)
    │
    ├─→ SheetTabs.onTouchStart() → captura posición
    │
    ├─→ ¿Hay modal abierto? → NO → continúa
    │
    ├─→ Touch Move
    │   ├─→ ¿Scroll en contenido? → overflow guard → SKIP
    │   └─→ ¿Movimiento horizontal? → isSwiping = true
    │
    ├─→ Touch End
    │   ├─→ ¿isSwiping? → CAMBIA DE TAB 🔴 PROBLEMA
    │   └─→ ¿No swiping? → Browser espera 300ms (touch-action:auto) 🔴
    │       └─→ Dispara click
    │
    └─→ Click Event
        ├─→ Botón normal → ejecuta acción
        └─→ ¿stopPropagation? → no burbujea (este es OK)
```

**Conclusión:** Los 3 problemas actúan juntos:
- **Sin `touch-action: manipulation`** → 300ms de delay → usuario toca de nuevo → eventos duplicados
- **Swipe handler en todo el sheet** → taps con mínimo movimiento cambian de tab
- **Right panel swipe con threshold bajo** → scroll natural cambia de pestaña en tablet
