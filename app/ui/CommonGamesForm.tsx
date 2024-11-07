'use client';
import { useActionState } from 'react';
import { Container, StyledButton, StyledInput } from './components';
import { toOrdinal } from 'number-to-words';
import { RegionSelect } from './regionSelect';
import { FormState, action } from './CommonGamesFormAction';

export function CommonGamesForm() {
  const initialState: FormState = {
    form: {
      gamename1: '',
      tagline1: '',
      gamename2: '',
      tagline2: '',
    },
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Container className='w-full min-[384px]:w-auto'>
      <form className='flex flex-col gap-4' action={formAction}>
        <SummonerInput number={1} />
        <SummonerInput number={2} />
        <div className='flex justify-end gap-4'>
          <RegionSelect />
          <StyledButton disabled={isPending}>
            {isPending ? 'Loading...' : 'Submit'}
          </StyledButton>
        </div>
        {state.error && (
          <p className='text-red-400 w-0 min-w-full'>{state.error}</p>
        )}
      </form>
    </Container>
  );
}

function SummonerInput({ number }: { number: number }) {
  return (
    <div className='bg-white rounded-lg p-4 flex flex-col gap-2'>
      <h3 className='text-lg font-medium'>{toOrdinal(number)} Summoner</h3>
      <div className='w-full flex flex-col min-[384px]:flex-row min-[384px]:justify-between'>
        <label className='mr-3' htmlFor={'gamename' + number}>
          Game name
        </label>
        <StyledInput
          className='border'
          name={'gamename' + number}
          type='text'
          required
        />
      </div>
      <div className='w-full flex flex-col min-[384px]:flex-row min-[384px]:justify-between'>
        <label className='mr-3' htmlFor={'tagline' + number}>
          Tagline
        </label>
        <StyledInput
          className='border'
          name={'tagline' + number}
          type='text'
          required
        />
      </div>
    </div>
  );
}
