import { getSummonerDetails } from '@/app/lib/api/data';
import { getRegionCode } from '@/app/lib/helperFunctions';
import { RegionReadable } from '@/app/lib/types';
import { BackButton } from '@/app/ui/BackButton';
import { MasteryCardSkeletonList, MasteryList } from '@/app/ui/MasteryCard';
import {
  SummonerProfileCard,
  SummonerProfileCardSkeleton,
} from '@/app/ui/summonerProfileCard';
import { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ region: string; account: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const region = getRegionCode(params.region as RegionReadable);
  const [gameName, tagLine] = decodeURIComponent(params.account).split('-');

  try {
    const account = await getSummonerDetails(gameName, tagLine, region);

    return {
      title: `${account.gameName}'s Mastery Showcase`,
      description: `View ${account.gameName}#${account.tagline}'s champion masteries.`,
    };
  } catch (error) {
    return {
      title: `${gameName}'s Mastery Showcase`,
      description: `View ${gameName}#${tagLine}'s champion masteries.`,
    };
  }
}

export default async function Page(props: Props) {
  // TODO: Add proper error handling instead of using error.tsx
  const params = await props.params;
  const region = getRegionCode(params.region as RegionReadable);
  const [gameName, tagLine] = decodeURIComponent(params.account).split('-');

  return (
    <div>
      <div className='mt-4 flex flex-col items-center'>
        <BackButton maxWidth='32rem' href={'/mastery'}>
          Go back
        </BackButton>
      </div>
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
      <Suspense fallback={<MasteryCardSkeletonList />}>
        <MasteryList gameName={gameName} tagLine={tagLine} region={region} />
      </Suspense>
    </div>
  );
}
