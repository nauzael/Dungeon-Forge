# Dungeon Forge Design System

> Tabletop RPG character management for D&D 5e (2024) — dark fantasy UI with dynamic theming, mobile-first layout, and Material Symbols iconography.

---

## 1. Identity & Visual Philosophy

Dungeon Forge is a **D&D character manager** designed for mobile-first PWA and Capacitor Android/iOS. The UI evokes a **dark fantasy tabletop aesthetic**: deep navy backgrounds, blue-cyan magical accents, subtle glow effects, and textured surfaces that feel like aged parchment and leather-bound tomes.

**Design principles:**
- **Dark by default** — the base theme is dark (`--color-background: #0F172A`), reducing eye strain during long sessions
- **Thematic flexibility** — 5 official themes that can be swapped at runtime without page reload
- **Mobile-first** — all layouts, touch targets, and interactions prioritize mobile web with notch/safe-area awareness
- **Magical but not distracting** — glow effects and gradients exist but never impede readability or performance
- **RPG atmosphere** — subtle details (leather texture overlay, shimmering gold text, grimoire-style scrollbars) reinforce the fantasy setting

---

## 2. Color System

### 2.1 Token Architecture

Colors use CSS custom properties applied to `:root` via JavaScript `ThemeContext` at runtime. This allows **instant theme switching** without CSS cascade recalculation.

**A1-identity tokens (core brand):**

| Token | Classic D&D (default) | Purpose |
|---|---|---|
| `--color-background` | `#0F172A` | Page background, main canvas |
| `--color-background-secondary` | `#1E293B` | Secondary backgrounds, section separators |
| `--color-surface` | `#1E293B` | Card/panel surfaces |
| `--color-surface-highlight` | `#334155` | Hovered/active surface state |
| `--color-text-primary` | `#F8FAFC` | Primary body text (near-white) |
| `--color-text-secondary` | `#E2E8F0` | Secondary text (slightly dimmed) |
| `--color-text-muted` | `#94A3B8` | Muted/disabled text |
| `--color-primary` | `#359EFF` | Primary actions, links, focus states |
| `--color-primary-dark` | `#2B7DE0` | Primary hover/active state |
| `--color-secondary` | `#64748B` | Secondary actions |
| `--color-accent` | `#9ADBFF` | Decorative accents, glows, highlights |
| `--color-border` | `rgba(154, 219, 255, 0.1)` | Subtle borders |
| `--color-border-hover` | `rgba(154, 219, 255, 0.2)` | Border on hover/focus |

**Semantic state tokens:**

| Token | Value | Usage |
|---|---|---|
| `--color-success` | `#22C55E` | HP healing, positive changes |
| `--color-warning` | `#F59E0B` | Warnings, resource alerts |
| `--color-error` | `#EF4444` | Errors, damage, death saves |
| `--color-info` | `#3B82F6` | Informational badges |

### 2.2 Official Themes

Dungeon Forge ships 5 official themes that override the A1-identity tokens:

**1. Mazmorra Clásica** (`classic-dnd`) — Default dark theme. Navy blue base with blue-cyan accents. WCAG 2.2 AA compliant.

**2. Luz Diurna** (`daylight`) — Light theme for daytime play. White/slate palette with blue primary. All components support both dark/light variants.

**3. Sangre de Dragón** (`dragon-blood`) — Dark red theme. Deep crimson backgrounds with red accents. Epic fantasy atmosphere.

**4. Bosque Élfico** (`elven-forest`) — Dark green theme. Emerald and forest tones. Natural, druidic aesthetic.

**5. Alto Contraste** (`high-contrast`) — Maximum contrast accessibility theme. Black background, white text, yellow primary. Designed for WCAG AAA compliance.

### 2.3 Color Application Rules

