import Link from 'next/link';
import { EventVenueCardGrid } from '@/components/homepage/event-venue-card-grid';
import { RouteBottomTabBar } from '@/components/homepage/route-bottom-tab-bar';
import { RouteLockedHeader } from '@/components/homepage/route-locked-header';
import { HOMEPAGE_VENUE_CARDS } from '@/lib/homepage-mock-data';

const neighborhoods = ['Red River', 'Rainey Street', 'North Lamar', 'East Austin'] as const;

export default function VenuesPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath="/venues" />

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
              Venue discovery
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Venues</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">Austin venues, by neighborhood</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              Start with the part of town, then open the places that fit the night. This page keeps discovery simple, local, and easy to scan.
            </p>
          </section>

          {neighborhoods.map((neighborhood) => {
            const items = HOMEPAGE_VENUE_CARDS.filter((item) => item.neighborhood === neighborhood);
            if (items.length === 0) return null;
            return (
              <section key={neighborhood} className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-pink/80">Neighborhood</p>
                    <h2 className="mt-1 font-display text-3xl font-black text-white">{neighborhood}</h2>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-white/68">
                    A quick read on {neighborhood} now, with deeper venue detail coming as the data layer gets stronger.
                  </p>
                </div>
                <EventVenueCardGrid items={items} />
              </section>
            );
          })}
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
