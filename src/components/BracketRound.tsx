import type { ParsedMatch, RoundKey } from '../types/domain';
import { ROUND_LABEL } from '../types/domain';
import { TeamPill } from './TeamPill';

interface BracketRoundProps {
  round: RoundKey;
  matches: ParsedMatch[];
  hasNext: boolean;
}

function scoreSuffix(match: ParsedMatch): string | null {
  if (!match.played || !match.score) return null;
  const { p, et } = match.score;
  if (p) return `pen. ${p[0]}-${p[1]}`;
  if (et) return 'prórroga';
  return null;
}

function MatchCard({ match }: { match: ParsedMatch }) {
  const winnerSide = (side: 'team1' | 'team2'): boolean =>
    match.winner !== null && match[side].code === match.winner;
  const loserSide = (side: 'team1' | 'team2'): boolean =>
    match.loser !== null && match[side].code === match.loser;

  const variantFor = (side: 'team1' | 'team2') => {
    if (!match.team1.code && !match.team2.code) return 'pending' as const;
    if (!match.played) return 'pending' as const;
    if (winnerSide(side)) return 'winner' as const;
    if (loserSide(side)) return 'loser' as const;
    return 'default' as const;
  };

  const ft = match.score?.ft;
  const suffix = scoreSuffix(match);

  return (
    <article className="bg-bg-card border border-border-soft rounded-lg overflow-hidden shadow-sm w-[210px]">
      <div className="px-2 py-1 text-[10px] font-mono text-text-muted bg-bg-soft border-b border-border-soft flex items-center justify-between">
        <span>#{match.num}</span>
        {!match.played && (
          <time className="truncate" dateTime={match.date}>
            {new Date(match.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
            })}
          </time>
        )}
        {suffix && <span className="text-secondary">{suffix}</span>}
      </div>
      <div className="flex flex-col">
        <Row
          team={match.team1}
          score={ft?.[0]}
          variant={variantFor('team1')}
        />
        <div className="border-t border-border-soft/60" />
        <Row
          team={match.team2}
          score={ft?.[1]}
          variant={variantFor('team2')}
        />
      </div>
    </article>
  );
}

function Row({
  team,
  score,
  variant,
}: {
  team: { code: string | null; rawName: string };
  score?: number;
  variant: 'default' | 'winner' | 'loser' | 'pending';
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-1.5">
      <TeamPill
        code={team.code}
        rawName={team.rawName}
        variant={variant}
        size="sm"
      />
      <span
        className={`font-mono text-sm tabular-nums ${
          variant === 'winner'
            ? 'text-primary font-bold'
            : variant === 'pending'
              ? 'text-text-muted/40'
              : 'text-text-muted'
        }`}
      >
        {typeof score === 'number' ? score : '–'}
      </span>
    </div>
  );
}

export function BracketRound({ round, matches, hasNext }: BracketRoundProps) {
  const pairs: ParsedMatch[][] = [];
  for (let i = 0; i < matches.length; i += 2) {
    pairs.push(matches.slice(i, i + 2));
  }

  return (
    <section className="flex flex-col shrink-0">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest px-1 mb-3 text-center">
        {ROUND_LABEL[round]}
        <span className="text-text-muted/60 normal-case font-normal ml-1">
          · {matches.length}
        </span>
      </h3>
      <div className="flex flex-col justify-around gap-6 grow min-h-0">
        {pairs.map((pair, idx) => {
          if (pair.length === 2) {
            const connectorClass = hasNext ? 'bracket-pair' : '';
            return (
              <div
                key={pair[0]!.num}
                className={`flex flex-col gap-3 ${connectorClass}`}
              >
                <MatchCard match={pair[0]!} />
                <MatchCard match={pair[1]!} />
              </div>
            );
          }
          const single = pair[0]!;
          const connectorClass = hasNext ? 'bracket-single relative' : '';
          return (
            <div key={idx} className={connectorClass}>
              <MatchCard match={single} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
