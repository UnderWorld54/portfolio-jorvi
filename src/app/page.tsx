"use client";

import { useEffect, useRef, useCallback } from "react";
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

export default function Home() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);

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

  return (
    <div className="min-h-screen bg-black">
      {[HeroSection, AboutSection, PortfolioSection, CTASection].map(
        (Section, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) sectionsRef.current[i] = el;
            }}
            className="min-h-screen"
          >
            <Section />
          </div>
        ),
      )}
    </div>
  );
}
