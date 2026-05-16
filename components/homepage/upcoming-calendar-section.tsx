import Link from 'next/link';
import type { HomepageCalendarItem } from '@/lib/homepage-types';

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
    return { dayLabel, dateLabel, items: groupedItems };
  });
}

export function UpcomingCalendarSection({ items }: { items: HomepageCalendarItem[] }) {
  const groups = groupByDay(items);

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
