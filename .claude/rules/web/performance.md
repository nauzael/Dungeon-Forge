---
description: "Web performance - Core Web Vitals, bundle budget, loading"
alwaysApply: true
---

# Web Performance - Dungeon Forge

## Core Web Vitals Targets

| Métrica | Target | Dungeon Forge |
|---------|--------|---------------|
| LCP | < 2.5s | Hero character art |
| INP | < 200ms | Click interactions |
| CLS | < 0.1 | No layout shifts |
| FCP | < 1.5s | Initial render |
| TBT | < 200ms | Heavy calculations |

## Bundle Budget

| Type | Budget (gzipped) |
|------|------------------|
| Initial JS | < 300kb |
| CSS | < 50kb |

## Loading Strategy

1. Preload fonts críticos
2. Defer non-critical CSS/JS
3. Dynamic import para libraries pesadas

```typescript
// Lazy load GSAP solo cuando necesario
const loadGSAP = async () => {
  const { gsap } = await import('gsap');
  return gsap;
};
```

## Image Optimization

- Explicit `width` y `height`
- `loading="lazy"` para below-the-fold
- Prefer WebP con fallbacks

## Font Loading

- Max 2 font families
- `font-display: swap`
- Preload solo weights críticos

## Animation Performance

- Animar solo propiedades GPU-friendly (transform, opacity)
- Usar `will-change` narrowly
- Prefer CSS para transiciones simples
- requestAnimationFrame para JS motion

## Performance Checklist

- [ ] Imágenes con dimensiones explícitas
- [ ] No render-blocking resources
- [ ] No layout shifts
- [ ] Cálculos memoizados
- [ ] Lazy loading para components
