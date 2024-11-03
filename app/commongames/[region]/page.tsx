import { RegionReadable } from '@/app/lib/api/riotTypes';
import { getRegionCode } from '@/app/lib/api/typeFunctions';
import {
  SummonerProfileCard,
  SummonerProfileCardSkeleton,
} from '@/app/ui/summonerProfileCard';
import { Suspense } from 'react';

export default function Page({
  params,
  searchParams,
}: {
  params: { region: string; players: any };
  searchParams: { players: string[] };
}) {
  // TODO: Add protection for invalid parameters
  const region = getRegionCode(params.region as RegionReadable);
  const players = searchParams.players.map((player) => {
    const data = player.split('#');
    return {
      gameName: data[0],
      tagline: data[1],
    };
  });

  return (
    <div>
      <div className='flex gap-8'>
        {players.map(({ gameName, tagline }) => (
          <Suspense fallback={<SummonerProfileCardSkeleton />}>
            <SummonerProfileCard
              gameName={gameName}
              tagLine={tagline}
              region={region}
            />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
