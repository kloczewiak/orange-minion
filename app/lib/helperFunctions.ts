import {
  Champion,
  ChampionSkinTable,
  ChampionSummaryItem,
  Cluster,
  Item,
  Queue,
  Region,
} from './api/riot/riotTypes';
import { regionCodeMap, regionMap } from './constants';
import { RegionReadable } from './types';

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

export const getChampionSummaryTable = async (): Promise<
  ChampionSummaryItem[]
> => {
  const response = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json',
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!response.ok) throw new Error('Failed to fetch summoner lookup table.');

  return await response.json();
};

export const getChampionSummary = async (
  championId: number,
): Promise<ChampionSummaryItem> => {
  const summaries = await getChampionSummaryTable();
  const summary = summaries.find((s) => s.id === championId);
  if (!summary)
    throw new Error(
      `Champion with id: ${championId} not found on lookup list.`,
    );

  return summary;
};

export const getChampionSkinTable = async (
  championId: number,
): Promise<ChampionSkinTable> => {
  const jsonPath =
    championId < 3000
      ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`
      : `https://raw.communitydragon.org/14.18/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`;

  const response = await fetch(jsonPath, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok)
    throw new Error('Failed to fetch champion skin lookup table.');

  return await response.json();
};

export const getChampionTileUrl = async (
  championId: number,
): Promise<string> => {
  const skinTable = await getChampionSkinTable(championId);

  const championSkinTable = skinTable.skins[0];

  let adjustedUrl = getAdjustedImageUrl(championSkinTable.tilePath);

  if (championId > 3000) {
    adjustedUrl = adjustedUrl.replace('latest', '14.18');
  }

  return adjustedUrl;
};

export const getAdjustedImageUrl = (path: string): string => {
  const pathSplit = path.split('/');

  const pathAdjusted =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-' +
    pathSplit[1].toLowerCase() +
    '/global/default/' +
    pathSplit.slice(3).join('/').toLowerCase();

  return pathAdjusted;
};

export const getReadableRegion = (region: Region): RegionReadable =>
  regionMap[region];

export const getRegionCode = (regionReadable: RegionReadable): Region =>
  regionCodeMap[regionReadable];

export const getCluster = (region: Region): Cluster => {
  switch (region) {
    case 'NA1':
    case 'BR1':
    case 'LA1':
    case 'LA2':
      return 'AMERICAS';
    case 'KR':
    case 'JP1':
      return 'ASIA';
    case 'EUN1':
    case 'EUW1':
    case 'ME1':
    case 'TR1':
    case 'RU':
      return 'EUROPE';
    case 'OC1':
    case 'PH2':
    case 'SG2':
    case 'TH2':
    case 'TW2':
    case 'VN2':
      return 'SEA';
  }
};

export async function getItemsLookupTable(): Promise<Item[]> {
  const response = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json',
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!response.ok) {
    throw new Error('Failed to get items lookup table.');
  }

  return await response.json();
}

export async function getQueuesLookupTable(): Promise<Queue[]> {
  const response = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/queues.json',
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!response.ok) {
    throw new Error('Failed to get queues lookup table.');
  }

  return await response.json();
}

export async function getChampionsLookupTable(): Promise<Champion[]> {
  const response = await fetch(
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json',
    { next: { revalidate: 60 * 60 * 24 } },
  );

  if (!response.ok) {
    throw new Error('Failed to get champions lookup table.');
  }

  return await response.json();
}

// Unfortunately Riot removed all swarm champions from the champion-summary.json file so I have to use the old version as backup
export function getSwarmChampionLookupTable(): Champion[] {
  const json = `[{"id":3147,"name":"Riven","alias":"Strawberry_Riven","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3147.png","roles":["fighter","assassin"]},{"id":3151,"name":"Jinx","alias":"Strawberry_Jinx","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3151.png","roles":["marksman"]},{"id":3152,"name":"Leona","alias":"Strawberry_Leona","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3152.png","roles":["tank","support"]},{"id":3153,"name":"Seraphine","alias":"Strawberry_Seraphine","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3153.png","roles":["mage","support"]},{"id":3156,"name":"Briar","alias":"Strawberry_Briar","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3156.png","roles":["fighter","assassin"]},{"id":3157,"name":"Yasuo","alias":"Strawberry_Yasuo","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3157.png","roles":["fighter","assassin"]},{"id":3159,"name":"Aurora","alias":"Strawberry_Aurora","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3159.png","roles":["mage","assassin"]},{"id":3678,"name":"Illaoi","alias":"Strawberry_Illaoi","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3678.png","roles":["fighter","tank"]},{"id":3947,"name":"Xayah","alias":"Strawberry_Xayah","squarePortraitPath":"/lol-game-data/assets/v1/champion-icons/3947.png","roles":["marksman"]}]`;

  const data: Champion[] = JSON.parse(json);

  return data;
}
