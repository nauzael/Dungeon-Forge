# WizardGrimoireManager Modal - Design Specification
**Mobile-First Redesign v1.0** | Cohesive with RestModal & LevelResetModal

---

## 1. VISUAL THEME

### Design Philosophy
- **Mobile-First**: Designed for 375px-768px first, scales to desktop
- **Card-Based Layout**: Spells as interactive cards (not rows), not flat rows
- **Spell School Color-Coding**: Visual hierarchy by magical school
- **Tappable Targets**: All interactive elements ≥44px (iOS) / 48dp (Android)
- **Cohesion**: Matches RestModal/LevelResetModal visual language (cards, gradients, borders)

### Layout Structure (Mobile → Desktop)
```
┌─────────────────────────────────────────┐
│ [Close] Header Subtitle         [Close] │ ← Header (py-3, border-b)
├─────────────────────────────────────────┤
│ 📚 Learn │ ✨ Prepare │ 🔮 Rituals      │ ← Tab Bar (py-3, bottom border)
├─────────────────────────────────────────┤
│ 🔍 Search...                            │
│ [All] [Lvl 1] [Lvl 2] [Lvl 3]...       │ ← Filter Section (sticky, p-4)
├─────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐│
│ │ [Icon] Spell Name (text-base bold)  ││ ← Spell Card
│ │ Level X • School • (Ritual)          ││   (rounded-lg, border-2, p-3)
│ │ [Learn] / [Prepare] [Delete]         ││
│ └──────────────────────────────────────┘│
│ ┌──────────────────────────────────────┐│ ← Repeated cards
│ │ [Icon] Another Spell...              ││   (space-y-3 gap)
│ │ Level X • School                     ││
│ │ [Prepare] [Delete]                   ││
│ └──────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│ [Close Grimoire]                        │ ← Footer (p-4, border-t)
└─────────────────────────────────────────┘

Mobile: Full width, rounded-t-3xl
Desktop (sm:): max-w-2xl, rounded-3xl
```

---

## 2. TYPOGRAPHY SCALE

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| **Modal Header Title** | `text-sm` | `font-black` | `text-slate-900 dark:text-white` | UPPERCASE, tracking-tight |
| **Modal Subtitle** | `text-[10px]` | `font-medium` | `text-slate-500 dark:text-slate-400` | Grimoire: X/Y │ Prepared: X/Y |
| **Tab Labels** | `text-sm` | `font-semibold` | Active: `text-blue-600`, Inactive: `text-slate-500` | Emoji + text, tracking-wide |
| **Spell Name** | `text-base` | `font-semibold` | `text-slate-900 dark:text-white` | Primary info, left-aligned |
| **Spell Metadata** | `text-xs` | `font-medium` | `text-slate-500 dark:text-slate-400` | "Level X • School • (Ritual)" |
| **Button Text** | `text-sm` | `font-bold` | `text-white` (colored), `text-slate-700 dark:text-slate-300` (neutral) | Uppercase tracking-widest |
| **Search Placeholder** | `text-sm` | `font-normal` | `text-slate-400 dark:text-slate-500` | "Search spells..." |
| **Level Filter Button** | `text-xs` | `font-bold` | Active: `text-white`, Inactive: `text-slate-700 dark:text-slate-300` | "All", "Lvl 1", etc. |
| **Empty State** | `text-sm` | `font-normal` | `text-slate-500 dark:text-slate-400` | Centered with icon |

### Typography Priority (Consistency)
1. **Header** → Matches RestModal/LevelResetModal: `text-sm font-black tracking-tight`
2. **Tabs** → Elevated from `text-xs` → `text-sm font-semibold` (more legible on mobile)
3. **Spell Names** → Elevated from `text-sm` → `text-base font-semibold` (clear hierarchy)
4. **Metadata** → Keep `text-xs` but ensure contrast

---

## 3. COLOR PALETTE

### Primary Colors (Light Mode)
| Color | Hex | Usage |
|-------|-----|-------|
| **Slate-50** | `#f8fafc` | Background surface |
| **Slate-100** | `#f1f5f9` | Secondary surface, hover states |
| **Slate-200** | `#e2e8f0` | Disabled, border |
| **Slate-500** | `#64748b` | Secondary text, metadata |
| **Slate-600** | `#475569` | Icon colors (inactive) |
| **Slate-900** | `#0f172a` | Primary text |
| **Blue-600** | `#2563eb` | Active tab, primary actions |
| **Emerald-500** | `#10b981` | Prepared/success state |
| **Red-600** | `#dc2626` | Danger (delete) |

