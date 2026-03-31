
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Character, NoteItem, CampaignResource } from '../../types';
import { getPartyResources } from '../../utils/supabase';

interface NotesTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
    isReadOnly?: boolean;
}

// Sub-component for individual note interaction and auto-sizing
const NoteCard: React.FC<{
    note: NoteItem;
    onUpdate: (id: string, field: keyof NoteItem, value: string) => void;
    onDelete: (id: string) => void;
    isReadOnly?: boolean;
}> = ({ note, onUpdate, onDelete, isReadOnly }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic
    const adjustHeight = () => {
        const element = textareaRef.current;
        if (element) {
            element.style.height = 'auto'; // Reset to calculate shrink
            element.style.height = `${element.scrollHeight}px`; // Set to content height
        }
    };

    // Adjust height on mount and whenever content changes
    useLayoutEffect(() => {
        adjustHeight();
    }, [note.content]);

    return (
        <div className="relative group bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300 hover:shadow-md overflow-hidden">
            {/* Decorative Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-primary/40"></div>
            
            <div className="flex justify-between items-start mb-3 pl-3">
                <input 
                    type="text" 
                    placeholder="No title"
                    value={note.title}
                    onChange={(e) => onUpdate(note.id, 'title', e.target.value)}
                    readOnly={isReadOnly}
                    className="bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 w-full mr-2"
                />
                {!isReadOnly && (
                    <button 
                        onClick={() => onDelete(note.id)}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-300 hover:text-red-500 -mt-1 -mr-1 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        title="Delete note"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                )}
            </div>
            
            <textarea
                ref={textareaRef}
                value={note.content}
                onChange={(e) => onUpdate(note.id, 'content', e.target.value)}
                readOnly={isReadOnly}
                className="w-full bg-transparent border-none p-0 pl-3 text-sm leading-7 text-slate-600 dark:text-slate-300 placeholder:text-slate-400/50 dark:placeholder:text-slate-600/50 focus:ring-0 resize-none overflow-hidden font-body"
                placeholder="Write your adventures here..."
                spellCheck={false}
                rows={1}
            />
            
            <div className="flex justify-end mt-2 pt-3 border-t border-slate-50 dark:border-white/5 pl-3">
                <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-[10px]">calendar_today</span>
                    {note.date}
                </span>
            </div>
        </div>
    );
};

const NotesTab: React.FC<NotesTabProps> = ({ character, onUpdate, isReadOnly }) => {
    // State to hold the array of notes.
    const [notesList, setNotesList] = useState<NoteItem[]>(() => {
        const raw = character.notes as unknown;
        if (Array.isArray(raw)) return raw as NoteItem[];
        if (typeof raw === 'string' && (raw as string).trim().length > 0) {
            return [{
                id: 'legacy-note',
                title: 'Notas Generales',
                content: raw as string,
                date: new Date().toLocaleDateString()
            }];
        }
        return [];
    });

    const [campaignAtlas, setCampaignAtlas] = useState<CampaignResource[]>([]);
    const [isLoadingAtlas, setIsLoadingAtlas] = useState(false);

    // Fetch Campaign Resources (Atlas)
    useEffect(() => {
        if (!character.party_id) return;
        
        const fetchAtlas = async () => {
            setIsLoadingAtlas(true);
            const resources = await getPartyResources(character.party_id!);
            setCampaignAtlas(resources);
            setIsLoadingAtlas(false);
        };
        
        fetchAtlas();
    }, [character.party_id]);

    // Debounce save logic
    useEffect(() => {
        if (isReadOnly) return;
        const handler = setTimeout(() => {
            onUpdate({ ...character, notes: notesList });
        }, 800);

        return () => clearTimeout(handler);
    }, [notesList]); 

    const addNote = () => {
        if (isReadOnly) return;
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            title: '',
            content: '',
            date: new Date().toLocaleDateString()
        };
        setNotesList([newNote, ...notesList]);
    };

    const deleteNote = (id: string) => {
        if (window.confirm("¿Borrar esta nota?")) {
            setNotesList(prev => prev.filter(n => n.id !== id));
        }
    };

    const updateNote = (id: string, field: keyof NoteItem, value: string) => {
        setNotesList(prev => prev.map(n => 
            n.id === id ? { ...n, [field]: value } : n
        ));
    };

    return (
        <div className="flex flex-col h-full px-4 pb-24 pt-4 min-h-[80vh] bg-slate-50/30 dark:bg-transparent">
            
            {/* Campaign Atlas Section - DM Shared Resources */}
            {character.party_id && (
                <div className="mb-8 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-blue-500">map</span>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Campaign Atlas</h3>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/5 ml-2"></div>
                    </div>

                    {isLoadingAtlas ? (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {[1, 2].map(i => (
                                <div key={i} className="min-w-[200px] h-32 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {campaignAtlas.length === 0 ? (
                                <div className="w-full py-6 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">The Master has not shared persistent resources yet.</p>
                                </div>
                            ) : (
                                campaignAtlas.map(res => (
                                    <div 
                                        key={res.id} 
                                        className="snap-center min-w-[240px] group relative bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm active:scale-95 transition-transform"
                                        onClick={() => window.open(res.url, '_blank')}
                                    >
                                        <div className="h-32 relative">
                                            <img src={res.url} alt={res.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-0.5 rounded-full bg-blue-600/90 text-[8px] font-black uppercase text-white tracking-widest">{res.type}</span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-xs font-black truncate text-slate-900 dark:text-white uppercase italic">{res.title}</h4>
                                            {res.description && <p className="text-[9px] text-slate-500 font-medium truncate mt-0.5">{res.description}</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Header for Journal */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm border border-amber-200/50 dark:border-amber-700/20">
                        <span className="material-symbols-outlined text-2xl">history_edu</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xl leading-tight">Chronicles</h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tus notas y secretos personales.</p>
                    </div>
                </div>
                {!isReadOnly && (
                    <button 
                        onClick={addNote}
                        className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-all"
                        title="Nueva Nota"
                    >
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </button>
                )}
            </div>

            {/* List Area */}
            <div className="flex-1 space-y-4">
                {notesList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-40 select-none">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-white/5">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">edit_note</span>
                        </div>
                        <p className="text-base font-bold text-slate-500 dark:text-slate-400">Blank Page</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center mt-1">Your story begins here.</p>
                    </div>
                )}

                {notesList.map((note) => (
                    <NoteCard 
                        key={note.id} 
                        note={note} 
                        onUpdate={updateNote} 
                        onDelete={deleteNote} 
                        isReadOnly={isReadOnly}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotesTab;
