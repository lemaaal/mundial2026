import { describe, it, expect } from 'vitest';
import { stakesForMatch } from './matchStakes';
import type { ParsedMatch, Player } from '../types/domain';

const PLAYER_A: Player = {
  name: 'A',
  abbr: 'A',
  color: '#000',
  picks: {
    r32: ['FRA', 'BRA'],
    r16: ['FRA'],
    qf: ['FRA'],
    sf: ['FRA'],
    third: 'ESP',
    final: 'ENG',
    champion: 'FRA',
  },
};

const PLAYER_B: Player = {
  name: 'B',
  abbr: 'B',
  color: '#000',
  picks: {
    r32: ['GER'],
    r16: [],
    qf: [],
    sf: [],
    third: 'ARG',
    final: 'ARG',
    champion: 'ESP',
  },
};

function makeMatch(
  round: ParsedMatch['round'],
  team1: string,
  team2: string,
): ParsedMatch {
  return {
    round,
    num: 1,
    date: '2026-07-01',
    team1: { code: team1, rawName: team1, resolved: true },
    team2: { code: team2, rawName: team2, resolved: true },
    played: false,
    winner: null,
    loser: null,
  };
}

describe('stakesForMatch', () => {
  it('gives +2 to a player whose r32 pick can win a R32 match', () => {
    const stakes = stakesForMatch(
      makeMatch('r32', 'FRA', 'GER'),
      [PLAYER_A, PLAYER_B],
    );
    expect(stakes[0]!.ifTeam1).toBe(2); // A backs FRA
    expect(stakes[0]!.ifTeam2).toBe(0);
    expect(stakes[1]!.ifTeam2).toBe(2); // B backs GER
    expect(stakes[1]!.ifTeam1).toBe(0);
  });

  it('stacks sf and final picks in a semi-final match', () => {
    const stakes = stakesForMatch(
      makeMatch('sf', 'FRA', 'ENG'),
      [PLAYER_A],
    );
    // FRA is in sf (+5). ENG is player A's `final` pick (+5). Both sides trigger.
    expect(stakes[0]!.ifTeam1).toBe(5); // FRA winning
    expect(stakes[0]!.ifTeam2).toBe(5); // ENG winning
    expect(stakes[0]!.max).toBe(5);
  });

  it('awards +6 for a champion pick in the final', () => {
    const stakes = stakesForMatch(
      makeMatch('final', 'FRA', 'ESP'),
      [PLAYER_A],
    );
    expect(stakes[0]!.ifTeam1).toBe(6);
    expect(stakes[0]!.ifTeam2).toBe(0);
  });

  it('awards +5 for exact third-place hit', () => {
    const stakes = stakesForMatch(
      makeMatch('thirdPlace', 'ESP', 'ARG'),
      [PLAYER_A, PLAYER_B],
    );
    expect(stakes[0]!.ifTeam1).toBe(5); // A picked ESP
    expect(stakes[1]!.ifTeam2).toBe(5); // B picked ARG
  });

  it('returns 0 when neither team appears in any relevant pick', () => {
    const stakes = stakesForMatch(
      makeMatch('r32', 'JPN', 'PAR'),
      [PLAYER_A, PLAYER_B],
    );
    expect(stakes.every((s) => s.max === 0)).toBe(true);
  });
});
