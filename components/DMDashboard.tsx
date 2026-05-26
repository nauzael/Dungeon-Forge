
import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../types';
import { useDMParty } from '../hooks/useDMParty';
import { useInitiativeTracker } from '../hooks/useInitiativeTracker';
import { debugLogger } from '../utils/debugLogger';
import { subscribeWithRetry } from '../utils/firebase'; // WAVE 8: Lazy load listeners - Firebase Realtime Database
import Controls from './DMDashboard/Controls';
import PartySelector from './DMDashboard/PartySelector';
import TabContent from './DMDashboard/TabContent';
import BottomNav from './DMDashboard/BottomNav';
import ConnectionDebugPanel from './DMDashboard/ConnectionDebugPanel';

interface DMDashboardProps {
  onBack: () => void;
  onViewCharacter: (char: Character) => void;
  user: { name: string, id: string } | null;
}

type DashboardTab = 'party' | 'resources' | 'compendium' | 'monsters' | 'initiative' | 'critical';

const DMDashboard: React.FC<DMDashboardProps> = ({ onBack, onViewCharacter, user }) => {
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
  const { initiativeCombatants, setInitiativeCombatants } = useInitiativeTracker(party?.id ?? null, members);

  // WAVE 8: Lazy load listeners for multiple characters on edit
  const listeners = useRef<Map<string, { unsubscribe: () => Promise<void> }>>(new Map());

  // ← LAZY: Abre listener al hacer click en "editar"
  const handleStartEditCharacter = (characterId: string) => {
    if (!party || !listeners.current.has(characterId)) {
      const subscription = subscribeWithRetry(
        party?.id || '',
        (payload: any) => {
          if (payload.new?.id === characterId) {
            // Update handled by parent component via context/props
            console.log(`[DMDashboard] Received update for ${characterId}`);
          }
        },
        undefined,
        undefined,
        characterId // WAVE 7: Selective sync
      );
      
      listeners.current.set(characterId, subscription);
      console.log(`[DMDashboard] Opened listener for character ${characterId}`);
    }
  };

  // ← Cierra listener cuando dejas de editar
  const handleStopEditCharacter = async (characterId: string) => {
    const listener = listeners.current.get(characterId);
    if (listener) {
      await listener.unsubscribe();
      listeners.current.delete(characterId);
      console.log(`[DMDashboard] Closed listener for character ${characterId}`);
    }
  };

  // Cleanup on unmount or party change
  useEffect(() => {
    return () => {
      listeners.current.forEach((listener) => {
        listener.unsubscribe();
      });
      listeners.current.clear();
    };
  }, [party?.id]);

  // Handlers
  const handleDeletePartyWithConfirm = async () => {
    if (!party) return;
    if (window.confirm(`Are you sure you want to PERMANENTLY DELETE the table "${party.name}"? Players will be removed.`)) {
      const success = await handleDeleteParty();
      if (!success) {
        alert("Error deleting table.");
      }
    }
  };

  const handleCreatePartyWithName = async (partyName: string) => {
    const success = await handleCreateParty(partyName);
    if (!success) {
      alert("Error creating party.");
    }
  };

  const handleKickWithConfirm = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to kick ${name} from your table?`)) {
      const success = await handleKickCharacter(id, name);
      if (!success) {
        debugLogger.log('[DMDashboard]', `Kick operation failed for ${name}`, 'error', { characterId: id });
        alert(`❌ Error removing ${name} from the Nexus.\n\nOpen the Debug Panel (🔍 Diagnóstico) to see more details about what went wrong.`);
      } else {
        alert(`✅ ${name} has been removed from your table.`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#0f172a] text-white">
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

        {/* 🔍 Debug Panel - Solo en party selector */}
        {!party && (
          <ConnectionDebugPanel realtimeStatus={realtimeStatus} />
        )}
      </main>

      {/* Bottom Navigation */}
      {party && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  );
};

export default DMDashboard;
