import React from 'react';

interface TabletPotionBeltProps {
  children: React.ReactNode;
  isTablet: boolean;
}

/**
 * Wrapper optimizado para Potion Belt en tablet.
 * Mobile: scroll horizontal normal
 * Tablet: grid de potions con mejor visualización
 */
const TabletPotionBelt: React.FC<TabletPotionBeltProps> = ({ children, isTablet }) => {
  return (
    <div
      className={
        isTablet
          ? "grid grid-cols-3 md:grid-cols-4 gap-4 py-2"
          : "flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1"
      }
    >
      {children}
    </div>
  );
};

export default TabletPotionBelt;