- **Primary backgrounds:** Always use `--color-background` or `--color-surface`
- **Interactive elements:** Use `--color-primary` for buttons, links, active states
- **Decorative elements:** Use `--color-accent` for glows, icons, subtle highlights
- **Success/Error states:** Only use semantic colors for actual status — never for decoration
- **In dark themes:** `rgba(0,0,0,0.5)` for shadows; `rgba(255,255,255,0.1)` for subtle borders
- **In light themes (Daylight):** `rgba(0,0,0,0.1)` for borders; lighter shadow values

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Fallback | Source |
|---|---|---|---|
| Display/Headings | Spline Sans | system-ui, sans-serif | Google Fonts |
| Body text | Noto Sans | system-ui, sans-serif | Google Fonts |
| Icons | Material Symbols Outlined | — | Google Fonts |

### 3.2 Type Scale

Tokens use `em` and `rem` units for responsive scaling:

| Token | Value | Usage |
|---|---|---|
| `--font-size-base` | `0.875rem` (14px) | Body text default |
| `line-height-base` | `1.5` | Body line height |

Common inline sizes (Tailwind classes):
- `text-[10px]` / `text-[11px]` — Uppercase labels, stat labels, badges
- `text-xs` (12px) — Muted text, captions
- `text-sm` (14px) — Body text, descriptions
- `text-base` (16px) — Standard text
- `text-lg` (18px) — Emphasized text
- `text-xl` (20px) — Section headings
- `text-2xl` (24px) — Modal titles
- `text-3xl` (30px) — Hero headings
- `text-5xl` (48px) — HP display, large stats

### 3.3 Font Weights

- `font-black` (900) — Display text, HP values, major labels
- `font-bold` (700) — Buttons, headings, emphasis
- `font-semibold` (600) — Section labels
- `font-medium` (500) — Body emphasis
- `font-normal` (400) — Body text

### 3.4 Tracking (Letter Spacing)

- `tracking-tighter` / `-0.05em` — Title text (Dungeon Forge logo: `uppercase tracking-tighter`)
- `tracking-tight` / `-0.025em` — Heading text
- `tracking-wider` / `0.05em` — Uppercase labels
- `tracking-widest` / `0.1em` — Stat labels, decorative text
- `tracking-[0.2em]` — Extreme letter spacing for special labels

### 3.5 Typography Rules

- All-caps labels use `uppercase tracking-widest text-[10px] font-black`
- Stat values are always `font-black` for maximum legibility
- Body text never exceeds `text-sm` on mobile (14px is the comfort limit for character sheets)
- HP and level display use `text-5xl` or larger
- Section headings use `font-black uppercase` patterns

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

The app follows Tailwind's default spacing scale with 4px increments:
- `p-3` (12px) — Dense card padding
- `p-4` (16px) — Standard card/container padding
- `p-5` (20px) — Generous card padding
- `p-6` (24px) — Modal content padding
- `gap-2` (8px) — Tight element spacing
- `gap-3` (12px) — Standard element spacing
- `gap-4` (16px) — Section spacing
- `gap-6` (24px) — Large section spacing
- `space-y-8` (32px) — Major section separation

### 4.2 Layout Patterns

**Full-screen sheet (Character Sheet / Creator):**
```
┌─────────────────────────────┐
│  Header (sticky)            │  ← safe-top padding
├─────────────────────────────┤
│                             │
│  Scrollable Content         │  ← flex-1 overflow-y-auto
│                             │
├─────────────────────────────┤
│  Tab Bar / Bottom Nav       │  ← fixed bottom, pill-shaped
└─────────────────────────────┘
```

**Horizontal carousel (CreatorSteps class/species selector):**
```
← [gradient fade] [ card ] [ card ] [ card ] [gradient fade] →
  ← snap-x snap-mandatory overflow-x-auto →
```
- Scrollable container with gradient fade overlays at each end
- White/10 gradient direction changes based on theme mode
- Snap scrolling with `snap-x snap-mandatory`

**Modal structure (mobile-bottom-sheet):**
```
───────────────────── backdrop-blur bg-black/60 ──────────────────
  ┌──────────────────────────────────────────────────────────────┐
  │  Header: Close + Title                 MaterialSymbols close │
  ├──────────────────────────────────────────────────────────────┤
  │  Content (scrollable)                                         │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │  Cards, forms, lists...                                 │  │
  │  └─────────────────────────────────────────────────────────┘  │
  ├──────────────────────────────────────────────────────────────┤
  │  Footer: Action buttons / info                                │
  └──────────────────────────────────────────────────────────────┘
  ───────────────────────────── animate-slideUp ──────────────────
```
- Mobile: slides up from bottom (`rounded-t-3xl`)
- Desktop: centered with rounded corners (`sm:rounded-3xl`)

