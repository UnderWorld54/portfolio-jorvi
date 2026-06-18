"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  startTransition,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type Language = "FR" | "ENG";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Toujours initialiser avec "FR" pour éviter les différences d'hydratation
  // Le serveur et le client commencent avec la même valeur
  const [language, setLanguageState] = useState<Language>("FR");

  // Charger la langue depuis localStorage après l'hydratation (côté client uniquement)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language;
      if (savedLang === "FR" || savedLang === "ENG") {
        // Utiliser startTransition pour éviter les rendus en cascade
        // Synchronisation avec système externe (localStorage) - pattern recommandé
        startTransition(() => {
          setLanguageState(savedLang);
        });
      }
    }
  }, []);

  // Sauvegarder la langue dans localStorage quand elle change
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  // Fonction de traduction avec support des variables - memoize pour éviter les re-renders
  const t = useCallback(
    (key: string, variables?: Record<string, string>): string => {
      let translation = translations[language][key] || key;

      // Remplacer les variables {variable} par leurs valeurs
      if (variables) {
        Object.entries(variables).forEach(([varKey, varValue]) => {
          translation = translation.replace(
            new RegExp(`\\{${varKey}\\}`, "g"),
            varValue,
          );
        });
      }

      return translation;
    },
    [language],
  );

  // Memoize la valeur du context pour éviter les re-renders inutiles
  const contextValue = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Traductions