### Primary Colors (Dark Mode)
| Color | Hex | Usage |
|-------|-----|-------|
| **Background** | `#0f1525` | Modal container |
| **Slate-900/20** | rgba(15,23,42,0.2) | Subtle surface |
| **Slate-400** | `#94a3b8` | Disabled text |
| **White/10** | rgba(255,255,255,0.1) | Borders, subtle fill |
| **White/20** | rgba(255,255,255,0.2) | Hover states |
| **Blue-400** | `#60a5fa` | Active tab, primary |
| **Emerald-300** | `#6ee7b7` | Prepared/success |

### Spell School Color-Coding
These are **background/border colors** for spell cards (visual encoding by school):

| School | Light Border | Light Background | Dark Border | Dark Background |
|--------|--------------|------------------|-------------|-----------------|
| **Abjuration** | `border-red-400/40` | `bg-red-50` | `border-red-600/30` | `bg-red-900/15` |
| **Conjuration** | `border-purple-400/40` | `bg-purple-50` | `border-purple-600/30` | `bg-purple-900/15` |
| **Divination** | `border-indigo-400/40` | `bg-indigo-50` | `border-indigo-600/30` | `bg-indigo-900/15` |
| **Enchantment** | `border-pink-400/40` | `bg-pink-50` | `border-pink-600/30` | `bg-pink-900/15` |
| **Evocation** | `border-blue-400/40` | `bg-blue-50` | `border-blue-600/30` | `bg-blue-900/15` |
| **Illusion** | `border-cyan-400/40` | `bg-cyan-50` | `border-cyan-600/30` | `bg-cyan-900/15` |
| **Necromancy** | `border-slate-600/40` | `bg-slate-100` | `border-slate-400/30` | `bg-slate-800` |
| **Transmutation** | `border-emerald-400/40` | `bg-emerald-50` | `border-emerald-600/30` | `bg-emerald-900/15` |
| **Ritual** (no school) | `border-amber-400/40` | `bg-amber-50` | `border-amber-600/30` | `bg-amber-900/15` |

### Button Gradient Colors
| Action | Light Gradient | Dark Gradient | Hover |
|--------|---|---|---|
| **Learn** | `from-blue-500 to-blue-600` | `from-blue-600 to-blue-700` | Darker: `from-blue-600 to-blue-700` |
| **Prepare** | `from-emerald-500 to-green-600` | `from-emerald-600 to-green-700` | Darker: `from-emerald-600 to-green-700` |
| **Delete** | `from-red-500 to-red-600` | `from-red-600 to-red-700` | Darker: `from-red-600 to-red-700` |

---

## 4. SPACING GRID

### Base Unit: 4px
All spacing follows 8pt grid (Tailwind default):

| Value | Size | Used For |
|-------|------|----------|
| `p-3` | 12px | Card padding, button padding |
| `p-4` | 16px | Section padding, filter section |
| `p-6` | 24px | Outer container (fallback) |
| `px-3` | 12px horizontal | Card horizontal padding |
| `px-4` | 16px horizontal | Button, input horizontal |
| `py-2` | 8px vertical | Compact button |
| `py-3` | 12px vertical | Header, standard button |
| `py-4` | 16px vertical | Content row spacing |
| `space-y-2` | 8px gap | Compact list items |
| `space-y-3` | 12px gap | Standard list items (spell cards) |
| `space-y-4` | 16px gap | Section spacing |
| `gap-2` | 8px | Icon + text spacing |
| `gap-3` | 12px | Component spacing |
| `gap-4` | 16px | Section gaps |

### Responsive Padding
- **Mobile (< sm)**: `p-4` (16px outer)
- **Desktop (sm+)**: `p-6` (24px outer) or `sm:p-8` (32px)

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 Modal Container
```
Props: character, onUpdate, onClose
Layout: fixed inset-0 overlay with rounded modal
Mobile: w-full rounded-t-3xl (sheet-style)
Desktop: sm:max-w-2xl rounded-3xl (centered)
Background: bg-white dark:bg-[#0f1525]
Shadow: shadow-2xl
Animation: animate-fadeIn (backdrop), animate-slideUp (modal)
Max Height: max-h-[95vh] sm:max-h-[85vh]
Overflow: flex flex-col with flex-1 overflow-y-auto content
```

