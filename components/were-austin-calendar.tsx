'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import type { MajorEvent } from '@/lib/types';

interface WereAustinCalendarProps {
  events: MajorEvent[];
  /** Current date. Override for tests. */
  now?: Date;
  className?: string;
}

const DAYS = 60;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * MS_PER_DAY);
}

function activeFor(day: string, events: MajorEvent[]): MajorEvent[] {
  return events.filter(e => day >= e.startDate && day <= e.endDate);
}

const EVENT_COLOR: Record<MajorEvent['name'], string> = {
  SXSW: 'bg-orange text-white',
  ACL: 'bg-teal text-white',
  COTA: 'bg-red text-white',
  Rodeo: 'bg-amber-500 text-white',
  Longhorns: 'bg-orange-700 text-white',
  'Austin FC': 'bg-green text-white',
};

export function WereAustinCalendar({ events, now = new Date(), className }: WereAustinCalendarProps) {
  const today = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  const days = useMemo(() => {
    return Array.from({ length: DAYS }, (_, i) => addDays(today, i));
  }, [today]);

  const headline = useMemo(() => {
    const todayActive = activeFor(isoDate(today), events);
    if (todayActive.length === 0) return 'Every Night';
    // Priority festivals first; AFC maps to "Verde".
    const priority: MajorEvent['name'][] = ['SXSW', 'ACL', 'COTA', 'Rodeo', 'Longhorns', 'Austin FC'];
    const pick = todayActive.sort((a, b) => priority.indexOf(a.name) - priority.indexOf(b.name))[0];
    return pick.name === 'Austin FC' ? 'Verde' : pick.label;
  }, [events, today]);

  return (
    <section
      aria-label="Major Austin events — next 60 days"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <div className="mb-3">
        <h2 className="font-display text-lg font-extrabold text-ink md:text-xl">
          We&apos;re Austin — <span className="text-orange">{headline}</span>
        </h2>
        <p className="text-[11px] text-ink-light">Next 60 days · scroll horizontally →</p>
      </div>

      <div
        className="-mx-4 overflow-x-auto pb-2 md:mx-0"
        role="region"
        aria-label="Event timeline, next 60 days"
        tabIndex={0}
      >
        <ol className="flex gap-1 px-4 md:px-0">
          {days.map(d => {
            const iso = isoDate(d);
            const active = activeFor(iso, events);
            const isToday = iso === isoDate(today);
            return (
              <li key={iso} className="shrink-0">
                <div
                  className={clsx(
                    'flex h-20 w-14 flex-col items-center justify-start gap-0.5 rounded-lg border px-1 py-1 text-center',
                    isToday ? 'border-navy bg-cream' : 'border-hairline bg-white',
                  )}
                >
                  <span className="text-[9px] uppercase text-ink-light">
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span
                    className={clsx(
                      'font-display text-sm font-extrabold',
                      isToday ? 'text-navy' : 'text-ink',
                    )}
                  >
                    {d.getDate()}
                  </span>
                  <div className="mt-auto flex w-full flex-col gap-0.5">
                    {active.slice(0, 2).map(ev => (
                      <span
                        key={ev.id}
                        title={ev.name}
                        className={clsx(
                          'truncate rounded-sm px-1 text-[8px] font-bold',
                          EVENT_COLOR[ev.name],
                        )}
                      >
                        {ev.name === 'Austin FC' ? 'Verde' : ev.name}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
