'use client';

import { LockedHeader } from './locked-header';
import { HeroSkylineLogo } from './hero-skyline-logo';
import { CategoryPills } from './category-pills';
import { EventVenueCardGrid } from './event-venue-card-grid';
import { SignalPanel } from './signal-panel';
import { LowerModulesRow } from './lower-modules-row';
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

export function HomepageShell({
  isAuthenticated,
  onSignUpClick,
  onSignOutClick,
}: HomepageShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#08050a_0%,#120810_28%,#140912_58%,#0c0710_100%)] text-white">
      <LockedHeader
        navItems={HOMEPAGE_NAV_ITEMS}
        isAuthenticated={isAuthenticated}
        onSignUpClick={onSignUpClick}
        onSignOutClick={onSignOutClick}
      />

      <main id="main" className="flex w-full flex-col gap-12 pb-24">
        <HeroSkylineLogo onSignUpClick={onSignUpClick} />

        <section
          id="tonight"
          className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-pink">Right Now</p>
                  <h2 className="mt-2 font-display text-3xl font-black text-white md:text-4xl">
                    Tonight in Austin
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-white/72">
                  Live picks from across the city — filter the vibe, then dive into a venue or event.
                </p>
              </div>

              <CategoryPills items={HOMEPAGE_CATEGORY_PILLS} hrefBase="/tonight" />

              <EventVenueCardGrid items={HOMEPAGE_VENUE_CARDS} />
            </div>

            <SignalPanel items={HOMEPAGE_SIGNAL_ITEMS} />
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 md:px-6 lg:px-8">
          <UpcomingCalendarSection items={HOMEPAGE_CALENDAR_ITEMS} />
          <LowerModulesRow items={HOMEPAGE_LOWER_MODULES} />
          <PeoplePlacesImageRail items={HOMEPAGE_IMAGE_RAIL} />
          <FooterRoutingSection onSignUpClick={onSignUpClick} />
        </div>
      </main>
    </div>
  );
}
