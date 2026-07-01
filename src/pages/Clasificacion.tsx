import { useMemo, useState } from 'react';
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
import { NextMatchBanner } from '../components/NextMatchBanner';
import { AliveTeamsGrid } from '../components/AliveTeamsGrid';
import { TeamVotesModal } from '../components/TeamVotesModal';
import type { TeamCode } from '../types/domain';

type ViewMode = 'ranking' | 'teams';

export function ClasificacionPage() {
  const { data, isLoading, error, refetch, isFetching } = useTournament();
  const [view, setView] = useState<ViewMode>('ranking');
  const [selectedTeam, setSelectedTeam] = useState<TeamCode | null>(null);
  const navigate = useNavigate();
  const openCuadro = (name: string) => navigate(`/cuadros/${name.toLowerCase()}`);

  const playerScores = useMemo(
    () => (data ? scoreAllPlayers(PLAYERS, data) : []),
    [data],
  );
  const ranked = useMemo(
    () => rankByConfirmed(playerScores),
    [playerScores],
  );

  const aliveTeams = useMemo(
    () => (data ? [...data.alive].sort() : []),
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Clasificación
          </h1>
          <p className="text-sm text-text-muted">
            {view === 'ranking'
              ? 'Puntos confirmados según resultados reales.'
              : 'Equipos aún vivos y quién los predijo.'}
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
          <div className="h-24 rounded-xl bg-bg-card/60 border border-border-soft animate-pulse" />
          <PodiumSkeleton />
          <LoadingSkeleton rows={8} />
        </>
      )}

      {error && (
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      )}

      {data && (
        <>
          <NextMatchBanner state={data} />

          <div
            role="tablist"
            aria-label="Vista"
            className="inline-flex self-start rounded-lg bg-bg-card border border-border-soft p-1 text-xs sm:text-sm shadow-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === 'ranking'}
              onClick={() => setView('ranking')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === 'ranking'
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Ranking
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'teams'}
              onClick={() => setView('teams')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                view === 'teams'
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Por selección
            </button>
          </div>

          {view === 'ranking' ? (
            <>
              <PodiumDisplay scores={ranked} onSelect={openCuadro} />
              <div className="flex flex-col gap-2">
                {ranked.map((score) => (
                  <PlayerCard key={score.player.name} score={score} />
                ))}
              </div>
              <p className="text-center text-xs text-text-muted mt-2">
                Toca un participante para ver sus equipos vivos.
              </p>
            </>
          ) : (
            <>
              <AliveTeamsGrid
                teams={aliveTeams}
                playerScores={playerScores}
                onSelect={setSelectedTeam}
              />
              <p className="text-center text-xs text-text-muted mt-2">
                Toca un equipo para ver quién lo predijo.
              </p>
            </>
          )}
        </>
      )}

      <TeamVotesModal
        team={selectedTeam}
        playerScores={playerScores}
        onClose={() => setSelectedTeam(null)}
      />
    </div>
  );
}
