"use client";

import Button from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import { useLanguage } from "@/contexts/LanguageContext";

const content = {
  FR: {
    title: "about.page.title",
    subtitle: "about.page.subtitle",
    paragraphs: ["about.page.p1", "about.page.p2", "about.page.p3"],
    highlights: [
      "Direction artistique et identités visuelles",
      "Photographie et retouche créative",
      "Motion design & storytelling visuel",
    ],
  },
  ENG: {
    title: "about.page.title",
    subtitle: "about.page.subtitle",
    paragraphs: ["about.page.p1", "about.page.p2", "about.page.p3"],
    highlights: [
      "Art direction and visual identities",
      "Photography and creative retouching",
      "Motion design & visual storytelling",
    ],
  },
} as const;

export default function AboutPage() {
  const { language, t } = useLanguage();
  const { title, subtitle, paragraphs, highlights } = content[language];

  return (
    <PageContainer>
      <PageTitle title={t(title)} />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
        <div className="space-y-6 text-white/85 text-lg leading-relaxed">
          <p className="text-xl md:text-2xl text-white">{t(subtitle)}</p>
          {paragraphs.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)] space-y-5">
          <h3
            className="text-2xl font-semibold text-white"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {language === "ENG" ? "Focus" : "Points clés"}
          </h3>
          <ul className="space-y-3 text-white/80">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 flex flex-wrap gap-3">
            <Button href="/CV.pdf" variant="primary" size="md" download>
              {t("cta.cv")}
            </Button>
            <Button href="mailto:Dezignby.j@gmail.com" variant="outline" size="md">
              {t("about.page.cta.contact")}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

