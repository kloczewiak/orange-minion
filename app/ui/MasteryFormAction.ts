'use server';
import { getSummonerDetails } from '../lib/api/data';
import { RegionReadable } from '../lib/types';
import { getRegionCode } from '../lib/helperFunctions';

export type FormState =
  // Success state
  | {
      success: true;
      form: {
        gamename: string;
        tagline: string;
        region: RegionReadable;
      };
    }
  // Error state
  | {
      success: false;
      error: string;
      form: {
        gamename: string;
        tagline: string;
        region: RegionReadable;
      };
    }
  // Initial state
  | {
      success: null;
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
    const summoner = await getSummonerDetails(
      gamename,
      tagline,
      getRegionCode(region),
    );
    return {
      success: true,
      form: {
        gamename: summoner.gameName,
        tagline: summoner.tagline,
        region,
      },
    };
  } catch (e) {
    const err = e as Error;
    return {
      success: false,
      error: err.message,
      form: {
        gamename,
        tagline,
        region,
      },
    };
  }
};
