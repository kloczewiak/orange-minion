import { Metadata } from 'next';
import { CommonGamesForm } from '../ui/CommonGamesForm';

export const metadata: Metadata = {
  title: 'Shared Match History',
  description:
    'Quickly view all games you have played with another player, allowing you to analyze your shared history and collaboration.',
};

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <h1 className='text-4xl text-center font-semibold'>
        Shared Match History
      </h1>
      <CommonGamesForm />
    </div>
  );
}
