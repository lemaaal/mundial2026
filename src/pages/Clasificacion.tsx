import { useMemo, useState } from 'react';
import { useTournament } from '../hooks/useTournament';
import { PLAYERS } from '../constants/players';
import { rankByConfirmed, scoreAllPlayers } from '../utils/scoring';
import { PodiumDisplay } from '../components/PodiumDisplay';
import { PlayerCard } from '../components/PlayerCard';
import {
  LoadingSkeleton,
  PodiumSkeleton,
} from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { PredictionModal } from '../components/PredictionModal';
import { RefreshButton } from '../components/RefreshButton';

export function ClasificacionPage() {
  const { data, isLoading, error, refetch, isFetching } = useTournament();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const ranked = useMemo(() => {
    if (!data) return [];
    return rankByConfirmed(scoreAllPlayers(PLAYERS, data));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Clasificación
          </h1>
          <p className="text-sm text-text-muted">
            Puntos confirmados según resultados reales del Mundial.
          </p>
        </div>
        <RefreshButton
          onRefresh={() => refetch()}
          isFetching={isFetching}
          lastUpdate={data?.lastUpdate}
        />
      </header>

      {isLoading && (
        <>
          <PodiumSkeleton />
          <LoadingSkeleton rows={8} />
        </>
      )}

      {error && (
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      )}

      {data && (
        <>
          <PodiumDisplay scores={ranked} onSelect={setSelectedPlayer} />
          <div className="flex flex-col gap-2">
            {ranked.map((score) => (
              <PlayerCard
                key={score.player.name}
                score={score}
                onClick={() => setSelectedPlayer(score.player.name)}
              />
            ))}
          </div>
          <p className="text-center text-xs text-text-muted mt-2">
            Toca un participante para ver su bracket original.
          </p>
        </>
      )}

      <PredictionModal
        playerName={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
    </div>
  );
}
