'use server';

import { getApiUrl, getFetchConfig } from './helperFunctions';
import {
  AccountDto,
  ChampionInfo,
  ChampionMasteryDto,
  Region,
  SummonerDTO,
} from './riotTypes';
import { SummonerDetails } from './types';

export async function getAccount(
  gameName: string,
  tagLine: string,
): Promise<AccountDto> {
  const response = await fetch(
    `${getApiUrl('EUROPE')}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    getFetchConfig(),
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
    getFetchConfig(),
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
    getFetchConfig(),
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
