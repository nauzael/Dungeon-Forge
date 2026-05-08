# 🎨 Sistema de Temas - Dungeon Forge

## Descripción General

El sistema de temas permite cambiar la apariencia visual completa de la aplicación sin modificar su funcionalidad. Implementado con **CSS Variables + React Context** para máximo rendimiento en mobile.

## Arquitectura

```
src/
├── types/theme.ts           # Tipos TypeScript
├── constants/themes.ts       # Temas predefinidos
├── contexts/ThemeContext.tsx # Proveedor de contexto
├── hooks/useTheme.ts         # Hooks personalizados
├── components/
│   ├── ThemeSelector.tsx    # UI de selección
│   └── ThemeExample.tsx     # Ejemplo de uso
└── utils/wcagContrast.ts    # Validación accesibilidad
```

## Temas Disponibles

| ID | Nombre | Tipo | Descripción |
|----|--------|------|-------------|
| `classic-dnd` | Mazmorra Clásica | Oscuro | Tema por defecto |
| `daylight` | Luz Diurna | Claro | Para sesiones diurnas |
| `dragon-blood` | Sangre de Dragón | Oscuro | Tonos rojizos épicos |
| `elven-forest` | Bosque Élfico | Oscuro | Verdes naturales |
| `high-contrast` | Alto Contraste | Oscuro | WCAG AAA accesibilidad |

## Uso Básico

### 1. El Tema ya está aplicado globalmente

El `ThemeProvider` envuelve toda la aplicación en `App.tsx`. Las variables CSS se aplican automáticamente.

### 2. Usar colores del tema en componentes

```tsx
// ✅ Correcto: Usar variables CSS
<div style={{ 
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-primary)'
}}>
  Contenido
</div>

// ✅ Correcto: Usar clases Tailwind con variables
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
  Contenido
</div>

// ❌ Incorrecto: Colores hardcodeados
<div className="bg-slate-900 text-white">
  Contenido
</div>
```

### 3. Hook useTheme (si necesitas lógica)

```tsx
import { useTheme } from './hooks/useTheme';

function MiComponente() {
  const { theme, isDark, colors, setTheme } = useTheme();
  
  return (
    <div>
      <p>Tema actual: {theme.name}</p>
      <button onClick={() => setTheme('daylight')}>
        Cambiar a tema claro
      </button>
    </div>
  );
}
```

### 4. Selector de Temas (UI completa)

```tsx
import ThemeSelector from './components/ThemeSelector';

function App() {
  const [showSelector, setShowSelector] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowSelector(true)}>
        Cambiar tema
      </button>
      {showSelector && <ThemeSelector onClose={() => setShowSelector(false)} />}
    </>
  );
}
```

## Variables CSS Disponibles

### Colores
- `--color-background` - Fondo principal
- `--color-background-secondary` - Fondo secundario
- `--color-surface` - Superficies (tarjetas, modales)
- `--color-surface-highlight` - Bordes y hovers
- `--color-text-primary` - Texto principal
- `--color-text-secondary` - Texto secundario
- `--color-text-muted` - Texto atenuado
- `--color-primary` - Color primario
- `--color-primary-dark` - Primario hover
- `--color-secondary` - Color secundario
- `--color-accent` - Acentos decorativos
- `--color-success` - Éxito
- `--color-warning` - Advertencia
- `--color-error` - Error
- `--color-info` - Información
- `--color-border` - Bordes
- `--color-border-hover` - Bordes hover

### Tipografía
- `--font-family-display` - Fuente para títulos
- `--font-family-body` - Fuente para cuerpo
- `--font-size-base` - Tamaño base
- `--line-height-base` - Interlineado base

### Forma
- `--border-radius` - Radio pequeño
- `--border-radius-lg` - Radio mediano
- `--border-radius-xl` - Radio grande
- `--box-shadow` - Sombra pequeña
- `--box-shadow-lg` - Sombra grande

## Migración de Componentes Existentes

### Antes (colores fijos)
```tsx
<div className="bg-slate-900 text-white">
  <p className="text-slate-300">Texto secundario</p>
  <button className="bg-blue-500 hover:bg-blue-600">
    Acción
  </button>
</div>
```

### Después (variables de tema)
```tsx
<div className="bg-background text-text-primary">
  <p className="text-text-secondary">Texto secundario</p>
  <button className="bg-primary hover:bg-primary-dark">
    Acción
  </button>
</div>
```

## Validación WCAG

El sistema valida automáticamente que los temas cumplan WCAG 2.2 AA:

```tsx
import { validateThemeColors } from './utils/wcagContrast';

const results = validateThemeColors(myTheme.colors);
if (!results.compliant) {
  console.warn('Problemas de accesibilidad:', results.issues);
}
```

## Persistencia

El tema seleccionado se guarda en `localStorage`:
- `dungeon-forge-theme` - ID del tema seleccionado
- `dungeon-forge-theme-auto` - Modo automático (sigue sistema)

## Modo Automático

El modo automático sigue la preferencia de tema claro/oscuro del sistema:

```tsx
const { isAutoMode, setAutoMode } = useThemeContext();

// Activar modo auto
setAutoMode(true);

// El tema cambiará automáticamente con la luz del sistema
```

## Rendimiento

- ✅ **Cero re-renders** al cambiar de tema (CSS variables)
- ✅ **FOUC prevention** con variables inline en `<style>`
- ✅ **Mobile-first** optimizado para PWA
- ✅ **Offline-ready** sin dependencias de red

## Problemas Comunes

### El tema no cambia
Verifica que el componente esté dentro del `ThemeProvider`.

### Colores incorrectos
Asegúrate de usar las variables CSS, no colores hardcodeados.

### Flash de tema incorrecto (FOUC)
El tema se carga desde localStorage. Para prevenir FOUC, agrega un `<style>` inline en `index.html`:

```html
<style>
  :root {
    --color-background: #0F172A;
    --color-text-primary: #F8FAFC;
    /* ... fallback values ... */
  }
</style>
```

## Próximos Pasos

- [ ] Agregar tema personalizable (usuario crea el suyo)
- [ ] Soporte para temas de comunidad (importar/exportar)
- [ ] Animaciones de transición entre temas
- [ ] Más temas oficiales (Underdark, Feywild, etc.)

## Referencias

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React Context](https://react.dev/reference/react/useContext)
