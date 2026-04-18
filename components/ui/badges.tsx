import clsx from 'clsx';

/** Navy pill for Founding Partner venues. */
export function FoundingPartnerBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md bg-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow',
        className,
      )}
    >
      Founding Partner
    </span>
  );
}

/**
 * Pink Featured Partner pill — PINK IS SACRED.
 * Allowed uses: paying partners only. Always visible on partner cards.
 */
export function FeaturedPartnerBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md bg-pink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow',
        className,
      )}
    >
      ★ Featured Partner
    </span>
  );
}

export function HiddenGemBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md bg-orange/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow',
        className,
      )}
    >
      <span aria-hidden>✨</span> Hidden Gem
    </span>
  );
}

export function PetFriendlyPill({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md bg-white/95 px-2 py-1 text-[10px] font-bold text-teal shadow',
        className,
      )}
    >
      🐾 Pet Friendly
    </span>
  );
}

export function SponsoredBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md bg-orange/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white',
        className,
      )}
    >
      Recommendation
    </span>
  );
}
