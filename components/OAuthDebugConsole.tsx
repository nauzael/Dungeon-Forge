/**
 * OAuth Debug Console
 * 
 * Provides a floating debug panel with:
 * - OAuth diagnostics
 * - Session state monitoring
 * - Manual OAuth flow testing
 * - Real-time console log capture
 * - Character Recovery (restore soft-deleted characters)
 */

import React, { useState, useEffect, useRef } from 'react';
import { runOAuthDiagnostics, printOAuthDiagnostics, testOAuthFlow, OAuthDiagnostic } from '../utils/oauthDiagnostics';
import { supabase, fetchDeletedCharacters, restoreCharacter } from '../utils/supabase';
import { Character } from '../types';

const OAuthDebugConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'logs' | 'diagnostics' | 'session' | 'recovery'>('logs');
  const [logs, setLogs] = useState<Array<{time: string, level: string, message: string}>>([]);
  const [diagnostics, setDiagnostics] = useState<OAuthDiagnostic[]>([]);
  const [sessionInfo, setSessionInfo] = useState<string>('');
  const [deletedCharacters, setDeletedCharacters] = useState<Array<{id: string, character: Character, deleted_at: string}>>([]);
  const [isLoadingRecovery, setIsLoadingRecovery] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      const message = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-99), { time, level: 'log', message }]);
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      const message = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-99), { time, level: 'error', message }]);
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-99), { time, level: 'warn', message }]);
      originalWarn(...args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Run diagnostics
  const handleRunDiagnostics = async () => {
    try {
      const results = await runOAuthDiagnostics();
      setDiagnostics(results);
      printOAuthDiagnostics(results);
    } catch (e) {
      console.error('Diagnostics error:', e);
    }
  };

  // Get session info
  const handleCheckSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setSessionInfo(`ERROR: ${error.message}`);
      } else {
        setSessionInfo(JSON.stringify(session || { status: 'No active session' }, null, 2));
      }
    } catch (e) {
      setSessionInfo(`ERROR: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  // Test OAuth flow
  const handleTestOAuth = async () => {
    console.log('[Debug] Starting OAuth test...');
    try {
      const success = await testOAuthFlow();
      if (success) {
        console.log('[Debug] ✓ OAuth test passed!');
      } else {
        console.log('[Debug] ✗ OAuth test failed - session not established');
      }
    } catch (e) {
      console.error('[Debug] OAuth test error:', e);
    }
  };

  // Load deleted characters for recovery
  const handleLoadDeletedCharacters = async () => {
    try {
      setIsLoadingRecovery(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user?.id) {
        setSessionInfo('ERROR: No active session');
        return;
      }

      const deleted = await fetchDeletedCharacters(session.user.id);
      setDeletedCharacters(deleted);
      console.log(`[Recovery] Found ${deleted.length} deleted characters`);
    } catch (e) {
      console.error('[Recovery] Error loading deleted characters:', e);
    } finally {
      setIsLoadingRecovery(false);
    }
  };

  // Restore a single deleted character
  const handleRestoreCharacter = async (characterId: string, characterName: string) => {
    try {
      const success = await restoreCharacter(characterId);
      if (success) {
        console.log(`[Recovery] ✓ Restored: ${characterName}`);
        setDeletedCharacters(prev => prev.filter(c => c.id !== characterId));
        // Reload the app state (user should refresh)
      } else {
        console.error(`[Recovery] Failed to restore ${characterName}`);
      }
    } catch (e) {
      console.error(`[Recovery] Error restoring character:`, e);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warn': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      {/* Floating Debug Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 shadow-lg transition"
        title="OAuth Debug Console"
      >
        🔍
      </button>

      {/* Debug Console Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 h-96 bg-gray-900 border border-purple-500 rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 border-b border-purple-500 p-3 flex justify-between items-center">
            <h3 className="text-white font-bold">OAuth Debug Console</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-gray-800">
            <button
              onClick={() => setTab('logs')}
              className={`flex-1 px-4 py-2 text-sm ${tab === 'logs' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
            >
              Logs
            </button>
            <button
              onClick={() => setTab('diagnostics')}
              className={`flex-1 px-4 py-2 text-sm ${tab === 'diagnostics' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
            >
              Diagnostics
            </button>
            <button
              onClick={() => setTab('session')}
              className={`flex-1 px-4 py-2 text-sm ${tab === 'session' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
            >
              Session
            </button>
            <button
              onClick={() => setTab('recovery')}
              className={`flex-1 px-4 py-2 text-sm ${tab === 'recovery' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
            >
              Recovery
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-gray-900 p-3 font-mono text-xs text-gray-300">
            {tab === 'logs' && (
              <div>
                {logs.length === 0 && <p className="text-gray-600">No logs yet...</p>}
                {logs.map((log, i) => (
                  <div key={i} className={getLevelColor(log.level)}>
                    <span className="text-gray-600">[{log.time}]</span> {log.message}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}

            {tab === 'diagnostics' && (
              <div>
                {diagnostics.length === 0 && (
                  <p className="text-gray-600">Click "Run Diagnostics" to start...</p>
                )}
                {diagnostics.map((diag, i) => (
                  <div key={i} className="mb-2 pb-2 border-b border-gray-700">
                    <div className={diag.status === 'PASS' ? 'text-green-400' : diag.status === 'WARN' ? 'text-yellow-400' : 'text-red-400'}>
                      [{diag.status}] {diag.check}
                    </div>
                    <div className="text-gray-400 ml-2">{diag.message}</div>
                    {diag.suggestion && (
                      <div className="text-purple-400 ml-2 text-xs">💡 {diag.suggestion}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'session' && (
              <div>
                {sessionInfo ? (
                  <pre className="whitespace-pre-wrap break-words">{sessionInfo}</pre>
                ) : (
                  <p className="text-gray-600">Click "Get Session Info" to load...</p>
                )}
              </div>
            )}

            {tab === 'recovery' && (
              <div>
                {deletedCharacters.length === 0 ? (
                  <p className="text-gray-600">
                    {isLoadingRecovery ? 'Loading...' : 'No deleted characters found. Click "Load Deleted" to check.'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-green-400 mb-2">Found {deletedCharacters.length} deleted character(s):</p>
                    {deletedCharacters.map((item, i) => (
                      <div key={i} className="bg-gray-800 p-2 rounded border border-gray-700">
                        <div className="text-white font-bold">{item.character.name}</div>
                        <div className="text-gray-500 text-[10px]">
                          Deleted: {new Date(item.deleted_at).toLocaleString()}
                        </div>
                        <button
                          onClick={() => handleRestoreCharacter(item.id, item.character.name)}
                          className="mt-1 w-full bg-green-600 hover:bg-green-700 text-white text-[10px] py-1 rounded"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-800 border-t border-gray-700 p-2 grid grid-cols-2 gap-2">
            {tab === 'logs' && (
              <button
                onClick={() => setLogs([])}
                className="col-span-2 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
              >
                Clear Logs
              </button>
            )}

            {tab === 'diagnostics' && (
              <button
                onClick={handleRunDiagnostics}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
              >
                Run Diagnostics
              </button>
            )}

            {tab === 'session' && (
              <>
                <button
                  onClick={handleCheckSession}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded"
                >
                  Get Session Info
                </button>
                <button
                  onClick={handleTestOAuth}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                >
                  Test OAuth Flow
                </button>
              </>
            )}

            {tab === 'recovery' && (
              <button
                onClick={handleLoadDeletedCharacters}
                disabled={isLoadingRecovery}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs py-1 px-2 rounded"
              >
                {isLoadingRecovery ? 'Loading...' : 'Load Deleted Characters'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OAuthDebugConsole;
