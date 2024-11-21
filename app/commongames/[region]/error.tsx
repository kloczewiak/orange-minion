'use client';

import { StyledButton } from '@/app/ui/components';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className='flex h-screen flex-col items-center justify-center'>
      <h2 className='text-center'>Something went wrong!</h2>
      <p className='text-center'>Did you enter correct names and taglines?</p>
      <p className='text-center'>Did you select correct region?</p>
      <Link href={'/commongames'}>
        <StyledButton className='mt-4'>Go back</StyledButton>
      </Link>
    </main>
  );
}
