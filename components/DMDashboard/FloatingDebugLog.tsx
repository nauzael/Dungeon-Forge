import React, { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn' | 'info';
  message: string;
}

export const FloatingDebugLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<'all' | 'errors'>('all');

  useEffect(() => {
    // Guardar referencias originales de console en variables locales
    const originalLogFn = console.log;
    const originalErrorFn = console.error;
    const originalWarnFn = console.warn;

    // Interceptar console.log
    console.log = (...args) => {
      originalLogFn(...args);
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      // Mostrar todos los logs
      setLogs((prev) => [
        ...prev.slice(-99),
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'log',
          message,
        },
      ]);
    };

    // Interceptar console.error
    console.error = (...args) => {
      originalErrorFn(...args);
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      setLogs((prev) => [
        ...prev.slice(-99),
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'error',
          message,
        },
      ]);
    };

    // Interceptar console.warn
    console.warn = (...args) => {
      originalWarnFn(...args);
      const message = args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ');

      setLogs((prev) => [
        ...prev.slice(-99),
        {
          timestamp: new Date().toLocaleTimeString(),
          level: 'warn',
          message,
        },
      ]);
    };

    return () => {
      console.log = originalLogFn;
      console.error = originalErrorFn;
      console.warn = originalWarnFn;
    };
  }, []);

  const errorLogs = logs.filter((l) => l.level === 'error');
  const displayedLogs = filter === 'errors' ? errorLogs : logs;

  const handleCopyErrors = async () => {
    const text = errorLogs
      .map((l) => `[${l.timestamp}] ${l.message}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          zIndex: 9999,
          padding: '10px 15px',
          backgroundColor: logs.some((l) => l.level === 'error') ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🐛 {errorLogs.length > 0 ? `${errorLogs.length}!` : logs.length}
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        width: '95vw',
        maxWidth: '500px',
        maxHeight: '400px',
        backgroundColor: '#0a0e27',
        color: '#d4d4d4',
        border: '3px solid #ff6b00',
        borderRadius: '10px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        fontFamily: 'monospace',
        fontSize: '12px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#1a1f3a',
          color: '#ff6b00',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #ff6b00',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>
            📋 CONSOLE {filter === 'errors' ? `ERRORS (${errorLogs.length})` : `LOGS (${logs.length})`}
          </span>
          {/* Filter toggle */}
          <button
            onClick={() => setFilter(filter === 'all' ? 'errors' : 'all')}
            style={{
              background: filter === 'errors' ? '#ff6b6b' : '#2a2f4a',
              border: '1px solid #ff6b6b',
              color: filter === 'errors' ? '#fff' : '#ff6b6b',
              cursor: 'pointer',
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
            title={filter === 'all' ? 'Show only errors' : 'Show all logs'}
          >
            {filter === 'all' ? '⚠️ ERRORS' : '📋 ALL'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Copy Errors Button */}
          <button
            onClick={handleCopyErrors}
            disabled={errorLogs.length === 0}
            style={{
              background: 'none',
              border: 'none',
              color: errorLogs.length === 0 ? '#444' : copied ? '#6bcf7f' : '#ff6b00',
              cursor: errorLogs.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
            title="Copy errors to clipboard"
          >
            {copied ? '✅' : '📋'}
          </button>
          <button
            onClick={() => setLogs([])}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6b00',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            title="Clear"
          >
            🗑️
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff6b00',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Logs */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: '#0a0e27',
        }}
      >
        {displayedLogs.length === 0 ? (
          <div style={{ color: '#666', textAlign: 'center', marginTop: '30px' }}>
            {filter === 'errors' ? 'No errors found ✨' : 'Esperando logs...'}
          </div>
        ) : (
          displayedLogs.map((log, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '6px',
                color:
                  log.level === 'error' ? '#ff6b6b' : log.level === 'warn' ? '#ffd93d' : '#6bcf7f',
                padding: '6px 8px',
                backgroundColor:
                  log.level === 'error'
                    ? 'rgba(255, 107, 107, 0.1)'
                    : log.level === 'warn'
                      ? 'rgba(255, 217, 61, 0.1)'
                      : 'rgba(107, 207, 127, 0.1)',
                borderLeft: `3px solid ${
                  log.level === 'error' ? '#ff6b6b' : log.level === 'warn' ? '#ffd93d' : '#6bcf7f'
                }`,
                borderRadius: '4px',
                wordBreak: 'break-word',
              }}
            >
              <span style={{ color: '#888', marginRight: '8px' }}>[{log.timestamp}]</span>
              {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
