'use server';
import { redirect } from 'next/navigation';
import { getSummonerDetails } from '../lib/api/data';
import { RegionReadable } from '../lib/api/riotTypes';
import { getRegionCode } from '../lib/api/typeFunctions';
import { RiotID } from '../lib/api/types';

export type FormState =
  // Success state
  | {
      success: true;
      form: {
        gamename1: string;
        tagline1: string;
        gamename2: string;
        tagline2: string;
        region: RegionReadable;
      };
    }
  // Error state
  | {
      success: false;
      errors: string[];
      form: {
        gamename1: string;
        tagline1: string;
        gamename2: string;
        tagline2: string;
        region: RegionReadable;
      };
    }
  // Initial state
  | {
      success: null;
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

  const data = await Promise.allSettled([
    getSummonerDetails(gamename1, tagline1, getRegionCode(region)),
    getSummonerDetails(gamename2, tagline2, getRegionCode(region)),
  ]);

  const errors: string[] = [];
  const accounts: RiotID[] = [];
  data.forEach((p, index) => {
    if (p.status === 'rejected') {
      const err = p.reason as Error;
      errors.push(err.message);
    } else {
      accounts[index] = {
        gameName: p.value.gameName,
        tagline: p.value.tagline,
      };
    }
  });

  console.log('accounts: ');
  console.log(accounts);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      form: {
        gamename1: accounts[0]?.gameName || gamename1,
        tagline1: accounts[0]?.tagline || tagline1,
        gamename2: accounts[1]?.gameName || gamename2,
        tagline2: accounts[1]?.tagline || tagline2,
        region,
      },
    };
  }

  return {
    success: true,
    form: {
      gamename1: accounts[0].gameName,
      tagline1: accounts[0].tagline,
      gamename2: accounts[1].gameName,
      tagline2: accounts[1].tagline,
      region,
    },
  };
};
