import { Link, Navigate, useParams } from 'react-router-dom';
import { PLAYERS, PREDICTION_IMAGES } from '../constants/players';
import { PlayerAvatar } from '../components/PlayerAvatar';

export function CuadroDetailPage() {
  const { name } = useParams<{ name: string }>();
  const player = PLAYERS.find(
    (p) => p.name.toLowerCase() === (name ?? '').toLowerCase(),
  );

  if (!player) {
    return <Navigate to="/cuadros" replace />;
  }

  const file = PREDICTION_IMAGES[player.name];
  const src = file
    ? `${import.meta.env.BASE_URL}img/predicciones/${file}`
    : null;

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/cuadros"
        className="text-sm text-text-muted hover:text-primary inline-flex items-center gap-1 self-start"
      >
        ← Todos los cuadros
      </Link>

      <header className="flex items-center gap-3">
        <PlayerAvatar
          name={player.name}
          abbr={player.abbr}
          color={player.color}
          photo={player.photo}
          size={56}
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text leading-none">
            {player.name}
          </h1>
          <p className="text-xs text-text-muted mt-1">Cuadro original</p>
        </div>
      </header>

      {src ? (
        <div className="bg-bg-card border border-border-soft rounded-xl p-3 shadow-sm">
          <img
            src={src}
            alt={`Cuadro de ${player.name}`}
            className="w-full h-auto rounded-lg"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border-soft bg-bg-card p-8 text-center text-text-muted">
          No hay imagen registrada para {player.name}.
        </div>
      )}
    </div>
  );
}
