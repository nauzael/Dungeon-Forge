# Dungeon Forge — Design System

> Design system extraído del código fuente de Dungeon Forge (D&D 5e 2024).
> Compatible con Open Design para generación de prototipos, componentes y artefactos.

---

## 📁 Estructura

```
design/
├── manifest.json            ← Metadatos del design system (formato OD)
├── DESIGN.md                ← Documentación completa (9 secciones)
├── USAGE.md                 ← Guía de uso para agentes/desarrolladores
│
├── tokens/
│   ├── tokens.css           ← 72 tokens CSS (5 temas oficiales)
│   ├── design-tokens.json   ← Contrato de tokens estructurados
│   └── tailwind-v4.css      ← Compatibilidad con Tailwind 4
│
├── components/
│   ├── components.html      ← 35+ componentes renderizados en HTML
│   └── components.manifest.json ← Inventario de componentes
│
├── preview/
│   ├── colors.html          ← Paleta de colores
│   ├── typography.html      ← Tipografía
│   └── spacing.html         ← Espaciado y elevación
│
└── source/
    ├── evidence.md          ← Documentación de extracción
    ├── tokens.source.json   ← Tokens agrupados por layer
    └── token-contract.report.json  ← Validación 100% pass
```

---

## 🎨 Temas incluidos

| Tema | ID | Tipo | Fondos | Acento |
|------|----|------|--------|--------|
| Mazmorra Clásica | `classic-dnd` | 🌙 Oscuro | `#0F172A` | `#359EFF` |
| Luz Diurna | `daylight` | ☀️ Claro | `#F8FAFC` | `#2563EB` |
| Sangre de Dragón | `dragon-blood` | 🌙 Oscuro | `#0C0A0A` | `#DC2626` |
| Bosque Élfico | `elven-forest` | 🌙 Oscuro | `#0A1F1A` | `#10B981` |
| Alto Contraste | `high-contrast` | 🌙 Oscuro | `#000000` | `#FFFF00` |

---

## 🚀 Cómo usar con Open Design

### Opción A: Importar desde la Web UI

1. Abrí `http://127.0.0.1:62573/` en el navegador
2. Andá a **Settings → Design Systems**
3. Importá la carpeta `G:\Apks\Dungeon Forge\design\`
4. Seleccioná "Dungeon Forge" al crear un nuevo proyecto

### Opción B: Usar automation "extract-design-system"

El pipeline del automation template es:
```
Capture design source → Compact source context → Draft DESIGN.md → Create design-system proposal
```

**Trigger manual:**
1. Abrí Open Design → Automation → "extract-design-system"
2. Source: apuntá a `G:\Apks\Dungeon Forge\design\source\`
3. OD va a leer los tokens, componentes, y evidence para proponer mejoras

**Trigger por connector:**
- Configurá un connector al repo `G:\Apks\Dungeon Forge`
- Cada vez que cambien los archivos de diseño, OD puede re-ejecutar el pipeline

### Opción C: Agente MCP (OpenCode)

Con el MCP server funcionando, cualquier agente puede acceder via:
```json
{
  "mcpServers": {
    "open-design": {
      "command": "C:\\Users\\Nauzael\\node22\\node-v22.14.0-win-x64\\node.exe",
      "args": ["C:\\Users\\Nauzael\\open-design\\resources\\app\\prebundled\\daemon\\daemon-cli.mjs", "mcp"],
      "env": { "OD_DAEMON_URL": "http://127.0.0.1:62573" }
    }
  }
}
```

---

## 📊 Resumen de tokens

| Categoría | Cantidad | Detalle |
|-----------|----------|---------|
| **Colores** | 15 tokens | bg, surface, fg, accent, semantic |
| **Tipografía** | 10 tokens | font families, type scale, leading, tracking |
| **Espaciado** | 12 tokens | 4px grid, section spacing, container gutters |
| **Radios** | 6 tokens | sm (4px) → pill (9999px) |
| **Elevación** | 5 tokens | flat, ring, raised, modal, glow |
| **Movimiento** | 6 tokens | 150ms → 700ms, 2 easings |
| **Componentes** | 35+ | 10 botones, 7 cards, 5 forms, 5 modals, etc. |

**Score de validación:** 100/100 — Excellent

---

## 🔗 Fuentes originales

Extraído de:
- `index.css` — CSS custom properties + animaciones (194 líneas)
- `tailwind.config.js` — Configuración Tailwind (64 líneas)
- `src/constants/themes.ts` — 5 temas oficiales (240 líneas)
- `src/types/theme.ts` — Interfaces AppTheme (90 líneas)
- `src/contexts/ThemeContext.tsx` — Inyección dinámica de CSS vars (210 líneas)
- `src/components/ThemeSelector.tsx` — Selector de temas UI (215 líneas)
- 60+ componentes React analizados para patrones UI

---

> Generado el 2026-06-19 por gem-team
> Design system: `dungeon-forge`
