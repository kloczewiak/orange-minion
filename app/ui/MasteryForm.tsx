'use client';
import { Container, StyledButton, StyledInput } from './components';
import { RegionSelect } from './regionSelect';
import { useActionState, useEffect, useState } from 'react';
import { FormState, action } from './MasteryFormAction';
import { useRouter } from 'next/navigation';
import { SearchHistoryItem } from '../lib/api/types';
import Link from 'next/link';

export function MasteryForm() {
  const initialState: FormState = {
    success: null,
    form: { gamename: '', tagline: '' },
  };
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      const { region, gamename, tagline } = state.form;

      let data: SearchHistoryItem[] = [];
      const ls = localStorage.getItem('accountSearchHistory');
      if (ls) {
        data = JSON.parse(ls) as SearchHistoryItem[];

        // if the same search is already in the history, remove it first
        const index = data.findIndex(
          (id) =>
            id.tagline === tagline &&
            id.gameName === gamename &&
            id.region === region,
        );
        if (index !== -1) {
          data.splice(index, 1);
        }
      }
      data.unshift({
        gameName: gamename,
        tagline,
        region,
      });
      data = data.splice(0, 5);
      localStorage.setItem('accountSearchHistory', JSON.stringify(data));
      router.push(`/mastery/${region}/${gamename}-${tagline}`);
    }
  }, [state.success]);

  return (
    <div className='flex flex-col gap-4'>
      <Container>
        <form className='flex flex-col items-end gap-2' action={formAction}>
          <div className='w-full flex items-center justify-between'>
            <label className='mr-3' htmlFor='gamename'>
              Game name
            </label>
            <StyledInput
              defaultValue={state.form.gamename}
              className='border'
              name='gamename'
              id='gamename'
              autoComplete='off'
              autoCorrect='off'
              type='text'
            />
          </div>
          <div className='w-full flex items-center justify-between'>
            <label className='mr-3' htmlFor='tagline'>
              Tagline
            </label>
            <StyledInput
              defaultValue={state.form.tagline}
              className='border'
              name='tagline'
              id='tagline'
              autoComplete='off'
              autoCorrect='off'
              type='text'
            />
          </div>
          <div className='flex gap-2 h-10'>
            <RegionSelect value={state.form.region} />
            <StyledButton disabled={isPending} className='h-full' type='submit'>
              {isPending ? 'Loading...' : 'Submit'}
            </StyledButton>
          </div>
          {state.success === false && (
            <p className='text-red-400 min-w-full w-0'>{state.error}</p>
          )}
        </form>
      </Container>
      <History />
    </div>
  );
}

function History() {
  const [history, setHistory] = useState<SearchHistoryItem[]>();

  useEffect(() => {
    const ls = localStorage.getItem('accountSearchHistory');
    if (ls) {
      setHistory(JSON.parse(ls) as SearchHistoryItem[]);
    }
  }, []);

  return (
    history && (
      <Container>
        <p className='text-xl'>Search history</p>
        <ul className='flex flex-col gap-1 ml-4 mt-1 list-disc'>
          {history.map((id) => (
            <li key={`${id.gameName}#${id.tagline}on${id.region}`}>
              <p>
                <Link
                  className='text-blue-400 hover:underline'
                  href={`/mastery/${id.region}/${id.gameName}-${id.tagline}`}
                >
                  {id.gameName}#{id.tagline} on&nbsp;{id.region}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Container>
    )
  );
}
