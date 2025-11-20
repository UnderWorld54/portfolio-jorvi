"use client";

import { useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

// Lazy load des sections pour améliorer le First Contentful Paint
const HeroSection = dynamic(() => import("@/components/home").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="min-h-screen bg-black" />,
  ssr: true, // Garder le SSR pour le SEO
});

const AboutSection = dynamic(() => import("@/components/home").then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="min-h-screen bg-black" />,
  ssr: true,
});

const PortfolioSection = dynamic(() => import("@/components/home").then(mod => ({ default: mod.PortfolioSection })), {
  loading: () => <div className="min-h-screen bg-black" />,
  ssr: true,
});

const CTASection = dynamic(() => import("@/components/home").then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="min-h-screen bg-black" />,
  ssr: true,
});

export default function Home() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrollingRef.current) return;

    const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[];
    if (sections.length === 0) return;

    // Trouver la section actuellement visible
    let currentIndex = 0;
    const viewportMiddle = window.innerHeight / 2;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        currentIndex = index;
      }
    });

    const delta = e.deltaY;

    if (delta > 0 && currentIndex < sections.length - 1) {
      // Scroll vers le bas - aller à la section suivante
      e.preventDefault();
      isScrollingRef.current = true;
      sections[currentIndex + 1].scrollIntoView({ behavior: "smooth", block: "start" });
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    } else if (delta < 0 && currentIndex > 0) {
      // Scroll vers le haut - aller à la section précédente
      e.preventDefault();
      isScrollingRef.current = true;
      sections[currentIndex - 1].scrollIntoView({ behavior: "smooth", block: "start" });
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className="min-h-screen bg-black ">
      <div
        ref={(el) => {
          if (el) sectionsRef.current[0] = el;
        }}
        className="snap-start snap-always min-h-screen "
      >
        <HeroSection />
      </div>
      
      <div
        ref={(el) => {
          if (el) sectionsRef.current[1] = el;
        }}
        className="snap-start snap-always min-h-screen"
      >
        <AboutSection />
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[2] = el;
        }}
        className="snap-start snap-always min-h-screen"
      >
        <PortfolioSection />
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[3] = el;
        }}
        className="snap-start snap-always min-h-screen"
      >
        <CTASection />
      </div>
    </div>
  );
}
