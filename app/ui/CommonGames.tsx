'use client';
import { createContext, useEffect, useState } from 'react';
import { getCommonMatchIDs } from '../lib/api/data';
import { Champion, Item, Queue, Region } from '../lib/api/riotTypes';
import { RiotID } from '../lib/api/types';
import { CommonMatch } from './SingleCommonMatch';
import {
  getChampionsLookupTable,
  getCluster,
  getItemsLookupTable,
  getQueuesLookupTable,
} from '../lib/api/helperFunctions';

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
  const [numberOfMatches, setNumberOfMatches] = useState<number>(15);

  const matchIDsToShow = commonMatchIDs?.slice(0, numberOfMatches) ?? [];
  const cluster = getCluster(region);

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
    getChampionsLookupTable().then((d) => setChampionsLookup(d));
  }, []);

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
            players={[summoner1, summoner2]}
          />
        ))}
      </LookupContext.Provider>
    </div>
  );
}

const getLookupTables = async () => {
  const items = getItemsLookupTable();
  const queues = getQueuesLookupTable();
  const champions = getChampionsLookupTable();
  return await Promise.all([items, queues, champions]);
};
