import { useState, useMemo } from 'react';

interface PlayerAvatarProps {
  name: string;
  abbr: string;
  color: string;
  photo?: string;
  size?: number;
}

const DEFAULT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-');
}

function buildCandidates(name: string, override?: string): string[] {
  const base = import.meta.env.BASE_URL;
  if (override) {
    if (override.startsWith('http') || override.startsWith('data:')) {
      return [override];
    }
    if (override.startsWith('/')) {
      return [`${base.replace(/\/$/, '')}${override}`];
    }
    return [`${base}${override}`];
  }
  const s = slug(name);
  return DEFAULT_EXTENSIONS.map(
    (ext) => `${base}img/perfiles/${s}.${ext}`,
  );
}

export function PlayerAvatar({
  name,
  abbr,
  color,
  photo,
  size = 40,
}: PlayerAvatarProps) {
  const candidates = useMemo(
    () => buildCandidates(name, photo),
    [name, photo],
  );
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const fallbackInitials = (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
      }}
      title={name}
      aria-label={name}
    >
      {abbr}
    </span>
  );

  if (failed || idx >= candidates.length) return fallbackInitials;

  return (
    <img
      src={candidates[idx]}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover shrink-0 ring-1 ring-border-soft"
      style={{ width: size, height: size }}
      onError={() => {
        if (idx + 1 < candidates.length) {
          setIdx(idx + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
