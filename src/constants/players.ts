import type { Player } from '../types/domain';

export const PLAYERS: Player[] = [
  {
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
  },
  {
    name: 'Lema',
    abbr: 'LE',
    color: '#10b981',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'SEN',
        'BRA', 'NOR', 'MEX', 'ENG', 'ARG', 'EGY', 'SUI', 'COL',
      ],
      r16: ['FRA', 'NED', 'ESP', 'SEN', 'BRA', 'ENG', 'ARG', 'COL'],
      qf: ['FRA', 'ESP', 'BRA', 'ARG'],
      sf: ['FRA', 'BRA'],
      third: 'ESP',
      final: 'BRA',
      champion: 'FRA',
    },
  },
  {
    name: 'Mich',
    abbr: 'MI',
    color: '#8b5cf6',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'MAR', 'CRO', 'ESP', 'BIH', 'BEL',
        'BRA', 'CIV', 'ECU', 'ENG', 'ARG', 'EGY', 'DZA', 'COL',
      ],
      r16: ['FRA', 'MAR', 'ESP', 'BEL', 'CIV', 'ENG', 'ARG', 'COL'],
      qf: ['FRA', 'ESP', 'ENG', 'COL'],
      sf: ['ESP', 'ENG'],
      third: 'FRA',
      final: 'ENG',
      champion: 'ESP',
    },
  },
  {
    name: 'Noya',
    abbr: 'NO',
    color: '#f59e0b',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'BIH', 'BEL',
        'BRA', 'NOR', 'ECU', 'ENG', 'ARG', 'EGY', 'DZA', 'GHA',
      ],
      r16: ['FRA', 'NED', 'ESP', 'BEL', 'NOR', 'ENG', 'ARG', 'DZA'],
      qf: ['FRA', 'ESP', 'ENG', 'ARG'],
      sf: ['ESP', 'ARG'],
      third: 'ING',
      final: 'ARG',
      champion: 'ESP',
    },
  },
  {
    name: 'Pastrana',
    abbr: 'PA',
    color: '#ef4444',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL',
        'BRA', 'NOR', 'ECU', 'ENG', 'ARG', 'AUS', 'SUI', 'COL',
      ],
      r16: ['FRA', 'NED', 'ESP', 'USA', 'BRA', 'ENG', 'ARG', 'COL'],
      qf: ['FRA', 'ESP', 'ENG', 'ARG'],
      sf: ['FRA', 'ARG'],
      third: 'ESP',
      final: 'ARG',
      champion: 'FRA',
    },
  },
  {
    name: 'Pedro',
    abbr: 'PE',
    color: '#06b6d4',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'MAR', 'POR', 'ESP', 'USA', 'BEL',
        'BRA', 'NOR', 'ECU', 'ENG', 'ARG', 'EGY', 'DZA', 'COL',
      ],
      r16: ['FRA', 'CAN', 'ESP', 'USA', 'BRA', 'ENG', 'ARG', 'COL'],
      qf: ['FRA', 'ESP', 'ENG', 'ARG'],
      sf: ['ESP', 'ARG'],
      third: 'FRA',
      final: 'ARG',
      champion: 'ESP',
    },
  },
  {
    name: 'Redon',
    abbr: 'RE',
    color: '#ec4899',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'MAR', 'POR', 'ESP', 'USA', 'BEL',
        'BRA', 'NOR', 'MEX', 'ENG', 'ARG', 'EGY', 'SUI', 'COL',
      ],
      r16: ['FRA', 'MAR', 'ESP', 'USA', 'BRA', 'ENG', 'ARG', 'COL'],
      qf: ['FRA', 'ESP', 'ENG', 'ARG'],
      sf: ['FRA', 'ARG'],
      third: 'ESP',
      final: 'ARG',
      champion: 'FRA',
    },
  },
  {
    name: 'Xinho',
    abbr: 'XI',
    color: '#f97316',
    picks: {
      r32: [
        'GER', 'FRA', 'CAN', 'MAR', 'POR', 'ESP', 'BIH', 'SEN',
        'BRA', 'CIV', 'MEX', 'ENG', 'ARG', 'EGY', 'DZA', 'COL',
      ],
      r16: ['FRA', 'MAR', 'ESP', 'SEN', 'BRA', 'ENG', 'ARG', 'COL'],
      qf: ['FRA', 'ESP', 'BRA', 'COL'],
      sf: ['ESP', 'BRA'],
      third: 'FRA',
      final: 'BRA',
      champion: 'ESP',
    },
  },
];

export const PREDICTION_IMAGES: Record<string, string> = {
  Astu: 'Astu2026.jpeg',
  Lema: 'Lema2026.png',
  Mich: 'Mich2026.png',
  Noya: 'Noya2026.png',
  Pastrana: 'Pastrana2026.jpeg',
  Pedro: 'Pedro2026.png',
  Redon: 'Redon2026.png',
  Xinho: 'Xinho2026.png',
};
