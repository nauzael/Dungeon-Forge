import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
// Deploy Trigger: Syntax verification commit
import {
  Character,
  ViewState,
} from './types';
import CharacterList from './src/components/CharacterList';
import Login from './src/components/Login';
import Toast from './src/components/Toast';
import { STORAGE_KEY_SESSION, STORAGE_KEY_APP_VERSION } from './src/constants';
import { useResponsive } from './hooks/useResponsive';
import { useAuth } from './src/hooks/useAuth';
import { useCharacters } from './src/hooks/useCharacters';
import { useSync } from './src/hooks/useSync';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SyncProvider, useSyncStatus, SyncContextType } from './src/contexts/SyncContext';
import { DialogProvider, useDialog } from './src/contexts/DialogContext';
import SyncToast from './src/components/SyncToast';

const CreatorSteps = lazy(() => import('./src/components/CreatorSteps'));
const SheetTabs = lazy(() => import('./src/components/SheetTabs'));
const DMDashboard = lazy(() => import('./src/components/DMDashboard'));

const AppContent: React.FC<{ syncStatus: SyncContextType }> = ({ syncStatus }) => {
  const dialog = useDialog();
  // 🚀 V1.6 VERIFICATION MARKER - New OAuth popup flow

  const [view, setView] = useState<ViewState>('list');
  const syncFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
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
  } = useAuth(setView, syncFeedbackTimerRef);

  // Responsive hook for landscape/portrait detection
  const { orientation } = useResponsive();
  const isLandscape = orientation === 'landscape';

  // Auto-Restart when update is read
  useEffect(() => {
    if (updateAvailable) {
      const timer = setTimeout(async () => {
        try {
          localStorage.setItem(STORAGE_KEY_APP_VERSION, updateAvailable.version);
        } catch (e) {
          console.warn('Failed to persist app version:', e);
        }
        await CapacitorUpdater.set({ id: (updateAvailable.payload as { id: string }).id });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [updateAvailable]);



  const {
    characters, setCharacters,
    activeCharacterId, setActiveCharacterId, activeCharacter,
    deletedCharacterIds, setDeletedCharacterIds,
    observedCharacter, setObservedCharacter,
    handleExportCharacters,
  } = useCharacters();

  const {
    isSyncing, syncMessage, showSyncFeedback,
    sharedResource, setSharedResource,
    handleCharacterUpdate, handleFastUpdate,
    handleDMCharacterUpdate, handleDeleteCharacter,
  } = useSync({
    characters, setCharacters,
    activeCharacterId, setActiveCharacterId, activeCharacter,
    deletedCharacterIds, setDeletedCharacterIds,
    observedCharacter, setObservedCharacter,
    isAuthenticated, isLocalMode, user,
    view, setView,
    syncStatus, dialog,
    syncFeedbackTimerRef,
  });

  // Handle system back gesture (Android hardware back button, iOS swipe back)
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'web') {
      const backButtonListener = CapacitorApp.addListener('backButton', () => {
        // If we're not on the list view, go back to list
        if (view !== 'list') {
          setView('list');
          setActiveCharacterId(null);
        } else {
          // If we're on the list view, exit the app
          CapacitorApp.exitApp();
        }
      });

      return () => {
        backButtonListener.then((listener) => listener.remove());
      };
    }
  }, [view]);



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

  const handleFinishCreation = (newChar: Character) => {
    setCharacters((prev) => [newChar, ...prev]);
    setActiveCharacterId(newChar.id);
    setView('sheet');
  };







  const handleImportCharacters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');
      fileReader.onload = async (event) => {
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
            if (await dialog.showConfirm(`Found ${parsed.length} characters. Merge?`, 'Import Characters')) {
              const newChars = parsed.map((c: unknown) => ({
                ...(c as Record<string, unknown>),
                id: 'imp-' + Date.now() + '-' + crypto.randomUUID(),
              })) as Character[];
              setCharacters((prev) => [...prev, ...newChars]);
            }
          } else {
            await dialog.showAlert('Invalid file format.', 'Please select a valid character export file.');
          }
        } catch {
          await dialog.showAlert('Error reading file.');
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
            <div className="bg-white dark:bg-surface-dark rounded-radius-2xl p-6 w-full max-w-xs shadow-2xl border border-primary/20 text-center animate-slideUp">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-radius-pill flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                ¡Instalando Parche Mágico!
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 font-medium">
                {updateAvailable.message}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-radius-pill overflow-hidden mb-2">
                <div
                  className="bg-primary h-full transition-all duration-motion-base"
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
          <div className="absolute top-4 right-12 z-50 flex items-center gap-1.5 bg-background-dark/50 backdrop-blur-md px-2 py-1 rounded-radius-pill border border-white/10 transition-opacity duration-motion-base">
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
            className="absolute top-4 right-2 z-50 flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-md px-2 py-1 rounded-radius-pill border border-white/10 transition-colors active:scale-95"
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
              <span className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase px-2 py-1 rounded-radius-pill border border-blue-500/20 tracking-widest">
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
              className="absolute top-6 right-6 size-12 rounded-radius-pill bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
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
      <DialogProvider>
      <SyncProvider>
        <AppContentWithSync />
      </SyncProvider>
      </DialogProvider>
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
