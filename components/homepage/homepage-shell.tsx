'use client';

import { LockedHeader } from './locked-header';
import { HeroSkylineLogo } from './hero-skyline-logo';
import { CategoryPills } from './category-pills';
import { EventVenueCardGrid } from './event-venue-card-grid';
import { SignalPanel } from './signal-panel';
import { TopModulesPillStrip } from './top-modules-pill-strip';
import { UpcomingCalendarSection } from './upcoming-calendar-section';
import { PeoplePlacesImageRail } from './people-places-image-rail';
import { FooterRoutingSection } from './footer-routing-section';
import {
  HOMEPAGE_NAV_ITEMS,
  HOMEPAGE_CATEGORY_PILLS,
  HOMEPAGE_VENUE_CARDS,
  HOMEPAGE_SIGNAL_ITEMS,
  HOMEPAGE_CALENDAR_ITEMS,
  HOMEPAGE_LOWER_MODULES,
  HOMEPAGE_IMAGE_RAIL,
} from '@/lib/homepage-mock-data';

interface HomepageShellProps {
  isAuthenticated: boolean;
  onSignUpClick: () => void;
  onSignOutClick: () => void;
}

const TOP_STRIP_IDS = new Set(['que-pasa', 'community', 'pupper-weekly', 'the-weather', 'calendar']);

export function HomepageShell({
  isAuthenticated,
  onSignUpClick,
  onSignOutClick,
}: HomepageShellProps) {
  const topStripItems = HOMEPAGE_LOWER_MODULES.filter((item) => TOP_STRIP_IDS.has(item.id));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#08050a_0%,#120810_28%,#140912_58%,#0c0710_100%)] text-white">
      <LockedHeader
        navItems={HOMEPAGE_NAV_ITEMS}
        isAuthenticated={isAuthenticated}
        onSignUpClick={onSignUpClick}
        onSignOutClick={onSignOutClick}
      />

      <main id="main" className="flex w-full flex-col gap-6 pb-24 lg:gap-7">
        <HeroSkylineLogo onSignUpClick={onSignUpClick} />

        <section
          id="tonight"
          className="mx-auto -mt-1 mb-6 w-full max-w-[1400px] px-4 md:px-6 lg:-mt-3 lg:mb-8 lg:px-8"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_376px] xl:grid-cols-[minmax(0,1fr)_392px] xl:items-start">
            <div className="space-y-4 min-w-0">
              <TopModulesPillStrip items={topStripItems} />

              <div className="rounded-[1rem] border border-white/8 bg-white/[0.025] px-3 py-3.5 shadow-[0_14px_34px_rgba(0,0,0,0.22)] md:px-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-pink/88">Preview picks</p>
                    <h2 className="mt-1.5 font-display text-[2rem] font-black text-white md:text-[2.4rem]">
                      Tonight in Austin
                    </h2>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-white/68 xl:text-right">
                    Browse preview picks by district, mood, or guide. Filter the vibe, then explore filtered previews while venue pages are still being built.
                  </p>
                </div>

                <div className="mt-3.5 border-t border-white/8 pt-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/44">
                      Preview filters
                    </p>
                    <p className="text-[11px] text-white/50">Music, rooftops, comedy, food, cocktails.</p>
                  </div>
                  <CategoryPills items={HOMEPAGE_CATEGORY_PILLS} hrefBase="/tonight" />
                </div>
              </div>

              <EventVenueCardGrid items={HOMEPAGE_VENUE_CARDS} />
            </div>

            <div className="lg:mt-10 xl:mt-12">
              <SignalPanel items={HOMEPAGE_SIGNAL_ITEMS} />
            </div>
          </div>
        </section>

        <div className="mx-auto mt-1 w-full max-w-[1400px] px-4 md:mt-2 md:px-6 lg:mt-3 lg:px-8">
          <UpcomingCalendarSection items={HOMEPAGE_CALENDAR_ITEMS.slice(0, 4)} variant="slim" />
        </div>

        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 md:px-6 lg:px-8">
          <PeoplePlacesImageRail items={HOMEPAGE_IMAGE_RAIL} />
          <FooterRoutingSection />
        </div>
      </main>
    </div>
  );
}
