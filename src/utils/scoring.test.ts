import { describe, it, expect } from 'vitest';
import {
  POINTS,
  scorePlayer,
  scoreAllPlayers,
  rankByConfirmed,
  calcTraditionalScore,
} from './scoring';
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
      'NOR',
      'MEX',
      'EGY',
      'SUI',
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
    r32: [
      'GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL',
      'BRA', 'NOR', 'MEX', 'ENG', 'ARG', 'EGY', 'SUI', 'COL',
    ],
    r16: ['FRA', 'NED', 'ESP', 'USA', 'NOR', 'ENG', 'ARG', 'COL'],
    qf: ['FRA', 'ESP', 'ENG', 'ARG'],
    sf: ['FRA', 'ENG'],
    third: 'ESP',
    final: 'ENG',
    champion: 'FRA',
  },
};

describe('point values use base+1 + acumulativo per round', () => {
  it('exposes the published values (2/3/4/5 + final 5 + champion 6 + third 5)', () => {
    expect(POINTS.r32).toBe(2);
    expect(POINTS.r16).toBe(3);
    expect(POINTS.qf).toBe(4);
    expect(POINTS.sf).toBe(5);
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

  it('awards 2+3+4+5+6 = 20 to a champion that wins every round', () => {
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

  it('awards 2+3+4+5+5 = 19 to a runner-up matching the `final` pick', () => {
    const state = emptyState();
    state.reached.r16 = new Set(['FRA', 'ENG']);
    state.reached.qf = new Set(['FRA', 'ENG']);
    state.reached.sf = new Set(['FRA', 'ENG']);
    state.reached.final = new Set(['FRA', 'ENG']);
    state.champion = 'FRA';
    state.eliminated = new Set(['ENG']);
    state.alive = new Set();

    const result = scorePlayer(ASTU, state);
    const engPoints = result.awards
      .filter((a) => a.team === 'ENG' && a.status === 'confirmed')
      .reduce((sum, a) => sum + a.points, 0);
    expect(engPoints).toBe(19);
  });

  it('grants only +2 for a team that lost in R16 (1 base + 1 acum)', () => {
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
    state.thirdPlaceWinner = 'ESP';
    const result = scorePlayer(ASTU, state);
    const third = result.awards.find((a) => a.key === 'third');
    expect(third?.status).toBe('confirmed');
    expect(third?.points).toBe(5);
  });

  it('marks third-place pick as lost when team reached the final', () => {
    const state = emptyState();
    state.reached.final = new Set(['ESP', 'FRA']);
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

describe('calcTraditionalScore', () => {
  it('starts at 0 confirmed when nothing has been played', () => {
    const state = emptyState();
    const result = calcTraditionalScore(ASTU, state);
    expect(result.confirmedPoints).toBe(0);
    expect(result.potentialPoints).toBeGreaterThan(0);
  });

  it('awards exactly 1 point per correct pick regardless of round', () => {
    const state = emptyState();
    state.reached.r16 = new Set(['FRA', 'GER', 'POR', 'ESP']);
    state.reached.qf = new Set(['FRA', 'POR', 'ESP']);
    state.reached.sf = new Set(['FRA', 'ESP']);
    state.reached.final = new Set(['FRA', 'ESP']);
    state.champion = 'FRA';
    state.eliminated = new Set(['GER', 'POR', 'ESP']);
    state.alive = new Set();

    const result = calcTraditionalScore(ASTU, state);

    // Every confirmed award must be worth exactly 1 point.
    for (const award of result.awards) {
      expect(award.points).toBe(1);
    }

    // Correct picks in this scenario:
    //  · 16avos: GER, FRA, POR, ESP        → 4
    //  · Octavos: FRA, ESP                 → 2
    //  · Cuartos: FRA, ESP                 → 2
    //  · Semis: FRA                        → 1
    //  · Campeón: FRA                      → 1
    // Total confirmed hits = 10, and no team is alive → 0 potential.
    expect(result.confirmedPoints).toBe(10);
    expect(result.potentialPoints).toBe(0);
  });

  it('is selectable through scoreAllPlayers', () => {
    const state = emptyState();
    state.reached.r16 = new Set(['GER']);
    state.eliminated = new Set(['GER']);
    state.alive.delete('GER');

    const [cumulative] = scoreAllPlayers([ASTU], state, 'cumulative');
    const [traditional] = scoreAllPlayers([ASTU], state, 'traditional');

    // A single R16 hit is worth 2 cumulatively (1 base + 1 acum) but 1 traditionally.
    expect(cumulative!.confirmedPoints).toBe(2);
    expect(traditional!.confirmedPoints).toBe(1);
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
      {
        round: 'Round of 32',
        num: 73,
        team1: 'South Africa',
        team2: 'Canada',
        score: { ft: [0, 1] },
      },
      {
        round: 'Round of 32',
        num: 75,
        team1: 'Netherlands',
        team2: 'Morocco',
        score: { ft: [1, 1], p: [2, 3] },
      },
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

  it('resolves a penalty shootout (1-1 ft, 3-4 pen) to the shootout winner', () => {
    const raw = rawWith([
      {
        round: 'Round of 32',
        num: 74,
        team1: 'Germany',
        team2: 'Paraguay',
        score: { ft: [1, 1], p: [3, 4] },
      },
    ]);
    const state = parseTournament(raw);
    const match = state.matchesByRound.r32[0]!;
    expect(match.played).toBe(true);
    expect(match.winner).toBe('PAR');
    expect(match.loser).toBe('GER');
    expect(state.reached.r16.has('PAR')).toBe(true);
    expect(state.eliminated.has('GER')).toBe(true);
  });

  it('substitutes W{n}/L{n} placeholders in later rounds with the resolved team', () => {
    const raw = rawWith([
      {
        round: 'Round of 32',
        num: 74,
        team1: 'Germany',
        team2: 'Paraguay',
        score: { ft: [1, 1], p: [3, 4] },
      },
      {
        round: 'Round of 16',
        num: 89,
        team1: 'W74',
        team2: 'W77',
      },
    ]);
    const state = parseTournament(raw);
    const r16Match = state.matchesByRound.r16.find((m) => m.num === 89)!;
    expect(r16Match.team1.code).toBe('PAR');
    expect(r16Match.team1.resolved).toBe(true);
    expect(r16Match.team2.code).toBe(null);
    expect(r16Match.team2.rawName).toBe('W77');
  });

  it('propagates resolution through chains of placeholders (#97 = W89 = W74)', () => {
    const raw = rawWith([
      {
        round: 'Round of 32',
        num: 74,
        team1: 'Germany',
        team2: 'Paraguay',
        score: { ft: [1, 1], p: [3, 4] },
      },
      {
        round: 'Round of 32',
        num: 77,
        team1: 'France',
        team2: 'Sweden',
        score: { ft: [2, 0] },
      },
      {
        round: 'Round of 16',
        num: 89,
        team1: 'W74',
        team2: 'W77',
        score: { ft: [0, 2] },
      },
      {
        round: 'Quarter-final',
        num: 97,
        team1: 'W89',
        team2: 'W90',
      },
    ]);
    const state = parseTournament(raw);
    const qf = state.matchesByRound.qf.find((m) => m.num === 97)!;
    expect(qf.team1.code).toBe('FRA');
    expect(qf.team1.resolved).toBe(true);
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
      picks: { ...ASTU.picks, r32: [], r16: [] },
    };
    const c: Player = {
      ...ASTU,
      name: 'C',
      picks: { ...ASTU.picks, r32: [], r16: [] },
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
