"use client";

import { useEffect, useRef } from "react";

const API_ENDPOINTS = [
  "/api/photos",
  "/api/covers",
  "/api/logos",
  "/api/prints",
  "/api/videos",
];

/**
 * Composant invisible qui précharge les données Strapi en arrière-plan
 * pour réduire l'impact du cold start quand l'utilisateur navigue
 */
export default function StrapiWarmup() {
  const hasFetched = useRef(false);

  useEffect(() => {
    // Ne fetch qu'une seule fois par session
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Attendre que la page soit idle avant de précharger
    const warmup = () => {
      // Utiliser requestIdleCallback si disponible, sinon setTimeout
      const scheduleWarmup =
        typeof window !== "undefined" && "requestIdleCallback" in window
          ? (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 1000);

      scheduleWarmup(
        () => {
          // Fetch tous les endpoints en parallèle avec priorité basse
          API_ENDPOINTS.forEach((endpoint) => {
            fetch(endpoint, {
              priority: "low" as RequestPriority,
              // Ne pas bloquer la navigation
              keepalive: true,
            }).catch(() => {
              // Ignorer les erreurs silencieusement
            });
          });
        },
        { timeout: 3000 }
      );
    };

    // Attendre que le DOM soit prêt
    if (document.readyState === "complete") {
      warmup();
    } else {
      window.addEventListener("load", warmup, { once: true });
    }
  }, []);

  // Composant invisible
  return null;
}
