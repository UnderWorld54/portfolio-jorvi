#!/usr/bin/env tsx

/**
 * Script de traduction automatique
 * 
 * Ce script améliore automatiquement les traductions en utilisant l'API DeepL ou Google Translate.
 * 
 * Usage:
 *   npm run translate
 *   ou
 *   pnpm translate
 * 
 * Variables d'environnement optionnelles:
 *   DEEPL_API_KEY - Clé API DeepL (recommandé pour meilleure qualité)
 *   GOOGLE_TRANSLATE_API_KEY - Clé API Google Translate (alternative)
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
type Language = "FR" | "ENG";
type Translations = Record<Language, Record<string, string>>;

// Configuration
const TRANSLATIONS_FILE = path.join(process.cwd(), 'src/contexts/LanguageContext.tsx');
const SOURCE_LANGUAGE = 'FR';
const TARGET_LANGUAGE = 'ENG';

/**
 * Fonction de traduction utilisant l'API DeepL (si disponible)
 */
async function translateWithDeepL(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPL_API_KEY non configurée. Utilisez une autre méthode.');
  }

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang === 'ENG' ? 'EN' : targetLang,
        source_lang: 'FR',
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Erreur DeepL:', error);
    throw error;
  }
}

/**
 * Fonction de traduction utilisant Google Translate (gratuit, sans API key)
 * Utilise l'API publique de Google Translate
 */
async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  try {
    const sourceLang = 'fr';
    const targetLangCode = targetLang === 'ENG' ? 'en' : targetLang.toLowerCase();
    
    // Utilisation de l'API publique de Google Translate (gratuite mais limitée)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0][0][0];
  } catch (error) {
    console.error('Erreur Google Translate:', error);
    throw error;
  }
}

/**
 * Fonction de traduction avec retry et fallback
 */
async function translateText(text: string, targetLang: string): Promise<string> {
  // Essayer DeepL d'abord si disponible
  if (process.env.DEEPL_API_KEY) {
    try {
      return await translateWithDeepL(text, targetLang);
    } catch (error) {
      console.warn('DeepL a échoué, passage à Google Translate...');
    }
  }

  // Fallback sur Google Translate
  try {
    return await translateWithGoogle(text, targetLang);
  } catch (error) {
    console.error('Toutes les méthodes de traduction ont échoué');
    throw error;
  }
}

/**
 * Extrait les traductions du fichier LanguageContext.tsx
 */
function extractTranslations(content: string): Translations {
  const translations: Translations = { FR: {}, ENG: {} };
  
  // Regex pour extraire les traductions FR
  const frRegex = /FR:\s*\{([\s\S]*?)\},/;
  const engRegex = /ENG:\s*\{([\s\S]*?)\},/;
  
  const frMatch = content.match(frRegex);
  const engMatch = content.match(engRegex);
  
  if (frMatch) {
    const frContent = frMatch[1];
    const keyValueRegex = /"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"/g;
    let match;
    while ((match = keyValueRegex.exec(frContent)) !== null) {
      translations.FR[match[1]] = match[2].replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }
  }
  
  if (engMatch) {
    const engContent = engMatch[1];
    const keyValueRegex = /"([^"]+)":\s*"([^"]*(?:\\.[^"]*)*)"/g;
    let match;
    while ((match = keyValueRegex.exec(engContent)) !== null) {
      translations.ENG[match[1]] = match[2].replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }
  }
  
  return translations;
}

/**
 * Génère le contenu du fichier avec les nouvelles traductions
 */
function generateFileContent(translations: Translations, originalContent: string): string {
  // Extraire la partie avant les traductions
  const beforeTranslations = originalContent.match(/^([\s\S]*?const translations:)/)?.[1] || '';
  
  // Formater les traductions FR
  const frEntries = Object.entries(translations.FR)
    .map(([key, value]) => {
      const escapedValue = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      return `    "${key}": "${escapedValue}"`;
    })
    .join(',\n');
  
  // Formater les traductions ENG
  const engEntries = Object.entries(translations.ENG)
    .map(([key, value]) => {
      const escapedValue = value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n');
      return `    "${key}": "${escapedValue}"`;
    })
    .join(',\n');
  
  // Reconstruire le fichier en préservant la structure originale
  const frSection = originalContent.match(/FR:\s*\{([\s\S]*?)\},/)?.[0] || '';
  const engSection = originalContent.match(/ENG:\s*\{([\s\S]*?)\},/)?.[0] || '';
  
  // Remplacer les sections de traduction
  let newContent = originalContent;
  
  // Remplacer la section FR
  if (frSection) {
    newContent = newContent.replace(
      /FR:\s*\{[\s\S]*?\},/,
      `FR: {\n${frEntries}\n  },`
    );
  }
  
  // Remplacer la section ENG
  if (engSection) {
    newContent = newContent.replace(
      /ENG:\s*\{[\s\S]*?\},/,
      `ENG: {\n${engEntries}\n  },`
    );
  }
  
  return newContent;
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de la traduction automatique...\n');

  // Lire le fichier actuel
  const content = fs.readFileSync(TRANSLATIONS_FILE, 'utf-8');
  const currentTranslations = extractTranslations(content);

  console.log(`📝 Traductions FR trouvées: ${Object.keys(currentTranslations.FR).length}`);
  console.log(`📝 Traductions ENG existantes: ${Object.keys(currentTranslations.ENG).length}\n`);

  // Identifier les clés à traduire ou à améliorer
  const keysToTranslate = Object.keys(currentTranslations.FR);
  const newTranslations: Translations = {
    FR: currentTranslations.FR,
    ENG: { ...currentTranslations.ENG },
  };

  console.log('🔄 Traduction en cours...\n');

  // Traduire chaque clé manquante ou améliorer les existantes
  for (let i = 0; i < keysToTranslate.length; i++) {
    const key = keysToTranslate[i];
    const frText = currentTranslations.FR[key];
    
    // Ignorer les clés qui sont identiques (comme les noms propres)
    if (frText === currentTranslations.ENG[key]) {
      console.log(`⏭️  [${i + 1}/${keysToTranslate.length}] Ignoré (identique): ${key}`);
      newTranslations.ENG[key] = currentTranslations.ENG[key] || frText;
      continue;
    }

    try {
      console.log(`🔄 [${i + 1}/${keysToTranslate.length}] Traduction de: ${key}`);
      const translated = await translateText(frText, TARGET_LANGUAGE);
      newTranslations.ENG[key] = translated;
      console.log(`✅ Traduit: "${frText.substring(0, 50)}..." → "${translated.substring(0, 50)}..."\n`);
      
      // Délai pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Erreur pour ${key}:`, error);
      // Garder la traduction existante si disponible
      newTranslations.ENG[key] = currentTranslations.ENG[key] || frText;
    }
  }

  // Générer le nouveau contenu
  const newContent = generateFileContent(newTranslations, content);

  // Sauvegarder
  const backupFile = TRANSLATIONS_FILE + '.backup';
  fs.writeFileSync(backupFile, content);
  console.log(`💾 Backup créé: ${backupFile}`);

  fs.writeFileSync(TRANSLATIONS_FILE, newContent);
  console.log(`✅ Fichier mis à jour: ${TRANSLATIONS_FILE}\n`);

  console.log('✨ Traduction terminée avec succès!');
}

// Exécuter le script
main().catch(console.error);

