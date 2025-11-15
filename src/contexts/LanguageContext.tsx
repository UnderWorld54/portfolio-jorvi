"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "FR" | "ENG";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialisation paresseuse : lire depuis localStorage une seule fois à l'initialisation
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("language") as Language;
      if (savedLang === "FR" || savedLang === "ENG") {
        return savedLang;
      }
    }
    return "FR";
  });

  // Sauvegarder la langue dans localStorage quand elle change
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  // Fonction de traduction avec support des variables
  const t = (key: string, variables?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    
    // Remplacer les variables {variable} par leurs valeurs
    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        translation = translation.replace(new RegExp(`\\{${varKey}\\}`, 'g'), varValue);
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
    // Navigation
    "nav.designs": "DESIGNS",
    "nav.covers": "COVERS",
    "nav.photos": "PHOTOS",
    "nav.contact": "CONTACT",
    
    // Hero Section
    "hero.title.line1": "VOTRE VISION",
    "hero.title.line2": "EN VISUEL",
    "hero.subtitle": "Créateur visuel • Designer • Artiste",
    "hero.cta": "Découvrir mon travail",
    
    // About Section
    "about.greeting": "Bonjour moi c'est",
    "about.description": "Je suis un créateur visuel passionné, spécialisé dans le design graphique, la photographie et la direction artistique. Mon approche combine esthétique moderne et sensibilité artistique pour donner vie à vos projets.",
    
    // Portfolio Section
    "portfolio.title": "PORTFOLIO",
    "portfolio.subtitle": "Explorez mes créations",
    "portfolio.designs": "DESIGNS",
    "portfolio.designs.desc": "Logos, prints et vidéos",
    "portfolio.covers": "COVERS",
    "portfolio.covers.desc": "Pochette d'albums et visuels musicaux",
    "portfolio.photos": "PHOTOS",
    "portfolio.photos.desc": "Photographie artistique",
    
    // Designs Section
    "designs.title": "DESIGNS",
    "designs.logos": "LOGOS",
    "designs.logos.desc": "Identités visuelles uniques",
    "designs.prints": "PRINTS",
    "designs.prints.desc": "Créations imprimées",
    "designs.videos": "VIDÉOS",
    "designs.videos.desc": "Narratives visuelles",
    
    // CTA Section
    "cta.title": "PRÊT À CRÉER ENSEMBLE ?",
    "cta.subtitle": "Discutons de votre projet",
    "cta.contact.direct": "Contact Direct",
    "cta.social": "Réseaux Sociaux",
    "cta.phone": "Téléphone",
    "cta.phone.desc": "Appelez-moi",
    "cta.email": "Email",
    "cta.email.value": "jorvikapela@gmail.com",
    "cta.email.desc": "Pour vos projets",
    "cta.linkedin": "LinkedIn",
    "cta.linkedin.desc": "Connectons-nous",
    "cta.instagram": "Instagram",
    "cta.instagram.desc": "Suivez mon travail",
    "cta.button": "Envoyer un message",
    
    // Pages
    "page.covers": "COVERS",
    "page.photos": "PHOTOS",
    "page.logos": "LOGOS",
    "page.prints": "PRINTS",
    "page.videos": "VIDÉOS",
    
    // Messages
    "message.noContent": "Aucun {type} disponible",
    "message.noContent.soon": "Le contenu sera bientôt disponible.",
    "message.error.loading": "Erreur lors du chargement des {type}",
    "message.error.config": "Vérifiez votre configuration Strapi dans les variables d'environnement.",
    "message.category.notFound": "Catégorie non trouvée",
    "message.back": "Retour",
    "message.back.designs": "Retour aux designs",
    
    // Types de contenu
    "content.type.cover": "cover",
    "content.type.photo": "photo",
    "content.type.logo": "logo",
    "content.type.print": "print",
    "content.type.video": "vidéo",
  },
  ENG: {
    // Navigation
    "nav.designs": "DESIGNS",
    "nav.covers": "COVERS",
    "nav.photos": "PHOTOS",
    "nav.contact": "CONTACT",
    
    // Hero Section
    "hero.title.line1": "YOUR VISION",
    "hero.title.line2": "IN VISUAL",
    "hero.subtitle": "Visual Creator • Designer • Artist",
    "hero.cta": "Discover my work",
    
    // About Section
    "about.greeting": "Hello, I'm",
    "about.description": "I am a passionate visual creator, specialized in graphic design, photography and art direction. My approach combines modern aesthetics and artistic sensibility to bring your projects to life.",
    
    // Portfolio Section
    "portfolio.title": "PORTFOLIO",
    "portfolio.subtitle": "Explore my creations",
    "portfolio.designs": "DESIGNS",
    "portfolio.designs.desc": "Logos, prints and videos",
    "portfolio.covers": "COVERS",
    "portfolio.covers.desc": "Album covers and music visuals",
    "portfolio.photos": "PHOTOS",
    "portfolio.photos.desc": "Artistic photography",
    
    // Designs Section
    "designs.title": "DESIGNS",
    "designs.logos": "LOGOS",
    "designs.logos.desc": "Unique visual identities",
    "designs.prints": "PRINTS",
    "designs.prints.desc": "Printed creations",
    "designs.videos": "VIDEOS",
    "designs.videos.desc": "Visual narratives",
    
    // CTA Section
    "cta.title": "READY TO CREATE TOGETHER?",
    "cta.subtitle": "Let's discuss your project",
    "cta.contact.direct": "Direct Contact",
    "cta.social": "Social Networks",
    "cta.email": "Email",
    "cta.email.value": "jorvikapela@gmail.com",
    "cta.email.desc": "Response within 24h",
    "cta.phone": "Phone",
    "cta.phone.desc": "Call me",
    "cta.linkedin": "LinkedIn",
    "cta.linkedin.desc": "Let's connect",
    "cta.instagram": "Instagram",
    "cta.instagram.desc": "Follow my work",
    "cta.button": "Send a message",
    
    // Pages
    "page.covers": "COVERS",
    "page.photos": "PHOTOS",
    "page.logos": "LOGOS",
    "page.prints": "PRINTS",
    "page.videos": "VIDEOS",
    
    // Messages
    "message.noContent": "No {type} available",
    "message.noContent.soon": "Content will be available soon.",
    "message.error.loading": "Error loading {type}",
    "message.error.config": "Check your Strapi configuration in environment variables.",
    "message.category.notFound": "Category not found",
    "message.back": "Back",
    "message.back.designs": "Back to designs",
    
    // Types de contenu
    "content.type.cover": "cover",
    "content.type.photo": "photo",
    "content.type.logo": "logo",
    "content.type.print": "print",
    "content.type.video": "video",
  },
};

