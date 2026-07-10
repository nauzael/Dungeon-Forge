import React, { useState, useEffect, useRef, useLayoutEffect, memo, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useImageZoom } from '../../../hooks/useImageZoom';
import { useDebounce } from '../../../hooks/useDebounce';
import { Character, NoteItem, NoteTag, CampaignResource } from '../../../types';
import { getPartyResources } from '../../../utils/firebase';
import { useDialog } from '../../../src/contexts/DialogContext';
import TagChip from './components/TagChip';
import SearchBar from './components/SearchBar';
import TagFilterBar from './components/TagFilterBar';
import TagEditor from './components/TagEditor';

interface NotesTabProps {
    character: Character;
    onUpdate: (char: Character) => void;
    isReadOnly?: boolean;
}

// ─── matchSearch: función pura fuera del componente ─────────────────────
function matchSearch(note: NoteItem, query: string): boolean {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        (note.tags ?? []).some(tag => tag.label.toLowerCase().includes(q))
    );
}

// ─── NoteListItem: compacto para la lista ──────────────────────────────
const NoteListItem: React.FC<{
    note: NoteItem;
    onClick: (id: string) => void;
}> = ({ note, onClick }) => {
    const contentPreview = note.content
        .replace(/<[^>]*>/g, '') // Strip HTML
        .slice(0, 100);
    const hasPreview = contentPreview.length > 0;

    return (
        <button
            onClick={() => onClick(note.id)}
            className="w-full text-left group relative bg-white dark:bg-surface-dark rounded-radius-xl p-4 shadow-sm border border-slate-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-motion-base hover:shadow-[0_4px_16px_-4px_rgba(53,158,255,0.12)] dark:hover:shadow-[0_4px_16px_-4px_rgba(53,158,255,0.08)] active:scale-[0.98] overflow-hidden"
        >
            {/* Pin indicator */}
            {note.pinned && (
                <div className="absolute right-3 top-3">
                    <span className="material-symbols-outlined text-sm text-primary">push_pin</span>
                </div>
            )}

            {/* Title */}
            <div className="flex items-center gap-2 min-w-0">
                {note.pinned && (
                    <span className="material-symbols-outlined text-primary text-base shrink-0">push_pin</span>
                )}
                <h4 className={`font-bold text-slate-900 dark:text-white truncate ${note.pinned ? 'text-sm' : 'text-sm'}`}>
                    {note.title || 'Untitled Note'}
                </h4>
            </div>

            {/* Content preview */}
            {hasPreview && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {contentPreview}
                </p>
            )}

            {/* Tags + Date row */}
            <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex items-center gap-1 overflow-hidden">
                            {note.tags.slice(0, 3).map(tag => (
                                <span
                                    key={tag.id}
                                    className="text-[10px] leading-none font-bold px-1.5 py-0.5 rounded-radius-pill text-white truncate max-w-[80px]"
                                    style={{ backgroundColor: tag.color }}
                                >
                                    {tag.label}
                                </span>
                            ))}
                            {note.tags.length > 3 && (
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                    +{note.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                    {note.date}
                </span>
            </div>
        </button>
    );
};

// ─── NoteViewerModal: modal de lectura/edición ────────────────────────
const NoteViewerModal: React.FC<{
    note: NoteItem;
    onUpdate: (id: string, field: 'title' | 'content', value: string) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    onAddTag: (id: string) => void;
    onClose: () => void;
    isReadOnly?: boolean;
}> = ({ note, onUpdate, onDelete, onTogglePin, onAddTag, onClose, isReadOnly }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    const adjustHeight = () => {
        const element = textareaRef.current;
        if (element) {
            element.style.height = 'auto';
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    useLayoutEffect(() => {
        adjustHeight();
    }, [note.content]);

    // Focus title on mount if empty
    useEffect(() => {
        if (!note.title && titleRef.current) {
            titleRef.current.focus();
        }
    }, [note.title]);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return createPortal(
        <div
            ref={modalRef}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-900/80 dark:bg-black/60 animate-fadeIn backdrop-blur-sm p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-white dark:bg-[#0f1525] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden sm:rounded-radius-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="shrink-0 flex items-center gap-2 px-5 pt-5 sm:pt-5 pb-3 border-b border-slate-100 dark:border-white/5">
                    <input
                        ref={titleRef}
                        type="text"
                        value={note.title}
                        onChange={(e) => onUpdate(note.id, 'title', e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="Note Title"
                        className="flex-1 bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 min-w-0"
                    />
                    {!isReadOnly && (
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={() => onTogglePin(note.id)}
                                className={`p-2 rounded-radius-pill transition-all duration-200 ${
                                    note.pinned
                                      ? 'text-primary hover:bg-primary/10'
                                      : 'text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/10'
                                }`}
                                title={note.pinned ? 'Unpin' : 'Pin'}
                            >
                                <span className="material-symbols-outlined text-lg">push_pin</span>
                            </button>
                            <button
                                onClick={() => onDelete(note.id)}
                                className="p-2 rounded-radius-pill text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                title="Delete note"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-radius-pill text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
                                title="Close"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                    )}
                    {isReadOnly && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-radius-pill text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200 shrink-0"
                            title="Close"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    )}
                </div>

                {/* ── Tags ── */}
                <div className="shrink-0 px-5 pt-3 pb-1">
                    <div className="flex items-center gap-1.5 flex-wrap min-h-[28px]">
                        {note.tags?.map(tag => (
                            <TagChip key={tag.id} tag={tag} size="sm" />
                        ))}
                        {!isReadOnly && (
                            <button
                                onClick={() => onAddTag(note.id)}
                                className="text-[11px] text-slate-400 hover:text-primary px-2 py-0.5 rounded-radius-pill hover:bg-primary/10 transition-colors flex items-center gap-0.5"
                                title="Add tags"
                            >
                                <span className="material-symbols-outlined text-[14px]">add</span>
                                <span className="text-[10px] font-bold">Tag</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex-1 overflow-y-auto px-5 py-3 min-h-[200px]">
                    <textarea
                        ref={textareaRef}
                        value={note.content}
                        onChange={(e) => onUpdate(note.id, 'content', e.target.value)}
                        readOnly={isReadOnly}
                        className="w-full bg-transparent border-none p-0 text-sm leading-7 text-slate-600 dark:text-slate-300 placeholder:text-slate-400/50 dark:placeholder:text-slate-600/50 focus:ring-0 resize-none overflow-hidden font-body min-h-[180px]"
                        placeholder="Write your adventures here..."
                        spellCheck={false}
                        rows={1}
                    />
                </div>

                {/* ── Footer ── */}
                <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-white/5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-radius-pill border border-slate-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                        {note.date}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600">
                        {note.content.length} chars
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ─── Main NotesTab ─────────────────────────────────────────────────────
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

    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [campaignAtlas, setCampaignAtlas] = useState<CampaignResource[]>([]);
    const [isLoadingAtlas, setIsLoadingAtlas] = useState(false);
    const [atlasViewerResource, setAtlasViewerResource] = useState<CampaignResource | null>(null);
    const atlasZoom = useImageZoom({ minScale: 1, maxScale: 6, step: 0.25 });
    const dialog = useDialog();

    // ─── Search & Tag State ─────────────────────────────────────────
    const [rawQuery, setRawQuery] = useState('');
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [tagEditorTarget, setTagEditorTarget] = useState<string | null>(null);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const searchInputRef = useRef<HTMLDivElement>(null);
    const searchQuery = useDebounce(rawQuery, 300);

    // Fetch Campaign Resources (Atlas)
    useEffect(() => {
        if (!character.party_id) return;

        let cancelled = false;
        const fetchAtlas = async () => {
            setIsLoadingAtlas(true);
            const resources = await getPartyResources(character.party_id!);
            if (!cancelled) {
                setCampaignAtlas(resources);
                setIsLoadingAtlas(false);
            }
        };

        fetchAtlas();
        return () => { cancelled = true; };
    }, [character.party_id]);

    // Debounce save logic
    useEffect(() => {
        if (isReadOnly) return;
        const handler = setTimeout(() => {
            onUpdate({ ...character, notes: notesList });
        }, 800);

        return () => clearTimeout(handler);
    }, [notesList]);

    // ─── Handlers ────────────────────────────────────────────────────

    const addNote = () => {
        if (isReadOnly) return;
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            title: '',
            content: '',
            date: new Date().toLocaleDateString(),
            tags: [],
            pinned: false,
        };
        setNotesList(prev => [newNote, ...prev]);
        setSelectedNoteId(newNote.id);
    };

    const deleteNote = async (id: string) => {
        if (await dialog.showConfirm("Delete this note?")) {
            setNotesList(prev => prev.filter(n => n.id !== id));
            setSelectedNoteId(null);
        }
    };

    const updateNoteField = (id: string, field: 'title' | 'content', value: string) => {
        setNotesList(prev => prev.map(n =>
            n.id === id ? { ...n, [field]: value } : n
        ));
    };

    const togglePinNote = (id: string) => {
        let shouldAlert = false;
        setNotesList(prev => {
            const target = prev.find(n => n.id === id);
            if (!target) return prev;
            if (target.pinned) {
                return prev.map(n => n.id === id ? { ...n, pinned: false } : n);
            }
            const pinnedCount = prev.filter(n => n.pinned).length;
            if (pinnedCount >= 3) {
                shouldAlert = true;
                return prev;
            }
            return prev.map(n => n.id === id ? { ...n, pinned: true } : n);
        });
        if (shouldAlert) {
            dialog.showAlert('Maximum 3 pinned notes', 'Limit reached');
        }
    };

    const saveNoteTags = (id: string, tags: NoteTag[]) => {
        setNotesList(prev => prev.map(n =>
            n.id === id ? { ...n, tags } : n
        ));
    };

    const openNote = (id: string) => {
        setSelectedNoteId(id);
    };

    const closeNote = () => {
        setSelectedNoteId(null);
    };

    // ─── Computed Values ────────────────────────────────────────────

    const selectedNote = useMemo(() => {
        return notesList.find(n => n.id === selectedNoteId) ?? null;
    }, [notesList, selectedNoteId]);

    const filteredNotes = useMemo(() => {
        return notesList
            .filter(n => !searchQuery || matchSearch(n, searchQuery))
            .filter(n => activeTags.length === 0 || activeTags.every(tagId => n.tags?.some(t => t.id === tagId)))
            .sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return 0;
            });
    }, [notesList, searchQuery, activeTags]);

    const aggregatedFilterTags = useMemo(() => {
        const tagMap = new Map<string, { tag: NoteTag; count: number }>();
        notesList.forEach(note => {
            (note.tags ?? []).forEach(tag => {
                const existing = tagMap.get(tag.id);
                if (existing) {
                    existing.count++;
                } else {
                    tagMap.set(tag.id, { tag, count: 1 });
                }
            });
        });
        return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
    }, [notesList]);

    const allUsedTags = useMemo(() => {
        const tagMap = new Map<string, NoteTag>();
        notesList.forEach(note => {
            (note.tags ?? []).forEach(tag => {
                tagMap.set(tag.id, tag);
            });
        });
        return Array.from(tagMap.values());
    }, [notesList]);

    const searchSuggestions = useMemo(() => {
        const q = rawQuery.toLowerCase().trim();
        if (!q || q.length < 1) return [];
        const matched: NoteTag[] = [];
        const seen = new Set<string>();
        allUsedTags.forEach(tag => {
            if (tag.label.toLowerCase().includes(q) && !seen.has(tag.id)) {
                matched.push(tag);
                seen.add(tag.id);
            }
        });
        return matched.slice(0, 5);
    }, [rawQuery, allUsedTags]);

    // Dismiss search suggestions on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
                setShowSearchSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close note modal on Escape (redundant with modal's own handler, but safe)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedNoteId(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className="flex flex-col h-full px-4 pb-24 pt-4 min-h-[80vh] bg-slate-50/30 dark:bg-transparent w-full">

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
                                <div key={i} className="min-w-[200px] h-32 rounded-radius-xl bg-slate-100 dark:bg-white/5 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {campaignAtlas.length === 0 ? (
                                <div className="w-full py-6 px-4 rounded-radius-2xl border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">The Master has not shared persistent resources yet.</p>
                                </div>
                            ) : (
                                campaignAtlas.map(res => (
                                    <div
                                        key={res.id}
                                        className="snap-center min-w-[240px] group relative bg-surface-light dark:bg-surface-dark rounded-radius-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                                        onClick={() => { setAtlasViewerResource(res); atlasZoom.resetZoom(); }}
                                    >
                                        <div className="h-32 relative">
                                            <img src={res.url} alt={res.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-0.5 rounded-radius-pill bg-blue-600/90 text-[8px] font-black uppercase text-white tracking-widest">{res.type}</span>
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

            {/* Alignment and Languages Section */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Alignment Card */}
                <div className="bg-white dark:bg-surface-dark rounded-radius-xl p-4 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/50"></div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-amber-500 text-lg">balance</span>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Alignment</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white pl-1 capitalize">
                        {character.alignment || 'None'}
                    </p>
                </div>

                {/* Languages Card */}
                <div className="bg-white dark:bg-surface-dark rounded-radius-xl p-4 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500/50"></div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="material-symbols-outlined text-blue-500 text-lg">translate</span>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Languages</h4>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-1">
                        {character.languages && character.languages.length > 0 ? (
                            character.languages.map((lang, idx) => (
                                <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                    {lang}
                                </span>
                            ))
                        ) : (
                            <p className="text-sm font-bold text-slate-900 dark:text-white">None</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Header for Journal */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-radius-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm border border-amber-200/50 dark:border-amber-700/20">
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
                        className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-radius-pill shadow-elev-modal shadow-primary/30 hover:scale-110 active:scale-95 transition-all shrink-0"
                        title="Nueva Nota"
                    >
                        <span className="material-symbols-outlined text-2xl">add</span>
                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div ref={searchInputRef} className="mb-4 relative">
                <SearchBar
                    value={rawQuery}
                    onChange={(v) => { setRawQuery(v); setShowSearchSuggestions(v.length > 0); }}
                    placeholder="Buscar en tus notas..."
                />

                {/* Search Autocomplete */}
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-[#151d2e] rounded-radius-xl shadow-elev-modal border border-slate-200 dark:border-white/10 overflow-hidden z-50 py-1 animate-fadeIn">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            Sugerencias
                        </div>
                        {searchSuggestions.map(tag => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => {
                                    setRawQuery(tag.label);
                                    setShowSearchSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: tag.color }}
                                />
                                {tag.icon && (
                                    <span className="material-symbols-outlined text-sm text-slate-400">{tag.icon}</span>
                                )}
                                <span className="font-medium">{tag.label}</span>
                                <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Tag</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Tag Filter Bar */}
            {aggregatedFilterTags.length > 0 && (
                <div className="mb-4">
                    <TagFilterBar
                        aggregatedTags={aggregatedFilterTags}
                        noteCount={filteredNotes.length}
                        activeTagIds={activeTags}
                        onToggle={(tagId) => {
                            if (tagId === '__all__') {
                                setActiveTags([]);
                            } else {
                                setActiveTags(prev =>
                                    prev.includes(tagId)
                                        ? prev.filter(id => id !== tagId)
                                        : [...prev, tagId]
                                );
                            }
                        }}
                    />
                </div>
            )}

            {/* Notes List */}
            <div className="flex-1 space-y-2">
                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-section-phone opacity-50 select-none">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-radius-2xl flex items-center justify-center mb-5 border border-slate-200 dark:border-white/5">
                            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
                                {searchQuery ? 'search_off' : 'edit_note'}
                            </span>
                        </div>
                        <p className="text-base font-bold text-slate-500 dark:text-slate-400">
                            {searchQuery ? 'Sin resultados' : 'Blank Page'}
                        </p>
                        {searchQuery ? (
                            <>
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 text-center mt-1.5 max-w-[260px]">
                                    Try searching by <span className="font-semibold text-slate-500 dark:text-slate-400">title</span>, <span className="font-semibold text-slate-500 dark:text-slate-400">content</span> or a <span className="font-semibold text-slate-500 dark:text-slate-400">tag</span> name.
                                </p>
                                {activeTags.length > 0 && (
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center mt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setRawQuery(''); setActiveTags([]); }}
                                            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                                        >
                                            Clear filters
                                        </button>
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 text-center mt-1.5">
                                Write your first chapter.
                            </p>
                        )}
                    </div>
                )}

                {filteredNotes.map((note) => (
                    <NoteListItem
                        key={note.id}
                        note={note}
                        onClick={openNote}
                    />
                ))}
            </div>

            {/* Tag Editor Modal */}
            {tagEditorTarget && !isReadOnly && (
                <TagEditor
                    currentTags={notesList.find(n => n.id === tagEditorTarget)?.tags ?? []}
                    allUsedTags={allUsedTags}
                    onSave={(tags) => {
                        saveNoteTags(tagEditorTarget, tags);
                        setTagEditorTarget(null);
                    }}
                    onClose={() => setTagEditorTarget(null)}
                />
            )}

            {/* Note Viewer Modal */}
            {selectedNote && (
                <NoteViewerModal
                    note={selectedNote}
                    onUpdate={updateNoteField}
                    onDelete={deleteNote}
                    onTogglePin={togglePinNote}
                    onAddTag={setTagEditorTarget}
                    onClose={closeNote}
                    isReadOnly={isReadOnly}
                />
            )}

            {/* Atlas Viewer */}
            {atlasViewerResource && createPortal(
                <div
                    className="fixed inset-0 z-[300] bg-black flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    {/* Header con safe-area */}
                    <div className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-black/60 backdrop-blur-sm shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="px-2 py-0.5 rounded-radius-pill bg-blue-600/90 text-[8px] font-black uppercase text-white tracking-widest shrink-0">
                                {atlasViewerResource.type}
                            </span>
                            <h3 className="text-sm font-black uppercase italic text-white tracking-tight truncate">
                                {atlasViewerResource.title}
                            </h3>
                        </div>
                        <button
                            onClick={() => { setAtlasViewerResource(null); atlasZoom.resetZoom(); }}
                            className="ml-3 shrink-0 size-10 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:bg-white/40 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Visor táctil */}
                    <div
                        ref={atlasZoom.viewportRef}
                        className="flex-1 flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing"
                        onTouchStart={atlasZoom.handleTouchStart}
                        onTouchMove={atlasZoom.handleTouchMove}
                        onTouchEnd={atlasZoom.handleTouchEnd}
                        onWheel={atlasZoom.handleWheel}
                        onMouseDown={atlasZoom.handleMouseDown}
                        onMouseMove={atlasZoom.handleMouseMove}
                        onMouseUp={atlasZoom.handleMouseUp}
                        onMouseLeave={atlasZoom.handleMouseUp}
                    >
                        <div ref={atlasZoom.contentRef} style={atlasZoom.transformStyle}>
                            <img
                                src={atlasViewerResource.url}
                                className="max-w-[100vw] max-h-[calc(100vh-9rem)] object-contain select-none"
                                alt={atlasViewerResource.title}
                                draggable={false}
                            />
                        </div>
                    </div>

                    {/* Controles con safe-area bottom */}
                    <div className="flex justify-center items-center gap-2 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shrink-0">
                        <button onClick={atlasZoom.zoomOut} className="size-12 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm active:bg-white/40">
                            <span className="material-symbols-outlined text-2xl">remove</span>
                        </button>
                        <span className="text-white text-sm font-bold min-w-[70px] text-center">{Math.round(atlasZoom.scale * 100)}%</span>
                        <button onClick={atlasZoom.zoomIn} className="size-12 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm active:bg-white/40">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </button>
                        <button onClick={atlasZoom.resetZoom} className="size-12 rounded-radius-pill bg-white/20 hover:bg-white/30 flex items-center justify-center text-white backdrop-blur-sm active:bg-white/40 ml-2">
                            <span className="material-symbols-outlined text-2xl">fit_screen</span>
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const NotesTabMemo = memo(NotesTab);
NotesTabMemo.displayName = 'NotesTab';
export default NotesTabMemo;
