import { ParticipantDto, PerksDto } from '@/app/lib/api/riot/Match5VTypes';
import {
  getAdjustedImageUrl,
  getChampionTileUrl,
  getPerksLookupTable,
  getPerkStylesLookupTable,
} from '@/app/lib/helperFunctions';
import Image from 'next/image';
import { CSSProperties } from 'react';
import { SelectorItem, StatisticsSelector } from './StatisticsSelector';

export const perksNotPresent = (perks: PerksDto) =>
  Object.entries(perks.statPerks).every(([_, value]) => value === 0) &&
  perks.styles.every((s) => s.selections.every((sel) => sel.perk === 0));

export async function Perks({ perks }: { perks: PerksDto }) {
  if (perksNotPresent(perks)) return null;

  return (
    <div className='flex flex-col justify-between'>
      <div className='flex'>
        <div>
          <SinglePerk perkID={perks.styles[0].selections[1].perk} size={27} />
          <SinglePerk perkID={perks.styles[0].selections[2].perk} size={27} />
          <SinglePerk perkID={perks.styles[0].selections[3].perk} size={27} />
        </div>
        <div>
          <SinglePerk perkID={perks.styles[0].selections[0].perk} size={27} />
          <SinglePerk perkID={perks.styles[1].selections[0].perk} size={27} />
          <SinglePerk perkID={perks.styles[1].selections[1].perk} size={27} />
        </div>
      </div>
      <div className='flex'>
        <SinglePerk perkID={perks.statPerks.offense} size={18} />
        <SinglePerk perkID={perks.statPerks.flex} size={18} />
        <SinglePerk perkID={perks.statPerks.defense} size={18} />
      </div>
    </div>
  );
}

async function SinglePerk({
  perkID,
  size = 32,
  className = '',
  style,
}: {
  perkID: number;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const lookup = await getPerksLookupTable();
  const perk = lookup.find((p) => p.id === perkID);

  return perk ? (
    <Image
      className={className}
      src={getAdjustedImageUrl(perk.iconPath)}
      alt={perk.name}
      style={style}
      width={size}
      height={size}
    />
  ) : (
    <div>??</div>
  );
}

export async function DetailedPerksSelector({
  participants,
}: {
  participants: ParticipantDto[];
}) {
  if (perksNotPresent(participants[0].perks)) return null;
  const itemPromises: Promise<SelectorItem>[] = participants.map(async (p) => ({
    button: (
      <Image
        src={await getChampionTileUrl(p.championId)}
        alt={p.championName}
        width={50}
        height={50}
      />
    ),
    children: <DetailedPerks key={`${p.puuid}-perk`} perks={p.perks} />,
  }));

  const items = await Promise.all(itemPromises);

  return <StatisticsSelector className='max-w-screen-md' items={items} />;
}

export async function DetailedPerks({ perks }: { perks: PerksDto }) {
  return (
    <div
      className='grid gap-4 items-start'
      style={{
        gridTemplateColumns:
          'calc(50% + 24px - 0.5rem) calc(50% - 24px - 0.5rem)',
      }}
    >
      {perks.styles.map((style) => (
        <PerkStyle key={style.style} styleID={style.style} />
      ))}
      <div className='grid grid-cols-[112px_1fr] gap-y-2 gap-x-4'>
        <DeatiledPerk perkID={perks.styles[0].selections[0].perk} size={128} />
        <DeatiledPerk perkID={perks.styles[0].selections[1].perk} />
        <DeatiledPerk perkID={perks.styles[0].selections[2].perk} />
        <DeatiledPerk perkID={perks.styles[0].selections[3].perk} />
      </div>
      <div className='grid grid-cols-[64px_1fr] gap-y-2 gap-x-4'>
        <DeatiledPerk perkID={perks.styles[1].selections[0].perk} />
        <DeatiledPerk perkID={perks.styles[1].selections[1].perk} />
        <div className='col-span-2 bg-primary/5 m-2 rounded-2xl p-2'>
          <div className='flex gap-1 items-center'>
            <DeatiledPerk perkID={perks.statPerks.offense} size={32} />
          </div>
          <div className='flex gap-1 items-center'>
            <DeatiledPerk perkID={perks.statPerks.flex} size={32} />
          </div>
          <div className='flex gap-1 items-center'>
            <DeatiledPerk perkID={perks.statPerks.defense} size={32} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function PerkStyle({ styleID }: { styleID: number }) {
  const perkStylesLookup = await getPerkStylesLookupTable();
  const style = perkStylesLookup.styles.find((s) => s.id === styleID);

  return style ? (
    <div className='flex gap-2 justify-center items-center'>
      <p className='text-3xl font-semibold text-primary'>{style.name}</p>
      <Image
        src={getAdjustedImageUrl(style.iconPath)}
        alt={style.name}
        width={32}
        height={32}
      />
    </div>
  ) : (
    '??'
  );
}

async function DeatiledPerk({
  perkID,
  size = 64,
}: {
  perkID: number;
  size?: number;
}) {
  const lookup = await getPerksLookupTable();
  const perk = lookup.find((p) => p.id === perkID);

  return perk ? (
    <>
      <div className='shrink-0 flex flex-col items-end'>
        <SinglePerk
          perkID={perkID}
          size={size}
          style={{ height: `${size}px` }}
          className='overflow-hidden object-cover'
        />
      </div>
      <div className='text-wrap'>
        <p className='text-xl text-primary'>{perk.name}</p>
        <div className='leading-5'>
          {perk.shortDesc
            .split(/<br>|<hr>/gm)
            .filter((line) => line)
            .map((line) => (
              <p key={line}>{line.replaceAll(/<[^>]*>/gm, '')}</p>
            ))}
        </div>
      </div>
    </>
  ) : (
    '??'
  );
}
