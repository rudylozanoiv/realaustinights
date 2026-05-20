import Link from 'next/link';
import type { HomepageCalendarItem } from '@/lib/homepage-types';

interface UpcomingCalendarSectionProps {
  items: HomepageCalendarItem[];
  variant?: 'default' | 'slim';
}

function groupByDay(items: HomepageCalendarItem[]) {
  const groups = new Map<string, HomepageCalendarItem[]>();

  for (const item of items) {
    const key = `${item.dayLabel}__${item.dateLabel}`;
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  }

  return Array.from(groups.entries()).map(([key, groupedItems]) => {
    const [dayLabel, dateLabel] = key.split('__');
    return {
      dayLabel,
      dateLabel,
      items: groupedItems,
    };
  });
}

export function UpcomingCalendarSection({ items, variant = 'default' }: UpcomingCalendarSectionProps) {
  const groups = groupByDay(items);
  const leadItems = items.slice(0, 3);

  if (variant === 'slim') {
    return (
      <section id="calendar-preview" aria-label="Upcoming dates" className="space-y-3">
        <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(24,10,24,0.96),rgba(11,8,15,0.96))] px-4 py-4 shadow-[0_18px_44px_rgba(0,0,0,0.28)] md:px-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-pink">Calendar</p>
              <h2 className="mt-1 font-display text-xl font-black text-white md:text-2xl">
                Plan the next few nights
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-6 text-white/64 md:text-sm">
                Slimmer on purpose — enough to plan tonight, tomorrow, and the weekend without pushing the calendar to the bottom.
              </p>
            </div>
            <Link
              href="/events"
              className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink hover:underline"
            >
              View curated planning page →
            </Link>
          </div>

          <div className="mt-4 grid gap-2.5 md:grid-cols-3">
            {leadItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-3.5 py-3 transition hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-pink/88">
                  {item.dayLabel} · {item.timeLabel}
                </p>
                <p className="mt-1 font-display text-sm font-black text-white">{item.title}</p>
                <p className="mt-1 text-[11px] text-white/64">{item.venue} • {item.neighborhood}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map((group) => (
            <div
              key={`${group.dayLabel}-${group.dateLabel}`}
              className="flex min-w-[280px] max-w-[300px] shrink-0 items-stretch overflow-hidden rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,11,22,0.92),rgba(13,9,16,0.96))] shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
            >
              <div className="flex shrink-0 flex-col justify-center border-r border-white/10 bg-[rgba(255,45,135,0.07)] px-3 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink">{group.dayLabel}</p>
                <p className="mt-1 font-display text-sm font-black leading-tight text-white">{group.dateLabel}</p>
              </div>

              <ul className="flex flex-1 flex-col divide-y divide-white/8">
                {group.items.slice(0, 2).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block px-3 py-2 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-pink/88">{item.timeLabel}</p>
                      <p className="mt-0.5 truncate font-display text-sm font-black text-white">{item.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-white/68">{item.venue}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="calendar-preview" aria-label="Upcoming dates" className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Calendar</p>
          <h2 className="mt-2 font-display text-3xl font-black text-white">Plan the next few nights</h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-white/72">
          A quick read on what is next — tomorrow, the weekend, and the dates that are actually worth remembering.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {groups.map((group) => (
          <div
            key={`${group.dayLabel}-${group.dateLabel}`}
            className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,11,22,0.96),rgba(13,9,16,0.98))] shadow-[0_18px_44px_rgba(0,0,0,0.32)]"
          >
            <div className="border-b border-white/8 bg-[rgba(255,45,135,0.08)] px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-pink">{group.dayLabel}</p>
              <h3 className="mt-1 font-display text-xl font-black text-white">{group.dateLabel}</h3>
            </div>

            <div className="divide-y divide-white/8">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block px-4 py-4 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pink/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pink/88">{item.timeLabel}</p>
                      <h4 className="mt-1 font-display text-lg font-black text-white">{item.title}</h4>
                      <p className="mt-1 text-sm text-white/72">{item.venue} • {item.neighborhood}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/72">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/56">{item.status}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
