'use client';

import { StyledButton } from '@/app/ui/components';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { replace } = useRouter();

  return (
    <main className='flex h-screen flex-col items-center justify-center'>
      <h2 className='text-center'>Something went wrong!</h2>
      <p className='text-center'>Did you enter correct name and tagline?</p>
      <p className='text-center'>Did you select correct region?</p>
      <StyledButton className='mt-4' onClick={() => replace('/mastery')}>
        Go back
      </StyledButton>
    </main>
  );
}
