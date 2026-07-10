# Dungeon Forge Design System — Usage Guide

Design System package guide for Open Design agents and reviewers.

## Read Order

1. Read this file first to understand the package contract.
2. Read `DESIGN.md` for visual intent, constraints, and anti-patterns.
3. Paste `tokens/tokens.css` into the first artifact `<style>` block before writing component CSS.
4. Use `components/components.manifest.json` for the compact component inventory; open `components/components.html` when exact selectors or states matter.
5. Inspect `preview/` pages when a visual sanity check is useful.

## Design Highlights

- **Visual style:** Dark fantasy, tabletop RPG aesthetic with dungeon-crawler atmosphere
- **Color stance:** Dark backgrounds (`#0F172A`), blue-cyan accents (`#359EFF` / `#9ADBFF`), subtle glow effects
- **Dynamic theming:** 5 official themes via CSS custom properties — instant swap without page reload
- **Mobile-first:** All components designed for mobile web (PWA) with Capacitor iOS/Android
- **Iconography:** Material Symbols Outlined — filled by default (`FILL 1`)
- **Typography:** Spline Sans for headings, Noto Sans for body text
- **Safe area:** `env(safe-area-inset-*)` consistently applied for device notches

## Do

- Preserve the `--color-*`, `--font-*`, `--border-radius-*`, `--box-shadow-*` CSS variable names exactly
- Use `var(--color-primary)` for primary actions and interactive elements
- Use `var(--color-accent)` for decorative highlights and glows
- Apply Material Symbols with `<span class="material-symbols-outlined">icon_name</span>`
- Use `.animate-fadeIn` for appearing elements and `.animate-slideUp` for modals
- Follow the `dark:` prefix convention for theme-aware styles
- Use `safe-top`, `safe-bottom` classes for safe area padding

## Avoid

- Avoid raw hex values outside the `:root` token block — always use CSS variables
- Avoid redefining Tailwind or design-token values independently of `tokens.css`
- Avoid adding new component recipes that are not represented in `components.html` or `DESIGN.md`
- Avoid removing the `FILL 1` font variation setting on Material Symbols — filled icons match the brand style
- Avoid removing backdrop blur from modals — it's a key part of the visual identity