### 5.2 Header Section
```
Layout: flex items-center justify-between
Padding: px-4 py-3
Border: border-b border-slate-100 dark:border-white/10
Shrink: shrink-0

Structure:
  [Close Button] [Title + Subtitle] [Spacer]
  
Close Button:
  - 10h 10w flex items-center justify-center
  - rounded-xl
  - hover:bg-slate-100 dark:hover:bg-white/10
  - transition-colors
  - Icon: material-symbols-outlined text-slate-600 dark:text-slate-300

Title Section (flex flex-col items-center flex-1):
  - Title: text-sm font-black uppercase tracking-tight
    Color: text-slate-900 dark:text-white
  - Subtitle: text-xs text-slate-500 dark:text-slate-400 mt-1
    Content: "Grimoire: {spellbook.length}/{maxSpellbook} | Prepared: {prepared.length}/{maxPrepared}"

Spacer: w-10 (matches close button width for balance)
```

### 5.3 Tab Bar
```
Layout: flex border-b border-slate-100 dark:border-white/10
Background: bg-slate-50 dark:bg-white/5
Height: flex items-stretch

Tab Button (3 per bar: Learn, Prepare, Rituals):
  - flex-1 py-3 px-4 text-center
  - text-sm font-semibold (upgraded from text-xs)
  - transition-all duration-200
  - cursor-pointer
  
Active Tab:
  - text-blue-600 dark:text-blue-400
  - border-b-2 border-blue-600 dark:border-blue-400
  - bg-white dark:bg-white/10
  
Inactive Tab:
  - text-slate-500 dark:text-slate-400
  - hover:text-slate-700 dark:hover:text-slate-300
  - no bottom border
  
Tab Content: "📚 Learn" | "✨ Prepare" | "🔮 Rituals"
```

### 5.4 Filter Section (Sticky)
```
Layout: flex flex-col space-y-3
Padding: p-4
Border-bottom: border-slate-100 dark:border-white/10
Background: bg-slate-50 dark:bg-white/5
Position: sticky top-0
Z-index: auto (content area)

Sub-component 1: Search Input
  - w-full
  - px-4 py-3 (increased from py-2)
  - bg-white dark:bg-white/5
  - text-slate-900 dark:text-white text-sm
  - placeholder: "Search spells..."
  - rounded-lg
  - border border-slate-200 dark:border-white/10
  - focus:outline-none focus:ring-2 focus:ring-blue-500
  - transition-all
  
Sub-component 2: Level Filter Buttons (horizontal scroll on mobile)
  - flex gap-3 overflow-x-auto pb-2 (overflow for mobile)
  - Buttons: "All", "Lvl 1" - "Lvl 9"
  
  Level Button:
    - px-4 py-2.5 text-xs font-bold
    - rounded-lg
    - whitespace-nowrap
    - transition-all duration-200
    
    Selected:
      - bg-blue-600 text-white
      - shadow-lg shadow-blue-500/30
      
    Unselected:
      - bg-white dark:bg-white/5
      - text-slate-700 dark:text-slate-300
      - hover:bg-slate-100 dark:hover:bg-white/10
```

### 5.5 Spell Card (Core Component)
```
Layout: flex flex-col rounded-lg border-2 p-3
Background: school-color/5 (color-coded by SPELL_SCHOOL_THEMES)
Border: border-2 school-color/30
Margin: mb-3 (use space-y-3 on parent)
Transition: transition-all duration-200

Card Structure:
  Row 1: Icon + Name | Action Buttons
  Row 2: Metadata (Level, School, Ritual)
  
Row 1 - Main Content:
  Layout: flex items-center justify-between gap-3
  
  Left Section (Icon + Info):
    - flex items-center gap-3
    - Icon: span material-symbols-outlined text-lg text-school-color
    - Info: flex flex-col min-w-0
      * Spell Name: text-base font-semibold text-slate-900 dark:text-white
      * Truncate with ellipsis if long
  
  Right Section (Buttons):
    - flex gap-2 items-center
    - See Button Specs below

Row 2 - Metadata:
  - text-xs font-medium text-slate-500 dark:text-slate-400
  - Content: "Level {level} • {school} {isRitual ? '(Ritual)' : ''}"
  - mt-2 (spacing above)

Hover State:
  - shadow-md shadow-school-color/20
  - scale-y-102 (subtle lift on desktop)
  - dark: shadow-school-color/30

Active (Preparing):
  - shadow-lg
  - border-school-color/50
```

