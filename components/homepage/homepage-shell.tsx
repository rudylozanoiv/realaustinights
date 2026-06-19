'use client';

import { LockedHeader } from './locked-header';
import { HeroSkylineLogo } from './hero-skyline-logo';
import { FrontDoorDiscovery } from './front-door-discovery';
import { UpcomingCalendarSection } from './upcoming-calendar-section';
import { FooterRoutingSection } from './footer-routing-section';
import {
  HOMEPAGE_NAV_ITEMS,
  HOMEPAGE_VENUE_CARDS,
  HOMEPAGE_CALENDAR_ITEMS,
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

      {/* Front-door locked order: 1) HERO  2) ¡VIVE AUSTIN! (added in commit 2)  3) DISCOVERY */}
      <main id="main" className="flex w-full flex-col gap-8 pb-24 lg:gap-9">
        {/* 1. HERO — golden, untouched. Always the first element. */}
        <HeroSkylineLogo onSignUpClick={onSignUpClick} />

        {/* 3. DISCOVERY (Option A) — curated default + optional vibe/area chips, uses the 25 venues. */}
        <FrontDoorDiscovery items={HOMEPAGE_VENUE_CARDS} />

        {/* Secondary (existing sections, below the front-door regions). */}
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8">
          <UpcomingCalendarSection items={HOMEPAGE_CALENDAR_ITEMS.slice(0, 4)} variant="slim" />
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8">
          <FooterRoutingSection />
        </div>
      </main>
    </div>
  );
}
