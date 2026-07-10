import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface DialogOptions {
  type: 'alert' | 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
  icon?: string;
}

interface DialogState {
  open: boolean;
  options: DialogOptions;
  resolve: (value: boolean) => void;
}

interface DialogContextType {
  showAlert: (message: string, title?: string) => Promise<void>;
  showConfirm: (message: string, title?: string) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = (): DialogContextType => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used within <DialogProvider>');
  return ctx;
};

const DEFAULT_OPTIONS: DialogOptions = {
  type: 'alert',
  title: '',
  message: '',
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DialogState | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback(() => {
    setState(null);
    resolveRef.current = null;
  }, []);

  const showAlert = useCallback(async (message: string, title?: string): Promise<void> => {
    return new Promise((resolve) => {
      resolveRef.current = () => resolve();
      setState({
        open: true,
        options: { ...DEFAULT_OPTIONS, type: 'alert', title: title || '', message, confirmText: 'OK' },
        resolve: () => { resolve(); close(); },
      });
    });
  }, [close]);

  const showConfirm = useCallback(async (message: string, title?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        options: { ...DEFAULT_OPTIONS, type: 'confirm', title: title || '', message, confirmText: 'Confirm', cancelText: 'Cancel' },
        resolve: (value: boolean) => { resolve(value); close(); },
      });
    });
  }, [close]);

  const handleConfirm = useCallback(() => {
    if (state?.resolve) {
      state.resolve(true);
    }
  }, [state]);

  const handleCancel = useCallback(() => {
    if (state?.resolve) {
      state.resolve(false);
    }
  }, [state]);

  const options = state?.options;
  const isDestructive = options?.variant === 'destructive';
  const isWarning = options?.variant === 'warning';

  const iconMap: Record<string, string> = {
    warning: 'warning',
    error: 'error',
    success: 'check_circle',
    info: 'info',
  };

  const iconName = options?.icon || (options?.type === 'confirm' ? 'help' : 'info');

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {state?.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 dark:bg-black/60 animate-fadeIn backdrop-blur-sm"
          onClick={handleCancel}
        >
          <div
            className="w-[calc(100%-2rem)] sm:max-w-sm bg-white dark:bg-[#0f1525] rounded-radius-xl shadow-2xl animate-slideUp overflow-hidden border border-slate-200 dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 space-y-4">
              {options?.title && (
                <div className="flex items-center gap-3">
                  {iconName && (
                    <div className={`w-10 h-10 rounded-radius-pill flex items-center justify-center shrink-0
                      ${isDestructive ? 'bg-red-100 dark:bg-red-900/30' : 
                        isWarning ? 'bg-amber-100 dark:bg-amber-900/30' : 
                        'bg-blue-100 dark:bg-blue-900/30'}`}
                    >
                      <span className={`material-symbols-outlined text-xl
                        ${isDestructive ? 'text-red-600 dark:text-red-400' : 
                          isWarning ? 'text-amber-600 dark:text-amber-400' : 
                          'text-blue-600 dark:text-blue-400'}`}
                      >
                        {iconName}
                      </span>
                    </div>
                  )}
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    {options.title}
                  </h3>
                </div>
              )}
              
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {options?.message}
              </p>

              <div className="flex gap-2 pt-1">
                {options?.type === 'confirm' && (
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2.5 rounded-radius-lg font-bold text-sm bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                  >
                    {options?.cancelText || 'Cancel'}
                  </button>
                )}
                <button
                  onClick={options?.type === 'confirm' ? handleConfirm : handleConfirm}
                  className={`flex-1 py-2.5 rounded-radius-lg font-bold text-sm text-white transition-colors ${
                    isDestructive
                      ? 'bg-red-500 hover:bg-red-600'
                      : isWarning
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  autoFocus
                >
                  {options?.confirmText || 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};
