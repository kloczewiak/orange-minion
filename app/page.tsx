import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: {
    absolute: 'Orange Minion',
  },
};

export default function Home() {
  return (
    <div className='flex flex-col items-center py-8 gap-8'>
      <h1 className='text-4xl sm:text-5xl font-medium text-primary'>
        Orange Minion
      </h1>
      <Feature
        title='Mastery Showcase'
        href='/mastery'
        imageSrc='/masteryPage.png'
      >
        Easily view and showcase your champion masteries in a visually appealing
        layout.
      </Feature>
      <Feature
        title='Shared Match History'
        href='/commongames'
        imageSrc='/commonGamesPage.png'
      >
        Quickly view all games you have played with another player, allowing you
        to analyze your shared history and collaboration.
      </Feature>
    </div>
  );
}

const Feature = ({
  title,
  children,
  imageSrc,
  href,
}: {
  title: string;
  children: string;
  imageSrc: string;
  href: string;
}) => (
  <Link
    className='bg-primary/5 rounded-[2.5rem] max-w-screen-sm p-4 group flex flex-col items-center gap-4 md:flex-row md:items-start'
    href={href}
  >
    <div>
      <h2 className='text-2xl underline text-accent decoration-transparent group-hover:decoration-primary transition-colors'>
        {title}
      </h2>
      <p className='mt-2'>{children}</p>
    </div>
    <Image
      className='float-right bg-background p-2 rounded-3xl'
      src={imageSrc}
      alt={`Screenshot of ${title}`}
      width={384}
      height={384}
    />
  </Link>
);
