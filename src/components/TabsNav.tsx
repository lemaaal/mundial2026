import { NavLink } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import {
  TrophyIcon,
  BracketIcon,
  CalendarIcon,
  ChartIcon,
  GridIcon,
} from './icons';

interface Tab {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const TABS: Tab[] = [
  { to: '/', label: 'Ranking', Icon: TrophyIcon },
  { to: '/bracket', label: 'Bracket', Icon: BracketIcon },
  { to: '/partidos', label: 'Partidos', Icon: CalendarIcon },
  { to: '/prediccion', label: 'Predicción', Icon: ChartIcon },
  { to: '/cuadros', label: 'Cuadros', Icon: GridIcon },
];

export function TabsNav() {
  return (
    <nav
      className="flex gap-1 bg-bg-card border border-border-soft rounded-xl p-1 w-full shadow-sm"
      aria-label="Secciones"
    >
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          title={label}
          className={({ isActive }) =>
            `flex-1 flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-2 py-2 rounded-lg text-[10px] sm:text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-muted hover:text-text hover:bg-bg-soft'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                width="18"
                height="18"
                className={isActive ? 'text-white' : 'text-current'}
              />
              <span className="leading-none">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
