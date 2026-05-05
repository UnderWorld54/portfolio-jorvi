"use client";

import { motion } from "framer-motion";
import { Eye, Sparkles, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import { useLanguage } from "@/contexts/LanguageContext";

const ease = [0.25, 0.1, 0.25, 1];

const methods = [
  {
    icon: Eye,
    titleKey: "about.page.howwork.vision.title",
    textKey: "about.page.howwork.vision.text",
  },
  {
    icon: Sparkles,
    titleKey: "about.page.howwork.innovation.title",
    textKey: "about.page.howwork.innovation.text",
  },
  {
    icon: BookOpen,
    titleKey: "about.page.howwork.print.title",
    textKey: "about.page.howwork.print.text",
  },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <PageContainer>
      <PageTitle title={t("about.page.title")} />

      <div className="max-w-4xl mx-auto">
        {/* Subtitle */}
        <motion.p
          className="text-center text-xl md:text-2xl text-white/50 -mt-4 mb-16 md:mb-24 tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          {t("about.page.subtitle")}
        </motion.p>

        {/* Intro */}
        <motion.p
          className="text-xl md:text-2xl text-white/90 leading-relaxed text-center mb-20 md:mb-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          {t("about.page.intro")}
        </motion.p>

        {/* Separator */}
        <motion.div
          className="flex items-center gap-4 mb-16 md:mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        </motion.div>

        {/* Ce que je fais */}
        <motion.div
          className="mb-20 md:mb-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {t("about.page.whatido.title")}
          </h2>
          <p className="text-lg md:text-xl text-white/75 leading-relaxed">
            {t("about.page.whatido.text")}
          </p>
        </motion.div>

        {/* Comment je travaille */}
        <motion.div
          className="mb-20 md:mb-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-10"
            style={{ fontFamily: '"Great White Serif", serif' }}
          >
            {t("about.page.howwork.title")}
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {methods.map((method, i) => (
              <motion.div
                key={method.titleKey}
                className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-colors duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                whileHover={{
                  boxShadow: "0 0 30px rgba(239, 68, 68, 0.08)",
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                  <method.icon size={20} className="text-red-500" />
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-3"
                  style={{ fontFamily: '"Great White Serif", serif' }}
                >
                  {t(method.titleKey)}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {t(method.textKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pourquoi moi */}
        <motion.div
          className="relative mb-20 md:mb-28 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5 pointer-events-none" />
          <div className="relative border border-red-500/20 rounded-2xl p-8 md:p-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: '"Great White Serif", serif' }}
            >
              {t("about.page.why.title")}
            </h2>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed">
              {t("about.page.why.text")}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
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
        </motion.div>
      </div>
    </PageContainer>
  );
}
