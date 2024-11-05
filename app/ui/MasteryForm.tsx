'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Region, RegionReadable } from '../lib/api/riotTypes';
import { allRegions, getReadableRegion } from '../lib/api/typeFunctions';
import {
  Container,
  StyledButton,
  StyledInput,
  StyledSelect,
} from './components';
import { RegionSelect } from './regionSelect';

export function MasteryForm() {
  const { replace } = useRouter();
  const [region, setRegion] = useState<RegionReadable>('EUNE');
  const [gameName, setGameName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');

  const OnSubmit = () => {
    replace(
      '/mastery/' +
        region +
        '/' +
        encodeURIComponent(gameName) +
        '/' +
        encodeURIComponent(tagline),
    );
  };

  return (
    <Container>
      <form
        className='flex flex-col items-end gap-2'
        onSubmit={(e) => {
          e.preventDefault();
          OnSubmit();
        }}
      >
        <div className='w-full flex items-center justify-between'>
          <label className='mr-3' htmlFor='gamename'>
            Game name
          </label>
          <StyledInput
            className='border'
            name='gamename'
            type='text'
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
        <div className='w-full flex items-center justify-between'>
          <label className='mr-3' htmlFor='tagline'>
            Tagline
          </label>
          <StyledInput
            className='border'
            name='tagline'
            type='text'
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2 h-10'>
          <RegionSelect region={region} setRegion={setRegion} />
          <StyledButton className='h-full' type='submit'>
            Submit
          </StyledButton>
        </div>
      </form>
    </Container>
  );
}
