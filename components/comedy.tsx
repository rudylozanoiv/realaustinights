'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { ComedyShow, ComedyVenueType } from '@/lib/types';

interface ComedyProps {
  shows: ComedyShow[];
  className?: string;
}

export function Comedy({ shows, className }: ComedyProps) {
  const [venueType, setVenueType] = useState<ComedyVenueType>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    return shows.filter(s => {
      const venueOk = venueType === 'all' || s.venueType === venueType;
      const fromOk = !from || s.dateObj >= from;
      const toOk = !to || s.dateObj <= to;
      return venueOk && fromOk && toOk;
    });
  }, [shows, venueType, dateFrom, dateTo]);

  return (
    <section
      aria-label="Comedy in Austin"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <h2 className="font-display text-base font-extrabold text-ink md:text-lg">
        Comedy in Austin <span aria-hidden>😂</span>
      </h2>
      <p className="text-[11px] text-ink-light">Stand-up, open mics, and big touring acts.</p>

      <div className="mt-3 flex flex-col gap-2 min-[401px]:flex-row min-[401px]:flex-wrap min-[401px]:items-center">
        <div
          role="tablist"
          aria-label="Venue type"
          className="inline-flex rounded-lg border border-hairline bg-cream p-1"
        >
          {(['all', 'comedy club', 'major venue'] as const).map(t => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={venueType === t}
              onClick={() => setVenueType(t)}
              className={clsx(
                'rounded-md px-3 py-1.5 font-display text-[11px] font-bold capitalize transition-colors',
                venueType === t ? 'bg-teal text-white' : 'text-ink-mid hover:bg-white',
              )}
            >
              {t === 'all' ? 'All Venues' : t === 'comedy club' ? '🎤 Club' : '🏟️ Major'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="comedy-from">From date</label>
          <input
            id="comedy-from"
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="rounded-md border border-hairline bg-cream px-2 py-1 text-xs text-ink"
          />
          <span aria-hidden className="text-xs text-ink-light">→</span>
          <label className="sr-only" htmlFor="comedy-to">To date</label>
          <input
            id="comedy-to"
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="rounded-md border border-hairline bg-cream px-2 py-1 text-xs text-ink"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-light">
          No shows found. Try adjusting the filters.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {filtered.map(show => {
            const isOpen = openId === show.id;
            return (
              <li key={show.id}>
                {/* role=button (not <button>) so the nested <a> Tickets link stays valid HTML.
                    Nested interactive elements inside <button> break click dispatch on iOS Safari. */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenId(v => (v === show.id ? null : show.id))}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenId(v => (v === show.id ? null : show.id));
                    }
                  }}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Collapse' : 'Open'} details for ${show.comedian} at ${show.venueName}`}
                  className="flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-hairline bg-cream text-left shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal min-[401px]:flex-row motion-reduce:hover:translate-y-0"
                >
                  <div className="relative aspect-video w-full min-[401px]:aspect-auto min-[401px]:h-24 min-[401px]:w-28 min-[401px]:shrink-0">
                    <Image
                      src={show.image}
                      alt={`${show.comedian} at ${show.venueName}`}
                      fill
                      sizes="(max-width: 400px) 100vw, 112px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-bold text-ink">
                            {show.comedian}
                          </span>
                          {show.soldOut && (
                            <span className="rounded-md bg-red/10 px-2 py-0.5 text-[10px] font-bold text-red">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-light">
                          {show.venueName} · {show.neighborhood}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xs font-bold text-teal">{show.date}</div>
                        <div className="text-[11px] text-ink-light">{show.time}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-orange">{show.price}</span>
                      {show.hasAlcohol && (
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                          🍺 Bar
                        </span>
                      )}
                      {show.hasFood && (
                        <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800">
                          🍽️ Food
                        </span>
                      )}
                      <span className="rounded-md bg-navy-light px-2 py-0.5 text-[10px] font-semibold text-navy">
                        {show.venueType === 'comedy club' ? '🎤 Club' : '🏟️ Major'}
                      </span>
                      {show.ticketUrl && !show.soldOut && (
                        // External link — stopPropagation so tapping it doesn't also toggle the card expansion.
                        <a
                          href={show.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="ml-auto rounded-md bg-teal px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110"
                        >
                          Tickets →
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-2 rounded-xl border border-hairline bg-white p-3">
                    <h3 className="font-display text-sm font-bold text-ink">
                      {show.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink-mid">
                      {show.comedian} brings it to {show.venueName} on {show.date} · {show.time}.
                    </p>
                    <p className="mt-2 text-[11px] text-ink-light">
                      Full show details, seating chart, and review links coming soon.
                    </p>
                    {show.ticketUrl && !show.soldOut && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block rounded-md bg-teal px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110"
                      >
                        Get Tickets →
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
