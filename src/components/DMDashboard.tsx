import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../../types';
import { useDialog } from '../../src/contexts/DialogContext';
import { useDMParty } from '../../hooks/useDMParty';
import { useInitiativeTracker } from '../../hooks/useInitiativeTracker';
import { subscribeWithRetry } from '../../utils/firebase'; // WAVE 8: Lazy load listeners - Firebase Realtime Database
import Controls from './DMDashboard/Controls';
import PartySelector from './DMDashboard/PartySelector';
import TabContent from './DMDashboard/TabContent';
import BottomNav from './DMDashboard/BottomNav';

interface DMDashboardProps {
  onBack: () => void;
  onViewCharacter: (char: Character) => void;
  user: { name: string; id: string } | null;
}

type DashboardTab = 'party' | 'resources' | 'compendium' | 'monsters' | 'initiative' | 'critical';

const DMDashboard: React.FC<DMDashboardProps> = ({ onBack, onViewCharacter, user }) => {
  const dialog = useDialog();
  const [activeTab, setActiveTab] = useState<DashboardTab>('party');

  // Party management hook
  const {
    party,
    parties,
    members,
    isLoading,
    realtimeStatus,
    debouncedFetchMembers,
    handleCreateParty,
    handleDeleteParty,
    handleKickCharacter,
    handleUpdateName,
    selectParty,
    unselectParty,
  } = useDMParty(user?.id ?? null);

  // Initiative tracker hook
  const { initiativeCombatants, setInitiativeCombatants } = useInitiativeTracker(
    party?.id ?? null,
    members
  );

  // WAVE 8: Lazy load listeners for multiple characters on edit
  const listeners = useRef<Map<string, { unsubscribe: () => Promise<void> }>>(new Map());

  // ← LAZY: Abre listener al hacer click en "editar" (WAVE 8)
  const _handleStartEditCharacter = (characterId: string) => {
    if (!party || !listeners.current.has(characterId)) {
      const subscription = subscribeWithRetry(
        party?.id || '',
        (payload: unknown) => {
          const update = payload as { new?: { id?: string } };
          if (update.new?.id === characterId) {
            // Update handled by parent component via context/props
          }
        },
        undefined,
        characterId // WAVE 7: Selective sync
      );

      listeners.current.set(characterId, subscription);
    }
  };

  // ← Cierra listener cuando dejas de editar (WAVE 8)
  const _handleStopEditCharacter = async (characterId: string) => {
    const listener = listeners.current.get(characterId);
    if (listener) {
      await listener.unsubscribe();
      listeners.current.delete(characterId);
    }
  };

  // Cleanup on unmount or party change
  useEffect(() => {
    const currentListeners = listeners.current;
    return () => {
      currentListeners.forEach((listener) => {
        listener.unsubscribe();
      });
      currentListeners.clear();
    };
  }, [party?.id]);

  // Handlers
  const handleDeletePartyWithConfirm = async () => {
    if (!party) return;
    if (
      await dialog.showConfirm(
        `Are you sure you want to PERMANENTLY DELETE the table "${party.name}"? Players will be removed.`
      )
    ) {
      try {
        const success = await handleDeleteParty();
        if (!success) {
          const errorMsg = `❌ ERROR DELETING TABLE\n\nParty: ${party.name}\nID: ${party.id}`;
          await dialog.showAlert(errorMsg);
        } else {
          await dialog.showAlert(`✅ Table "${party.name}" deleted successfully!`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        await dialog.showAlert(`❌ Error deleting table: ${errorMsg}`);
      }
    }
  };

  const handleCreatePartyWithName = async (partyName: string) => {
    const success = await handleCreateParty(partyName);
    if (!success) {
      await dialog.showAlert('Error creating party.');
    }
  };

  const handleKickWithConfirm = async (id: string, name: string) => {
    if (await dialog.showConfirm(`Are you sure you want to kick ${name} from your table?`)) {
      const success = await handleKickCharacter(id, name);
      if (!success) {
        await dialog.showAlert(
          `❌ Error removing ${name} from the Nexus.`
        );
      } else {
        await dialog.showAlert(`✅ ${name} has been removed from your table.`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0f172a] text-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <Controls
        party={party}
        realtimeStatus={realtimeStatus}
        isLoading={isLoading}
        onBack={onBack}
        onBackToSelection={unselectParty}
        onSync={() => party && debouncedFetchMembers(party.id)}
        onDelete={handleDeletePartyWithConfirm}
        onUpdateName={handleUpdateName}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        {!party ? (
          <PartySelector
            parties={parties}
            onSelectParty={selectParty}
            onCreateParty={handleCreatePartyWithName}
            isCreating={false}
            isLoading={isLoading}
          />
        ) : (
          <TabContent
            activeTab={activeTab}
            members={members}
            isLoading={isLoading}
            onViewCharacter={onViewCharacter}
            onKickCharacter={handleKickWithConfirm}
            partyId={party.id}
            onSyncParty={() => debouncedFetchMembers(party.id)}
            initiativeCombatants={initiativeCombatants}
            onCombatantsChange={setInitiativeCombatants}
          />
        )}

      </main>

      {/* Bottom Navigation */}
      {party && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
};

export default DMDashboard;
