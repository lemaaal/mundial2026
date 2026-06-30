export type TeamCode = string;

export interface PlayerPicks {
  r16: TeamCode[];
  qf: TeamCode[];
  sf: TeamCode[];
  third: TeamCode;
  final: TeamCode;
  champion: TeamCode;
}

export interface Player {
  name: string;
  abbr: string;
  color: string;
  picks: PlayerPicks;
  /**
   * Optional avatar. If omitted, the component will probe
   * `public/img/perfiles/<slug(name)>.{jpg,jpeg,png,webp}` and fall back
   * to coloured initials if nothing is found.
   *
   * Accepts: a relative filename ("astu.jpg"), an absolute path
   * ("/img/perfiles/astu.jpg") or a full URL.
   */
  photo?: string;
}

export type RoundKey = 'r32' | 'r16' | 'qf' | 'sf' | 'thirdPlace' | 'final';

export const ROUND_LABEL: Record<RoundKey, string> = {
  r32: '16avos',
  r16: 'Octavos',
  qf: 'Cuartos',
  sf: 'Semifinales',
  thirdPlace: '3er puesto',
  final: 'Final',
};

export interface RawScore {
  ft?: [number, number];
  ht?: [number, number];
  et?: [number, number];
  p?: [number, number];
}

export interface RawMatch {
  round: string;
  num?: number;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: RawScore;
  group?: string;
  ground?: string;
}

export interface RawWorldCup {
  name: string;
  matches: RawMatch[];
}

export interface MatchSide {
  code: TeamCode | null;
  rawName: string;
  resolved: boolean;
}

export interface ParsedMatch {
  round: RoundKey;
  num: number;
  date: string;
  ground?: string;
  team1: MatchSide;
  team2: MatchSide;
  score?: RawScore;
  played: boolean;
  winner: TeamCode | null;
  loser: TeamCode | null;
}

export interface TournamentState {
  matchesByRound: Record<RoundKey, ParsedMatch[]>;
  reached: Record<RoundKey, Set<TeamCode>>;
  champion: TeamCode | null;
  thirdPlaceWinner: TeamCode | null;
  eliminated: Set<TeamCode>;
  alive: Set<TeamCode>;
  lastUpdate: string;
}

export interface MilestoneAward {
  key: 'r16' | 'qf' | 'sf' | 'final' | 'champion' | 'third';
  label: string;
  points: number;
  team: TeamCode;
  status: 'confirmed' | 'potential' | 'lost';
}

export interface PlayerScore {
  player: Player;
  confirmedPoints: number;
  potentialPoints: number;
  totalPossiblePoints: number;
  awards: MilestoneAward[];
}
