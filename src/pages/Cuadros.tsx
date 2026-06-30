import { Link } from 'react-router-dom';
import { PLAYERS, PREDICTION_IMAGES } from '../constants/players';
import { PlayerAvatar } from '../components/PlayerAvatar';

function imageSrc(playerName: string): string | null {
  const file = PREDICTION_IMAGES[playerName];
  if (!file) return null;
  return `${import.meta.env.BASE_URL}img/predicciones/${file}`;
}

function slug(name: string): string {
  return name.toLowerCase();
}

export function CuadrosPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">Cuadros</h1>
        <p className="text-sm text-text-muted">
          La predicción original que escribió cada uno. Toca un cuadro para
          verlo a tamaño completo.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PLAYERS.map((player) => {
          const src = imageSrc(player.name);
          return (
            <Link
              key={player.name}
              to={`/cuadros/${slug(player.name)}`}
              className="bg-bg-card border border-border-soft rounded-xl overflow-hidden shadow-sm hover:border-primary transition-colors flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-bg-soft overflow-hidden">
                {src ? (
                  <img
                    src={src}
                    alt={`Cuadro de ${player.name}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted text-xs">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-3">
                <PlayerAvatar
                  name={player.name}
                  abbr={player.abbr}
                  color={player.color}
                  photo={player.photo}
                  size={32}
                />
                <span className="text-sm font-semibold text-text truncate">
                  {player.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