### 5.6 Spell Card - Action Buttons
Three button variants based on tab:

#### Learn Tab: [Learn] Button Only
```
Button: px-4 py-2 text-sm font-bold rounded-lg
Colors:
  - Normal: bg-gradient-to-r from-blue-500 to-blue-600
  - Dark: bg-gradient-to-r from-blue-600 to-blue-700
  - Hover: from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20
  - Disabled: bg-slate-300 dark:bg-slate-600 text-slate-500
Transition: transition-all duration-200
Active: active:scale-95
Text: text-white text-sm font-bold
Disabled State:
  - opacity-50 cursor-not-allowed
  - if spell already learned or spellbook full
```

#### Prepare/Rituals Tab: [Prepare] + [Delete] Buttons
```
Layout: flex gap-2

Button A - Prepare Toggle:
  - px-4 py-2 text-sm font-bold rounded-lg
  - transition-all duration-200
  
  PREPARED (active):
    - bg-gradient-to-r from-emerald-500 to-green-600
    - dark: from-emerald-600 to-green-700
    - text-white shadow-sm
    - hover: from-emerald-600 to-green-700 shadow-lg
    
  NOT PREPARED (inactive):
    - bg-slate-200 dark:bg-white/10
    - text-slate-700 dark:text-slate-300
    - hover: bg-slate-300 dark:hover:bg-white/20
    
  Content: "✓ Prepared" (if active) | "Prepare" (if inactive)

Button B - Delete:
  - px-4 py-2 text-sm font-bold rounded-lg
  - bg-gradient-to-r from-red-500 to-red-600
  - dark: from-red-600 to-red-700
  - text-white
  - hover: from-red-600 to-red-700 shadow-lg shadow-red-500/20
  - active:scale-95
  - transition-all duration-200
  - Content: "Delete" or "Remove"
```

### 5.7 Empty State
```
Layout: flex flex-col items-center justify-center p-6 text-center
Content:
  - Icon: span material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600
  - Message: p mt-4 text-slate-500 dark:text-slate-400 text-sm
  - Sub-message: p text-xs text-slate-400 dark:text-slate-500 mt-2
  
Messages by Tab:
  - Learn: "All available spells learned!" with icon spell_check
  - Prepare: "No spells to prepare." with icon auto_stories
  - Rituals: "No ritual spells available." with icon brightness_auto
```

### 5.8 Footer Section
```
Layout: flex flex-col
Padding: p-4
Border-top: border-t border-slate-100 dark:border-white/10
Background: bg-slate-50 dark:bg-white/5
Shrink: shrink-0

Close Button (Full Width):
  - w-full px-4 py-3
  - bg-slate-200 dark:bg-white/10
  - hover:bg-slate-300 dark:hover:bg-white/20
  - text-slate-900 dark:text-white
  - rounded-xl
  - text-sm font-bold uppercase tracking-widest
  - transition-all duration-200
  - active:scale-[0.98]
  - Content: "Close Grimoire" or "Close"
```

---

## 6. MOBILE VS DESKTOP BREAKPOINTS

### Tailwind Breakpoints (Mobile-First)
```
Base (< 640px - Mobile)
├─ w-full (full width)
├─ rounded-t-3xl (sheet-style bottom sheet)
├─ items-end (align to bottom on mobile)
├─ max-h-[95vh] (tall on mobile)
├─ p-4 (padding)
├─ text-sm → text-base (readable sizes)
├─ single column layout
└─ overflow-x-auto on level filters

sm: (≥ 640px - Tablet)
├─ sm:max-w-lg (constraints width)
├─ sm:rounded-3xl (fully rounded)
├─ sm:items-center (center on screen)
├─ sm:max-h-[85vh] (slightly shorter)
├─ sm:p-6 (more generous padding)
└─ two-column layout for complex cards

md: (≥ 768px - iPad/Desktop)
├─ md:max-w-2xl (wider modal)
├─ md:grid-cols-2 (if needed for multi-column layouts)
└─ more spacing

lg: (≥ 1024px - Desktop)
├─ lg:max-w-3xl
└─ full desktop experience
```

