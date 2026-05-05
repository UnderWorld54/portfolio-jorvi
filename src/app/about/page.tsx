"use client";

import Button from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import { useLanguage } from "@/contexts/LanguageContext";

const workMethods = [
  {
    titleKey: "about.page.howwork.vision.title",
    textKey: "about.page.howwork.vision.text",
  },
  {
    titleKey: "about.page.howwork.innovation.title",
    textKey: "about.page.howwork.innovation.text",
  },
  {
    titleKey: "about.page.howwork.print.title",
    textKey: "about.page.howwork.print.text",
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <PageTitle title={t("about.page.title")} />

      <div className="max-w-3xl mx-auto space-y-12 text-white/85 text-lg leading-relaxed">
        <p className="text-xl md:text-2xl text-white/60 text-center">
          {t("about.page.subtitle")}
        </p>

        <p>{t("about.page.intro")}</p>

        <div className="space-y-4">
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {t("about.page.whatido.title")}
          </h2>
          <p>{t("about.page.whatido.text")}</p>
        </div>

        <div className="space-y-6">
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {t("about.page.howwork.title")}
          </h2>
          {workMethods.map((method) => (
            <div
              key={method.titleKey}
              className="border-l-2 border-red-500 pl-5 space-y-1"
            >
              <h3 className="text-xl font-semibold text-white">
                {t(method.titleKey)}
              </h3>
              <p>{t(method.textKey)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2
            className="text-2xl md:text-3xl font-bold text-white"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {t("about.page.why.title")}
          </h2>
          <p>{t("about.page.why.text")}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button href="/CV.pdf" variant="primary" size="md" download>
            {t("cta.cv")}
          </Button>
          <Button
            href="mailto:Dezignby.j@gmail.com"
            variant="outline"
            size="md"
          >
            {t("about.page.cta.contact")}
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
