import React, { useState, useRef } from 'react';
import { Character } from '../../../../types';
import { SUBCLASS_OPTIONS } from '../../../../Data/characterOptions';

interface SubclassStepProps {
    character: Character;
    nextLevel: number;
    selectedSubclass: string;
    onSelect: (subclass: string) => void;
}

const SubclassStep: React.FC<SubclassStepProps> = ({ character, nextLevel, selectedSubclass, onSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const subclasses = SUBCLASS_OPTIONS[character.class] || [];
    const currentSubclass = subclasses[currentIndex];

    const handlePrev = () => {
        setCurrentIndex(prev => (prev === 0 ? subclasses.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev === subclasses.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) handleNext();
            else handlePrev();
        }
    };

    if (subclasses.length === 0) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-4 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-white/20 mb-4">error</span>
                <p className="text-slate-500 dark:text-slate-400">
                    No subclasses available for {character.class}
                </p>
            </div>
        );
    }

    const level3Features = currentSubclass?.features?.[3] || [];
    const level6Features = currentSubclass?.features?.[6] || [];
    const level10Features = currentSubclass?.features?.[10] || [];
    const level14Features = currentSubclass?.features?.[14] || [];
    
    const allFeatures = [
        ...level3Features.map((f: any) => ({ ...f, level: 3 })),
        ...level6Features.map((f: any) => ({ ...f, level: 6 })),
        ...level10Features.map((f: any) => ({ ...f, level: 10 })),
        ...level14Features.map((f: any) => ({ ...f, level: 14 })),
    ].sort((a: any, b: any) => a.level - b.level);

    const alwaysPrepared = currentSubclass?.alwaysPreparedSpells?.[3] || [];

    return (
        <div className="flex flex-col h-full">
            <div className="text-center px-4 py-3 pb-2 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-white dark:border-white/20 shadow-sm">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    Choose Your Subclass
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {subclasses.length} options available
                </p>
            </div>

            <div
                className="flex-1 flex items-center px-3 relative overflow-hidden min-h-0"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="flex-1">
                    <div className="bg-white dark:bg-[#1a2235] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
                        <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 p-3 pb-2">
                            <div className="flex items-center justify-center gap-2 mb-1.5">
                                <span className="material-symbols-outlined text-purple-500 text-lg">shield</span>
                                <h3 className="text-base font-black text-slate-900 dark:text-white text-center tracking-tight">
                                    {currentSubclass?.name}
                                </h3>
                            </div>
                            {currentSubclass?.description && (
                                <p className="text-[10px] text-purple-600 dark:text-purple-400 italic text-center leading-snug">
                                    {currentSubclass.description.split('\n')[0]}
                                </p>
                            )}
                        </div>

                        <div className="p-3 space-y-3 max-h-[35vh] overflow-y-auto no-scrollbar">
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {currentSubclass?.description?.replace(currentSubclass.description.split('\n')[0], '').trim() || currentSubclass?.description}
                            </p>

                            <div className="border-t border-slate-100 dark:border-white/5 pt-2">
                                <h4 className="text-[12px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-xs">star</span>
                                    Level 3 Features
                                </h4>
                                <div className="space-y-2">
                                    {level3Features.map((feature: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-white/5 rounded-xl p-2.5">
                                            <p className="font-bold text-base text-slate-900 dark:text-white mb-0.5">
                                                {feature.name}
                                            </p>
                                            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {alwaysPrepared.length > 0 && (
                                <div className="border-t border-slate-100 dark:border-white/5 pt-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-xs">auto_fix_normal</span>
                                        Always Prepared
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {alwaysPrepared.map((spell: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="text-[9px] font-semibold px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg"
                                            >
                                                {spell}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <details className="border-t border-slate-100 dark:border-white/5 pt-2">
                                <summary className="text-[12px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-purple-500 transition-colors">
                                    View all features (6, 10, 14)
                                </summary>
                                <div className="mt-2 space-y-2">
                                    {allFeatures.filter((f: any) => f.level > 3).map((feature: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-white/5 rounded-xl p-2.5">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded">
                                                    Lv{feature.level}
                                                </span>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">
                                                    {feature.name}
                                                </p>
                                            </div>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 py-2 px-3 shrink-0">
                {subclasses.map((_: any, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                                ? 'w-5 bg-gradient-to-r from-purple-500 to-pink-500'
                                : 'w-2 bg-slate-300 dark:bg-white/20'
                        }`}
                    />
                ))}
            </div>

            <div className="p-3 pt-0 shrink-0">
                <button
                    onClick={() => onSelect(currentSubclass?.name)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-md hover:shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all active:scale-[0.98]"
                >
                    Select {currentSubclass?.name}
                </button>
            </div>
        </div>
    );
};

export default SubclassStep;
