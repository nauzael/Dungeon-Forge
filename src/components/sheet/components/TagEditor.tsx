import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { NoteTag } from '../../../../types';
import { TAG_CATEGORIES, getTagColor } from '../../../constants/tags';
import { useResponsive } from '../../../../hooks/useResponsive';
import { useModalScrollLock } from '../../../../hooks/useModalScrollLock';

interface TagEditorProps {
  currentTags: NoteTag[];
  allUsedTags: NoteTag[];
  onSave: (tags: NoteTag[]) => void;
  onClose: () => void;
}

type AnimationState = 'entering' | 'open' | 'closing';

const TagEditor: React.FC<TagEditorProps> = ({ currentTags, allUsedTags, onSave, onClose }) => {
  const { isMobile } = useResponsive();
  const { lockScroll, unlockScroll } = useModalScrollLock();

  const [animationState, setAnimationState] = useState<AnimationState>('entering');
  const [localTags, setLocalTags] = useState<NoteTag[]>(currentTags);
  const [customInput, setCustomInput] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    TAG_CATEGORIES.forEach((cat, i) => {
      initial[cat.id] = i < 3;
    });
    return initial;
  });
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const closingRef = useRef(false);

  const isDesktop = !isMobile;

  // ─── prefers-reduced-motion detection ────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ─── Scroll lock ─────────────────────────────────────────────────
  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Entrance animation ──────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('open');
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // ─── Close handler with exit animation ───────────────────────────
  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setAnimationState('closing');
    setTimeout(() => {
      onClose();
    }, 250);
  }, [onClose]);

  // ─── Done handler: save + close ──────────────────────────────────
  const handleDone = useCallback(() => {
    onSave(localTags);
    handleClose();
  }, [localTags, onSave, handleClose]);

  // ─── Keyboard: Escape ───────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // ─── Tag toggle ──────────────────────────────────────────────────
  const toggleTag = useCallback((tag: NoteTag) => {
    setLocalTags(prev => {
      const exists = prev.some(t => t.id === tag.id);
      if (exists) {
        return prev.filter(t => t.id !== tag.id);
      }
      return [...prev, tag];
    });
  }, []);

  // ─── Remove selected tag ─────────────────────────────────────────
  const removeTag = useCallback((tagId: string) => {
    setLocalTags(prev => prev.filter(t => t.id !== tagId));
  }, []);

  // ─── Add custom tag ──────────────────────────────────────────────
  const addCustomTag = useCallback((raw: string) => {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return;

    // Don't duplicate existing tag in localTags
    if (localTags.some(t => t.label.toLowerCase() === trimmed)) return;

    // Reuse color from allUsedTags if exists, otherwise deterministic
    const existingTag = allUsedTags.find(t => t.label.toLowerCase() === trimmed);
    const color = existingTag ? existingTag.color : getTagColor(trimmed);

    const newTag: NoteTag = {
      id: `custom-${Date.now()}`,
      label: trimmed,
      color,
    };

    setLocalTags(prev => [...prev, newTag]);
    setCustomInput('');
    setShowAutocomplete(false);
    inputRef.current?.focus();
  }, [localTags, allUsedTags]);

  // ─── Autocomplete suggestions ────────────────────────────────────
  const suggestions = useMemo(() => {
    if (!customInput.trim()) return [];
    const q = customInput.trim().toLowerCase();
    const currentIds = new Set(localTags.map(t => t.id));
    return allUsedTags
      .filter(t => !currentIds.has(t.id))
      .filter(t => t.label.toLowerCase().includes(q))
      .slice(0, 5);
  }, [customInput, allUsedTags, localTags]);

  // ─── Category collapse toggle ─────────────────────────────────────
  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  }, []);

  // ─── Computed animation styles ────────────────────────────────────
  const isVisible = animationState === 'open';
  const isAnimating = animationState === 'entering' || animationState === 'closing';
  const transitionStyles = prefersReducedMotion
    ? { transition: 'none' as const }
    : { transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms ease-out' as const };

  // ─── Category color lookup ────────────────────────────────────────
  const CAT_COLORS: Record<string, string> = {
    quest: '#f59e0b',
    entity: '#3b82f6',
    lore: '#14b8a6',
    location: '#22c55e',
    item: '#a855f7',
    meta: '#f43f5e',
    combat: '#f97316',
  };

  // ─── Render: inline tag pill (same visual as TagChip, no import) ──
  const renderTagPill = (tag: NoteTag, onRemove?: () => void) => (
    <span
      key={tag.id}
      title={tag.label}
      className="inline-flex items-center gap-1 text-white rounded-radius-pill active:scale-95 transition-transform duration-motion-fast dark:bg-opacity-80 text-sm leading-none px-3 py-1.5"
      style={{ backgroundColor: tag.color }}
    >
      {tag.icon && (
        <span className="material-symbols-outlined text-sm">{tag.icon}</span>
      )}
      <span>{tag.label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="flex items-center justify-center bg-black/10 rounded-full hover:bg-black/20 transition-colors p-0.5 ml-0.5"
          aria-label={`Remove tag ${tag.label}`}
        >
          <span className="material-symbols-outlined text-xs">close</span>
        </button>
      )}
    </span>
  );

  // ─── Render: suggestion dropdown item ─────────────────────────────
  const renderSuggestion = (tag: NoteTag) => (
    <button
      key={tag.id}
      type="button"
      onClick={() => {
        setLocalTags(prev => [...prev, tag]);
        setCustomInput('');
        setShowAutocomplete(false);
        inputRef.current?.focus();
      }}
      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 transition-colors"
    >
      <span
        className="inline-block w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: tag.color }}
      />
      <span>{tag.label}</span>
    </button>
  );

  // ─── Render: categories ──────────────────────────────────────────
  const renderCategories = () => (
    <>
      {TAG_CATEGORIES.map(cat => {
        const isExpanded = expandedCategories[cat.id];
        const catColor = CAT_COLORS[cat.id] || '#94a3b8';

        return (
          <div key={cat.id} className="space-y-1.5">
            <button
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className="flex items-center gap-1.5 w-full text-left"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ color: catColor }}
              >
                {cat.icon}
              </span>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {cat.label}
              </span>
              <span
                className="material-symbols-outlined text-sm text-slate-400 ml-auto transition-transform duration-200"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
            </button>

            {isExpanded && (
              <div className="flex flex-wrap gap-1.5 pl-1">
                {cat.tags.map(pt => {
                  const tagColor = getTagColor(pt.label);
                  const isSelected = localTags.some(t => t.id === pt.id);

                  return (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => toggleTag({
                        id: pt.id,
                        label: pt.label,
                        color: tagColor,
                        icon: pt.icon,
                      })}
                      className={`
                        inline-flex items-center gap-1.5 rounded-radius-pill active:scale-95 transition-all duration-motion-fast text-sm leading-none px-3 py-1.5
                        ${isSelected
                          ? 'text-white dark:bg-opacity-80'
                          : 'text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 bg-transparent'
                        }
                      `}
                      style={isSelected ? { backgroundColor: tagColor } : undefined}
                    >
                      {pt.icon && (
                        <span className="material-symbols-outlined text-sm">{pt.icon}</span>
                      )}
                      <span>{pt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  // ─── Render: editor content ──────────────────────────────────────
  const renderContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-slate-500 dark:text-slate-400">label</span>
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Tag Editor</span>
        </div>
        <button
          onClick={handleDone}
          className="size-11 flex items-center justify-center rounded-radius-lg bg-primary/10 hover:bg-primary/20 active:bg-primary/30 transition-colors text-primary"
          aria-label="Done"
        >
          <span className="material-symbols-outlined text-xl">check</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {renderCategories()}

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-white/10 pt-4" />

        {/* Custom tag input + autocomplete */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 rounded-radius-xl px-4 py-3.5 border border-slate-200 dark:border-white/10 focus-within:border-primary/50 transition-colors">
            <span className="material-symbols-outlined text-sm text-slate-400">add</span>
            <input
              ref={inputRef}
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setShowAutocomplete(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTag(customInput);
                }
              }}
              onFocus={() => setShowAutocomplete(true)}
              onBlur={() => {
                // Delay hiding so click on suggestion registers
                setTimeout(() => setShowAutocomplete(false), 150);
              }}
              placeholder="Add custom tag..."
              className="flex-1 bg-transparent border-none p-0 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400/60 focus:ring-0 outline-none"
            />
          </div>

          {/* Autocomplete dropdown */}
          {showAutocomplete && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-radius-xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden z-10">
              {suggestions.map(renderSuggestion)}
            </div>
          )}
        </div>
      </div>

      {/* Selected tags preview */}
      {localTags.length > 0 && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-white/10 shrink-0">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
            Selected
          </span>
          <div className="flex flex-wrap gap-1.5">
            {localTags.map(tag => renderTagPill(tag, () => removeTag(tag.id)))}
          </div>
        </div>
      )}
    </>
  );

  // ─── Panel (mobile: bottom sheet, desktop: popover centered) ─────
  const renderPanel = () => {
    const overlay = (
      <div
        className="tag-editor-overlay fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{
          opacity: isAnimating ? 0 : 1,
          transition: prefersReducedMotion ? 'none' : 'opacity 200ms ease-out',
        }}
        onClick={handleClose}
      />
    );

    if (isMobile) {
      return (
        <div className="fixed inset-0 z-[300] flex flex-col justify-end">
          {overlay}

          <div
            className="tag-editor-panel relative bg-white dark:bg-[#0f1525] rounded-t-radius-2xl shadow-2xl flex flex-col max-h-[80vh] w-full pb-[max(1rem,env(safe-area-inset-bottom))]"
            style={{
              ...transitionStyles,
              transform: isAnimating ? 'translateY(100%)' : 'translateY(0)',
              opacity: isAnimating ? 0 : 1,
            }}
          >
            {/* Drag handle visual */}
            <div className="h-1.5 w-12 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-2 mb-4 shrink-0" />

            {renderContent()}
          </div>
        </div>
      );
    }

    // Desktop: Popover centered
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center">
        {overlay}

        <div
          className="tag-editor-panel relative bg-white dark:bg-[#0f1525] rounded-radius-2xl shadow-2xl flex flex-col max-w-lg w-[90vw] max-h-[85vh]"
          style={{
            ...transitionStyles,
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            opacity: isAnimating ? 0 : 1,
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  };

  return createPortal(renderPanel(), document.body);
};

export default TagEditor;
