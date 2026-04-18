'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { QuePasaPhoto } from '@/lib/types';
import { usePrefersReducedMotion } from '@/lib/hooks';

interface QuePasaCarouselProps {
  photos: QuePasaPhoto[];
  onSubmitClick: () => void;
  className?: string;
}

const AUTO_MS = 4000;
const SWIPE_THRESHOLD = 40;

export function QuePasaCarousel({ photos, onSubmitClick, className }: QuePasaCarouselProps) {
  const [idx, setIdx] = useState(0);
  const reduced = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startX = useRef<number | null>(null);

  const advance = (dir: 1 | -1) => {
    setIdx(i => (i + dir + photos.length) % photos.length);
  };

  useEffect(() => {
    if (reduced) return;
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % photos.length);
    }, AUTO_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [photos.length, reduced]);

  const resetTimer = () => {
    if (reduced) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIdx(i => (i + 1) % photos.length), AUTO_MS);
  };

  const photo = photos[idx];

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      advance(delta < 0 ? 1 : -1);
      resetTimer();
    }
    startX.current = null;
  };

  return (
    <section
      aria-label="¿Que Pasa, Austin? real photos from locals"
      className={clsx(
        'overflow-hidden rounded-2xl border border-hairline bg-white shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b-[3px] border-navy px-4 py-3">
        <span aria-hidden className="text-2xl">📸</span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-extrabold text-ink">¿Que Pasa, Austin?</div>
          <div className="text-[11px] text-ink-light">Real people. Real nights. Real Austin.</div>
        </div>
        <span className="text-[11px] font-semibold text-ink-light" aria-live="polite">
          {idx + 1} / {photos.length}
        </span>
      </div>

      <div
        className="relative aspect-[4/3] w-full touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={photo.id}
          src={photo.photoUrl}
          alt={`${photo.caption} — posted by ${photo.username} at ${photo.venueName}`}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          priority={idx === 0}
          className="object-cover [animation:raln-fade-in_0.5s_ease] motion-reduce:animate-none"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-white">
          <p className="text-sm font-semibold">{photo.caption}</p>
          <p className="mt-0.5 text-[11px] text-white/80">
            {photo.username} · <span aria-hidden>📍</span> {photo.venueName}
          </p>
        </div>

        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => {
            advance(-1);
            resetTimer();
          }}
          className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-base shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => {
            advance(1);
            resetTimer();
          }}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg bg-white/90 text-base shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          <span aria-hidden>→</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex gap-2">
          <a
            href={photo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100"
          >
            🗺️ Google Maps
          </a>
          <a
            href={photo.appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:bg-gray-200"
          >
            🍎 Apple Maps
          </a>
        </div>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Photo indicators">
          {photos.map((p, i) => (
            <button
              type="button"
              key={p.id}
              role="tab"
              aria-selected={i === idx}
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => {
                setIdx(i);
                resetTimer();
              }}
              className={clsx(
                'h-1.5 rounded-full transition-[width]',
                i === idx ? 'w-4 bg-teal' : 'w-1.5 bg-hairline',
              )}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-hairline bg-cream px-4 py-3 text-center">
        <button
          type="button"
          onClick={onSubmitClick}
          className="rounded-lg bg-teal px-5 py-2 font-display text-xs font-bold text-white shadow hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Submit your photo 📸
        </button>
        <p className="mt-1.5 text-[10px] text-ink-light">
          Verified AustinNights only. All photos moderated before going live.
        </p>
      </div>
    </section>
  );
}
