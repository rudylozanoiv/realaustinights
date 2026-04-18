'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { AI_TAGLINE, HEADLINES } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks';

interface HeaderProps {
  search: string;
  onSearchChange: (s: string) => void;
  onSignUpClick: () => void;
  onNavigate: (target: 'tonight' | 'hidden-gems' | 'partner') => void;
}

const ROTATION_MS = 4500;

export function Header({ search, onSearchChange, onSignUpClick, onNavigate }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const reduced = usePrefersReducedMotion();

  // Rotate every 4500ms. Stop rotation when the user prefers reduced motion.
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

  const nav = (target: 'tonight' | 'hidden-gems' | 'partner') => {
    setDrawerOpen(false);
    onNavigate(target);
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
        className="flex items-center justify-between gap-3 bg-cream px-3 py-2 md:px-6"
      >
        {/* Logo */}
        <a href="/" className="flex items-center" aria-label="Real AustiNights — home">
          <Image
            src="/logo.png"
            alt="Real AustiNights"
            width={250}
            height={160}
            priority
            className="h-12 w-auto md:h-20 lg:h-24"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          <label className="relative" aria-label="Search venues">
            <input
              type="search"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="What Y'all Looking For?"
              className="w-52 rounded-full border-[1.5px] border-hairline bg-cream px-4 py-2 font-sans text-sm outline-none focus:border-orange"
            />
          </label>

          <button
            type="button"
            onClick={() => nav('tonight')}
            className="font-display text-sm font-semibold text-orange hover:underline"
          >
            Tonight
          </button>
          <button
            type="button"
            onClick={() => nav('hidden-gems')}
            className="font-display text-sm font-semibold text-ink-mid hover:underline"
          >
            Hidden Gems
          </button>
          <button
            type="button"
            onClick={() => nav('partner')}
            className="font-display text-sm font-semibold text-navy hover:underline"
          >
            For Business
          </button>

          <button
            type="button"
            onClick={onSignUpClick}
            className="rounded-full bg-pink px-6 py-2.5 font-display text-sm font-bold text-white shadow-md hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile: search + hamburger + sign up */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onSignUpClick}
            className="rounded-full bg-pink px-4 py-2 font-display text-xs font-bold text-white shadow-md"
          >
            Sign Up
          </button>
          <button
            type="button"
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(o => !o)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-white text-navy"
          >
            <span aria-hidden>{drawerOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer (disclosure, not a modal) */}
      <div
        id="mobile-drawer"
        aria-label="Mobile navigation"
        hidden={!drawerOpen}
        className={clsx(
          'md:hidden',
          'overflow-hidden border-t border-hairline bg-cream transition-[max-height,opacity] duration-200 ease-out',
          drawerOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="flex flex-col gap-3 px-4 py-4">
          <label className="relative" aria-label="Search venues">
            <input
              type="search"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="What Y'all Looking For?"
              className="w-full rounded-full border-[1.5px] border-hairline bg-white px-4 py-2 font-sans text-sm outline-none focus:border-orange"
            />
          </label>
          <button
            type="button"
            onClick={() => nav('tonight')}
            className="rounded-lg bg-white px-4 py-2.5 text-left font-display text-sm font-semibold text-orange"
          >
            Tonight
          </button>
          <button
            type="button"
            onClick={() => nav('hidden-gems')}
            className="rounded-lg bg-white px-4 py-2.5 text-left font-display text-sm font-semibold text-ink-mid"
          >
            Hidden Gems
          </button>
          <button
            type="button"
            onClick={() => nav('partner')}
            className="rounded-lg bg-white px-4 py-2.5 text-left font-display text-sm font-semibold text-navy"
          >
            For Business
          </button>
        </div>
      </div>

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
