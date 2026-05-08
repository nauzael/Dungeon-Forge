# Feature Usage Tracking System - Design Specification

## Overview

Sistema genérico de tracking de usos para features de clase/subclase con límites de uso (ej: Dreadful Strike = WIS mod por Long Rest).

## Goals

- Tracking de usages para cualquier feature con límite de uso
- Cálculo automático de máximos basados en modificadores
- Soporte para costos alternativos de restauración
- UI integrada en FeaturesTab

## Data Model

### New Types (`types.ts`)

```typescript
export type ResetType = 'long_rest' | 'short_rest' | 'always' | 'never';

export interface ResourceCost {
  resource: string;      // 'ki' | 'psionicEnergyDice' | 'sorceryPoints'
  amount: number;
}

export interface FeatureUsage {
  current: number;
  max: number;
  resetType: ResetType;
  costToRestore?: ResourceCost;
}

export interface FeatureUsageConfig {
  maxFormula: 'WIS' | 'INT' | 'CHA' | 'DEX' | 'CON' | 'level' | 'proficiencyBonus' | '1';
  resetType: ResetType;
  costToRestore?: ResourceCost;
}
```

### Character Interface Addition

```typescript
// In Character interface
featureUsages?: Record<string, FeatureUsage>;
```

### Feature Usage Config Catalog

```typescript
// utils/featureUsageConfig.ts

export const FEATURE_USAGE_CONFIGS: Record<string, FeatureUsageConfig> = {
  // Ranger - Gloom Stalker
  'Dreadful Strike': {
    maxFormula: 'WIS',
    resetType: 'long_rest',
  },
  
  // Ranger - Fey Wanderer
  'Dreadful Strikes': {
    maxFormula: 'WIS',
    resetType: 'long_rest',
  },
  'Misty Wanderer': {
    maxFormula: 'WIS',
    resetType: 'long_rest',
  },
  
  // Rogue - Soulknife
  'Psychic Veil': {
    maxFormula: '1',
    resetType: 'long_rest',
    costToRestore: { resource: 'psionicEnergyDice', amount: 1 },
  },
  
  // Rogue - Scion of the Three
  'Bloodthirst': {
    maxFormula: 'INT',
    resetType: 'long_rest',
  },
  
  // Fighter - Champion
  'Remarkable Athlete': {
    maxFormula: 'proficiencyBonus',
    resetType: 'short_rest',
  },
};
```

## Utility Functions

### Calculator (`utils/featureUsageCalculator.ts`)

```typescript
calculateMaxUses(featureName: string, character: Character): number

initializeFeatureUsage(featureName: string, character: Character): FeatureUsage | null

getFeatureUsagesForCharacter(character: Character): Record<string, FeatureUsage>
```

### Rest Logic Integration (`utils/restLogic.ts`)

```typescript
resetFeatureUsages(character: Character, restType: 'short' | 'long'): Character
// Called during existing rest flow
```

## UI Components

### FeatureUsageCounter Component

**Location:** `components/sheet/features/FeatureUsageCounter.tsx`

**Props:**
```typescript
interface Props {
  featureName: string;
  usage: FeatureUsage;
  onUse: () => void;
  onRestore?: () => void;
  disabled?: boolean;
}
```

**Behavior:**
- Muestra `current/max` con botones "Usar" y "Restaurar"
- Botón "Usar" disabled si `current === 0`
- Botón "Restaurar" visible solo si tiene `costToRestore`

### Integration in FeaturesTab

- Hook existente `groupedFeatures` detecta features con tracking
- Renderiza `<FeatureUsageCounter>` inline con cada feature aplicable
- Botones llaman a handlers que actualizan `featureUsages` en character state

## Implementation Order

1. **types.ts** - Agregar nuevos tipos
2. **utils/featureUsageConfig.ts** - Crear catálogo inicial
3. **utils/featureUsageCalculator.ts** - Funciones de cálculo
4. **utils/restLogic.ts** - Integrar reset en descansos
5. **components/sheet/features/FeatureUsageCounter.tsx** - Componente UI
6. **components/sheet/FeaturesTab.tsx** - Integrar en render
7. **components/SheetTabs.tsx** - Asegurar inicialización en level up

## Edge Cases

- **Level Up:** Recalcular `max` cuando cambian stats
- **New Feature:** Auto-inicializar cuando se desbloquea
- **Cost Restoration:** Validar recursos suficientes antes de restaurar
- **Long Rest:** Resetear todos los `long_rest` usages
- **Short Rest:** Resetear solo `short_rest` usages

## Compatibility

- No rompe campos existentes (`rageUses`, `kiMax`, etc.)
- Sistema legacy puede coexistir o migrarse gradualmente
