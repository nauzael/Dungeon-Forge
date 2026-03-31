
import React, { useState, useRef } from 'react';
import { Character } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface CharacterListProps {
  characters: Character[];
  onCreate: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogout: () => void;
  onOpenDMDashboard: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, onCreate, onSelect, onDelete, onExport, onImport, onLogout, onOpenDMDashboard }) => {
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full min-h-screen relative leather-bg overflow-x-hidden safe-top">
      
      {/* Background Decoratives */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(15,23,41,0.8)_100%)]"></div>

      {/* Settings section removed from here to move it to the end of the list */}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onImport} 
        className="hidden" 
        accept=".json" 
      />

      <main className="flex-1 pb-10 px-5 w-full mx-auto relative pt-8 max-w-lg">
        {/* App Branding Title */}
        <div className="text-center space-y-2 relative mb-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white app-title-glow" style={{fontVariant: 'small-caps'}}>
              Dungeon Forge
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#9adbff]/30 to-transparent mx-auto mt-3"></div>
        </div>

        {/* Character List - Forced 1 Column */}
        <div className="flex flex-col gap-6">
            {characters.map(char => (
                <div 
                    key={char.id} 
                    onClick={() => onSelect(char.id)}
                    className="group relative bg-[#1b1f2b] rounded-xl overflow-hidden iron-border transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e19] via-transparent to-transparent z-10 pointer-events-none"></div>
                    
                    {/* Delete Action Overlay */}
                    <div className="absolute top-3 right-3 z-30 flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                            className="w-9 h-9 bg-red-500/90 backdrop-blur-md text-white border border-red-500/20 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95"
                            title="Delete Character"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                    </div>

                    <div className="h-64 overflow-hidden bg-black relative">
                        {char.imageUrl && char.imageUrl !== 'DEFAULT' ? (
                            <img 
                                key={char.imageUrl}
                                src={char.imageUrl} 
                                alt={char.name} 
                                className="w-full h-full object-cover opacity-90 transition-all duration-700" 
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1b1f2b] flex items-center justify-center text-[#9adbff]/20">
                                <span className="material-symbols-outlined text-8xl">shield_person</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 relative z-20 -mt-20">
                        <div className="bg-[#090e19]/90 backdrop-blur-xl p-3 rounded-lg border-t border-[#9adbff]/10 shadow-2xl">
                            <div className="flex justify-between items-end mb-2">
                                <div className="min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-2xl font-bold text-white tracking-tight truncate app-title-glow leading-none">{char.name}</h3>
                                        {char.party_id && (
                                            <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                                                <span className="material-symbols-outlined text-[10px] text-blue-400">forum</span>
                                                <span className="text-[7px] font-black uppercase text-blue-400 tracking-tighter whitespace-nowrap">
                                                    {char.party_name || 'In Campaign'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[#9adbff] font-bold text-[10px] tracking-widest uppercase truncate leading-none">
                                        {char.class} • {char.subspecies || char.species}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-tighter">Level</span>
                                    <span className="text-xl font-extrabold text-white">{char.level < 10 ? `0${char.level}` : char.level}</span>
                                </div>
                            </div>
                            
                            {/* Stats Row summary */}
                            <div className="grid grid-cols-6 gap-0.5 border-t border-white/5 pt-3">
                                {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((stat, i) => {
                                    const statValue = char.stats ? char.stats[stat as any] : 10;
                                    return (
                                        <div key={stat} className="text-center">
                                            <span className="block text-[8px] text-slate-500 uppercase font-bold">{stat}</span>
                                            <span className="text-white font-bold text-[11px] tracking-tighter">{statValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex flex-col items-center justify-center py-6 gap-4">
                <button 
                    onClick={onCreate}
                    className="group relative flex items-center gap-4 px-6 py-3 rounded-full bg-[#1b1f2b] border border-[#9adbff]/20 shadow-2xl hover:bg-[#252a3a] hover:border-[#9adbff]/40 transition-all active:scale-95 overflow-hidden"
                >
                    <div className="relative z-10 size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-[#9adbff]">swords</span>
                    </div>
                    <span className="relative z-10 text-sm font-black text-white tracking-[0.2em] uppercase">Bind New Soul</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                <button 
                    onClick={onOpenDMDashboard}
                    className="group relative flex items-center gap-4 px-6 py-3 rounded-full bg-[#1b1f2b] border border-blue-500/20 shadow-2xl hover:bg-[#252a3a] hover:border-blue-500/40 transition-all active:scale-95 overflow-hidden"
                >
                    <div className="relative z-10 size-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                        <span className="material-symbols-outlined text-2xl text-blue-400">monitoring</span>
                    </div>
                    <span className="relative z-10 text-sm font-black text-white tracking-[0.2em] uppercase">DM Panel</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>

            {/* Application Settings Card - Minimal */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <button 
                    onClick={onLogout}
                    className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-lg text-red-500/40 group-hover:text-red-500/80">logout</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/40 group-hover:text-red-500/80">{t.logout}</span>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CharacterList;
