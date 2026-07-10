import React, { useState } from 'react';

interface Party {
  id: string;
  name: string;
  code: string;
}

interface PartySelectorProps {
  parties: Party[];
  onSelectParty: (party: Party) => void;
  onCreateParty: (name: string) => Promise<void>;
  isCreating: boolean;
  isLoading: boolean;
}

const PartySelector: React.FC<PartySelectorProps> = ({
  parties,
  onSelectParty,
  onCreateParty,
  isCreating,
  isLoading,
}) => {
  const [partyName, setPartyName] = useState('');

  const handleCreate = async () => {
    if (!partyName.trim()) return;
    await onCreateParty(partyName);
    setPartyName('');
  };

  return (
    <div className="space-y-8 max-w-sm mx-auto">
      {/* Header selection */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="size-20 bg-blue-500/10 rounded-radius-pill flex items-center justify-center border border-blue-500/20">
          <span className="material-symbols-outlined text-4xl text-blue-400">castle</span>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold italic font-serif">The DM's Nexus</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest px-8">Select a tactical table or forge a new one</p>
        </div>
      </div>

      {/* List of existing parties */}
      {parties.length > 0 && (
        <div className="grid gap-3">
          {parties.map(p => (
            <div 
              key={p.id} 
              onClick={() => onSelectParty(p)}
              className="bg-[#1e293b] border border-white/5 rounded-radius-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer shadow-elev-modal shadow-black/20 active:scale-95"
            >
              <div className="space-y-0.5">
                <h3 className="font-bold text-white leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{p.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Shared Code:</span>
                  <span className="text-[10px] font-bold text-blue-400">#{p.code}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all">chevron_right</span>
            </div>
          ))}
        </div>
      )}

      {/* Create New Party */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-white/5"></div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter mb-1">Or create new</span>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>
          <input 
            type="text" 
            placeholder="New campaign name..."
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="w-full bg-white/5 border border-white/10 rounded-radius-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button 
            onClick={handleCreate}
            disabled={isCreating || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-radius-lg shadow-elev-modal shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating ? 'Conjurando...' : (
              <>
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Forge Table</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartySelector;
