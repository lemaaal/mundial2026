import type { Player } from '../types/domain';

export const PLAYERS: Player[] = [
  {
    name: 'Astu',
    abbr: 'AS',
    color: '#2a78d6',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL'],
      qf: ['GER', 'FRA', 'POR', 'ESP'],
      sf: ['FRA', 'ESP'],
      third: 'ARG',
      final: 'FRA',
      champion: 'FRA',
    },
  },
  {
    name: 'Lema',
    abbr: 'LE',
    color: '#10b981',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL'],
      qf: ['GER', 'FRA', 'POR', 'ESP'],
      sf: ['FRA', 'ESP'],
      third: 'ARG',
      final: 'FRA',
      champion: 'FRA',
    },
  },
  {
    name: 'Mich',
    abbr: 'MI',
    color: '#8b5cf6',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'MAR', 'ESP', 'POR', 'USA', 'BEL'],
      qf: ['FRA', 'MAR', 'ESP', 'USA'],
      sf: ['ESP', 'FRA'],
      third: 'COL',
      final: 'ESP',
      champion: 'ESP',
    },
  },
  {
    name: 'Noya',
    abbr: 'NO',
    color: '#f59e0b',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL'],
      qf: ['GER', 'FRA', 'ESP', 'BEL'],
      sf: ['FRA', 'ESP'],
      third: 'ARG',
      final: 'ESP',
      champion: 'ESP',
    },
  },
  {
    name: 'Pastrana',
    abbr: 'PA',
    color: '#ef4444',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'BEL', 'SEN'],
      qf: ['FRA', 'NED', 'ESP', 'BEL'],
      sf: ['FRA', 'ESP'],
      third: 'ARG',
      final: 'FRA',
      champion: 'FRA',
    },
  },
  {
    name: 'Pedro',
    abbr: 'PE',
    color: '#06b6d4',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'BEL'],
      qf: ['GER', 'FRA', 'ESP', 'USA'],
      sf: ['FRA', 'ESP'],
      third: 'ENG',
      final: 'ESP',
      champion: 'ESP',
    },
  },
  {
    name: 'Redon',
    abbr: 'RE',
    color: '#ec4899',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'POR', 'ESP', 'USA', 'SEN'],
      qf: ['FRA', 'NED', 'ESP', 'USA'],
      sf: ['FRA', 'ESP'],
      third: 'ARG',
      final: 'FRA',
      champion: 'FRA',
    },
  },
  {
    name: 'Xinho',
    abbr: 'XI',
    color: '#f97316',
    picks: {
      r16: ['GER', 'FRA', 'CAN', 'NED', 'CRO', 'ESP', 'USA', 'BEL'],
      qf: ['FRA', 'NED', 'ESP', 'USA'],
      sf: ['FRA', 'ESP'],
      third: 'BRA',
      final: 'ESP',
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
