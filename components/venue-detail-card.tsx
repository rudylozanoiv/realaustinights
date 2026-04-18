import Image from 'next/image';
import clsx from 'clsx';
import type { FeedCard } from '@/lib/types';
import { UBER_ENABLED } from '@/lib/flags';
import { FeaturedPartnerBadge, FoundingPartnerBadge } from './ui/badges';
import { VerifiedBadge } from './ui/verified-badge';

interface VenueDetailCardProps {
  venue: FeedCard;
  onClose?: () => void;
  onSignInRequired?: () => void;
  isAustinights?: boolean;
  /** Show the header bar with "← Back". Defaults to true when onClose is set. */
  showHeader?: boolean;
  className?: string;
}

export function VenueDetailCard({
  venue,
  onClose,
  onSignInRequired,
  isAustinights = false,
  showHeader,
  className,
}: VenueDetailCardProps) {
  const headerVisible = showHeader ?? !!onClose;
  return (
    <article
      aria-labelledby={`venue-${venue.id}-title`}
      className={clsx(
        'flex h-full w-full flex-col overflow-hidden bg-white',
        className,
      )}
    >
      {headerVisible && (
        <div className="flex items-center justify-between border-b border-hairline bg-white/90 px-4 py-3 backdrop-blur">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close venue details"
              className="rounded-lg bg-cream px-3 py-1.5 text-sm font-semibold text-ink-mid hover:bg-teal-light"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          <span className="text-[11px] uppercase tracking-wide text-ink-light">
            Venue Details
          </span>
        </div>
      )}

      <div className="relative aspect-video w-full bg-hairline/40">
        <Image
          src={venue.image}
          alt={`${venue.venueName} — ${venue.neighborhood}`}
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id={`venue-${venue.id}-title`}
            className="font-display text-xl font-extrabold text-ink md:text-2xl"
          >
            {venue.venueName}
          </h2>
          {venue.verifiedOnly && <VerifiedBadge />}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {venue.isFoundingPartner && <FoundingPartnerBadge />}
          {venue.isFeaturedPartner && <FeaturedPartnerBadge />}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-mid">{venue.description}</p>

        <dl className="mt-5 space-y-1.5 text-sm text-ink-mid">
          <div className="flex gap-2">
            <dt className="sr-only">Address</dt>
            <dd aria-hidden>📍</dd>
            <dd>{venue.address}</dd>
          </div>
          {venue.time && (
            <div className="flex gap-2">
              <dt className="sr-only">Hours</dt>
              <dd aria-hidden>🕐</dd>
              <dd>{venue.time}</dd>
            </div>
          )}
          {venue.price && (
            <div className="flex gap-2">
              <dt className="sr-only">Price</dt>
              <dd aria-hidden>💸</dd>
              <dd>{venue.price}</dd>
            </div>
          )}
          <div className="flex gap-2">
            <dt className="sr-only">Pet policy</dt>
            <dd aria-hidden>🐾</dd>
            <dd>{venue.petFriendly ? 'Pet friendly — leash on!' : 'No pets, sorry'}</dd>
          </div>
        </dl>

        {venue.verifiedOnly && !isAustinights && (
          <div className="mt-4 rounded-lg bg-sky-100 px-3 py-2.5 text-xs text-sky-700">
            ✓ Reviews &amp; comments are for verified AustiNights only.
            {onSignInRequired && (
              <button
                type="button"
                onClick={onSignInRequired}
                className="ml-1 font-bold underline"
              >
                Sign in →
              </button>
            )}
          </div>
        )}

        {UBER_ENABLED && (
          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-orange px-4 py-3.5 font-display text-sm font-bold text-white shadow hover:brightness-110"
          >
            Get a Ride Here 🚗
          </button>
        )}

        <div className="mt-4 flex justify-center gap-5 text-xs text-ink-light">
          <span aria-label={`${venue.likes} likes`}>
            <span aria-hidden>❤️</span> {venue.likes}
          </span>
          <span aria-label={`${venue.comments} comments`}>
            <span aria-hidden>💬</span> {venue.comments}
          </span>
        </div>
      </div>
    </article>
  );
}
