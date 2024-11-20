'use client';

import { ReactNode, useState } from 'react';

export type SelectorItem = {
  button: ReactNode;
  children: ReactNode;
};

export function StatisticsSelector({
  items,
  className,
  buttonClassName,
}: {
  items: SelectorItem[];
  className?: string;
  buttonClassName?: string;
}) {
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className={`${className}`}>
      <div className='flex justify-center gap-2 overflow-hidden px-6'>
        {items.map((item, index) => (
          <button
            key={index}
            className={`${buttonClassName} border-2 border-b-0 rounded-t-2xl overflow-hidden transition-all ${
              index === selected
                ? 'border-primary'
                : 'border-primary/50 mt-2 -mb-2'
            }`}
            onClick={() => setSelected(index)}
          >
            {item.button}
          </button>
        ))}
      </div>
      <div className='border-2 border-primary bg-primary/5 p-2 rounded-3xl'>
        {items[selected].children}
      </div>
    </div>
  );
}
