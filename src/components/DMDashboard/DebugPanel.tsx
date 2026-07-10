import React, { useEffect, useState } from 'react';

// Module-level guard: prevents multiple DebugPanel mounts from stacking console patches.
// Survives React Strict Mode double-mount and navigation remounts.
let isConsolePatched = false;
let originalConsoleLog: typeof console.log | null = null;
let originalConsoleError: typeof console.error | null = null;
let originalConsoleWarn: typeof console.warn | null = null;

interface DebugLog {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
  data?: unknown;
}

export const DebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Guard: skip if console is already patched by another mount
    if (isConsolePatched) return;
    isConsolePatched = true;

    // Save real originals only once (on first mount)
    if (!originalConsoleLog) originalConsoleLog = console.log;
    if (!originalConsoleError) originalConsoleError = console.error;
    if (!originalConsoleWarn) originalConsoleWarn = console.warn;

    // Interceptar console.log
    console.log = (...args: unknown[]) => {
      originalConsoleLog!(...args);
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      if (message.includes('[Party]') || message.includes('[DMDashboard-Delete]')) {
        setLogs((prev) => [
          ...prev.slice(-49),
          {
            timestamp: new Date().toLocaleTimeString(),
            level: 'log',
            message,
          },
        ]);
      }
    };

    // Interceptar console.error
    console.error = (...args: unknown[]) => {
      originalConsoleError!(...args);
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      if (message.includes('[Party]') || message.includes('[DMDashboard-Delete]')) {
        setLogs((prev) => [
          ...prev.slice(-49),
          {
            timestamp: new Date().toLocaleTimeString(),
            level: 'error',
            message,
          },
        ]);
      }
    };

    // Interceptar console.warn
    console.warn = (...args: unknown[]) => {
      originalConsoleWarn!(...args);
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      if (message.includes('[Party]') || message.includes('[DMDashboard-Delete]')) {
        setLogs((prev) => [
          ...prev.slice(-49),
          {
            timestamp: new Date().toLocaleTimeString(),
            level: 'warn',
            message,
          },
        ]);
      }
    };

    return () => {
      // Only restore if we did the patching (last mount cleans up)
      if (originalConsoleLog) console.log = originalConsoleLog;
      if (originalConsoleError) console.error = originalConsoleError;
      if (originalConsoleWarn) console.warn = originalConsoleWarn;
      isConsolePatched = false;
      originalConsoleLog = null;
      originalConsoleError = null;
      originalConsoleWarn = null;
    };
  }, []);

  return (
    <>
      {/* Debug Panel Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          zIndex: 9999,
          padding: '10px 15px',
          backgroundColor: logs.some((l) => l.level === 'error') ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
        title="Debug Panel"
      >
        🐛
      </button>

      {/* Debug Panel Content */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '140px',
            right: '20px',
            width: '90vw',
            maxWidth: '400px',
            height: '300px',
            backgroundColor: '#1e1e1e',
            color: '#d4d4d4',
            border: '2px solid #007acc',
            borderRadius: '8px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            fontFamily: 'monospace',
            fontSize: '11px',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#007acc',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #555',
            }}
          >
            <span>🔍 Debug Logs ({logs.length})</span>
            <button
              onClick={() => setLogs([])}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
              title="Clear logs"
            >
              🗑️
            </button>
          </div>

          {/* Logs Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px',
              backgroundColor: '#1e1e1e',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
                Esperando logs...
              </div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: '4px',
                    color:
                      log.level === 'error'
                        ? '#f48771'
                        : log.level === 'warn'
                          ? '#dcdcaa'
                          : '#d4d4d4',
                    padding: '4px',
                    borderLeft: `3px solid ${
                      log.level === 'error'
                        ? '#f48771'
                        : log.level === 'warn'
                          ? '#dcdcaa'
                          : '#4ec9b0'
                    }`,
                  }}
                >
                  <span style={{ color: '#858585' }}>[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
