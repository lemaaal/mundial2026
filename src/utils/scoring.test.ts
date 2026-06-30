import { describe, it, expect } from 'vitest';
import { POINTS, scorePlayer, scoreAllPlayers, rankByConfirmed } from './scoring';
import { parseTournament } from '../services/worldcupApi';
import type {
  Player,
  TournamentState,
  TeamCode,
  RawWorldCup,
} from '../types/domain';

function emptyState(): TournamentState {
  return {
    matchesByRound: {
      r32: [],
      r16: [],
      qf: [],
      sf: [],
      thirdPlace: [],
      final: [],
    },
    reached: {
      r32: new Set(),
      r16: new Set(),
      qf: new Set(),
      sf: new Set(),
      thirdPlace: new Set(),
      final: new Set(),
    },
    champion: null,
    thirdPlaceWinner: null,
    eliminated: new Set(),
    alive: new Set<TeamCode>([
      'FRA',
      'ESP',
      'GER',
      'POR',
      'CAN',
      'NED',
      'USA',
      'BEL',
      'ARG',
      'BRA',
      'ENG',
      'COL',
      'MAR',
      'SEN',
      'CRO',
      'PAR',
    ]),
    lastUpdate: new Date().toISOString(),
  };
}

const ASTU: Player = {
  name: 'Astu',
  abbr: 'AS',
  color: '#2a78d6',
  picks: {
    r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL'],
    qf: ['GER', 'FRA', 'POR', 'ESP'],
    sf: ['FRA', 'ESP'],
    third: 'ARG',
    final: 'FRA',
    champion: 'FRA',
  },
};

describe('point values use base+1 + acumulativo', () => {
  it('exposes the published values (2/3/4/5/6 + 5 third)', () => {
    expect(POINTS.r16).toBe(2);
    expect(POINTS.qf).toBe(3);
    expect(POINTS.sf).toBe(4);
    expect(POINTS.final).toBe(5);
    expect(POINTS.champion).toBe(6);
    expect(POINTS.third).toBe(5);
  });
});

describe('scorePlayer', () => {
  it('starts at 0 confirmed when nothing has been played', () => {
    const state = emptyState();
    const result = scorePlayer(ASTU, state);
    expect(result.confirmedPoints).toBe(0);
    expect(result.potentialPoints).toBeGreaterThan(0);
  });

  it('awards 2+3+4+5+6 = 20 for a team that wins it all', () => {
    const state = emptyState();
    state.reached.r16 = new Set(['FRA', 'GER', 'POR', 'ESP']);
    state.reached.qf = new Set(['FRA', 'POR', 'ESP']);
    state.reached.sf = new Set(['FRA', 'ESP']);
    state.reached.final = new Set(['FRA', 'ESP']);
    state.champion = 'FRA';
    state.eliminated = new Set(['GER', 'POR', 'ESP']);
    state.alive = new Set();

    const result = scorePlayer(ASTU, state);
    const fraPoints = result.awards
      .filter((a) => a.team === 'FRA' && a.status === 'confirmed')
      .reduce((sum, a) => sum + a.points, 0);
    expect(fraPoints).toBe(20);
  });

  it('grants only +2 (base+1 for R16) for a team that lost in R16', () => {
    const state = emptyState();
    state.reached.r16 = new Set(['GER']);
    state.eliminated = new Set(['GER']);
    state.alive.delete('GER');

    const result = scorePlayer(ASTU, state);
    const gerAwards = result.awards.filter((a) => a.team === 'GER');
    const gerConfirmed = gerAwards
      .filter((a) => a.status === 'confirmed')
      .reduce((sum, a) => sum + a.points, 0);
    expect(gerConfirmed).toBe(2);
  });

  it('grants +5 for an exact third-place hit', () => {
    const state = emptyState();
    state.thirdPlaceWinner = 'ARG';
    const result = scorePlayer(ASTU, state);
    const third = result.awards.find((a) => a.key === 'third');
    expect(third?.status).toBe('confirmed');
    expect(third?.points).toBe(5);
  });

  it('marks third-place pick as lost when team reached the final', () => {
    const state = emptyState();
    state.reached.final = new Set(['ARG', 'FRA']);
    const result = scorePlayer(ASTU, state);
    const third = result.awards.find((a) => a.key === 'third');
    expect(third?.status).toBe('lost');
  });

  it('marks champion as lost once another team is crowned', () => {
    const state = emptyState();
    state.champion = 'ESP';
    const result = scorePlayer(ASTU, state);
    const championAward = result.awards.find((a) => a.key === 'champion');
    expect(championAward?.status).toBe('lost');
  });
});

