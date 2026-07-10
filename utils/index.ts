// Validators
export { isValidCharacter, type ValidationResult } from './validators';

// Utilities
export { generateUUID } from './uuid';

// Feature-specific utils
export { getAvailableBeasts, transformIntoBeast, restoreOriginalForm } from './wildShapeUtils';

export {
  calculateMaxUses,
  initializeFeatureUsage,
  getFeatureUsagesForCharacter,
} from './featureUsageCalculator';

export {
  compressCharacterToSnapshot,
  restoreCharacterFromSnapshot,
  calculateLevelResetChanges,
  getSnapshotsForCharacter,
  saveSnapshotForCharacter,
  deleteSnapshot,
} from './levelResetUtils';
