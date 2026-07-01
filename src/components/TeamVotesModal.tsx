import type { PlayerScore, TeamCode } from '../types/domain';
import { nameFromCode, flagIsoFromCode } from '../constants/teamMaps';
import { votesForTeam } from '../utils/teamVotes';
import { Modal } from './Modal';
import { PlayerAvatar } from './PlayerAvatar';
import { CloseIcon } from './icons';

interface TeamVotesModalProps {
  team: TeamCode | null;
  playerScores: PlayerScore[];
  onClose: () => void;
}

export function TeamVotesModal({
  team,
  playerScores,
  onClose,
}: TeamVotesModalProps) {
  const open = team !== null;
  const iso = team ? flagIsoFromCode(team) : null;
  const fullName = team ? nameFromCode(team) : '';
  const votes = team ? votesForTeam(team, playerScores) : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={team ? `Quién predijo a ${fullName}` : 'Detalle de selección'}
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border-soft">
        {iso && (
          <span className={`fi fi-${iso} h-6 w-9 shrink-0`} aria-hidden />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-text leading-none">
            {fullName}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            {votes.length === 0
              ? 'Sin votos aún'
              : `${votes.length} participante${votes.length === 1 ? '' : 's'} lo predijeron`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-md p-1.5 hover:bg-bg-soft text-text-muted hover:text-text"
        >
          <CloseIcon width="18" height="18" />
        </button>
      </header>

      <div className="overflow-y-auto px-4 py-3 flex-1">
        {votes.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6">
            Ningún participante predijo a este equipo tan lejos.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {votes.map((vote) => (
              <li
                key={vote.player.name}
                className="flex items-center gap-3 p-2.5 bg-bg-soft border border-border-soft rounded-lg"
              >
                <PlayerAvatar
                  name={vote.player.name}
                  abbr={vote.player.abbr}
                  color={vote.player.color}
                  photo={vote.player.photo}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text text-sm">
                    {vote.player.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="rounded-full border border-primary/30 bg-primary-tint text-primary px-2 py-0.5 font-medium">
                      hasta {vote.deepestLabel}
                    </span>
                    {vote.confirmedPoints > 0 && (
                      <span className="text-accent font-medium">
                        {vote.confirmedPoints} conf
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-primary leading-none">
                    +{vote.potentialPoints}
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">
                    potenciales
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
