"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void | Promise<void>;
  showDetails?: boolean;
  type?: string;
}

export default function ErrorMessage({
  message = "Une erreur s'est produite",
  onRetry,
  showDetails = false,
  type = "contenu"
}: ErrorMessageProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
            <div className="relative bg-red-500/10 border border-red-500/30 rounded-full p-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Message principal */}
        <h3
          className="text-xl md:text-2xl font-bold text-white text-center mb-3"
          style={{ fontFamily: '"Great White Serif", serif' }}
        >
          Oups ! Un problème est survenu
        </h3>

        {/* Description */}
        <p className="text-white/70 text-center mb-6">
          Nous n'avons pas pu charger {type}. Cela peut être dû à un problème de connexion ou de serveur.
        </p>

        {/* Détails de l'erreur (optionnel) */}
        {showDetails && message && (
          <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm font-mono break-words">
              {message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed group"
            >
              <RefreshCw
                className={`w-4 h-4 transition-transform ${
                  isRetrying ? 'animate-spin' : 'group-hover:rotate-180 duration-500'
                }`}
              />
              <span>{isRetrying ? 'Rechargement...' : 'Réessayer'}</span>
            </button>
          )}

          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors duration-300"
          >
            Retour à l'accueil
          </button>
        </div>

        {/* Conseils */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/50 text-sm text-center mb-2">
            Suggestions :
          </p>
          <ul className="text-white/60 text-xs space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Vérifiez votre connexion internet</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Actualisez la page (F5 ou Ctrl+R)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>Réessayez dans quelques instants</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
