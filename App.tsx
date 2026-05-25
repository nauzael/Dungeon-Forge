import React, { useState, useEffect, useRef, Suspense, lazy, useCallback } from 'react';
// Deploy Trigger: Syntax verification commit
import { Character, ViewState, SharedResourceEvent, OTAUpdate, VersionJsonResponse, CharacterWithOwner } from './types';
import { MOCK_CHARACTERS } from './constants';
import CharacterList from './components/CharacterList';
import Login from './components/Login';
import Toast, { ToastType } from './src/components/Toast';
import { migrateCharacters } from './utils/characterMigrations';
import { isValidCharacter } from './src/utils/validators';
import { generateUUID } from './utils/uuid';
import { useResponsive } from './hooks/useResponsive';
import {
  supabase,
  saveCharacterToCloud,
  saveCharacterWithRollback,
  fetchCharactersFromCloud,
  subscribeWithRetry,
  broadcastCharacterUpdate,
  softDeleteCharacter,
  subscribeToOwnCharacters,
  subscribeToPartyResources
} from './utils/firebase';
import { batchSaveCharacters } from './utils/supabase';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SyncProvider, useSyncStatus, SyncContextType } from './src/contexts/SyncContext';
import SyncToast from './src/components/SyncToast';

const CreatorSteps = lazy(() => import('./components/CreatorSteps'));
const SheetTabs = lazy(() => import('./components/SheetTabs'));
const DMDashboard = lazy(() => import('./components/DMDashboard'));
const MigrationTool = lazy(() => import('./components/MigrationTool'));

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
  const [user, setUser] = useState<{name: string, id: string} | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<OTAUpdate | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [showMigrationTool, setShowMigrationTool] = useState(false);

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
          console.error("Failed to save app version:", e);
        }
        await CapacitorUpdater.set({ id: (updateAvailable.payload as { id: string }).id });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable]);

  // Cleanup ref for appStateChange listener
  const appStateListenerRef = React.useRef<{ remove: () => void } | null>(null);

  // Monitor Auth Changes
  useEffect(() => {
    // Limpieza preventiva de sesiones obsoletas de Supabase
    try {
      const storedSession = localStorage.getItem('df_session');
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed && parsed.id && isObsoleteSupabaseId(parsed.id)) {
          console.warn('[Auth] Sesión obsoleta de Supabase detectada en localStorage. Limpiando para forzar login de Firebase.');
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
        return; // Skip Supabase auth
      }
    } catch (e) {
      console.error("Failed to check local mode:", e);
    }

    let otaCleanup: (() => void) | null = null;
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ name: session.user.email || 'Adventurer', id: session.user.id });
        setIsAuthenticated(true);
        try {
          localStorage.setItem('df_session', JSON.stringify({ user: session.user.email, id: session.user.id }));
        } catch (e) {
          console.error("Failed to save session:", e);
        }
      }
    });

    // Handle deep links from Capacitor (Android/iOS) to catch Supabase OAuth redirects
    if (Capacitor.getPlatform() !== 'web') {
      CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = event.url;
        console.log('[OAuth] Deeplink received:', url.substring(0, 80) + '...');
        
        // If the URL contains a hash with a session or access token, pass it to window so supabase can parse it
        if (url.includes('access_token=') || url.includes('refresh_token=')) {
          const params = url.split('#')[1] || url.split('?')[1];
          console.log('[OAuth] Found tokens, parameters extracted:', !!params);
          
          // Manually replace URL and force reload so Supabase onAuthStateChange initializes immediately
          if (params) {
              console.log('[OAuth] Setting window.location.hash');
              window.location.hash = params;
              
              // CRITICAL: Give Supabase 2 seconds to process the callback
              // before reload, so onAuthStateChange can fire
              console.log('[OAuth] Waiting 2 seconds before reload...');
              setTimeout(() => {
                console.log('[OAuth] Reloading page');
                window.location.reload();
              }, 2000);
          }
        }
      });

      // --- OTA UPDATES (Capgo Self-Hosted) ---
      CapacitorUpdater.notifyAppReady();

      const checkForUpdates = async () => {
        try {
          const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dungeon-forge-prod.firebasestorage.app';
          
          // Fetch the version.json from our public Firebase Storage bucket
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
          
          try {
            const resp = await fetch(`https://storage.googleapis.com/${storageBucket}/version.json?t=${Date.now()}`, {
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (resp.ok) {
              const data: VersionJsonResponse = await resp.json();
              
              // Log local stored version
              const currentVersion = localStorage.getItem('app_version') || '1.0.0';
              
              if (data.version && data.version !== currentVersion && data.url) {
                console.log(`[OTA] Downloading new OTA update: ${data.version}`);
                
                try {
                  // Set downloading state and reset progress
                  setDownloadProgress(0);
                  setUpdateError(null);
                  
                  const update = await CapacitorUpdater.download({
                    url: data.url,
                    version: data.version
                  });
                  
                  // Update progress to 100% on success
                  setDownloadProgress(100);
                  
                  // Instead of setting instantly, wait for user confirmation
                  setUpdateAvailable({
                    version: data.version,
                    message: data.message || "New improvements have been forged for your adventure.",
                    payload: update,
                    downloading: false,
                    progress: 100,
                    available: true
                  });
                } catch (downloadErr) {
                  // Handle download-specific errors
                  const errorMsg = downloadErr instanceof Error ? downloadErr.message : String(downloadErr);
                  console.error("[OTA] Download failed:", errorMsg);
                  
                  // Categorize error
                  let displayError = "Error al descargar actualización";
                  
                  if (errorMsg.includes('quota') || errorMsg.includes('storage')) {
                    displayError = "Almacenamiento insuficiente para descargar la actualización";
                  } else if (errorMsg.includes('signature') || errorMsg.includes('invalid')) {
                    displayError = "Archivo de actualización inválido o corrupto";
                  } else if (errorMsg.includes('network') || errorMsg.includes('timeout')) {
                    displayError = "Error de conexión. Reintentará automáticamente.";
                  } else if (errorMsg.includes('CORS') || errorMsg.includes('cross-origin')) {
                    displayError = "Error de conectividad al descargar la actualización";
                  }
                  
                  setUpdateError(displayError);
                  setDownloadProgress(0);
                  setUpdateAvailable(null);
                }
              }
            } else {
              console.warn(`[OTA] Failed to fetch version.json: ${resp.status}`);
            }
          } catch (fetchErr) {
            clearTimeout(timeoutId);
            
            // Handle fetch-specific errors
            const errorMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
            
            if (errorMsg.includes('abort')) {
              console.warn("[OTA] Version check timeout (>10s)");
              setUpdateError("Tiempo de espera agotado al verificar actualizaciones");
            } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
              console.warn("[OTA] Network error while checking updates:", errorMsg);
              setUpdateError("Sin conexión de red para verificar actualizaciones");
            } else {
              console.error("[OTA] Fetch error:", errorMsg);
              setUpdateError("Error al verificar si hay actualizaciones disponibles");
            }
            
            setDownloadProgress(0);
          }
        } catch (e) {
          // Catch-all for any unexpected errors
          const errorMsg = e instanceof Error ? e.message : String(e);
          console.error("[OTA] Unexpected error in checkForUpdates:", errorMsg);
          setUpdateError("Error inesperado al verificar actualizaciones");
          setDownloadProgress(0);
        }
      };

      // Check on startup
      checkForUpdates();

      // Check every 10 minutes if the app remains open
      const interval = setInterval(checkForUpdates, 10 * 60 * 1000);

      // Check when the app returns from background
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log('[App] App resumed - checking for updates and auth state');
          checkForUpdates();
          
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
      }).then(listener => {
        appStateListenerRef.current = listener;
      });

      // Local cleanup function for OTA
      otaCleanup = () => {
        clearInterval(interval);
        if (appStateListenerRef.current) {
          appStateListenerRef.current.remove();
          appStateListenerRef.current = null;
        }
      };
    }

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[Auth] onAuthStateChange fired, event:', _event, 'has session:', !!session);
      
      if (session) {
        console.log('[Auth] Session established for:', session.user.email);
        setUser({ name: session.user.email || 'Adventurer', id: session.user.id });
        setIsAuthenticated(true);
        try {
          localStorage.setItem('df_session', JSON.stringify({ user: session.user.email, id: session.user.id }));
        } catch (e) {
          console.error("Failed to save session:", e);
        }
      } else {
        console.log('[Auth] No session found or session cleared');
        setUser(null);
        setIsAuthenticated(false);
        try {
          localStorage.removeItem('df_session');
        } catch (e) {
          console.error("Failed to remove session:", e);
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
            clearInterval(checkLocalStorageInterval);  // Stop polling once session found
          } else if (parsed && parsed.id && isObsoleteSupabaseId(parsed.id)) {
            console.warn('[Auth] Fallback: Sesión obsoleta de Supabase ignorada');
            localStorage.removeItem('df_session');
          }
        }
      } catch (e) {
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
      if (otaCleanup) otaCleanup();
      subscription.unsubscribe();
      cleanupCheckInterval();
    };
  }, []);
  
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
          console.warn(`Removiendo personaje corrupto ${(char as any).name}:`, validation.errors);
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
      console.error("Failed to load deleted characters list:", e);
      return new Set();
    }
  });

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const activeCharacter = characters.find(c => c.id === activeCharacterId);
  
  // WAVE 6: Listener cleanup on character switch
  const listenerRef = useRef<{ unsubscribe: () => Promise<void> } | null>(null);

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
        (payload: any) => {
          // Solo procesar si es el character activo
          if (payload.new?.id === characterId) {
            const char = payload.new.data as Character;
            setCharacters(prev => prev.map(c => c.id === characterId ? char : c));
            console.log(`[App] Updated via listener: ${characterId}`);
          }
        },
        (broadcastChar: any) => {
          if (broadcastChar?.id === characterId) {
            const char = broadcastChar as Character;
            setCharacters(prev => prev.map(c => c.id === characterId ? char : c));
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

  // WAVE 6: useEffect to subscribe/cleanup when active character changes
  useEffect(() => {
    if (activeCharacter?.id && activeCharacter?.party_id) {
      subscribeToActiveCharacter(activeCharacter.id, activeCharacter.party_id);
    }

    return () => {
      // Cleanup on unmount or character change is handled in subscribeToActiveCharacter
    };
  }, [activeCharacter?.id, activeCharacter?.party_id, isLocalMode, isAuthenticated]);
  
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
  const isDuplicateEvent = (characterId: string, timestamp: number): boolean => {
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
  };

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
            console.log('[Sync] Iniciando sincronización desde cloud...');
            
            const cloudChars = await fetchCharactersFromCloud(user.id);
            
            if (cloudChars && cloudChars.length > 0) {
                console.log(`[Sync] Encontrados ${cloudChars.length} personajes en cloud`);
                
                setCharacters(prev => {
                    const merged = [...prev];
                    let updated = false;
                    
                    for (const cloudChar of cloudChars) {
                      // Cloud es la fuente de verdad para personajes activos (deleted_at = null).
                      // Si aparece aquí, eliminamos cualquier marca local obsoleta de borrado.
                      if (deletedCharacterIds.has(cloudChar.id)) {
                        console.log(`[Sync] Restaurando personaje activo desde cloud: ${cloudChar.name}`);
                        setDeletedCharacterIds(prev => {
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
                        
                        const localIndex = merged.findIndex(c => c.id === cloudChar.id);
                        
                        if (localIndex === -1) {
                            console.log(`[Sync] Agregando personaje del cloud: ${cloudChar.name}`);
                            merged.push({ ...cloudChar, syncTimestamp: Date.now() });
                            updated = true;
                        } else {
                            const localChar = merged[localIndex];
                            const localTime = localChar.syncTimestamp || 0;
                            const cloudTime = cloudChar.syncTimestamp || (cloudChar.updated_at ? new Date(cloudChar.updated_at).getTime() : 0);
                            
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
                setCharacters(prev => {
                    const toUpload = prev.map(c => ({ ...c, syncTimestamp: Date.now() }));
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
            setTimeout(() => {
                setIsSyncing(false);
                setSyncMessage('');
            }, 1500);
            console.log('[Sync] Sincronización completada');
        };
        syncFromCloud();
    }
  }, [isAuthenticated, user]);

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
        backButtonListener.then(listener => listener.remove());
      };
    }
  }, [view]);

  // Persist characters to localStorage and Supabase
  useEffect(() => {
    const saveData = setTimeout(async () => {
        try {
            // Local Save
            const dataToSave = JSON.stringify(characters);
            localStorage.setItem('dnd-characters', dataToSave);

            // Cloud Save - Solo si está autenticado
            if (isAuthenticated && user?.id && !user.id.includes('mock')) {
                setIsSyncing(true);
                setSyncMessage('Guardando...');
                
                for (const char of characters) {
                    const charWithTimestamp = { 
                        ...char, 
                        syncTimestamp: Date.now() 
                    };
                    await saveCharacterToCloud(charWithTimestamp, user.id);
                }
                
                setSyncMessage('¡Guardado!');
                setTimeout(() => {
                    setIsSyncing(false);
                    setSyncMessage('');
                }, 1000);
            }
        } catch (error) {
            console.error("Failed to save characters:", error);
            if (error instanceof Error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                alert("⚠️ Memory Alert! Local storage is full.");
            }
        }
    }, 300);
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
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (activeCharacterId === id) setActiveCharacterId(null);
    
    // Track deletion to prevent restoration after reload
    const newDeleted = new Set(deletedCharacterIds);
    newDeleted.add(id);
    setDeletedCharacterIds(newDeleted);
    try {
      localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
    } catch (e) {
      console.error("Failed to save deleted characters list:", e);
    }
    
    // Only sync deletion with Supabase if not in local mode
    if (!isLocalMode && isAuthenticated && user?.id && !user.id.includes('mock')) {
      const success = await softDeleteCharacter(id);
      if (!success) {
        console.error('[Delete] Soft delete failed, trying hard delete');
        supabase.from('characters').delete().eq('id', id).then();
      }
    }
  };

  const handleFinishCreation = (newChar: Character) => {
    setCharacters(prev => [newChar, ...prev]);
    setActiveCharacterId(newChar.id);
    setView('sheet');
  };

    // Real-time synchronization for the Observer View
    useEffect(() => {
        if (!observedCharacter || view !== 'observer-sheet') return;

        const subscription = subscribeWithRetry(
            observedCharacter.party_id || 'no-party',
            (payload: any) => {
                if (payload.new?.id === observedCharacter.id) {
                    const char = payload.new.data as Character;
                    const timestamp = char.syncTimestamp || Date.now();
                    
                    // Skip if this is a duplicate event from another listener
                    if (isDuplicateEvent(char.id, timestamp)) {
                        console.log(`[Observer] Postgres change - DUPLICATE IGNORED: ${char.id}`);
                        return;
                    }
                    
                    console.log(`[Observer] Postgres change processed: ${char.id}`);
                    setObservedCharacter(char);
                }
            },
            (broadcastChar: any) => {
                if (broadcastChar && broadcastChar.id === observedCharacter.id) {
                    const timestamp = broadcastChar.syncTimestamp || Date.now();
                    
                    // Skip if this is a duplicate event from another listener
                    if (isDuplicateEvent(broadcastChar.id, timestamp)) {
                        console.log(`[Observer] Broadcast - DUPLICATE IGNORED: ${broadcastChar.id}`);
                        return;
                    }
                    
                    console.log(`[Observer] Broadcast processed: ${broadcastChar.id}`);
                    setObservedCharacter(broadcastChar as Character);
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
    }, [observedCharacter?.id, view]);
    
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
                setCharacters(prev => prev.filter(c => c.id !== char.id));
                setDeletedCharacterIds(prev => {
                    const newDeleted = new Set(prev);
                    newDeleted.add(char.id);
                    try {
                        localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
                    } catch (e) {}
                    return newDeleted;
                });
            } else {
                console.log('[Cloud Realtime] Update processed:', char.id);
                setCharacters(prev => {
                    const localChar = prev.find(c => c.id === char.id);
                    const localTime = localChar?.syncTimestamp || 0;
                    if ((char.syncTimestamp || 0) > localTime) {
                        console.log('[Cloud Realtime] Updating local with cloud version:', char.name);
                        return prev.map(c => c.id === char.id ? char : c);
                    }
                    return prev;
                });
            }
        });

        return unsubscribe;
    }, [isAuthenticated, user?.id]);
    
    // Suscripción a recursos compartidos de la fiesta — Firebase RTDB
    useEffect(() => {
        if (!activeCharacter?.party_id) return;

        const unsubscribe = subscribeToPartyResources(activeCharacter.party_id, (resource) => {
            if (resource) {
                console.log('[PartyResources] Shared Resource received:', resource.name);
                setSharedResource(resource);
            } else {
                console.log('[PartyResources] Resource hidden');
                setSharedResource(null);
            }
        });

        return unsubscribe;
    }, [activeCharacter?.party_id]);

  const handleCharacterUpdate = useCallback((updatedChar: Partial<Character> | Character) => {
    if (!activeCharacter) return;
    
    const isPartial = !('class' in updatedChar) || !('id' in updatedChar);
    const fullUpdate: Character = isPartial 
        ? { ...activeCharacter, ...updatedChar } as Character
        : updatedChar as Character;
    
    setCharacters(prev => prev.map(c => c.id === fullUpdate.id ? fullUpdate : c));
    setActiveCharacterId(fullUpdate.id);
    
    if (fullUpdate.party_id) {
        broadcastCharacterUpdate(fullUpdate.party_id, fullUpdate);
    }
  }, [activeCharacter]);

  const handleDMCharacterUpdate = async (updatedChar: Character) => {
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
      const saveCallback = async (character: Character): Promise<{ data: { id: string }, error: null }> => {
        const ownerId = (character as CharacterWithOwner).user_id || user?.id || 'guest';
        
        // Crear handler para rollback si falla el save
        const handleRollback = (snapshot: Character) => {
          setCharacters(prev => 
            prev.map(c => c.id === snapshot.id ? snapshot : c)
          );
          console.error('[BatchSave] Rollback applied for:', snapshot.id);
        };

        // Guardar con capacidad de rollback
        return await saveCharacterWithRollback(character, ownerId, handleRollback);
      };

      // Ejecutar batch save con el callback
      const result = await batchSaveCharacters(updates, saveCallback);

      // Actualizar characters locales con los que se guardaron exitosamente
      setCharacters(prev => {
        let modified = [...prev];
        for (const successful of result.successful) {
          const idx = modified.findIndex(c => c.id === successful.id);
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
        console.log('[BatchSave] All characters saved successfully:', { successful: result.successful.length, time: result.totalTime });
      } else {
        // Algunos fallaron
        const message = `⚠️ ${result.successful.length} guardado${result.successful.length !== 1 ? 's' : ''}, ${result.failed.length} fallo${result.failed.length !== 1 ? 's' : ''}`;
        syncStatus.showError(message);
        console.warn('[BatchSave] Batch completed with failures:', { successful: result.successful.length, failed: result.failed.length });
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
      console.error("Failed to clear session:", e);
    }

    // Sign out from Supabase only if not in local mode
    if (!isLocalMode) {
      await supabase.auth.signOut();
    }

    setIsAuthenticated(false);
    setIsLocalMode(false);
    setUser(null);
    setView('list');
  };

  const handleExportCharacters = () => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", "dnd_characters_" + new Date().toISOString().slice(0,10) + ".json");
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
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = event => {
        try {
          if (!event.target?.result) return;
          const parsed = JSON.parse(event.target.result as string);
          
          // Validate structure: must be array with objects having required fields
          const isValidCharacter = (c: any): boolean => {
            return (
              c && 
              typeof c === 'object' &&
              typeof c.name === 'string' &&
              c.name.trim().length > 0 &&
              typeof c.class === 'string' &&
              c.class.trim().length > 0 &&
              typeof c.level === 'number' &&
              c.level > 0 &&
              c.hp && 
              typeof c.hp.current === 'number' &&
              typeof c.hp.max === 'number'
            );
          };

          if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidCharacter)) {
              if (window.confirm(`Found ${parsed.length} characters. Merge?`)) {
                  const newChars = parsed.map(c => ({
                      ...c, 
                      id: "imp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 11)
                  }));
                  setCharacters(prev => [...prev, ...newChars]);
              }
          } else {
            alert("Invalid file format. Please select a valid character export file.");
          }
        } catch (err) {
          alert("Error reading file.");
        } finally {
            fileInput.value = '';
        }
      };
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
          <div className={`mx-auto ${isLandscape ? 'max-w-none' : 'max-w-md'} bg-background-light dark:bg-background-dark shadow-2xl min-h-screen relative overflow-hidden`}>
            
            {/* OTA Update Modal with Progress */}
            {updateAvailable && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 w-full max-w-xs shadow-2xl border border-primary/20 text-center animate-slideUp">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¡Instalando Parche Mágico!</h2>
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
                    {downloadProgress === 100 ? 'Descarga completada. Reiniciando...' : 'Descargando actualización...'}
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
                    // Trigger update check again
                    if (Capacitor.getPlatform() !== 'web') {
                      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
                        if (isActive) {
                          // checkForUpdates will be called in the interval
                        }
                      });
                    }
                  }
                }}
              />
            )}

            {/* Sync Indicator */}
            {isAuthenticated && (
                <div className="absolute top-4 right-12 z-50 flex items-center gap-1.5 bg-background-dark/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    {isSyncing ? (
                        <>
                            <span className="material-symbols-outlined text-[10px] text-primary animate-spin">sync</span>
                            <span className="text-[8px] font-black uppercase text-white/50 tracking-tighter animate-pulse">
                                {syncMessage || 'Sincronizando...'}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[10px] text-green-500">cloud_done</span>
                            <span className="text-[8px] font-black uppercase text-white/30 tracking-tighter">Sincronizado</span>
                        </>
                    )}
                </div>
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
                    onExport={handleExportCharacters}
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
                <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-primary"><span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span></div>}>
                  {view === 'create' && (
                    <CreatorSteps 
                      onBack={() => setView('list')} 
                      onFinish={handleFinishCreation} 
                    />
                  )}
                  {view === 'sheet' && activeCharacter && (
                    <SheetTabs 
                      character={activeCharacter} 
                      onBack={() => setView('list')}
                      onUpdate={handleCharacterUpdate}
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

                {/* Botón de migración — solo visible en la lista de personajes */}
                {view === 'list' && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <button
                      onClick={() => setShowMigrationTool(true)}
                      className="text-[10px] text-white/20 hover:text-white/50 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined" style={{fontSize: '10px'}}>sync_alt</span>
                      Migrar datos de Supabase
                    </button>
                  </div>
                )}

                {/* Modal de migración Supabase → Firebase */}
                {showMigrationTool && user && (
                  <Suspense fallback={null}>
                    <MigrationTool
                      currentUserId={user.id}
                      currentUserEmail={user.name?.includes('@') ? user.name : null}
                      onClose={() => {
                        setShowMigrationTool(false);
                        if (typeof window !== 'undefined') window.location.reload();
                      }}
                    />
                  </Suspense>
                )}
              </>
            )}
          </div>
            {/* Shared Resource Splash Modal */}
            {sharedResource && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
                    <div className="relative w-full max-w-sm aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl animate-scaleIn">
                        <img src={sharedResource.url} alt={sharedResource.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        
                        <div className="absolute bottom-10 inset-x-8 space-y-3">
                            <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase px-2 py-1 rounded-full border border-blue-500/20 tracking-widest">Shared Resource</span>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">{sharedResource.title}</h2>
                            {sharedResource.description && <p className="text-sm font-medium text-slate-300 leading-tight">{sharedResource.description}</p>}
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
