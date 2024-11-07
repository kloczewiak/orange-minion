'use client';
import { SetStateAction, useState } from 'react';
import { allRegions, getReadableRegion } from '../lib/api/typeFunctions';
import {
  Container,
  StyledButton,
  StyledInput,
  StyledSelect,
} from './components';
import { RegionReadable } from '../lib/api/riotTypes';
import { useRouter } from 'next/navigation';
import { toOrdinal } from 'number-to-words';
import { RegionSelect } from './regionSelect';

export function CommonGamesForm() {
  const { replace } = useRouter();

  const [summoner1GameName, setSummoner1GameName] = useState<string>('');
  const [summoner1Tagline, setSummoner1Tagline] = useState<string>('');
  const [summoner2GameName, setSummoner2GameName] = useState<string>('');
  const [summoner2Tagline, setSummoner2Tagline] = useState<string>('');
  const [region, setRegion] = useState<RegionReadable>('EUNE');

  const OnSubmit = () => {
    const searchParams = new URLSearchParams();
    searchParams.append('players', `${summoner1GameName}#${summoner1Tagline}`);
    searchParams.append('players', `${summoner2GameName}#${summoner2Tagline}`);
    replace('/commongames/' + region + '?' + searchParams);
  };

  return (
    <Container className='w-full min-[384px]:w-auto'>
      <form
        className='flex flex-col gap-4'
        onSubmit={(e) => {
          e.preventDefault();
          OnSubmit();
        }}
      >
        <SummonerInput
          summonerNumber={1}
          gameName={summoner1GameName}
          setGameName={setSummoner1GameName}
          tagline={summoner1Tagline}
          setTagline={setSummoner1Tagline}
        />
        <SummonerInput
          summonerNumber={2}
          gameName={summoner2GameName}
          setGameName={setSummoner2GameName}
          tagline={summoner2Tagline}
          setTagline={setSummoner2Tagline}
        />
        <div className='flex justify-end gap-4'>
          <RegionSelect region={region} setRegion={setRegion} />
          <StyledButton>Submit</StyledButton>
        </div>
      </form>
    </Container>
  );
}

function SummonerInput({
  summonerNumber,
  gameName,
  setGameName,
  tagline,
  setTagline,
}: {
  summonerNumber: number;
  gameName: string;
  setGameName: (value: SetStateAction<string>) => void;
  tagline: string;
  setTagline: (value: SetStateAction<string>) => void;
}) {
  return (
    <div className='bg-white rounded-lg p-4 flex flex-col gap-2'>
      <h3 className='text-lg font-medium'>
        {toOrdinal(summonerNumber)} Summoner
      </h3>
      <div className='w-full flex flex-col min-[384px]:flex-row min-[384px]:justify-between'>
        <label className='mr-3' htmlFor='gamename'>
          Game name
        </label>
        <StyledInput
          className='border'
          name='gamename'
          type='text'
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
        />
      </div>
      <div className='w-full flex flex-col min-[384px]:flex-row min-[384px]:justify-between'>
        <label className='mr-3' htmlFor='tagline'>
          Tagline
        </label>
        <StyledInput
          className='border'
          name='tagline'
          type='text'
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
