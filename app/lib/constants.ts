import { Region } from './api/riot/riotTypes';
import { ColorStyles, RegionReadable } from './types';

export const allRegions: Region[] = [
  'BR1',
  'EUN1',
  'EUW1',
  'JP1',
  'KR',
  'LA1',
  'LA2',
  'ME1',
  'NA1',
  'OC1',
  'PH2',
  'RU',
  'SG2',
  'TH2',
  'TR1',
  'TW2',
  'VN2',
];

export const regionMap: Record<Region, RegionReadable> = {
  BR1: 'BR',
  EUN1: 'EUNE',
  EUW1: 'EUW',
  JP1: 'JP',
  KR: 'KR',
  LA1: 'LAN',
  LA2: 'LAS',
  ME1: 'ME',
  NA1: 'NA',
  OC1: 'OCE',
  PH2: 'PH',
  RU: 'RU',
  SG2: 'SG',
  TH2: 'TH',
  TR1: 'TR',
  TW2: 'TW',
  VN2: 'VN',
};

export const regionCodeMap: Record<RegionReadable, Region> = {
  BR: 'BR1',
  EUNE: 'EUN1',
  EUW: 'EUW1',
  JP: 'JP1',
  KR: 'KR',
  LAN: 'LA1',
  LAS: 'LA2',
  ME: 'ME1',
  NA: 'NA1',
  OCE: 'OC1',
  PH: 'PH2',
  RU: 'RU',
  SG: 'SG2',
  TH: 'TH2',
  TR: 'TR1',
  TW: 'TW2',
  VN: 'VN2',
};

export const arenaTeamNameMap: Record<number, string> = {
  1: 'Poro',
  2: 'Minion',
  3: 'Scuttle',
  4: 'Krug',
  5: 'Raptor',
  6: 'Sentinel',
  7: 'Wolf',
  8: 'Gromp',
};

export const arenaTeamColorMap: Record<number, ColorStyles> = {
  1: {
    bg: 'bg-blue-600/10',
    bgBright: 'bg-blue-600/40',
    text: 'text-blue-400',
  },
  2: {
    bg: 'bg-yellow-600/10',
    bgBright: 'bg-yellow-600/40',
    text: 'text-yellow-400',
  },
  3: {
    bg: 'bg-green-600/10',
    bgBright: 'bg-green-600/40',
    text: 'text-green-400',
  },
  4: {
    bg: 'bg-red-600/10',
    bgBright: 'bg-red-600/40',
    text: 'text-red-400',
  },
  5: {
    bg: 'bg-orange-600/10',
    bgBright: 'bg-orange-600/40',
    text: 'text-orange-400',
  },
  6: {
    bg: 'bg-gray-600/10',
    bgBright: 'bg-gray-600/40',
    text: 'text-gray-400',
  },
  7: {
    bg: 'bg-white/10',
    bgBright: 'bg-white/40',
    text: 'text-white',
  },
  8: {
    bg: 'bg-purple-600/10',
    bgBright: 'bg-purple-600/40',
    text: 'text-purple-400',
  },
};
