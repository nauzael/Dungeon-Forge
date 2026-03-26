
import React, { useState, useEffect } from 'react';
import { supabase, createParty, subscribeToParty, removeFromParty } from '../utils/supabase';
import { Character, Ability } from '../types';
import { 
    getSpellSlotSummary, 
    getArmorClass, 
    getFinalStats, 
    isProficientInSave, 
    getSavingThrowBonus,
    getAbilityModifier,
    formatModifier
} from '../utils/sheetUtils';

interface DMDashboardProps {
  onBack: () => void;
  onViewCharacter: (char: Character) => void;
  user: { name: string, id: string } | null;
}

const DMDashboard: React.FC<DMDashboardProps> = ({ onBack, onViewCharacter, user }) => {
  const [party, setParty] = useState<{ id: string, name: string, code: string } | null>(null);
  const [members, setMembers] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [partyName, setPartyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // 1. Fetch existing party created by user
  useEffect(() => {
    if (user) {
      supabase
        .from('parties')
        .select('*')
        .eq('creator_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setParty(data);
            fetchMembers(data.id);
          }
        });
    }
  }, [user]);

  // 2. Fetch members of the party
  const fetchMembers = async (partyId: string) => {
    setIsLoading(true);
    const { data } = await supabase
      .from('characters')
      .select('data')
      .eq('party_id', partyId);
    
    if (data) {
      setMembers(data.map(item => item.data as Character));
    }
    setIsLoading(false);
  };

  // 3. Real-time Subscription
  useEffect(() => {
    if (party) {
      const channel = subscribeToParty(
        party.id, 
        (payload: any) => {
            // Postgres Changes (DB Anchor of truth)
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const updatedChar = payload.new.data as Character;
                if (!updatedChar) return;
                
                // Defensive check: if it no longer belongs to the party, remove it from view
                if (payload.new.party_id !== party.id) {
                    setMembers(prev => prev.filter(c => c.id !== updatedChar.id));
                    return;
                }

                setMembers(prev => {
                    const exists = prev.find(c => c.id === updatedChar.id);
                    if (exists) {
                        return prev.map(c => c.id === updatedChar.id ? updatedChar : c);
                    } else {
                        return [...prev, updatedChar];
                    }
                });
            } else if (payload.eventType === 'DELETE') {
                const oldId = payload.old.id;
                setMembers(prev => prev.filter(c => c.id !== oldId));
            }
        },
        (broadcastChar: Character) => {
            // Broadcast (Ephemeral Live Update)
            setMembers(prev => {
                const exists = prev.find(c => c.id === broadcastChar.id);
                if (exists) {
                    return prev.map(c => c.id === broadcastChar.id ? broadcastChar : c);
                } else {
                    return [...prev, broadcastChar];
                }
            });
        }
      );

      setRealtimeStatus('connected');

      return () => {
        channel.unsubscribe();
      };
    }
  }, [party]);

  const handleCreateParty = async () => {
    if (!user || !partyName.trim()) return;
    setIsCreating(true);
    const newParty = await createParty(user.id, partyName);
    if (newParty) setParty(newParty);
    setIsCreating(false);
  };

  const handleKickCharacter = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres expulsar a ${name} de tu mesa?`)) {
        setIsLoading(true);
        const success = await removeFromParty(id);
        if (success) {
            setMembers(prev => prev.filter(c => c.id !== id));
        } else {
            alert("Error al expulsar al personaje del Nexo.");
        }
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-black uppercase tracking-widest text-white/90">Panel del DM</h1>
            {party && (
                <div 
                    onClick={() => {
                        navigator.clipboard.writeText(party.code);
                        alert("Código compartido copiado!");
                    }}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tight group-hover:text-blue-300">{party.name} · {party.code}</p>
                    <span className="material-symbols-outlined text-[10px] text-blue-400/50 group-hover:text-blue-400">content_copy</span>
                </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border ${realtimeStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'}`}>
                <span className="material-symbols-outlined text-[10px]">{realtimeStatus === 'connected' ? 'rss_feed' : 'sync'}</span>
                {realtimeStatus === 'connected' ? 'En Vivo' : 'Conectando...'}
            </div>
            <button 
                onClick={() => party && fetchMembers(party.id)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                title="Sincronizar Manualmente"
            >
                <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
        </div>
      </header>

      <main className="flex-1 p-6">
        {!party ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="size-24 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
              <span className="material-symbols-outlined text-5xl text-blue-400">castle</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Forja tu Mesa</h2>
              <p className="text-slate-400 text-sm max-w-[280px] mx-auto">Crea una mesa para que tus jugadores puedan vincular sus almas y veas sus estadísticas en tiempo real.</p>
            </div>
            <div className="w-full max-w-xs space-y-3">
              <input 
                type="text" 
                placeholder="Nombre de la Campaña"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button 
                onClick={handleCreateParty}
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
              >
                {isCreating ? 'Creando...' : 'Bautizar Mesa'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {members.length === 0 ? (
              <div className="text-center py-20 animate-pulse text-slate-600 italic">
                Esperando a que los aventureros se unan...
              </div>
            ) : (
              <div className="grid gap-6">
                {members.map(member => (
                  <div key={member.id} className="bg-[#1e293b] rounded-2xl p-4 border border-white/5 shadow-xl transition-all">
                    {/* Member Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                        <div className="size-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                           {(member as any).imageUrl && (member as any).imageUrl !== 'DEFAULT' ? (
                             <img src={(member as any).imageUrl} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-600">
                               <span className="material-symbols-outlined">shield_person</span>
                             </div>
                           )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white leading-none mb-1">{member.name}</h3>
                          <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">LV {member.level} {member.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleKickCharacter(member.id, member.name)}
                          className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md shadow-red-900/10"
                          title="Expulsar"
                        >
                          <span className="material-symbols-outlined text-[16px] font-black">logout</span>
                        </button>
                        <div className="flex flex-col items-end cursor-pointer" onClick={() => onViewCharacter(member)}>
                          <span className="text-[8px] text-slate-500 uppercase font-black">Escudo AC</span>
                          <span className="text-xl font-black text-white">{getArmorClass(member, getFinalStats(member))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats: Saves & Speed */}
                    <div className="grid grid-cols-6 gap-1.5 mb-5">
                        {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as Ability[]).map(stat => {
                            const isProf = isProficientInSave(member, stat);
                            const finalStats = getFinalStats(member);
                            const bonus = getSavingThrowBonus(member, finalStats);
                            const mod = getAbilityModifier(finalStats, stat);
                            const total = mod + (isProf ? member.profBonus : 0) + bonus;
                            
                            return (
                                <div key={stat} className="flex flex-col items-center bg-black/20 rounded-lg p-1.5 border border-white/5">
                                    <span className={`text-[7px] font-black uppercase ${isProf ? 'text-primary' : 'text-slate-500'}`}>{stat}</span>
                                    <span className={`text-[10px] font-bold ${isProf ? 'text-white' : 'text-slate-400'}`}>{formatModifier(total)}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* HP Bar */}
                    <div className="space-y-1.5 mb-6">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] text-slate-400 font-bold uppercase">Puntos de Golpe</span>
                         <span className="text-sm font-black">{member.hp.current} / {member.hp.max}</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
                         <div 
                          className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-700" 
                          style={{ width: `${(Math.min(member.hp.current, member.hp.max) / member.hp.max) * 100}%` }}
                         ></div>
                         {member.hp.temp > 0 && (
                           <div 
                            className="absolute top-0 right-0 h-full bg-blue-400 transition-all duration-700 opacity-60" 
                            style={{ width: `${(member.hp.temp / member.hp.max) * 100}%` }}
                           ></div>
                         )}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 cursor-pointer" onClick={() => onViewCharacter(member)}>
                      {/* Spell Slots & Sorcery Points */}
                      <div className="space-y-3">
                        {member.class !== 'Barbarian' && member.class !== 'Fighter' && member.class !== 'Rogue' && member.class !== 'Monk' && (
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(getSpellSlotSummary(member)).map(([lvl, info]) => (
                               <div key={lvl} className="flex flex-col items-center gap-0.5 min-w-[20px]">
                                 <div className="flex gap-0.5">
                                   {Array.from({ length: info.max }).map((_, i) => {
                                      const isUsed = member.usedSlots?.[`${lvl}-${i}`];
                                      return (
                                        <div 
                                          key={i} 
                                          className={`size-2.5 rounded-full border ${isUsed ? 'border-red-500/30 bg-red-500/10' : 'border-blue-400/50 bg-blue-400/20 shadow-[0_0_4px_rgba(96,165,250,0.3)]'}`}
                                        ></div>
                                      );
                                   })}
                                 </div>
                                 <span className="text-[7px] font-black text-slate-500 uppercase">Lv.{lvl}</span>
                               </div>
                            ))}
                          </div>
                        )}
                        
                        {member.sorceryPoints && (
                           <div className="flex items-center gap-2 animate-pulse">
                              <span className="material-symbols-outlined text-purple-400 text-xs text-[10px]">auto_fix_high</span>
                              <div className="flex-1 h-1 bg-purple-900/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500" 
                                  style={{ width: `${(member.sorceryPoints.current / member.sorceryPoints.max) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-[8px] font-black text-purple-400">{member.sorceryPoints.current}/{member.sorceryPoints.max}</span>
                           </div>
                        )}
                      </div>

                      {/* Special States & High-Value Resources */}
                      <div className="flex flex-wrap gap-2 justify-end content-start">
                          {member.concentrationSpell && (
                            <div className="bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 animate-pulse shadow-sm shadow-amber-900/20">
                              <span className="material-symbols-outlined text-[10px] text-amber-500">psychology</span>
                              <span className="text-[8px] font-black uppercase text-amber-500 tracking-tighter">Conc.</span>
                            </div>
                          )}
                          {member.rageUses && (
                            <div className="bg-orange-600/20 border border-orange-600/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-orange-900/20">
                              <span className="material-symbols-outlined text-[10px] text-orange-500">local_fire_department</span>
                              <span className="text-[8px] font-black uppercase text-orange-500 tracking-tighter">Furia: {member.rageUses.current}/{member.rageUses.max}</span>
                            </div>
                          )}
                          {member.focus && (
                            <div className="bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-cyan-900/20">
                              <span className="material-symbols-outlined text-[10px] text-cyan-400">self_improvement</span>
                              <span className="text-[8px] font-black uppercase text-cyan-400 tracking-tighter">Foco: {member.focus.current}</span>
                            </div>
                          )}
                          {member.bardicInspiration && (
                            <div className="bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-purple-900/20">
                              <span className="material-symbols-outlined text-[10px] text-purple-400">music_note</span>
                              <span className="text-[8px] font-black uppercase text-purple-400 tracking-tighter">Insp: {member.bardicInspiration.current}</span>
                            </div>
                          )}
                          {member.channelDivinity && (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-yellow-900/20">
                              <span className="material-symbols-outlined text-[10px] text-yellow-500">verified_user</span>
                              <span className="text-[8px] font-black uppercase text-yellow-500 tracking-tighter">Canal: {member.channelDivinity.current}</span>
                            </div>
                          )}
                          {member.wildShape && (
                            <div className="bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-emerald-900/20">
                              <span className="material-symbols-outlined text-[10px] text-emerald-500">forest</span>
                              <span className="text-[8px] font-black uppercase text-emerald-500 tracking-tighter">Forma: {member.wildShape.current}</span>
                            </div>
                          )}
                          {member.inspiration && member.inspiration.current > 0 && (
                            <div className="bg-blue-400/20 border border-blue-400/30 px-2 py-0.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-900/20">
                              <span className="material-symbols-outlined text-[10px] text-blue-400">military_tech</span>
                              <span className="text-[8px] font-black uppercase text-blue-400 tracking-tighter">Heroica</span>
                            </div>
                          )}
                          {member.usedSlots && Object.values(member.usedSlots).filter(v => v).length > 0 && (
                            <div className="bg-blue-500/10 border border-blue-500/10 px-1.5 py-0.5 rounded-lg">
                               <span className="text-[7px] font-bold text-blue-400/40 uppercase">
                                 {Object.values(member.usedSlots).filter(v => v).length} slots gastados
                               </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button for Encounters? */}
      {party && (
        <button className="fixed bottom-8 right-8 size-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-[#0f172a] active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-3xl">swords</span>
        </button>
      )}
    </div>
  );
};

export default DMDashboard;
