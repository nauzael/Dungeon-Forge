import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CustomItem } from '../../../types';

interface CustomItemModalProps {
  editItem?: CustomItem;
  onSave: (item: CustomItem) => void;
  onClose: () => void;
  onDelete?: (itemName: string) => void;
}

const ARMOR_TYPES = ['Light', 'Medium', 'Heavy', 'Shield'] as const;
const ITEM_TYPES = ['Gear', 'Weapon', 'Armor'] as const;
const WEAPON_CATEGORIES = ['Simple', 'Martial'] as const;
const RANGE_TYPES = ['Melee', 'Ranged'] as const;
const DAMAGE_TYPES = ['Slashing', 'Piercing', 'Bludgeoning', 'Fire', 'Cold', 'Lightning', 'Acid', 'Poison', 'Thunder', 'Psychic', 'Necrotic', 'Radiant', 'Force'];
const WEAPON_PROPERTIES = ['Finesse', 'Heavy', 'Light', 'Loading', 'Reach', 'Thrown (20/60)', 'Thrown (30/120)', 'Two-Handed', 'Versatile (1d8)', 'Versatile (1d10)', 'Ammunition', 'Silvered'];

const CustomItemModal: React.FC<CustomItemModalProps> = ({ editItem, onSave, onClose }) => {
  const [name, setName] = useState(editItem?.name || '');
  const [type, setType] = useState<'Gear' | 'Weapon' | 'Armor'>(editItem?.type || 'Gear');
  const [weight, setWeight] = useState(editItem?.weight ?? 0);
  const [cost, setCost] = useState(editItem?.cost || '');
  const [description, setDescription] = useState(editItem?.description || '');
  const [requiresAttunement, setRequiresAttunement] = useState(editItem?.requiresAttunement || false);
  
  // Weapon fields
  const [category, setCategory] = useState<'Simple' | 'Martial'>(editItem?.category || 'Simple');
  const [rangeType, setRangeType] = useState<'Melee' | 'Ranged'>(editItem?.rangeType || 'Melee');
  const [damage, setDamage] = useState(editItem?.damage || '1d6');
  const [damageType, setDamageType] = useState(editItem?.damageType || 'Slashing');
  const [properties, setProperties] = useState<string[]>(editItem?.properties || []);
  const [mastery, setMastery] = useState(editItem?.mastery || '-');
  
  // Armor fields
  const [armorType, setArmorType] = useState<'Light' | 'Medium' | 'Heavy' | 'Shield'>(editItem?.armorType || 'Light');
  const [baseAC, setBaseAC] = useState(editItem?.baseAC ?? 11);
  const [stealthDisadvantage, setStealthDisadvantage] = useState(editItem?.stealthDisadvantage || false);
  const [strengthReq, setStrengthReq] = useState(editItem?.strengthReq ?? 0);

  const toggleProperty = (prop: string) => {
    setProperties(prev =>
      prev.includes(prop) ? prev.filter(p => p !== prop) : [...prev, prop]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const base: CustomItem = {
      name: name.trim(),
      type,
      weight,
      cost: cost || '-',
      description,
      requiresAttunement,
    };

    if (type === 'Weapon') {
      onSave({
        ...base,
        category,
        rangeType,
        damage,
        damageType,
        properties,
        mastery: mastery || '-',
      });
    } else if (type === 'Armor') {
      onSave({
        ...base,
        armorType,
        baseAC,
        stealthDisadvantage,
        strengthReq,
        maxDex: armorType === 'Medium' ? 2 : armorType === 'Heavy' ? undefined : undefined,
      });
    } else {
      onSave(base);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="w-full max-w-md bg-white dark:bg-surface-dark rounded-radius-2xl p-6 shadow-2xl animate-scaleUp flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {editItem ? 'Edit Custom Item' : 'Create Custom Item'}
          </h3>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-radius-pill bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
          {/* Name */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Dragon Slayer"
              className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm font-bold"
              autoFocus
            />
          </div>

          {/* Type selector */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Type</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-radius-lg">
              {ITEM_TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`py-2 rounded-radius-md text-xs font-bold transition-all ${type === t ? 'bg-white dark:bg-surface-dark shadow-elev-raised text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Weight & Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Weight (lb)</label>
              <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm font-bold" min={0} step={0.5} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Cost</label>
              <input type="text" value={cost} onChange={e => setCost(e.target.value)}
                placeholder="e.g. 500 GP"
                className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm font-bold" />
            </div>
          </div>

          {/* Weapon fields */}
          {type === 'Weapon' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Category</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-radius-lg">
                    {WEAPON_CATEGORIES.map(c => (
                      <button key={c} onClick={() => setCategory(c)}
                        className={`py-2 rounded-radius-md text-xs font-bold transition-all ${category === c ? 'bg-white dark:bg-surface-dark shadow-elev-raised text-primary' : 'text-slate-500'}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Range</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-radius-lg">
                    {RANGE_TYPES.map(r => (
                      <button key={r} onClick={() => setRangeType(r)}
                        className={`py-2 rounded-radius-md text-xs font-bold transition-all ${rangeType === r ? 'bg-white dark:bg-surface-dark shadow-elev-raised text-primary' : 'text-slate-500'}`}
                      >{r}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Damage Dice</label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-radius-lg">
                    {['1d4','1d6','1d8','1d10','1d12','2d4','2d6','2d8'].map(d => (
                      <button key={d} onClick={() => setDamage(d)}
                        className={`py-1.5 rounded-radius-md text-[10px] font-bold transition-all ${damage === d ? 'bg-white dark:bg-surface-dark shadow-elev-raised text-primary' : 'text-slate-500'}`}
                      >{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Damage Type</label>
                  <select value={damageType} onChange={e => setDamageType(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-xs font-bold appearance-none">
                    {DAMAGE_TYPES.map(dt => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Properties */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Properties</label>
                <div className="flex flex-wrap gap-1.5">
                  {WEAPON_PROPERTIES.map(prop => (
                    <button key={prop} onClick={() => toggleProperty(prop)}
                      className={`px-2.5 py-1 rounded-radius-md text-[10px] font-bold transition-all border ${properties.includes(prop) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent hover:border-slate-300'}`}
                    >{prop}</button>
                  ))}
                </div>
              </div>

              {/* Mastery */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Mastery (or - for none)</label>
                <input type="text" value={mastery} onChange={e => setMastery(e.target.value)}
                  placeholder="e.g. Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex"
                  className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-xs font-bold" />
              </div>
            </>
          )}

          {/* Armor fields */}
          {type === 'Armor' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Armor Type</label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-radius-lg col-span-2">
                    {ARMOR_TYPES.map(at => (
                      <button key={at} onClick={() => setArmorType(at)}
                        className={`py-1.5 rounded-radius-md text-[10px] font-bold transition-all ${armorType === at ? 'bg-white dark:bg-surface-dark shadow-elev-raised text-primary' : 'text-slate-500'}`}
                      >{at}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Base AC</label>
                  <input type="number" value={baseAC} onChange={e => setBaseAC(parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-sm font-bold" min={10} max={22} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={stealthDisadvantage} onChange={e => setStealthDisadvantage(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Stealth Disadvantage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">STR Req:</span>
                  <input type="number" value={strengthReq} onChange={e => setStrengthReq(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-100 dark:bg-black/20 rounded-radius-lg p-2 outline-none focus:ring-2 ring-primary/50 dark:text-white text-xs font-bold text-center" min={0} max={20} />
                </label>
              </div>
            </>
          )}

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Item description, effects, etc."
              className="w-full bg-slate-100 dark:bg-black/20 rounded-radius-lg p-3 outline-none focus:ring-2 ring-primary/50 dark:text-white text-xs font-body resize-none min-h-[80px]" rows={3} />
          </div>

          {/* Attunement toggle */}
          <label className="flex items-center gap-3 cursor-pointer py-2">
            <div className={`relative w-11 h-6 rounded-radius-pill transition-colors ${requiresAttunement ? 'bg-purple-500' : 'bg-slate-300 dark:bg-white/10'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-radius-pill shadow-sm transition-transform ${requiresAttunement ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              <input type="checkbox" checked={requiresAttunement} onChange={e => setRequiresAttunement(e.target.checked)} className="sr-only" />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Requires Attunement</span>
          </label>
        </div>

        {/* Actions */}
        <div className={`grid ${editItem && onDelete ? 'grid-cols-3' : 'grid-cols-2'} gap-3 mt-4 shrink-0 pt-2 border-t border-slate-100 dark:border-white/5`}>
          {editItem && onDelete && (
            <button onClick={() => onDelete(editItem.name)}
              className="py-3 rounded-radius-xl font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
              Delete
            </button>
          )}
          <button onClick={onClose}
            className="py-3 rounded-radius-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 active:scale-[0.97] transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            className="py-3 rounded-radius-xl font-bold text-sm bg-primary text-background-dark shadow-elev-modal shadow-primary/20 active:scale-[0.97] transition-all disabled:opacity-50"
            disabled={!name.trim()}>
            {editItem ? 'Save Changes' : 'Create Item'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomItemModal;
