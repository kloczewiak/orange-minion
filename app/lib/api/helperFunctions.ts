import { Cluster, Region } from './riotTypes';

export const getApiUrl = (region: Cluster | Region) =>
  `https://${region.toLowerCase()}.api.riotgames.com`;

export const getFetchConfig = (): RequestInit => {
  if (!process.env.RIOT_API_KEY) throw new Error('Riot API key not found.');

  return {
    headers: {
      'X-Riot-Token': process.env.RIOT_API_KEY,
    },
  };
};

export const getSummonerIconUrl = (iconId: number) =>
  `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`;
