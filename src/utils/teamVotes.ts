import type { MilestoneAward, Player, PlayerScore, TeamCode } from '../types/domain';

const KEY_PRIORITY: Record<MilestoneAward['key'], number> = {
  champion: 6,
  final: 5,
  sf: 4,
  qf: 3,
  r16: 2,
  r32: 1,
  third: 3,
};

const KEY_LABEL: Record<MilestoneAward['key'], string> = {
  champion: 'Campeón',
  final: 'Final',
  sf: 'Semis',
  qf: 'Cuartos',
  r16: 'Octavos',
  r32: '16avos',
  third: '3er puesto',
};

export interface TeamVote {
  player: Player;
  deepestLabel: string;
  potentialPoints: number;
  confirmedPoints: number;
  awards: MilestoneAward[];
}

/**
 * For a given team, list all the players who included it in any pick, the
 * deepest round they predicted for it, and the potential points still on the
 * table for that team.
 */
export function votesForTeam(
  team: TeamCode,
  playerScores: PlayerScore[],
): TeamVote[] {
  const result: TeamVote[] = [];
  for (const score of playerScores) {
    const teamAwards = score.awards.filter((a) => a.team === team);
    if (teamAwards.length === 0) continue;
    const potentialPoints = teamAwards
      .filter((a) => a.status === 'potential')
      .reduce((s, a) => s + a.points, 0);
    const confirmedPoints = teamAwards
      .filter((a) => a.status === 'confirmed')
      .reduce((s, a) => s + a.points, 0);
    const deepest = [...teamAwards].sort(
      (a, b) => KEY_PRIORITY[b.key] - KEY_PRIORITY[a.key],
    )[0]!;
    result.push({
      player: score.player,
      deepestLabel: KEY_LABEL[deepest.key],
      potentialPoints,
      confirmedPoints,
      awards: teamAwards,
    });
  }
  result.sort((a, b) => b.potentialPoints - a.potentialPoints);
  return result;
}
