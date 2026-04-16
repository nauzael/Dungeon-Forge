import React from 'react';
import { createPortal } from 'react-dom';
import { ALIGNMENTS, LANGUAGES } from '../../Data/characterOptions';
import { FEAT_OPTIONS } from '../../Data/feats/index';
import { UI } from '../../constants/ui';
const t = UI;
import { useGameData } from '../../hooks/useGameData';

interface Step3Props {
    selectedAlignment: string;
    setSelectedAlignment: (v: string) => void;
    selectedLanguage1: string;
    setSelectedLanguage1: (v: string) => void;
    selectedLanguage2: string;
    setSelectedLanguage2: (v: string) => void;
    selectedSpecies: string;
    selectedFeat: string;
    openFeatModal: (context: { type: 'human' }) => void;
    spellcastingAbility: string;
    setSpellcastingAbility: (v: any) => void;
    useStartingGold: boolean;
    setUseStartingGold: (v: boolean) => void;
}

const Step3Details: React.FC<Step3Props> = ({
    selectedAlignment, setSelectedAlignment, selectedLanguage1, setSelectedLanguage1,
    selectedLanguage2, setSelectedLanguage2, selectedSpecies, selectedFeat, openFeatModal,
    spellcastingAbility, setSpellcastingAbility, useStartingGold, setUseStartingGold
}) => {
    const { alignments, languages } = useGameData();



    return (
        <div className="px-6 py-4 space-y-4">
            <div>
                <h3 className="text-xl font-bold mb-3">{t.alignment}</h3>
                <div className="grid grid-cols-2 gap-3">
                    {alignments.map(align => (
                        <button key={align} onClick={() => setSelectedAlignment(align)} className={`p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${selectedAlignment === align ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-white/10 hover:border-slate-300'}`}>{align}</button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-bold mb-1">{t.additional_languages} (2)</h3>
                <select value={selectedLanguage1} onChange={(e) => setSelectedLanguage1(e.target.value)} className="w-full bg-white dark:bg-surface-dark border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="" disabled>{t.select_language_1}</option>
                    {languages.filter(l => l !== 'Common' && l !== selectedLanguage2).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={selectedLanguage2} onChange={(e) => setSelectedLanguage2(e.target.value)} className="w-full bg-white dark:bg-surface-dark border border-slate-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="" disabled>{t.select_language_2}</option>
                    {languages.filter(l => l !== 'Common' && l !== selectedLanguage1).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>

            {selectedSpecies === 'Human' && (
                <div>
                    <h3 className="text-xl font-bold mb-3">{t.human_feat}</h3>
                    <button onClick={() => openFeatModal({ type: 'human' })} className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 hover:border-primary/50 transition-all flex justify-between items-center">
                        <span className={`font-bold ${selectedFeat ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{selectedFeat || t.selectFeat}</span>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-300 p-3 bg-slate-200 dark:bg-white/5 rounded-lg border border-transparent">{FEAT_OPTIONS.find(f => f.name === selectedFeat)?.description}</p>
                </div>
            )}

            {['Elf', 'Tiefling', 'Aasimar', 'Gnome'].includes(selectedSpecies) && (
                <div className="animate-fadeIn">
                    <h3 className="text-xl font-bold mb-3">{t.innate_spellcasting_ability}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['INT', 'WIS', 'CHA'].map(abi => (
                            <button key={abi} onClick={() => setSpellcastingAbility(abi)} className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${spellcastingAbility === abi ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 dark:border-white/10 hover:border-slate-300'}`}>{abi}</button>
                        ))}
                    </div>
                    <p className="mt-2 text-[10px] text-slate-500 italic leading-snug">{t.innate_spells_note}</p>
                </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-xl font-bold mb-3">{t.starting_equipment}</h3>
                <div className="grid grid-cols-1 gap-3">
                    <button onClick={() => setUseStartingGold(false)} className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${!useStartingGold ? 'border-primary bg-primary/5 shadow-[0_4px_15px_rgba(53,158,255,0.1)]' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!useStartingGold ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                <span className="material-symbols-outlined text-2xl">inventory_2</span>
                            </div>
                            <div className="text-left">
                                <div className={`font-bold text-sm ${!useStartingGold ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{t.starting_equipment_title}</div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px]">{t.starting_equipment_desc}</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${!useStartingGold ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                            {!useStartingGold && <span className="material-symbols-outlined text-sm text-white">check</span>}
                        </div>
                    </button>

                    <button onClick={() => setUseStartingGold(true)} className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${useStartingGold ? 'border-primary bg-primary/5 shadow-[0_4px_15px_rgba(53,158,255,0.1)]' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${useStartingGold ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                <span className="material-symbols-outlined text-2xl">payments</span>
                            </div>
                            <div className="text-left">
                                <div className={`font-bold text-sm ${useStartingGold ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{t.starting_gold_title}</div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[200px]">{t.starting_gold_desc}</p>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${useStartingGold ? 'border-primary bg-primary' : 'border-slate-200'}`}>
                            {useStartingGold && <span className="material-symbols-outlined text-sm text-white">check</span>}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step3Details;