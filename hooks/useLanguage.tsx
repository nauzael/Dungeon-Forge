import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { TRANSLATIONS_EN, TRANSLATIONS_ES, Translation } from '../Data/translations/ui';

interface LanguageContextType {
  language: 'en' | 'es';
  t: Translation;
  setLanguage: (lang: 'en' | 'es') => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    try {
      const saved = localStorage.getItem('dnd-language');
      return (saved === 'es' || saved === 'en') ? saved : 'en'; // Default to EN
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dnd-language', language);
    } catch (e) {
      console.error("Failed to save language to localStorage", e);
    }
  }, [language]);

  const t = language === 'en' ? TRANSLATIONS_EN : TRANSLATIONS_ES;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default ES if not in provider, maintaining backward compatibility
    return {
        language: 'es' as const,
        t: TRANSLATIONS_ES,
        setLanguage: () => {},
        toggleLanguage: () => {}
    };
  }
  return context;
};

export default useLanguage;
