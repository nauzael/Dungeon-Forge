import React, { Suspense, lazy } from 'react';
import { Character, InitiativeCombatant } from '../../types';
import MemberList from './MemberList';

// Lazy load new DM modules
const CampaignResources = lazy(() => import('../dm/CampaignResources'));
const Compendium = lazy(() => import('../dm/Compendium'));
const MonsterBuilder = lazy(() => import('../dm/MonsterBuilder'));
const InitiativeTracker = lazy(() => import('../dm/InitiativeTracker'));
const CriticalFumbleTable = lazy(() => import('../dm/CriticalFumbleTable'));

type DashboardTab = 'party' | 'resources' | 'compendium' | 'monsters' | 'initiative' | 'critical';

interface TabContentProps {
  activeTab: DashboardTab;
  members: Character[];
  isLoading: boolean;
  onViewCharacter: (char: Character) => void;
  onKickCharacter: (id: string, name: string) => void;
  partyId: string;
  onSyncParty: () => void;
  initiativeCombatants: InitiativeCombatant[];
  onCombatantsChange: (combatants: InitiativeCombatant[]) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  members,
  isLoading,
  onViewCharacter,
  onKickCharacter,
  partyId,
  onSyncParty,
  initiativeCombatants,
  onCombatantsChange,
}) => {
  return (
    <div className="space-y-6 pb-24">
      <Suspense fallback={<div className="flex items-center justify-center p-20"><span className="material-symbols-outlined animate-spin text-blue-500">progress_activity</span></div>}>
        {activeTab === 'party' && (
          <MemberList
            members={members}
            isLoading={isLoading}
            onViewCharacter={onViewCharacter}
            onKickCharacter={onKickCharacter}
          />
        )}
        {activeTab === 'resources' && <CampaignResources partyId={partyId} />}
        {activeTab === 'compendium' && <Compendium />}
        {activeTab === 'monsters' && <MonsterBuilder playerLevels={members.map(m => m.level)} />}
        {activeTab === 'initiative' && (
          <InitiativeTracker
            partyMembers={members}
            combatants={initiativeCombatants}
            onCombatantsChange={onCombatantsChange}
            onSyncParty={onSyncParty}
          />
        )}
        {activeTab === 'critical' && <CriticalFumbleTable />}
      </Suspense>
    </div>
  );
};

export default TabContent;
