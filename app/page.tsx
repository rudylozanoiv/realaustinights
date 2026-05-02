'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { Header } from '@/components/header';
import { WeatherWidget } from '@/components/weather-widget';
import { QuePasaCarousel } from '@/components/que-pasa-carousel';
import { QuePasaModal, type PhotoItem } from '@/components/que-pasa-modal';
import { FeedCard } from '@/components/feed-card';
import { VenueDetailModal } from '@/components/venue-detail-modal';
import { VenueDetailCard } from '@/components/venue-detail-card';
import { CommunityFeed } from '@/components/community-feed';
import { PupperWeekly, type PupperGalleryItem } from '@/components/pupper-weekly';
import { Deals } from '@/components/deals';
import { AfterThis } from '@/components/after-this';
import { WereAustinCalendar } from '@/components/were-austin-calendar';
import { Comedy } from '@/components/comedy';
import { WeirdFunnyCool } from '@/components/weird-funny-cool';
import { AustinPulse } from '@/components/austin-pulse';
import  SignupModal from '@/components/signup-modal';
import { BusinessPartnerModal } from '@/components/business-partner-modal';
import { Footer } from '@/components/footer';
import { BottomTabBar, type BottomTab } from '@/components/bottom-tab-bar';
import { SectionBoundary } from '@/components/ui/section-boundary';
import { VenuesJsonLd, EventsJsonLd } from '@/components/json-ld';
import { createClient } from '@/lib/supabase/client';

