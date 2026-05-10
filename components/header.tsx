'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { AI_TAGLINE, HEADLINES } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

interface HeaderProps {
  search: string;
  onSearchChange: (s: string) => void;
  onSignUpClick: () => void;
  onSignOutClick?: () => void;
  isAuthenticated?: boolean;
  /** Fired on Enter key or tap of the inline 🔍 submit button. */
  onSearchSubmit?: () => void;
}

const ROTATION_MS = 7000;

export function Header({
  search,
  onSearchChange,
  onSignUpClick,
  onSignOutClick,
  isAuthenticated = false,
  onSearchSubmit,
}: HeaderProps) {
  const [tick, setTick] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick(t => t + 1), ROTATION_MS);
    return () => clearInterval(id);
  }, [reduced]);

  // Every 4th rotation shows the AI tagline instead of a headline.
  const currentHeadline = useMemo(() => {
    if ((tick + 1) % 4 === 0) return AI_TAGLINE;
    return HEADLINES[tick % HEADLINES.length];
  }, [tick]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchSubmit?.();
  };

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-navy/90 bg-cream/90 shadow-[0_10px_30px_rgba(27,42,74,0.08)] backdrop-blur-md">
      {/* Founding Partner banner */}
      <div
        id="partner-cta"
        className="bg-[linear-gradient(90deg,#1B2A4A_0%,#007A7A_55%,#FF8C00_100%)] px-4 py-2 text-center shadow-inner"
      >
        <span className="font-display text-[11px] font-semibold text-white md:text-xs">
          TESTING MODE — Site under construction. Coming soon to realaustinights.com —{' '}
          <span className="text-yellow-300">Become a Founding Partner</span>
        </span>
      </div>

      <nav
        aria-label="Primary"
        className="flex items-center gap-3 bg-white/35 px-3 py-3 md:gap-4 md:px-6"
      >
        {/* Logo */}
        <a href="/" className="shrink-0" aria-label="Real AustiNights — home">
          <Image
            src="/logo.png"
            alt="Real AustiNights"
            width={320}
            height={200}
            priority
            className="h-12 w-auto drop-shadow-[0_10px_18px_rgba(27,42,74,0.18)] md:h-24 lg:h-28"
          />
        </a>

        {/* Search — always visible, prominent. Form wrapper so iOS "Go" / Enter submit. */}
        <form
          role="search"
          onSubmit={handleSubmit}
          className="relative min-w-0 flex-1"
          aria-label="Search venues"
        >
          <label htmlFor="raln-search" className="sr-only">
            Search venues
          </label>
          <input
            id="raln-search"
            name="q"
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="What Y'all Looking For?"
            className="w-full rounded-full border border-white/70 bg-white/95 py-3 pl-4 pr-14 font-sans text-sm shadow-[0_8px_24px_rgba(27,42,74,0.08)] outline-none focus:border-orange md:py-3.5 md:text-base"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[linear-gradient(135deg,#007A7A,#1B2A4A)] text-white shadow-lg hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <span aria-hidden>🔍</span>
          </button>
        </form>

        {/* Sign Up — sacred pink */}
        <button
          type="button"
          onClick={isAuthenticated ? onSignOutClick : onSignUpClick}
          className="shrink-0 rounded-full bg-pink px-4 py-2.5 font-display text-xs font-bold text-white shadow-[0_10px_22px_rgba(255,105,180,0.35)] ring-2 ring-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink md:px-6 md:py-3 md:text-sm"
        >
          {isAuthenticated ? 'Sign Out' : 'Sign Up'}
        </button>
      </nav>

      {/* Live ticker */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="border-t border-white/50 bg-[linear-gradient(90deg,rgba(0,122,122,0.12),rgba(255,140,0,0.10))] px-4 py-2.5 md:px-6"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-teal md:text-sm">
          <span className="rounded-full bg-teal px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">LIVE</span>
          <span
            key={tick}
            className="truncate [animation:raln-fade-in_0.4s_ease] motion-reduce:animate-none"
          >
            {currentHeadline}
          </span>
        </div>
      </div>
    </header>
  );
}
