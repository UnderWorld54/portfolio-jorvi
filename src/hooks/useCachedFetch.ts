"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseCachedFetchOptions {
  /** Durée de validité du cache en ms (défaut: 1 heure) */
  cacheTime?: number;
  /** Durée pendant laquelle les données "stale" sont acceptables (défaut: 24 heures) */
  staleTime?: number;
  /** Activer le cache localStorage (défaut: true) */
  enableCache?: boolean;
}

interface UseCachedFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CACHE_PREFIX = "strapi_cache_";

function getCacheKey(endpoint: string): string {
  return `${CACHE_PREFIX}${endpoint.replace(/\//g, "_")}`;
}

function getFromCache<T>(key: string): CacheEntry<T> | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached) as CacheEntry<T>;
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

function setToCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

export function useCachedFetch<T>(
  endpoint: string,
  options: UseCachedFetchOptions = {}
): UseCachedFetchResult<T> {
  const {
    cacheTime = 60 * 60 * 1000, // 1 heure
    staleTime = 24 * 60 * 60 * 1000, // 24 heures
    enableCache = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  const cacheKey = getCacheKey(endpoint);

  const fetchData = useCallback(async (showLoading = true) => {
    // Ne pas fetch si l'endpoint est vide
    if (!endpoint) {
      setIsLoading(false);
      return;
    }

    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const freshData = await response.json();

      if (isMounted.current) {
        setData(freshData);
        setIsStale(false);
        setIsLoading(false);

        // Mettre en cache les nouvelles données
        if (enableCache) {
          setToCache(cacheKey, freshData);
        }
      }
    } catch (err) {
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
        setIsLoading(false);
      }
    }
  }, [endpoint, cacheKey, enableCache]);

  useEffect(() => {
    isMounted.current = true;

    // Ne rien faire si l'endpoint est vide
    if (!endpoint) {
      setIsLoading(false);
      return;
    }

    // 1. Essayer de charger depuis le cache immédiatement
    if (enableCache) {
      const cached = getFromCache<T>(cacheKey);

      if (cached) {
        const age = Date.now() - cached.timestamp;

        // Données en cache valides
        if (age < staleTime) {
          setData(cached.data);

          // Si les données sont "fraîches", pas besoin de refetch immédiatement
          if (age < cacheTime) {
            setIsLoading(false);
            setIsStale(false);
            return;
          }

          // Données "stale" mais acceptables : afficher et refetch en arrière-plan
          setIsStale(true);
          setIsLoading(false);
          fetchData(false); // Refetch sans loading spinner
          return;
        }
      }
    }

    // 2. Pas de cache valide : fetch normal
    fetchData(true);

    return () => {
      isMounted.current = false;
    };
  }, [endpoint, cacheKey, cacheTime, staleTime, enableCache, fetchData]);

  return {
    data,
    isLoading,
    isStale,
    error,
    refetch: () => fetchData(true),
  };
}

// Utilitaire pour précharger les données (wake up Strapi)
export async function prefetchData(endpoints: string[]): Promise<void> {
  await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, { priority: "low" as RequestPriority })
    )
  );
}

// Utilitaire pour vider le cache
export function clearStrapiCache(): void {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
