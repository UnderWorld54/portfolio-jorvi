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
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 relative overflow-hidden group";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-base",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
  };

  const variantStyles = {
    primary: "bg-red-500 text-white hover:bg-red-600",
    outline:
      "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
    ghost: "bg-transparent text-red-500 hover:bg-red-500/10",
  };

  const glowStyles = {
    primary: "shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]",
    outline: "hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    ghost: "",
  };

  const buttonContent = (
    <>
      {/* Effet de brillance au hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Contenu */}
      <span className="relative z-10 flex items-center gap-2" style={{ fontFamily: '"Great White Serif", serif' }}>
        {Icon && iconPosition === "left" && (
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
          </motion.div>
        )}
        <span>{children}</span>
        {Icon && iconPosition === "right" && (
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
          </motion.div>
        )}
      </span>

      {/* Effet de glow animé pour primary */}
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: [
              "0 0 20px rgba(239, 68, 68, 0.3)",
              "0 0 30px rgba(239, 68, 68, 0.5)",
              "0 0 20px rgba(239, 68, 68, 0.3)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </>
  );

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyles[variant]} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  // Vérifier si c'est un lien externe (mailto, http, https)
  const isExternalLink = href && (href.startsWith("mailto:") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#"));

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
            aria-label={typeof children === 'string' ? children : undefined}
          >
            {buttonContent}
          </a>
        ) : (
          <Link 
            href={href} 
            className={`${buttonClasses} focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
            aria-label={typeof children === 'string' ? children : undefined}
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

