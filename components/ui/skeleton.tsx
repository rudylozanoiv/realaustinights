import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx(
        'animate-pulse rounded-md bg-hairline/50 motion-reduce:animate-none',
        className,
      )}
    />
  );
}

/** Feed card shaped placeholder. Use inside the main feed while venues load. */
export function FeedCardSkeleton() {
  return (
    <div
      aria-hidden
      className="mb-4 overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm"
    >
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

/** Photo carousel placeholder matching QuePasaCarousel geometry. */
export function QuePasaSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm"
    >
      <Skeleton className="h-12 w-full rounded-none" />
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function ComedySkeleton() {
  return (
    <div aria-hidden className="rounded-2xl border border-hairline bg-white p-5 shadow-sm">
      <Skeleton className="h-6 w-40" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-xl border border-hairline bg-cream p-3">
            <Skeleton className="h-20 w-24 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
