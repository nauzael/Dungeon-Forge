
import React, { useState } from 'react';
import { FEAT_OPTIONS } from '../../Data/feats/index';
import { UI } from '../../constants/ui';

const t = UI;

interface FeatModalProps {
    featModalContext: { type: 'human' | 'asi', level?: number } | null;
    selectedFeat: string;
    asiDecisions: any;
    handleFeatSelect: (name: string) => void;
    onClose: () => void;
}

const FeatModal: React.FC<FeatModalProps> = ({ featModalContext, selectedFeat, asiDecisions, handleFeatSelect, onClose }) => {
    const [featSearchQuery, setFeatSearchQuery] = useState('');

    const contextLevel = featModalContext?.type === 'asi' ? (featModalContext.level || 1) : 1;

    const getStatTranslation = (stat: string) => {
        const keyMap: Record<string, string> = {
            'STR': t.str, 'DEX': t.dex, 'CON': t.con,
            'INT': t.int, 'WIS': t.wis, 'CHA': t.cha
        };
        return keyMap[stat] || stat;
    };

    // Filter logic based on level and context
    const filteredFeats = FEAT_OPTIONS.filter(feat => {
        // 1. Level check
        if (feat.level > contextLevel) return false;

        // 2. Search check
        if (featSearchQuery && !feat.name.toLowerCase().includes(featSearchQuery.toLowerCase())) return false;

        // 3. Category logic
        if (featModalContext?.type === 'human') {
            return feat.category === 'Origin';
        }
        
        // At Level 4+ ASI choice, we can pick General, Style (if qualified), or Origin
        // Note: Ability Score Improvement is considered a General feat in this list
        return true;
    });

    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'Origin': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
            case 'General': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
            case 'Fighting Style': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50';
            case 'Epic Boon': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50';
            default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col animate-fadeIn pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md"
          style={{
            backgroundColor: 'var(--color-background)',
          }}>
            <div className="flex flex-col backdrop-blur-xl"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderBottomColor: 'var(--color-border)',
                borderBottomWidth: '1px',
              }}>
                <div className="flex items-center gap-4 p-4">
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
                      style={{
                        color: 'var(--color-text-primary)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)' }
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent' }>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder={t.search_feat} 
                            value={featSearchQuery} 
                            onChange={(e) => setFeatSearchQuery(e.target.value)} 
                            autoFocus 
                            className="w-full rounded-2xl py-2.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            style={{
                              backgroundColor: 'var(--color-background-secondary)',
                              borderColor: 'var(--color-border)',
                              borderWidth: '1px',
                              color: 'var(--color-text-primary)',
                            }} 
                        />
                        <span className="material-symbols-outlined absolute left-3.5 top-2.5" style={{ color: 'var(--color-text-muted)' }}>search</span>
                    </div>
                </div>
                <div className="px-5 pb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">filter_list</span>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>
                        {featModalContext?.type === 'human' ? 'Origin Feats Only' : `${t.select_feat_title} (Level ${contextLevel})`}
                    </h3>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe-bottom">
                {filteredFeats.length > 0 ? filteredFeats.map(feat => {
                    let isSelected = false;
                    if (featModalContext?.type === 'human') isSelected = selectedFeat === feat.name;
                    else if (featModalContext?.type === 'asi' && featModalContext.level) isSelected = asiDecisions[featModalContext.level]?.feat === feat.name;

                    return (
                        <button 
                            key={feat.name} 
                            onClick={() => handleFeatSelect(feat.name)} 
                            className={`w-full text-left p-5 rounded-3xl border-2 transition-all duration-200 relative overflow-hidden group ${isSelected ? 'border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.1)]' : 'border-slate-100 dark:border-white/5 hover:border-primary/30 hover:shadow-lg'}`}
                            style={isSelected ? {backgroundColor: 'var(--color-primary)', opacity: '0.05'} : {backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)'}}
                        >
                            {isSelected && (
                                <div className="absolute top-0 right-0 p-3">
                                    <span className="material-symbols-outlined text-primary text-2xl drop-shadow-sm">check_circle</span>
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-2 relative z-10">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryStyles(feat.category)}`}>
                                        {feat.category}
                                    </span>
                                    {feat.level > 1 && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" 
                                      style={{
                                        backgroundColor: 'var(--color-background-secondary)',
                                        borderColor: 'var(--color-border)',
                                        borderWidth: '1px',
                                        color: 'var(--color-text-muted)',
                                      }}>
                                        Lvl {feat.level}
                                    </span>
                                    )}
                                </div>
                                
                                <div className="min-w-0">
                                    <span className={`block font-black text-lg tracking-tight ${isSelected ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                        {feat.name}
                                    </span>
                                    {feat.prerequisite && (
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="material-symbols-outlined text-[10px] text-rose-500">lock</span>
                                            <span className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest">{feat.prerequisite}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                                    {feat.description}
                                </p>

                                {feat.asi && (
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <span className="material-symbols-outlined text-[12px] text-emerald-500">add_circle</span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                                            +1 {t.to} {feat.asi.map(a => getStatTranslation(a)).join(` ${t.or} `)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-white/5 mb-4">search_off</span>
                        <p className="text-slate-500 font-bold">{t.no_results_found}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeatModal;
