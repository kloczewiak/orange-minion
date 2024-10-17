import { Region } from '@/app/lib/api/riotTypes';
import { MasteryList } from '@/app/ui/MasteryCard';
import {
  SummonerProfileCard,
  SummonerProfileCardSkeleton,
} from '@/app/ui/summonerProfileCard';
import { Suspense } from 'react';

export default function Page({
  params,
}: {
  params: { region: string; gameName: string; tagLine: string };
}) {
  const region = params.region as Region;
  const gameName = params.gameName;
  const tagLine = params.tagLine;
  console.log('test2');

  return (
    <div>
      <div className='mt-4 flex justify-around gap-2 sm:justify-center sm:gap-8'>
        <Suspense fallback={<SummonerProfileCardSkeleton />}>
          <SummonerProfileCard
            gameName={gameName}
            tagLine={tagLine}
            region={region}
          />
        </Suspense>
      </div>
      <Suspense fallback={<p>Loading masteries...</p>}>
        <MasteryList gameName={gameName} tagLine={tagLine} region={region} />
      </Suspense>
    </div>
  );
}
