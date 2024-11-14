'use client';
import { useActionState, useEffect, useState } from 'react';
import { Container, StyledButton, StyledInput } from './components';
import { toOrdinal } from 'number-to-words';
import { RegionSelect } from './regionSelect';
import { FormState, action } from './CommonGamesFormAction';
import Link from 'next/link';
import { DualSearchHistoryItem } from '../lib/types';
import { useRouter } from 'next/navigation';

export function CommonGamesForm() {
  const initialState: FormState = {
    success: null,
    form: {
      gamename1: '',
      tagline1: '',
      gamename2: '',
      tagline2: '',
    },
  };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      const { region, gamename1, tagline1, gamename2, tagline2 } = state.form;

      let data: DualSearchHistoryItem[] = [];
      const ls = localStorage.getItem('dualAccountSearchHistory');
      if (ls) {
        data = JSON.parse(ls) as DualSearchHistoryItem[];

        // if the same search is already in the history, remove it first
        const index = data.findIndex(
          (id) =>
            (id.account1.tagline === tagline1 &&
              id.account1.gameName === gamename1 &&
              id.account2.tagline === tagline2 &&
              id.account2.gameName === gamename2 &&
              id.region === region) ||
            (id.account1.tagline === tagline2 &&
              id.account1.gameName === gamename2 &&
              id.account2.tagline === tagline1 &&
              id.account2.gameName === gamename1 &&
              id.region === region),
        );
        if (index !== -1) {
          data.splice(index, 1);
        }
      }
      data.unshift({
        account1: {
          gameName: gamename1,
          tagline: tagline1,
          region,
        },
        account2: {
          gameName: gamename2,
          tagline: tagline2,
          region,
        },
        region,
      });
      data = data.splice(0, 5);
      localStorage.setItem('dualAccountSearchHistory', JSON.stringify(data));

      const searchParams = new URLSearchParams();
      searchParams.append('players', `${gamename1}-${tagline1}`);
      searchParams.append('players', `${gamename2}-${tagline2}`);

      router.push('/commongames/' + region + '?' + searchParams);
    }
  }, [state.success]);

  return (
    <div className='flex flex-col gap-4 w-full min-[384px]:w-auto'>
      <Container>
        <form className='flex flex-col gap-4' action={formAction}>
          <SummonerInput
            number={1}
            defaultGameName={state.form.gamename1}
            defaultTagline={state.form.tagline1}
          />
          <SummonerInput
            number={2}
            defaultGameName={state.form.gamename2}
            defaultTagline={state.form.tagline2}
          />
          <div className='flex justify-end gap-4'>
            <RegionSelect value={state.form.region} />
            <StyledButton disabled={isPending}>
              {isPending ? 'Loading...' : 'Submit'}
            </StyledButton>
          </div>
          {state.success === false && (
            <div className='flex flex-col gap-1'>
              {state.errors.map((error, index) => (
                <p key={index} className='text-red-400 w-0 min-w-full'>
                  {error}
                </p>
              ))}
            </div>
          )}
        </form>
      </Container>
      <History />
    </div>
  );
}

function SummonerInput({
  number,
  defaultGameName,
  defaultTagline,
}: {
  number: number;
  defaultGameName?: string;
  defaultTagline?: string;
}) {
  return (
    <div className='bg-primary/5 rounded-lg p-4 flex flex-col gap-2'>
      <h3 className='text-lg font-medium text-accent'>
        {toOrdinal(number)} Summoner
      </h3>
      <div className='w-full flex flex-col min-[384px]:flex-row min-[384px]:justify-between min-[384px]:items-center'>
        <label className='mr-3' htmlFor={'gamename' + number}>
          Game&nbsp;name
        </label>
        <StyledInput
          defaultValue={defaultGameName}
          name={'gamename' + number}
          id={'gamename' + number}
          autoComplete='off'
          autoCorrect='off'
          type='text'
          required
        />
      </div>
      <div className='w-full flex flex-col min-[384px]:flex-row min-[384px]:justify-between min-[384px]:items-center'>
        <label className='mr-3' htmlFor={'tagline' + number}>
          Tagline
        </label>
        <StyledInput
          defaultValue={defaultTagline}
          name={'tagline' + number}
          id={'tagline' + number}
          autoComplete='off'
          autoCorrect='off'
          type='text'
          required
        />
      </div>
    </div>
  );
}

function History() {
  const [history, setHistory] = useState<DualSearchHistoryItem[]>();

  useEffect(() => {
    const ls = localStorage.getItem('dualAccountSearchHistory');
    if (ls) {
      setHistory(JSON.parse(ls) as DualSearchHistoryItem[]);
    }
  }, []);

  return (
    history && (
      <Container className='w-0 min-w-full'>
        <p className='text-xl'>Search history</p>
        <ul className='flex flex-col gap-1 ml-4 mt-1 list-disc'>
          {history.map((item) => (
            <li
              key={`${item.account1.gameName}#${item.account1.tagline}&${item.account2.gameName}#${item.account2.tagline}on${item.region}`}
            >
              <HistoryItem item={item} />
            </li>
          ))}
        </ul>
      </Container>
    )
  );
}

function HistoryItem({ item }: { item: DualSearchHistoryItem }) {
  const searchParams = new URLSearchParams();
  searchParams.append(
    'players',
    `${item.account1.gameName}-${item.account1.tagline}`,
  );
  searchParams.append(
    'players',
    `${item.account2.gameName}-${item.account2.tagline}`,
  );

  return (
    <p>
      <Link
        className='text-blue-400 hover:underline'
        href={'/commongames/' + item.region + '?' + searchParams}
      >
        {item.account1.gameName}#{item.account1.tagline} and{' '}
        {item.account2.gameName}#{item.account2.tagline} on&nbsp;{item.region}
      </Link>
    </p>
  );
}
