import type { RankedScore } from '../utils/scoring';
import { PlayerAvatar } from './PlayerAvatar';

interface PodiumDisplayProps {
  scores: RankedScore[];
  onSelect?: (playerName: string) => void;
}

interface SpotConfig {
  height: string;
  color: string;
  label: string;
  size: number;
  textSize: string;
}

const SPOTS: Record<1 | 2 | 3, SpotConfig> = {
  1: {
    height: 'h-28 sm:h-36',
    color: 'from-gold to-gold-soft',
    label: '1º',
    size: 72,
    textSize: 'text-3xl',
  },
  2: {
    height: 'h-20 sm:h-28',
    color: 'from-silver/90 to-silver/60',
    label: '2º',
    size: 56,
    textSize: 'text-2xl',
  },
  3: {
    height: 'h-16 sm:h-24',
    color: 'from-bronze/90 to-bronze/60',
    label: '3º',
    size: 56,
    textSize: 'text-2xl',
  },
};

function PodiumSpot({
  score,
  spot,
  onSelect,
}: {
  score: RankedScore | undefined;
  spot: 1 | 2 | 3;
  onSelect?: (name: string) => void;
}) {
  const config = SPOTS[spot];
  if (!score) {
    return (
      <div className="flex-1 flex flex-col items-center justify-end">
        <div
          className={`${config.height} w-full rounded-t-lg bg-bg-card/60 border border-border-soft border-dashed`}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect?.(score.player.name)}
      className="flex-1 flex flex-col items-center justify-end gap-2 group"
    >
      <PlayerAvatar
        name={score.player.name}
        abbr={score.player.abbr}
        color={score.player.color}
        photo={score.player.photo}
        size={config.size}
      />
      <div className="text-sm sm:text-base font-semibold text-text">
        {score.player.name}
      </div>
      <div className={`${config.textSize} font-bold text-text`}>
        {score.confirmedPoints}
        <span className="text-sm text-text-muted ml-1">pts</span>
      </div>
      <div
        className={`${config.height} w-full rounded-t-lg bg-gradient-to-b ${config.color} flex items-start justify-center pt-2 text-white font-bold text-lg sm:text-xl shadow-md group-hover:brightness-110 transition`}
      >
        {config.label}
      </div>
    </button>
  );
}

export function PodiumDisplay({ scores, onSelect }: PodiumDisplayProps) {
  // Siempre rellenamos los 3 huecos del podio con los 3 primeros del ranking,
  // aunque haya empates (varios participantes pueden compartir rank=1).
  const [first, second, third] = scores;

  const tiedFirsts = scores.filter((s) => s.rank === 1);
  const tiedAtPodium = scores.filter(
    (s) =>
      (first && s.confirmedPoints === first.confirmedPoints) ||
      (second && s.confirmedPoints === second.confirmedPoints) ||
      (third && s.confirmedPoints === third.confirmedPoints),
  );
  const hasPodiumTie =
    tiedAtPodium.length > 3 ||
    (first &&
      second &&
      first.confirmedPoints === second.confirmedPoints) ||
    (second &&
      third &&
      second.confirmedPoints === third.confirmedPoints);

  return (
    <section
      className="mb-6"
      aria-label="Podio actual"
      data-testid="podium"
    >
      <div className="flex items-end gap-2 sm:gap-4 max-w-2xl mx-auto">
        <PodiumSpot score={second} spot={2} onSelect={onSelect} />
        <PodiumSpot score={first} spot={1} onSelect={onSelect} />
        <PodiumSpot score={third} spot={3} onSelect={onSelect} />
      </div>
      {tiedFirsts.length > 1 ? (
        <p className="text-center text-text-muted text-xs mt-3">
          Empate en el primer puesto:{' '}
          {tiedFirsts.map((s) => s.player.name).join(', ')}
        </p>
      ) : hasPodiumTie ? (
        <p className="text-center text-text-muted text-xs mt-3">
          Hay empates en el podio · orden mostrado sin desempate.
        </p>
      ) : null}
    </section>
  );
}
