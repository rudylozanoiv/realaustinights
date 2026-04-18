'use client';

import Image from 'next/image';
import clsx from 'clsx';
import type { FeedCard as FeedCardData } from '@/lib/types';
import { UBER_ENABLED } from '@/lib/flags';
import {
  FeaturedPartnerBadge,
  FoundingPartnerBadge,
  HiddenGemBadge,
  PetFriendlyPill,
} from './ui/badges';
import { VerifiedBadge } from './ui/verified-badge';

interface FeedCardProps {
  card: FeedCardData;
  onViewDetails: (card: FeedCardData) => void;
  onRideClick?: (card: FeedCardData) => void;
}

export function FeedCard({ card, onViewDetails, onRideClick }: FeedCardProps) {
  return (
    <article
      className={clsx(
        'group mb-4 overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:hover:translate-y-0',
        card.isFoundingPartner && 'bg-amber-50/40',
      )}
      aria-labelledby={`feed-${card.id}-title`}
    >
      <div className="relative aspect-video w-full bg-hairline/40">
        <Image
          src={card.image}
          alt={`${card.venueName} — ${card.neighborhood}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 600px"
          loading="lazy"
          className="object-cover"
        />
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          {card.isFoundingPartner && <FoundingPartnerBadge />}
          {card.isFeaturedPartner && <FeaturedPartnerBadge />}
          {card.isHiddenGem && <HiddenGemBadge />}
          {card.petFriendly && <PetFriendlyPill />}
        </div>
      </div>

      <div className="px-4 py-4 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            id={`feed-${card.id}-title`}
            className="font-display text-base font-extrabold text-ink md:text-lg"
          >
            {card.venueName}
          </h3>
          {card.verifiedOnly && <VerifiedBadge size="xs" />}
        </div>
        <p className="mt-0.5 text-xs text-ink-light">
          {card.neighborhood}
          {card.time && <> · {card.time}</>}
          {card.price && <> · {card.price}</>}
        </p>
        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-mid">
          {card.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Vibes">
            {card.vibeTags.slice(0, 3).map(v => (
              <li
                key={v}
                className="rounded-md bg-cream px-2 py-1 text-[11px] font-medium text-ink-mid"
              >
                {v}
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 gap-3 text-xs text-ink-light">
            <span aria-label={`${card.likes} likes`}>
              <span aria-hidden>❤️</span> {card.likes}
            </span>
            <span aria-label={`${card.comments} comments`}>
              <span aria-hidden>💬</span> {card.comments}
            </span>
          </div>
        </div>

        {card.verifiedOnly && (
          <p className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-sky-100 px-2.5 py-1 text-[11px] text-sky-700">
            ✓ Reviews &amp; comments for verified AustiNites only
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(card)}
            aria-label={`View details for ${card.venueName}`}
            className="rounded-lg bg-teal px-5 py-2 font-display text-xs font-bold text-white shadow-sm hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            View Details
          </button>
          {UBER_ENABLED && (
            <button
              type="button"
              onClick={() => onRideClick?.(card)}
              aria-label={`Get a ride to ${card.venueName}`}
              className="rounded-lg border-[1.5px] border-teal px-5 py-2 font-display text-xs font-semibold text-teal hover:bg-teal/5"
            >
              Get a Ride 🚗
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
