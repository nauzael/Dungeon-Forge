import React, { createContext, useContext, ReactNode } from 'react';
import { TRANSLATIONS, Translation } from '../Data/translations/ui';

interface LanguageContextType {
  language: 'en';
  t: Translation;
  setLanguage: (lang: 'en') => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: LanguageContextType = {
    language: 'en',
    t: TRANSLATIONS,
    setLanguage: () => {},
    toggleLanguage: () => {},
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return {
      language: 'en' as const,
      t: TRANSLATIONS,
      setLanguage: () => {},
      toggleLanguage: () => {},
    };
  }
  return context;
};

export default useLanguage;
