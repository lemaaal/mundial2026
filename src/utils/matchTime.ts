import type { ParsedMatch } from '../types/domain';

const TIME_RE = /^(\d{1,2}):(\d{2})\s*UTC\s*([-+]\d+)?/;

/**
 * Parse an openfootball match date + time (e.g. "2026-06-30" + "13:00 UTC-6")
 * into a Date. Returns null if the date is unparseable.
 */
export function matchKickoff(
  date: string,
  time: string | undefined,
): Date | null {
  if (!time) {
    const d = new Date(`${date}T12:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const m = TIME_RE.exec(time);
  if (!m) {
    const d = new Date(`${date}T12:00:00Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const hh = m[1]!.padStart(2, '0');
  const mm = m[2]!;
  const offRaw = m[3] ?? '+0';
  const offNum = Number.parseInt(offRaw, 10);
  const sign = offNum < 0 ? '-' : '+';
  const abs = Math.abs(offNum).toString().padStart(2, '0');
  const offset = `${sign}${abs}:00`;
  const iso = `${date}T${hh}:${mm}:00${offset}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Kickoff Date for a parsed match, or null if unavailable. */
export function kickoffOf(match: ParsedMatch): Date | null {
  return matchKickoff(match.date, match.time);
}

const LIVE_WINDOW_MS = 120 * 60 * 1000;

/**
 * Heuristic for "probably in progress" based on openfootball data.
 * openfootball is not real-time; a match without a score whose kickoff was in
 * the last ~120 minutes is treated as probably in progress.
 */
export function isProbablyLive(match: ParsedMatch, now = new Date()): boolean {
  if (match.played) return false;
  const dt = kickoffOf(match);
  if (!dt) return false;
  const delta = now.getTime() - dt.getTime();
  return delta >= 0 && delta <= LIVE_WINDOW_MS;
}

export function isUpcoming(match: ParsedMatch, now = new Date()): boolean {
  if (match.played) return false;
  const dt = kickoffOf(match);
  if (!dt) return false;
  return dt.getTime() > now.getTime();
}

/** Localised absolute datetime, e.g. "sáb 4 jul, 19:00". */
export function formatKickoff(match: ParsedMatch): string {
  const dt = kickoffOf(match);
  if (!dt) return match.date;
  const dtf = new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  return dtf.format(dt);
}

/** Relative countdown ("en 2h 34min", "mañana 21:00", "en 5 días"). */
export function relativeKickoff(
  match: ParsedMatch,
  now = new Date(),
): string {
  const dt = kickoffOf(match);
  if (!dt) return '';
  const diff = dt.getTime() - now.getTime();
  if (diff <= 0) return 'ya empezó';
  const min = Math.round(diff / 60000);
  if (min < 60) return `en ${min} min`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  if (h < 24) return rem > 0 ? `en ${h}h ${rem}min` : `en ${h}h`;
  const days = Math.floor(h / 24);
  const hourStr = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dt);
  if (days === 1) return `mañana ${hourStr}`;
  if (days < 7) return `en ${days} días`;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(dt);
}

/** Rough time-elapsed indicator for live matches, e.g. "+37 min". */
export function elapsedMinutes(match: ParsedMatch, now = new Date()): number {
  const dt = kickoffOf(match);
  if (!dt) return 0;
  return Math.max(0, Math.floor((now.getTime() - dt.getTime()) / 60000));
}
