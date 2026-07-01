import type {
  ParsedMatch,
  Player,
  RoundKey,
  TeamCode,
} from '../types/domain';
import { POINTS } from './scoring';

export interface PlayerStake {
  player: Player;
  ifTeam1: number;
  ifTeam2: number;
  max: number;
}

type PickField =
  | 'r32'
  | 'r16'
  | 'qf'
  | 'sf'
  | 'final'
  | 'champion'
  | 'third';

const ROUND_FIELDS: Record<RoundKey, PickField[]> = {
  r32: ['r32'],
  r16: ['r16'],
  qf: ['qf'],
  sf: ['sf', 'final'],
  thirdPlace: ['third'],
  final: ['champion'],
};

function pointsIfWon(
  match: ParsedMatch,
  winner: TeamCode,
  player: Player,
): number {
  const fields = ROUND_FIELDS[match.round];
  let sum = 0;
  for (const f of fields) {
    switch (f) {
      case 'r32':
        if (player.picks.r32.includes(winner)) sum += POINTS.r32;
        break;
      case 'r16':
        if (player.picks.r16.includes(winner)) sum += POINTS.r16;
        break;
      case 'qf':
        if (player.picks.qf.includes(winner)) sum += POINTS.qf;
        break;
      case 'sf':
        if (player.picks.sf.includes(winner)) sum += POINTS.sf;
        break;
      case 'final':
        if (player.picks.final === winner) sum += POINTS.final;
        break;
      case 'champion':
        if (player.picks.champion === winner) sum += POINTS.champion;
        break;
      case 'third':
        if (player.picks.third === winner) sum += POINTS.third;
        break;
    }
  }
  return sum;
}

export function stakesForMatch(
  match: ParsedMatch,
  players: Player[],
): PlayerStake[] {
  const t1 = match.team1.code;
  const t2 = match.team2.code;
  return players.map((player) => {
    const ifTeam1 = t1 ? pointsIfWon(match, t1, player) : 0;
    const ifTeam2 = t2 ? pointsIfWon(match, t2, player) : 0;
    return { player, ifTeam1, ifTeam2, max: Math.max(ifTeam1, ifTeam2) };
  });
}
