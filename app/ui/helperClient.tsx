'use client';

import { useEffect, useState } from 'react';

export function LocalDate({ timestamp }: { timestamp: number }) {
  const date = new Date(timestamp);
  // To avoid hydration errors, always render dates as 'en-US' before mounting
  const [dateString, setDateString] = useState<string>(
    date.toLocaleDateString('en-US'),
  );

  useEffect(() => {
    setDateString(date.toLocaleDateString());
  }, []);

  return <>{dateString}</>;
}
