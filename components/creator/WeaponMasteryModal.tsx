
import React, { useState } from 'react';
import { WEAPONS_DB, MASTERY_DESCRIPTIONS } from '../../Data/items';
import { WeaponData } from '../../types';
import { UI } from '../../constants/ui';

interface WeaponMasteryModalProps {
    currentSlot: number;
    selectedMasteries: string[];
    onSelect: (weaponName: string) => void;
    onClose: () => void;
}

const WeaponMasteryModal: React.FC<WeaponMasteryModalProps> = ({ currentSlot, selectedMasteries, onSelect, onClose }) => {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    
    const availableWeapons = (Object.values(WEAPONS_DB) as WeaponData[])
        .filter(w => w.mastery && w.mastery !== '-')
        .filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-fadeIn pt-[env(safe-area-inset-top)]">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark">
                <div className="flex items-center gap-4 p-4">
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">close</span>
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder={t.search_feat || "Buscar..."} // Reusing or fallback
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            autoFocus 
                            className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-slate-900 dark:text-white outline-none focus:border-primary/50" 
                        />
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500">search</span>
                    </div>
                </div>
                <div className="px-5 pb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">{t.weapon_masteries}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.mastery_slot} {currentSlot + 1}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl">swords</span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-[env(safe-area-inset-bottom)] scroll-smooth no-scrollbar">
                {availableWeapons.map(weapon => {
                    const isTakenInOtherSlot = selectedMasteries.includes(weapon.name) && selectedMasteries[currentSlot] !== weapon.name;
                    const isSelectedInThisSlot = selectedMasteries[currentSlot] === weapon.name;

                    return (
                        <button 
                            key={weapon.name} 
                            disabled={isTakenInOtherSlot}
                            onClick={() => {
                                onSelect(weapon.name);
                                onClose();
                            }}
                            className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                                isSelectedInThisSlot 
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(53,158,255,0.1)]' 
                                : isTakenInOtherSlot 
                                ? 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-40 cursor-not-allowed' 
                                : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-white/10 hover:border-primary/40'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold text-lg ${isSelectedInThisSlot ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                            {weapon.name}
                                        </span>
                                        {isSelectedInThisSlot && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                            {weapon.mastery}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                                            {weapon.category} • {weapon.rangeType}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{weapon.damage}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">{weapon.damageType}</div>
                                </div>
                            </div>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-200/60 leading-relaxed italic">
                                {weapon.mastery && MASTERY_DESCRIPTIONS[weapon.mastery] || ""}
                            </p>

                            {isTakenInOtherSlot && (
                                <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase bg-slate-200/50 dark:bg-white/10 px-2 py-1 rounded-md">
                                    <span className="material-symbols-outlined text-[12px]">lock</span>
                                    {t.chosen || "Elegido"}
                                </div>
                            )}
                        </button>
                    );
                })}
                
                {availableWeapons.length === 0 && (
                    <div className="py-20 text-center opacity-50">
                        <span className="material-symbols-outlined text-5xl mb-2">search_off</span>
                        <p className="text-sm font-medium">No weapons with mastery found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeaponMasteryModal;
