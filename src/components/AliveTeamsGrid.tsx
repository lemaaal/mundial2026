import type { PlayerScore, TeamCode } from '../types/domain';
import { nameFromCode, flagIsoFromCode } from '../constants/teamMaps';

interface AliveTeamsGridProps {
  teams: TeamCode[];
  playerScores: PlayerScore[];
  onSelect: (team: TeamCode) => void;
}

function voteCount(team: TeamCode, playerScores: PlayerScore[]): number {
  let count = 0;
  for (const s of playerScores) {
    if (s.awards.some((a) => a.team === team)) count++;
  }
  return count;
}

export function AliveTeamsGrid({
  teams,
  playerScores,
  onSelect,
}: AliveTeamsGridProps) {
  const rows = teams
    .map((team) => ({ team, count: voteCount(team, playerScores) }))
    .sort((a, b) => b.count - a.count || a.team.localeCompare(b.team));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {rows.map(({ team, count }) => {
        const iso = flagIsoFromCode(team);
        return (
          <button
            key={team}
            type="button"
            onClick={() => onSelect(team)}
            className="flex items-center gap-2 p-3 bg-bg-card border border-border-soft rounded-lg hover:border-primary transition-colors text-left shadow-sm"
          >
            {iso && (
              <span
                className={`fi fi-${iso} h-4 w-6 shrink-0`}
                aria-hidden
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-text truncate">
                {nameFromCode(team)}
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {count === 0
                  ? 'sin votos'
                  : `${count} voto${count === 1 ? '' : 's'}`}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
