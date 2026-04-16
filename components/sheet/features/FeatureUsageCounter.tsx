import React from 'react';
import { FeatureUsage } from '../../../types';

interface FeatureUsageCounterProps {
  usage: FeatureUsage;
  onUse?: () => void;
  onRestore?: () => void;
  disabled?: boolean;
}

const FeatureUsageCounter: React.FC<FeatureUsageCounterProps> = ({
  usage,
  disabled,
}) => {
  const getResetIcon = () => {
    switch (usage.resetType) {
      case 'long_rest': return 'bedtime';
      case 'short_rest': return 'hourglass_bottom';
      case 'always': return 'all_inclusive';
      case 'never': return 'block';
      default: return 'help';
    }
  };

  const getResetLabel = () => {
    switch (usage.resetType) {
      case 'long_rest': return 'LR';
      case 'short_rest': return 'SR';
      case 'always': return '∞';
      case 'never': return '—';
      default: return '';
    }
  };

  const isEmpty = usage.current === 0;
  const isLow = usage.current <= usage.max / 2 && usage.max > 1;

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border
      ${isEmpty 
        ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400' 
        : isLow 
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50 text-amber-600 dark:text-amber-400' 
          : 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 dark:border-amber-500/50 text-amber-600 dark:text-amber-400'
      }
      ${disabled ? 'opacity-50' : ''}
    `}>
      <span className="material-symbols-outlined text-sm opacity-60">{getResetIcon()}</span>
      <span>{usage.current}/{usage.max}</span>
      <span className="text-[10px] opacity-60 ml-0.5">{getResetLabel()}</span>
    </div>
  );
};

export default FeatureUsageCounter;
