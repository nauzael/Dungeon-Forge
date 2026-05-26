import React, { useState, createContext, useCallback } from 'react';

export type SyncState = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncStatus {
  state: SyncState;
  message?: string;
  characterId?: string;
  timestamp: number;
}

export interface SyncContextType {
  status: SyncStatus;
  setStatus: (status: SyncStatus) => void;
  showSync: () => void;
  showSuccess: (message?: string) => void;
  showError: (message: string, characterId?: string) => void;
  showIdle: () => void;
}

/**
 * Task 3-2: Context for sync status management across the app
 * Provides sync state (idle, syncing, success, error) and helper methods
 */
export const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: React.ReactNode;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const [status, setStatus] = useState<SyncStatus>({
    state: 'idle',
    timestamp: Date.now(),
  });

  const showSync = useCallback(() => {
    setStatus({
      state: 'syncing',
      message: 'Guardando...',
      timestamp: Date.now(),
    });
  }, []);

  const showSuccess = useCallback((message?: string) => {
    setStatus({
      state: 'success',
      message: message || 'Guardado',
      timestamp: Date.now(),
    });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setStatus(prev => 
        prev.state === 'success' 
          ? { state: 'idle', timestamp: Date.now() }
          : prev
      );
    }, 3000);
  }, []);

  const showError = useCallback((message: string, characterId?: string) => {
    setStatus({
      state: 'error',
      message: `Error: ${message}`,
      characterId,
      timestamp: Date.now(),
    });
  }, []);

  const showIdle = useCallback(() => {
    setStatus({
      state: 'idle',
      timestamp: Date.now(),
    });
  }, []);

  const value: SyncContextType = {
    status,
    setStatus,
    showSync,
    showSuccess,
    showError,
    showIdle,
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

/**
 * Hook to use sync status context
 * Must be used within SyncProvider
 */
export function useSyncStatus(): SyncContextType {
  const context = React.useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncStatus must be used within SyncProvider');
  }
  return context;
}
