import React, { useState, useEffect, Suspense, lazy } from 'react';
// Deploy Trigger: Syntax verification commit
import { Character, ViewState } from './types';
import { MOCK_CHARACTERS } from './constants';
import CharacterList from './components/CharacterList';
import Login from './components/Login';

import { 
    supabase, 
    saveCharacterToCloud, 
    fetchCharactersFromCloud, 
    subscribeToParty, 
    broadcastCharacterUpdate 
} from './utils/supabase';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';


import { LanguageProvider } from './hooks/useLanguage';

const CreatorSteps = lazy(() => import('./components/CreatorSteps'));
const SheetTabs = lazy(() => import('./components/SheetTabs'));
const DMDashboard = lazy(() => import('./components/DMDashboard'));

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [isSyncing, setIsSyncing] = useState(false);
  const [user, setUser] = useState<{name: string, id: string} | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<{version: string, message: string, payload: any} | null>(null);

  // Auto-Restart when update is read
  useEffect(() => {
    if (updateAvailable) {
      const timer = setTimeout(async () => {
        localStorage.setItem('app_version', updateAvailable.version);
        await CapacitorUpdater.set(updateAvailable.payload);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable]);

  // Monitor Auth Changes
  useEffect(() => {
    let otaCleanup: (() => void) | null = null;
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({ name: session.user.email || 'Adventurer', id: session.user.id });
        setIsAuthenticated(true);
        localStorage.setItem('df_session', JSON.stringify({ user: session.user.email, id: session.user.id }));
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
            const data = await resp.json();
            
            // Log local stored version
            const currentVersion = localStorage.getItem('app_version') || '1.0.0';
            
            if (data.version && data.version !== currentVersion) {
              console.log(`Downloading new OTA update: ${data.version}`);
              
              const update = await CapacitorUpdater.download({
                url: data.url,
                version: data.version
              });
              
              // Instead of setting instantly, wait for user confirmation
              setUpdateAvailable({
                version: data.version,
                message: data.message || "Hemos forjado nuevas mejoras para tu aventura.",
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
      });

      // Local cleanup function for OTA
      otaCleanup = () => clearInterval(interval);
    }

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ name: session.user.email || 'Adventurer', id: session.user.id });
        setIsAuthenticated(true);
        localStorage.setItem('df_session', JSON.stringify({ user: session.user.email, id: session.user.id }));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('df_session');
      }
    });

    return () => {
      if (otaCleanup) otaCleanup();
      subscription.unsubscribe();
    };
  }, []);
  
  // Initialize characters from localStorage if available, otherwise use mocks
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('dnd-characters');
      return saved ? JSON.parse(saved) : MOCK_CHARACTERS;
    } catch (e) {
      console.error("Failed to load characters from local storage", e);
      return MOCK_CHARACTERS;
    }
  });

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const activeCharacter = characters.find(c => c.id === activeCharacterId);

  // Sync with Cloud on Login
  useEffect(() => {
    if (isAuthenticated && user?.id && !user.id.includes('mock')) {
        const syncFromCloud = async () => {
            setIsSyncing(true);
            const cloudChars = await fetchCharactersFromCloud(user.id);
            if (cloudChars && cloudChars.length > 0) {
                // Simple merge logic: cloud characters take precedence
                setCharacters(prev => {
                    const localIds = new Set(prev.map(c => c.id));
                    const newFromCloud = cloudChars.filter(c => !localIds.has(c.id));
                    return [...prev, ...newFromCloud];
                });
            }
            setIsSyncing(false);
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

            // Cloud Save
            const syncList = characters.filter(c => (isAuthenticated && !user?.id.includes('mock')) || c.party_id);
            
            if (syncList.length > 0) {
                setIsSyncing(true);
                for (const char of syncList) {
                   await saveCharacterToCloud(char, (char as any).user_id || user?.id || 'guest');
                }
                setIsSyncing(false);
            }
        } catch (error) {
            console.error("Failed to save characters:", error);
            if (error instanceof Error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                alert("⚠️ Memory Alert! Local storage is full.");
            }
        }
    }, 300); // Near-instant (0.3s)
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

  const handleDeleteCharacter = (id: string) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
        setCharacters(prev => prev.filter(c => c.id !== id));
        if (activeCharacterId === id) setActiveCharacterId(null);
        
        // Handle cloud deletion if needed
        if (isAuthenticated && user?.id && !user.id.includes('mock')) {
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
            (broadcastChar: Character) => {
                if (broadcastChar.id === observedCharacter.id) {
                    setObservedCharacter(broadcastChar);
                }
            }
        );

        return () => {
            channel.unsubscribe();
        };
    }, [observedCharacter?.id, view]);
    
    // Manage broadcast channel for active character
    useEffect(() => {
        if (!activeCharacter?.party_id) return;
        
        const channelName = "party-" + activeCharacter.party_id;
        const channel = supabase.channel(channelName).subscribe();
        
        return () => {
            channel.unsubscribe();
        };
    }, [activeCharacter?.party_id]);

  const handleCharacterUpdate = (updatedChar: Character) => {
    // 1. Local update
    setCharacters(prev => prev.map(c => c.id === updatedChar.id ? updatedChar : c));
    
    // 2. Broadcast immediately if in a party (Ultra-low latency)
    if (updatedChar.party_id) {
        broadcastCharacterUpdate(updatedChar.party_id, updatedChar);
    }
  };


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('df_session');
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
          if (Array.isArray(parsed) && parsed.every(c => c.name && c.class)) {
              if (window.confirm(`Found ${parsed.length} characters. Merge?`)) {
                  const newChars = parsed.map(c => ({
                      ...c, 
                      id: "imp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 11)
                  }));
                  setCharacters(prev => [...prev, ...newChars]);
              }
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
    <LanguageProvider>
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
            {isAuthenticated && isSyncing && (
                <div className="absolute top-4 right-12 z-50 animate-pulse flex items-center gap-1.5 bg-background-dark/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                    <span className="material-symbols-outlined text-[10px] text-primary animate-spin">sync</span>
                    <span className="text-[8px] font-black uppercase text-white/50 tracking-tighter">Cloud Syncing</span>
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
                      onBack={() => setView('dm-dashboard')}
                      onUpdate={() => {}} // No-op
                    />
                  )}
                </Suspense>
              </>
            )}
          </div>
        </div>
    </LanguageProvider>
  );
};

export default App;
