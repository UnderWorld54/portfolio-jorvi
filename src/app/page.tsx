"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const HeroSection = dynamic(
  () =>
    import("@/components/home").then((mod) => ({ default: mod.HeroSection })),
  { loading: () => <div className="min-h-screen bg-black" />, ssr: true },
);

const AboutSection = dynamic(
  () =>
    import("@/components/home").then((mod) => ({ default: mod.AboutSection })),
  { loading: () => <div className="min-h-screen bg-black" />, ssr: true },
);

const PortfolioSection = dynamic(
  () =>
    import("@/components/home").then((mod) => ({
      default: mod.PortfolioSection,
    })),
  { loading: () => <div className="min-h-screen bg-black" />, ssr: true },
);

const CTASection = dynamic(
  () =>
    import("@/components/home").then((mod) => ({ default: mod.CTASection })),
  { loading: () => <div className="min-h-screen bg-black" />, ssr: true },
);

const SECTION_LABELS = ["Accueil", "À propos", "Portfolio", "Contact"];
const SECTIONS = [HeroSection, AboutSection, PortfolioSection, CTASection];

export default function Home() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const [activeSection, setActiveSection] = useState(0);

  const scrollToSection = useCallback((index: number) => {
    const section = sectionsRef.current[index];
    if (!section || isScrollingRef.current) return;
    isScrollingRef.current = true;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 900);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrollingRef.current) return;

    const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[];
    if (sections.length === 0) return;

    let currentIndex = 0;
    const viewportMiddle = window.innerHeight / 2;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
        currentIndex = index;
      }
    });

    const delta = e.deltaY;
    const threshold = 5;
    if (Math.abs(delta) < threshold) return;

    if (delta > 0 && currentIndex < sections.length - 1) {
      e.preventDefault();
      isScrollingRef.current = true;
      sections[currentIndex + 1].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 900);
    } else if (delta < 0 && currentIndex > 0) {
      e.preventDefault();
      isScrollingRef.current = true;
      sections[currentIndex - 1].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 900);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {SECTIONS.map((Section, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) sectionsRef.current[i] = el;
          }}
          className="min-h-screen"
        >
          <Section />
        </div>
      ))}

      {/* Dots de navigation */}
      <nav
        aria-label="Navigation entre sections"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4"
      >
        {SECTION_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => scrollToSection(i)}
            aria-label={label}
            aria-current={activeSection === i ? "true" : undefined}
            className="group relative flex items-center justify-center"
          >
            {/* Label au hover */}
            <span className="absolute right-8 px-2 py-1 rounded bg-white/10 backdrop-blur-sm text-white/80 text-xs whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
              {label}
            </span>

            {/* Dot */}
            <span className="relative flex items-center justify-center w-4 h-4">
              {activeSection === i && (
                <motion.span
                  layoutId="active-dot-ring"
                  className="absolute inset-0 rounded-full border border-red-500/60"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <motion.span
                animate={{
                  scale: activeSection === i ? 1 : 0.5,
                  backgroundColor:
                    activeSection === i
                      ? "rgb(239, 68, 68)"
                      : "rgba(255, 255, 255, 0.3)",
                }}
                transition={{ duration: 0.3 }}
                className="block w-2 h-2 rounded-full"
              />
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
