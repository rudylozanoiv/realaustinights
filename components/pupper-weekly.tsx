'use client';

import Image from 'next/image';
import clsx from 'clsx';
import type { ZetaPost } from '@/lib/types';
import { FeaturedPartnerBadge } from './ui/badges';

interface PupperWeeklyProps {
  hero: ZetaPost;
  gallery?: { id: string; photoUrl: string; name: string; venue: string }[];
  onSubmitClick: () => void;
  className?: string;
}

const DEFAULT_GALLERY = [
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
        {/* Pupper Weekly highlight — one of the four sacred pink uses. */}
        <span className="rounded-md bg-pink px-2.5 py-1 font-display text-[10px] font-bold uppercase text-white">
          Barkingham Place
        </span>
      </div>

      {/* Hero */}
      <article className="grid gap-4 px-4 py-4 md:grid-cols-[220px_1fr] md:items-center md:px-5">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white md:h-[180px]">
          <Image
            src={hero.photoUrl}
            alt={`${hero.caption} at ${hero.venue}`}
            fill
            sizes="(max-width: 768px) 100vw, 220px"
            className="object-cover"
          />
        </div>
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

      {/* Gallery */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4 md:grid-cols-3 md:px-5">
        {gallery.map(p => (
          <figure key={p.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="relative aspect-square w-full">
              <Image
                src={p.photoUrl}
                alt={`${p.name} at ${p.venue}`}
                fill
                sizes="(max-width: 768px) 50vw, 200px"
                className="object-cover"
              />
            </div>
            <figcaption className="px-3 py-2">
              <div className="font-display text-sm font-bold text-ink">{p.name}</div>
              <div className="text-[11px] text-teal">@ {p.venue}</div>
            </figcaption>
          </figure>
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