const translations: Record<Language, Record<string, string>> = {
  FR: {
    "nav.designs": "DESIGNS",
    "nav.covers": "COVERS",
    "nav.photos": "PHOTOS",
    "nav.contact": "CONTACT",
    "hero.title.line1": "VOTRE VISION",
    "hero.title.line2": "EN VISUEL",
    "hero.subtitle": "Créateur visuel • Designer • Artiste",
    "hero.cta": "Découvrir mon travail",
    "about.greeting": "Bonjour moi c'est",
    "about.title": "À PROPOS DE MOI",
    "about.subtitle":
      "Je suis un créateur visuel passionné, spécialisé dans le design graphique, la photographie et la direction artistique. Mon approche combine esthétique moderne et sensibilité artistique pour donner vie à vos projets.",
    "about.description":
      "Je suis un créateur visuel passionné, spécialisé dans le design graphique, la photographie et la direction artistique. Mon approche combine esthétique moderne et sensibilité artistique pour donner vie à vos projets.",
    "portfolio.title": "PORTFOLIO",
    "portfolio.subtitle": "Explorez mes créations",
    "portfolio.designs": "DESIGNS",
    "portfolio.designs.desc": "Logos, prints et vidéos",
    "portfolio.covers": "COVERS",
    "portfolio.covers.desc": "Pochette d'albums et visuels musicaux",
    "portfolio.photos": "PHOTOS",
    "portfolio.photos.desc": "Photographie artistique",
    "designs.title": "DESIGNS",
    "designs.logos": "LOGOS",
    "designs.logos.desc": "Identités visuelles uniques",
    "designs.prints": "PRINTS",
    "designs.prints.desc": "Créations imprimées",
    "designs.videos": "VIDÉOS",
    "designs.videos.desc": "Narratives visuelles",
    "cta.title": "PRÊT À CRÉER ENSEMBLE ?",
    "cta.subtitle": "Discutons de votre projet",
    "cta.contact.direct": "Contact Direct",
    "cta.social": "Réseaux Sociaux",
    "cta.phone": "Téléphone",
    "cta.phone.desc": "Appelez-moi",
    "cta.email": "Email",
    "cta.email.value": "Dezignby.j@gmail.com",
    "cta.email.desc": "Pour vos projets",
    "cta.linkedin": "LinkedIn",
    "cta.linkedin.desc": "Connectons-nous",
    "cta.instagram": "Instagram",
    "cta.instagram.desc": "Suivez mon travail",
    "cta.button": "Envoyer un message",
    "cta.more": "EN SAVOIR PLUS",
    "cta.cv": "MON CV",
    "about.page.title": "Designer Graphique & DA",
    "about.page.subtitle": "Créer du sens par le visuel",
    "about.page.intro":
      "Mon approche du design repose sur un équilibre entre rigueur technique et storytelling visuel. Issu d'un parcours complet en design graphique et numérique, j'accompagne les marques et les institutions dans la création d'identités fortes et de supports qui marquent les esprits.",
    "about.page.whatido.title": "Ce que je fais",
    "about.page.whatido.text":
      "Je ne me contente pas de créer des images ; je conçois des systèmes visuels cohérents. Mon expertise s'étend de la conception éditoriale et print à la communication digitale et vidéo (réseaux sociaux, motion design).",
    "about.page.howwork.title": "Comment je travaille",
    "about.page.howwork.vision.title": "Vision 360°",
    "about.page.howwork.vision.text":
      "Grâce à mes expériences en milieu institutionnel et dans l'enseignement supérieur, je sais adapter mon langage visuel à des publics variés tout en respectant des codes de marque.",
    "about.page.howwork.innovation.title": "Innovation",
    "about.page.howwork.innovation.text":
      "J'intègre les outils d'IA générative (Midjourney, Runway) à mon processus créatif pour explorer de nouveaux horizons visuels et optimiser la production.",
    "about.page.howwork.print.title": "Exigence Print",
    "about.page.howwork.print.text":
      "J'ai une affinité particulière pour le papier, le choix des supports et la précision millimétrée qu'impose l'édition.",
    "about.page.why.title": "Pourquoi moi ?",
    "about.page.why.text":
      "Parce que je crois que chaque projet est une histoire qui mérite d'être racontée avec justesse. Que ce soit pour une refonte globale de territoire de marque ou pour la création d'un magazine, je m'investis pleinement pour transformer une idée en un objet visuel tangible, esthétique et efficace.",
    "about.page.cta.contact": "Discuter d'un projet",
    "page.covers": "COVERS",
    "page.photos": "PHOTOS",
    "page.logos": "LOGOS",
    "page.prints": "PRINTS",
    "page.videos": "VIDÉOS",
    "message.noContent": "Pas de {type}s disponible",
    "message.noContent.soon": "Le contenu sera bientôt disponible.",
    "message.error.loading": "Erreur lors du chargement des {type}",
    "message.error.config":
      "Vérifiez votre configuration Strapi dans les variables d'environnement.",
    "message.category.notFound": "Catégorie non trouvée",
    "message.back": "Retour",
    "message.back.designs": "Retour aux designs",
    "content.type.cover": "cover",
    "content.type.photo": "photo",
    "content.type.logo": "logo",
    "content.type.print": "print",
    "content.type.video": "vidéo",
  },
  ENG: {
    "nav.designs": "DESIGNS",
    "nav.covers": "COVERS",
    "nav.photos": "PHOTOS",
    "nav.contact": "CONTACT",
    "hero.title.line1": "YOUR VISION",
    "hero.title.line2": "IN VISUAL",
    "hero.subtitle": "Visual Creator • Designer • Artist",
    "hero.cta": "Discover my work",
    "about.greeting": "Hello, it's me",
    "about.title": "ABOUT ME",
    "about.description":
      "I am a passionate visual creator, specializing in graphic design, photography and art direction. ",
    "portfolio.title": "PORTFOLIO",
    "portfolio.subtitle": "Explore my creations",
    "portfolio.designs": "DESIGNS",
    "portfolio.designs.desc": "Logos, prints and videos",
    "portfolio.covers": "COVERS",
    "portfolio.covers.desc": "Album cover and musical visuals",
    "portfolio.photos": "PHOTOS",
    "portfolio.photos.desc": "Artistic photography",
    "designs.title": "DESIGNS",
    "designs.logos": "LOGOS",
    "designs.logos.desc": "Unique visual identities",
    "designs.prints": "PRINTS",
    "designs.prints.desc": "Printed creations",
    "designs.videos": "VIDEOS",
    "designs.videos.desc": "Visual narratives",
    "cta.title": "READY TO CREATE TOGETHER?",
    "cta.subtitle": "Let's discuss your project",
    "cta.contact.direct": "Direct Contact",
    "cta.social": "Social Networks",
    "cta.email": "Email",
    "cta.email.value": "Dezignby.j@gmail.com",
    "cta.email.desc": "For your projects",
    "cta.phone": "Phone",
    "cta.phone.desc": "Call me",
    "cta.linkedin": "LinkedIn",
    "cta.linkedin.desc": "Let's connect",
    "cta.instagram": "Instagram",
    "cta.instagram.desc": "Follow my work",
    "cta.button": "Send a message",
    "cta.more": "KNOW MORE",
    "cta.cv": "MY RESUME",
    "about.page.title": "Graphic Designer & AD",
    "about.page.subtitle": "Creating meaning through visuals",
    "about.page.intro":
      "My design approach is based on a balance between technical rigor and visual storytelling. With a comprehensive background in graphic and digital design, I help brands and institutions create strong identities and materials that leave a lasting impression.",
    "about.page.whatido.title": "What I do",
    "about.page.whatido.text":
      "I don't just create images; I design coherent visual systems. My expertise spans from editorial and print design to digital and video communication (social media, motion design).",
    "about.page.howwork.title": "How I work",
    "about.page.howwork.vision.title": "360° Vision",
    "about.page.howwork.vision.text":
      "Thanks to my experience in institutional settings and higher education, I know how to adapt my visual language to diverse audiences while respecting brand guidelines.",
    "about.page.howwork.innovation.title": "Innovation",
    "about.page.howwork.innovation.text":
      "I integrate generative AI tools (Midjourney, Runway) into my creative process to explore new visual horizons and optimize production.",
    "about.page.howwork.print.title": "Print Excellence",
    "about.page.howwork.print.text":
      "I have a particular affinity for paper, material selection, and the millimeter precision that publishing demands.",
    "about.page.why.title": "Why me?",
    "about.page.why.text":
      "Because I believe every project is a story that deserves to be told with precision. Whether it's a complete brand territory overhaul or creating a magazine, I fully commit to transforming an idea into a tangible, aesthetic, and effective visual object.",
    "about.page.cta.contact": "Discuss a project",
    "page.covers": "COVERS",
    "page.photos": "PHOTOS",
    "page.logos": "LOGOS",
    "page.prints": "PRINTS",
    "page.videos": "VIDEOS",
    "message.noContent": "No {type} available",
    "message.noContent.soon": "Content will be available soon.",
    "message.error.loading": "Error loading {type}",
    "message.error.config":
      "Check your Strapi configuration in environment variables.",
    "message.category.notFound": "Category not found",
    "message.back": "Back",
    "message.back.designs": "Back to designs",
    "content.type.cover": "cover",
    "content.type.photo": "photo",
    "content.type.logo": "logo",
    "content.type.print": "print",
    "content.type.video": "video",
  },
};
