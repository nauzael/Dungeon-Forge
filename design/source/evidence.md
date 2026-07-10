# Dungeon Forge — Source Evidence

Extracted from production Dungeon Forge app at `G:\Apks\Dungeon Forge`.

## Files Scanned

- `index.css` — Global CSS with Tailwind directives, CSS custom properties, animations, utility classes (194 lines)
- `tailwind.config.js` — Tailwind configuration with CSS variable bindings (64 lines)
- `src/constants/themes.ts` — 5 official theme definitions with complete color, typography, shape values (240 lines)
- `src/types/theme.ts` — AppTheme, ThemeColors, ThemeTypography, ThemeShape, ThemeId TypeScript interfaces (90 lines)
- `src/contexts/ThemeContext.tsx` — React context provider for runtime CSS variable injection (210 lines)
- `src/components/ThemeSelector.tsx` — Theme selection UI component (215 lines)

## Design Tokens Extracted

- **72 total tokens** across all layers
- **14 A1-identity tokens** (colors, fonts)
- **30 A1-structure tokens** (type scale, spacing, radius, elevation, containers)
- **22 A2 tokens** (motion, focus, safe areas, icons, decorative)
- **6 B-slot tokens** (border, gloss)

## Component Patterns Extracted

- 10 button variants across 60+ component files
- 7 card variants (character, sheet, note, feature, stat, radio, member)
- 5 form element types (text input, select, toggle, range slider, textarea)
- 5 modal/dialog variants
- 2 tab navigation patterns (character sheet + DM dashboard)
- 6 grid layout patterns
- 10+ decorative and utility CSS classes

## Theme System

- Runtime CSS variable injection via React `ThemeContext`
- 5 official themes: Classic D&D (default dark), Daylight (light), Dragon Blood (red dark), Elven Forest (green dark), High Contrast (AAA)
- Tailwind references `var(--color-*)` for dynamic theming
- `data-theme` attribute on `:root` for theme-specific overrides
- WCAG 2.2 AA compliance checked via `validateThemeColors()` utility
