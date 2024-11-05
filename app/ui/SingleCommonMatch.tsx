'use client';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { getMatchDetails } from '../lib/api/data';
import { Cluster, Region } from '../lib/api/riotTypes';
import { MatchDto, ParticipantDto } from '../lib/api/Match5VTypes';
import { FullDate, LocalDate } from './helperClient';
import { LookupContext } from './CommonGames';
import { getReadableRegion } from '../lib/api/typeFunctions';
import { RiotID } from '../lib/api/types';
import Image from 'next/image';
import { getChampionTileUrl } from '../lib/api/helperFunctions';
import { toOrdinal } from 'number-to-words';

export function CommonMatch({
  matchID,
  cluster,
  playerPUUIDs,
}: {
  matchID: string;
  cluster: Cluster;
  playerPUUIDs: string[];
}) {
  // const details = await getMatchDetails(matchID, cluster);
  const [details, setDetails] = useState<MatchDto>();

  useEffect(() => {
    const getData = async () => {
      const data = await getMatchDetails(matchID, cluster);
      setDetails(data);
    };
    getData();
  }, []);

  return (
    <div>
      {details ? (
        <>
          <Match details={details} playerPUUIDs={playerPUUIDs} />
          {/* <pre>{JSON.stringify(details, null, 2)}</pre> */}
        </>
      ) : (
        matchID
      )}
    </div>
  );
}

function Match({
  details,
  playerPUUIDs,
}: {
  details: MatchDto;
  playerPUUIDs: string[];
}) {
  console.log(details);
  const { queues } = useContext(LookupContext);

  const queueLookup = queues?.find((queue) => queue.id == details.info.queueId);

  const playersData = playerPUUIDs.map(
    (playerPUUID) =>
      details.info.participants.find(
        (participant) => participant.puuid == playerPUUID,
      ) as ParticipantDto,
  );

  return (
    <div className='bg-slate-100 rounded-[2rem] p-4'>
      <div className='flex justify-between items-start gap-2'>
        <p className='text-2xl font-semibold'>
          {(queueLookup &&
            (queueLookup.detailedDescription || queueLookup.name)) ||
            `Unknown queue - ${details.info.queueId}`}
        </p>
        <p>
          <a
            className='text-blue-500 hover:underline'
            href={
              `https://www.leagueofgraphs.com/match/` +
              getReadableRegion(
                details.info.platformId as Region,
              ).toLowerCase() +
              `/` +
              details.info.gameId
            }
            target='_blank'
            rel='noreferrer'
          >
            View on League of Graphs
          </a>
        </p>
      </div>
      <p>
        <FullDate timestamp={details.info.gameStartTimestamp} />
      </p>
      <div className='grid grid-cols-2 gap-4 mt-1'>
        {playersData.map((playerData) => (
          <Player key={`${playerData.puuid}`} data={playerData} />
        ))}
      </div>
    </div>
  );
}

function Player({ data }: { data: ParticipantDto }) {
  const winText =
    !data.subteamPlacement || data.subteamPlacement == 0
      ? data.win
        ? 'Victory'
        : 'Defeat'
      : `${toOrdinal(data.subteamPlacement)} Place`;
  return (
    <div
      className={`rounded-2xl p-2 ${data.win ? 'bg-green-100' : 'bg-red-100'} flex flex-col`}
    >
      <div className='flex justify-between'>
        {data.riotIdGameName ? (
          <p>
            {data.riotIdGameName}
            <span className='text-black/30 ml-1'>#{data.riotIdTagline}</span>
          </p>
        ) : (
          <p>{data.summonerName}</p>
        )}
        <p className={`${data.win ? 'text-green-600' : 'text-red-600'}`}>
          {winText}
        </p>
      </div>
      <div className='flex justify-between items-end flex-1'>
        <Champion championId={data.championId}>
          <p>
            <span className='text-green-500'>{data.kills}</span> /{' '}
            <span className='text-red-500'>{data.deaths}</span> /{' '}
            <span className='text-yellow-500'>{data.assists}</span>
          </p>
        </Champion>
        <Items
          itemIDs={[
            data.item0,
            data.item1,
            data.item2,
            data.item3,
            data.item4,
            data.item5,
            data.item6,
          ]}
        />
      </div>
    </div>
  );
}

function Champion({
  championId,
  children,
}: {
  championId: number;
  children?: ReactNode;
}) {
  const { champions } = useContext(LookupContext);
  const championLookup = champions?.find(
    (champion) => champion.id == championId,
  );

  const [championImageUrl, setChampionImageUrl] = useState<string>();

  useEffect(() => {
    const run = async () => {
      const championImageUrl = await getChampionTileUrl(championId);
      setChampionImageUrl(championImageUrl);
    };
    run();
  }, []);

  return championLookup ? (
    <div className='flex items-center gap-2'>
      <Image
        className='rounded-lg'
        alt={championLookup.name}
        src={
          championImageUrl ||
          'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png'
        }
        width={62}
        height={62}
      />

      <div className='flex flex-col'>
        {children}
        <p className='leading-4'>{championLookup.name}</p>
      </div>
    </div>
  ) : (
    <div>{championId}</div>
  );
}

function Items({ itemIDs }: { itemIDs: number[] }) {
  return (
    <div
      className='grid grid-cols-4 grid-rows-2 gap-0.5 self-start flex-shrink-0'
      style={{ direction: 'rtl' }}
    >
      {itemIDs.map((itemID, index) => (
        <Item key={index} itemID={itemID} />
      ))}
    </div>
  );
}

function Item({ itemID }: { itemID: number }) {
  if (itemID == 0) return null;

  const { items } = useContext(LookupContext);
  const itemLookup = items?.find((item) => item.id == itemID);
  const itemPath =
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/` +
    itemLookup?.iconPath.split('/').slice(-1)[0].toLowerCase();

  return itemLookup ? (
    <Image
      className='rounded-lg'
      alt={itemLookup.name}
      src={itemPath}
      width={30}
      height={30}
    />
  ) : (
    <Image
      className='rounded-lg'
      alt='Unknown Item'
      src='https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/items/icons2d/gp_ui_placeholder.png'
      width={30}
      height={30}
    />
  );
}
