import type { PlayerStake } from '../utils/matchStakes';
import type { ParsedMatch } from '../types/domain';
import { PlayerAvatar } from './PlayerAvatar';
import { TeamPill } from './TeamPill';

interface PotentialPointsRowProps {
  stakes: PlayerStake[];
  match: ParsedMatch;
}

export function PotentialPointsRow({ stakes, match }: PotentialPointsRowProps) {
  const withPotential = stakes.filter((s) => s.max > 0);
  if (withPotential.length === 0) {
    return (
      <p className="text-xs text-text-muted">
        Nadie tiene puntos en juego en este partido.
      </p>
    );
  }
  const t1 = match.team1.code;
  const t2 = match.team2.code;
  const sorted = [...withPotential].sort((a, b) => b.max - a.max);
  return (
    <ul className="flex flex-col gap-1.5">
      {sorted.map(({ player, ifTeam1, ifTeam2, max }) => {
        const rooting =
          ifTeam1 > 0 && ifTeam2 > 0
            ? 'ambos'
            : ifTeam1 > 0
              ? 'team1'
              : 'team2';
        return (
          <li
            key={player.name}
            className="flex items-center gap-2 text-xs"
          >
            <PlayerAvatar
              name={player.name}
              abbr={player.abbr}
              color={player.color}
              photo={player.photo}
              size={24}
            />
            <span className="flex-1 min-w-0 truncate font-medium text-text">
              {player.name}
            </span>
            <span className="text-primary font-semibold">+{max} pts</span>
            <span className="text-text-muted hidden sm:inline">·</span>
            <span className="hidden sm:flex items-center gap-1 text-text-muted">
              {rooting === 'ambos' ? (
                'gane quien gane'
              ) : rooting === 'team1' && t1 ? (
                <>
                  con <TeamPill code={t1} size="sm" showFlag />
                </>
              ) : rooting === 'team2' && t2 ? (
                <>
                  con <TeamPill code={t2} size="sm" showFlag />
                </>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
