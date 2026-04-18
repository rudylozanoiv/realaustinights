'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { AfterParty, AfterPartyEvent, MajorEvent } from '@/lib/types';
import { AFTER_PARTY_EVENTS } from '@/lib/data';

interface AfterThisProps {
  parties: AfterParty[];
  activeEvent?: MajorEvent;
  onSubmit?: (payload: { category: AfterPartyEvent; location: string }) => void;
  className?: string;
}

/** Map AfterPartyEvent → matching MajorEvent.name for the "tab glow" check. */
const EVENT_TO_MAJOR: Record<AfterPartyEvent, MajorEvent['name']> = {
  SXSW: 'SXSW',
  ACL: 'ACL',
  COTA: 'COTA',
  Longhorns: 'Longhorns',
  'Austin FC / MLS': 'Austin FC',
  'Rodeo Austin': 'Rodeo',
};

export function AfterThis({ parties, activeEvent, onSubmit, className }: AfterThisProps) {
  const [tab, setTab] = useState<AfterPartyEvent>('SXSW');
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitCategory, setSubmitCategory] = useState<AfterPartyEvent>('SXSW');
  const [submitLocation, setSubmitLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const visible = useMemo(() => parties.filter(p => p.event === tab), [parties, tab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitLocation.trim()) return;
    onSubmit?.({ category: submitCategory, location: submitLocation.trim() });
    setSubmitted(true);
  };

  return (
    <section
      aria-label="After This — late-night destinations"
      className={clsx(
        'rounded-2xl border border-hairline bg-white p-4 shadow-sm md:p-5',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-extrabold text-ink md:text-lg">
            After This <span aria-hidden>🎉</span>
          </h2>
          <p className="text-[11px] text-ink-light">
            Public venues only.{' '}
            <strong className="text-red">Do not post personal party addresses.</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitOpen(s => !s)}
          aria-expanded={submitOpen}
          className="rounded-lg bg-navy px-4 py-2 font-display text-xs font-bold text-white shadow hover:brightness-110"
        >
          {submitOpen ? 'Close' : 'Submit a spot'}
        </button>
      </div>

      {/* Event tabs — glow when that event is currently active. */}
      <div role="tablist" aria-label="Event" className="mb-4 flex flex-wrap gap-1.5">
        {AFTER_PARTY_EVENTS.map(ev => {
          const isGlowing =
            activeEvent && EVENT_TO_MAJOR[ev] === activeEvent.name;
          const isSelected = tab === ev;
          return (
            <button
              key={ev}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => setTab(ev)}
              className={clsx(
                'rounded-full px-3 py-1 font-display text-[11px] font-bold transition-colors',
                isSelected
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-cream text-ink-mid hover:bg-teal-light',
                isGlowing && !isSelected && 'ring-2 ring-orange ring-offset-1',
                isGlowing && isSelected && 'ring-2 ring-orange ring-offset-1',
              )}
            >
              {ev}
              {isGlowing && <span className="ml-1" aria-label="happening now">🔥</span>}
            </button>
          );
        })}
      </div>

      {submitOpen && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 grid gap-2 rounded-xl border border-hairline bg-cream p-3"
        >
          <label className="block text-xs">
            <span className="font-bold text-ink">Event</span>
            <select
              value={submitCategory}
              onChange={e => setSubmitCategory(e.target.value as AfterPartyEvent)}
              className="mt-1 w-full rounded-md border border-hairline bg-white px-2 py-1.5 text-sm"
            >
              {AFTER_PARTY_EVENTS.map(ev => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs">
            <span className="font-bold text-ink">Public venue + address</span>
            <input
              type="text"
              value={submitLocation}
              onChange={e => setSubmitLocation(e.target.value)}
              placeholder="e.g. Stubbs, 801 Red River St"
              required
              className="mt-1 w-full rounded-md border border-hairline bg-white px-2 py-1.5 text-sm"
            />
          </label>
          <p className="text-[11px] text-ink-light">
            Submissions go to our moderation queue. No personal addresses.
          </p>
          <button
            type="submit"
            disabled={!submitLocation.trim()}
            className="rounded-md bg-teal px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Send to moderators
          </button>
        </form>
      )}

      {submitted && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-teal/30 bg-teal-light px-3 py-2 text-sm text-teal"
        >
          Thanks — it&apos;s in our moderation queue. ✝️
        </p>
      )}

      {visible.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-light">
          No public after-parties listed yet for {tab}.
        </p>
      ) : (
        <ul className="grid gap-3">
          {visible.map(party => (
            <li
              key={party.id}
              className="rounded-xl border border-hairline bg-cream p-4"
            >
              <div className="mb-1 flex items-start justify-between gap-3">
                <div className="font-display text-sm font-bold text-ink">
                  {party.venueName}
                </div>
                <span className="shrink-0 text-xs text-ink-light">{party.time}</span>
              </div>
              <div className="mb-2 text-[11px] text-ink-light">
                <span aria-hidden>📍</span> {party.neighborhood} · {party.price}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-ink-mid">{party.description}</p>
              <div className="flex gap-2">
                <a
                  href={party.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100"
                >
                  🗺️ Google Maps
                </a>
                <a
                  href={party.appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-200"
                >
                  🍎 Apple Maps
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
