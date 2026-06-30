import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerCard } from './PlayerCard';
import type { RankedScore } from '../utils/scoring';

function makeScore(overrides: Partial<RankedScore> = {}): RankedScore {
  return {
    player: {
      name: 'Astu',
      abbr: 'AS',
      color: '#2a78d6',
      picks: {
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

describe('PlayerCard', () => {
  it('renders player name, points, and rank badge', () => {
    render(<PlayerCard score={makeScore()} />);
    expect(screen.getByText('Astu')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('1º')).toBeInTheDocument();
    expect(screen.getByText('+8 potenciales')).toBeInTheDocument();
  });

  it('uses the rank badge that matches the score rank', () => {
    render(<PlayerCard score={makeScore({ rank: 4 })} />);
    expect(screen.getByText('4º')).toBeInTheDocument();
  });

  it('invokes onClick when pressed', () => {
    const onClick = vi.fn();
    render(<PlayerCard score={makeScore()} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
