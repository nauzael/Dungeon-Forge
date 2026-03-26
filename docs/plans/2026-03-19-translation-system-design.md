# Translation System Design

## Overview

Replace the current MyMemory-only translation system with an offline-first 3-layer architecture for D&D 5e character management app.

## Architecture

```
┌─────────────────────────────────────────┐
│            UI Components                │
├─────────────────────────────────────────┤
│         useTranslation(text)            │
├─────────────────────────────────────────┤
│  Layer 1: Cache (Memory)    ← First     │
│  Layer 2: Static JSON       ← Second    │
│  Layer 3: API (MyMemory)    ← Third     │
└─────────────────────────────────────────┘
```

### Layer Priority
1. **Cache (Memory)**: In-memory Map, fastest, cleared on reload
2. **Static JSON**: Pre-translated EN→ES data bundled with app, zero network
3. **API (MyMemory)**: Fallback for user-generated content, rate-limited

## File Structure

```
Data/translations/es/
├── class_features.json
├── species_traits.json
├── feats.json
├── invocations.json
├── spells.json
└── items.json
```

## Translation Service

### Classes

- `TranslationService` - Main class with 3-layer lookup
- `TranslationCache` - In-memory cache (already exists, will be integrated)

### API

```typescript
translateText(text: string, targetLang: Language): Promise<string>
```

### Flow

```
translate("Rage")
  └─> Cache.get("Rage")?
      ├─ Yes → return cached
      └─ No → StaticJSON.get("Rage")?
          ├─ Yes → cache.set("Rage", result) → return
          └─ No → API.translate("Rage")?
              ├─ Yes → cache.set("Rage", result) → return
              └─ No → return original text
```

## Static JSON Format

```json
{
  "Rage": "Rabia",
  "Unarmored Defense": "Defensa sin armadura",
  "Darkvision": "Visión en la oscuridad"
}
```

## Categories

- `class_features` - Class abilities (Rage, Action Surge, etc.)
- `species_traits` - Species abilities (Darkvision, Keen Senses, etc.)
- `feats` - Feat descriptions
- `invocations` - Warlock invocations
- `spells` - Spell names and descriptions
- `items` - Item names and descriptions

## Implementation Steps

1. Create `Data/translations/es/` directory structure
2. Create `utils/TranslationService.ts` with 3-layer architecture
3. Create `hooks/useTranslation.ts` for React integration
4. Extract and translate all abilities from existing data files
5. Update components to use new hook
6. Remove old translation code if any

## Offline Capability

- App works 100% offline with pre-translated data
- Only reaches API for user-generated content
- No API calls during normal usage of standard D&D content

## Status

- [x] Design approved
- [x] Implementation complete

## Implementation Summary

| Component | Status |
|-----------|--------|
| TranslationService.ts (3-layer) | ✓ |
| useTranslation hook | ✓ |
| class_features.json (~200 traits) | ✓ |
| species_traits.json (~40 traits) | ✓ |
| invocations.json (32 invocations) | ✓ |
| spells.json (~45 spells) | ✓ |
| items.json (mastery properties) | ✓ |
| feats.json | pending (already in Spanish) |
