import React, { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'error' | 'warn';
  message: string;
  category: string;
}

const AuthDebugOverlay: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState<{
    url: string | null;
    hasKey: boolean;
  }>({ url: null, hasKey: false });

  useEffect(() => {
    // Check Supabase config
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setSupabaseConfig({ url: url || null, hasKey: !!key });
  }, []);

  useEffect(() => {
    // Intercept console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (level: 'log' | 'error' | 'warn', args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      
      // Extract category from message (e.g., "[OAuth Redirect]" → "OAuth Redirect")
      const categoryMatch = message.match(/^\[([^\]]+)\]/);
      const category = categoryMatch ? categoryMatch[1] : 'Other';
      
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-99), { 
        timestamp, 
        level, 
        message, 
        category 
      }]);
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const categories = Array.from(new Set(logs.map(l => l.category))).sort();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredLogs = selectedCategory 
    ? logs.filter(l => l.category === selectedCategory)
    : logs;

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center shadow-lg transition-all"
        title="Toggle Auth Debug Logs"
      >
        {isOpen ? '✕' : '🔍'}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-slate-900 border-2 border-amber-500 rounded-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="bg-amber-600 text-white px-4 py-3 font-bold text-sm">
            AUTH DEBUG PANEL
          </div>

          {/* Supabase Config */}
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 text-xs">
            <div className="space-y-1">
              <div className={supabaseConfig.url ? 'text-green-400' : 'text-red-400'}>
                URL: {supabaseConfig.url ? '✓ Set' : '✗ MISSING'}
              </div>
              <div className={supabaseConfig.hasKey ? 'text-green-400' : 'text-red-400'}>
                Key: {supabaseConfig.hasKey ? '✓ Set' : '✗ MISSING'}
              </div>
              <div className="text-slate-400 text-[10px] font-mono break-all">
                {supabaseConfig.url && supabaseConfig.url.substring(0, 40)}...
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2 py-1 text-[10px] rounded transition-all ${
                selectedCategory === null 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 text-[10px] rounded transition-all ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Logs */}
          <div className="flex-1 overflow-y-auto bg-slate-900 px-3 py-2 font-mono text-[10px]">
            {filteredLogs.length === 0 ? (
              <div className="text-slate-500 italic">Waiting for auth logs...</div>
            ) : (
              filteredLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={`mb-1 pb-1 border-b border-slate-800 last:border-0 ${
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warn' ? 'text-yellow-400' :
                    'text-slate-300'
                  }`}
                >
                  <div className="text-slate-500">[{log.timestamp}]</div>
                  <div className="break-all">{log.message}</div>
                </div>
              ))
            )}
          </div>

          {/* Clear Button */}
          <div className="bg-slate-800 px-4 py-2 border-t border-slate-700">
            <button
              onClick={() => setLogs([])}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs px-2 py-1 rounded transition-all"
            >
              Clear Logs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugOverlay;
