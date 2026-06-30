import type { TeamCode } from '../types/domain';
import teamCodesJson from './teamCodes.json';
import teamFlagsJson from './teamFlags.json';

const nameToCode = teamCodesJson as Record<string, TeamCode>;
const codeToFlag = teamFlagsJson as Record<TeamCode, string>;

const codeToNameMap: Record<TeamCode, string> = Object.fromEntries(
  Object.entries(nameToCode).map(([name, code]) => [code, name]),
);

export function codeFromName(name: string): TeamCode | null {
  return nameToCode[name] ?? null;
}

export function nameFromCode(code: TeamCode): string {
  return codeToNameMap[code] ?? code;
}

export function flagIsoFromCode(code: TeamCode | null): string | null {
  if (!code) return null;
  return codeToFlag[code] ?? null;
}

export function isPlaceholder(name: string): boolean {
  return /^[WL]\d+$/.test(name);
}

export const ALL_TEAM_CODES: TeamCode[] = Object.values(nameToCode);
