import {
  getAdjustedImageUrl,
  getItemsLookupTable,
  getSummonerSpellLookupTable,
} from '@/app/lib/helperFunctions';
import Image from 'next/image';

export function Items({ items }: { items: number[] }) {
  return (
    <div
      className='grid grid-cols-3 grid-rows-2 gap-1'
      style={{
        gridTemplateAreas: `'g2 g1 g0' 'g5 g4 g3'`,
      }}
    >
      {items.map((i, index) => (
        <Item key={index} itemID={i} gridArea={'g' + index} />
      ))}
    </div>
  );
}

async function Item({
  itemID,
  gridArea,
}: {
  itemID: number;
  gridArea?: string;
}) {
  const itemLookupTable = await getItemsLookupTable();
  const item = itemLookupTable.find((i) => i.id === itemID);

  if (item) {
    const itemUrl = getAdjustedImageUrl(item.iconPath);

    return (
      <Image
        className='rounded-lg'
        style={{ gridArea: gridArea }}
        src={itemUrl}
        alt={item.name}
        width={48}
        height={48}
      />
    );
  }

  return (
    <div
      className='rounded-lg w-[48px] h-[48px] bg-gray-800'
      style={{ gridArea: gridArea }}
    />
  );
}

export async function SummonerSpells({
  wardID,
  summonerSpells,
}: {
  wardID: number;
  summonerSpells: number[];
}) {
  const wardLookup = await getItemsLookupTable();
  const ward = wardLookup.find((i) => i.id === wardID);

  const spellLookup = await getSummonerSpellLookupTable();
  const spells = summonerSpells.map((id) =>
    spellLookup.find((lookup) => lookup.id === id),
  );

  return (
    <div className='flex flex-col justify-between gap-1 '>
      {ward && (
        <Image
          className='rounded-lg'
          src={getAdjustedImageUrl(ward.iconPath)}
          alt={ward.name}
          width={30}
          height={30}
        />
      )}
      {spells.map(
        (spell, index) =>
          spell && (
            <Image
              className='rounded-lg'
              key={index}
              src={getAdjustedImageUrl(spell.iconPath)}
              alt={spell.name}
              width={30}
              height={30}
            />
          ),
      )}
    </div>
  );
}
