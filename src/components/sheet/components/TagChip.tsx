import React from 'react';
import { NoteTag } from '../../../../types';

interface TagChipProps {
  tag: NoteTag;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

const TagChip: React.FC<TagChipProps> = ({ tag, onRemove, size = 'sm' }) => {
  const isSm = size === 'sm';

  return (
    <span
      title={tag.label}
      className={`
        inline-flex items-center gap-1
        text-white
        rounded-radius-pill
        active:scale-95
        transition-transform duration-motion-fast
        dark:bg-opacity-80
        dark:border dark:border-white/5
        ${isSm ? 'text-[11px] leading-none px-2.5 py-0.5' : 'text-xs leading-none px-3 py-1'}
      `}
      style={{ backgroundColor: tag.color }}
    >
      {tag.icon && (
        <span
          className={`material-symbols-outlined ${isSm ? 'text-[12px]' : 'text-sm'}`}
        >
          {tag.icon}
        </span>
      )}
      <span>{tag.label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center justify-center bg-black/10 rounded-full hover:bg-black/10 transition-colors p-0.5"
          aria-label={`Remove tag ${tag.label}`}
        >
          <span className={`material-symbols-outlined ${isSm ? 'text-[11px]' : 'text-xs'}`}>
            close
          </span>
        </button>
      )}
    </span>
  );
};

export default TagChip;
