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
    <header className="sticky top-0 z-40 border-b-[3px] border-navy bg-cream">
      {/* Founding Partner banner */}
      <div
        id="partner-cta"
        className="bg-gradient-to-r from-navy to-teal px-4 py-1.5 text-center"
      >
        <span className="font-display text-[11px] font-semibold text-white md:text-xs">
          TESTING MODE — Site under construction. Coming soon to realaustinights.com —{' '}
          <span className="text-yellow-300">Become a Founding Partner</span>
        </span>
      </div>

      <nav
        aria-label="Primary"
        className="flex items-center gap-2 bg-cream px-3 py-2 md:gap-3 md:px-6"
      >
        {/* Logo */}
        <a href="/" className="shrink-0" aria-label="Real AustiNights — home">
          <Image
            src="/logo.png"
            alt="Real AustiNights"
            width={250}
            height={160}
            priority
            className="h-10 w-auto md:h-20 lg:h-24"
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
            className="w-full rounded-full border-[1.5px] border-hairline bg-white py-2.5 pl-4 pr-14 font-sans text-sm outline-none focus:border-orange md:py-3 md:text-base"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-teal text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <span aria-hidden>🔍</span>
          </button>
        </form>

        {/* Sign Up — sacred pink */}
        <button
          type="button"
          onClick={isAuthenticated ? onSignOutClick : onSignUpClick}
          className="shrink-0 rounded-full bg-pink px-4 py-2.5 font-display text-xs font-bold text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink md:px-6 md:py-2.5 md:text-sm"
        >
          {isAuthenticated ? 'Sign Out' : 'Sign Up'}
        </button>
      </nav>

      {/* Live ticker */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="border-t border-hairline bg-teal-light px-4 py-2 md:px-6"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-teal md:text-sm">
          <span className="rounded bg-teal px-2 py-0.5 text-[10px] font-bold text-white">LIVE</span>
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
