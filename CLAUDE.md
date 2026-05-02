# Portfolio Jorvi Kapela

Portfolio de créateur visuel construit avec Next.js 16, React 19, Tailwind CSS 4, et Strapi v5 comme CMS headless.

## Stack

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS 4, Framer Motion
- **CMS** : Strapi v5 (hébergé sur Strapi Cloud)
- **Traduction** : DeepL API (FR → EN côté client)
- **Icônes** : Lucide React
- **Déploiement** : Vercel
- **Police custom** : "Great White Serif" (chargée via `@font-face` dans `globals.css`)

## Architecture

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx            # Home — "use client", scroll section-par-section
│   ├── photos/page.tsx     # Server Component — fetch Strapi + ISR 1h
│   ├── covers/page.tsx     # Server Component — fetch Strapi + ISR 1h
│   ├── designs/page.tsx    # Server Component — fetch counts pour DesignsSection
│   ├── designs/[category]/ # Server Component — logos, prints, videos (generateStaticParams)
│   ├── about/page.tsx      # Client Component — contenu statique
│   └── api/                # Routes API (photos, covers, logos, prints, videos, translate)
├── components/
│   ├── gallery/            # GalleryContent — composant client réutilisable pour les galeries
│   ├── home/               # Sections de la home (Hero, About, Portfolio, CTA)
│   └── ui/                 # Composants UI réutilisables (ImageCard, ImageModal, grilles, etc.)
├── contexts/               # LanguageContext (FR/ENG), ModalContext (galerie d'images)
├── hooks/                  # useTranslatedContent, useCachedFetch, useImageLoader
└── lib/
    ├── strapi.ts           # Client Strapi — fetch générique + transform par collection
    └── translation.ts      # Client DeepL avec cache localStorage
```

## Patterns clés

### Data fetching

Les pages galerie (photos, covers, designs/\*) sont des **Server Components** qui fetchent Strapi directement via `lib/strapi.ts` et passent les données au composant client `GalleryContent`. ISR avec `revalidate = 3600`.

Les **API routes** (`/api/*`) existent encore pour le composant `StrapiWarmup` qui préchauffe Strapi en arrière-plan au chargement initial.

### `lib/strapi.ts`

Une seule fonction générique `fetchCollection<T>(collection, populate)` sert toutes les collections. Les fonctions convenience `getTransformed*()` combinent fetch + transform. Les types `StrapiPhoto`, `StrapiLogo`, `StrapiPrint` sont des alias de `StrapiSingleImageItem`. Seuls `StrapiVideo` (champ `link`) et `StrapiCover` (champ `images[]`) ont des types distincts.

### Traduction

Le contenu Strapi est en français. Quand l'utilisateur switch en ENG, `useTranslatedContent` envoie les textes à `/api/translate` (DeepL) et cache les résultats dans localStorage.

### Modal d'images

`ModalContext` gère l'état global de la modal. `ImageModal` (dans layout) écoute ce contexte. La navigation entre images utilise `AnimatePresence` avec un slide + crossfade directionnel.

## Commandes

```bash
npm run dev       # Serveur de développement
npm run build     # Build production
npm run start     # Serveur de production
npm run lint      # ESLint
```

## Variables d'environnement

Voir `.env.example`. Variables requises :

- `NEXT_PUBLIC_STRAPI_API_URL` — URL de l'instance Strapi
- `STRAPI_API_TOKEN` — Token API Strapi (server-side uniquement)
- `DEEPL_API_KEY` — Clé API DeepL pour la traduction

## Conventions

- Commits en anglais, concis
- Pas de commentaires sauf logique non évidente
- Pas d'abstractions prématurées
- Pages galerie = Server Components, interactivité = composants client enfants
- Couleurs : noir (`bg-black`), rouge (`red-500`), blanc avec opacité
- Toutes les polices décoratives utilisent `fontFamily: '"Great White Serif", serif'` en inline style
