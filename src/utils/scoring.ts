import type {
  MilestoneAward,
  Player,
  PlayerScore,
  RoundKey,
  TeamCode,
  TournamentState,
} from '../types/domain';

export const POINTS = {
  r32: 2,
  r16: 3,
  qf: 4,
  sf: 5,
  final: 5,
  champion: 6,
  third: 5,
} as const;

const LABEL = {
  r32: '16avos',
  r16: 'Octavos',
  qf: 'Cuartos',
  sf: 'Semis',
  final: 'Final',
  champion: 'Campeón',
  third: '3er puesto',
} as const;

function evalReachMilestone(
  key: 'r32' | 'r16' | 'qf' | 'sf' | 'final',
  team: TeamCode,
  reachedRound: RoundKey,
  state: TournamentState,
): MilestoneAward {
  const reached = state.reached[reachedRound].has(team);
  if (reached) {
    return {
      key,
      label: LABEL[key],
      points: POINTS[key],
      team,
      status: 'confirmed',
    };
  }
  if (state.alive.has(team)) {
    return {
      key,
      label: LABEL[key],
      points: POINTS[key],
      team,
      status: 'potential',
    };
  }
  return {
    key,
    label: LABEL[key],
    points: POINTS[key],
    team,
    status: 'lost',
  };
}

function evalChampion(team: TeamCode, state: TournamentState): MilestoneAward {
  if (state.champion === team) {
    return {
      key: 'champion',
      label: LABEL.champion,
      points: POINTS.champion,
      team,
      status: 'confirmed',
    };
  }
  if (state.champion !== null) {
    return {
      key: 'champion',
      label: LABEL.champion,
      points: POINTS.champion,
      team,
      status: 'lost',
    };
  }
  if (state.alive.has(team)) {
    return {
      key: 'champion',
      label: LABEL.champion,
      points: POINTS.champion,
      team,
      status: 'potential',
    };
  }
  return {
    key: 'champion',
    label: LABEL.champion,
    points: POINTS.champion,
    team,
    status: 'lost',
  };
}

function evalThird(team: TeamCode, state: TournamentState): MilestoneAward {
  if (state.thirdPlaceWinner === team) {
    return {
      key: 'third',
      label: LABEL.third,
      points: POINTS.third,
      team,
      status: 'confirmed',
    };
  }
  if (state.thirdPlaceWinner !== null) {
    return {
      key: 'third',
      label: LABEL.third,
      points: POINTS.third,
      team,
      status: 'lost',
    };
  }
  const thirdMatch = state.matchesByRound.thirdPlace[0];
  if (
    thirdMatch &&
    (thirdMatch.team1.code === team || thirdMatch.team2.code === team)
  ) {
    return {
      key: 'third',
      label: LABEL.third,
      points: POINTS.third,
      team,
      status: 'potential',
    };
  }
  if (state.reached.final.has(team)) {
    return {
      key: 'third',
      label: LABEL.third,
      points: POINTS.third,
      team,
      status: 'lost',
    };
  }
  if (state.alive.has(team)) {
    return {
      key: 'third',
      label: LABEL.third,
      points: POINTS.third,
      team,
      status: 'potential',
    };
  }
  return {
    key: 'third',
    label: LABEL.third,
    points: POINTS.third,
    team,
    status: 'lost',
  };
}

export function scorePlayer(
  player: Player,
  state: TournamentState,
): PlayerScore {
  const awards: MilestoneAward[] = [];

  for (const team of player.picks.r32) {
    awards.push(evalReachMilestone('r32', team, 'r16', state));
  }
  for (const team of player.picks.r16) {
    awards.push(evalReachMilestone('r16', team, 'qf', state));
  }
  for (const team of player.picks.qf) {
    awards.push(evalReachMilestone('qf', team, 'sf', state));
  }
  for (const team of player.picks.sf) {
    awards.push(evalReachMilestone('sf', team, 'final', state));
  }
  awards.push(
    evalReachMilestone('final', player.picks.final, 'final', state),
  );
  awards.push(evalChampion(player.picks.champion, state));
  awards.push(evalThird(player.picks.third, state));

  let confirmedPoints = 0;
  let potentialPoints = 0;
  for (const a of awards) {
    if (a.status === 'confirmed') confirmedPoints += a.points;
    else if (a.status === 'potential') potentialPoints += a.points;
  }

  return {
    player,
    confirmedPoints,
    potentialPoints,
    totalPossiblePoints: confirmedPoints + potentialPoints,
    awards,
  };
}

export function scoreAllPlayers(
  players: Player[],
  state: TournamentState,
): PlayerScore[] {
  return players.map((p) => scorePlayer(p, state));
}

export interface RankedScore extends PlayerScore {
  rank: number;
}

export function rankByConfirmed(scores: PlayerScore[]): RankedScore[] {
  const sorted = [...scores].sort(
    (a, b) => b.confirmedPoints - a.confirmedPoints,
  );
  const ranked: RankedScore[] = [];
  let lastPoints: number | null = null;
  let lastRank = 0;
  sorted.forEach((s, idx) => {
    let rank: number;
    if (lastPoints !== null && s.confirmedPoints === lastPoints) {
      rank = lastRank;
    } else {
      rank = idx + 1;
      lastRank = rank;
      lastPoints = s.confirmedPoints;
    }
    ranked.push({ ...s, rank });
  });
  return ranked;
}
