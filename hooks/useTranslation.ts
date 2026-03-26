import { useState, useEffect, useCallback } from 'react';
import { translateText, Language } from '../utils/TranslationService';

export const useTranslation = (text: string, targetLang: Language = 'es') => {
  const [translation, setTranslation] = useState<string>(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text || targetLang !== 'es') {
      setTranslation(text);
      return;
    }

    let cancelled = false;
    setLoading(true);

    translateText(text, targetLang).then(result => {
      if (!cancelled) {
        setTranslation(result);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setTranslation(text);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, targetLang]);

  return { translation, loading };
};

export const useTranslationAsync = () => {
  const translate = useCallback(async (text: string, targetLang: Language = 'es'): Promise<string> => {
    if (!text || targetLang !== 'es') return text;
    return translateText(text, targetLang);
  }, []);

  return { translate };
};
