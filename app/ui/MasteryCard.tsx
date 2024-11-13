import Image from 'next/image';
import { getMasteryForAccount } from '../lib/api/data';
import { ChampionMasteryDto, Region } from '../lib/api/riotTypes';
import {
  getChampionSummary,
  getChampionTileUrl,
} from '../lib/api/helperFunctions';
import { LocalDate } from './helperClient';
import { shimmerStyles } from './components';
import { XMarkIcon, CheckIcon } from '@heroicons/react/16/solid';

export const MasteryList = async ({
  gameName,
  tagLine,
  region,
}: {
  gameName: string;
  tagLine: string;
  region: Region;
}) => {
  const masteries = await getMasteryForAccount(gameName, tagLine, region);
  masteries.sort((a, b) => b.championPoints - a.championPoints);
  // masteries.sort((a, b) => b.lastPlayTime - a.lastPlayTime);
  // masteries.sort(() => Math.random() - 0.5);

  return (
    <div className='mx-auto mt-4 grid w-fit grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:px-4'>
      {masteries.map((mastery) => (
        <MasteryCard key={mastery.championId} mastery={mastery} />
      ))}
    </div>
  );
};

export const MasteryCard = async ({
  mastery,
}: {
  mastery: ChampionMasteryDto;
}) => {
  const championSummary = await getChampionSummary(mastery.championId);

  return (
    <div className='flex gap-4 rounded-[40px] bg-primary/5 p-4 pr-1'>
      <div className='flex-shrink-0'>
        <MasteryBanner
          championLevel={mastery.championLevel}
          championId={mastery.championId}
        />
      </div>
      <div>
        <h3 className='text-3xl font-semibold text-primary'>
          {championSummary.name}
        </h3>
        <p className='text-lg font-medium text-accent'>
          {mastery.championPoints.toLocaleString('en')} Points
        </p>
        <div className='flex flex-col gap-2'>
          <div>
            <p>Last played:</p>
            <p className='ml-2'>
              <LocalDate timestamp={mastery.lastPlayTime} />
            </p>
          </div>
          <div>
            <p>Mastery progress:</p>
            <MasteryProgress
              earnedMarks={mastery.championSeasonMilestone}
              totalMarks={mastery.markRequiredForNextLevel}
              championPts={mastery.championPoints}
              ptsUntilNextLvl={mastery.championPointsUntilNextLevel}
            />
          </div>
        </div>
        {/* <pre className='text-xs'>{JSON.stringify(mastery, null, 2)}</pre> */}
      </div>
    </div>
  );
};

async function MasteryBanner({
  championLevel,
  championId,
}: {
  championLevel: number;
  championId: number;
}) {
  const iconUrl = await getChampionTileUrl(championId);
  const bannerUrl = `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/mastery-${Math.min(championLevel, 10)}.png`;
  const levelPlateUrl =
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/mastery-level-plate.png';

  return (
    <div className='flex flex-col items-center'>
      <Image
        src={iconUrl}
        alt={`Champion`}
        className='rounded-3xl'
        width={150}
        height={150}
      />
      <Image
        src={bannerUrl}
        alt={`Mastery level ${championLevel} border`}
        className='-mt-10 -mb-2'
        width={140}
        height={140}
      />
      {championLevel > 10 && (
        <>
          <Image
            src={levelPlateUrl}
            alt={`Mastery level ${championLevel} plate`}
            className='-mt-5'
            width={44}
            height={44}
          />
          <p className='-mt-4 text-[#4D330C] text-xs font-black'>
            {championLevel}
          </p>
        </>
      )}
    </div>
  );
}

function MasteryProgress({
  totalMarks,
  earnedMarks,
  championPts,
  ptsUntilNextLvl,
}: {
  totalMarks: number;
  earnedMarks: number;
  championPts: number;
  ptsUntilNextLvl: number;
}) {
  const Check = ({ value }: { value: boolean }) =>
    value ? (
      <CheckIcon className='size-6 text-accent' />
    ) : (
      <XMarkIcon className='size-6 text-accent' />
    );

  const nextLevelPts = championPts + ptsUntilNextLvl;

  return (
    <ul className='ml-1'>
      {totalMarks > 0 && (
        <li className='flex items-start'>
          <Check value={earnedMarks >= totalMarks} />
          <p>
            Earned {earnedMarks} out of {totalMarks} Mark
            {totalMarks == 1 ? '' : 's'}
          </p>
        </li>
      )}
      <li className='flex items-start'>
        <Check value={ptsUntilNextLvl < 0} />
        <p>Reached {nextLevelPts.toLocaleString('en')}&nbsp;Points</p>
      </li>
    </ul>
  );
}

export const MasteryCardSkeletonList = ({ count = 18 }: { count?: number }) => (
  <div className='mx-auto mt-4 grid w-fit grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:px-4'>
    {new Array(count).fill('').map((_, index) => (
      <MasteryCardSkeleton key={index} />
    ))}
  </div>
);

const MasteryCardSkeleton = () => (
  <div
    className={`${shimmerStyles} shrink max-w-full w-[442px] h-[240px] bg-primary/5 rounded-[40px] p-4 flex gap-4`}
  >
    <div
      className={`${shimmerStyles} min-w-[150px] h-[150px] bg-primary/5 rounded-3xl`}
    />
    <div className='block'>
      <div className={`${shimmerStyles} h-8 w-32 bg-primary/5 rounded-full`} />
      <div
        className={`${shimmerStyles} mt-2 h-6 w-36 bg-primary/5 rounded-full`}
      />
      <div
        className={`${shimmerStyles} mt-2 h-14 w-28 bg-primary/5 rounded-2xl`}
      />
      <div
        className={`${shimmerStyles} mt-2 h-14 w-56 bg-primary/5 rounded-2xl`}
      />
    </div>
  </div>
);
