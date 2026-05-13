import React from 'react';

type DashboardTab = 'party' | 'resources' | 'compendium' | 'monsters' | 'initiative' | 'critical';

interface BottomNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: DashboardTab; icon: string; label: string }> = [
    { id: 'party', icon: 'groups', label: 'Party' },
    { id: 'initiative', icon: 'swords', label: 'Init' },
    { id: 'critical', icon: 'casino', label: 'Crit' },
    { id: 'resources', icon: 'photo_library', label: 'Atlas' },
    { id: 'compendium', icon: 'menu_book', label: 'Ref' },
    { id: 'monsters', icon: 'skull', label: 'Mobs' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
      <nav className="mx-auto max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-2 grid grid-cols-6 gap-1 shadow-2xl backdrop-blur-xl">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
