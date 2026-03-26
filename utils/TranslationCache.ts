import type { Language } from './TranslationService';

const CACHE_PREFIX = 'translations_';
const CACHE_VERSION = 'v1';

interface CacheEntry {
  original: string;
  translated: string;
  timestamp: number;
}

export class TranslationCache {
  private language: Language;
  private cache: Map<string, CacheEntry> = new Map();
  private initialized = false;

  constructor(language: Language) {
    this.language = language;
    this.loadFromStorage();
  }

  private getCacheKey(text: string): string {
    const hash = this.simpleHash(text.toLowerCase().trim());
    return `${CACHE_PREFIX}${this.language}_${CACHE_VERSION}_${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  get(text: string): string | null {
    if (!this.initialized) return null;
    
    const key = this.getCacheKey(text);
    const entry = this.cache.get(key);
    
    if (entry && entry.original.toLowerCase().trim() === text.toLowerCase().trim()) {
      return entry.translated;
    }
    
    return null;
  }

  set(text: string, translated: string): void {
    const key = this.getCacheKey(text);
    this.cache.set(key, {
      original: text,
      translated,
      timestamp: Date.now()
    });
  }

  setLanguage(language: Language): void {
    this.language = language;
    this.cache.clear();
    this.loadFromStorage();
  }

  loadFromStorage(): void {
    try {
      const storageKey = `${CACHE_PREFIX}${this.language}_${CACHE_VERSION}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]) => {
          this.cache.set(key, value as CacheEntry);
        });
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
    
    this.initialized = true;
  }

  saveToStorage(): void {
    try {
      const storageKey = `${CACHE_PREFIX}${this.language}_${CACHE_VERSION}`;
      const data: Record<string, CacheEntry> = {};
      
      this.cache.forEach((value, key) => {
        data[key] = value;
      });
      
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  clear(): void {
    this.cache.clear();
    try {
      const storageKey = `${CACHE_PREFIX}${this.language}_${CACHE_VERSION}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear translation cache:', error);
    }
  }

  getSize(): number {
    return this.cache.size;
  }
}

const cacheInstances: Map<Language, TranslationCache> = new Map();

export const getTranslationCache = (language: Language): TranslationCache => {
  if (!cacheInstances.has(language)) {
    cacheInstances.set(language, new TranslationCache(language));
  }
  return cacheInstances.get(language)!;
};

export const clearAllTranslationCaches = (): void => {
  cacheInstances.clear();
  const languages: Language[] = ['en', 'es'];
  languages.forEach(lang => {
    try {
      const storageKey = `${CACHE_PREFIX}${lang}_${CACHE_VERSION}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  });
};
