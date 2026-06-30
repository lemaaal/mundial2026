import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Clasificación' },
  { to: '/bracket', label: 'Bracket' },
  { to: '/prediccion', label: 'Predicción' },
  { to: '/cuadros', label: 'Cuadros' },
];

export function TabsNav() {
  return (
    <nav
      className="flex gap-1 sm:gap-2 bg-bg-card border border-border-soft rounded-xl p-1 w-full overflow-x-auto shadow-sm"
      aria-label="Secciones"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 text-center px-3 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-muted hover:text-text hover:bg-bg-soft'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
