import { RegionReadable } from '@/app/lib/api/riotTypes';
import { getRegionCode } from '@/app/lib/api/typeFunctions';
import { MasteryList } from '@/app/ui/MasteryCard';
import {
  SummonerProfileCard,
  SummonerProfileCardSkeleton,
} from '@/app/ui/summonerProfileCard';
import { Suspense } from 'react';

export default async function Page(
  props: {
    params: Promise<{ region: string; gameName: string; tagLine: string }>;
  }
) {
  const params = await props.params;
  const region = getRegionCode(params.region as RegionReadable);
  const gameName = params.gameName;
  const tagLine = params.tagLine;

  return (
    <div>
      <div className='mt-4 flex justify-around gap-2 sm:justify-center sm:gap-8'>
        <Suspense fallback={<SummonerProfileCardSkeleton />}>
          <SummonerProfileCard
            key={`${gameName}#${tagLine}`}
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
