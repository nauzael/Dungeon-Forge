// Barrel file — re-exports everything from firebase/ sub-modules
// This preserves backward compatibility: all existing imports from './utils/firebase' continue to work.
export { auth, firestore, database, isRtdbAvailable, onAuthStateChanged } from './firebase/init';
export { signInWithGooglePopup, signInWithGoogleRedirect } from './firebase/auth';
export {
  saveCharacterToCloud,
  saveCharacterWithRollback,
  fetchCharactersFromCloud,
  fetchDeletedCharacterIds,
  fetchDeletedCharacters,
  restoreCharacter,
  softDeleteCharacter,
  createParty,
  joinParty,
  removeFromParty,
  updatePartyName,
  deleteParty,
  getPartyResources,
  addPartyResource,
  deletePartyResource,
  broadcastCharacterUpdate,
  broadcastFullCharacterUpdate,
  extractVolatileFields,
  removeCharacterFromPartyRTDB,
  broadcastResourceShare,
  broadcastResourceHide,
  updatePartyResourcePersistence,
  uploadResourceImage,
  migrateExistingResourceImages,
  updateResourceThumbnail,
  batchSaveCharacters,
} from './firebase/db';
export { RealtimeSubscription, subscribeWithRetry, subscribeToParty, subscribeToOwnCharacters, subscribeToPartyResources, subscribeToResourceShare } from './firebase/subscriptions';
