'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { FeedCard } from '@/lib/types';
import { VenueDetailCard } from './venue-detail-card';

interface VenueDetailModalProps {
  venue: FeedCard | null;
  onClose: () => void;
  onSignInRequired?: () => void;
  isAustinight?: boolean;
  /** Optional extra class for the outer overlay (e.g. `lg:hidden`). */
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Full-screen mobile modal. Desktop page.tsx should render <VenueDetailCard> in the sidebar instead. */
export function VenueDetailModal({
  venue,
  onClose,
  onSignInRequired,
  isAustinight = false,
  className,
}: VenueDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!venue) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [venue, onClose]);

  if (!venue) return null;

  return (
    <div
      className={clsx('fixed inset-0 z-[90] bg-black/40', className)}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`venue-${venue.id}-title`}
        onClick={e => e.stopPropagation()}
        className="fixed inset-0 flex flex-col bg-cream"
      >
        <VenueDetailCard
          venue={venue}
          onClose={onClose}
          onSignInRequired={onSignInRequired}
          isAustinight={isAustinight}
        />
      </div>
    </div>
  );
}
