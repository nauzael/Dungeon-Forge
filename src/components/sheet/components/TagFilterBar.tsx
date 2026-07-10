import React from 'react';
import { NoteTag } from '../../../../types';

interface TagFilterBarProps {
  aggregatedTags: Array<{ tag: NoteTag; count: number }>;
  noteCount: number;
  activeTagIds: string[];
  onToggle: (tagId: string) => void;
}

const TagFilterBar: React.FC<TagFilterBarProps> = ({
  aggregatedTags,
  noteCount,
  activeTagIds,
  onToggle,
}) => {
  const isAllActive = activeTagIds.length === 0;

  return (
    <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
      <div className="flex gap-3">
        {/* "All" pill — active when no filters are selected */}
        <button
          type="button"
          onClick={() => onToggle('__all__')}
          className={`
            inline-flex items-center gap-1.5
            text-sm font-bold px-4 py-2
            rounded-radius-pill
            active:scale-95
            transition-all duration-200
            snap-start
            whitespace-nowrap
            shrink-0
            ${isAllActive
              ? 'bg-primary text-white'
              : 'border border-slate-200 dark:border-white/10 bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }
          `}
        >
          All ({noteCount})
        </button>

        {/* Tag pills */}
        {aggregatedTags.map(({ tag, count }) => {
          const isActive = activeTagIds.includes(tag.id);

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              className={`
                inline-flex items-center gap-1.5
                text-sm font-bold px-4 py-2
                rounded-radius-pill
                active:scale-95
                transition-all duration-200
                snap-start
                whitespace-nowrap
                shrink-0
                ${isActive
                  ? 'text-white'
                  : 'border border-slate-200 dark:border-white/10 bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }
              `}
              style={isActive ? { backgroundColor: tag.color } : undefined}
            >
              {tag.label} {count}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilterBar;
