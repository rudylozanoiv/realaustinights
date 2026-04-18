'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { Deal } from '@/lib/types';
import { FeaturedPartnerBadge } from './ui/badges';

interface DealsProps {
  deals: Deal[];
  onListBusinessClick: () => void;
  /** Override for tests. Defaults to today. */
  now?: Date;
  className?: string;
}

const CATEGORIES = ['All', 'Auto', 'Services', 'Grocery', 'Beauty', 'Pets', 'Food'] as const;
type Category = typeof CATEGORIES[number];

function daysUntil(iso: string, now: Date): number {
  const end = new Date(iso + 'T23:59:59');
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function Deals({ deals, onListBusinessClick, now = new Date(), className }: DealsProps) {
  const [category, setCategory] = useState<Category>('All');

  const visible = useMemo(() => {
    return deals
      .map(d => ({ d, daysLeft: daysUntil(d.expiresDate, now) }))
      .filter(({ d, daysLeft }) => daysLeft >= 0 && (category === 'All' || d.category === category))
      .sort((a, b) => {
        // Featured partners first, then soonest-to-expire.
        const tier = (t: Deal['sponsorTier']) => (t === 'featured' ? 0 : t === 'founding' ? 1 : 2);
        const byTier = tier(a.d.sponsorTier) - tier(b.d.sponsorTier);
        return byTier !== 0 ? byTier : a.daysLeft - b.daysLeft;
      });
  }, [deals, category, now]);

  return (
    <section
      aria-label="Local deals"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-extrabold text-ink md:text-lg">
            Deals <span aria-hidden>💰</span>
          </h2>
          <p className="text-[11px] text-ink-light">Local savings from businesses you trust.</p>
        </div>
        <button
          type="button"
          onClick={onListBusinessClick}
          className="rounded-lg bg-green px-4 py-2 font-display text-xs font-bold text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          List Your Business
        </button>
      </div>

      {/* Category filters */}
      <div
        role="tablist"
        aria-label="Deal categories"
        className="mb-4 flex flex-wrap gap-1.5"
      >
        {CATEGORIES.map(c => (
          <button
            key={c}
            role="tab"
            aria-selected={category === c}
            type="button"
            onClick={() => setCategory(c)}
            className={clsx(
              'rounded-full px-3 py-1 font-display text-[11px] font-bold transition-colors',
              category === c
                ? 'bg-teal text-white shadow-sm'
                : 'bg-cream text-ink-mid hover:bg-teal-light',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-light">
          No active deals in this category. Check back soon!
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {visible.map(({ d, daysLeft }) => (
            <li
              key={d.id}
              className={clsx(
                'flex flex-col rounded-xl border p-4 shadow-sm',
                d.sponsorTier === 'featured'
                  ? 'border-pink/40 bg-pink/5'
                  : 'border-hairline bg-white',
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-md bg-teal-light px-2 py-0.5 text-[10px] font-bold uppercase text-teal">
                  {d.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {d.isRecurring && (
                    <span className="rounded-md bg-cream px-2 py-0.5 text-[10px] font-bold uppercase text-ink-mid">
                      Recurring
                    </span>
                  )}
                  {d.sponsorTier === 'featured' && <FeaturedPartnerBadge />}
                  <span aria-hidden className="text-xl">
                    {d.icon}
                  </span>
                </div>
              </div>
              <div className="font-display text-sm font-bold text-ink">{d.businessName}</div>
              <p className="mt-1 font-display text-sm font-bold text-green">{d.description}</p>
              <div className="mt-auto flex items-center justify-between pt-3">
                <span className="text-[11px] text-ink-light">
                  Show at checkout
                </span>
                <span
                  className={clsx(
                    'rounded-md px-2 py-0.5 text-[10px] font-bold',
                    daysLeft <= 3
                      ? 'bg-red/10 text-red'
                      : daysLeft <= 7
                        ? 'bg-orange-light text-orange'
                        : 'bg-cream text-ink-mid',
                  )}
                >
                  Expires in {daysLeft === 0 ? 'today' : `${daysLeft}d`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
