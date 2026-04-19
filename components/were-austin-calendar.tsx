'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
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

interface SelectedDay {
  iso: string;
  events: MajorEvent[];
}

export function WereAustinCalendar({
  events,
  now = new Date(),
  className,
}: WereAustinCalendarProps) {
  const [selected, setSelected] = useState<SelectedDay | null>(null);

  const today = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  const days = useMemo(() => {
    return Array.from({ length: DAYS }, (_, i) => addDays(today, i));
  }, [today]);

  // Active event drives both the headline label and the optional logo.
  // Default fallback when nothing's active = "Verdad" (brand: real, true, AustiNight).
  const activeHeadline = useMemo(() => {
    const todayActive = activeFor(isoDate(today), events);
    if (todayActive.length === 0) return null;
    const priority: MajorEvent['name'][] = [
      'SXSW',
      'ACL',
      'COTA',
      'Rodeo',
      'Longhorns',
      'Austin FC',
    ];
    return todayActive.sort(
      (a, b) => priority.indexOf(a.name) - priority.indexOf(b.name),
    )[0];
  }, [events, today]);

  const headlineText = activeHeadline
    ? activeHeadline.name === 'Austin FC'
      ? 'Verde'
      : activeHeadline.label
    : 'Verdad';

  return (
    <section
      aria-label="Major Austin events — next 60 days"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <div className="mb-3">
        <h2 className="flex flex-wrap items-center gap-2 font-display text-lg font-extrabold text-ink md:text-xl">
          <span>We&apos;re Austin —</span>
          {activeHeadline?.logoUrl && (
            <Image
              src={activeHeadline.logoUrl}
              alt=""
              width={28}
              height={28}
              unoptimized
              className="inline-block h-7 w-auto align-middle"
            />
          )}
          <span className="text-orange">{headlineText}</span>
        </h2>
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
                <button
                  type="button"
                  onClick={() => setSelected({ iso, events: active })}
                  aria-label={`${d.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}${active.length > 0 ? ` — ${active.map(e => e.name).join(', ')}` : ''}`}
                  className={clsx(
                    'flex h-20 w-14 flex-col items-center justify-start gap-0.5 rounded-lg border px-1 py-1 text-center transition-colors hover:bg-teal-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal',
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
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Placeholder event detail modal. TODO: wire to real event pages. */}
      {selected && (
        <DayDetailModal
          selected={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}

function DayDetailModal({
  selected,
  onClose,
}: {
  selected: SelectedDay;
  onClose: () => void;
}) {
  const date = new Date(selected.iso + 'T00:00:00');
  const display = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4"
      onClick={handleBackdrop}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-detail-title"
        className="w-full max-w-md rounded-t-3xl bg-cream p-5 shadow-2xl md:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 id="day-detail-title" className="font-display text-lg font-extrabold text-ink">
            {display}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink-mid"
          >
            ✕
          </button>
        </div>
        {selected.events.length === 0 ? (
          <p className="mt-3 text-sm text-ink-mid">
            No major Austin events listed for this day. Check the main feed for tonight&apos;s local action.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selected.events.map(ev => (
              <li
                key={ev.id}
                className="rounded-xl border border-hairline bg-white p-3"
              >
                <div className="font-display text-sm font-bold text-ink">{ev.name}</div>
                <div className="text-[11px] text-ink-light">
                  {ev.startDate} → {ev.endDate}
                </div>
                <p className="mt-1 text-xs text-ink-mid">
                  Details page coming soon. Check the After This section below for after-party venues.
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