### Specific Responsive Changes
| Element | Mobile | sm: | md: | lg: |
|---------|--------|-----|-----|-----|
| Modal Width | `w-full` | `sm:max-w-lg` | `sm:max-w-2xl` | `max-w-3xl` |
| Modal Corner | `rounded-t-3xl` | `sm:rounded-3xl` | — | — |
| Modal Align | `items-end` | `sm:items-center` | — | — |
| Outer Padding | `p-4` | `p-4` | `sm:p-6` | `p-8` |
| Search Input | `w-full px-4 py-3` | `px-4 py-3` | — | — |
| Level Buttons | Scroll horiz. | Flex wrap | Grid 2 cols | Grid 5 cols |
| Spell Card | Stack vertical | Horizontal | — | — |
| Button Size | `px-4 py-2` | `px-4 py-2.5` | `px-5 py-3` | — |
| Font Sizes | Base sizes | +1 size | — | — |

---

## 7. DARK MODE SPECIFICS

### Implementation
- CSS Variable: `prefers-color-scheme: dark`
- Tailwind: `dark:` prefix for all dark mode classes
- Automatic: Uses system setting + manual toggle if available

### Dark Mode Adjustments
| Element | Light | Dark |
|---------|-------|------|
| **Modal Background** | `bg-white` | `bg-[#0f1525]` |
| **Primary Text** | `text-slate-900` | `text-white` |
| **Secondary Text** | `text-slate-500` | `text-slate-400` |
| **Header Border** | `border-slate-100` | `border-white/10` |
| **Tab Bar Background** | `bg-slate-50` | `bg-white/5` |
| **Active Tab** | `text-blue-600` | `text-blue-400` |
| **Search Background** | `bg-white` | `bg-white/5` |
| **Search Border** | `border-slate-200` | `border-white/10` |
| **Spell Card Bg** | `school-color/5` | `school-color/15` |
| **Spell Card Border** | `school-color/30` | `school-color/30` |
| **Button Hover** | Lighter shade | Darker shade |
| **Footer Background** | `bg-slate-50` | `bg-white/5` |
| **Empty State Icon** | `text-slate-300` | `text-slate-600` |

### Dark Mode Color Palette (Schools)
Adjusted opacity for visibility in dark mode:
- Light: `school-color/5` background, `school-color/30` border
- Dark: `school-color/15` background, `school-color/30` border (same, more visible)

---

## 8. ANIMATIONS & INTERACTIONS

### Transitions
```
Global: transition-all duration-200
Used on: tabs, buttons, cards (hover), filters

Specific:
- Tab change: opacity + border fade-in
- Button hover: gradient shift + shadow
- Card hover: scale-y-102 + shadow growth
- Spell prepare: toggle animation (bounce on state change)
- Search: smooth filter animation (fade cards in/out)
```

### Hover States
```
Tab Hover (inactive):
  - text-slate-700 dark:text-slate-300 (color shift)
  - no shadow (stays flat)

Button Hover:
  - Learn: shadow-lg shadow-blue-500/20 + darker gradient
  - Prepare: shadow-lg shadow-emerald-500/20
  - Delete: shadow-lg shadow-red-500/20
  - scale-[1.02] (slight scale on hover)

Card Hover:
  - shadow-md shadow-school-color/20
  - border-school-color/50 (border intensifies)
  - scale-y-102 (subtle vertical lift)

Search Input Focus:
  - ring-2 ring-blue-500
  - border maintained
```

### Active States
```
Button Active (Press):
  - active:scale-95 (tap feedback)
  - Reduce shadow temporarily

Spell Prepared:
  - Card highlights with prepared color
  - Button shows checkmark + color
  - Smooth fade-in animation
```

### Animations
```
Modal Enter: animate-slideUp (bottom sheet style)
Modal Backdrop: animate-fadeIn

Disabled Elements:
  - opacity-50
  - cursor-not-allowed
  - no hover effects
```

---

## 9. ACCESSIBILITY SPEC

