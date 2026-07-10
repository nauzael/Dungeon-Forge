import React, { useEffect, useState } from 'react';

export type SyncState = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncStatusProps {
  state: SyncState;
  message?: string;
  characterName?: string;
  onClose?: () => void;
}

/**
 * SyncStatus Component
 * Displays synchronization status (idle, syncing, success, error)
 * Positioned bottom-right (fixed), auto-dismisses on success, persistent on error
 */
const SyncStatus: React.FC<SyncStatusProps> = ({
  state,
  message,
  characterName,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(state !== 'idle');

  // Update visibility when state changes
  useEffect(() => {
    setIsVisible(state !== 'idle');

    // Auto-dismiss on success after 3 seconds
    if (state === 'success') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state, onClose]);

  if (!isVisible) return null;

  // Get icon, background color, and text based on state
  const config = {
    syncing: {
      icon: 'cloud_upload',
      bgColor: 'bg-blue-500/90',
      textColor: 'text-white',
      borderColor: 'border-blue-400/30',
      label: `Saving ${characterName || 'character'}...`,
      showSpinner: true,
      persistent: false,
    },
    success: {
      icon: 'check_circle',
      bgColor: 'bg-green-500/90',
      textColor: 'text-white',
      borderColor: 'border-green-400/30',
      label: `Synced ${characterName || 'character'}`,
      showSpinner: false,
      persistent: false,
    },
    error: {
      icon: 'error',
      bgColor: 'bg-red-500/90',
      textColor: 'text-white',
      borderColor: 'border-red-400/30',
      label: `Error: ${message || 'Sync failed'}`,
      showSpinner: false,
      persistent: true,
    },
  }[state];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[200]
        ${config.bgColor} ${config.textColor} px-4 py-3 rounded-radius-md
        shadow-xl flex items-center gap-3 max-w-sm
        border ${config.borderColor}
        animate-slideUp
      `}
    >
      {/* Icon with spinner for syncing state */}
      <span
        className={`material-symbols-outlined text-lg flex-shrink-0 ${
          config.showSpinner ? 'animate-spin' : ''
        }`}
      >
        {config.icon}
      </span>

      {/* Message */}
      <div className="flex-1">
        <p className="text-sm font-medium">{config.label}</p>
      </div>

      {/* Close button for persistent errors */}
      {config.persistent && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </div>
  );
};

export default SyncStatus;
