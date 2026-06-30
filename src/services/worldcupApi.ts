import type {
  ParsedMatch,
  RawScore,
  RawWorldCup,
  RoundKey,
  TeamCode,
  TournamentState,
  MatchSide,
} from '../types/domain';
import { codeFromName, isPlaceholder } from '../constants/teamMaps';

export const WORLDCUP_JSON_URL =
  'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

const ROUND_NAME_TO_KEY: Record<string, RoundKey> = {
  'Round of 32': 'r32',
  'Round of 16': 'r16',
  'Quarter-final': 'qf',
  'Semi-final': 'sf',
  'Match for third place': 'thirdPlace',
  Final: 'final',
};

const KNOCKOUT_ROUNDS: RoundKey[] = [
  'r32',
  'r16',
  'qf',
  'sf',
  'thirdPlace',
  'final',
];

function makeSide(rawName: string): MatchSide {
  if (isPlaceholder(rawName)) {
    return { code: null, rawName, resolved: false };
  }
  return { code: codeFromName(rawName), rawName, resolved: true };
}

const PLACEHOLDER_RE = /^([WL])(\d+)$/;

function resolvePlaceholders(
  matchesByRound: Record<RoundKey, ParsedMatch[]>,
  byNum: Map<number, ParsedMatch>,
): void {
  let changed = true;
  let safety = 8;
  while (changed && safety-- > 0) {
    changed = false;
    for (const round of KNOCKOUT_ROUNDS) {
      for (const match of matchesByRound[round]) {
        let sideChanged = false;
        for (const sideKey of ['team1', 'team2'] as const) {
          const side = match[sideKey];
          if (side.resolved) continue;
          const m = PLACEHOLDER_RE.exec(side.rawName);
          if (!m) continue;
          const refNum = Number.parseInt(m[2]!, 10);
          const refMatch = byNum.get(refNum);
          if (!refMatch || !refMatch.played) continue;
          const target = m[1] === 'W' ? refMatch.winner : refMatch.loser;
          if (!target) continue;
          match[sideKey] = {
            code: target,
            rawName: target,
            resolved: true,
          };
          changed = true;
          sideChanged = true;
        }
        if (sideChanged) {
          // Recompute outcome now that the sides have real team codes;
          // a score that was sitting on a placeholder match becomes valid.
          const outcome = decideOutcome(
            match.team1.code,
            match.team2.code,
            match.score,
          );
          match.played = outcome.played;
          match.winner = outcome.winner;
          match.loser = outcome.loser;
        }
      }
    }
  }
}

export function decideOutcome(
  team1Code: TeamCode | null,
  team2Code: TeamCode | null,
  score: RawScore | undefined,
): { winner: TeamCode | null; loser: TeamCode | null; played: boolean } {
  if (!score || !score.ft || !team1Code || !team2Code) {
    return { winner: null, loser: null, played: false };
  }

  let winnerSide: 1 | 2 | null = null;

  if (score.p) {
    if (score.p[0] > score.p[1]) winnerSide = 1;
    else if (score.p[1] > score.p[0]) winnerSide = 2;
  } else if (score.et) {
    if (score.et[0] > score.et[1]) winnerSide = 1;
    else if (score.et[1] > score.et[0]) winnerSide = 2;
  } else {
    if (score.ft[0] > score.ft[1]) winnerSide = 1;
    else if (score.ft[1] > score.ft[0]) winnerSide = 2;
  }

  if (winnerSide === null) {
    return { winner: null, loser: null, played: true };
  }
  const winner = winnerSide === 1 ? team1Code : team2Code;
  const loser = winnerSide === 1 ? team2Code : team1Code;
  return { winner, loser, played: true };
}

