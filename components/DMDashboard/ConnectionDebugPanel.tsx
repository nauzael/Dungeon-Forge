/**
 * 🔍 Connection Debug Panel - Panel de diagnóstico para DM Panel
 * Muestra status de conexión, logs, y credenciales
 */

import React, { useState, useEffect } from 'react';
import { debugLogger } from '../../utils/debugLogger';

interface ConnectionDebugPanelProps {
  realtimeStatus?: 'connecting' | 'connected' | 'error' | 'reconnecting';
}

const ConnectionDebugPanel: React.FC<ConnectionDebugPanelProps> = ({ realtimeStatus = 'connecting' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [events, setEvents] = useState(debugLogger.getLatestEvents(20));
  const [firebaseProjectId, setFirebaseProjectId] = useState<string>('');
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState<string>('');
  const [firebaseApiKey, setFirebaseApiKey] = useState<string>('');
  const [localMode, setLocalMode] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  useEffect(() => {
    // Obtener credenciales Firebase incrustadas en el bundle
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '';
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
    
    setFirebaseProjectId(projectId);
    setFirebaseAuthDomain(authDomain);
    setFirebaseApiKey(apiKey);
    
    // Obtener local mode
    const mode = localStorage.getItem('df_local_mode');
    setLocalMode(mode);

    // Refrescar logs cada 500ms
    const interval = setInterval(() => {
      setEvents(debugLogger.getLatestEvents(20));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Función para copiar información de diagnóstico
  const handleCopy = async () => {
    // Máscara de API key: primeros 10 chars + ... + últimos 5 chars
    const maskedApiKey = firebaseApiKey
      ? firebaseApiKey.substring(0, 10) + '...' + firebaseApiKey.substring(firebaseApiKey.length - 5)
      : '❌ NOT CONFIGURED';
    
    const diagnosticInfo = `🔍 DUNGEON FORGE - DIAGNOSTIC REPORT
===============================================
Timestamp: ${new Date().toISOString()}
Realtime Status: ${realtimeStatus}
Modo Local: ${localMode === 'true' ? '✅ ACTIVADO' : '❌ Desactivado'}

🔐 FIREBASE CONFIG
Project ID: ${firebaseProjectId || '❌ NOT CONFIGURED'}
Auth Domain: ${firebaseAuthDomain || '❌ NOT CONFIGURED'}
API Key: ${maskedApiKey} (${firebaseApiKey.length} chars)

📊 EVENTS (${events.length})
${events.map(e => `[${e.timestamp_iso.split('T')[1]}] ${e.source} [${e.level.toUpperCase()}] ${e.message}${e.data ? ' → ' + (typeof e.data === 'string' ? e.data : JSON.stringify(e.data).substring(0, 50)) : ''}`).join('\n')}

💡 NOTES
- If Firebase Config shows ❌ NOT CONFIGURED: .env was not loaded during npm run build
- If Local Mode is ✅ ACTIVADO: Data comes from localStorage, NOT Firebase
- If status is 🔴 error for >10s: There's a connection issue with Firebase realtime
===============================================`;

    try {
      await navigator.clipboard.writeText(diagnosticInfo);
      setCopyFeedback('✅ Copiado al portapapeles');
      setTimeout(() => setCopyFeedback(''), 3000);
    } catch (err) {
      setCopyFeedback('❌ Error al copiar');
      setTimeout(() => setCopyFeedback(''), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-900 text-green-200';
      case 'connecting':
        return 'bg-yellow-900 text-yellow-200';
      case 'reconnecting':
        return 'bg-orange-900 text-orange-200';
      case 'error':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'connected':
        return '🟢';
      case 'connecting':
        return '🟡';
      case 'reconnecting':
        return '🟠';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const hasCredentials = firebaseProjectId && firebaseAuthDomain && firebaseApiKey && firebaseApiKey.length > 10;
  const isLocalModeActive = localMode === 'true';

  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
      {/* Header Colapsable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 transition flex items-center gap-2 text-sm"
      >
        <span className="text-lg">{isExpanded ? '▼' : '▶'} 🔍 Diagnóstico</span>
        <span className={`ml-auto px-2 py-1 rounded text-xs font-mono ${getStatusColor(realtimeStatus)}`}>
          {getStatusEmoji(realtimeStatus)} {realtimeStatus}
        </span>
      </button>

      {/* Contenido Expandido */}
      {isExpanded && (
        <div className="mt-2 p-3 bg-gray-900 rounded border border-gray-700 space-y-3 text-xs font-mono">
          
          {/* Header con botones */}
          <div className="flex justify-between items-center mb-2">
            <div className="text-blue-300 font-bold">📋 Diagnóstico Detallado</div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-2 py-1 bg-blue-700 hover:bg-blue-600 rounded text-white text-xs transition"
                title="Copiar toda la información de diagnóstico"
              >
                📋 Copy
              </button>
              <button
                onClick={() => debugLogger.clear()}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 text-xs transition"
                title="Limpiar eventos"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Feedback de copia */}
          {copyFeedback && (
            <div className="p-2 bg-blue-900 bg-opacity-50 rounded text-blue-300 text-xs text-center">
              {copyFeedback}
            </div>
          )}
          
          {/* Estado General */}
          <div className="border-b border-gray-700 pb-2">
            <div className="font-bold text-blue-300 mb-2">📊 Estado General</div>
            
            <div className="space-y-1 text-gray-300">
              <div className="flex justify-between">
                <span>Realtime Status:</span>
                <span className={`font-bold ${getStatusColor(realtimeStatus)} px-2 rounded`}>
                  {getStatusEmoji(realtimeStatus)} {realtimeStatus}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Modo Local:</span>
                <span className={isLocalModeActive ? 'text-yellow-400' : 'text-gray-400'}>
                  {isLocalModeActive ? '✅ ACTIVADO' : '❌ Desactivado'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Credenciales:</span>
                <span className={hasCredentials ? 'text-green-400' : 'text-red-400'}>
                  {hasCredentials ? '✅ Presentes' : '❌ Faltantes'}
                </span>
              </div>
            </div>
          </div>

          {/* Credenciales Firebase */}
          <div className="border-b border-gray-700 pb-2">
            <div className="font-bold text-blue-300 mb-2">🔐 Firebase Config (Bundle)</div>
            
            <div className="space-y-1 text-gray-300 break-all">
              <div>
                <span className="text-gray-500">Project ID:</span>
                {firebaseProjectId ? (
                  <div className="text-green-400">{firebaseProjectId}</div>
                ) : (
                  <div className="text-red-400">❌ NO CONFIGURADA</div>
                )}
              </div>

              <div>
                <span className="text-gray-500">Auth Domain:</span>
                {firebaseAuthDomain ? (
                  <div className="text-green-400">{firebaseAuthDomain}</div>
                ) : (
                  <div className="text-red-400">❌ NO CONFIGURADA</div>
                )}
              </div>

              <div>
                <span className="text-gray-500">API Key:</span>
                {firebaseApiKey ? (
                  <div className="text-green-400">
                    {firebaseApiKey.substring(0, 10)}...{firebaseApiKey.substring(firebaseApiKey.length - 5)} ({firebaseApiKey.length} chars)
                  </div>
                ) : (
                  <div className="text-red-400">❌ NO CONFIGURADA</div>
                )}
              </div>
            </div>
          </div>

          {/* localStorage */}
          <div className="border-b border-gray-700 pb-2">
            <div className="font-bold text-blue-300 mb-2">💾 LocalStorage</div>
            
            <div className="space-y-1 text-gray-300">
              <div>
                <span className="text-gray-500">df_local_mode:</span>
                <span className="text-yellow-400"> {localMode || 'null'}</span>
              </div>
            </div>
          </div>

          {/* Últimos Eventos */}
          <div>
            <div className="font-bold text-blue-300 mb-2">
              📋 Últimos Eventos ({events.length})
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto bg-black bg-opacity-50 p-2 rounded">
              {events.length === 0 ? (
                <div className="text-gray-500 italic">Sin eventos registrados</div>
              ) : (
                events.map((event, idx) => (
                  <div
                    key={idx}
                    className={`text-xs ${
                      event.level === 'error'
                        ? 'text-red-400'
                        : event.level === 'warn'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  >
                    <span className="text-gray-600">[{event.timestamp_iso.split('T')[1]}]</span>
                    {' '}
                    <span className="font-bold text-blue-300">{event.source}</span>
                    {' '}
                    {event.message}
                    {event.data ? (
                      <div className="text-gray-500 ml-2">
                        → {typeof event.data === 'string' ? event.data : JSON.stringify(event.data).substring(0, 50)}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ayuda */}
          <div className="border-t border-gray-700 pt-2 text-gray-500 italic text-xs">
            <div>💡 Si ves "Credenciales: ❌ Faltantes":</div>
            <div className="ml-2">→ El .env no fue cargado durante npm run build</div>
            <div>💡 Si "Modo Local: ✅ ACTIVADO":</div>
            <div className="ml-2">→ Datos vienen de localStorage, NO de Firebase</div>
            <div>💡 Si status es "🔴 error" por &gt;10s:</div>
            <div className="ml-2">→ Hay problema con conexión a Firebase realtime</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionDebugPanel;
