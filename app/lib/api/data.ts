'use server';

import { getApiUrl, getCluster, getFetchConfig } from './helperFunctions';
import {
  AccountDto,
  ChampionInfo,
  ChampionMasteryDto,
  Region,
  Cluster,
  SummonerDTO,
} from './riotTypes';
import { MatchDto } from './Match5VTypes';
import { RiotID, SummonerDetails } from './types';

export async function getAccount(
  gameName: string,
  tagLine: string,
): Promise<AccountDto> {
  const response = await fetch(
    `${getApiUrl('EUROPE')}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    { ...getFetchConfig(), ...{ cache: 'force-cache' } },
  );

  if (!response.ok) {
    console.error('getAccount failed with response:', await response.json());
    throw new Error('Failed to fetch account data.');
  }

  const json = await response.json();

  return json;
}

export async function getSummoner(
  encryptedPUUID: string,
  region: Region,
): Promise<SummonerDTO> {
  const response = await fetch(
    `${getApiUrl(region)}/lol/summoner/v4/summoners/by-puuid/${encryptedPUUID}`,
    { ...getFetchConfig(), ...{ next: { revalidate: 3600 } } },
  );

  if (!response.ok) {
    console.error('getAccount failed with response:', await response.json());
    throw new Error('Failed to fetch summoner data.');
  }

  const json = await response.json();

  return json;
}

export async function getSummonerDetails(
  name: string,
  tag: string,
  region: Region,
): Promise<SummonerDetails> {
  const { puuid, tagLine, gameName } = await getAccount(name, tag);
  const { profileIconId, summonerLevel } = await getSummoner(puuid, region);

  return {
    tagLine,
    gameName,
    profileIconId,
    summonerLevel,
  };
}

export async function getMastery(
  encryptedPUUID: string,
  region: Region,
): Promise<ChampionMasteryDto[]> {
  const response = await fetch(
    `${getApiUrl(region)}/lol/champion-mastery/v4/champion-masteries/by-puuid/${encryptedPUUID}`,
    { ...getFetchConfig(), ...{ next: { revalidate: 3600 } } },
  );

  if (!response.ok) {
    console.error('getMastery failed with response:', await response.json());
    throw new Error('Failed to fetch mastery data.');
  }

  const json = await response.json();

  return json;
}

export async function getMasteryForAccount(
  name: string,
  tag: string,
  region: Region,
): Promise<ChampionMasteryDto[]> {
  const { puuid } = await getAccount(name, tag);
  const mastery = await getMastery(puuid, region);

  return mastery;
}

export async function getChampionRotation(
  region: Region,
): Promise<ChampionInfo> {
  const response = await fetch(
    `${getApiUrl(region)}/lol/platform/v3/champion-rotations`,
    getFetchConfig(),
  );

  if (!response.ok) {
    console.error(
      'getChampionRotation failed with response:',
      await response.json(),
    );
    throw new Error('Failed to fetch champion rotation data.');
  }

  const json = await response.json();

  return json;
}

export async function getMatchIDs(
  encryptedPUUID: string,
  cluster: Cluster,
  start: number = 0,
  count: number = 20,
): Promise<string[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('start', start.toString());
  searchParams.append('count', count.toString());

  const response = await fetch(
    `${getApiUrl(cluster)}/lol/match/v5/matches/by-puuid/${encryptedPUUID}/ids?` +
      searchParams,
    { ...getFetchConfig(), ...{ next: { revalidate: 3600 } } },
  );

  if (!response.ok) {
    console.error('getMatchIDs failed with response:', await response.json());
    throw new Error('Failed to fetch matchIDs.');
  }

  const json = await response.json();

  return json;
}

export async function getAllMatchIDs(
  encryptedPUUID: string,
  cluster: Cluster,
): Promise<string[]> {
  const allRequests = [];

  for (let i = 0; i < 5; i++) {
    allRequests.push(getMatchIDs(encryptedPUUID, cluster, i * 100, 100));
  }
  const allIDs = (await Promise.all(allRequests)).flat(1);

  return allIDs;
}

export async function getAllMatchIDsForAccount(
  gameName: string,
  tagline: string,
  region: Region,
) {
  const { puuid } = await getAccount(gameName, tagline);
  const matchIDs = await getAllMatchIDs(puuid, getCluster(region));

  return matchIDs;
}

export async function getMatchDetails(
  matchID: string,
  cluster: Cluster,
): Promise<MatchDto> {
  const response = await fetch(
    `${getApiUrl(cluster)}/lol/match/v5/matches/${matchID}`,
    { ...getFetchConfig(), ...{ cache: 'force-cache' } },
  );

  if (!response.ok) {
    console.error(
      'getMatchDetails failed with response:',
      await response.json(),
    );
    throw new Error('Failed to fetch match details.');
  }

  const json = await response.json();

  return json;
}

export async function getCommonMatchIDs(
  summoner1: RiotID,
  summoner2: RiotID,
  region: Region,
) {
  const summoner1GameIDs = await getAllMatchIDsForAccount(
    summoner1.gameName,
    summoner1.tagline,
    region,
  );
  const summoner2GameIDs = await getAllMatchIDsForAccount(
    summoner2.gameName,
    summoner2.tagline,
    region,
  );

  const commonGameIDs = summoner1GameIDs.filter(
    (id) => summoner2GameIDs.indexOf(id) !== -1,
  );

  return commonGameIDs;
}

export async function getPlayerPUUID(gameName: string, tagline: string) {
  const { puuid } = await getAccount(gameName, tagline);
  return puuid;
}