describe('parseTournament — reached propagation', () => {
  function rawWith(
    matches: Array<{
      round: string;
      num: number;
      team1: string;
      team2: string;
      score?: { ft?: [number, number]; p?: [number, number] };
    }>,
  ): RawWorldCup {
    return {
      name: 'WC 2026 test',
      matches: matches.map((m) => ({
        round: m.round,
        num: m.num,
        date: '2026-06-30',
        team1: m.team1,
        team2: m.team2,
        score: m.score,
      })),
    };
  }

  it('counts R32 winners as having reached R16 even if R16 placeholders are not yet propagated', () => {
    const raw = rawWith([
      // South Africa eliminated, Canada through
      {
        round: 'Round of 32',
        num: 73,
        team1: 'South Africa',
        team2: 'Canada',
        score: { ft: [0, 1] },
      },
      // Morocco won on penalties vs Netherlands
      {
        round: 'Round of 32',
        num: 75,
        team1: 'Netherlands',
        team2: 'Morocco',
        score: { ft: [1, 1], p: [2, 3] },
      },
      // R16 match still has placeholder for Morocco's side
      {
        round: 'Round of 16',
        num: 90,
        team1: 'Canada',
        team2: 'W75',
      },
    ]);
    const state = parseTournament(raw);
    expect(state.reached.r16.has('CAN')).toBe(true);
    expect(state.reached.r16.has('MAR')).toBe(true);
    expect(state.eliminated.has('NED')).toBe(true);
    expect(state.alive.has('MAR')).toBe(true);
  });

  it('propagates winners through every knockout round', () => {
    const raw = rawWith([
      {
        round: 'Quarter-final',
        num: 97,
        team1: 'France',
        team2: 'Spain',
        score: { ft: [2, 1] },
      },
    ]);
    const state = parseTournament(raw);
    expect(state.reached.qf.has('FRA')).toBe(true);
    expect(state.reached.qf.has('ESP')).toBe(true);
    expect(state.reached.sf.has('FRA')).toBe(true);
    expect(state.reached.sf.has('ESP')).toBe(false);
    expect(state.eliminated.has('ESP')).toBe(true);
  });
});

describe('rankByConfirmed', () => {
  it('keeps tied players at the same rank and skips the next', () => {
    const players: Player[] = [
      { ...ASTU, name: 'A' },
      { ...ASTU, name: 'B' },
      { ...ASTU, name: 'C' },
    ];
    const state = emptyState();
    state.reached.r16 = new Set(['GER', 'FRA']);

    const scores = scoreAllPlayers(players, state);
    const ranked = rankByConfirmed(scores);
    expect(ranked[0]!.rank).toBe(1);
    expect(ranked[1]!.rank).toBe(1);
    expect(ranked[2]!.rank).toBe(1);
  });

  it('places lower scores after a shared top rank', () => {
    const a: Player = { ...ASTU, name: 'A' };
    const b: Player = {
      ...ASTU,
      name: 'B',
      picks: { ...ASTU.picks, r16: [] },
    };
    const c: Player = {
      ...ASTU,
      name: 'C',
      picks: { ...ASTU.picks, r16: [] },
    };
    const state = emptyState();
    state.reached.r16 = new Set(['GER']);

    const scores = scoreAllPlayers([a, b, c], state);
    const ranked = rankByConfirmed(scores);
    expect(ranked[0]!.player.name).toBe('A');
    expect(ranked[0]!.rank).toBe(1);
    expect(ranked[1]!.rank).toBe(2);
    expect(ranked[2]!.rank).toBe(2);
  });
});
