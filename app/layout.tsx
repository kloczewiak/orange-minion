import type { Metadata } from 'next';
import './globals.css';
import { Montserrat } from 'next/font/google';

export const metadata: Metadata = {
  title: {
    template: '%s - Orange Minion',
    default: 'Orange Minion',
  },
  description:
    'Orange Minion is an open-source website offering powerful League of Legends tools like Mastery Showcase and Shared Match History, helping players track champion masteries and view games played with friends.',
};

const montserrat = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body className={`${montserrat.className} antialiased h-full`}>
        {children}
      </body>
    </html>
  );
}
