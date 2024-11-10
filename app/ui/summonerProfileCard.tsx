import Image from 'next/image';
import { getSummonerDetails } from '../lib/api/data';
import { Region } from '../lib/api/riotTypes';
import { getSummonerIconUrl } from '../lib/api/helperFunctions';

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
        <p className='text-xl font-semibold'>{summoner.gameName}</p>
        <p className='-mt-1 text-foreground-dimmed'>#{summoner.tagline}</p>
        <p>Level {summoner.summonerLevel}</p>
      </div>
    </div>
  );
};

const shimmerStyles =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export const SummonerProfileCardSkeleton = () => (
  <div className={`flex items-center gap-4`}>
    <div
      className={`${shimmerStyles} relative overflow-hidden w-[150px] h-[150px] shrink-0 rounded-xl bg-slate-100`}
    />
    <div className='flex flex-col text-left'>
      <div
        className={`${shimmerStyles} relative overflow-hidden text-xl font-semibold w-32 h-6 rounded-md bg-slate-100`}
      ></div>
      <div
        className={`${shimmerStyles} relative overflow-hidden text-foreground-dimmed mt-1 w-12 h-5 rounded-md bg-slate-100`}
      ></div>
      <div
        className={`${shimmerStyles} relative overflow-hidden w-20 h-5 mt-1 rounded-md bg-slate-100`}
      ></div>
    </div>
  </div>
);
