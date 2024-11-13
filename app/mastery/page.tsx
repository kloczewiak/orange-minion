import { Metadata } from 'next';
import { MasteryForm } from '../ui/MasteryForm';

export const metadata: Metadata = {
  title: 'Mastery Showcase',
  description:
    'Easily view and showcase your champion masteries in a visually appealing layout.',
};

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <h1 className='text-4xl font-semibold text-primary'>Mastery Showcase</h1>
      <div className='w-fit'>
        <MasteryForm />
      </div>
    </div>
  );
}
