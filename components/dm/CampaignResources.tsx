
import React, { useState, useEffect, useRef } from 'react';
import { CampaignResource } from '../../types';
import { getPartyResources, addPartyResource, deletePartyResource, broadcastResourceShare, broadcastResourceHide, uploadResourceImage, updatePartyResourcePersistence } from '../../utils/supabase';

const CampaignResources: React.FC<{ partyId: string }> = ({ partyId }) => {
    const [resources, setResources] = useState<CampaignResource[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [activeRevealedId, setActiveRevealedId] = useState<string | null>(null);
    const [newRes, setNewRes] = useState({ 
        title: '', 
        url: '', 
        type: 'Setting' as any, 
        description: '',
        is_persistent: true 
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchResources = async () => {
        setIsLoading(true);
        const data = await getPartyResources(partyId);
        setResources(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchResources();
    }, [partyId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const publicUrl = await uploadResourceImage(file);
        if (publicUrl) {
            setNewRes(prev => ({ ...prev, url: publicUrl }));
        } else {
            alert("Error uploading image. Try again.");
        }
        setIsUploading(false);
    };

    const handleAdd = async () => {
        if (!newRes.title || !newRes.url) {
            alert("Por favor, ponle un título y sube una imagen.");
            return;
        }
        
        setIsLoading(true);
        const added = await addPartyResource({
            party_id: partyId,
            ...newRes
        });

        if (added) {
            setResources(prev => [added, ...prev]);
            setShowAdd(false);
            setNewRes({ title: '', url: '', type: 'Setting', description: '', is_persistent: true });
        }
        setIsLoading(false);
    };

    const handleRevealToggle = (res: CampaignResource) => {
        if (activeRevealedId === res.id) {
            broadcastResourceHide(partyId);
            setActiveRevealedId(null);
        } else {
            broadcastResourceShare(partyId, {
                url: res.url,
                title: res.title,
                description: res.description
            });
            setActiveRevealedId(res.id);
        }
    };

    const handlePersistenceToggle = async (res: CampaignResource) => {
        const newStatus = !res.is_persistent;
        const success = await updatePartyResourcePersistence(res.id, newStatus);
        if (success) {
            setResources(prev => prev.map(r => r.id === res.id ? { ...r, is_persistent: newStatus } : r));
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Eliminar este recurso permanentemente?")) {
            const success = await deletePartyResource(id);
            if (success) {
                setResources(prev => prev.filter(r => r.id !== id));
                if (activeRevealedId === id) {
                    broadcastResourceHide(partyId);
                    setActiveRevealedId(null);
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white/90 leading-none">Scenario Management</h2>
                    <p className="text-[9px] font-black uppercase text-blue-400 tracking-tighter">Campaign Tactical Atlas</p>
                </div>
                <button 
                    onClick={() => setShowAdd(true)}
                    className="size-10 rounded-full bg-blue-600 flex items-center justify-center border-4 border-[#0f172a] shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
                >
                    <span className="material-symbols-outlined text-white">add</span>
                </button>
            </div>

            {showAdd && (
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-blue-500/20 space-y-4 animate-slideDown shadow-2xl">
                    <h3 className="text-sm font-black uppercase text-blue-400">Archivar Nuevo Recurso</h3>
                    <div className="space-y-3">
                        <input 
                            type="text" 
                            placeholder="Title (e.g. Tavern Map)"
                            value={newRes.title}
                            onChange={(e) => setNewRes({...newRes, title: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                        />
                        
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${newRes.url ? 'border-emerald-500/50' : 'border-white/10 hover:border-blue-500/30'}`}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            {newRes.url ? (
                                <>
                                    <img src={newRes.url} className="w-full h-full object-cover opacity-40" alt="Preview" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase mt-2">Imagen lista</span>
                                    </div>
                                </>
                            ) : isUploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-400 animate-spin text-3xl">sync</span>
                                    <span className="text-[10px] font-black text-blue-400 uppercase">Subiendo...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-500 text-3xl">add_photo_alternate</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase text-center px-4">Tap to upload image</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            {['Map', 'Setting', 'NPC', 'Item'].map(t => (
                                <button 
                                    key={t}
                                    type="button"
                                    onClick={() => setNewRes({...newRes, type: t as any})}
                                    className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-tighter border transition-all ${newRes.type === t ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                >
                                    {t === 'Map' ? 'Mapa' : t === 'Setting' ? 'Entorno' : t}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-black uppercase text-white leading-none">Persistencia Automática</span>
                                <p className="text-[8px] text-slate-500 uppercase font-bold">Appears in Players' Notes</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setNewRes({...newRes, is_persistent: !newRes.is_persistent})}
                                className={`w-10 h-5 rounded-full transition-colors relative ${newRes.is_persistent ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 size-3 rounded-full bg-white transition-all ${newRes.is_persistent ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex gap-3 pt-2">
                             <button onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-xl">Cancelar</button>
                             <button disabled={isLoading || isUploading} onClick={handleAdd} className={`flex-1 py-3 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg transition-all ${isLoading || isUploading ? 'bg-slate-700' : 'bg-blue-600'}`}>
                                {isLoading ? 'Guardando...' : 'Archivar'}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 pb-20">
                {resources.length === 0 && !isLoading && (
                    <div className="text-center py-20 text-slate-600 italic font-medium">Atlas vacío. Agrega mapas o escenas de referencia.</div>
                )}
                {resources.map(res => (
                    <div key={res.id} className="group bg-[#1e293b] rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-blue-500/20">
                        <div className="h-48 relative overflow-hidden">
                            <img src={res.url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                <span className="bg-black/60 backdrop-blur-md text-[8px] font-black uppercase text-blue-400 px-2 py-1 rounded-full border border-blue-500/20 tracking-widest w-fit">{res.type}</span>
                                {activeRevealedId === res.id && (
                                    <span className="bg-red-500/80 backdrop-blur-md text-[8px] font-black uppercase text-white px-2 py-1 rounded-full border border-red-400/20 tracking-widest flex items-center gap-1 animate-pulse">
                                        <span className="material-symbols-outlined text-[10px]">sensors</span> EN VIVO
                                    </span>
                                )}
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-tight drop-shadow-lg">{res.title}</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 grid grid-cols-3 gap-2 bg-slate-900/50">
                            {/* REVEAL / HIDE BUTTON */}
                            <button 
                                onClick={() => handleRevealToggle(res)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${activeRevealedId === res.id ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                            >
                                <span className="material-symbols-outlined text-xl mb-1">{activeRevealedId === res.id ? 'visibility_off' : 'visibility'}</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter">{activeRevealedId === res.id ? 'Ocultar' : 'Revelar'}</span>
                            </button>

                            {/* PERSISTENCE BUTTON (SHARE) */}
                            <button 
                                onClick={() => handlePersistenceToggle(res)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${res.is_persistent ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/5 text-slate-500 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                            >
                                <span className="material-symbols-outlined text-xl mb-1">{res.is_persistent ? 'auto_stories' : 'share'}</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter">{res.is_persistent ? 'Compartido' : 'Compartir'}</span>
                            </button>

                            {/* DELETE BUTTON */}
                            <button 
                                onClick={() => handleDelete(res.id)}
                                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-xl mb-1">delete</span>
                                <span className="text-[8px] font-black uppercase tracking-tighter">Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignResources;
