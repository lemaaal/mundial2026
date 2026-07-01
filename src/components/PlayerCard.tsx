import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MilestoneAward } from '../types/domain';
import type { RankedScore } from '../utils/scoring';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamPill } from './TeamPill';
import { ChevronDownIcon, ExternalIcon } from './icons';

interface PlayerCardProps {
  score: RankedScore;
}

function slug(name: string): string {
  return name.toLowerCase();
}

function rankBadge(rank: number): { label: string; className: string } {
  if (rank === 1)
    return { label: '1º', className: 'bg-gold text-white border-gold' };
  if (rank === 2)
    return {
      label: '2º',
      className: 'bg-silver/20 text-silver border-silver/40',
    };
  if (rank === 3)
    return {
      label: '3º',
      className: 'bg-bronze/20 text-bronze border-bronze/40',
    };
  return {
    label: `${rank}º`,
    className: 'bg-bg-soft text-text-muted border-border-soft',
  };
}

const KEY_LABEL: Record<MilestoneAward['key'], string> = {
  r32: '16avos',
  r16: 'Octavos',
  qf: 'Cuartos',
  sf: 'Semis',
  final: 'Final',
  champion: 'Campeón',
  third: '3º',
};

const KEY_PRIORITY: Record<MilestoneAward['key'], number> = {
  champion: 6,
  final: 5,
  sf: 4,
  qf: 3,
  r16: 2,
  r32: 1,
  third: 3,
};

interface AliveTeamRow {
  team: string;
  deepestLabel: string;
  potentialPoints: number;
}

function aliveTeamsFor(awards: MilestoneAward[]): AliveTeamRow[] {
  const groups = new Map<string, MilestoneAward[]>();
  for (const a of awards) {
    if (a.status !== 'potential') continue;
    const bucket = groups.get(a.team) ?? [];
    bucket.push(a);
    groups.set(a.team, bucket);
  }
  const rows: AliveTeamRow[] = [];
  for (const [team, list] of groups) {
    const potentialPoints = list.reduce((s, a) => s + a.points, 0);
    const deepest = [...list].sort(
      (a, b) => KEY_PRIORITY[b.key] - KEY_PRIORITY[a.key],
    )[0]!;
    rows.push({
      team,
      deepestLabel: KEY_LABEL[deepest.key],
      potentialPoints,
    });
  }
  rows.sort((a, b) => b.potentialPoints - a.potentialPoints);
  return rows;
}

export function PlayerCard({ score }: PlayerCardProps) {
  const [open, setOpen] = useState(false);
  const { player, rank, confirmedPoints, potentialPoints, awards } = score;
  const badge = rankBadge(rank);
  const aliveRows = aliveTeamsFor(awards);

  return (
    <article className="bg-bg-card border border-border-soft rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-bg-soft/40 transition-colors cursor-pointer"
      >
        <span
          className={`inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-md text-sm font-bold border ${badge.className}`}
        >
          {badge.label}
        </span>
        <PlayerAvatar
          name={player.name}
          abbr={player.abbr}
          color={player.color}
          photo={player.photo}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-text truncate">{player.name}</div>
          <div className="text-xs text-text-muted">
            +{potentialPoints} potenciales · {aliveRows.length} equipos vivos
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-text leading-none">
            {confirmedPoints}
          </div>
          <div className="text-xs text-text-muted mt-1">pts</div>
        </div>
        <ChevronDownIcon
          width="16"
          height="16"
          className={`text-text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-border-soft/60 px-3 sm:px-4 py-3 flex flex-col gap-3">
          {aliveRows.length === 0 ? (
            <p className="text-xs text-text-muted">
              No le quedan equipos con potencial.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {aliveRows.map((row) => (
                <li
                  key={row.team}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <TeamPill code={row.team} size="sm" showFlag />
                    <span className="text-text-muted">
                      hasta {row.deepestLabel}
                    </span>
                  </div>
                  <span className="text-primary font-semibold">
                    +{row.potentialPoints} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to={`/cuadros/${slug(player.name)}`}
            className="self-start inline-flex items-center gap-1 rounded-md bg-bg-soft border border-border-soft px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            Ver cuadro original
            <ExternalIcon width="12" height="12" />
          </Link>
        </div>
      )}
    </article>
  );
}
