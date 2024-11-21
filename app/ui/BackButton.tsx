import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';

export const BackButton = ({
  children,
  href,
  maxWidth,
}: {
  children: React.ReactNode;
  href: Url;
  maxWidth?: React.CSSProperties['maxWidth'];
}) => {
  return (
    <div className='w-full' style={{ maxWidth }}>
      <Link
        href={href}
        className='flex w-fit items-center gap-2 px-2 opacity-80 transition-opacity hover:opacity-100'
      >
        <ArrowLeftIcon className='size-6 text-accent' />
        <p className='text-lg'>{children}</p>
      </Link>
    </div>
  );
};
