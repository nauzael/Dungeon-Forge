import React, { useState } from 'react';
import { Character } from '../../../../types';
import { CANTRIPS } from '../../../../Data/spells/cantrips';
import { UI } from '../../../../constants/ui';

interface WizardCantripsStepProps {
    character: Character;
    selectedCantrips: string[];
    cantripCount: number;
    onCantripsChange: (cantrips: string[]) => void;
    isAdditional?: boolean;
}

const WIZARD_CANTEIPS = [
    'Acid Splash',
    'Blade Ward',
    'Chill Touch',
    'Fire Bolt',
    'Friends',
    'Light',
    'Mage Hand',
    'Mending',
    'Message',
    'Mind Sliver',
    'Minor Illusion',
    'Poison Spray',
    'Prestidigitation',
    'Ray of Frost',
    'Shocking Grasp',
    'Starry Wisp',
    'Thunderclap',
    'Toll the Dead',
];

const WizardCantripsStep: React.FC<WizardCantripsStepProps> = ({
    character,
    selectedCantrips,
    cantripCount,
    onCantripsChange,
    isAdditional = false,
}) => {
    const t = UI;
    const [showPicker, setShowPicker] = useState(false);

    const toggleCantrip = (cantripName: string) => {
        if (selectedCantrips.includes(cantripName)) {
            onCantripsChange(selectedCantrips.filter(c => c !== cantripName));
        } else if (selectedCantrips.length < cantripCount) {
            onCantripsChange([...selectedCantrips, cantripName]);
        }
    };

    const handleConfirm = () => {
        setShowPicker(false);
    };

    return (
        <div className="px-4 py-5 space-y-5">
            <div className="text-center space-y-1.5">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isAdditional ? 'Cantrips Adicionales' : (t.choose_cantrips || 'Elegir Cantrips')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {isAdditional 
                        ? `Selecciona ${cantripCount} cantrip adicional${cantripCount > 1 ? 's' : ''} de Wizard`
                        : `Selecciona ${cantripCount} cantrip${cantripCount > 1 ? 's' : ''} de Wizard para tu Eldritch Knight`
                    }
                </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        {t.cantrips_label || 'Cantrips'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedCantrips.length}/{cantripCount}
                    </span>
                </div>
                
                <div className="space-y-2">
                    {selectedCantrips.length === 0 ? (
                        <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-xs">
                            {'Toca para seleccionar cantrips'}
                        </div>
                    ) : (
                        selectedCantrips.map(cantripName => {
                            const cantrip = CANTRIPS[cantripName];
                            return (
                                <div 
                                    key={cantripName}
                                    className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-white/10"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">
                                                {cantripName}
                                            </div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                {cantrip?.school || 'Wizard'} • {cantrip?.castingTime || 'Action'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleCantrip(cantripName)}
                                            className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0"
                                        >
                                            <span className="material-symbols-outlined text-sm text-red-600 dark:text-red-400">remove</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <button
                    onClick={() => setShowPicker(true)}
                    disabled={selectedCantrips.length >= cantripCount}
                    className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedCantrips.length >= cantripCount
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]'
                    }`}
                >
                    {selectedCantrips.length >= cantripCount 
                        ? '✓ Cantrips Seleccionados'
                        : '+ Añadir Cantrips'
                    }
                </button>
            </div>

            {showPicker && (
                <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fadeIn">
                    <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[80vh] flex flex-col animate-slideUp overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
                            <button
                                onClick={() => setShowPicker(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                    {'Cantrips de Wizard'}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    Selecciona {cantripCount - selectedCantrips.length} más
                                </span>
                            </div>
                            <div className="w-10" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {WIZARD_CANTEIPS.filter(cantripName => !selectedCantrips.includes(cantripName) || selectedCantrips.length < cantripCount).map(cantripName => {
                                const cantrip = CANTRIPS[cantripName];
                                const isSelected = selectedCantrips.includes(cantripName);
                                
                                return (
                                    <button
                                        key={cantripName}
                                        onClick={() => toggleCantrip(cantripName)}
                                        disabled={isSelected || (selectedCantrips.length >= cantripCount && !isSelected)}
                                        className={`w-full text-left rounded-xl p-3 transition-all ${
                                            isSelected
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-500'
                                                : selectedCantrips.length >= cantripCount
                                                ? 'bg-slate-50 dark:bg-white/5 opacity-50 cursor-not-allowed'
                                                : 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500 active:scale-[0.98]'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {cantripName}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="material-symbols-outlined text-sm text-emerald-600 dark:text-emerald-400">check_circle</span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">
                                                    {cantrip?.school || 'Wizard'} • {cantrip?.castingTime || 'Action'} • {cantrip?.range || 'Self'}
                                                </div>
                                                <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                                                    {cantrip?.description?.split('\n')[0] || 'Cantrip de Wizard'}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-white/10 shrink-0">
                            <button
                                onClick={handleConfirm}
                                className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 active:scale-[0.98] transition-all"
                            >
                                {'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3 border border-amber-200 dark:border-amber-500/20">
                <div className="flex gap-2.5">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg shrink-0">info</span>
                    <div className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
                        <p className="font-bold">{'Nota sobre Cantrips'}</p>
                        <p>{'Los cantrips usan Inteligencia (INT) como tu atributo de lanzamiento de hechizos. Puedes cambiarlos en largos descansos.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WizardCantripsStep;
