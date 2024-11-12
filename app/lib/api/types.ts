import { RegionReadable } from './riotTypes';

export type SummonerDetails = {
  tagline: string;
  gameName: string;
  profileIconId: number;
  summonerLevel: number;
};

export type RiotID = {
  tagline: string;
  gameName: string;
};

export type SearchHistoryItem = RiotID & {
  region: RegionReadable;
};
