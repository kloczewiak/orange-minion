'use client';
import { createContext, useEffect, useState } from 'react';
import { getCommonMatchIDs, getPlayerPUUID } from '../lib/api/data';
import { Champion, Item, Queue, Region } from '../lib/api/riot/riotTypes';
import { RiotID } from '../lib/types';
import { CommonMatch, MatchSkeleton } from './SingleCommonMatch';
import {
  getChampionsLookupTable,
  getSwarmChampionLookupTable,
  getCluster,
  getItemsLookupTable,
  getQueuesLookupTable,
} from '../lib/helperFunctions';
import { StyledButton } from './components';

type LookupContextType = {
  items?: Item[];
  queues?: Queue[];
  champions?: Champion[];
};

export const LookupContext = createContext<LookupContextType>({});

export function CommonGames({
  summoner1,
  summoner2,
  region,
}: {
  summoner1: RiotID;
  summoner2: RiotID;
  region: Region;
}) {
  const [itemsLookup, setItemsLookup] = useState<Item[]>();
  const [queuesLookup, setQueuesLookup] = useState<Queue[]>();
  const [championsLookup, setChampionsLookup] = useState<Champion[]>();

  const [commonMatchIDs, setCommonMatchIDs] = useState<string[]>();
  const [numberOfMatches, setNumberOfMatches] = useState<number>(10);

  const matchIDsToShow = commonMatchIDs?.slice(0, numberOfMatches) ?? [];
  const cluster = getCluster(region);

  const [playerPUUIDs, setPlayerPUUIDs] = useState<string[]>();

  useEffect(() => {
    const getCommonGames = async () => {
      const commonGameIDs = await getCommonMatchIDs(
        summoner1,
        summoner2,
        region,
      );
      setCommonMatchIDs(commonGameIDs);
    };
    getCommonGames();

    getItemsLookupTable().then((d) => setItemsLookup(d));
    getQueuesLookupTable().then((d) => setQueuesLookup(d));
    getChampionsLookupTable().then((d) =>
      setChampionsLookup([...d, ...getSwarmChampionLookupTable()]),
    );

    const puuidPromises = [summoner1, summoner2].map((summoner) =>
      getPlayerPUUID(summoner.gameName, summoner.tagline),
    );
    Promise.all(puuidPromises).then((puuids) => setPlayerPUUIDs(puuids));
  }, []);

  if (commonMatchIDs && commonMatchIDs.length == 0) {
    return (
      <div className='flex justify-center'>
        <p className='text-3xl text-center max-w-lg'>
          These players have not played together in the last 1000 games
        </p>
      </div>
    );
  }

  if (!playerPUUIDs || !commonMatchIDs) {
    return (
      <div className='flex flex-col gap-6'>
        {new Array(10).fill('').map((_, index) => (
          <MatchSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <LookupContext.Provider
        value={{
          items: itemsLookup,
          queues: queuesLookup,
          champions: championsLookup,
        }}
      >
        {matchIDsToShow.map((id) => (
          <CommonMatch
            key={id}
            matchID={id}
            cluster={cluster}
            playerPUUIDs={playerPUUIDs}
          />
        ))}
      </LookupContext.Provider>
      {commonMatchIDs && commonMatchIDs.length > numberOfMatches && (
        <StyledButton
          className='self-end'
          onClick={() => setNumberOfMatches((n) => n + 10)}
        >
          Load More
        </StyledButton>
      )}
    </div>
  );
}

const getLookupTables = async () => {
  const items = getItemsLookupTable();
  const queues = getQueuesLookupTable();
  const champions = getChampionsLookupTable();
  return await Promise.all([items, queues, champions]);
};