import {
  AFTER_PARTIES,
  CATEGORY_FILTERS,
  CATEGORY_ICONS,
  COMEDY_SHOWS,
  COMMUNITY_POSTS,
  DATE_TABS,
  DEALS,
  FEED_CARDS,
  FEED_CARD_BY_ID,
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

// TODO: Replace with Rudy-supplied Zeta + Barkingham pup photos at go-live.
const PUPPER_GALLERY: PupperGalleryItem[] = [
  {
    id: 'p-max',
    photoUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80',
    name: 'Max the Golden',
    venue: 'Zilker Park',
  },
  {
    id: 'p-luna',
    photoUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80',
    name: 'Luna',
    venue: 'Lady Bird Lake',
  },
];

export default function Home() {
  // ── State ────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounced(search, 300);
  const [tab, setTab] = useState<DateTab>('Tonight');
  const [vibes, setVibes] = useState<VibeFilter[]>([]);
  const [cats, setCats] = useState<CategoryFilter[]>(['All']);
  const [selected, setSelected] = useState<FeedCardType | null>(null);
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [, setYearsInAustin] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [bottomTab, setBottomTab] = useState<BottomTab | null>('home');
  const [quePasaIdx, setQuePasaIdx] = useState<number | null>(null);
  const [pupperIdx, setPupperIdx] = useState<number | null>(null);
  const mounted = useMounted();

  // ── Auth: real Supabase session ──────────────────────
  useEffect(() => {
    type MetaShape = { mode?: UserMode; years_in_austin?: number | null };

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setAuthError('Auth is not configured for this build.');
      return;
    }

    const applyUser = (user: { user_metadata?: unknown } | null | undefined) => {
      setIsAuthenticated(Boolean(user));
      const meta = (user?.user_metadata ?? undefined) as MetaShape | undefined;
      if (meta?.mode === 'austinight' || meta?.mode === 'tourist') {
        setUserMode(meta.mode);
      }
      if (typeof meta?.years_in_austin === 'number') {
        setYearsInAustin(meta.years_in_austin);
      }
    };

    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      applyUser(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errKey = params.get('auth_error');
      if (errKey === 'callback' || errKey === 'confirm') {
        const reasonKey = params.get('auth_reason');
        const reasonText: Record<string, string> = {
          missing_credentials: 'The link was missing required data.',
          exchange_failed: 'We could not complete the sign-in. Please request a new link.',
          verify_failed: 'The confirmation link has expired or already been used.',
          bad_type: 'The confirmation link is malformed.',
          supabase_error: 'Supabase reported an error during confirmation.',
        };
        const reasonMsg = reasonKey ? reasonText[reasonKey] : undefined;
        setAuthError(
          reasonMsg
            ? `Email confirmation failed. ${reasonMsg}`
            : 'Email confirmation failed. Please request a new sign-up link.',
        );
      }
    }

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore: missing env vars or network. Local state still clears below.
    }
    setIsAuthenticated(false);
    setUserMode(null);
    setYearsInAustin(null);
  };

  // ── Helpers ──────────────────────────────────────────
  const requireLogin = () => {
    if (!isAuthenticated) {
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

  const handleHome = () => {
    setBottomTab('home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTonight = () => {
    setBottomTab('tonight');
    setTab('Tonight');
    scrollTo('feed');
  };

  const handleGems = () => {
    setBottomTab('gems');
    if (!cats.includes('Hidden Gems')) toggleCat('Hidden Gems');
    scrollTo('feed');
  };

  const handleBusiness = () => {
    setBottomTab('business');
    setShowBusiness(true);
  };

  const openBarkingham = () => {
    const card = FEED_CARD_BY_ID['barkingham'];
    if (card) setSelected(card);
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

  const activeEvent = mounted ? activeMajorEvent() : undefined;

  // QuePasa modal photos — shape the data for the modal.
  const quePasaItems: PhotoItem[] = useMemo(
    () =>
      QUE_PASA_PHOTOS.map(p => ({
        id: p.id,
        photoUrl: p.photoUrl,
        caption: p.caption,
        username: p.username,
        venueName: p.venueName,
        neighborhood: p.neighborhood,
        googleMapsUrl: p.googleMapsUrl,
        appleMapsUrl: p.appleMapsUrl,
      })),
    [],
  );

  // Pupper modal photos — hero + gallery.
  const pupperItems: PhotoItem[] = useMemo(
    () => [
      {
        id: ZETA_POST.id,
        photoUrl: ZETA_POST.photoUrl,
        caption: ZETA_POST.caption,
        venueName: ZETA_POST.venue,
      },
      ...PUPPER_GALLERY.map(p => ({
        id: p.id,
        photoUrl: p.photoUrl,
        caption: `${p.name} at ${p.venue}`,
        venueName: p.venue,
      })),
    ],
    [],
  );

  return (
    <>
      <VenuesJsonLd venues={FEED_CARDS} />
      <EventsJsonLd shows={COMEDY_SHOWS} parties={AFTER_PARTIES} />

      <Header
        search={search}
        onSearchChange={setSearch}
        onSignUpClick={() => setShowSignup(true)}
        onSignOutClick={handleSignOut}
        isAuthenticated={isAuthenticated}
        onSearchSubmit={() => scrollTo('feed')}
      />

      {authError && (
        <div
          role="alert"
          className="mx-auto mt-3 flex max-w-7xl items-start gap-2 rounded-xl border border-pink/40 bg-pink/10 px-4 py-2.5 text-xs text-pink"
        >
          <span aria-hidden>⚠️</span>
          <div>
            <strong>{authError}</strong>{' '}
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="ml-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
          'mx-auto grid w-full max-w-7xl gap-5 px-3 py-4 pb-24',
          'md:grid-cols-[1fr_300px] md:gap-6 md:px-6 md:py-6 md:pb-6',
          'lg:grid-cols-[280px_1fr_340px]',
        )}
      >
        {/* ── Left sidebar — lg+ only ─────────────────── */}
        <aside aria-label="Widgets" className="hidden lg:col-start-1 lg:row-start-1 lg:block">
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

        {/* ── Main — mobile stack order per V8.1 spec ─── */}
        <main
          id="main"
          className="flex min-w-0 flex-col gap-6 md:col-start-1 md:row-start-1 lg:col-start-2"
        >
          {/* 1. WeirdFunnyCool — hero position on mobile */}
          <SectionBoundary label="Weird / Funny / Cool">
            <section id="weird-funny-cool" aria-label="Weird Funny Cool">
              <WeirdFunnyCool
                isSignedIn={isAuthenticated}
                onRequireLogin={() => requireLogin()}
              />
            </section>
          </SectionBoundary>

          {/* 2. Que Pasa carousel */}
          <SectionBoundary label="¿Que Pasa, Austin?">
            <section id="que-pasa" aria-label="¿Que Pasa, Austin?">
              <QuePasaCarousel
                photos={QUE_PASA_PHOTOS}
                onSubmitClick={() => requireLogin()}
                onPhotoClick={i => setQuePasaIdx(i)}
              />
            </section>
          </SectionBoundary>

          {/* 3. We're Austin calendar */}
          <SectionBoundary label="We're Austin">
            <section id="were-austin">
              <WereAustinCalendar events={MAJOR_EVENTS} />
            </section>
          </SectionBoundary>

          {/* 4. Weather — mobile/tablet only; desktop has it in sidebar */}
          <WeatherWidget className="lg:hidden" />

          {/* 5. Date tabs */}
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
                  'shrink-0 rounded-full px-5 py-2.5 font-display text-xs font-bold transition-colors',
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
                    'rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
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

          {/* Categories — mobile/tablet only; desktop sidebar has them */}
          <div className="lg:hidden">
            <Categories cats={cats} onToggle={toggleCat} />
          </div>

          {/* 6. Main Feed */}
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

          {/* 7. Community */}
          <SectionBoundary label="Community">
            <section id="community">
              <CommunityFeed
                posts={COMMUNITY_POSTS}
                onPostClick={() => requireLogin()}
                isSignedIn={isAuthenticated}
                onSignInRequired={() => setShowSignup(true)}
              />
            </section>
          </SectionBoundary>

          {/* 8. Pupper Weekly */}
          <SectionBoundary label="Pupper Weekly">
            <section id="pupper">
              <PupperWeekly
                hero={ZETA_POST}
                gallery={PUPPER_GALLERY}
                onSubmitClick={() => requireLogin()}
                onPhotoClick={i => setPupperIdx(i)}
                onBarkinghamClick={openBarkingham}
              />
            </section>
          </SectionBoundary>

          {/* 9. Deals */}
          <SectionBoundary label="Deals">
            <section id="deals">
              <Deals
                deals={DEALS}
                onListBusinessClick={() => setShowBusiness(true)}
                onDealClick={deal =>
                  alert(
                    `${deal.businessName}: ${deal.description}\n\nFull deal detail page coming soon.`,
                  )
                }
              />
            </section>
          </SectionBoundary>

          {/* 10. After This */}
          <SectionBoundary label="After This">
            <section id="after-this">
              <AfterThis parties={AFTER_PARTIES} activeEvent={activeEvent} />
            </section>
          </SectionBoundary>

          {/* 11. Comedy */}
          <SectionBoundary label="Comedy">
            <section id="comedy">
              <Comedy shows={COMEDY_SHOWS} />
            </section>
          </SectionBoundary>

          {/* 12. Austin Pulse — portrait mobile renders here as full-width section.
              On md+ (tablet landscape / desktop) the right sidebar takes over. */}
          <SectionBoundary label="Austin Pulse">
            <section id="pulse-mobile" aria-label="Austin Pulse live updates" className="md:hidden">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red" aria-hidden />
                <p className="font-display text-[11px] font-bold uppercase tracking-wider text-red">
                  Austin Pulse — Live Updates
                </p>
              </div>
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

      {/* Bottom tab bar — mobile only, fixed. Replaces hamburger drawer. */}
      <BottomTabBar
        active={bottomTab}
        onHome={handleHome}
        onTonight={handleTonight}
        onGems={handleGems}
        onBusiness={handleBusiness}
      />

      {/* Modals */}
      <SignupModal
        open={showSignup}
        onClose={() => setShowSignup(false)}
        onSignedUp={({ mode, years }) => {
          // Supabase signUp succeeded but email confirmation is still required.
          // Record the user's selected preferences for UI; do NOT mark as
          // authenticated — that flips only when onAuthStateChange sees a session.
          setUserMode(mode);
          setYearsInAustin(years);
        }}
        onSignedIn={() => {
          // Sign-in success — onAuthStateChange will flip isAuthenticated.
          // Just close the modal here.
          setShowSignup(false);
        }}
      />
      <BusinessPartnerModal
        open={showBusiness}
        onClose={() => setShowBusiness(false)}
        onSubmit={() => {
          // Submission is displayed inside the modal; Stripe wiring TODO.
        }}
      />

      {/* Mobile venue modal */}
      <VenueDetailModal
        venue={selected}
        onClose={() => setSelected(null)}
        onSignInRequired={() => setShowSignup(true)}
        isAustinight={userMode === 'austinight'}
        className="md:hidden"
      />

      {/* Fullscreen photo viewer — Que Pasa */}
      {quePasaIdx !== null && (
        <QuePasaModal
          photos={quePasaItems}
          startIndex={quePasaIdx}
          onClose={() => setQuePasaIdx(null)}
          onCommentRequireLogin={() => requireLogin()}
        />
      )}

      {/* Fullscreen photo viewer — Pupper */}
      {pupperIdx !== null && (
        <QuePasaModal
          photos={pupperItems}
          startIndex={pupperIdx}
          onClose={() => setPupperIdx(null)}
          onCommentRequireLogin={() => requireLogin()}
        />
      )}
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
    <section
      aria-label="Categories"
      className="rounded-2xl border border-hairline bg-white p-3 shadow-sm"
    >
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
                'rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors',
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
        <div className="font-display text-xs font-extrabold text-white">¿Que Pasa? 📸</div>
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
      <div className="mb-1.5 font-display text-xs font-extrabold text-navy">Community 💬</div>
      <ul className="space-y-1">
        {posts.map(p => (
          <li key={p.id} className="truncate text-[11px] leading-tight text-ink-mid">
            <span className="font-bold text-teal">{p.username}</span> {p.message}
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
        <Image src={ZETA_POST.photoUrl} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-[11px] font-extrabold text-orange">PUPPER WEEKLY 🐾</div>
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
      <div className="mb-1 font-display text-xs font-extrabold text-green">💰 DEALS</div>
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
      <div className="mt-1.5 text-[10px] font-semibold text-teal">View all deals →</div>
    </button>
  );
}

function TonightsPick() {
  const pick = FEED_CARDS.find(c => c.isFoundingPartner) ?? FEED_CARDS[0];
  return (
    <section aria-label="Tonight's pick" className="rounded-2xl bg-orange-light p-3">
      <div className="font-display text-[11px] font-bold uppercase tracking-wider text-orange">
        🍽️ Tonight&apos;s Pick
      </div>
      <div className="mt-1 text-xs leading-relaxed text-ink-mid">
        <strong className="text-ink">{pick.venueName}</strong> — {pick.description.split('.')[0]}.
      </div>
    </section>
  );
}
