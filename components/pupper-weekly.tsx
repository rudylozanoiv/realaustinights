'use client';

import Image from 'next/image';
import clsx from 'clsx';
import type { ZetaPost } from '@/lib/types';
import { FeaturedPartnerBadge } from './ui/badges';

export interface PupperGalleryItem {
  id: string;
  photoUrl: string;
  name: string;
  venue: string;
}

interface PupperWeeklyProps {
  hero: ZetaPost;
  gallery?: PupperGalleryItem[];
  onSubmitClick: () => void;
  onPhotoClick?: (index: number) => void;
  onBarkinghamClick?: () => void;
  className?: string;
}

// TODO: Replace with Rudy-supplied Zeta + Barkingham pup photos at go-live.
const DEFAULT_GALLERY: PupperGalleryItem[] = [
  {
    id: 'p-max',
    photoUrl: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80',
    name: 'Max the Golden',
    venue: 'Zilker Park',
  },
  {
    id: 'p-luna',
    photoUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80',
    name: 'Luna',
    venue: 'Lady Bird Lake',
  },
];

export function PupperWeekly({
  hero,
  gallery = DEFAULT_GALLERY,
  onSubmitClick,
  onPhotoClick,
  onBarkinghamClick,
  className,
}: PupperWeeklyProps) {
  return (
    <section
      aria-label="Pupper Weekly"
      className={clsx(
        'overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-teal-light to-orange-light shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-white/70 px-4 py-3 backdrop-blur">
        <div>
          <h2 className="font-display text-base font-extrabold text-ink md:text-lg">
            Pupper Weekly <span aria-hidden>🐾</span>
          </h2>
          <p className="text-[11px] text-ink-light">Austin&apos;s cutest pups.</p>
        </div>
        {/* Pupper Weekly highlight — one of the four sacred pink uses. Tappable → Barkingham venue detail.
            z-10 + min-h 44px so the pill sits above the backdrop-blur parent and meets iOS touch target min. */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onBarkinghamClick?.();
          }}
          aria-label="Open Barkingham Place venue details"
          className="relative z-10 shrink-0 rounded-full bg-pink px-3 py-2.5 font-display text-[11px] font-bold uppercase text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink"
          style={{ minHeight: 44 }}
        >
          Barkingham Place →
        </button>
      </div>

      {/* Hero — image is tappable to open fullscreen viewer. */}
      <article className="grid gap-4 px-4 py-4 md:grid-cols-[220px_1fr] md:items-center md:px-5">
        <button
          type="button"
          onClick={() => onPhotoClick?.(0)}
          aria-label={`Open fullscreen photo of Zeta at ${hero.venue}`}
          className="relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal md:h-[180px]"
        >
          <Image
            src={hero.photoUrl}
            alt={`${hero.caption} at ${hero.venue}`}
            fill
            sizes="(max-width: 768px) 100vw, 220px"
            className="object-cover"
          />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-extrabold text-ink">
              Zeta at {hero.venue}
            </h3>
            <FeaturedPartnerBadge />
          </div>
          <p className="mt-1 text-xs text-ink-light">{hero.week}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-mid">{hero.caption}</p>
        </div>
      </article>

      {/* Gallery — each image tappable. Hero is index 0; gallery items follow. */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4 md:grid-cols-3 md:px-5">
        {gallery.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPhotoClick?.(i + 1)}
            aria-label={`Open fullscreen photo of ${p.name} at ${p.venue}`}
            className="group overflow-hidden rounded-xl bg-white text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={p.photoUrl}
                alt={`${p.name} at ${p.venue}`}
                fill
                sizes="(max-width: 768px) 50vw, 200px"
                className="object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            </div>
            <div className="px-3 py-2">
              <div className="font-display text-sm font-bold text-ink">{p.name}</div>
              <div className="text-[11px] text-teal">@ {p.venue}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-hairline bg-white/50 px-4 py-3 text-center backdrop-blur">
        <button
          type="button"
          onClick={onSubmitClick}
          className="rounded-lg bg-orange px-5 py-2 font-display text-xs font-bold text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          Submit your pup
        </button>
      </div>
    </section>
  );
}
