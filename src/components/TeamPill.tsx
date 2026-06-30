import type { TeamCode } from '../types/domain';
import { flagIsoFromCode, nameFromCode } from '../constants/teamMaps';

interface TeamPillProps {
  code: TeamCode | null;
  rawName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'winner' | 'loser' | 'pending';
  showName?: boolean;
  showFlag?: boolean;
  compact?: boolean;
}

const SIZE_CLASS: Record<NonNullable<TeamPillProps['size']>, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
};

const VARIANT_CLASS: Record<NonNullable<TeamPillProps['variant']>, string> = {
  default: 'bg-bg-soft border-border-soft text-text',
  winner: 'bg-primary-tint border-primary text-primary font-semibold',
  loser: 'bg-bg-soft/60 border-border-soft text-text-muted opacity-60',
  pending: 'bg-bg-soft/40 border-dashed border-border-soft text-text-muted',
};

const FLAG_SIZE: Record<NonNullable<TeamPillProps['size']>, string> = {
  sm: 'h-3 w-4',
  md: 'h-3.5 w-5',
  lg: 'h-4 w-6',
};

export function TeamPill({
  code,
  rawName,
  size = 'md',
  variant = 'default',
  showName = false,
  showFlag = true,
  compact = false,
}: TeamPillProps) {
  const label = code ?? rawName ?? '?';
  const fullName = code ? nameFromCode(code) : rawName ?? '';
  const flagIso = showFlag ? flagIsoFromCode(code) : null;

  return (
    <span
      className={`inline-flex items-center rounded-md border ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]}`}
      title={fullName}
    >
      {flagIso ? (
        <span
          className={`fi fi-${flagIso} shrink-0 ${FLAG_SIZE[size]}`}
          aria-hidden
        />
      ) : showFlag && code === null ? (
        <span
          className={`${FLAG_SIZE[size]} shrink-0 rounded-sm bg-border-soft/60`}
          aria-hidden
        />
      ) : null}
      {!compact && (
        <span className="font-mono tracking-wider">{label}</span>
      )}
      {showName && code && (
        <span className="hidden sm:inline text-text-muted text-xs">
          {fullName}
        </span>
      )}
    </span>
  );
}
