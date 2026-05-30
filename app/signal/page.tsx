import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { EventVenueCardGrid } from '@/components/homepage/event-venue-card-grid';
import { RouteBottomTabBar } from '@/components/homepage/route-bottom-tab-bar';
import { RouteLockedHeader } from '@/components/homepage/route-locked-header';
import { HOMEPAGE_SIGNAL_ITEMS, HOMEPAGE_VENUE_CARDS } from '@/lib/homepage-mock-data';

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

function signalHrefForDistrict(district: string) {
  return `/signal?district=${slugify(district)}`;
}

interface SignalPageProps {
  searchParams?: Promise<{ district?: string }>;
}

export default async function SignalPage({ searchParams }: SignalPageProps) {
  const params = (await searchParams) ?? {};
  const activeDistrict = normalizeDistrictSlug(params.district ?? '');

  const activeSignal = activeDistrict
    ? HOMEPAGE_SIGNAL_ITEMS.find((item) => normalizeDistrictSlug(item.district) === activeDistrict) ?? null
    : null;

  const visibleSignalItems = activeSignal ? [activeSignal] : HOMEPAGE_SIGNAL_ITEMS;
  const rankedItems = [...HOMEPAGE_SIGNAL_ITEMS].sort((a, b) => a.rank - b.rank);

  const districtCards = activeSignal
    ? HOMEPAGE_VENUE_CARDS.filter((item) => districtMatchesVenue(activeSignal.district, item.neighborhood))
    : HOMEPAGE_VENUE_CARDS;

  const panelLabel = activeSignal ? activeSignal.district : 'Austin hotspots';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080d18_0%,#11182b_24%,#16142b_56%,#0e1324_100%)] text-white">
      <RouteLockedHeader currentPath="/signal" />

      <main className="px-4 py-8 pb-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/82 transition hover:bg-white/10"
            >
              ← Back to Real AustiNights
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {activeSignal ? (
                <Link
                  href="/signal"
                  className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/72 transition hover:bg-white/10"
                >
                  All districts
                </Link>
              ) : null}
              <div className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-pink">
                The Signal · Preview
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(11,15,28,0.96)_0%,rgba(25,16,36,0.94)_36%,rgba(20,32,56,0.92)_100%)] px-6 py-10 shadow-[0_30px_80px_rgba(7,10,21,0.45)] md:px-8 md:py-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">The Signal</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">
              {activeSignal ? `${activeSignal.district} preview` : 'Austin district heat map'}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 md:text-base">
              A dedicated Signal destination: district heat, hotspot context, and neighborhood picks in one place. Current mode is an honest preview of the source-intelligence surface we want to build.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
              <span className="rounded-full border border-pink/20 bg-pink/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-pink">Preview mode</span>
              <span>Signal data is currently curated mock district intelligence, not source-fed nightlife data yet.</span>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[392px_minmax(0,1fr)] lg:items-start">
              <aside className="space-y-4 rounded-[1.25rem] border border-[#5f2443] bg-[linear-gradient(180deg,rgba(24,12,20,0.96),rgba(14,8,14,0.98))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.34),0_0_28px_rgba(255,45,135,0.08)]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink/72">District focus</p>
                  <h2 className="mt-1 font-display text-[1.65rem] font-black text-white">{panelLabel}</h2>
                  <p className="mt-1.5 text-[13px] leading-5 text-white/58">
                    {activeSignal ? `${activeSignal.trendLabel} • ${activeSignal.categoryHint}` : 'Choose a hotspot to see the district focus and relevant cards.'}
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-[0.95rem] border border-white/10 bg-[#0e0710] p-2.5">
                  <div className="relative aspect-[288/184] w-full overflow-hidden rounded-[0.8rem] border border-white/8 bg-[#120a12] p-3">
                    <Image
                      src="/assets/goldmaster-signal-map-crop.png"
                      alt="Real AustiNights signal map — hotspots across downtown, East Austin, Rainey, South Congress"
                      fill
                      sizes="(min-width: 1280px) 392px, (min-width: 1024px) 376px, 100vw"
                      className="object-contain object-center"
                    />
                    <div className="absolute inset-0 rounded-[0.8rem] ring-1 ring-inset ring-white/6" />

                    {rankedItems.map((item) => {
                      const isActive = normalizeDistrictSlug(item.district) === activeDistrict || (!activeDistrict && item.rank === 1);
                      return (
                        <Link
                          key={item.id}
                          href={signalHrefForDistrict(item.district)}
                          aria-label={`Open ${item.district} signal view`}
                          className={clsx(
                            'absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition',
                            isActive
                              ? 'border-pink/80 bg-pink/25 shadow-[0_0_18px_rgba(255,105,180,0.5)]'
                              : 'border-white/25 bg-white/8 hover:border-pink/50 hover:bg-pink/12',
                          )}
                          style={{ left: item.mapX, top: item.mapY }}
                        >
                          <span className="sr-only">{item.district}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="divide-y divide-white/7 overflow-hidden rounded-[0.95rem] border border-white/8 bg-[rgba(255,255,255,0.02)]">
                  {rankedItems.map((item) => {
                    const isActive = normalizeDistrictSlug(item.district) === activeDistrict;
                    return (
                      <Link
                        key={item.id}
                        href={signalHrefForDistrict(item.district)}
                        className={clsx(
                          'flex items-center gap-3 px-3.5 py-3 transition hover:bg-[rgba(255,255,255,0.04)]',
                          isActive && 'bg-[rgba(255,45,135,0.08)]',
                        )}
                      >
                        <span className="w-4 text-sm font-black text-pink">{item.rank}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[1.02rem] font-black text-white">{item.district}</p>
                          <p className="mt-0.5 text-[12px] text-white/60">{item.trendLabel}</p>
                        </div>
                        <span
                          className={clsx(
                            'rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em]',
                            item.heatLabel === 'Hot' && 'bg-pink text-white',
                            item.heatLabel === 'Warm' && 'bg-[#5c243f] text-[#ffd38a]',
                            item.heatLabel === 'Steady' && 'bg-[#362447] text-[#e6d5ff]',
                          )}
                        >
                          {item.heatLabel}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </aside>

              <section className="space-y-4">
                <div className="rounded-[1.25rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-pink/84">District intelligence</p>
                    <span className="rounded-full border border-pink/30 bg-pink/10 px-2 py-[2px] text-[9px] font-black uppercase tracking-[0.18em] text-pink">
                      Preview
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-black text-white">
                    {activeSignal ? `${activeSignal.district} looks ${activeSignal.heatLabel.toLowerCase()} tonight.` : 'Pick a district on the map to see the breakdown.'}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72">
                    {activeSignal
                      ? activeSignal.vibeNote ?? `${activeSignal.district} is currently tagged ${activeSignal.heatLabel} with a ${activeSignal.trendLabel.toLowerCase()} read.`
                      : 'The Signal is a district-first read on Austin nightlife — heat, anchors, and the story behind why a neighborhood is moving tonight.'}
                  </p>

                  {activeSignal?.previewSignals && activeSignal.previewSignals.length > 0 ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {activeSignal.previewSignals.map((signal, index) => (
                        <div
                          key={`${activeSignal.id}-signal-${index}`}
                          className="rounded-[0.95rem] border border-white/8 bg-[rgba(255,255,255,0.03)] px-3.5 py-3"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-pink/70">Signal {index + 1}</p>
                          <p className="mt-1.5 text-[13px] leading-5 text-white/82">{signal}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {activeSignal?.anchorVenues && activeSignal.anchorVenues.length > 0 ? (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/52">Anchor venues</p>
                      {activeSignal.anchorVenues.map((venue) => (
                        <span
                          key={`${activeSignal.id}-anchor-${venue}`}
                          className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/80"
                        >
                          {venue}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {!activeSignal ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {rankedItems.slice(0, 3).map((item) => (
                        <Link
                          key={`overview-${item.id}`}
                          href={signalHrefForDistrict(item.district)}
                          className="rounded-[0.95rem] border border-white/8 bg-[rgba(255,255,255,0.03)] px-3.5 py-3 transition hover:border-pink/30 hover:bg-[rgba(255,45,135,0.06)]"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-pink/70">#{item.rank} · {item.heatLabel}</p>
                          <p className="mt-1.5 font-display text-[1.05rem] font-black text-white">{item.district}</p>
                          <p className="mt-1 text-[12px] leading-5 text-white/60">{item.trendLabel} · {item.categoryHint}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>

                {districtCards.length > 0 ? (
                  <EventVenueCardGrid items={districtCards} />
                ) : (
                  <section className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,11,22,0.96),rgba(13,9,16,0.98))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.32)]">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-pink/84">No district card set yet</p>
                    <h2 className="mt-3 font-display text-2xl font-black text-white">We don’t have a verified curated card set for this district yet.</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                      Honest mode: the destination is now correct, but the district-specific card layer still needs real verified content.
                    </p>
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
              </section>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-[1.4rem] border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.24)]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-pink/82">All districts at a glance</p>
              <h2 className="mt-2 font-display text-xl font-black text-white">Compare the five Signal districts</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/64">
                Preview ranking based on curated district anchors and category mix. Tap any row to focus the map and card grid above.
              </p>
              <div className="mt-4 divide-y divide-white/8 overflow-hidden rounded-[0.95rem] border border-white/8 bg-[rgba(255,255,255,0.02)]">
                {rankedItems.map((item) => {
                  const isActive = normalizeDistrictSlug(item.district) === activeDistrict;
                  return (
                    <Link
                      key={`compare-${item.id}`}
                      href={signalHrefForDistrict(item.district)}
                      className={clsx(
                        'flex items-center gap-3 px-3.5 py-3 transition hover:bg-[rgba(255,255,255,0.04)]',
                        isActive && 'bg-[rgba(255,45,135,0.08)]',
                      )}
                    >
                      <span className="w-5 text-sm font-black text-pink">{item.rank}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[1rem] font-black text-white">{item.district}</p>
                        <p className="mt-0.5 text-[12px] text-white/58">{item.trendLabel} · {item.categoryHint}</p>
                      </div>
                      <span
                        className={clsx(
                          'rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em]',
                          item.heatLabel === 'Hot' && 'bg-pink text-white',
                          item.heatLabel === 'Warm' && 'bg-[#5c243f] text-[#ffd38a]',
                          item.heatLabel === 'Steady' && 'bg-[#362447] text-[#e6d5ff]',
                        )}
                      >
                        {item.heatLabel}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(23,11,22,0.96),rgba(13,9,16,0.98))] p-6 shadow-[0_18px_44px_rgba(0,0,0,0.32)]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-pink/82">What The Signal will track</p>
              <h2 className="mt-2 font-display text-xl font-black text-white">A district-first read on Austin nightlife</h2>
              <p className="mt-2 text-[13px] leading-6 text-white/72">
                Today this surface is a curated preview. Once the source data layer is wired up, The Signal will pull from verified venue, event, and pulse inputs — not guesses.
              </p>
              <ul className="mt-4 space-y-3 text-[13px] leading-6 text-white/78">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
                  <span><span className="font-semibold text-white">District heat</span> — anchor venue activity, headliner shows, and crowd density signals across each neighborhood.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
                  <span><span className="font-semibold text-white">Why it&apos;s moving</span> — short, sourced context: who&apos;s playing, who&apos;s open late, where the crawl is heading.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
                  <span><span className="font-semibold text-white">Verified picks</span> — venue and event cards backed by editorial review, not scraped guesses.</span>
                </li>
              </ul>
              <p className="mt-5 text-[11px] leading-5 text-white/44">
                Honest mode: heat labels, anchor venues, and signal copy on this preview are illustrative. No source ingestion is feeding this surface yet.
              </p>
            </div>
          </section>
        </div>
      </main>

      <RouteBottomTabBar />
    </div>
  );
}
