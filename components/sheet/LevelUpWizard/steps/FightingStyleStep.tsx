import React, { useState } from 'react';
import { Character } from '../../../../types';
import { FEAT_OPTIONS } from '../../../../Data/feats/index';
import { CANTRIPS } from '../../../../Data/spells/cantrips';

const DRUID_CANTRIP_NAMES = ['Druidcraft', 'Guidance', 'Produce Flame', 'Resistance', 'Shillelagh', 'Thorn Whip', 'Starry Wisp'];

const DRUID_CANTRIPS = DRUID_CANTRIP_NAMES.map(name => ({
  ...CANTRIPS[name]
})).filter(c => c && c.name);

interface FightingStyleStepProps {
  character: Character;
  fightingStyle: string;
  druidicWarriorCantrips: string[];
  onFightingStyleChange: (value: string) => void;
  onDruidicWarriorCantripsChange: (cantrips: string[]) => void;
  isAdditionalStyle?: boolean;
}

const FightingStyleStep: React.FC<FightingStyleStepProps> = ({
  character,
  fightingStyle,
  druidicWarriorCantrips,
  onFightingStyleChange,
  onDruidicWarriorCantripsChange,
  isAdditionalStyle = false
}) => {
  const isRanger = character.class === 'Ranger';
  const [showCantripPicker, setShowCantripPicker] = useState(false);
  const title = isAdditionalStyle ? 'Additional Fighting Style' : 'Fighting Style';

  const fightingStyleFeats = FEAT_OPTIONS.filter(f => f.category === 'Fighting Style');
  const druidicWarriorOption = {
    name: 'Druidic Warrior',
    description: 'You learn two Druid cantrips of your choice. Wisdom is your spellcasting ability for them. You can replace one cantrip when you gain a Ranger level.',
    isOption: true
  };

  const handleStyleSelect = (styleName: string) => {
    onFightingStyleChange(styleName);
    if (styleName === 'Druidic Warrior') {
      setShowCantripPicker(true);
      if (druidicWarriorCantrips.length === 0) {
        onDruidicWarriorCantripsChange(['Guidance', 'Starry Wisp']);
      }
    } else {
      setShowCantripPicker(false);
      onDruidicWarriorCantripsChange([]);
    }
  };

  const toggleCantrip = (cantripName: string) => {
    if (druidicWarriorCantrips.includes(cantripName)) {
      onDruidicWarriorCantripsChange(druidicWarriorCantrips.filter(c => c !== cantripName));
    } else if (druidicWarriorCantrips.length < 2) {
      onDruidicWarriorCantripsChange([...druidicWarriorCantrips, cantripName]);
    }
  };

  const canProceed = () => {
    if (fightingStyle === 'Druidic Warrior') {
      return druidicWarriorCantrips.length === 2;
    }
    return fightingStyle !== '';
  };

  return (
    <div className="flex flex-col h-full p-5">
      <div className="text-center mb-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg" style={{backgroundColor: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)', borderWidth: '2px', borderColor: 'var(--color-border)'}}>
          <span className="material-symbols-outlined text-3xl">shield</span>
        </div>
        <h2 className="text-xl font-black tracking-tight" style={{color: 'var(--color-text-primary)'}}>
          {title}
        </h2>
        <p className="text-sm mt-1 font-medium" style={{color: 'var(--color-text-muted)'}}>
          Choose your combat style
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
        {isRanger && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-700 dark:text-green-400">
              <strong>Note:</strong> As a Ranger, you can also choose Druidic Warrior instead of a Fighting Style feat.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {fightingStyleFeats.map((feat) => (
            <button
              key={feat.name}
              onClick={() => handleStyleSelect(feat.name)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all`}
              style={fightingStyle === feat.name && fightingStyle !== 'Druidic Warrior' ? {backgroundColor: 'var(--color-primary)', opacity: '0.1', borderColor: 'var(--color-primary)'} : {backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)'}}
            >
              <p className="font-bold text-base text-slate-900 dark:text-white mb-0.5">
                {feat.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {feat.description.split('\n')[0]}
              </p>
            </button>
          ))}

          {isRanger && (
            <button
              onClick={() => handleStyleSelect('Druidic Warrior')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all`}
              style={fightingStyle === 'Druidic Warrior' ? {backgroundColor: 'var(--color-primary)', opacity: '0.1', borderColor: 'var(--color-primary)'} : {backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)'}}
            >
              <p className="font-bold text-base mb-0.5" style={{color: 'var(--color-text-primary)'}}>
                Druidic Warrior
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Learn two Druid cantrips. Wisdom is your spellcasting ability for them.
              </p>
            </button>
          )}
        </div>

        {showCantripPicker && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-3">
              Choose 2 Druid Cantrips
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {DRUID_CANTRIPS.map((cantrip) => {
                const isSelected = druidicWarriorCantrips.includes(cantrip.name);
                const isDisabled = !isSelected && druidicWarriorCantrips.length >= 2;
                return (
                  <button
                    key={cantrip.name}
                    onClick={() => toggleCantrip(cantrip.name)}
                    disabled={isDisabled}
                    className={`p-3 rounded-xl border-2 text-left transition-all`}
                    style={isSelected ? {backgroundColor: 'var(--color-primary)', opacity: '0.1', borderColor: 'var(--color-primary)'} : isDisabled ? {backgroundColor: 'var(--color-background-secondary)', borderColor: 'var(--color-border)', opacity: '0.5'} : {backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)'}}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm" style={{color: 'var(--color-text-primary)'}}>
                        {cantrip.name}
                      </p>
                      {isSelected && (
                        <span className="text-green-600 dark:text-green-400">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
              {druidicWarriorCantrips.length}/2 selected
            </p>
          </div>
        )}
      </div>

      {!canProceed() && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
            {fightingStyle === 'Druidic Warrior'
              ? 'Select 2 Druid cantrips to continue'
              : 'Select a fighting style to continue'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FightingStyleStep;