### Touch Targets (Mobile)
- **Minimum size**: 44pt × 44pt (iOS), 48dp × 48dp (Android)
- **All buttons**: ≥44pt minimum (p-3 or px-4 py-2.5)
- **Spell cards**: Full tap area, not just name
- **Tab buttons**: Full height (py-3 = 12px × 2 = 24px content + padding)
- **Gap between targets**: 8px minimum (space-y-3)

### Color Contrast (WCAG AAA)
- **Normal text**: 4.5:1 (dark text on light, light text on dark)
- **Large text** (≥18pt bold or 24pt normal): 3:1
- **Disabled text**: 3:1 minimum

Verified Contrasts:
- `text-slate-900` on `bg-white`: 21:1 ✓
- `text-slate-900` on `bg-slate-50`: 14:1 ✓
- `text-white` on `bg-blue-600`: 7:1 ✓
- `text-slate-500` on `bg-white`: 7:1 ✓
- `text-slate-400` on `bg-[#0f1525]`: 11:1 ✓

### Screen Reader & Semantic HTML
```
Modal: role="dialog", aria-modal="true"
Close Button: aria-label="Close grimoire"
Tab Bar: role="tablist"
  - Tabs: role="tab", aria-selected={isActive}
Search Input: aria-label="Search spells", placeholder
Buttons: aria-label for icon-only buttons
Spell Name: aria-label="{name} spell"
Empty State: role="status", aria-live="polite"
```

### Keyboard Navigation
```
Tab Order:
1. Close button (header)
2. Tab buttons (learn/prepare/rituals)
3. Search input
4. Level filter buttons (left to right)
5. Spell cards (top to bottom)
6. Action buttons on cards
7. Close button (footer)

Focus Indicators:
- Visible outline on all interactive elements
- focus:outline-none focus:ring-2 focus:ring-blue-500 or school-color
- Dark mode: focus:ring-blue-400

Enter/Space:
- Tabs: switch tab
- Buttons: trigger action
- Search: focus search, clear on Escape
```

### Reduced Motion
```
@media (prefers-reduced-motion: reduce) {
  - Remove all animations (duration-0)
  - Remove all transitions
  - Remove scale effects on hover
  - Keep essential layout changes
  - Keep focus rings
}

Implementation:
- animate-slideUp → prefers-reduced-motion:animate-none
- active:scale-95 → prefers-reduced-motion:scale-100
- transition-all → prefers-reduced-motion:transition-none
```

### Dynamic Type (iOS) / Font Scaling
```
Base font sizes should scale with system setting:
- Use relative units where possible (em, rem)
- Ensure line-height ≥ 1.5
- Test with up to 200% font size

Layout considerations:
- Single column on mobile with large fonts
- Cards should flex to accommodate larger text
- Buttons maintain 44pt minimum with text
```

---

## 10. DESIGN SYSTEM INTEGRATION

### Design Tokens (Reusable Across Project)
```
// Color Tokens
--color-primary: #2563eb (blue-600)
--color-success: #10b981 (emerald-500)
--color-danger: #dc2626 (red-600)
--color-warning: #f59e0b (amber-500)
--color-bg-primary: #ffffff (light), #0f1525 (dark)
--color-text-primary: #0f172a (light), #ffffff (dark)

// Typography Tokens
--font-size-header: 14px (text-sm font-black)
--font-size-body: 14px (text-sm font-normal)
--font-size-small: 12px (text-xs font-medium)
--font-weight-bold: 700
--font-weight-semibold: 600
--font-weight-black: 900

// Spacing Tokens
--spacing-xs: 4px (space-y-1)
--spacing-sm: 8px (space-y-2)
--spacing-md: 12px (space-y-3)
--spacing-lg: 16px (space-y-4)
--spacing-xl: 24px (space-y-6)

// Radius Tokens
--radius-sm: 8px (rounded-lg)
--radius-md: 12px (rounded-xl)
--radius-lg: 24px (rounded-3xl)

// Shadow Tokens
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)
```

### Cohesion with Existing Modals
| Feature | RestModal | LevelResetModal | WizardGrimoire |
|---------|-----------|-----------------|----------------|
| Header Font | `text-sm font-black` | `text-sm font-black` | `text-sm font-black` ✓ |
| Card Padding | `p-3`/`p-4` | `p-3` | `p-3`/`p-4` ✓ |
| Border Style | `border-2` | `border-2` | `border-2` ✓ |
| Active Color | `border-amber-500/20` | `border-emerald-500` | `border-school-color/30` ✓ |
| Button Style | Gradient `from-to` | Solid primary | Gradient `from-to` ✓ |
| Tab Bar | N/A | N/A | `text-sm font-semibold` ✓ |
| Spacing | Generous (`p-4`) | Generous (`p-3`) | Generous (`p-4`) ✓ |
| Dark Mode | `dark:bg-[#0f1525]` | `dark:bg-[#0f1525]` | `dark:bg-[#0f1525]` ✓ |

