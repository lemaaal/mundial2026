import { describe, it, expect } from 'vitest';
import {
  isProbablyLive,
  isUpcoming,
  kickoffOf,
  matchKickoff,
} from './matchTime';
import type { ParsedMatch } from '../types/domain';

function makeMatch(
  date: string,
  time: string | undefined,
  played = false,
): ParsedMatch {
  return {
    round: 'r32',
    num: 1,
    date,
    time,
    team1: { code: 'FRA', rawName: 'France', resolved: true },
    team2: { code: 'GER', rawName: 'Germany', resolved: true },
    played,
    winner: null,
    loser: null,
  };
}

describe('matchKickoff', () => {
  it('parses openfootball time with negative UTC offset', () => {
    const d = matchKickoff('2026-06-30', '13:00 UTC-6');
    // 13:00 in UTC-6 == 19:00 UTC
    expect(d?.toISOString()).toBe('2026-06-30T19:00:00.000Z');
  });

  it('parses openfootball time with positive UTC offset', () => {
    const d = matchKickoff('2026-06-30', '13:00 UTC+2');
    expect(d?.toISOString()).toBe('2026-06-30T11:00:00.000Z');
  });

  it('falls back to noon UTC if time is missing', () => {
    const d = matchKickoff('2026-06-30', undefined);
    expect(d?.toISOString()).toBe('2026-06-30T12:00:00.000Z');
  });
});

describe('isProbablyLive / isUpcoming', () => {
  it('flags matches that started within the last 120 minutes as live', () => {
    const now = new Date('2026-07-01T21:00:00.000Z');
    // Kickoff was 60 minutes ago
    const match = makeMatch('2026-07-01', '15:00 UTC-5'); // 20:00 UTC
    expect(kickoffOf(match)?.toISOString()).toBe(
      '2026-07-01T20:00:00.000Z',
    );
    expect(isProbablyLive(match, now)).toBe(true);
    expect(isUpcoming(match, now)).toBe(false);
  });

  it('does not flag played matches as live', () => {
    const now = new Date('2026-07-01T21:00:00.000Z');
    const match = makeMatch('2026-07-01', '15:00 UTC-5', true);
    expect(isProbablyLive(match, now)).toBe(false);
  });

  it('flags future matches as upcoming', () => {
    const now = new Date('2026-07-01T10:00:00.000Z');
    const match = makeMatch('2026-07-01', '15:00 UTC-5');
    expect(isUpcoming(match, now)).toBe(true);
    expect(isProbablyLive(match, now)).toBe(false);
  });
});
