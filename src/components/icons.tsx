import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M6 4h12v3a5 5 0 0 1-10 0" />
      <path d="M8 4v3a5 5 0 0 0 8 0V4" />
      <path d="M6 6H4a2 2 0 0 0 2 4" />
      <path d="M18 6h2a2 2 0 0 1-2 4" />
      <path d="M12 12v3" />
      <path d="M9 20h6" />
      <path d="M10 17h4l-1 3h-2z" />
    </svg>
  );
}

export function BracketIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M3 5v14" />
      <path d="M3 8h4v3H3" />
      <path d="M3 13h4v3H3" />
      <path d="M11 9h3v6h-3z" />
      <path d="M18 11h3v2h-3z" />
      <path d="M7 9.5h4" />
      <path d="M7 14.5h4" />
      <path d="M14 12h4" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <circle cx="8" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="16" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <path d="M7 16l4-6 4 3 5-8" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M14 4h6v6" />
      <path d="M20 4l-8 8" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props} aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function LiveDotIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props} aria-hidden>
      <circle cx="12" cy="12" r="6" fill="currentColor" />
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
  );
}
