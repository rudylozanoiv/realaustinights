import Link from 'next/link';
import { CategoryPills } from '@/components/homepage/category-pills';
import { EventVenueCardGrid } from '@/components/homepage/event-venue-card-grid';
import { SignalPanel } from '@/components/homepage/signal-panel';
import { UpcomingCalendarSection } from '@/components/homepage/upcoming-calendar-section';
import { RouteLockedHeader } from '@/components/homepage/route-locked-header';
import { RouteBottomTabBar } from '@/components/homepage/route-bottom-tab-bar';
import {
  HOMEPAGE_CALENDAR_ITEMS,
  HOMEPAGE_CATEGORY_PILLS,
  HOMEPAGE_SIGNAL_ITEMS,
  HOMEPAGE_VENUE_CARDS,
} from '@/lib/homepage-mock-data';

export default function TonightPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath="/tonight" />

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
              Tonight planner
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Tonight</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">Tonight in Austin</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              When the only question is where to go tonight, start here. Picks, categories, neighborhood signal, and the next few dates all live in one clean flow.
            </p>

            <div className="mt-8 space-y-5">
              <CategoryPills items={HOMEPAGE_CATEGORY_PILLS} />
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <EventVenueCardGrid items={HOMEPAGE_VENUE_CARDS} />
                <SignalPanel items={HOMEPAGE_SIGNAL_ITEMS} />
              </div>
            </div>
          </section>

          <UpcomingCalendarSection items={HOMEPAGE_CALENDAR_ITEMS} />
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
