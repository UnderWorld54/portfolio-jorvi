# Scripts de Traduction Automatique

Ce dossier contient des scripts pour améliorer automatiquement les traductions du portfolio.

## 🚀 Utilisation

### Méthode 1 : Google Translate (Gratuit, sans API key)

```bash
# Avec pnpm (recommandé pour ce projet)
pnpm translate

# Ou avec npm
npm run translate

# Ou directement avec Node.js
node scripts/translate.js
```

Cette méthode utilise l'API publique de Google Translate (gratuite mais avec des limites de taux).

### Méthode 2 : DeepL (Meilleure qualité, nécessite une clé API)

1. Obtenez une clé API gratuite sur [DeepL](https://www.deepl.com/pro-api)
2. Créez un fichier `.env.local` à la racine du projet :

```env
DEEPL_API_KEY=votre_cle_api_deepl
```

3. Exécutez le script :

```bash
pnpm translate
# ou
npm run translate
# ou
node scripts/translate.js
```

## 📋 Fonctionnalités

- ✅ Traduit automatiquement toutes les clés FR vers ENG
- ✅ Préserve les traductions existantes si elles sont identiques
- ✅ Crée un backup automatique avant modification
- ✅ Supporte les variables dans les traductions (ex: `{type}`)
- ✅ Gère les erreurs et continue même si une traduction échoue

## ⚙️ Configuration

Le script détecte automatiquement :
- Les clés à traduire (comparaison FR vs ENG)
- Les clés identiques (noms propres, etc.) qui ne nécessitent pas de traduction
- Les traductions manquantes

## 🔄 Processus

1. Le script lit le fichier `src/contexts/LanguageContext.tsx`
2. Extrait toutes les traductions FR
3. Compare avec les traductions ENG existantes
4. Traduit les clés manquantes ou différentes
5. Crée un backup du fichier original
6. Met à jour le fichier avec les nouvelles traductions

## 📝 Notes

- Le script respecte un délai de 500ms entre chaque traduction pour éviter de surcharger l'API
- Les traductions existantes sont préservées si elles sont identiques au texte source
- Un fichier `.backup` est créé avant chaque modification

## 🆘 Dépannage

**Erreur "DEEPL_API_KEY non configurée"**
- Le script utilisera automatiquement Google Translate en fallback
- Ou configurez votre clé DeepL dans `.env.local`

**Erreur de limite de taux**
- Attendez quelques minutes avant de réessayer
- Ou utilisez une clé API DeepL pour de meilleures limites

**Traductions de mauvaise qualité**
- Utilisez DeepL pour de meilleurs résultats
- Vérifiez et ajustez manuellement les traductions importantes

