import React from 'react';
import { useSyncStatus } from '../contexts/SyncContext';

/**
 * Task 3-2: Toast component for sync status feedback
 * Shows visual feedback for syncing, success, and error states
 */
export const SyncToast: React.FC = () => {
  const { status } = useSyncStatus();

  // Don't render if idle
  if (status.state === 'idle') return null;

  const getIcon = () => {
    switch (status.state) {
      case 'syncing':
        return <span className="animate-spin">⏳</span>;
      case 'success':
        return <span>✓</span>;
      case 'error':
        return <span>✗</span>;
      default:
        return null;
    }
  };

  const getClassName = () => {
    const base = 'fixed bottom-4 right-4 px-4 py-3 rounded-radius-sm shadow-elev-modal flex gap-2 items-center text-white z-50 transition-all duration-motion-base';
    const states = {
      syncing: 'bg-blue-500',
      success: 'bg-green-500',
      error: 'bg-red-500',
      idle: 'hidden',
    };
    return `${base} ${states[status.state]}`;
  };

  return (
    <div className={getClassName()}>
      <span className="text-lg font-semibold">
        {getIcon()}
      </span>
      <span className="text-sm font-medium">
        {status.message || 'Sincronizando...'}
      </span>
    </div>
  );
};

export default SyncToast;
