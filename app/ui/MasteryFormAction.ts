'use server';
import { redirect } from 'next/navigation';
import { getSummonerDetails } from '../lib/api/data';
import { RegionReadable } from '../lib/api/riotTypes';
import { getRegionCode } from '../lib/api/typeFunctions';

export type FormState = {
  error?: string;
  form: {
    gamename: string;
    tagline: string;
    region?: RegionReadable;
  };
};
export const action = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const gamename = formData.get('gamename') as string;
  const tagline = formData.get('tagline') as string;
  const region = formData.get('region') as RegionReadable;

  try {
    await getSummonerDetails(gamename, tagline, getRegionCode(region));
  } catch (e) {
    const err = e as Error;
    return {
      error: err.message,
      form: {
        gamename,
        tagline,
        region,
      },
    };
  }

  redirect(`/mastery/${region}/${gamename}/${tagline}`);
};
