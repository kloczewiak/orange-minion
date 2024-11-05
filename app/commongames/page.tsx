import { CommonGamesForm } from '../ui/CommonGamesForm';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6'>
      <h1 className='text-4xl font-semibold'>Common Games Viewer</h1>
      <div>
        <CommonGamesForm />
      </div>
    </div>
  );
}
