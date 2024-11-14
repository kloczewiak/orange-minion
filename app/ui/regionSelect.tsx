'use client';
import { useEffect, useState } from 'react';
import { allRegions } from '../lib/constants';
import { getReadableRegion } from '../lib/helperFunctions';
import { RegionReadable } from '../lib/types';
import { StyledSelect } from './components';

export function RegionSelect({ value }: { value?: RegionReadable }) {
  // BUG: There's a bug in React 19 that makes select components reset
  // after returning from `useActionState` even though they're controlled.
  // TODO: Update after the following issue is resolved:
  // https://github.com/facebook/react/issues/30580

  const [region, setRegion] = useState<RegionReadable>('EUNE');
  const [_rerender, setRerender] = useState<boolean>(false);

  useEffect(() => {
    // Workaround for the bug mentioned above
    const timeout = setTimeout(() => {
      setRerender((p) => !p);
    }, 50);
    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    const regionLocalStorage = localStorage.getItem('region');
    if (regionLocalStorage) {
      setRegion(regionLocalStorage as RegionReadable);
    }
  }, []);

  const handleChange = (value: string) => {
    localStorage.setItem('region', value);
    setRegion(value as RegionReadable);
  };

  return (
    <StyledSelect
      name='region'
      id='region'
      autoComplete='off'
      autoCorrect='off'
      value={region}
      onChange={(e) => handleChange(e.target.value)}
    >
      {allRegions.map((r) => (
        <option key={r} value={getReadableRegion(r)}>
          {getReadableRegion(r)}
        </option>
      ))}
    </StyledSelect>
  );
}
