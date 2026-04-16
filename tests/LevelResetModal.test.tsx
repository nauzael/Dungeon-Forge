import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LevelResetModal from '../components/sheet/LevelResetModal';
import type { Character, InventoryItem } from '../types';
import type { LevelSnapshot, LevelResetChanges } from '../types/levelSnapshot';

const createMockCharacter = (overrides: Partial<Character> = {}): Character => ({
  id: 'test-char-1',
  name: 'Test Hero',
  level: 5,
  class: 'Wizard',
  species: 'Elf',
  hp: { current: 30, max: 35 },
  stats: { STR: 10, DEX: 14, CON: 12, INT: 16, WIS: 13, CHA: 11 },
  skills: ['Arcana', 'History'],
  feats: ['Spell Sniper'],
  profBonus: 3,
  ac: 13,
  init: 2,
  speed: 30,
  languages: ['Common', 'Elvish'],
  inventory: [] as InventoryItem[],
  isRaging: false,
  party_id: null,
  created_at: Date.now(),
  updated_at: Date.now(),
  ...overrides,
} as Character);

const createMockSnapshot = (level: number, timestamp: number): LevelSnapshot => ({
  id: `snap-${level}`,
  characterId: 'test-char-1',
  level,
  timestamp,
  snapshotData: {
    level,
    class: 'Wizard',
    subclass: level >= 3 ? 'Evocation' : undefined,
    hp: { max: 10 + (level - 1) * 5, current: 10 + (level - 1) * 5 },
    maxHp: 10 + (level - 1) * 5,
    stats: { STR: 10, DEX: 14, CON: 12, INT: 16, WIS: 13, CHA: 11 },
    skills: level >= 2 ? ['Arcana', 'History'] : ['Arcana'],
    feats: level >= 4 ? ['Spell Sniper'] : [],
    profBonus: Math.ceil(level / 4) + 1,
    ac: 13,
    init: 2,
    speed: 30,
    languages: ['Common', 'Elvish'],
    inventory: [],
  } as any,
  metadata: {
    reason: `Level ${level} completed`,
    characterName: 'Test Hero',
    totalLevels: level,
    source: 'level_up' as const,
  },
});

const createMockChanges = (): LevelResetChanges => ({
  hpChange: -10,
  statsChanges: {},
  skillsLost: [],
  skillsGained: [],
  featsLost: ['Spell Sniper'],
  featsGained: [],
  spellsLost: [],
  subclassChanges: true,
  resourcesAffected: ['Level 5 → 3', 'HP: -10', '1 feats lost'],
});

const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('LevelResetModal Component', () => {
  const mockOnRestore = vi.fn();
  const mockOnDeleteSnapshot = vi.fn();
  const mockOnClose = vi.fn();
  const mockGetChangesForSnapshot = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.store = {};
    localStorageMock.store['dungeon_forge_level_snapshots'] = JSON.stringify({
      version: '1.0.0',
      snapshots: {},
      auditLog: [],
      lastUpdated: Date.now(),
    });
  });

  const defaultProps = {
    character: createMockCharacter(),
    snapshots: [] as LevelSnapshot[],
    currentLevel: 5,
    onRestore: mockOnRestore,
    onDeleteSnapshot: mockOnDeleteSnapshot,
    onClose: mockOnClose,
    getChangesForSnapshot: mockGetChangesForSnapshot,
  };

  describe('Basic Rendering', () => {
    it('should render modal title', () => {
      render(<LevelResetModal {...defaultProps} />);
      
      expect(screen.getByText('Level Reset')).toBeTruthy();
    });

    it('should show subtitle', () => {
      render(<LevelResetModal {...defaultProps} />);
      
      expect(screen.getByText('Restore to Previous Level')).toBeTruthy();
    });

    it('should show empty state when no snapshots', () => {
      render(<LevelResetModal {...defaultProps} snapshots={[]} />);
      
      expect(screen.getByText('No previous level snapshots available.')).toBeTruthy();
    });

    it('should display current level info', () => {
      render(<LevelResetModal {...defaultProps} />);
      
      expect(screen.getByText(/Current Level:/)).toBeTruthy();
      expect(screen.getByText(/Available Snapshots:/)).toBeTruthy();
    });
  });

  describe('Snapshot List', () => {
    it('should render snapshot items when provided', () => {
      const snapshots = [
        createMockSnapshot(4, Date.now() - 60000),
        createMockSnapshot(3, Date.now() - 120000),
      ];
      
      render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
      
      expect(screen.getByText('Level 4')).toBeTruthy();
      expect(screen.getByText('Level 3')).toBeTruthy();
    });

    it('should show selection indicator when clicked', () => {
      const snapshots = [createMockSnapshot(3, Date.now() - 10000)];
      
      render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
      
      const levelButton = screen.getByText('Level 3').closest('button');
      if (levelButton) {
        fireEvent.click(levelButton);
      }
      
      expect(screen.getByText(/Reset to Level/i)).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      render(<LevelResetModal {...defaultProps} />);
      
      const closeBtn = document.querySelector('button');
      if (closeBtn) {
        fireEvent.click(closeBtn);
      }
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should show confirmation dialog on restore click', () => {
      const snapshots = [createMockSnapshot(3, Date.now() - 10000)];
      mockGetChangesForSnapshot.mockReturnValue(createMockChanges());
      
      render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
      
      const levelButton = screen.getByText('Level 3').closest('button');
      if (levelButton) {
        fireEvent.click(levelButton);
      }
      
      fireEvent.click(screen.getByText(/Reset to Level/i));
      
      expect(screen.getByText(/Are you sure/i)).toBeTruthy();
    });

    it('should call onRestore after confirmation', () => {
      const snapshots = [createMockSnapshot(3, Date.now() - 10000)];
      mockGetChangesForSnapshot.mockReturnValue(createMockChanges());
      
      render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
      
      fireEvent.click(screen.getByText('Level 3').closest('button')!);
      fireEvent.click(screen.getByText(/Reset to Level/i));
      fireEvent.click(screen.getByText('Confirm Reset').closest('button')!);
      
      expect(mockOnRestore).toHaveBeenCalledWith('snap-3');
    });

    it('should not call onRestore when cancelled', () => {
      const snapshots = [createMockSnapshot(3, Date.now() - 10000)];
      mockGetChangesForSnapshot.mockReturnValue(createMockChanges());
      
      render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
      
      fireEvent.click(screen.getByText('Level 3').closest('button')!);
      fireEvent.click(screen.getByText(/Reset to Level/i));
      fireEvent.click(screen.getByText('Cancel').closest('button')!);
      
      expect(mockOnRestore).not.toHaveBeenCalled();
    });

    it('should call onDeleteSnapshot on delete confirmation', () => {
      const snapshots = [createMockSnapshot(3, Date.now() - 10000)];
      mockGetChangesForSnapshot.mockReturnValue(createMockChanges());
      
      render(<LevelResetModal {...defaultProps} snapshots={snapshots} />);
      
      fireEvent.click(screen.getByText('Level 3').closest('button')!);
      fireEvent.click(screen.getByText('Delete Snapshot'));
      fireEvent.click(screen.getByText('Delete Snapshot').closest('button')!);
      
      expect(mockOnDeleteSnapshot).toHaveBeenCalledWith('snap-3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal container', () => {
      render(<LevelResetModal {...defaultProps} />);
      
      const modal = document.querySelector('[class*="fixed inset-0"]');
      expect(modal).toBeTruthy();
    });

    it('should have close button', () => {
      render(<LevelResetModal {...defaultProps} />);
      
      const buttons = document.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
