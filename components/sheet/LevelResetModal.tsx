import React, { useState, useMemo } from 'react';
import type { Character } from '../../types';
import type { LevelSnapshot, LevelResetChanges } from '../../types/levelSnapshot';
import { formatTimestamp } from '../../utils/levelResetUtils';

interface LevelResetModalProps {
  character: Character;
  snapshots: LevelSnapshot[];
  currentLevel: number;
  onRestore: (snapshotId: string) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  onClose: () => void;
  getChangesForSnapshot: (snapshotId: string) => LevelResetChanges | null;
  onForceSync?: () => void;
  isSyncing?: boolean;
}

const LevelResetModal: React.FC<LevelResetModalProps> = ({
  character,
  snapshots,
  currentLevel,
  onRestore,
  onDeleteSnapshot,
  onClose,
  getChangesForSnapshot,
  onForceSync,
  isSyncing,
}) => {
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const levelUpSnapshots = useMemo(() => {
    return snapshots
      .filter(s => s.metadata?.source === 'level_up' && s.level < currentLevel)
      .sort((a, b) => b.level - a.level);
  }, [snapshots, currentLevel]);

  const selectedSnapshot = useMemo(() => {
    return levelUpSnapshots.find(s => s.id === selectedSnapshotId) || null;
  }, [levelUpSnapshots, selectedSnapshotId]);

  const selectedChanges = useMemo(() => {
    if (!selectedSnapshotId) return null;
    return getChangesForSnapshot(selectedSnapshotId);
  }, [selectedSnapshotId, getChangesForSnapshot]);

  const handleLevelSelect = (snapshotId: string) => {
    setSelectedSnapshotId(snapshotId);
    setShowDeleteConfirm(false);
    setShowRestoreConfirm(false);
  };

  const handleRestoreClick = () => {
    if (selectedSnapshotId) {
      setShowRestoreConfirm(true);
    }
  };

  const handleRestoreConfirm = () => {
    if (selectedSnapshotId) {
      onRestore(selectedSnapshotId);
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSnapshotId) {
      onDeleteSnapshot(selectedSnapshotId);
      setSelectedSnapshotId(null);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/80 dark:bg-black/60 flex items-end sm:items-center justify-center animate-fadeIn backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-white dark:bg-[#0f1525] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col animate-slideUp overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              Level Reset
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Restore to Previous Level
            </span>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 p-4">
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between gap-2 text-blue-700 dark:text-blue-300 text-sm">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">info</span>
                    <span>
                        <strong>Level:</strong> {currentLevel} | {' '}
                        <strong>Snapshots:</strong> {levelUpSnapshots.length}
                    </span>
                </div>
                {onForceSync && (
                    <button 
                        onClick={onForceSync}
                        disabled={isSyncing}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>
                            {isSyncing ? 'sync' : 'cloud_upload'}
                        </span>
                        {isSyncing ? 'Syncing...' : 'Sync Cloud'}
                    </button>
                )}
            </div>
          </div>

          <div className="mb-4 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 p-2 rounded-lg border border-slate-200 dark:border-white/10 italic">
            <p>Los puntos de restauración se sincronizan con tu cuenta para que puedas recuperarlos en cualquier dispositivo.</p>
          </div>

          {levelUpSnapshots.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">history</span>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                No previous level snapshots available.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                Level up to create snapshots.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Select a level to restore:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {levelUpSnapshots.map((snapshot, index) => {
                  const isSelected = selectedSnapshotId === snapshot.id;
                  const isCurrent = snapshot.level === currentLevel - 1;

                  return (
                    <button
                      key={snapshot.id}
                      onClick={() => handleLevelSelect(snapshot.id)}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && (
                              <span className="material-symbols-outlined text-white text-sm">check</span>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              Level {snapshot.level}
                            </span>
                            {isCurrent && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded font-medium">
                                Previous
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formatTimestamp(snapshot.timestamp)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedChanges && (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg mt-0.5">
                  warning
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Restoring to Level {selectedSnapshot?.level} will:
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    {selectedChanges.hpChange !== 0 && (
                      <li>
                        • Set HP to {selectedSnapshot?.snapshotData.hp.max}{' '}
                        <span className="text-amber-600 dark:text-amber-400">
                          ({selectedChanges.hpChange > 0 ? '+' : ''}{selectedChanges.hpChange})
                        </span>
                      </li>
                    )}
                    {selectedChanges.skillsLost.length > 0 && (
                      <li>• Remove {selectedChanges.skillsLost.length} skill(s)</li>
                    )}
                    {selectedChanges.featsLost.length > 0 && (
                      <li>• Remove {selectedChanges.featsLost.length} feat(s)</li>
                    )}
                    {selectedChanges.spellsLost.length > 0 && (
                      <li>• Remove {selectedChanges.spellsLost.length} prepared spell(s)</li>
                    )}
                    {selectedChanges.subclassChanges && (
                      <li>• Reset subclass to previous selection</li>
                    )}
                    {Object.keys(selectedChanges.statsChanges).length > 0 && (
                      <li>
                        • Reset{' '}
                        {Object.keys(selectedChanges.statsChanges)
                          .map(s => `${s} (-1)`)
                          .join(', ')}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#0f1525]">
          {showRestoreConfirm ? (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 text-center font-medium">
                  Are you sure you want to reset to Level {selectedSnapshot?.level}?
                </p>
                <p className="text-xs text-red-500 dark:text-red-400 text-center mt-1">
                  This action cannot be undone. A backup will be created.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className="py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestoreConfirm}
                  className="py-3 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          ) : showDeleteConfirm ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl">
                <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                  Delete this snapshot? This cannot be undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="py-3 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete Snapshot
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleRestoreClick}
                disabled={!selectedSnapshotId}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] ${
                  selectedSnapshotId
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/25'
                    : 'bg-slate-300 dark:bg-white/10 cursor-not-allowed shadow-none'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">restore</span>
                  Reset to Level {selectedSnapshot?.level || '...'}
                </span>
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={!selectedSnapshotId}
                  className={`py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    selectedSnapshotId
                      ? 'bg-slate-100 dark:bg-white/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-white/20 cursor-not-allowed'
                  }`}
                >
                  Delete Snapshot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelResetModal;
