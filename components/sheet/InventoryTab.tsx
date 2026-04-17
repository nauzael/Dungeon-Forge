
import React, { useState, memo } from 'react';
import { createPortal } from 'react-dom';
import { Character, InventoryItem, ItemData, WeaponData, ArmorData, Ability } from '../../types';
import { ALL_ITEMS, MASTERY_DESCRIPTIONS, MAGIC_ITEMS } from '../../Data/items';
import { getItemData, getFinalStats } from '../../utils/sheetUtils';

interface InventoryTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
    isReadOnly?: boolean;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ character, onUpdate, isReadOnly }) => {
    const [showAddItem, setShowAddItem] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [previewItemName, setPreviewItemName] = useState<string | null>(null);
    const [enchantmentLevel, setEnchantmentLevel] = useState<number>(0);
    const [selectedStat, setSelectedStat] = useState<Ability | 'Default'>('Default');

    const inventory = character.inventory || [];

    // Helper to check attunement
    const checkAttunement = (name: string) => {
        const data = getItemData(name);
        return data?.description?.toLowerCase().includes('requires attunement') || false;
    };

    const attunedCount = inventory.filter(i => i.equipped && checkAttunement(i.name)).length;

    const updateInventory = (newInventory: InventoryItem[]) => {
        onUpdate({ ...character, inventory: newInventory });
    };

    const addItem = (itemName: string) => {
        const finalName = enchantmentLevel > 0 ? `${itemName} +${enchantmentLevel}` : itemName;
        const newItem: InventoryItem = {
            id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: finalName,
            quantity: 1,
            equipped: false,
            customStat: selectedStat === 'Default' ? undefined : selectedStat
        };
        updateInventory([newItem, ...inventory]);
        setShowAddItem(false);
        setPreviewItemName(null);
        setSearchQuery('');
        setEnchantmentLevel(0);
        setSelectedStat('Default');
    };

    const consumeItem = (itemId: string) => {
        if (isReadOnly) return;
        const item = inventory.find(i => i.id === itemId);
        if (!item) return;
        
        if (item.quantity > 1) {
            updateInventory(inventory.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            updateInventory(inventory.filter(i => i.id !== itemId));
        }
    };

    const isPotion = (name: string) => {
        const n = name.toLowerCase();
        return n.includes('potion') || n.includes('poción') || n.includes('pocion') || n.includes('philter') || n.includes('antitoxin') || n.includes('vial') || n.includes('oil of');
    };

    const quickPotions = inventory.filter(i => isPotion(i.name));


    /**
     * Helper to adjust HP when Constitution modifier changes due to gear
     */
    const handleStatChangeUpdate = (updatedInventory: InventoryItem[]) => {
        // Calculate current modifier based on current state (before update)
        const oldStats = getFinalStats(character);
        const oldConScore = oldStats.CON || 10;
        const oldConMod = Math.floor((oldConScore - 10) / 2);

        // Calculate potential modifier based on the updated inventory
        const newStats = getFinalStats({ ...character, inventory: updatedInventory });
        const newConScore = newStats.CON || 10;
        const newConMod = Math.floor((newConScore - 10) / 2);

        const modDiff = newConMod - oldConMod;

        if (!isNaN(modDiff) && modDiff !== 0) {
            const hpAdjustment = modDiff * character.level;
            onUpdate({
                ...character,
                inventory: updatedInventory,
                hp: {
                    ...character.hp,
                    max: Math.max(1, character.hp.max + hpAdjustment),
                    current: Math.max(1, character.hp.current + hpAdjustment)
                }
            });
        } else {
            onUpdate({ ...character, inventory: updatedInventory });
        }
    };

    const toggleEquip = (itemId: string) => {
        if (isReadOnly) return;
        const itemToToggle = inventory.find(i => i.id === itemId);
        if (!itemToToggle) return;
        
        // Attunement Check Logic
        if (!itemToToggle.equipped && checkAttunement(itemToToggle.name)) {
            if (attunedCount >= 3) {
                alert("Attunement Limit Reached! You can only attune to 3 magic items at a time. Unequip one before using this.");
                return;
            }
        }

        const itemData = getItemData(itemToToggle.name);
        const isArmor = itemData?.type === 'Armor';
        const isShield = isArmor && (itemData as ArmorData).armorType === 'Shield';
        const isStandardArmor = isArmor && !isShield;
        
        const newInv = inventory.map(item => {
            if (item.id === itemId) return { ...item, equipped: !item.equipped };
            
            if (isShield && !itemToToggle.equipped && item.equipped) {
                 const idata = getItemData(item.name);
                 if (idata?.type === 'Armor' && (idata as ArmorData).armorType === 'Shield') {
                     return { ...item, equipped: false };
                 }
            }
            if (isStandardArmor && !itemToToggle.equipped && item.equipped) {
                 const idata = getItemData(item.name);
                 if (idata?.type === 'Armor' && (idata as ArmorData).armorType !== 'Shield') {
                     return { ...item, equipped: false };
                 }
            }
            return item;
        });
        
        handleStatChangeUpdate(newInv);
    };

    const removeItem = (itemId: string) => {
        if (isReadOnly) return;
        const newInv = inventory.filter(i => i.id !== itemId);
        handleStatChangeUpdate(newInv);
    };

    const finalStats = getFinalStats(character);
    const totalWeight = inventory.reduce((acc, item) => {
        const itemData = getItemData(item.name);
        return acc + (itemData ? itemData.weight * item.quantity : 0);
    }, 0);
    
    const carryCap = (finalStats.STR || 10) * 15;
    const equippedItems = inventory.filter(i => i.equipped);
    const backpackItems = inventory.filter(i => !i.equipped);

    const renderItemRow = (item: InventoryItem) => {
        const itemData = getItemData(item.name) || { name: item.name, type: 'Gear', weight: 0, cost: '-', description: '' };
        const isMagic = MAGIC_ITEMS[item.name] !== undefined || item.name.match(/\+(\d+)$/) !== null;
        const requiresAttunement = checkAttunement(item.name);
        const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor' || isMagic;
        
        return (
        <div key={item.id} onClick={() => setSelectedItem(item)} className="group relative flex items-center gap-4 p-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer">
            <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${item.equipped ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-black/40 text-slate-600 dark:text-white'}`}>
            <span className="material-symbols-outlined relative z-10">{itemData.type === 'Weapon' ? 'swords' : itemData.type === 'Armor' ? 'shield' : isMagic ? 'auto_awesome' : 'backpack'}</span>
            </div>
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <p className="text-slate-900 dark:text-white font-semibold truncate">{item.name}</p>
                {item.quantity > 1 && <span className="text-xs text-slate-500">x{item.quantity}</span>}
                {item.customStat && <span className="text-[10px] font-black text-primary bg-primary/10 px-1 rounded uppercase tracking-tighter">{item.customStat}</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-body truncate">{itemData.weight} lb • {itemData.cost}</p>
                {requiresAttunement && (
                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 rounded-sm border ${item.equipped ? 'text-purple-300 border-purple-500/30 bg-purple-500/20' : 'text-slate-400 border-slate-500/20 bg-slate-500/10'}`}>
                        Attunement
                    </span>
                )}
            </div>
            </div>
            <div className="flex items-center gap-2">
            {!isReadOnly && isEquippable && (<button onClick={(e) => { e.stopPropagation(); toggleEquip(item.id); }} className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${item.equipped ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-transparent'}`}>{item.equipped ? 'Equipped' : 'Equip'}</button>)}
            {!isReadOnly && <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>}
            </div>
        </div>
        );
    };

    const renderItemDetail = (data: ItemData, onAction?: () => void, actionLabel?: string, isPreview: boolean = false) => {
        const asWeapon = data as WeaponData;
        const asArmor = data as ArmorData;
        const isEquippableType = data.type === 'Weapon' || data.type === 'Armor';
        const requiresAttunement = data.description?.toLowerCase().includes('requires attunement');

        return (
            <>
               <div className="flex items-start justify-between mb-4">
                   <div className="min-w-0 pr-4">
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                           {isPreview && enchantmentLevel > 0 ? `${data.name} +${enchantmentLevel}` : data.name}
                       </h3>
                       <div className="flex flex-wrap gap-2 mt-1">
                           <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">{data.type}</span>
                           {requiresAttunement && <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded flex items-center gap-1"><span className="material-symbols-outlined text-[10px]">auto_awesome</span> Attunement</span>}
                       </div>
                   </div>
                   <button onClick={() => isPreview ? setPreviewItemName(null) : setSelectedItem(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-600">
                       <span className="material-symbols-outlined">close</span>
                   </button>
               </div>
               <div className="flex-1 overflow-y-auto space-y-3 mb-6 no-scrollbar pr-1 border-t border-slate-100 dark:border-white/5 pt-4">
                   <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Weight</span><span className="font-bold text-slate-900 dark:text-white">{data.weight} lb</span></div>
                   <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500">Cost</span><span className="font-bold text-slate-900 dark:text-white">{data.cost}</span></div>
                   {data.type === 'Weapon' && (
                       <>
                           <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                               <span className="text-sm text-slate-500">Damage</span>
                               <span className="font-bold text-slate-900 dark:text-white">
                                   {asWeapon.damage} {enchantmentLevel > 0 && isPreview ? `+${enchantmentLevel}` : ''} {asWeapon.damageType}
                               </span>
                           </div>
                           {asWeapon.properties && asWeapon.properties.length > 0 && (<div className="py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500 block mb-1">Properties</span><div className="flex flex-wrap gap-1">{asWeapon.properties.map(p => (<span key={p} className="px-2 py-0.5 bg-slate-100 dark:bg-white/10 rounded text-xs font-medium text-slate-600 dark:text-slate-300">{p}</span>))}</div></div>)}
                           {asWeapon.mastery && (<div className="py-2 border-b border-slate-100 dark:border-white/5"><span className="text-sm text-slate-500 block mb-1">Mastery: <span className="font-bold text-primary">{asWeapon.mastery}</span></span><p className="text-xs text-slate-400 italic leading-snug">{MASTERY_DESCRIPTIONS[asWeapon.mastery]}</p></div>)}
                       </>
                   )}
                   {data.type === 'Armor' && (
                        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                            <span className="text-sm text-slate-500">CA</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                                {asArmor.baseAC} {enchantmentLevel > 0 && isPreview ? `+${enchantmentLevel}` : ''} {asArmor.armorType === 'Shield' ? '(Shield)' : asArmor.armorType === 'Light' ? '+ Dex' : asArmor.armorType === 'Medium' ? '+ Dex (max 2)' : ''}
                            </span>
                        </div>
                   )}
                   
                   {isPreview && isEquippableType && (
                       <div className="py-2 border-b border-slate-100 dark:border-white/5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Enchantment Level</span>
                           <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                               {[0, 1, 2, 3].map(lvl => (
                                   <button 
                                       key={lvl}
                                       onClick={() => setEnchantmentLevel(lvl)}
                                       className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${enchantmentLevel === lvl ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                   >
                                       {lvl === 0 ? 'Normal' : `+${lvl}`}
                                   </button>
                               ))}
                           </div>
                       </div>
                   )}

                   {isPreview && data.type === 'Weapon' && (
                       <div className="py-2 border-b border-slate-100 dark:border-white/5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Scaling Attribute</span>
                            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                               {(['Default', 'STR', 'DEX', 'INT', 'WIS', 'CHA'] as const).map(stat => (
                                    <button 
                                        key={stat}
                                        onClick={() => setSelectedStat(stat as Ability | 'Default')}
                                       className={`py-1.5 rounded-lg text-[10px] font-black transition-all ${selectedStat === stat ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                   >
                                       {stat}
                                   </button>
                               ))}
                           </div>
                            <p className="text-[9px] text-slate-400 mt-2 italic px-1">Useful for effects like Pact of the Blade or Artificer.</p>
                       </div>
                   )}

                   {data.description && (<div className="py-2"><p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed font-body">{data.description}</p></div>)}
               </div>
               <div className={`grid ${isPreview ? 'grid-cols-1' : 'grid-cols-2'} gap-3 shrink-0 pt-2`}>
                   {onAction && (
                       <button 
                           onClick={onAction} 
                           className="py-3.5 rounded-2xl font-bold text-sm bg-primary text-background-dark shadow-lg shadow-primary/20 active:scale-[0.97] transition-all"
                       >
                           {actionLabel}
                       </button>
                   )}
                   {!isPreview && (
                       <button 
                           onClick={() => { if(selectedItem) removeItem(selectedItem.id); setSelectedItem(null); }} 
                           className="py-3.5 rounded-2xl font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                        >
                            Delete
                        </button>
                   )}
               </div>
            </>
        );
    };

    return (
    <div className="flex flex-col gap-5 px-4 pb-20">
       <div className="pt-4 shrink-0 flex flex-col gap-4">
           {/* Info Bar: Weight & Attunement */}
           <div className="grid grid-cols-2 gap-3">
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                      <label className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Load</label>
                     <span className="text-slate-800 dark:text-white text-sm font-medium"><span className={`${totalWeight > carryCap ? 'text-red-500' : 'text-primary'}`}>{totalWeight}</span> / {carryCap}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${totalWeight > carryCap ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, (totalWeight / carryCap) * 100)}%` }}></div>
                  </div>
               </div>
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                     <label className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Attunement</label>
                     <span className="text-slate-800 dark:text-white text-sm font-medium"><span className={`${attunedCount >= 3 ? 'text-amber-500' : 'text-purple-500'}`}>{attunedCount}</span> / 3</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-surface-dark rounded-full overflow-hidden">
                     <div className={`h-full rounded-full ${attunedCount >= 3 ? 'bg-amber-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(100, (attunedCount / 3) * 100)}%` }}></div>
                  </div>
               </div>
           </div>

           {!isReadOnly && (
               <button 
                    onClick={() => setShowAddItem(true)} 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-surface-light dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-xl text-primary font-bold hover:bg-primary/5 dark:hover:bg-white/10 transition-colors mb-2"
               >
                   <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>Add Item</span>
               </button>
           )}

           <div className="p-4 rounded-3xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Money & Coins</span>
                    <span className="material-symbols-outlined text-amber-500 text-lg">payments</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { key: 'gp', label: 'Gold', color: 'text-amber-500' },
                        { key: 'sp', label: 'Silver', color: 'text-slate-400' },
                        { key: 'cp', label: 'Copper', color: 'text-orange-600' }
                    ].map(({ key, label, color }) => (
                        <div key={key} className="flex flex-col items-center gap-2 group">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>
                                {label}
                            </span>
                            <input 
                                type="number" 
                                readOnly={isReadOnly}
                                value={character.money?.[key as keyof typeof character.money] || 0}
                                onChange={(e) => {
                                    if (isReadOnly) return;
                                    const val = parseInt(e.target.value) || 0;
                                    onUpdate({
                                        ...character,
                                        money: {
                                            ...(character.money || { cp: 0, sp: 0, gp: 0, ep: 0, pp: 0 }),
                                            [key]: val
                                        }
                                    });
                                }}
                                className={`w-full bg-transparent text-center font-black text-lg text-slate-900 dark:text-white outline-none focus:scale-110 transition-transform no-scrollbar ${isReadOnly ? 'cursor-default' : ''}`}
                            />
                        </div>
                    ))}
                </div>
           </div>
       </div>

       {/* Potions Quick Belt */}
       <div className="flex flex-col gap-3">
           <div className="flex justify-between items-center px-1">
               <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Potion Belt</h3>
               <span className="material-symbols-outlined text-sm text-primary animate-pulse">healing</span>
           </div>
           
           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
               {quickPotions.map(potion => (
                   <div 
                       key={potion.id}
                       className="flex flex-col gap-2 min-w-[140px] p-3 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 shadow-sm active:scale-95 transition-transform"
                   >
                       <div className="flex items-start gap-2">
                           <div className="size-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
                               <span className="material-symbols-outlined text-lg">ecg_heart</span>
                           </div>
                           <div className="min-w-0 flex-1">
                               <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                                   {potion.name.replace('Potion of ', '')}
                               </p>
                                                               <div className="flex justify-between items-end mt-0.5">
                                    <p className="text-[10px] text-slate-400 font-bold">Qty: {potion.quantity}</p>
                                    {potion.description?.includes('Regains') && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-pink-500/10 text-pink-500 font-black">
                                            {potion.description.match(/(\d+d\d+\s*\+\s*\d+)/)?.[0] || 'HP'}
                                        </span>
                                    )}
                                </div>

                           </div>
                       </div>
                       
                       {!isReadOnly && (
                           <button
                               onClick={() => consumeItem(potion.id)}
                               className="w-full py-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                           >
                               Drink
                           </button>
                       )}
                   </div>
               ))}
               
               {!isReadOnly && (
                   <button 
                       onClick={() => {
                           setSearchQuery('Potion');
                           setShowAddItem(true);
                       }}
                       className="flex flex-col items-center justify-center gap-2 min-w-[100px] p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-600 hover:text-primary hover:border-primary transition-all"
                   >
                       <span className="material-symbols-outlined">add_circle</span>
                       <span className="text-[10px] font-bold uppercase">Add</span>
                   </button>
               )}
           </div>
           {quickPotions.length === 0 && !isReadOnly && (
               <p className="text-[10px] italic text-slate-400 px-1">Tu cinturón está vacío. Agrega pociones para verlas aquí.</p>
           )}
       </div>


       {equippedItems.length > 0 && (<div className="flex flex-col gap-3">            <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Equipment ({equippedItems.length})</h3>{equippedItems.map(renderItemRow)}</div>)}
       
       <div className="flex flex-col gap-3">
            <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">Backpack ({backpackItems.length})</h3>
            {backpackItems.length === 0 && (<div className="p-4 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl"><p className="text-sm text-slate-400 italic">Your backpack is empty.</p></div>)}
           {backpackItems.map(renderItemRow)}
       </div>

       {showAddItem && createPortal(
           <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col p-4 animate-fadeIn pt-[env(safe-area-inset-top)]">
               <div className="flex items-center gap-3 mb-4">
                   <button onClick={() => setShowAddItem(false)} className="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                    <div className="flex-1 relative"><input autoFocus type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-100 dark:bg-black/20 border-none rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50 dark:text-white"/><span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span></div>
               </div>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                   {Object.keys(ALL_ITEMS).filter(name => name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 50).map(name => {
                           const item = ALL_ITEMS[name];
                           return (
                               <button 
                                    key={name} 
                                    onClick={() => { setPreviewItemName(name); setEnchantmentLevel(0); setSelectedStat('Default'); }} 
                                    className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 flex justify-between items-center border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all"
                                >
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                                        <p className="text-xs text-slate-500">{item.type} • {item.cost}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300">visibility</span>
                                </button>
                           );
                       })}
               </div>
           </div>,
           document.body
       )}

       {/* Item Detail Modal (Inventory) */}
       {selectedItem && createPortal(
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedItem(null)}>
            <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-scaleUp flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                {(() => {
                    const itemData = (getItemData(selectedItem.name) || { name: selectedItem.name, type: 'Gear', weight: 0, cost: '-', description: '' }) as ItemData;
                    const isMagic = MAGIC_ITEMS[selectedItem.name] !== undefined || selectedItem.name.match(/\+(\d+)$/) !== null;
                    const isEquippable = itemData.type === 'Weapon' || itemData.type === 'Armor' || isMagic;
                    
                    return renderItemDetail(
                        itemData, 
                        isEquippable ? () => { toggleEquip(selectedItem.id); setSelectedItem(null); } : undefined,
                        selectedItem.equipped ? 'Unequip' : 'Equip'
                    );
                })()}
            </div>
         </div>,
         document.body
       )}

       {/* Item Preview Modal (Before adding) */}
       {previewItemName && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setPreviewItemName(null)}>
                <div className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-2xl animate-scaleUp flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                    {renderItemDetail(
                        ALL_ITEMS[previewItemName],
                        () => addItem(previewItemName),
                        'Add to Backpack',
                        true
                    )}
                </div>
            </div>,
            document.body
       )}
    </div>
  );
};

const InventoryTabMemo = memo(InventoryTab);
InventoryTabMemo.displayName = 'InventoryTab';
export default InventoryTabMemo;
