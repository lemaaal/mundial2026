import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { RefreshButton } from '../components/RefreshButton';

function slug(name: string): string {
  return name.toLowerCase();
}

export function ClasificacionPage() {
  const { data, isLoading, error, refetch, isFetching } = useTournament();
  const navigate = useNavigate();

  const ranked = useMemo(() => {
    if (!data) return [];
    return rankByConfirmed(scoreAllPlayers(PLAYERS, data));
  }, [data]);

  const openCuadro = (playerName: string) => {
    navigate(`/cuadros/${slug(playerName)}`);
  };

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
          <PodiumDisplay scores={ranked} onSelect={openCuadro} />
          <div className="flex flex-col gap-2">
            {ranked.map((score) => (
              <PlayerCard
                key={score.player.name}
                score={score}
                onClick={() => openCuadro(score.player.name)}
              />
            ))}
          </div>
          <p className="text-center text-xs text-text-muted mt-2">
            Toca un participante para ver su cuadro original.
          </p>
        </>
      )}
    </div>
  );
}
