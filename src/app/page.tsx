import {
  HeroSection,
  AboutSection,
  PortfolioSection,
  CTASection,
} from "@/components/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <CTASection />
    </div>
  );
}
