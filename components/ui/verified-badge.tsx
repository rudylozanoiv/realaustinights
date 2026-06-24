import clsx from 'clsx';

export function VerifiedBadge({
  size = 'sm',
  className,
}: {
  size?: 'xs' | 'sm';
  className?: string;
}) {
  return (
    // HONESTY SWEEP 2026-06-24: reworded "Verified" -> "Verified members" so it reads as the
    // members feature (verified USERS), not a venue-verification claim. Still gated on verifiedOnly.
    <span
      title="Verified members — reviews and comments are from verified AustiNights members only"
      aria-label="Verified members only"
      className={clsx(
        'inline-flex items-center gap-1 rounded-md bg-sky-100 font-bold text-sky-700',
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        className,
      )}
    >
      <span aria-hidden>✓</span> Verified members
    </span>
  );
}
