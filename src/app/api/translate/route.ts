import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

const MAX_TEXTS = 200;
const MAX_CACHE_ENTRIES = 2000;
const ALLOWED_TEXTS_TTL = 60 * 60 * 1000;

interface TranslateRequest {
  texts: string[];
  targetLang: 'FR' | 'EN';
  sourceLang?: 'FR' | 'EN';
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

const translationCache = new Map<string, string>();

function getCacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text}`;
}

/**
 * Seuls les textes réellement publiés sur le site sont traduisibles : sans cette
 * restriction, la route serait un proxy DeepL ouvert et le quota épuisable par
 * n'importe qui.
 */
let allowedTexts: Set<string> | null = null;
let allowedTextsFetchedAt = 0;

async function getAllowedTexts(force = false): Promise<Set<string>> {
  const isFresh = Date.now() - allowedTextsFetchedAt < ALLOWED_TEXTS_TTL;
  if (allowedTexts && isFresh && !force) {
    return allowedTexts;
  }

  const docs = await client.fetch<
    { artist?: string; projectName?: string; description?: string }[]
  >(`*[_type in ["cover","photo","logo","print","video"]]{artist,projectName,description}`);

  allowedTexts = new Set(
    docs
      .flatMap((doc) => [doc.artist, doc.projectName, doc.description])
      .filter((text): text is string => typeof text === 'string')
      .map((text) => text.trim())
  );
  allowedTextsFetchedAt = Date.now();

  return allowedTexts;
}

async function findUnknownText(texts: string[]): Promise<string | undefined> {
  const isUnknown = (allowed: Set<string>) => (text: string) =>
    !allowed.has(text.trim());

  const allowed = await getAllowedTexts();
  const unknown = texts.find(isUnknown(allowed));
  if (!unknown) return undefined;

  // Le contenu vient peut-être d'être publié : on revérifie avant de rejeter.
  const refreshed = await getAllowedTexts(true);
  return texts.find(isUnknown(refreshed));
}

export async function POST(request: NextRequest) {
  try {
    if (!DEEPL_API_KEY) {
      console.warn('DEEPL_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Translation service not configured' },
        { status: 503 }
      );
    }

    const body: TranslateRequest = await request.json();
    const { texts, targetLang, sourceLang } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'texts array is required' },
        { status: 400 }
      );
    }

    if (texts.length > MAX_TEXTS) {
      return NextResponse.json(
        { error: `texts array must contain at most ${MAX_TEXTS} entries` },
        { status: 400 }
      );
    }

    if (!texts.every((text) => typeof text === 'string')) {
      return NextResponse.json(
        { error: 'texts must only contain strings' },
        { status: 400 }
      );
    }

    if (!targetLang || !['FR', 'EN'].includes(targetLang)) {
      return NextResponse.json(
        { error: 'targetLang must be FR or EN' },
        { status: 400 }
      );
    }

    if (await findUnknownText(texts)) {
      return NextResponse.json(
        { error: 'Only published site content can be translated' },
        { status: 400 }
      );
    }

    // Vérifier le cache pour chaque texte
    const results: string[] = [];
    const textsToTranslate: string[] = [];
    const textsToTranslateIndices: number[] = [];

    texts.forEach((text, index) => {
      const cacheKey = getCacheKey(text, targetLang);
      const cached = translationCache.get(cacheKey);

      if (cached) {
        results[index] = cached;
      } else {
        textsToTranslate.push(text);
        textsToTranslateIndices.push(index);
      }
    });

    // Si tous les textes sont en cache, retourner directement
    if (textsToTranslate.length === 0) {
      return NextResponse.json({ translations: results });
    }

    // Appeler DeepL pour les textes non cachés
    const formData = new URLSearchParams();
    textsToTranslate.forEach(text => formData.append('text', text));
    formData.append('target_lang', targetLang);
    if (sourceLang) {
      formData.append('source_lang', sourceLang);
    }

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error('DeepL API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Translation service error' },
        { status: response.status }
      );
    }

    const data: DeepLResponse = await response.json();

    if (translationCache.size > MAX_CACHE_ENTRIES) {
      translationCache.clear();
    }

    // Mettre en cache et construire les résultats
    data.translations.forEach((translation, i) => {
      const originalIndex = textsToTranslateIndices[i];
      const originalText = textsToTranslate[i];
      const translatedText = translation.text;

      translationCache.set(getCacheKey(originalText, targetLang), translatedText);

      results[originalIndex] = translatedText;
    });

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
