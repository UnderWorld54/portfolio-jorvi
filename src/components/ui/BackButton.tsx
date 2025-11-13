"use client";

import Link from "next/link";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  href, 
  label = "Retour",
  className = "" 
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-colors mb-6 ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 12L6 8L10 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}

