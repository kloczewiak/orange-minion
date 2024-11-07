'use client';
import { useEffect, useState } from 'react';
import { StyledSelect } from './components';
import { RegionReadable } from '../lib/api/riotTypes';
import { allRegions, getReadableRegion } from '../lib/api/typeFunctions';

export function RegionSelect() {
  // BUG: There's a bug in React 19 that makes select components reset
  // after returning from `useActionState` even though they're controlled.
  // TODO: Update after the following issue is resolved:
  // https://github.com/facebook/react/issues/30580

  const [region, setRegion] = useState<RegionReadable>('EUNE');

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
