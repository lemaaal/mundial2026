import { useEffect, useMemo, useState } from 'react';
import type { ParsedMatch, TournamentState } from '../types/domain';
import { PLAYERS } from '../constants/players';
import {
  elapsedMinutes,
  formatKickoff,
  isProbablyLive,
  isUpcoming,
  kickoffOf,
  relativeKickoff,
} from '../utils/matchTime';
import { stakesForMatch } from '../utils/matchStakes';
import { TeamPill } from './TeamPill';
import { ExternalIcon, LiveDotIcon } from './icons';
import { PotentialPointsRow } from './PotentialPointsRow';

const FLASHSCORE_URL =
  'https://www.flashscore.es/futbol/mundial/campeonato-del-mundo/';

interface NextMatchBannerProps {
  state: TournamentState;
}

function allKnockoutMatches(state: TournamentState): ParsedMatch[] {
  return [
    ...state.matchesByRound.r32,
    ...state.matchesByRound.r16,
    ...state.matchesByRound.qf,
    ...state.matchesByRound.sf,
    ...state.matchesByRound.thirdPlace,
    ...state.matchesByRound.final,
  ];
}

function pickFeatured(
  state: TournamentState,
  now: Date,
): { match: ParsedMatch; kind: 'live' | 'next' } | null {
  const all = allKnockoutMatches(state);
  const live = all.find((m) => isProbablyLive(m, now));
  if (live) return { match: live, kind: 'live' };
  const upcoming = all
    .filter((m) => isUpcoming(m, now))
    .sort((a, b) => {
      const da = kickoffOf(a)?.getTime() ?? Infinity;
      const db = kickoffOf(b)?.getTime() ?? Infinity;
      return da - db;
    });
  if (upcoming.length > 0) return { match: upcoming[0]!, kind: 'next' };
  return null;
}

const ROUND_LABEL_ES: Record<ParsedMatch['round'], string> = {
  r32: '16avos',
  r16: 'Octavos',
  qf: 'Cuartos',
  sf: 'Semifinal',
  thirdPlace: '3er puesto',
  final: 'Final',
};

export function NextMatchBanner({ state }: NextMatchBannerProps) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const [expanded, setExpanded] = useState(false);

  const featured = useMemo(() => pickFeatured(state, now), [state, now]);
  const stakes = useMemo(
    () => (featured ? stakesForMatch(featured.match, PLAYERS) : []),
    [featured],
  );

  if (!featured) {
    return (
      <section className="rounded-xl border border-border-soft bg-bg-card p-4 text-sm text-text-muted">
        No hay partidos programados próximamente.
      </section>
    );
  }

  const { match, kind } = featured;
  const t1 = match.team1;
  const t2 = match.team2;
  const total = stakes.reduce((s, x) => s + x.max, 0);

  const isLive = kind === 'live';
  const border = isLive ? 'border-secondary/50' : 'border-primary/30';
  const bg = isLive ? 'bg-secondary-tint' : 'bg-primary-tint';

  return (
    <section
      className={`rounded-xl border ${border} ${bg} overflow-hidden`}
      aria-label={isLive ? 'Partido en juego' : 'Próximo partido'}
    >
      <div className="flex items-center justify-between px-4 pt-3">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 text-secondary font-semibold text-xs uppercase tracking-widest">
            <LiveDotIcon
              width="10"
              height="10"
              className="animate-pulse"
            />
            Posiblemente en curso
          </span>
        ) : (
          <span className="text-primary font-semibold text-xs uppercase tracking-widest">
            Próximo partido
          </span>
        )}
        <span className="text-xs text-text-muted font-medium">
          {ROUND_LABEL_ES[match.round]}
        </span>
      </div>

      <div className="px-4 py-3 flex items-center gap-3 justify-center">
        <div className="flex-1 flex justify-end min-w-0">
          <TeamPill
            code={t1.code}
            rawName={t1.rawName}
            size="lg"
            showFlag
          />
        </div>
        <div className="shrink-0 text-center">
          {isLive && match.score?.ft ? (
            <div className="text-xl font-bold font-mono tabular-nums">
              {match.score.ft[0]} – {match.score.ft[1]}
            </div>
          ) : (
            <div className="text-xl font-bold text-text-muted">vs</div>
          )}
          {isLive && (
            <div className="text-[10px] text-secondary font-semibold mt-0.5">
              +{elapsedMinutes(match, now)} min
            </div>
          )}
        </div>
        <div className="flex-1 flex justify-start min-w-0">
          <TeamPill
            code={t2.code}
            rawName={t2.rawName}
            size="lg"
            showFlag
          />
        </div>
      </div>

      <div className="px-4 pb-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="text-text-muted text-center sm:text-left">
          {isLive ? (
            <>Empezó a las {formatKickoff(match)}</>
          ) : (
            <>
              {formatKickoff(match)}{' '}
              <span className="text-primary font-semibold">
                · {relativeKickoff(match, now)}
              </span>
            </>
          )}
        </div>
        <a
          href={FLASHSCORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md bg-bg-card border border-border-soft px-3 py-1.5 hover:border-primary hover:text-primary transition-colors font-medium"
        >
          Ver en Flashscore
          <ExternalIcon width="12" height="12" />
        </a>
      </div>

      {total > 0 && (
        <div className="border-t border-border-soft/60 bg-bg-card/50">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full px-4 py-2 text-xs flex items-center justify-between text-text-muted hover:text-text"
            aria-expanded={expanded}
          >
            <span>
              <span className="font-semibold text-primary">+{total} pts</span>{' '}
              en juego entre los 8 participantes
            </span>
            <span aria-hidden>{expanded ? '−' : '+'}</span>
          </button>
          {expanded && (
            <div className="px-4 pb-3">
              <PotentialPointsRow stakes={stakes} match={match} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
