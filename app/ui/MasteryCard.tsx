import Image from 'next/image';
import { getMasteryForAccount } from '../lib/api/data';
import { ChampionMasteryDto, Region } from '../lib/api/riotTypes';
import {
  getChampionSummary,
  getChampionTileUrl,
} from '../lib/api/helperFunctions';
import { Suspense } from 'react';
import { LocalDate } from './helperClient';

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
        <Suspense
          key={mastery.championId}
          fallback={<p>{mastery.championId}</p>}
        >
          <MasteryCard key={mastery.championId} mastery={mastery} />
        </Suspense>
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
    <div className='flex gap-4 rounded-[40px] bg-slate-100 p-4'>
      <div>
        <MasteryBanner
          championLevel={mastery.championLevel}
          championId={mastery.championId}
        />
      </div>
      <div className='flex-grow'>
        <h3 className='whitespace-nowrap text-3xl font-semibold'>
          {championSummary.name}
        </h3>
        <p className='text-lg font-medium'>
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
  const checkmarkUrl =
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/miniseries-progress-w.png';
  const xmarkUrl =
    'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/miniseries-progress-l.png';
  const Check = ({ value }: { value: boolean }) => (
    <Image
      src={value ? xmarkUrl : checkmarkUrl}
      alt={value ? 'Not completed' : 'Completed'}
      width={24}
      height={24}
    />
  );

  const nextLevelPts = championPts + ptsUntilNextLvl;

  return (
    <ul className='ml-1'>
      {totalMarks > 0 && (
        <li className='flex items-center'>
          <Check value={earnedMarks < totalMarks} />
          <p>
            Earned {earnedMarks} out of {totalMarks} Mark
            {totalMarks == 1 ? '' : 's'}
          </p>
        </li>
      )}
      <li className='flex items-center'>
        <Check value={ptsUntilNextLvl >= 0} />
        <p>Reached {nextLevelPts.toLocaleString('en')}&nbsp;Points</p>
      </li>
    </ul>
  );
}
