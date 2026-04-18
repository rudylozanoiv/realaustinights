'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

import { Header } from '@/components/header';
import { WeatherWidget } from '@/components/weather-widget';
import { QuePasaCarousel } from '@/components/que-pasa-carousel';
import { FeedCard } from '@/components/feed-card';
import { VenueDetailModal } from '@/components/venue-detail-modal';
import { VenueDetailCard } from '@/components/venue-detail-card';
import { CommunityFeed } from '@/components/community-feed';
import { PupperWeekly } from '@/components/pupper-weekly';
import { Deals } from '@/components/deals';
import { AfterThis } from '@/components/after-this';
import { WereAustinCalendar } from '@/components/were-austin-calendar';
import { Comedy } from '@/components/comedy';
import { WeirdFunnyCool } from '@/components/weird-funny-cool';
import { AustinPulse } from '@/components/austin-pulse';
import { SignupModal } from '@/components/signup-modal';
import { BusinessPartnerModal } from '@/components/business-partner-modal';
import { Footer } from '@/components/footer';
import { SectionBoundary } from '@/components/ui/section-boundary';
import { VenuesJsonLd, EventsJsonLd } from '@/components/json-ld';

import {
  AFTER_PARTIES,
  CATEGORY_FILTERS,
  CATEGORY_ICONS,
  COMEDY_SHOWS,
  COMMUNITY_POSTS,
  DATE_TABS,
  DEALS,
  FEED_CARDS,
  LIVE_POSTS,
  MAJOR_EVENTS,
  QUE_PASA_PHOTOS,
  VIBE_FILTERS,
  ZETA_POST,
  activeMajorEvent,
} from '@/lib/data';
import type {
  CategoryFilter,
  DateTab,
  FeedCard as FeedCardType,
  UserMode,
  VibeFilter,
} from '@/lib/types';
import { useDebounced, useMounted } from '@/lib/hooks';

