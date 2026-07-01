import { useMemo, useState } from 'react';
import type { ParsedMatch } from '../types/domain';
import { PLAYERS } from '../constants/players';
import { stakesForMatch } from '../utils/matchStakes';
import {
  formatKickoff,
  isProbablyLive,
  relativeKickoff,
} from '../utils/matchTime';
import { TeamPill } from './TeamPill';
import { ExternalIcon, ChevronDownIcon } from './icons';
import { PotentialPointsRow } from './PotentialPointsRow';

const FLASHSCORE_URL =
  'https://www.flashscore.es/futbol/mundial/mundial-2026/';

const ROUND_SHORT: Record<ParsedMatch['round'], string> = {
  r32: '16avos',
  r16: 'Octavos',
  qf: 'Cuartos',
  sf: 'Semis',
  thirdPlace: '3er puesto',
  final: 'Final',
};

interface MatchCardProps {
  match: ParsedMatch;
}

function scoreText(match: ParsedMatch): string | null {
  const s = match.score;
  if (!s?.ft) return null;
  return `${s.ft[0]} – ${s.ft[1]}`;
}

function pensText(match: ParsedMatch): string | null {
  const p = match.score?.p;
  if (!p) return null;
  return `pen. ${p[0]} – ${p[1]}`;
}

export function MatchCard({ match }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const stakes = useMemo(() => stakesForMatch(match, PLAYERS), [match]);
  const total = stakes.reduce((s, x) => s + x.max, 0);

  const t1 = match.team1;
  const t2 = match.team2;
  const score = scoreText(match);
  const pens = pensText(match);
  const winner1 = match.winner && match.winner === t1.code;
  const winner2 = match.winner && match.winner === t2.code;
  const live = isProbablyLive(match);

  return (
    <article className="bg-bg-card border border-border-soft rounded-xl overflow-hidden shadow-sm">
      <header className="flex items-center justify-between px-3 py-2 bg-bg-soft border-b border-border-soft text-xs">
        <span className="inline-flex items-center gap-2">
          <span className="font-mono text-text-muted">#{match.num}</span>
          <span className="rounded-full bg-bg-card border border-border-soft px-2 py-0.5 text-text-muted">
            {ROUND_SHORT[match.round]}
          </span>
          {live && (
            <span className="text-secondary font-semibold uppercase tracking-widest text-[10px] animate-pulse">
              posiblemente en curso
            </span>
          )}
        </span>
        <span className="text-text-muted">
          {match.played ? formatKickoff(match) : formatKickoff(match)}
        </span>
      </header>

      <div className="px-3 py-3 flex items-center gap-3">
        <div className="flex-1 flex justify-end min-w-0">
          <TeamPill
            code={t1.code}
            rawName={t1.rawName}
            showFlag
            variant={
              !t1.code
                ? 'pending'
                : winner1
                  ? 'winner'
                  : match.played
                    ? 'loser'
                    : 'default'
            }
          />
        </div>
        <div className="shrink-0 text-center min-w-[70px]">
          {score ? (
            <>
              <div className="text-lg font-bold font-mono tabular-nums">
                {score}
              </div>
              {pens && (
                <div className="text-[10px] text-text-muted font-mono mt-0.5">
                  {pens}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-text-muted">vs</div>
          )}
        </div>
        <div className="flex-1 flex justify-start min-w-0">
          <TeamPill
            code={t2.code}
            rawName={t2.rawName}
            showFlag
            variant={
              !t2.code
                ? 'pending'
                : winner2
                  ? 'winner'
                  : match.played
                    ? 'loser'
                    : 'default'
            }
          />
        </div>
      </div>

      <footer className="px-3 pb-3 flex items-center justify-between gap-2 text-xs">
        <span className="text-text-muted">
          {!match.played && (
            <span className="text-primary font-semibold">
              {relativeKickoff(match)}
            </span>
          )}
        </span>
        <a
          href={FLASHSCORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-text-muted hover:text-primary"
        >
          Flashscore
          <ExternalIcon width="12" height="12" />
        </a>
      </footer>

      {!match.played && total > 0 && (
        <div className="border-t border-border-soft/60">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-muted hover:text-text bg-bg-card"
            aria-expanded={expanded}
          >
            <span>
              <span className="font-semibold text-primary">+{total} pts</span>{' '}
              en juego · quién puede ganar
            </span>
            <ChevronDownIcon
              width="14"
              height="14"
              className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
          {expanded && (
            <div className="px-3 pb-3">
              <PotentialPointsRow stakes={stakes} match={match} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
