import { useState, useMemo, useCallback } from 'react';
import { Character } from '../../types';
import { MOCK_CHARACTERS } from '../../constants';
import { migrateCharacters } from '../../utils/characterMigrations';
import { isValidCharacter } from '../utils/validators';
import { STORAGE_KEY_CHARACTERS } from '../constants';

export function useCharacters() {
  // Initialize characters from localStorage if available, otherwise use mocks
  // Apply migrations to existing characters on load
  // Validate each character - filter corrupted ones, clean localStorage if needed
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHARACTERS);
      if (!saved) {
        return MOCK_CHARACTERS;
      }

      const parsed = JSON.parse(saved) as unknown;

      // Ensure it's an array
      if (!Array.isArray(parsed)) {
        localStorage.removeItem(STORAGE_KEY_CHARACTERS);
        return MOCK_CHARACTERS;
      }

      // Validate each character
      const validated: Character[] = [];
      const corrupted: unknown[] = [];

      for (const char of parsed) {
        const validation = isValidCharacter(char);
        if (!validation.valid) {
          const charName =
            typeof char === 'object' && char !== null && 'name' in char
              ? (char as Record<string, unknown>).name
              : 'unknown';
          corrupted.push(char);
        } else {
          validated.push(char as Character);
        }
      }

      // If corrupted characters were found, save cleaned data back to localStorage
      if (corrupted.length > 0) {
        const percentage = Math.round((corrupted.length / parsed.length) * 100);

        // Save cleaned data
        try {
          localStorage.setItem(STORAGE_KEY_CHARACTERS, JSON.stringify(validated));
        } catch (storageErr) {
        }
      }

      // Apply migrations to valid characters
      const { characters: migratedChars } = migrateCharacters(validated);
      return migratedChars;
    } catch (e) {
      try {
        localStorage.removeItem(STORAGE_KEY_CHARACTERS);
      } catch (err) {
      }
      return MOCK_CHARACTERS;
    }
  });

  // Track deleted character IDs to prevent restoration after reload
  const [deletedCharacterIds, setDeletedCharacterIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('df-deleted-characters');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const activeCharacter = useMemo(
    () => characters.find((c) => c.id === activeCharacterId),
    [characters, activeCharacterId]
  );

  const [observedCharacter, setObservedCharacter] = useState<Character | null>(null);

  const handleExportCharacters = useCallback(() => {
    const blob = new Blob([JSON.stringify(characters, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute(
      'download',
      'dnd_characters_' + new Date().toISOString().slice(0, 10) + '.json'
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  }, [characters]);

  return {
    characters,
    setCharacters,
    activeCharacterId,
    setActiveCharacterId,
    activeCharacter,
    deletedCharacterIds,
    setDeletedCharacterIds,
    observedCharacter,
    setObservedCharacter,
    handleExportCharacters,
  };
}
