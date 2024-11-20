import { ChallengesDto, ParticipantDto } from '@/app/lib/api/riot/Match5VTypes';
import { StatisticsSelector } from './StatisticsSelector';
import Image from 'next/image';
import { getChampionTileUrl } from '@/app/lib/helperFunctions';

export async function Challenges({
  participants,
}: {
  participants: ParticipantDto[];
}) {
  const selectorItemsPromises = participants.map(async (p) => ({
    button: (
      <Image
        src={await getChampionTileUrl(p.championId)}
        alt={p.championName}
        width={50}
        height={50}
      />
    ),
    children: <Challenge challenges={p.challenges} />,
  }));

  const selectorItems = await Promise.all(selectorItemsPromises);

  return (
    <StatisticsSelector
      className='w-full max-w-screen-lg'
      items={selectorItems}
    />
  );
}

function Challenge({ challenges }: { challenges: ChallengesDto }) {
  return (
    <>
      <div className='grid grid-cols-2'>
        {Object.entries(challenges)
          .filter(([key, value]) => Boolean(value))
          .map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
      </div>
      {/* <pre>{JSON.stringify(challenges, null, 2)}</pre> */}
    </>
  );
}
