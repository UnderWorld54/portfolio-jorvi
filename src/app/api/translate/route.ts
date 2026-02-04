import { NextRequest, NextResponse } from 'next/server';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

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

// Cache en mémoire pour les traductions (évite les appels API répétés)
const translationCache = new Map<string, string>();

function getCacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text}`;
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

    if (!targetLang || !['FR', 'EN'].includes(targetLang)) {
      return NextResponse.json(
        { error: 'targetLang must be FR or EN' },
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
      const errorText = await response.text();
      console.error('DeepL API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Translation service error', details: errorText },
        { status: response.status }
      );
    }

    const data: DeepLResponse = await response.json();

    // Mettre en cache et construire les résultats
    data.translations.forEach((translation, i) => {
      const originalIndex = textsToTranslateIndices[i];
      const originalText = textsToTranslate[i];
      const translatedText = translation.text;

      // Mettre en cache
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
