import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CursorProvider from "@/components/CursorProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

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

export const metadata: Metadata = {
  title: "Jorvi Kapela - Créateur Visuel | Designer | Artiste",
  description: "Portfolio de Jorvi Kapela, créateur visuel spécialisé en design graphique, photographie et direction artistique. Découvrez mes créations : logos, covers, photos et vidéos.",
  keywords: ["designer", "photographe", "créateur visuel", "direction artistique", "portfolio", "graphic design"],
  authors: [{ name: "Jorvi Kapela" }],
  openGraph: {
    title: "Jorvi Kapela - Créateur Visuel",
    description: "Portfolio de Jorvi Kapela, créateur visuel spécialisé en design graphique, photographie et direction artistique.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <CursorProvider />
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
