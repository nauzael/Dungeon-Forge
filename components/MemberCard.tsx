import React, { useMemo } from 'react';
import { Character } from '../types';
import {
  getSpellSlotSummary,
  getArmorClass,
  getFinalStats,
} from '../utils/sheetUtils';

interface MemberCardProps {
  member: Character;
  onViewCharacter: (char: Character) => void;
  onKickCharacter: (id: string, name: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onViewCharacter,
  onKickCharacter,
}) => {
  // MEMOIZED: Calculate final stats (only recalculate if member changes)
  const finalStats = useMemo(() => getFinalStats(member), [member]);

  // MEMOIZED: Calculate armor class (only recalculate if member changes)
  const armorClass = useMemo(() => getArmorClass(member, finalStats), [
    member,
    finalStats,
  ]);

  // MEMOIZED: Calculate spell slot summary (only recalculate if member changes)
  const spellSlots = useMemo(() => getSpellSlotSummary(member), [member]);

  return (
    <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/5 shadow-xl transition-all">
      {/* Member Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="size-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
            {(member as any).imageUrl && (member as any).imageUrl !== 'DEFAULT' ? (
              <img
                src={(member as any).imageUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <span className="material-symbols-outlined">shield_person</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white leading-none mb-1">
              {member.name}
            </h3>
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">
              LV {member.level} {member.class}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onKickCharacter(member.id, member.name)}
            className="size-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md shadow-red-900/10"
            title="Expulsar"
          >
            <span className="material-symbols-outlined text-[16px] font-black">
              logout
            </span>
          </button>
          <div
            className="flex flex-col items-end cursor-pointer"
            onClick={() => onViewCharacter(member)}
          >
            <span className="text-[8px] text-slate-500 uppercase font-black">
              Escudo AC
            </span>
            <span className="text-xl font-black text-white">{armorClass}</span>
          </div>
        </div>
      </div>

      {/* HP Bar */}
      <div
        className="space-y-1.5 mb-6 cursor-pointer"
        onClick={() => onViewCharacter(member)}
      >
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            HP
          </span>
          <span className="text-sm font-black">
            {member.hp.current} / {member.hp.max}
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-700"
            style={{
              width: `${
                (Math.min(member.hp.current, member.hp.max) /
                  member.hp.max) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Resource Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {Object.entries(spellSlots).map(([lvl, info]) => (
            <div
              key={lvl}
              className="bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10 flex items-center gap-1"
            >
              <span className="text-[7px] font-black text-blue-400">{lvl}</span>
              <div className="flex gap-[2px]">
                {Array.from({ length: info.max }).map((_, i) => (
                  <div
                    key={i}
                    className={`size-1 rounded-full ${
                      member.usedSlots?.[`${lvl}-${i}`]
                        ? 'bg-slate-700'
                        : 'bg-blue-400 shadow-[0_0_2px_rgba(96,165,250,0.5)]'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onViewCharacter(member)}
          className="text-[8px] font-black uppercase text-blue-400 hover:text-white transition-colors"
        >
          Abrir Hoja
        </button>
      </div>
    </div>
  );
};

export default React.memo(MemberCard);
