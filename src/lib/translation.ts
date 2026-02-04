/**
 * Service de traduction automatique avec DeepL
 * Utilise un cache localStorage pour éviter les appels API répétés
 */

type Language = 'FR' | 'ENG';

const CACHE_KEY = 'translation_cache';
const CACHE_VERSION = 1;

interface CacheData {
  version: number;
  translations: Record<string, string>;
}

// Cache en mémoire pour les traductions de la session
let memoryCache: Record<string, string> = {};

// Charger le cache depuis localStorage
function loadCache(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const data: CacheData = JSON.parse(cached);
      if (data.version === CACHE_VERSION) {
        return data.translations;
      }
    }
  } catch (error) {
    console.warn('Error loading translation cache:', error);
  }
  return {};
}

// Sauvegarder le cache dans localStorage
function saveCache(translations: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  try {
    const data: CacheData = {
      version: CACHE_VERSION,
      translations,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Error saving translation cache:', error);
  }
}

// Initialiser le cache mémoire depuis localStorage
function initCache(): void {
  if (Object.keys(memoryCache).length === 0) {
    memoryCache = loadCache();
  }
}

// Générer une clé de cache
function getCacheKey(text: string, targetLang: Language): string {
  return `${targetLang}:${text}`;
}

// Mapper la langue du frontend vers DeepL
function mapLanguageToDeepL(lang: Language): 'FR' | 'EN' {
  return lang === 'ENG' ? 'EN' : 'FR';
}

/**
 * Traduire un tableau de textes
 */
export async function translateTexts(
  texts: string[],
  targetLang: Language,
  sourceLang?: Language
): Promise<string[]> {
  initCache();

  const deepLTargetLang = mapLanguageToDeepL(targetLang);
  const deepLSourceLang = sourceLang ? mapLanguageToDeepL(sourceLang) : undefined;

  // Filtrer les textes vides et vérifier le cache
  const results: string[] = new Array(texts.length);
  const textsToTranslate: { text: string; index: number }[] = [];

  texts.forEach((text, index) => {
    // Si le texte est vide ou très court, ne pas traduire
    if (!text || text.trim().length === 0) {
      results[index] = text;
      return;
    }

    const cacheKey = getCacheKey(text, targetLang);
    const cached = memoryCache[cacheKey];

    if (cached) {
      results[index] = cached;
    } else {
      textsToTranslate.push({ text, index });
    }
  });

  // Si tous les textes sont en cache, retourner directement
  if (textsToTranslate.length === 0) {
    return results;
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: textsToTranslate.map(t => t.text),
        targetLang: deepLTargetLang,
        sourceLang: deepLSourceLang,
      }),
    });

    if (!response.ok) {
      console.warn('Translation API error:', response.status);
      // En cas d'erreur, retourner les textes originaux
      textsToTranslate.forEach(({ text, index }) => {
        results[index] = text;
      });
      return results;
    }

    const data = await response.json();

    // Mettre en cache et construire les résultats
    data.translations.forEach((translatedText: string, i: number) => {
      const { text: originalText, index } = textsToTranslate[i];
      const cacheKey = getCacheKey(originalText, targetLang);

      memoryCache[cacheKey] = translatedText;
      results[index] = translatedText;
    });

    // Sauvegarder le cache mis à jour
    saveCache(memoryCache);

    return results;
  } catch (error) {
    console.error('Translation error:', error);
    // En cas d'erreur, retourner les textes originaux
    textsToTranslate.forEach(({ text, index }) => {
      results[index] = text;
    });
    return results;
  }
}

/**
 * Traduire un seul texte
 */
export async function translateText(
  text: string,
  targetLang: Language,
  sourceLang?: Language
): Promise<string> {
  const results = await translateTexts([text], targetLang, sourceLang);
  return results[0];
}

/**
 * Vider le cache de traduction
 */
export function clearTranslationCache(): void {
  memoryCache = {};
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CACHE_KEY);
  }
}
