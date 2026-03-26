export type Language = 'en' | 'es';

export interface TranslationResult {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslationService {
  translate(text: string, targetLang: Language): Promise<string>;
}

type TranslationSource = {
  get(text: string): string | null;
  set?(text: string, translation: string): void;
};

class MemoryCache implements TranslationSource {
  private cache = new Map<string, string>();

  get(text: string): string | null {
    return this.cache.get(text) ?? null;
  }

  set(text: string, translation: string): void {
    this.cache.set(text, translation);
  }
}

class StaticTranslation implements TranslationSource {
  private data: Map<string, string> = new Map();

  async load(translations: Record<string, string>): Promise<void> {
    this.data = new Map(Object.entries(translations));
  }

  get(text: string): string | null {
    return this.data.get(text) ?? null;
  }
}

class APIFallback implements TranslationSource {
  private lastRequestTime = 0;
  private requestDelay = 1000;
  private queue: Array<{ resolve: (value: string) => void; reject: (error: Error) => void; text: string; langPair: string }> = [];
  private isProcessing = false;
  private readonly baseUrl = 'https://api.mymemory.translated.net/get';

  get(_text: string): string | null {
    return null;
  }

  async translate(text: string, targetLang: Language): Promise<string> {
    const sourceLang = targetLang === 'es' ? 'en' : 'es';
    const langPair = `${sourceLang}|${targetLang}`;
    
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, text, langPair });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { resolve, reject, text, langPair } = this.queue.shift()!;
      
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < this.requestDelay) {
        await new Promise(r => setTimeout(r, this.requestDelay - timeSinceLastRequest));
      }
      this.lastRequestTime = Date.now();

      try {
        const result = await this.translateSingle(text, langPair);
        resolve(result);
      } catch (error) {
        reject(error as Error);
      }
    }

    this.isProcessing = false;
  }

  private async translateSingle(text: string, langPair: string): Promise<string> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    
    if (data.responseDetails) {
      throw new Error(data.responseDetails);
    }
    
    throw new Error('Translation failed');
  }
}

class TranslationServiceImpl implements TranslationService {
  private cache = new MemoryCache();
  private api = new APIFallback();
  private staticData: StaticTranslation[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const categories = [
      import('../Data/translations/es/class_features.json'),
      import('../Data/translations/es/species_traits.json'),
      import('../Data/translations/es/feats.json'),
      import('../Data/translations/es/invocations.json'),
      import('../Data/translations/es/spells.json'),
      import('../Data/translations/es/items.json'),
    ];

    const results = await Promise.allSettled(categories);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const staticTrans = new StaticTranslation();
        const value = (result.value as { default: Record<string, string> }).default;
        staticTrans.load(value);
        this.staticData.push(staticTrans);
      } else {
        console.warn(`Failed to load translation category ${index}:`, result.reason);
      }
    });

    this.initialized = true;
  }

  async translate(text: string, targetLang: Language): Promise<string> {
    if (targetLang !== 'es') return text;
    
    await this.initialize();

    const textStr = String(text || '');
    if (!textStr || textStr.trim() === '') return '';

    // 1. Check memory cache
    const cached = this.cache.get(textStr);
    if (cached) return cached;

    // 2. Check static translations
    for (const staticTrans of this.staticData) {
      const staticResult = staticTrans.get(textStr);
      if (staticResult) {
        this.cache.set(textStr, staticResult);
        return staticResult;
      }
    }

    // 3. Fallback to API
    try {
      const translated = await this.api.translate(textStr, targetLang);
      this.cache.set(textStr, translated);
      return translated;
    } catch (error) {
      console.error('Translation API error:', error);
      return textStr;
    }
  }
}

const translationService = new TranslationServiceImpl();

export const useTranslationService = () => translationService;

export const translateText = async (text: string, targetLang: Language): Promise<string> => {
  return translationService.translate(text, targetLang);
};
