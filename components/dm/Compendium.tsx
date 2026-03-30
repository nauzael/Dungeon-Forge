import React, { useState, useCallback } from 'react';
import { COMPENDIUM_DATA, CompendiumItem } from '../../Data/compendiumData';

const CATEGORIES = ['All', 'Class', 'Subclass', 'Species', 'Condition', 'Feat', 'Rule'] as const;

const Compendium: React.FC = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('All');
    const [selectedItem, setSelectedItem] = useState<CompendiumItem | null>(null);

    const handleOpenModal = useCallback((item: CompendiumItem) => {
        setSelectedItem(item);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedItem(null);
    }, []);

    const filtered = COMPENDIUM_DATA.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                             item.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || item.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 lg:max-w-4xl lg:mx-auto">
            {/* Search and Filter */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 border border-white/5 space-y-4 shadow-xl sticky top-2 z-30">
                <div className="flex items-center gap-3 bg-black/20 rounded-xl px-4 py-3 border border-white/5 focus-within:border-blue-500/50 transition-all">
                    <span className="material-symbols-outlined text-blue-400 text-xl">search</span>
                    <input 
                        type="text" 
                        placeholder="Buscar en la biblioteca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600 font-normal tracking-wide"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border snap-start shrink-0 ${filter === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' : 'bg-white/5 border-white/10 text-slate-400'}`}
                        >
                            {cat === 'All' ? 'Todo' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                {filtered.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-700">search_off</span>
                        <p className="text-slate-500 text-sm mt-2">No se encontraron resultados</p>
                    </div>
                ) : (
                    filtered.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleOpenModal(item)}
                            className="group bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg hover:border-blue-500/30 transition-all cursor-pointer active:scale-[0.98]"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight leading-tight">{item.title}</h3>
                                <span className="text-[8px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">{item.category}</span>
                            </div>
                            <p className="text-slate-400 text-xs leading-snug whitespace-pre-line font-normal opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn" 
                    onClick={handleCloseModal}
                >
                    <div 
                        className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl animate-slideUp relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6 sticky top-0 bg-slate-900/95 backdrop-blur-md py-2 z-10 border-b border-white/5">
                            <div>
                                <span className="text-[9px] font-bold bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-400/20 uppercase tracking-widest mb-2 inline-block">
                                    {selectedItem.category}
                                </span>
                                <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{selectedItem.title}</h2>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all text-slate-400"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {selectedItem.fullInfo ? (
                                <div className="text-slate-300">
                                    {selectedItem.fullInfo.split('\n\n').map((block, idx) => {
                                        const trimmedBlock = block.trim();
                                        if (!trimmedBlock) return null;

                                        // Headers
                                        if (trimmedBlock.startsWith('#')) {
                                            const hashCount = (trimmedBlock.match(/^#+/) || [''])[0].length;
                                            const content = trimmedBlock.replace(/^#+\s*/, '');
                                            
                                            if (hashCount <= 3) {
                                                return <h3 key={idx} className="text-lg font-bold text-white border-l-2 border-blue-500 pl-3 my-4">{content}</h3>;
                                            } else {
                                                return <h4 key={idx} className="text-xs font-bold text-blue-400 uppercase tracking-wider mt-6 mb-2">{content}</h4>;
                                            }
                                        }

                                        // Lists
                                        if (trimmedBlock.startsWith('*')) {
                                            return (
                                                <ul key={idx} className="space-y-2 my-4">
                                                    {trimmedBlock.split('\n').map((li, i) => {
                                                        const liContent = li.trim().replace(/^\*\s*/, '');
                                                        if (!liContent) return null;
                                                        return (
                                                            <li key={i} className="flex gap-3 text-sm leading-relaxed bg-white/3 p-3 rounded-xl border border-white/5 font-normal">
                                                                <span className="text-blue-500 font-bold">•</span>
                                                                <span dangerouslySetInnerHTML={{ __html: liContent.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-bold">$1</b>') }}></span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            );
                                        }

                                        // Tables
                                        if (trimmedBlock.includes('|') && trimmedBlock.includes('---')) {
                                            const lines = trimmedBlock.split('\n').filter(l => l.trim() && !l.match(/^\|[\s-|]+\|$/));
                                            if (lines.length > 1) {
                                                return (
                                                    <div key={idx} className="overflow-x-auto my-4">
                                                        <table className="w-full text-xs">
                                                            <tbody>
                                                                {lines.map((line, i) => {
                                                                    const cells = line.split('|').filter((_, idx) => idx > 0 && idx < line.split('|').length - 1);
                                                                    return (
                                                                        <tr key={i} className={i === 0 ? 'text-blue-400 font-bold' : 'text-slate-300'}>
                                                                            {cells.map((cell, j) => (
                                                                                <td key={j} className="px-3 py-2 border border-white/10">{cell.trim()}</td>
                                                                            ))}
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                );
                                            }
                                        }

                                        // Paragraphs
                                        return (
                                            <p key={idx} className="text-sm leading-relaxed font-normal opacity-90 my-3" dangerouslySetInnerHTML={{ __html: trimmedBlock.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-bold">$1</b>') }}></p>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-12 text-center space-y-3">
                                    <span className="material-symbols-outlined text-4xl text-slate-700">inventory_2</span>
                                    <p className="text-slate-500 text-sm italic">Información detallada en proceso de carga...</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                            <p className="text-[9px] font-normal text-slate-500 uppercase tracking-widest text-center">D&D 2024 System Reference</p>
                            <button 
                                onClick={handleCloseModal}
                                className="w-full sm:w-auto px-10 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all border border-white/5"
                            >
                                Cerrar Ventana
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compendium;