### 4.3 Safe Area Handling

All full-screen layouts account for mobile device notches:
- `.safe-top { padding-top: var(--sat) }` — top notch
- `.safe-bottom { padding-bottom: var(--sab) }` — home indicator
- Tab bars: `bottom-[calc(1rem+env(safe-area-inset-bottom))]`
- Full-screen modals: `pt-[max(0.75rem,env(safe-area-inset-top))]`

### 4.4 Grid Patterns

| Pattern | Columns | Usage |
|---|---|---|
| Ability stats | `grid-cols-6 gap-0.5` | STR/DEX/CON/INT/WIS/CHA |
| Top stats | `grid-cols-5 gap-2` | AC/Init/Spd/Prof/Insp |
| Stat cards | `grid-cols-3 gap-2` | Saving throws, combat stats |
| Character grid | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` | Character list |
| Weapon stats | `grid-cols-2 gap-3` | Weapon properties |
| Resource cards | `grid-cols-3 gap-2` | HD, slots |

---

## 5. Border Radius & Elevation

### 5.1 Radius Scale

| Token | Tailwind Class | Value | Usage |
|---|---|---|---|
| `--border-radius` | `rounded` / `rounded-sm` | 4px | Inputs, stat badges |
| `--border-radius-lg` | `rounded-lg` | 8px | Cards, modals |
| `--border-radius-xl` | `rounded-xl` / `rounded-2xl` | 12-16px | Major cards, panels |
| `custom` | `rounded-3xl` | 24px | Primary CTAs, login card |
| `custom` | `rounded-full` | 9999px | Pill buttons, avatars, tab bars |

### 5.2 Elevation

| Token | Value | Usage |
|---|---|---|
| `--box-shadow` | `0 4px 6px -1px rgba(0,0,0,0.5)` | Card shadows (dark) |
| `--box-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.5)` | Modal/dialog shadows |

In light themes, shadow opacity reduces (e.g., `rgba(0,0,0,0.1)`).

The `.iron-border` utility provides an inset shadow + border glow:
```
box-shadow: inset 0 0 0 1px var(--color-border), 0 0 20px rgba(0, 0, 0, 0.5);
```

---

## 6. Iconography

### 6.1 Icon System

Material Symbols Outlined is the **only** icon library used. Filled by default:
```html
<span class="material-symbols-outlined">icon_name</span>
```
CSS defaults: `font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20`

### 6.2 Icon Size Scale

| Class | Size | Usage |
|---|---|---|
| `.icon-xs` | 0.875rem (14px) | Inline with text |
| `.icon-sm` | 1rem (16px) | Small action icons |
| `.icon-md` | 1.25rem (20px) | Standard icons |
| `.icon-lg` | 1.5rem (24px) | Feature icons |
| `.icon-xl` | 2rem (32px) | Large decorative icons |
| `text-3xl` | 30px | Emphasized icons |
| `text-4xl` | 36px | Status/empty state icons |
| `text-5xl` | 48px | Hero icons |
| `text-6xl` | 60px | Massive decorative icons |
| `text-8xl` | 96px | Empty state/404 graphics |

### 6.3 Icon Container Patterns

Icons inside circular containers:
```
w-10 h-10 rounded-full flex items-center justify-center bg-{color}-500/10 text-{color}-500
```
- Sizes: `size-8` (32px), `size-10` (40px), `size-12` (48px), `w-9 h-9`, `w-16 h-16`
- Background opacity: `bg-{color}/10` with `border border-{color}/20`

### 6.4 Most Common Icons

Navigation & Actions: `close`, `arrow_back`, `check_circle`, `edit_note`, `delete`
Status: `warning`, `error`, `info`, `check_circle`
Combat: `swords`, `shield`, `bolt`, `sprint`, `favorite`, `healing`
Magic: `auto_stories`, `magic_button`, `auto_fix`, `stars`
Items: `backpack`, `inventory`, `search`
Social: `groups`, `forum`, `hub`, `monitoring`
RPG: `casino`, `military_tech`, `whatshot`, `hourglass_bottom`, `bedtime`, `palette`, `logout`

---

## 7. Animation & Motion

### 7.1 Animation Tokens

| Class | Timing | Easing | Usage |
|---|---|---|---|
| `.animate-fadeIn` | 0.3s | ease-out | Overlays, appearing elements |
| `.animate-slideUp` | 0.4s | cubic-bezier(0.16, 1, 0.3, 1) | Modal panels, sheets |
| `.animate-scaleIn` | 0.2s | ease-out | Confirmation dialogs, cards |
| Tailwind `animate-pulse` | — | — | Active rage, loading states |
| Tailwind `animate-spin` | — | — | Loading indicators |

### 7.2 Transition Durations

| Duration | Class | Usage |
|---|---|---|
| 150ms | `transition-all duration-150` | Micro-interactions |
| 200ms | `transition-all duration-200` | Button states |
| 300ms | `transition-all duration-300` | Standard transitions |
| 500ms | `transition-all duration-500` | Card hover effects |
| 700ms | `transition-all duration-700` | HP bar animation |
| 1000ms | `transition-all duration-1000` | Shine sweep effects |

### 7.3 Interaction Patterns

- **Press feedback:** `active:scale-95` or `active:scale-[0.98]` on all clickable elements
- **Hover lift:** Card hover with `hover:shadow-lg` or `hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]`
- **Shine sweep:** Gradient translate across CTA buttons
- **Tab switch:** Active tab icon bounces subtly with Tailwind `animate-bounce-subtle`
- **Modal appearance:** Background fades in (`.animate-fadeIn`), content slides up (`.animate-slideUp`)

---

## 8. Component Design Tokens

### 8.1 Button System

| Variant | Pattern | Key Classes |
|---|---|---|
| Primary CTA | Full-width pill | `w-full py-3 rounded-xl font-bold text-lg bg-primary text-background-dark shadow-lg shadow-primary/30` |
| Gradient action | Themed gradient | `bg-gradient-to-r from-{color}-500 to-{color}-500` — Short rest: amber/orange, Long rest: emerald/green |
| CTA circle | Rounded pill with icon | `rounded-full bg-[#1b1f2e] border border-{color}/20` with inner shine effect |
| Secondary | Subtle background | `bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white` |
| Destructive | Red | `bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30` |
| Icon-only round | Circular icon | `w-{size} h-{size} rounded-full bg-{color}/10 border border-{color}/20 text-{color}` |
| Tab pill | Fixed bottom nav | `rounded-full backdrop-blur-xl p-1.5 flex items-center gap-1.5` |

### 8.2 Card System

| Variant | Background | Border | Radius | Usage |
|---|---|---|---|---|
| Character card | `#1b1f2b` | `.iron-border` | `rounded-xl` | Character list |
| Sheet card | `bg-white dark:bg-surface-dark` | `border-slate-200 dark:border-white/5` | `rounded-2xl` | Combat, inventory |
| Note card | `bg-white dark:bg-surface-dark` | `border-slate-100 dark:border-white/5` | `rounded-2xl` | Notes tab |
| Feature card | `bg-primary/5` | `border-primary/10` | `rounded-xl` | Feats, features |
| Selection card (radio) | Dynamic via `peer` | Border on `checked` | `rounded-2xl` | Class/species selection |
| DM member card | `bg-[#1e293b]` | `border-white/5` | `rounded-2xl` | DM dashboard |

### 8.3 Form Elements

| Element | Border | Radius | Padding | Focus |
|---|---|---|---|---|
| Text input | `border-slate-200 dark:border-white/10` | `rounded-xl` | `px-4 py-3` | `ring-2 ring-primary/50` |
| Select | Same as input | `rounded-xl` | `pl-4 pr-10 py-3` | Same as input |
| Textarea | None (transparent) | None | `pl-3` | No ring (auto-resize) |
| Range slider | `h-2 bg-slate-200 dark:bg-white/10 rounded-full` | Full | — | `accent-amber-500` |
| Toggle | `w-10 h-5 rounded-full` | Full | — | `bg-primary` / `bg-surface-highlight` |
| Radio card | `border-2` | `rounded-2xl` | Dynamic | `border-primary` on checked |

### 8.4 Modal System

| Variant | Mobile | Desktop | Animation |
|---|---|---|---|
| Bottom sheet | `items-end rounded-t-3xl` | `items-center rounded-3xl` | `.animate-slideUp` |
| Centered overlay | Same | `sm:max-w-sm` | `.animate-scaleIn` |
| Full-screen page | `pt-[max(0.75rem,env(safe-area-inset-top))]` | Same | `.animate-fadeIn` |
| Contextual confirm | `max-w-[320px]` | Same | `.animate-scaleIn` |
| Image zoom | `bg-black/90` | Same | Transition |

All modals share: `fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fadeIn`

---

## 9. Theme System Architecture

### 9.1 How Theming Works

1. `ThemeContext` React provider loads saved theme from localStorage
2. Applies all color/typography/shape values as CSS custom properties on `:root`
3. Tailwind references these `var(--color-*)` values throughout
4. Theme can be switched at runtime — instant, no page reload
5. Auto mode follows system `prefers-color-scheme` media query

### 9.2 Theme Data Flow

```
User selects theme → localStorage('dungeon-forge-theme')
  → ThemeContext.setTheme(id)
    → Sets :root style properties
      → All components using var(--color-*) update reactively
```

### 9.3 Adding New Themes

A theme is an `AppTheme` object implementing:
```typescript
interface AppTheme {
  id: ThemeId;
  name: string;
  colors: ThemeColors;      // 16 color tokens
  typography: ThemeTypography;  // 4 tokens
  shape: ThemeShape;           // 6 tokens
  isDark: boolean;
  wcagCompliant: boolean;
}
```

New themes simply need all 16 color values + type/shape tokens, then added to `OFFICIAL_THEMES[]` array.

---

## 10. Accessibility

- All official themes target WCAG 2.2 AA (contrast ratio ≥ 4.5:1)
- High Contrast theme targets WCAG AAA
- ThemeContext includes `validateThemeColors()` which checks contrast ratios
- Focus states use `focus:ring-2 focus:ring-primary/50` on all interactive elements
- Touch targets minimum 44px height (enforced as design practice)
- `prefers-reduced-motion` respected via Tailwind's `motion-safe:` / `motion-reduce:`
- Color is never the only indicator of state (icons + labels always accompany)

---

## 11. Global CSS Utilities

| Utility | Purpose |
|---|---|
| `.leather-bg` | Main canvas background — dark + radial gradient + texture overlay |
| `.gold-shimmer` | Gradient text (blue-to-cyan metallic effect) |
| `.iron-border` | Card container with inset border + shadow glow |
| `.app-title-glow` | Text glow effect for logo/title |
| `.no-scrollbar` | Hide scrollbars but keep scrolling functional |
| `.grimoire-scroll` | Custom blue gradient scrollbar styling |
| `.safe-*` | Safe area insets for device notches |
| `.icon-*` | Icon size variants (xs, sm, md, lg, xl) |
| `.animate-*` | Animation classes (fadeIn, slideUp, scaleIn) |

---

## 12. File Organization

```
/ (root)
├── index.css              # Global CSS + Tailwind + utilities + animations
├── tailwind.config.js      # Tailwind with CSS variable bindings
├── App.tsx                  # App wrapper, view state, auth, sync
├── src/
│   ├── types/theme.ts       # AppTheme, ThemeColors, ThemeTypography interfaces
│   ├── constants/themes.ts  # 5 official theme definitions
│   ├── contexts/ThemeContext.tsx  # Dynamic CSS variable injection
│   ├── components/          # All React components
│   │   ├── ThemeSelector.tsx    # Theme picker UI
│   │   └── ...              # 60+ component files
│   └── hooks/               # Custom hooks (useAuth, useCharacters, useSync)
│       ├── useAuth.ts
│       ├── useCharacters.ts
│       └── useSync.ts
```
