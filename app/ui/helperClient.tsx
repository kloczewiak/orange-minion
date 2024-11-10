'use client';

import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useEffect, useState } from 'react';

export function LocalDate({ timestamp }: { timestamp: number }) {
  // To avoid hydration errors, always render dates as 'en-US' before mounting
  const [dateString, setDateString] = useState<string>(
    new Date(timestamp).toLocaleDateString('en-US'),
  );

  useEffect(() => {
    const date = TimestampToLocalDate(timestamp);
    setDateString(date.toLocaleDateString());
  }, []);

  return <>{dateString}</>;
}

export function FullDate({ timestamp }: { timestamp: number }) {
  const formatDate = (date: Date) => format(date, "MMMM do, yyyy 'at' h:mm a");

  const [dateString, setDateString] = useState<string>(
    formatDate(new Date(timestamp)),
  );

  useEffect(() => {
    const date = TimestampToLocalDate(timestamp);
    setDateString(formatDate(date));
  }, []);

  return <>{dateString}</>;
}

const TimestampToLocalDate = (timestamp: number) =>
  toZonedTime(
    new Date(timestamp),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

export const shimmerStyles =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent relative overflow-hidden';
