import {
  ChampionSkinTable,
  ChampionSummaryItem,
  Cluster,
  Region,
} from './riotTypes';

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
  const response = await fetch(
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champions/${championId}.json`,
  );

  if (!response.ok)
    throw new Error('Failed to fetch champion skin lookup table.');

  return await response.json();
};

export const getChampionTileUrl = async (
  championId: number,
): Promise<string> => {
  const skinTable = await getChampionSkinTable(championId);

  const championSkinTable = skinTable.skins[0];

  const adjustedPath =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/' +
    championSkinTable.tilePath
      .toLowerCase()
      .replace('/lol-game-data/assets/', '');

  return adjustedPath;
};
