import React, { useEffect, useState } from 'react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // ms, 0 = persistent
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast Notification Component
 * Displays temporary notifications at top of screen
 * Supports error, success, info, warning types
 */
const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return; // Persistent

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    error: 'bg-red-500/90',
    success: 'bg-green-500/90',
    info: 'bg-blue-500/90',
    warning: 'bg-amber-500/90',
  }[type];

  const icon = {
    error: 'error',
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
  }[type];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-[200]
        ${bgColor} text-white px-4 py-3 rounded-lg
        shadow-xl flex items-center gap-3 max-w-sm
        animate-slideDown border border-white/20
      `}
    >
      <span className="material-symbols-outlined text-lg flex-shrink-0">
        {icon}
      </span>
      
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {action && (
        <button
          onClick={() => {
            action.onClick();
            handleClose();
          }}
          className="px-3 py-1 text-xs font-bold bg-white/20 hover:bg-white/30 rounded transition-colors flex-shrink-0"
        >
          {action.label}
        </button>
      )}

      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
};

export default Toast;
