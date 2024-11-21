import { CommonGamesForm } from '@/app/ui/CommonGamesForm';
import { Metadata } from 'next';
import { BackButton } from '../ui/BackButton';

export const metadata: Metadata = {
  title: 'Shared Match History',
  description:
    'Quickly view all games you have played with another player, allowing you to analyze your shared history and collaboration.',
};

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <BackButton maxWidth='24rem' href={'/'}>
        Back to Home
      </BackButton>
      <h1 className='text-4xl text-center font-semibold text-primary'>
        Shared Match History
      </h1>
      <CommonGamesForm />
    </div>
  );
}
