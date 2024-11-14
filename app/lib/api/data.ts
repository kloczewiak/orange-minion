'use server';

import { getApiUrl, getCluster, getFetchConfig } from '../helperFunctions';
import {
  AccountDto,
  ChampionInfo,
  ChampionMasteryDto,
  Region,
  Cluster,
  SummonerDTO,
} from './riot/riotTypes';
import { MatchDto } from './riot/Match5VTypes';
import { RiotID, SummonerDetails } from '../types';
import { getReadableRegion } from '../helperFunctions';

export async function getAccount(
  gameName: string,
  tagline: string,
): Promise<AccountDto> {
  const tag = tagline.replace('#', '').trim();
  const name = gameName.trim();
  const response = await fetch(
    `${getApiUrl('EUROPE')}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
    { ...getFetchConfig(), ...{ cache: 'force-cache' } },
  );

  if (!response.ok) {
    console.error('getAccount failed with response:', await response.json());
    if (response.status === 404) {
      throw new Error(`Account ${name}#${tag} not found.`, {
        cause: response.status,
      });
    }
    throw new Error('Failed to fetch account data.', {
      cause: response.status,
    });
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
    console.error('getSummoner failed with response:', await response.json());
    throw new Error('Failed to fetch summoner data.', {
      cause: response.status,
    });
  }

  const json = await response.json();

  return json;
}

export async function getSummonerDetails(
  gameName: string,
  tagline: string,
  region: Region,
): Promise<SummonerDetails> {
  const {
    puuid,
    tagLine: tag,
    gameName: name,
  } = await getAccount(gameName, tagline);

  try {
    const { profileIconId, summonerLevel } = await getSummoner(puuid, region);

    return {
      tagline: tag,
      gameName: name,
      profileIconId,
      summonerLevel,
    };
  } catch (e) {
    const err = e as Error;
    throw new Error(
      `Summoner was not found for ${name}#${tag} on ${getReadableRegion(region) ?? region} server.`,
      { cause: err.cause },
    );
  }
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
    throw new Error('Failed to fetch mastery data.', {
      cause: response.status,
    });
  }

  const json = await response.json();

  return json;
}

export async function getMasteryForAccount(
  gameName: string,
  tagline: string,
  region: Region,
): Promise<ChampionMasteryDto[]> {
  const {
    puuid,
    gameName: name,
    tagLine: tag,
  } = await getAccount(gameName, tagline);
  try {
    const mastery = await getMastery(puuid, region);
    return mastery;
  } catch (e) {
    const err = e as Error;
    throw new Error(
      `Summoner was not found for ${name}#${tag} on ${getReadableRegion(region) ?? region} server.`,
      { cause: err.cause },
    );
  }
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
    throw new Error('Failed to fetch champion rotation data.', {
      cause: response.status,
    });
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
    throw new Error('Failed to fetch matchIDs.', { cause: response.status });
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
  const {
    puuid,
    gameName: name,
    tagLine: tag,
  } = await getAccount(gameName, tagline);
  try {
    const matchIDs = await getAllMatchIDs(puuid, getCluster(region));
    return matchIDs;
  } catch (e) {
    const err = e as Error;
    throw new Error(
      `Summoner was not found for ${name}#${tag} on ${getReadableRegion(region) ?? region} server.`,
      { cause: err.cause },
    );
  }
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
    throw new Error('Failed to fetch match details.', {
      cause: response.status,
    });
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
