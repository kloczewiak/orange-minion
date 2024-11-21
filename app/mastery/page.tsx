import { MasteryForm } from '@/app/ui/MasteryForm';
import { Metadata } from 'next';
import { BackButton } from '../ui/BackButton';

export const metadata: Metadata = {
  title: 'Mastery Showcase',
  description:
    'Easily view and showcase your champion masteries in a visually appealing layout.',
};

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <BackButton maxWidth='22rem' href={'/'}>
        Back to Home
      </BackButton>
      <h1 className='text-4xl font-semibold text-primary text-center'>
        Mastery Showcase
      </h1>
      <div className='w-fit'>
        <MasteryForm />
      </div>
    </div>
  );
}
