"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  download?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  type = "button",
  download = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 relative overflow-hidden group uppercase tracking-wider";

  const sizeStyles = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-red-500 hover:border-red-500",
    outline:
      "bg-white/5 backdrop-blur-lg border border-white/15 text-white/80 hover:bg-red-500 hover:border-red-500 hover:text-white",
    ghost: "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
  };

  const glowStyles = {
    primary: "hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
    outline: "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    ghost: "",
  };

  const buttonContent = (
    <>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full"
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      <span className="relative z-10 flex items-center gap-2.5 font-bold">
        {Icon && iconPosition === "left" && (
          <Icon
            size={size === "sm" ? 14 : size === "md" ? 18 : 22}
            strokeWidth={2.5}
          />
        )}
        <span>{children}</span>
        {Icon && iconPosition === "right" && (
          <motion.span
            className="inline-flex"
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              size={size === "sm" ? 14 : size === "md" ? 18 : 22}
              strokeWidth={2.5}
            />
          </motion.span>
        )}
      </span>
    </>
  );

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyles[variant]} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  // Vérifier si c'est un lien externe (mailto, http, https) ou si c'est un téléchargement
  const isExternalLink =
    href &&
    (href.startsWith("mailto:") ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      download);

  if (href) {
    const motionWrapper = (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className="inline-block"
      >
        {isExternalLink ? (
          <a
            href={href}
            className={`${buttonClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
            aria-label={typeof children === "string" ? children : undefined}
            {...(download && { download: true })}
          >
            {buttonContent}
          </a>
        ) : (
          <Link
            href={href}
            className={`${buttonClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
            aria-label={typeof children === "string" ? children : undefined}
          >
            {buttonContent}
          </Link>
        )}
      </motion.div>
    );

    return motionWrapper;
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${buttonClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
      aria-disabled={disabled}
    >
      {buttonContent}
    </motion.button>
  );
}
