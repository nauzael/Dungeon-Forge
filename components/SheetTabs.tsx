
import React, { useState, useMemo, useRef, useEffect, memo, useCallback } from 'react';
import { Character, SheetTab, Ability } from '../types';
import CombatTab from './sheet/CombatTab';
import InventoryTab from './sheet/InventoryTab';
import SpellsTab from './sheet/SpellsTab';
import FeaturesTab from './sheet/FeaturesTab';
import NotesTab from './sheet/NotesTab';
import JoinPartyModal from './JoinPartyModal';
import LevelUpWizard from './sheet/LevelUpWizard/LevelUpWizard';
import { getEffectiveCasterType, getFinalStats } from '../utils/sheetUtils';
import { HIT_DIE, CLASS_PROGRESSION, SUBCLASS_OPTIONS, METAMAGIC_OPTIONS } from '../Data/characterOptions';
import { FEAT_OPTIONS, GENERIC_FEATURES } from '../Data/feats/index';

interface SheetTabsProps {
  character: Character;
  onBack: () => void;
  onUpdate: (char: Character) => void;
  isReadOnly?: boolean;
  isObserver?: boolean;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ character, onBack, onUpdate, isReadOnly, isObserver }) => {
  const [activeTab, setActiveTab] = useState<SheetTab>('combat');
  const [showJoinParty, setShowJoinParty] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const t = {
    combat: 'Combat',
    features: 'Features',
    spells: 'Spells',
    inventory: 'Inventory',
    notes: 'Notes',
    bag: 'Bag',
    levelUp: 'Level Up',
    level: 'Level',
    hpMaxIncrease: 'Max HP Increase',
    chooseMetamagic: 'Choose Metamagic ({metamagicCount})',
    chooseSubclass: 'Choose Subclass',
    selectSubclass: 'Select subclass...',
    abilityImprovement: 'Ability Improvement',
    stats: 'Stats',
    feat: 'Feat',
    selectFeat: 'Select feat...',
    cancel: 'Cancel',
    confirm: 'Confirm',
    levelMaxReached: 'Maximum level reached',
    subirNivel: 'Level Up',
  };
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [manualHpGain, setManualHpGain] = useState<string>('');
  
  const [pendingSubclass, setPendingSubclass] = useState<string>('');
  const [pendingAsiType, setPendingAsiType] = useState<'stat' | 'feat'>('stat');
  const [pendingStat1, setPendingStat1] = useState<Ability>('STR');
  const [pendingStat2, setPendingStat2] = useState<Ability>('STR');
  const [pendingFeat, setPendingFeat] = useState<string>('');
  const [pendingMetamagics, setPendingMetamagics] = useState<string[]>([]);

  const touchStart = useRef<{ x: number, y: number } | null>(null);
  const touchEnd = useRef<{ x: number, y: number } | null>(null);
  const minSwipeDistance = 50;

  const magicInitiateType = useMemo(() => {
      const feats = character.feats || [];
      if (feats.some(f => f.includes('Magic Initiate (Cleric)'))) return 'Cleric';
      if (feats.some(f => f.includes('Magic Initiate (Druid)'))) return 'Druid';
      if (feats.some(f => f.includes('Magic Initiate (Wizard)'))) return 'Wizard';
      return null;
  }, [character.feats]);

  const effectiveCasterType = useMemo(() => getEffectiveCasterType(character), [character]);

  const isCaster = effectiveCasterType !== 'none' || !!magicInitiateType || (character.preparedSpells && character.preparedSpells.length > 0);

  const tabs = [
    { id: 'combat', icon: 'swords', label: t.combat },
    { id: 'features', icon: 'stars', label: t.features },
    { id: 'spells', icon: 'auto_stories', label: t.spells, disabled: !isCaster },
    { id: 'inventory', icon: 'backpack', label: t.bag },
    { id: 'notes', icon: 'edit_note', label: t.notes },
  ];

  const handleTabChange = (newTabId: SheetTab) => {
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      const newIndex = tabs.findIndex(t => t.id === newTabId);
      if (currentIndex === newIndex) return;
      setSlideDirection(newIndex > currentIndex ? 'forward' : 'backward');
      setActiveTab(newTabId);
      if (mainScrollRef.current) mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    if (Math.abs(distanceY) > Math.abs(distanceX)) return;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
        const validTabs = tabs.filter(t => !t.disabled);
        const currentIndex = validTabs.findIndex(t => t.id === activeTab);
        if (isLeftSwipe && currentIndex < validTabs.length - 1) handleTabChange(validTabs[currentIndex + 1].id as SheetTab);
        if (isRightSwipe && currentIndex > 0) handleTabChange(validTabs[currentIndex - 1].id as SheetTab);
    }
  };

  const initiateLevelUp = () => {
      if (character.level >= 20) {
          alert(t.levelMaxReached);
          return;
      }
      const stats = getFinalStats(character);
      const conMod = Math.floor(((stats.CON || 10) - 10) / 2);
      const hitDie = HIT_DIE[character.class] || 8;
      const isDraconic = character.subclass === 'Draconic Sorcery';
      const draconicBonus = isDraconic ? 1 : 0;
      const hasDuro = character.feats.some(f => f === 'Duro' || f === 'Tough');
      const duroBonus = hasDuro ? 2 : 0;
      const avgGain = Math.floor(hitDie / 2) + 1;
      const totalGain = Math.max(1, avgGain + conMod + draconicBonus + duroBonus);
      setManualHpGain(totalGain.toString());
      setPendingSubclass('');
      setPendingAsiType('stat');
      setPendingFeat('');
      setPendingStat1('STR');
      setPendingStat2('DEX');
      setPendingMetamagics([]);
      setShowLevelUp(true);
  };

  const nextLevel = character.level + 1;
  const newFeatures = CLASS_PROGRESSION[character.class]?.[nextLevel] || [];
  const needsSubclass = !character.subclass && newFeatures.some(f => f.toLowerCase().includes('subclass'));
  const needsAsi = newFeatures.some(f => f.toLowerCase().includes('ability score improvement'));
  const needsMetamagic = character.class === 'Sorcerer' && (nextLevel === 2 || nextLevel === 10 || nextLevel === 17);
  const metamagicCount = nextLevel === 2 ? 2 : 1;

  const togglePendingMetamagic = (meta: string) => {
      if (pendingMetamagics.includes(meta)) setPendingMetamagics(prev => prev.filter(m => m !== meta));
      else if (pendingMetamagics.length < metamagicCount) setPendingMetamagics(prev => [...prev, meta]);
  };

  const confirmLevelUp = () => {
      const hpGain = parseInt(manualHpGain) || 0;
      const newProf = Math.ceil(1 + (nextLevel / 4));
      let extraHp = 0;
      if (needsSubclass && pendingSubclass === 'Draconic Sorcery') extraHp += nextLevel; 
      if (needsAsi && pendingAsiType === 'feat' && (pendingFeat === 'Duro' || pendingFeat === 'Tough')) extraHp += (nextLevel * 2);

      const updatedChar = {
          ...character,
          level: nextLevel,
          profBonus: newProf,
          hp: {
              ...character.hp,
              max: character.hp.max + hpGain + extraHp,
              current: character.hp.current + hpGain + extraHp 
          },
          metamagics: [...(character.metamagics || []), ...pendingMetamagics]
      };

      // Monk Focus update
      if (character.class === 'Monk') {
          updatedChar.focus = { current: nextLevel, max: nextLevel };
      }

      if (needsSubclass && pendingSubclass) {
          updatedChar.subclass = pendingSubclass;
          
          const subclassData = SUBCLASS_OPTIONS[character.class]?.find(s => s.name === pendingSubclass);
          
          if (subclassData?.alwaysPreparedSpells) {
              const spellsToAdd: string[] = [];
              Object.entries(subclassData.alwaysPreparedSpells).forEach(([lvl, spells]) => {
                  if (parseInt(lvl) <= nextLevel) {
                      spellsToAdd.push(...spells);
                  }
              });
              
              if (spellsToAdd.length > 0) {
                  updatedChar.preparedSpells = [...new Set([...(updatedChar.preparedSpells || []), ...spellsToAdd])];
              }
          }
      }
      if (needsAsi) {
          if (pendingAsiType === 'feat' && pendingFeat) updatedChar.feats = [...(updatedChar.feats || []), pendingFeat];
          else {
              const newStats = { ...updatedChar.stats };
              newStats[pendingStat1] = (newStats[pendingStat1] || 10) + 1;
              newStats[pendingStat2] = (newStats[pendingStat2] || 10) + 1;
              if (newStats[pendingStat1] > 20) newStats[pendingStat1] = 20;
              if (newStats[pendingStat2] > 20) newStats[pendingStat2] = 20;
              updatedChar.stats = newStats;
          }
      }
      // Adjust Lucky counter to new proficiency bonus if character has the feat
      const hasLucky = (updatedChar.feats || []).some(f => f === 'Afortunado' || f === 'Lucky');
      if (hasLucky) {
          const current = Math.min(updatedChar.lucky?.current ?? newProf, newProf);
          updatedChar.lucky = { current, max: newProf };
      }

      // Update class resources based on new level
      const newLevel = nextLevel;
      const newStats = getFinalStats(updatedChar);
      const newChaMod = Math.floor(((newStats.CHA || 10) - 10) / 2);

      if (updatedChar.class === 'Barbarian') {
          const newRageMax = newLevel >= 20 ? 99 : newLevel >= 17 ? 6 : newLevel >= 12 ? 5 : newLevel >= 6 ? 4 : newLevel >= 3 ? 3 : 2;
          updatedChar.rageUses = { current: newRageMax, max: newRageMax };
      }
      if (updatedChar.class === 'Bard') {
          const newBardicMax = Math.max(1, newChaMod);
          updatedChar.bardicInspiration = { current: newBardicMax, max: newBardicMax };
      }
      if (updatedChar.class === 'Cleric') {
          const newCDMax = newLevel >= 18 ? 3 : newLevel >= 6 ? 2 : 1;
          updatedChar.channelDivinity = { current: newCDMax, max: newCDMax };
      }
      if (updatedChar.class === 'Paladin') {
          const newCDMax = newLevel >= 11 ? 3 : newLevel >= 7 ? 2 : 1;
          updatedChar.channelDivinity = { current: newCDMax, max: newCDMax };
          updatedChar.layOnHands = { current: newLevel * 5, max: newLevel * 5 };
      }
      if (updatedChar.class === 'Druid') {
          updatedChar.wildShape = { current: 2, max: 2 };
      }
      if (updatedChar.class === 'Fighter') {
          const newActionSurgeMax = newLevel >= 17 ? 2 : 1;
          updatedChar.actionSurge = { current: newActionSurgeMax, max: newActionSurgeMax };
          updatedChar.secondWind = { current: 1, max: 1 };
      }

      onUpdate(updatedChar);
      setShowLevelUp(false);

  };

  const isLevelUpValid = () => {
      if (needsSubclass && !pendingSubclass) return false;
      if (needsAsi && pendingAsiType === 'feat' && !pendingFeat) return false;
      if (needsAsi && pendingAsiType === 'stat' && pendingStat1 === pendingStat2) {
          // Permitted if level 4+, as they can choose 2 different +1s or one +2 
          // but the current implementation assumes two different +1s for simplicity
          // and capping.
      }
      if (needsMetamagic && pendingMetamagics.length < metamagicCount) return false;
      return true;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 512;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Save as high-quality WebP to dramatically reduce base64 size
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            onUpdate({ ...character, imageUrl: dataUrl });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
        className="flex flex-col h-full min-h-screen bg-background-light dark:bg-background-dark relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-right { animation: slideInRight 0.3s ease-out forwards; }
        .animate-slide-left { animation: slideInLeft 0.3s ease-out forwards; }
      `}</style>

      <input 
        type="file" 
        ref={avatarInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-4 py-4 flex items-center gap-4 pt-[calc(1.25rem+env(safe-area-inset-top))]">
        <button onClick={onBack} className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 active:scale-95 transition-all text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex flex-1 items-center gap-4 min-w-0">
          {/* Avatar Section */}
          <div className="relative group shrink-0" onClick={() => !isReadOnly && avatarInputRef.current?.click()}>
            <div className={`size-14 rounded-2xl overflow-hidden shadow-xl ring-2 ring-primary/20 bg-slate-100 dark:bg-black/40 transition-all ${!isReadOnly ? 'group-active:scale-95 cursor-pointer' : ''}`}>
              {character.imageUrl && !character.imageUrl.includes('placeholder.svg') ? (
                <img 
                  key={character.imageUrl}
                  src={character.imageUrl} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${character.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                  }}
                  className="w-full h-full object-cover" 
                  alt={character.name} 
                />
              ) : (
                <img 
                   src={`https://api.dicebear.com/7.x/bottts/svg?seed=${character.name}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                   className="w-full h-full object-cover opacity-80"
                   alt="Default Avatar"
                />
              )}
            </div>
            {!isReadOnly && (
                <div className="absolute -bottom-1 -right-1 size-6 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <span className="material-symbols-outlined text-[14px] text-white">edit</span>
                </div>
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="font-extrabold text-xl leading-[0.8] text-slate-900 dark:text-white truncate pb-1">
              {character.name}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500 truncate">
              Lvl {character.level} {character.class} • {character.subspecies || character.species}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {!isReadOnly && (
             <button 
               onClick={() => setShowJoinParty(true)}
               className={`flex size-10 items-center justify-center rounded-2xl transition-all active:scale-95 border ${
                 character.party_id 
                   ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' 
                   : 'bg-slate-100 dark:bg-white/5 border-black/5 dark:border-white/5 text-slate-400'
               }`}
             >
               <span className={`material-symbols-outlined text-[20px] ${character.party_id ? 'animate-pulse' : ''}`}>
                 {character.party_id ? 'hub' : 'link'}
               </span>
             </button>
           )}

          {!isReadOnly && character.level < 20 && (
            <button 
              onClick={() => initiateLevelUp()} 
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] font-black">keyboard_double_arrow_up</span>
            </button>
          )}

          {isObserver && !isReadOnly && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
                  <span className="material-symbols-outlined text-[16px]">edit_square</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">MODO DM</span>
              </div>
          )}

          {isReadOnly && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">VISTA DM</span>
              </div>
          )}
        </div>
      </div>

      <main 
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto no-scrollbar relative overflow-x-hidden"
      >
        <div 
            key={activeTab} 
            className={`min-h-full ${slideDirection === 'forward' ? 'animate-slide-right' : 'animate-slide-left'}`}
        >
            {activeTab === 'combat' && <CombatTab character={character} onUpdate={onUpdate} isReadOnly={isReadOnly || isObserver} />}
            {activeTab === 'inventory' && <InventoryTab character={character} onUpdate={onUpdate} isReadOnly={isReadOnly || isObserver} />}
            {activeTab === 'spells' && <SpellsTab character={character} onUpdate={onUpdate} isReadOnly={isReadOnly || isObserver} />}
            {activeTab === 'features' && <FeaturesTab character={character} onUpdate={onUpdate} isReadOnly={isReadOnly || isObserver} />}
            {activeTab === 'notes' && <NotesTab character={character} onUpdate={onUpdate} isReadOnly={isReadOnly || isObserver} />}
        </div>
      </main>

      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-1.5 z-40 flex items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id as SheetTab)}
              disabled={tab.disabled}
              className={`flex items-center justify-center gap-2 h-11 rounded-full transition-all duration-300 overflow-hidden ${
                  activeTab === tab.id 
                    ? 'text-white bg-primary shadow-lg shadow-primary/25 px-5' 
                    : `text-slate-400 dark:text-slate-500 w-11 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-300 ${tab.disabled ? 'opacity-30 cursor-not-allowed' : ''}`
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] shrink-0 ${activeTab === tab.id ? 'animate-bounce-subtle' : ''}`}>{tab.icon}</span>
              {activeTab === tab.id && (
                  <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">{tab.label}</span>
              )}
            </button>
          ))}
      </div>

      {showLevelUp && (
          <LevelUpWizard
              character={character}
              onComplete={(updatedChar) => {
                  onUpdate(updatedChar);
                  setShowLevelUp(false);
              }}
              onCancel={() => setShowLevelUp(false)}
          />
      )}

      {showJoinParty && (
        <JoinPartyModal 
          character={character} 
          onClose={() => setShowJoinParty(false)} 
          onJoined={(partyId, partyName) => onUpdate({ ...character, party_id: partyId, party_name: partyName })}
        />
      )}
    </div>
  );
};

const SheetTabsMemo = memo(SheetTabs);
SheetTabsMemo.displayName = 'SheetTabs';

export default SheetTabsMemo;
