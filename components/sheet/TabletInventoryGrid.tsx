import React from 'react';
import { InventoryItem } from '../../types';

interface TabletInventoryGridProps {
  items: InventoryItem[];
  isTablet: boolean;
  renderItemRow: (item: InventoryItem) => React.ReactNode;
  categoryTitle?: string;
  isEmpty?: boolean;
  emptyMessage?: React.ReactNode;
}

/**
 * Grid responsivo para inventory items.
 * Mobile: lista vertical (1 columna)
 * Tablet: grid de 2 columnas
 * Desktop: grid de 3 columnas
 */
const TabletInventoryGrid: React.FC<TabletInventoryGridProps> = ({
  items,
  isTablet,
  renderItemRow,
  categoryTitle,
  isEmpty = false,
  emptyMessage
}) => {
  return (
    <div className="flex flex-col gap-3">
      {categoryTitle && (
        <h3 className="text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider pl-1">
          {categoryTitle}
        </h3>
      )}
      
      {isEmpty ? (
        <div>{emptyMessage}</div>
      ) : (
        <div className={isTablet ? "grid grid-cols-2 gap-3 md:gap-4" : "space-y-2"}>
          {items.map(item => (
            <div key={item.id} className={isTablet ? "flex flex-col" : ""}>
              {renderItemRow(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabletInventoryGrid;
