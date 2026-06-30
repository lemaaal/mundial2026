import { useMemo } from 'react';
import { useTournament } from '../hooks/useTournament';
import { PLAYERS } from '../constants/players';
import { scoreAllPlayers } from '../utils/scoring';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { ScoreBreakdown } from '../components/ScoreBreakdown';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { RefreshButton } from '../components/RefreshButton';

export function PrediccionPage() {
  const { data, isLoading, error, refetch, isFetching } = useTournament();

  const scores = useMemo(() => {
    if (!data) return [];
    return [...scoreAllPlayers(PLAYERS, data)].sort(
      (a, b) => b.totalPossiblePoints - a.totalPossiblePoints,
    );
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Predicción de puntos
          </h1>
          <p className="text-sm text-text-muted">
            Confirmados + potenciales si se cumple el resto de la predicción.
          </p>
        </div>
        <RefreshButton
          onRefresh={() => refetch()}
          isFetching={isFetching}
          lastUpdate={data?.lastUpdate}
        />
      </header>

      {isLoading && <LoadingSkeleton rows={6} />}

      {error && (
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      )}

      {data && (
        <div className="flex flex-col gap-4">
          {scores.map(
            ({
              player,
              awards,
              confirmedPoints,
              potentialPoints,
              totalPossiblePoints,
            }) => (
              <details
                key={player.name}
                className="bg-bg-card border border-border-soft rounded-xl overflow-hidden group"
              >
                <summary className="cursor-pointer p-4 flex items-center gap-3 sm:gap-4 list-none [&::-webkit-details-marker]:hidden">
                  <PlayerAvatar
                    name={player.name}
                    abbr={player.abbr}
                    color={player.color}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text">
                      {player.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      <span className="text-success">
                        {confirmedPoints} confirmados
                      </span>
                      {' · '}
                      <span className="text-accent">
                        +{potentialPoints} potenciales
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-text leading-none">
                      {totalPossiblePoints}
                    </div>
                    <div className="text-xs text-text-muted mt-1">máx</div>
                  </div>
                  <span className="text-text-muted text-lg leading-none transition-transform group-open:rotate-90">
                    ›
                  </span>
                </summary>
                <div className="p-4 border-t border-border-soft">
                  <ScoreBreakdown awards={awards} />
                </div>
              </details>
            ),
          )}
        </div>
      )}
    </div>
  );
}
