import { CommonGamesForm } from '../ui/CommonGamesForm';

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
