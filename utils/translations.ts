import SPELL_NAMES_ES from '../Data/translations/es/spell-names.json';
import BACKGROUND_NAMES_ES from '../Data/translations/es/background-names.json';

export const SPELL_NAME_TO_ES: Record<string, string> = SPELL_NAMES_ES;
export const SPELL_NAME_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(SPELL_NAMES_ES).map(([en, es]) => [es, en])
);

export const BACKGROUND_NAME_TO_ES: Record<string, string> = BACKGROUND_NAMES_ES;
export const BACKGROUND_NAME_TO_EN: Record<string, string> = Object.fromEntries(
  Object.entries(BACKGROUND_NAMES_ES).map(([en, es]) => [es, en])
);

export function translateSpellName(enName: string, targetLang: 'en' | 'es'): string {
  if (targetLang === 'es') {
    return SPELL_NAME_TO_ES[enName] || enName;
  }
  return enName;
}

export function untranslateSpellName(esName: string): string {
  return SPELL_NAME_TO_EN[esName] || esName;
}

export function translateBackgroundName(enName: string, targetLang: 'en' | 'es'): string {
  if (targetLang === 'es') {
    return BACKGROUND_NAME_TO_ES[enName] || enName;
  }
  return enName;
}

export function untranslateBackgroundName(esName: string): string {
  return BACKGROUND_NAME_TO_EN[esName] || esName;
}
