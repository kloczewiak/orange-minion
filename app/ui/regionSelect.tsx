import { Dispatch, SetStateAction, useEffect } from 'react';
import { StyledSelect } from './components';
import { RegionReadable } from '../lib/api/riotTypes';
import { allRegions, getReadableRegion } from '../lib/api/typeFunctions';

export function RegionSelect({
  region,
  setRegion,
}: {
  region: RegionReadable;
  setRegion: Dispatch<SetStateAction<RegionReadable>>;
}) {
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
      value={region}
      onChange={(e) => handleChange(e.target.value)}
      className='h-full'
    >
      {allRegions.map((r) => (
        <option key={r} value={r}>
          {getReadableRegion(r)}
        </option>
      ))}
    </StyledSelect>
  );
}
