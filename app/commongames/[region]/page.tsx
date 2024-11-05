import { RegionReadable } from '@/app/lib/api/riotTypes';
import { getRegionCode } from '@/app/lib/api/typeFunctions';
import { CommonGames } from '@/app/ui/CommonGames';
import {
  SummonerProfileCard,
  SummonerProfileCardSkeleton,
} from '@/app/ui/summonerProfileCard';
import { Suspense } from 'react';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ region: string; players: any }>;
  searchParams: Promise<{ players: string[] }>;
}) {
  // TODO: Add protection for invalid parameters
  // TODO: Add proper error handling instead of using error.tsx
  const region = getRegionCode((await params).region as RegionReadable);
  const players = (await searchParams).players.map((player) => {
    const data = player.split('#');
    return {
      gameName: data[0],
      tagline: data[1],
    };
  });

  return (
    <div className='py-6'>
      <div className='flex gap-8 justify-center'>
        {players.map(({ gameName, tagline }) => (
          <Suspense
            key={`${gameName}#${tagline}`}
            fallback={<SummonerProfileCardSkeleton />}
          >
            <SummonerProfileCard
              gameName={gameName}
              tagLine={tagline}
              region={region}
            />
          </Suspense>
        ))}
      </div>
      <div className='mx-auto mt-6 max-w-screen-md'>
        <CommonGames
          summoner1={players[0]}
          summoner2={players[1]}
          region={region}
        />
      </div>
    </div>
  );
}
