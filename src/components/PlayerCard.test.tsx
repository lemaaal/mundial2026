import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PlayerCard } from './PlayerCard';
import type { RankedScore } from '../utils/scoring';

function makeScore(overrides: Partial<RankedScore> = {}): RankedScore {
  return {
    player: {
      name: 'Astu',
      abbr: 'AS',
      color: '#2a78d6',
      picks: {
        r32: [],
        r16: [],
        qf: [],
        sf: [],
        third: 'ARG',
        final: 'FRA',
        champion: 'FRA',
      },
    },
    rank: 1,
    confirmedPoints: 12,
    potentialPoints: 8,
    totalPossiblePoints: 20,
    awards: [],
    ...overrides,
  };
}

function renderCard(score: RankedScore) {
  return render(
    <MemoryRouter>
      <PlayerCard score={score} />
    </MemoryRouter>,
  );
}

describe('PlayerCard', () => {
  it('renders player name, points, rank badge, and alive-team count summary', () => {
    renderCard(makeScore());
    expect(screen.getByText('Astu')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('1º')).toBeInTheDocument();
    expect(
      screen.getByText(/\+8 potenciales · 0 equipos vivos/),
    ).toBeInTheDocument();
  });

  it('uses the rank badge that matches the score rank', () => {
    renderCard(makeScore({ rank: 4 }));
    expect(screen.getByText('4º')).toBeInTheDocument();
  });

  it('expands to reveal the "Ver cuadro original" link when clicked', () => {
    renderCard(makeScore());
    expect(screen.queryByText('Ver cuadro original')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Ver cuadro original')).toBeInTheDocument();
  });
});