export default function Home() {
  // ── State ────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [tab, setTab] = useState<DateTab>('Tonight');
  const [vibes, setVibes] = useState<VibeFilter[]>([]);
  const [cats, setCats] = useState<CategoryFilter[]>(['All']);
  const [selected, setSelected] = useState<FeedCardType | null>(null);
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [yearsInAustin, setYearsInAustin] = useState<number | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const mounted = useMounted();

  // ── Helpers ──────────────────────────────────────────
  const requireLogin = () => {
    if (!isSignedUp) {
      setShowSignup(true);
      return true;
    }
    return false;
  };

  const toggleVibe = (v: VibeFilter) =>
    setVibes(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));

  const toggleCat = (c: CategoryFilter) => {
    if (c === 'All') {
      setCats(['All']);
      return;
    }
    setCats(prev => {
      const next = prev.includes(c)
        ? prev.filter(x => x !== c && x !== 'All')
        : [...prev.filter(x => x !== 'All'), c];
      return next.length === 0 ? ['All'] : next;
    });
  };

  const scrollTo = (id: string) => {
    if (typeof document === 'undefined') return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavigate = (target: 'tonight' | 'hidden-gems' | 'partner') => {
    if (target === 'tonight') {
      setTab('Tonight');
      scrollTo('feed');
    } else if (target === 'hidden-gems') {
      if (!cats.includes('Hidden Gems')) toggleCat('Hidden Gems');
      scrollTo('feed');
    } else {
      scrollTo('partner-cta');
      setShowBusiness(true);
    }
  };

  // ── Filtering ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return FEED_CARDS.filter(c => {
      const vibeOk = vibes.length === 0 || c.vibeTags.some(v => vibes.includes(v));
      const catOk = cats.includes('All') || cats.includes(c.category);
      const dateOk = c.happening.includes(tab);
      const searchOk =
        !q ||
        c.venueName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.neighborhood.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return vibeOk && catOk && dateOk && searchOk;
    });
  }, [tab, vibes, cats, debouncedSearch]);

  // Derive active major event only after mount to avoid hydration drift
  // (activeMajorEvent reads `new Date()` which differs between server and client).
  const activeEvent = mounted ? activeMajorEvent() : undefined;

  return (
    <>
      <VenuesJsonLd venues={FEED_CARDS} />
      <EventsJsonLd shows={COMEDY_SHOWS} parties={AFTER_PARTIES} />

      <Header
        search={search}
        onSearchChange={setSearch}
        onSignUpClick={() => setShowSignup(true)}
        onNavigate={handleNavigate}
      />

      {/* Tourist notice */}
      {userMode === 'tourist' && (
        <div
          role="status"
          className="mx-auto mt-3 flex max-w-7xl items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900"
        >
          <span aria-hidden>✈️</span>
          <div>
            <strong>Guest Access active.</strong> You can browse freely. Submitted photos are
            reviewed before going public.{' '}
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="font-bold text-teal underline"
            >
              Sign in as AustiNight →
            </button>
          </div>
        </div>
      )}

      <div
        className={clsx(
          'mx-auto grid w-full max-w-7xl gap-5 px-3 py-4',
          'md:grid-cols-[1fr_300px] md:gap-6 md:px-6 md:py-6',
          'lg:grid-cols-[280px_1fr_340px]',
        )}
      >
        {/* ── Left sidebar — lg+ only ─────────────────── */}
        <aside
          aria-label="Widgets"
          className="hidden lg:col-start-1 lg:row-start-1 lg:block"
        >
          <div className="sticky top-48 space-y-4">
            <WeatherWidget />
            <MiniQuePasa onJump={() => scrollTo('que-pasa')} />
            <MiniCommunity onJump={() => scrollTo('community')} />
            <MiniPupper onJump={() => scrollTo('pupper')} />
            <MiniDeals onJump={() => scrollTo('deals')} />
            <Categories cats={cats} onToggle={toggleCat} />
            <TonightsPick />
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────── */}
        <main
          id="main"
          className="flex min-w-0 flex-col gap-6 md:col-start-1 md:row-start-1 lg:col-start-2"
        >
          <SectionBoundary label="¿Que Pasa, Austin?">
            <section id="que-pasa" aria-label="¿Que Pasa, Austin?">
              <QuePasaCarousel photos={QUE_PASA_PHOTOS} onSubmitClick={() => requireLogin()} />
            </section>
          </SectionBoundary>

          {/* Weather is in the sidebar on lg+ */}
          <WeatherWidget className="lg:hidden" />

          {/* Date tabs */}
          <div
            role="tablist"
            aria-label="When"
            className="-mx-3 flex gap-2 overflow-x-auto px-3 md:mx-0 md:px-0"
          >
            {DATE_TABS.map(t => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={clsx(
                  'shrink-0 rounded-full px-5 py-2 font-display text-xs font-bold transition-colors',
                  tab === t
                    ? 'bg-orange text-white shadow-md'
                    : 'bg-white text-teal shadow-sm hover:bg-cream',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Vibe filters */}
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Vibe filters">
            {VIBE_FILTERS.map(v => {
              const on = vibes.includes(v.label);
              return (
                <button
                  key={v.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleVibe(v.label)}
                  className={clsx(
                    'rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors',
                    on
                      ? 'bg-teal text-white'
                      : 'border border-hairline bg-white text-ink-mid hover:bg-cream',
                  )}
                >
                  <span aria-hidden>{v.emoji}</span> {v.label}
                </button>
              );
            })}
          </div>

          {/* Categories — mobile/tablet only; desktop uses sidebar */}
          <div className="lg:hidden">
            <Categories cats={cats} onToggle={toggleCat} />
          </div>

          <SectionBoundary label="Feed">
            <section id="feed" aria-label="Tonight's feed" className="flex flex-col">
              <h2 className="mb-3 font-display text-xl font-extrabold text-ink md:text-2xl">
                What&apos;s <span aria-hidden>⬆️</span>{' '}
                <span className="text-orange">{tab}</span>
              </h2>
              {filtered.length === 0 ? (
                <p className="rounded-xl border border-hairline bg-white p-8 text-center text-sm text-ink-light">
                  No weirdness found. Try adjusting filters!
                </p>
              ) : (
                filtered.map(card => (
                  <FeedCard key={card.id} card={card} onViewDetails={setSelected} />
                ))
              )}
            </section>
          </SectionBoundary>

          <SectionBoundary label="Community">
            <section id="community">
              <CommunityFeed
                posts={COMMUNITY_POSTS}
                onPostClick={() => requireLogin()}
              />
            </section>
          </SectionBoundary>

          <SectionBoundary label="Pupper Weekly">
            <section id="pupper">
              <PupperWeekly hero={ZETA_POST} onSubmitClick={() => requireLogin()} />
            </section>
          </SectionBoundary>

          <SectionBoundary label="Deals">
            <section id="deals">
              <Deals
                deals={DEALS}
                onListBusinessClick={() => setShowBusiness(true)}
              />
            </section>
          </SectionBoundary>

          <SectionBoundary label="After This">
            <section id="after-this">
              <AfterThis parties={AFTER_PARTIES} activeEvent={activeEvent} />
            </section>
          </SectionBoundary>

          <SectionBoundary label="We're Austin">
            <section id="were-austin">
              <WereAustinCalendar events={MAJOR_EVENTS} />
            </section>
          </SectionBoundary>

          <SectionBoundary label="Comedy">
            <section id="comedy">
              <Comedy shows={COMEDY_SHOWS} />
            </section>
          </SectionBoundary>

          <SectionBoundary label="Weird / Funny / Cool">
            <section id="weird-funny-cool">
              <WeirdFunnyCool onRequireLogin={() => requireLogin()} />
            </section>
          </SectionBoundary>

          <SectionBoundary label="Austin Pulse">
            {/* Austin Pulse on mobile only — right sidebar takes over at md+ */}
            <section id="pulse-mobile" className="md:hidden">
              <AustinPulse posts={LIVE_POSTS} />
            </section>
          </SectionBoundary>
        </main>

        {/* ── Right sidebar — md+ ──────────────────────── */}
        <aside
          aria-label={selected ? 'Venue details' : 'Austin Pulse'}
          className="hidden md:col-start-2 md:row-start-1 md:block lg:col-start-3"
        >
          <div className="sticky top-48 max-h-[calc(100vh-210px)] overflow-y-auto rounded-2xl border border-hairline bg-white shadow-sm">
            {selected ? (
              <VenueDetailCard
                venue={selected}
                onClose={() => setSelected(null)}
                onSignInRequired={() => setShowSignup(true)}
                isAustinight={userMode === 'austinight'}
              />
            ) : (
              <AustinPulse posts={LIVE_POSTS} />
            )}
          </div>
        </aside>
      </div>

      <Footer onFoundingClick={() => setShowSignup(true)} />

      {/* Modals */}
      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSignedUp={({ mode, years }) => {
          setUserMode(mode);
          setYearsInAustin(years);
          setIsSignedUp(true);
          setShowSignup(false);
        }}
      />
      <BusinessPartnerModal
        open={showBusiness}
        onClose={() => setShowBusiness(false)}
        onSubmit={() => {
          // Submission is displayed inside the modal; no page-level action yet.
        }}
      />

      {/* Mobile-only venue modal — desktop uses inline card in right sidebar. */}
      <VenueDetailModal
        venue={selected}
        onClose={() => setSelected(null)}
        onSignInRequired={() => setShowSignup(true)}
        isAustinight={userMode === 'austinight'}
        className="md:hidden"
      />
    </>
  );
}

// ──────────────────────────────────────────────────────
// Sidebar widgets (desktop left column)
// ──────────────────────────────────────────────────────

function Categories({
  cats,
  onToggle,
}: {
  cats: CategoryFilter[];
  onToggle: (c: CategoryFilter) => void;
}) {
  return (
    <section aria-label="Categories" className="rounded-2xl border border-hairline bg-white p-3 shadow-sm">
      <div className="mb-2 font-display text-[11px] font-bold uppercase tracking-wider text-ink-light">
        Categories
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_FILTERS.map(c => {
          const on = cats.includes(c);
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(c)}
              className={clsx(
                'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
                on ? 'bg-teal text-white' : 'bg-cream text-ink-mid hover:bg-teal-light',
              )}
            >
              <span aria-hidden>{CATEGORY_ICONS[c]}</span> {c}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MiniQuePasa({ onJump }: { onJump: () => void }) {
  const photo = QUE_PASA_PHOTOS[0];
  return (
    <button
      type="button"
      onClick={onJump}
      aria-label="Jump to ¿Que Pasa?"
      className="group relative block h-40 w-full overflow-hidden rounded-2xl border border-hairline bg-white text-left shadow-sm"
    >
      <Image
        src={photo.photoUrl}
        alt=""
        fill
        sizes="280px"
        className="object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transition-none"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2">
        <div className="font-display text-xs font-extrabold text-white">
          ¿Que Pasa? 📸
        </div>
        <div className="truncate text-[10px] text-white/80">{photo.caption}</div>
      </div>
    </button>
  );
}

function MiniCommunity({ onJump }: { onJump: () => void }) {
  const posts = COMMUNITY_POSTS.slice(0, 3);
  return (
    <button
      type="button"
      onClick={onJump}
      aria-label="Jump to Community"
      className="block w-full rounded-2xl border border-hairline bg-white p-3 text-left shadow-sm hover:bg-cream"
    >
      <div className="mb-1.5 font-display text-xs font-extrabold text-navy">
        Community 💬
      </div>
      <ul className="space-y-1">
        {posts.map(p => (
          <li key={p.id} className="truncate text-[11px] leading-tight text-ink-mid">
            <span className="font-bold text-teal">{p.username}</span>{' '}
            {p.message}
          </li>
        ))}
      </ul>
    </button>
  );
}

function MiniPupper({ onJump }: { onJump: () => void }) {
  return (
    <button
      type="button"
      onClick={onJump}
      aria-label="Jump to Pupper Weekly"
      className="flex w-full items-center gap-3 rounded-2xl border border-hairline bg-gradient-to-br from-teal-light to-orange-light p-2.5 text-left shadow-sm"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
        <Image
          src={ZETA_POST.photoUrl}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <div className="font-display text-[11px] font-extrabold text-orange">
          PUPPER WEEKLY 🐾
        </div>
        <div className="line-clamp-2 text-[11px] leading-tight text-ink-mid">
          {ZETA_POST.caption}
        </div>
      </div>
    </button>
  );
}

function MiniDeals({ onJump }: { onJump: () => void }) {
  const top = DEALS.slice(0, 3);
  return (
    <button
      type="button"
      onClick={onJump}
      aria-label="Jump to Deals"
      className="block w-full rounded-2xl border border-hairline bg-white p-3 text-left shadow-sm hover:bg-cream"
    >
      <div className="mb-1 font-display text-xs font-extrabold text-green">
        💰 DEALS
      </div>
      <ul className="divide-y divide-hairline text-[11px]">
        {top.map(d => (
          <li key={d.id} className="flex items-center justify-between py-1">
            <span className="truncate text-ink">{d.businessName}</span>
            <span className="shrink-0 font-bold text-green">
              {d.description.split(' ').slice(0, 2).join(' ')}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-1.5 text-[10px] font-semibold text-teal">
        View all deals →
      </div>
    </button>
  );
}

function TonightsPick() {
  const pick = FEED_CARDS.find(c => c.isFoundingPartner) ?? FEED_CARDS[0];
  return (
    <section
      aria-label="Tonight's pick"
      className="rounded-2xl bg-orange-light p-3"
    >
      <div className="font-display text-[11px] font-bold uppercase tracking-wider text-orange">
        🍽️ Tonight&apos;s Pick
      </div>
      <div className="mt-1 text-xs leading-relaxed text-ink-mid">
        <strong className="text-ink">{pick.venueName}</strong> — {pick.description.split('.')[0]}.
      </div>
    </section>
  );
}
