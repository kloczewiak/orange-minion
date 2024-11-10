'use client';
import { Container, StyledButton, StyledInput } from './components';
import { RegionSelect } from './regionSelect';
import { useActionState } from 'react';
import { FormState, action } from './MasteryFormAction';

export function MasteryForm() {
  const initialState: FormState = {
    form: { gamename: '', tagline: '' },
  };
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
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
            type='text'
          />
        </div>
        <div className='flex gap-2 h-10'>
          <RegionSelect value={state.form.region} />
          <StyledButton disabled={isPending} className='h-full' type='submit'>
            {isPending ? 'Loading...' : 'Submit'}
          </StyledButton>
        </div>
        {state.error && (
          <p className='text-red-400 min-w-full w-0'>{state.error}</p>
        )}
      </form>
    </Container>
  );
}
