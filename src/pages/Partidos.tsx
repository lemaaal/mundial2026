import { useMemo } from 'react';
import { useTournament } from '../hooks/useTournament';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { RefreshButton } from '../components/RefreshButton';
import { MatchCard } from '../components/MatchCard';
import type { ParsedMatch, RoundKey } from '../types/domain';
import { ROUND_LABEL } from '../types/domain';
import { kickoffOf } from '../utils/matchTime';

const ROUND_ORDER: RoundKey[] = [
  'r32',
  'r16',
  'qf',
  'sf',
  'thirdPlace',
  'final',
];

function chronological(a: ParsedMatch, b: ParsedMatch): number {
  const ka = kickoffOf(a)?.getTime() ?? a.num;
  const kb = kickoffOf(b)?.getTime() ?? b.num;
  return ka - kb;
}

export function PartidosPage() {
  const { data, isLoading, error, refetch, isFetching } = useTournament();

  const sections = useMemo(() => {
    if (!data) return [];
    return ROUND_ORDER.map((round) => ({
      round,
      matches: [...data.matchesByRound[round]].sort(chronological),
    })).filter((s) => s.matches.length > 0);
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Partidos
          </h1>
          <p className="text-sm text-text-muted">
            Toda la fase eliminatoria. Toca un partido para ver quién puntúa.
          </p>
        </div>
        <RefreshButton
          onRefresh={() => refetch()}
          isFetching={isFetching}
          lastUpdate={data?.lastUpdate}
        />
      </header>

      {isLoading && <LoadingSkeleton rows={8} />}
      {error && (
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      )}

      {data && (
        <div className="flex flex-col gap-6">
          {sections.map(({ round, matches }) => (
            <section key={round} className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest px-1">
                {ROUND_LABEL[round]}{' '}
                <span className="text-text-muted/60 font-normal normal-case">
                  · {matches.length} partido{matches.length === 1 ? '' : 's'}
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {matches.map((m) => (
                  <MatchCard key={m.num} match={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
