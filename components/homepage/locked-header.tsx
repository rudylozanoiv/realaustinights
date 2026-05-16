'use client';

import Link from 'next/link';
import clsx from 'clsx';
import type { HomepageNavItem } from '@/lib/homepage-types';
import { getDesktopNavAccentClasses, getDesktopNavLinkClasses } from './nav-state-styles';

interface LockedHeaderProps {
  navItems: HomepageNavItem[];
  isAuthenticated?: boolean;
  onSignUpClick?: () => void;
  onSignOutClick?: () => void;
  currentPath?: string;
  signUpHref?: string;
}

export function LockedHeader({
  navItems,
  isAuthenticated = false,
  onSignUpClick,
  onSignOutClick,
  currentPath,
  signUpHref,
}: LockedHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(6,4,8,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5 md:px-6 lg:px-8">
        <Link href="/" className="min-w-0 shrink-0" aria-label="Real AustiNights home">
          <div className="flex items-center gap-2">
            <span className="font-display text-[1rem] font-black tracking-[-0.04em] text-white md:text-[1.12rem]">
              Real Austi<span className="text-pink">Nights</span>
            </span>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden min-w-0 flex-1 items-center justify-center gap-10 lg:flex">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || (!currentPath && item.label === 'Tonight');
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={getDesktopNavLinkClasses(isActive)}
              >
                <span>{item.label}</span>
                <span aria-hidden className={getDesktopNavAccentClasses(isActive)} />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            href="/events"
            aria-label="Search"
            className="grid h-8 w-8 place-items-center text-white/72 transition hover:text-white"
          >
            <span aria-hidden className="text-base">⌕</span>
          </Link>

          <Link
            href="/tonight"
            className="hidden items-center gap-2 rounded-md border border-pink/40 bg-[rgba(255,45,135,0.06)] px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-[rgba(255,45,135,0.12)] md:inline-flex"
          >
            <span aria-hidden>✦</span>
            <span>Plan Tonight</span>
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={onSignOutClick}
              className={clsx(
                'rounded-md px-3.5 py-1.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,45,135,0.25)] transition',
                'bg-pink hover:brightness-110',
              )}
            >
              Sign Out
            </button>
          ) : signUpHref ? (
            <Link
              href={signUpHref}
              className={clsx(
                'rounded-md px-3.5 py-1.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,45,135,0.25)] transition',
                'bg-pink hover:brightness-110',
              )}
            >
              Sign Up
            </Link>
          ) : (
            <button
              type="button"
              onClick={onSignUpClick}
              className={clsx(
                'rounded-md px-3.5 py-1.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(255,45,135,0.25)] transition',
                'bg-pink hover:brightness-110',
              )}
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
