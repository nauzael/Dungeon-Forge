import { useState, useEffect, useRef } from 'react';
import { auth, onAuthStateChanged } from '../../utils/firebase';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { STORAGE_KEY_SESSION, STORAGE_KEY_APP_VERSION, STORAGE_KEY_LOCAL_MODE, STORAGE_KEY_OTA_LAST_CHECK, STORAGE_KEY_OTA_BACKOFF, STORAGE_KEY_OTA_NEXT_CHECK } from '../constants';
import { generateUUID } from '../../utils/uuid';
import type { ViewState, OTAUpdate, VersionJsonResponse } from '../../types';

const isLegacyCharId = (id: string | undefined | null): boolean => {
  if (!id) return false;
  return id.includes('-') && id.length === 36;
};

export function useAuth(
  setView: React.Dispatch<React.SetStateAction<ViewState>>,
  syncFeedbackTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
) {
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<OTAUpdate | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Cleanup ref for appStateChange listener
  const appStateListenerRef = useRef<{ remove: () => void } | null>(null);

  // Expose checkForUpdates to UI via ref (for force-update button)
  const checkForUpdatesRef = useRef<((force?: boolean) => Promise<void>) | null>(null);

  // Force-update button loading state
  const [isForceChecking, setIsForceChecking] = useState(false);

  // OTA rate-limit guard: minimum 30 min between checks to avoid Capgo 429
  const OTA_MIN_INTERVAL_MS = 30 * 60 * 1000;
  const otaLastCheckKey = STORAGE_KEY_OTA_LAST_CHECK;
  const otaBackoffKey = STORAGE_KEY_OTA_BACKOFF;
  const otaNextCheckKey = STORAGE_KEY_OTA_NEXT_CHECK;

  // Monitor Auth Changes
  useEffect(() => {
    // Limpieza preventiva de sesiones obsoletas de Supabase
    try {
      const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed && parsed.id && isLegacyCharId(parsed.id)) {
          localStorage.removeItem(STORAGE_KEY_SESSION);
           localStorage.removeItem(STORAGE_KEY_LOCAL_MODE);
        }
      }
    } catch (e) {
    }

    // Check if local mode is active
    try {
      const localModeStr = localStorage.getItem(STORAGE_KEY_LOCAL_MODE);
      if (localModeStr === 'true') {
        setIsLocalMode(true);
        // Generate a valid UUID for local dev mode instead of hardcoded string
        const devUUID = generateUUID();
        setUser({ name: 'Local Developer', id: devUUID });
        setIsAuthenticated(true);
        return; // Skip auth
      }
    } catch (e) {
    }

    // Check initial session via Firebase Auth
    if (auth?.currentUser) {
      const currentUser = auth.currentUser;
      setUser({ name: currentUser.email || 'Adventurer', id: currentUser.uid });
      setIsAuthenticated(true);
      try {
        localStorage.setItem(
          STORAGE_KEY_SESSION,
          JSON.stringify({ user: currentUser.email, id: currentUser.uid })
        );
      } catch (e) {
      }
    }

    // Handle deep links from Capacitor (Android/iOS) to catch OAuth redirects
    if (Capacitor.getPlatform() !== 'web') {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = event.url;

        // If the URL contains a hash with a session or access token, pass it to window so Firebase can parse it
        if (url.includes('access_token=') || url.includes('refresh_token=')) {
          const params = url.split('#')[1] || url.split('?')[1];

          // Manually replace URL and force reload so Firebase onAuthStateChanged initializes immediately
          if (params) {
            window.location.hash = params;

            // CRITICAL: Give Firebase 2 seconds to process the callback
            // before reload, so onAuthStateChanged can fire
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }
      });

      // --- OTA UPDATES (Capgo Self-Hosted) with rate-limit protection ---
      try {
        CapacitorUpdater.notifyAppReady();
      } catch (e) {
      }

      /** Read/refresh the OTA cooldown guard. Returns true if we should skip the check. */
      const isOtaCooldownActive = (): boolean => {
        try {
          const now = Date.now();
          const nextCheck = parseInt(localStorage.getItem(otaNextCheckKey) || '0', 10);
          if (nextCheck && now < nextCheck) {
            return true;
          }
        } catch (e) {
          console.warn('App: failed to check window property', e);
        }
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
          } else {
            localStorage.setItem(otaBackoffKey, String(OTA_MIN_INTERVAL_MS));
            localStorage.setItem(otaNextCheckKey, String(now + OTA_MIN_INTERVAL_MS));
          }
        } catch (e) {
          console.warn('App: failed to check window property', e);
        }
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
              const currentVersion = localStorage.getItem(STORAGE_KEY_APP_VERSION) || '1.0.0';

              if (data.version && data.version !== currentVersion && data.url) {

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

                  // Detect Capgo rate-limit and back off
                  if (errorMsg.includes('rate_limit') || errorMsg.includes('429')) {
                    recordOtaCheck(true);
                    setUpdateError(null); // silent — not a user-facing error
                    setDownloadProgress(0);
                    return;
                  }

                  let displayError = 'Error downloading update';
                  if (errorMsg.includes('quota') || errorMsg.includes('storage')) {
                    displayError = 'Insufficient storage to download the update';
                  } else if (errorMsg.includes('signature') || errorMsg.includes('invalid')) {
                    displayError = 'Invalid or corrupt update file';
                  } else if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
                    displayError = 'Connection error. Will retry automatically.';
                  }

                  setUpdateError(displayError);
                  setDownloadProgress(0);
                  setUpdateAvailable(null);
                }
              }
              // Update was successful or no new version — record normal check
              recordOtaCheck(false);
            } else {
              recordOtaCheck(false);
            }
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            const errorMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);

            if (errorMsg.includes('abort')) {
            } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
            }
            setDownloadProgress(0);
            recordOtaCheck(false);
          }
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          setDownloadProgress(0);
        }
      };

      // Expose to UI for force-update button
      checkForUpdatesRef.current = checkForUpdates;

      // Check when the app returns from background — auth only (no auto OTA)
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {

          // Also trigger manual auth check in case user returned from OAuth popup
          if (!isAuthenticated) {
            try {
              const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
              if (storedSession) {
                const parsed = JSON.parse(storedSession);
                if (parsed && parsed.id && !isLegacyCharId(parsed.id)) {
                  setUser({ name: parsed.user || 'Adventurer', id: parsed.id });
                  setIsAuthenticated(true);
                } else if (parsed && parsed.id && isLegacyCharId(parsed.id)) {
                  localStorage.removeItem(STORAGE_KEY_SESSION);
                }
              }
            } catch (e) {
            }
          }
        }
      }).then((listener) => {
        appStateListenerRef.current = listener;
      });

    }

    // Listen for auth changes via Firebase (synchronous registration — no dynamic import race)
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {

      if (firebaseUser) {
        setUser({ name: firebaseUser.email || 'Adventurer', id: firebaseUser.uid });
        setIsAuthenticated(true);
        try {
          localStorage.setItem(
            STORAGE_KEY_SESSION,
            JSON.stringify({ user: firebaseUser.email, id: firebaseUser.uid })
          );
        } catch (e) {
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        try {
          localStorage.removeItem(STORAGE_KEY_SESSION);
        } catch (e) {
        }
      }
    });

    // FALLBACK: If listener doesn't fire quickly from popup context, check localStorage periodically
    // This handles the case where Firebase emits auth changes in popup context, not main app
    let checkCount = 0;
    const checkLocalStorageInterval = setInterval(() => {
      try {
        const storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
        if (storedSession && !isAuthenticated) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.id && !isLegacyCharId(parsed.id)) {
            setUser({ name: parsed.user || 'Adventurer', id: parsed.id });
            setIsAuthenticated(true);
            clearInterval(checkLocalStorageInterval); // Stop polling once session found
          } else if (parsed && parsed.id && isLegacyCharId(parsed.id)) {
            localStorage.removeItem(STORAGE_KEY_SESSION);
          }
        }
      } catch {
        // Silent fail
      }

      // Prevent infinite polling - max 60 checks (30 seconds)
      if (++checkCount > 60) {
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

  const handleLogout = async () => {
    // Clear local mode flag if set
    try {
      localStorage.removeItem('df_local_mode');
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch (e) {
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

  return {
    user,
    isAuthenticated,
    isLocalMode,
    setIsLocalMode,
    handleLogout,
    checkForUpdatesRef,
    isForceChecking,
    setIsForceChecking,
    updateAvailable,
    setUpdateAvailable,
    updateError,
    setUpdateError,
    downloadProgress,
    setDownloadProgress,
  };
}
