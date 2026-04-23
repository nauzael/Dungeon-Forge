import React from 'react';

interface TabletLayoutWrapperProps {
  isMobile: boolean;
  activeTab: string;
  children: React.ReactNode;
  tabPanelLeft: React.ReactNode;
  tabPanelRight: React.ReactNode;
}

/**
 * Wrapper que muestra 2 tabs lado a lado en tablet.
 * En mobile, muestra solo un tab (comportamiento normal).
 * 
 * Uso:
 * <TabletLayoutWrapper
 *   isMobile={isMobile}
 *   activeTab="combat"
 *   tabPanelLeft={<CombatTab />}
 *   tabPanelRight={<InventoryTab />}
 * >
 *   {/* navigation */}
 * </TabletLayoutWrapper>
 */
const TabletLayoutWrapper: React.FC<TabletLayoutWrapperProps> = ({
  isMobile,
  activeTab,
  children,
  tabPanelLeft,
  tabPanelRight,
}) => {
  if (isMobile) {
    // Mobile: comportamiento normal, solo un tab
    return (
      <div className="flex flex-col h-full">
        {children}
        <div className="flex-1 overflow-y-auto">
          {tabPanelLeft}
        </div>
      </div>
    );
  }

  // Tablet: mostrar 2 tabs lado a lado
  return (
    <div className="flex flex-col h-full md:flex-row gap-4 p-4">
      {/* Navigation (top en mobile, left en tablet) */}
      <div className="md:hidden w-full">
        {children}
      </div>

      {/* Left panel - Combat tab siempre */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5">
          {tabPanelLeft}
        </div>
      </div>

      {/* Right panel - Secondary tab */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5">
          {tabPanelRight}
        </div>
      </div>
    </div>
  );
};

export default TabletLayoutWrapper;
