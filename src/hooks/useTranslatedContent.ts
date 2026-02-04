"use client";

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateTexts } from '@/lib/translation';

/**
 * Hook pour traduire automatiquement le contenu dynamique (Strapi)
 * Traduit les champs description, artist et projectName
 */
export function useTranslatedContent<T extends { id: string; description?: string; artist?: string; projectName?: string }>(
  items: T[],
  sourceLang: 'FR' | 'ENG' = 'FR'
): { translatedItems: T[]; isTranslating: boolean } {
  const { language } = useLanguage();
  const [translatedItems, setTranslatedItems] = useState<T[]>(items);
  const [isTranslating, setIsTranslating] = useState(false);
  const prevItemsRef = useRef<T[]>([]);
  const prevLanguageRef = useRef<string>(language);

  useEffect(() => {
    // Toujours mettre à jour les refs pour tracker les changements
    const itemsChanged = JSON.stringify(items) !== JSON.stringify(prevItemsRef.current);
    const languageChanged = language !== prevLanguageRef.current;

    prevItemsRef.current = items;
    prevLanguageRef.current = language;

    // Si la langue source est la même que la langue cible, pas besoin de traduire
    if (language === sourceLang) {
      setTranslatedItems(items);
      return;
    }

    if (!itemsChanged && !languageChanged) {
      return;
    }

    // Si pas d'items, rien à traduire
    if (items.length === 0) {
      setTranslatedItems([]);
      return;
    }

    const translateContent = async () => {
      setIsTranslating(true);

      try {
        // Collecter tous les textes à traduire
        const textsToTranslate: string[] = [];
        const textMappings: { itemIndex: number; field: string }[] = [];

        items.forEach((item, itemIndex) => {
          if (item.description) {
            textsToTranslate.push(item.description);
            textMappings.push({ itemIndex, field: 'description' });
          }
          if (item.artist) {
            textsToTranslate.push(item.artist);
            textMappings.push({ itemIndex, field: 'artist' });
          }
          if (item.projectName) {
            textsToTranslate.push(item.projectName);
            textMappings.push({ itemIndex, field: 'projectName' });
          }
        });

        // Si rien à traduire, retourner les items originaux
        if (textsToTranslate.length === 0) {
          setTranslatedItems(items);
          setIsTranslating(false);
          return;
        }

        // Traduire tous les textes en une seule requête
        const translatedTexts = await translateTexts(
          textsToTranslate,
          language,
          sourceLang
        );

        // Reconstruire les items avec les traductions
        const newItems = items.map(item => ({ ...item }));

        textMappings.forEach((mapping, index) => {
          const translatedText = translatedTexts[index];
          if (translatedText) {
            (newItems[mapping.itemIndex] as Record<string, unknown>)[mapping.field] = translatedText;
          }
        });

        setTranslatedItems(newItems);
      } catch (error) {
        console.error('Error translating content:', error);
        // En cas d'erreur, garder les items originaux
        setTranslatedItems(items);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [items, language, sourceLang]);

  return { translatedItems, isTranslating };
}

/**
 * Hook pour traduire un seul texte
 */
export function useTranslatedText(
  text: string | undefined,
  sourceLang: 'FR' | 'ENG' = 'FR'
): { translatedText: string | undefined; isTranslating: boolean } {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string | undefined>(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!text || language === sourceLang) {
      setTranslatedText(text);
      return;
    }

    const translate = async () => {
      setIsTranslating(true);
      try {
        const [result] = await translateTexts([text], language, sourceLang);
        setTranslatedText(result);
      } catch (error) {
        console.error('Error translating text:', error);
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [text, language, sourceLang]);

  return { translatedText, isTranslating };
}
