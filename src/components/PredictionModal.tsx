import { useEffect } from 'react';
import { PREDICTION_IMAGES } from '../constants/players';

interface PredictionModalProps {
  playerName: string | null;
  onClose: () => void;
}

export function PredictionModal({ playerName, onClose }: PredictionModalProps) {
  useEffect(() => {
    if (!playerName) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [playerName, onClose]);

  if (!playerName) return null;
  const file = PREDICTION_IMAGES[playerName];
  if (!file) return null;
  const src = `${import.meta.env.BASE_URL}img/predicciones/${file}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Bracket de ${playerName}`}
      className="fixed inset-0 z-50 bg-text/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full mb-3 px-2">
          <h3 className="text-white text-lg font-semibold">
            Bracket original de {playerName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-bg-card border border-border-soft px-3 py-1 text-sm text-text hover:border-primary"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>
        <img
          src={src}
          alt={`Predicción de ${playerName}`}
          className="rounded-lg border border-border-soft max-h-[80vh] object-contain shadow-2xl bg-bg-card"
        />
      </div>
    </div>
  );
}
