import { Region, RegionReadable } from './riotTypes';

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

export const getReadableRegion = (region: Region): RegionReadable => {
  switch (region) {
    case 'BR1':
      return 'BR';
    case 'EUN1':
      return 'EUNE';
    case 'EUW1':
      return 'EUW';
    case 'JP1':
      return 'JP';
    case 'KR':
      return 'KR';
    case 'LA1':
      return 'LAN';
    case 'LA2':
      return 'LAS';
    case 'ME1':
      return 'ME';
    case 'NA1':
      return 'NA';
    case 'OC1':
      return 'OCE';
    case 'PH2':
      return 'PH';
    case 'RU':
      return 'RU';
    case 'SG2':
      return 'SG';
    case 'TH2':
      return 'TH';
    case 'TR1':
      return 'TR';
    case 'TW2':
      return 'TW';
    case 'VN2':
      return 'VN';
  }
};

export const getRegionCode = (regionReadable: RegionReadable): Region => {
  switch (regionReadable) {
    case 'BR':
      return 'BR1';
    case 'EUNE':
      return 'EUN1';
    case 'EUW':
      return 'EUW1';
    case 'JP':
      return 'JP1';
    case 'KR':
      return 'KR';
    case 'LAN':
      return 'LA1';
    case 'LAS':
      return 'LA2';
    case 'ME':
      return 'ME1';
    case 'NA':
      return 'NA1';
    case 'OCE':
      return 'OC1';
    case 'PH':
      return 'PH2';
    case 'RU':
      return 'RU';
    case 'SG':
      return 'SG2';
    case 'TH':
      return 'TH2';
    case 'TR':
      return 'TR1';
    case 'TW':
      return 'TW2';
    case 'VN':
      return 'VN2';
  }
};
