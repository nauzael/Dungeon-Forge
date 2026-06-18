import React, { useState, useEffect, useRef, Suspense, lazy, useCallback } from 'react';
// Deploy Trigger: Syntax verification commit
import {
  Character,
  ViewState,
  SharedResourceEvent,
  OTAUpdate,
  VersionJsonResponse,
  CharacterWithOwner,
} from './types';
import { MOCK_CHARACTERS } from './constants';
import CharacterList from './components/CharacterList';
import Login from './components/Login';
import Toast from './src/components/Toast';
import { migrateCharacters } from './utils/characterMigrations';
import { isValidCharacter } from './src/utils/validators';
import { generateUUID } from './utils/uuid';
import { useResponsive } from './hooks/useResponsive';
import {
  auth,
  onAuthStateChanged,
  saveCharacterToCloud,
  saveCharacterWithRollback,
  fetchCharactersFromCloud,
  subscribeWithRetry,
  broadcastCharacterUpdate,
  softDeleteCharacter,
  subscribeToOwnCharacters,
  subscribeToPartyResources,
  batchSaveCharacters,
  firestore,
  removeCharacterFromPartyRTDB,
} from './utils/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SyncProvider, useSyncStatus, SyncContextType } from './src/contexts/SyncContext';
import SyncToast from './src/components/SyncToast';

const CreatorSteps = lazy(() => import('./components/CreatorSteps'));
const SheetTabs = lazy(() => import('./components/SheetTabs'));
const DMDashboard = lazy(() => import('./components/DMDashboard'));


const isObsoleteSupabaseId = (id: string | undefined | null): boolean => {
  if (!id) return false;
  return id.includes('-') && id.length === 36;
};

