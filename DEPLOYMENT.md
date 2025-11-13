# Guide de Déploiement en Production

Ce guide explique comment déployer votre portfolio avec Strapi en production.

## 📋 Prérequis

- Un compte Strapi Cloud (ou votre propre serveur Strapi)
- Un service d'hébergement pour Next.js (Vercel, Netlify, etc.)
- Votre projet Strapi configuré et accessible publiquement

## 🔧 Configuration pour la Production

### 1. Configuration Next.js

La configuration actuelle dans `next.config.ts` est **déjà optimisée pour la production** :

- ✅ L'optimisation d'images est **automatiquement activée** en production
- ✅ Les domaines Strapi Cloud sont déjà autorisés (`**.strapi.cloud`, `**.strapi.app`)
- ✅ Le localhost n'est utilisé qu'en développement

**Aucune modification nécessaire** dans `next.config.ts` pour la production.

### 2. Variables d'Environnement en Production

#### Sur Vercel (recommandé)

1. Allez dans votre projet sur [Vercel](https://vercel.com)
2. Cliquez sur **Settings** > **Environment Variables**
3. Ajoutez les variables suivantes :

```env
NEXT_PUBLIC_STRAPI_API_URL=https://votre-projet.strapi.cloud
STRAPI_API_TOKEN=votre-token-api-strapi
```

#### Sur Netlify

1. Allez dans votre projet sur [Netlify](https://netlify.com)
2. Cliquez sur **Site settings** > **Environment variables**
3. Ajoutez les mêmes variables que ci-dessus

#### Sur d'autres plateformes

Configurez les variables d'environnement selon la documentation de votre plateforme d'hébergement.

### 3. Configuration Strapi Cloud

#### Étape 1 : Déployer votre Strapi

1. Connectez-vous à [Strapi Cloud](https://cloud.strapi.io/)
2. Créez un nouveau projet ou importez votre projet local
3. Attendez que le déploiement soit terminé
4. Notez l'URL de votre projet (ex: `https://votre-projet.strapi.cloud`)

#### Étape 2 : Configurer les Permissions

1. Accédez à l'admin de votre Strapi Cloud
2. Allez dans **Settings** > **Users & Permissions plugin** > **Roles** > **Public**
3. Cochez les permissions pour **Photo** :
   - ✅ `find`
   - ✅ `findOne`

#### Étape 3 : Créer un Token API (Recommandé)

1. Allez dans **Settings** > **API Tokens**
2. Créez un nouveau token :
   - **Name** : `Portfolio Production`
   - **Token duration** : `Unlimited`
   - **Token type** : `Read-only`
3. Copiez le token et ajoutez-le dans les variables d'environnement de votre plateforme

#### Étape 4 : Migrer vos Données

Si vous avez des données en localhost :

1. **Option 1 : Export/Import** (si disponible dans votre version de Strapi)
   - Exportez depuis localhost
   - Importez dans Strapi Cloud

2. **Option 2 : Recréer manuellement**
   - Recréez vos photos dans Strapi Cloud
   - Uploadez les images

3. **Option 3 : Utiliser une base de données partagée**
   - Configurez Strapi Cloud pour utiliser la même base de données que votre localhost (avancé)

### 4. Vérifications Avant le Déploiement

#### ✅ Checklist

- [ ] Strapi Cloud est déployé et accessible
- [ ] Les permissions API sont configurées (Public > Photo > find, findOne)
- [ ] Au moins une photo est publiée dans Strapi Cloud
- [ ] Les variables d'environnement sont configurées sur votre plateforme d'hébergement
- [ ] L'URL de l'API Strapi est correcte (testez dans le navigateur)
- [ ] Les images sont accessibles publiquement (testez une URL d'image)

#### Test de l'API Strapi

Testez cette URL dans votre navigateur :
```
https://votre-projet.strapi.cloud/api/photos?populate=*
```

Vous devriez voir un JSON avec vos photos et leurs images.

#### Test des Images

Testez une URL d'image directement :
```
https://votre-projet.strapi.cloud/uploads/nom-de-l-image.jpg
```

L'image devrait s'afficher dans le navigateur.

### 5. Déploiement Next.js

#### Sur Vercel (Recommandé)

1. **Via GitHub/GitLab** :
   - Connectez votre repository à Vercel
   - Vercel détectera automatiquement Next.js
   - Ajoutez les variables d'environnement dans les paramètres
   - Déployez

2. **Via CLI** :
   ```bash
   npm i -g vercel
   vercel
   ```
   - Suivez les instructions
   - Ajoutez les variables d'environnement quand demandé

#### Sur Netlify

1. Connectez votre repository
2. Configurez le build :
   - **Build command** : `npm run build` ou `pnpm build`
   - **Publish directory** : `.next`
3. Ajoutez les variables d'environnement
4. Déployez

### 6. Après le Déploiement

#### Vérifications Post-Déploiement

1. **Testez la page photos** :
   - Allez sur `https://votre-site.com/photos`
   - Vérifiez que les photos s'affichent

2. **Vérifiez les images** :
   - Ouvrez les outils de développement (F12)
   - Onglet Network > Images
   - Vérifiez qu'aucune erreur 404 n'apparaît

3. **Testez l'API** :
   - Allez sur `https://votre-site.com/api/photos`
   - Vérifiez que les données sont retournées

#### Problèmes Courants

**Les images ne s'affichent pas :**
- Vérifiez que le domaine Strapi est bien autorisé dans `next.config.ts`
- Vérifiez que les images sont accessibles publiquement depuis Strapi
- Vérifiez les logs de votre plateforme d'hébergement

**Erreur 403 sur l'API :**
- Vérifiez les permissions dans Strapi (Public > Photo)
- Vérifiez que le token API est correct si vous en utilisez un

**Les données ne se chargent pas :**
- Vérifiez que `NEXT_PUBLIC_STRAPI_API_URL` est bien configuré
- Vérifiez que l'URL est accessible depuis votre plateforme d'hébergement
- Vérifiez les logs serveur pour voir les erreurs

## 🔄 Différences Dev vs Prod

| Aspect | Développement | Production |
|--------|--------------|------------|
| **URL Strapi** | `http://localhost:1337` | `https://votre-projet.strapi.cloud` |
| **Optimisation images** | Désactivée (`unoptimized: true`) | Activée automatiquement |
| **Cache** | Pas de cache | Cache activé (1h) |
| **Variables d'env** | `.env.local` | Variables de la plateforme |

## 📝 Notes Importantes

- ⚠️ **Ne commitez jamais** vos variables d'environnement dans Git
- 🔒 Le token API est utilisé uniquement côté serveur (sécurisé)
- 🖼️ Les images sont optimisées automatiquement en production par Next.js
- 🚀 L'optimisation d'images améliore les performances et réduit la bande passante

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de votre plateforme d'hébergement
2. Vérifiez les logs de Strapi Cloud
3. Testez l'API Strapi directement dans le navigateur
4. Consultez la documentation de votre plateforme d'hébergement

