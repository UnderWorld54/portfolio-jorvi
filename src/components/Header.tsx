"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Linkedin, Instagram, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [activeLang, setActiveLang] = useState<string>("FR");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const navItemsMobile = [
    { label: "DESIGNS", href: "/designs" },
    { label: "COVERS", href: "/covers" },
    { label: "PHOTOS", href: "/photos" },
  ];
  
  const navItemsDesktop = [
    { label: "DESIGNS", href: "/designs" },
    { label: "COVERS", href: "/covers" },
    { label: "PHOTOS", href: "/photos" },
    { label: "CONTACT", href: "mailto:jorvikapela@gmail.com" },
  ];
  
  const contactEmail = "jorvikapela@gmail.com";

  // Calculer activeNav directement depuis le pathname
  const activeNav = pathname === "/designs" ? "DESIGNS" : pathname === "/covers" ? "COVERS" : pathname === "/photos" ? "PHOTOS" : "";

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 relative w-full">
          {/* Language Switcher - Top Left */}
          <div className="flex items-center gap-2">
            {["FR", "ENG"].map((lang) => (
              <motion.button
                key={lang}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveLang(lang)}
                className={`text-md font-bold px-2 py-1 rounded transition-all ${
                  activeLang === lang
                    ? "text-red-500 bg-red-500/10"
                    : "text-red-500/60"
                }`}
                style={{
                  textShadow:
                    activeLang === lang
                      ? "0 0 10px rgba(239, 68, 68, 0.8)"
                      : "none",
                  fontFamily: '"Great White Serif", serif',
                }}
              >
                {lang}
              </motion.button>
            ))}
          </div>

          {/* Logo - Center */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <Link href="/">
              <Image
                src="/logo/star.svg"
                alt="Star"
                width={28}
                height={28}
                className="w-7 h-7"
                style={{ filter: "brightness(0) invert(1)", display: "block" }}
              />
            </Link>
          </motion.div>

          {/* Hamburger Menu - Right */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-red-500 p-2 relative z-50"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 md:px-12 py-6">
          {/* Left side - Lang + Social */}
          <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0 z-10">
            {/* Lang Switch */}
            <div className="flex items-center gap-2">
              {["FR", "ENG"].map((lang) => (
                <div key={lang} className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveLang(lang)}
                    className={`text-red-500 text-md md:text-lg font-medium transition-colors p-0 m-0 border-0 bg-transparent leading-none ${
                      activeLang === lang
                        ? "text-red-500"
                        : "text-red-500/60 hover:text-red-400"
                    }`}
                    style={{
                      textShadow:
                        activeLang === lang
                          ? "0 0 10px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.5)"
                          : "none",
                      fontFamily: '"Great White Serif", serif',
                      lineHeight: "1",
                    }}
                  >
                    {lang}
                  </motion.button>
                  {activeLang === lang && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 md:gap-4 text-base md:text-lg" style={{ lineHeight: "1" }}>
              <motion.a
                href="https://www.linkedin.com/in/jorvi-kapela-178823189/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center text-red-500 hover:text-red-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/vyjor/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center text-red-500 hover:text-red-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </motion.a>
            </div>
          </div>

          {/* Center - Star logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/logo/star.svg"
                  alt="Star"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  style={{ filter: "brightness(0) invert(1)", display: "block" }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Right side - Desktop Nav */}
          <nav className="flex items-center gap-4 md:gap-8 flex-1 justify-end min-w-0 z-10">
            {navItemsDesktop.map(({ label, href }) => (
              <motion.div key={label} className="relative flex items-center justify-center">
                {href.startsWith("mailto:") ? (
                  <a
                    href={href}
                    className={`text-red-500 text-lg md:text-lg font-medium transition-colors leading-none ${
                      activeNav === label
                        ? "text-red-500"
                        : "text-red-500/60 hover:text-red-400"
                    }`}
                    style={{
                      textShadow:
                        activeNav === label
                          ? "0 0 10px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.5)"
                          : "none",
                      fontFamily: '"Great White Serif", serif',
                      lineHeight: "1",
                    }}
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    href={href}
                    className={`text-red-500 text-base md:text-lg font-medium transition-colors leading-none ${
                      activeNav === label
                        ? "text-red-500"
                        : "text-red-500/60 hover:text-red-400"
                    }`}
                    style={{
                      textShadow:
                        activeNav === label
                          ? "0 0 10px rgba(239,68,68,0.8), 0 0 20px rgba(239,68,68,0.5)"
                          : "none",
                      fontFamily: '"Great White Serif", serif',
                      lineHeight: "1",
                    }}
                  >
                    {label}
                  </Link>
                )}
                {activeNav === label && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white"
                  />
                )}
              </motion.div>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-black"
            onClick={(e) => {
              // Ne pas fermer si on clique sur le contenu du menu
              if (e.target === e.currentTarget) {
                setMenuOpen(false);
              }
            }}
          >
            <div className="flex flex-col h-full items-center justify-center relative">
              {/* Navigation Links - Centered */}
              <nav className="flex flex-col items-center gap-8">
                {navItemsMobile.map(({ label, href }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="relative"
                  >
                    {href.startsWith("#") ? (
                      <a
                        href={href}
                        onClick={handleNavClick}
                        className={`text-4xl font-bold transition-all duration-300 block leading-none ${
                          activeNav === label
                            ? "text-red-500"
                            : "text-red-500/60"
                        }`}
                        style={{
                          textShadow:
                            activeNav === label
                              ? "0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)"
                              : "none",
                          fontFamily: '"Great White Serif", serif',
                          lineHeight: "1",
                        }}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        onClick={handleNavClick}
                        className={`text-4xl font-bold transition-all duration-300 block leading-none ${
                          activeNav === label
                            ? "text-red-500"
                            : "text-red-500/60"
                        }`}
                        style={{
                          textShadow:
                            activeNav === label
                              ? "0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5)"
                              : "none",
                          fontFamily: '"Great White Serif", serif',
                          lineHeight: "1",
                        }}
                      >
                        {label}
                      </Link>
                    )}
                    {activeNav === label && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-white"
                        style={{
                          boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Social Links and Mail - Bottom Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-12 flex items-center justify-center gap-6"
              >
                <motion.a
                  href="https://www.linkedin.com/in/jorvi-kapela-178823189/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  aria-label="LinkedIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin size={24} />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/vyjor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  aria-label="Instagram"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Instagram size={24} />
                </motion.a>
                <motion.a
                  href={`mailto:${contactEmail}`}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  aria-label="Email"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavClick();
                  }}
                >
                  <Mail size={24} />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}