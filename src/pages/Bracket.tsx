import { useTournament } from '../hooks/useTournament';
import { BracketRound } from '../components/BracketRound';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { RefreshButton } from '../components/RefreshButton';
import { TeamPill } from '../components/TeamPill';
import type { RoundKey } from '../types/domain';
import { ROUND_LABEL } from '../types/domain';

const MAIN_BRACKET: RoundKey[] = ['r32', 'r16', 'qf', 'sf', 'final'];

export function BracketPage() {
  const { data, isLoading, error, refetch, isFetching } = useTournament();

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Bracket actual
          </h1>
          <p className="text-sm text-text-muted">
            Recorrido real del Mundial, ronda por ronda.
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
        <>
          {data.champion && (
            <div className="rounded-xl border border-gold/40 bg-gold-tint p-4 flex items-center gap-3 justify-center">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-xs uppercase tracking-widest text-text-muted">
                  Campeón
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <TeamPill
                    code={data.champion}
                    size="lg"
                    variant="winner"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto -mx-3 px-3 pb-4">
            <div className="flex gap-12 pr-8 min-h-[640px]">
              {MAIN_BRACKET.map((round, idx) => (
                <BracketRound
                  key={round}
                  round={round}
                  matches={data.matchesByRound[round]}
                  hasNext={idx < MAIN_BRACKET.length - 1}
                />
              ))}
            </div>
          </div>

          {data.matchesByRound.thirdPlace.length > 0 && (
            <section className="border-t border-border-soft pt-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
                {ROUND_LABEL.thirdPlace}
              </h3>
              <div className="flex justify-center">
                <BracketRound
                  round="thirdPlace"
                  matches={data.matchesByRound.thirdPlace}
                  hasNext={false}
                />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
