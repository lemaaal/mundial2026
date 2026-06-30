import type { RankedScore } from '../utils/scoring';
import { PlayerAvatar } from './PlayerAvatar';

interface PlayerCardProps {
  score: RankedScore;
  onClick?: () => void;
}

function rankBadge(rank: number): { label: string; className: string } {
  if (rank === 1)
    return {
      label: '1º',
      className: 'bg-gold text-white border-gold',
    };
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

export function PlayerCard({ score, onClick }: PlayerCardProps) {
  const { player, rank, confirmedPoints, potentialPoints } = score;
  const badge = rankBadge(rank);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-bg-card border border-border-soft rounded-xl hover:border-primary transition-colors cursor-pointer shadow-sm"
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
          +{potentialPoints} potenciales
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-2xl font-bold text-text leading-none">
          {confirmedPoints}
        </div>
        <div className="text-xs text-text-muted mt-1">pts</div>
      </div>
    </button>
  );
}
