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

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function normalizeDistrictSlug(value: string) {
  const slug = slugify(value);
  if (slug === 'rainey-street') return 'rainey-st';
  return slug;
}

function districtMatchesVenue(district: string, neighborhood: string) {
  const d = normalizeDistrictSlug(district);
  const n = slugify(neighborhood);

  if (d === n) return true;
  if (d === 'rainey-st' && n === 'rainey-street') return true;
  if (d === 'east-6th-st' && n === 'red-river') return true;
  if (d === 'downtown' && ['red-river', 'rainey-street'].includes(n)) return true;
  return false;
}

interface TonightPageProps {
  searchParams?: Promise<{ category?: string; district?: string }>;
}

export default async function TonightPage({ searchParams }: TonightPageProps) {
  const params = (await searchParams) ?? {};
  const activeCategory = params.category?.trim().toLowerCase() ?? '';
  const activeDistrict = normalizeDistrictSlug(params.district ?? '');

  const categoryItems = HOMEPAGE_CATEGORY_PILLS.map((item) => ({
    ...item,
    active: activeCategory ? slugify(item.label) === activeCategory : false,
  }));

  const filteredVenueCards = HOMEPAGE_VENUE_CARDS.filter((item) => {
    const categoryMatch = !activeCategory || slugify(item.category) === activeCategory;
    const districtMatch = !activeDistrict || districtMatchesVenue(activeDistrict, item.neighborhood);
    return categoryMatch && districtMatch;
  });

  const filteredSignalItems = activeDistrict
    ? HOMEPAGE_SIGNAL_ITEMS.filter((item) => slugify(item.district) === activeDistrict)
    : HOMEPAGE_SIGNAL_ITEMS;

  const hasCategoryFilter = Boolean(activeCategory);
  const hasDistrictFilter = Boolean(activeDistrict);
  const categoryOnlyResultCount = hasCategoryFilter
    ? HOMEPAGE_VENUE_CARDS.filter((item) => slugify(item.category) === activeCategory).length
    : HOMEPAGE_VENUE_CARDS.length;
  const districtOnlyResultCount = hasDistrictFilter
    ? HOMEPAGE_VENUE_CARDS.filter((item) => districtMatchesVenue(activeDistrict, item.neighborhood)).length
    : HOMEPAGE_VENUE_CARDS.length;
  const honestEmptyReason =
    filteredVenueCards.length > 0
      ? null
      : hasCategoryFilter && hasDistrictFilter && categoryOnlyResultCount > 0 && districtOnlyResultCount > 0
        ? 'We have category picks and district picks separately, but not a verified overlap for this exact combo yet.'
        : hasCategoryFilter && categoryOnlyResultCount === 0
          ? 'This category filter is wired, but we do not have real curated cards for it yet.'
            : hasDistrictFilter && districtOnlyResultCount === 0
              ? 'This district filter is wired, but we do not have real curated cards for it yet.'
            : 'That route used to feel fake because the filter changed the URL but not the content. This is the honest state until the source data layer arrives.';

  const filterLabels = [
    activeCategory ? categoryItems.find((item) => slugify(item.label) === activeCategory)?.label ?? activeCategory : null,
    activeDistrict ? HOMEPAGE_SIGNAL_ITEMS.find((item) => slugify(item.district) === activeDistrict)?.district ?? activeDistrict : null,
  ].filter(Boolean);

  const hasFilter = Boolean(activeCategory || activeDistrict);

  const heading = activeCategory && activeDistrict
    ? `${filterLabels[0]} picks in ${filterLabels[1]}`
    : activeCategory
      ? `${filterLabels[0]} picks in Austin`
      : activeDistrict
        ? `${filterLabels[0]} picks tonight`
        : 'Tonight in Austin';

  const gridClass = hasFilter
    ? 'grid gap-6 lg:grid-cols-1'
    : 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]';

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
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">{heading}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              When the only question is where to go tonight, start here. Picks, categories, neighborhood signal, and the next few dates sit in one clean flow.
            </p>
            {hasFilter ? (
              <p className="mt-3 max-w-3xl text-xs leading-6 text-white/56">
                Venue detail pages are coming; this view shows filtered preview picks.
              </p>
            ) : null}

            <div className="mt-8 space-y-5">
              <CategoryPills items={categoryItems} />

              {filterLabels.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3 rounded-[1rem] border border-pink/20 bg-[rgba(255,45,135,0.06)] px-4 py-3 text-sm text-white/84">
                  <span className="text-[11px] font-black uppercase tracking-[0.18em] text-pink">Showing</span>
                  <span>{filterLabels.join(' • ')}</span>
                  <Link href="/tonight" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 underline-offset-4 hover:text-white hover:underline">
                    Clear filters
                  </Link>
                </div>
              ) : null}

              <div className={gridClass}>
                {filteredVenueCards.length > 0 ? (
                  <EventVenueCardGrid items={filteredVenueCards} />
                ) : (
                  <section className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,11,22,0.96),rgba(13,9,16,0.98))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.32)]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-pink/84">No featured picks yet</p>
                    <h2 className="mt-3 font-display text-2xl font-black text-white">We don’t have a clean {filterLabels[0] ?? 'tonight'} card set yet.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                      {honestEmptyReason}
                    </p>
                    <div className="mt-4 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.16em] text-white/52">
                      Honest mode: filter visible; curated result set not ready.
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/events" className="inline-flex items-center rounded-full border border-pink/40 bg-pink/12 px-4 py-2 text-sm font-semibold text-pink transition hover:bg-pink/18">
                        Browse upcoming events
                      </Link>
                      <Link href="/guides" className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/10">
                        Open guides
                      </Link>
                    </div>
                  </section>
                )}
                {!hasFilter ? (
                  <SignalPanel items={filteredSignalItems.length > 0 ? filteredSignalItems : HOMEPAGE_SIGNAL_ITEMS} />
                ) : null}
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