export function parseTournament(raw: RawWorldCup): TournamentState {
  const matchesByRound: Record<RoundKey, ParsedMatch[]> = {
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    thirdPlace: [],
    final: [],
  };

  for (const m of raw.matches) {
    const roundKey = ROUND_NAME_TO_KEY[m.round];
    if (!roundKey) continue;

    const team1 = makeSide(m.team1);
    const team2 = makeSide(m.team2);
    const { winner, loser, played } = decideOutcome(
      team1.code,
      team2.code,
      m.score,
    );

    matchesByRound[roundKey].push({
      round: roundKey,
      num: m.num ?? 0,
      date: m.date,
      ground: m.ground,
      team1,
      team2,
      score: m.score,
      played,
      winner,
      loser,
    });
  }

  for (const round of KNOCKOUT_ROUNDS) {
    matchesByRound[round].sort((a, b) => a.num - b.num);
  }

  // openfootball can lag writing "Winner of #74" back as "Paraguay" in the
  // R16 placeholder. Resolve W{n}/L{n} ourselves so the bracket UI and any
  // downstream logic see the real team code as soon as the prior match
  // has a determined winner. Iterates because chains like #97=W89=W74 exist.
  const byNum = new Map<number, ParsedMatch>();
  for (const round of KNOCKOUT_ROUNDS) {
    for (const match of matchesByRound[round]) {
      byNum.set(match.num, match);
    }
  }
  resolvePlaceholders(matchesByRound, byNum);

  const reached: Record<RoundKey, Set<TeamCode>> = {
    r32: new Set(),
    r16: new Set(),
    qf: new Set(),
    sf: new Set(),
    thirdPlace: new Set(),
    final: new Set(),
  };

  // Direct participants in each round (whose name is already resolved).
  for (const round of KNOCKOUT_ROUNDS) {
    for (const match of matchesByRound[round]) {
      if (match.team1.code) reached[round].add(match.team1.code);
      if (match.team2.code) reached[round].add(match.team2.code);
    }
  }

  // openfootball can lag on propagating R32 winners to R16 placeholders
  // (and similar for later rounds). A team that wins round N has reached
  // round N+1 even if its name hasn't been written into that match yet.
  const PROGRESSION: Array<[RoundKey, RoundKey]> = [
    ['r32', 'r16'],
    ['r16', 'qf'],
    ['qf', 'sf'],
    ['sf', 'final'],
  ];
  for (const [from, to] of PROGRESSION) {
    for (const match of matchesByRound[from]) {
      if (match.played && match.winner) reached[to].add(match.winner);
    }
  }

  const eliminated = new Set<TeamCode>();
  for (const round of KNOCKOUT_ROUNDS) {
    if (round === 'thirdPlace') continue;
    for (const match of matchesByRound[round]) {
      if (match.played && match.loser) eliminated.add(match.loser);
    }
  }

  const finalMatch = matchesByRound.final[0];
  let champion: TeamCode | null = null;
  if (finalMatch && finalMatch.played) {
    champion = finalMatch.winner;
    if (finalMatch.loser) eliminated.add(finalMatch.loser);
  }

  const thirdMatch = matchesByRound.thirdPlace[0];
  const thirdPlaceWinner =
    thirdMatch && thirdMatch.played ? thirdMatch.winner : null;

  const allTeams = new Set<TeamCode>();
  for (const round of KNOCKOUT_ROUNDS) {
    for (const match of matchesByRound[round]) {
      if (match.team1.code) allTeams.add(match.team1.code);
      if (match.team2.code) allTeams.add(match.team2.code);
    }
  }
  const alive = new Set<TeamCode>();
  for (const t of allTeams) {
    if (!eliminated.has(t)) alive.add(t);
  }

  return {
    matchesByRound,
    reached,
    champion,
    thirdPlaceWinner,
    eliminated,
    alive,
    lastUpdate: new Date().toISOString(),
  };
}

export async function fetchWorldCup(signal?: AbortSignal): Promise<RawWorldCup> {
  const response = await fetch(WORLDCUP_JSON_URL, { signal });
  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el JSON del Mundial (${response.status})`,
    );
  }
  return (await response.json()) as RawWorldCup;
}

export async function fetchTournament(
  signal?: AbortSignal,
): Promise<TournamentState> {
  const raw = await fetchWorldCup(signal);
  return parseTournament(raw);
}
