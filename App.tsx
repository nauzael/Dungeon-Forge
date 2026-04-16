import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
// Deploy Trigger: Syntax verification commit
import { Character, ViewState, SharedResourceEvent, OTAUpdate, VersionJsonResponse, CharacterWithOwner } from './types';
import { MOCK_CHARACTERS } from './constants';
import CharacterList from './components/CharacterList';
import Login from './components/Login';
import { migrateCharacters } from './utils/characterMigrations';

import { 
    supabase, 
    saveCharacterToCloud, 
    fetchCharactersFromCloud, 
    subscribeToParty, 
    broadcastCharacterUpdate,
    softDeleteCharacter 
} from './utils/supabase';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

const CreatorSteps = lazy(() => import('./components/CreatorSteps'));
const SheetTabs = lazy(() => import('./components/SheetTabs'));
const DMDashboard = lazy(() => import('./components/DMDashboard'));

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [sharedResource, setSharedResource] = useState<SharedResourceEvent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [user, setUser] = useState<{name: string, id: string} | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<OTAUpdate | null>(null);

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
        // If the URL contains a hash with a session or access token, pass it to window so supabase can parse it
        if (url.includes('access_token=') || url.includes('refresh_token=')) {
          const params = url.split('#')[1] || url.split('?')[1];
          // Manually replace URL and force reload so Supabase onAuthStateChange initializes immediately
          if (params) {
              window.location.href = `/#${params}`;
              setTimeout(() => window.location.reload(), 100);
          }
        }
      });

      // --- OTA UPDATES (Capgo Self-Hosted) ---
      CapacitorUpdater.notifyAppReady();

      const checkForUpdates = async () => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
          // Fetch the version.json from our public 'updates' bucket
          const resp = await fetch(`${supabaseUrl}/storage/v1/object/public/updates/version.json?t=${Date.now()}`);
          
          if (resp.ok) {
            const data: VersionJsonResponse = await resp.json();
            
            // Log local stored version
            const currentVersion = localStorage.getItem('app_version') || '1.0.0';
            
            if (data.version && data.version !== currentVersion && data.url) {
              console.log(`Downloading new OTA update: ${data.version}`);
              
              const update = await CapacitorUpdater.download({
                url: data.url,
                version: data.version
              });
              
              // Instead of setting instantly, wait for user confirmation
              setUpdateAvailable({
                version: data.version,
                message: data.message || "New improvements have been forged for your adventure.",
                payload: update
              });
            }
          }
        } catch (e) {
          console.error("Failed to fetch OTA update:", e);
        }
      };

      // Check on startup
      checkForUpdates();

      // Check every 10 minutes if the app remains open
      const interval = setInterval(checkForUpdates, 10 * 60 * 1000);

      // Check when the app returns from background
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) checkForUpdates();
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
      if (session) {
        setUser({ name: session.user.email || 'Adventurer', id: session.user.id });
        setIsAuthenticated(true);
        try {
          localStorage.setItem('df_session', JSON.stringify({ user: session.user.email, id: session.user.id }));
        } catch (e) {
          console.error("Failed to save session:", e);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        try {
          localStorage.removeItem('df_session');
        } catch (e) {
          console.error("Failed to remove session:", e);
        }
      }
    });

    return () => {
      if (otaCleanup) otaCleanup();
      subscription.unsubscribe();
    };
  }, []);
  
  // Initialize characters from localStorage if available, otherwise use mocks
  // Apply migrations to existing characters on load
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('dnd-characters');
      const loaded: Character[] = saved ? JSON.parse(saved) : MOCK_CHARACTERS;
      const { characters: migratedChars } = migrateCharacters(loaded);
      return migratedChars;
    } catch (e) {
      console.error("Failed to load characters from local storage", e);
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
  
  // Pending uploads queue for sync
  const pendingUploads = useRef<Character[]>([]);

  // Sync with Cloud on Login - Merge Inteligente
  useEffect(() => {
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
                        // Skip if this character was deleted locally
                        if (deletedCharacterIds.has(cloudChar.id)) {
                            console.log(`[Sync] Saltando personaje eliminado localmente: ${cloudChar.name}`);
                            continue;
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
    
    if (isAuthenticated && user?.id && !user.id.includes('mock')) {
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

        const channel = subscribeToParty(
            observedCharacter.party_id || 'no-party',
            (payload: any) => {
                if (payload.new?.id === observedCharacter.id) {
                    setObservedCharacter(payload.new.data as Character);
                }
            },
            (broadcastChar: any) => {
                if (broadcastChar && broadcastChar.id === observedCharacter.id) {
                    setObservedCharacter(broadcastChar as Character);
                }
            }
        );

        return () => {
            channel.unsubscribe();
        };
    }, [observedCharacter?.id, view]);
    
    // Real-time sync for own characters (from other devices)
    useEffect(() => {
        if (!isAuthenticated || !user?.id || user.id.includes('mock')) return;

        const channel = supabase
            .channel('my-characters-sync')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'characters',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                console.log('[Realtime] Character change from cloud:', payload);
                
                if (payload.eventType === 'DELETE') {
                    const deletedId = payload.old?.id;
                    if (deletedId) {
                        console.log('[Realtime] Character deleted from cloud:', deletedId);
                        setCharacters(prev => prev.filter(c => c.id !== deletedId));
                        const newDeleted = new Set(deletedCharacterIds);
                        newDeleted.add(deletedId);
                        setDeletedCharacterIds(newDeleted);
                        try {
                          localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
                        } catch (e) {}
                    }
                    return;
                }
                
                if (payload.eventType === 'UPDATE' && payload.new?.data) {
                    if (payload.new.deleted_at) {
                        const deletedId = payload.new.id;
                        console.log('[Realtime] Character marked as deleted in cloud:', deletedId);
                        setCharacters(prev => prev.filter(c => c.id !== deletedId));
                        const newDeleted = new Set(deletedCharacterIds);
                        newDeleted.add(deletedId);
                        setDeletedCharacterIds(newDeleted);
                        try {
                          localStorage.setItem('df-deleted-characters', JSON.stringify([...newDeleted]));
                        } catch (e) {}
                        return;
                    }
                    
                    const cloudChar = payload.new.data as Character;
                    const cloudTime = cloudChar.syncTimestamp || (payload.new.updated_at ? new Date(payload.new.updated_at).getTime() : 0);
                    
                    setCharacters(prev => {
                        const localChar = prev.find(c => c.id === cloudChar.id);
                        const localTime = localChar?.syncTimestamp || 0;
                        
                        if (cloudTime > localTime) {
                            console.log('[Realtime] Updating local with cloud version:', cloudChar.name);
                            return prev.map(c => c.id === cloudChar.id ? { ...cloudChar, syncTimestamp: Date.now() } : c);
                        }
                        return prev;
                    });
                }
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [isAuthenticated, user?.id]);
    
    // Manage broadcast channel for active character
    useEffect(() => {
        if (!activeCharacter?.party_id) return;
        
        const channelName = "party-" + activeCharacter.party_id;
        const channel = supabase.channel(channelName);

        channel.on('broadcast', { event: 'resource-share' }, (payload) => {
            console.log("[Broadcast] Shared Resource received:", payload.payload.resource);
            setSharedResource(payload.payload.resource);
        }).on('broadcast', { event: 'resource-hide' }, () => {
            console.log("[Broadcast] Resource Hide received");
            setSharedResource(null);
        });

        channel.subscribe();
        
        return () => {
            channel.unsubscribe();
        };
    }, [activeCharacter?.party_id]);

  const handleCharacterUpdate = (updatedChar: Partial<Character> | Character) => {
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
  };

  const handleDMCharacterUpdate = async (updatedChar: Character) => {
    // 1. Update the local observed character state
    setObservedCharacter(updatedChar);

    // 2. Persist to cloud (Supabase)
    // We try to preserve the original owner user_id if we have it in the character data
    const ownerId = (updatedChar as CharacterWithOwner).user_id || user?.id || 'guest'; 
    await saveCharacterToCloud(updatedChar, ownerId);

    // 3. Broadcast to the party
    if (updatedChar.party_id) {
        broadcastCharacterUpdate(updatedChar.party_id, updatedChar);
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem('df_session');
    } catch (e) {
      console.error("Failed to remove session:", e);
    }
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
          <div className="mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl min-h-screen relative overflow-hidden">
            
            {/* OTA Update Spinner / Modal */}
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
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 uppercase tracking-widest font-bold">Reiniciando automáticamente...</p>
                </div>
              </div>
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
              <Login />
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

    </div>
  );
};

export default App;
