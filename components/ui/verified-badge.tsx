import clsx from 'clsx';

export function VerifiedBadge({
  size = 'sm',
  className,
}: {
  size?: 'xs' | 'sm';
  className?: string;
}) {
  return (
    <span
      title="Verified AustinNights — reviews and comments are from verified users only"
      aria-label="Verified AustinNights"
      className={clsx(
        'inline-flex items-center gap-1 rounded-md bg-sky-100 font-bold text-sky-700',
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        className,
      )}
    >
      <span aria-hidden>✓</span> Verified
    </span>
  );
}