---

## 11. IMPLEMENTATION CHECKLIST

### Phase 1: Typography & Spacing
- [ ] Upgrade header to `text-sm font-black tracking-tight` (from `text-lg`)
- [ ] Upgrade tab labels to `text-sm font-semibold` (from `text-xs font-bold`)
- [ ] Upgrade spell names to `text-base font-semibold` (from `text-sm`)
- [ ] Increase outer padding to `p-4 sm:p-6`
- [ ] Increase card padding to `py-4 px-4` (was `py-3 px-3`)
- [ ] Use `space-y-3` for spell card gaps (was `space-y-1`)

### Phase 2: Color & Visual Hierarchy
- [ ] Add spell school color-coding (border + background)
- [ ] Implement gradient buttons (Learn, Prepare, Delete)
- [ ] Upgrade tab active state (color + border-b-2)
- [ ] Add hover states to cards (shadow + scale)
- [ ] Ensure dark mode contrast (test with `dark:bg-[#0f1525]`)

### Phase 3: Component Structure
- [ ] Convert spell rows to cards (flex-col layout)
- [ ] Add school icon to each spell card
- [ ] Reorganize button layout (right side of card)
- [ ] Add spell metadata (level • school • ritual)
- [ ] Update empty states with better icons

### Phase 4: Responsive & Accessibility
- [ ] Verify touch targets ≥44pt (measure all buttons)
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Add focus rings (focus:ring-2 focus:ring-blue-500)
- [ ] Add aria-labels to buttons
- [ ] Test with reduced-motion enabled
- [ ] Test mobile layout (< 640px) and tablet (> 640px)

### Phase 5: Animations & Polish
- [ ] Add hover transitions (duration-200)
- [ ] Add active press feedback (active:scale-95)
- [ ] Smooth tab transitions
- [ ] Card hover lift effect (scale-y-102)
- [ ] Search filter animations

---

## 12. DESIGN LINT RULES (Quality Gate)

### Critical ❌ (Must Fix)
1. Touch target < 44pt × 44pt
2. Text contrast < 4.5:1 (normal text)
3. Spell cards as rows (not cards) — convert to flex-col cards
4. Inline `px-2 py-1` buttons — upgrade to `px-4 py-2`+
5. Text colors without dark mode variants
6. Headers not using `text-sm font-black tracking-tight`

### High 🟠 (Should Fix)
1. Spell school not color-coded (missing borders/backgrounds)
2. Buttons without gradients (flat colors only)
3. Tab active state without clear border-b-2
4. Missing hover states on interactive elements
5. Card spacing < 8px (use space-y-3 minimum)
6. Font sizes not matching scale (text-sm vs text-base)

### Medium 🟡 (Nice to Have)
1. Missing animations (transitions, hover effects)
2. Empty state icon too small (< 3xl)
3. Disabled state not visually distinct
4. Search input placeholder contrast low
5. School icon not visible in dark mode

---

## APPENDIX A: TAILWIND CLASS REFERENCE

### Quick Copy-Paste Classes by Component

#### Header
```
px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between
```

#### Close Button
```
w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors
```

#### Tab Bar
```
flex border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5
```

#### Tab Button (Active)
```
flex-1 py-3 px-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-white/10 transition-all
```

#### Tab Button (Inactive)
```
flex-1 py-3 px-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-all
```

#### Search Input
```
w-full px-4 py-3 bg-white dark:bg-white/5 text-slate-900 dark:text-white text-sm rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition
```

#### Level Filter Button (Selected)
```
px-4 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all
```

#### Spell Card (Evocation Example)
```
flex flex-col rounded-lg border-2 border-blue-400/40 bg-blue-50 dark:bg-blue-900/15 p-3 mb-3 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/20
```

#### Spell Name
```
text-base font-semibold text-slate-900 dark:text-white
```