const AppContent: React.FC<{ syncStatus: SyncContextType }> = ({ syncStatus }) => {
  // 🚀 V1.6 VERIFICATION MARKER - New OAuth popup flow
  console.log('[V1.6] 🚀 AppContent initialized - NEW POPUP FLOW ACTIVE');

  const [view, setView] = useState<ViewState>('list');
  const [sharedResource, setSharedResource] = useState<SharedResourceEvent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [showSyncFeedback, setShowSyncFeedback] = useState(false);
  const syncFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Show sync indicator and auto-hide after `delay` ms of inactivity */
  const showSyncFor = (ms: number) => {
    setShowSyncFeedback(true);
    if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);
    syncFeedbackTimerRef.current = setTimeout(() => {
      setShowSyncFeedback(false);
      setSyncMessage('');
      syncFeedbackTimerRef.current = null;
    }, ms);
  };
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<OTAUpdate | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Responsive hook for landscape/portrait detection
  const { orientation } = useResponsive();
  const isLandscape = orientation === 'landscape';

  // Auto-Restart when update is read
  useEffect(() => {
    if (updateAvailable) {
      const timer = setTimeout(async () => {
        try {
          localStorage.setItem('app_version', updateAvailable.version);
        } catch (e) {
          console.error('Failed to save app version:', e);
        }
        await CapacitorUpdater.set({ id: (updateAvailable.payload as { id: string }).id });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable]);

  // Cleanup ref for appStateChange listener
  const appStateListenerRef = React.useRef<{ remove: () => void } | null>(null);

  // Expose checkForUpdates to UI via ref (for force-update button)
  const checkForUpdatesRef = React.useRef<((force?: boolean) => Promise<void>) | null>(null);

  // Force-update button loading state
  const [isForceChecking, setIsForceChecking] = useState(false);

  // OTA rate-limit guard: minimum 30 min between checks to avoid Capgo 429
  const OTA_MIN_INTERVAL_MS = 30 * 60 * 1000;
  const otaLastCheckKey = 'df_ota_last_check';
  const otaBackoffKey = 'df_ota_backoff';
  const otaNextCheckKey = 'df_ota_next_check';

  // Monitor Auth Changes
  useEffect(() => {
    // Limpieza preventiva de sesiones obsoletas de Supabase
    try {
      const storedSession = localStorage.getItem('df_session');
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed && parsed.id && isObsoleteSupabaseId(parsed.id)) {
          console.warn(
            '[Auth] Sesión obsoleta de Supabase detectada en localStorage. Limpiando para forzar login de Firebase.'
          );
          localStorage.removeItem('df_session');
          localStorage.removeItem('df_local_mode');
        }
      }
    } catch (e) {
      console.error('Failed to validate initial df_session:', e);
    }

    // Check if local mode is active
    try {
      const localModeStr = localStorage.getItem('df_local_mode');
      if (localModeStr === 'true') {
        console.log('[LocalMode] Local development mode activated');
        setIsLocalMode(true);
        // Generate a valid UUID for local dev mode instead of hardcoded string
        const devUUID = generateUUID();
        setUser({ name: 'Local Developer', id: devUUID });
        setIsAuthenticated(true);
        return; // Skip auth
      }
    } catch (e) {
      console.error('Failed to check local mode:', e);
    }

    // Check initial session via Firebase Auth
    if (auth?.currentUser) {
      const currentUser = auth.currentUser;
      setUser({ name: currentUser.email || 'Adventurer', id: currentUser.uid });
      setIsAuthenticated(true);
      try {
        localStorage.setItem(
          'df_session',
          JSON.stringify({ user: currentUser.email, id: currentUser.uid })
        );
      } catch (e) {
        console.error('Failed to save session:', e);
      }
    }

    // Handle deep links from Capacitor (Android/iOS) to catch OAuth redirects
    if (Capacitor.getPlatform() !== 'web') {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = event.url;
        console.log('[OAuth] Deeplink received:', url.substring(0, 80) + '...');

        // If the URL contains a hash with a session or access token, pass it to window so Firebase can parse it
        if (url.includes('access_token=') || url.includes('refresh_token=')) {
          const params = url.split('#')[1] || url.split('?')[1];
          console.log('[OAuth] Found tokens, parameters extracted:', !!params);

          // Manually replace URL and force reload so Firebase onAuthStateChanged initializes immediately
          if (params) {
            console.log('[OAuth] Setting window.location.hash');
            window.location.hash = params;

            // CRITICAL: Give Firebase 2 seconds to process the callback
            // before reload, so onAuthStateChanged can fire
            console.log('[OAuth] Waiting 2 seconds before reload...');
            setTimeout(() => {
              console.log('[OAuth] Reloading page');
              window.location.reload();
            }, 2000);
          }
        }
      });

      // --- OTA UPDATES (Capgo Self-Hosted) with rate-limit protection ---
      try {
        CapacitorUpdater.notifyAppReady();
      } catch (e) {
        console.warn('[OTA] notifyAppReady failed (non-critical):', e);
      }

      /** Read/refresh the OTA cooldown guard. Returns true if we should skip the check. */
      const isOtaCooldownActive = (): boolean => {
        try {
          const now = Date.now();
          const nextCheck = parseInt(localStorage.getItem(otaNextCheckKey) || '0', 10);
          if (nextCheck && now < nextCheck) {
            console.log(`[OTA] Cooldown active — next check at ${new Date(nextCheck).toLocaleTimeString()}`);
            return true;
          }
        } catch { /* ignore */ }
        return false;
      };

      /** Mark that we just checked, and set next allowed check with optional backoff. */
      const recordOtaCheck = (rateLimited = false) => {
        try {
          const now = Date.now();
          localStorage.setItem(otaLastCheckKey, String(now));
          if (rateLimited) {
            // Exponential backoff: double the backoff each time, max 6 hours
            const prev = parseInt(localStorage.getItem(otaBackoffKey) || String(OTA_MIN_INTERVAL_MS), 10);
            const backoff = Math.min(prev * 2, 6 * 60 * 60 * 1000);
            localStorage.setItem(otaBackoffKey, String(backoff));
            localStorage.setItem(otaNextCheckKey, String(now + backoff));
            console.warn(`[OTA] Rate-limited! Backing off ${(backoff / 60000).toFixed(0)} min`);
          } else {
            localStorage.setItem(otaBackoffKey, String(OTA_MIN_INTERVAL_MS));
            localStorage.setItem(otaNextCheckKey, String(now + OTA_MIN_INTERVAL_MS));
          }
        } catch { /* ignore */ }
      };

      const checkForUpdates = async (force = false) => {
        if (!force && isOtaCooldownActive()) return;

        try {
          const storageBucket =
            import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
            'dungeon-forge-prod.firebasestorage.app';

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

          try {
            const resp = await fetch(
              `https://storage.googleapis.com/${storageBucket}/version.json?t=${Date.now()}`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);

            if (resp.ok) {
              const data: VersionJsonResponse = await resp.json();
              const currentVersion = localStorage.getItem('app_version') || '1.0.0';

              if (data.version && data.version !== currentVersion && data.url) {
                console.log(`[OTA] New OTA update available: ${data.version}`);

                try {
                  setDownloadProgress(0);
                  setUpdateError(null);

                  const update = await CapacitorUpdater.download({
                    url: data.url,
                    version: data.version,
                  });

                  setDownloadProgress(100);
                  setUpdateAvailable({
                    version: data.version,
                    message: data.message || 'New improvements have been forged for your adventure.',
                    payload: update,
                    downloading: false,
                    progress: 100,
                    available: true,
                  });
                } catch (downloadErr) {
                  const errorMsg = downloadErr instanceof Error ? downloadErr.message : String(downloadErr);
                  console.error('[OTA] Download failed:', errorMsg);

                  // Detect Capgo rate-limit and back off
                  if (errorMsg.includes('rate_limit') || errorMsg.includes('429')) {
                    recordOtaCheck(true);
                    setUpdateError(null); // silent — not a user-facing error
                    setDownloadProgress(0);
                    return;
                  }

                  let displayError = 'Error al descargar actualización';
                  if (errorMsg.includes('quota') || errorMsg.includes('storage')) {
                    displayError = 'Almacenamiento insuficiente para descargar la actualización';
                  } else if (errorMsg.includes('signature') || errorMsg.includes('invalid')) {
                    displayError = 'Archivo de actualización inválido o corrupto';
                  } else if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
                    displayError = 'Error de conexión. Reintentará automáticamente.';
                  }

                  setUpdateError(displayError);
                  setDownloadProgress(0);
                  setUpdateAvailable(null);
                }
              }
              // Update was successful or no new version — record normal check
              recordOtaCheck(false);
            } else {
              console.warn(`[OTA] Failed to fetch version.json: ${resp.status}`);
              recordOtaCheck(false);
            }
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            const errorMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);

            if (errorMsg.includes('abort')) {
              console.warn('[OTA] Version check timeout (>15s)');
            } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
              console.warn('[OTA] Network error while checking updates:', errorMsg);
            } else {
              console.error('[OTA] Fetch error:', errorMsg);
            }
            setDownloadProgress(0);
            recordOtaCheck(false);
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          console.error('[OTA] Unexpected error in checkForUpdates:', errorMsg);
          setDownloadProgress(0);
        }
      };

      // Expose to UI for force-update button
      checkForUpdatesRef.current = checkForUpdates;

      // Check when the app returns from background — auth only (no auto OTA)
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log('[App] App resumed — checking auth state');

          // Also trigger manual auth check in case user returned from OAuth popup
          if (!isAuthenticated) {
            try {
              const storedSession = localStorage.getItem('df_session');
              if (storedSession) {
                const parsed = JSON.parse(storedSession);
                if (parsed && parsed.id && !isObsoleteSupabaseId(parsed.id)) {
                  console.log('[Auth] Resume check: Found stored session:', parsed.user);
                  setUser({ name: parsed.user || 'Adventurer', id: parsed.id });
                  setIsAuthenticated(true);
                } else if (parsed && parsed.id && isObsoleteSupabaseId(parsed.id)) {
                  console.warn('[Auth] Ignorando sesión obsoleta de Supabase al reanudar');
                  localStorage.removeItem('df_session');
                }
              }
            } catch (e) {
              console.warn('[Auth] Resume check failed:', e);
            }
          }
        }
      }).then((listener) => {
        appStateListenerRef.current = listener;
      });

    }

    // Listen for auth changes via Firebase (synchronous registration — no dynamic import race)
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged fired, user:', firebaseUser?.email || 'null');

      if (firebaseUser) {
        console.log('[Auth] Session established for:', firebaseUser.email);
        setUser({ name: firebaseUser.email || 'Adventurer', id: firebaseUser.uid });
        setIsAuthenticated(true);
        try {
          localStorage.setItem(
            'df_session',
            JSON.stringify({ user: firebaseUser.email, id: firebaseUser.uid })
          );
        } catch (e) {
          console.error('Failed to save session:', e);
        }
      } else {
        console.log('[Auth] No session found or session cleared');
        setUser(null);
        setIsAuthenticated(false);
        try {
          localStorage.removeItem('df_session');
        } catch (e) {
          console.error('Failed to remove session:', e);
        }
      }
    });

    // FALLBACK: If listener doesn't fire quickly from popup context, check localStorage periodically
    // This handles the case where Firebase emits auth changes in popup context, not main app
    let checkCount = 0;
    const checkLocalStorageInterval = setInterval(() => {
      try {
        const storedSession = localStorage.getItem('df_session');
        if (storedSession && !isAuthenticated) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.id && !isObsoleteSupabaseId(parsed.id)) {
            console.log('[Auth] Fallback: Detected session in localStorage:', parsed.user);
            setUser({ name: parsed.user || 'Adventurer', id: parsed.id });
            setIsAuthenticated(true);
            clearInterval(checkLocalStorageInterval); // Stop polling once session found
          } else if (parsed && parsed.id && isObsoleteSupabaseId(parsed.id)) {
            console.warn('[Auth] Fallback: Sesión obsoleta de Supabase ignorada');
            localStorage.removeItem('df_session');
          }
        }
      } catch {
        // Silent fail
      }

      // Prevent infinite polling - max 60 checks (30 seconds)
      if (++checkCount > 60) {
        console.warn('[Auth] Fallback polling exceeded max checks, stopping');
        clearInterval(checkLocalStorageInterval);
      }
    }, 500); // Check every 500ms

    const cleanupCheckInterval = () => clearInterval(checkLocalStorageInterval);

    return () => {
      if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);
      if (appStateListenerRef.current) {
        appStateListenerRef.current.remove();
        appStateListenerRef.current = null;
      }
      unsubscribeAuth();
      cleanupCheckInterval();
    };
  }, [isAuthenticated]);

  // Initialize characters from localStorage if available, otherwise use mocks
  // Apply migrations to existing characters on load
  // Validate each character - filter corrupted ones, clean localStorage if needed
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('dnd-characters');
      if (!saved) {
        return MOCK_CHARACTERS;
      }

      const parsed = JSON.parse(saved) as unknown;

      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        console.warn('localStorage dnd-characters is not an array, clearing');
        localStorage.removeItem('dnd-characters');
        return MOCK_CHARACTERS;
      }

      // Validate each character
      const validated: Character[] = [];
      const corrupted: unknown[] = [];

      for (const char of parsed) {
        const validation = isValidCharacter(char);
        if (!validation.valid) {
          const charName =
            typeof char === 'object' && char !== null && 'name' in char
              ? (char as Record<string, unknown>).name
              : 'unknown';
          console.warn(`Removiendo personaje corrupto ${charName}:`, validation.errors);
          corrupted.push(char);
        } else {
          validated.push(char as Character);
        }
      }

      // If corrupted characters were found, save cleaned data back to localStorage
      if (corrupted.length > 0) {
        const percentage = Math.round((corrupted.length / parsed.length) * 100);
        console.warn(`Limpiados ${corrupted.length} personajes corruptos (${percentage}%)`);

        // Save cleaned data
        try {
          localStorage.setItem('dnd-characters', JSON.stringify(validated));
        } catch (storageErr) {
          console.error('Failed to save cleaned characters back to localStorage:', storageErr);
        }
      }

      // Apply migrations to valid characters
      const { characters: migratedChars } = migrateCharacters(validated);
      return migratedChars;
    } catch (e) {
      console.error('localStorage corrupto, limpiando...', e);
      try {
        localStorage.removeItem('dnd-characters');
      } catch (err) {
        console.error('Failed to remove corrupted localStorage:', err);
      }
      return MOCK_CHARACTERS;
    }
  });

  // Track deleted character IDs to prevent restoration after reload
  const [deletedCharacterIds, setDeletedCharacterIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('df-deleted-characters');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error('Failed to load deleted characters list:', e);
      return new Set();
    }
  });

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const activeCharacter = characters.find((c) => c.id === activeCharacterId);

  // WAVE 6: Listener cleanup on character switch
  const listenerRef = useRef<{ unsubscribe: () => Promise<void> } | null>(null);

  // WAVE 6: useEffect to subscribe/cleanup when active character changes
  useEffect(() => {
    /**
     * Subscribe to active character only - cleanup previous listener on switch
     * WAVE 6: Selective listener management
     */
    const subscribeToActiveCharacter = async (characterId: string, partyId: string) => {
      // Cleanup listener anterior
      if (listenerRef.current) {
        await listenerRef.current.unsubscribe();
        console.log('[Listener] Cleaned up previous listener');
      }

      // Abrir listener SOLO para character activo (WAVE 7: selective sync)
      if (!isLocalMode && isAuthenticated) {
        const subscription = subscribeWithRetry(
          partyId,
          (payload: unknown) => {
            // Solo procesar si es el character activo
            const p = payload as Record<string, unknown>;
            if (p.new && typeof p.new === 'object') {
              const newData = p.new as unknown as Record<string, unknown>;
              if (newData.id === characterId) {
                const char = newData.data as unknown as Character;
                setCharacters((prev) => prev.map((c) => (c.id === characterId ? char : c)));
                console.log(`[App] Updated via listener: ${characterId}`);
              }
            }
          },
          (broadcastChar: unknown) => {
            const bc = broadcastChar as Record<string, unknown>;
            if (bc && bc.id === characterId) {
              const char = broadcastChar as unknown as Character;
              setCharacters((prev) => prev.map((c) => (c.id === characterId ? char : c)));
              console.log(`[App] Updated via broadcast: ${characterId}`);
            }
          },
          (status) => {
            console.log(`[Listener] Party sync status: ${status}`);
          },
          characterId // WAVE 7: Pass activeCharacterId for selective sync
        );

        listenerRef.current = subscription;
        console.log(`[Listener] Opened listener for character: ${characterId}`);
      }
    };

    if (activeCharacter?.id && activeCharacter?.party_id) {
      subscribeToActiveCharacter(activeCharacter.id, activeCharacter.party_id);
    } else {
      // Party ID is null (kicked/left) — clean up any existing listener
      if (listenerRef.current) {
        listenerRef.current.unsubscribe();
        listenerRef.current = null;
        console.log('[Listener] Cleaned up listener (no active party)');
      }
    }

    return () => {
      // Additional cleanup on unmount or character change
      if (listenerRef.current) {
        listenerRef.current.unsubscribe();
        listenerRef.current = null;
      }
    };
  }, [activeCharacter?.id, activeCharacter?.party_id, isLocalMode, isAuthenticated]);

  // RTDB CLEANUP ON KICK: When activeCharacter's party_id transitions from non-null to null,
  // it means the player was kicked. We must remove our RTDB entry so the DM's view updates.
  // The player OWNS this RTDB node (wrote it via broadcastCharacterUpdate), so only they can delete it.
  const prevPartyIdRef = useRef<string | null>(null);
  useEffect(() => {
    const currentPartyId = activeCharacter?.party_id;
    const previousPartyId = prevPartyIdRef.current;

    // Detect transition: had party_id, now null → player was kicked/left
    if (previousPartyId && !currentPartyId && activeCharacter?.id) {
      console.log(
        `[App] Player was kicked/left — cleaning up RTDB entry for character ${activeCharacter.id} in party ${previousPartyId}`
      );
      removeCharacterFromPartyRTDB(previousPartyId, activeCharacter.id);
    }

    prevPartyIdRef.current = currentPartyId ?? null;
  }, [activeCharacter?.party_id, activeCharacter?.id]);

  // Pending uploads queue for sync
  const pendingUploads = useRef<Character[]>([]);

  // Deduplication of listener events (prevent processing same event from multiple listeners)
  const recentEventIds = useRef<Set<string>>(new Set());
  const DEDUP_WINDOW_MS = 100;

  // Helper: Generate event ID from character data
  const getEventId = (characterId: string, timestamp: number): string => {
    return `${characterId}-${timestamp}`;
  };

  // Helper: Check if event is duplicate and mark it as processed
  const isDuplicateEvent = useCallback((characterId: string, timestamp: number): boolean => {
    const eventId = getEventId(characterId, timestamp);
    const isDuplicate = recentEventIds.current.has(eventId);

    if (!isDuplicate) {
      recentEventIds.current.add(eventId);
      // Schedule cleanup of this event ID after dedup window
      setTimeout(() => {
        recentEventIds.current.delete(eventId);
      }, DEDUP_WINDOW_MS);
    }

    return isDuplicate;
  }, []);

  // Sync with Cloud on Login - Merge Inteligente
  useEffect(() => {
    // Skip sync if in local mode
    if (isLocalMode) {
      console.log('[LocalMode] Skipping cloud sync in local mode');
      return;
    }

    if (isAuthenticated && user?.id && !user.id.includes('mock')) {
      const syncFromCloud = async () => {
        setIsSyncing(true);
        setSyncMessage('Sincronizando...');
        setShowSyncFeedback(true);
        if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);
        console.log('[Sync] Iniciando sincronización desde cloud...');

        const cloudChars = await fetchCharactersFromCloud(user.id);

        if (cloudChars && cloudChars.length > 0) {
          console.log(`[Sync] Encontrados ${cloudChars.length} personajes en cloud`);

          setCharacters((prev) => {
            const merged = [...prev];
            let updated = false;

            for (const cloudChar of cloudChars) {
              // Cloud es la fuente de verdad para personajes activos (deleted_at = null).
              // Si aparece aquí, eliminamos cualquier marca local obsoleta de borrado.
              if (deletedCharacterIds.has(cloudChar.id)) {
                console.log(`[Sync] Restaurando personaje activo desde cloud: ${cloudChar.name}`);
                setDeletedCharacterIds((prev) => {
                  const next = new Set(prev);
                  next.delete(cloudChar.id);
                  try {
                    localStorage.setItem('df-deleted-characters', JSON.stringify([...next]));
                  } catch (e) {
                    console.error('Failed to sync deleted characters list:', e);
                  }
                  return next;
                });
              }

              const localIndex = merged.findIndex((c) => c.id === cloudChar.id);

              if (localIndex === -1) {
                console.log(`[Sync] Agregando personaje del cloud: ${cloudChar.name}`);
                merged.push({ ...cloudChar, syncTimestamp: Date.now() });
                updated = true;
              } else {
                const localChar = merged[localIndex];
                const localTime = localChar.syncTimestamp || 0;
                const cloudTime =
                  cloudChar.syncTimestamp ||
                  ((cloudChar as unknown as Record<string, unknown>).updated_at
                    ? new Date(
                        (cloudChar as unknown as Record<string, unknown>).updated_at as string
                      ).getTime()
                    : 0);

                if (cloudTime > localTime) {
                  console.log(`[Sync] Actualizando local con cloud: ${cloudChar.name}`);
                  merged[localIndex] = { ...cloudChar, syncTimestamp: Date.now() };
                  updated = true;
                } else if (localTime > cloudTime && localTime > 0) {
                  console.log(`[Sync] Subiendo local más reciente: ${localChar.name}`);
                  merged[localIndex] = { ...merged[localIndex], syncTimestamp: Date.now() };
                  pendingUploads.current.push(merged[localIndex]);
                }
              }
            }

            return updated ? merged : prev;
          });
        } else {
          console.log('[Sync] No hay personajes en cloud, subiendo locales...');
          setSyncMessage('Subiendo personajes...');
          setCharacters((prev) => {
            const toUpload = prev.map((c) => ({ ...c, syncTimestamp: Date.now() }));
            pendingUploads.current.push(...toUpload);
            return prev;
          });
        }

        // Process pending uploads in order
        const uploads = [...pendingUploads.current];
        pendingUploads.current = [];
        for (const char of uploads) {
          await saveCharacterToCloud(char, user.id);
        }

        setSyncMessage('¡Listo!');
        showSyncFor(2500);
        setTimeout(() => {
          setIsSyncing(false);
        }, 300);
        console.log('[Sync] Sincronización completada');
      };
      syncFromCloud();
    }
  }, [isAuthenticated, user, deletedCharacterIds, isLocalMode]);

  // Handle system back gesture (Android hardware back button, iOS swipe back)
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      const backButtonListener = CapacitorApp.addListener('backButton', () => {
        // If we're not on the list view, go back to list
        if (view !== 'list') {
          console.log('[Navigation] System back gesture - going to character list');
          setView('list');
          setActiveCharacterId(null);
        } else {
          // If we're on the list view, exit the app
          console.log('[Navigation] System back gesture on list view - exiting app');
          CapacitorApp.exitApp();
        }
      });

      return () => {
        backButtonListener.then((listener) => listener.remove());
      };
    }
  }, [view]);

  // Dirty tracking for efficient cloud saves
  const dirtyCharacterIdsRef = useRef<Set<string>>(new Set());
  const lastSnapshotRef = useRef<string>('');

  // Track which characters changed (dirty tracking)
  useEffect(() => {
    const snapshot = JSON.stringify(characters);
    if (lastSnapshotRef.current) {
      // Not the first render — find which characters changed
      const prevChars = JSON.parse(lastSnapshotRef.current) as Character[];
      const prevMap = new Map(prevChars.map(c => [c.id, JSON.stringify(c)]));
      for (const char of characters) {
        const prevSerialized = prevMap.get(char.id);
        const currentSerialized = JSON.stringify(char);
        if (!prevSerialized || prevSerialized !== currentSerialized) {
          dirtyCharacterIdsRef.current.add(char.id);
        }
      }
    }
    lastSnapshotRef.current = snapshot;
  }, [characters]);

  // Persist to localStorage and cloud (debounced)
  useEffect(() => {
    // Always save to localStorage immediately (cheap)
    const dataToSave = JSON.stringify(characters);
    localStorage.setItem('dnd-characters', dataToSave);

    // Cloud save only if dirty and authenticated
    const dirtyIds = dirtyCharacterIdsRef.current;
    if (dirtyIds.size === 0 || !isAuthenticated || !user?.id || user.id.includes('mock')) {
      return;
    }

    const saveData = setTimeout(async () => {
      try {
        // Collect dirty characters
        const dirtyChars = characters.filter(c => dirtyIds.has(c.id));
        dirtyIds.clear(); // Clear before async work

        if (dirtyChars.length === 0) return;

        setIsSyncing(true);
        setSyncMessage('Guardando...');
        setShowSyncFeedback(true);
        if (syncFeedbackTimerRef.current) clearTimeout(syncFeedbackTimerRef.current);

        // Save only changed characters, with small delays between writes
        for (let i = 0; i < dirtyChars.length; i++) {
          const char = dirtyChars[i];
          const charWithTimestamp = {
            ...char,
            syncTimestamp: Date.now(),
          };
          await saveCharacterToCloud(charWithTimestamp, user.id);

          // Small delay between writes to avoid bursting the queue
          if (i < dirtyChars.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        setSyncMessage('¡Guardado!');
        showSyncFor(2500);
        setTimeout(() => {
          setIsSyncing(false);
        }, 300);
      } catch (error) {
        console.error('Failed to save characters:', error);
        if (
          error instanceof Error &&
          (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        ) {
          alert('⚠️ Memory Alert! Local storage is full.');
        }
        setIsSyncing(false);
        setSyncMessage('');
        showSyncFor(2500);
      }
    }, 500); // Increased from 300ms to 500ms
    return () => clearTimeout(saveData);
  }, [characters, isAuthenticated, user]);

  const [observedCharacter, setObservedCharacter] = useState<Character | null>(null);

  const handleCreateNew = () => {
    setView('create');
  };

  const handleSelectCharacter = (id: string) => {
    setActiveCharacterId(id);
    setView('sheet');
  };

  const handleViewCharacter = (char: Character) => {
    setObservedCharacter(char);
    setView('observer-sheet');
  };

  const handleDeleteCharacter = async (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    if (activeCharacterId === id) setActiveCharacterId(null);

    // Track deletion to prevent restoration after reload
    const newDeleted = new Set(deletedCharacterIds);
    newDeleted.add(id);
    setDeletedCharacterIds(newDeleted);
    try {
      localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
    } catch (e) {
      console.error('Failed to save deleted characters list:', e);
    }

    // Only sync deletion with Firestore if not in local mode
    if (!isLocalMode && isAuthenticated && user?.id && !user.id.includes('mock')) {
      const success = await softDeleteCharacter(id);
      if (!success) {
        console.error('[Delete] Soft delete failed, trying hard delete');
        try {
          if (firestore) {
            const characterRef = doc(firestore, 'characters', id);
            await deleteDoc(characterRef);
            console.log('[Delete] Hard delete succeeded');
          }
        } catch (deleteErr) {
          console.error('[Delete] Hard delete error:', deleteErr);
        }
      }
    }
  };

  const handleFinishCreation = (newChar: Character) => {
    setCharacters((prev) => [newChar, ...prev]);
    setActiveCharacterId(newChar.id);
    setView('sheet');
  };

  // Real-time synchronization for the Observer View
  useEffect(() => {
    if (!observedCharacter || view !== 'observer-sheet') return;

    const subscription = subscribeWithRetry(
      observedCharacter.party_id || 'no-party',
      (payload: unknown) => {
        const p = payload as Record<string, unknown>;
        if (p.new && typeof p.new === 'object') {
          const newData = p.new as unknown as Record<string, unknown>;
          if (newData.id === observedCharacter.id) {
            const char = newData.data as unknown as Character;
            const timestamp = char.syncTimestamp || Date.now();

            // Skip if this is a duplicate event from another listener
            if (isDuplicateEvent(char.id, timestamp)) {
              console.log(`[Observer] Postgres change - DUPLICATE IGNORED: ${char.id}`);
              return;
            }

            console.log(`[Observer] Postgres change processed: ${char.id}`);
            setObservedCharacter(char);
          }
        }
      },
      (broadcastChar: unknown) => {
        const bc = broadcastChar as Record<string, unknown>;
        if (bc && bc.id === observedCharacter.id) {
          const timestamp = (bc.syncTimestamp as unknown as number) || Date.now();

          // Skip if this is a duplicate event from another listener
          if (isDuplicateEvent(bc.id as unknown as string, timestamp)) {
            console.log(`[Observer] Broadcast - DUPLICATE IGNORED: ${bc.id}`);
            return;
          }

          console.log(`[Observer] Broadcast processed: ${bc.id}`);
          setObservedCharacter(bc as unknown as Character);
        }
      },
      (status) => {
        // Log status changes (connecting, connected, error, reconnecting)
        console.log(`[Observer] Realtime status: ${status}`);
      },
      observedCharacter.id // WAVE 10: Selective document listener
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [observedCharacter, view, isDuplicateEvent]);

  // Real-time sync for own characters (from other devices) — Firebase Firestore onSnapshot
  useEffect(() => {
    if (isLocalMode || !isAuthenticated || !user?.id || user.id.includes('mock')) return;

    const unsubscribe = subscribeToOwnCharacters(user.id, (char, type) => {
      const timestamp = char.syncTimestamp || Date.now();

      // Skip if this is a duplicate event from another listener
      if (isDuplicateEvent(char.id, timestamp)) {
        console.log(`[Cloud Realtime] ${type} - DUPLICATE IGNORED: ${char.id}`);
        return;
      }

      if (type === 'DELETE') {
        console.log('[Cloud Realtime] Character deleted from cloud:', char.id);
        setCharacters((prev) => prev.filter((c) => c.id !== char.id));
        setDeletedCharacterIds((prev) => {
          const newDeleted = new Set(prev);
          newDeleted.add(char.id);
          try {
            localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
          } catch {
            // Storage might be full, continue anyway
          }
          return newDeleted;
        });
      } else {
        console.log('[Cloud Realtime] Update processed:', char.id);
        setCharacters((prev) => {
          const localChar = prev.find((c) => c.id === char.id);
          const localTime = localChar?.syncTimestamp || 0;
          if ((char.syncTimestamp || 0) > localTime) {
            console.log('[Cloud Realtime] Updating local with cloud version:', char.name);
            return prev.map((c) => (c.id === char.id ? char : c));
          }
          return prev;
        });
      }
    });

    return unsubscribe;
  }, [isAuthenticated, user?.id, isDuplicateEvent, isLocalMode]);

  // Suscripción a recursos compartidos de la fiesta — Firebase RTDB
  useEffect(() => {
    if (!activeCharacter?.party_id) return;

    const unsubscribe = subscribeToPartyResources(activeCharacter.party_id, (resources) => {
      if (resources && resources.length > 0) {
        const resource = resources[0];
        console.log('[PartyResources] Shared Resource received:', resource.title);
        // Convert CampaignResource to SharedResourceEvent
        setSharedResource({
          url: resource.url,
          title: resource.title,
          description: resource.description,
        });
      } else {
        console.log('[PartyResources] Resource hidden');
        setSharedResource(null);
      }
    });

    return unsubscribe;
  }, [activeCharacter?.party_id, isDuplicateEvent, isLocalMode]);

  const handleCharacterUpdate = useCallback(
    (updatedChar: Partial<Character> | Character) => {
      if (!activeCharacter) return;

      const isPartial = !('class' in updatedChar) || !('id' in updatedChar);
      const fullUpdate: Character = isPartial
        ? ({ ...activeCharacter, ...updatedChar } as Character)
        : (updatedChar as Character);

      setCharacters((prev) => prev.map((c) => (c.id === fullUpdate.id ? fullUpdate : c)));
      setActiveCharacterId(fullUpdate.id);

      if (fullUpdate.party_id) {
        broadcastCharacterUpdate(fullUpdate.party_id, fullUpdate);
      }
    },
    [activeCharacter]
  );

  /** Fast path: broadcasts to RTDB immediately without debounce, skips state update.
   *  Used by CombatTab's HP changes so the GM sees damage/healing in real-time (~200ms)
   *  while Firestore persistence still goes through the normal debounced path. */
  const handleFastUpdate = useCallback(
    (partialChar: Partial<Character>) => {
      if (!activeCharacter) return;
      const fullUpdate: Character = { ...activeCharacter, ...partialChar } as Character;
      if (fullUpdate.party_id) {
        broadcastCharacterUpdate(fullUpdate.party_id, fullUpdate);
      }
    },
    [activeCharacter, broadcastCharacterUpdate]
  );

  const handleDMCharacterUpdate = async (updatedChar: Character) => {
    // KICK-TRACE: Detect if this save might be from a kicked character
    if (updatedChar.party_id === null || updatedChar.party_id === undefined) {
      console.log(`[KICK-SYNC] DM character update: ${updatedChar.name} has party_id=${updatedChar.party_id}`);
    }
    if (updatedChar.party_id) {
      console.log(`[KICK-SYNC] DM character update: ${updatedChar.name} still has party_id="${updatedChar.party_id}" — may be pre-kick save`);
    }
    // 1. Validar character antes de guardar (Task 2-1)
    const validation = isValidCharacter(updatedChar);
    if (!validation.valid) {
      console.error('[Sync] Validation failed:', validation.errors);
      syncStatus.showError(validation.errors?.[0] || 'Validation error', updatedChar.id);
      return; // No guardar si es inválido
    }

    // 2. Update the local observed character state
    setObservedCharacter(updatedChar);

    // 3. Show syncing state
    syncStatus.showSync();

    // 4. Persist to cloud with rollback (Task 3-1)
    try {
      const ownerId = (updatedChar as CharacterWithOwner).user_id || user?.id || 'guest';

      // Create rollback handler - restore previous state on failure
      const handleRollback = (snapshot: Character) => {
        setObservedCharacter(snapshot);
        console.error('[Sync] Rollback applied:', snapshot.id);
      };

      // Save with rollback capability
      await saveCharacterWithRollback(updatedChar, ownerId, handleRollback);

      // Success - update sync status (Task 3-2)
      syncStatus.showSuccess(`${updatedChar.name} guardado`);
      console.log('[Sync] Character saved successfully:', updatedChar.id);
    } catch (error) {
      // Error - show feedback (Task 3-2)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      syncStatus.showError(errorMessage, updatedChar.id);
      console.error('[Sync] Failed to save character:', error);
      return; // Stop here, don't broadcast on error
    }

    // 5. Broadcast to the party on success
    if (updatedChar.party_id) {
      broadcastCharacterUpdate(updatedChar.party_id, updatedChar);
    }
  };

  /**
   * Task 4-2: Batch save multiple characters efficiently
   * Used when editing multiple characters simultaneously (e.g., DM editing all enemy stats)
   * Instead of N individual requests, reduces to 1 batch operation
   *
   * @param updates Array of characters to save
   * @returns Promise that resolves when batch save completes
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBatchUpdateCharacters = async (updates: Character[]): Promise<void> => {
    // Validación inicial
    if (!updates || updates.length === 0) {
      console.warn('[BatchSave] No characters to save');
      return;
    }

    // Mostrar estado de sincronización
    syncStatus.showSync();
    console.log(`[BatchSave] Starting batch save for ${updates.length} characters`);

    try {
      // Crear callback para saveCharacterWithRollback
      // Cada personaje se guarda individualmente dentro del batch
      const saveCallback = async (
        character: Character
      ): Promise<{ data: { id: string }; error: null }> => {
        const ownerId = (character as CharacterWithOwner).user_id || user?.id || 'guest';

        // Crear handler para rollback si falla el save
        const handleRollback = (snapshot: Character) => {
          setCharacters((prev) => prev.map((c) => (c.id === snapshot.id ? snapshot : c)));
          console.error('[BatchSave] Rollback applied for:', snapshot.id);
        };

        // Guardar con capacidad de rollback
        return await saveCharacterWithRollback(character, ownerId, handleRollback);
      };

      // Ejecutar batch save con el callback
      const result = await batchSaveCharacters(updates, saveCallback);

      // Actualizar characters locales con los que se guardaron exitosamente
      setCharacters((prev) => {
        const modified = [...prev];
        for (const successful of result.successful) {
          const idx = modified.findIndex((c) => c.id === successful.id);
          if (idx !== -1) {
            modified[idx] = successful;
          }
        }
        return modified;
      });

      // Mostrar resultado según éxito/fallos
      if (result.failed.length === 0) {
        // Todos exitosos
        const message = `✅ ${result.successful.length} personaje${result.successful.length !== 1 ? 's' : ''} guardado${result.successful.length !== 1 ? 's' : ''} en ${result.totalTime}ms`;
        syncStatus.showSuccess(message);
        console.log('[BatchSave] All characters saved successfully:', {
          successful: result.successful.length,
          time: result.totalTime,
        });
      } else {
        // Algunos fallaron
        const message = `⚠️ ${result.successful.length} guardado${result.successful.length !== 1 ? 's' : ''}, ${result.failed.length} fallo${result.failed.length !== 1 ? 's' : ''}`;
        syncStatus.showError(message);
        console.warn('[BatchSave] Batch completed with failures:', {
          successful: result.successful.length,
          failed: result.failed.length,
        });
      }

      // Broadcast updates to party members si existen
      const partyIds = new Set<string>();
      for (const char of result.successful) {
        if (char.party_id) {
          partyIds.add(char.party_id);
        }
      }
      for (const partyId of partyIds) {
        for (const char of result.successful) {
          if (char.party_id === partyId) {
            broadcastCharacterUpdate(partyId, char);
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      syncStatus.showError(`Error al guardar: ${errorMessage}`);
      console.error('[BatchSave] Batch save failed:', error);
    }
  };

  const handleLogout = async () => {
    // Clear local mode flag if set
    try {
      localStorage.removeItem('df_local_mode');
      localStorage.removeItem('df_session');
    } catch (e) {
      console.error('Failed to clear session:', e);
    }

    // Sign out from Firebase only if not in local mode
    if (!isLocalMode) {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
    }

    setIsAuthenticated(false);
    setIsLocalMode(false);
    setUser(null);
    setView('list');
  };

  const handleExportCharacters = () => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute(
      'download',
      'dnd_characters_' + new Date().toISOString().slice(0, 10) + '.json'
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportCharacters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = (event) => {
        try {
          if (!event.target?.result) return;
          const parsed = JSON.parse(event.target.result as string);

          // Validate structure: must be array with objects having required fields
          const isValidCharacter = (c: unknown): c is object => {
            if (!c || typeof c !== 'object') return false;
            const obj = c as Record<string, unknown>;
            return (typeof obj.name === 'string' &&
              (obj.name as string).trim().length > 0 &&
              typeof obj.class === 'string' &&
              (obj.class as string).trim().length > 0 &&
              typeof obj.level === 'number' &&
              (obj.level as number) > 0 &&
              obj.hp &&
              typeof (obj.hp as Record<string, unknown>).current === 'number' &&
              typeof (obj.hp as Record<string, unknown>).max === 'number') as boolean;
          };

          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            parsed.every((item) => isValidCharacter(item))
          ) {
            if (window.confirm(`Found ${parsed.length} characters. Merge?`)) {
              const newChars = parsed.map((c: unknown) => ({
                ...(c as Record<string, unknown>),
                id: 'imp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11),
              })) as Character[];
              setCharacters((prev) => [...prev, ...newChars]);
            }
          } else {
            alert('Invalid file format. Please select a valid character export file.');
          }
        } catch {
          alert('Error reading file.');
        } finally {
          fileInput.value = '';
        }
      };
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
      <div
        className={`mx-auto ${isLandscape ? 'max-w-none' : 'max-w-md'} bg-background-light dark:bg-background-dark shadow-2xl min-h-screen relative overflow-hidden`}
      >
        {/* OTA Update Modal with Progress */}
        {updateAvailable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-primary/20 text-center animate-slideUp">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                ¡Instalando Parche Mágico!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 font-medium">
                {updateAvailable.message}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>

              {/* Progress Percentage */}
              <p className="text-xs text-slate-400 mb-2">
                {downloadProgress === 0 ? 'Verificando...' : `${Math.round(downloadProgress)}%`}
              </p>

              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                {downloadProgress === 100
                  ? 'Descarga completada. Reiniciando...'
                  : 'Descargando actualización...'}
              </p>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {updateError && (
          <Toast
            type="error"
            message={updateError}
            duration={0}
            onClose={() => setUpdateError(null)}
            action={{
              label: 'Reintentar',
              onClick: () => {
                setUpdateError(null);
                setDownloadProgress(0);
                // Force a fresh update check (bypass cooldown)
                if (checkForUpdatesRef.current) {
                  checkForUpdatesRef.current(true);
                }
              },
            }}
          />
        )}

        {/* Sync Indicator — solo visible durante o justo después de un cambio */}
        {isAuthenticated && showSyncFeedback && (
          <div className="absolute top-4 right-12 z-50 flex items-center gap-1.5 bg-background-dark/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 transition-opacity duration-300">
            {isSyncing ? (
              <>
                <span className="material-symbols-outlined text-[10px] text-primary animate-spin">
                  sync
                </span>
                <span className="text-[8px] font-black uppercase text-white/50 tracking-tighter animate-pulse">
                  {syncMessage || 'Sincronizando...'}
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[10px] text-green-500">
                  cloud_done
                </span>
                <span className="text-[8px] font-black uppercase text-white/30 tracking-tighter">
                  {syncMessage || 'Sincronizado'}
                </span>
              </>
            )}
          </div>
        )}

        {/* Force Update Button — native only */}
        {isAuthenticated && Capacitor.getPlatform() !== 'web' && (
          <button
            onClick={async () => {
              if (!checkForUpdatesRef.current || isForceChecking) return;
              setIsForceChecking(true);
              try {
                setUpdateError(null);
                setDownloadProgress(0);
                await checkForUpdatesRef.current(true);
              } finally {
                setIsForceChecking(false);
              }
            }}
            className="absolute top-4 right-2 z-50 flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 transition-colors active:scale-95"
            title="Forzar actualización"
          >
            <span
              className={`material-symbols-outlined text-[10px] text-amber-400 ${isForceChecking ? 'animate-spin' : ''}`}
            >
              system_update
            </span>
            <span className="text-[8px] font-black uppercase text-white/40 tracking-tighter hidden sm:inline">
              OTA
            </span>
          </button>
        )}

        {!isAuthenticated ? (
          <Login onLocalModeActivated={() => setIsLocalMode(true)} />
        ) : (
          <>
            {view === 'list' && (
              <CharacterList
                characters={characters}
                onCreate={handleCreateNew}
                onSelect={handleSelectCharacter}
                onDelete={handleDeleteCharacter}
                onImport={handleImportCharacters}
                onLogout={handleLogout}
                onOpenDMDashboard={() => setView('dm-dashboard')}
              />
            )}
            {view === 'dm-dashboard' && (
              <DMDashboard
                onBack={() => setView('list')}
                onViewCharacter={handleViewCharacter}
                user={user}
              />
            )}
            <Suspense
              fallback={
                <div className="flex h-screen w-full items-center justify-center text-primary">
                  <span className="material-symbols-outlined animate-spin text-4xl">
                    progress_activity
                  </span>
                </div>
              }
            >
              {view === 'create' && (
                <CreatorSteps onBack={() => setView('list')} onFinish={handleFinishCreation} />
              )}
              {view === 'sheet' && activeCharacter && (
                <SheetTabs
                  character={activeCharacter}
                  onBack={() => setView('list')}
                  onUpdate={handleCharacterUpdate}
                  onFastUpdate={handleFastUpdate}
                />
              )}
              {view === 'observer-sheet' && observedCharacter && (
                <SheetTabs
                  character={observedCharacter}
                  isReadOnly={true}
                  isObserver={true}
                  onBack={() => setView('dm-dashboard')}
                  onUpdate={(update) => handleDMCharacterUpdate(update as Character)}
                />
              )}
            </Suspense>

          </>
        )}
      </div>
      {/* Shared Resource Splash Modal */}
      {sharedResource && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl animate-scaleIn">
            <img
              src={sharedResource.url}
              alt={sharedResource.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>

            <div className="absolute bottom-10 inset-x-8 space-y-3">
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase px-2 py-1 rounded-full border border-blue-500/20 tracking-widest">
                Shared Resource
              </span>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
                {sharedResource.title}
              </h2>
              {sharedResource.description && (
                <p className="text-sm font-medium text-slate-300 leading-tight">
                  {sharedResource.description}
                </p>
              )}
            </div>

            <button
              onClick={() => setSharedResource(null)}
              className="absolute top-6 right-6 size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined font-bold">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Task 3-3: SyncToast component for sync feedback */}
      <SyncToast />
    </div>
  );
};

/**
 * App Wrapper with ThemeProvider and SyncProvider
 * Task 3-3: Integrate SyncProvider for rollback + sync feedback
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SyncProvider>
        <AppContentWithSync />
      </SyncProvider>
    </ThemeProvider>
  );
};

/**
 * Wrapper component that provides sync context to AppContent
 * Task 3-3: Enables useSyncStatus hook usage in event handlers
 */
const AppContentWithSync: React.FC = () => {
  const syncStatus = useSyncStatus();
  return <AppContent syncStatus={syncStatus} />;
};

export default App;
