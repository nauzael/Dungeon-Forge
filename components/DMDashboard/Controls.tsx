import React, { useState } from 'react';

interface Party {
  id: string;
  name: string;
  code: string;
}

interface ControlsProps {
  party: Party | null;
  realtimeStatus: 'connecting' | 'connected' | 'error' | 'reconnecting';
  isLoading: boolean;
  onBack: () => void;
  onBackToSelection: () => void;
  onSync: () => void;
  onDelete: () => void;
  onUpdateName: (newName: string) => Promise<boolean>;
}

const Controls: React.FC<ControlsProps> = ({
  party,
  realtimeStatus,
  isLoading,
  onBack,
  onBackToSelection,
  onSync,
  onDelete,
  onUpdateName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(party?.name || '');

  const handleUpdateName = async () => {
    if (!tempName.trim()) {
      setIsEditingName(false);
      return;
    }
    const success = await onUpdateName(tempName);
    if (success) {
      setIsEditingName(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          {party && (
            <button 
              onClick={onBackToSelection}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-blue-400/50 hover:text-blue-400 transition-colors mb-1"
            >
              <span className="material-symbols-outlined text-[12px]">arrow_back</span>
              Back to Selection
            </button>
          )}
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input 
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleUpdateName}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                className="bg-white/5 border border-white/20 rounded px-2 py-0.5 text-base font-bold text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h1 
                onClick={() => {
                  if (party) {
                    setTempName(party.name);
                    setIsEditingName(true);
                  } else {
                    onBack();
                  }
                }}
                className="text-xl font-black text-white/95 tracking-tight cursor-pointer hover:text-white transition-colors"
              >
                {party ? party.name : 'Your Tables'}
              </h1>
              {party && (
                <span 
                  onClick={() => {
                    setTempName(party.name);
                    setIsEditingName(true);
                  }}
                  className="material-symbols-outlined text-xs text-white/30 cursor-pointer hover:text-blue-400 group-hover:opacity-100 opacity-0 transition-opacity"
                >
                  edit
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{party ? 'In Campaign' : 'Select Table'}</span>
            {party && (
              <>
                <span className="text-slate-700 text-[10px]">•</span>
                <div 
                  onClick={() => {
                    navigator.clipboard.writeText(party.code);
                    alert("Share code copied!");
                  }}
                  className="flex items-center gap-1.5 cursor-pointer group/code"
                >
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tight group-hover/code:text-blue-300">#{party.code}</span>
                  <span className="material-symbols-outlined text-[10px] text-blue-400/50 group-hover/code:text-blue-400">content_copy</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {party && (
          <>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border ${realtimeStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'}`}>
              <span className="material-symbols-outlined text-[10px]">{realtimeStatus === 'connected' ? 'rss_feed' : 'sync'}</span>
              {realtimeStatus === 'connected' ? 'Live' : 'Connecting...'}
            </div>
            <button 
              onClick={onSync}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Sync Manually"
            >
              <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
            <button 
              onClick={onDelete}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-md shadow-red-900/10"
              title="Delete Table"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </>
        )}
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </header>
  );
};

export default Controls;
