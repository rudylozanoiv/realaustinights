import Link from 'next/link';
import { RouteLockedHeader } from '@/components/homepage/route-locked-header';
import { RouteBottomTabBar } from '@/components/homepage/route-bottom-tab-bar';
import { HOMEPAGE_CALENDAR_ITEMS } from '@/lib/homepage-mock-data';

function groupByDay() {
  const groups = new Map<string, typeof HOMEPAGE_CALENDAR_ITEMS>();
  for (const item of HOMEPAGE_CALENDAR_ITEMS) {
    const key = `${item.dayLabel}__${item.dateLabel}`;
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  }
  return Array.from(groups.entries()).map(([key, items]) => {
    const [dayLabel, dateLabel] = key.split('__');
    return { dayLabel, dateLabel, items };
  });
}

export default function EventsPage() {
  const groups = groupByDay();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath="/events" />

      <main className="px-4 py-8 pb-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/10"
            >
              ← Back to Real AustiNights
            </Link>

            <div className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-pink">
              Planning view
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Events</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">Upcoming dates across Austin</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              This is the planning view for people who think beyond tonight: tomorrow, Sunday, and next-week dates surfaced in one clean scan.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-pink">
              <span aria-hidden>✦</span>
              <span>Preview schedule — official source monitoring is not connected yet</span>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
              {groups.map((group) => (
                <div
                  key={`${group.dayLabel}-${group.dateLabel}`}
                  className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/6 shadow-[0_18px_44px_rgba(6,10,24,0.28)]"
                >
                  <div className="border-b border-white/10 bg-[rgba(255,45,135,0.08)] px-4 py-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-pink">{group.dayLabel}</p>
                    <h2 className="mt-1 font-display text-xl font-black text-white">{group.dateLabel}</h2>
                  </div>

                  <div className="divide-y divide-white/8">
                    {group.items.map((item) => (
                      <article key={item.id} className="px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pink/88">{item.timeLabel}</p>
                            <h3 className="mt-1 font-display text-lg font-black text-white">{item.title}</h3>
                            <p className="mt-1 text-sm text-white/72">{item.venue} • {item.neighborhood}</p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/72">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/56">{item.status}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/36">Details coming later</p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
