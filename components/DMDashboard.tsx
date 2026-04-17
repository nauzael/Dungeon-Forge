
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase, createParty, subscribeToParty, removeFromParty, updatePartyName, deleteParty } from '../utils/supabase';
import { Character, Ability, InitiativeCombatant } from '../types';
import { 
    getSpellSlotSummary, 
    getArmorClass, 
    getFinalStats, 
    isProficientInSave, 
    getSavingThrowBonus,
    getAbilityModifier,
    formatModifier
} from '../utils/sheetUtils';

// Lazy load new DM modules
const CampaignResources = lazy(() => import('./dm/CampaignResources'));
const Compendium = lazy(() => import('./dm/Compendium'));
const MonsterBuilder = lazy(() => import('./dm/MonsterBuilder'));
const InitiativeTracker = lazy(() => import('./dm/InitiativeTracker'));
const CriticalFumbleTable = lazy(() => import('./dm/CriticalFumbleTable'));

interface DMDashboardProps {
  onBack: () => void;
  onViewCharacter: (char: Character) => void;
  user: { name: string, id: string } | null;
}

type DashboardTab = 'party' | 'resources' | 'compendium' | 'monsters' | 'initiative' | 'critical';

const DMDashboard: React.FC<DMDashboardProps> = ({ onBack, onViewCharacter, user }) => {
  const [party, setParty] = useState<{ id: string, name: string, code: string } | null>(null);
  const [parties, setParties] = useState<{ id: string, name: string, code: string }[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('party');
  const [members, setMembers] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [partyName, setPartyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // Helper: Deduplicate characters and keep the most recent version by timestamp
  const deduplicateAndMerge = (current: Character[], incoming: Character): Character[] => {
    const existingIndex = current.findIndex(c => c.id === incoming.id);
    
    if (existingIndex === -1) {
      return [...current, incoming];
    }
    
    const existing = current[existingIndex];
    const incomingTime = incoming.syncTimestamp || 0;
    const existingTime = existing.syncTimestamp || 0;
    
    if (incomingTime >= existingTime) {
      return current.map((c, i) => i === existingIndex ? incoming : c);
    }
    return current;
  };

  // Helper: Remove duplicates from array (keep by ID, prefer higher timestamp)
  const removeDuplicates = (chars: Character[]): Character[] => {
    const map = new Map<string, Character>();
    
    for (const char of chars) {
      const existing = map.get(char.id);
      if (!existing) {
        map.set(char.id, char);
      } else {
        const incomingTime = char.syncTimestamp || 0;
        const existingTime = existing.syncTimestamp || 0;
        if (incomingTime > existingTime) {
          map.set(char.id, char);
        }
      }
    }
    
    return Array.from(map.values());
  };

  const [initiativeCombatants, setInitiativeCombatants] = useState<InitiativeCombatant[]>([]);

    const buildInitiativeState = (
        currentCombatants: InitiativeCombatant[],
        partyMembers: Character[]
    ): InitiativeCombatant[] => {
        const playerMap = new Map(
            currentCombatants.filter((combatant) => combatant.isPlayer).map((combatant) => [combatant.id, combatant])
        );

        const syncedPlayers: InitiativeCombatant[] = partyMembers.map((member) => {
            const existing = playerMap.get(member.id);
            return {
                id: member.id,
                name: member.name,
                initiative: existing?.initiative ?? null,
                isPlayer: true,
                isCurrentTurn: existing?.isCurrentTurn ?? false,
                ac: member.ac,
                hp: member.hp,
            };
        });

        const monsters = currentCombatants.filter((combatant) => !combatant.isPlayer);
        return [...syncedPlayers, ...monsters];
    };

  // 1. Fetch existing party created by user
  const fetchAllParties = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await supabase
        .from('parties')
        .select('*')
        .eq('creator_id', user.id);
    if (data) setParties(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllParties();
  }, [user]);

    useEffect(() => {
        if (!party) {
            setInitiativeCombatants([]);
            return;
        }

        try {
            const raw = localStorage.getItem(`df-dm-initiative-${party.id}`);
            if (!raw) {
                setInitiativeCombatants([]);
                return;
            }

            const parsed = JSON.parse(raw) as InitiativeCombatant[];
            if (!Array.isArray(parsed)) {
                setInitiativeCombatants([]);
                return;
            }

            setInitiativeCombatants(parsed);
        } catch (e) {
            console.error('Failed to load initiative tracker:', e);
            setInitiativeCombatants([]);
        }
    }, [party?.id]);

    useEffect(() => {
        if (!party) return;

        const timer = setTimeout(() => {
            try {
                localStorage.setItem(`df-dm-initiative-${party.id}`, JSON.stringify(initiativeCombatants));
            } catch (e) {
                console.error('Failed to save initiative tracker:', e);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [initiativeCombatants, party]);

    useEffect(() => {
        setInitiativeCombatants((prev) => buildInitiativeState(prev, members));
    }, [members]);

  // 2. Fetch members of the party
  const fetchMembers = async (partyId: string) => {
    setIsLoading(true);
    const { data } = await supabase
      .from('characters')
      .select('data')
      .eq('party_id', partyId);
    
    if (data) {
      const loadedChars = data.map(item => item.data as Character);
      // Deduplicate in case there are duplicates in the DB
      const deduplicated = removeDuplicates(loadedChars);
      console.log(`[DM] Loaded ${loadedChars.length} characters, deduplicated to ${deduplicated.length}`);
      setMembers(deduplicated);
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
                    console.log(`[DM-Realtime] Character ${updatedChar.id} removed (left party)`);
                    return;
                }

                setMembers(prev => {
                    const updated = deduplicateAndMerge(prev, updatedChar);
                    // Only log if there was a change
                    if (updated.length !== prev.length || updated.some((c, i) => c.id !== prev[i]?.id)) {
                        console.log(`[DM-Realtime] Character updated: ${updatedChar.name}`);
                    }
                    return updated;
                });
            } else if (payload.eventType === 'DELETE') {
                const oldId = payload.old.id;
                setMembers(prev => prev.filter(c => c.id !== oldId));
                console.log(`[DM-Realtime] Character deleted: ${oldId}`);
            }
        },
        (broadcastChar: any) => {
            // Broadcast (Ephemeral Live Update) - use deduplicateAndMerge to avoid duplicates
            const char = broadcastChar as Character;
            setMembers(prev => {
                const updated = deduplicateAndMerge(prev, char);
                // Log only if it's a new character (length increased)
                if (updated.length > prev.length) {
                    console.log(`[DM-Broadcast] Character added via broadcast: ${char.name}`);
                }
                return updated;
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
    if (newParty) {
        setParties(prev => [...prev, newParty]);
        setParty(newParty);
        fetchMembers(newParty.id);
        setPartyName('');
    }
    setIsCreating(false);
  };

  const handleDeleteParty = async () => {
    if (!party || !user) return;
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE the table "${party.name}"? Players will be removed.`)) {
        setIsLoading(true);
        const success = await deleteParty(party.id, user.id);
        if (success) {
            setParties(prev => prev.filter(p => p.id !== party.id));
            setParty(null);
        } else {
            alert("Error deleting table.");
        }
        setIsLoading(false);
    }
  };

  const handleKickCharacter = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to kick ${name} from your table?`)) {
        setIsLoading(true);
        const success = await removeFromParty(id);
        if (success) {
            setMembers(prev => prev.filter(c => c.id !== id));
        } else {
            alert("Error removing character from the Nexus.");
        }
        setIsLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!party || !tempName.trim()) {
        setIsEditingName(false);
        return;
    }
    const success = await updatePartyName(party.id, tempName.trim());
    if (success) {
        setParty(prev => prev ? { ...prev, name: tempName.trim() } : null);
    }
    setIsEditingName(false);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0f172a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            {party && (
                <button 
                  onClick={() => setParty(null)}
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
                        onClick={() => party && fetchMembers(party.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Sync Manually"
                    >
                        <span className={`material-symbols-outlined ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                    <button 
                        onClick={handleDeleteParty}
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

      <main className="flex-1 p-6">
        {!party ? (
          <div className="space-y-8 max-w-sm mx-auto">
            {/* Header selection */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="size-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
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
                            onClick={() => {
                                setParty(p);
                                fetchMembers(p.id);
                            }}
                            className="bg-[#1e293b] border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer shadow-lg shadow-black/20 active:scale-95"
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
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter mb-1">O crear nueva</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <input 
                    type="text" 
                    placeholder="New campaign name..."
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <button 
                    onClick={handleCreateParty}
                    disabled={isCreating}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
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
        ) : (
          <div className="space-y-6 pb-24">
            <Suspense fallback={<div className="flex items-center justify-center p-20"><span className="material-symbols-outlined animate-spin text-blue-500">progress_activity</span></div>}>
                {activeTab === 'party' && (
                  <div className="grid gap-6">
                    {members.length === 0 ? (
                        <div className="text-center py-20 animate-pulse text-slate-600 italic">
                            Waiting for adventurers to join...
                        </div>
                    ) : (
                        members.map(member => (
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

                                {/* HP Bar */}
                                <div className="space-y-1.5 mb-6 cursor-pointer" onClick={() => onViewCharacter(member)}>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">HP</span>
                                        <span className="text-sm font-black">{member.hp.current} / {member.hp.max}</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
                                        <div 
                                        className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-700" 
                                        style={{ width: `${(Math.min(member.hp.current, member.hp.max) / member.hp.max) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Resource Footer */}
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                                        {Object.entries(getSpellSlotSummary(member)).map(([lvl, info]) => (
                                            <div key={lvl} className="bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10 flex items-center gap-1">
                                                <span className="text-[7px] font-black text-blue-400">{lvl}</span>
                                                <div className="flex gap-[2px]">
                                                    {Array.from({ length: info.max }).map((_, i) => (
                                                        <div key={i} className={`size-1 rounded-full ${member.usedSlots?.[`${lvl}-${i}`] ? 'bg-slate-700' : 'bg-blue-400 shadow-[0_0_2px_rgba(96,165,250,0.5)]'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => onViewCharacter(member)} className="text-[8px] font-black uppercase text-blue-400 hover:text-white transition-colors">Abrir Hoja</button>
                                </div>
                            </div>
                        ))
                    )}
                  </div>
                )}
                {activeTab === 'resources' && <CampaignResources partyId={party.id} />}
                {activeTab === 'compendium' && <Compendium />}
                {activeTab === 'monsters' && <MonsterBuilder playerLevels={members.map(m => m.level)} />}
                                {activeTab === 'initiative' && (
                                    <InitiativeTracker
                                        partyMembers={members}
                                        combatants={initiativeCombatants}
                                        onCombatantsChange={setInitiativeCombatants}
                                        onSyncParty={() => fetchMembers(party.id)}
                                    />
                                )}
                {activeTab === 'critical' && <CriticalFumbleTable />}
            </Suspense>
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav for DM */}
      {party && (
          <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
              <nav className="mx-auto max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-2 grid grid-cols-6 gap-1 shadow-2xl backdrop-blur-xl">
                  <button 
                    onClick={() => setActiveTab('party')}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === 'party' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <span className="material-symbols-outlined text-[20px]">groups</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter">Party</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('initiative')}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === 'initiative' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <span className="material-symbols-outlined text-[20px]">swords</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter">Init</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('critical')}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === 'critical' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <span className="material-symbols-outlined text-[20px]">casino</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter">Crit</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('resources')}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === 'resources' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <span className="material-symbols-outlined text-[20px]">photo_library</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter">Atlas</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('compendium')}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === 'compendium' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <span className="material-symbols-outlined text-[20px]">menu_book</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter">Ref</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('monsters')}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === 'monsters' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                      <span className="material-symbols-outlined text-[20px]">skull</span>
                      <span className="text-[7px] font-black uppercase tracking-tighter">Mobs</span>
                  </button>
              </nav>
          </div>
      )}
    </div>
  );
};

export default DMDashboard;
