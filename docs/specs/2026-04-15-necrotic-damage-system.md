# Necrotic Damage System - Design Specification

## Overview

System to track necrotic damage that restricts healing. When a creature takes necrotic damage, it creates a "necrotic cap" that prevents healing from restoring that portion of HP until removed by specific abilities.

## Mechanic Summary

1. Necrotic damage applies normally to current HP
2. Creates a `necroticCap` that reduces maximum HP
3. Healing can restore HP but NOT the necroticCap
4. NecroticCap is removed by specific abilities (Lesser Restoration, Lay On Hands, etc.)

## Data Model

### Character Interface Update

```typescript
interface Character {
  hp: {
    current: number;
    max: number;
    temp: number;
    necroticCap: number; // NEW: reduction due to necrotic damage
  };
}
```

## UI Components

### 1. HP Display (CombatTab)

Shows necrotic cap badge when active:

```
❤️ 70/90 🔮-10
```

- Purple/magenta indicator for necrotic damage
- Shows reduction amount with minus sign
- Updates automatically when necroticCap changes

### 2. Damage/Heal Modal (CombatTab)

New "Necrotic" tab alongside "Damage" and "Heal":

```
┌─────────────────────────────────────────┐
│           Apply Damage                   │
├─────────────────────────────────────────┤
│ [Damage] [Heal] [Necrotic]              │
├─────────────────────────────────────────┤
│ Amount: [____]                         │
├─────────────────────────────────────────┤
│ Current HP: 70/90                       │
│ Necrotic Cap: 10                        │
├─────────────────────────────────────────┤
│ [Cancel]              [Apply]          │
└─────────────────────────────────────────┘
```

When "Necrotic" is selected:
- Damage applies to current HP
- Creates/increments necroticCap
- Shows warning about healing restriction

### 3. Cleanse Button

Appears when necroticCap > 0:

```
┌─────────────────────────────────────────┐
│ 🔮 Necrotic Cap: 10                     │
│ [Cleanse with Lesser Restoration]       │
│ [Cleanse with Lay On Hands]             │
└─────────────────────────────────────────┘
```

Buttons available based on character abilities:
- Paladin: Lay On Hands
- Cleric: Lesser Restoration
- Druid: Lesser Restoration
- Custom abilities from features

## Implementation Steps

### 1. types.ts
- Add `necroticCap: number` to HP interface

### 2. CombatTab.tsx
- Add "Necrotic" tab in damage modal
- Implement necrotic damage logic
- Update HP display to show necrotic cap
- Add cleanse buttons when necroticCap > 0

### 3. RestModal.tsx
- Long rest should NOT remove necroticCap
- Only specific abilities can remove it

### 4. Healing Logic
- Modify healing calculation to respect necroticCap
- Formula: `newHP = Math.min(current + healAmount, max - necroticCap)`

### 5. Feature Integration
- Track when abilities like "Lay On Hands" are used to cleanse
- Consider adding "Cleanse Necrotic" as a feature action

## Edge Cases

1. **Multiple necrotic hits**: Caps stack (10 + 10 = 20 reduction)
2. **Healing over necrotic cap**: Not allowed
3. **Temp HP + Necrotic**: Temp HP absorbs first, then necrotic reduces cap
4. **Level up with necrotic cap**: Max HP increases, necrotic cap remains
5. **Death from necrotic**: If current HP reaches 0, character is unconscious (not dead from necrotic cap)

## Testing Scenarios

1. Take 10 necrotic damage → HP 90/90, cap 10
2. Heal 20 HP → HP 90/90 (cap blocks further healing)
3. Use Lesser Restoration → cap 0, HP 90/100
4. Take 5 more necrotic → cap 5, HP 85/95
