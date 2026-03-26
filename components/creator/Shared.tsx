
import React, { useState } from 'react';
import { Trait, SubclassData } from '../../types';
import { GENERIC_FEATURES } from '../../Data/feats';
import { useLanguage } from '../../hooks/useLanguage';
import { useClasses } from '../../Data/classes/index';

export const SectionSeparator = ({ label }: { label: string }) => (
  <div className="relative py-6 flex items-center justify-center w-full px-6">
    <div className="absolute inset-0 flex items-center px-6">
      <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
    </div>
    <div className="relative flex justify-center">
      <span className="bg-background-light dark:bg-background-dark px-4 text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-white/10 rounded-full py-1 shadow-sm">
        {label}
      </span>
    </div>
  </div>
);

export const ClassProgressionList = ({ selectedClass, subclassData, currentLevel }: { selectedClass: string, subclassData?: SubclassData, currentLevel: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const classes = useClasses();
  const classData = (classes[selectedClass] as any);

  return (
    <div className="mt-6 space-y-3 px-6">
      <div className="border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-surface-dark overflow-hidden transition-all duration-300 shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-slate-50 dark:bg-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.class_progression}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.see_levels_1_20}</p>
            </div>
          </div>
          <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
            expand_more
          </span>
        </button>

        <div className={`transition-[grid-template-rows] duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="p-4 pt-2 space-y-0 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => {
                const features: { name: string, desc: string }[] = [];

                if (lvl === 1) {
                  classData?.details?.traits.forEach((t: Trait) => features.push({ name: t.name, desc: t.description }));
                } else {
                  const classFeats = classData?.progression?.[lvl] || [];
                  classFeats.forEach((feat: string) => {
                    let desc = GENERIC_FEATURES?.[feat];
                    if (!desc && (feat.includes("Ability Score") || feat.includes("Epic Boon"))) desc = t.choose_asi_or_feat;
                    if (!desc && feat.includes("Subclass")) desc = t.gain_subclass_feature;
                    features.push({ name: feat, desc: desc || "" });
                  });
                }

                if (subclassData && subclassData.features[lvl]) {
                  subclassData.features[lvl].forEach(trait => {
                    features.push({ name: trait.name, desc: trait.description });
                  });
                }

                if (features.length === 0) return null;

                return (
                  <div key={lvl} className="relative pl-6 pb-6 border-l-2 border-slate-200 dark:border-slate-700 ml-2 last:border-0 last:pb-0">
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${lvl <= currentLevel ? 'bg-primary border-primary' : 'bg-background-light dark:bg-background-dark border-slate-300 dark:border-slate-600'}`}></div>

                    <div className="flex flex-col gap-1 -mt-1.5">
                      <span className={`text-xs font-bold uppercase tracking-wider ${lvl <= currentLevel ? 'text-primary' : 'text-slate-400'}`}>{t.level} {lvl}</span>
                      <div className="space-y-2 mt-1">
                        {features.map((feat, idx) => (
                          <div key={idx} className={`bg-white dark:bg-surface-dark p-3 rounded-lg border shadow-sm ${lvl <= currentLevel ? 'border-primary/30' : 'border-slate-200 dark:border-white/5'}`}>
                            <span className={`block font-bold text-sm ${lvl <= currentLevel ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{feat.name}</span>
                            {feat.desc && <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{feat.desc}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};