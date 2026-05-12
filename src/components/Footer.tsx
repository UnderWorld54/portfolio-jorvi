"use client";

import { Linkedin, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname === "/") return null;

  const navLinks = [
    { label: t("nav.designs"), href: "/designs" },
    { label: t("nav.covers"), href: "/covers" },
    { label: t("nav.photos"), href: "/photos" },
  ];

  const socials = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/jorvi-kapela-178823189/",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/vyjor/",
      label: "Instagram",
    },
    {
      icon: Mail,
      href: "mailto:Dezignby.j@gmail.com",
      label: "Email",
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-black" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + nom */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image
                src="/logo/star.svg"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <span
              className="text-white/80 text-lg"
              style={{ fontFamily: '"Great White Serif", serif' }}
            >
              Jorvi Kapela
            </span>
          </div>

          {/* Nav */}
          <nav
            className="flex items-center gap-5 sm:gap-6"
            aria-label="Navigation du pied de page"
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-white/50 hover:text-red-500 text-sm py-2 transition-colors"
                style={{ fontFamily: '"Great White Serif", serif' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-5 sm:gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="text-white/40 hover:text-red-500 transition-colors p-2"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Jorvi Kapela. {"Tous droits réservés."}
          </p>
        </div>
      </div>
    </footer>
  );
}
