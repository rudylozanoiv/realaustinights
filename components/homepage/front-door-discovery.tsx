'use client';

import { useMemo, useState } from 'react';
import type { HomepageVenueCard } from '@/lib/homepage-types';

/**
 * Region 3 — Option A discovery.
 * Shows a curated smart-default set immediately (zero taps). Optional vibe + area
 * chips re-filter in place (one tap, skippable, never a blocking quiz).
 * Cards expose a `cardArtUrl` slot (Phase-2 pastel art) → on-brand gradient fallback now.
 * Brand fills: navy #1B2A4A / teal #007A7A / orange #FF8C00 / cream #FFFAF3.
 * Sacred pink #FF69B4 is NEVER used as a card fill.
 */

const BRAND_GRADIENTS = [
  'linear-gradient(135deg, #1B2A4A 0%, #007A7A 100%)', // navy → teal
  'linear-gradient(135deg, #007A7A 0%, #FF8C00 100%)', // teal → orange
  'linear-gradient(135deg, #1B2A4A 0%, #FF8C00 100%)', // navy → orange
  'linear-gradient(135deg, #FF8C00 0%, #1B2A4A 100%)', // orange → navy
  'linear-gradient(135deg, #007A7A 0%, #1B2A4A 100%)', // teal → navy
  'linear-gradient(135deg, #FF8C00 0%, #007A7A 100%)', // orange → teal
];

const DEFAULT_COUNT = 6;
const FILTERED_MAX = 9;

// Smart-default: one representative per vibe (category) in source order, then fill to DEFAULT_COUNT.
function curatedDefault(items: HomepageVenueCard[]): HomepageVenueCard[] {
  const seenCategory = new Set<string>();
  const picks: HomepageVenueCard[] = [];
  for (const item of items) {
    if (picks.length >= DEFAULT_COUNT) break;
    if (!seenCategory.has(item.category)) {
      seenCategory.add(item.category);
      picks.push(item);
    }
  }
  for (const item of items) {
    if (picks.length >= DEFAULT_COUNT) break;
    if (!picks.includes(item)) picks.push(item);
  }
  return picks;
}

function chipClass(active: boolean): string {
  return [
    'inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-semibold transition',
    'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal',
    active
      ? 'border-teal/60 bg-[rgba(0,122,122,0.16)] text-[#7fe3e3]'
      : 'border-white/10 bg-white/[0.03] text-white/78 hover:border-white/25 hover:text-white',
  ].join(' ');
}

export function FrontDoorDiscovery({ items }: { items: HomepageVenueCard[] }) {
  const [vibe, setVibe] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);

  const vibes = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);
  const areas = useMemo(() => Array.from(new Set(items.map((i) => i.neighborhood))), [items]);

  const isDefault = vibe === null && area === null;

  const visible = useMemo(() => {
    if (isDefault) return curatedDefault(items);
    return items
      .filter((i) => (vibe ? i.category === vibe : true) && (area ? i.neighborhood === area : true))
      .slice(0, FILTERED_MAX);
  }, [items, vibe, area, isDefault]);

  const setLabel = isDefault ? "Locals' picks" : [vibe, area].filter(Boolean).join(' · ') || 'Picks';

  return (
    <section id="discovery" className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8">
      {/* Optional filter chips — one-tap re-filter in place, skippable. Never blocks the default set. */}
      <div className="mb-4 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Vibe</span>
          {vibes.map((v) => (
            <button key={v} type="button" aria-pressed={vibe === v} onClick={() => setVibe(vibe === v ? null : v)} className={chipClass(vibe === v)}>
              {v}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/44">Area</span>
          {areas.map((a) => (
            <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(area === a ? null : a)} className={chipClass(area === a)}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-teal">Start here</p>
          <h2 className="mt-1 font-display text-[1.7rem] font-black leading-tight text-white md:text-[2rem]">{setLabel}</h2>
        </div>
        {!isDefault && (
          <button
            type="button"
            onClick={() => {
              setVibe(null);
              setArea(null);
            }}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 underline-offset-4 transition hover:text-white hover:underline"
          >
            Start over
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {visible.map((item, idx) => (
          <DiscoveryCard key={item.id} item={item} idx={idx} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-4 text-sm text-white/60">No picks match that combo yet — tap “Start over” for locals’ picks.</p>
      )}
    </section>
  );
}

function DiscoveryCard({ item, idx }: { item: HomepageVenueCard; idx: number }) {
  const external = Boolean(item.websiteUrl);
  const href = item.websiteUrl ?? item.href;
  const gradient = BRAND_GRADIENTS[idx % BRAND_GRADIENTS.length];

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={`${item.title} — ${item.neighborhood} — ${external ? 'open official website (new tab)' : 'see matching picks'}`}
      className="group relative flex flex-col overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/[0.025] shadow-[0_14px_34px_rgba(0,0,0,0.28)] transition hover:border-teal/40 focus-within:border-teal/40"
    >
      <div className="relative aspect-[4/3]">
        {item.cardArtUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- Phase-2 art URL is arbitrary/remote; plain img avoids next/image remote config for now.
          <img src={item.cardArtUrl} alt={`${item.venueName} card art`} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-3 text-center" style={{ backgroundImage: gradient }}>
            <span className="font-display text-lg font-black leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:text-xl">
              {item.venueName}
            </span>
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
          {item.statusBadge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-display text-[1.05rem] font-black leading-tight text-white">
          {item.title} <span aria-hidden className="text-white/45">{external ? '↗' : '→'}</span>
        </h3>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/52">
          {item.neighborhood} • {item.category}
        </p>
      </div>
    </a>
  );
}
