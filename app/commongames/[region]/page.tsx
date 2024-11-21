import { getSummonerDetails } from '@/app/lib/api/data';
import { getRegionCode } from '@/app/lib/helperFunctions';
import { RegionReadable } from '@/app/lib/types';
import { BackButton } from '@/app/ui/BackButton';
import { CommonGames } from '@/app/ui/CommonGames';
import {
  SummonerProfileCard,
  SummonerProfileCardSkeleton,
} from '@/app/ui/summonerProfileCard';
import { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ region: string; players: any }>;
  searchParams: Promise<{ players: string[] }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const region = getRegionCode(params.region as RegionReadable);
  const playerIDs = (await props.searchParams).players.map((player) => {
    const data = player.split('-');
    return {
      gameName: data[0],
      tagline: data[1],
    };
  });

  try {
    const playersPromise = playerIDs.map((p) =>
      getSummonerDetails(p.gameName, p.tagline, region),
    );

    const players = await Promise.all(playersPromise);

    const playerText = players.map((p) => p.gameName).join(' and ');

    const playerTextHash = players
      .map((p) => p.gameName + '#' + p.tagline)
      .join(' and ');

    return {
      title: `${playerText} - Shared Match History`,
      description: `View shared match history between ${playerTextHash}.`,
    };
  } catch (error) {
    const playerText = playerIDs.map((p) => p.gameName).join(' and ');

    const playerTextHash = playerIDs
      .map((p) => p.gameName + '#' + p.tagline)
      .join(' and ');

    return {
      title: `${playerText} - Shared Match History`,
      description: `View shared match history between ${playerTextHash}.`,
    };
  }
}

export default async function Page({ params, searchParams }: Props) {
  // TODO: Add protection for invalid parameters
  // TODO: Add proper error handling instead of using error.tsx
  const region = getRegionCode((await params).region as RegionReadable);
  const players = (await searchParams).players.map((player) => {
    const data = player.split('-');
    return {
      gameName: data[0],
      tagline: data[1],
    };
  });

  return (
    <div className='py-6'>
      <div className='flex flex-col items-center mb-6'>
        <BackButton maxWidth='48rem' href={'/commongames'}>
          Go back
        </BackButton>
      </div>
      <div className='flex flex-col items-start w-fit mx-auto sm:flex-row gap-4'>
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
      <div className='mx-auto mt-6 max-w-md sm:max-w-screen-md'>
        <CommonGames
          summoner1={players[0]}
          summoner2={players[1]}
          region={region}
        />
      </div>
    </div>
  );
}
