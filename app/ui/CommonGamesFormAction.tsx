'use server';
import { redirect } from 'next/navigation';
import { getSummonerDetails } from '../lib/api/data';
import { RegionReadable } from '../lib/api/riotTypes';
import { getRegionCode } from '../lib/api/typeFunctions';

export type FormState = {
  error?: string;
  form: {
    gamename1: string;
    tagline1: string;
    gamename2: string;
    tagline2: string;
    region?: RegionReadable;
  };
};
export const action = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const gamename1 = formData.get('gamename1') as string;
  const tagline1 = formData.get('tagline1') as string;
  const gamename2 = formData.get('gamename2') as string;
  const tagline2 = formData.get('tagline2') as string;
  const region = formData.get('region') as RegionReadable;

  try {
    await Promise.all([
      getSummonerDetails(gamename1, tagline1, getRegionCode(region)),
      getSummonerDetails(gamename2, tagline2, getRegionCode(region)),
    ]);
  } catch (e) {
    const err = e as Error;
    return {
      error: err.message,
      form: {
        gamename1,
        tagline1,
        gamename2,
        tagline2,
        region,
      },
    };
  }

  const searchParams = new URLSearchParams();
  searchParams.append('players', `${gamename1}#${tagline1}`);
  searchParams.append('players', `${gamename2}#${tagline2}`);

  redirect(`/commongames/${region}?${searchParams}`);
};
