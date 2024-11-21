import { getSummonerDetailsByPUUID } from '@/app/lib/api/data';
import { Region } from '@/app/lib/api/riot/riotTypes';
import {
  getChampionsLookupTable,
  getChampionTileUrl,
  getSummonerIconUrl,
  getSwarmChampionLookupTable,
} from '@/app/lib/helperFunctions';
import Image from 'next/image';
import { shimmerStyles } from './components';
import clsx from 'clsx';

export async function SummonerProfileCardWithChampion({
  puuid,
  championId,
  region,
}: {
  puuid: string;
  championId: number;
  region: Region;
}) {
  const summoner =
    puuid !== 'BOT'
      ? await getSummonerDetailsByPUUID(puuid, region)
      : undefined;
  const championLookup = [
    ...(await getChampionsLookupTable()),
    ...getSwarmChampionLookupTable(),
  ];
  const champion = championLookup.find((c) => c.id === championId);

  return (
    <div className='relative rounded-xl overflow-hidden w-[150px] h-[150px] shrink-0'>
      {summoner && (
        <Image
          className='top-0 -left-1/4 absolute'
          src={getSummonerIconUrl(summoner.profileIconId)}
          alt={`${summoner.gameName}'s icon`}
          width={150}
          height={150}
        />
      )}
      {champion && (
        <Image
          className={clsx('top-0 absolute', {
            '-right-1/4': summoner,
          })}
          style={{
            clipPath: summoner && 'inset(0 0 0 25%)',
          }}
          src={await getChampionTileUrl(championId)}
          alt={champion.name}
          width={150}
          height={150}
        />
      )}
      <div className='flex flex-col justify-end inset-0 absolute'>
        <div className='flex flex-col text-center leading-4 bg-background/70 py-1'>
          <p className='text-xl font-semibold text-primary leading-5'>
            {summoner ? summoner.gameName : champion?.name}
          </p>
          {summoner && (
            <p className='text-primary-100/80'>#{summoner.tagline}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const SummonerProfileCardWithChampionSkeleton = () => (
  <div
    className={`${shimmerStyles} w-[150px] h-[150px] shrink-0 rounded-xl bg-primary/5`}
  />
);
