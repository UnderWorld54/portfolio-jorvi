"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Linkedin, Instagram, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CTASection() {
  const { t } = useLanguage();
  const contactEmail = "jorvikapela@gmail.com";
  const linkedinUrl = "https://www.linkedin.com/in/jorvi-kapela-178823189/";
  const instagramUrl = "https://www.instagram.com/vyjor/";
  const phoneNumber = "+33 6 XX XX XX XX"; // À remplacer par le vrai numéro

  const directContact = [
    {
      icon: Mail,
      label: t("cta.email"),
      value: contactEmail,
      href: `mailto:${contactEmail}`,
      description: t("cta.email.desc"),
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: phoneNumber,
      href: `tel:${phoneNumber.replace(/\s/g, "")}`,
      description: t("cta.phone.desc"),
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: t("cta.linkedin"),
      value: "Jorvi Kapela",
      href: linkedinUrl,
      description: t("cta.linkedin.desc"),
    },
    {
      icon: Instagram,
      label: t("cta.instagram"),
      value: "@vyjor",
      href: instagramUrl,
      description: t("cta.instagram.desc"),
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center py-20 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
      {/* Effets de fond décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* En-tête */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8"
            style={{ fontFamily: '"Great White Serif", serif' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            {t("cta.title")}
          </motion.h2>
          <motion.p
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("cta.subtitle")}
          </motion.p>
        </motion.div>

        {/* Section principale avec deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Contact direct */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center lg:text-left" style={{ fontFamily: '"Great White Serif", serif' }}>
              {t("cta.contact.direct")}
            </h3>
            <div className="space-y-4">
              {directContact.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    whileHover={{ x: 10, scale: 1.02 }}
                    className="group flex items-center gap-6 p-6 bg-black/30 border border-red-500/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 hover:bg-black/50"
                    style={{
                      boxShadow: "0 4px 20px rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    <div className="shrink-0 p-4 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <Icon
                        size={32}
                        className="text-red-500"
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-sm uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-white text-lg md:text-xl font-medium truncate">
                        {item.value}
                      </p>
                      <p className="text-white/40 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-red-500/50 group-hover:text-red-500 group-hover:translate-x-2 transition-all"
                    />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Réseaux sociaux */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center lg:text-left" style={{ fontFamily: '"Great White Serif", serif' }}>
              {t("cta.social")}
            </h3>
            <div className="space-y-4">
              {socialLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    whileHover={{ x: -10, scale: 1.02 }}
                    className="group flex items-center gap-6 p-6 bg-black/30 border border-red-500/20 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 hover:bg-black/50"
                    style={{
                      boxShadow: "0 4px 20px rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    <div className="shrink-0 p-4 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                      <Icon
                        size={32}
                        className="text-red-500"
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.6))",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/50 text-sm uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      <p className="text-white text-lg md:text-xl font-medium">
                        {item.value}
                      </p>
                      <p className="text-white/40 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-red-500/50 group-hover:text-red-500 group-hover:translate-x-2 transition-all"
                    />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bouton CTA principal centré */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Button
            href={`mailto:${contactEmail}`}
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            {t("cta.button")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