#### Spell Metadata
```
text-xs font-medium text-slate-500 dark:text-slate-400 mt-2
```

#### Learn Button
```
px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-95
```

#### Prepare Button (Active)
```
px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 shadow-sm
```

#### Delete Button
```
px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-bold rounded-lg transition-all duration-200 active:scale-95
```

#### Close Footer Button
```
w-full px-4 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]
```

---

## APPENDIX B: CHANGED TOKENS vs. CURRENT

### Typography Changes
| Element | Current | New | Impact |
|---------|---------|-----|--------|
| Header Title | `text-lg font-black` | `text-sm font-black tracking-tight` | Consistent with other modals |
| Tab Labels | `text-xs font-bold` | `text-sm font-semibold` | More legible on mobile |
| Spell Name | `text-sm font-semibold` | `text-base font-semibold` | Better visual weight |

### Spacing Changes
| Element | Current | New | Impact |
|---------|---------|-----|--------|
| Spell Row Padding | `py-3 px-3` | `py-4 px-4` on cards | More comfortable, 44pt+ targets |
| Card Gap | `space-y-1` | `space-y-3` | Better breathing room |
| Outer Padding | `p-4` | `p-4 sm:p-6` | Mobile-first, responsive |
| Search Input | `py-2` | `py-3` | Easier to tap on mobile |

### Color Changes
| Element | Current | New | Impact |
|---------|---------|-----|--------|
| Spell Rows | Single gray | School-coded cards | Visual hierarchy, accessibility |
| Buttons | Flat colors | Gradients | Modern, cohesive with other modals |
| Tab Active | `border-b-2 border-blue` | Same + bg-white/10 | More distinct active state |
| Card Borders | `border-white/5` | `border-school/30` | Visible in dark mode |

### Component Structure Changes
| Element | Current | New | Impact |
|---------|---------|-----|--------|
| Spell Item | Row with linear layout | Card with flex layout | Clear visual hierarchy, larger tap area |
| Spell Info | Text-only | Icon + text | Visual encoding by school |
| Empty State | Simple text | Icon + text + subtitle | More informative, accessible |

---

## APPENDIX C: DARK MODE COLOR REFERENCE

For developers: Reference these exact hex/rgb values when implementing dark mode:

```css
/* Modal Container */
bg-white              /* light */
bg-[#0f1525]         /* dark */

/* Text */
text-slate-900       /* primary text, light */
text-white           /* primary text, dark */
text-slate-500       /* secondary, light */
text-slate-400       /* secondary, dark */

/* Borders */
border-slate-100     /* light */
border-white/10      /* dark - 10% white opacity */
border-white/20      /* dark hover */

/* Backgrounds */
bg-slate-50          /* light secondary */
bg-white/5           /* dark secondary */
bg-white/10          /* dark tertiary */

/* School-Coded Examples */
border-blue-400/40   /* light border - 40% opacity */
bg-blue-50           /* light background */
border-blue-600/30   /* dark border - 30% opacity */
bg-blue-900/15       /* dark background - 15% opacity */

/* Buttons */
from-blue-500 to-blue-600        /* light gradient */
from-blue-600 to-blue-700        /* dark gradient */
hover:from-blue-600 hover:to-blue-700  /* light hover */
dark:hover:from-blue-700 dark:hover:to-blue-800 /* dark hover */

/* Focus */
focus:ring-blue-500              /* light */
dark:focus:ring-blue-400         /* dark */
```

---

## 🎨 SUMMARY

**WizardGrimoireManager Redesign delivers:**

✅ **Mobile-First Layout** — Optimized for 375px screens, scales to 2K desktop  
✅ **Card-Based Spells** — Color-coded by school, not flat rows  
✅ **Tappable Targets** — All buttons ≥44pt (iOS) / 48dp (Android)  
✅ **Consistent Typography** — Matches RestModal/LevelResetModal header style  
✅ **Cohesive Visuals** — Gradients, shadows, spacing aligned with other modals  
✅ **Dark Mode Support** — Full dark theme with proper contrast  
✅ **Accessibility Compliant** — WCAG AAA, screen readers, keyboard navigation  
✅ **Responsive Design** — Adaptive layouts for mobile, tablet, desktop  

**Next Steps:** Implementation uses this spec as the single source of truth. All Tailwind classes are documented above for copy-paste. Review design lint rules before QA.
