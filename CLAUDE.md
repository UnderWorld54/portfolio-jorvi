# Portfolio Jorvi Kapela

Portfolio de créateur visuel construit avec Next.js 16, React 19, Tailwind CSS 4, et Sanity comme CMS headless.

## Stack

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS 4, Framer Motion
- **CMS** : Sanity (Studio embarqué sur `/studio`)
- **Traduction** : DeepL API (FR → EN côté client)
- **Icônes** : Lucide React
- **Déploiement** : Vercel
- **Police custom** : "Great White Serif" (chargée via `@font-face` dans `globals.css`)

## Architecture

```
src/
├── app/
│   ├── (site)/             # Root layout du site (Header, Footer, curseur, contextes)
│   │   ├── page.tsx        # Home — "use client", scroll section-par-section
│   │   ├── photos/page.tsx     # Server Component — fetch Sanity + ISR 1h
│   │   ├── covers/page.tsx     # Server Component — fetch Sanity + ISR 1h
│   │   ├── designs/page.tsx    # Server Component — fetch counts pour DesignsSection
│   │   ├── designs/[category]/ # Server Component — logos, prints, videos (generateStaticParams)
│   │   └── about/page.tsx      # Client Component — contenu statique
│   ├── (studio)/           # Root layout séparé — Sanity Studio sur /studio
│   └── api/                # Routes API (photos, covers, logos, prints, videos, translate)
├── components/
│   ├── gallery/            # GalleryContent — composant client réutilisable pour les galeries
│   ├── home/               # Sections de la home (Hero, About, Portfolio, CTA)
│   └── ui/                 # Composants UI réutilisables (ImageCard, ImageModal, grilles, etc.)
├── contexts/               # LanguageContext (FR/ENG), ModalContext (galerie d'images)
├── hooks/                  # useTranslatedContent, useCachedFetch, useImageLoader
└── lib/
    ├── sanity.ts           # Client Sanity — requêtes GROQ par collection
    └── translation.ts      # Client DeepL avec cache localStorage

sanity/
├── env.ts                  # projectId, dataset, apiVersion
└── schemas/                # cover, photo, logo, print, video (+ fields.ts partagé)
sanity.config.ts            # Config du Studio
scripts/import-to-sanity.mjs  # Import ponctuel du dump Strapi (migration)
```

Le site et le Studio ont **deux root layouts distincts** (route groups `(site)` et
`(studio)`) : le Studio ne doit hériter ni du Header/Footer ni du curseur custom.

## Patterns clés

### Data fetching

Les pages galerie (photos, covers, designs/\*) sont des **Server Components** qui fetchent Sanity directement via `lib/sanity.ts` et passent les données au composant client `GalleryContent`. ISR avec `revalidate = 3600`.

Les **API routes** (`/api/*`) exposent les mêmes données en JSON mais ne sont plus
appelées par le site (elles servaient au préchauffage de Strapi Cloud).

### `lib/sanity.ts`

`getCovers`, `getPhotos`, `getLogos`, `getPrints`, `getVideos` renvoient toutes des
`GalleryItem[]` prêts à l'affichage (forme identique à `ImageCardData`) — la mise en
forme est faite en GROQ, il n'y a pas d'étape de transformation séparée.

`cover`, `logo` et `print` partagent la même requête multi-images (`images[]`, avec
`image` = première image). `photo` a une image unique. `video` retombe sur la
miniature YouTube quand aucune vignette n'est renseignée.

L'ordre d'affichage est piloté par le champ `publishedAt` de chaque document
(le plus récent d'abord), modifiable dans le Studio.

### Traduction

Le contenu Sanity est en français. Quand l'utilisateur switch en ENG, `useTranslatedContent` envoie les textes à `/api/translate` (DeepL) et cache les résultats dans localStorage.

### Modal d'images

`ModalContext` gère l'état global de la modal. `ImageModal` (dans layout) écoute ce contexte. La navigation entre images utilise `AnimatePresence` avec un slide + crossfade directionnel.

## Commandes

```bash
npm run dev       # Serveur de développement
npm run build     # Build production
npm run start     # Serveur de production
npm run lint      # ESLint
```

Le Sanity Studio est servi par le site lui-même sur `/studio` (aucun serveur à lancer à part `npm run dev`).

## Variables d'environnement

Voir `.env.example`. Variables requises :

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — ID du projet Sanity
- `NEXT_PUBLIC_SANITY_DATASET` — Dataset Sanity (`production`)
- `DEEPL_API_KEY` — Clé API DeepL pour la traduction
- `SANITY_API_WRITE_TOKEN` — Token d'écriture, uniquement pour `npm run import:sanity` (pas nécessaire en production)

## Conventions

- Commits en anglais, concis
- Pas de commentaires sauf logique non évidente
- Pas d'abstractions prématurées
- Pages galerie = Server Components, interactivité = composants client enfants
- Couleurs : noir (`bg-black`), rouge (`red-500`), blanc avec opacité
- Toutes les polices décoratives utilisent `fontFamily: '"Great White Serif", serif'` en inline style
