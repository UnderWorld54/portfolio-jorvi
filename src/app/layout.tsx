import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CursorProvider from "@/components/CursorProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ModalProvider } from "@/contexts/ModalContext";
import ImageModal from "@/components/ui/ImageModal";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Moins prioritaire
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-jorvi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jorvi Kapela - Créateur Visuel | Designer | Artiste",
    template: "%s | Jorvi Kapela",
  },
  description: "Portfolio de Jorvi Kapela, créateur visuel spécialisé en design graphique, photographie et direction artistique. Découvrez mes créations : logos, covers, photos et vidéos.",
  keywords: [
    "Jorvi Kapela",
    "designer",
    "photographe",
    "créateur visuel",
    "direction artistique",
    "portfolio",
    "graphic design",
    "logo design",
    "photography",
    "visual artist",
    "art direction",
    "branding",
  ],
  authors: [{ name: "Jorvi Kapela" }],
  creator: "Jorvi Kapela",
  publisher: "Jorvi Kapela",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "Jorvi Kapela Portfolio",
    title: "Jorvi Kapela - Créateur Visuel | Designer | Artiste",
    description: "Portfolio de Jorvi Kapela, créateur visuel spécialisé en design graphique, photographie et direction artistique. Découvrez mes créations : logos, covers, photos et vidéos.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Jorvi Kapela - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jorvi Kapela - Créateur Visuel | Designer | Artiste",
    description: "Portfolio de Jorvi Kapela, créateur visuel spécialisé en design graphique, photographie et direction artistique.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@vyjor",
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      "fr-FR": siteUrl,
      "en-US": `${siteUrl}?lang=en`,
    },
  },
  verification: {
    // Ajoutez vos clés de vérification si nécessaire
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  icons: {
    icon: [
      { url: "/logo/star.svg", type: "image/svg+xml" },
      { url: "/logo/star.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/logo/star.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo/star.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jorvi Kapela",
    jobTitle: "Créateur Visuel",
    description: "Créateur visuel spécialisé en design graphique, photographie et direction artistique",
    url: siteUrl,
    sameAs: [
      "https://www.linkedin.com/in/jorvi-kapela-178823189/",
      "https://www.instagram.com/vyjor/",
    ],
    email: "jorvikapela@gmail.com",
    knowsAbout: [
      "Graphic Design",
      "Photography",
      "Art Direction",
      "Logo Design",
      "Visual Arts",
    ],
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-500 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Aller au contenu principal"
        >
          Aller au contenu principal
        </a>
        <LanguageProvider>
          <ModalProvider>
            <CursorProvider />
            <Header />
            <main id="main-content">{children}</main>
            <ImageModal />
          </ModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
