import { getSummonerDetails } from '@/app/lib/api/data';
import { Region } from '@/app/lib/api/riot/riotTypes';
import { getSummonerIconUrl } from '@/app/lib/helperFunctions';
import Image from 'next/image';
import { shimmerStyles } from './components';

export const SummonerProfileCard = async ({
  gameName,
  tagLine,
  region,
}: {
  gameName: string;
  tagLine: string;
  region: Region;
}) => {
  const summoner = await getSummonerDetails(gameName, tagLine, region);

  return (
    <div className='flex items-center gap-4'>
      <Image
        className='min-w-[150px] shrink-0 rounded-xl'
        src={getSummonerIconUrl(summoner.profileIconId)}
        alt={`${summoner.gameName}'s icon`}
        width={150}
        height={150}
      />
      <div className='flex flex-col text-left'>
        <p className='text-xl font-semibold text-primary'>
          {summoner.gameName}
        </p>
        <p className='-mt-1 text-primary/50'>#{summoner.tagline}</p>
        <p className='text-primary-100'>Level {summoner.summonerLevel}</p>
      </div>
    </div>
  );
};

export const SummonerProfileCardSkeleton = () => (
  <div className={`flex items-center gap-4`}>
    <div
      className={`${shimmerStyles} w-[150px] h-[150px] shrink-0 rounded-xl bg-primary/5`}
    />
    <div className='flex flex-col text-left'>
      <div
        className={`${shimmerStyles} text-xl font-semibold w-32 h-6 rounded-md bg-primary/5`}
      ></div>
      <div
        className={`${shimmerStyles} text-foreground-dimmed mt-1 w-12 h-5 rounded-md bg-primary/5`}
      ></div>
      <div
        className={`${shimmerStyles} w-20 h-5 mt-1 rounded-md bg-primary/5`}
      ></div>
    </div>
  </div>
);
