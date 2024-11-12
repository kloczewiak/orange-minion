import { MasteryForm } from '../ui/MasteryForm';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <h1 className='text-4xl font-semibold'>Mastery Showcase</h1>
      <div className='w-fit'>
        <MasteryForm />
      </div>
    </div>
  );
}
